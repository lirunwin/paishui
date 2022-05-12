<template>
  <div style="width: 100%; height: 100%; padding:8px;">    
    <el-row>
      <!-- <span class="title2">分组</span>
      <el-select v-model="group" style="display: inline-block; width:130px;" size="small" placeholder="请选择">
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <span class="title2" style="margin-left:8px;">人员：</span>
        <el-select v-model="workers" @change="getList" style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请选择人员" filterable clearable multiple collapse-tags>
          <el-option v-for="item in ((groupIndex[group] || { users: []}).users)" :key="item.id" :label="item.name" :value="item.id">                        
          </el-option>
        </el-select>
      <span class="title2" style="margin-left:8px;">时间：</span>
      <el-date-picker v-model="startTime" @change="getList" type="date" placeholder="请选择开始时间" size="small" :picker-options="startOptions" value-format="yyyy-MM-dd"/> ~
      <el-date-picker v-model="endTime" @change="getList"  type="date" placeholder="请选择结束时间" size="small" :picker-options="endOptions" value-format="yyyy-MM-dd"/> 
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker size="small" v-model="date_select.value" style="width: 100%;"  align="right" type="daterange" range-separator="至"
		      start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择日期" value-format="yyyy-MM-dd"/>
      </div> -->
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="exportList">导出</el-button>
      <!-- <export-btn table-id="terminalRecordsTable" :file="title"></export-btn> -->
    </el-row>
    <div style="width:100%;height:100%;float:left;" v-loading="loading">
			<h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>      
      <el-table id="terminalRecordsTable" height="calc(100% - 80px)" class="mapTable" :data="tableData" border stripe style="width: 100%;height:calc(100% - 81px)" max-height="640px">        
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column :formatter="formatter" prop="userName" label="人员" align="center" />
        <el-table-column :formatter="formatter" prop="equipmentModel" label="型号" align="center" />
        <el-table-column :formatter="formatter" prop="checkTime" label="时间" align="center" />
        <el-table-column :formatter="formatter" prop="workState" label="状态" align="center" >
          <template slot-scope="scope">{{ [, '上班', '工作中', '下班', '异常'][scope.row.workState] }}</template>
        </el-table-column>
        <el-table-column :formatter="formatter" prop="electricity" label="电量" align="center" >
          <template slot-scope="scope">{{ scope.row.electricity + '%' }}</template>
        </el-table-column>
        <el-table-column :formatter="formatter" prop="residualSpace" label="剩余空间(MB)" align="center" />
        <el-table-column :formatter="formatter" prop="gpsPrecision" label="精度(m)" align="center" >
          <template slot-scope="scope">{{ scope.row.gpsPrecision || '-' }}</template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 8px">
        <el-pagination ref="pagination" small background layout="total, sizes, prev, next" :page-sizes="[10,20,30,50,100,1000]"
          :page-size='30' :total="total"
        @current-change="getList" @size-change="getList" style="display: inline-block;" />
        <!-- <span ref='pageLength' style="font-size: 13px;" class="el-pagination__total">1/1 页</span> -->
      </el-row>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import ExportBtn from '../components/ExportBtn'
import { terminalRecords2,exportTerminalRecords} from '../api/reportFormApis.js';
export default {
  name: 'wxZhongDuanJiLuTaIZhang',
  components: {tfLegend, ExportBtn},
  props: ['data'],
  data() {
    return {
      // 日期筛选信息
      date_select: {
        value: []
      },
      tableData: [],
      total: 0,
      title: '终端使用情况记录台账信息表',
      worker: '',
      workers: [],
      group: '',
      groups: [],
      loading: false,
      groupIndex: {},
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
    // this.startTime=lastyear + '-' + lastmonth + '-' + day;
    // this.endTime=year + '-' + month + '-' + day;
    this.startTime=year + '-' + month + '-' + '01';
    this.endTime=year + '-' + month + '-' + day;
    this.date_select.value = [this.startTime, this.endTime]
		// this.date_select.value = [lastyear + '-' + lastmonth + '-' + day, year + '-' + month + '-' + day] 
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
     exportList(){
      if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
      var pages = this.$refs.pagination
      let data = [
        'size=' + pages.internalPageSize,
        'current=' + pages.internalCurrentPage,
        'userId=' + this.workers.join(','),
        'startDate=' + this.startTime + ' 00:00:00',
        'endDate=' + this.endTime + ' 23:59:59',
        'deptId='+this.$store.state.user.departmentId,
        'exportFlag='+1
      ]
      this.date_select.value=[this.startTime,this.endTime]
      exportTerminalRecords(data).then(res => {
        var reader = new FileReader()
        reader.readAsDataURL(res)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = '终端使用情况记录台账信息表（' + this.date_select.value.map(e => 
                    e.split(' ')[0].split('-')).map(e => 
                    e[0] + '年' + e[1] + '月' + e[2] + '日').join('~') + '）.xls';
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    },
    // 获取列表数据
    getList() {
      if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
      var pages = this.$refs.pagination
      this.loading = true
      const data = [
        'size=' + pages.internalPageSize,
        'current=' + pages.internalCurrentPage,
        // 'department=' + this.dept_select.value,
        // 'member=' + this.user_select.value,
        'userId=' + this.workers.join(','),
        'startDate=' + this.startTime + ' 00:00:00',
        'endDate=' + this.endTime + ' 23:59:59',
        'deptId='+this.$store.state.user.departmentId
      ]
      this.date_select.value=[this.startTime,this.endTime];
      terminalRecords2(data).then(res => {
        if(res.code == 1) {
          res = res.result
          this.total = res.total
          this.tableData = res.records
          // 处理数据成echarts需要的结构
          this.title = '终端使用情况记录台账信息表（' + this.date_select.value.map(e => 
              e.split(' ')[0].split('-')).map(e => 
              e[0] + '年' + e[1] + '月' + e[2] + '日').join('~') + '）'
          // this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
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
