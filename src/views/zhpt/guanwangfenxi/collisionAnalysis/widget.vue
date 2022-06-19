<template>
  <!-- <div>净距分析</div> -->
  <div class="panel-container">
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="select">选择分析管线</el-button>
    </div>

    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">分析管线
        <el-tooltip class="item" effect="dark" content="选择两段管线，分析两段管线是否碰撞" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
        <!-- <el-button type="text" style="padding:0;margin-left:10px">查看</el-button> -->
      </div>
      <div class="result-description">
        <div class="contant" v-if="selectPipeLines.length>0">
          <div>
            <p style="overflow:hidden;text-overflow:ellipsis;" :title="selectPipeLines[0].properties.LNO || selectPipeLines[0].properties.SID">
              {{selectPipeLines[0].properties.LNO || selectPipeLines[0].properties.SID}}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;">
              {{selectPipeLines[0].properties.S_POINT || selectPipeLines[0].properties.START_SID}} / {{selectPipeLines[0].properties.E_POINT || selectPipeLines[0].properties.END_SID }}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;" :title="selectPipeLines[0].properties.ADDRESS">
              {{selectPipeLines[0].properties.ADDRESS}}</p>
            <!-- <p>{{selectPipeLines[0].feature.properties.PRESSURE}}</p> -->
          </div>
          <div>VS</div>
          <div v-if="selectPipeLines.length==2">
            <p style="overflow:hidden;text-overflow:ellipsis;" :title="selectPipeLines[1].properties.LNO || selectPipeLines[1].properties.SID">
              {{selectPipeLines[1].properties.LNO || selectPipeLines[1].properties.SID}}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;">
              {{selectPipeLines[1].properties.S_POINT || selectPipeLines[1].properties.START_SID}} / {{selectPipeLines[1].properties.E_POINT || selectPipeLines[1].properties.END_SID }}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;" :title="selectPipeLines[1].properties.ADDRESS">
              {{selectPipeLines[1].properties.ADDRESS}}</p>
            <!-- <p>{{selectPipeLines[1].feature.properties.PRESSURE}}</p> -->
          </div>
        </div>
      </div>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" :loading="false" @click="start">开始分析</el-button>
    </div>
    <div class="op-box">
      <div class="item-head">分析结果</div>
      <div class="result-total">
        <div v-if="resResult"  class="panel-item" :style="'background-color:'+ bgc">
          <div>{{ isCollsion }}</div>
        </div>
        <div v-if="resResult" class="panel-item">
          <div>{{ resResult }}</div>
          <div v-cloak>{{standard}}</div>
        </div>
      </div>
    </div>

    <div class="op-box">
      <el-button type="danger" size="small" style="width:100%" @click="clearResult()">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { MultiPolygon, Point, LineString } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import * as turf from '@turf/turf'

import { getPipelineDistance } from '@/api/mainMap/analysis'
import { comSymbol } from '@/utils/comSymbol';
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import DisAnalysis from '@/views/zhpt/common/mapUtil/disAnalysis'
import { DisStandard } from '@/views/zhpt/common/standard'


export default {
  props: ["data"],
  data() {
    return {
      bgc: "#02baaf",
      selectFlag: false,

      vectorLayer: null,
      result: '',
      standard: '',
      // 
      isCollsion: "",
      resResult: "",
      map: null,
      drawer: null,
      vectorLayer: null,
      selectPipeLines: [], // 选择的管线，只有两个
    }
  },
  computed: {
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== 'collisionAnalysis') this.removeAll()
      else this.init()
    }
  },
  mounted() {
    this.map = this.data.mapView
    this.init()
  },
  destroyed() {
    this.removeAll()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getLineStyle(5, '#00ffff')
      })
      this.map.addLayer(this.vectorLayer)
      this.data.that.setPopupSwitch(false)
    },
    // 选择管线
    select () {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.selectPipeLines = []
      this.drawer = new iDraw(this.map, "point", {
        endDrawCallBack: feature => {
          let fea = new GeoJSON().readFeature(turf.buffer(turf.point(feature.getGeometry().getCoordinates()), 0.5 / 1000, { units: "kilometers" }))
          this.getAnalysisPipe(fea).then(featuresJson => {
            if (featuresJson) {
              if (this.selectPipeLines.length === 0) {
                this.$set(this.selectPipeLines, 0, featuresJson.features[0])
              } else {
                let sid =  this.selectPipeLines[0].properties.S_POINT || this.selectPipeLines[0].properties.START_SID , 
                eid = this.selectPipeLines[0].properties.E_POINT || this.selectPipeLines[0].properties.END_SID 
                let sid2 = featuresJson.features[0].properties.S_POINT || featuresJson.features[0].properties.START_SID , 
                eid2 = featuresJson.features[0].properties.E_POINT || featuresJson.features[0].properties.END_SID 
                if (sid === sid2 && eid === eid2) return this.$message.error('同一条管线')
                this.$set(this.selectPipeLines, 1, featuresJson.features[0])
                this.drawer.remove()
              }
              this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(featuresJson))
            } else {
              this.drawer.clear()
              this.$message.warning('该点无管线，请重新选择')
            }
          })
        },
        showCloser: false
      })
      this.drawer.start()
    },
    // 开始查询
    start () {
      if (this.selectPipeLines.length !== 2) return this.$message.error('请先选择两条管线')
      let [feature1, feature2] = this.selectPipeLines
      let pipe1 = new GeoJSON().readFeature(feature1)
      let pipe2 = new GeoJSON().readFeature(feature2)
      let disAnalysisTool = new DisAnalysis()

      // // 判断管埋
      // let findPipes = [pipe1, pipe2].filter(pipe => pipe.get("BURYTYPE") !== "管埋")
      // if (findPipes.length !== 0) {
      //   this.bgc = "#02baaf"
      //   this.isCollsion = "不碰撞"
      //   this.resResult = findPipes.map(pipe => pipe.get("SID")).join(",") + " 非管埋"
      //   return
      // }

      // 判断相连
      if  (isConnect(pipe1, pipe2)) {
        this.bgc = "#FF6401"
        this.isCollsion = "碰撞"
        this.resResult = [pipe1, pipe2].map(pipe => pipe.get("LNO") || pipe.get('SID')).join(",") + " 相连"
        return
      }
      
      // 判断相交
      let insectPoint = disAnalysisTool.isIntersect(pipe1.getGeometry(), pipe2.getGeometry())
      
      if (insectPoint.isIntersect) {
        // 垂直净距
        let res = disAnalysisTool.closetVcDis(pipe1, pipe2)
        this.isCollsion = res.dis < 0 ? "碰撞" : "不碰撞"
        this.bgc = res.dis < 0 ? "#FF6401" : "#02baaf"
        this.resResult = `垂直净距${res.dis}m`
      } else {
        // 水平净距
        let sdiameter = pipe1.get("PSIZE") || pipe1.get("DIAMETER")
        let cdiameter = pipe2.get("PSIZE") || pipe2.get("DIAMETER")
        let res = disAnalysisTool.closetHzDis(pipe1.getGeometry(), pipe2.getGeometry(), sdiameter, cdiameter)
        this.isCollsion = "不碰撞"
        this.bgc = "#02baaf"
        this.resResult = `水平净距${res.dis}m`
      }

      // 判断是否是前后连接的管段
      function isConnect(feature1, feature2) {
        let sid1 = feature1.get("S_POINT") || feature1.get("START_SID"),
            eid1 = feature1.get("E_POINT") || feature1.get("END_SID")
        let sid2 = feature2.get("S_POINT") || feature2.get("START_SID"),
            eid2 = feature2.get("E_POINT") || feature2.get("END_SID")
        return sid1 === eid2 || eid1 === sid2 || sid1 === sid2 || eid1 === eid2
      }
    },
    getAnalysisPipe (fea) {
      let dataSetInfo = [
        { label: "排水管道", name: "TF_PSPS_PIPE_B",},
        { label: "给水管道", name: 'TF_JSJS_PIPE_B' },
        { label: "燃气管道", name: 'TF_RQTQ_PIPE_B' },
        { label: "电力路灯", name: 'TF_DLLD_PIPE_B' },
        { label: "中国电信", name: 'TF_TXDX_PIPE_B' },
      ]
      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresArr = resArr.find(res => res && res.result.featureCount !== 0)
          if (featuresArr) resolve(featuresArr.result.features)
          else resolve(null)
        })
      })
    },
    clearResult () {
      this.selectPipeLines = []
      this.resResult = ""
      this.isCollsion = ""
      this.drawer && this.drawer.end()
      this.bgc = "#02baaf"
      this.vectorLayer.getSource().clear()
    },
    removeAll () {
      this.map.removeLayer(this.vectorLayer)
      this.drawer && this.drawer.end()
      this.drawer = this.vectorLayer = null
      this.data.that.setPopupSwitch(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
</style>