<template>
  <div class="base-table">
    <el-table class="table" v-on="$listeners" v-bind="{ ...defaultAttrs, ...attrs }" :style="style">
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="" />
        <p style="margin-top:-7px">暂无数据</p>
      </template>
      <template v-for="{ prop, type, _slot, ...col } of columns">
        <template v-if="_slot">
          <el-table-column :key="prop || type" v-bind="{ align: 'center', prop, type, ...col }">
            <template v-slot="slotScope" v-if="_slot">
              <slot
                :name="`${prop}-${slotScope.$index}`"
                v-bind="{ ...slotScope, col: { prop, type, _slot, ...col } }"
              />
            </template>
          </el-table-column>
        </template>
        <el-table-column v-else :key="prop || type" v-bind="{ align: 'center', prop, type, ...col }" />
      </template>
    </el-table>
    <el-pagination
      v-if="pagination"
      :current-page="pagination.current"
      :page-sizes="[10, 20, 30, 50, 100, 1000]"
      :page-size="pagination.size"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="($event) => onPageChange($event, 'size')"
      @current-change="($event) => onPageChange($event, 'current')"
    />
  </div>
</template>
<script lang="ts">
import { ElTable } from 'element-ui/types/table'
import { ElTableColumn } from 'element-ui/types/table-column'
import Vue, { PropType } from 'vue'

interface IPagination {
  current?: string | number
  size?: string | number
  total?: string | number
}

type ICol = Partial<ElTableColumn> & {
  _slot: boolean
}

export default Vue.extend({
  inheritAttrs: false,
  props: {
    columns: { type: Array as PropType<ICol[]> },
    pagination: { type: Object as PropType<IPagination> }
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
    onPageChange(e: any, type: 'size' | 'current') {
      this.$emit(`${type}-change`, e)
      this.$emit(`${type}Change`, e)
      this.$emit('page-change', e)
      this.$emit('pageChange', e)
    }
  }
})
</script>
<style lang="scss">
.base-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 40px);
  .table {
    flex: 1 1 auto;
    margin-bottom: 14px;
    &.el-table--striped {
      /deep/ .el-table__body tr.el-table__row--striped.el-table__row--striped.el-table__row--striped td {
        background-color: #f3f7fe;
      }
    }
    /deep/ td.el-table__cell {
      border-color: rgba(#dedede, 0.6);
    }
  }
}

.page-container {
  display: flex;
  flex-direction: column;
  > .el-row {
    height: 100%;
    > .el-col {
      height: 100%;
    }
  }

  .table-container {
    flex: 1 1 100%;
    height: 100%;
  }
}
</style>
