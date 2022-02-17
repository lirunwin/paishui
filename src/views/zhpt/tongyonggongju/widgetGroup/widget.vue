<template>
  <div id="widgetGroup">
    <div class="widgetGroupButtoms" title="框选放大" @click="zoomDraw('in')">
      <img src="./images/zoomIn.png">
    </div>
    <div class="widgetGroupButtoms" style="margin-bottom: 5px" title="框选缩小" @click="zoomDraw('out')">
      <img src="./images/zoomOut.png">
    </div>
    <div class="widgetGroupButtoms" style="margin-bottom: 5px" title="初始位置" @click="extentAll">
      <img src="./images/firstPage.png">
    </div>
    <!-- <div ref="loadTag" style="width:10px;height:10px;background:#f00;border-radius:50%;position:absolute;top:-15px;"></div> -->
  </div>
</template>
<script>
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import zoomIn from "./images/zoomIn.png";
import zoomOut from "./images/zoomOut.png";
export default {
  name: 'WidgetGroup',
  components: {},
  props: {
    mapView: { type: Object, default: () => [] },
    that: { type: Object, default: () => [] }
  },
  data() {
    return {
      test: 0,
      isLoaded: false,
      allExtent: undefined,
      graphicsLayer: undefined,
      draw: undefined
    }
  },
  watch: {
    mapView: {
      handler(e) {
        if (this.isLoaded || (this.mapView && !this.isLoaded)) { this.isLoaded = true } else return
        var that = this
        loadModules(
          ['esri/layers/GraphicsLayer', 'esri/views/draw/Draw', 'esri/Graphic', 'esri/views/MapView', 'esri/layers/FeatureLayer'],
          { url: esriConfig.baseUrl }
        ).then(([GraphicsLayer, Draw, Graphic, MapView, FeatureLayer]) => {
          var mapViewD = that.mapView          
          mapViewD.container.style.overflow = 'hidden'
          that.allExtent = [e.center, e.zoom]
          that.graphicsLayer = new GraphicsLayer({id: 'tool'})
          mapViewD.map.add(that.graphicsLayer)          
          that.Graphic = Graphic
          mapViewD.TF_draw = that.graphicsLayer.TF_draw = that.draw = new Draw({ view: mapViewD })
          mapViewD.TF_graphic = that.graphicsLayer.TF_graphic = Graphic
          mapViewD.TF_mapView = MapView
          mapViewD.TF_featureLayer = FeatureLayer
          mapViewD.TF_graphicsLayer = GraphicsLayer
          mapViewD.TF_drawRect = that.graphicsLayer.TF_drawRect = (start, add, move, end) => {
            that.graphicsLayer.removeAll()
            var action = that.draw.create('rectangle')
            start()
            action.on('vertex-add', (evt) => add(evt, action))
            action.on('cursor-update', (evt) => move(evt, action))
            action.on('draw-complete', (evt) => end(evt, action))
            return action
          }

          mapViewD.TF_drawPolygon = that.graphicsLayer.TF_drawPolygon = (start, add, move, end) => {
            that.graphicsLayer.removeAll()
            var action = that.draw.create('polyline', {mode: "click"})
            start()
            action.on('vertex-add', (evt) => add(evt, action))
            action.on('cursor-update', (evt) => move(evt, action))
            action.on('draw-complete', (evt) => end(evt, action))
            return action
          }

          mapViewD.TF_printToJson = (mapView, extent, scale, title, author, company) => {
            var result = {
                "mapOptions": {
                    "extent": extent.toJSON(),
                    "spatialReference": mapView.spatialReference.toJSON(),
                    "scale": scale
                },
                "operationalLayers": [],
                "exportOptions": {},
                "layoutOptions": {
                    "titleText": title,
                    "authorText": author,
                    "copyrightText": company,
                    "customTextElements": [{ "company": company }],
                    "scaleBarOptions": {
                        "metricUnit": "esriMeters ",
                        "metricLabel": "米",
                        "nonMetricUnit": "esriMiles",
                        "nonMetricLabel": "mi"
                    },
                }
            };
            var returnLayers = result['operationalLayers']
            for(let i=0,il=mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++){
              var layer = il[i]
              if(layer.url && layer.visible) {
                var layerInfo = {
                  "id": undefined,
                  "title": layer.title,
                  "opacity": layer.opacity,
                  "minScale": layer.minScale,
                  "maxScale": layer.maxScale,
                  "url": layer.url,
                  "token": layer.token,
                  "layers": []
                }
                var subLayers = layer.allSublayers
                for(let j=0,jl=subLayers.items,jj=jl.length;j<jj;j++){
                  var subLayer = jl[j]
                  var inLayerIds
                  var pId
                  if(subLayer.sublayers) {
                    inLayerIds = []
                    pId = -1
                    for(let k=0,kl = subLayer.sublayers.items,kk=kl.length;k<kk;k++) {
                      inLayerIds.push(kl[k].id)
                    }
                  }
                  else {
                    pId = subLayer.parent.id
                    if(pId == layer.id) pId = -1
                    inLayerIds = null
                  }
                  layerInfo.layers.push({
                    "id": subLayer.id,
                    "minScale": subLayer.minScale,
                    "maxScale": subLayer.maxScale,
                    "parentLayerId": pId,
                    "layerDefinition": {
                        "source": {
                            "mapLayerId": subLayer.id,
                            "type": "mapLayer"
                        }
                    },
                    "subLayerIds": inLayerIds,
                    "name": subLayer.title,
                    "defaultVisibility": subLayer.visible
                  })
                }
                returnLayers.push(layerInfo)
              }
            }
            return result
          }
          this.that.loading = false
          // that.$refs.loadTag.style.background = '#0f0'
        })
      }
    }
  },
  methods: {
    extentAll: function() {
      this.mapView.goTo({
        center: this.allExtent[0],
        zoom: this.allExtent[1]
      })
    },
    zoomDraw: function(zoom) {
      var that = this
      var inputPolygon
      var cache = this.mapView.container.style.cursor
      this.graphicsLayer.TF_drawRect(() => {that.mapView.container.style.cursor = zoom=="in"?"url("+zoomIn+"),auto":"url("+zoomOut+"),auto";},//'crosshair'},
      (evt) => {
        var vertices = evt.vertices
        if (vertices.length < 2) {
          inputPolygon = new that.Graphic({
            geometry: { type: 'polygon', rings: [[vertices[0]]], spatialReference: that.mapView.spatialReference },
            symbol: { type: "simple-fill", color: [245, 108, 108, 0.2], outline: { color: [245, 108, 108], width: "2px" }}
          })
          that.graphicsLayer.add(inputPolygon)
        }
      }, (evt) => {
        var v = evt.vertices
        if (inputPolygon) 
          inputPolygon.geometry = {
            type: 'polygon',
            rings: [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]],
            spatialReference: that.mapView.spatialReference
          } 
      }, (evt, action) => {
        var v = inputPolygon.geometry.extent
        switch (zoom) {
          case 'in':
            that.mapView.goTo(v)
            break
          case 'out':
            that.mapView.goTo({
              center: v.center,
              scale: that.mapView.scale * Math.min(that.mapView.extent.width / v.width, that.mapView.extent.height / v.height)
            })
            break
        }
        that.mapView.container.style.cursor = cache
        that.graphicsLayer.removeAll()
        action = undefined
      })      
    }
  }
}
</script>
<style type="scss" scoped>
i {
  font-weight: bold;
  transition: 0.2s;
}
#widgetGroup {
  position: absolute;
  right: 10px;
  bottom: 35px;
}
</style>
<style>
.esri-popup__main-container {
  max-height: 800px !important;
}

.widgetGroupButtoms {
  width: 30px;
  height: 30px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  background: #fff;
  line-height: 30px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.widgetGroupButtoms:hover {
  background: #eee;
}
.widgetGroupButtoms img {
  filter: grayscale(100%) drop-shadow(0px 0px 0px rgb(45,116,231));
  transition: 0.4s;
}
.widgetGroupButtoms:hover img {
  filter:grayscale(0%) drop-shadow(0px 0px 1px rgb(45,116,231));
}
.title2 {
  font-size: 14px;
}
.mapTable .el-table__header-wrapper table th{
  color: #606266;
  background: #e1f0fd;
}
.mapTable .el-table__fixed-right table th:not(.is-hidden){
  color: #606266;
  background: #e1f0fd;
}
.mapTable .el-table__body-wrapper tbody tr.analysis_brokenButton{
  background: oldlace;
}
.helpInput input[type="text"]{
   border-radius: 4px 0px 0px 4px;
}
.sqlQueryUl {
  list-style-type: none;
  padding: 2px;
  margin: 0px;
  font-size: 14px;
  border: 1px solid #ccc;
  overflow-x: hidden;
  overflow-y: auto;
}
.sqlQueryUl li {
  margin: 2px 0;
  cursor: pointer;
}
.sqlQueryUl li:hover {
  background: rgb(30, 144, 255);
  color: #fff;
}
.sqlQueryUl .none {
  color: #C0C4CC;
  letter-spacing: 1px;
  margin-left: 5px;
}
.spanTitle {
  clear: both;
  margin-top: 3px;
  margin-bottom: 5px;
  font-size: 14px;
}
.titleS {
  color: #606266;
}
.circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
  transform: translateY(3px);
}
.text {
  line-height: 18px;
  margin-left: 4px;
}
.selectRowC {
  cursor: pointer;
}
#player {  
  animation:mymove 0.4s;
}

@keyframes mymove
{
  0% {
    opacity: 0;
    bottom: 0;
  }
  100% {
    opacity: 1;
    bottom: 80px;
  }
}


#graphContainer {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: default;
}
.underSvg {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0%;
  top: 0%;
}
.underSvg div {
  position: absolute;
  background: rgb(33,61,81);
  border: 2px solid rgb(53,88,112);
}

.graph .underSvg span {
  position: absolute;
  left: 50%;
  white-space: nowrap;
  color: #8ac9fb;
}

.graph .underSvg .onText {
  transform: translate(-50%, -100%);
  top: -2%;
}

.onSvg {
  z-index: 3;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0%;
  top: 0%;
  color: #eee;
}
.graph svg {
  z-index: 2;
  position: absolute;
}
.graph .img {
  position: absolute;
  background-size: 100% 100%;
  font-size: 17px;
  letter-spacing: 2px;
  font-weight: bold;
}
.graph .img span {
  position: absolute;
  left: 50%;
  white-space: nowrap;
  color: #8ac9fb;
  padding: 0 5px;
}
.graph .img .unText {
  transform: translate(-50%, 100%);
  bottom: -2%;
}
.graph .text ul {
  position: absolute;
  list-style: none;
  padding: 0px;
  margin: 0px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1;
}

.graph .text ul li{
  margin-bottom: 3px;
  cursor: pointer;
  position: relative;
}

.graph .text ul li::before{
  content: "";
  position: absolute;
  display: block;
  height: 1px;
  left: 1px;
  width: 0;
  bottom: -1px;
  background: #21b7f6;
  transition: 0.4s;
}
.graph .text ul li:hover::before{
  width: calc(100% + 2px);
}
.graph .text ul li:nth-last-child(1) {
  margin-bottom: 0px;
}
.graph .text ul li div:nth-child(2) span:nth-child(1) {
  text-align: right;
}
.graph .text ul li .title {
  font-size: 13px;
  letter-spacing: 1px;
  position: absolute;
  left: 0;
  transform: translateX(-100%);
}
.graph .text ul li .title span {
  font-weight: bold;
}
.graph .text ul li .title span::before{
  content: "";
  position: absolute;
  display: block;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgb(73, 167, 239);
  width: 0;
  transition: 0.3s;
}
.graph .text ul li:hover .title span::before{
  width: calc(100% - 3px);
}
.graph .text ul li .title2 {
  font-size: 13px;
  letter-spacing: 1px;
  text-align: right;
}
.graph .text ul li .title2 span {
  color: #eee;
  font-weight: bold;
}
.graph .text ul li .title2 span::before{
  content: "";
  position: absolute;
  display: block;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgb(73, 167, 239);
  width: 0;
  transition: 0.3s;
}
.graph .text ul li:hover .title2 span::before{
  width: calc(100% - 3px);
}
.graph .text ul li .value {
  font-weight: bold;
  display: inline-block;
  padding-right: 5px;
  /* width: 40px; */
  text-align: right;
}
.graph .text ul li .unit {
  width: 15px;
}
.graph .text div.inPic {
  position: absolute;
  font-size: 12px;
  z-index: 2;
  font-weight: bold;
  text-shadow: 1px 0px 1px #000, -1px 0px 1px #000, 0px 1px 1px #000, 0px -1px 1px #000;
}
.graph .flowBack {
  /* stroke-width: 1px; */
  stroke-width: 6px;
  stroke: rgb(114,169,212);
  stroke-linejoin: round;
  stroke-linecap: round;
}
.graph .flow {
  stroke-width: 4px;
  stroke-dasharray: 5, 12;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: dash 0.8s linear;
  animation-iteration-count: infinite;
}
.graph .flowN {
  stroke-width: 4px;
  stroke-dasharray: 5, 12;
  stroke-linecap: round;
  stroke-linejoin: round;
} 
@keyframes dash {
  to {stroke-dashoffset: -17;}
} 

.graph .img .onWhiteText {
  transform: translate(-50%, -100%);
  top: -2%;
  color: #fff;
}
.graph .img .unWhiteText {
  transform: translate(-50%, 100%);
  bottom: -5%;
  color: #fff;
}
.graph .img .unJiaYaWhiteText {
  transform: translate(-50%, 0);
  bottom: -85px;
  color: #fff;
}

.graph .img .shuiku {
  transform: translate(-50%, 0);
  bottom: 2%;
  color: rgb(4,30,48);
}
.graph .img .qushui {
  transform: translate(-200%, 0);
  bottom: 4px;
  color: #fff;
  left: -6px;
  width: 0;
  white-space: normal;
}
</style>
