<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  mounted() {
    const session = [
      { key: 'username', commit: 'SET_USERNAME' },
      { key: 'realName', commit: 'SET_REALNAME' },
      { key: 'avatar', commit: 'SET_AVATAR' },
      { key: 'userId', commit: 'SET_USERID' },
      { key: 'departmentId', commit: 'SET_DEPTS' }
    ]
    session.forEach((item) => {
      if (sessionStorage.getItem(item.key) && this.$store.state.user[item.key] === '') {
        this.$store.commit(`user/${item.commit}`, sessionStorage.getItem(item.key))
      }
    })
  },
  methods: {
    reload() {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true // 再打开
      })
    }
  }
}
</script>
<style lang="scss">
// @import '~./styles/index.scss';
@import '~./assets/font/font.css';

// 设置进度条颜色
#nprogress .bar {
  background: #409eff !important; //自定义颜色
}
// .el-select-dropdown {
//   max-width: 243px;
// }
// .el-select-dropdown__item {
//   display: inline-block;
// }
// .el-select-dropdown__item span {
//   min-width: 205px;
//   display: inline-block;
// }
</style>
