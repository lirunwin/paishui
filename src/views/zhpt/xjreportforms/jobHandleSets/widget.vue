<template>
  <div id="jobHandleSets" class="jobHandleSets">
    <div class="statistics" />
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'JobHandleSets',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      // 部门筛选信息
      dept_select: {
        options: [
          { value: 1, label: '巡检组' },
          { value: 2, label: '抢修组' },
          { value: 3, label: '维护组' }
        ],
        value: 1
      },
      // 人员筛选信息
      user_select: {
        options: [
          { value: '0', label: '全部' },
          { value: '1', label: '韩雨辰' },
          { value: '2', label: '朱循义' },
          { value: '3', label: '魏先义' },
          { value: '4', label: '侯俊杰' }
        ],
        value: '1'
      },
      // 日期筛选信息
      date_select: {
        value: ''
      }
    }
  },
  watch: {}
}
</script>

<style lang='scss' scoped>

.jobHandleSets {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 5px;
  .statistics{
    position: relative;
    width: 100%;
    height: 700px;
    background-image: url('./images/statistic.png');
    background-size: 100% 100%;
  }
}
</style>
