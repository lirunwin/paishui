<template>
  <!-- 全屏 -->
  <div v-if="panelVisible" ref="halfpanel" class="halfpanels">
    <span class="close" @click="handelClose">
      <i class="el-icon-close" />
    </span>
    <el-tabs
      class="custom-half-panels-tabs"
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
          class="halfitems"
          :param="item.param"
          :data="data"
          :name="item.com"
        />
      </el-tab-pane>
    </el-tabs>
    <div ref="dragline" class="dragline" />
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Comps from "./loadComps";
import $ from "jquery";
@Component({
  name: "HalfPanels",
})
export default class HalfPanels extends Vue {
  @Prop({ default: [] }) panels: any[];
  @Prop({ default: null }) data: any;
  @Prop() panelVisible: boolean;
  @Prop() fullpanelVisible: boolean;
  @Prop() footerHeight: string;
  @Prop() defaultHeight: string;

  Comps = Comps;
  nowHeight = null;

  get editableTabsValue() {
    return this.$store.state.map.halfP_editableTabsValue;
  }
  @Watch("panels")
  panelsChange() {
    if (this.panels.length > 0) {
      this.$emit("update:panelVisible", true);
      this.$emit("update:footerHeight", this.defaultHeight || "400px");
    } else {
      if (!this.panelVisible) return;
      this.$emit("update:panelVisible", false);
      if (this.fullpanelVisible == false) {
        this.$emit("update:footerHeight", "0%");
      }
    }
  }
  @Watch("panelVisible")
  panelVisibleChange() {
    if (this.panelVisible == true) {
      this.$store.dispatch("map/delAllFull");
    }
  }
  updated() {
    this.$nextTick(() => {
      this.initEvent();
    });
  }
  /**
   * 初始化事件函数
   */
  initEvent() {
    var domObj = $(this.$el);
    var that = this;
    domObj
      .find(".dragline")
      .off("mousedown")
      .on("mousedown", function (e) {
        var oldy = e.screenY;
        $(document)
          .off("mousemove")
          .on("mousemove", function (e) {
            var newy = e.screenY;
            var nowheight = domObj.height();
            var newheight = nowheight + (oldy - newy);
            that.$emit("update:footerHeight", newheight + "px");
            that.nowHeight = newheight + "px";
            oldy = newy;
          });
      });

    $(document)
      .off("mouseup")
      .on("mouseup", function () {
        $(document).off("mousemove");
        that.$emit("update:defaultHeight", that.nowHeight);
      });
  }
  handelClose() {
    // this.$store.dispatch('map/handelClose', data)
    this.$store.dispatch("map/delAllHalf");
    this.$emit("handelClose");
  }
  removeTab(targetName) {
    // console.log('333', targetName)
    this.$store.dispatch("map/delHalfPanels", targetName);
  }
  clickTab(targetName) {
    this.data.activeModel = targetName.name;
    const sendData = {
      widgetid: "HalfPanel",
      id: this.data.activeModel,
    };
    this.$store.dispatch("map/changeMethod", sendData);
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
  border-top: 1px solid rgb(218, 218, 218);
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
  padding: 0 4px 0px 4px;
}
.el-tabs >>> .el-tab-pane {
  height: 100%;
  width: 100%;
}

.halfpanels {
  position: relative;
  top: 0;
  height: 100%;
  width: 100%;

  .close {
    position: absolute;
    top: 10px;
    right: 11px;
    color: rgb(115, 131, 158);
    z-index: 10;
    cursor: pointer;
  }
  .halfitems {
    background-color: white;
    height: 100%;
    width: 100%;
  }
  .dragline {
    position: absolute;
    width: 100%;
    height: 3px;
    top: 0px;
  }
  .dragline:hover {
    cursor: s-resize;
  }
  .custom-half-panels-tabs {
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
}
</style>
