<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse"/> -->
    <Function />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="true"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" class="border_1" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Function from './Function'
// import themeJson from '@/styles/them.json'

export default {
  components: { SidebarItem, Logo, Function },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$store.state.routeSetting.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path, params } = route

      // 如果设置路径，侧边栏将突出显示您设置的路径
      if (meta.activeMenu) {
        // console.log("选中1："+meta.activeMenu)
        return meta.activeMenu
      }
      if (params.activeMenu) {
        //  console.log("选中2："+meta.activeMenu)
        return params.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
      // return true
    },
    theme() {
      return this.$store.state.settings.theme
    },
    variables() {
      // console.log('-----', this.theme, themeJson[this.theme])
      // return themeJson[this.theme].sidebar
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang='scss' scoped>
.border_1{
  color: #8DA4E0;
  // opacity: 0.21;
}
</style>
