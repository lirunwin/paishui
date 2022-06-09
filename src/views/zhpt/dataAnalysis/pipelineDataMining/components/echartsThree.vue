<template>
  <!-- 缺陷等级统计图 -->
  <div class="main">
    <div class="itmetitle">
      <div class="iconSymbol"></div>
      <div class="titleName">缺陷等级统计图</div>
    </div>
    <div id="echartsThree" class="content"></div>
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
      allArr: [
        {
          name: '1级',
          Lname: '一级',
          value: 0
        },
        {
          name: '2级',
          Lname: '二级',
          value: 0
        },
        {
          name: '3级',
          Lname: '三级',
          value: 0
        },
        {
          name: '4级',
          Lname: '四级',
          value: 0
        }
      ]
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
      if (this.echartsData.length != 0) {
        this.allArr.forEach(item => { item.value = 0 }) // 清空
        this.echartsData.forEach(ev => {
          let findItem = this.allArr.find(av => av.Lname === ev.defectLevel)
          if (findItem) { findItem.value += 1 }
        })
      }
      this.initData()
      // console.log('this.allArr', this.allArr)
    },
    //初始化数据(饼状图)
    initData() {
      let chartDom = document.getElementById('echartsThree')
      let myChart = echarts.init(chartDom)
      let option
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          bottom: 'bottom'
        },
        series: [
          {
            name: ' 缺陷数量 ',
            type: 'pie',
            radius: ['20%', '65%'],
            labelLine: {
              show: true
            },
            label: {
              formatter: '{d}% '
            },
            data: this.allArr,
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
      // console.log('重新加载Echatrs')
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
