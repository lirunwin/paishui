<template>
  <!-- <div>净距分析</div> -->
  <div class="panel-container">
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" :loading="loading" @click="select">选择分析管线</el-button>
    </div>

    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">分析管线
        <el-tooltip class="item" effect="dark" content="选择两段管线，分析两段管线的水平净距或垂直净距是否符合规定" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
        <!-- <el-button type="text" style="padding:0;margin-left:10px">查看</el-button> -->
      </div>
      <div class="result-description">
        <div class="contant" v-if="selectPipeLines.length>0">
          <div>
            <p>{{selectPipeLines[0].feature.properties.TYPENAME}}</p>
            <p>{{selectPipeLines[0].feature.properties.SID}}</p>
            <p>{{selectPipeLines[0].feature.properties.BURYTYPE}}</p>
            <!-- <p>{{selectPipeLines[0].feature.properties.PRESSURE}}</p> -->
          </div>
          <div>VS</div>
          <div v-if="selectPipeLines.length==2">
            <p>{{selectPipeLines[1].feature.properties.TYPENAME}}</p>
            <p>{{selectPipeLines[1].feature.properties.SID}}</p>
            <p>{{selectPipeLines[1].feature.properties.BURYTYPE}}</p>
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
        <div class="panel-item" :style="'background-color:'+ bgc" v-if="isCollsion">
          <div>{{isCollsion}}</div>
        </div>
      </div>
    </div>

    <div class="op-box">
      <el-button type="danger" size="small" style="width:100%" @click="clearResult()">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import { mapConfig } from '@/views/zhpt/map.config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { MultiPolygon, Point } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import * as turf from '@turf/turf'
import { getCenter } from 'ol/extent';

import { getPipelineDistance } from '@/api/mainMap/analysis'
export default {
  props: ["data"],
  data() {
    return {
      bgc: "#02baaf",
      selectFlag: false,
      selectPipeLines: [], // 选择的管线，只有两个
      vectorLayer: null,
      resultDes: '合规',
      result: '',
      standard: '',
      // 
      isCollsion: ""
    }
  },
  computed: {
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
    }
  },
  mounted() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          width: 5,
          color: '#00ffff'
        })
      })
    })
    this.data.that.map.addLayer(this.vectorLayer)
  },
  destroyed() {
    this.data.that.map.removeLayer(this.vectorLayer)
  },
  methods: {
    select() {
      this.clear()
      this.data.that.map.getView().animate({ zoom: 20 });
      this.selectFlag = true
    },
    /**
     * 开始分析
     */
    start() {
      let lineFeature1 = this.selectPipeLines[0].feature
      let lineFeature2 = this.selectPipeLines[1].feature
      // 先判断两条管线是否有投影交点；有交点：计算垂直净距，无交点：计算水平净距
      const intersects = turf.lineIntersect(lineFeature1, lineFeature2);
      // 有交点
      if (intersects.features.length > 0) {
        let iPointCoord = new GeoJSON().readFeature(intersects.features[0]).getGeometry().getCoordinates()
        const verticalInterval = this.clacLineVerticalInterval(lineFeature1, lineFeature2, iPointCoord) // 垂直净距
        this.result = "垂直净距：" + verticalInterval + ' m'
        this.compareVerticalInterval(lineFeature1, lineFeature2, verticalInterval)
      }
      // 无交点
      else {
        const levelInterval = this.clacLevelInterval(lineFeature1, lineFeature2) // 水平净距
        this.result = "水平净距：" + levelInterval + ' m'
        this.compareLevelInterval(lineFeature1, lineFeature2, levelInterval)
      }
    },
    /**
     * 计算交点的高程
     */
    calcIpointHeight(startPoint, endPoint, iPoint) {
      // 利用空间直线两点式方程得到交点高程,即交点z坐标
      return (endPoint.z - startPoint.z) * (iPoint.x - startPoint.x) / (endPoint.x - startPoint.x) + startPoint.z
    },
    /**
     * 计算两条线段之间的最小距离，即水平净距
     */
    clacLevelInterval(line1, line2) {
      let distance = []
      const point1 = turf.point(new GeoJSON().readFeature(line1).getGeometry().getFirstCoordinate())
      const point2 = turf.point(new GeoJSON().readFeature(line1).getGeometry().getLastCoordinate())
      const point3 = turf.point(new GeoJSON().readFeature(line2).getGeometry().getFirstCoordinate())
      const point4 = turf.point(new GeoJSON().readFeature(line2).getGeometry().getLastCoordinate())
      distance.push(turf.pointToLineDistance(point1, line2, { units: 'kilometers' }))
      distance.push(turf.pointToLineDistance(point2, line2, { units: 'kilometers' }))
      distance.push(turf.pointToLineDistance(point3, line1, { units: 'kilometers' }))
      distance.push(turf.pointToLineDistance(point4, line1, { units: 'kilometers' }))
      distance.sort((a, b) => { return a - b }) //升序排序
      // 水平净距
      return (distance[0] * 1000).toFixed(2)
    },
    /**
     * 计算垂直距离，即垂直净距
     */
    clacLineVerticalInterval(line1, line2, iPointCoord) {
      const startPoint1 = {
        x: line1.geometry.coordinates[0][0],
        z: parseFloat(line1.properties.START_HEIGHT) - parseFloat(line1.properties.START_DEPTH)
      }
      const endPoint1 = {
        x: line1.geometry.coordinates[1][0],
        z: parseFloat(line1.properties.END_HEIGHT) - parseFloat(line1.properties.END_DEPTH)
      }
      const startPoint2 = {
        x: line2.geometry.coordinates[0][0],
        z: parseFloat(line2.properties.START_HEIGHT) - parseFloat(line2.properties.START_DEPTH)
      }
      const endPoint2 = {
        x: line2.geometry.coordinates[1][0],
        z: parseFloat(line2.properties.END_HEIGHT) - parseFloat(line2.properties.END_DEPTH)
      }
      const iPoint = { x: parseFloat(iPointCoord[0]) }
      const iPointZ1 = this.calcIpointHeight(startPoint1, endPoint1, iPoint)
      const iPointZ2 = this.calcIpointHeight(startPoint2, endPoint2, iPoint)
      // 垂直净距
      return Math.abs(iPointZ1 - iPointZ2).toFixed(2)
    },
    /**
     * 水平净距比较
     */
    compareLevelInterval(line1, line2, value) {
      const lineAttr1 = getLevelIntervalParam(line1)
      const lineAttr2 = getLevelIntervalParam(line2)
      let data = {
        pipeType: lineAttr1.type,
        pipeTypeAttr: lineAttr1.attr,
        comparePipeType: lineAttr2.type,
        comparePipeTypeAttr: lineAttr2.attr,
        compareType: 1
      }
      getPipelineDistance(data).then(res => {
        if (res.result.length == 0) {
          this.$message.warning("未找到相应的水平净距标准，无法进行分析！")
          return
        }
        let resVal = res.result[0].distanceValue.toString().split('-')
        // 标准是范围区间
        if (resVal.length == 2) {
          this.standard = '≥ ' + resVal[0] + ' m , ≤' + resVal[1] + ' m'
          const min = parseFloat(resVal[0]).toFixed(2)
          const max = parseFloat(resVal[1]).toFixed(2)
          if (value >= min && value <= max) {
            this.bgc = '#02baaf'
            this.resultDes = '合规'
          } else {
            this.bgc = '#f40'
            this.resultDes = '不合规'
          }
        }
        // 标准是单个值
        else {
          this.standard = '≥ ' + resVal.toString() + " m"
          if (value < parseFloat(resVal.toString()).toFixed(2)) {
            this.bgc = '#f40'
            this.resultDes = '不合规'
          }
          else {
            this.bgc = '#02baaf'
            this.resultDes = '合规'
          }
        }
      })
    },
    /**
     * 垂直净距比较
     */
    compareVerticalInterval(line1, line2, value) {
      const lineAttr1 = getVerticalInterval(line1)
      const lineAttr2 = getVerticalInterval(line2)
      let data = {
        pipeType: lineAttr1.type,
        pipeTypeAttr: lineAttr1.attr,
        comparePipeType: lineAttr2.type,
        comparePipeTypeAttr: lineAttr2.attr,
        compareType: 2
      }
      getPipelineDistance(data).then(res => {
        if (res.result.length == 0) {
          this.$message.warning("未找到相应的垂直净距标准，无法进行分析！")
          return
        }
        let resVal = res.result[0].distanceValue.toString().split('-')
        // 标准是范围区间
        if (resVal.length == 2) {
          this.standard = '≥ ' + resVal[0] + ' m , ≤' + resVal[1] + ' m'
          const min = parseFloat(resVal[0]).toFixed(2)
          const max = parseFloat(resVal[1]).toFixed(2)
          if (value >= min && value <= max) {
            this.bgc = '#02baaf'
            this.resultDes = '合规'
          } else {
            this.bgc = '#f40'
            this.resultDes = '不合规'
          }
        }
        // 标准是单个值
        else {
          this.standard = '≥ ' + resVal.toString() + " m"
          if (value < parseFloat(resVal.toString()).toFixed(2)) {
            this.bgc = '#f40'
            this.resultDes = '不合规'
          }
          else {
            this.bgc = '#02baaf'
            this.resultDes = '合规'
          }
        }
      })
    },
    /**
     * 清除结果
     */
    clearResult() {
      this.selectFlag = false
      this.clear()
    },
    /**
     * 清除
     */
    clear() {
      this.selectPipeLines = []
      this.vectorLayer.getSource().clear()
      this.bgc = '#02baaf'
      this.result = ''
      this.standard = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
</style>