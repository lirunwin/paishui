<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标记剖面线" isopen="true" title="点击下方按钮后，在地图上绘制剖面线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawLine_new" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading" />绘制横剖面线</el-button
        >
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="分析结果" isopen="true" title="分析结果。">
      <el-table :data="layerData" stripe style="width: 100%">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
        </template>
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="图层名称" align="center" />
        <el-table-column prop="value" label="数量" align="center" />
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
import proj4 from '@/components/proj4/index'
import tfLegend from '@/views/zhpt/common/Legend'
import Echarts from 'echarts'
import { appconfig } from 'staticPub/config'

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { comSymbol } from '@/utils/comSymbol'
import GeoJSON from 'ol/format/GeoJSON'
import * as turf from '@turf/turf'
import * as olSphere from 'ol/sphere'
import { LineString, Geometry } from 'ol/geom'
import { fieldDoc } from '@/views/zhpt/common/doc'
import { Feature } from 'ol'
import { mapUtil } from '../../common/mapUtil/common'

export default {
  name: 'HorizontalProfileAnalysis',
  components: { tfLegend, Echarts, proj4 },
  props: {
    param: Object,
    data: Object
  },
  data() {
    return {
      analysisDisable: false,
      layerData: [],
      //
      mapView: null,
      drawer: null,
      vectorLayer: null
    }
  },
  computed: {
    sidePanelOn() {
      return this.$store.state.map.P_editableTabsValue
    }
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      console.log('新标签', newTab)
      if (newTab !== 'horizontalProfileAnalysis') this.removeAll()
      else this.init()
    }
  },
  mounted: function() {
    this.mapView = this.data.mapView
    this.init()
  },
  methods: {
    drawLine_new() {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.mapView.removeLayer(this.vectorLayer)
      this.vectorLayer = null
      this.drawer = new iDraw(this.mapView, 'line', {
        maxLength: 2,
        showCloser: false,
        endDrawCallBack: (feature) => {
          let [startPoint, endPoint] = feature.getGeometry().getCoordinates()
          let isEast = startPoint[0] < endPoint[0]
          this.drawer.remove()
          this.analysis_new(feature, isEast)
        }
      })
      this.drawer.start()
    },
    showValue_new(row) {
      console.log('更多信息')
      let tableData = row.tableName
      mapUtil.getFields(tableData).then((res) => {
        let colsData = res.map((item) => {
          return { prop: item.field, label: item.name }
        })
        let rowData = row.features.map((fea) => {
          return { ...fea.properties, geometry: fea.geometry }
        })
        this.$store.dispatch('map/handelClose', {
          box: 'HalfPanel',
          pathId: 'queryResultMore',
          widgetid: 'HalfPanel'
        })
        this.$nextTick(() => {
          this.$store.dispatch('map/changeMethod', {
            pathId: 'queryResultMore',
            widgetid: 'HalfPanel',
            label: '详情',
            param: { rootPage: this, data: rowData || [], colsData }
          })
        })
      })
    },
    analysis_new(drawFeature, isEast) {
      let dataSetInfo = [
        { label: '排水管道', name: 'TF_PSPS_PIPE_B' },
        { label: '给水管道', name: 'TF_JSJS_PIPE_B' },
        { label: '燃气管道', name: 'TF_RQTQ_PIPE_B' },
        { label: '电力路灯', name: 'TF_DLLD_PIPE_B' },
        { label: '中国电信', name: 'TF_TXDX_PIPE_B' }
      ]
      let queryTask = new iQuery({ dataSetInfo })

      queryTask.spaceQuery(drawFeature).then((resArr) => {
        if (!this.vectorLayer) {
          this.vectorLayer = createLayer()
          this.vectorLayer.setZIndex(100)
          this.mapView.addLayer(this.vectorLayer)
        }

        let insertPoints = [],
          tableData = []
        resArr.forEach((item) => {
          if (item && item.result.featureCount !== 0) {
            let features = item.result.features.features
            let tableRow = { tableName: item.tableName, name: item.layerName, value: features.length, features }
            tableData.push(tableRow)
            item.result.features.features.forEach((feaJson) => {
              // 添加要素
              let feas = new GeoJSON().readFeatures(feaJson)
              this.vectorLayer.getSource().addFeatures(feas)
              // 计算线段相交点
              feas.forEach((fea) => {
                let line1 = turf.lineString(drawFeature.getGeometry().getCoordinates())
                let line2 = turf.lineString(fea.getGeometry().getCoordinates())
                let points = turf.lineIntersect(line1, line2)
                let attrs = fea.values_
                this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(points))
                insertPoints.push({ points, attrs })
              })
            })
          }
        })
        if (insertPoints.length !== 0) {
          let coordinates = drawFeature.getGeometry().getCoordinates()
          let center = [(coordinates[0][0] + coordinates[1][0]) / 2, (coordinates[0][1] + coordinates[1][1]) / 2]
          insertPoints.sort((prev, next) => {
            let pointX1 = prev.points.features[0].geometry.coordinates[0],
              pointX2 = next.points.features[0].geometry.coordinates[0]
            return isEast ? pointX1 - pointX2 : pointX2 - pointX1
          })
          this.openBox(insertPoints, center)
          this.layerData = tableData
        } else this.$message.error('无管线')
      })

      function createLayer() {
        return new VectorLayer({
          source: new VectorSource(),
          style: comSymbol.getAllStyle(3, '#f40', 5, '#C0DB8D'),
          visible: false
        })
      }
    },
    // 定位要素点
    gotoGeometry(geometry) {
      if (this.vectorLayer) {
        this.vectorLayer.setStyle(comSymbol.getAllStyle(3, '#f40', 5, '#00FFFF'))
        let source = this.vectorLayer.getSource()
        source.clear()
        geometry = new LineString(geometry.coordinates)
        source.addFeature(new Feature({ geometry }))
        this.vectorLayer.setVisible(true)
        // 添加视野
        // let extent = geometry.getExtent()
        // this.mapView.getView().animate({ center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]}, { zoom: 20 }, { duration: 100 })
      }
    },

    openBox(features, mapCenter) {
      let xminDistance = 0,
        xmaxDistance = 1,
        xmin = 0,
        xmax = 0
      let dataYPipe = [],
        dataYGround = []
      const heightField = 'IN_ELEV',
        deepFiled = 'S_DEEP',
        heightField2 = 'START_HEIGHT',
        deepFiled2 = 'START_DEPTH'

      if (features.length === 1) {
        xminDistance = 0.1
        let { attrs, points } = features[0]
        let height = attrs[heightField] || attrs[heightField2]
        let deep = attrs[deepFiled] || attrs[deepFiled2]
        if (!height) return this.$.$message.error('管线高程数据不完整！')
        dataYPipe.push([0, Number(height), Number(deep)])
      } else {
        let startX = 0
        for (let length = features.length, i = 0; i < length; i++) {
          let { attrs, points } = features[i]
          let height = attrs[heightField] || attrs[heightField2]
          let deep = attrs[deepFiled] || attrs[deepFiled2]
          if (i) {
            let prevPoint = new GeoJSON()
              .readFeature(features[i - 1].points.features[0])
              .getGeometry()
              .getCoordinates()
            let thisPoint = new GeoJSON()
              .readFeature(points.features[0])
              .getGeometry()
              .getCoordinates()
            let length = olSphere.getLength(new LineString([prevPoint, thisPoint]), { projection: 'EPSG:4326' })
            startX = Math.round((startX + length) * 1000) / 1000
            xmax = Math.max(startX, xmax)
          }
          dataYPipe.push([Number(startX).toFixed(3), Number(height).toFixed(3), Number(deep).toFixed(3)])
          dataYGround.push([Number(startX), Math.round((Number(height) + Number(deep)) * 1000) / 1000])
        }
      }

      let chartOption = {
        title: { text: '横剖面分析', left: 'center' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { show: true, type: 'cross', lineStyle: { type: 'dashed' } },
          formatter: (params) => {
            return `距离：${params[0].data[0]}m<br/>管线高程：${params[0].data[1]}m<br/>埋深：${params[0].data[2]}m`
          }
        },
        grid: { right: 60 },
        xAxis: {
          name: '距离(m)',
          max: parseFloat((xmax + xmaxDistance).toFixed(2)),
          min: parseFloat((xmin - xminDistance).toFixed(2)),
          scale: true,
          boundaryGap: false
        },
        dataZoom: [{ minSpan: 1, type: 'slider' }],
        toolbox: { feature: { saveAsImage: {} } },
        legend: { data: ['管线高程', '地面高程'], left: '0' },
        yAxis: { name: '高程(m)', type: 'value', scale: true },
        series: [
          {
            name: '管线高程',
            smooth: true,
            data: dataYPipe,
            type: 'scatter',
            symbolSize: 12,
            itemStyle: { borderWidth: 2, borderColor: '#AF1F17', color: '#C69A74' }
          },
          {
            name: '地面高程',
            smooth: true,
            data: dataYGround,
            type: 'line',
            symbolSize: 8,
            areaStyle: { color: '#ECF2FF' },
            itemStyle: { borderColor: '#2D74E7', color: '#2D74E7' }
          }
        ]
      }

      this.$store.dispatch('map/handelClose', {
        box: 'FloatPanel',
        pathId: 'analysisBox',
        widgetid: 'FloatPanel'
      })

      this.$nextTick(() => {
        this.$store.dispatch('map/changeMethod', {
          pathId: 'analysisBox',
          widgetid: 'FloatPanel',
          label: '分析结果统计',
          param: {
            that: this,
            title: '横剖面分析',
            mapCenter,
            tabs: [{ option: chartOption, title: '横剖面分析结果' }]
          }
        })
      })
    },

    drawLine: function() {
      var view = this.mapView
      var sp = view.spatialReference
      var layer = view.graphics
      var draw = view.TF_draw
      if (draw.activeAction) draw.reset()
      view.TF_drawPolygon(
        () => {
          view.container.style.cursor = 'crosshair'
        },
        (evt) => {
          if (evt.vertices.length >= 2) {
            view.container.style.cursor = ''
            draw.reset()
            this.analysis()
          }
        },
        (evt) => {
          this.gra.geometry = { type: 'polyline', paths: evt.vertices, spatialReference: sp }
        },
        () => {}
      )
    },
    analysis() {
      this.analysisDisable = true
      var paths = this.gra.geometry.paths[0]
      var updatePaths = paths.map((e) => proj4('EPSG:4490', 'EPSG:4544', e))
      $.ajax({
        url: appconfig.gisResource.horizental_section_analysis.config[0].url,
        type: 'POST',
        data: {
          UserToken: appconfig.usertoken,
          X1: updatePaths[0][0],
          Y1: updatePaths[0][1],
          X2: updatePaths[1][0],
          Y2: updatePaths[1][1],
          f: 'pjson'
        },
        dataType: 'json',
        success: (data) => {
          this.analysisDisable = false
          // this.gra.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference }
          if (data.Status == 'successed') {
            data = data.Values
            let dataX = []
            let dataYPipe = []
            let dataYGround = []
            let dataXIndex = {}
            var xMax = -Infinity
            var xMin = Infinity
            var pipes = []
            for (let i = 0, ii = data.length; i < ii; i++) {
              var ddata = data[i]
              var x = parseFloat(ddata.Distance.toFixed(2))
              dataYPipe.push([x, parseFloat(ddata.Z.toFixed(2))])
              dataYGround.push([x, parseFloat(ddata.ZGround.toFixed(2))])
              dataXIndex[x] = proj4('EPSG:4544', 'EPSG:4490', [ddata.X, ddata.Y])
              var pipeid = ddata.ID
              if (pipes.indexOf(pipeid) < 0) {
                pipes.push(pipeid)
              }
              if (x > xMax) xMax = x
              if (x < xMin) xMin = x
            }
            var distance = (xMax - xMin) * 0.01
            var dataTable = { x: dataX, y1: dataYPipe, y2: dataYGround }
            let [pointerHighLightX, pointerX] = [0]
            var options = {
              id: new Date().getTime(),
              name: '横剖面分析',
              data: dataTable,
              option: {
                title: { text: '横剖面分析', left: 'center' },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { show: true, type: 'cross', lineStyle: { type: 'dashed' } },
                  formatter: (params) => {
                    var x = params[params.length / 2].data
                    var y = x[1]
                    x = x[0]
                    return (
                      '距离：' + x + 'm<br/>地面高程：' + y + 'm<br/>埋深：' + (y - params[0].data[1]).toFixed(2) + 'm'
                    )
                  }
                },
                grid: { right: 60 },
                xAxis: {
                  name: '距离(m)',
                  max: parseFloat((xMax + distance).toFixed(2)),
                  min: parseFloat((xMin - distance).toFixed(2)),
                  scale: true,
                  boundaryGap: false
                },
                dataZoom: [{ minSpan: 1, type: 'slider' }],
                toolbox: { feature: { saveAsImage: {} } },
                legend: { data: ['管线高程', '地面高程'], left: '0' },
                yAxis: { name: '长度(m)', type: 'value', scale: true },
                series: [
                  {
                    name: '管线高程',
                    smooth: true,
                    data: dataYPipe,
                    type: 'scatter',
                    symbolSize: 12,
                    itemStyle: { borderWidth: 2, borderColor: '#AF1F17', color: '#C69A74' }
                  },
                  {
                    name: '地面高程',
                    smooth: true,
                    data: dataYGround,
                    type: 'line',
                    symbolSize: 8,
                    areaStyle: { color: '#ECF2FF' },
                    itemStyle: { borderColor: '#2D74E7', color: '#2D74E7' }
                  }
                ]
              },
              mapOptions: {
                pipe: paths,
                onPointer: (params, map, point, that) => {
                  var xAxisInfo = params.axesInfo[0]
                  if (xAxisInfo) {
                    pointerX = xAxisInfo.value
                    if (pointerHighLightX != pointerX) {
                      pointerHighLightX = pointerX
                      var xy = dataXIndex[pointerHighLightX]
                      point.geometry = { type: 'point', x: xy[0], y: xy[1], spatialReference: map.spatialReference }
                    }
                  } else {
                    if (pointerX != undefined) {
                      pointerHighLightX = pointerX = undefined
                      point.geometry = { type: 'point', x: 0, y: 0, spatialReference: map.spatialReference }
                    }
                  }
                }
              }
            }
            this.layerData = [{ name: '管线', value: pipes.length, ids: pipes }]
            var showResult = this.$store.state.map.analysisResult
            var showBoxs = showResult ? showResult.box : undefined
            if (showBoxs) {
              var firstI = showBoxs.tabs.length.toString()
              showBoxs.tabs.push({
                label: '横剖面分析',
                index: firstI,
                option: options.option,
                hasMap: options.mapOptions
              })
              showBoxs.activeName = firstI
            } else {
              this.$store.dispatch('map/changeMethod', {
                pathId: 'analysisBox',
                widgetid: 'FloatPanel',
                label: '分析结果统计',
                param: { that: this, title: '横剖面分析', tabs: [options] }
              })
            }
          } else {
            this.$message.error(data.Msg)
          }
        },
        error: (error) => {
          this.$message.error(error)
        }
      })
    },
    showValue(row) {
      var name = row.name
      if (name == '阀门') name = '控制阀门'
      var id
      var mapview = (this.mapView = this.$attrs.data.mapView)
      for (let i = 0, il = mapview.map.basemap.baseLayers.items, ii = il.length; i < ii; i++) {
        if (!il[i].url) continue
        for (let j = 0, jl = il[i].allSublayers.items, jj = jl.length; j < jj; j++) {
          if (jl[j].title != name) continue
          id = jl[j].id
          break
        }
        if (id) break
      }
      if (mapview.TF_resultFeatures) {
        mapview.TF_resultFeatures.load(row.ids, id, 'HorizontalProfileAnalysis')
      } else {
        this.$store.dispatch('map/changeMethod', {
          pathId: 'queryResult3',
          widgetid: 'HalfPanel',
          label: '查询结果',
          param: {
            oids: row.ids,
            layer: id,
            showId: 'HorizontalProfileAnalysis'
          }
        })
      }
    },
    init() {
      this.data.that.setPopupSwitch(false)
    },
    removeAll() {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.mapView.removeLayer(this.vectorLayer)
      this.$store.dispatch('map/handelClose', {
        box: 'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel'
      })
      this.$store.dispatch('map/handelClose', {
        box: 'FloatPanel',
        pathId: 'analysisBox',
        widgetid: 'FloatPanel'
      })
      this.data.that.setPopupSwitch(true)
    }
  },
  destroyed() {
    this.removeAll()
  }
}
</script>
