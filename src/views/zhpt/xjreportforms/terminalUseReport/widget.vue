<template>
  <div id="terminalUseReport" class="terminalUseReport">
    <div class="menus">
      <span class="select_name">部门</span>
      <div class="select_option dept_select">
        <el-select v-model="dept_select.value" size="small" placeholder="请选择">
          <el-option
            v-for="item in dept_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">巡检人</span>
      <div class="select_option user_select">
        <el-select v-model="users" multiple size="small" placeholder="请选择">
          <el-option
            v-for="item in user_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
        <el-button type="primary" size="small" @click="getTerminalUseReportData()">查询</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="statistics">
      <h3 class="terminalUseReportTableName">终端使用情况表（2020年10月21日~2020年10月21日）</h3>
      <el-table
        :data="tableData"
        border
        stripe
        :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}"
        :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}"
        style="width: 100%"
      >
        <el-table-column
          prop="time"
          align="center"
          label="时间"
        />
        <el-table-column
          prop="status"
          align="center"
          label="状态"
        />
        <el-table-column
          prop="communication"
          align="center"
          label="通讯"
        />
        <el-table-column
          prop="location"
          align="center"
          label="定位"
        />
        <el-table-column
          prop="energy"
          align="center"
          label="电量"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { queryTerminalUseReport } from '@/api/xjApi'
export default {
  name: 'TerminalUseReport',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
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
      tableData: [{
        time: '2020年10月21日 07:38:24',
        status: '上班',
        communication: '正常',
        location: '正常',
        energy: '100%'
      }, {
        time: '2020年10月21日 08:38:24',
        status: '正在工作中',
        communication: '正常',
        location: '正常',
        energy: '100%'
      }, {
        time: '2020年10月21日 09:38:24',
        status: '异常',
        communication: '正常',
        location: '异常',
        energy: '97%'
      }],
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.status === '异常' && columnIndex === 2) {
        return 'height: 50px, fontSize: 14px, color: red'
      } else {
        return 'height: 50px, fontSize: 20px, color: #333333'
      }
    },
    // 获取终端使用表单数据
    getTerminalUseReportData() {
      queryTerminalUseReport().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang='scss' scoped>

.terminalUseReport {
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
    width: 100%;
    top: 35px;
    height: 700px;
    background-size: 100% 100%;
  }
}
.terminalUseReportTableName {
	position: relative;
	text-align: center;
  margin-bottom: 15px;
	font-size: 14px;
}
</style>
