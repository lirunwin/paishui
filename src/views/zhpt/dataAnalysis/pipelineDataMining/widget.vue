<template>
  <!-- // 管道检测数据挖掘  -->
  <div id="dataMining">
    <div id="main"></div>
    <!-- <div class="pipelineLegend">
      <div>水流</div>
      <div>管径</div>
      <div>管道长度</div>
      <div>检测长度</div>
    </div> -->
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import * as echarts from 'echarts'

@Component({
  name: 'dataMining',
  components: {}
})
export default class template extends Vue {
  renderEcharts() {
    console.log('渲染echarts')
    let chartDom = document.getElementById('main')
    let myChart = echarts.init(chartDom)
    let option
    option = {
      xAxis: {
        type: 'category',
        data: [{ value: '起点ADDLWS0001' }, '', { value: '终点ADDLWS0001-1' }],
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '埋深：m',
        axisLine: {
          show: true //隐藏y轴
        },
        axisLabel: {
          show: false //隐藏刻度值
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        scale: false
      },
      series: [
        {
          data: [10, 11.5, 13],
          type: 'line',
          color: '#CFCCCC',
          markLine: {
            symbol: ['none', 'none'],
            label: {
              show: true,
              formatter: function (a) {
                console.log('标题参数', a)
                return ` 埋深 ${a['name']}m `
              }
            },
            data: [
              { xAxis: 0, name: 2.15 },
              { xAxis: 2, name: 2.15 }
            ]
          }
        },

        {
          data: [
            { value: 10, name: '沉积', type: 'CJ' },
            { value: 11.5, name: '变形', type: 'BX' }
          ],
          type: 'line',
          symbol: 'triangle',
          symbolSize: 10,
          symbolOffset: [0, -20],
          itemStyle: {
            normal: {
              label: {
                // formatter: '（CJ）{b}[0]，{c}m   ',
                formatter: function (a) {
                  console.log('标题参数', a)
                  return `（${a['data']['type']}）${a['name']} ，${a['value']}m  `
                },
                backgroundColor: '#fff',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 2,
                lineHeight: 20,
                padding: 10,
                show: true,
                textStyle: {
                  color: '#000'
                }
              },
              textColor: 'red',
              borderWidth: 6,
              borderColor: '#E91111',
              color: '#2D74E7'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }
        }
      ]
    }

    option && myChart.setOption(option)
  }

  mounted() {
    this.renderEcharts()
  }
  created() {}
}
</script>

<style lang="scss" scoped>
#dataMining {
  // position: relative;
  display: flex;
  #main {
    // height: 100%;
    // width: 100%;
    flex: 2;
  }
  .pipelineLegend {
    flex: 1;
    // position: absolute;
        // top: 15%;
    // right: 4%;
    // display: flex;
  }
}
</style>
