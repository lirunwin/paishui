<template>
  <div class="missions-container">
    <span style="font-weight: bold">任务数</span>
    <div ref="missionChart" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    missions:{
      type: Array,
      default: () => [0,0,0]
    }
  },
  data() {
    return {
      // missionsList:[],
      Echarts
    }
  },
  watch:{
    missions(newV,oldV){
       console.log("missions："+JSON.stringify(newV))
      this.missions = newV
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      console.log("测试："+JSON.stringify(this.missions))

      const missionChart = this.Echarts.init(this.$refs.missionChart)
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
          data: ['计划分配数', '已分配', '未分配'],
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
          // name: "任务数",
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
            name:'任务数',
            type: 'bar',
            barMaxWidth: 40,
            data: [
              {
                value: this.missions[0],
                itemStyle: {
                  color: '#6f9de7'
                }
              },
              {
                value: this.missions[1],
                itemStyle: {
                  color: '#3bb6d7'
                }
              },
              {
                value: this.missions[2],
                itemStyle: {
                  color: '#34ce84'
                }
              }
            ]
          }
        ]
      }
      missionChart.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(missionChart){
          missionChart.resize()
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
.missions-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
