<template>
  <div class="panel-container">
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
export default {
  props: ['data'],
  data() {
    return {
      selectFlag: false,
      doLoading: false,
      mapClickEvent: null,
      result: {
        pipeName: '',
        buryType: '',
        depth: '',
        standard: '',
        result: [true, true]
      }
    }
  },
  computed: {
    // 获取点击查询状态
    loading() {
      if (this.selectFlag)
        if (this.data.that.queryByClick.querying)
          return this.data.that.queryByClick.querying
        else return false
      else return false
    },
    // 获取点击查询结果
    resultInfo() {
      return this.data.that.queryByClick.resultInfo
    }
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val != 'soilDepthAnalysis') {
        this.selectFlag = false
        this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
      }
    },
    loading(val, oldVal) {
      if (this.selectFlag && !val) {
        if (!this.resultInfo) {
          this.$message.error('未选中管线！')
        }
        else {
          this.selectInfo = JSON.parse(JSON.stringify(this.resultInfo))
          this.getPipeSoilDepth(this.selectInfo.feature)
        }
      }
    }
  },
  mounted() {
    this.loadChart()
  },
  destroyed() {
    this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
  },
  methods: {
    // 选择管线
    selectPipe() {
      this.clearResult()
      this.data.that.map.getView().animate({ zoom: 20 });
      this.selectFlag = true
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
            console.log('param', param)
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
          name: '长度\n(m)',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          name: '高度(m)',
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
      let feaType;
      let typeName = feature.properties.TYPENAME
      if (typeName == '移动线缆' || typeName == '电信线缆' || typeName == '广电线缆')
        feaType = '电信线缆'
      else {
        feaType = typeName
      }
      const buryType = feature.properties.BURYTYPE // 埋设方式
      const startDepth = feature.properties.START_DEPTH // 起点埋深
      const endDepth = feature.properties.END_DEPTH // 终点埋深
      let standard = null // 获取对应的标准
      let result = []
      let standardDescrip = null
      let standardVal = null // 结果标准
      mapConfig.coverSoilStandard.forEach(item => {
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
        pipeName: feature.properties.TYPENAME + '-' + feature.properties.SID,
        buryType: "埋设方式：" + buryType,
        depth: '起止深度：' + startDepth + 'm / ' + endDepth + 'm',
        standard: standardDescrip,
        result: result
      }
      let startGroundHeight = parseFloat(feature.properties.START_HEIGHT) + parseFloat(feature.properties.START_DEPTH)
      let endGroundHeight = parseFloat(feature.properties.END_HEIGHT) + parseFloat(feature.properties.END_DEPTH)
      let groundHeightArray = [startGroundHeight.toFixed(2), endGroundHeight.toFixed(2)]
      let nodeHeightArray = [feature.properties.START_HEIGHT, feature.properties.END_HEIGHT]
      let proj = this.data.that.map.getView().getProjection()
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
      this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
      this.selectFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
</style>