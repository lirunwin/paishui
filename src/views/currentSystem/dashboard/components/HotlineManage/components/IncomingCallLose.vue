<template>
  <div class="incoming-call-lose-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="content">
      <div class="number-display">
        <div class="number">{{incomingCallLoseObject.totalInbound}}</div>
        <span>呼入总数</span>
      </div>
      <div class="connected">
        <span>呼入接通数</span>
        <span>{{incomingCallLoseObject.inboundNum}}</span>
      </div>
      <div class="lose">
        <span>呼入呼损</span>
        <span>{{incomingCallLoseObject.inboundLossNum}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '标题'
    },
    incomingCallLoseObject:{
      type:Object,
      default:() => {
        return {
          totalInbound:0,
          inboundNum:0,
          inboundLossNum:0
        }
      }
    },
  },
  watch:{
    incomingCallLoseObject:{
      handler(newV, oldV) {
　　　　console.log("incomingCallLoseObject："+JSON.stringify(newV))
        this.incomingCallLoseObject = newV
　　　},
　　　deep: true
    },
  },
}
</script>

<style lang="scss" scoped>
.incoming-call-lose-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .number-display {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .number {
        width: 120px;
        height: 120px;
        border: 10px solid #76a3ec;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }
      >span {
        color: #a5a5a5;
      }
    }
    .connected, .lose {
      margin: 0 30px;
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      >span {
        color: #878787;
        &:nth-of-type(2) {
          color: #333;
          font-size: 26px;
          font-weight: bold;
        }
      }
    }
    .lose {
      margin: 0;
    }
  }
}
</style>