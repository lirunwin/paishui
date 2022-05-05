<template>
  <div class="panel-container i-scrollbar">
    <!-- 纵剖面分析 -->
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" :loading="loading" @click="selectPipe">选择分析的管线</el-button>
    </div>
    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">分析结果
        <el-tooltip class="item" effect="dark" content="选择一段管线，判断该段管线的埋设是否达到标准的最小覆土深度" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
      </div>
      <div class="result-description">
        <div class="result-title" v-cloak>{{result.pipeName}}</div>
        <div v-cloak>{{result.buryType}}</div>
        <div v-cloak>{{result.depth}}</div>
        <div class="result-title" v-cloak>{{result.standard}}</div>
      </div>
    </div>
    <div class="result-total">
      <div v-if="result.result[0]" class="panel-item">
        <div>起点</div>
        <div v-cloak>合规</div>
      </div>
      <div v-else class="panel-item" style="background-color:#f40">
        <div>起点</div>
        <div v-cloak>不合格</div>
      </div>
      <div v-if="result.result[1]" class="panel-item">
        <div>终点</div>
        <div v-cloak>合规</div>
      </div>
      <div v-else class="panel-item" style="background-color:#f40">
        <div>终点</div>
        <div v-cloak>不合格</div>
      </div>
    </div>
    <!-- 图表 -->
    <div class="table-chart">
      <div class="item-head">管线分布</div>
      <div class="chart-container" id="main"></div>
    </div>
    <div class="op-box" style="padding-bottom:40px">
      <el-button type="danger" size="small" style="width:100%" @click="clearResult">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapConfig, tiandituWebSevice } from '@/views/zhpt/map.config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import Draw from 'ol/interaction/Draw'
import { MultiPolygon, Point } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { unByKey } from 'ol/Observable';
import { getLength, getDistance } from 'ol/sphere';
import * as turf from '@turf/turf'
import { getCenter } from 'ol/extent';
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { appconfig } from 'staticPub/config';
import { comSymbol } from '@/utils/comSymbol';
import { CoverSoilStandard } from '@/views/zhpt/common/standard'

export default {
  props: ['data'],
  data() {
    return {
      selectFlag: false,
      doLoading: false,
      result: {
        pipeName: '',
        buryType: '',
        depth: '',
        standard: '',
        result: [true, true]
      },
      loading: false,
      //
      rootPage: null,
      mapClickEvent: null,
      mapView: null,
      vectorLayer: null
    }
  },
  computed: {
  },
  watch: {
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== "coverSoilAnalysis") this.removeAll()
      else this.init()
    },
  },
  mounted() {
    this.loadChart()
    this.rootPage = this.data.that
    this.mapView = this.data.mapView
    this.init()
  },
  destroyed() {
    this.removeAll()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(3, '#f40', 5, '#00FFFF') })
      this.mapView.addLayer(this.vectorLayer)
    },
    removeAll () {
      this.rootPage.$refs.popupWindow.closePopup() // 清除地图视图点击选择的要素,关闭弹窗
      this.mapClickEvent && unByKey(this.mapClickEvent)
      this.mapView.removeLayer(this.vectorLayer)
      this.mapClickEvent = this.vectorLayer = null
    },
    // 选择管线
    selectPipe() {
      this.clearResult()
      this.setCursor('crosshair')
      this.selectFlag = true
      this.mapClickEvent && this.mapView.removeInteraction(this.mapClickEvent)
      this.vectorLayer.getSource().clear()

      this.mapClickEvent = this.mapView.on("click", evt => {
        let { coordinate } = evt
        let dataServer = appconfig.gisResource.iserver_resource.dataServer
        let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
        const tolerateDis = 0.3 // 模糊距离
        let geometryJson = turf.buffer(turf.point(coordinate), tolerateDis / 1000, { units: 'kilometers' })
        new iQuery({ dataSetInfo }).spaceQuery(new GeoJSON().readFeature(geometryJson)).then(resArr => {
          let featureObj = resArr.find(res => res.result.featureCount !== 0)
          if (featureObj) {
            this.mapView.removeInteraction(this.mapClickEvent)
            this.setCursor()
            let features = featureObj.result.features
            this.vectorLayer.getSource().addFeature(new GeoJSON().readFeature(features.features[0]))
            this.rootPage.$refs.popupWindow.showPopup(coordinate, features.features[0])
            this.getPipeSoilDepth(features.features[0])
          } else this.$message.warning("该位置无管线")
        })
        // 
      })
    },
    setCursor (cursorStyle) {
      if (this.mapView) {
        this.mapView.getTargetElement().style.cursor = cursorStyle || 'auto'
      }
    },

    /**图表 */
    loadChart(xAxis, groundHeightArray, nodeHeightArray, standardValArry) {
      let chartDom = document.getElementById('main');
      this.myChart = echarts.init(chartDom);
      let option = {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          color: 'black',
          textStyle: { color: '#3c4043' },
          formatter: param => {
            const deepth1 = param[0].data - param[1].data // 实际深度
            const deepth2 = param[0].data - param[2].data // 标准深度
            return `
            地面高程：${param[0].data}m<br/>
            实际覆土：${deepth1.toFixed(2)}m<br/>
            标准覆土：${deepth2.toFixed(2)}m`
          }
        },
        legend: {
          data: ['地面高程', '管线高程', '最小覆土深度']
        },
        xAxis: {
          type: 'category',
          name: '长\n度\nm',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          name: '高度/m',
          scale: true
          // min: yMin,
          // max: yMax
        },
        grid: { bottom: '8%' },
        series: [
          {
            name: '地面高程',
            data: groundHeightArray,
            type: 'line',
            smooth: true,
            areaStyle: { color: "#8e7748" }
          },
          {
            name: '管线高程',
            data: nodeHeightArray,
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 15//设置线条粗细
                }
              }
            }
          },
          {
            name: '最小覆土深度',
            data: standardValArry,
            type: 'line',
            smooth: true
          }
        ]
      };
      this.myChart.clear()
      this.myChart.setOption(option);
      // this.myChart.on('globalout', e => {
      //   if (this.vectorLayer.getSource().getFeatureById("pipe_point"))
      //     this.vectorLayer.getSource().removeFeature(this.vectorLayer.getSource().getFeatureById("pipe_point"))
      // })
    },

    getPipeSoilDepth(feature) {
      // 字段名
      let START_HEIGHT = 'IN_ELEV',
          END_HEIGHT = 'OUT_ELEV',
          START_DEPTH = 'S_DEEP',
          END_DEPTH = 'E_DEEP',
          BURYTYPE = 'EMBED'

      console.log('覆土分析')
      let feaType;
      let typeName = feature.properties.TYPE
      if (typeName == '移动线缆' || typeName == '电信线缆' || typeName == '广电线缆')
        feaType = '电信线缆'
      else {
        feaType = typeName
      }
      const buryType = feature.properties[BURYTYPE] // 埋设方式
      const startDepth = feature.properties[START_DEPTH] // 起点埋深
      const endDepth = feature.properties[END_DEPTH] // 终点埋深

      let standard = null // 获取对应的标准
      let result = []
      let standardDescrip = null
      let standardVal = null // 结果标准
      CoverSoilStandard.forEach(item => {
        if (item.subtype == feaType) {
          standard = item;
          return
        }
      })
      if (!standard) {
        this.$message.warning(`没有${feaType ? feaType : '未知管线'}的相关标准！`)
        this.doLoading = false // 执行状态
        return
      }
      if (buryType == '直埋') {
        standardDescrip = '直埋标准：' + standard.direct
        standardVal = standard.direct
        result[0] = Number(startDepth) > standard.direct
        result[1] = Number(endDepth) > standard.direct
      } else {
        standardDescrip = '管沟标准：' + standard.ditch
        standardVal = standard.ditch
        result[0] = Number(startDepth) > standard.ditch
        result[1] = Number(endDepth) > standard.ditch
      }
      this.result = {
        pipeName: feature.properties.TYPE + '-' + feature.properties.LNO,
        buryType: "埋设方式：" + buryType,
        depth: '起止深度：' + startDepth + 'm / ' + endDepth + 'm',
        standard: standardDescrip,
        result: result
      }
      let startGroundHeight = parseFloat(feature.properties[START_HEIGHT]) + parseFloat(feature.properties[START_DEPTH])
      let endGroundHeight = parseFloat(feature.properties[END_HEIGHT]) + parseFloat(feature.properties[END_DEPTH])
      let groundHeightArray = [startGroundHeight.toFixed(2), endGroundHeight.toFixed(2)]
      let nodeHeightArray = [feature.properties[START_HEIGHT], feature.properties[END_HEIGHT]]
      let proj = this.mapView.getView().getProjection()
      let xAxis = [0, getLength(new GeoJSON().readFeature(feature).getGeometry(), { "projection": proj, "radius": 6378137 }).toFixed(2)]
      let standardValArry = [(startGroundHeight - standardVal).toFixed(2), (endGroundHeight - standardVal).toFixed(2)]
      this.loadChart(xAxis, groundHeightArray, nodeHeightArray, standardValArry)
      this.doLoading = false // 执行状态
    },
    /**
     * 清除结果
     */
    clearResult() {
      this.loadChart()
      this.result = {
        pipeName: '',
        buryType: '',
        depth: '',
        standard: '',
        result: [true, true]
      }
      this.rootPage.$refs.popupWindow.closePopup()// 清除地图视图点击选择的要素,关闭弹窗
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.selectFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
@import "~@/styles/mixin.scss";
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}
</style>