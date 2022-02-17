<template>
  <div class="toolPar" style="position: absolute; right: 100px; top: 20px;">
    <div class="widgetGroupButtoms" style="float: left" title="显示图例" @click="showMapLabel">
      <img src="./images/legendtool.png">
    </div>
    <div class="widgetGroupButtoms" style="float: left" title="动态标注" @click="queryFeature">
      <img src="./images/shuxingbiaozhu.png">
    </div>
  </div>
</template>
<script>
export default {
  name: 'QueryTool',
  props: { that: { type: Object, default: () => [] } },
  methods: {
    queryFeature() {
      this.$store.dispatch('map/changeMethod', { pathId: 'queryResult', widgetid: 'Panel', label: '动态标注' })
    },
    showMapLabel() {
      this.that.labelShow = !this.that.labelShow
    }
  }
}
</script>
