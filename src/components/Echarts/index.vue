<template>
  <div class="echarts">
    <div :id="randomId" class="echart" :style="{ height: height }" />
  </div>
</template>

<script>
import Echarts from 'echarts'
import { EchartsOption } from './echarts.config'

const elementResizeDetectorMaker = require('element-resize-detector')

export default {
  props: {
    echartObj: {
      type: Object,
      default: () => {}
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      myChart: {},
      randomId: 'echarts-dom' + Date.now() + Math.random()
      // isCollapse: this.$store.state.app.sidebar.opened
    }
  },
  created() {
    // console.log('=====', this.$store.state.app.sidebar.opened)
    this.$nextTick(() => {})
  },
  mounted() {
    this.loadEchart()
    const that = this
    const erd = elementResizeDetectorMaker()
    erd.listenTo(document.getElementById(this.randomId), function(element) {
      // const width = element.offsetWidth
      // const height = element.offsetHeight
      that.$nextTick(function() {
        // console.log('Size: ' + width + 'x' + height)
        // 使echarts尺寸重置
        that.myChart.resize()
      })
    })
  },
  methods: {
    loadEchart() {
      this.myChart = Echarts.init(document.getElementById(this.randomId))
      // console.log('1111', document.getElementById(this.randomId))
      const option = EchartsOption.getEchartsConfigOption('linebar')
      // console.log('1222', option)
      if (!this.echartObj.customize) {
        option.legend.data = this.echartObj.legend.data
        option.xAxis[0].data = this.echartObj.xAxis.data
        option.series = this.echartObj.series
      } else {
        option = this.echartObj
      }
      this.myChart.setOption(option)
    },
    chartRexize() {
      const _this = this
      window.onresize = function() {
        _this.myChart.resize()
      }
    },
    setChart(type) {
      console.log('type', type)
      const series = this.echartObj.series
      for (let i = 0; i < series.length; i++) {
        series[i].type = type
      }
      const option = EchartsOption.getEchartsConfigOption('linebar')
      option.series = series
      this.myChart.setOption(option)
    }
  }
}
</script>

<style>
.echart {
  width: 100%;
}
</style>
