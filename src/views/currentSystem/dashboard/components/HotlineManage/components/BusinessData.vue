<template>
  <div class="business-data-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: ['name'],
  data() {
    return {
      Echarts
    }
  },
  methods: {
    drawChart() {
      const chartReady = this.Echarts.init(this.$refs.chart)
      const options = {
        label: {
          show: true,
          position: 'top'
        },
        xAxis: {
          type: 'category',
          data: ['上报数', '任务数', '处理数', '未处理数'],
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
            type: 'bar',
            barWidth: 40,
            data: [
              {
                value: 450,
                itemStyle: {
                  color: '#5a8cdd'
                }
              },
              {
                value: 80,
                itemStyle: {
                  color: '#36b1d3'
                }
              },
              {
                value: 200,
                itemStyle: {
                  color: '#30c77e'
                }
              },
              {
                value: 40,
                itemStyle: {
                  color: '#ed9442'
                }
              }
            ]
          }
        ]
      }
      chartReady.setOption(options)
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.business-data-container, .chart-container, .chart {
  width: 100%;
  height: 100%;
}
.business-data-container {
  padding: 10px;
}
</style>