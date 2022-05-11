<template>
  <div class="project-box">
    <!-- 主要工程量表 -->
    <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%; margin-top: 20px" stripe>
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
    // border: 2px solid #666;

    .has-gutter .cell {
      color: rgb(50, 59, 65);
      // font-weight: bold;
      background: rgb(234, 241, 253) !important;
      word-break: keep-all !important;
      white-space: nowrap !important;
      .item {
        display: inline-block;
        width: 100%;
        line-height: 106%;

        /* 1.先强制一行内显示文本 */
        white-space: nowrap;
        /* 2.超出部分隐藏 */
        overflow: hidden;
        /* 3.文字用省略号替代超出的部分 */
        text-overflow: ellipsis;
      }
    }
    .el-table__row--striped > td {
      background-color: #f3f7fe !important;
    }
    .el-table__cell {
      // border: 1px solid #666;
    }
  }
}
</style>