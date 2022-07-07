<template>
  <div class="pipelength-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div ref="pipeLength" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { noDataHtmlTemplate } from '@/utils/constant'
export default {
  props: {
    name: {
      type: String,
      default: '标题'
    },
    currentMonthFixConditions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts,
      xAxisData: [],
      seriesData_Over: [],
      seriesData_All: []
    }
  },
  watch: {
    currentMonthFixConditions(newV, oldV) {
      var that = this
      console.log('currentMonthFixConditions：' + JSON.stringify(newV))
      that.currentMonthFixConditions = newV
      that.currentMonthFixConditions.forEach(function(item, index) {
        that.xAxisData.push(item.regionName)
        that.seriesData_Over.push(item.completedOrder)
        that.seriesData_All.push(item.totalOrder)
      })

      that.drawChart()
    }
  },
  methods: {
    drawChart() {
      var that = this
      if (this.arrayIsNull(that.xAxisData)) {
        console.log('数据为空')
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.pipeLength
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const chartReady = that.Echarts.init(this.$refs.pipeLength)
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} 个<br />{a1}: {c1} 个'
          },
          label: {
            show: true,
            position: ['35%', '50%'],
            color: '#ffffff'
          },
          legend: {
            data: ['抢维修任务数', '已完成任务数'],
            icon: 'rect'
          },
          color: ['#2cc57c', '#efbc45'],
          xAxis: {
            type: 'category',
            data: that.xAxisData,
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
              name: '已完成任务数',
              type: 'bar',
              data: that.seriesData_Over,
              stack: 'total',
              barMaxWidth: 20
            },
            {
              name: '抢维修任务数',
              type: 'bar',
              data: that.seriesData_All,
              stack: 'total',
              barMaxWidth: 20
            }
          ]
        }
        chartReady.setOption(options)
        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReady) {
            chartReady.resize()
          }
        })
      }
    },
    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.pipelength-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
