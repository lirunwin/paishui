<template>
  <div class="project-box">
    <!-- 检测评估建议 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      stripe
    >
      <el-table-column type="index" label="序号" width="90" align="center" header-align="center">
      </el-table-column>
      <!-- 前面 -->
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="v in tableContent.other1"
        :key="v.label"
      >
      </el-table-column>
      <!-- 缺陷位置 -->
      <el-table-column label="缺陷位置" header-align="center">
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="v in tableContent.buriedDepth"
          :key="v.label"
        >
        </el-table-column>
      </el-table-column>
      <!-- 后面 -->
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="v in tableContent.other2"
        :key="v.label"
      >
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
        other1: [
          { label: '起始井', name: 'startPoint' },
          { label: '终止井', name: 'endPoint' },
          { label: '缺陷类型', name: 'defectName' }
        ],
        buriedDepth: [
          { label: '纵向(m)', name: 'direction' },
          { label: '环向', name: 'circular' }
        ],
        other2: [
          { label: '缺陷等级', name: 'defectLevel' },
          { label: '修复建议', name: 'checkSuggest' },
          { label: '修复方式', name: 'repairMode' }
        ]
      },
      tableData: []
    }
  },
  watch: {
    paramId(newVal) {
      this.paramId = newVal
      this.getdata()
    }
  },
  async mounted() {
      this.getdata()

  },
  methods: {
    async getdata() {
      let resPrj = await queryPipeStateDetails(this.paramId)
      if (resPrj.code === 1) {
        this.tableData = resPrj.result.filter(v => v.defectCode !== "ZC")
      } else this.$message.error('请求数据失败！')
    },
   
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
      border: 1px solid #dedede;
    }
  }
}
</style>