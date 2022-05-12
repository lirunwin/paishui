<template>
  <div id="workLogReport" class="workLogReport">
    <div class="menus">
      <span class="title2">部门：</span>
      <el-select v-model="chooseGroup" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择部门"  @change="Bmchange()">
        <el-option v-for="item of searchGroupArray" :key="item.id" :index="item.index" :value="item.id" :label="item.name" />
      </el-select>
      <span class="title2">人员：</span>
      <el-select v-model="chooseWorker" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable>
        <el-option v-for="item in searchWorkers" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">巡查日期：</span>
      <el-date-picker v-model="startTime"  size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd"/> ~
      <el-date-picker v-model="endTime"  size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd"/>      
      <el-button size="small" type="primary" @click="getDailyReportData">查询</el-button>
      <export-btn table-id="workLogReportTable" />
    </div>
    <div class="statistics" style="height:calc(100% - 50px)">
      <report-table :data-list="dataList" />
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import reportTable from '@/views/zhpt/xjreportforms/workLogReport/reportTable'
import { queryWorkLogReport } from '@/api/xjApi'
import TableItem from '@/components/Table'
import ExportBtn from '@/views/zhpt/wxreportforms/components/ExportBtn'
import { getGroupUserMap } from '@/api/base'
import { getDepartment, getDeptUserList } from '@/api/work'
export default {
  name: 'WorkLogReport',
  components: {
    tfLegend,
    reportTable,
    TableItem, ExportBtn
  },
  props: ['data'],
  data() {
    return {
      dataList: {
        title: '2021.6.11日报',
        tableId: 'workLogReportTable',
        data: [{
          workTime: '5.22',
          staffName: '李英莲',
          xjMileage: 0,
          validMileage: 0,
          discoveryDangerAmount: 0,
          discoverySite: 0,
          taskNumber: 0,
          xj: '无',
          wx: '无'
        }]
      },
      startTime:'',
      endTime:'',
      startOptions:{
          disabledDate:time=> {
          if(this.endTime){
              return time.getTime() >=new Date(this.endTime);
          }
          },
      },
      endOptions:{
          disabledDate:time=> {
          if(this.startTime){
              return  new Date(this.startTime)-1000*60*60*24>time.getTime();
          }
          },
      },
      searchGroupUserVoList: [],
      searchGroupArray: [], // 巡检组列表
      searchWorkers: [], // 人员列表
      chooseGroup: '', // 巡检组
      deptId: '',
      chooseWorker: '', // 巡检人
      hasGroup: false, // 是否在巡检组内
      pickerOptions: { disabledDate(time) {} }, // 时间选择控制模式
      dateType: 'daterange'// 选择时间的模式
    }
  },
  watch: { },
  mounted: function() {
    const data = this.getTimeSplit();
    [this.startTime,this.endTime]= [data.now, data.next]
    this.dataList.title = '考勤记录(' + data.now + '~' + data.next + ')'
    this.getGroupUserMap()
  },
  methods: {
    // 获取巡查日报信息
    getDailyReportData() {
      if (!this.startTime || !this.endTime) {
        this.$message({ type: 'info', message: '请选择时间段' })
        return
      }
      // const nextDate = new Date(this.endTime + ' 24:00:00');
      // const endDate = nextDate.getFullYear() + '-' + ((nextDate.getMonth() + 1)>9?(nextDate.getMonth() + 1):("0"+(nextDate.getMonth() + 1))) + '-' + (nextDate.getDate() > 9 ? nextDate.getDate() : '0' + nextDate.getDate()) + ' 00:00:00'
      const data = {
        // groupId: this.chooseGroup,
        userId: this.chooseWorker,
        startDate: this.startTime+ ' 00:00:00',
        deptId: this.chooseGroup,
        endDate: this.endTime+" 23:59:59"
      }
      this.dataList.data = []
      this.dataList.title = '暂无数据'
      queryWorkLogReport(data).then(res => {
        if (res.code == 1) {
          this.dataList.data = res.result
          this.dataList.title = '考勤记录表(' + this.startTime + '~' + this.endTime + ')'
        }
        console.log(res)
      })
    },
    // 获取当前时间
    getTimeSplit() {
      const nowDate = new Date()
      // let nextDate=new Date(Date.now() - 8.64e7);
      const nowYear = nowDate.getFullYear()
      // let nextYear=nextDate.getFullYear();
      const nowMonth = nowDate.getMonth() > 9 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1)
      // let nextMonth = nextDate.getMonth() > 9 ? (nextDate.getMonth()+1) : '0' + (nextDate.getMonth()+1);
      const nowDay = nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate()
      // let nextDay = nextDate.getDate() > 9 ? nextDate.getDate() : '0' + nextDate.getDate();
      const now = nowYear + '-' + nowMonth + '-' + '01'
      const next = nowYear + '-' + nowMonth + '-' + nowDay
      return {
        now: now,
        next: next
      }
    },
    //获取人员
    Bmchange() {
      getDeptUserList({ deptId: this.chooseGroup }).then(res => {
        if (res.code === 1) {
          this.chooseWorker='';
          this.searchWorkers = res.result
          this.queryMonthlyReportList()
        }
      })
    },
    // 获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容
    getGroupUserMap() {
      this.chooseGroup=parseInt(this.$store.state.user.departmentId);
        getDepartment().then(res => {
          if (res.code === 1) {
            this.searchGroupArray = res.result;
            this.Bmchange();
            this.getDailyReportData()
        }
      });
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

<style lang='scss' scoped>
.workLogReport {
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
.statistics{
  position: relative;
  width: 100%;
  top: 35px;
  height: 500px;
  background-size: 100% 100%;
}
}
</style>
