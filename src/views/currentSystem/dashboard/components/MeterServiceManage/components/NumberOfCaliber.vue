<template>
  <div class="brokenMeter-container">
    <span style="font-weight: bold">{{name}}</span>
    <div ref="brokenMeterChart" class="chart-container"></div>
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
    numberOfCaliber:{
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
    numberOfCaliber(newV,oldV){
      console.log("numberOfCaliber："+JSON.stringify(newV))
      this.numberOfCaliber = newV
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      const brokenMeterChart = this.Echarts.init(this.$refs.brokenMeterChart)
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a0}<br />{b0}: {c0} 只<br />占比: {d0}%'
        },
        series: [
            {
                name: '出库数',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                color: ['#6f9de7', '#3bb6d7', '#34ce84', '#FFD700', '#9932CC', '#D2691E', '#3CB371','#f6da22','#bbe2e8','#6cacde'],
                data: this.numberOfCaliber,
                label: {
                  show: true,
                  formatter: '{name|{b}}\n{time|{c} 只}',
                  padding: [0, -20],
                  rich: {
                    time: {
                      
                    }
                  }
                },
                labelLine: {
                  length: 15,
                  length2: 40,
                  maxSurfaceAngle: 80
                },
                labelLayout: function (params) {
                    var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                    var points = params.labelLinePoints;
                    // Update the end point.
                    points[2][0] = isLeft
                        ? params.labelRect.x
                        : params.labelRect.x + params.labelRect.width;

                    return {
                        labelLinePoints: points
                    };
                },
            },
            
        ]
      };
      // const options = {
      //   label: {
      //     show: true,
      //     position: 'top',
      //     fontWeight: 'bold'
      //   },
      //   toolbox: {
      //     show: true,
      //     feature: {
      //       magicType: { show: true, type: ['line', 'bar'] }
      //     }
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: ['华旭', '山科', '新天', '竞达', '海力'],
      //     axisTick: {
      //       show: false
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: '#eaeaea'
      //       }
      //     },
      //     axisLabel: {
      //       color: '#333'
      //     }
      //   },
      //   yAxis: {
      //     type: 'value',
      //     axisLine: {
      //       lineStyle: {
      //         color: '#eaeaea'
      //       }
      //     },
      //     axisLabel: {
      //       color: '#333'
      //     }
      //   },
      //   series: [
      //     {
      //       type: 'bar',
      //       barWidth: 30,
      //       data: [
      //         {
      //           value: 20,
      //           itemStyle: {
      //             color: '#6f9de7'
      //           }
      //         },
      //         {
      //           value: 100,
      //           itemStyle: {
      //             color: '#3bb6d7'
      //           }
      //         },
      //         {
      //           value: 80,
      //           itemStyle: {
      //             color: '#34ce84'
      //           }
      //         },
      //         {
      //           value: 150,
      //           itemStyle: {
      //             color: '#FFD700'
      //           }
      //         },
      //         {
      //           value: 50,
      //           itemStyle: {
      //             color: '#9932CC'
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // }
      brokenMeterChart.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(brokenMeterChart){
          brokenMeterChart.resize()
        }
      })
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.brokenMeter-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
