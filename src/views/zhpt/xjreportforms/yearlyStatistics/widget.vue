<template>
  <div id="yearlyStatistics" class="yearlyStatistics">
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
      <el-radio v-model="dateModel" label="1" style="margin-left: 40px">按日查看</el-radio>
      <el-radio v-model="dateModel" label="2">按周查看</el-radio>
      <el-radio v-model="dateModel" label="3">按月查看</el-radio>
      <el-radio v-model="dateModel" label="4">按年查看</el-radio>
      <span class="title2" style="margin-left:8px;">巡查日期：</span>
      <el-date-picker
        v-show="hasShow"
        v-model="startTime"
        size="small"
        :type="dateType"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      <span v-show="hasShow"> ~</span>
      <el-date-picker
        v-show="hasShow"
        v-model="endTime"
        size="small"
        :type="dateType"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-show="!hasShow"
        v-model="dataTime2"
        type="year"
        size="small"
        style="width:300px"
        placeholder="请选择份"
        value-format="yyyy"
        clearable
      />
      <el-button size="small" type="primary" @click="getDailyReportData">查询</el-button>
      <export-btn table-id="yearlyStatisticsTable" />
    </div>
    <div class="statistics">
      <report-table :data-list="dataList" />
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import reportTable from '@/views/zhpt/xjreportforms/yearlyStatistics/reportTable'
import { queryPersonnelXjStatistics } from '@/api/xjApi'
import TableItem from '@/components/Table'
import ExportBtn from '@/views/zhpt/wxreportforms/components/ExportBtn'
import { getGroupUserMap } from '@/api/base'
import { getDepartment, getDeptUserList } from '@/api/work'
export default {
  name: 'YearlyStatistics',
  components: {
    tfLegend,
    reportTable,
    TableItem,
    ExportBtn
  },
  props: ['data'],
  data() {
    return {
      dataList: {
        title: '2021.6.11统计',
        tableId: 'yearlyStatisticsTable',
        data: []
      },
      searchGroupUserVoList: [],
      searchGroupArray: [], // 巡检组列表
      searchWorkers: [], // 人员列表
      chooseGroup: '', // 巡检组
      chooseWorker: '', // 巡检人
      deptId: '',
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
      dataTime2: '',
      hasGroup: false, // 是否在巡检组内
      dateModel: '1', // 当前时间段的模式
      pickerOptions: { disabledDate(time) {} }, // 时间选择控制模式
      dateType: 'date', // 选择时间的模式
      hasShow: true
    }
  },
  watch: {
    dateModel: function() {
      this.hasShow = true
      this.dataTime2 = ''
      if (this.dateModel == '1') {
        this.dateType = 'date'
        this.startOptions.disabledDate = (time) => {
          if (this.endTime) {
            return time.getTime() >= new Date(this.endTime)
          }
        }
        this.endOptions.disabledDate = (time) => {
          if (this.startTime) {
            return new Date(this.startTime) - 1000 * 60 * 60 * 24 > time.getTime()
          }
        }
        const data = this.getTimeSplit()
        this.startTime = data.now
        this.endTime = data.next
      } else if (this.dateModel == '2') {
        this.dateType = 'date'
        // debugger
        const dayList = this.getTime()
        let monday = new Date(dayList.mondayTime)
        let sunday = new Date(dayList.sundayTime)
        const mondayTime = monday.getDay()
        const sundayTime = sunday.getDay()
        const splitTime = new Date(dayList.sundayTime)
        this.startOptions.disabledDate = (time) => {
          if (this.endTime) {
            return time.getTime() >= new Date(this.endTime) - 1000 * 60 * 60 * 24 || time.getDay() != mondayTime
          }
        }
        this.endOptions.disabledDate = (time) => {
          if (this.startTime) {
            return new Date(this.startTime) > time.getTime() || time.getDay() != sundayTime
          }
        }
        let day = this.getTime2()
        this.startTime = day.mondayTime
        this.endTime = day.sundayTime
      } else if (this.dateModel == '3') {
        this.dateType = 'month'
        this.startOptions.disabledDate = (time) => {
          if (this.endTime) {
            return time.getTime() >= new Date(this.endTime)
          }
        }
        this.endOptions.disabledDate = (time) => {
          if (this.startTime) {
            return new Date(this.startTime) - 1000 * 60 * 60 * 24 > time.getTime()
          }
        }
        const date = this.getTime3()
        this.startTime = date.fristMonthDay
        this.endTime = date.lastMonthDay
      } else if (this.dateModel == '4') {
        this.hasShow = false
        const date = new Date()
        const year = date.getFullYear()
        this.dataTime2 = year + ''
      }
    }
  },
  mounted: function() {
    const data = this.getTimeSplit()
    this.startTime = data.now
    this.endTime = data.next
    this.dataList.title = '巡检统计(' + data.now + '~' + data.next + ')'
    this.getGroupUserMap()
  },
  methods: {
    // 获取本周的周一和周末
    getTime() {
      var now = new Date()
      var nowTime = now.getTime()
      var day = now.getDay()
      var oneDayTime = 24 * 60 * 60 * 1000
      var MondayTime = nowTime - (day - 1) * oneDayTime // 显示周一
      var SundayTime = nowTime + (7 - day) * oneDayTime // 显示周日
      return {
        mondayTime: MondayTime,
        sundayTime: SundayTime
      }
    },
    // 获取本周的周一和周末
    getTime2() {
      var now = new Date()
      var nowTime = now.getTime()
      var day = now.getDay()
      var oneDayTime = 24 * 60 * 60 * 1000
      var MondayTime = nowTime - (day + 6) * oneDayTime // 显示周一
      var SundayTime = nowTime + (1 - day) * oneDayTime // 显示周日
      const Monday = new Date(MondayTime)
      const Sunday = new Date(SundayTime)
      return {
        mondayTime: Monday.getFullYear() + '-' + (Monday.getMonth() + 1) + '-' + Monday.getDate(),
        sundayTime: Sunday.getFullYear() + '-' + (Sunday.getMonth() + 1) + '-' + Sunday.getDate()
      }
    },
    // 获取前一月
    getTime3() {
      var now = new Date()
      const fristDay = new Date(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + '01' + ' 23:59:59')
      const fristTime = fristDay.getTime()
      var oneDayTime = 24 * 60 * 60 * 1000
      var lastMonthDay = new Date(fristTime - oneDayTime) // 显示周一
      var lastMonthDayStr =
        lastMonthDay.getFullYear() + '-' + (lastMonthDay.getMonth() + 1) + '-' + lastMonthDay.getDate() // 上个月最后一天
      const fristMonthDay = lastMonthDay.getFullYear() + '-' + (lastMonthDay.getMonth() + 1) + '-' + '01' // 上个月第一天
      return {
        lastMonthDay: lastMonthDayStr,
        fristMonthDay: fristMonthDay
      }
    },
    // 获取巡查统计信息
    getDailyReportData() {
      if (this.dateModel == '4') {
        if (!this.dataTime2 || this.dataTime2 == '') {
          this.$message({ type: 'info', message: '请选择时间段' })
          return
        }
      } else {
        if (!this.startTime || !this.endTime) {
          this.$message({ type: 'info', message: '请选择时间段' })
          return
        }
      }
      let data = null
      if (this.dateModel == 3) {
        // const nextDay = new Date(this.endTime)
        // const endDate = nextDay.getFullYear() + '-' + (nextDay.getMonth() + 2) + '-01' + ' 00:00:00'
        data = {
          // groupId: this.chooseGroup,
          userId: this.chooseWorker,
          startDate: this.startTime + ' 00:00:00',
          deptId: this.chooseGroup,
          endDate: this.getNextTime(this.endTime),
          titleDate: this.getNextTime(this.endTime)
        }
      } else if (this.dateModel == 2) {
        data = {
          // groupId: this.chooseGroup,
          userId: this.chooseWorker,
          startDate: this.startTime + ' 00:00:00',
          deptId: this.chooseGroup,
          endDate: this.endTime + ' 23:59:59',
          titleDate: this.endTime
        }
      } else if (this.dateModel == 1) {
        // const nextDate = new Date(this.endTime + ' 24:00:00')
        // const endDate = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + (nextDate.getDate() > 9 ? nextDate.getDate() : '0' + nextDate.getDate()) + ' 00:00:00'
        data = {
          // groupId: this.chooseGroup,
          userId: this.chooseWorker,
          startDate: this.startTime + ' 00:00:00',
          deptId: this.chooseGroup,
          endDate: this.endTime + ' 23:59:59',
          titleDate: this.endTime
        }
      } else if (this.dateModel == 4) {
        data = {
          // groupId: this.chooseGroup,
          userId: this.chooseWorker,
          deptId: this.chooseGroup,
          startDate: this.dataTime2 + '-01-01 00:00:00',
          endDate: parseInt(this.dataTime2) + '-12-31 23:59:59',
          titleDate: parseInt(this.dataTime2) + '-12-31 23:59:59'
        }
      }
      this.dataList.data = []
      this.dataList.title = '暂无数据'
      queryPersonnelXjStatistics(data).then((res) => {
        if (res.code == 1) {
          this.dataList.data = res.result
          this.dataList.title =
            '巡检情况统计(' + data.startDate.split(' ')[0] + '~' + data.titleDate.split(' ')[0] + ')'
        }
        console.log(res)
      })
    },
    // 获取下个月的全日期
    getNextTime(time) {
      const nextMonthString = time.split('-')[0] + '-' + (parseInt(time.split('-')[1]) + 1) + '-01'
      const date = new Date(new Date(nextMonthString) - 8.64e7)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day + ' 23:59:59'
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
          this.queryMonthlyReportList()
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
          this.getDailyReportData()
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
.yearlyStatistics {
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
    height: calc(100% - 50px);
    background-size: 100% 100%;
  }
}
</style>
