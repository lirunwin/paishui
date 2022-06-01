<template>
  <div class="panel-container i-scrollbar">
    <!-- 纵剖面分析 -->
    <div class="op-box">
      <div class="item-head" style="margin-top:0">选择管线</div>
      <el-radio v-model="drawType" label="point">点</el-radio>
      <el-radio v-model="drawType" label="circle">圆</el-radio>
      <el-radio v-model="drawType" label="rect">框</el-radio>
    </div>
    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">分析结果
        <el-tooltip class="item" effect="dark" content="选择一段管线，判断该段管线的埋设是否达到标准的最小覆土深度" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
      </div>
    </div>
        <el-table @row-click="showRes" :data="layerData" v-loading="queryStatus" size='small'
        :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" 
        style="width: 100%; height:200px; overflow: auto">
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="id" align="center"  width="120" label="编号"></el-table-column>
          <el-table-column prop="start" width="65" align="center" label="起点">
            <template slot-scope="scope"> <p :style="{ color: !scope.row.start ? 'red': 'black' } ">{{ scope.row.start ? '合格' : '不合格' }} </p></template>
          </el-table-column>
          <el-table-column prop="end" width="65" align="center" label="终点">
            <template slot-scope="scope"> <p :style="{ color: !scope.row.end ? 'red': 'black' } ">{{ scope.row.end ? '合格' : '不合格' }} </p></template>
          </el-table-column>
        </el-table>
    <!-- 图表 -->
    <div class="table-chart">   
      <div class="item-head">管线详情</div>
      <div v-show="showChart" class="result-description">
        <div class="result-title" v-cloak>{{result.pipeName}}</div>
        <div v-cloak>{{result.buryType}}</div>
        <div v-cloak>{{result.depth}}</div>
        <div class="result-title" v-cloak>{{result.standard}}</div>
      </div>
      <div v-show="showChart" class="chart-container" id="main"></div>
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
import iDraw from '../../common/mapUtil/draw';
import { mapUtil } from '../../common/mapUtil/common';

export default {
  props: ['data'],
  data() {
    return {
      selectFlag: false,
      result: {
        pipeName: '',
        buryType: '',
        depth: '',
        standard: '',
        result: [true, true]
      },

      //
      rootPage: null,
      mapView: null,
      vectorLayer: null,
      lightLayer: null,

      layerData: [],
      queryStatus: false,
      showChart: false,
      drawer: null,
      drawFea: null,
      drawType: ''
    }
  },
  computed: {
  },
  watch: {
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== "coverSoilAnalysis") this.removeAll()
      else this.init()
    },
    drawType (n) {
      if (!n) return
      this.selectPipe()
    },
  },
  mounted() {
    this.rootPage = this.data.that
    this.mapView = this.data.mapView
    this.init()
  },
  destroyed() {
    this.removeAll()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
      this.mapView.addLayer(this.vectorLayer)
      this.mapView.addLayer(this.lightLayer)
      this.data.that.setPopupSwitch(false)
    },
    removeAll () {
      this.rootPage.$refs.popupWindow.closePopup() // 清除地图视图点击选择的要素,关闭弹窗
      this.mapView.removeLayer(this.vectorLayer)
      this.vectorLayer = null
      this.data.that.setPopupSwitch(true)
    },
    // 选择管线
    selectPipe() {
      if(!this.drawType) return this.$message.warning('请选择类型')
      this.vectorLayer.getSource().clear()
      this.drawer && this.drawer.end()
      this.drawer = new iDraw(this.mapView, this.drawType, {
        showCloser: false,
        endDrawCallBack: fea => {
          this.drawer.remove()
          this.drawFea = fea
          let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管道" }]
          if (this.drawType === 'point') {
            const tolerateDis = 0.3 // 模糊距离
            let geometryJson = turf.buffer(turf.point(fea.getGeometry().getCoordinates()), tolerateDis / 1000, { units: 'kilometers' })
            fea = new GeoJSON().readFeature(geometryJson)
          }
          this.queryStatus = true
          new iQuery({ dataSetInfo }).spaceQuery(fea).then(resArr => {
            this.queryStatus = false
            let featureObj = resArr.find(res => res.result.featureCount !== 0)
            if (featureObj) {
              let features = featureObj.result.features
              this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(features))
              this.layerData = features.features.map(fea => {
                let { descrip, eChartData } = this.getPipeSoilDepth(fea)
                return { id: fea.properties.LNO, start: descrip.result[0], end: descrip.result[1], eChartData, descrip }
              })
              console.log('覆土分析', features.features[0])
            } else this.$message.warning("该位置无管线")
          })
        }
      })
      this.drawer.start()
    },
    setCursor (cursorStyle) {
      if (this.mapView) {
        this.mapView.getTargetElement().style.cursor = cursorStyle || 'auto'
      }
    },
    // 详情
    showRes (row) {
      console.log('详细信息', row)
      let { eChartData, descrip } = row
      this.result = descrip
      this.showChart = true
      this.$nextTick(() => {
        this.loadChart(eChartData)
      })
      // 定位
      let feature = this.vectorLayer.getSource().getFeatures().find(fea => ( fea.get("LNO") && fea.get('LNO') === row.id))
      if (feature) {
        this.lightLayer.getSource().clear()
        this.lightLayer.getSource().addFeature(feature)
        let center = mapUtil.getCenter(feature)
        new mapUtil(this.mapView).setZoomAndCenter(20, center)
      }
    },

    /**图表 */
    loadChart({ xAxis, groundHeightArray, nodeHeightArray, standardValArry } = {}) {
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
    // 覆土深度结果
    getPipeSoilDepth(feature) {
      let START_HEIGHT = 'IN_ELEV', // 起点高程
          END_HEIGHT = 'OUT_ELEV', // 终点高程
          START_DEPTH = 'S_DEEP', // 起点埋深
          END_DEPTH = 'E_DEEP', // 终点埋深
          BURYTYPE = 'EMBED', // 埋设方式
          TYPE = 'TYPE', // 类型
          LNO = 'LNO' // 管段编号

      let feaType;
      let typeName = feature.properties[TYPE] || '排水管'
      if (typeName == '移动线缆' || typeName == '电信线缆' || typeName == '广电线缆')
        feaType = '电信线缆'
      else {
        feaType = typeName
      }
      const buryType = feature.properties[BURYTYPE]
      const startDepth = feature.properties[START_DEPTH]
      const endDepth = feature.properties[END_DEPTH]

      
      let result = []
      let standardDescrip = null
      let standardVal = null // 结果标准
      let standard = CoverSoilStandard.find(item => item.subtype == feaType)
      if (!standard) {
        this.$message.warning(`没有${feaType ? feaType : '未知管线'}的相关标准！`)
        this.doLoading = false // 执行状态
        return
      }
      if (buryType == '直埋') {
        standardDescrip = `直埋标准：${standard.direct}`
        standardVal = standard.direct
        result[0] = Number(startDepth) > standard.direct
        result[1] = Number(endDepth) > standard.direct
      } else {
        standardDescrip = '管沟标准：' + standard.ditch
        standardVal = standard.ditch
        result[0] = Number(startDepth) > standard.ditch
        result[1] = Number(endDepth) > standard.ditch
      }
      let descrip = {
        pipeName: feature.properties[TYPE] + '-' + feature.properties[LNO],
        buryType: `埋深方式：${buryType}`,
        depth: `起止深度：${startDepth}m / ${endDepth}m`,
        standard: `${standardDescrip}m`,
        result: result
      }

      let startGroundHeight = parseFloat(feature.properties[START_HEIGHT]) + parseFloat(feature.properties[START_DEPTH])
      let endGroundHeight = parseFloat(feature.properties[END_HEIGHT]) + parseFloat(feature.properties[END_DEPTH])
      let groundHeightArray = [startGroundHeight.toFixed(2), endGroundHeight.toFixed(2)]
      let nodeHeightArray = [feature.properties[START_HEIGHT], feature.properties[END_HEIGHT]]
      let proj = this.mapView.getView().getProjection()
      let xAxis = [0, getLength(new GeoJSON().readFeature(feature).getGeometry(), { "projection": proj, "radius": 6378137 }).toFixed(2)]
      let standardValArry = [(startGroundHeight - standardVal).toFixed(2), (endGroundHeight - standardVal).toFixed(2)]
      return { eChartData: { xAxis, groundHeightArray, nodeHeightArray, standardValArry }, descrip }
    },
    /**
     * 清除结果
     */
    clearResult() {
      this.drawType = ''
      this.drawer && this.drawer.end()
      this.layerData = []
      this.showChart = false
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.lightLayer && this.lightLayer.getSource().clear()
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