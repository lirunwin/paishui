<template>
  <div class="project-box">
    <!-- 主要工程量表 -->
    <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%; margin-top: 20px">
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="material" label="名称" width="400" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="diameter" label="管径(mm)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="totleLength" label="管段长度(m)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="totleJcLength" label="检测长度(m)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="totleNum" label="总数量" align="center" header-align="center"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryProjectDetails } from '@/api/pipelineManage'

export default {
  props: ['paramId'],
  data() {
    return {
      tableData: [
      ]
    }
  },
  async mounted() {
    // 主要工程量表
    let resPrj = await queryProjectDetails(this.paramId)
    this.tableData = resPrj.result
    console.log('工程量表', resPrj)
    console.log('上面传来的id', this.paramId)
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = '/'
        }
      })

      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.project-box {
  /deep/.el-table {
    font-weight: bold;
    border: 2px solid #666;

    .has-gutter .cell,
    .el-table__footer-wrapper tbody td.el-table__cell {
      color: #666;
      font-weight: bold;
      background-color: #eeece1 !important;
    }
    .el-table__cell {
      border: 1px solid #666;
    }
  }
}
</style>