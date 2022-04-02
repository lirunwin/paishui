<template>
  <div style="padding: 0 8px;overflow-y:auto;">    
    <tf-legend class="legend_dept" label="设施统计" isopen="true" title="点击空间绘制按钮，在地图上绘制空间范围过滤查询。">  
      <el-button-group>
        <el-tooltip content="点选" placement="top" effect="light">
          <el-button size="mini" @click="pointQuery" plain>
            <img src="./images/G.png" width="20px" height="20px" style="object-fit: contain">
          </el-button>
        </el-tooltip>
        <el-tooltip content="框选" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('rect')" plain>
            <img src="./images/R.png" width="20px" height="20px" style="object-fit: contain">
          </el-button>
        </el-tooltip>
        <el-tooltip content="圆形选择" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('circle')" plain>
            <img src="./images/C.png" width="20px" height="20px" style="object-fit: contain">
          </el-button>
        </el-tooltip>
        <el-tooltip content="多边形选择" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('polygon')" plain>
            <img src="./images/P.png" width="20px" height="20px" style="object-fit: contain">
          </el-button>
        </el-tooltip>    
        <el-tooltip content="清除" placement="top" effect="light">
          <el-button size="mini" @click="clearQuery" plain>
            <img src="./images/N.png" width="20px" height="20px" style="object-fit: contain">
          </el-button>
        </el-tooltip>     
        <!-- <div v-show="queryLoading" class="titleS" style="display: inline-block; font-size: 14px;"><i class="el-icon-loading"></i>查询中</div> -->
      </el-button-group>
      <el-table ref="featureTable" highlight-current-row :data="layerData" stripe max-height="180px" v-loading="queryLoading"
        style="margin-bottom: 8px;" row-class-name="selectRowC" @row-click="getFeatures">
        <el-table-column prop="layer" label="图层名称" width="100"/>
        <el-table-column prop="num" label="数量" />
        <el-table-column prop="length" label="总长(m)" >
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
      </el-table>
    </tf-legend>
    <tf-legend class="legend_dept" label="设施信息" isopen="true" title="查询要素信息列表。" v-loading="featuresLoading">
      <el-table ref="featuresTable" highlight-current-row :data="featureData" stripe max-height="180px" border style="width: 100%;margin-bottom: 8px;"
        row-class-name="selectRowC" @row-click="getFeature">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" show-overflow-tooltip />
      </el-table>
    </tf-legend>
    <tf-legend class="legend_dept" label="设施详情" isopen="true" title="显示选中的要素详情信息。" v-loading="attLoading">      
      <el-link style=" position: absolute; top: -25px; right: 25px;" type="primary" @click="showMoreInfo" :disabled="!infoId || attData.length <= 0">更多</el-link>
      <el-table :data="attData" stripe max-height="270px" >
        <el-table-column prop="fix" label="字段" />
        <el-table-column prop="att" label="属性" />
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { attAllConfig } from '@/views/zhpt/shuxingchaxun/queryForSpace/attConfig'
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'queryForSpace',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      // 要素统计
      layerData: [],
      queryLoading: false,

      // 要素信息
      featuresLoading: false,
      columns: [],
      featureData: [],
      
      //  要素详情
      infoId: undefined,
      attLoading: false,
      attData: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted() {
    var view = this.mapView = this.$attrs.data.mapView
    var sp = view.spatialReference
    var symbol = { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: '1px' }}
    this.printRect = new view.TF_graphic({ geometry: { type: 'polygon', spatialReference: sp }, symbol })
    this.queryFeature = new view.TF_graphic({ geometry: { type: 'polygon', spatialReference: sp }, symbol })
    view.map.add(this.allResultFeatures = new view.TF_graphicsLayer())
    this.allResultFeaturesArray = []
    this.allResultFeaturesIndex = {}
    view.map.add(this.secondResultFeatures = new view.TF_graphicsLayer())
    this.allResultFeatures.add(this.printRect)
    view.graphics.add(this.queryFeature)
    
    var returnLayers = []
    for(var i=0,il=view.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
      var layer = il[i]
      if(!(layer.url && layer.visible)) continue
      for(var j=0,jl=layer.sublayers.items,jj=jl.length;j<jj;j++){
        var subLayer = jl[j]
        if(!subLayer.visible) continue
        if(!subLayer.sublayers) returnLayers.push(subLayer.id)
        else {
          for(var k=0,kl=subLayer.sublayers.items,kk=kl.length;k<kk;k++){
            var inSubLayer = kl[k]
            if(inSubLayer.visible) returnLayers.push(inSubLayer.id)
          }
        }
      }
    }
    this.getLayers = returnLayers.sort((a, b) => a - b)
    this.loadLayerName()
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'queryForSpace') {
        this.$nextTick(() => {
          this.queryFeature.visible = true
          this.allResultFeatures.visible = true
          this.secondResultFeatures.visible = true
        })  
      } 
      if(oldTab == 'queryForSpace') {
        this.queryFeature.visible = false
        this.allResultFeatures.visible = false
        this.secondResultFeatures.visible = false
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) draw.reset()        
        if (this.click) {
          this.click.remove()
          this.click = undefined
        }
        this.removeEvent()
        view.container.style.cursor = ''
      }
    }
  },
  methods: {
    pointQuery() {
      var view = this.mapView
      view.container.style.cursor = 'pointer'
      if (this.click) {
        this.click.remove()
        this.click = undefined
      }
      this.removeEvent()
      this.click = view.on('click', (evt) => {
        var xy = view.toMap({ x: evt.x, y: evt.y })
        var [x, y] = [xy.x, xy.y]
        var r = view.resolution * 7; var da = Math.PI / 13
        var ret = []
        var PI2 = Math.PI * 2; var sin = Math.sin; var cos = Math.cos
        for (let i = 0; i < PI2; i += da) {
          ret.push([x + r * cos(i), y + r * sin(i)])
        }
        this.printRect.geometry = { type: 'polygon', rings: [ret], spatialReference: view.spatialReference }
        this.click.remove()
        this.click = undefined
        view.container.style.cursor = ''
        this.query()
      })
    },
    spaceQuery(type) {
      this.removeEvent()
      var view = this.mapView
      var mapdiv = view.container
      var sp = view.spatialReference
      var draw = view.TF_draw
      var getPolygon = {
        'rect': (v) => [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]],
        'circle': (v) => {
          var x = v[0][0], y = v[0][1]
          var dx = v[1][0] - v[0][0], dy = v[1][1] - v[0][1]
          var r = Math.sqrt(dx * dx + dy *dy), da = Math.PI / 20
          var ret = []
          var PI2 = Math.PI * 2, sin = Math.sin, cos = Math.cos
          for(let i=0;i< PI2;i+=da){
            ret.push([x + r * cos(i), y + r * sin(i)])
          }
          return [ret]
        },
        'polygon': (v) => v
      }[type]
      if(draw.activeAction) draw.reset()
      var funForDraw = [() => {mapdiv.style.cursor = 'crosshair'},
        (evt) => {
          var v = evt.vertices
          if (v.length > 1) return
          this.printRect.geometry = { type: 'polygon', spatialReference: sp } 
        }, (evt) => {
          var v = evt.vertices
          if(v.length > 1) this.printRect.geometry = { type: 'polygon', rings: getPolygon(v), spatialReference: sp } 
        }, () => {
          mapdiv.style.cursor = ''
          this.query()
        }]
      switch(type) {
        case 'rect':
        case 'circle':
          this.action = view.TF_drawRect(...funForDraw) 
          break
        case 'polygon':
          this.action = view.TF_drawPolygon(...funForDraw)           
          break
      }
    },
    clearQuery() {
      var view = this.mapView
      this.printRect.geometry = { type: 'polygon', rings: [[0, 0]], spatialReference: view.spatialReference }
      this.featureData = []
      this.layerData = []
      this.attData = []
      this.allResultFeatures.removeMany(this.allResultFeaturesArray)
      this.secondResultFeatures.removeAll()
      this.queryFeature.geometry = undefined
    },
    query() {
      var geometry = this.printRect.geometry
      if(!geometry) return this.$message.error('几何错误')
      this.queryLoading = true
      
      var view = this.mapView
      var Graphic = view.TF_graphic
      var sp = view.spatialReference
      this.allResultFeatures.removeMany(this.allResultFeaturesArray)
      var index = this.allResultFeaturesIndex = {}
      this.allResultFeaturesArray = []
      this.secondResultFeatures.removeAll()
      
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + '/identify',
        type: 'POST',
        data: {
          geometry: JSON.stringify(geometry.toJSON()),
          geometryType: 'esriGeometryPolygon',
          layers: 'all:' + this.getLayers.join(','),
          tolerance: '1',
          mapExtent: '1',
          imageDisplay: '1',
          f: 'pjson'
        },  
        success: (data) => {
          this.queryLoading = false
          this.addEvent()
          if(!data) return this.$message.error('查询错误')
          data = JSON.parse(data)
          if(data.error) return this.$message.error(data.message)
          data = data.results
          this.queryFeature.geometry = { type: 'polygon', spatialReference: sp }
          if(data.length < 1) {
            this.layerData = []
            return this.$message('无查询结果')
          }
          this.$message('查询结果：' + data.length + ' 项')
          var layerAla = {}
          var feasP = [], feasF = []
          for(var i=0,ii=data.length;i<ii;i++) {
            var rd = data[i]
            if(!layerAla.hasOwnProperty(rd.layerId)) {
              layerAla[rd.layerId] = { layer: rd.layerName, id: rd.layerId, type: rd.geometryType, length: 0, num: 0, objects: [] }
            }
            var dl = layerAla[rd.layerId]
            var oid = rd.attributes['OBJECTID'];
            //立管是点图层esriGeometryPoint 
            if(rd.geometryType == 'esriGeometryPolyline') dl.length += parseFloat(rd.attributes['SHAPE.LEN'])
            if(rd.geometryType == 'esriGeometryPoint' && rd.layerName == "立管"){
              dl.length += parseFloat(rd.attributes['管线长度（m）'])
            }

            dl.num += 1
            dl.objects.push(oid)
            
            var feaGeo, symbol, isPoint
            switch(rd.geometryType) {
              case 'esriGeometryPoint':
                isPoint = true
                feaGeo =  { type: 'point', x: rd.geometry.x, y: rd.geometry.y} 
                symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 }}
                break
              case 'esriGeometryPolyline':
                feaGeo =  { type: 'polyline', paths: rd.geometry.paths} 
                symbol = { type: 'simple-line', color: [51, 133, 255], cap: 'square', width: "3px"  }
                break
              case 'esriGeometryPolygon':
                feaGeo =  { type: 'polygon', rings: rd.geometry.rings} 
                symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [51, 133, 255], width: '3px' }}
                break
            };
            (isPoint ? feasF : feasP).push(index[oid] = new Graphic({
              oid: oid,
              layerId: rd.layerId,
              geometry: feaGeo,
              symbol: symbol,
              spatialReference: sp
            }))            
          }
          this.allResultFeaturesArray = feasP.concat(feasF)
          this.allResultFeatures.addMany(this.allResultFeaturesArray)
          var caTable = []
          for(var i=0,il=Object.keys(layerAla),ii=il.length;i<ii;i++) {
            caTable.push(layerAla[il[i]])
          }
          this.layerData = caTable
        },
        error: (error) => this.$message.error(error)
      })
    },
    getFeatures(row, a, b, cb) {
      var callback = cb
      if(this.lastFeatures == row.id && !callback) {
        this.secondResultFeatures.removeAll()
        return
      }
      this.lastFeatures = row.id
      var layerNName = this.layerIndex[row.id].layerdbname
      var fields = ['OBJECTID']
      if(attAllConfig.hasOwnProperty(layerNName)) fields = attAllConfig[layerNName]
      this.featuresLoading = true
      this.secondResultFeatures.removeAll()
      if(!callback) {
        this.queryFeature.geometry = undefined

        var view = this.mapView
        var Graphic = view.TF_graphic
        var sp = view.spatialReference      
        var symbol
        switch(row.type) {
          case 'esriGeometryPoint':
            symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [0, 255, 255], width: 2 }}
            break
          case 'esriGeometryPolyline':
            symbol = { type: 'simple-line', color: [0, 255, 255], cap: 'square', width: "3px"  }
            break
          case 'esriGeometryPolygon':
            symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255], width: '3px' }}
            break
        };

        var feas = []
        for(var i=0,il=this.allResultFeatures.graphics.items,ii=il.length,oids=row.objects;i<ii;i++) {
          if(oids.includes(il[i].oid)) {
            var di = il[i]
            feas.push(new Graphic({
              geometry: di.geometry,
              symbol: symbol,
              spatialReference: sp
            }))
          }
        }
        this.secondResultFeatures.addMany(feas)        
      }

      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + row.id + "/query",
        type: 'POST',
        data: {
          objectIds: row.objects.join(','),
          outFields: fields.join(',') + ',OBJECTID',
          returnGeometry: false,
          f: 'pjson'
        },  
        success: (data) => {
          this.featuresLoading = false
          if(!data) return this.$message.error('查询错误')
          data = JSON.parse(data)
          if(data.error) return this.$message.error('查询错误:' + data.message)
          this.columns = data.fields.filter(e => e.name != 'OBJECTID').map(e => { return { prop: e.name, label: e.alias }})
          this.featureData = data.features.map(e => e.attributes)
          if(callback) callback()
        },
        error: (error) => { console.log(error) }
      })
    },
    getFeature(row) {
      var layerId = this.lastFeatures 
      if(!layerId) return this.$message.error('请选中图层')
      var config = attConfig.hide
      var configChange = attConfig.change
      var view = this.mapView
      this.secondResultFeatures.removeAll()
      this.attLoading = true
      var gra = this.allResultFeaturesIndex[row['OBJECTID']]
      if(gra) {
        var symbol
        switch(gra.geometry.type) {
          case 'point':
            symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [0, 255, 255], width: 2 }}
            break
          case 'polyline':
            symbol = { type: 'simple-line', color: [0, 255, 255], cap: 'square', width: "3px"  }
            break
          case 'polygon':
            symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255], width: '3px' }}
            break
        };
        
        this.queryFeature.geometry = gra.geometry
        this.queryFeature.symbol = symbol

        var extent = this.queryFeature.geometry.extent
        var x, y
        if(extent) {
          x = (extent.xmax + extent.xmin) / 2
          y = (extent.ymax + extent.ymin) / 2
        } else {
          x = gra.geometry.x
          y = gra.geometry.y
        }
        window.requestAnimationFrame(_ => {
          view.center = {x: x, y: y, spatialReference: view.spatialReference}  
          view.zoom = 6
        })
      }
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + layerId + "/query",
        type: 'POST',
        data: {
          objectIds: row['OBJECTID'],
          outFields: '*',
          returnGeometry: false,
          f: 'pjson'
        },  
        success: (data) => {
          this.attLoading = false
          if(!data) return this.$message.error('查询错误')
          data = JSON.parse(data)
          if(data.error) return this.$message.error('查询错误:' + data.message)
          if(!data.features.length) return this.$message.error('查询设施不存在')
          
          var attDic = data.fieldAliases 
          var att = data.features[0].attributes
          var atts = []
          this.infoId = att.hasOwnProperty('SID') ? att['SID'] : undefined
          for(var i=0,il=Object.keys(att),ii=il.length;i<ii;i++) {
            var key = il[i]
            if(config.includes(key)) continue
            var showAtt = att[key]
            if(configChange.hasOwnProperty(key)) {
              showAtt = configChange[key](key, showAtt)
            }
            if(showAtt == 'Null') showAtt = ''
            atts.push({ fix: attDic[key], att: showAtt})
          }
          this.attData = atts
        },
        error: (error) => { console.log(error) }
      })
    },
    addEvent() {
      var view = this.mapView
      var mapdiv = view.container
      var graphics = this.allResultFeatures
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      if (this.click) {
        this.click.remove()
        this.click = undefined
      }
      this.eventMove = view.on('pointer-move', (evt) => view.hitTest(evt, graphics).then((re) => {
        var isShow = ''
        re = re.results
        if(re.length && re[0].graphic.oid) isShow = 'pointer'
        mapdiv.style.cursor = isShow
      }))
      var that = this
      this.eventClick = view.on('immediate-click', (evt) => {
        view.hitTest(evt, graphics).then((re) => {
          re = re.results
          if (!re.length) return
          var gra = re[0].graphic
          // this.lastFeatures = gra.layerId
          for(var i=0,il=that.layerData,ii=il.length;i<ii;i++) {
            if(il[i].id == gra.layerId){
              var di = il[i]
              that.getFeatures(di, undefined, undefined, () => {
                that.getFeature({ OBJECTID: gra.oid })                
                for(var j=0,jl=that.featureData,jj=jl.length;j<jj;j++) {
                  if(jl[j].OBJECTID == gra.oid)
                  that.$refs.featuresTable.setCurrentRow(jl[j]);
                }
              })
              that.$refs.featureTable.setCurrentRow(di);
              break
            }
          }          
        })
      })
    },
    removeEvent() {
      if(this.eventMove) this.eventMove.remove()
      if(this.eventClick) this.eventClick.remove()
    },
    loadLayerName() {      
      var url = appconfig.gisResource.layer_name.config[0].url
      $.ajax({
        url: url,
        type: "POST",
        data: {
          usertoken: appconfig.usertoken,
          layerids: JSON.stringify(this.getLayers),
          f: "pjson"
        },
        dataType: "json",
        success: (data) => {
          if (data.code == 10000) {
            var layersData = []
            var layerIndex = {}
            for (var i=0,il=data.result.rows,ii=il.length;i<ii; i++) {
              var layer = il[i]
              layersData.push(layer)
              layerIndex[layer.layerid] = layer
            }
            this.layerIndex = layerIndex
            this.layerList = layersData
          }
        }
      })
    },
    showMoreInfo() {
      this.$store.dispatch("map/changeMethod", {
        pathId: "queryResultMore",
        widgetid: "HalfPanel",
        label: "更多信息",
        param: { id: this.infoId },
      });
    }
  },
  destroyed() {
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    if (this.click) {
      this.click.remove()
      this.click = undefined
    }
    if(this.eventMove) this.eventMove.remove()
    if(this.eventClick) this.eventClick.remove()
    view.graphics.remove(this.queryFeature)    
    view.map.remove(this.allResultFeatures)
    view.map.remove(this.secondResultFeatures)
  }
}
</script>
