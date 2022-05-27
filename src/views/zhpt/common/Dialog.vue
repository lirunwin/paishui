<template>
  <el-dialog
    v-dialogDrag
    id="Dialog"
    class="Dialog"
    :width="width"
    :top="top"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="content" />
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import $ from 'jquery'
@Component({
  name: 'Dialog'
})
export default class Dialog extends Vue {
  @Prop() show: any
  @Prop() hide: any
  @Prop() setSize: any

  visible = false
  title = ''
  width = '50%'
  top = '50%'
  content = ''
  mounted() {
    this.$emit('update:show', this._show)
    this.$emit('update:hide', this._hide)
    this.$emit('update:setSize', this._setSize)
  }
  _show(title, content) {
    this.visible = true
    this.title = title
    this.content = content
    var that = this
    this.$nextTick(function() {
      $(that.$el)
        .find('.content')
        .html(that.content)
    })
  }
  _hide() {
    this.visible = false
    this.title = ''
    this.content = ''
    this.$nextTick(function() {
      $(this.$el)
        .find('.content')
        .html(this.content)
    })
  }
  _setSize(width, top) {
    this.width = width
    this.top = top
  }
}
</script>

<style lang="scss" scoped>
.Dialog {
  position: absolute;
  top: 0px;
  left: 0px;
  .content {
    position: relative;
    top: 100%;
    width: 100%;
  }
}
</style>
