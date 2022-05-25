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
          <span class="name">{{ infos.leftName }}</span>
          <span class="number">{{ infos.leftNumber }}</span>
        </div>
        <div class="center">
          <span class="name">{{ infos.centerName }}</span>
          <span class="number">{{ infos.centerNuber }}</span>
        </div>
        <div class="right">
          <span class="name">{{ infos.rightName }}</span>
          <span class="number">{{ infos.rightNumber }}</span>
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
      total: 0, //总量
      typeNum: 0, //完成量 - 总量
      typeRate: 0, //完成率
      chartTypeNumData: [], //完成量
      chartTypePcData: [] //完成率
    }
  },
  watch: {
    infos: {
      handler(newV, oldV) {
        console.log('infos：' + JSON.stringify(newV))
        this.infos = newV
        console.log('infos2：' + JSON.stringify(this.infos))
      },
      deep: true
    },
    chartData(newV, oldV) {
      var that = this
      console.log('chartData：' + JSON.stringify(newV))
      that.chartData = newV
      that.typeNum = 0
      that.total = 0
      that.chartTypeNumData = []
      that.chartData.forEach(function(item, index) {
        that.total += item.completeNum + item.unfinishedNum
        that.typeNum += item.completeNum
        //完成量
        that.chartTypeNumData.push({ value: item.completeNum, name: item.typeName })
      })
      if (that.total !== 0) that.typeRate = Math.floor((that.typeNum / that.total) * 100) / 100
      console.log('完成率：' + that.typeRate)
      that.drawChartTypeNum()
      that.drawChart()
    }
  },
  methods: {
    /**
     * @description 绘制巡检两
     */
    drawChartTypeNum() {
      console.log('图形数组：' + JSON.stringify(this.chartTypeNumData))

      if (this.arrayIsNull(this.chartTypeNumData)) {
        console.log('数据为空')
        var html =
          '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,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" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.chartTypeNum
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const chartReadyNum = this.Echarts.init(this.$refs.chartTypeNum)
        let option = {
          title: {
            text: '巡检任务总数',
            subtext: this.total + '',
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
          tooltip: {
            trigger: 'item',
            // formatter: '{a0}<br />{b0}: {c0}<br />占比: {d0}%'
            formatter: '{a0}: {c0}<br />占比: {d0}%'
          },

          series: [
            {
              hoverAnimation: true,
              hoverOffset: 2,
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
        }

        chartReadyNum.setOption(option)
        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReadyNum) {
            chartReadyNum.resize()
          }
        })
      }
    },

    /**
     * @description 绘制完成率
     */
    drawChart() {
      const chartReadyPc = this.Echarts.init(this.$refs.chartTypePc)
      let option = {
        // silent: true,
        title: {
          text: '总完成率',
          subtext: this.typeRate + '%',
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
                value: 100 - this.typeRate
              }
            ]
          }
        ]
      }
      chartReadyPc.setOption(option)
      //自定义缩放
      window.addEventListener('resize', () => {
        if (chartReadyPc) {
          chartReadyPc.resize()
        }
      })
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    }
  },
  mounted() {
    this.drawChartTypeNum()
    this.drawChart()
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
          content: '';
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
