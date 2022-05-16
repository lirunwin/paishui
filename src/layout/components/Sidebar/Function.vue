<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <span
        key="expand"
        class="sidebar-logo-link"
        :class="{ close: !sidebar.opened }"
      >
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          :style="{ paddingLeft: sidebar.opened ? '20px' : '0px' }"
          @toggleClick="toggleSideBar"
        />
        <div class="sidebar-title">功能菜单</div>
      </span>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger/index.vue";
@Component({
  name: "SidebarLogo",
  components: { Hamburger },
})
export default class FunctionVue extends Vue {
  get sidebar() {
    return this.$store.getters.sidebar;
  }
  // 打开或关闭左侧菜单
  toggleSideBar() {
    this.$store.dispatch("app/toggleSideBar");
    // 20220516 add yj
    // 改变侧边栏后，openlayer 需要手动更新地图 
    this.$store.dispatch("gis/updateSize")
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  float: left;
  color: rgb(235, 240, 254);
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    // background-color: #82adff;
    background: rgba(0, 0, 0, 0.025);
  }
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: transparent;
  background: #fff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: rgb(235, 240, 254);
      font-size: 16px;
      color: #999999;
      position: absolute;
      left: 49px;
      line-height: 50px;
      // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
