<template>
  <el-table class="base-table" v-on="$listeners" v-bind="{ ...defaultAttrs, ...attrs }" :style="style">
    <template slot="empty">
      <img src="@/assets/icon/null.png" alt="" />
      <p style="margin-top:-7px">暂无数据</p>
    </template>
    <template v-for="{ prop, type, _slot, ...col } of columns">
      <template v-if="_slot">
        <el-table-column :key="prop || type" v-bind="{ align: 'center', prop, type, ...col }">
          <template slot-scope="slotScope" v-if="_slot">
            <slot :name="`${prop}-${slotScope.$index}`" v-bind="{ ...slotScope, col: { prop, type, _slot, ...col } }" />
          </template>
        </el-table-column>
      </template>
      <el-table-column v-else :key="prop || type" v-bind="{ align: 'center', prop, type, ...col }" />
    </template>
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
          background: '#Eaf1Fd',
          color: 'rgb(50,59,65)',
          height: '46px',
          textAlign: 'center'
        },
        cellStyle: {
          height: '40px'
        }
        // highlightCurrentRow: true
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
  methods: {
    test(val) {
      console.log('val: ', val.map((item) => item.id))
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
  /deep/ td.el-table__cell {
    border-color: rgba(#dedede, 0.6);
  }
}
</style>
