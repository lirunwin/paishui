<template>
  <div style="width:100%;height:100%">
    <queryResult v-if="param" :param="param" :data="data"></queryResult>
  </div>
</template>

<script>
import queryResult from '@/views/zhpt/tongyonggongju/queryResult/widget'
export default {
  props: ['data'],
  components: {
    queryResult
  },
  data() {
    return {
      param: null
    }
  },
  mounted() {
    this.getParam()
  },
  watch: {
    '$store.state.map.halfPanels': function () {
      this.getParam()
    }
  },
  methods: {
    /**
     * 获取数据
     */
    getParam() {
      for (let index in this.$store.state.map.halfPanels) {
        let item = this.$store.state.map.halfPanels[index]
        if (item.com === 'warningReasult') {
          // console.log('站点：', item)
          let dataType = item.param.dataType
          let features = item.param.features
          this.param = { dataType: dataType, allFeatures: features }
          break
        }
      }
    },
  }

}
</script>

<style>
</style>