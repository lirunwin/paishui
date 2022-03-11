<template>
  <!-- 表格组件 -->
  <div :style="'height:'+tableheightSet(tableheight)">
    <el-table
      ref="multipleTable"
      :v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      :style="{width: '100%'}"
      :height="'calc(100% - 45px)'"
      :max-height="'calc(100% - 45px)'"
      :border="border"
      :show-summary="summary"
      :cell-style="cellStyleF"
      :header-cell-style="headerStyle"
      :stripe="stripe"
      :summary-method="getSummaries"
      :span-method="objectSpanMethod"
      :header-row-style="headerRowStyle"
      :row-class-name="tableRowClassName"
      :cell-class-name="cellClassName"
      :row-style="rowStyle"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      @row-dblclick="rowDblclick"
      @row-click="rowClick"
      @cell-dblclick="cellDblclick"
      @select="select"
      @cell-click="cellClick"
      @cell-dbclick="cellDblclick"
      @select-all="selectAll"
    >
      <!-- highlight-current-row -->
      <!-- @current-change="TablehandleCurrentChange" -->
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column v-if="multiple" type="selection" width="40" />
      <el-table-column v-if="forId" label="序号" type="index" width="50" />
      <el-table-column
        v-for="(item,colIndex) of column.filter(
          ele => ele.prop && ele.prop !== 'image'&& ele.prop !== 'lqSl'&& ele.slotScoped !== 'tags'&& ele.slotScoped !== 'operation'&& ele.slotScoped !== 'operationIcon'&& ele.slotScoped !== 'father')"
        :key="colIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :sortable="item.sortable"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <!-- <template v-if="row[item.prop]||String(row[item.prop])==='0'||String(row[item.prop])==='00'">
            <span v-if="item.formatter" v-html="(item.formatter)(row,item.prop,row[item.prop],colIndex)" />
            <span v-else>{{ row[item.prop] }}</span>
          </template>
          <template v-else>
            <span>--</span>
          </template> -->
          <template v-if="item.formatter">
            <span v-html="(item.formatter)(row,item.prop,row[item.prop],colIndex)" />
          </template>
          <template v-else>
            <span v-if="row[item.prop]||String(row[item.prop])==='0'||String(row[item.prop])==='00'">{{ row[item.prop] }}</span>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>

      <!-- 附件下载 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'dwonfile')"
        :key="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template v-if="data.row.isdownfile" slot-scope="data">
          <span v-for="act in item.acts" :key="act.emitWay" :style="{color: act.color, cursor: 'pointer', marginRight: '10px'}" @click.stop="operation(act.emitWay, data)">{{ act.operation }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'action')"
        :key="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="data">
          <span v-for="act in item.acts" :key="act.emitWay" :style="{color: act.color, cursor: 'pointer', marginRight: '10px'}" @click.stop="operation(act.emitWay, data)">{{ act.operation }}</span>
        </template>
      </el-table-column>
      <!-- 多级 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'father')"
        :key="item.label"
        :label="item.label"
        :width="item.width"
      >
        <el-table-column
          v-for="data of item.children"
          :key="data.prop"
          :prop="data.prop"
          :label="data.label"
          :width="data.width"
        />
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'operation')"
        :key="item.label"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <span :style="{color:'#409EFF', cursor: 'pointer', marginRight: '10px'}" @click.stop="operationClick(scope.row)">{{ item.prop }}</span>
        </template>
      </el-table-column>
      <!-- 图标操作 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'operationIcon')"
        :key="item.label"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <el-tooltip :content="item.content" placement="bottom">
            <i :class="item.prop" style="cursor: pointer;" @click.stop="operationClickIcon(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- //筛选 -->
      <el-table-column
        v-for="item of column.filter(
          ele => ele.slotScoped === 'tags')"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :filter-method="filterTag"
        :filters="filters"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row[item.prop] === '0' ? 'primary' : 'danger' "
            disable-transitions
          >{{ tagNamelist[scope.row[item.prop]] }}</el-tag>
        </template>
      </el-table-column>
      <!-- sortable排序 show-overflow-tooltip影藏 -->
      <!-- 图片 -->
      <el-table-column
        v-for="item in column.filter(
          ele => ele.prop === 'image'
        )"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <el-popover placement="top-start" title trigger="click">
            <img :src="scope.row.image" alt style="width: 100%;height: 100%">
            <img slot="reference" :src="scope.row.image" style="width: 50px;height: 50px">
          </el-popover>
        </template>
      </el-table-column>
      <!-- //加入计数器 -->
      <el-table-column
        v-for="item in column.filter(
          ele => ele.prop === 'lqSl'
        )"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <div @click.stop>
            <el-input-number
              v-model="scope.row.lqSl"
              :min="0"
              :max="scope.row.kcNum"
              size="mini"
            />
          </div>

          <!-- @change="handleCareOrderItemNumChange(scope.row)" -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pagination"
      :current-page="currentpage"
      :page-sizes="[10, 20, 30, 50, 100,1000]"
      :page-size="pagesize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    // 表格是否可以多选（默认true不可多选）
    isSelect: {
      type: Boolean,
      default: true
    },
    // 映射对象
    // eslint-disable-next-line vue/require-default-prop
    tagNamelist: {
      type: Object,
      default: () => {},
      required: false
    },
    column: {
      type: Array,
      required: true
    },
    pagination: {
      type: Boolean,
      required: true
    },
    pagesize: {
      type: Number,
      default: 30
    },
    currentpage: {
      type: Number,
      default: 0
    },
    tableheight: {
      type: String,
      default: '435px'
    },
    // 单选高亮
    // highlight: {
    //   type: Boolean,
    //   required: false,
    //   default: true
    // },
    loading: {
      type: Boolean,
      required: false
    },
    summary: {
      type: Boolean,
      required: false
    },
    border: {
      type: Boolean,
      required: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    multiple: {
      type: Boolean,
      required: true
    },
    forId: {
      type: Boolean,
      default: false
    },
    // fixed: {
    //   type: Boolean,
    //   required: true
    // },
    // isdelete: {
    //   type: Boolean,
    //   required: true
    // },
    cellStyle: {
      type: Array,
      default: () => []
    },
    headerRowStyle: {
      type: Function,
      default: () => {
        return Function
      }
    },
    objectSpanMethod: {
      type: Function,
      default: () => {
        return Function
      }
    },
    getSummaries: {
      type: Function,
      default: () => {
        return Function
      }
    },
    // filterTag: {
    //   type: Function,
    //   default: () => {
    //     return Function
    //   }
    // },
    // tableRowClassName: {
    //   type: Function,
    //   default: () => {
    //     return Function
    //   }
    // },
    cellClassName: {
      type: Function,
      default: () => {
        return Function
      }
    },
    headerStyle: {
      type: Object,
      default: () => {
        return {
          background: 'rgba(250,250,250)',
          color: 'rgb(50,59,65)',
          height: '38px',
          textAlign: 'center'
        }
      }
    }
  },
  data() {
    return {
      flag: false,
      filters: [],
      selectionRow: []
    }
  },
  computed: {},
  mounted() {
    this.$refs.multipleTable.setCurrentRow(this.tableData[0])
    this.filters = []
    if (this.tagNamelist) {
      for (const i in this.tagNamelist) {
        this.filters.push({
          text: this.tagNamelist[i],
          value: i
        })
      }
    }
  },
  methods: {
    tableheightSet(val){
      const valType= typeof val;
      if(valType=='number'){
        return val+'px';
      }else{
        return val
      }
    },
    filterTag(value, row, column) {
      return row[column.property] === value
    },
    select(selection, row) {
      // console.log('selection111',selection, row);
      // if (this.isSelect) {
      //   if (selection.length > 1) {
      //     const del_row = selection.shift()
      //     this.$refs.multipleTable.toggleRowSelection(del_row, false)
      //   }
      // } else {
      //   this.$refs.multipleTable.toggleRowSelection(selection, false)
      // }
    },
    selectAll(selection) {
      // console.log('selection',selection);
      // if (this.isSelect) {
      //   if (selection.length > 1) {
      //     selection.length = 1
      //   }
      // }
    },

    cellStyleF({ row, column, rowIndex, columnIndex }) {
      if (this.cellStyle.length > 0) {
        let style = {}
        this.cellStyle.forEach(item => {
          if (columnIndex === item.index) {
            if (row[item.field] === item.value) {
              style = item.style
              // console.log(style)
              // style = style + "textAlign:'center'"
            }
          } else {
            style = { textAlign: 'center' }
          }
        })
        // console.log('tttt', style)
        return style
      } else {
        return { textAlign: 'center' }
      }
    },
    operation(field, data) {
      // this.$emit(field, data.row)
      this.$emit(field, data.row, field)
    },
    operationClick(row) {
      // this.$emit(field, data.row)
      this.$emit('operationClick', row)
    },
    operationClickIcon(row) {
      // this.$emit(field, data.row)
      this.$emit('operationClickIcon', row)
    },
    // 选择数据
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value)
      this.selectionRow = value
    },
    handleSizeChange: function(value) {
      this.$emit('handleSizeChange', value)
    },
    handleCurrentChange: function(currentPage) {
      this.$emit('handleCurrentChange', currentPage)
    },
    rowDblclick(row, column, event) {
      this.$emit('rowDblclick', row)
    },
    rowStyle({ row, rowIndex }) {
      // 给每一行添加不可枚举属性rowIndex来标识当前行
      Object.defineProperty(row, 'rowIndex', {
        value: rowIndex,
        writable: true,
        enumerable: false
      })
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event)
    },
    cellDblclick(row, column, cell, event) {
      this.$emit('cellDblclick', row, column, cell, event)
    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row, column)
      const findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex)
      if (findRow) {
        this.$refs.multipleTable.toggleRowSelection(row, false)
        return
      }
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(row, true) // 点击行选中效果
    },
    tableRowClassName({ row, rowIndex }) {
      let rowName = ''
      const findRow = this.selectionRow.find(c => c.rowIndex === row.rowIndex)
      if (findRow) {
        rowName = 'current-row '// elementUI 默认高亮行的class类 也可通过css覆盖改变背景颜色
      }
      return rowName // 也可以再加上其他类名 如果有需求的话
    },
    // TablehandleCurrentChange(currentPage,oldCurrentRow) {
    //   console.log('TablehandleCurrentChange', currentPage,oldCurrentRow)
    //   this.$emit('TablehandleCurrentChange', currentPage,oldCurrentRow)
    // },
    cellDblclick(row, column, cell, event) {
      this.$emit('cellDblclick', row, column)
    },
    rowSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    }
  }
}
</script>
<style lang='scss'>

//斑马线颜色
.el-table--striped .el-table__body tr.el-table__row--striped.el-table__row--striped.el-table__row--striped td {
  background-color:  #f0f9eb;
}
//行高亮样式点击当前行样式背景高亮
.el-table__body /deep/  tr.current-row >td{
  background: #fdf3ea !important;
  color: #f19944 ;
}
//实现hover前行样式背景高亮
.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #fdf3ea !important;
  color: #f19944;
}
// 去除自定义表格header和body不对其方式
.el-table--border th.gutter:last-of-type {
  display: block !important;
}
.el-table td,
.el-table th {
  padding: 2px 0  !important;
}
.el-table th > .cell {
  white-space: nowrap;
}
.el-table__empty-text{
  margin-top: 30px;
  line-height:30px;
  .empty-p{
    margin-top: -7px;
  }
}
.el-table__body tr.current-row>td{
  background-color: #69A8EA !important;
  color: #fff;
}
</style>
