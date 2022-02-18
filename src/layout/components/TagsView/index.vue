<template>
  <div id="tags-view-container" class="tags-view-container">
    <!-- <hamburger
      v-if="showHeader"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    /> -->
    <!-- <div class="hamburger-container">
      <i class="el-icon-caret-left" />
    </div> -->
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews.top"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <div class="right_box">
      <!-- <i class="el-icon-caret-right" /> -->
      <i
        class="el-icon-more-outline more-list-trigger"
        @mouseenter="toggleMore('trigger')"
      >
        <transition name="fade">
          <div
            v-if="moreListShow && visitedViews.more.length !== 0"
            class="more-list"
            @mouseleave="toggleMore('container')"
          >
            <template>
              <router-link
                v-for="tag in visitedViews.more"
                :key="tag.path"
                ref="tag"
                :class="isActive(tag) ? 'active' : ''"
                :to="{
                  path: tag.path,
                  query: tag.query,
                  fullPath: tag.fullPath,
                }"
                tag="span"
                class="more-view-item"
                @click.middle.native="
                  !isAffix(tag) ? closeSelectedTag(tag) : ''
                "
                @contextmenu.prevent.native="openMenu(tag, $event)"
              >
                <span class="tag-title">
                  {{ tag.title }}
                </span>
                <span
                  v-if="!isAffix(tag)"
                  class="el-icon-close"
                  @click.prevent.stop="closeSelectedTag(tag)"
                />
              </router-link>
            </template>
          </div>
        </transition>
      </i>
      <i class="el-icon-close" @click="closeAllTags" />
    </div>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import ScrollPane from "./ScrollPane.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import path from "path";
@Component({
  name: "TagsView",
  components: { ScrollPane, Hamburger },
})
export default class TagsView extends Vue {
  visible = false;
  top = 0;
  left = 0;
  tagNum = 3;
  selectedTag = {};
  affixTags = [];
  moreListShow = false;
  get sidebar() {
    return this.$store.getters.sidebar;
  }
  get visitedViews() {
    var that = this;
    //  that.getTagsNum()
    // console.log('---------', that.$store.state.tagsView)
    const views = that.$store.state.tagsView.visitedViews;
    const result = {
      top: [],
      more: [],
    };
    views.filter((item, index) => {
      if (index < that.tagNum) {
        result.top = [...result.top, item];
      } else {
        result.more = [...result.more, item];
      }
    });
    return result;
  }
  get routes() {
    return this.$store.state.routeSetting.routes;
  }
  get showHeader() {
    return this.$store.state.settings.showHeader;
  }
  @Watch("$route")
  routeChange() {
    this.addTags();
    this.moveToCurrentTag();
    this.$store.dispatch(
      "routeSetting/routesChangeByTagsView",
      this.$route.name
    );
  }
  @Watch("visible")
  visibleChange(value) {
    if (value) {
      document.body.addEventListener("click", this.closeMenu);
    } else {
      document.body.removeEventListener("click", this.closeMenu);
    }
  }
  mounted() {
    this.initTags();
    this.addTags();

    window.onresize = () => {
      return (() => {
        this.getTagsNum();
      })();
    };
    this.getTagsNum();
  }
  toggleMore(pos) {
    if (pos === "trigger") this.moreListShow = true;
    else if (pos === "container") this.moreListShow = false;
  }
  // 打开或关闭左侧菜单
  toggleSideBar() {
    this.$store.dispatch("app/toggleSideBar");
  }
  // 判断是否选中
  isActive(route) {
    return route.path === this.$route.path;
  }
  // 是否显示关闭按钮
  isAffix(tag) {
    return tag.meta && tag.meta.affix;
  }
  // 过滤
  filterAffixTags(routes, basePath = "/") {
    let tags = [];
    routes &&
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
    return tags;
  }
  // 初始化
  initTags() {
    const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
    // console.log('=====', affixTags)
    for (const tag of affixTags) {
      // 必须有标记名
      if (tag.name) {
        this.$store.dispatch("tagsView/addVisitedView", tag);
      }
    }
  }
  // 添加
  addTags() {
    var that = this;
    const { name } = that.$route;
    if (name) {
      if (name === "Dashboard") {
        return;
      }

      const arr = that.$store.state.tagsView.visitedViews;
      if (arr.length >= that.tagNum) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].name === name) {
            console.log("索引：" + (i + 1) + "  " + that.tagNum);
            if (i >= that.tagNum) {
              const currentTag = arr[i];
              arr.splice(i, 1);
              arr.unshift(currentTag);
            }
            break;
          }
        }
      }

      // console.log("产生："+JSON.stringify(arr))

      this.$store.dispatch("tagsView/addView", this.$route);
    }
    return false;
  }
  // 对比是否存在
  moveToCurrentTag() {
    const tags = this.$refs.tag as any[];
    this.$nextTick(() => {
      for (const tag of tags) {
        if (tag.to.path === this.$route.path) {
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag);
          // 如果查询不同，则更新
          if (tag.to.fullPath !== this.$route.fullPath) {
            this.$store.dispatch("tagsView/updateVisitedView", this.$route);
          }
          break;
        }
      }
    });
  }
  // 刷新选定标签
  refreshSelectedTag(view) {
    this.$store.dispatch("tagsView/delCachedView", view).then(() => {
      const { fullPath } = view;
      this.$nextTick(() => {
        this.$router.replace({
          path: fullPath,
        });
      });
    });
  }
  // 关闭选中的标签
  closeSelectedTag(view) {
    this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
      if (this.isActive(view)) {
        this.toLastView(visitedViews, view);
      }
    });
  }
  // 关闭没选中的标签
  closeOthersTags() {
    this.$router.push(this.selectedTag);
    this.$store
      .dispatch("tagsView/delOthersViews", this.selectedTag)
      .then(() => {
        this.moveToCurrentTag();
      });
  }
  // 关闭全部标签
  closeAllTags(view) {
    this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
      if (this.affixTags.some((tag) => tag.path === view.path)) {
        return;
      }
      this.toLastView(visitedViews, view);
    });
  }
  // 查看最后
  toLastView(visitedViews, view) {
    // const latestView = visitedViews.slice(-1)[0]
    const latestView = visitedViews[0];
    if (latestView) {
      this.$router.push(latestView.fullPath);
    } else {
      // 现在，如果没有“标记”视图，默认情况是重定向到主页，
      // 你可以根据需要调整它。
      if (view.name === "Dashboard") {
        // 重新加载主页
        this.$router.replace({ path: "/redirect" + view.fullPath });
      } else {
        this.$router.push("/");
      }
    }
  }
  // 打开菜单
  openMenu(tag, e) {
    const menuMinWidth = 105;
    const offsetLeft = this.$el.getBoundingClientRect().left; // 容器左边距
    const offsetWidth = (this.$el as HTMLElement).offsetWidth; // 集装箱宽度
    const maxLeft = offsetWidth - menuMinWidth; // 左边界
    const left = e.clientX - offsetLeft + 15; // 15: 右边距

    if (left > maxLeft) {
      this.left = maxLeft;
    } else {
      this.left = left;
    }

    this.top = e.clientY - 50;
    this.visible = true;
    this.selectedTag = tag;
  }
  // 关闭菜单
  closeMenu() {
    this.visible = false;
  }
  // 处理滚动
  handleScroll() {
    this.closeMenu();
  }

  // 获取宽度，定义折叠个数
  getTagsNum() {
    var that = this;
    that.$nextTick(() => {
      if (typeof that.$refs.scrollPane === "undefined") {
        return;
      }
      var tagsWidth = (that.$refs.scrollPane as ScrollPane).$el.clientWidth - 100;
      var maxTagNum = parseInt((tagsWidth / 150).toString());
      var tagsItems =
        (that.$refs.scrollPane as ScrollPane).$el.getElementsByClassName("tags-view-item");

      var tagsItemWidth = 0;
      var tagsItemNum = 0;

      for (var i = 0; i < tagsItems.length; i++) {
        tagsItemWidth += tagsItems[i].clientWidth + 10;
        if (tagsItemWidth < tagsWidth) {
          tagsItemNum++;
        }
      }
      // console.log('数量：' + tagsItemNum)
      var nullNum = 0;
      if (tagsWidth > tagsItemWidth) {
        nullNum = parseInt(((tagsWidth - tagsItemWidth) / 120).toString());
      }

      that.tagNum = tagsItemNum + nullNum;

      // if(tagsItemWidth<tagsWidth){
      //   if(tagsItems.length>=3){
      //     that.tagNum++
      //   }
      // }else if(tagsItemWidth>tagsWidth){
      //   if(tagsItems.length>=3){
      //     that.tagNum--
      //   }
      // }

      // if(that.tagNum < tagsItemNum){
      //    that.tagNum = tagsItemNum
      // }else{
      //    that.tagNum = maxTagNum
      // }

      // console.log('表单宽度：' + tagsItemWidth + '  ' + that.tagNum)
    });
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 43px;
  width: 100%;
  background: #eff0f5;
  position: relative;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  transition: margin 0.28s;
  .tags-view-wrapper {
    // border:1px red solid;

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      border: 1px solid transparent;
      color: #666666;
      background: #d6dcef;
      padding: 0 8px;
      font-size: 14px;
      margin-left: 5px;
      margin-top: 11px;
      opacity: 0.5;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #fff;
        /* color: #fff; */
        border-color: #fff;
        color: #2d74e7;
        opacity: 1;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
        .el-icon-close {
          width: 16px;
          height: 16px;
          vertical-align: 2px;
          border-radius: 50%;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: 100% 50%;
          font-size: 8px;
          &:before {
            transform: scale(0.6);
            display: inline-block;
            vertical-align: -3px;
          }
          &:hover {
            background-color: #b4bccc;
            color: #fff;
          }
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .hamburger-container {
    // padding: 5px 0 0 5px;
    position: relative;
    top: 17px;
    padding: 0 2px 0 8px;
    // left: 5px;
    float: left;
    color: #94a2cd;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      // background-color: #82adff;
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .right_box {
    position: absolute;
    right: 0;
    top: 17px;
    width: 47px;
    height: 34px;
    color: #94a2cd;
    .more-list-trigger {
      position: relative;
      cursor: pointer;
      .more-list {
        position: absolute;
        top: 20px;
        right: 0px;
        width: 180px;
        height: 200px;
        overflow-x: hidden;
        background: #fff;
        padding: 12px;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
          width: 4px;
          background: white;
        }
        &::-webkit-scrollbar-corner, /* 滚动条角落 */
        &::-webkit-scrollbar-thumb,
        &::-webkit-scrollbar-track {
          border-radius: 4px;
        }
        &::-webkit-scrollbar-corner,
        &::-webkit-scrollbar-track {
          /* 滚动条轨道 */
          background-color: rgba(180, 160, 120, 0.1);
          box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
        }
        &::-webkit-scrollbar-thumb {
          /* 滚动条手柄 */
          background-color: #cccccc;
        }
        > span {
          display: block;
          padding: 4px 0;
          &.router-link-active {
            color: #2d74e7;
          }
        }
        .more-view-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          > .tag-title {
            width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
