<template>
  <el-dialog
    v-dialogDrag
    class="dialog"
    :visible.sync="dialogVisible"
    v-bind="{ appendToBody: true, width: '368px', ...$attrs }"
    v-on="listeners"
    @open="onOpen"
    @closed="onClosed"
    ref="dialog"
  >
    <div slot="title">
      <span>{{ title }}</span>
    </div>
    <slot />
    <span slot="footer">
      <el-button type="primary" size="small" @click="$emit('submit')" :loading="loading" :disabled="disabled"
        >提 交</el-button
      >
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'

@Component({ name: 'BaseDialog', inheritAttrs: false })
export default class BaseDialog extends Vue {
  @PropSync('visible', { type: Boolean }) dialogVisible!: boolean

  @Prop({ type: String }) title!: string

  @Prop({ type: Boolean }) loading!: boolean
  @Prop({ type: Boolean }) disabled!: boolean
  @Prop({ type: Boolean, default: true }) clear!: boolean

  @Prop({ type: [Object, Array] }) form!: Vue
  get listeners() {
    const { open, closed, submit, ...rest } = this.$listeners
    return rest
  }

  onOpen() {
    if (this.clear) {
      const { clearValidate } = (this.$parent.$refs['form'] || {}) as any
      if (typeof clearValidate === 'function') {
        setTimeout(() => {
          clearValidate()
        }, 0)
      }
    }
    const { open } = this.$listeners
    if (typeof open === 'function') open()
  }

  onClosed() {
    if (this.clear) {
      const { resetFields } = (this.$parent.$refs['form'] || {}) as any
      if (typeof resetFields === 'function') resetFields()
    }
    const { closed } = this.$listeners
    if (typeof closed === 'function') closed()
  }
  updated() {
    this.$nextTick(function() {
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
  $radius: 5px;
  $font-color: #fff;
  $bg-color: rgba(45, 116, 231, 1);
  border-radius: $radius;
  /deep/ .el-dialog {
    background-color: transparent;
    &__header {
      background-color: $bg-color;
      color: $font-color;
      border-bottom-color: $bg-color;
      height: 40px;
      text-indent: 0;
      padding: 0 1em;
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
  }
}
</style>
