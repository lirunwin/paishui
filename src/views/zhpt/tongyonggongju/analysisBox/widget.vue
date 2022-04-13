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
  },

  mounted: function() {    
    var tabs = []    
    for(let i=0,il=this.param.tabs,ii=il.length;i<ii;i++) {
      tabs.push({ label:il[i].name, index: i.toString(), option: il[i].option, hasMap: il[i].mapOptions })
    }
    this.tabs = tabs
    
    this.myChart = Echarts.init(this.$refs.echart)
    this.activeName = '0'
  },
  methods: {
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
