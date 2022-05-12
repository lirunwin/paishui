<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <div style="width:100%;height:100%" v-show='showPage=="one"'>    
    <el-row>
      <el-radio-group v-model="timeType" size="small">
        <el-radio label="1">按日</el-radio>
        <el-radio label="2">按月</el-radio>
        <el-radio label="3">按年</el-radio>
      </el-radio-group>
      <div style="width:1px;height:100%;display:inline-block;margin: 0 20px; height: 28px; vertical-align: middle;"></div>
      <span class="title2">时间：</span>
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker v-if="timeType == '1'" v-model="statisticTime" type="daterange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"/>
        <el-date-picker v-if="timeType == '2'" v-model="statisticMonth" type="monthrange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始月份"
          end-placeholder="结束月份" placeholder="选择月份" align="right" value-format="yyyy-MM"/>
        <el-date-picker v-if="timeType == '3'" v-model="statisticYear" type="year" size="small"
          style="width: 100%;" placeholder="选择年份" align="right" value-format="yyyy"/>
      </div> -->
      <el-date-picker v-model="startTime"  size="small" :type="dateType" placeholder="请选择开始时间" :picker-options="startOptions" :value-format="dateFormData"/>
      <span v-if='this.endShow'> ~</span>
      <el-date-picker v-if='this.endShow' size="small"  v-model="endTime"  :type="dateType" placeholder="请选择结束时间" :picker-options="endOptions" :value-format="dateFormData"/> 
      <el-button size="small" type="primary" @click="query()">查询</el-button>
			<export-btn table-id="classficationStatistic" :file="title"></export-btn>
    </el-row>
    <div style="width:100%;height:calc(100% - 46px);margin-top:8px;">
      <div style="width:350px;height:100%;float:left;">
        <div style="width:100%;height:100%;padding:12px;border:1px solid rgb(232,232,232);background:rgb(248,248,248);border-radius:4px;">
          <div style=" display: flex; align-items: center;">
            <span class="title2" style="flex: 1;">查询条件：{{list.length}} 条</span>
            <el-button size="mini" type="primary" @click="addMission" plain>添加条件</el-button>
          </div>          
          <div style="width:100%;height:calc(100% - 36px);overflow-y:auto;margin-top:8px;border:1px solid #bfbfbf;border-radius:4px;padding:0 8px;">
            <el-tag v-for="(tag, index) in list" :key="index" closable type="" style="width:100%;margin-top:8px;" @close="list.splice(index, 1)">
              {{ fixIndex[tag.typeId] + ' ( ' + tag.startBore + ' mm ~ ' + tag.endBore + ' mm )'}}
            </el-tag>
          </div>
        </div>
      </div>
      <div style="width:calc(100% - 350px);height:100%;float:left;" v-loading="loading">
			  <h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>        
        <el-table id="classficationStatistic" ref="table1" class="mapTable" :data="tableData" border style="width: 100%;margin-left: 8px;"
          height="calc(100% - 45px)" stripe>
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="conditions" label="条件" show-overflow-tooltip />
          <el-table-column prop="mfNum" label="维护数量" show-overflow-tooltip >
            <template slot-scope="scope">
              <span @dblclick="searchInfo(scope.row,'three')">{{scope.row.mfNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="维修数量" show-overflow-tooltip>
            <template slot-scope="scope">
              <span @dblclick="searchInfo(scope.row,'two')">{{scope.row.orderNum}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>    
    <el-dialog v-dialogDrag title="添加条件" :visible.sync="diaVisiable" width="700px" top="calc(50vh - 400px)">      
      <el-row>
        <span class="title2">维修类型：</span>
        <el-select v-model="fixType" collapse-tags style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" size="small" placeholder="请选择维修类型">
          <el-option v-for="item in fixs" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-row>
      <el-row style="margin-top: 8px;">
        <span class="title2">口径范围：</span>        
        <el-input-number size="small" style="margin-left: 5px;" v-model="radioFrom" :min="0" :max="radioTo - 0.01" 
          :step="radioFrom < 1 ? (Math.pow(10, -(radioFrom + '').replace(/\d+\.(\d*)/,'$1').length)) : (Math.pow(10,(Math.floor(radioFrom) + '').length - ((radioFrom + '')[0] == '1' ? 2 : 1)))"></el-input-number>
        <span class="title2">(mm) - </span>   
        <el-input-number size="small" v-model="radioTo" :min="radioFrom"
          :step="radioTo < 1 ? (Math.pow(10, -(radioTo + '').replace(/\d+\.(\d*)/,'$1').length)) : (Math.pow(10,(Math.floor(radioTo) + '').length - ((radioTo + '')[0] == '1' ? 2 : 1)))"></el-input-number>
        <span class="title2">(mm)</span>   
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addMissionTrue">确定</el-button>
        <el-button type="primary" size="small" @click="diaVisiable=false">取消</el-button>
      </span>
    </el-dialog>
    </div>
    <div style="width:100%;height:100%" v-if='showPage!="one"'>
      <el-row>
          <el-button size="small" type="primary" @click="showPage='one'">返回</el-button>
      </el-row>
      <div style="width:100%;height:calc(100%)">
        <baoyang v-if='showPage!="two"' :searchData="searchData" ></baoyang>
        <weixiu v-if='showPage!="three"' :searchData="searchData" ></weixiu>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import ExportBtn from '../components/ExportBtn'
import baoyang from '../wxWeiXiuBaoYangTaiZhang/widget.vue'
import weixiu from '../wxWeiXiuJiLuTaiZhang/widget.vue'
export default {
	name: 'wxWeiHuFenLeiTongJi',
	components: {ExportBtn,baoyang,weixiu},
	props: ['data'],
	data() {
		return {
      timeType: '1',
      showPage:'one',
      statisticTime: [],
      statisticMonth: [],
      searchData:null,
      statisticYear: '',
      list: [],
      diaVisiable: false,
      fixType: '',
      fixIndex: {},
      fixs: [],
      radioFrom: 0,
      radioTo: 100,
      tableData: [],
      title: '维护分类信息统计表',
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

  },
  mounted() {
		var date = new Date(), year = date.getFullYear(), lastyear = year, month = date.getMonth() + 1, lastmonth = month - 3, day = date.getDate()
		if(month < 10) month = '0' + month
		if(lastmonth < 1) lastmonth += 12, year -= 1
		if(lastmonth < 10) lastmonth = '0' + lastmonth
    if(day < 10) day = '0' + day;
    this.startTime=lastyear + '-' + month + '-' + '01';
    this.endTime=lastyear + '-' + month + '-' + day;
		this.statisticTime = [lastyear + '-' + month + '-' + '01', lastyear + '-' + month + '-' + day]
		this.statisticMonth = [lastyear + '-' + lastmonth, year + '-' + (~~ month < 9 ? '0' + (~~ month + 1) : ~~ month + 1 + '')]
		this.statisticYear = year + ''
    request({ url: '/gps/repairtype/page?size=1000', method: 'get' }).then(res => {
      if(res.code == 1) {
        var index = this.fixIndex = {};
        (this.fixs = res.result.records).map(e => index[e.id] = e.name)
      } else this.$message(res.message)
    })

  },
  watch: {
    timeType(e) {
      // if(this.timeType==1){
      //   this.endShow=true;
			// 	this.dateType='date';
			// 	this.dateFormData='yyyy-MM-dd';
			// 	let currentData=new Date();			
			// 	this.$nextTick(e=>{
			// 		this.endTime=currentData.getFullYear()+"-"+(currentData.getMonth()+1)+"-"+currentData.getDate();
			// 		let next=new Date(new Date(currentData.getFullYear()+"-"+(currentData.getMonth()+1)+"-"+currentData.getDate())-24*60*60*1000);
			// 		this.startTime=	next.getFullYear()+"-"+(next.getMonth()+1)+"-"+next.getDate();
			// 	})
      // }else if(this.timeType==2){
			// 	this.endShow=true;
			// 	let currentData=new Date();
			// 	this.dateType='month';
			// 	this.dateFormData='yyyy-MM';
			// 	this.$nextTick(e=>{
			// 		this.endTime=currentData.getFullYear()+"-"+(currentData.getMonth()+1);
			// 		this.startTime=currentData.getFullYear()+"-"+(currentData.getMonth());
			// 	})
      // }else{
			// 	this.endShow=false;
			// 	let currentData =new Date();
			// 	this.dateType='year';
			// 	this.dateFormData='yyyy';
			// 	this.$nextTick(e=>{
			// 		this.startTime=currentData.getFullYear()+"";
			// 		this.endTime=(currentData.getFullYear()+1)+"";
			// 	})
      // }
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
      this.list.map(e => { e.startDate = this.startTime, e.endDate = this.endTime })
    }
  },
	methods: {
    addMission() {
			switch (this.timeType) {
				case '1':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
					break
				case '2':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计月份')
					break
				case '3':
          if(!this.startTime) return this.$message.error('请选择统计年份')			
					break
			}
      this.diaVisiable = true
    },
    addMissionTrue() {
      if(!this.fixType) return this.$message.error('请选择维修类型')
      if(this.radioFrom+''=='undefined') return this.$message.error('请填写最小口径')
      if(this.radioTo+''=='undefined') return this.$message.error('请填写最大口径')
			var data = {
        typeId: this.fixType,
        startBore: this.radioFrom,
        endBore: this.radioTo,
			}
      var {typeId, startBore, endBore} = data
      for(var i=0,il=this.list,ii=il.length;i<ii;i++) {
        var di = il[i]
        if(typeId == di.typeId && startBore == di.startBore && endBore == di.endBore) return this.$message.error('已包含重复条件')
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
      this.list.push(data)
      this.diaVisiable = false
    },
    query() {
      if(!this.list.length) return this.$message.error('请添加查询条件')
      if(!this.list[0].startDate) return this.$message.error('请选择开始时间')
      if(!this.list[0].endDate) return this.$message.error('请选择结束时间')
      switch (this.timeType) {
				case '1':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
          this.list.map(e => { e.startDate = this.startTime + ' 00:00:00', e.endDate = this.endTime + ' 23:59:59' })
					break
				case '2':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计月份')
          let endMonth=parseInt(this.endTime.split('-')[1])+1;
          let endYear=this.endTime.split('-')[0];
          endMonth=endMonth<10?('0'+endMonth):endMonth
          this.list.map(e => { e.startDate = this.startTime + '-01 00:00:00', e.endDate = endYear+'-'+endMonth + '-01 00:00:00' })
					break
				case '3':
          if(!this.startTime) return this.$message.error('请选择统计年份')	
          this.list.map(e => { e.startDate = this.startTime + '-01-01 00:00:00', e.endDate =  ~~ this.startTime + 1 + '-01-01 00:00:00' })				
					break
			}
      this.loading = true
      request({ 
        url: '/gps/statement/getMaintenanceClassification', 
        method: 'post', 
        data: { dtoList: this.list }
      }).then(res => {
        this.loading = false
        if(res.code == 1) {
          this.tableData = res.result
          if(this.list.length < 1) return this.title = '维护分类信息统计表'
          var data = this.list[0]
          data = [this.startTime, this.endTime].map( e => e.split('-'))
          this.title = '维护分类信息统计表(' + {
            '1':() => data.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
            '2':() => data.map(e => e[0] + '年' + e[1] + '月'),
            '3':() => [data[0][0] + '年'],
          }[this.timeType]().join('~') + ')'
        } else this.$message(res.message)        
        
      })
    },
    searchInfo(row,type){
      row.startTime=this.startTime;
      row.endTime=this.endTime;
      row.timeType=this.timeType
      this.searchData=row
      this.showPage=type;
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
