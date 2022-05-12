<template>
  <div id="planMonthlyReport" class="planMonthlyReport">
    <div class="menus">
      <span class="title2">部门：</span>
      <el-select v-model="chooseGroup" :disabled="hasGroup" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择部门"  @change="Bmchange()">
        <el-option v-for="item of searchGroupArray" :key="item.id" :index="item.index" :value="item.id" :label="item.name" />
      </el-select>
      <span class="title2">人员：</span>
      <el-select v-model="chooseWorker" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable>
        <el-option v-for="item in searchWorkers" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">巡查月份：</span> 
      <el-date-picker v-model="startTime"  size="small" type="month" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM"/> ~
      <el-date-picker v-model="endTime"  size="small" type="month" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM"/>      
      <!-- <el-date-picker v-model="dataTime" type="monthrange" size="small" style="width:300px"
          range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间" value-format="yyyy-MM" align="right" clearable/> -->
      <el-button size="small" type="primary" @click="queryMonthlyReportList">查询</el-button>
      <export-btn table-id="planMonthlyReportTable" :file="dataList.title" />
    </div>
    <div class="statistics" style="height:calc(100% - 40px)">
      <report-table :data-list="dataList" />
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import reportTable from '@/views/zhpt/xjreportforms/planMonthlyReport/reportTable'
import { queryMonthlyReport } from '@/api/xjApi'
import TableItem from '@/components/Table'
import ExportBtn from '@/views/zhpt/wxreportforms/components/ExportBtn'
import { getGroupUserMap } from '@/api/base'
import { getDepartment, getDeptUserList } from '@/api/work'
export default {
  name: 'PlanMonthlyReport',
  components: {
    tfLegend,
    reportTable,
    TableItem, ExportBtn
  },
  props: ['data'],
  data() {
    return {
      startTime:'',
      endTime:'',
         //时间只能选择一年内的
      startOptions: {
        //开始时间控制选择
        disabledDate: time => {
          if (this.endTime) {
            let current=new Date(this.endTime);
            let year=current.getFullYear()-1;
            let month=(current.getMonth()+1);
            if(month==12){
              year+=1;
              month=1
            }else{
              month+=1
            };
            return time.getTime() >= new Date(this.endTime)|| time.getTime() < new Date(year+"-"+(month<10?("0"+month):month));
          }
        }
      },
      endOptions: {
        //结束时间控制选择
        disabledDate: time => {
          if (this.startTime) {
            let current=new Date(this.startTime);
            let year=current.getFullYear();
            let month=(current.getMonth()+1);
            if(month==1){
              year=year;
              month=12;
            }else{
              year+=1;
              month=month-1;
            };
            return (
              new Date(this.startTime) - 1000 * 60 * 60 * 24 > time.getTime()||time.getTime()>new Date(year+"-"+(month<10?("0"+month):month))
            );
          }
        }
      },
      // startOptions:{
      //     disabledDate:time=> {
      //     if(this.endTime){
      //         return time.getTime() >=new Date(this.endTime);
      //     }
      //     },
      // },
      // endOptions:{
      //     disabledDate:time=> {
      //     if(this.startTime){
      //         return  new Date(this.startTime)-1000*60*60*24>time.getTime();
      //     }
      //     },
      // },
      dataList:{
        title:"2021.6.11月报",
        tableId:"planMonthlyReportTable",
        data:[]
      },
      searchGroupUserVoList: [],
      searchGroupArray: [], // 巡检组列表
      searchWorkers: [], // 人员列表
      chooseGroup: '', // 巡检组
      chooseWorker: '', // 巡检人
      deptId: '',
      dataTime: '', // 查询时间
      hasGroup: false// 是否在巡检组内
    }
  },
  watch: {
  },
  mounted:function(){
    let data=this.getTimeSplit();
    this.startTime=data.now;
    this.endTime=data.next
    // this.dataTime=[data.now,data.next];
    this.dataList.title="巡检月报("+this.startTime+"~"+this.endTime+")";
    this.getGroupUserMap();
  },
  methods: {
    // 获取巡查月报信息
    queryMonthlyReportList() {
      if(!this.startTime||!this.endTime){
        this.$message({type: "info", message: "请选择时间段" });
        return
      }
      let nextDay=new Date(this.endTime);
      // let endDate="";
      // if(nextDay.getMonth()+2>12){
      //   endDate=(nextDay.getFullYear()+1)+"-0"+(nextDay.getMonth()+2-12)+"-01"+" 00:00:00";
      // }else{
      //   endDate=nextDay.getFullYear()+"-"+(nextDay.getMonth()+2)+"-01"+" 00:00:00";
      // }
      let data={
        // groupId:this.chooseGroup,
        deptId:this.chooseGroup,
        userId:this.chooseWorker,
        startDate:this.startTime+"-01 00:00:00",
        endDate:this.getNextTime(this.endTime)
      }

      this.dataList.data = []
      this.dataList.title = '暂无数据'
      queryMonthlyReport(data).then(res => {
        if (res.code == 1) {
          this.dataList.data = res.result
          this.dataList.title = '巡检月报(' + data.startDate.split(' ')[0] + '~' + data.endDate.split(' ')[0] + ')'
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
      const nowYear = nowDate.getFullYear()
      const nowMonth = nowDate.getMonth() > 9 ? (nowDate.getMonth() + 1) : ('0' + (nowDate.getMonth() + 1))
      const nextMonth = nowDate.getMonth() > 9 ? (nowDate.getMonth()) : ('0' + (nowDate.getMonth()))
      const now = nowYear + '-' + nowMonth
      const next = nowYear + '-' + nextMonth
      return {
        now: next,
        next: next
      }
    },
    // 改变巡检组的情况
    changeGroup() {
      const index = this.searchGroupUserVoList.findIndex(item => { return item.id == this.chooseGroup })
      const data = this.searchGroupUserVoList[index].data
      this.searchWorkers = data
      this.chooseWorker = ''
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
      //   this.queryMonthlyReportList()
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.planMonthlyReport {
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
