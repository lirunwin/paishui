<template>
  <div class="difference-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div ref="leftChart" class="left-chart"></div>
      <div ref="rightChart" class="right-chart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getLeakage , getLeakageMonth } from '@/api/dashboard'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,

      pieData:[],
      rightData1:[],
      rightData2:[]
    }
  },
  created(){
    this.getLeakageList()
    this.getLeakageMonthList()
  },
  methods: {
    /**
     * @description 绘制饼图
     */
    drawChartPie() {
      // console.log("drawChartPie："+JSON.stringify(this.pieData))

      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a0}<br />{b0}: {c0} m³<br />占比: {d0} %'
        },
        legend: {
          left: 'center',
          top: 20,
          icon: "rect"
        },
        series: [
          {
            name: '漏损率',
            type: 'pie',
            radius: '55%',
            top: 20,
            color: ['#568ee6', '#3fc9ee'],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{d}%'
            }
          }
        ]
      }
      
      const leftChartReady = this.Echarts.init(this.$refs.leftChart)
      leftChartReady.setOption(options)

      //自定义缩放
      window.addEventListener("resize", () => {
        if(leftChartReady){
          leftChartReady.resize()
        }
      })
    },

    /**
     * @description 绘制柱状、曲线
     */
    drawChartLine(){
      // console.log("drawChartLine："+JSON.stringify(this.seriesData1) +"  "+JSON.stringify(this.seriesData2))

      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {           
              type: 'shadow'        
          },
          formatter: '{b0}<br />{a0}: {c0} m³<br />{a1}: {c1} m³'
        },
        legend: {
          left: 'center',
          top: 20,
          icon: "rect"
        },
        label: {
          show: true,
          position: 'top',
          color: '#333',
          fontWeight: "bold"
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
          }
        },
        // grid: {
        //   left: '3%',
        //   right: '3%',
        //   bottom: '3%',
        //   containLabel: true
        // },
       
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水量(m³)',
            nameTextStyle: {
              color: "#333"
            },
            axisLine: {
              lineStyle: {
                color: '#eaeaea'
              },
            },
            axisLabel: {
              color: '#333'
            }
          }
        ],
        color: ['#255bbb', '#efbc43'],
        series: [
          {
            name:'累计值',
            type: 'bar',
            data:  this.rightData1,
            barMaxWidth: 20,
          },
          {
            name:'预算值',
            type: 'bar',
            data:  this.rightData2,
            barMaxWidth: 20,
          }
        ]
      }

      const rightChartReady = this.Echarts.init(this.$refs.rightChart)
      rightChartReady.setOption(options)

        //自定义缩放
      window.addEventListener("resize", () => {
        if(rightChartReady){
          rightChartReady.resize()
        }
      })
    },

    /**
     * @description 产销差 饼状图
     */
    getLeakageList(){
      var that = this
      getLeakage({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            that.pieData.push({
              name: '本年累计值',
              value: _resultList.totalCumulative.toFixed(1)
            })

            that.pieData.push({
               name: '预算值',
               value: _resultList.totalBudget.toFixed(1)
            })

            that.drawChartPie();
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 漏损率 柱状图
     */
    getLeakageMonthList(){
      var that = this
      getLeakageMonth({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
              that.rightData1.push(item.totalCumulative.toFixed(1))
              that.rightData2.push(item.totalBudget.toFixed(1))
            })
            that.drawChartLine()

         }else{
           that.$message.error(res.message)
         }
      })
    },
  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
.difference-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-chart, .right-chart {
      width: 30%;
      height: 100%;
    }
    .right-chart {
      width: 70%;
    }
  }
}
</style>