<template>
  <div id="weeklyStatistics" class="weeklyStatistics">
    <div class="menus">
      <span class="select_name">部门</span>
      <div class="select_option dept_select">
        <el-select v-model="dept_select.value" size="small" placeholder="请选择">
          <el-option v-for="item in dept_select.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <span class="select_name">巡检人</span>
      <div class="select_option user_select">
        <el-select v-model="users" multiple size="small" placeholder="请选择">
          <el-option v-for="item in user_select.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <span class="select_name xjDate">巡检日期</span>
      <div class="select_option date_select" style="width:240px;">
        <el-date-picker
          v-model="date_select.value"
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
        <el-button type="primary" size="small" @click="getWeeklyStatisticsData()">查询</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="statistics">
      <h2 class="weeklyStaticsName">周报统计（2020年12月1日~2020年12月14日）</h2>
      <el-table
        :data="tableData"
        :header-cell-style="{ height: '50px', fontSize: '14px', color: '#333333' }"
        :cell-style="{ height: '30px', fontSize: '14px', color: '#333333' }"
        border
        show-summary
        stripe
        style="width: 100%;"
        :summary-method="getSummaries"
      >
        <el-table-column prop="orderNo" label="序号" align="center" />
        <el-table-column prop="staffName" label="员工姓名" align="center" />
        <el-table-column prop="department" label="部门" align="center" />
        <el-table-column prop="xjDuration" :label="'巡检时长\n(h)'" align="center" />
        <el-table-column prop="xjMileage" :label="'巡检里程\n(km)'" align="center" />
        <el-table-column prop="validDuration" :label="'有效巡检时长\n(h)'" align="center" />
        <el-table-column prop="validMileage" :label="'有效巡检里程\n(km)'" align="center" />
        <el-table-column prop="validAverageSpeed" :label="'有效平均时速\n(km/h)'" align="center" />
        <el-table-column prop="discoveryDangerAmount" :label="'发现隐患数\n(个)'" align="center" />
        <el-table-column prop="deviceCondition" :label="'设备巡检情况\n(个)'" align="center" />
        <el-table-column prop="xjPointCondition" :label="'巡检点情况\n(个)'" align="center" />
        <el-table-column prop="xjLineCondition" :label="'巡检线情况\n(km)'" align="center" />
        <el-table-column prop="finishRatio" label="完成比例" align="center">
          <el-table-column prop="finshRatioPoint" label="点" align="center" />
          <el-table-column prop="finshRatioLine" label="线" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { queryWeeklyStatistics } from '@/api/xjApi'
export default {
  name: 'WeeklyStatistics',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      // 部门筛选信息
      dept_select: {
        options: [{ value: 1, label: '巡检组' }, { value: 2, label: '抢修组' }, { value: 3, label: '维护组' }],
        value: 1
      },
      // 人员筛选信息
      user_select: {
        options: [
          { value: 'all', label: '全部' },
          { value: '1', label: '韩雨辰' },
          { value: '2', label: '朱循义' },
          { value: '3', label: '魏先义' },
          { value: '4', label: '侯俊杰' }
        ],
        value: '1'
      },
      users: [],
      // 日期筛选信息
      date_select: {
        value: ''
      },
      tableData: [
        {
          orderNo: '1',
          staffName: '李英莲',
          department: '巡检组',
          xjDuration: 0,
          xjMileage: 0,
          validDuration: 0,
          validMileage: 0,
          validAverageSpeed: 0,
          discoveryDangerAmount: 0,
          deviceCondition: '无',
          xjPointCondition: '无',
          xjLineCondition: '无',
          finshRatioPoint: 0,
          finshRatioLine: 0
        },
        {
          orderNo: '2',
          staffName: '汪苏',
          department: '维护组',
          xjDuration: 0,
          xjMileage: 0,
          validDuration: 0,
          validMileage: 0,
          validAverageSpeed: 0,
          discoveryDangerAmount: 0,
          deviceCondition: '无',
          xjPointCondition: '无',
          xjLineCondition: '无',
          finshRatioPoint: 0,
          finshRatioLine: 0
        },
        {
          orderNo: '3',
          staffName: '魏先义',
          department: '巡检组',
          xjDuration: 0,
          xjMileage: 0,
          validDuration: 0,
          validMileage: 0,
          validAverageSpeed: 0,
          discoveryDangerAmount: 0,
          deviceCondition: '无',
          xjPointCondition: '无',
          xjLineCondition: '无',
          finshRatioPoint: 0,
          finshRatioLine: 0
        },
        {
          orderNo: '4',
          staffName: '徐华',
          department: '维护组',
          xjDuration: 0,
          xjMileage: 0,
          validDuration: 0,
          validMileage: 0,
          validAverageSpeed: 0,
          discoveryDangerAmount: 0,
          deviceCondition: '无',
          xjPointCondition: '无',
          xjLineCondition: '无',
          finshRatioPoint: 0,
          finshRatioLine: 0
        }
      ],
      queryData: {} // 将要查询的对象
    }
  },
  watch: {
    users: function(val, oldval) {
      const newIndex = val.indexOf('all')
      const oldIndex = oldval.indexOf('all')
      if (newIndex != -1 && oldIndex == -1 && val.length > 1) {
        this.users = ['all']
      } else if (newIndex != -1 && oldIndex != -1 && val.length > 1) {
        this.users.splice(val.indexOf('all'), 1)
      }
    }
  },
  methods: {
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = '无'
        }
      })
      return sums
    },
    // 获取周报统计表单数据
    getWeeklyStatisticsData() {
      queryWeeklyStatistics().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weeklyStatistics {
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
      //   font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
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
      //   font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
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
}
.el-table {
  position: absolute;
  margin-top: 10px;
  margin-bottom: 10px;
  border-color: rgba(222, 226, 230, 0.5);
}
.statistics {
  position: relative;
  width: 100%;
  top: 25px;
  height: 400px;
  background-size: 100% 100%;
}
.weeklyStaticsName {
  position: relative;
  text-align: center;
  margin-bottom: 15px;
  font-size: 14px;
}
>>> .el-table th > .cell {
  white-space: pre-line;
}
</style>
