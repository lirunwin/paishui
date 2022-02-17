<template>
  <div :class="classObj" class="app-wrapper">
    <Header v-if="showHeader" :class="{'fixed-header-tow': showHeader}" />
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="sidebar.show" class="sidebar-container" :style="{'top': showHeader ? '64px' : ''}" />
    <div id="main-container" class="main-container" :style="{marginLeft: mainContainerMarginLeft}">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar v-if="showNavBar" />
        <tags-view v-if="showTagsView" :style="{marginLeft: mainContainerMarginLeft, width: tagsViewWidth}" />
      </div>
      <app-main />
    </div>
    <!-- <div>222232211111111111111111111111111111111111111</div> -->

    <right-panel v-if="false">
      <!--  -->
    </right-panel>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import TagsView from './components/TagsView'
import Header from './components/Header/index'
import RightPanel from '@/components/RightPanel'
import { log } from 'util'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Header,
    RightPanel
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      // const path = this.$route.path
      // if (path.indexOf('dashboard') === 1 && this.$store.state.app.sidebar.show) this.$store.dispatch('app/toggleSideBarShow', false)
      // else if (path.indexOf('dashboard') === -1 && !this.$store.state.app.sidebar.show) this.$store.dispatch('app/toggleSideBarShow', true)
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    showTagsView() {
      return this.$store.state.settings.tagsView
    },
    showNavBar() {
      return this.$store.state.settings.navBar
    },
    showHeader() {
      return this.$store.state.settings.showHeader
    },
    mainContainerMarginLeft() {
      const sideBarOpen = this.$store.state.app.sidebar.opened
      const sideBarShow = this.$store.state.app.sidebar.show
      if (!sideBarShow) return '0px'
      else if (sideBarShow && sideBarOpen) return '173px'
      else if (sideBarShow && !sideBarOpen) return '30px'
    },
    tagsViewWidth() {
      const sideBarOpen = this.$store.state.app.sidebar.opened
      const sideBarShow = this.$store.state.app.sidebar.show
      if (!sideBarShow) return '100%'
      else if (sideBarShow && sideBarOpen) return 'calc(100% - 173px)'
      else if (sideBarShow && !sideBarOpen) return 'calc(100% - 30px)'
    }
  },
  watch: {
    '$route'(val) {
      // if(val.path.indexOf("dashboard") === -1) this.$store.dispatch('app/toggleSideBarShow', true);
      // else this.$store.dispatch('app/toggleSideBarShow', false);
      if (val.path.indexOf('dashboard') === 1 || val.path.indexOf('map') === 1 || val.path.indexOf('hydrualics') === 1) this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: false })
      else this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: true })
      if (val.path.indexOf('dashboard') === 1 && this.sidebar) this.$store.dispatch('app/toggleSideBarShow', false)
      else this.$store.dispatch('app/toggleSideBarShow', true)
    }
  },
  // mounted() {
  //   const path = this.$route.path
  //   if (path.indexOf('dashboard') === 1 || path.indexOf('map') === 1) this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: false })
  //   else this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: true })
  // },
  mounted() {
    const path = this.$route.path
    if (path.indexOf('dashboard') === 1 || path.indexOf('map') === 1 || path.indexOf('hydrualics') === 1) this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: false })
    else this.$store.dispatch('settings/changeSetting', { key: 'tagsView', value: true })
    if (path.indexOf('dashboard') === 1 && this.$store.state.app.sidebar.show) this.$store.dispatch('app/toggleSideBarShow', false)
    else if (path.indexOf('dashboard') === -1 && !this.$store.state.app.sidebar.show) this.$store.dispatch('app/toggleSideBarShow', true)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 64px;
    right: 0;
    z-index: 9;
    width: 100%;
    // width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }
  .fixed-header-tow{
    position: fixed;
    top: 0;
    width: 100%;
    // right: 0;
    z-index: 9;
  }

  .hideSidebar .fixed-header {
    // width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .sidebar-container{
    // background: url('../assets/images/sidebar.png');
    background-size: 100% 100%;
    padding-bottom: 48px;
    /deep/ .el-menu-item, /deep/ .el-submenu {
      &.is-opened {
        i, >div>span {
          color: #3174e9;
        }
      }

      /deep/ .el-submenu__title{
        font-size: 16px;
      }
    }
    /deep/ .el-menu--inline{
      li {
        color: #666666;
        font-size: 14px;
        &.is-active{
          color: #333;
          background: #ecf2ff;
        }
      }
    }
    /deep/ .el-menu--collapse {
      display: flex;
      flex-direction: column;
      align-items: center;
      li {
        &.is-active {
          border: none;
        }
      }
      i {
        &:nth-of-type(1) {
          padding-right: 0;
        }
      }
    }
  }
</style>
