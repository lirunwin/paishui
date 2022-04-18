<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标记控制点" isopen="true" title="点击下方按钮后，在管线上依次选择两个点，系统将会分析两点间的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawPoint()" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>标记纵剖面控制点</el-button>
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
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
import Echarts from 'echarts'
export default {
  name: 'VerticalProfileAnalysis',
  components: { tfLegend },
  props: { 
    param: Object
    },
  data() {
    return {
      analysisDisable: false,
      laterData: [],

      // 
      drawStatus: false // 绘制
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    sidePanelOn(newTab, oldTab) {
    }
  },
  mounted: function() {
    this.mapView = this.$attrs.data.mapView
  },
  methods: {
    drawPoint:function (isDown) {         
      this.drawer && this.drawer.end()
      this.vectorLayer && this.mapView.removeLayer(this.vectorLayer)
      this.vectorLayer = null
      this.drawer = new iDraw(this.mapView, 'point', {
        showCloser: false,
        endDrawCallBack: feature => {
          this.drawer.remove()
          this.analysis_new(feature)
          // 
          // addText()
        }
      })
      this.drawer.start()  
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
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    view.graphics.removeMany([this.startPoint, this.endPoint])
    view.graphics.remove(this.showPipe)
    if(view.TF_resultFeatures) view.TF_resultFeatures.destroy('VerticalProfileAnalysis')
  }
}
</script>
