<template>
  <div class="indicator-blocks">
    <div style="width: 100%; height:200px; overflow: hidden">
      <span class="title" :style="{ background: info.color }">{{info.title}}</span>
      <span v-for="(item, index) in info.indicate" :key="index" class="block-content">
        <span class="name">{{ item.name }}</span>
        <span class="number">{{ item.number }}<span class="unit">{{item.unit}}</span></span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info']
}
</script>

<style lang="scss" scoped>
.indicator-blocks {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title, .block-content {
    display: flex;
    width: 100%;
    padding: 10px;
    position: relative;
    &::after {
      content: "";
      width: 100%;
      height: 1px;
      background: #eaeaea;
      bottom: 0;
      left: 0;
      position: absolute;
    }
  }
  .title {
    color: #fff;
    justify-content: center;
    align-items: center;
  }
  .block-content {
    justify-content: space-between;
    background: #f7f7f7;
    .name,
    .number {
      font-size: 13px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .number {
      display: flex;
      font-size: 20px;
      font-weight: bold;
      .unit {
        transform: scale(0.8);
      }
    }
  }
}
</style>