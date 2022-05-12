<template>
  <div id="troubleTypeAnalysis" class="troubleTypeAnalysis">
    <div class="menus">
      <span class="select_name">管网片区：</span>
      <div class="select_option dept_select">
        <el-select v-model="area_select.value" size="small" placeholder="请选择" clearable>
          <el-option
            v-for="item in area_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name xjDate">时间：</span>
      <div class="select_option date_select" style="width:240px;">
        <el-date-picker
          v-model="date_select.value"
          clearable
          size="small"
          align="right"
          type="daterange"
          placeholder="选择日期"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="buttons" style="position: relative;float: left;left: 120px;">
        <el-button type="primary" size="small" class="btn search">分析</el-button>
        <el-button type="primary" size="small" class="btn export">导出</el-button>
      </div>
    </div>
    <div id="pie" class="pie" />
    <div class="statistics">
      <el-table
        :data="tableData"
        border
        stripe
        show-summary
        :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}"
        :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}"
        style="width: 60%"
      >
        <el-table-column prop="indexNo" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="troubleType" align="center" label="隐患类型" />
        <el-table-column prop="amount" align="center" :label="'数量\n(个)'" />
        <el-table-column prop="ratio" align="center" :label="'比例\n(%)'" />
        <el-table-column prop="subtotal" align="center" :label="'小计\n(个)'" />
        <el-table-column prop="_ratio" align="center" :label="'比例\n(%)'" />
      </el-table>
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import Vue from 'vue'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
export default {
  name: 'TroubleTypeAnalysis',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      // 片区筛选信息
      area_select: {
        options: [
          { value: 1, label: 'A片区（三星片区）' },
          { value: 2, label: 'B片区（老城区）' },
          { value: 3, label: 'C片区（新城区）' },
          { value: 4, label: 'D片区（韩滩片区）' },
          { value: 5, label: 'E片区（云绣、杨柳、赵杨路西段、迎宾大道片区）' },
          { value: 6, label: 'F片区（清江片区）' },
          { value: 7, label: 'G片区（官仓片区）' }
        ],
        value: ''
      },
      // 日期筛选信息
      date_select: {
        value: ''
      },
      // 隐患分析报表信息
      tableData: [
        {
          troubleType: '占压',
          amount: '1',
          ratio: '25',
          subtotal: '1',
          _ratio: '25'
        },
        {
          troubleType: '渗水',
          amount: '1',
          ratio: '25',
          subtotal: '1',
          _ratio: '25'
        },
        {
          troubleType: '周边打围开挖',
          amount: '1',
          ratio: '25',
          subtotal: '1',
          _ratio: '25'
        },
        {
          troubleType: '其他管线穿越或并行',
          amount: '1',
          ratio: '25',
          subtotal: '1',
          _ratio: '25'
        }
      ]
    }
  },
  watch: {},
  mounted() {
    this.drawPie()
  },
  methods: {
    // 初始化数据
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('pie'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '隐患原因统计（2020/10/10-2020/10/15）',
          left: 'center',
				  textStyle: {
            // color: 'rgb(46, 199, 201)'
            color: 'black'
				  }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '隐患原因',
            type: 'pie', // 设置图表类型为饼状图
            radius: '60%', // 饼状图半径
            center: ['50%', '60%'],
            data: [// 饼状图数据
              { value: 25, name: '占压：25%' },
              { value: 25, name: '渗水：25%' },
              { value: 25, name: '周边打围开挖：25%' },
              { value: 25, name: '其他管线穿越或并行：25%' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.troubleTypeAnalysis {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 5px;
  .menus {
    position: absolute;
    z-index: 2;
    height: 40px;
    width: 100%;
    .select_name {
      position: relative;
      float: left;
      // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: black;
      margin-left: 10px;
      margin-top: 6px;
      .xjDate {
        left: 185px;
      }
    }
    .select_option {
      position: relative;
      float: left;
      left: 5px;
      // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: black;
      .user_select {
        position: absolute;
        left: 280px;
        z-index: 2;
      }
      .date_select {
        left: 190px;
      }
    }
  }
.el-table {
	position: absolute;
	margin-top: 10px;
	margin-bottom: 10px;
	border-color: rgba(222, 226, 230, 0.5);
}
.statistics{
  position: relative;
  left: 20%;
  width: 100%;
  top: 70px;
  height: 700px;
  background-size: 100% 100%;
}
.pie {
  top: 60px;
  width: 100%;
  height: 300px;
}
}
.troubleTypeAnalysisTableName {
	position: relative;
	text-align: center;
  margin-bottom: 15px;
	font-size: 14px;
}
</style>
