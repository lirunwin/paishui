<template>
  <div style="overflow:hidden">
    <slot name="filters" />
    <el-table
      :data="tableData"
      border
      stripe
      :style="{ width: '100%', marginTop: '10px' }"
      :height="tableheight + 'px'"
      :header-cell-style="{ 'text-align': 'center' }"
      :max-height="tableheight"
      show-overflow-tooltip
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-dblclick="Dbclick"
    >
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="" />
      </template>
      <template v-for="col in columns">
        <el-table-column
          v-if="col.prop !== 'action'"
          :key="col.prop"
          :type="col.type"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :formatter="col.formatter"
        />
        <el-table-column
          v-if="col.prop === 'action'"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        >
          <template slot-scope="data">
            <span
              v-for="action in actionsShow(col.actions, data)"
              :key="action.key"
              :style="{ color: action.color, marginRight: '4%', cursor: 'pointer' }"
              @click="handleClick(data.row, action.key)"
              >{{ action.label }}</span
            >
            <!-- <span v-for="act in col.acts" :key="act.emitWay" :style="{color: act.color, cursor: 'pointer', marginRight: '10px'}" @click.stop="operation(act.emitWay, data)">{{ act.operation }}</span> -->
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-row v-if="ispagination" type="flex" justify="center" align="middle">
      <el-pagination
        :current-page="pagination.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    ispagination: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: () => {
        return { current: 1, size: 20 }
      }
    },
    total: {
      type: Number,
      default: 0
    },
    tableheight: {
      type: Number,
      default: 400
    }
  },
  computed: {
    actionsShow() {
      return function(param, data) {
        // console.log("参数："+JSON.stringify(data.row)+"  param:"+JSON.stringify(param))
        const { row } = data
        return param.filter((item) => {
          if (!item.flag) return item
          if (item.flag === '3' && !(typeof row.routeIp === 'undefined' || row.routeIp == null || row.routeIp == '')) {
            return item
          }
          if (item.flag === '0' && row.isconfirm == '0') return item
          if (item.flag === '1' && row.isconfirm == '1') return item
          if (item.flag === '0' && item.flag === row.flag) return item
        })
      }
    }
  },
  methods: {
    handleClick(data, type) {
      this.$emit(type, { type, data })
    },
    Dbclick(row) {
      this.handleClick(row, 'deal')
    },
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    handleCurrentChange(page) {
      this.$emit('curr-change', page)
    },
    handleSelect(selections) {
      this.$emit('selection-change', selections)
    },
    handleSelectAll(selections) {
      this.$emit('select-all', selections)
    }
  }
}
</script>
