<template>
  <!-- 下拉框组件 -->
  <div class="select_item" :style="customStyle">
    <div v-if="title" class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div :class="['select_box', title ? '' : 'select_box_100']">
      <el-select
        :value="value"
        :filterable="filterable"
        :placeholder="placeholder"
        :disabled="disabled"
        size="small"
        @change="changeSelectValue"
        :clearable="canClear"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Select',
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
      type: String,
      default: ''
    },
    disabled: {// 是否禁用
      type: Boolean,
      default: false
    },
    filterable: {// 是否开启搜索
      type: Boolean,
      default: false
    },
    placeholder: {// 提示文字
      type: String,
      default: ''
    },
    options: {//  选项
      type: Array,
      required: true
    },
    customStyle: {// 自定义样式
      type: String,
      default: ''
    },
    nominate: {// 字段
      type: String,
      required: true
    },
    canClear: { // 选择框可以清除
      type: Boolean,
      default: false
    }
  },

  methods: {
    changeSelectValue(event) {
      this.$emit('changeSelectValue', this.nominate, event)
    }
  }
}
</script>
<style lang='scss'>
.select_item{
  height: 32px;
  .title_box{
    float: left;
    width: 30%;
    text-align: right;
  }
}
.required-class{
  color: red;
}

.select_box{
  float: right;
  width: 70%;
}
.select_box_100{
  width: 100%;
}
.el-select{
  display: block;
}
</style>
