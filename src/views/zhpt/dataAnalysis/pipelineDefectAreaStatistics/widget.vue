<template>
  <div class="engineering-manage">
    <!-- 管道缺陷区域统计 -->
    <div class="releaseTop-box">
      <!-- 左边部分 -->
      <div class="right">
        <!-- 地图 -->
        <div class="map-box">
          <simple-map @mapMoveEvent="mapMoveEvent" ref="myMap"></simple-map>
        </div>
      </div>
      <!-- 右边部分 -->
      <div class="left">
        <div class="table-box">
          <div class="top-tool">
            <div class="itmetitle">
              <div class="iconSymbol"></div>
              <div class="titleName">统计条件</div>
            </div>
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
            </div>
            <div class="serch-engineering">
              <div class="title">整改建议：</div>
              <el-select size="small" clearable v-model="searchValue.fixSuggest" placeholder="选择建议">
                <el-option
                  v-for="item in fixSuggestList"
                  :key="item.codeValue"
                  :label="item.codeValue"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </div>
            <div class="operation-box">
              <div class="serch-engineering">
                <el-button class="serch-btn" type="primary" @click="drawFeature"> 绘制 </el-button>
                <el-button class="serch-btn" type="primary"> 清除 </el-button>
                <el-button class="serch-btn" type="primary"> 查询 </el-button>
                <el-button class="serch-btn" type="primary"> 导出 </el-button>
              </div>
            </div>
          </div>
          <div class="itmetitle">
            <div class="iconSymbol"></div>
            <div class="titleName">统计结果</div>
          </div>
          <div class="content" v-loading="loading">
            <div style="padding-left: 12px">
              <el-radio v-model="radio" label="1">饼状图</el-radio>
              <el-radio v-model="radio" label="2">柱状图</el-radio>
              <el-checkbox v-model="checkDefectType">缺陷类型</el-checkbox>
              <el-checkbox v-model="checkDefectName">类型名称</el-checkbox>
              <el-checkbox v-model="checkDefectLevel">缺陷等级</el-checkbox>
            </div>
            <h2 style="text-align: center">管道评估统计图</h2>
            <div id="mainPDAS" style="height: 330px"></div>
            <!-- 表格 -->
            <div class="detailsTitle">管道缺陷数量统计表</div>
            <summary-form :tabelData="returnTabel"></summary-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import { queryDictionariesId } from '@/api/pipelineManage'

// 引入发布的组件
import summaryForm from '@/views/zhpt/pipelineManage/components/summaryForm.vue'
import simpleMap from '@/components/SimpleMap'
import { getDefectDataBySE } from '@/api/sysmap/drain'

export default {
  props: ['data'],
  components: { simpleMap, summaryForm },
  data() {
    return {
      loading: true, // 加载
      fixSuggestList: [],
      checkDefectType: true,
      checkDefectName: true,
      checkDefectLevel: true,

      tableData: [], // 表格数据
      typeArr: [], // 建议类型数组
      numArr: [], // 管道数量
      lengthArr: [], // 管道长度
      radio: '2', // 单选框的值
      searchValue: {
        startDate: '',
        finishDate: '',
        fixSuggest: ''
        // 检测日期
      }, // 搜索关键字的值
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
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
      echartsData: []
    }
  },

  mounted() {
    this.$nextTick(() => {
      // this.initData()
    })
    this.$refs.myMap.showLegend('testReport', true)
    console.log('this.setOptionShowNum', this.setOptionShowNum)
    console.log('this.setOptionShowLen', this.setOptionShowLen)
  },
  destroyed() {
    this.$refs.myMap.showLegend('testReport', false)
    this.data.that.clearMap()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainPDAS').removeAttribute('_echarts_instance_')
  },
  created() {
    this.getParamsId()
  },
  methods: {
    // 获取字典
    async getParamsId() {
      // 获取字典
      // check_suggest
      let checkSuggest = await queryDictionariesId({ keys: 'check_suggest' })
      this.fixSuggestList = checkSuggest.result.check_suggest
      console.log('checkSuggest', checkSuggest.result.check_suggest)
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
    // 处理地图给的数据
    getMapData(res) {
      let arr = res.defectData
      this.pageData = arr
      console.log('arr', arr)
      // 按缺陷名称给数据分类
      // 缺陷数量统计
      if (arr) {
        arr.forEach((resValue) => {
          this.defectQuantityStatisticsA.forEach((sumValue) => {
            // console.log("类型是否相等",typeof resValue.defectCode,sumValue.type);
            if (resValue.defectCode == sumValue.type) {
              if (resValue.defectLevel == '一级') {
                sumValue.oneValue = resValue.defectNum * 1
                return
              } else if (resValue.defectLevel == '二级') {
                sumValue.twoValue = resValue.defectNum * 1
                return
              } else if (resValue.defectLevel == '三级') {
                sumValue.threeValue = resValue.defectNum * 1
                return
              } else if (resValue.defectLevel == '四级') {
                sumValue.fourValue = resValue.defectNum * 1
                return
              }
              console.log('defectQuantityStatisticsA', this.defectQuantityStatisticsA)
            }
          })

          this.defectQuantityStatisticsB.forEach((sumValue) => {
            if (resValue.defectCode == sumValue.type) {
              if (resValue.defectLevel == '一级') {
                sumValue.oneValue = resValue.defectNum
                return
              } else if (resValue.defectLevel == '二级') {
                sumValue.twoValue = resValue.defectNum
                return
              } else if (resValue.defectLevel == '三级') {
                sumValue.threeValue = resValue.defectNum
                return
              } else if (resValue.defectLevel == '四级') {
                sumValue.fourValue = resValue.defectNum
                return
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
      }
      // console.log('returnTabel', this.returnTabel)
      this.$nextTick(() => {
        this.loading = false
        this.initData()
      })
    },
    // 绘制
    drawFeature() {
      this.$refs.myMap.draw((fea) => {
        this.getDataFromExtent({}, fea).then((res) => {
          console.log('绘制,过滤后,管道缺陷区域统计', res)
          this.getMapData(res)
        })
      })
    },
    mapMoveEvent(extent) {
      this.getDataFromExtent({}, extent).then((res) => {
        console.log('地图变化,过滤后', res)
        this.getMapData(res)
      })
    },
    async getDataFromExtent(params, extent) {
      let data = await this.getPipeData(params)
      if (data.code === 1) {
        // 地图范围过滤数据
        return this.$refs.myMap.getDefectDataInMap(data.result, extent)
      } else this.$message.error('请求数据出错')
    },
    // 根据条件获取缺陷数据
    getPipeData(filter = {}) {
      let params = {
        startPoint: '',
        endPoint: '',
        funcClass: '',
        structClass: '',
        jcStartDate: '',
        jcEndDate: '',
        checkSuggest: '修复计划',
        ...filter
      }
      return getDefectDataBySE(params)
    },
    //初始化数据(饼状图)
    initData() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mainPDAS'))
      // 绘制图表

      if (this.radio == '1') {
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
            series: this.loadEchatrsPie
          },
          true
        )
      } else if (this.radio == '2') {
        myChart.setOption(
          {
            tooltip: {
              trigger: 'item'
            },
            legend: {},
            xAxis: {
              type: 'category',
              data: this.typeArr
            },
            yAxis: {
              type: 'value'
            },
            series: this.loadEchatrsBar
          },
          true
        )
      }
    },
    // 动态设置echatrs大小
    setEchatrsMain(main, radius) {
      main.radius = radius
      return main
    }
  },
  computed: {
    // 动态加载echatrs(饼图)
    loadEchatrsPie() {
      let seriesType = {
        name: '缺陷类型统计',
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
      }
      let seriesName = {
        type: 'pie',
        radius: ['30%', '45%'],
        label: {
          position: 'inner',
          fontSize: 12
        },
        data: this.allArr
      }

      let seriesLevel = {
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

      let arr = [this.checkDefectType, this.checkDefectName, this.checkDefectLevel]
      if (arr.every((v) => v == true) || arr.every((v) => v == false)) {
        return [seriesType, seriesName, seriesLevel]
      }
      // 判断条件
      let condition1 = !this.checkDefectType && this.checkDefectName && this.checkDefectLevel
      let condition2 = this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition3 = this.checkDefectType && this.checkDefectName && !this.checkDefectLevel
      let condition4 = !this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition5 = this.checkDefectType && !this.checkDefectName && !this.checkDefectLevel

      if (condition1) {
        return [this.setEchatrsMain(seriesName, [0, '45%']), seriesLevel]
      } else if (condition2) {
        return [this.setEchatrsMain(seriesType, [0, '45%']), seriesLevel]
      } else if (condition3) {
        return [seriesType, this.setEchatrsMain(seriesName, ['30%', '65%'])]
      } else if (condition4) {
        return [this.setEchatrsMain(seriesLevel, [0, '65%'])]
      } else if (condition5) {
        return [this.setEchatrsMain(seriesType, [0, '65%'])]
      } else {
        return [seriesType, seriesName, seriesLevel]
      }
    },
    // 动态加载echatrs(柱状图)
    loadEchatrsBar() {
      let seriesType = {
        name: '缺陷类型统计',
        type: 'bar',
        data: this.contentEchatrs,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            console.log('标题参数', a)
            return `（${a['data']['name']}）类型:${a['data']['value']}   `
          }
        }
      }
      let seriesName = {
        name: '缺陷数量统计',
        type: 'bar',
        data: this.allArr,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            console.log('标题参数', a)
            return `（${a['data']['name']}）数量:${a['data']['value']}   `
          }
        }
      }
      let seriesLevel = {
        name: '缺陷等级统计',
        type: 'bar',
        data: this.echartsData,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            console.log('标题参数', a)
            return `（${a['data']['name']}）等级:${a['data']['value']}   `
          }
        }
      }

      let arr = [this.checkDefectType, this.checkDefectName, this.checkDefectLevel]
      if (arr.every((v) => v == true) || arr.every((v) => v == false)) {
        return [seriesType, seriesName, seriesLevel]
      }
      // 判断条件
      let condition1 = !this.checkDefectType && this.checkDefectName && this.checkDefectLevel
      let condition2 = this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition3 = this.checkDefectType && this.checkDefectName && !this.checkDefectLevel
      let condition4 = !this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition5 = this.checkDefectType && !this.checkDefectName && !this.checkDefectLevel

      if (condition1) {
        return [seriesName, seriesLevel]
      } else if (condition2) {
        return [seriesType, seriesLevel]
      } else if (condition3) {
        return [seriesType, seriesName]
      } else if (condition4) {
        return [seriesLevel]
      } else if (condition5) {
        return [seriesType]
      } else {
        return [seriesType, seriesName, seriesLevel]
      }
    },
    returnTabel() {
      let obj = {
        defectQuantityStatisticsA: this.defectQuantityStatisticsA,
        defectQuantityStatisticsB: this.defectQuantityStatisticsB,
        defectSumObj: this.defectSumObj
      }
      return obj
    },

    mapExtent() {
      return this.$store.state.gis.mapExtent
    }
  },
  watch: {
    mapExtent: {
      handler(nv, ov) {
        console.log('视图改变')
        if (this.data.mapView.getView().getZoom() > 16) {
          this.data.that.queryForExtent(nv)
        } else {
          // 在地图界别较小时，移除管网
          this.data.that.clearMap()
        }
      },
      deep: true,
      immediate: true
    },
    radio: function (newValue, old) {
      if (old != newValue) {
        this.initData()
      }
    },
    checkDefectType: function (newValue, old) {
      this.initData()
    },
    checkDefectName: function (newValue, old) {
      this.initData()
    },
    checkDefectLevel: function (newValue, old) {
      this.initData()
    },
    pageData: function (newValue, old) {
      this.contentEchatrs = [
        {
          name: '结构性缺陷',
          value: 0
        },
        {
          name: '功能性缺陷',
          value: 0
        },
        {
          name: '正常',
          value: 0
        }
      ]

      this.defectQuantityStatisticsA.forEach((v) => {
        this.contentEchatrs[0].value += v.value
      })
      this.defectQuantityStatisticsB.forEach((v) => {
        this.contentEchatrs[1].value += v.value
      })
      newValue.forEach((v) => {
        if (v.defectCode == 'ZC') {
          this.contentEchatrs[2].value += v.defectNum
        }
        this.allArr.forEach((av) => {
          if (v.defectLevel == av.Lname) {
            av.value += v.defectNum
          }
        })
      })

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

      console.log('echartsDataArr', echartsDataArr)
      this.echartsTitle = echartsDataArr.map((titleV) => {
        return titleV.name
      })
      this.echartsData = echartsDataArr
      console.log(' this.echartsData ', this.echartsData)
      this.initData()
    },

    'searchValue.startDate': function (n) {
      this.searchValue.finishDate = n
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  //   overflow-y: scroll;
  padding: 20px;
  overflow: hidden;

  /deep/.itmetitle {
    height: 20px;
    width: 100%;
    font-size: 16px;
    margin: 14px 0;
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
  // 分左右布局
  .releaseTop-box {
    height: 100%;
    display: flex;
    justify-content: space-between;

    .left {
      flex: 4;
      overflow-y: scroll;
      .table-box {
        width: 96%;
        height: 100%;
        margin: 20px auto;
        .top-tool {
          display: flex;
          // justify-content: space-between;
          // flex-direction: column;
          // flex-wrap: wrap;
          font-size: 14px;
          margin-bottom: 14px;
          flex-wrap: wrap;
          /deep/ .serch-engineering {
            display: flex;
            // justify-content: space-around;
            align-items: center;
            // margin-right: 10px;
            padding-left: 16px;
            box-sizing: border-box;
            margin-bottom: 10px;
            .sampleTime {
              width: 308px !important;
              .el-input {
                width: 140px;
              }
            }
            // 选择框
            .el-select {
              width: 130px;
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
        }
        .content {
          height: 92%;
          width: 100%;
          // overflow-y: scroll;
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
          /deep/ .el-table {
            flex: 1;
            // overflow-y: scroll;
            th.el-table__cell > .cell {
              color: rgb(50, 59, 65);
              height: 40px;
              line-height: 40px;
              background: rgb(234, 241, 253);
            }
            .el-table__row--striped > td {
              background-color: #f3f7fe !important;
            }
          }
          /deep/ .el-checkbox {
            margin-right: 0px !important;
            .el-checkbox__label {
              padding-left: 6px;
            }
          }
          /deep/ .el-radio {
            margin-right: 9px;
            .el-radio__label {
              padding-left: 4px;
            }
          }
          ul,
          li {
            direction: none;
            padding: 0;
            margin: 0;
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
      .releaseContent {
        border: 1px solid #9a9a9a;
        overflow: scroll;
      }
    }
    .right {
      flex: 3;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
      //   border: 1px solid #666;

      .map-box {
        height: 100%;
      }
    }
  }
}
</style>