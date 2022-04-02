<template>
  <!-- 查询统计---综合查询 -->
  <div style="padding: 0 8px;overflow-y:auto;">    
    <tf-legend class="legend_dept" label="图层名称" isopen="true" title="选择将要进行查询的图层。">
      <el-select v-model="layerId" placeholder="请选择">
        <el-option v-for="item in layersAtt" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="图层字段" isopen="true" title="选择将要查询的字段。">
      <ul class="sqlQueryUl" style="height: 150px" v-loading="attLoading">
        <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 1, true)" >{{ item.label }}</li>
        <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
             v-if="!analysisAtt.length">{{layerId ? '图层无字段' : '请选择图层查询字段'}}</span>
      </ul>
    </tf-legend>
    <tf-legend class="legend_dept" label="构造查询语句" isopen="true" title="查询条件的计算逻辑，及图层属性字段对应的唯一值。">
      <div style="width: 100%">
        <div style="width: 130px; float: left">
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('=', 2)" style="width:56px">＝</el-button>
            <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
          </div>
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('>', 2)" style="width:56px">＞</el-button>
            <el-button size="mini" type="primary" plain @click="addText('<', 2)" style="width:56px">＜</el-button>
          </div>
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('<>', 3)" style="width:56px">≠</el-button>
            <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
          </div>
          <div>
            <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
            <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
          </div>
        </div>
        <div style="width: calc(100% - 130px); float: right">
          <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
            <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
                  v-if="!layerFix.length">请选择字段</span>
          </ul>
        </div>
      </div>
    </tf-legend>
    <tf-legend class="legend_dept" label="组合查询条件" isopen="true" style="clear: both" title="选择字段、属性及构造语句组合成查询过滤的语句，通过构建的条件过滤数据。">    
      <el-input v-model="queText" ref="textBox" type="textarea" :rows="3" placeholder="请输入查询过滤条件，如:OBJECTID > 0"/> 
      <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{queTextName}}</label>
      <tf-legend class="legend_dept" label="空间过滤条件" isopen="true" title="点击按钮，在地图上绘制范围，以绘制范围为空间过滤进行查询。">
        <el-row style="margin-bottom: 8px">
          <el-button size="mini" type="primary" @click="drawRect">绘制范围</el-button>
          <el-button size="mini" type="primary" @click="clearRect">清除范围</el-button>
        </el-row>
      </tf-legend>
      <el-button size="mini" type="primary" style="width:100%;display:block;" @click="queryResult" :disabled="analysisDisable">
        <i v-if="analysisDisable" class="el-icon-loading"/>查询</el-button>
      <el-button size="mini" type="primary" style="width:100%;display:block;margin-left: 0;margin-top:8px;" @click="clearAll">清空</el-button>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询结果" isopen="true" title="显示查询统计结果。">
      <el-table :data="finalData" stripe style="width: 100%">
        <el-table-column prop="name" label="图层" width="80px"/>
        <el-table-column prop="value" label="数量(个)"/>
        <el-table-column prop="length" label="长度(m)">
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="50px">
          <template slot-scope="scope">
            <el-link type="primary" @click="rowC(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from "@/views/zhpt/common/Legend";
import { loadModules } from 'esri-loader'
// import { stuffWorkTimeStatistic } from '../../wxreportforms/api/reportFormApis';
export default {
  name: "QueryForSQL",
  components: { tfLegend },
  props: {
    param: Object
  },
  data() {
    return {
      attLoading: false,
      fixLoading: false,
      layerId: '',
      queText: "",
      queTextName:'',
      layersAtt: [],
      analysisAtt: [],
      layerFix: [],
      panel: {
        pathId: "queryResult3",
        widgetid: "HalfPanel",
        label: "查询结果",
        param: {},
      },
      finalData: [],
      Extent:null,
      analysisDisable: false,
      queryLayer:null,
    }
  },
  computed: { 
    sidePanelOn() { return this.$store.state.map.P_editableTabsValue } 
  },
  watch: {
    layerId(e) {
      if(!e) return
      let seed = new Date().getTime()
      this.layerLoadSeed = seed
      this.analysisAtt = []
      this.attLoading = true
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + e + "/?f=pjson",
        type: 'GET',
        success: (data) => {
          if(this.layerLoadSeed != seed) return
          this.attLoading = false
          this.layerLoadSeed = undefined
          data = JSON.parse(data).fields
          if(!data) return this.$message.error('图层信息获取失败')
          this.analysisAtt = data.map((df) => { return { value: df.name, label: df.alias } })
        },
        error: (error) => this.$message.error(error)
      })
    },
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'queryForSQL') {
        this.$nextTick(() => {
          this.printRect.visible = true
        })  
      } 
      if(oldTab == 'queryForSQL') {
        this.printRect.visible = false
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) draw.reset()
        view.container.style.cursor = ''
      }
    },
    queText(newValue,oldValue){
      if(newValue.length < oldValue.length || newValue=="") this.queTextName = '';
    }
  },
  mounted: function () {
    var that = this
    this.initLoad()
    this.mapView = this.$attrs.data.mapView
    var layerIndex = this.layersIndex = {}
    this.printRect = new this.mapView.TF_graphic({
      geometry: { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "1px" } }
    })
    this.mapView.graphics.add(this.printRect)
    $.ajax({
      url: appconfig.gisResource.business_map.config[0].url + "/?f=pjson",
      type: 'GET',
      success: function(data) {
        data = JSON.parse(data).layers
        var tId = [];
        for(let i=0,ii=data.length;i<ii;i++){
          var layer = data[i]
          // if([0, 16, 17].indexOf(layer.id) < 0){
          //   tId.push({ value: layer.id, label: layer.name })
          //   layerIndex[layer.id] = layer.name
          // }
          if(layer.parentLayerId != -1){
            tId.push({ value: layer.id, label: layer.name })
            layerIndex[layer.id] = layer.name
          }
        }
        that.layersAtt = tId
      },
      error: (error) => { console.log(error) }
    })
    this.finalCheck = undefined
  },
  methods: {
    initLoad() {
      loadModules([
        'esri/Map', 'esri/views/MapView',
        'esri/layers/WebTileLayer', 'esri/Basemap',
        'esri/layers/TileLayer', 'esri/layers/MapImageLayer',
        'esri/layers/support/LOD', 'esri/config', 'esri/layers/GraphicsLayer',
        'esri/Graphic', 'esri/views/draw/Draw', 'esri/geometry/geometryEngine', 'esri/geometry/Extent'
      ], { url: esriConfig.baseUrl }
      ).then(([Map, MapView, WebTileLayer, Basemap, TileLayer, MapImageLayer, Lod, mapConfig, GraphicsLayer, Graphic, Draw, GeometryEngine, Extent]) => {
        this.Extent = Extent;
      })
    },
    getAtt: function(field) {
      let seed = new Date().getTime()
      this.attLoadSeed = seed
      this.fixLoading = true
      $.ajax({
        url: appconfig.gisResource.fieldUniqueValue.config[0].url,
        type: 'POST',
        data: {
          usertoken: appconfig.usertoken,
          layerid: this.layerId,
          field_name: field,
          f: 'pjson'
        },
        success: (data) => {
          if(this.attLoadSeed != seed) return
          this.fixLoading = false
          this.attLoadSeed = undefined
          data = JSON.parse(data)
          if(data.code != 10000) return this.$message.error('图层字段获取失败')
          this.layerFix = data.result.rows
          if(data.result.rows.length == 0) this.$message.error('字段无唯一值')
        },
        error: (error) => this.$message.error(error)
      })
    },
    addText: function (text, length, isField) {   
      this.languageChange(text, length, isField);
      var myField = this.$refs.textBox.$refs.textarea
      var startL = myField.selectionStart
      this.queText =
        this.queText.substring(0, startL) +
        text +
        this.queText.substring(myField.selectionEnd, myField.value.length);
      myField.blur();
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length;
        myField.focus();
      });
      if(isField) this.getAtt(text.replace(/(\s*$)/g,""))
    },
    languageChange(text, length, isField){
      if(isField){
        const field = this.analysisAtt.find(item => item.value === text.replace(' ',''));
        const fname = field ? field.label : text;
        this.queTextName = this.queTextName +  fname;
      }
      else{
        if(text.indexOf('=') != -1) text = '等于';
        if(text.indexOf('like') != -1) text = '中存在';
        if(text.indexOf('>') != -1) text = '大于';
        if(text.indexOf('<') != -1) text = '小于';
        if(text.indexOf('<>') != -1) text = '不等于';
        if(text.indexOf('and') != -1) text = '并且';
        if(text.indexOf('or') != -1) text = '或者';
        if(text.indexOf('%') != -1) text = '占位';
        this.queTextName = this.queTextName +  text;
      }
    },
    drawRect: function() {
      var view = this.mapView
      var sp = view.spatialReference
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.TF_drawPolygon(() => {view.container.style.cursor = 'crosshair'}, () => {}, 
      (evt) => {
        var v = evt.vertices
        if (v.length > 1)
          this.printRect.geometry = {
            type: 'polygon', rings: v, spatialReference: sp
          } 
      }, () => {
        this.haveRect = true
        draw.reset()
        view.container.style.cursor = ''
      })
    },

    clearRect: function () {      
      this.haveRect = false
      var view = this.mapView
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      this.printRect.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: view.spatialReference }
      view.container.style.cursor = ''
    },

    clearAll() {
      this.layerId = ''
      this.analysisAtt = []
      this.layerFix = []
      this.queText = ''
      this.seed = undefined
      var view = this.mapView
      if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('QueryForSQL')
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      this.printRect.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: view.spatialReference }
      view.container.style.cursor = ''
      this.haveRect = false
      this.finalData = [];
      let mapView =this.$attrs.data.mapView;
      if(this.queryLayer) mapView.map.remove(this.queryLayer);
    },
    
    /**
    * 点击查询事件
    */
    queryResult() {
      let seed = new Date().getTime()
      this.seed = seed
      this.analysisDisable = true
      var queText = this.queText.replace(/^\s*|\s*$/g,"")
      var geo = this.haveRect ? JSON.stringify(this.printRect.geometry.toJSON()) : undefined
      var layer = this.layerId
      if(!layer) this.$message.error('请选中图层')
      var outFields = 'OBJECTID', hasPipe;
      //if(hasPipe = [13, 14].indexOf(layer) > 0) outFields += ',PIPELENGTH'
      let layerCurr = this.layersAtt.find(item => item.value == this.layerId);
      if(layerCurr && (layerCurr.label == '管线' || layerCurr.label == '立管')){
        outFields += ',PIPELENGTH';
        hasPipe = true;
      }
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + layer + "/query",
        type: 'POST',
        data: {
          where: queText || '1=1',
          geometry: geo,
          geometryType: geo == '' ? undefined : 'esriGeometryPolygon',
          outFields: outFields,
          f: 'pjson'
        },  
        success: (data) => {
          if(this.seed != seed) return
          //查询中图标状态隐藏
          this.analysisDisable = false
          data = JSON.parse(data)
          if(data.hasOwnProperty('error')) {
            this.finalData = []
            switch(data.error.code) {
              case 400: 
                return this.$message.error('SQL查询语句出错')
              default: 
                return this.$message.error(data.error.message)
            }
          }
          if(data.features.length < 1) return this.$message("无查询结果")
          var dataTable = this.panel.param.dataTable = []
          dataTable.push({
            tableIndex: layer,
            tableName: this.layersIndex[layer]
          })
          var oids = []
          var n = 0, l = 0
          
          for(var i=0,il=data.features,ii=il.length;i<ii;i++) {
            var att = il[i].attributes
            oids.push(att.OBJECTID)
            n += 1
            if(hasPipe) l += parseFloat(att.PIPELENGTH)
          }
          this.$message('返回结果：' + n + '条')
          this.finalData = [{ name: this.layersIndex[layer], value: n, length: l}]
          this.panel.param = {
            oids: oids,
            layer: layer
          }
          this.showAllHighlight(data);
        },
        error: (error) => { console.log(error) }
      })
    },

    rowC: function () {
      var mapview = this.mapView
      var param = this.panel.param
      if(mapview.TF_resultFeatures) {
        mapview.TF_resultFeatures.load(param.oids, param.layer, 'QueryForSQL')
      } else {
        param.showId = 'QueryForSQL'
        this.$store.dispatch("map/changeMethod", this.panel)
      }
    },

    /**
     * describe 查询到的数据高亮 2021-11-24 add by tmx
    */
    showAllHighlight(data){
      let mapView =this.$attrs.data.mapView;
      let sp = mapView.spatialReference;
      let paths = [];
      let maxExtent = null;
      if(this.queryLayer) mapView.map.remove(this.queryLayer);
      this.queryLayer = new mapView.TF_graphicsLayer();
      let geometryType = data.geometryType;  //esriGeometryPoint、esriGeometryLine、esriGeometryPolygon
      mapView.map.add(this.queryLayer);
      if(!data || !data.hasOwnProperty('features')) return;
      let features = [];
      data.features.forEach(feature => {
        let graphic = null;
        if(geometryType == "esriGeometryPoint" ){
          graphic = new mapView.TF_graphic({ 
            geometry:  { type: 'point', x: feature.geometry.x, y: feature.geometry.y, spatialReference: sp },
            symbol: { type: 'simple-marker', color: [80, 187, 121], size: 12, outline: { color: [80, 187, 121], width: 0 }}
          });
          paths.push([feature.geometry.x,feature.geometry.y])
        }
        //如果为面
        if(geometryType == "esriGeometryPolygon" ){
          graphic = new mapView.TF_graphic({
            geometry: { type: 'polyline', paths: feature.geometry.rings, spatialReference: sp},
            symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [80, 187, 121, 1], width: "3px" } }
          });
          maxExtent = maxExtent == null ? graphic.geometry.extent : maxExtent
          maxExtent = this.computerExtent(maxExtent,graphic.geometry.extent);
        }
        //如果为线
        if(geometryType == "esriGeometryPolyline" ){
          graphic = new mapView.TF_graphic({
            geometry: { type: 'polyline', paths: feature.geometry.paths, spatialReference: sp},
            symbol: { type: 'simple-fill', color: [80, 187, 121, 1], outline: { color: [80, 187, 121, 1], width: '3px' } }
          });
          maxExtent = maxExtent == null ? graphic.geometry.extent : maxExtent
          maxExtent = this.computerExtent(maxExtent,graphic.geometry.extent);
        }
        features.push(graphic);
      });
      this.queryLayer.addMany(features);
      
      if(paths.length > 1){
        // let polyline = {type: "polyline",paths: paths};
        // let graphic = new mapView.TF_graphic({geometry: polyline});
        // maxExtent = graphic.geometry.extent;
        let Extent = this.Extent;
        paths.forEach((pt,index) => {
          if(index == 0){
            maxExtent = new Extent({ 
              xmin:pt[0],
              xmax:pt[0],
              ymin:pt[1], 
              ymax:pt[1], 
              spatialReference: sp 
            })
          }
          else{
            maxExtent.xmin = maxExtent.xmin > pt[0] ? pt[0] : maxExtent.xmin;
            maxExtent.xmax = maxExtent.xmax < pt[0] ? pt[0] : maxExtent.xmax;
            maxExtent.ymin = maxExtent.ymin > pt[1] ? pt[1] : maxExtent.ymin;
            maxExtent.ymax = maxExtent.ymax < pt[1] ? pt[1] : maxExtent.ymax;
          }
        })
      }
      else if(paths.length == 1){
        mapView.center = {x: paths[0][0], y: paths[0][1], spatialReference: sp}
      }
      if(maxExtent != null){
        mapView.goTo(maxExtent)
      }
    },
    
    /**
     * 计算最大extent
    */
    computerExtent(maxExtent,extent){
      if(maxExtent.xmin > extent.xmin){
        maxExtent.xmin = extent.xmin
      }
      if(maxExtent.xmax < extent.xmax){
        maxExtent.xmax = extent.xmax
      }
      if(maxExtent.ymin > extent.ymin){
        maxExtent.ymin = extent.ymin
      }
      if(maxExtent.ymax < extent.ymax){
        maxExtent.ymax = extent.ymax
      }
      return maxExtent
    },
  },
  destroyed() {
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    view.graphics.remove(this.printRect)
    if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('QueryForSQL');
    //清除查询生成图形
    if(this.queryLayer)view.map.remove(this.queryLayer);
  }
};
</script>
