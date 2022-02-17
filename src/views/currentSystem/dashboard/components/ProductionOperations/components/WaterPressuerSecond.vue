<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getTwoFactoryWaterPressure  } from '@/api/dashboard'
export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      chartData:[],
    }
  },
  created(){
    this.getTwoFactoryWaterPressureList()
  },
  methods: {
    /**
     * @description 水压
     */
    drwaChart(){
      if(this.arrayIsNull(this.chartData)){
        var html = '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.chart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      }else{
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
                data: this.chartData.map(function (item) {
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
                name: "出厂压力(Mpa)",
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
            color: ['#80FFA5','#00DDFF','#37A2FF','#FF0087'],
            legend: {
              data: ['1#出厂水压','2#出厂水压']
            },
            series: [
              {
                name: '1#出厂水压',
                type: 'line',
                data: this.chartData.map(function (item) {
                    return item.yAxisData1;
                }),
                smooth: true
              },
              {
                name: '2#出厂水压',
                type: 'line',
                data: this.chartData.map(function (item) {
                    return item.yAxisData2;
                }),
                smooth: true
              }
            ]
        }
        const chartReadyCl = this.Echarts.init(this.$refs.chart)
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
     * @description 一厂 水压
     */
    getTwoFactoryWaterPressureList(){
      var that = this
      getTwoFactoryWaterPressure({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
              that.chartData.push({
                xAxisData: that.formatTime(item.dateTime),
                yAxisData1: item.sy1,
                yAxisData2: item.sy2
              })
            })
     
            that.drwaChart();
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 格式化时间字符串(时分)
     */
    formatTime(times){
      let timestr = '';
      if(!this.strIsNull(times)){
        let timearr = times.replace(" ", ":").replace(/\:/g, "-").split("-");
        // var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
        //var timestr = "" + timearr[1].split("")[1] + "月" + timearr[2] + "日\t" + timearr[3] + ":" + timearr[4] + ""
        timestr = timearr[3] + ":" + timearr[4] + ""
      }
       return timestr
    },

    
    /**
		 * @description 判断字符串是否为空
		 */
    strIsNull(strVal) {
      strVal = strVal || ''
      return (typeof (strVal) === 'undefined' || strVal == null || strVal == '')
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
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}
</style>