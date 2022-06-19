<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标记控制点" isopen="true" title="点击下方按钮后，在管线上依次选择两个点，系统将会分析两点间的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawPoint()" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>标记纵剖面控制点</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="分析结果" isopen="true" title="分析结果。">
      <el-table :data="layerData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="name" label="图层名称" align="center"/>
        <el-table-column prop="value" label="数量" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="showValue_new(scope.row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
import Echarts from 'echarts'

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import iNetAnalysis from '@/views/zhpt/common/mapUtil/netAnalysis'
import Overlay from 'ol/Overlay';
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { comSymbol } from '../../../../utils/comSymbol'
import { unByKey } from 'ol/Observable';
import { Style, Text } from 'ol/style'
import { Feature } from 'ol'
import * as turf from '@turf/turf'
import GeoJSON from 'ol/format/GeoJSON'
import * as olSphere from 'ol/sphere';
import { LineString } from 'ol/geom'
import { fieldDoc } from '@/views/zhpt/common/doc'
import { mapUtil } from '../../common/mapUtil/common'

export default {
  name: 'VerticalProfileAnalysis',
  components: { tfLegend },
  props: { 
    param: Object,
    data: Object
  },
  data() {
    return {
      analysisDisable: false,
      layerData: [],

      // 
      drawStatus: false, // 绘制
      tip: null,
      moveEvent: null,
      vectorLayer: null,
      lightLayer: null,
      startLine: null,
      endLine: null
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab !== 'verticalProfileAnalysis') this.removeAll()
      else this.init()
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    init () {
      this.mapView = this.data.mapView
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
      this.mapView.addLayer(this.vectorLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
      this.mapView.addLayer(this.lightLayer)
      // 先关闭地图点击事件
      this.data.that.setPopupSwitch(false)
    },
    drawPoint () {
      console.log('纵剖面分析')
      this.drawer && this.drawer.end()
      this.startLine = this.endLine = null
      this.vectorLayer.getSource().clear()
      this.lightLayer.getSource().clear()
      this.closePanel()
      this.addMapTip("起点")

      let startPoint, endPoint
      this.drawer = new iDraw(this.mapView, 'point', {
        showCloser: false,
        endDrawCallBack: async (feature) => {
          if (this.startLine) {
            let endLine = await this.getPipeLineByPoint(feature)
            if (endLine) {
              if (this.startLine.type === endLine.type) {
                endPoint = feature.getGeometry().getCoordinates()
                this.endLine = endLine
                this.vectorLayer.getSource().addFeature(new GeoJSON().readFeature(this.endLine.features[0]))
                this.tip.setPosition(null)
                unByKey(this.moveEvent)
                this.drawer.remove()
                // 结束后，执行连通分析
                let startId = { x: startPoint[0], y: startPoint[1] }
                let endId = { x: endPoint[0], y: endPoint[1] }
                this.showConnetPipe(startId, endId)
              } else {
                this.$message.error('请选择同种类型管线')
                this.drawer.clear()
              }
            } else {
              this.$message.error("该点无管线数据")
              this.drawer.clear()
            }
          } else {
            let startLine = await this.getPipeLineByPoint(feature)
            if (startLine) {
              startPoint = feature.getGeometry().getCoordinates()
              this.startLine = startLine
              this.addMapTip("终点")
              this.vectorLayer.getSource().addFeature(new GeoJSON().readFeature(this.startLine.features[0]))
            } else {
              this.$message.error("该点无管线数据")
              this.drawer.clear()
            }
          }
        }
      })
      this.drawer.start()
    },
    addMapTip (tipText) {
      this.moveEvent && unByKey(this.moveEvent)
      this.tip && this.tip.setPosition(null)
      this.moveEvent = this.tip = null
      let element = document.createElement('div')
      element.style = 'font-weight:bold;'
      element.innerHTML = tipText
      this.tip = new Overlay({
        element: element,
        autoPan: false,
        offset: [0, -10],
        positioning: "bottom-center",
        id: "tip",
        stopEvent: false //停止事件传播到地图
      });
      this.mapView.addOverlay(this.tip)
      this.moveEvent = this.mapView.on("pointermove", evt => {
        this.tip.setPosition(evt.coordinate)
      })
    },
    // 点查询
    getPipeLineByPoint (feature) {
      let queryFeature = new GeoJSON().readFeature(turf.buffer(turf.point(feature.getGeometry().getCoordinates()), 0.5 / 1000, { units: 'kilometers' }))
      let dataSetInfo = [
        { label: "排水管道", name: "TF_PSPS_PIPE_B",},
        { label: "给水管道", name: 'TF_JSJS_PIPE_B' },
        { label: "燃气管道", name: 'TF_RQTQ_PIPE_B' },
        { label: "电力路灯", name: 'TF_DLLD_PIPE_B' },
        { label: "中国电信", name: 'TF_TXDX_PIPE_B' },
      ]
      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(queryFeature).then(resArr => {
        let featureObj = resArr.find(res => res.result.featureCount !== 0)
        if (featureObj) {
          featureObj.result.features.type = featureObj.layerName
          resolve(featureObj.result.features)
        }
        else resolve(null)
      })
      })
    },
    // 显示连通信息
    showConnetPipe (startId, endId) {
      console.log('连通')
      let that = this
      if (!(startId && endId)) return this.$message.error('管线数据不完整, 无法执行分析')

      new iNetAnalysis().findPath(startId, endId).then(res => {
        if (res) {
          if (res.result.pathList.length !== 0) {
            let pathList = res.result.pathList
            let pathFeatures = []
            pathList.forEach(item => {
              this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(item.edgeFeatures))
              pathFeatures = [ ...pathFeatures, ...item.edgeFeatures.features ]
            })
            let center = pathFeatures[Math.floor(pathFeatures.length / 2)].geometry.coordinates
            this.openBox(pathFeatures, [(center[0][0] + center[1][0]) / 2, (center[0][1] + center[1][1]) / 2])

            this.layerData = [{ name: "排水管道", value: pathFeatures.length, pathFeatures }]
          }
        } else this.$message.error("分析失败, 管线间不连通")  
      })
    },

    openBox(features, mapCenter) {
      let xminDistance = 0, xmaxDistance = 1, xmin = 0, xmax = 0
      let dataYPipe = [], dataYGround = []
      const SH = "IN_ELEV",
            EH = 'OUT_ELEV',
            SD = "S_DEEP",
            ED = 'E_DEEP';

        let startX = 0
        console.log('数据不完整')
        for (let len = features.length, i = 0; i < len; i++) {
          let fea = features[i], { properties, geometry } = fea
          let sheight = properties[SH], eheight = properties[EH],
              sdeep = properties[SD], edeep = properties[ED]
          if (!(sheight && eheight && sdeep && edeep)) return this.$message.error("管线数据不完整")
          
          let length = olSphere.getLength(new LineString(geometry.coordinates), { projection: "EPSG:4326" })
          startX = Math.round((startX + length) * 1000) / 1000
          xmax = Math.max(startX, xmax)

          dataYPipe.push([Number(startX).toFixed(3), Number(eheight).toFixed(3), Number(edeep).toFixed(3)])
          dataYGround.push([Number(startX), Math.round((Number(eheight) + Number(edeep)) * 1000) / 1000 ])
        }
        // 添加起点管线
      dataYPipe.unshift([0, features[0].properties[SH], features[0].properties[SD]])
      dataYGround.unshift([0, Math.round((Number(features[0].properties[SH]) + Number(features[0].properties[SD])) * 1000) / 1000 ])

      let chartOption = {
        title: { text: '纵剖面分析', left: 'center' }, 
        tooltip: { trigger: 'axis', axisPointer: { show: true, type: 'cross', lineStyle: { type: 'dashed' } }, 
          formatter: (params) => {
            return `距离：${params[0].data[0]}m<br/>管线高程：${params[0].data[1]}m<br/>埋深：${params[0].data[2]}m`
          }
        },
        grid: { right: 60 },
        xAxis: { name: '距离(m)', max: parseFloat((xmax + xmaxDistance).toFixed(2)), min: parseFloat((xmin - xminDistance).toFixed(2)), scale: true, boundaryGap: false, }, dataZoom: [{ minSpan:1, type: 'slider' }], toolbox: { feature: { saveAsImage: {} } },
        legend: { data: ['管线高程', '地面高程'], left: '0' },
        yAxis: { name: '高程(m)', type: 'value', scale: true },
        series: [
          { name: '管线高程', smooth: false, data: dataYPipe, type: 'line', symbolSize: 6, itemStyle:{ color: '#f00', normal: { lineStyle: { width: 3 } } }},
          { name: '地面高程', smooth: false, data: dataYGround, type: 'line', symbolSize: 4, areaStyle: { color:'#ECF2FF'}, itemStyle:{ borderColor:'#2D74E7', color: '#2D74E7' } }
        ]
      }

      this.$store.dispatch('map/changeMethod', {
        pathId: 'analysisBox',
        widgetid: 'FloatPanel',
        label: '分析结果统计',
        param: { that: this, title: '纵剖面分析', mapCenter, tabs: [{ option: chartOption, title: '纵剖面分析结果' }] }
      })
    },
    showValue_new (row) {
      console.log('详情')
      let features = row.pathFeatures
      let tableData = row.tableName
      mapUtil.getFields(tableData).then(res => {
        let colsData = res.map(item => {
          return { prop: item.field, label: item.name }
        })
        let rowData = features.map(fea => {
          return { ...fea.properties, geometry: fea.geometry }
        })
        this.$store.dispatch('map/changeMethod', {
          pathId: 'queryResultMore', 
          widgetid: 'HalfPanel', 
          label: '详情', 
          param: { rootPage: this, data: rowData || [], colsData }
        })
      })

    },
    gotoGeometry (geometry) {
      let source = this.lightLayer.getSource()
      source.clear()
      let feature = new Feature({ geometry: new LineString(geometry.coordinates) })
      source.addFeature(feature)
    },

    closePanel () {
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
      this.$store.dispatch('map/handelClose', {
        box:'FloatPanel',
        pathId: 'analysisBox',
        widgetid: 'FloatPanel',
      })
    },
    removeAll () {
      this.drawer && this.drawer.end()
      this.mapView.removeLayer(this.vectorLayer)
      this.mapView.removeLayer(this.lightLayer)
      this.closePanel()
      this.tip && this.tip.setPosition(null)
      this.data.that.setPopupSwitch(true)
    }
  },
  destroyed() {
    this.removeAll()
  }
}
</script>
