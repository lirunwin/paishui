<template>
  <div :class="{ 'has-logo': showLogo }">
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
        <sidebar-item
          v-for="route in routes"
          :key="route.name"
          :item="route"
          :base-path="route.path"
          class="border_1"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/styles/variables.scss";
import Function from "./Function.vue";
// import themeJson from '@/styles/them.json'
/**
 * 该实例用于左侧功能菜单展示
 */
@Component({
  components: { SidebarItem, Logo, Function },
})
export default class Sidebar extends Vue {
  get sidebar() {
    return this.$store.getters.sidebar;
  }
  get routes() {
    return this.$store.state.routeSetting.routes;
  }
  get activeMenu() {
    const route = this.$route;
    const { meta, path, params } = route;

    // 如果设置路径，侧边栏将突出显示您设置的路径
    if (meta.activeMenu) {
      // console.log("选中1："+meta.activeMenu)
      return meta.activeMenu;
    }
    if (params.activeMenu) {
      //  console.log("选中2："+meta.activeMenu)
      return params.activeMenu;
    }
    return path;
  }
  get showLogo() {
    return this.$store.state.settings.sidebarLogo;
    // return true
  }
  get theme() {
    return this.$store.state.settings.theme;
  }
  get variables() {
    // console.log('-----', this.theme, themeJson[this.theme])
    // return themeJson[this.theme].sidebar
    return variables;
  }
  get isCollapse() {
    return !this.sidebar.opened;
  }
}
</script>
<style lang='scss' scoped>
.border_1 {
  color: #8da4e0;
  // opacity: 0.21;
}
</style>
