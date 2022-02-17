<template>
  <div class="total-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div class="chart" ref="chartEconomic"></div>
      <div class="chart" ref="chartSocial"></div>
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
    yearEconomicSocial:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts,
      economicList:[],
      economicTotle:0,
      socialList:[],
      socialTotle:0,
    }
  },
  watch:{
    yearEconomicSocial(newV,oldV){
      var that = this
      console.log("yearEconomicSocial："+JSON.stringify(newV))
      that.yearEconomicSocial = newV
      that.economicTotle = 0
      that.socialTotle = 0
      that.yearEconomicSocial.forEach(function(item, index) {
        //经济效益
        that.economicTotle += item.economicBenefitsSum
        that.economicList.push({
          name:item.typeName,
          value:item.economicBenefitsSum,
        })

        //社会效益
        that.socialTotle += item.socialBenefitNum
        that.socialList.push({
          name:item.typeName,
          value:item.socialBenefitNum,
        })
      })

      that.drawChartEconomic()
      that.drawChartSocial()
    }
  },
  methods: {
    /**
     * @description 经济效益
     */
    drawChartEconomic() {
      const chartReady = this.Echarts.init(this.$refs.chartEconomic);
      const options = {
        title: {
          text: '经济效益',
          subtext: this.economicTotle,
          x: 'center',
          y: '45%',
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
          formatter: '{a0}<br />{b0}: {c0} 只<br />占比: {d0} %'
        },
        series: [
            {
                name: '经济效益',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                // roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                color: ['#6f9de7', '#3bb6d7', '#34ce84', '#FFD700', '#9932CC', '#D2691E', '#3CB371','#f6da22','#bbe2e8','#6cacde'],
                data: this.economicList,
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
      chartReady.setOption(options)
    },

    /**
     * @description 社会效益
     */
    drawChartSocial() {
      const chartReady = this.Echarts.init(this.$refs.chartSocial);
      const options = {
        title: {
          text: '社会效益',
          subtext: this.socialTotle,
          x: 'center',
          y: '45%',
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
          formatter: '{a0}<br />{b0}: {c0} 只<br />占比: {d0} %'
        },
        series: [
            {
                name: '社会效益',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                // roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                color: ['#6f9de7', '#3bb6d7', '#34ce84', '#FFD700', '#9932CC', '#D2691E', '#3CB371','#f6da22','#bbe2e8','#6cacde'],
                data: this.socialList,
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
      chartReady.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReady){
          chartReady.resize()
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
    this.drawChartEconomic()
    this.drawChartSocial()
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