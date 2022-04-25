<template>
  <div class="item">
    <el-checkbox class="item-checkbox" />
    <div class="item-info">
      <div class="item-info-title">COD: 120mg/L</div>
      <div style="margin-top:5px;">东风湖排水口1</div>
    </div>
    <div class="item-time">
      <div style="font-size:12px">2021-02-01 12:01:02</div>
      <div style="margin-top:5px;">严重:100-200</div>
    </div>
    <el-button class="item-btn" type="error" size="small" style="padding:0 10px;margin-left:10px;height: 1.6em;"
      >报警</el-button
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({ name: 'WarningCardItem', components: {} })
export default class WarningCardItem extends Vue {}
</script>

<style lang="scss" scoped>
.item {
  font-size: 14px;
  display: flex;
  margin-top: 20px;
  &-checkbox,
  &-btn {
    flex: 0 0 auto;
  }
  &-checkbox {
    margin-right: 5px;
  }
  &-info,
  &-time {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &-info {
    flex: 1 1 auto;
    &-title {
      color: $--color-primary;
      text-decoration: underline;
    }
  }
  &-time {
    flex: 0 0 auto;
    text-align: right;
  }
}
</style>
