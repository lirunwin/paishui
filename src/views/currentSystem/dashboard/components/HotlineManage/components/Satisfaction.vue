<template>
  <div class="incoming-call-lose-container">
    <span style="font-weight: bold">{{name}}</span>
    <div class="content">
      <div class="number-display">
        <div class="number">{{satisfactionObject.totalReturn}}</div>
        <span>回访总数</span>
      </div>
      <div class="pretty">
        <span>非常满意</span>
        <span>{{satisfactionObject.greatSatisfactionNum}}</span>
      </div>
      <div class="fine">
        <span>满意</span>
        <span>{{satisfactionObject.satisfactionNum}}</span>
      </div>
      <div class="normal">
        <span>一般</span>
        <span>{{satisfactionObject.generalNum}}</span>
      </div>
      <div class="last">
        <span>不满意</span>
        <span>{{satisfactionObject.dissatisfactionNum}}</span>
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
    satisfactionObject:{
      type:Object,
      default:() => {
        return {
          totalOut:0,
          outNum:0,
          outLossNum:0
        }
      }
    },
  },
  watch:{
    satisfactionObject:{
      handler(newV, oldV) {
　　　    console.log("satisfactionObject："+JSON.stringify(newV))
        this.satisfactionObject = newV
  　　},
  　　deep: true
    },
  }
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
    .pretty, .fine, .normal, .last {
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
    .pretty, .fine {
      margin-right: 0;
    }
    .last {
      margin-left: 0;
    }
  }
}
</style>