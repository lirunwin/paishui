<template>
  <div class="amount-container">
    <div class="top">
      <span style="font-size: 13px; font-weight: bold">{{ title }}</span>
      <span v-if="calcWidth === 1" style="font-size: 13px; font-weight: bold">{{ total }}</span>
    </div>
    <div class="bottom">
      <div class="surface" :style="{width: `${calcWidth.toFixed(2) * 100}%`, background: surfaceColor}">
        <div class="tip" ref="tips" v-show="calcWidth !== 1" :style="{right: right}">
          <div class="number" :style="{background: tipColor}">{{ total }}</div>
          <div class="triangle" :style="{ borderColor: triangleColor }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '这里是标题'
    },
    total: {
      type: Number,
      default: 10000
    },
    // 是否是计划数 用于不展示tip
    plan: {
      type: Boolean,
      default: false
    },
    // 计划数量 用于计算占比
    planNum: {
      type: Number
    },
    // 进度条颜色
    surfaceColor: {
      type: String
    },
    // 三角形颜色
    triangleColor: {
      type: String
    },
    // 数字tip
    tipColor: {
      type: String
    }
  },
  computed: {
    calcWidth() {
      const result = this.total / this.planNum;
      return result;
    },
  },
  data() {
    return {
      right: 0,
      progress: false
    }
  },
  mounted() {
    this.right = `${(this.$refs.tips.clientWidth / 2).toFixed(0) * -1}px`;
  }
}
</script>

<style lang="scss" scoped>
.amount-container {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin: 10px 0;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    width: 100%;
    height: 14px;
    border-radius: 10px;
    position: relative;
    background: #5c6579;
    .surface {
      width: 120px;
      height: 100%;
      position: absolute;
      border-radius: 10px;
      background: linear-gradient(to right, #5387db, #4de2de);
      top: 0;
      left: 0;
      .tip {
        position: absolute;
        top: -26px;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .number {
          height: 18px;
          font-size: 12px;
          color: #ffffff;
          line-height: 18px;
          text-align: center;
          padding: 0 4px;
          background: linear-gradient(to bottom, #4ec7dd, #6eacdc);
        }
        .triangle {
          width: 0;
          height: 0;
          border: 6px solid;
          border-color: #5494db transparent transparent transparent;
        }
      }
    }
  }
}
</style>
