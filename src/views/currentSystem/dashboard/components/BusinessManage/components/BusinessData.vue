<template>
  <div class="buisnessdata-container">
    <span style="font-weight: bold">{{title}}</span>
    <div ref="businessData" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    title: {
      type: String,
      default: '小组件标题'
    },
    business:{
      type: Array,
      default: () => [0,0,0]
    }
  },
  data() {
    return {
      Echarts
    }
  },
  watch:{
    business(newV,oldV){
      console.log("business："+JSON.stringify(newV))
      this.business = newV
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      const businessData = this.Echarts.init(this.$refs.businessData)
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
        xAxis: {
          type: 'category',
          data: ['受理总数', '已完成数', '未完成数'],
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
            name:'业务数据',
            type: 'bar',
            barMaxWidth: 40,
            data: [
              {
                value: this.business[0],
                itemStyle: {
                  color: '#6f9de7'
                }
              },
              {
                value: this.business[1],
                itemStyle: {
                  color: '#3bb6d7'
                }
              },
              {
                value: this.business[2],
                itemStyle: {
                  color: '#34ce84'
                }
              }
            ]
          }
        ]
      }
      businessData.setOption(options)
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.buisnessdata-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
