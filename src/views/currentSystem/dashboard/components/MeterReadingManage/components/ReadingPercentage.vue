<template>
  <div class="percentage-container">
    <span style="font-weight: bold">抄表率</span>
    <div class="chart-container">
      <div ref="meterReading" class="meter-reading-container"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    readingPercentage:{
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
    readingPercentage(newV,oldV){
      console.log("readingPercentage："+JSON.stringify(newV))
      this.readingPercentage = newV
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
          top: 10,
          icon: 'rect'
        },
        series: [
          {
            name: '抄表率',
            type: 'pie',
            radius: '50%',
            color: ['#255bbb', '#4ac3e4', '#568ee6', '#ffce49'],
            data: [
              { value: this.readingPercentage[0], name: '计划抄表数' },
              { value: this.readingPercentage[1], name: '已抄表数' },
              { value: this.readingPercentage[2], name: '未抄表数' },
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
      const chartReady = this.Echarts.init(this.$refs.meterReading)
      chartReady.setOption(options)

      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReady){
          chartReady.resize()
        }
      })
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.percentage-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .meter-reading-container {
    height: 100%;
    width: 100%;
  }
}
</style>
