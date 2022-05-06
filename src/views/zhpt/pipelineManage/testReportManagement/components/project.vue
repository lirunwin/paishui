<template>
  <div class="project-box">
    <!-- 主要工程量表 -->
    <el-table
      :data="tableData"
      border
      :summary-method="getSummaries"
      show-summary
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="name" label="名称" width="400" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="num" label="管径(mm)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="amount1" label="管段长度(m)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="amount2" label="检测长度(m)" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="amount3" label="备注" align="center" header-align="center"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      tableData: [
        {
          name: '污水管道0015625',
          num: '234',
          amount1: '23.2',
          amount2: '23.2',
          amount3: '分6段'
        },
        {
          name: '污水管道0015625',
          num: '234',
          amount2: '23.2',
          amount1: '23.3',
          amount3: '分8段'
        },
        {
          name: '污水管道0015625',
          num: '234',
          amount1: '23.3',
          amount2: '23.2',
          amount3: '分6段'
        }
      ]
    }
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