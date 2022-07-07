<template>
  <div class="table-component">
    <div class="filter-area">
      <slot name="filter"></slot>
    </div>
    <div class="table-area">
      <el-table
        :data="tableData"
        border
        stripe
        size="medium"
        @select="tableSelect"
        @selection-change="handleSelectionChange"
        @row-dblclick="dblclickEvent"
        ref="tableRef"
        style="width: 100%; height: calc(100% - 50px)"
        max-height="700px"
      >
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
        </template>
        <el-table-column
          :formatter="formatter"
          v-for="item in tableColumns"
          :align="item.aligin"
          :sortable="item.sortable"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :type="item.type"
        ></el-table-column>
      </el-table>
      <el-pagination
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.current"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50, 100, 1000]"
        :page-size="pageInfo.size"
        :total="pageInfo.tableTotal"
      >
      </el-pagination>
    </div>

    <el-dialog v-dialogDrag :visible.sync="dialogShow" :title="dialogTitle" :width="dialogWidth">
      <el-form :model="formModel" :rules="formRule" label-position="right" :label-width="labelWidth">
        <el-row>
          <el-col>
            <el-form-item> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    tableColumns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '弹窗标题'
    },
    dialogWidth: {
      type: String,
      default: '850px'
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    formRule: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    pageInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // pageInfo: {
      // 	current: 1,
      // 	size: 10,
      // 	tableTotal:1
      // }
    }
  },
  methods: {
    /**
     * 渲染数据处理
     */
    formatter(row, column) {
      let typeValue = typeof row[column.property]
      if (typeValue == 'undefined') {
        return '-'
      } else if (typeValue == 'object' || typeValue == 'string') {
        if (!row[column.property]) {
          return '-'
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },
    handleSizeChange(pageSize) {
      this.$emit('size-change', pageSize)
    },
    handleCurrentChange(currentPage) {
      this.$emit('current-change', currentPage)
    },
    tableSelect: function(e, s) {
      this.$emit('select', e, s)
    },
    handleSelectionChange(val) {
      // console.log("选中："+val)
      this.$emit('selection-change', val)
    },
    dblclickEvent(val) {
      // console.log("选中："+val)
      this.$emit('row-dblclick', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-component {
  display: flex;
  flex-direction: column;
  height: 100%;
  .filter-area {
    height: 60px;
    line-height: 60px;
  }
  .table-area {
    flex: 1;
  }
  .pagination-area {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
