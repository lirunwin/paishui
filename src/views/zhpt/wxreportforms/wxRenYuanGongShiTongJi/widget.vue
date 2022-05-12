<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>   
      <!-- <span class="title2" style="display:inline-block;width:45px;padding-left:8px;">分组</span>
      <el-select v-model="group" style="display: inline-block; width:180px;" size="small" placeholder="请选择">
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <span class="title2"  style="margin-left:8px;">人员：</span>
        <el-select v-model="workers" multiple collapse-tags filterable @change="getStuffWorkTimeStatistic" style="display: inline-block; margin-left: 5px; width:180px;" size="small" placeholder="请选择人员"  clearable>
          <el-option v-for="item in ((groupIndex[group] || { users: []}).users)" :key="item.id" :label="item.name" :value="item.id">                        
          </el-option>
        </el-select>
      <el-radio-group v-model="timeType"  style="padding-left:40px;padding-right:40px" size="small">
        <el-radio label="1">按日</el-radio>
        <el-radio label="2">按月</el-radio>
        <el-radio label="3">按年</el-radio>
      </el-radio-group>
      <!-- <div style="width:1px;height:100%;display:inline-block;margin: 0 20px;background:#C0C4CC; height: 28px; vertical-align: middle;"></div> -->
      <span class="title2">时间：</span>
      <el-date-picker v-model="startTime"  @change="getStuffWorkTimeStatistic" size="small" :type="dateType" placeholder="请选择开始时间" :picker-options="startOptions" :value-format="dateFormData"/>
      <span v-show='this.endShow'> ~</span>
      <el-date-picker v-show='this.endShow' @change="getStuffWorkTimeStatistic" size="small" v-model="endTime"  :type="dateType" placeholder="请选择结束时间" :picker-options="endOptions" :value-format="dateFormData"/> 
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker v-if="timeType == '1'" v-model="dateRange" type="daterange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"/>
        <el-date-picker v-if="timeType == '2'" v-model="monthRage" type="monthrange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始月份"
          end-placeholder="结束月份" placeholder="选择月份" align="right" value-format="yyyy-MM"/>
        <el-date-picker v-if="timeType == '3'" v-model="year" type="year" size="small"
          style="width: 100%;" placeholder="选择年份" align="right" value-format="yyyy"/>
      </div> -->
      <el-button size="small" type="primary" @click="getStuffWorkTimeStatistic">查询</el-button>
			<export-btn table-id="stuffWorkTimeStatistic" :file="title"></export-btn>
    </el-row>
    <div style="width:100%;height:100%;float:left;" v-loading="loading">
			<h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>      
			<el-table id="stuffWorkTimeStatistic" height="calc(100% - 20px)" class="mapTable" :data="tableData" border stripe :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}" :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}" style="width: 100%" max-height="700px">
				<template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column :formatter="formatter" width="100"  prop="userName" :show-overflow-tooltip='true' label="员工名称">
				</el-table-column>
				<el-table-column :formatter="formatter" width="180" prop="repairOrderNum" :show-overflow-tooltip='true' label="维修工单总数">
				</el-table-column>
    		<el-table-column :formatter="formatter" label="维修工单情况" :show-overflow-tooltip='true'>					
          <el-table-column :formatter="formatter" :width="workTypes.length>4?150:''" :show-overflow-tooltip='true' v-for="(item, i) in workTypes" :key="i" :label="item" :prop="item">
          </el-table-column>
				</el-table-column>
				<el-table-column :formatter="formatter" width="150"   prop="ratifyTime" :show-overflow-tooltip='true' label="核定工时(h)">
				</el-table-column>
				<el-table-column :formatter="formatter" width="150"   prop="averageTime" :show-overflow-tooltip='true' label="平均工时(h)">
				</el-table-column>
				<el-table-column :formatter="formatter" width="150"   prop="findBuildNum" :show-overflow-tooltip='true' label="发现工地数(个)">
				</el-table-column>
				<el-table-column :formatter="formatter" width="150"   prop="findTroubleNum" :show-overflow-tooltip='true' label="发现隐患数(个)">
				</el-table-column>
				<el-table-column :formatter="formatter"  width="150"  prop="findPlanNum" :show-overflow-tooltip='true' label="巡检任务数(个)">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import { stuffWorkTimeStatistic } from '../api/reportFormApis.js'
import ExportBtn from '../components/ExportBtn'
export default {
	name: 'wxRenYuanGongShiTongJi',
	components: { tfLegend, ExportBtn},
	props: ['data'],
	data() {
		return {
			// 人员筛选信息
			user_select: {
				options: [],
				value: 'all'
			},
			// 日期筛选信息
			date_select: {
				value: []
			},
			tableData: [],
			currentPage: 1,
			timeType: '1',
			dateRange: [],
			monthRage: [],
			year: '',
			title: '人员工时汇总信息表',
      worker: '',
      workers: [],
      group: '',
      groups: [],
      loading: false,
      groupIndex: {},
      workTypes: [],
      dateType:'date',
      dateFormData:'yyyy-MM-dd',
      startTime:'',
      endTime:'',
      endShow:true,
      startOptions:{
        disabledDate:time=> {
          if(this.endTime){
            if(this.timeType==1){
              //按天统计
              return time.getTime()+1000*60*60*24 >new Date(this.endTime);
            }else if(this.timeType==2){
              //按月统计
              let end=new Date(this.endTime);
              // let endMonth=end.getMonth()<10?('0'+end.getMonth()):end.getMonth()
              return time.getTime() >new Date(end.getFullYear()+"-"+(end.getMonth())+"-01")
            }else{
              //按年统计
          
            }
          }
        },
      },
      endOptions:{
        disabledDate:time=> {
          if(this.startTime){
            if(this.timeType==1){
              //按天统计
              return  new Date(this.startTime)>time.getTime();
            }else if(this.timeType==2){
              //按月统计
              let start=new Date(this.startTime);
              return  new Date(start.getFullYear()+"-"+(start.getMonth()+2)+"-01")>time.getTime();
            }else{
              //按年统计
            
            }
          }
        },
      }
		}
  },
  watch:{
    timeType(){
      if(this.timeType==1){
        this.endShow=true;
				this.dateType='date';
				this.dateFormData='yyyy-MM-dd';
				let currentData=new Date();			
				this.$nextTick(e=>{
					this.endTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1))+"-"+(currentData.getDate()<10?('0'+currentData.getDate()):currentData.getDate());
					let next=new Date(new Date(currentData.getFullYear()+"-"+(currentData.getMonth()+1)+"-"+currentData.getDate())-24*60*60*1000);
					this.startTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1))+"-"+'01';
				})
      }else if(this.timeType==2){
				this.endShow=true;
				let currentData=new Date();
				this.dateType='month';
				this.dateFormData='yyyy-MM';
				this.$nextTick(e=>{
					this.endTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1));
					this.startTime=currentData.getFullYear()+"-"+(currentData.getMonth()<10?('0'+currentData.getMonth()):currentData.getMonth());
				})
      }else{
				this.endShow=false;
				let currentData =new Date();
				this.dateType='year';
				this.dateFormData='yyyy';
				this.$nextTick(e=>{
					this.startTime=currentData.getFullYear()+"";
					this.endTime=(currentData.getFullYear()+1)+"";
				})
      }
      this.$nextTick(e=>{
        this.getStuffWorkTimeStatistic();
      })
    }
  },
	mounted() {
    request({ url: '/gps/groupuser/getGroupUserMap', method: 'get' }).then(res => {
      if(res.code == 1) {
        res = res.result
        res.groupUserDeptVoList.unshift({userId:'',userName:"全部"});
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
		var month = date.getMonth() + 1
		var lastmonth = month - 3
		var day = date.getDate()
		if(month < 10) month = '0' + month
    if(day < 10) day = '0' + day;
    this.startTime=year + '-' + month + '-' + '01';
    this.endTime=year + '-' + month + '-' + day;
    this.year = year + ''
    this.$nextTick(e=>{
      this.getStuffWorkTimeStatistic();
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
		// 获取员工工作时间统计列表数据
		getStuffWorkTimeStatistic() {
      // if(this.worker.length == 0) return this.$message.error('请选择人员')
			var data = {
        userId: this.workers.join(','),
        deptId:this.$store.state.user.departmentId
			}
			switch (this.timeType) {
				case '1':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
					data.startDate = this.startTime + ' 00:00:00'
					data.endDate = this.endTime + ' 23:59:59'
					break
				case '2':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计月份')
          data.startDate = this.startTime + '-01 00:00:00';
          let endMonth=parseInt(this.endTime.split('-')[1])+1;
          let endYear=this.endTime.split('-')[0];
          endMonth=endMonth<10?('0'+endMonth):endMonth
					data.endDate = endYear+'-'+endMonth+ '-01 00:00:00'
					break
				case '3':
          if(!this.startTime) return this.$message.error('请选择统计年份')
					data.startDate = this.startTime + '-01-01 00:00:00'
					data.endDate = ~~ this.startTime + 1 + '-01-01 00:00:00'					
					break
			}
      this.loading = true
			stuffWorkTimeStatistic(data).then(res => {  
        if(res.code == 1){
          var types = []
          for(var i=0,il=res.result,ii=il.length;i<ii;i++) {
            var di = il[i]
            var dis = di.typeDetails
            for(var item in dis) {
              if(types.indexOf(item) < 0) types.push(item)
              di[item] = dis[item]
            }
            delete di.typeDetails
          }
          this.workTypes = types
          this.tableData = il 
          data = [this.startTime, this.endTime]
          data = data.map( e => e.split('-'))
          this.title = '人员工时汇总信息表(' + {
            '1':() => data.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
            '2':() => data.map(e => e[0] + '年' + e[1] + '月'),
            '3':() =>[data[0][0] + '年'],
          }[this.timeType]().join('~') + ')'
        } else this.$message.error(res.message)
        this.loading = false
			})
		},
	}
}
</script>

<style lang='scss' scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 30px;
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
