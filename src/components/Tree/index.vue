<template>
  <div class="tree_item" :style="customStyle">
    <div class="title_box" :style="titleBoxCustomStyle">
      <span v-if="required" class="required-class">*</span>
      <span>{{ title }}</span>
    </div>
    <div class="tree_box" :style="treeBoxCustomStyle">
      <el-tree
        ref="tree"
        :data="value"
        
        show-checkbox
        :node-key="nodeKey"
        :default-expand-all="defaultExpandAll"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultCheckedKeys"
        :props="defaultProps"
        @check="getCheckedKeys"
      />
    </div>

  </div>

</template>

<script>
export default {
  name: 'Tree',
  props: {
    title: {// 标题
      type: String,
      default: ''
    },
    required: {// 是否必填
      type: Boolean,
      default: false
    },
    value: {// 数据
      type: Array,
      required: true
    },
    customStyle: {// 自定义样式
      type: String,
      default: ''
    },
    titleBoxCustomStyle:{// 提示标签自定义样式
      type: String,
      default: ''
    },
    treeBoxCustomStyle: {// 树状图自定义样式
      type: String,
      default: ''
    },
    nominate: {// 字段
      type: String,
      required: true
    },
    defaultProps: {// 子节点的配置
      type: Object,
      required: true
    },
    defaultCheckedKeys: {// 选中的值
      type: Array,
      required: true
    },
    defaultExpandAll: {// 是否展开
      type: Boolean,
      default: false
    },
    nodeKey: { // node-key设置
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$refs.tree.store.defaultExpandAll = true
  },
  methods: {
    getCheckedKeys() {
      const values = this.$refs.tree.getCheckedNodes().map(item => item[this.nodeKey])
      this.$emit('getChangValueTree', this.nominate, values)
    }
  }
}
</script>
<style lang="scss">
.tree_item{
  // height: 32px;
  // min-width: 242px;
  overflow: auto;
  min-height: 200px;
  max-height: 600px;
  .title_box{
    float: left;
    width: 30%;
    text-align: right;
    height: 32px;
    // line-height: 32px;
  }
}
.required-class{
  color: red;
}

.tree_box{
  float: right;
  width: 70%;
  overflow: auto;
  min-height: 200px;
  max-height: 600px;
}
</style>
