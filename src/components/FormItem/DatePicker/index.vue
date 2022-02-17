<template>
  <!-- DatePicker组件 -->
  <div class="DatePicker_item" :style="customStyle">
    <div class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div class="DatePicker_box">
      <el-date-picker
        v-model="value1"
        type="date"
        format="yyyy 年 MM 月 dd 日"
        :placeholder="placeholder"
        :disabled="disabled"
        size="small"
        @change="changeDatePickerValue"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
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
      type: Date,
      required: true
    },
    disabled: {// 是否禁用
      type: Boolean,
      default: false
    },
    placeholder: {// 提示文字
      type: String,
      default: ''
    },
    customStyle: {// 自定义样式
      type: String,
      default: ''
    },
    nominate: {// 字段名不能与value名一样   不是会报错   elememtui日期组件出错
      type: String,
      required: true
    }
  },
  data() {
    return {
      value1: ''
    }
  },
  mounted() {
    if (this.value) {
      this.value1 = this.value
    }
  },
  methods: {
    changeDatePickerValue(event) {
      this.$emit('changeDatePickerValue', this.nominate, event)
    }
  }
}
</script>
<style lang='scss'>
.DatePicker_item{
  height: 32px;
  line-height: 32px;
  &::after{
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0;
  }
  .title_box{
    float: left;
    width: 20%;
    text-align: right;
  }
}
.required-class{
  color: red;
}

.DatePicker_box{
  float: right;
  text-align: left;
}
</style>
