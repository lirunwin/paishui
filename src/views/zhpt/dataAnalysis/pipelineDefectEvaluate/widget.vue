<template>
  <div class="engineering-manage">
    <!-- 管道缺陷评价统计 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">检测日期：</div>
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchValue.jcStartDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="sOpition"
                  @change="sDateChange"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center; margin: 0 5px">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="searchValue.jcEndDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="eOpition"
                  @change="eDateChange"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <div class="title">起始井号：</div>
          <el-input
            size="small"
            placeholder="请输入起始井号"
            v-model="searchValue.startPoint"
            clearable
            style="margin-right: 10px"
          >
          </el-input>
          <div class="title">终止井号：</div>
          <el-input
            size="small"
            placeholder="请输入终止井号"
            v-model="searchValue.endPoint"
            clearable
            style="margin-right: 10px"
          >
          </el-input>
          <div class="title">缺陷类型：</div>
          <el-select size="small" clearable v-model="searchValue.defectType" placeholder="选择缺陷类型">
            <el-option v-for="item in contentEchatrs" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>

          <div class="title">类型名称：</div>
          <el-select size="small" clearable v-model="searchValue.defectName" placeholder="选择类型名称">
            <el-option v-for="item in echartsData" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 查询 </el-button>
          <el-button class="serch-btn" type="primary" @click="getPdf('管道缺陷评价统计', 'defecteva')"> 导出 </el-button>
        </div>
        <div class="right-btn"></div>
      </div>
      <div id="defecteva" class="content">
        <div id="mainE" style="height: 500px"></div>
        <div style="border: 1px solid #ccc">
          <div class="detailsTitle">管道缺陷评价统计表</div>
          <summary-form :tabelData="returnTabel"></summary-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入发布的组件
import summaryForm from '@/views/zhpt/pipelineManage/components/summaryForm.vue'
import { getPipeDefectsTypeCountMap } from '@/api/pipelineManage'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  components: { summaryForm },
  data() {
    return {
      // 日期选择器规则
      sOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.jcEndDate) {
            return time > new Date(this.searchValue.jcEndDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.jcStartDate) {
            return time < new Date(this.searchValue.jcStartDate).getTime() - 8.64e7 || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      },

      searchValue: {
        jcStartDate: '',
        jcEndDate: '',
        startPoint: '',
        endPoint: '',
        defectType: '',
        defectName: ''
      },
      defectQuantityStatisticsA: [
        { title: '(AJ)支管暗接', type: 'AJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(BX)变形', type: 'BX', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CK)错口', type: 'CK', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CR)异物穿入', type: 'CR', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(FS)腐蚀', type: 'FS', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(PL)破裂', type: 'PL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(QF)起伏', type: 'QF', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(SL)渗透', type: 'SL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(TJ)脱节', type: 'TJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(TL)接口材料脱落', type: 'TL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 }
      ], // 管道缺陷数量统计表
      defectQuantityStatisticsB: [
        { title: '(CJ)沉积', type: 'CJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CQ)残墙、坝根', type: 'CQ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(FZ)浮渣', type: 'FZ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(JG)结垢', type: 'JG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(SG)树根', type: 'SG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(ZW)障碍物', type: 'ZW', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 }
      ],
      defectSumObj: { oneSum: 0, twoSum: 0, threeSum: 0, fourSum: 0, total: 0 }, // 合计
      form: {
        name: '',
        number: '',
        constructionUnit: '',
        designUnit: '',
        workUnit: '',
        testUnit: '',
        probeUnit: '',
        supervisorUnit: '',
        projectIntroduction: ''
      },
      pageData: [],
      contentEchatrs: [],
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
      ],
      echartsTitle: [],
      echartsData: [],
      typeArr: {
        s: ['AJ', 'BX', 'CK', 'CR', 'FS', 'PL', 'QF', 'SL', 'TJ', 'TL'],
        f: ['CJ', 'CQ', 'FZ', 'JG', 'SG', 'ZW']
      },
    }
  },
  async created() {
    await this.getData()
    await this.initData()
  },
  mounted() {
  },
  computed: {
    returnTabel() {
      return {
        defectQuantityStatisticsA: this.defectQuantityStatisticsA,
        defectQuantityStatisticsB: this.defectQuantityStatisticsB,
        defectSumObj: this.defectSumObj
      }
    }
  },
  watch: {
    pageData: function (newValue, old) {
      let data = newValue
      this.allArr = [
        { name: '1级', Lname: ['一级', '1'], value: 0 },
        { name: '2级', Lname: ['二级', '2'], value: 0 },
        { name: '3级', Lname: ['三级', '3'], value: 0 },
        { name: '4级', Lname: ['四级', '4'], value: 0 }
      ]

      // 内
      let content = [{ name: '结构性缺陷', value: 0 }, { name: '功能性缺陷', value: 0 }]
      data.forEach(defect => {
        let type = defect.defectType
        if (type) {
          let typeObj = content.find(item => item.name === type)
          typeObj.value += defect.defectNum
        } else {
          if (this.typeArr.s.includes(defect.defectCode)) { content[0].value += defect.defectNum }
          if (this.typeArr.f.includes(defect.defectCode)) { content[1].value += defect.defectNum }
        }
      })
      this.contentEchatrs = content

      // 中
      let echartsData = new Map()
      data.forEach(item => {
          if (!echartsData.has(item.defectLevel)) {
            echartsData.set(item.defectLevel, item.defectNum)
          } else {
            echartsData.set(item.defectLevel, echartsData.get(item.defectLevel) + item.defectNum)
          }
      })
      echartsData.forEach((value, key) => {
        let find = this.allArr.find(i => i.Lname.includes(key))
        if (find) { find.value = value }
      })
      // 外

      let echartsDataArr = newValue.map((v) => {
        return {
          value: v.defectNum,
          defectCode: v.defectCode,
          name: v.defectName
        }
      })

      echartsDataArr = echartsDataArr.reduce((obj, item) => {
        let find = obj.find((i) => i.defectCode === item.defectCode)
        let _d = {
          ...item,
          frequency: 1
        }
        find ? ((find.value += item.value), find.frequency++) : obj.push(_d)
        return obj
      }, [])

      this.echartsTitle = echartsDataArr.map((titleV) => {
        return titleV.name
      })
      this.echartsData = echartsDataArr
      this.initData()
    }
  },
  methods: {
    sDateChange (t) {
      if (!this.searchValue.jcEndDate) {
        this.$nextTick(() => {
          this.searchValue.jcEndDate = this.searchValue.jcStartDate
        })
      }
    },
    eDateChange (t) {
      if (!this.searchValue.jcStartDate) {
        this.$nextTick(() => {
          this.searchValue.jcStartDate = this.searchValue.jcEndDate
        })
      }
    },
    // 搜索
    searchApi() {
      this.getData(this.searchValue)
    },
    async getData(params) {
      this.defectSumObj = { oneSum: 0, twoSum: 0, threeSum: 0, fourSum: 0, total: 0 }
      // {jcjcStartDate:检测开始日期,jcEndDate:检测结束日期,startPoint：起始井号", "endPoint：终止井号,defectType:缺陷类型，defectName：缺陷名称}
      let data = {}
      if (params) {
        data.jcStartDate = params.jcStartDate
        data.jcEndDate = params.jcEndDate
        data.startPoint = params.startPoint
        data.endPoint = params.endPoint
        data.defectType = params.defectType
        data.defectName = params.defectName
      }
      data.wordInfoState = '1'
      let res = await getPipeDefectsTypeCountMap(data)
      
      this.defectQuantityStatisticsA.forEach(item => {
        item['oneValue'] = 0
        item['twoValue'] = 0
        item['threeValue'] = 0
        item['fourValue'] = 0
      })
      this.defectQuantityStatisticsB.forEach(item => {
        item['oneValue'] = 0
        item['twoValue'] = 0
        item['threeValue'] = 0
        item['fourValue'] = 0
      })
      for (let k in this.defectSumObj) {
        this.defectSumObj[k] = 0
      }
      
      this.pageData = res.result
      if (this.pageData) {
        this.pageData.forEach((resValue) => {

          this.defectQuantityStatisticsA.forEach((sumValue) => {
            if (resValue.defectCode == sumValue.type) {
              if (['一级', '1'].includes(resValue.defectLevel)) {
                sumValue.oneValue += resValue.defectNum
              } else if (['二级', '2'].includes(resValue.defectLevel)) {
                sumValue.twoValue += resValue.defectNum
              } else if (['三级', '3'].includes(resValue.defectLevel)) {
                sumValue.threeValue += resValue.defectNum
              } else if (['四级', '4'].includes(resValue.defectLevel)) {
                sumValue.fourValue += resValue.defectNum
              }
            }
          })

          this.defectQuantityStatisticsB.forEach((sumValue) => {
            if (resValue.defectCode == sumValue.type) {
              if (['一级', '1'].includes(resValue.defectLevel)) {
                sumValue.oneValue += resValue.defectNum
              } else if (['二级', '2'].includes(resValue.defectLevel)) {
                sumValue.twoValue += resValue.defectNum
              } else if (['三级', '3'].includes(resValue.defectLevel)) {
                sumValue.threeValue += resValue.defectNum
              } else if (['四级', '4'].includes(resValue.defectLevel)) {
                sumValue.fourValue += resValue.defectNum
              }
            }
          })
        })


        this.defectQuantityStatisticsA.forEach((v) => {
          v.value = v.oneValue + v.twoValue + v.threeValue + v.fourValue
          this.defectSumObj.oneSum += v.oneValue
          this.defectSumObj.twoSum += v.twoValue
          this.defectSumObj.threeSum += v.threeValue
          this.defectSumObj.fourSum += v.fourValue
          this.defectSumObj.total += v.value
        })
        this.defectQuantityStatisticsB.forEach((v) => {
          v.value = v.oneValue + v.twoValue + v.threeValue + v.fourValue
          this.defectSumObj.oneSum += v.oneValue
          this.defectSumObj.twoSum += v.twoValue
          this.defectSumObj.threeSum += v.threeValue
          this.defectSumObj.fourSum += v.fourValue
          this.defectSumObj.total += v.value
        })
        console.log('计算后的数据', this.returnTabel)
      }
    },
    //初始化数据
    initData() {
      document.getElementById('mainE').removeAttribute('_echarts_instance_')
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mainE'))
      // 绘制图表
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}个 ({d}%)'
          },
          legend: {
            orient: 'vertical',
            top: '20',
            right: '20',
            data: this.echartsTitle
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '25%'],
              label: {
                position: 'inner',
                fontSize: 12
              },
              labelLine: {
                show: false
              },
              data: this.contentEchatrs
            },
            {
              type: 'pie',
              radius: ['30%', '45%'],
              label: {
                position: 'inner',
                fontSize: 12
              },
              data: this.allArr
            },
            {
              type: 'pie',
              radius: ['55%', '65%'],
              label: {
                formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  b: {
                    color: '#4C5058',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 33
                  },
                  per: {
                    color: '#fff',
                    backgroundColor: '#4C5058',
                    padding: [4, 4],
                    borderRadius: 4
                  }
                }
              },
              data: this.echartsData
            }
          ]
        },
        true
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  // 表格样式
  .table-box {
    width: 96%;
    height: 100%;
    margin: auto;
    overflow-y: scroll;
    .top-tool {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      // flex-wrap: wrap;
      font-size: 14px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .el-input {
          width: 142px;
          margin-right: 10px;
        }
        .serch-input {
          width: 245px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 135px;
        }

        .title {
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }
      .serch-btn {
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2d74e7;
        // margin-left: 14px;
        padding: 12px;
        border: none !important;
      }

      .serch-btn:hover {
        opacity: 0.8;
      }
      .right-btn {
        margin-bottom: 14px;
        display: inline-block;
        // display: flex;
        // align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }
    .content {
      min-height: 100px;
      width: 100%;
      border: 1px solid #afe7f8;
      padding: 10px;
      box-sizing: border-box;
      .detailsTitle {
        color: #666;
        font-size: 16px;
        font-weight: bold;
        height: 38px;
        text-align: center;
        line-height: 38px;
        border: 2px solid #666;
        background: #f3f7fe;
      }

      .title {
        text-align: center;
      }
      .table-content {
        display: flex;
        text-align: center;
        flex-direction: column;
        & > li {
          display: flex;
          align-items: center;
          & > div {
            height: 38px;
            line-height: 38px;
            flex: 1;
            border: 1px solid #ccc;
          }
        }
      }
    }
  }

  // 选择框
  /deep/ .el-select {
    width: 150px;
  }
}
</style>