<template>
  <div class="project-box">
    <!-- 报告内管段状态评估汇总 -->
    <el-table
      :data="tableData"
      border
      :summary-method="getSummaries"
      show-summary
      style="width: 100%; margin-top: 20px"
      stripe
    >
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center" fixed="left">
      </el-table-column>
      <!-- 其它 -->
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="(v, i) in tableContent.other"
        :key="i"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- 埋深 -->
      <el-table-column label="埋深(m)" header-align="center">
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="(v, i) in tableContent.buriedDepth"
          :key="i"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table-column>

      <!-- 结构性缺陷 -->
      <el-table-column label="结构性缺陷" header-align="center">
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="(v, i) in tableContent.structEstimate"
          :key="i"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table-column>

      <!-- 功能性缺陷 -->
      <el-table-column label="功能性缺陷" header-align="center">
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="(v, i) in tableContent.funcEstimate"
          :key="i"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryPipeStateDetails } from '@/api/pipelineManage'

export default {
  props: ['paramId'],
  data() {
    return {
      // 表格参数
      tableContent: {
        other: [
          { label: '管段编号', name: 'expNo' },
          { label: '管径(mm)', name: 'diameter' },
          { label: '长度(m)', name: 'pipeLength' },
          { label: '材质', name: 'material' }
        ],
        buriedDepth: [
          { label: '起点', name: 'material' },
          { label: '终点', name: 'material' }
        ],
        structEstimate: [
          { label: '平均值S', name: 'structYmean' },
          { label: '最大值Smax', name: 'structYmax' },
          { label: '缺陷等级', name: 'structClass' },
          { label: '缺陷密度', name: 'structDensity' },
          { label: '修复指数RI', name: 'repairIndex' },
          { label: '综合状况评价', name: 'structEstimate' }
        ],
        funcEstimate: [
          { label: '平均值S', name: 'funcYmean' },
          { label: '最大值Ymax', name: 'funcYmax' },
          { label: '缺陷等级', name: 'funcClass' },
          { label: '缺陷密度', name: 'funcDensity' },
          { label: '养护指数MI', name: 'maintainIndex' },
          { label: '综合状况评价', name: 'funcEstimate' }
        ]
      },
      tableData: []
    }
  },
  async mounted() {
    //
    let resPrj = await queryPipeStateDetails(this.paramId)
    this.tableData = resPrj.result
    console.log('管段状态评估汇总  ', resPrj)
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
    // font-weight: bold;
    // border: 2px solid #666;
    .is-group {
      .el-table__cell {
        background: rgb(234, 241, 253) !important;
      }
    }
    .has-gutter .cell {
      color: rgb(50, 59, 65);
      // font-weight: bold;

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
      border: 1px solid #DEDEDE;
    }
  }
}
</style>