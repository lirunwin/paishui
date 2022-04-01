<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标记剖面线" isopen="true" title="点击下方按钮后，在地图上绘制剖面线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawLine" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>绘制横剖面线</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="分析结果" isopen="true" title="分析结果。">
      <el-table :data="laterData" stripe style="width: 100%">
        <el-table-column prop="name" label="图层名称" />
        <el-table-column prop="value" label="数量" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="showValue(scope.row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import proj4 from "@/components/proj4/index";
import tfLegend from '@/views/zhpt/common/Legend'
import Echarts from 'echarts'
import { esriConfig, appconfig } from 'staticPub/config'
export default {
  name: 'HorizontalProfileAnalysis',
  components: { tfLegend, Echarts, proj4 },
  props: { param: Object },
  data() {
    return {
      analysisDisable: false,
      laterData: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'horizontalProfileAnalysis') {        
        this.$nextTick(() => {
          this.gra.visible = true
        })
      } 
      if(oldTab == 'horizontalProfileAnalysis') {
        this.gra.visible = false        
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) draw.reset()
        view.container.style.cursor = ''
      }
    }
  },
  mounted: function() {    
    var mapView = this.mapView = this.$attrs.data.mapView    
    mapView.graphics.add(this.gra = new mapView.TF_graphic({
      geometry: { type: 'polygon', rings: [[[0,0]]], spatialReference: mapView.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
    }))
  },
  methods: {
    drawLine: function() {      
      var view = this.mapView
      var sp = view.spatialReference
      var layer = view.graphics
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.TF_drawPolygon(() => {view.container.style.cursor = 'crosshair'}, (evt) => {
        if (evt.vertices.length >= 2) {
          view.container.style.cursor = ''
          draw.reset()
          this.analysis()
        }}, 
      (evt) => {        
        this.gra.geometry = { type: 'polyline', paths: evt.vertices, spatialReference: sp } 
      }, () => {})
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
          X1: updatePaths[0][0], Y1: updatePaths[0][1],
          X2: updatePaths[1][0], Y2: updatePaths[1][1],
          f: 'pjson'       
        }, 
        dataType: "json",
        success: (data) => {
          this.analysisDisable = false
          // this.gra.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference }
          if(data.Status == "successed") {
            data = data.Values
            let dataX = []
            let dataYPipe = []
            let dataYGround = []
            let dataXIndex = {}
            var xMax = -Infinity
            var xMin = Infinity
            var pipes = []
            for(let i=0,ii=data.length;i<ii;i++) {
              var ddata = data[i]
              var x = parseFloat(ddata.Distance.toFixed(2))
              dataYPipe.push([x, parseFloat(ddata.Z.toFixed(2))])
              dataYGround.push([x, parseFloat(ddata.ZGround.toFixed(2))])
              dataXIndex[x] = proj4('EPSG:4544', 'EPSG:4490', [ddata.X, ddata.Y])
              var pipeid = ddata.ID
              if(pipes.indexOf(pipeid) < 0) {
                pipes.push(pipeid)
              }
              if(x > xMax) xMax = x
              if(x < xMin) xMin = x
            }
            var distance = (xMax - xMin) * 0.01
            var dataTable = { x: dataX, y1: dataYPipe, y2: dataYGround}
            let [pointerHighLightX, pointerX] = [0]
            var options = { id: (new Date()).getTime(), name: '横剖面分析', data: dataTable, option: {
              title: { text: '横剖面分析', left: 'center' }, 
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
                { name: '管线高程', smooth: true, data: dataYPipe, type: 'scatter', symbolSize: 12, itemStyle: { borderWidth: 2, borderColor: '#AF1F17', color: '#C69A74' }},
                { name: '地面高程', smooth: true, data: dataYGround, type: 'line', symbolSize: 8, areaStyle:{color:'#ECF2FF'}, itemStyle:{ borderColor:'#2D74E7', color: '#2D74E7' } }
              ]}, mapOptions: {
                pipe: paths,
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
            this.laterData = [{ name: '管线', value: pipes.length, ids: pipes}]
            var showResult = this.$store.state.map.analysisResult
            var showBoxs = showResult ? showResult.box : undefined
            if(showBoxs) {
              var firstI = showBoxs.tabs.length.toString()
              showBoxs.tabs.push({ label:'横剖面分析', index: firstI, option: options.option, hasMap: options.mapOptions })
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
        mapview.TF_resultFeatures.load(row.ids, id, 'HorizontalProfileAnalysis')
      } else {
        this.$store.dispatch('map/changeMethod', 
          { pathId: 'queryResult3', widgetid: 'HalfPanel', label: '查询结果', param: {
            oids: row.ids,
            layer: id,            
            showId: 'HorizontalProfileAnalysis'
          } })
      }
    }
  },
  destroyed() {
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    view.graphics.remove(this.gra)
    if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('HorizontalProfileAnalysis')
  }
}
</script>
