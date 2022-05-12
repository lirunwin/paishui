<template>
  <div id="weeklyStatistics" class="weeklyStatistics">
    <div class="menus">
      <span class="select_name">分组</span>
      <div class="select_option dept_select">
        <el-select v-model="dept_select.value" size="small" placeholder="请选择" clearable>
          <el-option
            v-for="item in dept_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">人员</span>
      <div class="select_option user_select">
        <el-select v-model="user_select.value" multiple size="small" placeholder="请选择" clearable>
          <el-option
            v-for="item in user_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="myRadio" style="position: relative;left: 550px;top: 6px;">
        <el-radio-group v-model="dateTypeChoose">
          <el-radio :label="1" size="small" style="position: relative;right: 500px;">按日查看</el-radio>
          <el-radio :label="2" size="small" style="position: relative;right: 500px;">按周查看</el-radio>
          <el-radio :label="3" size="small" style="position: relative;right: 500px;">按月查看</el-radio>
          <el-radio :label="4" size="small" style="position: relative;right: 500px;">按年查看</el-radio>
        </el-radio-group>
      </div>
      <div v-show="dateTypeChoose == 1" class="date" style="position:absolute;left: 520px;top: 20px;">
        <span class="xjDate" style="position: relative;left: 475px;top: -20px;font-size: 14px;">日期</span>
        <div class="date_select" style="display: inline-block;width:240px;position: relative;left: 480px;top: -20px;">
          <el-date-picker
            v-model="date_select.value"
            size="small"
            align="right"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
          />
        </div>
      </div>
      <div v-show="dateTypeChoose == 2" class="week" style="position:absolute;left: 520px;top: 20px;">
        <span class="xjDate" style="position: relative;left: 475px;top: -20px;font-size: 14px;">周</span>
        <div class="date_select" style="display: inline-block;width:240px;position: relative;left: 480px;top: -20px;">
          <el-date-picker
            v-model="date_select.value"
            size="small"
            align="right"
            type="week"
            clearable
            placeholder="选择周"
          />
        </div>
      </div>
      <div v-show="dateTypeChoose == 3" class="month" style="position:absolute;left: 520px;top: 20px;">
        <span class="xjDate" style="position: relative;left: 475px;top: -20px;font-size: 14px;">月份</span>
        <div class="date_select" style="display: inline-block;width:240px;position: relative;left: 480px;top: -20px;">
          <el-date-picker
            v-model="date_select.value"
            size="small"
            align="right"
            type="month"
            clearable
            placeholder="请选择月份"
          />
        </div>
      </div>
      <div v-show="dateTypeChoose == 4" class="year" style="position:absolute;left: 520px;top: 20px;">
        <span class="xjDate" style="position: relative;left: 475px;top: -20px;font-size: 14px;">年份</span>
        <div class="date_select" style="display: inline-block;width:240px;position: relative;left: 480px;top: -20px;">
          <el-date-picker
            v-model="date_select.value"
            size="small"
            align="right"
            type="year"
            clearable
            placeholder="请选择年份"
          />
        </div>
      </div>
      <el-button size="small" type="primary" style="position:relative;left: 915px;top: -18px;">查询</el-button>
      <el-button size="small" type="primary" style="position:relative;left: 915px;top: -18px;">导出</el-button>
    </div>
    <div class="statistics">
      <h2 class="weeklyStaticsName">巡查情况统计（2020/12/1-2020/12/14）</h2>
      <el-table
        :data="tableData"
        :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}"
        :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}"
        border
        show-summary
        stripe
        style="width: 100%;"
        :summary-method="getSummaries"
      >
        <el-table-column prop="orderNo" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="department"
          label="分组名称"
          align="center"
        />
        <el-table-column
          prop="staffName"
          label="人员姓名"
          align="center"
        />
        <el-table-column
          prop="xjDuration"
          :label="'巡检时长\n(h)'"
          align="center"
        />
        <el-table-column
          prop="xjMileage"
          :label="'巡检里程\n(m)'"
          align="center"
        />
        <el-table-column
          prop="validDuration"
          :label="'有效时长\n(h)'"
          align="center"
        />
        <el-table-column
          prop="validMileage"
          :label="'有效里程\n(m)'"
          align="center"
        />
        <el-table-column
          prop="reportTrouble"
          :label="'上传隐患\n(个)'"
          align="center"
        />
        <el-table-column
          prop="troubleCheck"
          :label="'隐患巡查\n(个)'"
          align="center"
        />
        <el-table-column
          prop="xjPoint"
          :label="'巡检点\n(个)'"
          align="center"
        />
        <el-table-column
          prop="xjLine"
          :label="'巡检线\n(m)'"
          align="center"
        />
        <el-table-column
          prop="workSiteCheck"
          :label="'工地巡查\n(个)'"
          align="center"
        />
        <el-table-column
          prop="pipeLineCheck"
          :label="'管线巡查\n(m)'"
          align="center"
        />
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
export default {
  name: 'WeeklyStatistics',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      dateTypeChoose: 1,
      	// 部门筛选信息
      dept_select: {
        options: [
          { value: 1, label: '巡检组' },
          { value: 2, label: '抢修组' },
          { value: 3, label: '维护组' }
        ],
        value: 1
      },
      // 人员筛选信息
      user_select: {
        options: [
          { value: 'ALL_SELECT', label: '全部' },
          { value: '1', label: '韩雨辰' },
          { value: '2', label: '朱循义' },
          { value: '3', label: '魏先义' },
          { value: '4', label: '侯俊杰' }
        ],
        value: '1'
      },
      // 日期筛选信息
      date_select: {
        value: ''
      },
      tableData: [{
        staffName: '李英莲',
        department: '巡检组',
        xjDuration: 0,
        xjMileage: 0,
        validDuration: 0,
        validMileage: 0,
        validAverageSpeed: 0,
        reportTrouble: 0,
        troubleCheck: '7',
        xjPoint: '4',
        xjLine: '1568',
        workSiteCheck: '5',
        pipeLineCheck: '1234',
        finshRatioPoint: 0,
        finshRatioLine: 0
	  }, {
        staffName: '汪苏',
        department: '维护组',
        xjDuration: 0,
        xjMileage: 0,
        validDuration: 0,
        validMileage: 0,
        validAverageSpeed: 0,
        reportTrouble: 0,
        troubleCheck: '7',
        xjPoint: '4',
        xjLine: '1568',
        workSiteCheck: '5',
        pipeLineCheck: '1234',
        finshRatioPoint: 0,
        finshRatioLine: 0
	  }, {
        staffName: '魏先义',
        department: '巡检组',
        xjDuration: 0,
        xjMileage: 0,
        validDuration: 0,
        validMileage: 0,
        validAverageSpeed: 0,
        reportTrouble: 0,
        troubleCheck: '7',
        xjPoint: '4',
        xjLine: '1568',
        workSiteCheck: '5',
        pipeLineCheck: '1234',
        finshRatioPoint: 0,
        finshRatioLine: 0
	  },
	  {
        staffName: '徐华',
        department: '维护组',
        xjDuration: 0,
        xjMileage: 0,
        validDuration: 0,
        validMileage: 0,
        validAverageSpeed: 0,
        reportTrouble: 0,
        troubleCheck: '7',
        xjPoint: '4',
        xjLine: '1568',
        workSiteCheck: '5',
        pipeLineCheck: '1234',
        finshRatioPoint: 0,
        finshRatioLine: 0
      }]
    }
  },
  watch: {

  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
		  sums[index] = '合计'
		  return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
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
    }
  }
}
</script>

<style lang='scss' scoped>
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
  .statistics{
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
</style>
<style>
.el-table th>.cell{
	white-space: pre-line;
}
</style>
