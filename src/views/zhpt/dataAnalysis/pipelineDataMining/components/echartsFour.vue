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
      defectArr: [],
      titleArr: []
    }
  },
  watch: {
    paramData: {
      handler(nv, ov) {
        this.setDefectData()
      },
      deep: true
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.setDefectData()
  },
  methods: {
    // 处理缺陷数据
    setDefectData() {
      this.titleArr = []
      this.defectArr = []
      this.echartsData = this.paramData
      let echartsDataArr = this.echartsData.map(v => {
        return {
          type: v.defectCode,
          name: v.defectName
        }
      })
      let defectArr = new Map()
      echartsDataArr.forEach(defect => {
        let { type, name } = defect
        let codename = `${name} (${type})`
        if (defectArr.has(codename)) {
          defectArr.set(codename, defectArr.get(codename) + 1)
        } else {
          defectArr.set(codename, 1)
        }
      })

      defectArr.forEach((value, codename) => {
        this.titleArr.push(codename)
        this.defectArr.push({ value })
      })
      this.initData()
    },
    //初始化数据(饼状图)
    initData() {
      let chartDom = document.getElementById('echartsFour')
      let myChart = echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        label: { show: true },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.titleArr,
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
            data: this.defectArr
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
