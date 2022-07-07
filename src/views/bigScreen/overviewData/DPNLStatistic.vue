<template>
  <transition
    appear
    name="animate__animated animate__move"
    enter-active-class="animate__slideInRight"
    leave-active-class="animate__slideOutRight"
  >
    <div class="widget-DPNLStatistic" v-if="show">
      <div class="head">
        <div class="title">
          <div class="icon"></div>
          <span class="site-info">排水管网长度统计</span>
        </div>
      </div>
      <div class="content-info" ref="chart"></div>
    </div>
  </transition>
</template>

<script>
import echarts from 'echarts'
import { nullPng } from '@/assets/images/base64'
export default {
  name: 'DPNLStatistic', //排水管网长度统计
  props: {
    show: {}
  },
  watch: {
    show(n, o) {
      n
        ? this.getPageData()
        : () => {
            return
          }
    }
  },
  methods: {
    getPageData() {
      const { getRequestResult } = this.$listeners
      getRequestResult({ blockCode: 'pipeCount' }).then((res) => {
        this.$nextTick(() => {
          this.showPieChart(res)
        })
      })
    },
    //显示饼图
    showPieChart(pipeData) {
      let title = 0
      var img = nullPng
      var data = []
      var color = ['#27EEAF', '#43C8FF', '#FFB54C']
      for (var i = 0; i < pipeData.length; i++) {
        title += pipeData[i].length
        data.push(
          {
            value: pipeData[i].length,
            name: pipeData[i].pipeType,
            itemStyle: {
              normal: {
                borderWidth: 5,
                shadowBlur: 5,
                borderColor: color[i],
                shadowColor: color[i]
              }
            }
          },
          {
            value: 20,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          }
        )
      }
      var seriesOption = [
        {
          name: '',
          type: 'pie',
          clockWise: false,
          radius: [55, 65],
          hoverAnimation: true,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',

                fontSize: this.$listeners.fontSize(14),
                fontFamily: 'Source Han Sans CN',
                fontWeight: 'bold',
                formatter: function(params) {
                  var percent
                  var total = 0
                  for (var i = 0; i < pipeData.length; i++) {
                    total += pipeData[i].value
                  }
                  percent = ((params.value / total) * 100).toFixed(0)
                  if (params.name !== '') {
                    return params.value + 'km\n' + params.name
                  } else {
                    return ''
                  }
                }
              },
              labelLine: {
                length: 15,
                length2: 15,
                show: true,
                color: '#00ffff'
              }
            }
          },
          data: data
        }
      ]
      var option = {
        backgroundColor: 'transparent',
        color: color,
        title: {
          text: title + 'km',
          top: '45%',
          textAlign: 'center',
          left: '49%',
          textStyle: {
            color: 'rgba(26, 177, 255, 1)',
            fontSize: this.$listeners.fontSize(18),
            fontWeight: 'bold'
          }
        },
        graphic: {
          elements: [
            {
              type: 'image',
              z: 3,
              style: {
                image: img,
                width: 85,
                height: 85
              },
              left: 'center',
              top: 'center',
              position: [100, 100]
            }
          ]
        },
        tooltip: {
          show: false
        },
        series: seriesOption
      }
      let chart = echarts.init(this.$refs.chart)
      chart.resize()
      chart.setOption(option, {
        notMerge: true
      })
      //图表大小自适应
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.animate__slideInRight,
.animate__slideOutRight {
  animation-duration: 3s; //动画持续时间
  animation-delay: 0s; //动画延迟时间
}
.widget-DPNLStatistic {
  $size10: 0.052083rem /* 10/192 */;
  $size20: 0.104167rem /* 20/192 */;
  z-index: 2;
  //position
  top: 0.505208rem /* 97/192 */;
  margin-right: $size20 /* 20/192 */;
  right: 0rem /* 0/192 */;
  position: absolute;
  //size
  height: 1.354167rem /* 260/192 */;
  width: 2.083333rem /* 400/192 */;
  //background
  background-color: rgba(20, 24, 47, 0.5);
  color: #eee;
  box-shadow: 0 0 20px rgba(1, 9, 20, 1);
  //font
  font-family: Source Han Sans CN;
  .head {
    height: 0.166667rem /* 32/192 */;
    width: 100%;
    background: linear-gradient(-90deg, rgba(43, 167, 255, 0.2) 0%, rgba(43, 167, 255, 0.08) 100%);
    .title {
      width: 100%;
      height: 100%;
      display: flex;
      font-weight: 400;
      .icon {
        height: 0.166667rem /* 32/192 */;
        width: 0.34375rem /* 66/192 */;
        background: url('./images/排水管网.png') no-repeat center center;
        background-size: 100% 100%;
      }
      span {
        font-weight: bold;
        font-size: 0.083333rem /* 16/192 */;
        color: #ffffff;
        // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
        padding: 0.041667rem /* 8/192 */;
      }
    }
  }
  .content-info {
    width: 100%;
    height: calc(100% - 0.166667rem);
    display: flex;
    flex-flow: row wrap;
    padding: 2px;
  }
}
</style>
