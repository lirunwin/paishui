<template>
  <div class="panel-container">
    <div class="op-box">
      <div class="item-head" style="margin-top:0">查询图层</div>
      <el-form label-width="70px">
        <el-form-item label="选取图层" style="margin:0">
          <el-select v-model="selectLayer" value-key="value" placeholder="请选择图层" style="width:100%" size="small"
                     @change="selectLayerChange">
            <el-option v-for="item in datasetOptions" :key="item.value" :label="item.label" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 绘制方式 -->
    <div class="op-box">
      <div class="item-head" style="margin-top:0">几何类型</div>
      <el-radio v-model="drawType" label="point">点</el-radio>
      <el-radio v-model="drawType" label="line">线</el-radio>
      <el-radio v-model="drawType" label="circle">圆</el-radio>
      <el-radio v-model="drawType" label="rect">矩形</el-radio>
      <el-radio v-model="drawType" label="polygon">多边形</el-radio>
    </div>
    <div class="op-box">
      <div class="item-head" style="margin-top:0">缓冲距离</div>
      <el-form label-width="auto">
        <el-form-item label="缓冲距离(米)" style="margin:0">
          <el-input-number size="small" v-model="bufferDistance" @blur="checkBufferDistance" controls-position="right" :step="10" :min="10"
                           style="width:100%">
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="doQuery_new" :loading="queryStatus">开始查询</el-button>
    </div>
    <!-- 查询结果 -->
    <div class="query-result">
      <el-row>
        <el-col :span="24">
          <div class="item-head">查询结果</div>
        </el-col>
        <el-col :span="24">
          <el-table :data="resultData" v-loading="queryStatus"
                    :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
            <el-table-column prop="layer" align="center" label="图层"></el-table-column>
            <el-table-column prop="number" align="center" label="数量(个)"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="showQueryResultData(scope.row.data)">查看</el-button>
                <download-excel class="export-btn" :data="scope.row.data" :fields="scope.row.fields" type="xls" :name="scope.row.layer"
                                style="display: inline;">
                  <el-button type="text" @click="beforeExport(scope.row.data)">导出</el-button>
                </download-excel>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-button type="danger" style="width:100%" size="small" @click="clearResult">清除结果 </el-button>
    </div>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import { SuperMap, FieldService, FeatureService } from '@supermap/iclient-ol';
import Draw from 'ol/interaction/Draw'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { GeoJSON, WFS } from 'ol/format';
import { getFields } from '@/api/mainMap/analysis'
import { createBox } from 'ol/interaction/Draw';
import * as turf from '@turf/turf'
import { fromCircle as circleToPolygon } from 'ol/geom/Polygon';
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { comSymbol } from '@/utils/comSymbol';
import { fieldDoc } from '@/views/zhpt/common/doc'
import { Feature } from 'ol';

export default {
  props: ['data'],
  data() {
    return {
      selectLayer: '',
      
      bufferDistance: 50,
      draw: null,
      
      
      resultData: [],
      resFeatures: [],
      queryStatus: false,

      // 
      drawType: '',
      drawer: null,
      vectorLayer: null,
      drawFeature: null,
      lightFeature: null,
      lightLayer: null
    }
  },
  computed: {
    // 图层选项
    datasetOptions() {
      const dataSetInfo = appconfig.gisResource['iserver_resource'].dataServer.dataSetInfo
      return dataSetInfo.map(item => {
        return { label: item.label, value: item.name, type: item.type }
      })
    }
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== "bufferAnalysis") this.removeAll()
    },
    drawType(val, oldVal) {
      if (!val) return
      this.initDraw()
    }
  },
  destroyed() {
    this.removeAll()
  },
  mounted() {
    this.mapView = this.data.mapView
  },
  methods: {
    removeAll () {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.mapView.removeLayer(this.vectorLayer)
      this.lightLayer && this.mapView.removeLayer(this.lightLayer)
      this.drawer = this.vectorLayer = this.lightLayer = null
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
    },
    /**
    * 初始化绘制组件
    */
    initDraw () {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.drawer = new iDraw(this.data.mapView, this.drawType, {
        endDrawCallBack: feature => {
          // console.log(feature.getGeometry().getCoordinates())
          this.drawer.remove()
          this.drawFeature = feature
        },
        showCloser: false
      })
      this.drawer.start()
    },

    doQuery_new () {
      if (!this.selectLayer) return this.$message.error('请先选择要分析的图层!')
      if (!this.drawFeature) return this.$message.error('请先绘制缓冲区图形!')
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      let dataSetInfo = [{ name: this.selectLayer.value }]

      if (!this.vectorLayer) {
        this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(3, '#f40', 5, '#00FFFF') })
        this.mapView.addLayer(this.vectorLayer)
      }
      let bufferFeature = this.getBufferFeature(this.drawFeature)
      this.vectorLayer.getSource().addFeature(bufferFeature)

      new iQuery({ dataSetInfo }).spaceQuery(bufferFeature).then(resArr => {
        console.log("空间查询信息", resArr)
        let tableData = []
        resArr.forEach(res => {
          if (res.result.featureCount !== 0) {
            let featuresJson = res.result.features
            let features = new GeoJSON().readFeatures(featuresJson)
            this.vectorLayer.getSource().addFeatures(features)
            tableData.push({ name: res.layerName, data: features.map(fea => fea.values_) })
          }
        })
        this.addTableData(tableData)
      })
    },

    addTableData (data) {
      let keys = Object.keys(fieldDoc)
      keys.length = 15
      let fields = {}
      keys.forEach(key => {
        fields[fieldDoc[key]] = key
      })
      this.resultData = data.map(item => {
        return { 
          layer: item.name, 
          number: item.data.length,
          data: item.data,
          fields
        }
      })
    },

    checkBufferDistance() {
      if (!this.bufferDistance) { this.bufferDistance = 50 }
    },


    /**
     * 选择图层
     */
    selectLayerChange() {
      // 
    },
    /**
     * 要素缓冲
     */
    getBufferFeature(drawFeature) {
      let geometry = drawFeature.getGeometry()
      let fea = null
      if (this.drawType == 'point') { fea = turf.point(geometry.getCoordinates()) } // turf的点要素
      else if (this.drawType == 'line') { fea = turf.lineString(geometry.getCoordinates()) } // turf的线要素
      else if (this.drawType == 'circle') { fea = turf.polygon(circleToPolygon(geometry).getCoordinates()) }
      else { fea = turf.polygon(geometry.getCoordinates()) } // turf的面要素
      let resultFeature = new GeoJSON().readFeature(turf.buffer(fea, this.bufferDistance / 1000, { units: 'kilometers' }))
      resultFeature.setStyle(new Style({
        stroke: new Stroke({
          color: '#0099ff',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255,0.6)'
        }),
      }))
      // this.vectorLayer.getSource().addFeature(resultFeature)
      return resultFeature
    },
    /**
     * 开始查询
     */
    doQuery() {
      this.queryStatus = true // 开始执行
      // 利用truf生成的缓冲区
      let buffer = this.getBufferFeature()
      this.vectorLayer.getSource().clear()
      this.vectorLayer.getSource().addFeature(this.drawFeature)
      this.vectorLayer.getSource().addFeature(buffer)
      // 
      let param = new SuperMap.GetFeaturesByGeometryParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        geometry: buffer.getGeometry(),
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':' + this.selectLayer.value],
        spatialQueryMode: "INTERSECT" // 相交空间查询模式
      })
      const url = mapConfig.iServerUrl.pipelineDataServer.url
      new FeatureService(url).getFeaturesByGeometry(param, serviceResult => {
        console.log("缓冲查询结果", serviceResult)
        this.delQueryResult(serviceResult)
      })
    },
    /**
     * 处理返回的结果
     */
    delQueryResult(serviceResult) {
      if (serviceResult.type == "processFailed") {
        this.$message.error('获取结果失败！')
        this.queryStatus = false
        return
      }
      //获取返回的features数据
      let features = serviceResult.result.features.features
      if (features.length >= 0) {
        this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(serviceResult.result.features))
        this.resFeatures = features.map(item => {
          item.properties['geometry'] = item.geometry; return item.properties
        })
        // 导出的字段信息
        let fields = {}
        if (this.selectLayer.type == 'line')
          this.$store.state.common.PipeLineFields.forEach(item => {
            fields[item.pipelineVal] = item.pipelineKey
          });
        else {
          this.$store.state.common.PipePointFields.forEach(item => {
            fields[item.pipelineVal] = item.pipelineKey
          });
        }
        // 查询的结果
        this.resultData = [{
          layer: this.selectLayer.label,
          number: serviceResult.result.featureCount,
          data: this.resFeatures,
          fields: fields
        }]
        // console.log(this.jsonFields,this.tableData, this.resultData)

      } else {
        this.$message.info('未查询到结果！');
      }
      this.queryStatus = false // 查询完成状态
    },
    beforeExport(data) {
      if (data.length == 0) this.$message.warning('无数据导出！')
    },
    clearResult() {
      this.vectorLayer.getSource().clear()
      this.drawFeature = null
      this.resultData = []
      this.drawType = ''
      this.selectLayer = ''
    },
    /**
     *  展示查询结果
     */
    showQueryResultData(data) {
      if (data.length === 0) return 
      let colsData = []
      for (let key in fieldDoc) {
        colsData.push({ prop: key, label: fieldDoc[key]})
      }
      colsData.length = 15
      this.$store.dispatch('map/changeMethod', {
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
        label: '详细信息',
        param: { data, colsData, rootPage: this }
      })
      
    },
    gotoGeometry (geometry) {
      console.log("定位")
      if (!this.lightLayer) {
        this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(3, '#f40', 5, '#FFFFB6') })
        this.lightLayer.setZIndex(999)
        this.mapView.addLayer(this.lightLayer)
      }
      this.lightLayer.getSource().clear()
      this.lightFeature = new Feature({ geometry })
      this.lightLayer.getSource().addFeature(this.lightFeature)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
</style>