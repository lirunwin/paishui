<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getOneFactoryTakingWaterSupply } from '@/api/dashboard'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      seriesData1:[],
      seriesData2:[],
    }
  },
  created(){
    this.getOneFactoryTakingWaterSupplyList()
  },
  methods: {
    drwaChart() {
      const chartReady = this.Echarts.init(this.$refs.chart)
      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {           
              type: 'shadow'        
          },
          formatter: '{b0}<br />{a0}: {c0} m³<br />{a1}: {c1} m³'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            boundaryGap: false,
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
            name: "取水量、供水量(m³)",
            nameTextStyle: {
              color: "#333",
              padding: [0, 0, 0, 80]    // 四个数字分别为上右下左与原位置距离
            },
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisLabel: {
              color: '#333'
            },
          }
        ],
        color: ['#46b3ff', '#52cf93'],
        legend: {
          data: ['供水', '取水']
        },
        series: [
          {
            name: '供水',
            type: 'line',
            data: this.seriesData1,
            smooth: true
          },
          {
            name: '取水',
            type: 'line',
            data: this.seriesData2,
            smooth: true
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
    },

    /**
     * @description 一厂（取供水曲线图）
     */
    getOneFactoryTakingWaterSupplyList(){
      var that = this
      let date = new Date();
      let yearStr = date.getFullYear(); //获取完整的年份(4位)
      let monthAry = [yearStr+'-01',yearStr+'-02',yearStr+'-03',yearStr+'-04',yearStr+'-05',yearStr+'-06',yearStr+'-07',yearStr+'-08',yearStr+'-09',yearStr+'-10',yearStr+'11',yearStr+'12']
      getOneFactoryTakingWaterSupply({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            monthAry.forEach(function(item, index) {
              let resultData = _resultList.filter(function (obj) {
                  return obj.dateTime === item 
              })
              if(resultData.length>0){
                that.seriesData1.push(resultData[0].waterSupplyValue.toFixed(1));
                that.seriesData2.push(resultData[0].waterIntakingValue.toFixed(1));
              }else{
                that.seriesData1.push("");
                that.seriesData2.push("");
              }

            }) 
            that.drwaChart();
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
.sup-use-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .chart-container {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}
</style>