<template>
  <div class="total-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div class="chart" ref="chartQualified"></div>
      <div class="chart" ref="chartTimeout"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    name:{
       type: String,
       default: ''
    },
    yearQualifiedTimeout:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts,
      qualifiedRate:0,
      timeoutRate:0,
    }
  },
  watch:{
    yearQualifiedTimeout(newV,oldV){
      var that = this
      console.log("yearQualifiedTimeout："+JSON.stringify(newV))
      that.yearQualifiedTimeout = newV
      //设置合格率，超时率
      this.qualifiedRate = that.yearQualifiedTimeout[1]
      this.timeoutRate = that.yearQualifiedTimeout[3]

      this.drawChartQualified()
      this.drawChartTimeout()
    }
  },
  methods: {
    /**
     * @description 合格率
     */
    drawChartQualified() {
      const chartReady = this.Echarts.init(this.$refs.chartQualified);
      let option = {
        // silent: true,
          title: {
            text: '合格率',
            subtext: this.qualifiedRate+'%',
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
                  value: this.qualifiedRate,
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
                  value: (100-this.qualifiedRate)
                }
              ]
            }
          ]
      }
      chartReady.setOption(option)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReady){
          chartReady.resize()
        }
      })
    },

    /**
     * @description 超时率
     */
    drawChartTimeout() {
      const chartReady = this.Echarts.init(this.$refs.chartTimeout);
      let option = {
        // silent: true,
          title: {
            text: '超时率',
            subtext: this.timeoutRate+'%',
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
                  value: this.timeoutRate,
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
                  value: (100-this.timeoutRate)
                }
              ]
            }
          ]
      }
      chartReady.setOption(option)
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return (typeof(aryList) == "undefined" || aryList == null || aryList.length == 0);
    }, 
  },
  mounted() {
    this.drawChartQualified()
    this.drawChartTimeout()
  }
}
</script>

<style lang="scss" scoped>
.total-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // border: 1px red solid;

    .chart {
      width: 90%;
      height: 90%;
        // border: 1px red solid;
    }
  }
}
</style>