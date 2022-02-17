<template>
  <blocks title="热线管理系统">
    <el-row type="flex" :gutter="20"  v-if="controls.top.length > 0">
      <template v-for="item in controls.top">
        <el-col :key="item.key" :span="span(controls.top.length)" style="width: 100%; height: 320px" class="show-divider">
          <call-flow v-if="validateAuth('callFlow') && item.key === 'callFlow'" :name="item.name" :callFlowList = callFlowList></call-flow>
          <incoming-call-lose v-if="validateAuth('incomingCallLose') && item.key === 'incomingCallLose'" :name="item.name" :incomingCallLoseObject = incomingCallLoseObject></incoming-call-lose>
        </el-col>
      </template>
    </el-row>
    <el-row type="flex" :gutter="20" v-if="controls.bottom.length > 0" style="margin-top: 10px">
      <template v-for="item in controls.bottom">
        <el-col :key="item.key" :span="span(controls.bottom.length)" style="height: 280px" class="show-divider top-divider">
          <return-rate v-if="validateAuth('returnRate') && item.key === 'returnRate'" :name="item.name" :returnRateObject = returnRateObject></return-rate>
          <satisfaction v-if="validateAuth('satisfaction') && item.key === 'satisfaction'" :name="item.name" :satisfactionObject = satisfactionObject></satisfaction>
        </el-col>
      </template>
    </el-row>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import BusinessData from './components/BusinessData'
import ReturnRate from './components/ReturnRate'
import CallFlow from './components/CallFlow'
import IncomingCallLose from './components/IncomingCallLose'
import Satisfaction from './components/Satisfaction'
import auth from '../../mixins/DashboardAuth'

import { getHotlineSatisfaction, getHotlineOutLoss,getHotlineTrafficFlow } from '@/api/dashboard'

export default {
  components: { Blocks, BusinessData, ReturnRate,CallFlow, IncomingCallLose, Satisfaction},
  mixins: [auth],
  data() {
    return {
      controls: {
        top: [
          {
            key: 'callFlow',
            name: '当月话务流量'
          },
          {
            key: 'incomingCallLose',
            name: '当月呼入呼损'
          },
        ],
        bottom: [
          {
            key: 'returnRate',
            name: '当月呼出呼损'
          },
          {
            key: 'satisfaction',
            name: '当月满意度'
          }
        ]
      },

      callFlowList:[],
      incomingCallLoseObject:{
        totalInbound:0,
        inboundNum:0,
        inboundLossNum:0
      },
      returnRateObject:{
        totalOut:0,
        outNum:0,
        outLossNum:0
      },
      satisfactionObject:{
        totalReturn:0,
        greatSatisfactionNum:0,
        satisfactionNum:0,
        generalNum:0,
        dissatisfactionNum:0
      },

    }
  },
  created(){
    this.controls.top = this.setControls(this.controls.top)
    this.controls.bottom = this.setControls(this.controls.bottom)

    this.callFlowList = []

    this.getIncomingCallLose()
    this.getReturnRate()
    this.getSatisfaction()

  },
  computed: {
    span() {
      return function(value) {
        return 24 / value
      }
    }
  },
   methods: {
    /**
     * @description 呼入呼损
     */
    getIncomingCallLose(){
      var that = this
      getHotlineTrafficFlow({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result

            that.incomingCallLoseObject.totalInbound = _resultList.totalInbound
            that.incomingCallLoseObject.inboundNum = _resultList.inboundNum
            that.incomingCallLoseObject.inboundLossNum = _resultList.inboundLossNum

            //记录柱状数据
            that.callFlowList.push({
              name:'呼入总数',
              value:_resultList.totalInbound
            })
            that.callFlowList.push({
              name:'呼入接通数',
              value:_resultList.inboundNum
            })

            // _resultList.forEach(function(item, index) {
            //    that.monthCertificationTypeList.push({
            //      name:item.cname,
            //      month:item.dateTime,
            //      value:item.num,
            //    })
            // })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 呼出呼损
     */
    getReturnRate(){
      var that = this
      getHotlineOutLoss({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            that.returnRateObject.totalOut = _resultList.totalOut
            that.returnRateObject.outNum = _resultList.outNum
            that.returnRateObject.outLossNum = _resultList.outLossNum

            //记录柱状数据
            that.callFlowList.push({
              name:'呼出总数',
              value:_resultList.totalOut
            })
            that.callFlowList.push({
              name:'呼出接通数',
              value:_resultList.outNum
            })

         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 满意度
     */
    getSatisfaction(){
      var that = this
      getHotlineSatisfaction({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            that.satisfactionObject.totalReturn = _resultList.totalReturn
            that.satisfactionObject.greatSatisfactionNum = _resultList.greatSatisfactionNum
            that.satisfactionObject.satisfactionNum = _resultList.satisfactionNum 
            that.satisfactionObject.generalNum = _resultList.generalNum
            that.satisfactionObject.dissatisfactionNum = _resultList.dissatisfactionNum
         }else{
           that.$message.error(res.message)
         }
      })
    },

  },
  mounted() {
    // this.drawChart()
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