<template>
  <!-- 查询统计---综合查询 -->
  <div style="padding: 0 8px;overflow-y:auto;" class="i-scrollbar">    
    <tf-legend class="legend_dept" label="图层名称" isopen="true" title="选择将要进行查询的图层。">
      <el-select v-model="layerId" placeholder="请选择">
        <el-option v-for="item in layers" :key="item.value" :label="item.label" :value="item.value"/>
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
        <div style="width: 100%; float: left">
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('=', 2)" style="width:56px">＝</el-button>
            <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
            <el-button size="mini" type="primary" plain @click="addText('<>', 3)" style="width:56px">≠</el-button>
            <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
          </div>
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('>', 2)" style="width:56px">＞</el-button>
            <el-button size="mini" type="primary" plain @click="addText('<', 2)" style="width:56px">＜</el-button>
            <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
            <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
          </div>
        </div>
        <!-- <div style="width: calc(100% - 130px); float: right">
          <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
            <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
                  v-if="!layerFix.length">请选择字段</span>
          </ul>
        </div> -->
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
import { appconfig } from 'staticPub/config'
import tfLegend from "@/views/zhpt/common/Legend";

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { comSymbol } from "@/utils/comSymbol";
import { Polygon, LineString, Point } from 'ol/geom';
import * as turf from '@turf/turf';
import { fieldDoc } from '@/views/zhpt/common/doc'
import { getThemLayer, addThemLayer, deleteThemLayer } from '@/api/mainMap/themMap'
import { SuperMap, FieldService, FeatureService, FieldParameters } from '@supermap/iclient-ol';

export default {
  name: "QueryForSQL",
  components: { tfLegend },
  props: { data: Object },
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

      // add
      limitFeature: null, // 绘制图形
      drawer: null,
      layers: []
    }
  },
  computed: { 
    sidePanelOn() { return this.$store.state.map.P_editableTabsValue } 
  },
  watch: {
    layerId(e) {
      if(!e) return 
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      this.getServerFields(dataServer, this.layerId).then(fields => {
        if (fields) {
          this.analysisAtt = fields.map(field => {
            return { label: fieldDoc[field] || field, value: field }
          })
        } else this.$message.error("获取字段失败")
      })
    },
    sidePanelOn(newTab, oldTab) {

    },
    queText(newValue,oldValue){
      if(newValue.length < oldValue.length || newValue=="") this.queTextName = '';
    }
  },
  mounted: function () {
      let { layers, dataServer } = appconfig.gisResource["iserver_resource"]
      let netLayers = layers.filter(layer => layer.parentname === "管线")

      // 设置图层
      this.layers = netLayers.map(layer => {
        return { label: layer.name, value: layer.name }
      })

      var mapView = this.mapView = this.data.mapView

  },
  methods: {
    // 获取服务字段
    getServerFields ({ dataServiceUrl, dataSource }, dataSet) {
      return new Promise(resolve => {
        // 设置数据集，数据源
        var param = new SuperMap.FieldParameters({
          datasource: dataSource,
          dataset: dataSet
        });
        // 创建字段查询实例
        new FieldService(dataServiceUrl).getFields(param, serviceResult => {
          if (serviceResult.type === "processFailed") resolve(null) 
          else resolve(serviceResult.result.fieldNames)
        });
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
    // 绘制
    drawRect: function() {
      this.drawer = new iDraw(this.mapView, "polygon", {
        showCloser: false,
        endDrawCallBack: featrue => {
          this.limitFeature = featrue
          this.drawer.remove()
        }
      })
      this.drawer.start()
    },

    clearRect: function () {
      this.drawer && this.drawer.end()
    },

    clearAll() {
      this.layerId = ''
      this.analysisAtt = []
      this.layerFix = []
      this.queText = ''
      this.queryLayer && this.mapView.removeLayer(this.queryLayer)
      this.queryLayer = null
    },
    
    /**
    * 点击查询事件
    */
    queryResult() {
      if (!this.layerId) return this.$message.error('请选择查询图层名称')
      if (!this.queText) return this.$message.error('请选择查询图层过滤条件')

      this.queryLayer && this.mapView.removeLayer(this.queryLayer)
      this.queryLayer = null
      this.finalData = []
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      let dataSetInfo = dataServer.dataSetInfo.filter(info => info.name === this.layerId)
      
      let queryTask = new iQuery({...dataServer, dataSetInfo })
      queryTask.sqlQuery(this.queText).then(resArr => {
        if (!resArr) return this.$message.error("服务器请求失败!")

        let featruesData = resArr.filter(item => {
          return item.result.featureCount !== 0
        })
        //  添加表格数据 
        
        // 绘制图层
        if (featruesData.length !== 0) {
          this.queryLayer = this.queryLayer || createThemLayer()
          this.mapView.addLayer(this.queryLayer)

          featruesData.forEach(featrueObj => {
            let features = featrueObj.result.features.features
            let themFeatures = features.map(feature => new GeoJSON().readFeature(feature))

            let layerName = featrueObj.layerName
            // 范围限制
            if (this.limitFeature) {
              themFeatures = themFeatures.filter(feature => {
                let limitGeometry = turf.polygon(this.limitFeature.getGeometry().getCoordinates())
                let geomtry = feature.getGeometry(), inGeometry
                if (geomtry instanceof Point) {
                  inGeometry = turf.point(geomtry.getCoordinates())
                } else if (geomtry instanceof LineString) {
                  inGeometry = turf.lineString(geomtry.getCoordinates())
                } else return false
                return turf.booleanContains(limitGeometry, inGeometry)
              })
            }
            //
            this.queryLayer.getSource().addFeatures(themFeatures)
            this.addResData(layerName, themFeatures)
          })
        } else return this.$message.error("无符合过滤条件数据")
      })

      function createThemLayer () {
        return new VectorLayer({
          source: new VectorSource(),
          style: comSymbol.getAllStyle(3, "#f40", 5, "#C0DB8D")
        })
      }
    },
    addResData (layerName, features) {
      const lengthField = 'SMLENGTH'
      let sumLength = features.reduce((prev, next) => {
        return { values_: { "SMLENGTH": Number(prev.values_[lengthField] || 0) + Number(next.values_[lengthField] || 0) } }
      }, { values_: { "SMLENGTH": 0 } })
      this.finalData.push({
        name: layerName,
        value: features.length,
        length: sumLength.values_["SMLENGTH"],
        features
      })
    },

    rowC: function (row) {
      console.log('详情', row)
      let colsData = [], rowData = []
      for (let key in fieldDoc) {
          colsData.push({ prop: key, label: fieldDoc[key]})
      }
      rowData = row.features.map(fea => fea.values_ || {})
      // 测试先显示20条
      colsData.length = 15
      this.$store.dispatch('map/changeMethod', {
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
        label: '更多信息',
        param: { data: rowData, colsData }
      })
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
    this.drawer && this.drawer.end()
    this.drawer = null
     this.$store.dispatch('map/handelClose', {
      box:'HalfPanel',
      pathId: 'queryResultMore',
      widgetid: 'HalfPanel',
    });
  }
};
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .i-scrollbar {
    @include scrollBar;
  }
</style>