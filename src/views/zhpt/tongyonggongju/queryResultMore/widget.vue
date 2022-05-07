<template>
  <div ref="mainDiv" style="width: 100%; height: 100%;">
    <el-table class="mapTable" style="width:100%;" height="calc(100% - 40px)" @row-dblclick="viewFeature" tooltip-effect="dark" stripe :data="featureData" ref="table">
      <el-table-column v-for="item in colsData" :key="item.prop" :prop="item.prop" :label="item.label" />
    </el-table>
    <div style="width:100%;margin-top:8px;">
      <div style="float:left;width:80%">
        <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :page-sizes="[5, 10, 50, 100]" :total="total"
          @current-change="updatePage" @size-change="updatePage"/>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'QueryResultMore',
  components: {  },
  props: { param: Object },
  data() {
    return {
      activeName: '',
      tabs: [],
      column: [],

      tableData: null,
      featureData: [],
      total: 0,
      colsData: [],
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init () {
      this.tableData = this.param.data || []
      if (this.tableData.length !== 0) {
        if (this.tableData < this.pageSize) {
          this.featureData = [...this.tableData].splice(0, this.tableData.length)
        } else {
          this.featureData = [...this.tableData].splice(0, this.pageSize)
        }
      }
      this.colsData = this.param.colsData || []
      this.total = this.tableData.length
    },
    updatePage () {
      let firstIndex = this.pageSize * (this.currentPage - 1)
      let length = this.pageSize * this.currentPage > this.tableData.length ? (this.tableData.length % this.pageSize) : this.pageSize
      this.featureData = [...this.tableData].splice(firstIndex, length)
    },
    viewFeature (row) {
      if (row.geometry) {
        // 调用该组件的界面需要定义 gotoGeometry 方法
        this.param.rootPage && this.param.rootPage.gotoGeometry(row.geometry)
      } else this.$message.error("无图形信息")
    }
  }
}
</script>
