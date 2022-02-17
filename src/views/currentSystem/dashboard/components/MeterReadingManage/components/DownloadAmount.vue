<template>
  <div class="download-container">
    <span style="font-weight: bold">下载数</span>
    <div ref="downloadChart" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    downloadAmount:{
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
    downloadAmount(newV,oldV){
      console.log("downloadAmount："+JSON.stringify(newV))
      this.downloadAmount = newV
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      const downloadChart = this.Echarts.init(this.$refs.downloadChart)
      const options = {
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{a0}<br />{b0}: {c0} 个'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['计划下载数', '已下载数', '未下载数'],
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#eaeaea'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#eaeaea'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        series: [
          {
            name:'下载数',
            type: 'bar',
            barMaxWidth: 40,
            data: [
              {
                value:  this.downloadAmount[0],
                itemStyle: {
                  color: '#6f9de7'
                }
              },
              {
                value:  this.downloadAmount[1],
                itemStyle: {
                  color: '#3bb6d7'
                }
              },
              {
                value:  this.downloadAmount[2],
                itemStyle: {
                  color: '#34ce84'
                }
              }
            ]
          }
        ]
      }
      downloadChart.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(downloadChart){
          downloadChart.resize()
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
.download-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
