<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{name}}</span>
    <div style="display:flex; width: 100%; height: 100%">
      <div class="chart-container" ref="clChart"></div>
      <div class="chart-container" ref="ntuChart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getTwoFactoryWaterQualityYL, getTwoFactoryWaterQualityZD  } from '@/api/dashboard'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      clData:[],
      ntuData:[],
    }
  },
  created(){
    this.getTwoFactoryWaterQualityYLList()
    this.getTwoFactoryWaterQualityZDList()
  },
  methods: {
    drwaChart() {
      const options = [
        {
          ref: "clChart",
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
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00',],
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
              name: "出厂余氯（mg/L）",
              nameTextStyle: {
                color: "#333"
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
          ref: "ntuChart",
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
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00',],
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
              name: " 浊度（NTU）",
              nameTextStyle: {
                color: "#333"
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
        },
      ]
      options.forEach(item => {
        const chartReady = this.Echarts.init(this.$refs[item.ref])
        chartReady.setOption(item)
      })
    },

    /**
     * @description 余氯
     */
    drwaChartCl(){
      if(this.arrayIsNull(this.clData)){
        var html = '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.clChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      }else{
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
                data: this.clData.map(function (item) {
                    return item.xAxisData;
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
                name: "出厂余氯(mg/L)",
                nameTextStyle: {
                  color: "#333",
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
                data: this.clData.map(function (item) {
                    return item.yAxisData;
                }),
                smooth: true
              }
            ]
        }
        const chartReadyCl = this.Echarts.init(this.$refs.clChart)
        chartReadyCl.setOption(options)

        //自定义缩放
        window.addEventListener("resize", () => {
          if(chartReadyCl){
            chartReadyCl.resize()
          }
        })
      }
    },

    /**
     * @description 浊度 
     */
    drwaChartNtu(){
      if(this.arrayIsNull(this.ntuData)){
        var html = '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.ntuChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      }else{
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
                data: this.ntuData.map(function (item) {
                    return item.xAxisData;
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
                name: "浊度(NTU)",
                nameTextStyle: {
                  color: "#333",
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
            color: ['#5470c6','#91cc75','#fac858'],
            legend: {
              data: ['浊度']
            },
            series: [
              {
                name: '浊度',
                type: 'line',
                data: this.ntuData.map(function (item) {
                    return item.yAxisData1;
                }),
                smooth: true
              }
            ]
        }
        const chartReadyNtu = this.Echarts.init(this.$refs.ntuChart)
        chartReadyNtu.setOption(options)

        //自定义缩放
        window.addEventListener("resize", () => {
          if(chartReadyNtu){
            chartReadyNtu.resize()
          }
        })
      }
    },

    /**
     * @description 一厂（水质曲线图） 余氯
     */
    getTwoFactoryWaterQualityYLList(){
      var that = this
      getTwoFactoryWaterQualityYL({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
              that.clData.push({
                xAxisData: that.formatTime(item.dateTime),
                yAxisData: item.waterSupplyValue
              })
            })
     
            that.drwaChartCl();
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 一厂（水质曲线图） 浊度 
     */
    getTwoFactoryWaterQualityZDList(){
      var that = this
      getTwoFactoryWaterQualityZD({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
              that.ntuData.push({
                xAxisData: that.formatTime(item.dateTime),
                yAxisData1: item.zd,
              })
            })

            that.drwaChartNtu();
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 格式化时间字符串(时分)
     */
    formatTime(times){
      var timearr = times.replace(" ", ":").replace(/\:/g, "-").split("-");
      // var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
      //var timestr = "" + timearr[1].split("")[1] + "月" + timearr[2] + "日\t" + timearr[3] + ":" + timearr[4] + ""
      var timestr = timearr[3] + ":" + timearr[4] + ""
      return timestr
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return (typeof(aryList) == "undefined" || aryList == null || aryList.length == 0);
    }, 
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