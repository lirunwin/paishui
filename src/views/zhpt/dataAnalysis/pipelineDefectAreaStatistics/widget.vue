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
            </div>

            <div class="serch-engineering">
              <div class="title">起始井号</div>
               <el-input
                size="small"
                placeholder="请输入起始井号"
                v-model="searchValue.startPoint"
                clearable
                style="margin: 0 10px;width:150px"
              ></el-input>
            </div>
            <div class="serch-engineering">
              <div class="title">终止井号</div>
               <el-input
                width='150px'
                size="small"
                placeholder="请输入终止井号"
                v-model="searchValue.endPoint"
                clearable
                style="margin: 0 10px;width:150px"
              ></el-input>
            </div>
            <div class="serch-engineering">
              <div class="title">缺陷等级：</div>
              <el-select size="small" clearable v-model="searchValue.defectLevel" placeholder="选择建议">
                <el-option
                  v-for="item in defectLevels"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div class="operation-box">
              <div class="serch-engineering">
                <el-button class="serch-btn" type="primary" @click="drawFeature"> 范围 </el-button>
                <el-button class="serch-btn" type="primary"  @click="clearDraw"> 清除 </el-button>
                <el-button class="serch-btn" type="primary" @click="searchData"> 查询 </el-button>
                <el-button class="serch-btn" type="primary" @click="getPdf('管道区域缺陷统计', 'areasta')"> 导出 </el-button>
                <!-- <el-button class="serch-btn" type="primary" > 导出 </el-button> -->
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
              <el-checkbox v-model="checkDefectLevel">缺陷等级</el-checkbox>
              <el-checkbox v-model="checkDefectName">缺陷名称</el-checkbox>
            </div>
            <div id="areasta" style="padding: 10px">
              <h2 style="text-align: center">管道缺陷区域统计图</h2>
              <div id="mainPDAS" style="height: 330px"></div>
              <!-- 表格 -->
              <div class="detailsTitle">管道缺陷数量统计表</div>
              <summary-form :tabelData="returnTabel"></summary-form>
            </div>
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
      radio: '1', // 单选框的值
      searchValue: {
        jcStartDate: '',
        jcEndDate: '',
        startPoint: '',
        endPoint: '',
        defectLevel: ''
      },
      defectLevels: ['一级', '二级', '三级', '四级'],
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
      // 
      hasDraw: false,
      mapData: {}
    }
  },

  mounted() {
    this.$nextTick(() => {
      // this.initData()
    })
    this.$refs.myMap && this.$refs.myMap.showLegend('testReport', true)
  },
  destroyed() {
    this.$refs.myMap && this.$refs.myMap.showLegend('testReport', false)
    this.data.that.clearMap()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainPDAS').removeAttribute('_echarts_instance_')
  },
  created() {
  },
  methods: {
    // 获取字典
    async getParamsId() {
      // check_suggest
      let checkSuggest = await queryDictionariesId({ keys: 'check_suggest' })
      this.fixSuggestList = checkSuggest.result.check_suggest
      console.log('checkSuggest', checkSuggest.result.check_suggest)
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    sDateChange(t) {
      if (!this.searchValue.jcEndDate) {
        this.$nextTick(() => {
          this.searchValue.jcEndDate = this.searchValue.jcStartDate
        })
      }
    },
    eDateChange(t) {
      if (!this.searchValue.jcStartDate) {
        this.$nextTick(() => {
          this.searchValue.jcStartDate = this.searchValue.jcEndDate
        })
      }
    },
    // 处理地图给的数据
    getMapData(res) {
       if(!res){
        this.loading = false
      }
      let arr = res.defectData

      // 数据清零
      this.defectQuantityStatisticsA.forEach(item => {
        item.oneValue = 0
        item.twoValue = 0
        item.threeValue = 0
        item.fourValue = 0
        item.value = 0
      })
      this.defectQuantityStatisticsB.forEach(item => {
        item.oneValue = 0
        item.twoValue = 0
        item.threeValue = 0
        item.fourValue = 0
        item.value = 0
      })
      this.defectSumObj = { oneSum: 0, twoSum: 0, threeSum: 0, fourSum: 0, total: 0 }
      // 按缺陷名称给数据分类
      // 缺陷数量统计
      if (arr) {
        arr.forEach((resValue) => {
          this.defectQuantityStatisticsA.forEach((sumValue) => {
            // console.log("类型是否相等",typeof resValue.defectCode,sumValue.type);
            if (resValue.defectCode == sumValue.type) {
              if (['一级', '1'].includes(resValue.defectLevel)) {
                sumValue.oneValue += 1
              } else if (['二级', '2'].includes(resValue.defectLevel)) {
                sumValue.twoValue += 1
              } else if (['三级', '3'].includes(resValue.defectLevel)) {
                sumValue.threeValue += 1
              } else if (['四级', '4'].includes(resValue.defectLevel)) {
                sumValue.fourValue += 1
              }
            }
          })

          this.defectQuantityStatisticsB.forEach((sumValue) => {
            if (resValue.defectCode == sumValue.type) {
              if (['一级', '1'].includes(resValue.defectLevel)) {
                sumValue.oneValue += 1
              } else if (['二级', '2'].includes(resValue.defectLevel)) {
                sumValue.twoValue += 1
              } else if (['三级', '3'].includes(resValue.defectLevel)) {
                sumValue.threeValue += 1
              } else if (['四级', '4'].includes(resValue.defectLevel)) {
                sumValue.fourValue += 1
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
      this.loading = false
      this.$nextTick(() => {
        this.initData()
      })
    },
    // 绘制
    drawFeature() {
      this.hasDraw = true
      this.$refs.myMap.draw({
        callback: (fea) => {
          this.getDataFromExtent(fea).then((res) => {
            this.getMapData(res)
          })
        }
      })
    },
    // 清除
    clearDraw () {
      this.hasDraw = false
      this.$refs.myMap && this.$refs.myMap.clearDraw()
    },
    // 地图移动
    mapMoveEvent(extent) {
      this.getDataFromExtent(extent).then((res) => {
        this.getMapData(res)
      })
    },
    // 查询
    searchData () {
      this.getDataFromExtent().then((res) => {
        this.getMapData(res)
      })
    },
    getDataFromExtent(extent) {
      this.$refs.myMap.changeLoading(true)
      return new Promise(resolve => {
        this.$refs.myMap.changeLoading(false)
        this.getPipeData().then(data => {
          if (data.code === 1) {
            // 地图范围过滤数据
            resolve(this.$refs.myMap.getDefectDataInMap(data.result, extent, 1))
          } else this.$message.error('请求数据出错')
        })
      })
    },

    // 根据条件获取缺陷数据
    async getPipeData() {
      let params = {
        startPoint: '',
        endPoint: '',
        jcStartDate: '',
        jcEndDate: '',
        wordInfoState: "1",
        defectLevel: '',
        ...this.searchValue
      }
      // 缓存
      let strKey = JSON.stringify(params)
      if (this.mapData.hasOwnProperty(strKey)) {
        return Promise.resolve(this.mapData[strKey])
      } else {
        let res = await getDefectDataBySE(params)
        this.mapData[strKey] = res
        return Promise.resolve(res)
      }
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
              data: ['一级', '二级', '三级', '四级']
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
      let allData = [...this.defectQuantityStatisticsA, ...this.defectQuantityStatisticsB]
      // 类型
      let typeData = [
        { name: '结构性缺陷', value: 0 },
        { name: '功能性缺陷', value: 0 },
        // { name: '正常', value: 0 }
      ]
      typeData[0].value = this.defectQuantityStatisticsA.map(item => item.value).reduce((prev, next) => prev + next, 0)
      typeData[1].value = this.defectQuantityStatisticsB.map(item => item.value).reduce((prev, next) => prev + next, 0)

      let seriesType = {
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
        data: typeData
      }

      // 级别
      let levelData = [
        { name: '1级', Lname: '一级', value: 0 },
        { name: '2级', Lname: '二级', value: 0 },
        { name: '3级', Lname: '三级', value: 0 },
        { name: '4级', Lname: '四级', value: 0 }
      ]
      allData.forEach(item => {
        levelData[0].value += item.oneValue
        levelData[1].value += item.twoValue
        levelData[2].value += item.threeValue
        levelData[3].value += item.fourValue
      })
      let seriesLevel = {
        type: 'pie',
        radius: ['30%', '45%'],
        label: {
          position: 'inner',
          fontSize: 12
        },
        data: levelData
      }

      // 缺陷名称
      let defectData = allData.filter(item => {
        return item.oneValue + item.twoValue + item.threeValue + item.fourValue > 0
      }).map(item => {
        return { name: item.title, value: item.oneValue + item.twoValue + item.threeValue + item.fourValue }
      })
      let seriesName= {
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
        data: defectData
      }

      let arr = [this.checkDefectType, this.checkDefectName, this.checkDefectLevel]
      if (arr.every(v => v)) {
        return [seriesType, seriesName, seriesLevel]
      }

      // 判断条件
      let condition1 = !this.checkDefectType && this.checkDefectName && this.checkDefectLevel
      let condition2 = this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition3 = this.checkDefectType && this.checkDefectName && !this.checkDefectLevel
      let condition4 = !this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition5 = this.checkDefectType && !this.checkDefectName && !this.checkDefectLevel
      let condition6 = !this.checkDefectType && this.checkDefectName && !this.checkDefectLevel

      if (condition1) {
        return [this.setEchatrsMain(seriesLevel, [0, '45%']), this.setEchatrsMain(seriesName, ['55%', '65%'])]
      } else if (condition2) {
        return [this.setEchatrsMain(seriesType, [0, '45%']), this.setEchatrsMain(seriesLevel, ['55%', '65%'])]
      } else if (condition3) {
        return [this.setEchatrsMain(seriesType, [0, '45%']), this.setEchatrsMain(seriesName, ['55%', '65%'])]
      } else if (condition4) {
        return [this.setEchatrsMain(seriesLevel, [0, '65%'])]
      } else if (condition5) {
        return [this.setEchatrsMain(seriesType, [0, '65%'])]
      } else if (condition6) {
        return [this.setEchatrsMain(seriesName, [0, '65%'])]
      } else {
        return []
      }
    },
    // 动态加载echatrs(柱状图)
    loadEchatrsBar() {
      let allData = [...this.defectQuantityStatisticsA, ...this.defectQuantityStatisticsB]
      // 缺陷等级数据
      let leveldata = [0, 0, 0, 0];
      allData.forEach(item => {
        leveldata[0] += item.oneValue
        leveldata[1] += item.twoValue
        leveldata[2] += item.threeValue
        leveldata[3] += item.fourValue
      })
      let seriesLevel = {
        name: '缺陷等级',
        type: 'bar',
        data: leveldata,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `（${a['name']}）数量:${a['value']}   `
          }
        }
      }
      // 功能性、结构性缺陷数据
      let sDefectData = [0, 0, 0, 0], fDefectData = [0, 0, 0, 0]
      this.defectQuantityStatisticsA.forEach(item => {
        sDefectData[0] += item.oneValue
        sDefectData[1] += item.twoValue
        sDefectData[2] += item.threeValue
        sDefectData[3] += item.fourValue
      })
      this.defectQuantityStatisticsB.forEach(item => {
        fDefectData[0] += item.oneValue
        fDefectData[1] += item.twoValue
        fDefectData[2] += item.threeValue
        fDefectData[3] += item.fourValue
      })
      let seriesFtype = {
        name: '功能性缺陷',
        type: 'bar',
        stack: 'defectType',
        data: fDefectData,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `${a['seriesName']}（${a['name']}）:${a['value']}   `
          }
        }
      }
      let seriesStype = {
        name: '结构性缺陷',
        type: 'bar',
        stack: 'defectType',
        data: sDefectData,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `${a['seriesName']}（${a['name']}）:${a['value']}   `
          }
        }
      }
      // 各种缺陷
      let seriesNames = allData.filter(item => {
        // 去掉全是 0 的统计
        return item.oneValue + item.twoValue + item.threeValue + item.fourValue > 0
      }).map(item => {
        return {
          name: item.title,
          type: 'bar',
          stack: 'defectNames',
          data: [item.oneValue, item.twoValue, item.threeValue, item.fourValue],
          tooltip: {
            trigger: 'item',
            formatter: function (a) {
            return `（${a['seriesName']}）数量:${a['value']}   `
            }
          }
        }
      })

      let arr = [this.checkDefectType, this.checkDefectName, this.checkDefectLevel]
      if (arr.every(v => v)) {
        return [seriesLevel, seriesFtype, seriesStype, ...seriesNames]
      }
      // 判断条件
      let condition1 = !this.checkDefectType && this.checkDefectName && this.checkDefectLevel
      let condition2 = this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition3 = this.checkDefectType && this.checkDefectName && !this.checkDefectLevel
      let condition4 = !this.checkDefectType && !this.checkDefectName && this.checkDefectLevel
      let condition5 = this.checkDefectType && !this.checkDefectName && !this.checkDefectLevel
      let condition6 = !this.checkDefectType && this.checkDefectName && !this.checkDefectLevel

      if (condition1) {
        return [seriesLevel, ...seriesNames]
      } else if (condition2) {
        return [seriesLevel, seriesFtype, seriesStype]
      } else if (condition3) {
        return [seriesFtype, seriesStype, ...seriesNames]
      } else if (condition4) {
        return [seriesLevel]
      } else if (condition5) {
        return [seriesFtype, seriesStype]
      } else if (condition6) {
        return [seriesNames]
      }else {
        return []
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
  },
  watch: {
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
        // height: 100%;
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
            padding-left: 10px;
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