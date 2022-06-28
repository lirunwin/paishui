<template>
  <div class="project-box" v-loading='loading'>
    <!-- 主要工程量表 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center">
      </el-table-column>
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="(v, i) in tableContent"
        :key="i"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryPipeState } from '@/api/pipelineManage'

export default {
  props: ['paramId'],
  data() {
    return {
      // 表格参数
      tableContent: [
        { label: '管段编号', name: 'expNo' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '管段材质', name: 'material' },
        { label: '管段长度(m)', name: 'pipeLength' },
        { label: '检测长度(m)', name: 'checkLength' },
        { label: '结构性缺陷', name: 'sPipeNote' },
        { label: '功能性缺陷', name: 'fPipeNote' },
      ],
      tableData: [],
      typeArr: {
        s: ['AJ', 'BX', 'CK', 'CR', 'FS', 'PL', 'QF', 'SL', 'TJ', 'TL'],
        f: ['CJ', 'CQ', 'FZ', 'JG', 'SG', 'ZW']
      },
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    paramId () {
      this.init()
    }
  },
  methods: {
    init () {
      if (!this.paramId) return
      this.loading = true
      queryPipeState(this.paramId).then(resPrj => {
        console.log('管道缺陷表单', resPrj)
        this.loading = false
        if (resPrj.code === 1 && resPrj.result) {
          this.tableData = resPrj.result.map(item => {
            let sPipeNote = ''
            let fPipeNote = ''
            if (item.defectCode === 'ZC') {
              sPipeNote = ''
              fPipeNote = ''
            } else {
              if (item.defectType) {
                if (item.defectType === '功能性缺陷') { fPipeNote = item.pipeNote }
                else if (item.defectType === '结构性缺陷') { sPipeNote = item.pipeNote }
              } else {
                if (this.typeArr.s.includes(item.defectCode)) { sPipeNote = item.pipeNote }
                else if (this.typeArr.f.includes(item.defectCode)) { fPipeNote = item.pipeNote }
              }
            }
            return { ...item, fPipeNote, sPipeNote}
          })
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index === 2) {
          sums[index] = '/'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            .toFixed(2)
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