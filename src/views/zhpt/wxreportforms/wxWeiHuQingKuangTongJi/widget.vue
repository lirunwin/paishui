<template>
  <div id="partAreaStatistics" class="partAreaStatistics" style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2">管网片区：</span>
      <el-select style="display: inline-block; margin-left: 5px; width:180px;" clearable @change="getList"  size="small" v-model="partArea_select.value" multiple collapse-tags placeholder="请选择">
        <el-option v-for="(item, i) in partArea_select.options" :key="i" :label="item.label" :value="item.value" clearable>
        </el-option>
      </el-select>
      <span class="title2">月份：</span>
      <el-date-picker v-model="startTime"  size="small" @change="getList"  type="month" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM"/> ~
      <el-date-picker v-model="endTime" size="small" @change="getList"  type="month" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM"/> 
      <el-button size="small" type="primary" @click="getList">查询</el-button>
			<export-btn table-id="maintenanceTable" :file="title"></export-btn>
    </el-row>
    <div class="statistics" v-loading="loading">
      <template v-if='tableData2&&tableData2.length>0'>
        <h3 class="partAreaStatisticsTitle">{{title}}</h3>
        <div style="width:100%;  overflow-x: auto;overflow-y:auto;height: calc(100% - 50px);">
          <table id='maintenanceTable' style="min-width:100%" cellspacing="0">
            <thead>
              <tr>
                <th style="min-width:200px !important" class='tableFrist'></th>
                <th style="min-width:200px !important" class="tableTwo">月份</th>
                <th rowspan="2">单位</th>
                <template v-if='columnsOther&&columnsOther.length>0'>
                  <template v-for="(item,index) in columnsOther">
                    <th style="min-width:100px" rowspan="2" :key="'columnsOther'+index"> {{item.replace('-','年')+'月'}}</th>
                  </template>
                  <th rowspan="2" >合计</th>
                </template>
              </tr>
              <tr>        
                <th class="tableThree">类型</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,index) in tableData2">
                <template v-for="(item2,index2) in item.data">
                  <tr :key="'row'+index+'_'+index2">
                    <td v-if='index2==0' :rowspan="item.data.length" >{{item.groupName}}</td>
                    <td>{{item2.typeName || '-'}}</td>
                    <td>{{item2.unit || '-'}}</td>
                    <template v-for="(item3,index3) in columnsOther">
                      <td :key="'other_'+index3">{{item2[item3] || 0}}</td>
                    </template>
                    <td>{{item2.total || '0'}}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <table-empty-model :isElTable='false'> </table-empty-model>
      </template>
    </div>
  </div>
</template>
<script>
import { esriConfig, appconfig } from 'staticPub/config'
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/Legend'
import { maintenanceSituationList } from '../api/reportFormApis.js'
import ExportBtn from '../components/ExportBtn'
export default {
  name: 'wxWeiHuQingKuangTongJi',
  components: { tfLegend, ExportBtn },
  props: ['data'],
  data() {
    return {
      // 片区筛选信息
      partArea_select: {
        options: [],
        value: []
      },
      // 日期筛选信息
      date_select: {
        value: []
      },
      columns: [
        { label: '维修类型', type: 'sets', width: 140 },
        { label: '单位', prop: 'unit', width: 80 },
        { label: '', prop: 'none' }
      ],
      columnsOther:[],
      tableData: [],
      tableData2:[],
      currentPage: 1,
      spanArr: [],
      pos: undefined,
			title: '管网设施维护/保养汇总信息表',
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
        },
    }
  },
  mounted() {
    $.ajax({
      url: appconfig.gisResource.business_map.config[0].url + "/17/query?where=1%3D1&outFields=*&returnGeometry=false&f=pjson",
      type: 'GET',
      success: (data) => {
        data = JSON.parse(data)
        this.partArea_select.options = data.features.map((e) => {
          return {
            label: e.attributes.NAME,
            value: e.attributes.CODE,
          }
        })
      },
      error: (error) => { console.log(error) }
    })
    var date = new Date()
    var year = date.getFullYear()
    var lastyear = year
    var month = date.getMonth() + 2
    if(month < 10) month = '0' + month
    this.startTime=year + '-' + '01';
    this.endTime=year + '-' + month;
    this.getList();
  },
  methods: {
    // 获取表格数据
    getList() {
      if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
      this.loading = true
      this.columnsOther=[];
      let endMonth=parseInt(this.endTime.split('-')[1])+1;
      let endYear=this.endTime.split('-')[0];
      endMonth=endMonth<10?('0'+endMonth):endMonth
      var data = {
        startDate: this.startTime + '-01 00:00:00',
        endDate: endYear+'-'+endMonth + '-01 00:00:00',
        regionCodeList: this.partArea_select.value.join(','),
        deptId:this.$store.state.user.departmentId
      }
      this.date_select.value=[this.startTime,this.endTime];
      maintenanceSituationList(data).then(res => {
        let col=this.getSplitTime();
        this.columnsOther=col;
        if(res.code == 1) {
          this.tableData = [];
          this.tableData2=[];
          let temp=[];
          res.result.forEach(item=>{
            if(item.detailVoList&&item.detailVoList.length>0){
              let dataList=[];
              item.detailVoList.forEach(item2=>{
                let dataTemp={
                  typeName:item2.typeName,
                  unit:item2.unit
                }
                let total=0;
                if(item2.monthNumMap){
                  for(let val of col){
                    if(item2.monthNumMap[val]){
                      dataTemp[val]=item2.monthNumMap[val];
                      total+=item2.monthNumMap[val];
                    }else{
                      dataTemp[val]=0;
                    }
                  }
                }
                dataTemp.total=total;
                dataList.push(dataTemp);
              })
              temp.push({
                groupName:item.groupName,
                data:dataList
              })
            }
          })
          this.tableData2=temp;
          data = [this.startTime, this.endTime]
          data = data.map( e => e.split('-')).map(e => e[0] + '年' + e[1] + '月')
          this.title = '管网设施维护/保养汇总信息表(' + data.join('~') + ')'
        } else {
          this.$message.error('请求错误：' + res.message)
        }
        this.loading = false
      })
    },

    /**
     * 根据查询时间获取时间间隔
     * */
    getSplitTime(){
      let splitTime=[];
      let startYear,startMonth,endYear,endMonth;
      [startYear,startMonth]=this.startTime.split('-').map(item=>{return parseInt(item)});
      [endYear,endMonth]=this.endTime.split('-').map(item=>{return parseInt(item)});
      let split=(endYear-startYear)*12+(endMonth-startMonth)+1;
      for(let i=0;i<split;i++){
        let year,month;
        if((startMonth+i)%12==0){
          year=startYear+(Math.floor((startMonth+i)/12)-1);
          month=12;
        }else{
          year=startYear+Math.floor((startMonth+i)/12);
          month=(startMonth+i)%12;
        }
        splitTime.push(year+'-'+(month));
      }
      return splitTime;
    },

    /**
     * 合并方法,合并将根据fields中的字段顺序进行
     * data为待处理数组，saveData保存处理后的数据，fields通过那些字段进行合并
     * */ 
    mergeMethod(data,saveData,fields){
      if(fields&&fields.length>0){
        fields.forEach((item,index)=>{

        })
      }
      if(data&&data.length>0){
        data.forEach(item=>{
          let temp=[];
          if(fields&&fields.length>0){
            fields.forEach((item,index)=>{

            })
          }
        })
      }
    },
  },
}
</script>
<style lang='scss' scoped>
/deep/ .statistics{
    .tableFrist,.tableTwo{
      width:85px
    }
    .tableFrist::after{
      content: "";
      position: absolute;
      width: 1px;
      height: 407px;
      top: 70px;
      left: 0;
      background-color: grey;
      opacity: 0.2;
      display: block;
      transform: rotate(-79.2deg);
      transform-origin: top;
    }
    .tableFrist{
      border-right: none !important;
      border-bottom: none !important;
    }
    .tableTwo{
      border-bottom: none !important;
    }
    .tableThree{
      border-right: none !important;
    }
    table{
    border: 1px solid #EBEEF5;
      th,td{
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
    }
    th{
      padding:10px;
      background: rgb(250, 250, 250);
      color: rgb(50, 59, 65);
      text-align: center;
      min-width: 120px !important;
    }
    td{
      padding:10px;
      text-align: center;
    }
  }
}
.partAreaStatistics {
  .statistics {
    position: relative;
    width: 100%;
    padding-top: 20px;
    height: calc(100% - 50px);
    background-size: 100% 100%;
    overflow-x: auto;
    overflow-y:auto;
    .pagination-area {
      position: absolute;
      bottom: 60px;
      right: 0;
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .el-table {
    position: absolute;
    margin-top: 10px;
    margin-bottom: 10px;
    border-color: rgba(222, 226, 230, 0.5);
  }
  .partAreaStatisticsTitle {
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>