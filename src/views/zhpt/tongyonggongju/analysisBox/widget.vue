<template>
  <div ref="analysisBox" style="width: 800px; height: 400px; position: absolute;">
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
        <div ref="map" class="map-view" style="display:none;flex:0.4;height:100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import Map from 'ol/Map'
import View from 'ol/View'

import TileLayer from 'ol/layer/Tile';
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { TileSuperMapRest } from '@supermap/iclient-ol'

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
      fullEchart: true
    }
  },
  computed: {},
  watch: { 
    activeName(e) {
        if(e != '') this.getData() 
      },
  },

  mounted: function() {
    var tabs = []    
    for(let i=0,il=this.param.tabs,ii=il.length;i<ii;i++) {
      tabs.push({ label:il[i].name, index: i.toString(), option: il[i].option, hasMap: il[i].mapOptions })
    }
    this.tabs = tabs
    
    this.myChart = Echarts.init(this.$refs.echart)
    if (this.param.mapCenter) {
      this.fullEchart = false
      this.$nextTick(() => {
        this.initMap(this.param.mapCenter)
      })
    }
    this.activeName = '0'
  },
  methods: {
    initMap (mapCenter) {
      console.log("初始化地图")
      let mapDom = this.$refs.map, 
          echartDom = this.$refs.echart,
          rootMap = this.param.that.mapView
      echartDom.style.flex = "0.6"
      this.myChart.resize()
      mapDom.style.display = ''
      let map = new Map({
        target: mapDom,
        view: new View({
          center: mapCenter,
          zoom: rootMap.getView().getZoom(),
          projection: 'EPSG:4326'
        }),
      })
      console.log("图层树", rootMap.getLayers())
      rootMap.getLayers().forEach(layer => {
        let cloneLayer = clone(layer)
        cloneLayer && map.addLayer(cloneLayer)
      })

      function clone (layer) {
        if (layer instanceof TileLayer) {
          if (layer.get("name") === "影像底图") return null
          return new TileLayer({
            source: new TileSuperMapRest({
              url: layer.getSource()['_url'],
              crossOrigin: 'anonymous', // 是否请求跨域操作
              wrapX: true
            }),
            properties: {
              projection: 'EPSG:4326'
            }
          })
        } else if (layer instanceof VectorLayer) {
          let clonelayer = new VectorLayer({
            source: new VectorSource(),
            style: layer.getStyle()
          })
          let features = layer.getSource().getFeatures()
          features.forEach(fea => clonelayer.getSource().addFeature(fea.clone()))
          return clonelayer
        }
      }
    },
    getData() {
      var tab = this.tabs[this.activeName]
      this.myChart.clear()
      this.myChart.setOption(tab.option)
    },
    clear() {
      this.myChart.clear()
      this.activeName = ''
      this.tabs = []
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
  }
}
</script>

<style lang="scss" scoped>
  .map-view {
    /deep/ .ol-zoom {
      display: none !important;
    }
    /deep/ .ol-attribution {
      display: none !important;
    }
  }
</style>