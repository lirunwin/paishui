<template>
  <div class="month-inspection">
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
    monthInspectionObject:{
      type:Object,
      default:() => {
        return {
          userCount: 0,
          onlineCount: 0,
          inspectionCount: 0,
        }
      }
    },
    monthInspection:{
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
    monthInspectionObject:{
      handler(newV, oldV) {
　　　　console.log("monthInspectionObject："+JSON.stringify(newV))
        this.monthInspectionObject = newV
        //赋值
        this.infos.leftNumber =  this.monthInspectionObject.userCount
        this.infos.centerNuber =  this.monthInspectionObject.onlineCount
        this.infos.rightNumber = this.monthInspectionObject.inspectionCount
　　　},
　　　deep: true
    },

    monthInspection(newV,oldV){
      console.log("monthInspection："+JSON.stringify(newV))
      this.monthInspection = newV

      this.chartData = this.monthInspection
    }
  },

}
</script>

<style lang="scss" scoped>
.month-inspection {
  padding: 10px;
  width: 100%;
  height: 100%;
}
</style>