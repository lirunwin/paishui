<template>
  <!-- 管网分析----关阀分析 -->
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="选取阀门" isopen="true" title="点击按钮，在地图上框选需要进行分析的控制阀门。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawRect">框选选取阀门</el-button>
      </el-row>
      <el-row style="margin-top: 8px">
        <span class="titleS el-checkbox__label">选取阀门预览</span>
      </el-row>
      <el-row>
        <el-table :data="featureData" stripe max-height="210px" style="width: 100%"
          @cell-mouse-enter="hoverIn" @cell-mouse-leave="hoverOut" @select="selectChange" @select-all="selectChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="type" label="阀门类型" />
          <el-table-column prop="pid" label="阀门编号" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="primary" @click="showFeature(scope.row)">跳转</el-link>
              <el-link type="primary" @click="featureDelete(scope.$index, scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="padding-top: 8px; clear: both">
        <el-button size="mini" type="primary" style="width: 100%" @click="analysis" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>开始分析</el-button>
      </el-row>
    </tf-legend>
    <div id="Legend" class="Legend">
      <div class="label" style="cursor: default;">分析结果
        <el-tooltip class="item" effect="dark" content="分析的结果展示。将会自动在地图上高亮显示结果，点击查看更多可显示表格。" placement="right">
          <i ref="info" class="el-icon-info" />
        </el-tooltip><el-switch v-model="ractSelect" inactive-text="地图显示" style="margin-top:-6px;margin-left:4px;"/>
      </div>
      <div class="content">
        <el-table :data="laterData" stripe height="120px" style="width: 100%"><el-table-column type="index" width="20"/>
          <el-table-column prop="name" label="图层名称" >
            <template slot-scope="scope">{{ layerIndex[scope.row.name].layername || scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="value" label="数量/长度" >
            <template slot-scope="scope">{{ scope.row.isLength ? (scope.row.value > 1000 ? (scope.row.value / 1000).toFixed(2) + 'k' : scope.row.value.toFixed(2)) + 'm' : scope.row.value + '个'}}</template>
          </el-table-column>          
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="primary" @click="showLayer(scope.row)">详情</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 8px">
          <el-button size="mini" type="primary" style="width: 100%" @click="userResult(true)">查看受影响客户</el-button>
        </el-row>
        <el-row style="margin-top: 8px">
          <!-- :disabled="laterData.length == 0 || resultDisable" -->
          <el-button size="mini" type="primary" style="width: 100%" @click="showReport">
            <i v-if="resultDisable" class="el-icon-loading"/>方案导出</el-button>
        </el-row>
      </div>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="clearAll(true)">清空所有</el-button>
      </el-row>
    </div>
    <el-dialog v-dialogDrag title="分析报告" :visible.sync="burstDialogVisiable" width="1200px" top="calc(50vh - 380px)">
      <div style="width:100%;padding-right:8px;height:60vh;overflow-y:auto;">
        <div style="width:100%;" id="pdfDom">          
          <tf-legend-dia label="关阀位置" isopen="true" style="margin-top: 8px;">
            <el-table :data="featureData.filter((e) => e.select)" stripe style="width: 100%" @cell-mouse-enter="hoverIn" @cell-mouse-leave="hoverOut">
              <el-table-column prop="type" label="阀门类型" />
              <el-table-column prop="pid" label="阀门编号" />
            </el-table>
            <div ref="burstPipeMap" style="width:100%;height:300px;">
            </div>
          </tf-legend-dia>
          <tf-legend-dia label="影响结果" isopen="true" style="margin-top: 8px;">
            <div style="width:100%;height:300px;padding:5px">
              <div style="width:43%;height:100%;float:left">
                <el-table :data="laterData" stripe style="width: 100%" height="100%" max-height="200px">
                  <el-table-column prop="name" label="图层名称" >
                    <template slot-scope="scope">{{ layerIndex[scope.row.name].layername || scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column prop="value" label="数量/长度" >            
                    <template slot-scope="scope">{{ scope.row.isLength ? scope.row.value.toFixed(2) + 'm' : scope.row.value + '个'}}</template>
                  </el-table-column>
                </el-table>
              </div>
              <div ref="userMap" style="width:55%;height:100%;float:right"></div>
            </div>
          </tf-legend-dia>
          <tf-legend-dia label="影响户数详情" isopen="true" style="margin-top: 8px;">
            <el-table :data="userData" style="width: 100%">
              <el-table-column prop="YHBH" label="客户编号"/>
              <el-table-column prop="YHXM" label="客户名称"/>
              <el-table-column prop="SBBH" label="水表编号"/>
              <el-table-column prop="YHDZ" label="客户地址"/>
              <el-table-column prop="LXDH" label="联系电话"/>
              <el-table-column prop="CBPQ" label="所属片区"/>
              <el-table-column prop="CBB" label="所属抄表本"/>
              <el-table-column prop="GLFM" label="关联阀门"/>
            </el-table>
          </tf-legend-dia>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="primary" @click="getPdf('关阀分析影响结果')" :disabled="outDisable">
          <i v-if="outDisable" class="el-icon-loading"/>导出</el-button> -->
        <el-button size="small" type="primary" @click="getPdf('关阀分析影响结果')">
          导出</el-button>
        <!-- <el-button @click="burstDialogVisiable = false" size="small">取消</el-button> -->
      </span>
    </el-dialog>
    <div ref="reportMap" style="width:100%;height:100%;display:none;" />
    <div ref="subMap" style="width:100%;height:100%;display:none;" />
  </div>
</template>

<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import tfLegendDia from '@/views/zhpt/common/TableLegend'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'OffAnalysis',
  components: { tfLegend, tfLegendDia },
  props: {
    param: Object
  },
  data() {
    return {
      elements: {},
      analysisDisable: false, //分析按钮禁用
      ractSelect: false,
      featureData: [],
      burstDialogVisiable: false,
      resultDisable: false,
      laterData: [],
      mustLaterData: [],
      layerIndex: {},
      outDisable: true,
      userData: [],
      panel: {
        pathId: 'userWaterWatchResult',
        widgetid: 'HalfPanel',
        label: '客户查询结果',
        param: {}
      }
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab == oldTab) return
      if (newTab == 'offAnalysis') {
        this.$nextTick(() => {
          var isShow = this.ractSelect
          var nisShow = !isShow
          for(var i=0,il=this.featureData,ii=il.length;i<ii;i++);
            if(il[i].geo.isSelect){
              il[i].geo.visible = true
            }else{
              il[i].geo.visible = nisShow
            }
            
          for(var i=0,il=this.resultPipes,ii=il.length;i<ii;i++) 
            il[i].visible = isShow
          for(var i=0,il=this.resultPoints,ii=il.length;i<ii;i++) 
            il[i].visible = isShow
        })
      }
      if (oldTab == 'offAnalysis') {  
        for(var i=0,il=this.featureData,ii=il.length;i<ii;i++) 
          il[i].geo.visible = false
        for(var i=0,il=this.resultPipes,ii=il.length;i<ii;i++) 
          il[i].visible = false
        for(var i=0,il=this.resultPoints,ii=il.length;i<ii;i++) 
          il[i].visible = false
        var view = this.mapView
        var draw = view.TF_draw
        view.container.style.cursor = ''
        if(draw.activeAction) draw.reset()
      }
    },
    ractSelect(e) {
      for(let i=0,il= this.resultPipes.concat(this.resultPoints),ii=il.length;i<ii;i++) {
        il[i].visible = e
      }
      e = !e
      for(let i=0,il= this.featureData,ii=il.length;i<ii;i++) {
        if(il[i].geo.isSelect){
          il[i].geo.visible = true
        }else{
          il[i].geo.visible = e
        }
      }
    },
    burstDialogVisiable(e) {
      if(!e) {
        this.$refs.burstPipeMap.innerHTML = ''
        this.$refs.userMap.innerHTML = ''
        if(this.isOk1) {
          this.isOk1.remove()
          this.isOk1 = undefined
        }
        if(this.isOk2) {
          this.isOk2.remove()
          this.isOk2 = undefined
        }
      }
    }
  },
  mounted: function() {
    this.featureData = []
    var mapview = this.mapView = this.$attrs.data.mapView
    for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
      if(!il[i].url) continue     
      for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
        if(jl[j].title != '控制阀门') continue
        this.rectUrl = jl[j].url
        break
      }
      if(this.rectUrl) break
    }
    var Graphic = mapview.TF_graphic
    mapview.map.add(this.firstLayer = new mapview.TF_graphicsLayer())
    this.rectIdIndex = {}
    this.ajaxIndex = {}
    this.resultPipes = []
    this.resultPoints = []
    this.loadReportMap()
    this.loadLayerName()
  },
  methods: {
    loadLayerName() {
      var layers = []
      for(let i=0,il=this.mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        if(!il[i].url) continue     
        for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
          var layer = jl[j]
          if(!layer.sublayers && layer.title != '图幅框') layers.push(layer.id)
        }
        if(layers.length > 0) break
      }      
      $.ajax({  //结果
        url: appconfig.gisResource.layer_name.config[0].url,
        type: 'POST',
        data: {
          usertoken: appconfig.usertoken,
          layerids: JSON.stringify(layers),
          f: 'pjson'
        },
        success: (data) => {          
          data = JSON.parse(data)
          if(data.code == 10000){    
            data = data.result.rows        
            var rows = {}
            for(let i=0,ii=data.length;i<ii;i++) {
              rows[data[i].layerdbname] = data[i]
            }
            this.layerIndex = rows
          }
        },
        error: (error) => {
          this.$message.error('查询错误，请联系管理员')
          console.log(error)
        }
      })
    },
    drawRect: function() {
      this.closeUserList();
      var view = this.mapView
      var sp = view.spatialReference
      var layer = view.graphics
      var draw = view.TF_draw
      var Graphic = view.TF_graphic
      var [mapdiv, obj] = [view.container]
      if(draw.activeAction) draw.reset()
      view.TF_drawRect(() => {mapdiv.style.cursor = 'crosshair'},
      (evt) => {
        var v = evt.vertices
        if (v.length > 1) return  
        layer.add(obj = new Graphic({
          geometry: { type: 'polygon', rings: [[v[0]]], spatialReference: sp },
          symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "1px" } }
        }))
      }, (v) => {
        v = v.vertices
        if (obj) 
          obj.geometry = { 
            type: 'polygon', 
            rings: [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]], 
            spatialReference: sp 
          }
        }, () => {
          this.query(obj.geometry)
          layer.remove(obj)
          mapdiv.style.cursor = ''
      })
    },
    query: function(geo) {
      if(!geo) return
      $.ajax({
        url: this.rectUrl + '/query',
        type: 'POST',
        data: {
          geometry: JSON.stringify(geo.toJSON()),
          geometryType: 'esriGeometryPolygon',
          outFields: 'OBJECTID,SID',
          f: 'pjson'
        }, 
        success: (data) => {
          data = JSON.parse(data)
          var att = data.displayFieldName
          var OIDatt = 'OBJECTID'
          data = data.features
          if(data.length < 1) {     
            this.$message("无查询结果")
            return
          }
          var index = this.rectIdIndex
          var features = this.featureData
          var view = this.mapView
          var sp = view.spatialReference
          var layer = view.graphics
          var Graphic = view.TF_graphic
          var feas = []
          for(let i=0,ii=data.length;i<ii;i++) {
            var fea = data[i]
            var sid = fea.attributes[att]
            var oid = fea.attributes[OIDatt]
            var geo = fea.geometry
            if(!index.hasOwnProperty(oid)) {
              var showGeo = new Graphic({
                id: sid,
                geometry: { type: 'point', x: geo.x, y: geo.y, spatialReference: sp },
                symbol: { type: 'simple-marker', color: [255, 180, 44], size: 10, outline: { color: [255, 44, 44], width: 2 } }
              })
              features.push({ type: '控制阀门', oid: oid, pid: sid, geo: showGeo, select: false })
              index[oid] = features[features.length - 1]
              feas.push(showGeo)
            }
          }
          this.featureData = features
          layer.addMany(feas)
        },
        error: (error) => { console.log(error) }
      })
    },
    hoverIn(row) {
      if(this.rectIdIndex.hasOwnProperty(this.lastHightId)) {
        if(this.lastHightId == row.oid) return
        this.rectIdIndex[this.lastHightId].geo.symbol = { type: 'simple-marker', color: [255, 180, 44], size: 10, outline: { color: [255, 44, 44], width: 2 } }
      }
      this.lastHightId = row.oid
      this.rectIdIndex[this.lastHightId].geo.symbol = { type: 'simple-marker', color: [200, 200, 200], size: 12, outline: { color: [0, 255, 255], width: 2 }}
    },
    hoverOut() {
      if(!this.rectIdIndex.hasOwnProperty(this.lastHightId)) return        
      if(this.rectIdIndex[this.lastHightId].geo.isSelect){
        this.rectIdIndex[this.lastHightId].geo.symbol= { type: 'simple-marker', color: [199,21,133,0.5], size: 12, outline: { color: [199,21,133], width: 4 } }
      }else{
        this.rectIdIndex[this.lastHightId].geo.symbol = { type: 'simple-marker', color: [255, 180, 44], size: 10, outline: { color: [255, 44, 44], width: 2 } }
      }
      this.lastHightId = undefined      
    },
    featureDelete(index, row) {
      this.mapView.graphics.remove(row.geo)
      this.featureData.splice(index, 1)
      delete this.rectIdIndex[row.oid]
    },
    showFeature: function(e) {
      this.mapView.center = e.geo.geometry
      this.mapView.zoom = 4
    },
    analysis: function() {      
      var valves = []
      for(let i=0,il=this.featureData,ii=il.length;i<ii;i++) {
        if(il[i].select) valves.push(il[i].oid)
      }
      if(!valves.length) return this.$message.error('请选中需分析阀门')
      let seed = new Date().getTime()
      this.ajaxIndex[seed] = 1
      this.closeUserList();
      this.analysisDisable = true
      $.ajax({
        url: appconfig.gisResource.shutOff_valve_analysis.config[0].url + "/submitJob",
        type: 'POST',
        data: {
          valves: 'TF_JSJS_VALVE_B',
          usertoken: appconfig.usertoken,
          valveobjectid:valves.toString().replace(',',';'),
          'env:outSR': "{'wkid':4490}",
          f: 'pjson'
        },  
        success: (data) => {
          this.analysisDisable = false;
          if(!this.ajaxIndex.hasOwnProperty(seed)) return
          data = JSON.parse(data)
          if(data.hasOwnProperty('jobId')) this.setLoopListener(data.jobId, seed)
          else this.wrong('请求分析错误', 'load', seed)
        },
        error: (error) => {
          this.wrong(error, 'load', seed)
          this.analysisDisable = false;
        }        
      })
    },
    setLoopListener(key, seed) {
      setTimeout(() => {
        if(!this.ajaxIndex.hasOwnProperty(seed)) return
        $.ajax({
          url: appconfig.gisResource.shutOff_valve_analysis.config[0].url + "/jobs/" + key + '?f=pjson',
          type: 'GET',
          success: (data) => {
            data = JSON.parse(data)
            if(data.error) this.wrong(data.error.message, 'load')
            switch(data.jobStatus) {
              case 'esriJobSucceeded':
                this.getResurlt(key, data.results, seed)
                break
              case 'esriJobExecuting':
                this.setLoopListener(key, seed)
                break
              case 'esriJobFailed':
                this.wrong('分析失败 请尝试重新分析', 'load', seed)
                break
            }
          },
          error: (error) => this.wrong(error, 'load', seed)
        })
      }, 1500)
    },

    /**
    * 获取分析结果
    */    
    getResurlt(key, results, seed) {
      $.ajax({  //结果
        url: appconfig.gisResource.shutOff_valve_analysis.config[0].url + "/jobs/" + key + '/' + results.summary.paramUrl + '?f=pjson',
        type: 'GET',
        success: (data) => {
          if(!this.ajaxIndex.hasOwnProperty(seed)) return
          data = JSON.parse(data)
          if(data.value.code == 10000){
            this.laterData = []
            //加载管线
            this.loadPipe(key, results.outputpipe.paramUrl, seed)
            //加载管点
            this.loadPoint(key, results.outputpoint.paramUrl, seed)
          } else {
            //this.wrong(data.value.message + '\n' + data.value.error, 'load', seed)
            this.wrong('关阀分析成功！关闭选中的阀门不影响供水。');
            this.analysisDisable = false;
          }
        },
        error: (error) => this.wrong(error, 'load')
      })
    },
    
    loadPipe(key, url, seed) {      
      $.ajax({  //结果
        url: appconfig.gisResource.shutOff_valve_analysis.config[0].url + "/jobs/" + key + '/' + url + '?f=pjson',
        type: 'GET',
        success: (data) => {
          if(!this.ajaxIndex.hasOwnProperty(seed)) return
          if(this.ajaxIndex[seed] == 2) delete this.ajaxIndex[seed] 
          else this.ajaxIndex[seed] += 1
          data = JSON.parse(data)
          if(this.resultPipes.length) {
            this.mapView.graphics.removeMany(this.resultPipes)
            this.resultPipes = []
          }
          var pipes = []
          var graphic = this.mapView.TF_graphic
          var sp = this.mapView.spatialReference
          var extent = { xmin: Infinity, ymin: Infinity, xmax: -Infinity, ymax: -Infinity, spatialReference: this.mapView.spatialReference }
          var tableRow = []
          var tableRowIndex = {}
          for(let i=0,il = data.value.features,ii=il.length;i<ii;i++) {
            var att = il[i].attributes
            if(tableRowIndex.hasOwnProperty(att.layerdbname)) {
              var row = tableRowIndex[att.layerdbname]
              row.value += att.Shape_Length
              row.featureIds.push(att.sourceoid)
            } else {
              tableRow.push({name: att.layerdbname, value: att.Shape_Length, isLength: true, featureIds: [att.sourceoid] })
              tableRowIndex[att.layerdbname] = tableRow[tableRow.length - 1]
            }
            var fea = new graphic({
              geometry: { type: 'polyline', paths: il[i].geometry.paths, spatialReference: sp},
              symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "4px" } }
            })
            pipes.push(fea)
            fea = fea.geometry.extent
            if(fea.xmin < extent.xmin) extent.xmin = fea.xmin
            if(fea.ymin < extent.ymin) extent.ymin = fea.ymin
            if(fea.xmax > extent.xmax) extent.xmax = fea.xmax
            if(fea.ymax > extent.ymax) extent.ymax = fea.ymax
          }
          if(pipes.length != 0 && extent.xmin != Infinity) {
            this.cacheExtent = this.mapView.extent = extent
            this.$nextTick(() => this.mapView.zoom--)
          }
          this.mapView.graphics.addMany(this.resultPipes = pipes)
          this.analysisDisable = false
          this.resultDisable = false
          this.$message.success('分析成功！')
          this.ractSelect = true
          this.laterData.push(...tableRow)
        },
        error: (error) => this.wrong(error, 'load', seed)
      })
    },
    loadPoint(key, url, seed) {
      $.ajax({  //结果
        url: appconfig.gisResource.shutOff_valve_analysis.config[0].url + "/jobs/" + key + '/' + url + '?f=pjson',
        type: 'GET',
        success: (data) => {
          if(!this.ajaxIndex.hasOwnProperty(seed)) return
          if(this.ajaxIndex[seed] == 2) delete this.ajaxIndex[seed] 
          else this.ajaxIndex[seed] += 1
          data = JSON.parse(data)
          
          if(this.resultPoints.length) {
            this.mapView.graphics.removeMany(this.resultPoints)
            this.resultPoints = []
          }
          var points = []
          var graphic = this.mapView.TF_graphic
          var sp = this.mapView.spatialReference
          var tableRow = []
          var tableRowIndex = {}
          for(let i=0,il = data.value.features,ii=il.length;i<ii;i++) {
            var att = il[i].attributes
            if(tableRowIndex.hasOwnProperty(att.layerdbname)) {              
              var row = tableRowIndex[att.layerdbname]
              row.value++
              row.featureIds.push(att.sourceoid)
            } else {
              tableRow.push({name: att.layerdbname, value: 1, isLength: false, featureIds: [att.sourceoid] })
              tableRowIndex[att.layerdbname] = tableRow[tableRow.length - 1]
            }
            var geo = il[i].geometry;
            if(il[i].attributes&&il[i].attributes.mustshut&&il[i].attributes.mustshut==1){
              points.push(new graphic({
                id: 'burst/' + att.sourceoid,
                geometry: { type: 'point', x: geo.x, y: geo.y, spatialReference: sp},
                symbol: { type: 'simple-marker', color: [0, 255, 255,0.5], size: 8, outline: { color: [255,99,71], width: 2 } }
              }))
            }else{
              points.push(new graphic({
                id: 'burst/' + att.sourceoid,
                geometry: { type: 'point', x: geo.x, y: geo.y, spatialReference: sp},
                symbol: { type: 'simple-marker', color: [0, 255, 255,0.5], size: 8, outline: { color: [51, 133, 255], width: 2 } }
              }))
            }
          }
          this.laterData.push(...tableRow)
          this.mapView.graphics.addMany(this.resultPoints = points)
        },
        error: (error) => this.wrong(error, 'load', seed)
      })
    },
    showLayer(row) {
      var name = this.layerIndex[row.name].layername
      var id
      var mapview = this.mapView = this.$attrs.data.mapView
      for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        if(!il[i].url) continue     
        for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
          if(jl[j].title != name) continue
          id = jl[j].id
          break
        }
        if(id) break
      }
      if(mapview.TF_resultFeatures) {
        mapview.TF_resultFeatures.load(row.featureIds, id, 'OffAnalysis')
      } else {
        this.$store.dispatch('map/changeMethod', 
          { pathId: 'queryResult3', widgetid: 'HalfPanel', label: '查询结果', param: {
            oids: row.featureIds,
            layer: id,
            showId: 'OffAnalysis'
          } })
      }
    },
    wrong(error, type, seed) {
      if(seed && this.ajaxIndex.hasOwnProperty(seed)) delete this.ajaxIndex[seed]
      if(error) this.$message.error(error)
      switch(type) {
        case 'choose': 
          this.chooseDisable = false
          // this.$refs.chooseLoad.style.display = 'none'
          break
        case 'load':
          this.analysisDisable = false
          break
      }
    },    
    selectChange(select, row) {
      let select2=[].concat(select);
      if(row) row.select = !row.select 
      else {
        select = select.length != 0      
        for(let i=0,il=this.featureData,ii=il.length;i<ii;i++) {
          il[i].select = select
        }
      };
      if(row){
        let index=select2.findIndex(item=>{return item.oid==row.oid});
        if(index!=-1){
          this.rectIdIndex[row.oid].geo.symbol = { type: 'simple-marker', color: [199,21,133], size: 12, outline: { color: [199,21,133], width: 4 } }
          this.rectIdIndex[row.oid].geo.isSelect=true;
        }else{
          this.rectIdIndex[row.oid].geo.symbol = { type: 'simple-marker', color: [255, 180, 44], size: 10, outline: { color: [255, 44, 44], width: 2 } }
          this.rectIdIndex[row.oid].geo.isSelect=false;
        }
      }else{
        if(select2.length>0){
          for(let item in this.rectIdIndex){
            this.rectIdIndex[item].geo.symbol = { type: 'simple-marker', color: [199,21,133], size: 12, outline: { color: [199,21,133], width: 4 }}
            this.rectIdIndex[item].geo.isSelect=true;
          }
        }else{
          for(let item in this.rectIdIndex){
            this.rectIdIndex[item].geo.symbol = { type: 'simple-marker', color: [255, 180, 44], size: 10, outline: { color: [255, 44, 44], width: 2 }}
            this.rectIdIndex[item].geo.isSelect=false;
          }
        }
      }
    },
    clearAll(isDeleteQuery) {
      var mapView = this.mapView
      this.resultDisable = false
      mapView.graphics.removeMany([...this.resultPipes, ...this.resultPoints])
      this.resultPipes = this.resultPoints = []
      this.laterData = []  
      this.analysisDisable = this.ractSelect = false
      this.ajaxIndex = {}
      if(isDeleteQuery) {
        var feas = []
        this.rectIdIndex = []
        for(let i=0,il=this.featureData,ii=il.length;i<ii;i++) {
          feas.push(il[i].geo)
        }
        mapView.graphics.removeMany(feas)
        this.featureData = []
      }
    },
    showReport() {
      this.burstDialogVisiable = true
      this.outDisable = true
      var reportMap = this.reportMap
      var soluteMap = this.soluteMap
      var reportDiv = this.$refs.reportMap
      var soluteDiv = this.$refs.subMap
      var Graphic = this.mapView.TF_graphic
      this.$nextTick(() => {
        this.$refs.burstPipeMap.appendChild(reportDiv)
        this.$refs.userMap.appendChild(soluteDiv)
        reportDiv.style.display = soluteDiv.style.display = ''        
        soluteMap.graphics.removeAll()   
        reportMap.graphics.removeAll() 
        var feas = []
        for(var i=0,il=this.resultPipes.concat(this.resultPoints),ii=il.length;i<ii;i++) {        
          feas.push(new Graphic({
            geometry: il[i].geometry.clone(),
            symbol: il[i].symbol.clone(),
          }))
        }
        var queryFeas = []
        for(var i=0,il=this.featureData,ii=il.length;i<ii;i++) {        
          var fea = il[i]
          if(!fea.select) continue
          queryFeas.push(new Graphic({
            geometry: fea.geo.geometry,
            symbol: fea.geo.symbol,
          }))
        }
        reportMap.graphics.addMany(queryFeas)
        soluteMap.graphics.addMany(feas)        
        soluteMap.extent = reportMap.extent = this.cacheExtent        
        this.$nextTick(() => {
          reportMap.scale *= 2
          soluteMap.scale *= 2
        })
        this.loadUser()
      })
      var baselayer 
      for(let i=0,il=this.mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        if(!il[i].url) continue     
        baselayer = il[i]
        break
      }
      var last1 = false
      reportMap.whenLayerView(baselayer).then((layerView) => {
        this.isOk1 = layerView.watch('updating', (e) => {
          if(e || last1 != true) return last1 = e
          this.isOk1.remove()
          this.isOk1 = undefined
          shot(reportMap, this.$refs.burstPipeMap, reportDiv)
        })
      })
      var last2 = false
      soluteMap.whenLayerView(baselayer).then((layerView) => {
        this.isOk2 = layerView.watch('updating', (e) => {     
          if(e || last2 != true) return last2 = e
          this.isOk2.remove()
          this.isOk2 = undefined
          shot(soluteMap, this.$refs.userMap, soluteDiv)
        })
      })
      var time = 0
      var shot = (view, div, child) => {
        view.takeScreenshot({ format: 'png', quality: 50 }).then((img) => {//, area: minExtent
          div.removeChild(child)
          div.innerHTML += '<img src="' + img.dataUrl + '" style="width:100%;height:100%"/>'
          if(++time == 2) this.outDisable = false
        })
      }
    },
    loadUser() {
      this.userResult(false, (ids => {
        request({ url: '/gis/customDisplay/stopArea?valves=' + ids + 
          '&current=1&size=300' , method: 'get' }).then(res => {
          if(res.code == 1) {
            this.userData = res.result.records
          } else this.$message('影响用户加载失败：' + res.message)
        })
      }))
    },
    loadReportMap() {
      var divForPipe = this.$refs.reportMap
      var divForSolute = this.$refs.subMap
      var mapView = this.mapView
      loadModules(['esri/views/MapView'], { url: esriConfig.baseUrl }).then(([MapView]) => {
        const reportMapView = new MapView({
          container: divForPipe,
          map: mapView.map
        })
        const sujectMapView = new MapView({
          container: divForSolute,
          map: mapView.map
        })
        this.reportMap = reportMapView
        this.soluteMap = sujectMapView
        sujectMapView.container.children[0].children[0].style.pointerEvents = 
        reportMapView.container.children[0].children[0].style.pointerEvents = 'none'
        reportMapView.ui.components = sujectMapView.ui.components = []
        sujectMapView.constraints.lods = reportMapView.constraints.lods = mapView.constraints.lods
      })
    },
    closeUserList(){
      this.$store.dispatch('map/handelClose',{
          box:'HalfPanel',
          pathId: 'userWaterWatchResult',
          widgetid: 'HalfPanel'
      })
    },
    userResult(bool, callback) {
      this.resultDisable = true
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" +               
          // this.layerIndex['TF_JSJS_VALVE_B'].layerid + "/query",
          this.layerIndex['TF_JSJS_PIPE_B'].layerid + "/query",
        type: 'POST',
        data: {
          // objectIds: this.laterData.filter(e => e.name == "TF_JSJS_VALVE_B")[0].featureIds.join(','),
          objectIds: this.laterData.filter(e => e.name == "TF_JSJS_PIPE_B")[0].featureIds.join(','),
          outFields: 'SID',
          returnGeometry: false,
          f: 'pjson'
        },  
        success: (data) => {
          data = JSON.parse(data)
          if(!data.error) {
            if(bool) {
              this.closeUserList();
              this.$store.dispatch('map/changeMethod', {
                pathId: 'userWaterWatchResult',
                widgetid: 'HalfPanel',
                label: '受影响客户结果列表',
                param: {
                  sid: data.features.map(e => e.attributes.SID),
                  mapView: this.mapView
                }
              })
            } else {
              if(callback) callback(data.features.map(e => e.attributes.SID))
            }
          }
          else this.$message.error('查询阀门错误：' + data.error)          
          this.resultDisable = false
        },
        error: (error) => { console.log(error) }
      })
    },
  },
  
  destroyed() {
    var geo = []
    for(var i=0,il=this.featureData,ii=il.length;i<ii;i++) 
      geo.push(il[i].geo)
    var view = this.mapView
    var draw = view.TF_draw
    view.container.style.cursor = ''
    view.graphics.removeMany([...geo, ...this.resultPipes, ...this.resultPoints])
    view.container.style.cursor = ''
    if(draw.activeAction) draw.reset()
    if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('OffAnalysis')
  }
}
</script>
