<template>
<div style="padding: 0 8px;display: flex;flex-direction: column;" id="QforSbutton_group">
  <tf-legend class="legend_dept" label="绘制工具" isopen="true" title="查询工具类型。">    
    <el-button-group>
      <!-- <el-button size="mini" title="点选" @click="space('point')"><img src="./images/G.png" width="20px" height="20px" style="object-fit: contain"></el-button> -->
      <el-button size="mini" title="框选" @click="space('rect')"><img src="./images/R.png" width="20px" height="20px" style="object-fit: contain"></el-button>
      <el-button size="mini" title="作圆" @click="space('circle')"><img src="./images/C.png" width="20px" height="20px" style="object-fit: contain"></el-button>
      <el-button size="mini" title="作多边形" @click="space('polygon')"><img src="./images/P.png" width="20px" height="20px" style="object-fit: contain"></el-button>
    </el-button-group>
  </tf-legend>
  <div id="Legend" class="Legend">
    <div class="label" @click="featuresShowing = !featuresShowing">要素统计
      <el-tooltip class="item" effect="dark" content="查询要素详细信息。" placement="right">
        <i class="el-icon-info" ref="info"></i>        
      </el-tooltip>
      <div ref="isQuery" style="display: none;"><i class="el-icon-loading"></i>查询中</div>
    </div>
    <div v-show="featuresShowing" class="content">
      <el-table highlight-current-row :data="layerData" stripe max-height="180px" style="width: 100%;margin-bottom: 8px;" row-class-name="selectRowC" @row-click="getMore">
        <el-table-column prop="layer" label="图层名称" width="80"/>
        <el-table-column prop="num" label="数量" />
        <el-table-column prop="length" label="总长(m)" >
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <tf-legend class="legend_dept" label="要素选择" :isopen="featureShow" title="查询要素选择。">
    <el-table highlight-current-row :data="featureData" stripe max-height="180px" style="width: 100%;margin-bottom: 8px;"
       row-class-name="selectRowC" @row-click="featureInfo">
      <el-table-column prop="layer" label="图层"  />
      <el-table-column prop="name" label="标识码" />
    </el-table>
  </tf-legend>
  <div id="Legend" class="Legend" style="flex:1;">
    <div class="label" style="cursor:default">要素详细
      <el-tooltip class="item" effect="dark" content="查询要素详细信息。" placement="right">
        <i class="el-icon-info" ref="info"></i>        
      </el-tooltip>
      <el-link style="margin-left: 4px;" type="primary" @click="showMoreInfo" :disabled="disabled">更多</el-link>
    </div>
    <div class="content" style="height:calc(100% - 28px)">
      <el-table :data="attData" stripe height="100%" style="width: 100%;">
        <el-table-column prop="fix" label="字段" />
        <el-table-column prop="att" label="属性" />
      </el-table>
    </div>
  </div>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'queryForSpace',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      activeName: 'attQuerry',
      inr: {},
      attDatas:[],
      layer: '',
      layerData: [],
      featureData: [],
      attData: [],
      featuresShowing: true,
      choseType: '1',
      disabled: true,
      featureShow: true
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {
    var view = this.mapView = this.$attrs.data.mapView
    var sp = view.spatialReference
    this.printRect = new view.TF_graphic({
      geometry: { type: 'polygon', spatialReference: view.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: '1px' }}
    })
    this.queryFeature = new view.TF_graphic({
      geometry: { type: 'polygon', spatialReference: sp },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: '1px' }}
    })
    view.map.add(this.allResultFeatures = new view.TF_graphicsLayer())
    view.graphics.addMany([this.printRect, this.queryFeature])
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'queryForSpace') {
        this.$nextTick(() => {
          this.printRect.visible = true   
          this.queryFeature.visible = true
          this.allResultFeatures.visible = true
        })  
      } 
      if(oldTab == 'queryForSpace') {
        this.printRect.visible = false
        this.queryFeature.visible = false
        this.allResultFeatures.visible = false
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) draw.reset()
        view.container.style.cursor = ''
      }
    }
  },
  methods: { 
    space(value) {
      var view = this.mapView
      var mapdiv = view.container
      var sp = view.spatialReference
      var draw = view.TF_draw
      this.featureData = []
      if(draw.activeAction) draw.reset()
      var funForDraw = [() => {mapdiv.style.cursor = 'crosshair'},
        (evt) => {
          var v = evt.vertices
          if (v.length > 1) return
          this.printRect.geometry = { type: 'polygon', spatialReference: sp } 
        }, (evt) => {
          var v = evt.vertices
          if(v.length > 1) this.printRect.geometry = { type: 'polygon', rings: this.getPolygon(value, v), spatialReference: sp } 
        }, () => {
          mapdiv.style.cursor = ''
          this.$refs.isQuery.style.display = 'inline-block'
          this.query()
        }]
      switch(value) {
        case 'rect':
        case 'circle':
          this.action = view.TF_drawRect(...funForDraw) 
          break
        case 'polygon':
          this.action = view.TF_drawPolygon(...funForDraw)           
          break
      }
    },
    query() {
      var geometry = this.printRect.geometry
      if(!geometry) return
      var view = this.mapView
      var Graphic = view.TF_graphic
      var sp = view.spatialReference
      var mapExtent = view.extent.toJSON()
      var returnData = this.returnData = {}
      var table = this.featureDataTable = {}
      var feas = []

      this.allResultFeatures.removeAll()
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + '/identify',
        type: 'POST',
        data: {
          geometry: JSON.stringify(geometry.toJSON()),
          geometryType: 'esriGeometryPolygon',
          layers: 'all:' + this.getLayers().join(','),
          tolerance: '6',
          mapExtent: mapExtent.xmin + ',' + mapExtent.ymin + ',' + mapExtent.xmax + ',' + mapExtent.xmax + ',',
          imageDisplay: (view.width / 96).toFixed(2) + ',' + (view.height / 96).toFixed(2) + ',' + '96',
          f: 'pjson'
        },  
        success: (data) => {
          data = JSON.parse(data).results
          this.queryFeature.geometry = undefined
          this.$refs.isQuery.style.display = 'none'
          if(data.length < 1) {
            this.layerData = []
            this.$message('无查询结果')
            return
          }
          this.$message('查询结果：' + data.length + ' 项')
          var layerAla = {}
          for(var i=0,ii=data.length;i<ii;i++) {
            var rd = data[i]
            if(!layerAla.hasOwnProperty(rd.layerId)) {
              layerAla[rd.layerId] = { layer: rd.layerName, length: 0, num: 0}
              table[rd.layerId] = []
            }
            if(rd.geometryType == 'esriGeometryPolyline') layerAla[rd.layerId].length += parseFloat(rd.attributes['SHAPE.LEN'])
            layerAla[rd.layerId].num += 1
            table[rd.layerId].push({ 
              layer: rd.layerName, 
              layerId: rd.layerId, 
              name: rd.value, 
              attributes:{ 
                OBJECTID:rd.attributes['OBJECTID'], 
                SID: rd.displayFieldName.indexOf('编号') > 0 ? rd.value : undefined 
              } 
            })
            returnData[rd.layerId + '-' + rd.attributes['OBJECTID']] = rd
            
            var feaGeo, symbol
            switch(rd.geometryType) {
              case 'esriGeometryPoint':
                feaGeo =  { type: 'point', x: rd.geometry.x, y: rd.geometry.y} 
                symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 }}
                break
              case 'esriGeometryPolyline':
                feaGeo =  { type: 'polyline', paths: rd.geometry.paths} 
                symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: '3px' }}
                break
              case 'esriGeometryPolygon':
                feaGeo =  { type: 'polygon', rings: rd.geometry.rings} 
                symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: '3px' }}
                break
            }
            feas.push(new Graphic({
              geometry: feaGeo,
              symbol: symbol,
              spatialReference: sp
            }))
          }
          this.allResultFeatures.addMany(feas)
          var caTable = []
          for(var item in layerAla) {
            caTable.push({ id: item, layer: layerAla[item].layer, num:layerAla[item].num, length: layerAla[item].length})
          }
          this.layerData = caTable
        },
        error: (error) => this.$message.error(error)
      })
    },
    getPolygon(type, v) {
      switch(type){
        case 'rect':
          return [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]]
        case 'circle':
          var x = v[0][0], y = v[0][1]
          var dx = v[1][0] - v[0][0], dy = v[1][1] - v[0][1]
          var r = Math.sqrt(dx * dx + dy *dy), da = Math.PI / 20
          var ret = []
          var PI2 = Math.PI * 2, sin = Math.sin, cos = Math.cos
          for(let i=0;i< PI2;i+=da){
            ret.push([x + r * cos(i), y + r * sin(i)])
          }
          return [ret]
        case 'polygon':
          return v
      }
    },
    getLayers: function() {
      var returnLayers = []
      for(let i=0,il=this.mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        var layer = il[i]
        if(!(layer.url && layer.visible)) continue
        for(let j=0,jl=layer.sublayers.items,jj=jl.length;j<jj;j++){
          var subLayer = jl[j]
          if(!subLayer.visible) continue
          if(!subLayer.sublayers) returnLayers.push(subLayer.id)
          else {
            for(let k=0,kl=subLayer.sublayers.items,kk=kl.length;k<kk;k++){
              var inSubLayer = kl[k]
              if(inSubLayer.visible) returnLayers.push(inSubLayer.id)
            }
          }
        }
      }
      return returnLayers.sort((a, b) => a - b)
    },
    featureInfo: function(row) {
      // this.printRect.geometry = undefined
      var view = this.mapView
      var sp = view.spatialReference
      var fea = this.returnData[row.layerId + '-' + row.attributes.OBJECTID]
      var geomentry = fea.geometry
      var dictionary = {"esriGeometryPoint":"point", "esriGeometryPolyline":"polyline", "esriGeometryPolygon":"polygon"}
      geomentry.type = dictionary[fea.geometryType]
      geomentry.spatialReference = sp
      var gra = this.queryFeature
      gra.geometry = geomentry
      gra.symbol = geomentry.type == 'point' ? { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [0, 255, 255], width: 2 } } : { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255], width: "7px" } }
      var extent = gra.geometry.extent
      if(extent) view.goTo(extent)
      else {
        view.center = {x: gra.geometry.x, y: gra.geometry.y, spatialReference: view.spatialReference}  
        view.zoom = 6
      }
      var attData = []
      var atts = fea.attributes   
      var config = attConfig.hide
      for (const item in atts) {
        var att = atts[item]
        if(config.indexOf(item) > -1) continue
        if(att == 'Null') att = ''
        if(item == 'SID') this.infoId = att
        attData.push({ fix: item, att: att || '' })
      }
      this.disabled = !(this.infoId = row.attributes['SID'])
      this.attData = attData
    },
    getMore: function(row) {
      this.featureData = this.featureDataTable[row.id]
    },
    showMoreInfo: function(e){
      if(!this.attData.length || !this.infoId) return
      this.featureShow = ''
      this.$store.dispatch("map/changeMethod", {
        pathId: "queryResultMore",
        widgetid: "HalfPanel",
        label: "更多信息",
        param: { id: this.infoId },
      });
      this.$nextTick(() => this.featureShow = false)
    },
  },
  destroyed: function() {
    this.mapView.graphics.removeMany([this.printRect, this.queryFeature])    
    this.mapView.map.remove(this.allResultFeatures)
    var draw = this.mapView.TF_draw
    if(draw.activeAction) draw.reset()
  }
}
</script>
<style type="scss" scoped>
#QforSbutton_group >>> .el-button-group button{
  border: 1px solid #fff;
}
#QforSbutton_group >>> .el-button-group button:hover{
  border: 1px dashed #2d74e7;
}
</style>
