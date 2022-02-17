<template>
  <!-- input组件 -->
  <div class="input_number_item" :style="customStyle">
    <div class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div class="input_number_box">
      <el-input-number
        :value="value"
        controls-position="right"
        size="small"
        :disabled="disabled"
        :placeholder="placeholder"
        :max="maxLength"
        :step="step"
        @change="handleChange"
      />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    title: {// 标题
      type: String,
      default: ''
    },
    required: {// 是否必填
      type: Boolean,
      default: false
    },
    value: {// 值
      type: Number,
      default: 0
    },
    disabled: {// 是否禁用
      type: Boolean,
      default: false
    },
    placeholder: {// 提示文字
      type: String,
      default: '请输入'
    },
    maxLength: {//  最大长度
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
    step: { // 小数
      type: Number,
      default: 1
    }
  },

  methods: {
    handleChange(value) {
      console.log(value)
      this.$emit('changeValue', this.nominate, value)
    }
  }
}
</script>
<style lang='scss' scoped>
.input_number_item{
  height: 32px;
  min-width: 242px;
  display: flex;
  align-items: center;
  .title_box{
    float: left;
    width: 25%;
    text-align: right;
    height: 32px;
    // line-height: 32px;
  }
}
.required-class{
  color: red;
}

.input_number_box{
  float: right;
  width: 75%;
}
</style>
