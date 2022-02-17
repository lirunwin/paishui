<template>
  <div class="company-container">
    <span style="font-weight: bold">{{name}}</span>
    <div ref="waterMeterChart" class="chart-container"></div>
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
    numberOfWaterMeter:{
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
    numberOfWaterMeter(newV,oldV){
      console.log("numberOfWaterMeter："+JSON.stringify(newV))
      this.numberOfWaterMeter = newV

      this.drawChart()
    }
  },
  methods: {
    /**
     * @description 绘制图形
     */
    drawChart() {
      const waterMeterChart = this.Echarts.init(this.$refs.waterMeterChart)
      
       //循环，增加颜色
      let _index = 0
      let color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452','#9a60b4','#ea7ccc']
      const waterMeterList= [];
      this.numberOfWaterMeter.forEach(function(item, index) {
        if(index>=color.length-1){
          _index = 0
        }else{
          _index ++
        }
        waterMeterList.push({
          value:item,
           itemStyle: {
              color:color[_index]
            }
        })
      })

      const options = {
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{a0}<br />{b0}: {c0} 个'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] }
          }
        },
        xAxis: {
          type: 'category',
          data: ['总数', '已出库', '未出库', '新装数', '报废数'],
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
            name:'库存统计',
            type: 'bar',
            barMaxWidth: 40,
            data: waterMeterList
            // [
            //   {
            //     value: this.numberOfWaterMeter[0],
            //     itemStyle: {
            //       color: '#6f9de7'
            //     }
            //   },
            //   {
            //     value: 1500,
            //     itemStyle: {
            //       color: '#3bb6d7'
            //     }
            //   },
            //   {
            //     value: 500,
            //     itemStyle: {
            //       color: '#34ce84'
            //     }
            //   },
            //   {
            //     value: 500,
            //     itemStyle: {
            //       color: '#FFD700'
            //     }
            //   },
            //   {
            //     value: 500,
            //     itemStyle: {
            //       color: '#9932CC'
            //     }
            //   }
            // ]
          }
        ]
      }
      waterMeterChart.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(waterMeterChart){
          waterMeterChart.resize()
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
