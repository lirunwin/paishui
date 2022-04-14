<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="item.type === 'sys'" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="isNest ? '' : item.icon" :title="onlyOneChild.meta !== null ? onlyOneChild.meta.title : ''" />
        </el-menu-item>
      </app-link>
      <el-menu-item
        v-if="item.type === 'gis'"
        :index="item.path"
        :class="{ 'submenu-title-noDropdown': !isNest }"
        @click="handleMap(onlyOneChild)"
      >
        <span>{{ onlyOneChild.meta.title }}</span>
      </el-menu-item>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
      popper-class="custom-popper-list"
    >
      <template slot="title">
        <item :icon="item.icon" :title="item.meta !== null ? item.meta.title : ''" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.label"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'
import path from 'path'
@Component({
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug]
})
export default class SidebarItem extends Vue {
  @Prop({ required: true }) item: object
  @Prop({ default: true }) isNest: boolean
  @Prop({ default: '' }) basePath: string
  @Prop({ default: '' }) color: string
  onlyOneChild = null
  hasOneShowingChild(children = [], parent) {
    const showingChildren = children.filter((item) => {
      if (item.hidden) {
        return false
      } else {
        // 设定(将在只有一个显示子项时使用)
        this.onlyOneChild = item
        return true
      }
    })
    // 当只有一个子路由器时，默认显示子路由器
    // if (showingChildren.length === 1) {
    //   return true
    // }
    // 如果没有要显示的子路由器，则显示父路由器
    if (showingChildren.length === 0) {
      this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }
  resolvePath(routePath) {
    // console.log("要去的路由",routePath)
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
  handleMap(info) {
    const currentRouter = this.$route.path
    const jumpRouter = '/map' // '/map/mapFun/funMap'
    if (jumpRouter != null && jumpRouter !== currentRouter) {
      this.$router.push(jumpRouter)
    }
    this.$store.dispatch('map/changeMethod', info)
    if (info.widgetid !== 'FullPanel' && this.$store.state.map.fullPanels.length > 0) {
      this.$store.dispatch('map/delAllFull')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-menu-item {
  min-width: auto;
  &.is-active {
    border-right: 4px solid blue;
  }
}
/deep/.el-submenu__title {
  display: flex;
  align-items: center;
  i {
    font-size: 16px;
    padding-right: 12px;
    &.el-submenu__icon-arrow {
      font-size: 12px;
      padding-right: 0;
    }
  }
}
.submenu-title-noDropdown {
  font-size: 16px;
  i {
    margin-right: 10px;
  }
}
</style>
