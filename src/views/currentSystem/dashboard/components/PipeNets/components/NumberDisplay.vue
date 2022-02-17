<template>
  <div class="total-container">
    <div class="total">
      <div class="top">
        <!-- <div class="circle" :style="{ borderColor: infos.color }">
          <span class="name">{{infos.totalName}}</span>
          <span class="number">{{infos.total}}</span>
        </div> -->
        <div class="chart" ref="chartTypeNum"></div>

        <div class="chart" ref="chartTypePc"></div>
      </div>
      <div class="bottom">
        <div class="left">
          <span class="name">{{infos.leftName}}</span>
          <span class="number">{{infos.leftNumber}}</span>
        </div>
        <div class="center">
          <span class="name">{{infos.centerName}}</span>
          <span class="number">{{infos.centerNuber}}</span>
        </div>
        <div class="right">
          <span class="name">{{infos.rightName}}</span>
          <span class="number">{{infos.rightNumber}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    infos: {
      type: Object,
      default: () => {
        return {
          color: '#7aa3e2',
          totalName: '巡查任务总数',
          total: '0',
          leftName: '巡查人员数',
          leftNumber: '0',
          centerName: '在线人员数',
          centerNuber: '0',
          rightName: '已完成总数',
          rightNumber: '0'
        }
      }
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts,
      total:0,    //总量
      typeNum:0,      //完成量 - 总量
      typeRate:0,     //完成率
      chartTypeNumData:[],      //完成量
      chartTypePcData:[],       //完成率
    }
  },
  watch:{
    infos:{
      handler(newV, oldV) {
　　　　 console.log("infos："+JSON.stringify(newV))
        this.infos = newV
        console.log("infos2："+JSON.stringify(this.infos ))
　　　},
　　　deep: true
    },
    chartData(newV,oldV){
      var that = this
      console.log("chartData："+JSON.stringify(newV))
      that.chartData = newV
      that.typeNum = 0
      that.total = 0
      that.chartTypeNumData = []
      that.chartData.forEach(function(item, index) {
        that.total += item.completeNum + item.unfinishedNum
        that.typeNum +=  item.completeNum 
        //完成量
        that.chartTypeNumData.push({value:item.completeNum,name:item.typeName})
      })
      if(that.total!==0)
        that.typeRate = Math.floor((that.typeNum/that.total) * 100) / 100
      console.log("完成率："+that.typeRate)
      that.drawChartTypeNum()
      that.drawChart() 
    }
  },
  methods: {
    /**
     * @description 绘制巡检两
     */
    drawChartTypeNum(){
      console.log("图形数组："+JSON.stringify(this.chartTypeNumData))
     
      if(this.arrayIsNull(this.chartTypeNumData)){
        console.log("数据为空")
        var html = '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.chartTypeNum
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      }else{
        const chartReadyNum = this.Echarts.init(this.$refs.chartTypeNum);
        let option = {
          title: {
              text: '巡检任务总数',
              subtext: this.total +'' ,
              x: 'center',
              y: '35%',
             textStyle: {
              fontWeight: 'normal',
              color: '#979797',
              fontSize: '14'
            },
             subtextStyle: {
              fontWeight: 'bold',
              color: '#595959',
              fontSize: '20'
            },
          },
          tooltip: {
              trigger: 'item',
              // formatter: '{a0}<br />{b0}: {c0}<br />占比: {d0}%'
              formatter: '{a0}: {c0}<br />占比: {d0}%'
          },

          series: [
              {
                  hoverAnimation: true, 
                  hoverOffset:2,
                  name: '完成量',
                  type: 'pie',
                  radius: ['86%', '96%'],
                  //  radius: ['70%', '75%'],
                  center: ['50%', '50%'],
                  label: {
                      show: false,
                      position: 'center'
                  },
                  labelLine: {
                      show: false
                  },
                  // label: {
                  //     alignTo: 'edge',
                  //     formatter: '{name|{b}}\n{time|{c} 小时}',
                  //     minMargin: 5,
                  //     edgeDistance: 10,
                  //     lineHeight: 15,
                  //     rich: {
                  //         time: {
                  //             fontSize: 10,
                  //             color: '#999'
                  //         }
                  //     }
                  // },
                  // labelLine: {
                  //     length: 15,
                  //     length2: 0,
                  //     maxSurfaceAngle: 80
                  // },
                  // labelLayout: function (params) {
                  //     var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                  //     var points = params.labelLinePoints;
                  //     // Update the end point.
                  //     points[2][0] = isLeft
                  //         ? params.labelRect.x
                  //         : params.labelRect.x + params.labelRect.width;

                  //     return {
                  //         labelLinePoints: points
                  //     };
                  // },
                  data: this.chartTypeNumData
              }
          ]
        };

        chartReadyNum.setOption(option)
        //自定义缩放
        window.addEventListener("resize", () => {
          if(chartReadyNum){
            chartReadyNum.resize()
          }
        })
      }
    },

    /**
     * @description 绘制完成率
     */
    drawChart() {
      const chartReadyPc = this.Echarts.init(this.$refs.chartTypePc);
      let option = {
        // silent: true,
          title: {
            text: '总完成率',
            subtext: this.typeRate+'%',
            x: 'center',
            y: '35%',
            textStyle: {
              fontWeight: 'normal',
              color: '#979797',
              fontSize: '14'
            },
            subtextStyle: {
              fontWeight: 'bold',
              color: '#595959',
              fontSize: '20'
            }
          },
          color: ['rgb(222, 222, 222)'],
          series: [
            {
              type: 'pie',
              radius: ['70%', '75%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              z: 0,
              itemStyle: {
                normal: {
                  color: '#ffffff',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              label: {
                normal: {
                  position: 'center'
                }
              },
              data: [100]
            },
            {
              name: 'Line 1',
              type: 'pie',
              clockWise: true,
              radius: ['86%', '96%'],
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              hoverAnimation: false,
              data: [
                {
                  value: this.typeRate,
                  name: '01',
                  itemStyle: {
                    normal: {
                      color: {
                        // 完成的圆环的颜色
                        colorStops: [
                          {
                            offset: 0,
                            color: '#dddddd' // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: '#2dc67d' // 100% 处的颜色
                          }
                        ]
                      },
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      }
                    }
                  }
                },
                {
                  name: '02',
                  value: (100-this.typeRate)
                }
              ]
            }
          ]
      }
      chartReadyPc.setOption(option)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReadyPc){
          chartReadyPc.resize()
        }
      })
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return (typeof(aryList) == "undefined" || aryList == null || aryList.length == 0);
    }, 
  },
  mounted() {
    this.drawChartTypeNum()
    this.drawChart();
  }
}
</script>

<style lang="scss" scoped>
.total-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .total {
    width: 100%;
    height: 90%;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    .top {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      // border:1px red solid;
      .circle {
        width: 90%;
        height: 90%;
        // border-radius: 50%;
        // border: 10px solid;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
      }
      .chart {
        width: 90%;
        height: 90%;
      }
    }
    .bottom {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .left,
      .center,
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .left,
      .center {
        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 100%;
          right: -50%;
          top: 0;
          background: #e9e9e9;
        }
      }
    }
    .name {
      font-size: 13px;
      color: #9f9f9f;
    }
    .number {
      padding-top: 6px;
      font-size: 20px;
      font-weight: bold;
      color: #5d5d5d;
    }
  }
}
</style>