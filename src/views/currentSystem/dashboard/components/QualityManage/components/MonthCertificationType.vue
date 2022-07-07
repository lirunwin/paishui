<template>
  <div class="company-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div class="chart-container">
      <div ref="barChart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { noDataHtmlTemplate } from '@/utils/constant'
export default {
  props: {
    name: {
      type: String,
      default: '小组件标题'
    },
    monthCertificationType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts
    }
  },
  watch: {
    monthCertificationType(newV, oldV) {
      console.log('monthCertificationType：' + JSON.stringify(newV))
      this.monthCertificationType = newV

      this.drawChart()
    }
  },
  methods: {
    /**
     * @description 绘制图形
     */
    drawChart() {
      if (this.arrayIsNull(this.monthCertificationType)) {
        console.log('数据为空')
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.barChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const barChart = this.Echarts.init(this.$refs.barChart)

        //循环，增加颜色
        let _index = 0
        let color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']

        const xAxisData = []
        const seriesData = []
        this.monthCertificationType.forEach(function(item, index) {
          if (index >= color.length - 1) {
            _index = index - color.length
          } else {
            _index += 1
          }
          //x坐标
          xAxisData.push(item.name)
          seriesData.push({
            value: item.value,
            itemStyle: {
              color: color[_index]
            }
          })
        })

        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{a0}<br />{b0}: {c0} 个'
          },
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold'
          },
          toolbox: {
            show: true,
            feature: {
              magicType: { show: true, type: ['line', 'bar'] }
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
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
              name: '认证类型',
              type: 'bar',
              barMaxWidth: 40,
              data: seriesData
            }
          ]
        }
        barChart.setOption(options)
        //自定义缩放
        window.addEventListener('resize', () => {
          if (barChart) {
            barChart.resize()
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
.company-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container,
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
