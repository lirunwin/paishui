<template>
  <div class="company-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div ref="barChart" class="chart" ></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    name: {
      type: String,
      default: '小组件标题'
    },
    monthCertificationType:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts
    }
  },
  watch:{
    monthCertificationType(newV,oldV){
      console.log("monthCertificationType："+JSON.stringify(newV))
      this.monthCertificationType = newV

      this.drawChart()
    }
  },
  methods: {
    /**
     * @description 绘制图形
     */
    drawChart() {
      if(this.arrayIsNull(this.monthCertificationType)){
        console.log("数据为空")
        var html = '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.barChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')

      }else{
        const barChart = this.Echarts.init(this.$refs.barChart)

        //循环，增加颜色
        let _index = 0
        let color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452','#9a60b4','#ea7ccc']
        
        const xAxisData = [];
        const seriesData = [];
        this.monthCertificationType.forEach(function(item, index) {
          if(index>=color.length-1){
            _index = index - color.length
          }else{
            _index+=1
          }
          //x坐标
          xAxisData.push(item.name)
          seriesData.push({
            value:item.value,
            itemStyle: {
              color:color[_index]
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
              name:'认证类型',
              type: 'bar',
              barMaxWidth: 40,
              data:seriesData
            }
          ]
        }
        barChart.setOption(options)
        //自定义缩放
        window.addEventListener("resize", () => {
          if(barChart){
            barChart.resize()
          }
        })
      }
    },
    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return (typeof(aryList) == "undefined" || aryList == null || aryList.length == 0);
    }, 
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
  .chart-container,.chart {
    width: 100%;
    height: 100%;
  }
}
</style>
