<template>
  <div class="sup-sell-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container">
      <div ref="leftChart" class="left-chart"></div>
      <div ref="rightChart" class="right-chart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getFeedSale , getFeedSaleMonth} from '@/api/dashboard'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      leftData1:[],
      leftData2:[],
      rightData1:[],
      rightData2:[],
    }
  },
  created(){
    this.getFeedSaleList()
    this.getFeedSaleMonthList()
  },
  methods: {
    drwaChart() {
      const charts = [
        {
          ref: 'left',
          options: {
            label: {
              show: true,
              position: ['35%', '50%'],
              color: '#ffffff'
            },
            legend: {
              data: ['供水量', '售水量'],
              top: 20,
              icon: 'rect'
            },
            color: ['#2cc57c', '#efbc45'],
            xAxis: {
              type: 'category',
              data: ['供水量', '售水量'],
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
                name: '供水量',
                type: 'bar',
                data: [555.4588, 516.3364],
                stack: 'total',
              },
              {
                name: '售水量',
                type: 'bar',
                data: [485.3836, 450.3365],
                stack: 'total',
              }
            ]
          }
        },
        {
          ref: 'right',
          options: {
            tooltip: {
              trigger: 'axis'
            },
            toolbox: {
              show: true,
              feature: {
                magicType: { show: true, type: ['line', 'bar'] }
              }
            },
            xAxis: [
              {
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
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
                name: '各月供水量(万m³)',
                nameTextStyle: {
                  color: '#333',
                  padding: [0, 0, 0, 180]
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
            color: ['#2fc67d', '#0089ff'],
            series: [
              {
                type: 'line',
                name: '供水量',
                data: this.rightData1,
                smooth: true,
                barMaxWidth: 20,
              },{
                type: 'line',
                name: '售水量',
                data: this.rightData2,
                smooth: true,
                barMaxWidth: 20,
              },
            ]
          }
        }
      ]
      charts.forEach(item => {
        const chartReady = this.Echarts.init(this.$refs[item.ref])
        chartReady.setOption(item.options)
      })
    },

    /**
     * @description 绘制叠状图
     */
    drawChartLeft() {
      // console.log("drawChartPie："+JSON.stringify(this.pieData))

      const options = {
        tooltip: {
         trigger: 'axis',
          axisPointer: {           
              type: 'shadow'        
          },
           formatter: '{b0}<br />{a0}: {c0} m³<br />{a1}: {c1} m³'
          },
          legend: {
                data: ['供水量', '售水量'],
                top: 20,
                icon: 'rect'
              },

          color: ['#2cc57c', '#efbc45'],
          yAxis: {
              type: 'value'
          },
          xAxis: {
              type: 'category',
              data: ['预计', '累计']
          },
          series: [
              {
                  name: '供水量',
                  type: 'bar',
                  stack: 'total',
                  label: {
                      show: true
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: this.leftData1
              },
              {
                  name: '售水量',
                  type: 'bar',
                  stack: 'total',
                  label: {
                      show: true
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: this.leftData2
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
    drawChartRight(){
      // console.log("drawChartRight："+JSON.stringify(this.seriesData1) +"  "+JSON.stringify(this.seriesData2))

      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {           
              type: 'shadow'        
          },
          formatter: '{b0}<br />{a0}: {c0} m³<br />{a1}: {c1} m³'
        },
        legend: {
          // data: ['供水量', '售水量'],
          top: 20,
          icon: 'rect'
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
            name: '各月供水量(m³)',
            nameTextStyle: {
              color: "#333",
              padding: [0, 0, 0, 80]
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
            name:'供水量',
            type: 'line',
            data:  this.rightData1,
            smooth: true,
            barMaxWidth: 20,
          },
          {
            name:'售水量',
            type: 'line',
            data:  this.rightData2,
            smooth: true,
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
     * @description 供水量/售水量 叠状图
     */
    getFeedSaleList(){
      var that = this
      getFeedSale({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            // //供水量
            // that.leftData1.push(
            //   _resultList.expectWaterSalesValue.toFixed(1)   //预算售水
            // )
            // that.leftData1.push(
            //   _resultList.expectWaterSupplyValue.toFixed(1)  //预算供水
            // )
            // //售水量
            // that.leftData2.push(
            //   _resultList.cumulativeWaterSalesValue.toFixed(1)  //累计售水
            // )
            // that.leftData2.push(
            //   _resultList.cumulativeWaterSupplyValue.toFixed(1)  //累计供水
            // )

            //供水量 
            that.leftData1.push(
              _resultList.expectWaterSupplyValue.toFixed(1)   //预算供水
            )
            that.leftData1.push(
              _resultList.cumulativeWaterSupplyValue.toFixed(1)   //累计供水
            )
            //售水量
            that.leftData2.push(
              _resultList.expectWaterSalesValue.toFixed(1)    //预算售水
            )
            that.leftData2.push(
              _resultList.cumulativeWaterSalesValue.toFixed(1)    //累计售水
            )

            that.drawChartLeft();
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 供水量/售水量 柱状图
     */
    getFeedSaleMonthList(){
      var that = this
      getFeedSaleMonth({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
              that.rightData1.push(item.cumulativeWaterSupplyValue.toFixed(1))
              that.rightData2.push(item.cumulativeWaterSalesValue.toFixed(1))
            })

            that.drawChartRight()

         }else{
           that.$message.error(res.message)
         }
      })
    },
  },
  mounted() {
    // this.drwaChart()
  }
}
</script>

<style lang="scss" scoped>
.sup-sell-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-chart,
    .right-chart {
      width: 30%;
      height: 100%;
    }
    .right-chart {
      width: 70%;
    }
  }
}
</style>