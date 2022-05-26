<template>
  <div class="engineering-manage">
    <!-- 管道缺陷分类 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">检测日期：</div>
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchValue.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions0"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center; margin: 0 5px">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="searchValue.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions1"
                  @change="changeDate"
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
          <el-button class="serch-btn" type="primary"> 导出 </el-button>
        </div>
        <div class="right-btn"></div>
      </div>
      <div class="content" v-if="!isNull">
        <div id="mainA" style="height: 500px"></div>
        <div style="border: 1px solid #ccc">
          <div class="detailsTitle">管道缺陷分类统计表</div>
          <table width="100%" height="300" border="1" class="left-table" cellspacing="0" align="center" stripe>
            <thead>
              <tr height="34">
                <th>缺陷类型</th>
                <th>缺陷名称</th>
                <th>缺陷数量</th>
              </tr>
            </thead>
            <tr class="highlight">
              <td>{{ zc.name }}</td>
              <td>{{ zc.title }}</td>
              <td>{{ zc.value }}</td>
            </tr>
            <tr class="highlight" v-for="(v, i) in defectQuantityStatisticsA" :key="v.title">
              <td :rowspan="defectQuantityStatisticsA.length" v-if="i < 1">结构性缺陷</td>
              <td>{{ v.title }}</td>
              <td>{{ v.value }}</td>
            </tr>
            <tr class="highlight" v-for="(v, i) in defectQuantityStatisticsB" :key="i">
              <td :rowspan="defectQuantityStatisticsB.length" v-if="i < 1">功能性缺陷</td>
              <td>{{ v.title }}</td>
              <td>{{ v.value }}</td>
            </tr>
            <tr class="defectSum">
              <td colspan="2">合计</td>
              <td>{{ defectSum }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="isNull" style="height: 100%; display: flex; justify-content: center; align-items: center">
        <div style="text-align: center">
          <img
            style="width: 100px; height: 100px; -webkit-user-drag: none"
            src="@/assets/images/nullData.png"
            alt="暂无数据"
            srcset=""
          />
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    <!-- 添加卡片 -->
  </div>
</template>

<script>
import { getPipeDefectsTypeCount } from '@/api/pipelineManage'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      isNull: false, // 数据是否为空
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      searchValue: {
        startDate: '',
        finishDate: '',
        startPoint: '',
        endPoint: '',
        defectType: '',
        defectName: ''
      },
      defectSum: 0, // 合计
      zc: { value: 0, name: '正常', title: '(ZC)正常', type: 'ZC' },
      defectQuantityStatisticsA: [], // 管道缺陷数量统计表
      defectQuantityStatisticsB: [],
      echartsTitle: [],
      echartsData: [],
      contentEchatrs: [],
      pageData: []
    }
  },
  async created() {
    await this.getData()
    await this.initData()
    // console.log('created生效了吗?')
  },
  mounted() {
    // console.log('mounted生效了吗?')
  },
  beforeCreate() {
    console.log('销毁echatrs')
    document.getElementById('mainA').removeAttribute('_echarts_instance_')
  },
  computed: {},
  watch: {
    'searchValue.startDate': function (n) {
      this.searchValue.finishDate = n
    },
    pageData: {
      handler(nv, ov) {
        this.defectSum = 0
        this.zc.value = 0
        // this.pageData = nv

        this.contentEchatrs = nv.map((v) => {
          return {
            name: v.defectType,
            value: v.defectNum
          }
        })

        this.contentEchatrs = this.contentEchatrs.reduce((obj, item) => {
          let find = obj.find((i) => i.name === item.name)
          let _d = {
            ...item,
            frequency: 1
          }
          find ? ((find.value += item.value), find.frequency++) : obj.push(_d)
          return obj
        }, [])

        this.contentEchatrs.forEach((v) => {
          if (v.name == null) {
            v.name = '正常'
          }
        })

        this.echartsTitle = nv.map((v) => {
          return v.defectName
        })

        this.echartsData = nv.map((v) => {
          this.defectSum += v.defectNum
          return {
            value: v.defectNum,
            name: v.defectName
          }
        })
        nv.forEach((pv) => {
          if (pv.defectType == '结构性缺陷' && pv.defectType != null) {
            this.defectQuantityStatisticsA.push({
              // { value: 0, name: '障碍物', title: '(ZW)障碍物', type: 'ZW' }
              name: pv.defectName,
              type: pv.defectCode,
              value: pv.defectNum,
              title: `（${pv.defectCode}）${pv.defectName}`
            })
          }

          if (pv.defectType == '功能性缺陷' && pv.defectType != null) {
            this.defectQuantityStatisticsB.push({
              // { value: 0, name: '障碍物', title: '(ZW)障碍物', type: 'ZW' }
              name: pv.defectName,
              type: pv.defectCode,
              value: pv.defectNum,
              title: `（${pv.defectCode}）${pv.defectName}`
            })
          }
          if (pv.defectCode == 'ZC') {
            this.zc.value = pv.defectNum
          }
        })

        this.defectQuantityStatisticsA = this.defectQuantityStatisticsA.reduce((obj, item) => {
          let find = obj.find((i) => i.name === item.name)
          let _d = {
            ...item,
            frequency: 1
          }
          find ? ((find.value += item.value), find.frequency++) : obj.push(_d)
          return obj
        }, [])

        this.defectQuantityStatisticsB = this.defectQuantityStatisticsB.reduce((obj, item) => {
          let find = obj.find((i) => i.name === item.name)
          let _d = {
            ...item,
            frequency: 1
          }
          find ? ((find.value += item.value), find.frequency++) : obj.push(_d)
          return obj
        }, [])

        console.log('this.zc', this.zc)
        console.log('defectQuantityStatisticsA', this.defectQuantityStatisticsA)
        console.log('defectQuantityStatisticsB', this.defectQuantityStatisticsB)
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 搜索
    searchApi() {
      this.getData(this.searchValue)
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.searchValue.startDate).getTime()
      let date2 = new Date(this.searchValue.finishDate).getTime()
      this.pickerOptions0 = {
        disabledDate: (time) => {
          if (date2 != '') {
            // return time.getTime() > Date.now() || time.getTime() > date2
            return time.getTime() > date2
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
      this.pickerOptions1 = {
        disabledDate: (time) => {
          // return time.getTime() < date1 || time.getTime() > Date.now()
          return time.getTime() < date1 - 8.64e7
        }
      }
    },
    async getData(params) {
      // {jcStartDate:检测开始日期,jcEndDate:检测结束日期,startPoint：起始井号", "endPoint：终止井号,defectType:缺陷类型，defectName：缺陷名称}
      let data = {}
      data.wordInfoState = '1'
      if (params) {
        data.startDate = params.startDate
        data.finishDate = params.finishDate
        data.startPoint = params.startPoint
        data.endPoint = params.endPoint
        data.defectType = params.defectType
        data.defectName = params.defectName
      }

      let res = await getPipeDefectsTypeCount(data)
      this.pageData = res.result
      if (res.result.length === 0) {
        this.isNull = true
      } else {
        this.isNull = false
      }
    },
    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mainA'))
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
              radius: [0, '30%'],
              label: {
                position: 'inner',
                fontSize: 14
              },
              labelLine: {
                show: false
              },
              data: this.contentEchatrs
            },
            {
              // name: 'Access From',
              type: 'pie',
              radius: ['40%', '55%'],
              // labelLine: {
              //   length: 30
              // },
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
          width: 142px;
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
      height: 92%;
      width: 100%;
      border: 1px solid #afe7f8;
      overflow-y: scroll;
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
      .left-table {
        // border-color: #DEDEDE;
        width: 100%;
        font-weight: bold;
        text-align: center;
        th {
          color: #666;
          font-size: 14px;
          background: #f3f7fe;
        }
        tr {
          height: 38px;
        }
        .defectSum {
          height: 45px;
          background-color: #f3f7fe;
        }
        .highlight {
          font-size: 12px;
        }
        .highlight:hover {
          opacity: 0.8;
          color: #e6a23c;
          background-color: #f3f7fe;
        }
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