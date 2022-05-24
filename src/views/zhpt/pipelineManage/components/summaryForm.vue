<template>
  <div>
    <!-- 管道缺陷数量统计表 -->
    <table width="560" height="300" border="1" class="left-table" cellspacing="0" align="center" stripe>
      <thead>
        <tr height="34">
          <th rowspan="2" colspan="2">缺陷名称\缺陷数量\缺陷级别</th>
          <th>1级(轻微)</th>
          <th>2级(中等)</th>
          <th>3级(严重)</th>
          <th>4级(重大)</th>
          <th rowspan="2">小计</th>
        </tr>
        <tr height="34">
          <th>缺陷个数</th>
          <th>缺陷个数</th>
          <th>缺陷个数</th>
          <th>缺陷个数</th>
        </tr>
      </thead>
      <tr class="highlight" v-for="(v, i) in tabelData.defectQuantityStatisticsA" :key="v.title">
        <td rowspan="10" v-if="i < 1">结构性缺陷</td>
        <td>{{ v.title }}</td>
        <td>{{ v.oneValue }}</td>
        <td>{{ v.twoValue }}</td>
        <td>{{ v.threeValue }}</td>
        <td>{{ v.fourValue }}</td>
        <td>{{ v.value }}</td>
      </tr>
      <tr class="highlight" v-for="(v, i) in tabelData.defectQuantityStatisticsB" :key="i">
        <td rowspan="6" v-if="i < 1">功能性缺陷</td>
        <td>{{ v.title }}</td>
        <td>{{ v.oneValue }}</td>
        <td>{{ v.twoValue }}</td>
        <td>{{ v.threeValue }}</td>
        <td>{{ v.fourValue }}</td>
        <td>{{ v.value }}</td>
      </tr>
      <tr class="defectSum">
        <td colspan="2">合计</td>
        <td v-for="(key, i) in tabelData.defectSumObj" :key="i">{{ key }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['tabelData'],
  created() {
    console.log('汇总组件', this.tabelData)
  }
}
</script>

<style lang="scss" scoped>
.left-table {
  // border-color: #DEDEDE;
  width: 100%;
  font-weight: bold;
  text-align: center;
  th {
    color: #666;
    font-size: 14px;
    background: #f3f7fe;
  }
  tr {
    height: 38px;
  }
  .defectSum {
    height: 45px;
    background-color: #f3f7fe;
  }
  .highlight{
    font-size: 12px;
  }
  .highlight:hover {
    opacity: 0.8;
    color: #E6A23C;
    background-color: #f3f7fe;
  }
}
</style>