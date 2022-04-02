<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标记控制点" isopen="true" title="点击下方按钮后，在管线上依次选择两个点，系统将会分析两点间的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="drawPoint(true)" :disabled="analysisDisable">
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
      if(newTab == 'verticalProfileAnalysis') {        
        this.$nextTick(() => {
          this.showPipe.visible = true
          this.endPoint.visible = this.startPoint.visible = true
        })
      } 
      if(oldTab == 'verticalProfileAnalysis') {
        this.endPoint.visible = this.startPoint.visible = false
        if(this.click) {
          this.click.remove()
          this.click = undefined 
          this.mapView.container.style.cursor = ''
          this.showPipe.visible = false
        }
      }
    }
  },
  mounted: function() {
    var mapview = this.mapView = this.$attrs.data.mapView    
    for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
      if(!il[i].url) continue     
      for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
        if(jl[j].title != '管线') continue
        this.rectUrl = jl[j].url
        break
      }
      if(this.rectUrl) break
    }
    this.Graphic = mapview.TF_graphic
    this.startPoint = new this.Graphic({
      geometry: { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference },
      symbol: {        
        path: "M811.862928 127.601246c-165.88162-165.88162-430.654206-165.88162-596.535825-3.190031-165.88162 165.88162-169.071651 433.844237-3.190031 599.725857l296.672897 299.862928 299.862928-296.672897c165.88162-165.88162 169.071651-433.844237 3.190031-599.725857z m-309.433021 114.841122h178.641744v159.501557h-31.900311v-15.950156H543.900312v105.271029c0 15.950156 6.380062 22.330218 22.330218 22.330218h76.560747c15.950156 0 25.520249-6.380062 28.710281-22.330218 3.190031-12.760125 3.190031-31.900312 6.380062-57.420561 9.570093 3.190031 19.140187 9.570093 31.900311 12.760124-3.190031 28.71028-6.380062 47.850467-6.380062 60.610592-3.190031 25.520249-22.330218 35.090343-54.230529 35.090343h-86.130842c-31.900312 0-47.850467-15.950156-47.850467-51.040498V350.903427h137.17134V274.342679h-143.551402v-31.900311zM703.401869 631.626168h-223.302181c-70.180685 0-118.031153-25.520249-143.551401-76.560747-9.570093 38.280374-19.140187 70.180685-35.090343 92.510903-6.380062-12.760125-12.760125-28.71028-19.140187-41.470405 22.330218-38.280374 35.090343-95.700935 35.090343-175.451713l31.900311 3.190031c0 28.71028-3.190031 54.23053-6.380062 79.750779 9.570093 22.330218 25.520249 41.470405 44.660436 57.42056v-162.691588H285.507788v-31.900312h89.320872v-63.800623H301.457944v-31.900312h73.370716v-63.800623h35.090343v60.610592h73.370717v31.900312h-73.370717v63.800623h82.94081v31.900311h-70.180685v66.990655h66.990654v31.900311h-66.990654v82.94081c19.140187 9.570093 44.660436 12.760125 70.180685 12.760125 70.180685 0 146.741433 0 226.492212-3.190031-9.570093 15.950156-12.760125 25.520249-15.950156 35.090342z",
        color: "#2D74E7", outline: { color: '#2D74E7', width: 0 },
        size: '30px', yoffset: '15px', xoffset: '0px', type: "simple-marker",
      },
    })
    this.endPoint = new this.Graphic({
      geometry: { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference },
      symbol: {        
        path: "M470.416361 291.488198c19.192449 35.186156 38.384898 60.776088 63.974829 83.167278 28.788673-22.39119 54.378605-51.179864 73.571055-83.167278h-137.545884z M774.296803 125.15364C607.962245-41.180918 339.267959-41.180918 172.933402 121.954898 6.598844 288.289456 6.598844 556.983742 169.73466 723.318299l297.482959 300.681701 300.681701-297.482959c169.533299-166.334558 169.533299-435.028843 6.397483-601.363401zM323.274252 211.51966l31.987415 12.794966c-28.788673 54.378605-54.378605 102.359728-76.769796 137.545885h51.179864c9.596224-19.192449 22.39119-41.583639 35.186156-63.97483l31.987415 15.993707c-41.583639 73.571054-76.769796 127.94966-102.359728 166.334558 25.589932-3.198741 54.378605-6.397483 86.366021-12.794966-3.198741 12.794966-3.198741 22.39119-3.198742 31.987415-31.987415 3.198741-73.571054 9.596224-121.552177 19.192449l-6.397483-31.987415c15.993707-19.192449 38.384898-51.179864 67.173572-95.962245-31.987415 3.198741-51.179864 3.198741-67.173572 3.198741l-9.596224-28.788673c28.788673-31.987415 54.378605-86.36602 83.167279-153.539592z m67.173571 371.054014c-38.384898 9.596224-86.36602 19.192449-140.744626 35.186156l-9.596224-35.186156c44.782381-9.596224 95.962245-19.192449 150.34085-35.186157v35.186157z m223.911905 60.776088c-73.571054-25.589932-140.744626-47.981122-198.321973-63.97483l12.794966-31.987415c54.378605 15.993707 121.552177 35.186156 198.321973 57.577347l-12.794966 38.384898z m-147.142109-143.943367l12.794966-28.788674c44.782381 12.794966 89.564762 28.788673 131.148401 44.782381l-15.993707 35.186157c-38.384898-22.39119-83.167279-38.384898-127.94966-51.179864z m195.123231-22.391191c-51.179864-15.993707-92.763503-35.186156-131.148401-60.776088-38.384898 25.589932-83.167279 47.981122-137.545884 67.173571-3.198741-9.596224-9.596224-22.39119-15.993708-31.987415 47.981122-12.794966 89.564762-31.987415 127.94966-57.577347-22.39119-22.39119-41.583639-47.981122-57.577347-76.769795-12.794966 22.39119-28.788673 44.782381-44.782381 67.173571l-22.39119-22.39119c35.186156-47.981122 63.97483-95.962245 83.167279-150.340851l31.987415 9.596225-19.192449 38.384898H639.94966v31.987415c-22.39119 38.384898-51.179864 73.571054-86.366021 102.359727 31.987415 22.39119 73.571054 38.384898 118.353436 44.782381 0 15.993707-3.198741 28.788673-9.596225 38.384898z",
        color: "#2D74E7", outline: { color: '#2D74E7', width: 0 },
        size: '30px', yoffset: '15px', xoffset: '0px', type: "simple-marker",
      },
    })
    this.showPipe = new mapview.TF_graphic({
      geometry: { type: 'polyline', paths: [[[0,0]]], spatialReference: mapview.spatialReference},
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "4px" } }
    })
    mapview.graphics.addMany([this.startPoint, this.endPoint, this.showPipe])
  },
  methods: {
    drawPoint:function (isDown) {      
      var mapview = this.mapView
      if(this.click) this.click.remove()
      this.click = undefined
      if(isDown){
        this.showPipe.geometry = { type: 'polyline', paths: [[[0,0]]], spatialReference: mapview.spatialReference}
        this.startPoint.geometry = { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference }
        this.endPoint.geometry = { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference }
        this.state = 'first'
      }
      mapview.container.style.cursor = 'pointer'
      switch(this.state) {
        case 'first':
          this.click = mapview.on('click', (evt) => {          
            var xy = mapview.toMap({ x: evt.x, y: evt.y })
            this.click.remove()
            this.click = undefined
            mapview.container.style.cursor = ''
            this.query(xy)
          })
          break
        case 'second':            
          this.click = mapview.on('click', (evt) => {      
            var xy = mapview.toMap({ x: evt.x, y: evt.y })
            this.click.remove()
            this.click = undefined
            mapview.container.style.cursor = ''
            this.query(xy)
          })
          break
      }      
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
