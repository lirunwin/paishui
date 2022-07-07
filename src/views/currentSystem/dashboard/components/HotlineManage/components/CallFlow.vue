<template>
  <div class="business-data-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div class="chart-container">
      <div ref="chart" class="chart"></div>
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
      default: '标题'
    },
    callFlowList: {
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
    callFlowList(newV, oldV) {
      console.log('callFlowList：' + JSON.stringify(newV))
      this.callFlowList = newV

      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      if (this.arrayIsNull(this.callFlowList)) {
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.chart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const chartReady = this.Echarts.init(this.$refs.chart)
        //循环，增加颜色
        let _index = 0
        let color = ['#568ee6', '#4ac3e4', '#34ce84', '#efbc43', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']

        const xAxisData = []
        const seriesData = []
        this.callFlowList.forEach(function(item, index) {
          if (index >= color.length - 1) {
            _index = index - color.length
          } else {
            _index += 1
          }
          //x坐标
          xAxisData.push(item.name)
          seriesData.push({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: color[_index]
            }
          })
        })

        const options = {
          // legend: {
          //   left: 'center',
          //   top: 20,
          //   icon: "rect"
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{a0}<br />{b0}: {c0} 个'
          },
          // grid: {
          //   left: '3%',
          //   right: '3%',
          //   bottom: '3%',
          //   containLabel: true
          // },
          label: {
            show: true,
            position: 'right',
            fontWeight: 'bold'
          },
          xAxis: {
            type: 'value',
            name: '话务流量(个)',
            minInterval: 1,
            nameTextStyle: {
              color: '#333'
              // padding: [0, 0, 0, 80]    // 四个数字分别为上右下左与原位置距离
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
            type: 'category',
            data: xAxisData,
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
              name: '话务流量',
              type: 'bar',
              barMaxWidth: 30,
              data: seriesData
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
.business-data-container,
.chart-container,
.chart {
  width: 100%;
  height: 100%;
}
.business-data-container {
  padding: 10px;
}
</style>
