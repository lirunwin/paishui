<template>
  <div class="block-container">
    <div class="header" :style="{borderBottom: line ? '1px solid #eaeaea' : 'none'}">
      <div class="left">
        <span>{{ title }}</span>
        <div class="menus" v-if="menusOn">
          <div :class="{ 'curr-menu': currMenu === menu.key}" v-for="menu in menus" :key="menu.key" @click="handleMenuChange(menu.key)">{{ menu.name }}</div>
        </div>
      </div>
      <div class="right" @click="showMore">
        <template v-if="more">
          更多
          <i class="el-icon-arrow-right"></i>
        </template>
      </div>
    </div>
    <div class="content">
      <slot></slot>
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
    more: {
      type: Boolean,
      default: false
    },
    menusOn: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array
    },
    line: {
      type: Boolean,
      default: false
    },
    currMenu:{
      type: String,
      default: "meterReadingManage"
    }
  },
  data() {
    return {
      // currMenu: 'meterReadingManage'
    }
  },
  methods: {
    handleMenuChange(data) {
      // this.currMenu = data
      this.$emit('menu-change',data)
    },
    showMore() {
      this.$emit('open-more', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.block-container {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px;
  box-sizing: border-box;
  .header {
    flex-shrink: 0;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid #eaeaea;
    .left {
      display: flex;
      align-items: center;
      span {
        height: 20px;
        font-size: 16px;
        padding-left: 6px;
        font-weight: bold;
        border-left: 4px solid #1c69e5;
      }
      .menus {
        display: flex;
        padding: 0 20px;
        align-items: center;
        justify-content: space-around;
        >div {
          height: 40px;
          margin: 0 10px;
          line-height: 40px;
          box-sizing: border-box;
          cursor: pointer;
          transition: all .1s linear;
          &.curr-menu {
            color: #4c89eb;
            border-bottom: 3px solid #4c89eb;
            transition: all .1s linear
          }
        }
      }
    }
    .right {
      display: flex;
      cursor: pointer;
      color: #7f7f7f;
      align-items: center;
    }
  }
  .content {
    flex: 1;
    position:relative;
    padding: 4px 0;
  }
}
</style>
