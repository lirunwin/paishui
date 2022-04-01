<template>
  <div style="padding: 0 8px;overflow-y:auto;">
    <tf-legend class="legend_dept" label="选取管线" isopen="true" title="点击按钮，然后到地图上点击选择需要分析的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="choosePipe" :disabled="chooseDisable">
          <i ref="chooseLoad" style="display:none;" class="el-icon-loading"/>选取管线</el-button>
      </el-row>
      <el-col :span="24">
        <el-table :data="featureData" stripe style="width: 100%" max-height="200px" row-class-name="selectRowC" @row-click="rowC">
          <el-table-column prop="oid" label="管线编号" />
          <el-table-column prop="STARTSID" label="起点编号" />
          <el-table-column prop="ENDSID" label="终点编号" />
        </el-table>
      </el-col>
      <el-row style="padding-top: 8px; clear: both;">
        <el-checkbox v-model="isApplystop" style="margin-right: 4px;float:right;">使用障碍图层</el-checkbox>
      </el-row>
      <el-row style="padding-top: 8px;">
        <el-button size="mini" type="primary" style="width: 100%" @click="analysis" :disabled="analysisDisable">
          <i ref="analysisLoad" style="display:none;" class="el-icon-loading"/>开始分析</el-button>
      </el-row>
    </tf-legend>
    <div id="Legend" class="Legend">
      <div class="label" @click="openstate = !openstate">分析结果
        <el-tooltip class="item" effect="dark" content="分析的结果展示。将会自动在地图上高亮显示结果，点击查看更多可显示表格。" placement="right">
          <i ref="info" class="el-icon-info" />
        </el-tooltip><el-checkbox v-model="ractSelect" style="margin-left: 4px;">地图显示</el-checkbox>
      </div>
      <div v-show="openstate" class="content">
        <el-table :data="laterData" stripe style="width: 100%">
          <el-table-column prop="name" label="图层" >
            <template slot-scope="scope">{{ layerIndex[scope.row.name] || scope.row.name }}</template>
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
      </div>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="clearAll">清除所有</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
export default {
  name: 'ConnectivityAnalysis',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      chooseDisable: false, //查询按钮禁用
      analysisDisable: false, //分析按钮禁用
      anaPipe: '', //分析管线
      ractSelect: false,  //是否分析结果地图显示
      featureData: [],
      laterData: [],
      layerIndex: {},
      openstate: true,
      isApplystop: true,
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    ractSelect(e) {
      for(let i=0,il= this.resultPipes.concat(this.resultPoints),ii=il.length;i<ii;i++) {
        il[i].visible = e
      }
    },
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'connectivityAnalysis') {
        this.$nextTick(() => {
          this.gra.visible = this.showGeo.visible = true
          var isShow = this.ractSelect
          for(var i=0,il=this.resultPipes,ii=il.length;i<ii;i++) 
            il[i].visible = isShow
          for(var i=0,il=this.resultPoints,ii=il.length;i<ii;i++) 
            il[i].visible = isShow   
        })  
      } 
      if(oldTab == 'connectivityAnalysis') {
        this.gra.visible = this.showGeo.visible = false
        for(var i=0,il=this.resultPipes,ii=il.length;i<ii;i++) 
          il[i].visible = false
        for(var i=0,il=this.resultPoints,ii=il.length;i<ii;i++) 
          il[i].visible = false   
        this.mapView.container.style.cursor = ''
        if(this.click) this.click.remove()
        this.click = undefined
      }
    }
  },
  mounted: function() {
    this.featureData = []
    var mapview = this.mapView = this.$attrs.data.mapView
    for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
      if(!il[i].url) continue     
      for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
        if(jl[j].title != '管线') continue
        this.rectUrl = jl[j].url
        break
      }
      if(this.rectUrl) break
    }
    var Graphic = mapview.TF_graphic
    this.gra = new Graphic({
      geometry: { type: 'polygon', spatialReference: mapview.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "1px" } }
    })
    this.showGeo = new Graphic({
      geometry: { type: 'polygon', spatialReference: mapview.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255, 1], width: "7px" } }
    })
    mapview.graphics.addMany([this.gra, this.showGeo])
    this.resultPipes = []
    this.resultPoints = []
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
              rows[data[i].layerdbname] = data[i].layername
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
    choosePipe() {
      if(this.click) {
        this.click.remove()
        this.click = undefined
      }
      var mapview = this.mapView
      mapview.container.style.cursor = 'pointer'
      this.click = mapview.on('click', (evt) => {     
        this.chooseDisable = true
        this.$refs.chooseLoad.style.display = '' 
        var xy = mapview.toMap({ x: evt.x, y: evt.y })   
        var x = xy.x, y = xy.y
        var r = mapview.resolution * 5, da = Math.PI / 20
        var ret = []
        var PI2 = Math.PI * 2, sin = Math.sin, cos = Math.cos
        for(let i=0;i< PI2;i+=da){
          ret.push([x + r * cos(i), y + r * sin(i)])
        }
        this.gra.geometry = { type: 'polygon', rings: [ret], spatialReference: mapview.spatialReference }
        this.query()
        mapview.container.style.cursor = ''
        this.click.remove()     
        this.click = undefined   
      })
    },
    query() {
      $.ajax({
        url: this.rectUrl + '/query',
        type: 'POST',
        data: {
          geometry: JSON.stringify(this.gra.geometry.toJSON()),
          geometryType: 'esriGeometryPolygon',
          outFields: 'OBJECTID,SID,STARTSID,ENDSID',
          f: 'pjson'          
        }, 
        success: (data) => {
          data = JSON.parse(data).features
          if(data && data.length < 1) {
            this.featureData = []
            this.anaPipe = undefined
            return this.wrong('无管线', 'choose')
          }
          var long = -1, id
          for(let i=0,ii=data.length;i<ii;i++) {
            var nd = data[i].geometry.paths[0]
            nd = [nd[0][0] - nd[1][0], nd[0][1] - nd[1][1]]
            var length = Math.sqrt(nd[0] * nd[0] + nd[1] * nd[1])
            if(length > long) id = i
          }
          var att = data[id].attributes
          this.featureData = [{ oid: att.SID, STARTSID: att.STARTSID, ENDSID: att.ENDSID, path: data[id].geometry.paths }]
          this.anaPipe = att.OBJECTID
          var path = this.featureData[0].path
          this.showGeo.geometry = { type: 'polyline', paths: path, spatialReference: this.mapView.spatialReference }
          this.wrong(undefined, 'choose')
        },
        error: (error) => this.wrong(error, 'choose')
      })
    },
    getClosetPoint(line, cood) {
      var p1 = line[0], p2 = line[1], A = p2[1] - p1[1], B = p1[0] - p2[0], C = p2[0] * p1[1] - p1[0] * p2[1];
      var p3 = [(B * B * cood[0] - A * B * cood[1] - A * C) / (A * A + B * B), (-A * B * cood[0] + A * A * cood[1] - B * C) / (A * A + B * B)];
      if (p3[0] < Math.min(p1[0], p2[0]) || p3[0] > Math.max(p1[0], p2[0])) Math.abs(p3[0] - p1[0]) > Math.abs(p3[0] - p2[0]) ? p3 = p2 : p3 = p1;
      return p3;
    },
    rowC(row) {
      var view = this.mapView
      var geo = this.showGeo
      view.goTo(geo.geometry.extent)
    },
    analysis() {
      if(!this.anaPipe) return this.$message.error('请选中需分析管线')
      this.gra.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference }
      this.analysisDisable = true
      this.$refs.analysisLoad.style.display = ''
      $.ajax({
        url: appconfig.gisResource.connected_analysis.config[0].url + "/submitJob",
        type: 'POST',
        data: {
          pipefeatureclassname: 'TF_JSJS_PIPE_B',
          pipeobjectid: this.anaPipe,
          usertoken: appconfig.usertoken,
          applystop: this.isApplystop,
          'env:outSR': "{'wkid':4490}",
          f: 'pjson'
        },  
        success: (data) => {
          data = JSON.parse(data)
          if(data.hasOwnProperty('jobId')) this.setLoopListener(data.jobId)
          else this.wrong('请求分析错误', 'load')
        },
        error: (error) => this.wrong(error, 'load')        
      })
    },
    setLoopListener(key) {
      setTimeout(() => {
        $.ajax({
          url: appconfig.gisResource.connected_analysis.config[0].url + "/jobs/" + key + '?f=pjson',
          type: 'GET',
          success: (data) => {
            data = JSON.parse(data)
            if(data.error) this.wrong(data.error.message, 'load')       
            switch(data.jobStatus) {
              case 'esriJobSucceeded':
                this.getResurlt(key, data.results)
                break
              case 'esriJobExecuting':
                this.setLoopListener(key)
                break
              case 'esriJobFailed':
                this.wrong('分析失败 请尝试重新分析', 'load')
                break
            }
          },
          error: (error) => this.wrong(error, 'load')
        })
      }, 1500)
    },
    getResurlt(key, results) {
      $.ajax({  //结果
        url: appconfig.gisResource.connected_analysis.config[0].url + "/jobs/" + key + '/' + results.summary.paramUrl + '?f=pjson',
        type: 'GET',
        success: (data) => {
          data = JSON.parse(data)
          if(data.value.code == 10000){
            this.laterData = []
            this.loadPipe(key, results.outputpipe.paramUrl)
            this.loadPoint(key, results.outputpoint.paramUrl)
          } else {
            this.wrong(results.value.message + '\n' + results.value.error, 'load')
          }
        },
        error: (error) => this.wrong(error, 'load')
      })
    },
    loadPipe(key, url) {
      $.ajax({  //结果
        url: appconfig.gisResource.connected_analysis.config[0].url + "/jobs/" + key + '/' + url + '?f=pjson',
        type: 'GET',
        success: (data) => {
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
              row.featureIds.push(att.sourceid)
            } else {
              tableRow.push({name: att.layerdbname, value: att.Shape_Length, isLength: true, featureIds: [att.sourceid] })
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
          if(pipes.length != 0 && extent.xmin != Infinity) this.mapView.extent = extent
          this.mapView.graphics.addMany(this.resultPipes = pipes)          
          this.$refs.analysisLoad.style.display = 'none'
          this.analysisDisable = false
          this.$message.success('分析成功！')
          this.ractSelect = true
          this.laterData.push(...tableRow)
          this.$nextTick(_ => this.mapView.zoom -= 1)
        },
        error: (error) => this.wrong(error, 'load')
      })
    },
    loadPoint(key, url) {
      $.ajax({  //结果
        url: appconfig.gisResource.connected_analysis.config[0].url + "/jobs/" + key + '/' + url + '?f=pjson',
        type: 'GET',
        success: (data) => {
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
              row.featureIds.push(att.sourceid)
            } else {
              tableRow.push({name: att.layerdbname, value: 1, isLength: false, featureIds: [att.sourceid] })
              tableRowIndex[att.layerdbname] = tableRow[tableRow.length - 1]
            }
            var geo = il[i].geometry
            points.push(new graphic({
              geometry: { type: 'point', x: geo.x, y: geo.y, spatialReference: sp},
              symbol: { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 } }
            }))
          }
          this.laterData.push(...tableRow)
          this.mapView.graphics.addMany(this.resultPoints = points)
        },
        error: (error) => this.wrong(error, 'load')
      })
    },
    wrong(error, type) {
      if(error) this.$message.error(error)
      switch(type) {
        case 'choose': 
          this.chooseDisable = false
          this.$refs.chooseLoad.style.display = 'none'
          break
        case 'load': 
          this.$refs.analysisLoad.style.display = 'none'
          this.analysisDisable = false
          break
      }
    },
    showLayer(row) {
      var name = this.layerIndex[row.name]
      if(name == '阀门') name = '控制阀门'
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
        mapview.TF_resultFeatures.load(row.featureIds, id, 'ConnectivityAnalysis')
      } else {
        this.$store.dispatch('map/changeMethod', 
          { pathId: 'queryResult3', widgetid: 'HalfPanel', label: '查询结果', param: {
            oids: row.featureIds,
            layer: id,
            showId: 'ConnectivityAnalysis'
          } })
      }
    },
    clearAll() {
      this.featureData = []
      this.gra.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: this.mapView.spatialReference }
      this.showGeo.geometry = { type: 'polyline', paths: [[0, 0]], spatialReference: this.mapView.spatialReference }
      this.anaPipe = undefined
      this.mapView.graphics.removeMany(this.resultPipes.concat(this.resultPoints))
      this.ractSelect = false
      this.laterData = []
    }
  },
  destroyed() {
    if(this.click) this.click.remove()
    var view = this.mapView
    view.graphics.removeMany([this.gra, this.showGeo, ...this.resultPipes.concat(this.resultPoints)])
    if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('ConnectivityAnalysis')
  }
}
</script>
