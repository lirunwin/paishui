<template>
  <div class="drainagePortStatistic">
    <simple-map @mapMoveEvent="mapMoveEvent" ref="myMap"></simple-map>
    <div class="statisticContainer">
      <div class="title">
        <div class="iconSymbol"></div>
        <div class="titleName">统计条件</div>
      </div>
      <div class="statisticTerms">
        <div class="terms">
          <label>项目名称：</label>
          <el-date-picker size="mini" v-model="value1" type="date" placeholder="年-月-日" class="date-css">
          </el-date-picker>
          ~
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>

          <label>整改建议：</label>
          <el-select v-model="region" placeholder="请选择" :disabled="isRegion" multiple clearable size="mini">
            <el-option label="xxx片区" value="0"></el-option>
          </el-select>
        </div>
      </div>
      <div class="title">
        <div class="iconSymbol"></div>
        <div class="titleName">统计结果</div>
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
      multipleSelection: [], // 被选中的表格数据
      radio: '1', // 单选框的值
      radioB: '', // 管道数量
      radioC: '', // 管道长度
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
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ],
        number: [
          { max: 20, message: '内容不能超过20个字符串', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '只能输入数字或英文',
            trigger: 'blur'
          }
        ],
        workUnit: [{ max: 255, message: '内容不能超过255个字符串', trigger: 'blur' }],
        projectIntroduction: [{ max: 1000, message: '内容不能超过1000个字符串', trigger: 'blur' }]
      },
      value1: ''
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
    // 表格选中事件
    handleSelectionChange(val) {
      // console.log('表格选中事件', val)
      this.multipleSelection = val
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
.drainagePortStatistic {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .statisticContainer {
    height: 100%;
    width: 58%;
    .title {
      height: 20px;
      width: 100%;
      font-size: 16px;
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
    .statisticTerms {
      width: 100%;
      display: flex;
      flex-flow: column;
      padding: 10px 20px;
      font-size: 14px;
      .terms {
        display: flex;
        align-items: center;
        padding: 10px;
      }
      .link-map {
        justify-content: space-between;
      }
    }
  }
}
</style>