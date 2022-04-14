<template>
  <div class="engineering-manage">
    <!-- 管道缺陷区域统计 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">检测日期：</div>
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
          ~
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
        </div>
        <div class="serch-engineering">
          <div class="title">起始井号：</div>
          <el-select v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">终止井号：</div>
          <el-select v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </div>
        <div class="serch-engineering">
          <div class="title">缺陷等级：</div>
          <el-select v-model="form.name" placeholder="选择缺陷等级">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </div>
        <div class="serch-engineering">
          <el-button class="serch-btn" type="primary"> 范围 </el-button>
          <el-button class="serch-btn" type="primary"> 清除 </el-button>
          <el-button class="serch-btn" type="primary"> 查询 </el-button>
          <el-button class="serch-btn" type="primary"> 导出 </el-button>
          <div class="right-btn"></div>
        </div>
      </div>
      <div class="content">
        <el-radio v-model="radio" label="1">饼状图</el-radio>
        <el-radio v-model="radio" label="2">柱状图</el-radio>
        <el-checkbox label="缺陷类型"></el-checkbox>
        <el-checkbox label="类型名称"></el-checkbox>
        <el-checkbox label="缺陷等级"></el-checkbox>
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
  data() {
    return {
      checkList: [], // 多选被选中列表
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
      }
    }
  },
  mounted() {
    this.initData()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    document.getElementById('mainB').removeAttribute('_echarts_instance_')
  },
  methods: {
    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mainB'))
      // 绘制图表
      // (饼状图)
      if (this.radio == '1') {
        myChart.setOption(
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              data: [
                'Direct',
                'Marketing',
                'Search Engine',
                'Email',
                'Union Ads',
                'Video Ads',
                'Baidu',
                'Google',
                'Bing',
                'Others'
              ]
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
                data: [{ value: 1548 }, { value: 775 }, { value: 679 }]
              },
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '55%'],
                // labelLine: {
                //   length: 30
                // },
                // label: {
                //   formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
                //   backgroundColor: '#F6F8FC',
                //   borderColor: '#8C8D8E',
                //   borderWidth: 1,
                //   borderRadius: 4,
                //   rich: {
                //     b: {
                //       color: '#4C5058',
                //       fontSize: 14,
                //       fontWeight: 'bold',
                //       lineHeight: 33
                //     },
                //     per: {
                //       color: '#fff',
                //       backgroundColor: '#4C5058',
                //       padding: [3, 4],
                //       borderRadius: 4
                //     }
                //   }
                // },
                data: [{ value: 1048 }, { value: 335 }, { value: 310 }, { value: 251 }, { value: 234 }, { value: 147 }]
              },
              {
                name: 'Access From',
                type: 'pie',
                radius: ['60%', '70%'],
                labelLine: {
                  length: 30
                },
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
                      padding: [3, 4],
                      borderRadius: 4
                    }
                  }
                },
                data: [
                  { value: 1048 },
                  { value: 335},
                ]
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
  watch: {
    radio: function (newValue, old) {
      if (old != newValue) {
        this.initData()
      }
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
  padding: 10px !important;
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
      /deep/ .el-checkbox {
        margin-right: 0px !important;
        .el-checkbox__label {
          padding-left: 6px;
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