<template>
  <div class="engineering-manage">
    <!-- 管道缺陷管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="right-btn">
          <download-excel
            :fields="json_fields"
            :data="multipleSelection"
            :before-generate="startDownload"
            :before-finish="finishDownload"
            name="管道缺陷表单.xls"
            type="xls"
          >
            <el-button size="small" type="primary">导出<i class="el-icon-download el-icon--right"></i></el-button>
          </download-excel>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        height="250"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="openPromptBox"
      >
        <template slot="empty">
          <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
        </template>
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="v in tableContent"
          :key="v.name"
          :width="v.width"
          :sortable="v.sortable"
        >
        </el-table-column>
        <el-table-column width="120" header-align="center" label="缺陷名称代码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: center">{{ `(${scope.row.defectCode})${scope.row.defectName}` }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['param'],
  data() {
    return {
      json_fields: {},
      // 表格参数
      tableData: [],
      tableContent: [
        { width: '200', sortable: false, label: '管段编号', name: 'expNo' },
        { width: '120', sortable: false, label: '缺陷类型', name: 'defectType' },
        { width: '120', sortable: true, label: '距离(m)', name: 'distanceStartPoint' },
        { width: '120', sortable: true, label: '分值', name: 'defectNum' },
        { width: '120', sortable: true, label: '等级', name: 'defectLevel' },
        { width: '120', sortable: false, label: '修复方式', name: 'repairMode' },
        { width: '120', sortable: true, label: '检测日期', name: 'sampleTime' },
        { width: '', sortable: false, label: '评价', name: 'pipeNote' },
      ],
      multipleSelection: [], // 表格被选中的数据
    }
  },
  mounted() {
    if (this.param && this.param.rootPage) {
      console.log('添加的数据')
      let { type, level, rootPage, data } = this.param
      this.rootPage = rootPage
      this.tableData = data.map((fea) => fea.values_)
      this.tableContent.forEach(item => {
        this.json_fields[item.label] = item.name
      })
      this.json_fields['缺陷名称代码'] = 'codeName' 
    }
  },
  destroyed() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val.map((res, index) => {
        return { ...res, codeName: `(${res.defectCode})${res.defectName}` }
      })
    },
    startDownload() {
      let self = this
      if (self.multipleSelection.length == 0) {
        self.$message({
          message: '请勾选需要导出的数据',
          type: 'warning'
        })
      }
    },
    finishDownload() {
      let self = this
      self.$message({
        message: '数据导出成功',
        type: 'success'
      })
    },
    // 打开缩略提示框
    openPromptBox(row, column, cell, event) {
      this.rootPage.openPromptBox(row.id, this.param.layerName)
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 12px;
  // 表格样式
  .table-box {
    width: 96%;
    margin: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    .top-tool {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      // flex-wrap: wrap;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .sampleTime {
          width: 308px !important;
          .el-input {
            width: 140px;
          }
        }
        .serch-input {
          width: 245px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 140px;
        }

        .title {
          font-size: 14px;
          color: #606266;
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }

      .right-btn {
        margin-bottom: 14px;
        display: inline-block;
        // display: flex;
        // align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }

    /deep/ .el-table {
      flex: 1;
      // overflow-y: scroll;
      th.el-table__cell > .cell {
        color: rgb(50, 59, 65);
        height: 40px;
        line-height: 40px;
        background: rgb(234, 241, 253);
      }
      .el-table__row--striped > td {
        background-color: #f3f7fe !important;
      }
    }
  }
  .el-select {
    width: 8%;
  }
  /deep/ .is-required {
    position: relative;
    .select-btn {
      position: absolute;
      top: 0;
      left: 72%;
    }
  }
}
</style>