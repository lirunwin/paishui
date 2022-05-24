<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    /**
     * 显示结果数据
     */
    showProfilechar() {
      this.maxVal = 0
      var html = "<div class='profile' style='height:300px;width:500px;'><div>"
      this.floatPopup = new XJfloatpanel({
        innerWidgetHtml: html,
        panelUniqClassName: this.currentOperate,
        panelTitle: '纵剖面分析结果',
        panelHeight: '400',
        panelWidth: '500',
        panelReadyFun: function (e) {
          $('.widget-floatpanel' + this.currentOperate).css({ left: '0px', top: '0px', position: 'absolute' })
          var datainfos = this.currentProfileInfos
          var evl = 0,
            data = [],
            xlen = 0,
            defectData = [],
            lineData = [],
            areaMarkData = [],
            depthData = [],
            xlineData = [],
            xlabelData = [],
            ylineData = [],
            ylabelData = []
          for (var i = 0; i < datainfos.length; i++) {
            var item = datainfos[i]
            var pipeinfo = item.pipes
            if (this.maxVal < pipeinfo.start_depth) this.maxVal = pipeinfo.start_depth
            if (this.maxVal < pipeinfo.end_depth) this.maxVal = pipeinfo.end_depth
          }
          this.maxVal = Math.ceil(this.maxVal)
          var issx = false //是否顺管道方向绘制
          if (
            datainfos.length > 1 &&
            (datainfos[0].pipes.je_code == datainfos[1].pipes.js_code ||
              datainfos[0].pipes.je_code == datainfos[1].pipes.je_code)
          ) {
            issx = true
          } else {
            this.currentProfileInfos = []
            for (var i = datainfos.length - 1; i >= 0; i--) {
              var item = datainfos[i]
              this.currentProfileInfos.push(item)
            }
            datainfos = this.currentProfileInfos
          }

          for (var i = 0; i < datainfos.length; i++) {
            var item = datainfos[i]
            var pipeinfo = item.pipes
            var checkpipes = item.checkpipes
            var defects = item.definfos
            var fx = false
            if (i > 0) {
              var npipeinfo = datainfos[i - 1].pipes
              if (npipeinfo.je_code == pipeinfo.je_code) {
                fx = true
              }
            }

            if (fx) {
              data.push([xlen, this.maxVal - pipeinfo.end_depth])
              data.push([xlen + pipeinfo.pipe_length, this.maxVal - pipeinfo.start_depth])
            } else {
              data.push([xlen, this.maxVal - pipeinfo.start_depth])
              data.push([xlen + pipeinfo.pipe_length, this.maxVal - pipeinfo.end_depth])
            }

            if (i != datainfos.length - 1) {
              data.push(['-', '-'])
            }
            if (checkpipes != null) {
              var diccheckpipes = {}
              for (var nn = 0; nn < checkpipes.length; nn++) {
                var mkey = checkpipes[nn].start_sid + '-' + checkpipes[nn].end_sid
                diccheckpipes[mkey] = checkpipes[nn].direction
              }
              var idxm = 0
              for (var j = 0; j < defects.length; j++) {
                var def = defects[j]
                var dir = def.direction
                var cfx = diccheckpipes[def.start_sid + '-' + def.end_sid]
                var range = def.range,
                  symbolurl = ''
                switch (range) {
                  case '1':
                    symbolurl = 'image://./widgets/XJDrainagePipeData/css/img/pointOne.png'
                    break
                  case '2':
                    symbolurl = 'image://./widgets/XJDrainagePipeData/css/img/pointTwo.png'
                    break
                  case '3':
                    symbolurl = 'image://./widgets/XJDrainagePipeData/css/img/pointThree.png'
                    break
                  case '4':
                    symbolurl = 'image://./widgets/XJDrainagePipeData/css/img/pointFour.png'
                    break
                  default:
                    symbolurl = 'image://./widgets/XJDrainagePipeData/css/img/pointUnPj.png'
                    break
                }
                if (dir != -9999) {
                  var ldepth = 0
                  if (cfx == '顺流') {
                    dir = def.direction
                  } else {
                    dir = pipeinfo.pipe_length - def.direction
                  }
                  ldepth =
                    pipeinfo.end_depth +
                    ((pipeinfo.start_depth - pipeinfo.end_depth) / pipeinfo.pipe_length) * (pipeinfo.pipe_length - dir)
                  if (fx) {
                    defectData.push({
                      value: [xlen + pipeinfo.pipe_length - dir, this.maxVal - ldepth],
                      symbol: symbolurl
                    })
                  } else defectData.push({ value: [xlen + dir, this.maxVal - ldepth], symbol: symbolurl })
                  this.dicDefIndexs[(xlen + dir).toFixed(4) + (this.maxVal - ldepth).toFixed(4)] = def
                  idxm++
                }
              }
            }
            var diameter = pipeinfo.diameter != '' ? parseFloat(pipeinfo.diameter).toFixed(0) : ''
            lineData.push([{ coord: [xlen, -0.1] }, { coord: [xlen, -0.8] }])
            lineData.push([{ coord: [xlen, -1.2] }, { coord: [xlen, -3] }])
            lineData.push([
              { coord: [xlen + pipeinfo.pipe_length, -0.1] },
              { coord: [xlen + pipeinfo.pipe_length, -0.8] }
            ])
            lineData.push([
              { coord: [xlen + pipeinfo.pipe_length, -1.2] },
              { coord: [xlen + pipeinfo.pipe_length, -3] }
            ])
            var upidx = i - 1

            if (upidx != -1) {
              if (fx) {
                if (datainfos[upidx].pipes.end_depth < pipeinfo.end_depth) {
                  depthData.push({ name: pipeinfo.end_depth, value: [xlen, -0.42] })
                } else if (datainfos[upidx].pipes.end_depth > pipeinfo.end_depth) {
                  depthData.push({ name: pipeinfo.end_depth, value: [xlen, -1.42] })
                }

                depthData.push({ name: pipeinfo.start_depth, value: [xlen + pipeinfo.pipe_length, -0.92] })
              } else {
                if (datainfos[upidx].pipes.end_depth < pipeinfo.start_depth) {
                  depthData.push({ name: pipeinfo.start_depth, value: [xlen, -0.42] })
                } else if (datainfos[upidx].pipes.end_depth > pipeinfo.start_depth) {
                  depthData.push({ name: pipeinfo.start_depth, value: [xlen, -1.42] })
                }

                depthData.push({ name: pipeinfo.end_depth, value: [xlen + pipeinfo.pipe_length, -0.92] })
              }
            } else {
              depthData.push({ name: pipeinfo.start_depth, value: [xlen, -0.92] })
              depthData.push({ name: pipeinfo.end_depth, value: [xlen + pipeinfo.pipe_length, -0.92] })
            }

            depthData.push({ name: diameter != '' ? diameter : '', value: [xlen + pipeinfo.pipe_length / 2.0, -2.8] }) //管径
            depthData.push({ name: pipeinfo.pipe_length.toFixed(2), value: [xlen + pipeinfo.pipe_length / 2.0, -1.8] }) //管距
            xlen += pipeinfo.pipe_length
          }
          this.maxLen = xlen
          xlineData.push([{ coord: [-0.4, 0] }, { coord: [xlen + 5, 0] }])
          var splitx = Math.ceil(this.maxLen / 5)
          for (var n = 0; n < this.maxLen + 5; n = n + splitx) {
            xlineData.push([{ coord: [n, 0] }, { coord: [n, -0.12] }])
          }
          xlabelData.push({ name: '间距(m)', value: [xlen + 10, -0.2] })
          // for (var m = 0; m < this.maxLen + 5; m = m + splitx) {
          //     xlabelData.push({ name: m + "", value: [m, -0.4] });
          // }

          ylineData.push([{ coord: [0, 0] }, { coord: [0, this.maxVal + 1 - 0.1] }])
          for (var n = 0; n < this.maxVal + 1; n = n + 0.5) {
            ylineData.push([{ coord: [-0.4, n] }, { coord: [0, n] }])
          }
          ylabelData.push({ name: '埋深(m)', value: [-1.5, this.maxVal + 1.5] })
          for (var m = 0; m < this.maxVal + 1; m = m + 1) {
            var val = this.maxVal - m
            if (val >= 0) ylabelData.push({ name: '' + val, value: [-1.5, m] })
          }

          var option = {
            tooltip: {
              trigger: 'axis',
              position: function (point, params, dom, rect, size) {
                var x = 0 // x坐标位置
                var y = 0 // y坐标位置

                // 当前鼠标位置
                var pointX = point[0]
                var pointY = point[1]

                // 外层div大小
                // var viewWidth = size.viewSize[0];
                // var viewHeight = size.viewSize[1];

                // 提示框大小
                var boxWidth = size.contentSize[0]
                var boxHeight = size.contentSize[1]

                // boxWidth > pointX 说明鼠标左边放不下提示框
                if (boxWidth > pointX) {
                  x = 5
                } else {
                  // 左边放的下
                  x = pointX - boxWidth
                }

                // boxHeight > pointY 说明鼠标上边放不下提示框
                if (boxHeight > pointY) {
                  y = 5
                } else {
                  // 上边放得下
                  y = pointY - boxHeight
                }

                return [x, y]
              },
              formatter: function (params, ticket, callback) {
                var showHtm = ''
                for (var i = 0; i < params.length; i++) {
                  var item = params[i]
                  var idx = item.dataIndex
                  if (item.seriesName == 'defect') {
                    var info = this.dicDefIndexs[item.value[0].toFixed(4) + item.value[1].toFixed(4)]
                    if (info != undefined) {
                      showHtm += '起始井号：' + info.start_sid + '<br>'
                      showHtm += '终止井号：' + info.end_sid + '<br>'
                      showHtm += '纵向(m)：' + info.direction + '<br>'
                      showHtm += '环向：' + info.circular + '<br>'
                      showHtm += '缺陷类型：' + info.defect_type + '<br>'
                      showHtm += '缺陷名称：' + info.defect_name + '<br>'
                      showHtm += '分值：' + info.figures + '<br>'
                      showHtm += '等级：' + info.range + '<br>'
                      showHtm += '整改建议：' + info.suggest + '<br>'
                      showHtm += '整改方式：' + info.method + '<br>'
                    }
                  }
                }
                return showHtm
              }.bind(this)
            },
            xAxis: {
              name: '',
              type: 'value',
              show: false,
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: 'blue'
                },
                show: false
              },
              min: -2,
              splitNumber: 10,
              axisLabel: { show: false },
              axisTick: { show: false }
            },
            yAxis: {
              name: '埋深（m）',
              type: 'value',
              show: false,
              min: -3,
              max: this.maxVal + 2,
              boundaryGap: true,
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                },
                show: false
              },
              axisTick: { show: false },
              minInterval: 0.1,
              axisLabel: {
                formatter: function (value) {
                  var texts = []
                  if (value < 0) {
                    texts.push('')
                  } else texts.push(this.maxVal - value)
                  return texts
                }.bind(this),
                show: true
              }
            },
            series: [
              {
                name: 'pipe',
                type: 'line',
                silent: true,
                animation: false,
                showSymbol: true,
                symbolSize: 4,
                smooth: false,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: 'blue',
                  color: 'blue'
                },
                lineStyle: {
                  color: 'blue',
                  width: 2,
                  type: 'solid'
                },
                markArea: {
                  silent: true,
                  data: [
                    [
                      {
                        xAxis: 0,
                        yAxis: 0,
                        itemStyle: {
                          color: '#3338'
                        }
                      },
                      {
                        xAxis: this.maxLen + 2,
                        yAxis: this.maxVal + 1
                      }
                    ]
                  ]
                },
                data: data
              },
              {
                name: 'defect',
                type: 'scatter',
                showSymbol: true,
                smooth: false,
                symbol: 'triangle',
                symbolSize: 20,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: 'blue',
                  color: 'blue'
                },
                data: defectData
              },
              {
                name: 'mark',
                type: 'scatter',
                symbol: 'emptyCircle',
                symbolSize: 1,
                silent: true,
                animation: false,
                label: {
                  show: true,
                  position: 'left',
                  color: '#333',
                  formatter: '{b}',
                  fontWeight: 'bold',
                  fontSize: 10
                },
                markLine: {
                  silent: true,
                  symbol: ['none', 'none'],
                  label: {
                    show: false
                  },
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 1,
                      color: '#4c82b1'
                    }
                  },
                  data: lineData
                },
                markArea: {
                  silent: true,
                  label: {
                    color: '#333'
                  },
                  itemStyle: {
                    color: 'transparent',
                    borderColor: '#ff0000',
                    borderWidth: 0
                  },
                  data: areaMarkData
                },
                data: [
                  { name: '埋深(m) ', value: [0, -0.8] },
                  { name: '间距(m) ', value: [0, -1.8] },
                  { name: '管径(mm)', value: [0, -2.8] }
                ]
              },
              {
                name: 'markdepeth',
                type: 'scatter',
                symbol: 'emptyCircle',
                symbolSize: 1,
                itemStyle: {
                  borderWidth: 0,
                  borderColor: 'blue',
                  color: 'rgba(0,0,0,0)'
                },
                silent: false,
                animation: false,
                label: {
                  show: true,
                  position: '',
                  color: '#333',
                  formatter: '{b}',
                  fontWeight: '',
                  fontSize: 10
                },
                data: depthData
              },
              {
                name: 'x',
                type: 'scatter',
                symbol: 'emptyCircle',
                symbolSize: 1,
                silent: false,
                animation: false,
                label: {
                  show: true,
                  position: '',
                  color: '#4c82b1',
                  formatter: '{b}',
                  fontWeight: 'bold',
                  fontSize: 12
                },
                markLine: {
                  silent: true,
                  symbol: ['none', 'none'],
                  label: {
                    show: false
                  },
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: '#4c82b1'
                    }
                  },
                  data: xlineData
                },
                data: xlabelData
              },
              {
                name: 'y',
                type: 'scatter',
                symbol: 'emptyCircle',
                symbolSize: 1,
                silent: false,
                animation: false,
                label: {
                  show: true,
                  position: '',
                  color: '#4c82b1',
                  formatter: '{b}',
                  fontWeight: 'bold',
                  fontSize: 12
                },
                markLine: {
                  silent: false,
                  symbol: ['none', 'none'],
                  label: {
                    show: false
                  },
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: '#4c82b1'
                    }
                  },
                  data: ylineData
                },
                data: ylabelData
              }
            ]
          }
          var myChart = echarts.init($('.' + this.currentOperate).find('.profile')[0])
          myChart.setOption(option)
        }.bind(this),
        panelDestroyFun: function () {
          this.templinelayer.clear()
          this.floatPopup = null
        }.bind(this)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>