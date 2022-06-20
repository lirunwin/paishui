<template>
<div class='peoplePage' v-loading='loading'>
  <el-row>
    <span class="title2">部门：</span>
    <el-select v-model="currentDepart" class="searchInput" @change="getUserList" size="small" placeholder="请选择部门">
      <el-option v-for="item of this.departInfo.departmentList" :key="'currentDepart_'+item.id" :label="item.name" :value="item.id" />
    </el-select>
    <span class="title2">上报人：</span>
    <el-select v-model="currentUser"  filterable clearable class="searchInput" size="small" placeholder="请选择人员" @change="getTrouble">
      <el-option v-for="item of userList" :key="'troubleUser_'+item.id" :label="item.realName" :value="item.id" />
    </el-select>
    <span class="title2">隐患原因：</span>
    <el-select v-model="troubleType"  filterable clearable class="searchInput" size="small" placeholder="请选择人员" @change="getTrouble">
      <el-option v-for="item of troubleList" :key="'troubleType_'+item.id" :label="item.name" :value="item.id" />
    </el-select>
    <span class="title2">上报日期：</span>
    <el-date-picker  :clearable="false" v-model="currentDate" size="small" class="searchInput" type="date" value-format="yyyy-MM-dd" @change="getTrouble" :picker-options="startOptions" placeholder="选择日期">
    </el-date-picker>
  </el-row>
  <div class='showList'>
    <el-row style="padding: 5px 0px 20px 0px;">
      <span class="bar">隐患</span>
    </el-row>
    <div class='showUser' :class="(troubleList.length==0?'emptyClass':'')">
      <template v-if='troubleList.length==0'>
        <emptyShow :title='"暂无隐患"'></emptyShow>
      </template>
      <template v-else>
        <template v-for='(item,index) in troubleList'>
          <div class='userItem' :key="'userItem_'+index">
            <!-- 显示用户基本情况 -->
            <div class='userBaseInfo'>
              <div class='planState' :class="item.backgroundClass">
                  <span :title='item.auditResult'>{{item.auditResult}}</span>
              </div>
              <div class='otherInfo' :title='"点击定位"' @click='goToPoint(item)'>
                <!-- <div class='peopleList'>
                  <span :title="item.address||''">{{item.address||""}}</span>
                </div>   -->
                <div class='peopleList'>
                  <span :title="item.submitUserName">{{item.submitUserName}}</span>
                </div>  
                <div class='peopleType'>
                  <span :title="item.typeName">{{item.typeName}}</span>
                </div>              
                <div class='planTime'>
                  <span :title="(item.submitTime)">{{item.submitTime}}</span>
                </div>
              </div>
              <div class='clickTool' style="float:right;">
                <el-tooltip effect="dark" content="隐患详情" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(item,showContent.plan)">
                    <span class='icon iconfont iconjihua'></span>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <!-- <div v-show="item.pageShow" class='userCurrentInfo'>
              <template v-if="item.pageShowContent==showContent.plan">
                <div class='planInfo'>
                  <el-table class="mapTable"  :data="item.planTypeOverList" border  height="100%">
                    <template slot="empty">
                      <emptyShow :title='"暂无巡检计划信息"'></emptyShow>
                    </template>
                    <el-table-column align='center' prop="typeName" label="巡查对象" show-overflow-tooltip />
                    <el-table-column align='center'  prop="type" label="工作量" show-overflow-tooltip >
                        <template slot-scope="scope">{{ scope.row.overCount+'/'+  scope.row.totalCount}}</template>
                    </el-table-column>
                
                    <el-table-column  align='center' prop="percent" label="完成率" show-overflow-tooltip >
                      <template slot-scope="scope"><span class='percentClass' :class="((scope.row.completionRate<=scope.row.percent)?stateList.finishedClass:stateList.unfinishedClass)">{{ (scope.row.percent||"0"+"%")}}</span></template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </div> -->
          </div>
        </template>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import tool from './tool'
import {getTrouble} from '@/api/xjApi'
import emptyShow from './otherVue/emptyShow'
import peoplePlan from './otherVue/peoplePlan'
import {IP} from '@/utils/request'
import {getAllUserInfo} from '@/api/base'
import { problemReasonQuery } from '@/api/xjConfigManageApi'
export default {
  components:{emptyShow,peoplePlan},
  props:{
    departInfo:{
      departmentList:[],
      currentDepart:''
    },
    mapView:null,
    layerList:{}
  },
  data(){
    return {
      checkList:[],//选择的状态
      currentDepart:'',//当前选择的部门
      userList:[],//用户列表
      loading:false,
      currentUser:"",//当前的用户
      currentDate:'',//查询日期
      troubleList:[],//列表渲染的计划
      showContent:{//明确当前查看的是什么内容
        path:'path',//展示内容轨迹
      },
      troubleList:[],//隐患原因列表
      troubleType:'',//隐患原因
      token:'',//系统的token
      stateList:{
        finished:[],
        unfinished:['未审批'],
        finishedClass:'finished',
        unfinishedClass:"unfinished"
      },
      
      //开始时间控制选择
      startOptions:{
        disabledDate: (time) => {
          return time.getTime() > new Date()
        }
      },
      currentShowPeople:null,//目前展示内容的人员信息
    }
  },
  created(){
    this.token= this.$store.state.user.token;
    this.currentDate=tool.getCurrentTime();
    this.currentDepart=this.departInfo.currentDepart;
    this.getTroubleType();
    this.getUserList();
  },
  methods:{
    /**获取人员*/
    getUserList(){
      this.loading=true;
      getAllUserInfo({depts:this.currentDepart}).then(res=>{
        let tempList=[];
        if(res.result&&res.result[0]&&res.result[0].users){
          tempList=res.result[0].users;
        }
        this.userList=tempList;
        this.loading=false;
        this.getTrouble();
      }).catch(e=>{
        this.loading=false;
      })
    },

    /**获取隐患类型*/
    getTroubleType(){
      const params={
        current:1,
        size:1000
      }
      problemReasonQuery(params).then(res=>{
        this.troubleList=res.result.records||[];
      })
    },

    getTrouble(){
      const params={
        deptId:this.currentDepart,
        submitUser:this.currentUser,
        typeId:this.troubleType,
        // inspectUsers:this.currentUser.length==0?(this.userList.map(e=>{return e.id}).join(",")):this.currentUser.join(","),
        startDate:tool.getDayStartTime(this.currentDate),
        endDate:tool.getDayEndTime(this.currentDate),
        current:1,
        size:1000,
      }
      this.loading=true;
      getTrouble(params).then(res=>{
        res.result.records.forEach(item=>{
          this.initPeopleInfo(item)
        })
        this.troubleList=res.result.records
        this.mapShowPeople(this.troubleList);
        this.loading=false;
      }).catch(e=>{
        this.loading=false;
      })
      // const troubleList={"code":1,"message":null,"result":{"records":[{"id":13,"pipeName":"测试隐患上报2","location":"管线","padId":null,"typeId":3,"typeName":"施工范围内有给水管线","lgtd":104.377537,"lttd":30.850514,"address":"测试隐患上报2","notes":"测试隐患上报2","createTime":"2022-06-15 13:56:04","createUser":208,"createUserName":null,"isbuild":"是","buildId":9,"suggest":"测试隐患上报2","uploadType":"","uploadFileids":null,"isrespect":"否","state":"无需处理","isread":"未查看","isSubmit":"已上报","submitTime":"2022-06-15 13:56:04","submitUser":208,"submitUserName":"管网-王海","auditResult":"已通过","auditTime":"2022-06-15 13:56:46","auditUser":208,"auditUserName":"管网-王海","auditNotes":"123","regionId":"E","regionName":"E片区","filePathList":null,"toubleRangeId":2,"toubleRangeName":"严重"},{"id":12,"pipeName":"测试管线上报","location":"管线","padId":null,"typeId":1,"typeName":"井室占压","lgtd":104.497862,"lttd":30.876064,"address":"测试管线上报","notes":"测试管线上报","createTime":"2022-06-15 13:55:25","createUser":208,"createUserName":null,"isbuild":"是","buildId":35,"suggest":"测试管线上报","uploadType":"","uploadFileids":null,"isrespect":"","state":"","isread":"未查看","isSubmit":"已上报","submitTime":"2022-06-15 13:55:25","submitUser":208,"submitUserName":"管网-王海","auditResult":"未审批","auditTime":null,"auditUser":201,"auditUserName":"冯茂","auditNotes":null,"regionId":"A","regionName":"A片区","filePathList":null,"toubleRangeId":1,"toubleRangeName":"一般"},{"id":11,"pipeName":"测试隐患","location":"管线","padId":null,"typeId":1,"typeName":"井室占压","lgtd":104.433392,"lttd":30.836141,"address":"测试地址","notes":"测试地址2","createTime":"2022-06-14 15:26:02","createUser":208,"createUserName":null,"isbuild":"是","buildId":10,"suggest":"测试地址三","uploadType":"","uploadFileids":null,"isrespect":"","state":"","isread":"未查看","isSubmit":"已上报","submitTime":"2022-06-14 15:26:02","submitUser":208,"submitUserName":"管网-王海","auditResult":"未审批","auditTime":null,"auditUser":208,"auditUserName":"管网-王海","auditNotes":null,"regionId":"E","regionName":"E片区","filePathList":null,"toubleRangeId":1,"toubleRangeName":"一般"}],"total":3,"size":10,"current":1,"orders":[],"optimizeCountSql":true,"hitCount":false,"searchCount":true,"pages":1}}
      // troubleList.result.records.forEach(item=>{
      //   this.initPeopleInfo(item)
      // })
      // this.troubleList=troubleList.result.records;
      // this.mapShowPeople(this.troubleList);
    },

    /**初始化轨迹、设备、计划内容*/
    initPeopleInfo(peopleInfo){
      peopleInfo.pageShowContent='';
      peopleInfo.pageShow=false;
      if(this.stateList.unfinished.includes(peopleInfo.auditResult)){
        peopleInfo.backgroundClass=this.stateList.unfinishedClass;
      }else{
        peopleInfo.backgroundClass=this.stateList.finishedClass;
      }
    },

    /**在地图上显示隐患*/
    mapShowPeople(peopelList){
      const showList=[];
      peopelList.forEach(item=>{
        if(item.lgtd&&item.lttd){
          let tempAddress=item.typeName||"";
          if(tempAddress.length>4){
            tempAddress=tempAddress.substring(0,4)+"..."
          }
          showList.push({
            x:item.lgtd,
            y:item.lttd,
            name:tempAddress,
            state:this.stateList.unfinished.includes(item.auditResult)?'nosign':'sign'
          })
        }
      })
      this.$emit("addPoint",{type:'trouble',data:showList});
    },

    /**定位*/
    goToPoint(data){
      if(data.lgtd&&data.lttd){
        this.mapView.getView().setZoom(19);
        this.$nextTick(e=>{
        this.mapView.getView().setCenter([data.lgtd,data.lttd])})
      }else{
        this.$message.info("未上传坐标")
      }
    },

    /**调用隐患详情页面*/
    showWay(peopleInfo,action){
      // //是否已打开的了人员信息
      // if(this.currentShowPeople){
      //   //本次打开人员与上次打开人员是一个且本次操作与上次操作是一样的,初始化内容并返回
      //   if(this.currentShowPeople==peopleInfo&&this.currentShowPeople.pageShowContent==action){
      //     this.initPeopleInfo(this.currentShowPeople);
      //     tool.closePlay(this.$store)
      //     return
      //   }
      //   this.initPeopleInfo(this.currentShowPeople);
      //   this.currentShowPeople=peopleInfo;
      // }else{
      //   this.currentShowPeople=peopleInfo;
      // }
      // this.currentShowPeople.pageShow=true;
      // this.currentShowPeople.pageShowContent=action;
    },
  }
}
</script>

<style lang="scss" scoped>
.peoplePage{
  height: 100%;
}
  .title2{
    display:inline-block;width:70px;
    text-align: right;
  }
  .searchInput{
    display: inline-block;width:calc(100% - 80px);
    padding: 5px 0px;
  }
  .el-checkbox{
    margin-right:25px !important ;
  }
  .showList{
    padding-top:20px ;
    height: calc(100% - 156px);
    position: relative;
    float: left;
    width: 100%;
  }
  span.bar:before {
    content: '';
    border-right: 4px solid rgba(45, 116, 231, 1);
    margin-right: 10px;
  }
  .showUser{
    height: calc(100% - 65px);
    background: #EFF0F5;
    border-radius: 2px;
    overflow-y: auto;
  }
  .emptyClass{
    overflow: hidden;
    background:white;
  }
  .percentClass{
    display: block;
    
  }
  .userItem {
    background: white;
    margin: 10px 10px 0px 10px;
    position: relative;
    float: left;
    width: calc(100% - 20px);
    padding: 10px;
    border-radius: 2px;
  }
  .userBaseInfo{
    width:100%;
    height: 70px;
    position: relative;
    float: left;
  }
  .planState{
    position: relative;
    float: left;
    width: 64px;
    height: 64px;
    background: rgb(224,234,251);
    text-align: center;
    padding: 7px 0px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    font-size: 14px;
  }
  .finished{
    background:rgba(45,116,231,0.4)
  }
  .unfinished{
    background:rgba(103,194,58,0.4)
  }
  .otherInfo{
    width: calc(100% - 104px);
    position: relative;
    float: left;
    font-size: 16px;
    cursor: pointer;
  }
  .peopleList,.peopleType,.planTime{
    width: 100%;
    position: relative;
    float: left;
    span{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      display: block;
      padding: 3px;
      font-size: 14px ;
    }
  }

  .clickTool{
    height: 100%;
    position: relative;
    right: 0px;
    top: calc((100% - 32px)/2);
    .icon{
      font-size: 20px;
      color: #2D74E7;
    }
  }
  .userCurrentInfo{
    height: 300px;
    width: 100%;
    position: relative;
    float: left;
  }

  .planInfo{
    margin-top: 10px;
    font-size: 14px;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: calc(100% - 20px);
    .mapTable >>> th.gutter {
      display: table-cell !important;
    }
    .mapTable >>> th.gutter {
      display: none !important;
    }
  }

</style>

