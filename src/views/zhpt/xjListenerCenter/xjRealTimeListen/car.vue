<template>
<div class='peoplePage' v-loading='loading'>
  <el-row>
    <span class="title2">部门:</span>
    <el-select v-model="currentDepart" class="searchInput" @change="getUserList" size="small" placeholder="请选择部门">
      <el-option v-for="item of this.departInfo.departmentList" :key="'currentDepart_'+item.id" :label="item.name" :value="item.id" />
    </el-select>
    <span class="title2">车辆:</span>
    <el-select v-model="currentUser" collapse-tags multiple filterable clearable class="searchInput" size="small" placeholder="请选择人员" @change="getShowUserList">
      <el-option v-for="item of userList" :key="'currentUser_'+item.carNo" :label="item.carNo" :value="item.carNo" />
    </el-select>
    <span class="title2">日期：</span>
    <el-date-picker  :clearable="false" v-model="currentDate" size="small" class="searchInput" type="date" value-format="yyyy-MM-dd" @change="getUserList" :picker-options="startOptions" placeholder="选择日期">
    </el-date-picker>
    <!-- <span class="title2">状态：</span>
    <el-checkbox-group  class="searchInput" @change='getShowUserList' v-model="checkList">
      <el-checkbox class='el-checkbox' value='上班' label="上班"></el-checkbox>
      <el-checkbox class='el-checkbox' value='下班' label="下班"></el-checkbox>
      <el-checkbox class='el-checkbox' value='未打卡' label="未打卡"></el-checkbox>
    </el-checkbox-group> -->
  </el-row>
  <div class='showList'>
    <el-row style="padding: 5px 0px 20px 0px;">
      <span class="bar">车辆</span>
    </el-row>
    <div class='showUser' :class="(showUserList.length==0?'emptyClass':'')">
      <template v-if='showUserList.length==0'>
        <emptyShow :title='"暂无巡查车辆"'></emptyShow>
      </template>
      <template v-else>
        <template v-for='(item,index) in showUserList'>
          <div class='userItem' :key="'userItem_'+index">
            <!-- 显示用户基本情况 -->
            <div class='userBaseInfo'>
              <div class='peopleState' :class='item.peopleBackground'>
                <div class='image'>
                  <!-- <template v-show='item.avatar'>
                    <el-image style="width: 32px; height: 32px" :src="item.avatar" :fit="cover">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-s-custom"></i>
                      </div>
                    </el-image>
                  </template> -->
                  <template v-if='item.avatar'>
                    <el-avatar :size="32" :src='item.avatar'></el-avatar>
                  </template>
                  <template v-else>
                    <el-avatar :size="32" :src='item.peopleBackgroundSVG'> </el-avatar>
                  </template>
                </div>
                <span style="font-size:12px">{{item.signType}}</span>
              </div>
              <div class='carInfo' :title='"点击定位"' @click='goToPoint(item)'>
                <span class='carNo'>{{item.carNo}}</span>
                <span>车辆负责人：{{item.chargePersonName}}</span>
                <span>车牌使用用：{{item.user}}</span>
              </div>
              <!-- <div class='userName'>{{item.signUserName}}</div> -->
              <div class='clickTool' style="float:right;">
                <el-tooltip effect="dark" content="车辆轨迹" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(item,showContent.path)">
                    <span class='icon iconfont iconguiji'></span>
                    <!-- <img src="./images/guiji.png" width="20px" height="20px" style="object-fit: contain"> -->
                  </el-button>
                </el-tooltip>
                <!-- <el-tooltip effect="dark" content="设备使用情况" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(item,showContent.equipment)">
                    <img src="./images/sbrj.png" width="20px" height="20px" style="object-fit: contain">
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="任务完成情况" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(item,showContent.plan)">
                    <img src="./images/cbjhgl.png" width="20px" height="20px" style="object-fit: contain">
                  </el-button>
                </el-tooltip> -->
              </div>
            </div>
            <!-- 显示选择的内容情况 -->
            <div v-show="item.pageShow" class='userCurrentInfo'>
              <!-- 显示轨迹情况 -->
              <template v-if="item.pagePathInfo&&item.pageShowContent==showContent.path">
                <ul class='pathInfoDiv'>
                  <li v-for="(pathitem, index) in item.pagePathInfo.splitPath" :key="'pathInfoDivLi_'+index">
                    <el-button icon="el-icon-video-play" style="padding:8px;margin-right: 4px;" @click="playMove(item,pathitem)"></el-button>
                    <span class="name">{{pathitem.userName+"："+pathitem.timeFrom.split(' ')[1] + ' - ' + pathitem.timeTo.split(' ')[1] }}</span>
                  </li>
                  <li v-if="item.pagePathInfo.splitPath.length == 0" class="el-link el-link--default">
                      <emptyShow :title='"暂无巡查轨迹"'></emptyShow>
                  </li>
                </ul>
              </template>
              <!-- 显示设备情况 -->
              <!-- <template v-if="item.pageShowContent==showContent.equipment">
                <div class='equipmentInfo'>
                  <el-table class="mapTable" :data="item.pageEquipmentInfo.infoList" border  height="calc(100% - 40px)">
                    <template slot="empty">
                      <emptyShow :title='"暂无设备使用信息"'></emptyShow>
                    </template>
                    <el-table-column align='center' prop="gpsTime" label="时间" show-overflow-tooltip>
                      <template slot-scope="scope">{{ scope.row.gpsTime?scope.row.gpsTime.split(" ")[1]:'' }}</template>
                    </el-table-column>
                    <el-table-column align='center' prop="network" label="设备状态"  show-overflow-tooltip>
                      <template slot-scope="scope">{{ ([,'卫星', '前次',, '缓存', 'Wifi', '基站',, '离线', '最后位置'][scope.row.network] || '未知类型') + '定位' }}</template>
                    </el-table-column>
                  </el-table>
                  <el-row style="margin-top: 8px">
                    <el-pagination small background layout="total,prev,pager, next"  
                    :ref='"equipmentInfo_"+item.signUser'
                    :page-size="item.pageEquipmentInfo.size" 
                    :current-page="item.pageEquipmentInfo.current"  
                    :total="item.pageEquipmentInfo.total" 
                    @current-change="getEquipmentInfo(item)" 
                    @size-change="getEquipmentInfo(item)" 
                    style=" width: 100%; display: inline-block;" />
                  </el-row>
                </div>
              </template> -->
              <!-- 显示任务情况 -->
              <!-- <template v-if="item.pageShowContent==showContent.plan">
                <div class='planInfo'>
                  <el-table class="mapTable" :show-header="false" :default-expand-all="true" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :data="item.pagePlanInfo.infoList" border  height="calc(100% - 40px)">
                    <template slot="empty">
                      <emptyShow :title='"暂无巡检计划信息"'></emptyShow>
                    </template>
                    <el-table-column key="1"  prop="type" label="任务状态" show-overflow-tooltip />
                    <el-table-column key="2"  prop="state" label="完成率" width="120" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px">
                    <el-pagination small background layout="total,prev,pager, next"  
                    :ref='"planInfo_"+item.signUser'
                    :page-size="item.pagePlanInfo.size" 
                    :current-page="item.pagePlanInfo.current"  
                    :total="item.pagePlanInfo.total" 
                    @current-change="getPlanInfo(item)" 
                    @size-change="getPlanInfo(item)" 
                    style=" width: 100%; display: inline-block;" />
                  </el-row>
                </div>
              </template> -->
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
import {getCarMonitor,getSectionMulti,getEquipmentInfo,getGPSAll} from '@/api/xjApi'
import emptyShow from './otherVue/emptyShow'
import peoplePlan from './otherVue/peoplePlan'
import {IP} from '@/utils/request'
import nosignSVG from "@/assets/icon/carNoSign.svg"
import ondutySVG from "@/assets/icon/carOnDuty.svg"
import offdutySVG from "@/assets/icon/carOnDuty.svg"
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
      showUserList:[],//列表渲染的用户
      peopleLayer:null,
      peopleLayerId:'',
      showContent:{//明确当前查看的是什么内容
        path:'path',//展示内容轨迹
        // equipment:'equipment',//展示设备内容
        // plan:'plan',//展示计划内容
      },
      peopleBackground:{//添加背景颜色
        nosign:'nosign',//未打卡
        onduty:"onduty",//上班
        offduty:"offduty",//下班
        nosignSVG:nosignSVG,
        ondutySVG:nosignSVG,
        offdutySVG:offdutySVG
      },
      token:'',//系统的token
      //开始时间控制选择
      startOptions:{
        disabledDate: (time) => {
          return time.getTime() > new Date()
        }
      },
      currentShowPeople:null,//目前展示内容的人员信息
      // pageType:{//查询改变的标识
      //   size:"size",//页数改变
      //   current:"current",//翻页改变
      // }
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
      getCarMonitor({current:1,size:1000,departmentId:this.currentDepart,date:this.currentDate?tool.getDayEndTime(this.currentDate):""}).then(res=>{
        const tempList=res.result.records||[];
        tempList.forEach(item=>{
          item.signType=(item.signType=='离线'?'未打卡':item.signType);
          item.peopleBackground=(item.signType=='未打卡'?this.peopleBackground.nosign:(item.signType=='上班'?this.peopleBackground.onduty:this.peopleBackground.offduty));
          item.peopleBackgroundSVG=(item.signType=='未打卡'?this.peopleBackground.nosignSVG:(item.signType=='上班'?this.peopleBackground.ondutySVG:this.peopleBackground.offdutySVG));
          item.avatar =(item.avatar?(IP + '/base/file/loadImg?access_token=' + this.token + '&remotePath=' +item.avatar):'');
          item.user=(item.carUser&&item.carUser.length>0)?item.carUser[0].userName:"";
          this.initPeopleInfo(item);
        })
        this.userList=tempList;
        this.loading=false;
        this.getShowUserList();
      }).catch(e=>{
        this.loading=false;
      })
    },

    /**获取条件过滤后的人员*/
    getShowUserList(){
      this.showUserList=[];
      const tempUserList=[];
      //重新查询关闭播放器
      tool.closePlay(this.$store)
      //首先条件过滤人员
      for(let item of this.userList){
        //当选取人员后，人员必须在选择范围内
        if(this.currentUser.length>0&&!this.currentUser.includes(item.carNo)){
          continue;
        }
        //当选取状态后，人员状态必须在选择的状态内
        if(this.checkList.length>0&&!this.checkList.includes(item.signType)){
          continue;
        }
        this.initPeopleInfo(item);
        tempUserList.push(item);
      }
      this.showUserList=tempUserList;
      this.mapShowPeople(this.showUserList);
    },

    /**初始化轨迹、设备、计划内容*/
    initPeopleInfo(peopleInfo){
      peopleInfo.pageShowContent='';
      peopleInfo.pageShow=false;
      peopleInfo.pagePathInfo={splitPath:[],allPoint:null};//轨迹的内容
      // peopleInfo.pageEquipmentInfo={infoList:[],current:1,size:30,total:0};//设备的内容
      // peopleInfo.pagePlanInfo={infoList:[],current:1,size:30,total:0};//计划的内容
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
      switch(action){
        //请求轨迹信息
        case this.showContent.path:
          this.getSection(this.currentShowPeople);
        break;
        // //请求设备信息
        // case this.showContent.equipment:
        //   this.$nextTick(e=>{
        //     this.getEquipmentInfo(this.currentShowPeople)
        //   })
        // break;
        // //请求计划信息
        // case this.showContent.plan:
        //   this.$nextTick(e=>{
        //     this.getPlanInfo(this.currentShowPeople);
        //   })
        break;
      }
    },

    /**获取轨迹信息*/
    getSection(peopleInfo){
      const param={
        deptId:this.currentDepart,
        userIds:peopleInfo.carUser.map(item=>{return item.id}).join(','),
        startDate:tool.getDayStartTime(this.currentDate),
        endDate:tool.getDayEndTime(this.currentDate)
      }
      //正式程序
      getSectionMulti(param).then(res=>{
        const temp=[];
        res.result.forEach(e=>{
          e.sectionData.forEach(item=>{
            const tempDate= item.split('段:')[1].split(' - ')
            temp.push({
              userName:e.realName||"", timeFrom: tempDate[0], timeTo: tempDate[1],userId:e.userId||''
            })
          })
        })
        peopleInfo.pagePathInfo.splitPath=temp;
      });
    },

    /**获取轨迹*/
    playMove(data,pathitem){
      tool.closePlay(this.$store)
      const params={
        userId:pathitem.userId,
        startDate:pathitem.timeFrom,
        endDate:pathitem.timeTo,
        isAsc:true
      }
      this.loading=true;
      getGPSAll(params).then(res=>{
        const timeTable = res.result.map((e) => {return {
          x: e.locationLongitude,
          y: e.locationLatitude,
          t: e.checkTime
        }})
        data.pagePathInfo.currentPath=timeTable
        this.loading=false;
        if(timeTable.length > 0){
          this.$store.dispatch('map/changeMethod', {
            pathId: 'roadPlayer', widgetid: 'FloatPanel',
            label: '浮动框', param: { view: this.mapView, times: timeTable }
          })
        } 
      })
    },

    /**在地图上显示车辆*/
    mapShowPeople(peopelList){
      const showList=[];
      peopelList.forEach(item=>{
        if(item.lng&&item.lat){
          showList.push({
            x:item.lng,
            y:item.lat,
            name:item.carNo||"",
            state:'sign'
            // state:this.stateList.unfinished.includes(item.auditResult)?'nosign':'sign'
          })
        }
      })
      this.$emit("addPoint",{type:'car',data:showList});
    },

    /**定位*/
    goToPoint(data){
      if(data.lng&&data.lat){
        this.mapView.getView().setZoom(19);
        this.$nextTick(e=>{
        this.mapView.getView().setCenter([data.lng,data.lat])})
      }else{
        this.$message.info("未上传坐标")
      }
    },
    // /**获取设备信息*/
    // getEquipmentInfo(data){
    //   const pages = (this.$refs["equipmentInfo_"+data.signUser] instanceof Array?(this.$refs["equipmentInfo_"+data.signUser][0]):this.$refs["equipmentInfo_"+data.signUser]);
    //   const params={
    //     startDate:tool.getDayStartTime(this.currentDate),
    //     endDate:tool.getDayEndTime(this.currentDate),
    //     userId:data.signUser,
    //     current:pages.internalPageSize,
    //     size:pages.internalCurrentPage,
    //   }
    //   // getEquipmentInfo(params).then(res=>{
    //   //   data.pageEquipmentInfo.infoList = res.records||[];
    //   //   data.pageEquipmentInfo.total=testData.result.total;
    //   // })

    //   //测试数据
    //   const testData={"code":1,"message":null,"result":{"records":[{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379638,"locationLatitude":30.850610,"speed":2.26,"direction":null,"network":"1","distance":7.55,"uploadTime":"2022-06-09 14:26:27","gpsTime":"2022-06-09 14:26:04","gpsTimespan":12,"gpsPrecision":"3","gpsStar":15,"gpsSpeed":0.16,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:26:03","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379673,"locationLatitude":30.850549,"speed":1.35,"direction":null,"network":"1","distance":4.49,"uploadTime":"2022-06-09 14:26:15","gpsTime":"2022-06-09 14:25:52","gpsTimespan":12,"gpsPrecision":"3","gpsStar":16,"gpsSpeed":0.00,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:25:51","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379708,"locationLatitude":30.850522,"speed":1.59,"direction":null,"network":"1","distance":5.29,"uploadTime":"2022-06-09 14:26:03","gpsTime":"2022-06-09 14:25:40","gpsTimespan":12,"gpsPrecision":"3","gpsStar":18,"gpsSpeed":0.10,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:25:39","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379732,"locationLatitude":30.850479,"speed":5.74,"direction":null,"network":"1","distance":19.12,"uploadTime":"2022-06-09 14:25:51","gpsTime":"2022-06-09 14:25:28","gpsTimespan":12,"gpsPrecision":"3","gpsStar":21,"gpsSpeed":3.09,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:25:27","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379602,"locationLatitude":30.850610,"speed":0.57,"direction":null,"network":"1","distance":1.89,"uploadTime":"2022-06-09 14:25:39","gpsTime":"2022-06-09 14:25:16","gpsTimespan":12,"gpsPrecision":"3","gpsStar":20,"gpsSpeed":1.47,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:25:15","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379588,"locationLatitude":30.850598,"speed":3.61,"direction":null,"network":"1","distance":12.05,"uploadTime":"2022-06-09 14:25:27","gpsTime":"2022-06-09 14:25:04","gpsTimespan":12,"gpsPrecision":"3","gpsStar":15,"gpsSpeed":0.00,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:25:03","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379708,"locationLatitude":30.850565,"speed":3.49,"direction":null,"network":"1","distance":11.63,"uploadTime":"2022-06-09 14:25:15","gpsTime":"2022-06-09 14:24:52","gpsTimespan":12,"gpsPrecision":"4","gpsStar":17,"gpsSpeed":2.51,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:24:51","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379587,"locationLatitude":30.850575,"speed":6.89,"direction":null,"network":"1","distance":22.95,"uploadTime":"2022-06-09 14:25:03","gpsTime":"2022-06-09 14:24:40","gpsTimespan":12,"gpsPrecision":"3","gpsStar":14,"gpsSpeed":0.16,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:24:39","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379375,"locationLatitude":30.850478,"speed":5.56,"direction":null,"network":"1","distance":18.54,"uploadTime":"2022-06-09 14:24:51","gpsTime":"2022-06-09 14:24:28","gpsTimespan":12,"gpsPrecision":"5","gpsStar":8,"gpsSpeed":0.00,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:24:27","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null},{"id":null,"userId":146,"userName":"张孝银","locationLongitude":104.379497,"locationLatitude":30.850348,"speed":6.02,"direction":null,"network":"1","distance":20.06,"uploadTime":"2022-06-09 14:24:39","gpsTime":"2022-06-09 14:24:16","gpsTimespan":12,"gpsPrecision":"4","gpsStar":4,"gpsSpeed":0.00,"gpsState":"0","gpsId":null,"checkTime":"2022-06-09 14:24:15","gpsSection":9000,"isValid":"1","gpsType":"0","gpsDeviceId":null,"pdaId":null}],"total":691,"size":10,"current":2,"orders":[{"column":"uploadTime","asc":false}],"optimizeCountSql":true,"hitCount":false,"searchCount":true,"pages":70}}
    //   data.pageEquipmentInfo.infoList = testData.result.records||[];
    //   data.pageEquipmentInfo.total=testData.result.total;
    // },

    // //巡检计划数据
    // getPlanInfo(data){
    //   const pages = (this.$refs["planInfo_"+data.signUser] instanceof Array?(this.$refs["planInfo_"+data.signUser][0]):this.$refs["planInfo_"+data.signUser]);
    //   const params={
    //     planEnddate:tool.getDayEndTime(this.currentDate),
    //     planBegindate:tool.getDayStartTime(this.currentDate),
    //     inspectUsers:data.signUser,
    //     current:pages.internalPageSize,
    //     size:pages.internalCurrentPage,
    //   }
    //   // getPlanTimeIntervalPage(params).then(res=>{
    //   //   data.pagePlanInfo.total=res.result.total;
    //   //   let dataList=[];
    //   //   res.records.forEach((item,index)=>{
    //   //     let itemOne={
    //   //       id:'one'+index,
    //   //       type:item.inspectType,
    //   //       state:item.planState,
    //   //       children:[],
    //   //     }
    //   //     item.planTypeOverList.forEach((item2,index2)=>{
    //   //       itemOne.children.push({
    //   //         id:"two"+index+""+index2,
    //   //         type:item2.typeName,
    //   //         state:item2.percent?item2.percent+'%':'0%'
    //   //       })
    //   //     });
    //   //     dataList.push(itemOne);
    //   //   });
    //   //   data.pagePlanInfo.infoList=dataList;
    //   // })

    //   //测试数据
    //   const testData={"code":1,"message":null,"result":{"records":[{"id":1520,"planType":"临时性任务","planTypeName":null,"mouthId":null,"periodId":4,"periodIdName":"自定义","planBegindate":"2022-06-01 00:00:00","planEnddate":"2022-07-31 23:59:59","regionId":"A,B,C,D,E,G,F","regionName":"A片区,B片区,C片区,D片区,E片区,G片区,F片区","inspectType":"消火栓普查消火栓普查消火栓普查消火栓普查消火栓普查","inspectTypeName":null,"inspectContents":"[{\"layerName\":\"消防栓\",\"layerId\":11,\"typeId\":30,\"data\":[\"js10770\",\"js10783\",\"js10802\",\"js20572\",\"js20597\",\"js20600\",\"js20635\",\"js20641\",\"js20649\",\"js20653\",\"js20657\",\"js20690\",\"js20706\",\"js20735\",\"js20750\",\"js20818\",\"js20858\",\"js11884\",\"js11891\",\"js11902\",\"js11920\",\"js11928\",\"js11941\",\"js11953\",\"js12051\",\"js12150\",\"js12161\",\"js12191\",\"js12250\",\"js12727\",\"js13299\",\"js13341\",\"js13374\",\"js13389\",\"js13408\",\"js13649\",\"js13661\",\"js26862\",\"js26900\",\"js26927\",\"js27029\",\"js27040\",\"js27164\",\"js27306\",\"js27532\",\"js27613\",\"js27667\",\"js27832\",\"js27878\",\"js27950\",\"js28034\",\"js28120\",\"js28151\",\"js28158\",\"js28174\",\"js28184\",\"js28259\",\"js28281\",\"js28402\",\"js28419\",\"js28427\",\"js28438\",\"js28462\",\"js28475\",\"js28526\",\"js28536\",\"js28554\",\"js28562\",\"js28576\",\"js28588\",\"js28598\",\"js28609\",\"js29001\",\"js29014\",\"js29865\",\"js30024\",\"js30037\",\"js30044\",\"js30054\",\"js22406\",\"js22419\",\"js22467\",\"js22473\",\"js22659\",\"js22702\",\"js22830\",\"js22846\",\"js22875\",\"js22904\",\"js22912\",\"js22920\",\"js22930\",\"js22935\",\"js22948\",\"js22959\",\"js22970\",\"js22975\",\"js22987\",\"js23003\",\"js23017\",\"js23023\",\"js23028\",\"js23033\",\"js23043\",\"js23048\",\"js23054\",\"js23062\",\"js23070\",\"js23089\",\"js23093\",\"js23109\",\"js23118\",\"js23127\",\"js23820\",\"js23831\",\"js23843\",\"js23854\",\"js23887\",\"js23907\",\"js23917\",\"js23957\",\"js23965\",\"js24036\",\"js24055\",\"js24080\",\"js24101\",\"js24239\",\"js24539\",\"js24549\",\"js24558\",\"js24570\",\"js24581\",\"js24602\",\"js24622\",\"js24705\",\"js24835\",\"js24843\",\"js24857\",\"js24871\",\"js24885\",\"js24903\",\"js24924\",\"js24952\",\"js24984\",\"js25038\",\"js25107\",\"js25124\",\"js25146\",\"js25165\",\"js25194\",\"js25269\",\"js25305\",\"js25317\",\"js25374\",\"js25386\",\"js25403\",\"js25411\",\"js25448\",\"js25463\",\"js25590\",\"js25810\",\"js25857\",\"js25864\",\"js26024\",\"js26064\",\"js26084\",\"js26109\",\"js26135\",\"js26165\",\"js26182\",\"js26240\",\"js26286\",\"js26323\",\"js26372\",\"js26445\",\"js26459\",\"js26494\",\"js26639\",\"js26724\",\"js26763\",\"js26801\",\"js26812\",\"js30543\",\"js30551\",\"js30559\",\"js30568\",\"js30587\",\"js30595\",\"js30603\",\"js30611\",\"js30620\",\"js30628\",\"js30645\",\"js31074\",\"js31104\",\"js31113\",\"js31126\",\"js31138\",\"js31150\",\"js31162\",\"js31179\",\"js31190\",\"js42905\",\"js42928\",\"js42936\",\"js42941\",\"js42948\",\"js43061\",\"js43070\",\"js43088\",\"js43101\",\"js43108\",\"js43123\",\"js43141\",\"js43167\",\"js43174\",\"js43187\",\"js43216\",\"js43232\",\"js43267\",\"js43295\",\"js43362\",\"js43436\",\"js43454\",\"js43503\",\"js43578\",\"js43759\",\"js43835\",\"js44106\",\"js44508\",\"js44516\",\"js44531\",\"js49241\",\"js50016\",\"js50157\",\"js50168\",\"js50182\",\"js50207\",\"js50218\",\"js50226\",\"js50241\",\"js50283\",\"js50292\",\"js31205\",\"js31224\",\"js31245\",\"js31256\",\"js31306\",\"js31315\",\"js31337\",\"js31344\",\"js31358\",\"js31372\",\"js31407\",\"js31413\",\"js31437\",\"js31443\",\"js31457\",\"js31584\",\"js31591\",\"js31621\",\"js31639\",\"js31648\",\"js31662\",\"js31878\",\"js31885\",\"js31917\",\"js31930\",\"js32047\",\"js32058\",\"js32073\",\"js32085\",\"js32138\",\"js32159\",\"js32214\",\"js32310\",\"js32340\",\"js32364\",\"js32400\",\"js32428\",\"js32453\",\"js39394\",\"js39984\",\"js40006\",\"js40045\",\"js40054\",\"js40064\",\"js40073\",\"js40078\",\"js40085\",\"js40092\",\"js40095\",\"js40100\",\"js40105\",\"js40114\",\"js40183\",\"js40215\",\"js40366\",\"js40543\",\"js40559\",\"js40634\",\"js40649\",\"js40810\",\"js41065\",\"js41119\",\"js41394\",\"js41403\",\"js41409\",\"js41629\",\"js41816\",\"js41851\",\"js41856\",\"js41970\",\"js42278\",\"js42298\",\"js42303\",\"js42444\",\"js42856\",\"js42861\",\"js42868\",\"js42873\",\"js42883\",\"js42893\",\"js42900\",\"js30061\",\"js30073\",\"js30091\",\"js30097\",\"js30108\",\"js30113\",\"js30119\",\"js30120\",\"js30128\",\"js30357\",\"js30366\",\"js30468\",\"js30475\",\"js30484\",\"js30492\",\"js30501\",\"js30509\",\"js30518\",\"js30526\",\"js30533\",\"js30535\",\"js80477\",\"js80535\",\"js80543\",\"js80554\",\"js80566\",\"js80578\",\"js80586\",\"js80596\",\"js81173\",\"js81647\",\"js81675\",\"js89531\",\"js90050\",\"js90081\",\"js90123\",\"js90149\",\"js90155\",\"js90205\",\"js91700\",\"js91790\",\"jsa0176\",\"jsa0258\",\"jsa0296\",\"jsa0336\",\"jsa0349\",\"jsa0359\",\"jsa0509\",\"jsa0529\",\"jsa0543\",\"jsa0558\",\"jsa0597\",\"jsa0628\",\"jsa0664\",\"jsa0772\",\"jsa0824\",\"jsa0846\",\"jsa1037\",\"jsa1110\",\"jsa1139\",\"jsa1180\",\"jsa1325\",\"js50299\",\"js50309\",\"js50340\",\"js50354\",\"js50365\",\"js50370\",\"js50388\",\"js50403\",\"js50431\",\"js50443\",\"js50449\",\"js50472\",\"js50484\",\"js50497\",\"js50503\",\"js50517\",\"js50527\",\"js50543\",\"js50627\",\"js50647\",\"js50787\",\"js50889\",\"js50905\",\"js50999\",\"js51054\",\"js51329\",\"js51444\",\"js51493\",\"js51516\",\"js51690\",\"js51703\",\"js51730\",\"js51735\",\"js51744\",\"js51750\",\"js51757\",\"js51779\",\"js51855\",\"js51860\",\"js51870\",\"js51880\",\"js51886\",\"js51938\",\"js51959\",\"js70014\",\"js70021\",\"js70031\",\"js70041\",\"js70054\",\"js70062\",\"js70071\",\"js70078\",\"js70086\",\"js70156\",\"js70162\",\"js70170\",\"js70458\",\"js71418\",\"js72028\",\"js72222\",\"js72274\",\"js72296\",\"js72659\",\"js73289\",\"js74104\",\"js74166\",\"js74182\",\"js74214\",\"js74270\",\"js74279\",\"js75271\",\"js75300\",\"js75317\",\"js80089\",\"js80097\",\"js80126\",\"js80134\",\"js80143\",\"js80154\",\"js80160\",\"js80177\",\"js80186\",\"js80194\",\"js80211\",\"js80219\",\"js80228\",\"js80245\",\"js80250\",\"js80255\",\"js80272\",\"js80288\",\"js80309\",\"js80327\",\"js80340\",\"js80356\",\"js80367\",\"js80377\",\"js80385\",\"js80402\",\"js80412\",\"js80429\",\"js80443\",\"js80461\",\"js98434\",\"js98437\",\"js98039\",\"jsa1340\",\"jsa1366\",\"jsa1406\",\"jsa3016\",\"jsa3090\",\"jsa3143\",\"jsa3173\",\"jsa3237\",\"jsa3272\",\"jsa3311\",\"jsa3333\",\"jsa3511\",\"jsa3540\",\"jsa3583\",\"jsa3615\",\"jsa3796\",\"jsa3820\",\"jsa3861\",\"js98003\",\"js98006\",\"js98171\"]}]","isread":"未查看","isover":"","planState":"已开始未执行","intervalDay":null,"planPercent":100.0,"percent":null,"totalLength":0,"totalCount":741,"description":null,"lastTime":null,"lastUser":null,"createUser":33,"createUserName":"代慰","createTime":"2022-06-01 14:34:11","inspectGroup":"","inspectUserList":"冯梧桐,代慰","isDispatching":"已派工","isPlanStop":"否","isPlanInvalid":"否","planTypeOverList":[{"id":566,"planId":1520,"typeId":30,"typeName":"消火栓普查","completionRate":39.0,"percent":14.71,"overCount":109,"overLength":0,"totalLength":0,"totalCount":741}],"departmentName":"管网管理所","departmentId":8},{"id":978,"planType":"工地","planTypeName":null,"mouthId":null,"periodId":2,"periodIdName":"一周一巡","planBegindate":"2022-06-06 00:00:00","planEnddate":"2022-06-12 23:59:59","regionId":"E","regionName":"E片区","inspectType":"工地巡查","inspectTypeName":null,"inspectContents":"[{\"typeId\":15,\"layerName\":\"工地监护点\",\"layerId\":\"\",\"data\":[28]}]","isread":"未查看","isover":"","planState":"未开始","intervalDay":7,"planPercent":100.0,"percent":null,"totalLength":1,"totalCount":1,"description":null,"lastTime":null,"lastUser":null,"createUser":33,"createUserName":"代慰","createTime":"2022-05-09 16:58:28","inspectGroup":"","inspectUserList":"代慰,冯梧桐","isDispatching":"已派工","isPlanStop":"否","isPlanInvalid":"否","planTypeOverList":[],"departmentName":"管网管理所","departmentId":8}],"total":2,"size":50,"current":1,"orders":[],"optimizeCountSql":true,"hitCount":false,"searchCount":true,"pages":1}}
    //   data.pagePlanInfo.total=testData.result.total;
    //   let dataList=[];
    //   testData.result.records.forEach((item,index)=>{
    //       let itemOne={
    //         id:'one'+index,
    //         type:item.inspectType,
    //         state:item.planState,
    //         children:[],
    //       }
    //       item.planTypeOverList.forEach((item2,index2)=>{
    //         itemOne.children.push({
    //           id:"two"+index+""+index2,
    //           type:item2.typeName,
    //           state:item2.percent?item2.percent+'%':'0%'
    //         })
    //       });
    //       dataList.push(itemOne);
    //   });
    //   data.pagePlanInfo.infoList=dataList;
    
    // }
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
  .carInfo{
    width: 150px;
    height: 100%;
    position: relative;
    float: left;
    left: 10px;
    top: calc((100% - 42px)/2);
    cursor: pointer;
    span{
      display: block;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
    span.carNo{
      color: rgba(0, 0, 0, 1);
      font-style: normal;
      font-size: 14px;
    }
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
  .peopleState{
    position: relative;
    float: left;
    width: 64px;
    height: 64px;
    background: rgb(224,234,251);
    text-align: center;
    padding: 7px 0px;
    border-radius: 2px;
    .image{
      width: 32px;
      height: 32px;
      position: relative;
      left: calc((100% - 32px)/2);
    }
  }
  .nosign{
    background: rgb(240,240,240);
    color: rgb(153,153,153);
    .el-avatar{
      // background: rgb(153,153,153);
      background: none;
    }
  }
  .onduty{
    background: rgb(224,234,251);
    color: rgb(45,116,231);
    .el-avatar{
      // background: rgb(45,116,231);
      background: none;
    }
  }
  .offduty{
    background: rgb(232,246,226);
    color: rgb(103,194,58);
    .el-avatar{
      // background: rgb(103,194,58);
      background: none;
    }
  }
  .userName{
    position: relative;
    float: left;
    font-size: 14px;
    left: 10px;
    top: calc((100% - 15px)/2);
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
  .pathInfoDiv{
    list-style-type: none;
    margin: 0px;
    padding: 0px;
    border: 1px solid #dadada;
    li{
      width:100%;
      padding: 10px 5px 0px 5px;

    }
  }

  .equipmentInfo,.pathInfoDiv,.planInfo{
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

