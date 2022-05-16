<template>
  <el-card class="info-card" :body-style="{ fontSize: '14px', padding: '15px' }">
    <div slot="header" class="info-card-title">
      <span>童家河入河口水质监测点</span>
      <div>
        <el-button type="text" icon="el-icon-map-location" style="height:1.2em;padding:0;" />
        <el-button
          type="text"
          icon="el-icon-s-tools"
          @click="() => $emit('distribute', info)"
          style="height:1.2em;padding:0;"
        />
        <el-button type="text" icon="el-icon-data-line" style="height:1.2em;padding:0;" />
      </div>
    </div>
    <h3 class="type">报警</h3>

    <div class="text">采集时间: 2022-03-01 09:03:03</div>
    <div class="item">
      <span class="text">温度【达标: 10-40】</span>
      <span>12.5 ℃ {{ arrow.up }}</span>
    </div>
    <div class="item">
      <span class="text">电导率【达标: 40-60】</span>
      <span>59 ms/m {{ arrow.down }}</span>
    </div>
    <div class="item">
      <span class="text">浊度【达标: 200-300】</span>
      <span>211.76 NTU {{ arrow.up }}</span>
    </div>
    <div class="item">
      <span class="text">化学需氧量【严重报警: 90-100】</span>
      <span>97.13 mg/L {{ arrow.down }}</span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'InfoCard', components: {} })
export default class InfoCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) info!: {
    id?: string
    type?: string
    name?: string
    dep?: string
    tel?: string
    distance?: string
    address?: string
    car?: string
  }
  arrow: {
    up: '&uarr;'
    down: '&darr;'
  }
}
</script>

<style lang="scss" scoped>
.info-card {
  width: 366px;
  /deep/ .el-card__header {
    padding: 15px;
  }
  /deep/ .el-card__body {
    width: 366px;
    padding: 15px;
  }

  &-title {
    display: flex;
    align-items: center;
    > span {
      flex: 1 1 auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    > div {
      flex: 0 0 auto;
    }
  }
  .type {
    color: $--color-danger;
    margin-top: 0;
    font-size: 16px;
  }
  .text {
    color: rgba(#333, 0.6);
  }
  .item {
    margin-top: 10px;
    display: flex;
    align-items: top;
    justify-content: space-between;
    > span:last-child {
      font-weight: 600;
    }
  }
}
</style>
