<template>
  <div ref="mainDiv" style="width: 100%; height: 100%;">
    <el-table class="mapTable" style="width:100%;" height="calc(100% - 40px)" tooltip-effect="dark" stripe :data="featureData" ref="table">
      <el-table-column prop="respUserName" label="主要负责人"/>
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
      <el-table-column prop="overTime" label="处理完成上报时间"/>
    </el-table>
    <div style="width:100%;margin-top:8px;">
      <div style="float:left;width:80%">
        <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next" :page-sizes="[5, 10, 50, 100]" :total="total"
          @current-change="init" @size-change="init"/>
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
      featureData: [],
      total: 0,
    }
  },
  mounted() {
    this.init()
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
    }
  }
}
</script>
