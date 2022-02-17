<template>
  <!-- 下拉框多选组件 -->
  <div class="select_multiple_item" :style="customStyle">
    <div class="title_box">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div class="select_box">
      <el-select
        :value="value"
        :filterable="filterable"
        :placeholder="placeholder"
        :disabled="disabled"
        :collapse-tags="collapsetags"
        :clearable="clearable"
        size="small"
        multiple
        @change="changeSelectMultipleValue"
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
  name: 'SelectMultiple',
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
      type: Array,
      required: true
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
      default: '请选择'
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
    collapsetags:{
      type:Boolean,
      default: false
    },
    clearable:{
      type:Boolean,
      default: false
    }
  },

  methods: {
    changeSelectMultipleValue(event) {
      this.$emit('changeSelectMultipleValue', this.nominate, event)
    }
  }
}
</script>
<style lang='scss'>
.select_multiple_item{
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

.select_multiple_box{
  float: right;
  width: 80%;
}
</style>
