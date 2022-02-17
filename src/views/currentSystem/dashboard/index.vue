<template>
  <div class="dashboard">
    <div class="top" v-if="topShow">
      <div v-if="leftShow" :style="{ flex: '1 1 34%', height: '100%' }">
        <todos
          v-if="validateAuth('todo')"
          :style="{
            overflow: 'hidden',
            height: validateAuth('usertop')
              ? 'calc(100% - 30% - 10px)'
              : '100%',
          }"
        />
        <user-top
          v-if="validateAuth('usertop')"
          :style="{
            overflow: 'hidden',
            marginTop: validateAuth('todo') ? '10px' : '0px',
            height: validateAuth('todo') ? '30%' : '100%',
          }"
        ></user-top>
      </div>

      <!-- <alarm style="flex: 1 0 65%; height: 100%;" v-if="validateAuth('alarm')" /> -->
      <div
        v-if="rightShow"
        :style="{
          flex: '1 1 65%',
          height: '100%',
          marginLeft:
            validateAuth('todo') || validateAuth('usertop') ? '10px' : '0px',
        }"
      >
        <!-- <div class="hander"> -->
        <user-doc
          :style="{
            overflow: 'hidden',
            height: validateAuth('alarm') ? 'calc(100% - 52% - 10px)' : '100%',
          }"
        >
        </user-doc>
        <!-- <el-button type="primary" icon="el-icon-share" @click="handleReport()" >进入</el-button> -->
        <!-- </div> -->
        <alarm
          :style="{ marginTop: '10px', height: '52%' }"
          v-if="validateAuth('alarm')"
        />
      </div>
    </div>
    <div class="bottom" style="margin-top: 10px">
      <!-- <el-button type="primary" icon="el-icon-share" @click="handleReport()">进入系统</el-button> -->
      <el-link type="primary" :underline="false" @click="handleReport()">
        <img
          src="../../../assets/images/loginHome.png"
          height="24"
        />&nbsp;&nbsp;进入系统
      </el-link>

      <!-- <marketing v-if="validateAuth('marketing')" style="margin-top: 1%"></marketing>
      <hotline-manage v-if="validateAuth('hotlineManage')" style="margin-top: 1%"></hotline-manage>
      <production-operations v-if="validateAuth('productionOperations')" style="margin-top: 1%"></production-operations>
      <pipe-nets v-if="validateAuth('pipeNets')" style="margin-top: 1%"></pipe-nets> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import UserDoc from "./components/UserDoc/index.vue";
import Todos from "./components/Todo/index.vue";
import Alarm from "./components/Alarm/index.vue";
import UserTop from "./components/UserTop/index.vue";
// import Marketing from './components/Marketing'
// import HotlineManage from './components/HotlineManage'
// import ProductionOperations from './components/ProductionOperations'
// import PipeNets from "./components/PipeNets";
import auth from "./mixins/DashboardAuth";
@Component({
  mixins: [auth],
  components: { UserDoc, Todos, Alarm, UserTop },
})
export default class Dashboard extends Vue {
  topShow() {
    return (
      this.validateAuth("todo") ||
      this.validateAuth("usertop") ||
      this.validateAuth("userdoc") ||
      this.validateAuth("alarm")
    );
  }
  leftShow() {
    return this.validateAuth("todo") || this.validateAuth("usertop");
  }
  rightShow() {
    return this.validateAuth("userdoc") || this.validateAuth("alarm");
  }
  handleReport() {
    const sideBarShow = this.$store.state.app.sidebar.show;
    if (sideBarShow) this.$store.dispatch("app/toggleSideBarShow", false);
    this.$router.push("/dashboard/report");
    // 多余?  ls  20220217
    //this.defaultActiveIndex = "";
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
  .hander {
    width: 100%;
    height: 36%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top {
    width: 100%;
    // height: calc(100% - 50px);
    height: 92%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .topitem {
    flex: 1;
  }
  .bottom {
    flex: 1;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border-radius: 6px;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }
  .bottom >>> .el-link--inner {
    display: inline-flex;
    font-size: 20px;
    font-weight: bold;
    // color: #2D74E7;
    // border: 1px red solid;
    height: 24px;
    line-height: 24px;
  }
}
</style>
