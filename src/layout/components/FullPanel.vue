<template>
  <!-- 全屏 -->
  <div class="abs">
    <span class="close" @click="handelClose">
      <i class="el-icon-close" />
    </span>
    <el-tabs
      :value="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in data"
        :key="item.com"
        :label="item.title"
        :name="item.com"
      >
        <component :is="Comps[item.com]" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import Comps from "./loadComps";
@Component({
  name: "FullPanel",
})
export default class FullPanel extends Vue {
  @Prop({ default: [] }) data: any[];

  Comps=Comps;

  get editableTabsValue() {
    return this.$store.state.map.editableTabsValue;
  }

  handelClose() {
    // this.$store.dispatch('map/handelClose', data)
    this.$store.dispatch("map/delAllFull");
    this.$emit("handelClose");
  }
  removeTab(targetName) {
    // console.log('333', targetName)
    this.$store.dispatch("map/delFullPanels", targetName);
  }
}
</script>

<style lang="scss" scoped>
.abs {
  position: absolute;
  top: 0;
  width: 100%;
  .close {
    position: absolute;
    top: 10px;
    right: 11px;
    color: #fff;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
