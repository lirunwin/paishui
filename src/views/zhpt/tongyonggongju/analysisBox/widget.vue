<template>
  <div ref="analysisBox" style="display: none; width: 800px; height: 400px; position: absolute;">
    <div ref="boxTitle" style="width:100%;height:30px;background:#2D74E7;padding:5px;color:#fff;cursor: move;">
      <span style="line-height: 20px;">{{param.hasOwnProperty('title') ? param.title : '分析结果'}}</span>
      <i class="el-icon-close" style="float:right;font-size:20px;cursor: pointer; font-weight: bold;" @click="close"></i>
      <i  :class="isFull?'el-icon-full-screen':'el-icon-copy-document'" style="float:right;font-size:20px;cursor: pointer; font-weight: bold;" @click="fullOperation"></i>
    </div>
    <div style="width:100%;height:calc(100% - 29px);background:#fff;border: 1px solid #2D74E7;overflow: auto;">      
      <el-tabs v-model="activeName" style="width:100%;">
        <el-tab-pane v-for="item of tabs" :key="item.index" :label="item.label" :name="item.index"></el-tab-pane>
      </el-tabs>
      <div style="width:100%;height:calc(100% - 55px);display:flex;">
        <div ref="echart" style="flex:1;height:100%"></div>
        <div ref="map" style="display:none;width:40%;height:100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  name: 'AnalysisBox',
  components: { Echarts },
  props: { param: Object },
  data() {
    return {
      activeName: '',
      tabs: [],
      isFull:true,
      // paramL:null,
      // isStatistics:false,
    }
  },
  computed: {},
  watch: { 
    activeName(e) {
        if(e != '') this.getData() 
      },
    // paramL(e){
    //   if(this.param&&this.param.title&&this.param.title.indexOf('统计')!=-1){
    //     this.isStatistics=true
    //   }else{
    //     this.isStatistics=false
    //   }
    // }
  },
  // created:function(){
  //   this.paramL=this.param;
  //   if(this.param&&this.param.title&&this.param.title.indexOf('统计')!=-1){
  //     this.isStatistics=true
  //   }else{
  //     this.isStatistics=false
  //   }
  // },
  mounted: function() {
    // this.paramL=this.param
    this.mapView = this.param.that.mapView
    var map = this.$store.state.map
    if(map.analysisResult) {
      map.analysisResult.box = this
    } else {
      map.analysisResult = { box: this }
    }
    var boxTitle = this.$refs.boxTitle
    var box = this.$refs.analysisBox
    var boxStyle = box.style
    var mapBox = box.parentNode
    var max = Math.max, min = Math.min
    this.$refs.analysisBox.style.display = ''
    var isDown = 0, ix = 0, iy = 0//dWidth dHeight
    boxTitle.onmousedown = (e) => {
      isDown = 1, ix = e.clientX - box.offsetLeft, iy = e.clientY - box.offsetTop
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseup)
      e.stopPropagation()
    }
    var mouseMove = (e) => {
      if (!isDown) return;
      boxStyle.left = max(min(e.clientX - ix, mapBox.clientWidth - box.clientWidth), 0) + 'px';
      boxStyle.top = max(min(e.clientY - iy, mapBox.clientHeight - box.clientHeight), 0) + 'px';
    }
    var mouseup = (e) => { 
      if (isDown && e.button == 0) isDown = 0
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseup)
    }

    this.param.show = true
    
    var tabs = []    
    for(let i=0,il=this.param.tabs,ii=il.length;i<ii;i++) {
      tabs.push({ label:il[i].name, index: i.toString(), option: il[i].option, hasMap: il[i].mapOptions })
    }
    this.tabs = tabs
    
    this.myChart = Echarts.init(this.$refs.echart)
    this.loadReportMap()
  },
  methods: {
    getData() {
      var tab = this.tabs[this.activeName]
      this.myChart.clear()
      var fdiv = this.$refs.map
      console.log(this.param)
      if(tab.hasMap) {
        var mapOptions = tab.hasMap
        var mapView = this.pipeMap
        if(!mapView) return
        this.pipeFeature.geometry = { type: 'polyline', paths: mapOptions.pipe, spatialReference: mapView.spatialReference }
        var point = this.showPoint
        fdiv.style.display = ''
        if(mapOptions.onPointer) {
          var func = mapOptions.onPointer
          if(this.pointerMove) this.myChart.off('updateAxisPointer', this.pointerMove)
          this.pointerMove = (event) => {
            func(event, mapView, point, this)
          }
          this.myChart.on('updateAxisPointer', this.pointerMove)
        }
        this.$nextTick(() => {
          mapView.extent = this.pipeFeature.geometry.extent
          mapView.scale *= 2
          this.myChart.resize()
        })
      } else {        
        fdiv.style.display = 'none'
        if(this.pointerMove) this.myChart.off('updateAxisPointer', this.pointerMove)
        this.$nextTick(() => this.myChart.resize())
      }
      this.myChart.setOption(tab.option)
    },
    clear() {
      this.myChart.clear()
      this.activeName = ''
      this.tabs = []
    },
    loadReportMap() {
      var divForPipe = this.$refs.map
      var mapView = this.mapView
      var Graphic = this.mapView.TF_graphic
      var pipeMap = new this.mapView.TF_mapView({
        container: divForPipe,
        map: mapView.map,
        spatialReference: mapView.spatialReference
      })
      this.pipeMap = pipeMap
      pipeMap.container.children[0].children[0].style.pointerEvents = 'none'
      pipeMap.ui.components = []
      pipeMap.constraints.lods = mapView.constraints.lods
      this.pipeFeature = new Graphic({
        geometry: { type: 'polyline', paths: [[[0,0]]], spatialReference: mapView.spatialReference},
        symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "4px" } }
      })
      this.showPoint = new Graphic({
        geometry: { type: 'point', x:0, y:0, spatialReference: mapView.spatialReference },
        symbol: { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 } }
      })
      pipeMap.graphics.addMany([this.pipeFeature, this.showPoint])
      this.activeName = '0'
    },
    close() {
      for(let i=0,il=this.$store.state.map.floatPanels,ii=il.length;i<ii;i++){
        if(il[i].com == "analysisBox") {
          this.param.show = false
          il.splice(i, 1)
          return
        }
      }
    },
    fullOperation(){
      // debugger
      if(this.isFull){
        this.isFull=false;
        this.$refs.analysisBox.style.width='100%';
        this.$refs.analysisBox.style.height='100%';
        this.myChart.resize()
      }else{
        this.isFull=true;
        this.$refs.analysisBox.style.width='800px';
        this.$refs.analysisBox.style.height='400px';
        this.myChart.resize()
      }
    }
  },
  destroyed() {
    this.pipeMap.graphics.removeMany([this.pipeFeature, this.showPoint])
    delete this.$store.state.map.analysisResult.box
  }
}
</script>
