<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getTwoFactoryWaterPressure } from '@/api/dashboard'
import { noDataHtmlTemplate } from '@/utils/constant'
export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      chartData: []
    }
  },
  created() {
    this.getTwoFactoryWaterPressureList()
  },
  methods: {
    /**
     * @description 水压
     */
    drwaChart() {
      if (this.arrayIsNull(this.chartData)) {
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.chart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} Mpa'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.chartData.map(function(item) {
                return item.xAxisData
              }),
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333',
                rotate: '-25'
              }
            }
          ],
          yAxis: [
            {
              name: '出厂压力(Mpa)',
              nameTextStyle: {
                color: '#333',
                padding: [0, 0, 0, 80]
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333'
              },
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087'],
          legend: {
            data: ['1#出厂水压', '2#出厂水压']
          },
          series: [
            {
              name: '1#出厂水压',
              type: 'line',
              data: this.chartData.map(function(item) {
                return item.yAxisData1
              }),
              smooth: true
            },
            {
              name: '2#出厂水压',
              type: 'line',
              data: this.chartData.map(function(item) {
                return item.yAxisData2
              }),
              smooth: true
            }
          ]
        }
        const chartReadyCl = this.Echarts.init(this.$refs.chart)
        chartReadyCl.setOption(options)

        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReadyCl) {
            chartReadyCl.resize()
          }
        })
      }
    },
    /**
     * @description 一厂 水压
     */
    getTwoFactoryWaterPressureList() {
      var that = this
      getTwoFactoryWaterPressure({}).then((res) => {
        if (res.code !== -1) {
          let _resultList = res.result
          _resultList.forEach(function(item, index) {
            that.chartData.push({
              xAxisData: that.formatTime(item.dateTime),
              yAxisData1: item.sy1,
              yAxisData2: item.sy2
            })
          })

          that.drwaChart()
        } else {
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 格式化时间字符串(时分)
     */
    formatTime(times) {
      let timestr = ''
      if (!this.strIsNull(times)) {
        let timearr = times
          .replace(' ', ':')
          .replace(/\:/g, '-')
          .split('-')
        // var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
        //var timestr = "" + timearr[1].split("")[1] + "月" + timearr[2] + "日\t" + timearr[3] + ":" + timearr[4] + ""
        timestr = timearr[3] + ':' + timearr[4] + ''
      }
      return timestr
    },

    /**
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal === 'undefined' || strVal == null || strVal == ''
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    }
  },
  mounted() {
    // this.drwaChart()
  }
}
</script>

<style lang="scss" scoped>
.sup-use-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .chart-container {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}
</style>
