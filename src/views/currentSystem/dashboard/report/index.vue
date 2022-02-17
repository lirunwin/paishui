<template>
  <div class="dashboard">
    <div class="bottom">
      <marketing v-if="validateAuth('marketing')"></marketing>
      <hotline-manage v-if="validateAuth('hotlineManage')" style="margin-top: 10px"></hotline-manage>
      <production-operations v-if="validateAuth('productionOperations')" style="margin-top: 10px"></production-operations>
      <pipe-nets v-if="validateAuth('pipeNets')" style="margin-top: 10px"></pipe-nets>
    </div>
  </div>
</template>

<script>
import Marketing from '../components/Marketing'
import HotlineManage from '../components/HotlineManage'
import ProductionOperations from '../components/ProductionOperations'
import PipeNets from "../components/PipeNets";
import auth from '../mixins/DashboardAuth'
export default {
  components: { Marketing, HotlineManage, ProductionOperations, PipeNets },
  mixins: [auth],
  computed: {
    topShow() {
      return this.validateAuth('todo') || this.validateAuth('alarm')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  height: calc(100vh - 64px);
  background: #eff0f5;
  box-sizing: border-box;
  padding: 12px;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    background: white;
  }
  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    /* 滚动条轨道 */
    background-color: rgba(180, 160, 120, 0.1);
    box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    /* 滚动条手柄 */
    background-color: #cccccc;
  }
  .top {
    width: 100%;
    height: 53.5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .topitem{
    flex:1;
  }
  .bottom {
    flex: 1;
  }
}
</style>
