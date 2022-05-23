<template>
  <!-- 缺陷数量统计图 -->
  <div class="main">
    <div class="itmetitle">
      <div class="iconSymbol"></div>
      <div class="titleName">缺陷数量统计图</div>
    </div>
    <div id="echartsFour" class="content"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: ['paramData'],
  components: {},
  data() {
    return {
      echartsData: [],
      defectArr: []
    }
  },
  watch: {
    echartsData(nv, ov) {
      this.echartsData = nv
      // console.log('新的echartsData', this.echartsData)
      this.initData()
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    // 处理缺陷数据
    setDefectData() {
      let arr = []
      this.echartsData.forEach((ev) => {
        if (arr.length == 0) {
          arr.push({
            name: ev.defectName,
            value: ev.defectNum
          })
        } else {
          arr.forEach((av) => {
            if (av.name == ev.defectName) {
              av.value += ev.defectNum
            } else {
              arr.push({
                name: ev.defectName,
                value: ev.defectNum
              })
            }
          })
        }
      })
      this.defectArr = arr
      this.titleArr = arr.map((v) => {
        return v.name
      })
    },
    //初始化数据(饼状图)
    initData() {
      // console.log('缺陷数量统计图 110',this.paramData)
      this.echartsData = this.paramData
      let chartDom = document.getElementById('echartsFour')
      let myChart = echarts.init(chartDom)
      let option

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            name: '单位 : 个',
            type: 'value',
            axisLine: {
              left: 100,
              show: true
            },

            nameTextStyle: {
              padding: [0, 0, 0, 50]
            }
          }
        ],
        series: [
          {
            name: '缺陷类型',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }

      option && myChart.setOption(option)
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
