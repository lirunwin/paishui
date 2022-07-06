<template>
  <div class="container">
    <div :class="{ actions: true, hidden: !$slots.action }">
      <slot name="action" />
    </div>
    <div class="content-wrapper">
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({ name: 'TfPage', inheritAttrs: false })
export default class Page extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  $parent!: Vue & { preparing?: Function }
  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      const { preparing } = this.$parent
      preparing && preparing()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  background-color: $--background-color-base !important;
  @include base-scroll-bar();
  .actions {
    flex: 0 0 auto;
    position: relative;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: $gutter $gutter 0;
    margin-bottom: $gutter;
    background: $--color-white;
    >>> .el-form-item {
      margin-bottom: $gutter;
    }

    >>> .el-form--inline {
      .el-form-item {
        margin-right: $gutter;
      }
    }
    &.hidden {
      display: none;
    }
  }
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    @include base-scroll-bar();

    &-wrapper {
      width: 100%;
      flex: 1 1 100%;
      display: flex;
      position: relative;
      z-index: 99;
    }
  }
}
</style>
