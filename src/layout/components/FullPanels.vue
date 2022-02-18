<template>
  <!-- 全屏 -->
  <div v-if="panelVisible" class="fullpanels">
    <span class="close" @click="handelClose">
      <i class="el-icon-close" />
    </span>
    <el-tabs
      class="custom-full-panels-tabs"
      :value="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="item in panels"
        :key="item.com"
        :label="item.title"
        :name="item.com"
      >
        <component
          :is="Comps[item.com]"
          class="fullitems"
          :param="item.param"
          :data="data"
          :name="item.com"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Comps from "./loadComps";
@Component({
  name: "FullPanels",
})
export default class FullPanels extends Vue {
  @Prop({ default: [] }) panels: any[];
  @Prop({ default: null }) data: any;
  @Prop() panelVisible: boolean;
  @Prop() halfpanelVisible: boolean;
  @Prop() footerHeight: string;
  Comps = Comps;

  get editableTabsValue() {
    return this.$store.state.map.fullP_editableTabsValue;
  }
  @Watch("panels")
  panelsChange() {
    if (this.panels.length > 0) {
      if (this.panelVisible) return;
      this.$emit("update:panelVisible", true);
      this.$emit("update:footerHeight", "100%");
    } else {
      if (!this.panelVisible) return;
      this.$emit("update:panelVisible", false);
      if (this.halfpanelVisible == false) {
        this.$emit("update:footerHeight", "0%");
      }
    }
  }
  // panelVisible() {
  //   if (this.panelVisible == true) {
  //     this.$store.dispatch('map/delAllHalf')
  //   }
  // }
  handelClose() {
    // this.$store.dispatch('map/handelClose', data)
    this.$store.dispatch("map/delAllFull");
    this.$emit("handelClose");
  }
  removeTab(targetName) {
    // console.log('333', targetName)
    this.$store.dispatch("map/delFullPanels", targetName);
  }
  clickTab(targetName) {
    this.data.activeModel = targetName.name;
  }
}
</script>
<style lang='scss' scoped>
.el-tabs {
  height: 100%;
}

.el-tabs >>> .el-tabs__header {
  background: #eff0f5;
  color: black;
  margin-bottom: 0px;
  .el-tabs__nav-wrap {
    width: calc(100% - 25px);
    .el-tabs__nav-prev {
      color: white;
    }
    .el-tabs__nav-next {
      color: white;
    }
  }
}

.el-tabs >>> .el-tabs__item.is-active {
  // color: #fff;
  background: #fff;
}
.el-tabs >>> .el-tabs__item:hover {
  color: black;
}
.el-tabs >>> .el-tabs__content {
  height: calc(100% - 42px);
}
.el-tabs >>> .el-tab-pane {
  height: 100%;
  width: 100%;
}

.fullpanels {
  position: relative;
  top: 0;
  width: 100%;
  height: 100%;
  .custom-full-panels-tabs {
    /deep/ .el-tabs__nav {
      height: 43px;
      .el-tabs__item {
        height: 32px;
        line-height: 32px;
        margin: 11px 0 0 5px;
        padding: 0 8px;
        background: #e3e6f2;
        cursor: pointer;
        &.is-active {
          background: #ffffff;
        }
      }
    }
  }
  .close {
    position: absolute;
    top: 10px;
    right: 11px;
    color: rgb(115, 131, 158);
    z-index: 10;
    cursor: pointer;
  }
  .fullitems {
    background-color: white;
    height: 100%;
    width: 100%;
  }
}
</style>
