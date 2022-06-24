<template>
  <div class="widget-bigScreen" >
    <!--地图模块-->
    <BaseMap  v-on:fontSize="fontSize" />
    <MapLegend :hideBoth="hideBoth" />
    <LayerControl :hideBoth="hideBoth" />
    <MonitorTree v-on="{fontSize,getRequestResult}" :hideBoth="hideBoth"/>
    <!--头部菜单模块-->
    <Header/>
    <!--监测中心模块-->
    <ELPWLMStatistic :show="showMonitoringCenter" v-on="{fontSize,getRequestResult}"/><!--左侧模块-->
    <PNLLMonitoring :show="showMonitoringCenter" v-on="{fontSize,getRequestResult}"/> <!--底部模块-->
    <ELPVmonitoring :show="showMonitoringCenter" />                                   <!--右侧模块-->
    <MMIStatistic :show="showMonitoringCenter" v-on="{fontSize,getRequestResult}"/>   <!--中部模块-->
    <!--数据总览模块-->
    <PNIARStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}" />
    <WFStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}" />
    <DPNLStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}" />
    <EMDStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}" />
    <WPSVMStatistic :show="showOverviewData" />
    <MIDStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}"/>
    <CPNLStatistic :show="showOverviewData" v-on="{fontSize,getRequestResult}"/>
  </div>
</template>

<script>
import {getBlockPage,getResultList} from '@/api/bigScreenAPI/bigScreenRequest'
import Flexible from './flexible'
import Header from './header/header.vue';
//地图模块
import BaseMap from './baseMap/baseMap.vue';
import MapLegend from './baseMap/legend.vue'
import LayerControl from './baseMap/layer.vue'
import MonitorTree from './baseMap/monitorTree.vue'
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
import CPNLStatistic from './overviewData/CPNLStatistic.vue'
export default {
  name:'bigScreen',//项目大屏
  components:{
    Header,MapLegend,BaseMap,LayerControl,MonitorTree,
    ELPWLMStatistic,PNLLMonitoring,ELPVmonitoring,MMIStatistic,
    PNIARStatistic,WFStatistic,DPNLStatistic,EMDStatistic,WPSVMStatistic,MIDStatistic,CPNLStatistic
  },
  data(){
    return{
      showMonitoringCenter:false,//监测中心
      showOverviewData:false,//数据总览
      flexibleObject:null,
    }
  },
  computed:{
    hideBoth(){
      if(!this.showMonitoringCenter&&!this.showOverviewData){
        return true
      }else{
        return false
      }
    }
  },
  mounted(){
    this.flexibleObject=new Flexible()
    getBlockPage({size:999}).then(res=>{
        console.log('code列表',res)
    })
  },
  methods:{
    async getRequestResult(params) {
      let returnData = await new Promise((resolve,reject) => {
        getResultList(params).then(res => {
          if(res.code==1) resolve(res.result)
        }).catch(err=>{})
      })
      return returnData
    },
    //图表字体自适配函数
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
  destroyed(){
    this.flexibleObject.removeflexible()
    this.flexibleObject=null
  }
}
</script>

<style lang="scss" scoped>
.widget-bigScreen{
  width: 100%;
  height: 100%;
  position: fixed;
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
      width:.026042rem /* 5/192 */;
      height: .052083rem /* 10/192 */;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
      background-color: transparent;
      box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
      border-radius:10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
      border-radius:10px;
      background:#0F669A;
      box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
  }
}
</style>>
