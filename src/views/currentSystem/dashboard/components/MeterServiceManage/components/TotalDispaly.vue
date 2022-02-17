<template>
  <div class="total-container">
    <slot name="title"></slot>
    <div class="total">
      <div class="circle" :style="{ borderColor: infos.color }">
        <span class="name">{{infos.totalName}}</span>
        <span class="number">{{infos.total}}</span>
      </div>
      <div class="bottom">
        <div class="left">
          <span class="name">{{infos.leftName}}</span>
          <span class="number">{{infos.leftNumber}}</span>
        </div>
        <div class="right">
          <span class="name">{{infos.rightName}}</span>
          <span class="number">{{infos.rightNumber}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infos: {
      type: Object,
      default: () => {
        return {
          color: '#6a9bec',
          totalName: '入库总数',
          total: '35677',
          leftName: '出库数',
          leftNumber: '4367',
          rightName: '库存数',
          rightNumber: '4367',
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.total-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .total {
    width: 100%;
    height: 90%;
    padding: 20px;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background: #f8f8f8;
    .circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 10px solid;
      display: flex;
      flex-direction: column;;
      justify-content: center;
      align-items: center;
    }
    .bottom {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .left, .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .left {
        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 100%;
          right: -50%;
          top: 0;
          background: #e9e9e9;
        }
      }
    }
    .name {
      font-size: 13px;
      color: #9f9f9f;
    }
    .number {
      padding-top: 6px;
      font-size: 20px;
      font-weight: bold;
      color: #5d5d5d;
    }
  }
}
</style>