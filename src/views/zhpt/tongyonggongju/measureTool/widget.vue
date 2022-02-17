<template>
  <div style="position: absolute; right: 10px; top: 20px;">
    <div class="toolPar" style="float: left" title="图层管理">
      <div class="widgetGroupButtoms" @click="showLayer">
        <img src="./images/tucengkongzhi.png">
      </div>
    </div>
    <div class="toolPar" style="float: left" title="空间测量">
      <div class="widgetGroupButtoms">
        <img src="./images/measure.png">
      </div>
      <div style="padding-top: 5px; position: absolute; width: 100px; transform: translateX(calc(-50% + 15px));">
        <div class="tool" @click="line">距  离</div>
        <div class="tool" @click="poly">面  积</div>
        <div class="tool" @click="angle">角  度</div>
        <div class="tool" @click="dem">高  程</div>
      </div>
    </div>
    <div class="toolPar" style="float: left" title="清除绘制">
      <div class="widgetGroupButtoms" @click="clearDraw">
        <img src="./images/clear.png">
      </div>
    </div>
  </div>
</template>
<script>
import proj4 from "@/components/proj4/index";
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'MeasureTool',
  components: {},
  props: {
    mapView: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      panel: {
        pathId: 'layerManagement',
        widgetid: 'Panel',
        label: '图层管理'
      }
    }
  },
  watch: {
    mapView: {
      handler(e) {
        loadModules(
          ['esri/geometry/geometryEngine'], { url: esriConfig.baseUrl }
        ).then(([GeometryEngine]) => {
          this.GeometryEngine = GeometryEngine
        })
      }
    }
  },
  methods: {
    line: function() {
      var mapView = this.mapView
      var mapdiv = mapView.container
      var draw = mapView.TF_draw
      var layer = mapView.graphics
      var graphic = mapView.TF_graphic
      var sp = mapView.spatialReference
      var ge = this.GeometryEngine
      let distanceLine, distanceLinePoint
      var lastSencndV, lastSencndV2Proj4
      var allLength = 0
      if(draw.activeAction) draw.reset()
      mapView.TF_drawPolygon(() => {mapdiv.style.cursor = 'crosshair'},
        (evt) => {
          var v = evt.vertices
          var lastV = v[v.length - 1]
          layer.add(new graphic({
            isMeaTool: true,
            geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp },
            symbol: { type: 'simple-marker', color: [255, 255, 255], size: 4, outline: { color: [245, 108, 108], width: 1 } }
          }))
          var nextPoint = new graphic({
            isMeaTool: true,
            geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp }            
          })
          if(v.length > 1) {
            var lastV2Proj4 = proj4('EPSG:4490', 'EPSG:4544', v[v.length - 1])
            var dx = lastV2Proj4[0] - lastSencndV2Proj4[0]
            var dy = lastV2Proj4[1] - lastSencndV2Proj4[1]
            allLength += Math.sqrt(dx * dx + dy * dy)
            nextPoint.symbol = { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: allLength.toFixed(2) + 'm', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px'} }
          }
          else {
            nextPoint.symbol = { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '起点', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px'} }
            layer.add(distanceLine = new graphic({
              isMeaTool: true,
              geometry: { type: 'polyline', paths:[[lastV]], spatialReference: sp },
              symbol: { type: 'simple-line', color: [245, 108, 108], cap: 'square', width: "2px"  }
            }))
            layer.add(distanceLinePoint = new graphic({
              isMeaTool: true,
              geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp },
              symbol: { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '起点', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px', weight: 'bold'} }
            }))
          }
          lastSencndV = v[v.length - 1]
          lastSencndV2Proj4 = proj4('EPSG:4490', 'EPSG:4544', lastSencndV)
          layer.add(nextPoint)
        }, (evt) => {         
          var v = evt.vertices 
          if(v.length > 1) {
            var lastV = v[v.length - 1]
            var lastV2Proj4 = proj4('EPSG:4490', 'EPSG:4544', lastV)
            var dx = lastV2Proj4[0] - lastSencndV2Proj4[0]
            var dy = lastV2Proj4[1] - lastSencndV2Proj4[1]
            var length = Math.sqrt(dx * dx + dy * dy)
            distanceLine.geometry = { type: 'polyline', paths:v, spatialReference: sp }
            distanceLinePoint.geometry = { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp }
            distanceLinePoint.symbol = { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '总长度：' + (allLength + length).toFixed(2) + 'm', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px'} }
          }
        }, () => {
          layer.remove(distanceLinePoint)
          mapdiv.style.cursor = ''
      })
    },
    poly: function() {
      var mapView = this.mapView
      var mapdiv = mapView.container
      var draw = mapView.TF_draw
      var layer = mapView.graphics
      var graphic = mapView.TF_graphic
      var sp = mapView.spatialReference
      var ge = this.GeometryEngine
      var allPoint = []
      let mesPolygon
      let mesPolygonText
      let mesPolygonProj4
      if(draw.activeAction) draw.reset()
      mapView.TF_drawPolygon(() => {mapdiv.style.cursor = 'crosshair'},
        (evt) => {
          var v = evt.vertices
          var lastV = v[v.length - 1]
          var lastPoint = proj4('EPSG:4490', 'EPSG:4544', lastV)
          allPoint.push(lastPoint)
          if(v.length < 2) {
            layer.addMany([mesPolygon = new graphic({
              isMeaTool: true,
              geometry: { type: 'polygon', rings:[[lastV]], spatialReference: sp },
              symbol: { type: "simple-fill", color: [245, 108, 108, 0.3], outline: { color: [245, 108, 108], width: "2px" }
              }
            }), mesPolygonText = new graphic({
              isMeaTool: true,
              geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp },
              symbol: { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '面积0m²', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px'} }
            })])
            mesPolygonProj4 = new graphic({ geometry: { type: 'polygon', rings:[[lastV]]} })
          }
        }, (evt) => {
          var v = evt.vertices
          var lastV = v[v.length - 1]
          var lastPoint = proj4('EPSG:4490', 'EPSG:4544', lastV)
          if(v.length > 1) {
            mesPolygon.geometry = { type: 'polygon', rings:[v], spatialReference: sp }
            mesPolygonProj4.geometry = { type: 'polygon', rings:[allPoint.concat([lastPoint])] }
            var area = Math.abs(ge.planarArea(mesPolygonProj4.geometry))
            var cc = mesPolygon.geometry.centroid
            mesPolygonText.geometry = { type: 'point', x: cc.x, y: cc.y, spatialReference: sp }
            mesPolygonText.symbol.text = '面积' + area.toFixed(2) + 'm²'
          }
        }, () => mapdiv.style.cursor = '')
    },
    angle: function() {
      var mapView = this.mapView
      var mapdiv = mapView.container
      var layer = mapView.graphics
      var graphic = mapView.TF_graphic
      var sp = mapView.spatialReference
      var that = this
      var line = [undefined, [undefined, undefined], undefined, undefined]
      var PI = Math.PI      
      mapView.TF_drawPolygon(() => {mapdiv.style.cursor = 'crosshair'},
        (evt) => {
          var v = evt.vertices
          var lastV = v[v.length - 1]
          if (v.length < 2) {
            layer.add(line[0] = new graphic({
              isMeaTool: true,
              geometry: { type: 'polyline', paths:[[[0, 0]]], spatialReference: sp },
              symbol: { type: 'simple-line', color: [245, 108, 108], cap: 'square', width: "2px"  }
            }))
          } else {
            line[2] = [v[v.length - 2], v[v.length - 1], undefined]
            line[2][2] = Math.atan2(line[2][0][1] - line[2][1][1], line[2][0][0] - line[2][1][0])
            line[3] = (line[2][2] <= 0 ? 1 : -1) * PI + line[2][2]
            // var path = { type: "simple-marker", color: [255, 0, 0], xoffset: "0px", yoffset: "0px", size: "40px" };
            // path.path = "M150 0 L75 200 L225 200 Z";
            // path.angle = (-line[2][2] / PI) * 180;
            line[1][0] = new graphic({
              isMeaTool: true,
              geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp },
              // symbol: path,
              symbol: { type: 'simple-marker', color: [255, 255, 255], size: 4, outline: { color: [245, 108, 108], width: 1 } }
            })
            line[1][1] = new graphic({
              isMeaTool: true,
              geometry: { type: 'point', x: lastV[0], y: lastV[1], spatialReference: sp },
              symbol: { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '0°', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px', weight: 'bold'} }
            })
            layer.addMany(line[1])
          }
        }, (evt) => {          
          var v = evt.vertices
          if (v.length > 1) {
            var lastV = v[v.length - 1]              
            line[0].geometry = { type: 'polyline', paths: v, spatialReference: sp }
            if(v.length > 2) {
              var ag = Math.atan2(lastV[1] - line[2][1][1], lastV[0] - line[2][1][0])
              lastV = Math.abs(ag - line[2][2])
              // ag = [ lastV > PI ? 2 * PI - lastV : lastV, line[2][2] >= 0 ? ag >= line[3] && ag < line[2][2] ? 1 : 0 : ag <= line[3] && ag > line[2][2] ? 0 : 1];
              // line[1][0].geometry = { type: 'point', x: line[2][1][0], y: line[2][1][1], spatialReference: sp }
              // line[1][0].symbol.path = "M 200 100 A 50 50 0 0 " + ag[1] + " " + (150 + Math.cos(ag[0]) * 50) + " " + (100 + (ag[1] == 1 ? 1 : -1) * Math.sin(ag[0]) * 50) +
              //   " L150 100 L200 100Z";
              line[1][1].geometry = { type: 'point', x: line[2][1][0], y: line[2][1][1], spatialReference: sp },
              line[1][1].symbol.text = (((lastV > PI ? 2 * PI - lastV : lastV) / PI) * 180).toFixed(2) + '°' // ((ag[0] / PI) * 180).toFixed(2) + "°"
            }
          }
        }, () => {
          mapdiv.style.cursor = ''
          layer.removeMany(line[1])
      })
    },
    dem() {
      if(!this.rectUrl) {
        for(let i=0,il=this.mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
          if(!il[i].url) continue     
          for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
            if(jl[j].title != '管线') continue
            this.rectUrl = jl[j].url
            break
          }
          if(this.rectUrl) break
        }
      }
      var mapView = this.mapView
      var mapdiv = mapView.container
      mapdiv.style.cursor = 'crosshair'
      if(this.click) this.click.remove()
      this.click = mapView.on('click', (evt) => {          
        var xy = mapView.toMap({ x: evt.x, y: evt.y })
        this.click.remove()
        this.click = undefined
        mapdiv.style.cursor = ''
        this.query(xy)
      })      
    },
    query(xy) {
      var mapView = this.mapView
      var graphic = mapView.TF_graphic
      var sp = mapView.spatialReference
      var layer = mapView.graphics
      var x = xy.x, y = xy.y
      var r = mapView.resolution * 5, da = Math.PI / 10
      var ret = []
      var PI2 = Math.PI * 2, sin = Math.sin, cos = Math.cos
      for(let i=0;i< PI2;i+=da){
        ret.push([x + r * cos(i), y + r * sin(i)])
      }
      $.ajax({
        url: this.rectUrl + '/query',
        type: 'POST',
        data: {
          geometry: JSON.stringify({ spatialReference: {wkid: 4490}, rings: [ret] }),
          geometryType: 'esriGeometryPolygon',
          outFields: 'OBJECTID,STARTZ,ENDZ',
          f: 'pjson'          
        }, 
        success: (data) => {
          data = JSON.parse(data).features
          if(data && data.length < 1) return this.$message.error('无管线')
          var long = Infinity, closet, dep, attDep
          for(let i=0,ii=data.length;i<ii;i++) {
            var nd = data[i].geometry.paths[0]
            var cl = this.getClosetPoint(nd, [x, y])
            var length = [cl[0] - x, cl[1] - y]
            length = Math.sqrt(length[0] * length[0] + length[1] * length[1])
            if(length < long) {
              long = length
              closet = cl
              if(nd[0][0] == nd[1][0]) {
                dep = Math.abs(closet[1] - nd[0][1]) / Math.abs(nd[0][1] - nd[1][1])                
              } else {
                dep = Math.abs(closet[0] - nd[0][0]) / Math.abs(nd[0][0] - nd[1][0])     
              }
              attDep = data[i].attributes
              attDep = [attDep.STARTZ, attDep.ENDZ]
            }
          }
          attDep = Math.abs(attDep[0] - attDep[1]) * dep + Math.min(attDep[0], attDep[1])
          layer.add(new graphic({
            isMeaTool: true,
            geometry: { type: 'point', x: closet[0], y: closet[1], spatialReference: sp },
            symbol: { type: 'simple-marker', color: [255, 255, 255], size: 4, outline: { color: [245, 108, 108], width: 1 } }
          }))
          layer.add(new graphic({
            isMeaTool: true,
            geometry: { type: 'point', x: closet[0], y: closet[1], spatialReference: sp },
            symbol: { type: 'text', color: 'white', haloColor: 'black', haloSize: '1px', text: '高程：' + attDep.toFixed(2) + 'm', yoffset: 6, verticalAlignment: 'bottom', font: {size: '14px', weight: 'bold'} }
          }))
        },
        error: (error) => this.$message.error(error)
      })
    },
    getClosetPoint(line, cood) {
      var p1 = line[0], p2 = line[1], A = p2[1] - p1[1], B = p1[0] - p2[0], C  = p2[0] * p1[1] - p1[0] * p2[1]
      var p3 = [(B * B * cood[0] - A * B * cood[1] - A * C) / (A * A + B * B), (-A * B * cood[0] + A * A * cood[1] - B * C) / (A * A + B * B)]
      if (p3[0] < Math.min(p1[0], p2[0]) || p3[0] > Math.max(p1[0], p2[0])) Math.abs(p3[0] - p1[0]) > Math.abs(p3[0] - p2[0]) ? p3 = p2 : p3 = p1
      return p3
    },
    clearDraw: function() {
      var removeFeas = []
      for(let i=0,il=this.mapView.graphics.items,ii=il.length;i<ii;i++) {
        if (il[i].isMeaTool){
          removeFeas.push(il[i])
        }
      }
      this.mapView.graphics.removeMany(removeFeas)
    },
    showLayer() {
      this.$store.dispatch('map/changeMethod', this.panel)
    }
  }
}
</script>
<style type="scss">
.toolPar:hover .tool {
  opacity: 1;
  max-height: 30px;
}
.toolPar:hover .widgetGroupButtoms i {
  color: #3385ff;
}
.tool {
  opacity: 0;
  max-height: 0px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  height: 30px;
  padding: 0 7px;
  background: #fff;
  line-height: 30px;
  letter-spacing: 1px;
  transition: 0.2s;
  font-size: 14px;
  overflow: hidden;
  text-align: center;
}
.tool i {
  transition: 0.2s;
}
.tool:hover {
  background: #eee;
}
.tool:hover i {
  color: #3385ff;
}
</style>
