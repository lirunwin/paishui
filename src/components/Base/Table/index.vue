<template>
  <div class="tf-table" :style="{ paddingBottom: pagination ? 0 : '15px' }">
    <el-table ref="table" v-on="$listeners" v-bind="attrs">
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="暂无数据" />
      </template>
      <template v-for="{ prop, type, _slot, ...col } of columns">
        <template v-if="_slot">
          <el-table-column :key="prop || type" v-bind="{ headerAlign: 'center', align: 'center', prop, type, ...col }">
            <template v-slot="slotScope" v-if="_slot">
              <slot :name="prop" v-bind="{ ...slotScope, col: { prop, type, _slot, ...col } }" />
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-else
          :key="prop || type"
          v-bind="{ headerAlign: 'center', align: 'center', prop, type, ...col }"
        />
      </template>
      <slot />
    </el-table>
    <el-pagination
      v-if="pagination && pagination.total > 0"
      class="pagination"
      v-bind="{
        pageSizes: pageSizes,
        total: pagination.total,
        ...pagination,
        currentPage: pagination.currentPage || pagination.current,
        pageSize: pagination.pageSize || pagination.size,
        layout: pagination.layout || 'total, sizes, prev, pager, next, jumper'
      }"
      @size-change="($event) => onPageChange($event, 'size')"
      @current-change="($event) => onPageChange($event, 'current')"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { pageSizes } from '@/utils/constant'
import { ElTableColumn } from 'element-ui/types/table-column'
import { ElPagination } from 'element-ui/types/pagination'
import { camelCase } from 'lodash'

interface IPagination {
  current?: string | number
  size?: string | number
  total?: string | number
}

type ICol = Partial<ElTableColumn> & {
  _slot: boolean
}
@Component({ name: 'TfTable', inheritAttrs: false })
export default class Table extends Vue {
  @Prop({ type: Array, default: () => [] }) columns!: ICol[]
  @Prop({ type: Object, default: () => ({}) }) pagination!: ElPagination & IPagination

  pageSizes = pageSizes
  get attrs() {
    const defaultAttrs = {
      toolTipEffect: 'light',
      showOverflowTooltip: true,
      size: 'medium',
      rowKey: 'id',
      stripe: true,
      height: '100%'
      // highlightCurrentRow: true
    }
    return {
      ...defaultAttrs,
      ...Object.keys(this.$attrs).reduce((acc, key) => {
        acc[camelCase(key)] = this.$attrs[key]
        return acc
      }, {})
    }
  }

  onPageChange(e: any, type: 'size' | 'current') {
    this.$emit(`${type}-change`, e)
    this.$emit(`${type}Change`, e)
    this.$emit('page-change', { [type]: e })
    this.$emit('pageChange', { [type]: e })
  }
}
</script>


<style lang="scss" scoped>
.tf-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 15px 15px 0;
  background-color: #fff;
  z-index: 99;

  >>> .el-table {
    .el-table__header {
      th.el-table__cell {
        height: 40px;
        color: $--color-text-primary;
        background-color: rgba($--color-primary, 0.15);
        padding: 3px 0;
      }
    }
    .el-table__body {
      tr.el-table__row {
        td.el-table__cell {
          height: 34px;
          color: #555;
          background-color: $--color-white;
          padding: 3px 0;
        }
        &.el-table__row--striped {
          td.el-table__cell {
            background-color: rgba($--color-primary, 0.06);
          }
        }
        &.current-row {
          td.el-table__cell {
            background-color: rgba($--color-primary, 0.7);
            color: $--color-white;
          }
          &:hover {
            td.el-table__cell {
              color: $--color-warning;
            }
          }
        }
        &:not(.current-row):hover {
          td.el-table__cell {
            background-color: rgba($--color-primary, 0.1);
            color: $--color-warning;
          }
        }
      }
    }
    &:not(.el-table--border) {
      .el-table__body tr.el-table__row {
        td.el-table__cell {
          border: 0;
        }
        &:last-child {
          td.el-table__cell {
            border-bottom: 1px solid rgba($--color-primary, 0.06);
          }
        }
      }
    }
    .el-table__empty-text {
      img {
        max-width: 154px;
      }
    }
    &__fixed-right {
      box-shadow: none;
    }
  }
  .pagination {
    position: relative;
    position: sticky;
    bottom: 0;
    padding: 15px 0;
    background-color: #fff;
    z-index: 100;
  }
}
</style>
