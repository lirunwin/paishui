<template>
  <!-- 缺陷类型统计图 -->
  <div class="main">
    <div class="itmetitle">
      <div class="iconSymbol"></div>
      <div class="titleName">缺陷类型统计图</div>
    </div>
    <div id="echartsTwo" class="content"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: ['paramData'],
  components: {},
  data() {
    return {}
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    //初始化数据(饼状图)
    initData() {
      console.log('渲染管道检测情况统计图')
      let chartDom = document.getElementById('echartsTwo')
      let myChart = echarts.init(chartDom)
      let option

      const seriesLabel = {
        show: true
      }
      option = {
    //     grid: {
    //   left: '-54px',
    //   containLabel: true
    // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: 'bottom',
          data: ['1级', '2级', '3级']
        },
        grid: {
          left: 40
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: ['功能性缺陷', '结构性缺陷'],
          axisLabel: {
            formatter: function (value) {
              return value.split('').join('\n')
            },
            margin: 20,
            rich: {
              value: {
                lineHeight: 30,
                align: 'center'
              }
            }
          }
        },
        series: [
          {
            name: '1级',
            type: 'bar',
            data: [165, 170, 30],
            label: seriesLabel,
            markPoint: {
              symbolSize: 1,
              symbolOffset: [0, '50%'],
              label: {
                formatter: '{c}',
                lineHeight: 26,
                position: 'right',
                distance: 20,
                rich: {
                  c: {
                    color: '#ff8811',
                    textBorderColor: '#000',
                    textBorderWidth: 1,
                    fontSize: 22
                  }
                }
              },
              data: [
                { type: 'max', name: 'max days: ' },
                { type: 'min', name: 'min days: ' }
              ]
            }
          },
          {
            name: '2级',
            type: 'bar',
            label: seriesLabel,
            data: [150, 105, 110]
          },
          {
            name: '3级',
            type: 'bar',
            label: seriesLabel,
            data: [220, 82, 63]
          }
        ]
      }

      option && myChart.setOption(option)
      console.log('option', option)
    }
  }
}
</script>


<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
  }
  .itmetitle {
    height: 20px;
    width: 100%;
    font-size: 16px;
    margin: 0 !important;
    .iconSymbol {
      height: 100%;
      width: 5px;
      background-color: royalblue;
      float: left;
    }
    .titleName {
      margin-left: 20px;
      line-height: 24px;
    }
  }
}
</style>
