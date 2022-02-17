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

<script>
import Comps from "./loadComps";

export default {
  name: "FloatPanels",
  components: {},
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
    data: null,
  },
  data() {
    return {
      Comps,
      // editableTabsValue: ''
    };
  },
  computed: {
    editableTabsValue() {
      return this.$store.state.map.floatP_editableTabsValue;
    },
  },
  watch: {
    // data() {
    //   if (this.data.length > 0) {
    //     this.editableTabsValue = this.data[this.data.length - 1].com || ''
    //   }
    // }
  },
  created() {
  },
  methods: {
    handelClose() {
      // this.$store.dispatch('map/handelClose', data)
      this.$store.dispatch("map/delAllFloat");
      this.$emit("handelClose");
    },
    removeTab(targetName) {
      // console.log('333', targetName)
      this.$store.dispatch("map/delFloatPanels", targetName);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tabs__header {
  background: #2D74E7;
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
