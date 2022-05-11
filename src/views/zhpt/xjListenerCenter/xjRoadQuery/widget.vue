<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
    <span class="title2" style="display:inline-block;width:50px;padding-left:8px;">部门：</span>
      <el-select v-model="group" @change="Bmchange" style="display: inline-block; width:130px;" size="small" placeholder="请选择">
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">人员：</span>
      <el-select v-model="worker" style="display: inline-block; margin-left: 5px; width:130px;" size="small" placeholder="请选择人员" clearable>
        <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id">                        
        </el-option>
      </el-select>
      <span class="title2" style="margin-left:8px;">起始时间：</span>
      <div style="display: inline-block; margin-left: 5px; width:320px;">
        <el-date-picker v-model="addStartTime" style="width: calc(100% - 130px);" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" size="small" :clearable="false"
          :picker-options="{ disabledDate: addSDisable}"/>
        <el-time-select placeholder="起始时间" style="width: 120px;float:right;" size="small" v-model="addStartHour"
          :picker-options="{ start: '00:00', step: '01:00', end: '23:00', maxTime: addStartTime == addStopTime ? addStopHour : '24:00' }" :clearable="false"/>
      </div>
      <span class="title2" style="margin-left:8px;">结束时间：</span>
      <div style="display: inline-block; margin-left: 5px; width:320px;">
        <el-date-picker v-model="addStopTime" style="width: calc(100% - 130px);" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束日期" size="small" :clearable="false"
          :picker-options="{ disabledDate: addEDisable}"/>
        <el-time-select placeholder="结束时间" style="width: 120px;float:right;" size="small" v-model="addStopHour"
          :picker-options="{ start: '00:00', step: '01:00', end: '23:00', minTime: addStartTime == addStopTime ? addStartHour : '-01:00' }" :clearable="false"/>
      </div>
      <el-button size="small" type="primary" @click="query">查询</el-button>
    </el-row>
    <div style="margin-top:6px; color: #909399; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-align: center;">
      <span style="display:inline-block;" class="titleS">总里程：{{ showDetail[0] }} km</span>
      <span style="display:inline-block;margin:0 5px;" class="titleS">|</span>
      <span style="display:inline-block;" class="titleS">总耗时：{{ showDetail[1] }} h</span>
      <span style="display:inline-block;margin:0 5px;" class="titleS">|</span>
      <span style="display:inline-block;" class="titleS">总平均速度：{{ showDetail[2] }} km/h</span>
    </div>
    <el-table class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" ref="table2" height="calc(100% - 110px)" stripe v-loading="loading">
      <el-table-column prop="uploadTime" label="上传时间" >
        <template slot-scope="scope">{{ scope.row.uploadTime || '-' }}</template>
      </el-table-column>
      <el-table-column prop="distance" label="间距" >
        <template slot-scope="scope">{{ (scope.row.distance || '0') + 'm' }}</template>
      </el-table-column>
      <el-table-column prop="speed" label="速度" >
        <template slot-scope="scope">{{ (scope.row.speed || '0') + 'km/h' }}</template>
      </el-table-column>
      <el-table-column prop="network" label="定位类型" show-overflow-tooltip >
        <template slot-scope="scope">{{ { 1: 'GPS', 2: 'Wifi', 3: '基站定位'}[scope.row.network] || '未知' }}</template>
      </el-table-column>
      <el-table-column prop="precision" label="精度" >
        <template slot-scope="scope">{{ (scope.row.precision || '0') + 'm' }}</template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px">
      <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10,20,30,50,100,1000]" :total="total"
      @current-change="query" @size-change="query" style=" width: 250px; display: inline-block;" />
      <!-- <span ref='pageLength' style="font-size: 13px;" class="el-pagination__total">0/0 页</span> -->
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import { getDepartment, getDeptUserList } from '@/api/work'
export default {
  name: 'wxCheck',
  components: {  },
  props: { data: Object },
  data() {
    return {
      times: [],
      worker: '',
      endTime: '',
      userList:[],
      startTime: '',
      workers: [],
      dataT1: [],
      total: 0,
      showDetail: [0, 0, 0],
      group: '',
      groups: [],
      groupIndex: {},
			addStartTime: '',
      addStartHour: '00:00',
			addStopTime: '',
      addStopHour: '23:00',
      loading: false,
    }
  },
  created(){
    this.group=parseInt(this.$store.state.user.departmentId);
    getDepartment().then(res => {
      if (res.code === 1) {
        this.groups = res.result;
        this.Bmchange();
      }
    });
    let currentDate=new Date();
    let Hours=currentDate.getHours();
    let endHours=Hours+1;
    this.addStopHour=endHours+":00";
    let startHours=endHours-12;
    if(startHours<0){
      let day=currentDate.getFullYear()+"-"+(currentDate.getMonth+1)+"-"+(currentDate.getDate()-1);
      let dayDate=new(day);
      dayS=day.getFullYear()+"-"+(day.getMonth+1)+"-"+day.getDate();
      this.addStartTime=dayS;
      this.addStartHour=(startHours+24)+":00"
    }else if(startHours==0){
      this.addStartHour='00:00'
    }else{
      if(startHours<10){
        this.addStartHour="0"+startHours+":00";
      }else{
        this.addStartHour=startHours+":00";
      }
    }
  },
  mounted() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
		var day = date.getDate()
    if(month < 10) month = '0' + month
		if(day < 10) day = '0' + day
    this.addStopTime = this.addStartTime = [year, month, day].join('-')
  },
  watch: {
    addStartTime(e){ if(e == this.addStopTime) this.hourChange(e) },
    addStopTime(e) { if(e == this.addStartTime) this.hourChange(e) },
  },
  methods: {
    addSDisable(e) { return this.dayDisable(e, (this.addStopTime || '9999-01-01'), true) },
    addEDisable(e) { return this.dayDisable(e, (this.addStartTime || '1997-01-01'), false) },
    dayDisable(e, date, type) {
      date = date.split('-')
      var d = ['getFullYear', 'getMonth', 'getDate'].map(de => e[de]())
      d[1] = (d[1] < 10 ? '0' : '') + (d[1] + 1)
      if(d[2] < 10) d[2] = '0' + d[2]
      return type ? ~~ date.join('') < ~~ d.join('') : ~~ date.join('') > ~~ d.join('')
    },
    Bmchange() {
      getDeptUserList({ deptId: this.group }).then(res => {
        if (res.code === 1) {
          this.worker='';
          this.userList = res.result
        }
      })
    },
    hourChange(e) {
      var [s, e] = ['addStartHour', 'addStopHour'].map(e => ~~ this[e].split(':')[0])
      if(s < e) return
      if(e == 23) e = 23, s = 22; else e = s + 1;
      [this.addStartHour, this.addStopHour] = [s, e].map(x => (x < 10 ? '0' : '') + x + ':00')
    },
    query() {
      var pages = this.$refs.pagination
      if(!this.worker) return this.$message.error('请选择人员')
      if(!this.addStartTime) return this.$message.error('请选择开始时间')
      if(!this.addStopTime) return this.$message.error('请选择结束时间')
      this.loading = true;
      request({ url: '/gps/gps/inspectionTrackQuery' +
        '?&startDate=' + (this.addStartTime || '') + ' ' + (this.addStartHour || '00') + ':00' +
        '&endDate=' + (this.addStopTime || '') + ' ' + (this.addStopHour || '00') + ':00' +
        '&userId=' + this.worker +
        '&deptId=' + this.group +
        '&size=' + pages.internalPageSize + '&current=' + pages.internalCurrentPage, method: 'get' }).then(res => {
        if(res.code == 1) {
          this.showDetail=[res.result.totalMileage,res.result.totalTimeConsuming,res.result.overallAverageSpeed]
          res = res.result.pageGpsInfo
          this.total = res.total
          this.dataT1 = res.records
        } else this.$message(res.message)
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.el-table >>> .el-table__header-wrapper table th{
  /* height: 60px; */
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
