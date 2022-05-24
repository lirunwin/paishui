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
    paramData: {
      handler(nv, ov) {
        this.echartsData = nv
        console.log('缺陷等级统计图新的echartsData', this.paramData)
        this.initData()
      },
      deep: true,
      immediate: true
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
      // console.log('this.echartsData', this.echartsData)

      let echartsDataArr = this.echartsData.map((v) => {
        return {
          type: v.defectCode,
          name: v.defectName,
          value: v.defectNum
        }
      })
      console.log('echartsDataArr1', echartsDataArr)

      echartsDataArr = echartsDataArr.reduce((obj, item) => {
        let find = obj.find((i) => i.type === item.type)
        let _d = {
          ...item,
          frequency: 1
        }
        find ? ((find.value += item.value), find.frequency++) : obj.push(_d)
        return obj
      }, [])

      console.log('echartsDataArr2', echartsDataArr)
      this.defectArr = echartsDataArr
      this.titleArr = echartsDataArr.map((v) => {
        return v.name
      })
    },
    //初始化数据(饼状图)
    async initData() {
      // console.log('缺陷数量统计图 110',this.paramData)
      // this.echartsData = this.paramData
      await this.setDefectData()
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
