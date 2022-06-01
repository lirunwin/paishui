<template>
  <div class="widget-bigScreen" >
    <!--背景地图模块-->
    <BaseMap />
    <MapLegend :show="showMonitoringCenter"/>
    <!--头部菜单模块-->
    <Header/>
    <!--监测中心模块-->
    <ELPWLMStatistic :show="showMonitoringCenter" :fontSize="fontSize"/>
    <PNLLMonitoring :show="showMonitoringCenter" />
    <ELPVmonitoring :show="showMonitoringCenter" />
    <MMIStatistic :show="showMonitoringCenter" />
    <!--数据总览模块-->
    <PNIARStatistic :show="showOverviewData" :fontSize="fontSize"/>
    <WFStatistic :show="showOverviewData" />
    <DPNLStatistic :show="showOverviewData" :fontSize="fontSize"/>
    <EMDStatistic :show="showOverviewData" />
    <WPSVMStatistic :show="showOverviewData" />
    <MIDStatistic :show="showOverviewData" />
  </div>
</template>

<script>
import './flexible.js';
import Header from './header/header.vue';
//地图模块
import BaseMap from './baseMap/baseMap.vue';
import MapLegend from './baseMap/legend.vue'
//监测中心模块
import ELPWLMStatistic from './monitoringCenter/ELPWLMStatistic.vue'
import PNLLMonitoring from './monitoringCenter/PNLLMonitoring.vue'
import ELPVmonitoring from './monitoringCenter/ELPVmonitoring.vue'
import MMIStatistic from './monitoringCenter/MMIStatistic.vue'
//数据总览模块
import PNIARStatistic from './overviewData/PNIARStatistic.vue'
import WFStatistic from './overviewData/WFStatistic.vue'
import DPNLStatistic from './overviewData/DPNLStatistic.vue'
import EMDStatistic from './overviewData/EMDStatistic.vue'
import WPSVMStatistic from './overviewData/WPSVMStatistic.vue'
import MIDStatistic from './overviewData/MIDStatistic.vue'
export default {
  name:'bigScreen',//项目大屏
  components:{
    Header,MapLegend,BaseMap,
    ELPWLMStatistic,PNLLMonitoring,ELPVmonitoring,MMIStatistic,
    PNIARStatistic,WFStatistic,DPNLStatistic,EMDStatistic,WPSVMStatistic,MIDStatistic
  },
  data(){
    return{
      showMonitoringCenter:false,//监测中心
      showOverviewData:false,//数据总览
    }
  },
  mounted(){
    // console.log('vuex',this.$store.state.routeSetting.addRoutes)
  },
  methods:{
    change(){

    },
    //字体自适配函数
    fontSize(res) {
      let docEl = document.documentElement,
        clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
      if (!clientWidth) return;
      // 此处的1920 为设计稿的宽度，记得修改！
      let fontSize = clientWidth / 1920;
      return res * fontSize;
    }
  },
}
</script>

<style lang="scss" scoped>
.widget-bigScreen{
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>>
