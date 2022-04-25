<template>
  <!-- 全屏 -->
  <div class="floatpanels">
    <component
      v-for="item in panels"
      class="floatitem"
      :key="item.com"
      :is="Comps[item.com]"
      :param="item.param"
      :data="item.data"
      :name="item.com"
      :remove="removeTab"
    />
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import Comps from "./loadComps";
@Component({
  name: "FloatPanels",
})
export default class FloatPanels extends Vue {
  @Prop() panels: any[];
  @Prop({ default: null }) data: any;
  Comps=Comps;

  get editableTabsValue() {
    return this.$store.state.map.floatP_editableTabsValue;
  }
  handelClose() {
    // this.$store.dispatch('map/handelClose', data)
    this.$store.dispatch("map/delAllFloat");
    this.$emit("handelClose");
  }
  removeTab(targetName) {
    // console.log('333', targetName)
    this.$store.dispatch("map/delFloatPanels", targetName);
  }
}
</script>

<style lang="scss" scoped>
.el-tabs__header {
  background: #2d74e7;
  color: black;
}
.el-tabs__item.is-active {
  // color: #fff;
  background: #fff;
}

.el-tabs__item:hover {
  color: black;
}
.floatpanels {
  z-index: 99;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  pointer-events: none;
  overflow: hidden;
  .floatitem {
    position: absolute;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 11px;
    color: #fff;
    z-index: 10;
    cursor: pointer;
  }
  > * {
    pointer-events: all;
  }
}
</style>
