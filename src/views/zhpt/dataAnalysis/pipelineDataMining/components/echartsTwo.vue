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
    return {
      echartsData: {},
      funArr: [
        {
          name: '1级',
          value: 0
        },
        {
          name: '2级',
          value: 0
        },
        {
          name: '3级',
          value: 0
        },
        {
          name: '4级',
          value: 0
        }
      ],
      staArr: [
        {
          name: '1级',
          value: 0
        },
        {
          name: '2级',
          value: 0
        },
        {
          name: '3级',
          value: 0
        },
        {
          name: '4级',
          value: 0
        }
      ]
    }
  },
  
  computed: {},
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    setData() {
      this.echartsData.funcArr.forEach((v) => {
        if (v.defectLevel == '一级') {
          this.funArr[0].value += v.defectNum
        } else if (v.defectLevel == '二级') {
          this.funArr[1].value += v.defectNum
        } else if (v.defectLevel == '三级') {
          this.funArr[2].value += v.defectNum
        } else if (v.defectLevel == '四级') {
          this.funArr[3].value += v.defectNum
        }
        console.log("funcArr里面的等级",v);
      })
      this.echartsData.structArr.forEach((v) => {
        if (v.defectLevel == '一级') {
          this.staArr[0].value += v.defectNum
        } else if (v.defectLevel == '二级') {
          this.staArr[1].value += v.defectNum
        } else if (v.defectLevel == '三级') {
          this.staArr[2].value += v.defectNum
        } else if (v.defectLevel == '四级') {
          this.staArr[3].value += v.defectNum
        }
      })
      // console.log('funArr', this.funArr)
      // console.log('staArr', this.staArr)
      console.log('缺陷类型统计图echartsData', this.paramData)
    },
    //初始化数据(饼状图)
    initData() {
      this.echartsData = this.paramData
      this.setData()
      console.log('缺陷类型统计图', this.echartsData)
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
          data: ['1级', '2级', '3级', '4级']
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
            data: [this.funArr[0].value, this.staArr[0].value],
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
              }
              // data: [
              //   { type: 'max', name: 'max days: ' },
              //   { type: 'min', name: 'min days: ' }
              // ]
            }
          },
          {
            name: '2级',
            type: 'bar',
            label: seriesLabel,
            data: [this.funArr[1].value, this.staArr[2].value]
          },
          {
            name: '3级',
            type: 'bar',
            label: seriesLabel,
            data: [this.funArr[2].value, this.staArr[2].value]
          },
          {
            name: '4级',
            type: 'bar',
            label: seriesLabel,
            data: [this.funArr[3].value, this.staArr[3].value]
          }
        ]
      }

      option && myChart.setOption(option)
      console.log('option', option)
    }
  },
  watch: {
    echartsData: {
      handler(nv, ov) {
        this.echartsData = nv 
        console.log('缺陷类型统计图新的echartsData', this.echartsData)
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
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
