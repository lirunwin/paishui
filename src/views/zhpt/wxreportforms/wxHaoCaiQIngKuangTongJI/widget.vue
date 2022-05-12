<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
			<!-- <span class="title2">部门：</span>
      <el-select v-model="chooseGroup" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择部门"  @change="Bmchange()">
        <el-option v-for="item of searchGroupArray" :key="item.id" :index="item.index" :value="item.id" :label="item.name" />
      </el-select>
      <span class="title2">人员：</span>
      <el-select v-model="chooseWorker" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable>
        <el-option v-for="item in searchWorkers" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select> -->
      <span class="title2">产品名称：</span>
			<el-select size="small" @change="getList" filterable  style="display: inline-block; width:300px;margin-right:10px" v-model="filterForm.materialTypeName" multiple collapse-tags clearable placeholder="请选择">
				<el-option v-for="item in fixType_select.options" :key="item" :label="item" :value="item">
				</el-option>
      </el-select>
      <span class="title2">规格型号：</span>
			<el-select size="small" @change="getList" filterable style="display: inline-block; width:200px;" v-model="filterForm.specification" multiple collapse-tags clearable placeholder="请选择">
				<el-option v-for="item in specificationlType_select.options" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
      <!-- <span class="title2">口径</span>
  		<el-input size="small" style="width:130px" v-model="filterForm.bore" placeholder="请输入口径" clearable></el-input>       -->
      <el-radio-group v-model="timeType"  style="padding-left:40px;padding-right:40px" size="small">
        <el-radio label="1">按日</el-radio>
        <el-radio label="2">按月</el-radio>
        <el-radio label="3">按年</el-radio>
      </el-radio-group>
      <!-- <div style="width:1px;height:100%;display:inline-block;margin: 0 20px;background:#C0C4CC; height: 28px; vertical-align: middle;"></div> -->
      <span class="title2">时间：</span>
			<el-date-picker v-model="startTime"  @change="getList" size="small" :type="dateType" placeholder="请选择开始时间" :picker-options="startOptions" :value-format="dateFormData"/>
      <span v-if='this.endShow'> ~</span>
      <el-date-picker v-if='this.endShow' @change="getList" size="small" v-model="endTime"  :type="dateType" placeholder="请选择结束时间" :picker-options="endOptions" :value-format="dateFormData"/> 
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker v-if="timeType == '1'" v-model="dateRange" type="daterange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"/>
        <el-date-picker v-if="timeType == '2'" v-model="monthRange" type="monthrange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始月份"
          end-placeholder="结束月份" placeholder="选择月份" align="right" value-format="yyyy-MM"/>
        <el-date-picker v-if="timeType == '3'" v-model="year" type="year" size="small"
          style="width: 100%;" placeholder="选择年份" align="right" value-format="yyyy"/>
      </div> -->
      <el-button size="small" type="primary" @click="getList">查询</el-button>
			<export-btn table-id="specificationStatistics" :file="title"></export-btn>
    </el-row>
    <div style="width:100%;height:100%;float:left;" v-loading="loading">
			<h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>      
			<el-table id="specificationStatistics" :span-method="arraySpanMethod" :data="tableData" height="calc(100% - 20px)" class="mapTable" border stripe :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}" :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}" style="width: 100%" max-height="700px">
				<template slot="empty">
					<img src="@/assets/icon/null.png" alt="">
					<p class="empty-p">暂无数据</p>
				</template>
				<el-table-column :formatter="formatter"  prop="materialTypeName" :show-overflow-tooltip='true' label="产品名称">
				</el-table-column>
				<el-table-column :formatter="formatter"  prop="specification" :show-overflow-tooltip='true' label="规格型号">
				</el-table-column>
				<!-- <el-table-column :formatter="formatter"  prop="bore" label="口径(mm)">
				</el-table-column> -->
				<el-table-column :formatter="formatter"  prop="num" :show-overflow-tooltip='true' label="数量">
				</el-table-column>
				<el-table-column :formatter="formatter"  prop="unit" :show-overflow-tooltip='true' label="单位">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import ExportBtn from '../components/ExportBtn'
import {consumabelSituationList} from '../api/reportFormApis.js'
export default {
	name: 'wxHaoCaiQIngKuangTongJI',
	components: { tfLegend, ExportBtn },
	props: ['data'],
	data() {
		return {
			// 时间类型
			timeType: '1',
			//规格型号筛选信息
			specificationlType_select: {
				options: [],
				value: ''
			},
			//材料类型筛选信息
			fixType_select: {
				options: [],
				value: ''
			},
			tableData: [],
			currentPage: 1,
			dateRange: [],
			monthRange: [],
			year: '',
			filterForm: {
				materialTypeName: [],
				specification: [],
				bore: '',
			},
			title: '管网设施维护/保养耗材汇总信息表',
			loading: false,
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
              return time.getTime() >new Date(end.getFullYear()+"-"+(end.getMonth())+"-01")
            }else{
              //按年统计
              return false;
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
            	return false;
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
        this.getList();
      })
    }
  },
	mounted() {		
		request({ url: '/gps/repairmaterial/page?size=1000', method: 'get' }).then(res => {
			if(res.code == 1) {
				let temp1 = res.result.records.map((e) => { return e.name})
				this.fixType_select.options =Array.from(new Set(temp1));
				let temp2 = res.result.records.map((e) => { return   e.specification })
				this.specificationlType_select.options =Array.from(new Set(temp2));
			} else this.$message(res.message)
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
		// 获取列表数据
		getList() {
			var data = {
				productName: this.filterForm.materialTypeName.join(','),
				specification: this.filterForm.specification.join(','),
				bore: this.filterForm.bore,
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
			consumabelSituationList(data).then(res => {
				let tempData=[];
				res.result.forEach((item)=>{
					if(item.childVoList){
						item.childVoList.forEach((item2,index)=>{
							item2.materialTypeName=item.materialTypeName;
							if(index==0){
								item2.rowspan=item.childVoList.length
							}
							tempData.push(item2);
						})
					}
				})
				this.tableData =tempData
				data = [this.startTime, this.endTime]
				data = data.map( e => e.split('-'))
				this.title = '管网设施维护/保养耗材汇总信息表(' + {
					'1':() => data.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
					'2':() => data.map(e => e[0] + '年' + e[1] + '月'),
					'3':() =>[data[0][0] + '年'],
				}[this.timeType]().join('~') + ')'
        this.loading = false
			})
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (rowIndex % 2 === 0) {
				if (columnIndex === 0) {
					return [1, 2];
				} else if (columnIndex === 1) {
					return [0, 0];
				}
			}
		},
		arraySpanMethod({ row, column, rowIndex, columnIndex }) {
			if(columnIndex===0){
				if(row.rowspan){
					return {
              rowspan:row.rowspan,
							colspan: 1
							};
				}else{
					return {
              rowspan: 0,
              colspan: 0};
				}
			}
    }
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
