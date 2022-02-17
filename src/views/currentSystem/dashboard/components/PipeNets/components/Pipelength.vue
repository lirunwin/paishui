<template>
  <div class="pipelength-container">
    <span style="font-weight: bold">{{name}}</span>
    <div ref="chartBar" class="chart-container"></div>
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
    pipelength:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts,
      total:0,
      xAxisData:[],
      seriesData:[]
    }
  },
  watch:{
    pipelength(newV,oldV){
      var that = this
      console.log("pipelength："+JSON.stringify(newV))
      that.pipelength = newV
      
      that.total = 0
      //循环赋值
      that.pipelength.forEach(function(item, index) {
        that.xAxisData.push(item.name)
        that.seriesData.push(item.value)
        that.total += item.value
      });

      that.total = that.total.toFixed(1)

      that.drawChart()
    }
  },
  methods: {
    drawChart() {
      const chartReady = this.Echarts.init(this.$refs.chartBar)
      const options = {
        title: {
          text: '长度：'+this.total+" m",
          x: 'right',
          textStyle: {
              fontWeight: 'normal',
              color: '#979797',
              fontSize: '14'
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {           
            type: 'shadow'        
          },
          formatter: '{a0}<br />{b0}: {c0} m'
        },
        label: {
          show: true,
          position: 'top'
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          name: "片区",
          nameTextStyle: {
            color: "#333"
          },
          type: 'category',
          data: this.xAxisData,//['A', 'B', 'C', 'D', 'E', 'F', 'G'],
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
          name: "长度（m）",
          nameTextStyle: {
            color: "#333"
          },
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
        color: ['#578adc'],
        series: [
          {
            type: 'bar',
            name:'片区长度',
            barWidth: 20,
            data: this.seriesData //[64668.5, 35245.5, 59118.2, 14052.5, 99000.6, 43703.7, 42620.2]
          }
        ]
      }
      chartReady.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReady){
          chartReady.resize()
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
.pipelength-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>