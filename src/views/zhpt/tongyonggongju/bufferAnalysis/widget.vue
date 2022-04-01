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
      <el-radio v-model="drawType" label="Point">点</el-radio>
      <el-radio v-model="drawType" label="LineString">线</el-radio>
      <el-radio v-model="drawType" label="Circle">圆</el-radio>
      <el-radio v-model="drawType" label="Box">矩形</el-radio>
      <el-radio v-model="drawType" label="Polygon">多边形</el-radio>
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
      <el-button type="primary" size="small" style="width:100%" @click="doQuery" :loading="queryStatus">开始查询</el-button>
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
                <el-button type="text" @click="showQueryResultData()">查看</el-button>
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
import { mapConfig } from '@/views/zhpt/map.config'
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
export default {
  props: ['data'],
  data() {
    return {
      selectLayer: '',
      drawType: 'Point',
      bufferDistance: 50,
      draw: null,
      drawFeature: null,
      vectorLayer: null,
      resultData: [],
      resFeatures: [],
      queryStatus: false,
    }
  },
  computed: {
    // 图层选项
    datasetOptions() {
      const dataSetInfo = mapConfig.iServerUrl.pipelineDataServer.dataSetInfo
      let datasetOptions = JSON.parse(JSON.stringify(dataSetInfo))
      return datasetOptions.map(item => {
        return { label: item.label, value: item.name, type: item.type }
      })
    }
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val == 'bufferQuery') {
        this.vectorLayer.setVisible(true)
        if (this.selectLayer) {
          // this.initDraw()
        }
      }
      else {
        this.vectorLayer.setVisible(false)
        if (this.draw) this.data.that.map.removeInteraction(this.draw)
      }
    },
    drawType(val, oldVal) {
      if (this.selectLayer) {
        this.initDraw()
      }
    }
  },
  destroyed() {
    if (this.draw) this.data.that.map.removeInteraction(this.draw)
    this.data.that.map.removeLayer(this.vectorLayer)
    this.$store.dispatch('map/delHalfPanels', 'bufferQueryResult');
  },
  mounted() {
    // 初始化显示图层
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          width: 5,
          color: '#ed1941'
        }),
        image: new Circle({
          radius: 6,
          stroke: new Stroke({
            width: 2,
            color: '#ed1941'
          }),
          fill: new Fill({
            color: '#FFF'
          })
        })
      })
    })
    this.data.that.map.addLayer(this.vectorLayer)
  },
  methods: {
    checkBufferDistance() {
      if (!this.bufferDistance) { this.bufferDistance = 50 }
    },
    /**
    * 初始化绘制组件
    */
    initDraw() {
      // this.vectorLayer.getSource().clear()
      if (this.draw) this.data.that.map.removeInteraction(this.draw)
      this.drawFeature = null
      // 绘制组件
      this.draw = new Draw({
        source: this.vectorLayer.getSource(),
        type: this.drawType == 'Box' ? 'Circle' : this.drawType,
        geometryFunction: this.drawType == 'Box' ? createBox() : null,
        style: new Style({
          stroke: new Stroke({
            lineDash: [10, 10],
            color: '#0099ff',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255,0.6)'
          })
        })
      })
      this.data.that.map.addInteraction(this.draw)
      //结束绘制
      this.draw.on("drawend", evt => {
        this.data.that.map.removeInteraction(this.draw)
        evt.feature.setStyle(new Style({
          stroke: new Stroke({
            color: '#0099ff',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255,0.6)'
          }),
          image: new Circle({
            radius: 7,
            stroke: new Stroke({
              width: 3,
              color: '#0099ff'
            }),
            fill: new Fill({
              color: '#fff'
            })
          })
        }))
        this.drawFeature = evt.feature
      })
    },
    /**
     * 选择图层
     */
    selectLayerChange() {
      console.log('噢噢噢噢噢噢', this.selectLayer)
      this.initDraw()
    },
    /**
     * 要素缓冲
     */
    getBufferFeature() {
      if (!this.drawFeature) {
        this.queryStatus = false
        this.$message.error("请先绘制图形！")
        return
      }
      let geometry = this.drawFeature.getGeometry()
      let fea = null
      if (this.drawType == 'Point') { fea = turf.point(geometry.getCoordinates()) } // turf的点要素
      else if (this.drawType == 'LineString') { fea = turf.lineString(geometry.getCoordinates()) } // turf的线要素
      else if (this.drawType == 'Circle') { fea = turf.polygon(circleToPolygon(geometry).getCoordinates()) }
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
      if (this.draw) this.data.that.map.removeInteraction(this.draw)
      this.drawFeature = null
      this.resultData=[]
      this.initDraw()
    },
    /**
     *  展示查询结果
     */
    showQueryResultData() {
      var info = {
        path: 'bufferQueryResult',
        name: 'bufferQueryResult',
        pathId: 'bufferQueryResult',
        widgetid: 'HalfPanel',
        type: 'gis',
        component: () => import('@/views/zhpt/tongyonggongju/bufferAnalysis/bufferQueryResult/widget'),
        label: '缓冲查询结果',
        meta: { title: '缓冲结果' },
        param: { dataType: this.selectLayer.type, features: this.resFeatures }
      };
      this.$store.dispatch('map/delHalfPanels', 'bufferQueryResult');
      this.$store.dispatch('map/changeMethod', info);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
</style>