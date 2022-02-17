<template>
  <div class="company-container">
    <span style="font-weight: bold">{{name}}</span>
    <div ref="companyChart" class="chart-container"></div>
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
    numberOfCompany:{
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
    numberOfCompany(newV,oldV){
      console.log("numberOfCompany："+JSON.stringify(newV))
      this.numberOfCompany = newV
      this.drawChart()
    }
  },
  methods: {
    /**
     * @description 绘制图形
     */
    drawChart() {
      const companyChart = this.Echarts.init(this.$refs.companyChart)
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a0}<br />{b0}: {c0} 只<br />占比: {d0} %'
        },
        series: [
            {
                name: '厂家水表只数',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                // roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452','#9a60b4','#ea7ccc'],
                data: this.numberOfCompany,
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
      }
      
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
      //           value: 1000,
      //           itemStyle: {
      //             color: '#6f9de7'
      //           }
      //         },
      //         {
      //           value: 1500,
      //           itemStyle: {
      //             color: '#3bb6d7'
      //           }
      //         },
      //         {
      //           value: 500,
      //           itemStyle: {
      //             color: '#34ce84'
      //           }
      //         },
      //         {
      //           value: 500,
      //           itemStyle: {
      //             color: '#FFD700'
      //           }
      //         },
      //         {
      //           value: 500,
      //           itemStyle: {
      //             color: '#9932CC'
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // }
      companyChart.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(companyChart){
          companyChart.resize()
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
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.company-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
