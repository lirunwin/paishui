<template>
  <el-table class="base-table" v-on="$listeners" v-bind="{ ...defaultAttrs, ...attrs }" :style="style">
    <template slot="empty">
      <img src="@/assets/icon/null.png" alt="" />
      <p style="margin-top:-7px">暂无数据</p>
    </template>
    <el-table-column v-for="col of columns" :key="col.prop || col.type" v-bind="{ align: 'center', ...col }" />
  </el-table>
</template>

<script lang="ts">
import { ElTable } from 'element-ui/types/table'
import { ElTableColumn } from 'element-ui/types/table-column'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  inheritAttrs: false,
  props: {
    columns: { type: Array as PropType<Partial<ElTableColumn>[]> }
  },
  data() {
    return {
      defaultAttrs: {
        toolTipEffect: 'light',
        showOverflowTooltip: true,
        size: 'medium',
        stripe: true,
        headerCellStyle: {
          background: '#e0eafb',
          color: 'rgb(50,59,65)',
          height: '46px',
          textAlign: 'center'
        },
        cellStyle: {
          height: '40px'
        },
        highlightCurrentRow: true
      } as Partial<ElTable>
    }
  },
  computed: {
    attrs() {
      const { columns, style, ...attrs } = this.$attrs
      return attrs as Partial<ElTable>
    },

    style() {
      const { style: tableStyle } = this.$attrs
      return typeof tableStyle === 'string' ? `width: 100%;${tableStyle}` : { width: '100%', ...tableStyle }
    }
  },
  watch: {
    attrs: {
      immediate: true,
      handler(val) {
        console.log({ val })
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.base-table {
  &.el-table--striped {
    /deep/ .el-table__body tr.el-table__row--striped.el-table__row--striped.el-table__row--striped td {
      background-color: #f3f7fe;
    }
  }
}
</style>
