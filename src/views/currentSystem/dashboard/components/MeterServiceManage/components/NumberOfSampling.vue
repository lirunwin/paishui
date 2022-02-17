<template>
  <div class="sampling-amount">
    <total-dispaly :infos="samplingAmount">
      <template slot="title">
        <span style="font-weight: bold">{{name}}</span>
      </template>
    </total-dispaly>
  </div>
</template>

<script>
import TotalDispaly from './TotalDispaly.vue'
export default {
  components: { TotalDispaly },
  props: ['name'],
  data() {
    return {
      samplingAmount: {
        color: '#2dc2c1',
        totalName: '抽检总数',
        total: '35677',
        leftName: '抽检故障表数',
        leftNumber: '4367',
        rightName: '周检表抽检数',
        rightNumber: '4367'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sampling-amount {
  width: 100%;
  height: 100%;
}
</style>