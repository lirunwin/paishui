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
        <el-table-column prop="name" label="图层名称" />
        <el-table-column prop="value" label="数量" />
        <el-table-column label="操作">
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
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#f00") })
      this.mapView.addLayer(this.vectorLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#00FFFF") })
      this.mapView.addLayer(this.lightLayer) 
    },
    drawPoint () {
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
      let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(queryFeature).then(resArr => {
        let featureObj = resArr.find(res => res.result.featureCount !== 0)
        if (featureObj) resolve(featureObj.result.features)
        else resolve(null)
      })
      })
    },
    // 显示连通信息
    showConnetPipe (startId, endId) {
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

            this.layerData = [{ name: "给水管线", value: pathFeatures.length, pathFeatures }]
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
          { name: '地面高程', smooth: true, data: dataYGround, type: 'line', symbolSize: 4, areaStyle: { color:'#ECF2FF'}, itemStyle:{ borderColor:'#2D74E7', color: '#2D74E7' } }
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
      let features = row.pathFeatures
      let colsData = []
      for (let field in fieldDoc) {
        colsData.push({ prop: field, label: fieldDoc[field] })
      }
      // 暂时展示15条属性
      colsData.length = 15
      let rowData = features.map(fea => {
        return { ...fea.properties, geometry: fea.geometry }
      })
      this.$store.dispatch('map/changeMethod', {
        pathId: 'queryResultMore', 
        widgetid: 'HalfPanel', 
        label: '详情', 
        param: { rootPage: this, data: rowData || [], colsData }
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
    },

    query(xy) {
      let seed = new Date().getTime()
      var mapView = this.mapView
      var x = xy.x, y = xy.y
      var r = mapView.resolution * 5, da = Math.PI / 10
      var ret = []
      var PI2 = Math.PI * 2, sin = Math.sin, cos = Math.cos
      for(let i=0;i< PI2;i+=da){
        ret.push([x + r * cos(i), y + r * sin(i)])
      }
      $.ajax({
        url: this.rectUrl + '/query',
        type: 'POST',
        data: {
          geometry: JSON.stringify({ spatialReference: {wkid: 4490}, rings: [ret] }),
          geometryType: 'esriGeometryPolygon',
          outFields: 'OBJECTID,STARTSID,ENDSID',
          f: 'pjson'          
        }, 
        success: (data) => {
          data = JSON.parse(data).features
          if(data && data.length < 1) {
            this.featureData = []
            this.anaPipe = undefined
            this.drawPoint()
            return this.wrong('无管线', 'choose')
          }          
          var long = Infinity, closet
          for(let i=0,ii=data.length;i<ii;i++) {
            var nd = data[i].geometry.paths[0]
            nd = this.getClosetPoint(nd, [x, y])
            var length = [nd[0] - x, nd[1] - y]
            length = Math.sqrt(length[0] * length[0] + length[1] * length[1])
            if(length < long) {
              long = length
              closet = nd
            }
          }
          switch(this.state) {
            case 'first':
              this.startPoint.geometry = { type: 'point', x: closet[0], y: closet[1], spatialReference: mapView.spatialReference }    
              this.state = 'second'
              this.drawPoint()
              break
            case 'second':
              this.endPoint.geometry = { type: 'point', x: closet[0], y: closet[1], spatialReference: mapView.spatialReference }
              this.state = undefined
              this.analysis()
              break
          }
        },
        error: (error) => this.wrong(error, 'choose', seed)
      })
    },
    getClosetPoint(line, cood) {
      var p1 = line[0], p2 = line[1], A = p2[1] - p1[1], B = p1[0] - p2[0], C = p2[0] * p1[1] - p1[0] * p2[1];
      var p3 = [(B * B * cood[0] - A * B * cood[1] - A * C) / (A * A + B * B), (-A * B * cood[0] + A * A * cood[1] - B * C) / (A * A + B * B)];
      if (p3[0] < Math.min(p1[0], p2[0]) || p3[0] > Math.max(p1[0], p2[0])) Math.abs(p3[0] - p1[0]) > Math.abs(p3[0] - p2[0]) ? p3 = p2 : p3 = p1;
      return p3;
    },
    wrong(error, type, seed) {
      if(error) this.$message.error(error)
      switch(type) {
        case 'choose': 
          // this.chooseDisable = false
          // this.$refs.chooseLoad.style.display = 'none'
          break
        case 'load':
          this.analysisDisable = false
          break
      }
    },
    analysis(){
      this.analysisDisable = true
      var p1 = this.startPoint.geometry
      var p2 = this.endPoint.geometry
      p1 = [p1.x, p1.y]
      p2 = [p2.x, p2.y]
      var updatePaths = [proj4('EPSG:4490', 'EPSG:4544', p1), proj4('EPSG:4490', 'EPSG:4544', p2)]
      var mapview = this.mapView
      $.ajax({
        url: appconfig.gisResource.vertical_section_analysis.config[0].url,
        type: 'POST',
        data: {
          UserToken: appconfig.usertoken,
          X1: updatePaths[0][0], Y1: updatePaths[0][1],
          X2: updatePaths[1][0], Y2: updatePaths[1][1],
          Buffer: 10,
          f: 'pjson'
        },
        dataType: "json",
        success: (data) => {
          this.analysisDisable = false
          // this.startPoint.geometry = { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference }
          // this.endPoint.geometry = { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference }
          if(data.Status == "successed") {
            data = data.Values
            let dataX = []
            let dataYPipe = []
            let dataYGround = []
            let dataXIndex = {}
            var xMax = -Infinity
            var xMin = Infinity
            var pipes = []
            var paths = []
            for(let i=0,ii=data.length;i<ii;i++) {
              var ddata = data[i]
              var x = parseFloat(ddata.Distance.toFixed(2))
              dataYPipe.push([x, parseFloat(ddata.Z.toFixed(2))])
              dataYGround.push([x, parseFloat(ddata.ZGround.toFixed(2))])
              var pipeid = ddata.ID || ddata.PipeLineDefinition.split(':')[1]
              if(pipes.indexOf(pipeid) < 0) {
                pipes.push(pipeid)
              }
              paths.push(dataXIndex[x] = proj4('EPSG:4544', 'EPSG:4490', [ddata.X, ddata.Y]))
              if(x > xMax) xMax = x
              if(x < xMin) xMin = x
            }
            var distance = (xMax - xMin) * 0.01
            var dataTable = { x: dataX, y1: dataYPipe, y2: dataYGround}
            let [pointerHighLightX, pointerX] = [0]
            var options = { id: (new Date()).getTime(), name: '纵剖面分析', data: dataTable, option: {
              title: { text: '纵剖面分析', left: 'center' }, 
              tooltip: { trigger: 'axis', axisPointer: { show: true, type: 'cross', lineStyle: { type: 'dashed' } }, formatter: (params) => {
                var x = params[params.length / 2].data
                var y = x[1]
                x = x[0]
                return '距离：' + x + 'm<br/>地面高程：' + y + 'm<br/>埋深：' + (y - params[0].data[1]).toFixed(2) + 'm'
              }},
              grid: { right: 60 },
              xAxis: { name: '距离(m)', max: parseFloat((xMax + distance).toFixed(2)), min: parseFloat((xMin - distance).toFixed(2)),scale: true, boundaryGap: false, }, dataZoom: [{ minSpan:1, type: 'slider' }], toolbox: { feature: { saveAsImage: {} } },
              legend: { data: ['管线高程', '地面高程'], left: '0' },
              yAxis: { name: '长度(m)', type: 'value', scale: true },
              series: [
                { name: '管线高程', smooth: true, data: dataYPipe, type: 'line' },
                { name: '地面高程', smooth: true, data: dataYGround, type: 'line', areaStyle: {} }
              ]}, mapOptions: {
                pipe: [paths],
                onPointer: (params, map, point, that) => {
                  var xAxisInfo = params.axesInfo[0];
                  if (xAxisInfo) {
                    pointerX = xAxisInfo.value
                    if(pointerHighLightX != pointerX) {
                      pointerHighLightX = pointerX
                      var xy = dataXIndex[pointerHighLightX]
                      point.geometry = { type: 'point', x:xy[0], y:xy[1], spatialReference: map.spatialReference }
                    }
                  }
                  else {
                    if(pointerX != undefined) {
                      pointerHighLightX = pointerX = undefined
                      point.geometry = { type: 'point', x:0, y:0, spatialReference: map.spatialReference }
                    }
                  }
                }
              }}
            this.showPipe.geometry = { type: 'polyline', paths: [paths], spatialReference: mapview.spatialReference}
            this.laterData = [{ name: '管线', value: pipes.length, ids: pipes}]
            var showResult = this.$store.state.map.analysisResult
            var showBoxs = showResult ? showResult.box : undefined
            if(showBoxs) {
              var firstI = showBoxs.tabs.length.toString()
              showBoxs.tabs.push({ label:'纵剖面分析', index: firstI, option: options.option, hasMap: options.mapOptions })
              showBoxs.activeName = firstI
            } else {
              this.$store.dispatch('map/changeMethod', {
                pathId: 'analysisBox',
                widgetid: 'FloatPanel',
                label: '分析结果统计',
                param: { that: this, title: '纵剖面分析', tabs: [options] }
              })
            }
          } else {
            this.$message.error(data.Msg)            
          }
        },
        error: (error) => this.$message.error(error)
      })
    },
    showValue(row) {
      var name = row.name
      if(name == '阀门') name = '控制阀门'
      var id
      var mapview = this.mapView = this.$attrs.data.mapView
      for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        if(!il[i].url) continue     
        for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
          if(jl[j].title != name) continue
          id = jl[j].id
          break
        }
        if(id) break
      }
      if(mapview.TF_resultFeatures) {
        mapview.TF_resultFeatures.load(row.ids, id, 'VerticalProfileAnalysis')
      } else {
        this.$store.dispatch('map/changeMethod', 
          { pathId: 'queryResult3', widgetid: 'HalfPanel', label: '查询结果', param: {
            oids: row.ids,
            layer: id,
            showId: 'VerticalProfileAnalysis'
          } })
      }
    }
  },
  destroyed() {
    this.removeAll()
  }
}
</script>
