<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>   
      <!-- <span class="title2" style="display:inline-block;width:45px;padding-left:8px;">分组</span>
      <el-select v-model="group" style="display: inline-block; width:130px;" size="small" placeholder="请选择">
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <span class="title2" style="margin-left:8px;">人员：</span>
        <el-select v-model="worker"  @change="getList" style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请选择人员" filterable clearable multiple collapse-tags>
          <el-option v-for="item in ((groupIndex[group] || { users: []}).users)" :key="item.id" :label="item.name" :value="item.id">                        
          </el-option>
        </el-select>
      <span class="title2" style="display:inline-block;width:50px;padding-left:8px;">时间：</span>
      <el-date-picker v-model="startTime"  @change="getList"  size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd"/> ~
      <el-date-picker v-model="endTime"   @change="getList" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd"/> 
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker size="small" v-model="date_select.value" align="right" type="daterange" style="width: 100%;" 
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择日期" value-format="yyyy-MM-dd" />
      </div> -->
      <el-button size="small" type="primary" @click="getList">查询</el-button>
			<export-btn table-id="personSchedulingTable" :file="title"></export-btn>
    </el-row>
    <div style="width:100%;height:100%;float:left;" v-loading="loading">
			<h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>
      <el-table height="calc(100% - 80px)" id="personSchedulingTable" class="mapTable" :data="tableData" border stripe
        :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}"
        :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}"
        style="width: 100%" max-height="700px">        
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column :formatter="formatter" prop="dutyDate" label="日期" align="center">
        </el-table-column>
        <el-table-column :formatter="formatter" prop="dutyUserName" label="人员" align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import ExportBtn from '../components/ExportBtn'
export default {
  name: 'wxRenYuanPaiBanChaXun',
  components: {tfLegend, ExportBtn},
  props: ['data'],
  data() {
    return {
      tableData: [],
      group: '',
      checks: [],
      worker: [],
      groups: [],
      groupIndex: {},
      date_select: {
        value: ''
      },
      title: '人员排班表',
      loading: false,
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
      }
    }
  },
  mounted() {
    request({ url: '/gps/groupuser/getGroupUserMap', method: 'get' }).then(res => {
      if(res.code == 1) {
        res = res.result
        var group = this.workerGroup = [
          { id: '', name: '全部', users: res.groupUserDeptVoList.map(e => { return {
            id: e.userId,              
            name: e.userName,
          }})}
        ]
        var groupIndex = { '' : group[0]}
        res.groupUserVoList.map(e => {
          if(!groupIndex.hasOwnProperty(e.groupId)) group.push(groupIndex[e.groupId] = {id: e.groupId, name: e.groupName, users: []})
          var di = {
            id: e.userId,
            name: e.userIdName,
          }
          if(di.id) {
            groupIndex[e.groupId].users.push(di)
            groupIndex[''].users.push(di)
          }
        })
        this.groupIndex = groupIndex
        this.groups = group
      } else this.$message('人员信息加载失败：' + res.message)
    })
		var date = new Date()
		var year = date.getFullYear()
		// var lastyear = year
		var month = date.getMonth() + 1
		// var lastmonth = month - 3
		var day = date.getDate()
		if(month < 10) month = '0' + month
		// if(lastmonth < 1) lastmonth += 12, year-=1
		// if(lastmonth < 10) lastmonth = '0' + lastmonth
    if(day < 10) day = '0' + day;
    this.startTime=year + '-' + month + '-' + '01';
    this.endTime=year + '-' + month + '-' + day;
    this.date_select.value = [this.startTime, this.endTime];
    this.$nextTick(e=>{
      this.getList();
    })
  },
  methods: {
    /**
     * 渲染数据处理
    */
    formatter(row, column){
        let typeValue=typeof row[column.property];
        if(typeValue=="undefined"){
            return "-"
        }else if(typeValue=="object"||typeValue=="string"){
            if(!row[column.property]){
                return "-"
            }else{
                return row[column.property]
            }
        }else{
            return row[column.property]
        }
    },
    // 获取人员排版统计表
    getList() {
      this.loading = true
      var time = this.date_select.value
      if(time) time = [time[0] + ' 00:00:00', time[1] + ' 00:00:00']
      else time = ['', '']
      request({ url: '/gis/gsrx/dutymanager1', method: 'post', data: {
        dutyUser: this.worker.join(','),
        startTime: this.startTime+" 00:00:00",
        endTime: this.endTime+" 23:59:59",
        deptId:this.$store.state.user.departmentId
      }}).then(res => {
        this.date_select.value=[this.startTime,this.endTime];
        if(res.code == 1) {
          this.tableData = res.result
          // 处理数据成echarts需要的结构
          if(time[0]) {
            this.title = '人员排班表（' + this.date_select.value.map(e => 
              e.split(' ')[0].split('-')).map(e => 
              e[0] + '年' + e[1] + '月' + e[2] + '日').join('~') + '）'
          } else {
            this.title = '人员排班表'
          }          
        } else this.$message.error(res.message)
        this.loading = false        
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 60px;
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
