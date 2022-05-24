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
      defectArr: [
        {
          type: 'AJ',
          name: '支管暗接',
          value: 0
        },
        {
          type: 'BX',
          name: '变形',
          value: 0
        },
        {
          type: 'CK',
          name: '错口',
          value: 0
        },
        {
          type: 'CR',
          name: '异物穿入',
          value: 0
        },
        {
          type: 'FS',
          name: '腐蚀',
          value: 0
        },
        {
          type: 'PL',
          name: '破裂',
          value: 0
        },
        {
          type: 'QF',
          name: '起伏',
          value: 0
        },
        {
          type: 'SL',
          name: '渗透',
          value: 0
        },
        {
          type: 'TJ',
          name: '脱节',
          value: 0
        },
        {
          type: 'TL',
          name: '接口材料脱落',
          value: 0
        },
        {
          type: 'CJ',
          name: '沉积',
          value: 0
        },
        {
          type: 'CQ',
          name: '残墙、坝根',
          value: 0
        },
        {
          type: 'FZ',
          name: '浮渣',
          value: 0
        },
        {
          type: 'JG',
          name: '结垢',
          value: 0
        },
        {
          type: 'SG',
          name: '树根',
          value: 0
        },
        {
          type: 'ZW',
          name: '障碍物',
          value: 0
        }
      ]
    }
  },
  watch: {
    echartsData(nv, ov) {
      this.echartsData = nv
      console.log('缺陷数量统计图新的echartsData', this.echartsData)
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
      console.log('this.echartsData',this.echartsData);
      this.echartsData.forEach((ev) => {
          // console.log("ev",ev);
        this.defectArr.forEach((dv) => {
          // console.log("dv",dv);
          if (dv.type == ev.defectCode) {
            dv.value += ev.defectNum
          }
        })
      })
      this.titleArr = this.defectArr.map((v) => {
        return v.name
      })
    },
    //初始化数据(饼状图)
    async initData() {
      // console.log('缺陷数量统计图 110',this.paramData)
      this.echartsData = this.paramData
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
