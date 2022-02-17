<template>
  <el-card class="box-card" :style="{width: width}">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <el-select v-if="choice" v-model="task" placeholder="请选择" size="small" class="select_style">
        <el-option
          v-for="item in statisticalTask"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-if="choice" v-model="timeSlot" placeholder="请选择" size="small" class="select_style select_wd">
        <el-option
          v-for="item in time"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-if="refresh" class="btn_class" icon="el-icon-refresh-right" type="primary" circle @click="handelRefresh" />
      <el-button v-if="more" class="btn_class" icon="el-icon-more" type="primary" circle @click="handelMore" />
      <el-button v-if="linebar" class="btn_class" icon="el-icon-share" type="primary" circle @click="handelLine" />
      <el-button v-if="linebar" class="btn_class" icon="el-icon-s-data" type="primary" circle @click="handelbar" />

    </div>
    <div class="text item" :style="{ height: itemHeirht }">
      <slot />
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Control',
  props: {
    title: {
      type: String,
      default: ''
    },
    refresh: {
      type: Boolean,
      default: false
    },
    more: {
      type: Boolean,
      default: false
    },
    linebar: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '49%'
    },
    itemHeirht: {
      type: String,
      default: '200px'
    },
    statisticalTask: {
      type: Array,
      default: () => []
    },
    time: {
      type: Array,
      default: () => []
    },
    choice: {
      type: Boolean,
      default: false
    },
    refName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      task: '',
      timeSlot: '1'

    }
  },
  methods: {
    // 刷新
    handelRefresh() {
      this.$emit('refresh')
    },

    // 更多
    handelMore() {
      this.$emit('more')
    },

    handelLine() {
      this.$emit('line', this.refName)
    },
    handelbar() {
      this.$emit('bar', this.refName)
    }
  }

}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  // margin-bottom: 18px;
  overflow: auto;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  float: left;
  margin-bottom: 1%;
  margin-right: 1%;
}
.btn_class {
  float: right;
  padding: 3px;
  margin: 0 5px
}
.select_style{
  margin-left: 10px;
  width: 36%;
  // float: right;
  display: inline-block;
  .el-input{
  width: 100% !important;
}
}
.select_wd{
  width: 21%;
}
</style>
<style lang='scss'>
.select_style,.select_wd{
  .el-input{
  width: 100% !important;
}
}
</style>
