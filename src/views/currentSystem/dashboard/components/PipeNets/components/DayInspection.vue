<template>
  <div class="day-inspection">
    <span style="font-weight: bold">{{name}}</span>
    <number-display :infos="infos" :chartData="chartData"></number-display>
  </div>
</template>

<script>
import NumberDisplay from './NumberDisplay.vue'
export default {
  components: { NumberDisplay },
  props: {
    name: {
      type: String,
      default: '标题'
    },
    dayInspectionObject:{
      type:Object,
      default:() => {
        return {
          userCount: 0,
          onlineCount: 0,
          inspectionCount: 0,
        }
      }
    },
    dayInspection:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      infos: {
        color: '#61d0ee',
        totalName: '巡查任务总数',
        total: '0',
        leftName: '巡查人员数',
        leftNumber: '0',
        centerName: '在线人员数',
        centerNuber: '0',
        rightName: '已完成总数',
        rightNumber: '0'
      },
      chartData: []
    }
  },
  watch:{
    dayInspectionObject:{
      handler(newV, oldV) {
　　　　console.log("dayInspectionObject："+JSON.stringify(newV))
        this.dayInspectionObject = newV
        //赋值
        this.infos.leftNumber =  this.dayInspectionObject.userCount
        this.infos.centerNuber =  this.dayInspectionObject.onlineCount
        this.infos.rightNumber = this.dayInspectionObject.inspectionCount
　　　},
　　　deep: true
    },

    dayInspection(newV,oldV){
      console.log("dayInspection："+JSON.stringify(newV))
      this.dayInspection = newV

      this.chartData = this.dayInspection
    }
  },
}
</script>

<style lang="scss" scoped>
.day-inspection {
  padding: 10px;
  width: 100%;
  height: 100%;
}
</style>