<template>
  <blocks title="管网">
    <el-row :gutter="40"  v-if="controls.top.length > 0 " type="flex" style="height: 320px">
      <template v-for="item in controls.top">
        <el-col :key="item.key" :span="span(controls.top.length)" class="show-divider">
          <pipelength v-if="validateAuth('pipeLength') && item.key === 'pipeLength'" :name="item.name" :pipelength = pipelengthList></pipelength>
          <material-classfication v-if="validateAuth('materialClassfication') && item.key === 'materialClassfication'" :name="item.name" :materialClassfication = materialClassficationList></material-classfication>
          <day-inspection v-if="validateAuth('dayInspection') && item.key === 'dayInspection'" :name="item.name" :dayInspectionObject = dayInspectionObject :dayInspection = dayInspectionList></day-inspection>
          <month-inspection v-if="validateAuth('monthInspection') && item.key === 'monthInspection'" :name="item.name" :monthInspectionObject = monthInspectionObject :monthInspection = monthInspectionList></month-inspection>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="40" v-if="controls.bottom.length > 0 " type="flex" style="height: 320px">
      <template v-for="item in controls.bottom">
        <el-col :key="item.key" :span="span(controls.bottom.length)" class="show-divider top-divider">
          <hidden-danger v-if="validateAuth('hiddenDanger') && item.key === 'hiddenDanger'" :name="item.name" :hiddenDanger = hiddenDangerList ></hidden-danger>
          <site-conditions v-if="validateAuth('siteConditions') && item.key === 'siteConditions'" :name="item.name" :siteConditions = siteConditionsList></site-conditions>
          <current-month-fix-conditions v-if="validateAuth('currentMonthFixConditions') && item.key === 'currentMonthFixConditions'" :name="item.name" :currentMonthFixConditions = currentMonthFixConditionsList></current-month-fix-conditions>
        </el-col>
      </template>
    </el-row>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import MaterialClassfication from './components/MaterialClassfication'
import Pipelength from './components/Pipelength'
import HiddenDanger from './components/HiddenDanger'
import SiteConditions from './components/SiteConditions'
import CurrentMonthFixConditions from './components/CurrentMonthFixConditions'
import DayInspection from './components/DayInspection'
import MonthInspection from './components/MonthInspection'
import auth from '../../mixins/DashboardAuth'

import { pipelengthList,materialClassficationList,usernspectionList,dayinspectionList,monthinspectionList,hiddenDangerAndSiteConditionsList,currentMonthFixConditionsList } from '@/api/dashboard'
// import { forEach } from 'element-resize-detector/src/collection-utils'

export default {
  components: { Blocks, Pipelength, MaterialClassfication, HiddenDanger, SiteConditions, CurrentMonthFixConditions, DayInspection, MonthInspection },
  mixins: [auth],
  computed: {
    span() {
      return function(length) {
        return 24 / length
      }
    }
  },
  data() {
    return {
      controls: {
        top: [
          {
            key: 'pipeLength',
            name: '累计分片区管线长度情况'
          },
          {
            key: 'materialClassfication',
            name: '累计管线材质分类情况'
          },
          {
            key: 'dayInspection',
            name: '当日巡查情况'
          },
          {
            key: 'monthInspection',
            name: '当月巡查情况'
          },
        ],
        bottom : [
          {
            key: 'hiddenDanger',
            name: '累计隐患情况'
          },
          {
            key: 'siteConditions',
            name: '累计工地情况'
          },
          {
            key: 'currentMonthFixConditions',
            name: '当月抢维修情况'
          }
        ]
      },

      pipelengthList:[],  //分片区管线长度情况
      materialClassficationList:[],   //管线材质统计情况

      dayInspectionList:[],   //当日巡检数量
      dayInspectionObject:{   //当日巡检人员、在线人员、完成总数
       userCount : 0,
       onlineCount : 0,
       inspectionCount : 0
      },

      monthInspectionList:[],   //当月巡检数量
      monthInspectionObject:{   //当日巡检人员、在线人员、完成总数
       userCount : 0,
       onlineCount : 0,
       inspectionCount : 0
      },

      hiddenDangerList:[],   //当月隐患情况
      siteConditionsList:[],   //当月工地情况
      currentMonthFixConditionsList:[]    //当月抢修情况
    }
  },
  created(){
    this.controls.top = this.setControls(this.controls.top) 
    this.controls.bottom = this.setControls(this.controls.bottom)

    this.getPipelengthList();     //分片区管线长度情况
    this.getMaterialClassficationList();     //管线材质统计情况
    this.getDayinspectionList();    //当日巡检情况
    this.getMonthinspectionList();    //当月巡检数量
    this.gethiddenDangerAndSiteConditionsList();    //巡检统计所有隐患/工地数据
    this.getCurrentMonthFixConditionsList();    //当月抢维修

  },

  methods: {

    /**
     * @description 分片区管线长度情况
     */
    getPipelengthList(){
      var that = this

      that.pipelengthList = []

      pipelengthList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               let _value = Math.floor(item.totalPipeLength * 10) / 10
               that.pipelengthList.push({value:_value,name:item.groupAreaName})
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 管线材质统计情况
     */
    getMaterialClassficationList(){
      var that = this
      that.materialClassficationList = []

      materialClassficationList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               let _value = Math.floor(item.num * 10) / 10
               that.materialClassficationList.push({value:_value,name:item.material})
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 当日巡查情况
     */
    getDayinspectionList(){
      var that = this
     

      //图表
      dayinspectionList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            let _inspectionCount = 0
            that.dayInspectionList = []
            _resultList.forEach(function(item, index) {
               _inspectionCount+=item.completeNum

               that.dayInspectionList.push({
                //  typeName:item.typeName,
                 completeNum:item.completeNum || 0,
                 unfinishedNum:item.unfinishedNum || 0,
               })
            })
            that.dayInspectionObject.inspectionCount = _inspectionCount
         }else{
           that.$message.error(res.message)
         }
      })

       //巡检人
      usernspectionList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            console.log("测试："+JSON.stringify(_resultList))
            that.dayInspectionObject.userCount = _resultList.clockNum
            that.dayInspectionObject.onlineCount = _resultList.onlineNum
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 当月巡查情况
     */
    getMonthinspectionList(){
      var that = this
      monthinspectionList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            let _inspectionCount = 0
             _resultList.forEach(function(item, index) {
               _inspectionCount+=item.completeNum

               that.monthInspectionList.push({
                //  typeName:item.typeName,
                 completeNum:item.completeNum,
                 unfinishedNum:item.unfinishedNum,
               })
            })
            that.monthInspectionObject.inspectionCount = _inspectionCount
            
         }else{
           that.$message.error(res.message)
         }
      })

      //巡检人 月统计
      usernspectionList({flag:1}).then(res => {
        // console.log(res)
        if(res.code !== -1) {
            let _resultList = res.result
            console.log("测试："+JSON.stringify(_resultList))
            that.monthInspectionObject.userCount = _resultList.clockNum
            that.monthInspectionObject.onlineCount = _resultList.onlineNum
            
        }else{
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 累计 巡检统计所有隐患/工地数据
     */
    gethiddenDangerAndSiteConditionsList(){
      var that = this
      hiddenDangerAndSiteConditionsList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            //隐患
            that.hiddenDangerList.push(_resultList.totalTrouble);   //监护工地数
            that.hiddenDangerList.push(_resultList.completedTrouble);    //消除隐患数
            that.hiddenDangerList.push(_resultList.unfinishedTrouble);   //剩余隐患数

            //工地
            that.siteConditionsList.push(_resultList.totalBuild);   //监护工地数
            that.siteConditionsList.push(_resultList.completedBuild);    //监护已结束的工地
            that.siteConditionsList.push(_resultList.unfinishedBuild);   //未结束的工地

         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 当月抢维修
     */
    getCurrentMonthFixConditionsList(){
      var that = this
      currentMonthFixConditionsList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            that.currentMonthFixConditionsList = []
           _resultList.forEach(function(item, index) {
              that.currentMonthFixConditionsList.push({
                completedOrder:item.completedOrder,
                orderRate:item.orderRate,
                regionName:item.regionName,
                totalOrder:item.totalOrder,
                unfinishedOrder:item.unfinishedOrder
              })
           })
            

            // that.currentMonthFixConditions = _resultList
         }else{
           that.$message.error(res.message)
         }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.show-divider {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    right: 0;
    width: 1px;
    height: 95%;
    background: #eff0f5;
  }
}
.top-divider {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20px;
    width: 95%;
    height: 1px;
    background: #eff0f5;
  }
}
</style>