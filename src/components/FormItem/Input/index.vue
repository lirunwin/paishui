<template>
  <!-- input组件 -->
  <div class="input_item" :style="customStyle">
    <div v-if="title" class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div :class="['input_box', title ? '' : 'input_box_100']">
      <el-input
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :max-length="maxLength"
        :disabled="disabled"
        size="small"
        @input="changeValue($event)"
        :clearable="canClear"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    type: {
      // 输入框类型
      type: String,
      required: true,
      default: 'text'
    },
    title: {
      // 标题
      type: String,
      default: ''
    },
    required: {
      // 是否必填
      type: Boolean,
      default: false
    },
    value: {
      // 值
      type: String,
      default: ''
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false
    },
    placeholder: {
      // 提示文字
      type: String,
      default: '请输入'
    },
    maxLength: {
      //  最大长度
      type: Number,
      default: 50
    },
    customStyle: {
      // 自定义样式
      type: String,
      default: ''
    },
    nominate: {
      // 字段
      type: String,
      default: ''
    },
    canClear: {
      // 输入框可以清除
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
<style lang="scss" scoped>
.input_item {
  height: 34px;
  font-size: $--font-size-base;
  .title_box {
    float: left;
    width: 30%;
    text-align: right;
    color: $--color-text-regular;
    // line-height: 32px;
  }
}
.required-class {
  color: red;
}

.input_box {
  float: right;
  width: 70%;
}
.input_box_100 {
  width: 100%;
}
</style>
