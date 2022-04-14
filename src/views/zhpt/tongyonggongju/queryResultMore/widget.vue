<template>
  <div ref="mainDiv" style="width: 100%; height: 100%;">
    <el-table class="mapTable" style="width:100%;" height="calc(100% - 40px)" @row-dblclick="viewFeature" tooltip-effect="dark" stripe :data="featureData" ref="table">
      <el-table-column v-for="item in colsData" :key="item.prop" :prop="item.prop" :label="item.label" />
      <!-- <el-table-column prop="respUserName" label="主要负责人"/>
      <el-table-column prop="teamUserName" label="协同处理人"/>
      <el-table-column prop="isread" label="是否确认"/>
      <el-table-column prop="isrepeat" label="是否返工"/>
      <el-table-column prop="repeatNum" label="返工次数"/>
      <el-table-column prop="state" label="工单状态"/>
      <el-table-column prop="ratifyTime" label="核定用时"/>
      <el-table-column prop="realTime" label="系统用时"/>
      <el-table-column prop="regionName" label="所在片区"/>
      <el-table-column prop="address" label="实际地址"/>
      <el-table-column prop="confirmTime" label="接收时间"/>
      <el-table-column prop="overTime" label="处理完成上报时间"/> -->
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
    this.init_new()
  },
  methods: {
    init() {          
      var pages = this.$refs.pagination
      request({ url: '/gps/repairuser/page?repairDevice=' + this.param.id + '&current=' + pages.internalCurrentPage + '&size=' + pages.internalPageSize
        , method: 'get' }).then(res => {
        if(res.code == 1) {          
          this.total = res.result.total
          res = res.result.records
          var rows = []
          for(var i=0,ii=res.length;i<ii;i++) {
            var row = res[i]
            rows.push({
              respUserName: row.respUserName || '-',
              teamUserName: row.teamUserName || '-',
              isread: row.isread || '-',
              isrepeat: row.isrepeat || '-',
              repeatNum: row.repeatNum || '-',
              state: row.state || '-',
              ratifyTime: row.ratifyTime || '-',
              realTime: row.realTime || '-',
              regionName: row.regionName || '-',
              address: row.address || '-',
              confirmTime: row.confirmTime || '-',
              overTime: row.overTime || '-',
            })
          }
          this.featureData = rows
        } else this.$message(res.message)
      })
    },
    init_new () {
      console.log("更多信息")

      this.tableData = this.param.data || []
      if (this.tableData.length !== 0) {
        if (this.tableData < this.pageSize) {
          this.featureData = this.tableData.splice(0, this.tableData.length)
        } else {
          this.featureData = this.tableData.splice(0, this.pageSize)
        }
      }
      this.colsData = this.param.colsData || []
      this.total = this.tableData.length
    },
    updatePage () {
      console.log(this.pageSize, this.currentPage)
      let firstIndex = this.pageSize * (this.currentPage - 1)
      let length = this.pageSize * this.currentPage > this.tableData.length ? (this.tableData.length % this.pageSize) : this.pageSize
      this.featureData = [...this.tableData].splice(firstIndex, length)
    },
    viewFeature (row) {
      if (row.geometry) {
        if (this.param.rootPage) {
          this.param.rootPage.gotoGeometry(row.geometry)
        }
      } else this.$message.error("无图形信息")
    }
  }
}
</script>
