<template>
  <!-- 处理方式统计图 -->
  <div class="main">
    <div class="itmetitle">
      <div class="iconSymbol"></div>
      <div class="titleName">处理方式统计图</div>
    </div>
    <div id="echartsFive" class="content"></div>
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
      echatrsArr: []
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
      this.echartsData = this.paramData
      this.echatrsArr = []
      let dataArr = new Map(), arr = []
      this.echartsData.map(v => v.checkSuggest).forEach(item => {
        if (dataArr.has(item)) {
          dataArr.set(item, dataArr.get(item) + 1)
        } else {
          dataArr.set(item, 1)
        }
      })
      dataArr.forEach((value, name) => {
        arr.push({ value, name })
      })
      this.echatrsArr = arr
      this.initData()
    },

    //初始化数据(饼状图)
    initData() {
      
      // console.log('渲染管道检测情况统计图')
      let chartDom = document.getElementById('echartsFive')
      let myChart = echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // orient: 'vertical',
          bottom: 'bottom'
        },
        series: [
          {
            name: '处理方式',
            type: 'pie',
            radius: '50%',
            data: this.echatrsArr,
            label: {
              formatter: ' {b}\n {d}% ',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
      // console.log('option', option)
    }
  }
}
</script>


<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  // overflow: hidden;
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
