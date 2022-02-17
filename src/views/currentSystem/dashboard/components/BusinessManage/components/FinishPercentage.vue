<template>
  <div class="finish-percentage-container">
    <span style="font-weight: bold">{{title}}</span>
    <div ref="finnishPercentage" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    title: {
      type: String,
      default: '小组件标题'
    },
    business:{
      type: Array,
      default: () => [0,0,0]
    }
  },
  data() {
    return {
      Echarts
    }
  },
  watch:{
    business(newV,oldV){
      console.log("business："+JSON.stringify(newV))
      this.business = newV
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a0}<br />{b0}: {c0} 个<br />占比: {d0} %'
        },
        legend: {
          left: 'center',
          top: 15,
          icon: 'rect'
        },
        series: [
          {
            name: '完成率',
            type: 'pie',
            radius: '65%',
            top: 20,
            color: ['#568ee6', '#2ec67c', '#ed9442'],
            data: [
              { value: this.business[0], name: '受理总数' },
              { value: this.business[1], name: '已完成数' },
              { value: this.business[2], name: '未完成数' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{d}%'
            }
          }
        ]
      }
      const chartReady = this.Echarts.init(this.$refs.finnishPercentage)
      chartReady.setOption(options)
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.finish-percentage-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
