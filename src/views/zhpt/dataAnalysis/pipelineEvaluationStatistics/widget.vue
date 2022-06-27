<template>
  <div class="engineering-manage">
    <!-- 管道评估统计 -->
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
              <div class="title">整改建议：</div>
              <el-select size="small" v-model="searchValue.checkSuggest" clearable placeholder="选择建议">
                <el-option
                  v-for="item in checkSuggestList"
                  :key="item.codeValue"
                  :label="item.codeValue"
                  :value="item.codeValue"
                >
                </el-option>
              </el-select>
            </div>
            <div class="operation-box">
              <div class="serch-engineering">
                <el-button size="small" class="serch-btn" type="primary" @click="search"> 查询 </el-button>
                <el-button size="small" class="serch-btn" type="primary" @click="getPdf('管道评估统计')"> 导出 </el-button>
                <el-button size="small" class="serch-btn" type="primary" @click="drawFeature">范围</el-button>
                <el-button size="small" class="serch-btn" type="primary" @click="clearDraw">清除</el-button>
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
              <el-checkbox v-model="pipNum">管道数量</el-checkbox>
              <el-checkbox v-model="pipLen">管道长度</el-checkbox>
            </div>
            <div id="pdfDom">
              <h2 style="text-align: center">管道评估统计图</h2>
              <div id="mainPESS" style="height: 250px"></div>
              <!-- 表格 -->
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                stripe
                style="width: 100%"
                show-summary
              >
                <template slot="empty">
                  <img
                    style="width: 100px; height: 100px; -webkit-user-drag: none"
                    src="@/assets/images/nullData.png"
                    alt="暂无数据"
                    srcset=""
                  />
                  <p style="padding: 0; margin: 0; padding-bottom: 20px">暂无数据</p>
                </template>
                <el-table-column header-align="center" align="center" label="管道评估统计表">
                  <el-table-column
                    :prop="v.name"
                    header-align="center"
                    align="center"
                    :label="v.label"
                    show-overflow-tooltip
                    v-for="v in tableContent"
                    :key="v.name"
                  >
                  </el-table-column>
                </el-table-column>
              </el-table>
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

import simpleMap from '@/components/SimpleMap'
import { getDefectDataBySE } from '@/api/sysmap/drain'
import { queryDictionariesId } from '@/api/pipelineManage'

export default {
  props: ['data'],
  components: { simpleMap },
  data() {
    return {
      loading: true, // 加载
      checkSuggestList: [],
      pipNum: true,
      pipLen: true,
      pipNumShow: 1,
      pipLenShow: 0,
      tableData: [], // 表格数据
      // 表格参数
      tableContent: [
        { label: '整改建议', name: 'type' },
        { label: '数量(条)', name: 'num' },
        { label: '长度(米)', name: 'len' }
      ],
      typeArr: [], // 建议类型数组
      numArr: [], // 管道数量
      lengthArr: [], // 管道长度
      radio: '1', // 单选框的值
      zero: '',
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
      searchValue: {
        jcStartDate: '',
        jcEndDate: '',
        checkSuggest: ''
        // 检测日期
      },
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

      // 筛选条件
      filter: {
        jcStartDate: '',
        jcEndDate: '',
        checkSuggest: ''
      },
      hasDraw: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.initData()
    })
    this.$refs.myMap && this.$refs.myMap.showLegend('pipelineEvaluate', true)
    console.log('this.setOptionShowNum', this.setOptionShowNum)
    console.log('this.setOptionShowLen', this.setOptionShowLen)
  },
  destroyed() {
    this.data.that.clearMap()
    this.$refs.myMap && this.$refs.myMap.showLegend('pipelineEvaluate', false)
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainPESS').removeAttribute('_echarts_instance_')
  },
  created() {
    this.getParamsId()
  },
  methods: {
    clearDraw () {
      this.hasDraw = false
      this.$refs.myMap.clearDraw()
    },
    // 获取字典
    getParamsId() {
      // 获取字典
      // check_suggest
      console.log('获取整改建议')
      queryDictionariesId({ keys: 'check_suggest' }).then(res => {
        if (res.code === 1) {
          this.checkSuggestList = res.result.check_suggest
        } else this.$message.error('获取整改建议字典失败！')
      })
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
      // this.tableData = [...res]
      if(!res){
        this.loading = false
      }
      let arrV = Object.values(res)
      let arrK = Object.keys(res)
      arrV.forEach((v, i) => {
        v.type = arrK[i]
        v.len = v.len.toFixed(2)
      })
      // console.log('res', arrV)
      this.tableData = arrV
      // 建议类型数组
      this.typeArr = this.tableData.map((v) => {
        return v.type
      })
      // 管道长度统计
      this.lengthArr = this.tableData.map((v) => {
        return {
          value: v.len,
          name: v.type
        }
      })
      // 管道数量统计
      this.numArr = this.tableData.map((v) => {
        return {
          value: v.num,
          name: v.type
        }
      })
      this.$nextTick(() => {
        this.loading = false
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
    // 地图范围变化
    mapMoveEvent(extent) {
      this.getDataFromExtent(extent).then((res) => {
        !this.hasDraw && this.getMapData(res)
      })
    },
    // 查询
    search() {
      this.getDataFromExtent().then((res) => {
        console.log('这是查询的数据', res)
        this.getMapData(res)
      })
    },
    async getDataFromExtent(extent) {
      let data = await this.getPipeData()
      if (data.code === 1) {
        // 地图范围过滤数据
        return this.$refs.myMap.getDataInMap(data.result, extent)
      } else this.$message.error('请求数据出错')
    },
    // 根据条件获取缺陷数据
    getPipeData() {
      let params = {
        jcStartDate: '',
        jcEndDate: '',
        checkSuggest: '',
        wordInfoState: 1,
        ...this.searchValue
      }
      return getDefectDataBySE(params)
    },

    //初始化数据(饼状图)
    initData() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mainPESS'))
      // 绘制图表
      if (this.radio == '1') {
        myChart.setOption(
          {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              right: 'right',
              top: 'center',
              data: this.typeArr
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

      myChart.on('legendselectchanged', (e) => {
        for (var i = 0; i < option.legend.data.length; i++) {
          var opt = option.legend.data[i]
          if (opt === e.name) {
            seriesindex = i
            idx = 0
            console.log(e.name)
          }
        }
      })
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
      let seriesNum = {
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `（${a['data']['name']}）数量:${a['data']['value']}   `
          }
        },
        name: '管道数量统计',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '50%'],
        label: {
          position: 'inner',
          fontSize: 10
        },
        labelLine: {
          show: false
        },
        data: this.numArr
      }
      let seriesLength = {
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `（${a['data']['name']}）长度:${a['data']['value']}   `
          }
        },
        name: '管道长度统计',
        type: 'pie',
        radius: ['60%', '80%'],
        labelLine: {
          length: 10
        },
        label: {
          formatter: ' {b}：{c} \n {d}% '
        },
        data: this.lengthArr
      }

      let resMain = []
      if (this.pipNum && this.pipLen) {
        resMain =  [seriesNum, seriesLength]
      } else if (this.pipNum) {
        resMain = [this.setEchatrsMain(seriesNum, [0, '80%'])]
      } else if (this.pipLen) {
        resMain = [this.setEchatrsMain(seriesLength, [0, '80%'])]
      }
      return resMain
    },
    // 动态加载echatrs(柱状图)
    loadEchatrsBar() {
      let seriesNum = {
        name: '管道数量统计',
        type: 'bar',
        data: this.numArr,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `（${a['data']['name']}）数量:${a['data']['value']}   `
          }
        }
      }
      let seriesLength = {
        name: '管道长度统计',
        type: 'bar',
        data: this.lengthArr,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return `（${a['data']['name']}）长度:${a['data']['value']}   `
          }
        }
      }

      let resMain = []
      if (this.pipNum && this.pipLen) {
        resMain =  [seriesNum, seriesLength]
      } else if (this.pipNum) {
        resMain = [seriesNum]
      } else if (this.pipLen) {
        resMain = [seriesLength]
      }
      return resMain
    }
  },
  watch: {
    radio: function (newValue, old) {
      if (old != newValue) {
        this.initData()
      }
    },
    pipNum: function (newValue, old) {
      newValue ? (this.pipNumShow = 1) : (this.pipNumShow = 0)
      this.initData()
    },
    pipLen: function (newValue, old) {
      newValue ? (this.pipLenShow = 1) : (this.pipLenShow = 0)
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