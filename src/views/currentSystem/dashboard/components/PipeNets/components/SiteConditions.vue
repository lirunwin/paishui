<template>
  <div class="site-conditions-amount">
    <total-dispaly :infos="meterAmount">
      <template slot="title">
        <span style="font-weight: bold">{{name}}</span>
      </template>
    </total-dispaly>
  </div>
</template>

<script>
import TotalDispaly from '../../MeterServiceManage/components/TotalDispaly.vue'
export default {
  components: { TotalDispaly },
  props: {
    name:{
       type: String,
       default: '小组件标题'
    },
    siteConditions:{
      type: Array,
      default: () => [0,0,0]
    }
  },
  data() {
    return {
      meterAmount: {
        color: '#508ada',
        totalName: '巡查工地数',
        total: '0',
        leftName: '已监护结束的工地数',
        leftNumber: '0',
        rightName: '未监护结束工地数',
        rightNumber: '0'
      }
    }
  },
  watch:{
    siteConditions(newV,oldV){
      console.log("siteConditions："+JSON.stringify(newV))
      this.siteConditions = newV
      //设置
      this.meterAmount.total = this.siteConditions[0]
      this.meterAmount.leftNumber = this.siteConditions[1]
      this.meterAmount.rightNumber = this.siteConditions[2]
    }
  },
}
</script>

<style lang="scss" scoped>
.site-conditions-amount {
  width: 100%;
  height: 100%;
}
</style>