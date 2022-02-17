<template>
  <section class="app-main" :style="{paddingTop: appMainPaddingTop}">
    <!-- <el-button type="success" style="width:16%;margin-left: 0" @click="uploadRouteTable">上传路由表</el-button> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="Monitor">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
// import { asyncRoutes } from '@/router/router.config'
import { uploadRoute } from '@/api/user'

export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    appMainPaddingTop() {
      // const path = this.$route.path
      // if (path.indexOf('dashboard') === 1 || path.indexOf('map') === 1) return '0px'
      // else return '43px'
      const tagsViewShow = this.$store.state.settings.tagsView
      if (tagsViewShow) return '43px'
      else return '0px'
    }
  },
  methods: {
    uploadRouteTable() {
      const data = {
        '1': JSON.stringify({
          name: 'sys',
          // value: asyncRoutes,
          type: 'tofly-master',
          notes: '使用与当前系统。'
        })
      }
      uploadRoute(JSON.stringify(data)).then(res => {
        this.$message.success('上传成功')
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 64px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
}
.fixed-header + .app-main {
  padding-top: 43px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
