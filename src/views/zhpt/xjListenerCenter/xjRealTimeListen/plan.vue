<template>
<div class='peoplePage' v-loading='loading'>
  <el-row>
    <span class="title2">部门:</span>
    <el-select v-model="currentDepart" class="searchInput" @change="getUserList" size="small" placeholder="请选择部门">
      <el-option v-for="item of this.departInfo.departmentList" :key="'currentDepart_'+item.id" :label="item.name" :value="item.id" />
    </el-select>
    <span class="title2">人员:</span>
    <el-select v-model="currentUser" collapse-tags multiple filterable clearable class="searchInput" size="small" placeholder="请选择人员" @change="getDayPlan">
      <el-option v-for="item of userList" :key="'currentUser_'+item.id" :label="item.realName" :value="item.id" />
    </el-select>
    <span class="title2">日期：</span>
    <el-date-picker  :clearable="false" v-model="currentDate" size="small" class="searchInput" type="date" value-format="yyyy-MM-dd" @change="getDayPlan" :picker-options="startOptions" placeholder="选择日期">
    </el-date-picker>
  </el-row>
  <div class='showList'>
    <el-row style="padding: 5px 0px 20px 0px;">
      <span class="bar">巡查计划</span>
    </el-row>
    <div class='showUser' :class="(planList.length==0?'emptyClass':'')">
      <template v-if='planList.length==0'>
        <emptyShow :title='"暂无巡查计划"'></emptyShow>
      </template>
      <template v-else>
        <template v-for='(item,index) in planList'>
          <div class='userItem' :key="'userItem_'+index">
            <!-- 显示用户基本情况 -->
            <div class='userBaseInfo'>
              <div class='planState' :class="item.backgroundClass">
                  <span :title='item.planState'>{{item.planState}}</span>
              </div>
              <div class='otherInfo'>
                <div class='peopleList'>
                  <span :title="item.inspectUserList">{{item.inspectUserList}}</span>
                </div>  
                <div class='peopleType'>
                  <span :title="item.inspectType">{{item.inspectType}}</span>
                </div>              
                <div class='planTime'>
                  <span :title="(item.planBegindate.split(' ')[0]+'到'+item.planEnddate.split(' ')[0])">{{item.planBegindate.split(' ')[0]+"到"+item.planEnddate.split(' ')[0]}}</span>
                </div>
              </div>
              <div class='clickTool' style="float:right;">
                <el-tooltip effect="dark" content="任务完成情况" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(item,showContent.plan)">
                    <span class='icon iconfont iconjihua'></span>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <!-- 显示选择的内容情况 -->
            <div v-show="item.pageShow" class='userCurrentInfo'>
              <!-- 显示任务情况 -->
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
                    <!-- <el-table-column align='center'  prop="completionRate" label="计划完成率" show-overflow-tooltip /> -->
                    <el-table-column  align='center' prop="percent" label="完成率" show-overflow-tooltip >
                      <template slot-scope="scope"><span class='percentClass' :class="((scope.row.completionRate<=scope.row.percent)?stateList.finishedClass:stateList.unfinishedClass)">{{ (scope.row.percent||"0"+"%")}}</span></template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import tool from './tool'
import {getDayPlan} from '@/api/xjApi'
import emptyShow from './otherVue/emptyShow'
import peoplePlan from './otherVue/peoplePlan'
import {IP} from '@/utils/request'
import {getAllUserInfo} from '@/api/base'

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
      currentUser:[],//当前的用户
      currentDate:'',//查询日期
      planList:[],//列表渲染的计划
      showContent:{//明确当前查看的是什么内容
        path:'path',//展示内容轨迹
      },
      token:'',//系统的token
      stateList:{
        finished:['计划完成','计划已作废'],
        unfinished:[],
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
        this.getDayPlan();
      }).catch(e=>{
        this.loading=false;
      })
    },

    getDayPlan(){
      const params={
        deptId:this.currentDepart,
        inspectUsers:this.currentUser.length==0?(this.userList.map(e=>{return e.id}).join(",")):this.currentUser.join(","),
        planBegindate:tool.getDayStartTime(this.currentDate),
        planEnddate: tool.getDayEndTime(this.currentDate),
        isDispatching: 1
      }
      this.loading=true;
      getDayPlan(params).then(res=>{
        res.result.records.forEach(item=>{
          this.initPeopleInfo(item)
        })
        this.planList=res.result.records
        this.loading=false;
      }).catch(e=>{
        this.loading=false;
      })
    },

    /**初始化轨迹、设备、计划内容*/
    initPeopleInfo(peopleInfo){
      peopleInfo.pageShowContent='';
      peopleInfo.pageShow=false;
      if(peopleInfo.planTypeOverList){
        peopleInfo.planTypeOverList.forEach(item=>{
          item.overCount=item.overCount||0;
          item.percent=item.percent||0;
          item.totalCount=item.totalCount||0;
          item.completionRate=item.completionRate||0;
        })
      }
      if(this.stateList.finished.includes(peopleInfo.planState)){
        peopleInfo.backgroundClass=this.stateList.finishedClass;
      }else{
        peopleInfo.backgroundClass=this.stateList.unfinishedClass;
      }
    },

    /**当前操作的用户及其查看的内容*/
    showWay(peopleInfo,action){
      //是否已打开的了人员信息
      if(this.currentShowPeople){
        //本次打开人员与上次打开人员是一个且本次操作与上次操作是一样的,初始化内容并返回
        if(this.currentShowPeople==peopleInfo&&this.currentShowPeople.pageShowContent==action){
          this.initPeopleInfo(this.currentShowPeople);
          tool.closePlay(this.$store)
          return
        }
        this.initPeopleInfo(this.currentShowPeople);
        this.currentShowPeople=peopleInfo;
      }else{
        this.currentShowPeople=peopleInfo;
      }
      this.currentShowPeople.pageShow=true;
      this.currentShowPeople.pageShowContent=action;
    },
  }
}
</script>

<style lang="scss" scoped>
.peoplePage{
  height: 100%;
}
  .title2{
    display:inline-block;width:50px;
  }
  .searchInput{
    display: inline-block;width:calc(100% - 60px);
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
    height: calc(100% - 25px);
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

