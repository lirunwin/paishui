<template>
  <div id="planDayilyReport" class="planDayilyReport">
    <div class="menus">
      <span class="title2">部门：</span>
      <el-select
        v-model="chooseGroup"
        :disabled="hasGroup"
        style="display: inline-block; margin-left: 5px; width:150px;"
        size="small"
        placeholder="请选择部门"
        @change="Bmchange()"
      >
        <el-option
          v-for="item of searchGroupArray"
          :key="item.id"
          :index="item.index"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <span class="title2">人员：</span>
      <el-select
        v-model="chooseWorker"
        style="display: inline-block; margin-left: 5px; width:150px;"
        size="small"
        placeholder="请选择巡检人"
        clearable
      >
        <el-option v-for="item in searchWorkers" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">巡查日期：</span>
      <!-- <el-date-picker v-model="dataTime" type="daterange" size="small" style="width:300px"
          range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" align="right" clearable/> -->
      <el-date-picker
        v-model="startTime"
        size="small"
        type="date"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      ~
      <el-date-picker
        v-model="endTime"
        size="small"
        type="date"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button size="small" type="primary" @click="getDailyReportData">查询</el-button>
      <export-btn table-id="planDayilyReportTable" :file="dataList.title" />
    </div>
    <div class="statistics" style="height:calc(100% - 40px)">
      <report-table :data-list="dataList" />
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import reportTable from '@/views/zhpt/xjreportforms/planDayilyReport/reportTable'
import { queryDailyReport } from '@/api/xjApi'
import TableItem from '@/components/Table'
import ExportBtn from '@/views/zhpt/wxreportforms/components/ExportBtn'
import { getGroupUserMap } from '@/api/base'
import { getDepartment, getDeptUserList } from '@/api/work'
export default {
  name: 'PlanDayilyReport',
  components: {
    tfLegend,
    reportTable,
    TableItem,
    ExportBtn
  },
  props: ['data'],
  data() {
    return {
      startTime: '',
      endTime: '',
      startOptions: {
        disabledDate: (time) => {
          if (this.endTime) {
            return time.getTime() >= new Date(this.endTime)
          }
        }
      },
      endOptions: {
        disabledDate: (time) => {
          if (this.startTime) {
            return new Date(this.startTime) - 1000 * 60 * 60 * 24 > time.getTime()
          }
        }
      },
      dataList: {
        title: '2021.6.11日报',
        tableId: 'planDayilyReportTable',
        data: []
      },
      searchGroupUserVoList: [],
      searchGroupArray: [], // 巡检组列表
      searchWorkers: [], // 人员列表
      chooseGroup: '', // 巡检组
      chooseWorker: '', // 巡检人
      dataTime: '', // 查询时间
      deptId: '',
      hasGroup: false // 是否在巡检组内
    }
  },
  watch: {},
  mounted: function() {
    let data = this.getTimeSplit()
    this.startTime = data.now
    this.endTime = data.next
    // this.dataTime=[data.now,data.next];
    this.dataList.title = '巡检日报(' + data.now + '~' + data.next + ')'
    this.getGroupUserMap()
  },
  methods: {
    // 获取巡查日报信息
    getDailyReportData() {
      if (!this.startTime || !this.endTime) {
        this.$message({ type: 'info', message: '请选择时间段' })
        return
      }
      let data = {
        userId: this.chooseWorker,
        startDate: this.startTime + ' 00:00:00',
        deptId: this.chooseGroup,
        endDate: this.endTime + ' 23:59:59'
      }
      this.dataList.data = []
      this.dataList.title = '暂无数据'
      queryDailyReport(data).then((res) => {
        if (res.code == 1) {
          this.dataList.data = res.result
          this.dataList.title = '巡检日报(' + this.startTime + '~' + this.endTime + ')'
        }
        console.log(res)
      })
    },
    // 获取当前时间
    getTimeSplit() {
      const nowDate = new Date()
      const nextDate = new Date(Date.now() - 8.64e7)
      const nowYear = nowDate.getFullYear()
      const nextYear = nextDate.getFullYear()
      const nowMonth = nowDate.getMonth() > 9 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1)
      const nextMonth = nextDate.getMonth() > 9 ? nextDate.getMonth() + 1 : '0' + (nextDate.getMonth() + 1)
      const nowDay = nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate()
      const nextDay = nextDate.getDate() > 9 ? nextDate.getDate() : '0' + nextDate.getDate()
      const now = nowYear + '-' + nowMonth + '-' + nowDay
      const next = nextYear + '-' + nextMonth + '-' + nextDay
      return {
        now: next,
        next: next
      }
    },
    //获取人员
    Bmchange() {
      getDeptUserList({ deptId: this.chooseGroup }).then((res) => {
        if (res.code === 1) {
          this.chooseWorker = ''
          this.searchWorkers = res.result
          this.getDailyReportData()
        }
      })
    },
    // 获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容
    getGroupUserMap() {
      this.chooseGroup = parseInt(this.$store.state.user.departmentId)
      getDepartment().then((res) => {
        if (res.code === 1) {
          this.searchGroupArray = res.result
          this.Bmchange()
        }
      })
      // getGroupUserMap().then(res => {
      //   const userId = this.$store.state.user.userId
      //   const groupUserMap = res.result.groupUserVoList
      //   const addUser = []
      //   res.result.groupUserDeptVoList.forEach(item => {
      //     addUser.push({ id: item.userId, name: item.userName })
      //     if (this.deptId == '') {
      //       this.deptId = item.deptId
      //     }
      //   })
      //   res.result.groupUserVoList.forEach(item => {
      //     const index = this.searchGroupUserVoList.findIndex(item2 => { return item2.id == item.groupId })
      //     if (userId == item.userId) {
      //       this.hasGroup = true
      //       this.chooseGroup = item.groupId
      //     }
      //     if (index == -1) {
      //       this.searchGroupUserVoList.push({ index: this.searchGroupUserVoList.length + 0, id: item.groupId, name: item.groupName, data: [{ id: '', name: '全部' }, { id: item.userId, name: item.userIdName }] })
      //     } else {
      //       this.searchGroupUserVoList[index].data.push({ id: item.userId, name: item.userIdName })
      //     }
      //     if (item.userId && item.userIdName) {
      //       addUser.push({ id: item.userId, name: item.userIdName })
      //     }
      //   })
      //   addUser.unshift({ id: '', name: '全部' })
      //   this.searchGroupUserVoList.unshift({ id: '', name: '全部', index: this.searchGroupArray.length + 0, data: addUser })
      //   if (!this.hasGroup) {
      //     this.chooseGroup = ''
      //     this.searchWorkers = addUser
      //   } else {
      //     const sIndex = this.searchGroupUserVoList.findIndex(item => { return item.id == this.chooseGroup })
      //     this.searchWorkers = this.searchGroupUserVoList[sIndex].data
      //   }
      //   this.searchGroupArray = JSON.parse(JSON.stringify(this.searchGroupUserVoList))
      //   this.getDailyReportData()
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.planDayilyReport {
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
      // .user_select {
      //   position: absolute;
      //   left: 280px;
      //   z-index: 2;
      // }
    }
  }
  .statistics {
    position: relative;
    width: 100%;
    top: 35px;
    height: 500px;
    background-size: 100% 100%;
  }
}
</style>
