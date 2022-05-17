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
                      v-model="searchValue.testTime.startDate"
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
                      v-model="searchValue.testTime.finishDate"
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
              <el-select v-model="form.name" placeholder="--整改建议--">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
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
          <div class="content">
            <div style="padding-left: 12px">
              <el-radio v-model="radio" label="1">饼状图</el-radio>
              <el-radio v-model="radio" label="2">柱状图</el-radio>
              <el-checkbox label="管道数量"></el-checkbox>
              <el-checkbox label="管道长度"></el-checkbox>
            </div>
            <h2 style="text-align: center">管道评估统计图</h2>
            <div id="mainB" style="height: 250px"></div>
            <!-- 表格 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              height="250"
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <template slot="empty">
                <img
                  style="width: 100px; height: 100px; -webkit-user-drag: none"
                  src="@/assets/images/nullData.png"
                  alt="暂无数据"
                  srcset=""
                />
                <p style="padding: 0; margin: 0;padding-bottom: 20px;">暂无数据</p>
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

export default {
  props: ['data'],
  components: { simpleMap },
  data() {
    return {
      tableData: [], // 表格数据
      // 表格参数
      tableContent: [
        { label: '整改建议', name: 'wordInfoName' },
        { label: '数量(条)', name: 'jcnum' },
        { label: '长度(米)', name: 'jclength' }
      ],
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
        testTime: {
          startDate: '',
          finishDate: ''
        } // 检测日期
      }, // 搜索关键字的值
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: ''
    }
  },
  mounted() {
    this.initData()
    this.data.that.showLegend('pipelineEvaluate', true)
  },
  destroyed() {
    this.data.that.showLegend('pipelineEvaluate', false)
    this.data.that.clearMap()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainB').removeAttribute('_echarts_instance_')
  },
  methods: {
    // 绘制
    drawFeature() {
      this.$refs.myMap.draw((fea) => {
        this.getDataFromExtent({}, fea).then((res) => {
          console.log('绘制,过滤后', res)
        })
      })
    },
    mapMoveEvent(extent) {
      this.getDataFromExtent({}, extent).then((res) => {
        console.log('地图变化,过滤后', res)
      })
    },
    async getDataFromExtent(params, extent) {
      let data = await this.getPipeData(params)
      if (data.code === 1) {
        // 地图范围过滤数据
        return this.$refs.myMap.getDataInMap(data.result, extent)
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
      let myChart = echarts.init(document.getElementById('mainB'))
      // 绘制图表
      if (this.radio == '1') {
        myChart.setOption(
          {
            title: {
              // text: "某站点用户访问来源", //主标题
              // subtext: "纯属虚构", //副标题
              x: 'center' //x轴方向对齐方式
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'horizontal',
              // top: '20',
              // right: '20',
              data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                  { value: 335, name: '直接访问' },
                  { value: 310, name: '邮件营销' },
                  { value: 234, name: '联盟广告' },
                  { value: 135, name: '视频广告' },
                  { value: 1548, name: '搜索引擎' }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          },
          true
        )
      } else if (this.radio == '2') {
        myChart.setOption(
          {
            legend: {},
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '2011',
                type: 'bar',
                data: [1803, 2389, 2934, 1470, 1374, 6330]
              },
              {
                name: '2012',
                type: 'bar',
                data: [1325, 2338, 3000, 1254, 3141, 6807]
              }
            ]
          },
          true
        )
      }
    }
  },
  computed: {
    mapExtent() {
      return this.$store.state.gis.mapExtent
    }
  },
  watch: {
    radio: function (newValue, old) {
      if (old != newValue) {
        this.initData()
      }
    },
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