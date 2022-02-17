<template>
  <div class="meter-reading-container">
    <span style="font-weight: bold">抄表数</span>
    <template v-for="item in meterReading">
      <amount :key="item.name" :title="item.name" :total="item.total" :plan="item.plan" :planNum="item.planNum" />
    </template>
  </div>
</template>

<script>
import Amount from '../../Layout/Amount'
export default {
  props: {
    meterReading: {
      type: Array,
      default: () => [
        {
          plan: true,
          name: '计划抄表数',
          total: 0,
          planNum: 0
        },
        {
          name: '已抄表数',
          total: 0,
          planNum: 0
        },
        {
          name: '未抄表数',
          total: 0,
          planNum: 0
        },
      ]
    }
  },
  components: {Amount},
  data() {
    return {
      // meterReading: [
      //   {
      //     plan: true,
      //     name: '计划抄表数',
      //     total: 2352,
      //     planNum: 2352
      //   },
      //   {
      //     name: '已抄表数',
      //     total: 102,
      //     planNum: 2352
      //   },
      //   {
      //     name: '未抄表数',
      //     total: 2250,
      //     planNum: 2352
      //   },
      // ]
    }
  },
  watch:{
    meterReading(newV,oldV){
      console.log("meterReading："+JSON.stringify(newV))
      this.meterReading = newV
    }
  }
}
</script>

<style lang="scss" scoped>
  .meter-reading-container {
    padding: 10px;
  }
</style>
