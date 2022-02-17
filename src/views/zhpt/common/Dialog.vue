<template>
  <el-dialog v-dialogDrag id="Dialog" class="Dialog" :width="width" :top="top" :title="title" :visible.sync="visible" :close-on-click-modal="false" :destroy-on-close="true">
    <div class="content" />
  </el-dialog>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'Dialog',
  components: {},
  props: ['show', 'hide', 'setSize'],
  data() {
    return {
      visible: false,
      title: '',
      width: '50%',
      top: '50%',
      content: ''
    }
  },
  watch: {},
  mounted() {
    this.$emit('update:Show', this._show)
    this.$emit('update:Hide', this._hide)
    this.$emit('update:setSize', this._setSize)
  },
  methods: {
    _show(title, content) {
      this.visible = true
      this.title = title
      this.content = content
      var that = this
      this.$nextTick(function() {
        $(that.$el).find('.content').html(that.content)
      })
    },
    _hide() {
      this.visible = false
      this.title = ''
      this.content = ''
      this.$nextTick(function() {
        $(that.$el).find('.content').html(that.content)
      })
    },
    _setSize(width, top) {
      this.width = width
      this.top = top
    }
  }
}
</script>

<style lang='scss' scoped>
.Dialog {
  position: absolute;
  top: 0px;
  left: 0px;
  .content{
    position: relative;
    top: 100%;
    width: 100%;
  }
}
</style>
