<template>
  <div class="project-box">
    <!-- 报告内管段状态评估汇总 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      stripe
    >
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center" fixed="left">
      </el-table-column>
      <!-- 前面 -->
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="(v, i) in tableContent.other1"
        :key="v.label"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- 缺陷位置 -->
      <el-table-column label="埋深(m)" header-align="center">
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="(v, i) in tableContent.buriedDepth"
          :key="v.label"
          :show-overflow-tooltip="true"
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
        v-for="(v, i) in tableContent.other2"
        :key="v.label"
        :show-overflow-tooltip="true"
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
          { label: '缺陷类型', name: 'defectType' },
        ],
        buriedDepth: [
          { label: '纵向(m)', name: 'direction' },
          { label: '环向', name: 'circular' }
        ],
        other2: [
          { label: '缺陷等级', name: 'defectLevel' },
          { label: '修复建议', name: 'checkSuggest' },
          { label: '修复方式', name: 'repairMode' },
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