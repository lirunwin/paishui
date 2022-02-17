<template>
  <div class="meter-reading-container">
    <span style="font-weight: bold">{{name}}</span>
    <template v-for="item in meterReading">
      <amount :key="item.name" :title="item.name" :total="item.total" :plan="item.plan" :planNum="item.planNum" :surfaceColor="item.surfaceColor" :triangleColor="item.triangleColor" :tipColor="item.tipColor" />
    </template>
  </div>
</template>

<script>
import Amount from '../../Layout/Amount'
export default {
  components: { Amount },
  props: {
    name:{
       type: String,
       default: '小组件标题'
    },
    hiddenDanger:{
      type: Array,
      default: () => [0,0,0]
    }
  },
  data() {
    return {
      meterReading: [
        {
          plan: true,
          name: '隐患总数',
          total: 0,
          planNum: 0,
          surfaceColor: 'linear-gradient(to right, #ed374b, #ee9331)',
          tipColor: 'linear-gradient(to bottom, #ed374b, #ee9331)',
          triangleColor: '#ed394b transparent transparent transparent'
        },
        {
          name: '消除隐患数',
          total: 0,
          planNum: 0,
          surfaceColor: 'linear-gradient(to right, #2dc67c, #48dc95)',
          tipColor: 'linear-gradient(to bottom, #39ca85, #2cba76)',
          triangleColor: '#26b470 transparent transparent transparent'
        },
        {
          name: '剩余隐患数',
          total: 0,
          planNum: 0,
          surfaceColor: 'linear-gradient(to right, #ee9432, #e7bc48)',
          tipColor: 'linear-gradient(to bottom, #eaa93d, #e28b28)',
          triangleColor: '#e38c29 transparent transparent transparent'
        },
      ]
    }
  },
  watch:{
    hiddenDanger(newV,oldV){
      console.log("hiddenDanger："+JSON.stringify(newV))
      this.hiddenDanger = newV
      //设置
      this.meterReading[0].total = this.hiddenDanger[0]
      this.meterReading[0].planNum = this.hiddenDanger[0]

      this.meterReading[1].total = this.hiddenDanger[1]
      this.meterReading[1].planNum = this.hiddenDanger[0]

      this.meterReading[2].total = this.hiddenDanger[2]
      this.meterReading[2].planNum = this.hiddenDanger[0]
    }
  },
}
</script>

<style lang="scss" scoped>
  .meter-reading-container {
    padding: 10px;
  }
</style>
