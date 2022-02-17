<template>
  <!-- 多行文本组件 -->
  <div class="textarea_item" :style="customStyle">
    <div class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div class="textarea_box">
      <el-input
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :rows="rows"
        :show-word-limit="show"
        @input="changeValue($event)"
      />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Textarea',
  props: {
    type: {// 输入框类型
      type: String,
      default: ''
    },
    title: {// 标题
      type: String,
      default: ''
    },
    required: {// 是否必填
      type: Boolean,
      default: false
    },
    value: {// 值
      type: String,
      default: ''
    },
    disabled: {// 是否禁用
      type: Boolean,
      default: false
    },
    placeholder: {// 提示文字
      type: String,
      default: '请输入'
    },
    maxlength: {//  最大长度
      type: Number,
      default: 50
    },
    customStyle: {// 自定义样式
      type: String,
      default: ''
    },
    nominate: {// 字段
      type: String,
      required: true
    },
    rows: {// 默认多少行
      type: Number,
      default: 2
    },
    show: {// 是否显示统计
      type: Boolean,
      default: false
    }
  },

  methods: {
    changeValue(event) {
      this.$emit('changeValue', this.nominate, event)
    }
  }
}
</script>
<style lang='scss'>
.textarea_item{
  // height: 32px;
  .title_box{
    float: left;
    width: 30%;
    text-align: right;
    // line-height: 32px;
  }
}
.required-class{
  color: red;
}

.textarea_box{
  float: right;
  width: 70%;
}
</style>
