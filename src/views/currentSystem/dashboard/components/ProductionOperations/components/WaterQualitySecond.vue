<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div style="display:flex; width: 100%; height: 100%">
      <div class="chart-container" ref="clChart"></div>
      <div class="chart-container" ref="ntuChart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getTwoFactoryWaterQualityYL, getTwoFactoryWaterQualityZD } from '@/api/dashboard'
import { noDataHtmlTemplate } from '@/utils/constant'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      clData: [],
      ntuData: []
    }
  },
  created() {
    this.getTwoFactoryWaterQualityYLList()
    this.getTwoFactoryWaterQualityZDList()
  },
  methods: {
    drwaChart() {
      const options = [
        {
          ref: 'clChart',
          tooltip: {
            trigger: 'axis'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00'],
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
              name: '出厂余氯（mg/L）',
              nameTextStyle: {
                color: '#333'
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
          color: ['#51cdf0'],
          legend: {
            data: ['余氯']
          },
          series: [
            {
              name: '余氯',
              type: 'line',
              data: [0.55, 0.56, 0.55, 0.58, 0.6, 0.57, 0.58, 0.6],
              smooth: true
            }
          ]
        },
        {
          ref: 'ntuChart',
          tooltip: {
            trigger: 'axis'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00'],
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
              name: ' 浊度（NTU）',
              nameTextStyle: {
                color: '#333'
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
          color: ['#ee9b50'],
          legend: {
            data: ['浊度（NTU）']
          },
          series: [
            {
              name: '浊度（NTU）',
              type: 'line',
              data: [0.35, 0.36, 0.36, 0.35, 0.36, 0.35, 0.36, 0.38],
              smooth: true
            }
          ]
        }
      ]
      options.forEach((item) => {
        const chartReady = this.Echarts.init(this.$refs[item.ref])
        chartReady.setOption(item)
      })
    },

    /**
     * @description 余氯
     */
    drwaChartCl() {
      if (this.arrayIsNull(this.clData)) {
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.clChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} mg/L'
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
              data: this.clData.map(function(item) {
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
              name: '出厂余氯(mg/L)',
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
          color: ['#51cdf0'],
          legend: {
            data: ['余氯']
          },
          series: [
            {
              name: '余氯',
              type: 'line',
              data: this.clData.map(function(item) {
                return item.yAxisData
              }),
              smooth: true
            }
          ]
        }
        const chartReadyCl = this.Echarts.init(this.$refs.clChart)
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
     * @description 浊度
     */
    drwaChartNtu() {
      if (this.arrayIsNull(this.ntuData)) {
        var html = noDataHtmlTemplate
        var chartDom = this.$refs.ntuChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} mg/L<br />{a1}: {c1}mg/L<br />{a2}: {c12} mg/L'
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
              data: this.ntuData.map(function(item) {
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
              name: '浊度(NTU)',
              nameTextStyle: {
                color: '#333',
                padding: [0, 0, 0, 50]
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
          color: ['#5470c6', '#91cc75', '#fac858'],
          legend: {
            data: ['浊度']
          },
          series: [
            {
              name: '浊度',
              type: 'line',
              data: this.ntuData.map(function(item) {
                return item.yAxisData1
              }),
              smooth: true
            }
          ]
        }
        const chartReadyNtu = this.Echarts.init(this.$refs.ntuChart)
        chartReadyNtu.setOption(options)

        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReadyNtu) {
            chartReadyNtu.resize()
          }
        })
      }
    },

    /**
     * @description 一厂（水质曲线图） 余氯
     */
    getTwoFactoryWaterQualityYLList() {
      var that = this
      getTwoFactoryWaterQualityYL({}).then((res) => {
        if (res.code !== -1) {
          let _resultList = res.result
          _resultList.forEach(function(item, index) {
            that.clData.push({
              xAxisData: that.formatTime(item.dateTime),
              yAxisData: item.waterSupplyValue
            })
          })

          that.drwaChartCl()
        } else {
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 一厂（水质曲线图） 浊度
     */
    getTwoFactoryWaterQualityZDList() {
      var that = this
      getTwoFactoryWaterQualityZD({}).then((res) => {
        if (res.code !== -1) {
          let _resultList = res.result
          _resultList.forEach(function(item, index) {
            that.ntuData.push({
              xAxisData: that.formatTime(item.dateTime),
              yAxisData1: item.zd
            })
          })

          that.drwaChartNtu()
        } else {
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 格式化时间字符串(时分)
     */
    formatTime(times) {
      var timearr = times
        .replace(' ', ':')
        .replace(/\:/g, '-')
        .split('-')
      // var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
      //var timestr = "" + timearr[1].split("")[1] + "月" + timearr[2] + "日\t" + timearr[3] + ":" + timearr[4] + ""
      var timestr = timearr[3] + ':' + timearr[4] + ''
      return timestr
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
    width: 50%;
    height: 100%;
    padding: 20px;
  }
}
</style>
