<template>
  <div class="engineering-manage">
    <!-- 管道评估统计 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">检测日期：</div>
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
          ~
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
        </div>
        <div class="serch-engineering">
          <div class="title">整改建议：</div>
          <el-select v-model="form.name" placeholder="--整改建议--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </div>
        <div class="serch-engineering">
          <el-button class="serch-btn" type="primary"> 绘制 </el-button>
          <el-button class="serch-btn" type="primary"> 清除 </el-button>
          <el-button class="serch-btn" type="primary"> 查询 </el-button>
          <el-button class="serch-btn" type="primary"> 导出 </el-button>
          <div class="right-btn"></div>
        </div>
      </div>
      <div class="content">
        <el-radio v-model="radio" label="1">饼状图</el-radio>
        <el-radio v-model="radio" label="2">柱状图</el-radio>
        <el-radio v-model="radioB" label="num">管道数量</el-radio>
        <el-radio v-model="radioC" label="length">管道长度</el-radio>
        <h2 style="text-align: center">管道评估统计图</h2>
        <div id="mainB" style="height: 250px"></div>
        <div style="border: 1px solid #ccc">
          <h3 class="title">管道缺陷分类统计表</h3>
          <ul class="table-content">
            <li>
              <div>缺陷类型</div>
              <div>缺陷名称</div>
              <div>缺陷数量</div>
            </li>
            <li>
              <div>模拟数据</div>
              <div>模拟数据</div>
              <div>模拟数据</div>
            </li>
            <li>
              <div>模拟数据</div>
              <div>模拟数据</div>
              <div>模拟数据</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 添加卡片 -->
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
export default {
  props: ["data"],
  data() {
    return {
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
      value1: ""
    }
  },
  mounted() {
    this.initData()
    this.data.that.showLegend("pipelineEvaluate", true)
  },
  destroyed () {
    this.data.that.showLegend("pipelineEvaluate", false)
    this.data.that.clearMap()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainB').removeAttribute('_echarts_instance_')
  },
  methods: {
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
    mapExtent () {
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
      handler (nv, ov) {
        console.log('视图改变')
        if (this.data.mapView.getView().getZoom() > 16) {
          this.data.that.queryForExtent(nv)
        } else { // 在地图界别较小时，移除管网
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
  margin: 0;
  box-sizing: border-box;
  position: relative;
  overflow-y: scroll;
  // 表格样式
  .table-box {
    width: 96%;
    height: 100%;
    margin: auto;
    .top-tool {
      display: flex;
      // justify-content: space-between;
      flex-direction: column;
      // flex-wrap: wrap;
      font-size: 14px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;

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
      height: 92%;
      width: 100%;
      // overflow-y: scroll;
      padding: 10px;
      box-sizing: border-box;
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

  // 选择框
  /deep/ .el-select {
    width: 130px;
  }
}
</style>