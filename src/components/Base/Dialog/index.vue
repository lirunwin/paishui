<template>
  <el-dialog
    v-dialogDrag
    :class="{ dialog: true, 'no-gutter': !gutter }"
    :visible.sync="dialogVisible"
    v-bind="{ appendToBody: true, width: '368px', ...$attrs }"
    v-on="listeners"
    @open="onOpen"
    @closed="onClosed"
    ref="dialog"
  >
    <div slot="title">
      <span class="title">{{ title }}</span>
    </div>
    <slot />
    <span slot="footer" v-if="footer">
      <el-button type="primary" size="small" @click="$emit('submit')" :loading="loading" :disabled="disabled">
        提 交
      </el-button>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'

@Component({ name: 'TfDialog', inheritAttrs: false })
export default class Dialog extends Vue {
  @PropSync('visible', { type: Boolean }) dialogVisible!: boolean
  @Prop({ type: String }) title!: string
  @Prop({ type: Boolean }) loading!: boolean
  @Prop({ type: Boolean }) disabled!: boolean
  @Prop({ type: Boolean, default: true }) clear!: boolean
  @Prop({ type: Boolean, default: true }) footer!: boolean
  @Prop({ type: Boolean, default: true }) gutter!: boolean

  get listeners() {
    const { open, closed, submit, ...rest } = this.$listeners
    return rest
  }

  onOpen() {
    if (this.clear) {
      const { clearValidate } = (this.$parent.$refs['form'] as ElForm) || {}
      setTimeout(() => {
        clearValidate && clearValidate()
      }, 0)
    }
    this.$emit('open')
  }

  onClosed() {
    if (this.clear) {
      const { resetFields } = (this.$parent.$refs['form'] as ElForm) || {}
      resetFields && resetFields()
    }
    this.$emit('closed')
  }
  updated() {
    this.$nextTick(() => {
      /**我也不知道为什么title会被传到html上 */
      ;[...document.querySelectorAll('.dialog')].forEach((dialog) => {
        dialog.removeAttribute('title')
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  font-size: $--font-size-base;
  $radius: $--border-radius-base;
  $font-color: $--color-white;
  $bg-color: $--color-primary;

  border-radius: $radius;
  display: flex;
  justify-content: center;
  align-items: center;
  >>> .el-dialog {
    background-color: transparent;
    max-width: 85vw;
    margin-top: 0 !important;
    .title {
      font-size: $--font-size-medium;
      color: $font-color;
      font-weight: 500;
    }

    &__header {
      background-color: $bg-color;
      color: $font-color;
      border-bottom-color: $bg-color;
      height: 54px;
      text-indent: 0;
      padding: 0 $gutter-medium;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top-left-radius: $radius;
      border-top-right-radius: $radius;
      &btn {
        position: relative;
        top: 0;
        right: 0;
        i.el-icon-close {
          color: $font-color !important;
          font-size: 1.2em;
        }
      }
    }
    &__body {
      background-color: #fff;
    }
    &__footer {
      background-color: #fff;
      border-bottom-left-radius: $radius;
      border-bottom-right-radius: $radius;
    }
    .el-dialog__body {
      padding: $gutter-medium;
    }
  }
  &.no-gutter {
    >>> .el-dialog {
      .el-dialog__body {
        padding: 0;
      }
    }
  }
}
</style>
