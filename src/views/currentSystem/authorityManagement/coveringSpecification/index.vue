<template>
  <el-tabs class='coveringSpecification' style="position: absolute;
    padding: 10px;
    width: 100%;
    overflow: hidden;
    height: 100%;" v-model="activeName">
    <el-tab-pane label="覆土规范" name="ft"><comComponents :tableTitle='"管线名称"' :getList='getDeepSpe' :updataList='updataDeepSpe'></comComponents></el-tab-pane>
    <el-tab-pane label="垂直间距" name="cz"><comComponents :tableTitle='"管线名称"' :getList='getVertSpe' :updataList='updataVertSpe'></comComponents></el-tab-pane>
    <el-tab-pane label="最小净距" name="jj"><comComponents :tableTitle='"管线及建(构)筑物名称"' :getList='getSpe' :updataList='updataSpe'></comComponents></el-tab-pane>
  </el-tabs>
</template>

<script>
/**覆土规范模块*/
import {getDeepSpe,updataDeepSpe,getVertSpe,updataVertSpe,getSpe,updataSpe} from '@/api/base';
import comComponents from "./comComponents"
export default {
  name:"coveringSpecification",
  props: {
    map:null
  },
  data() {
    return {
      activeName:'ft',
      getDeepSpe:null,
      updataDeepSpe:null,
      getVertSpe:null,
      updataVertSpe:null,
      getSpe:null,
      updataSpe:null
    }
  },
  components:{comComponents},
  created(){
    this.getDeepSpe=getDeepSpe;
    this.updataDeepSpe=updataDeepSpe;
    this.getVertSpe=getVertSpe;
    this.updataVertSpe=updataVertSpe;
    this.getSpe=getSpe;
    this.updataSpe=updataSpe;
  },
  mounted(){
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.coveringSpecification {
  /deep/.el-tabs__content{
    width: 100%;
    height: calc(100% - 100px);
    .el-tab-pane{
      width: 100%;
      height:100% ;
    }
  }
} 
</style>