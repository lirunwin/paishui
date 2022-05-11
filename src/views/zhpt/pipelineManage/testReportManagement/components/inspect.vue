<template>
  <div class="project-box">
    <!-- 检查井检查情况汇总表 -->
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" stripe>
      <el-table-column type="index" label="序号" width="80" align="center" header-align="center"> </el-table-column>
      <el-table-column
        :prop="v.name"
        header-align="center"
        :label="v.label"
        align="center"
        show-overflow-tooltip
        v-for="(v, i) in tableContent"
        :key="i"
        :show-overflow-tooltip="true"
        :render-header="renderHeader"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      // 表格参数
      tableContent: [
        { label: '检查井类型', name: 'name' },
        { label: '材质', name: 'num' },
        { label: '单位', name: 'amount' },
        { label: '数量', name: 'num' },
        { label: '其中非道路下数量', name: 'amount' },
        { label: '完好数量', name: 'num' },
        { label: '井盖井座缺失数量', name: 'amount' },
        { label: '井内有杂物数量', name: 'num' },
        { label: '井内有缺损数量', name: 'amount' },
        { label: '盖框突出或凹陷数量', name: 'amount' },
        { label: '井室周围填土有沉降数量', name: 'num' },
        { label: '备注', name: 'amount' }
      ],
      tableData: [
        {
          name: '雨水口',
          num: '24',
          amount: '/'
        },
        {
          name: '检查井',
          num: '30',
          amount: '/'
        },
        {
          name: '雨水口',
          num: '24',
          amount: '/'
        }
      ],
      currentRow: null //当前选中
    }
  },
  methods: {
    renderHeader(h, data) {
      return h('span', [
        h(
          'el-tooltip',
          {
            attrs: {
              class: 'item',
              effect: 'dark',
              content: data.column.label,
              placement: 'top'
            }
          },
          [h('p', data.column.label)]
        )
      ])
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