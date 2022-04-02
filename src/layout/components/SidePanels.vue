<template>
  <!-- 全屏 -->
  <div v-if="panelVisible" class="sidepanels">
    <!-- <span class='close' @click='handelClose'>
      <i class='el-icon-close' />
    </span> -->
    <!-- <custom-tab :headerList="panels"></custom-tab> -->
    <!-- <el-tabs :value='editableTabsValue' type='card' closable @tab-remove='removeTab'  @tab-click='clickTab'>
      <el-tab-pane
        v-for="item in panels"
        :key="item.com"
        :label="item.title"
        :name="item.com"
      >
        <component
          class="items"
          :is="Comps[item.com]"
          :param="item.param"
          :data="data"
          :name="item.com"
        />
      </el-tab-pane>
    </el-tabs> -->
    <div class="cus-tab-container">
      <div class="cus-header">
        <div class="cus-header-list">
          <div
            v-for="item in splitList.outer"
            :key="item.com"
            class="cus-header-item"
            :class="currentTab === item.com ? 'active' : ''"
            @click="clickTab(item)"
          >
            <span>{{ item.title }}</span>
            <i class="el-icon-close" @click.stop="removeTab(item)" />
          </div>
        </div>
        <div class="cus-tab-operations">
          <!-- <i
            class="el-icon-more tools-viewed-trigger"
            @click="toggleMore('trigger')"
          >
            <transition name="fade">
              <div v-show="restListShow" class="tools-viewed-list">
                <div class="list-container">
                  <div
                    v-for="item in splitList.rest"
                    :key="item.com"
                    :class="currentTab === item.com ? 'active' : ''"
                    class="tools-item"
                    @click="clickTab(item)"
                  >
                    <span>{{ item.title }}</span>
                    <span>
                      <i class="el-icon-close" @click.stop="removeTab(item)" />
                    </span>
                  </div>
                </div>
                <i
                  class="el-icon-close close-rest-list"
                  @click.stop="restListShow = false"
                />
              </div>
            </transition>
          </i> -->
          <i class="el-icon-close" @click="handelClose" />
        </div>
      </div>
      <div class="cus-content">
        <template v-for="item in panels">
          <component
            :is="Comps[item.com]"
            v-show="item.com === currentTab"
            :key="item.com"
            class="items"
            :param="item.param"
            :data="data"
            :name="item.com"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Comps from "./loadComps";
import { log } from "util";
@Component({
  name: "SidePanels",
})
export default class SidePanels extends Vue {
  @Prop({ default: [] }) panels: any[];
  @Prop({ default: null }) data: any;
  @Prop() panelVisible: boolean;
  @Prop() sideWidth: string;

  Comps = Comps;
  restListShow = false;

  get currentTab() {
    return this.$store.state.map.P_editableTabsValue;
  }
  get splitList() {
    const outer = this.panels.filter((item, index) => {
      if (index <= 1) return item;
      else return;
    });
    const rest = this.panels.filter((item, index) => {
      if (index > 1) return item;
      else return;
    });
    if (rest.length === 0) this.restListShow = false;
    return { outer, rest };
  }
  @Watch("panels")
  panelsChange() {
    if (this.panels.length > 0) {
      if (this.panelVisible) return;
      this.$emit("update:panelVisible", true);
      this.$emit("update:sideWidth", "350px");
    } else {
      if (!this.panelVisible) return;
      this.$emit("update:panelVisible", false);
      this.$emit("update:sideWidth", "0%");
    }
  }
  @Watch("panelVisible")
  panelVisibleChange(val) {
    if (val) {
      this.$store.dispatch("map/delAllFull");
    }
  }
  toggleMore(pos) {
    if (this.splitList.rest.length === 0) return;
    if (pos === "trigger") this.restListShow = !this.restListShow;
    else if (pos === "container") this.restListShow = false;
  }
  handelClose() {
    // this.$store.dispatch('map/handelClose', data)
    this.$store.dispatch("map/delAllPanel");
    this.$emit("handelClose");
  }
  removeTab(targetName) {
    // console.log('333', targetName)
    this.$store.dispatch("map/delPanels", targetName.com);
    // this.$store.state.map.panels.length !== 0 && this.clickTab(this.$store.state.map.panels[this.$store.state.map.panels.length - 1]);
  }
  clickTab(targetName) {
    this.$store.dispatch("map/changeTab", targetName.com);
  }
}
</script>

<style lang='scss'scoped>
.el-tabs {
  height: 100%;
}

.el-tabs >>> .el-tabs__header {
  background: #2d74e7;
  color: black;
  margin-bottom: 0px;
  .el-tabs__nav-wrap {
    .el-tabs__nav-prev {
      color: white;
    }
    .el-tabs__nav-next {
      color: white;
    }
  }
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

.sidepanels {
  position: relative;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  
  .close {
    position: absolute;
    top: 10px;
    right: 5px;
    color: #fff;
    z-index: 10;
    cursor: pointer;
  }
  .items {
    background-color: white;
    height: 100%;
    width: 100%;
    padding: 20px;
  }
}
.cus-tab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  // padding: 6px;
  box-sizing: border-box;
  .cus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #eaeaee;
    background-color: #2d74e7;
    .cus-header-list {
      display: flex;
      width: 86%;
      height: 100%;
      .cus-header-item {
        padding: 0 10px;
        margin: 0 1px;
        box-sizing: border-box;
        min-width: 80px;
        height: 40px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-shrink: 0;
        cursor: pointer;
        box-sizing: border-box;
        font-size: 14px;
        &.active {
          color: #fff;
        }
      }
    }
    .cus-tab-operations {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .tools-viewed-trigger {
        position: relative;
        cursor: pointer;
        .tools-viewed-list {
          z-index: 3;
          position: absolute;
          top: 28px;
          right: -20px;
          width: 180px;
          height: 280px;
          background: #fff;
          color: black;
          padding: 6px;
          border-radius: 6px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          .list-container {
            height: 90%;
            overflow-x: hidden;
            &::-webkit-scrollbar {
              width: 4px;
              background: white;
            }
            &::-webkit-scrollbar-corner, /* 滚动条角落 */
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
          }
          .close-rest-list {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .tools-item {
            padding: 10px;
            display: flex;
            justify-content: space-evenly;
            cursor: pointer;
            > span {
              &:nth-of-type(1) {
                width: 100px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            &.active {
              color: blue;
              background: #ecf2fe;
            }
          }
        }
      }
    }
  }
  .cus-content {
    flex: 1;
    // overflow-x: hidden;
    overflow: hidden;
  }
}
.el-icon-close{
  color: #fff;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
