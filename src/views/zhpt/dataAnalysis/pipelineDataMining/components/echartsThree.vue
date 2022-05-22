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
          Lname:'一级',
          value: 0
        },
        {
          name: '2级',
          Lname:'二级',
          value: 0
        },
        {
          name: '3级',
          Lname:'三级',
          value: 0
        },
        {
          name: '4级',
          Lname:'四级',
          value: 0
        }
      ]
    }
  },
  watch: {
    echartsData(n) {
      this.echartsData = n
      console.log('缺陷等级统计图新的echartsData', this.echartsData)
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
      if (this.echartsData.length != 0) {
        this.echartsData.forEach((ev) => {
          this.allArr.forEach((av) => {
            console.log('ev', ev.defectLevel)
            console.log('av', av.Lname)
            if (ev.defectLevel == av.Lname) {
              av.value = ev.defectNum
            }
          })
          // if (v.defectLevel == '一级') {
          //   this.allArr[0].value += v.defectNum
          // } else if (v.defectLevel == '二级') {
          //   this.allArr[1].value += v.defectNum
          // } else if (v.defectLevel == '三级') {
          //   this.allArr[2].value += v.defectNum
          // } else if (v.defectLevel == '四级') {
          //   this.allArr[3].value += v.defectNum
          // }
        })
      }
      console.log('this.allArr', this.allArr)
    },
    //初始化数据(饼状图)
    initData() {
      this.echartsData = this.paramData
      this.setDefectData()
      console.log('缺陷等级统计图', this.paramData)
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
