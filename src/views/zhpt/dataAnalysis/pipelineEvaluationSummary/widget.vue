<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道评估汇总 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">起始井号：</div>
          <el-input
            size="small"
            placeholder="请输入起始井号"
            v-model="searchValue.startPoint"
            clearable
            style="margin-right: 10px"
          >
          </el-input>
          <div class="title">终止井号：</div>
          <el-input
            size="small"
            placeholder="请输入终止井号"
            v-model="searchValue.endPoint"
            clearable
            style="margin-right: 10px"
          >
          </el-input>

          <div class="title">检测日期：</div>
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchValue.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions0"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center; margin: 0 5px">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="searchValue.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions1"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <el-button size="small" style="margin-right: 5px" icon="el-icon-search" type="primary" @click="searchApi">搜索</el-button>
          <download-excel
            :fields="exportFields"
            :data="exportData"
            :before-finish="afterExport"
            name="管道评估汇总表.xls"
            type="xls"
          >
           <el-button size="small" icon="el-icon-search" type="primary">导出</el-button>
          </download-excel>
         
        </div>
        <div class="right-btn"></div>
      </div>

      <el-table
        ref="multipleTable"
        height="100%"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        :row-class-name="modality"
      >
        <template slot="empty">
          <img
            style="width: 100px; height: 100px; -webkit-user-drag: none"
            src="@/assets/images/nullData.png"
            alt="暂无数据"
            srcset=""
          />
          <p>暂无数据</p>
        </template>
        <el-table-column fixed="left" align="center" type="index" label="序号" width="50"> </el-table-column>
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
      </el-table>

      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 30, 50, 100, 1000]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationTotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { queryPageAssessment } from '@/api/pipelineManage'

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

export default {
  components: {},
  data() {
    return {
      searchValue: {
        startDate: '',
        finishDate: '',
        startPoint: '',
        endPoint: ''
      },
      // 表格参数
      tableContent: [
        { width: '120', sortable: true, label: '检测日期', name: 'jcDate' },
        { width: '110', sortable: false, label: '起始井号', name: 'startPoint' },
        { width: '110', sortable: false, label: '终止井号', name: 'endPoint' },
        { width: '130', sortable: true, label: '起点埋深(m)', name: 'startDepth' },
        { width: '130', sortable: true, label: '终点埋深(m)', name: 'endDepth' },
        { width: '110', sortable: false, label: '管段类型', name: 'pipeType' },
        { width: '', sortable: false, label: '管段材质', name: 'material' },
        { width: '110', sortable: true, label: '管段直径', name: 'diameter' },
        { width: '110', sortable: true, label: '管段长度', name: 'pipeLength' },
        { width: '110', sortable: true, label: '检测长度', name: 'jclength' },
        { width: '110', sortable: false, label: '检测方向', name: 'detectDir' },
        { width: '110', sortable: false, label: '检测人员', name: 'detectPerson' }
      ],
      uploadHeaders: {
        Authorization: 'bearer ' + sessionStorage.getItem('token')
      }, // token值

      // ----------
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      multipleSelection: [], // 选择的列表
      exportFields: {},
      exportData: []
    }
  },
  computed: {},
  created() {
    this.updateTable()
    this.setFields() // 设置导出字段
    this.setData()
  },
  methods: {
    setFields () {
      this.tableContent.forEach(item => {
        this.exportFields[item.label] = item.name
      })
    },
    setData () {
      // 最多导出 1w 条
      let data = { current: 1, size: 1e4 }
      data.startPoint = ""
      data.endPoint = ""
      data.jcStartDate = ""
      data.jcEndDate = ""
      queryPageAssessment({ ...data, wordInfoState: 1 }).then(res => {
        this.exportData = res.result.records
      })
    },
    afterExport () {
      this.$message.success('导出数据成功')
    },
    // 根据状态设置每列表格样式
    modality(obj) {
      // 通过id标识来改变当前行的文字颜色
      // console.log('obj', obj.row)
      let idArr
      if (this.multipleSelection != []) {
        idArr = this.multipleSelection.map((v) => v.id)
      }
      if (idArr.some((v) => v == obj.row.id)) {
        return 'rowBgBlue'
      }
    },
    // 点击行勾选数据
    handleRowClick(row, column, event) {
      let length = this.multipleSelection.length
      let id = this.multipleSelection.length == 1 ? this.multipleSelection[0].id : null
      // let
      this.$refs.multipleTable.clearSelection(row)
      if (length > 1 || length < 1) {
        this.$refs.multipleTable.toggleRowSelection(row)
      } else if (id) {
        if (row.id == id) {
          this.$refs.multipleTable.toggleRowSelection(row, false)
        } else {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      }
    },
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      if (!this.searchValue.startDate) {
        this.searchValue.startDate = this.searchValue.finishDate
      }
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.searchValue.startDate).getTime()
      let date2 = new Date(this.searchValue.finishDate).getTime()
      this.pickerOptions0 = {
        disabledDate: (time) => {
          if (date2 != '') {
            // return time.getTime() > Date.now() || time.getTime() > date2
            return time.getTime() > date2
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
      this.pickerOptions1 = {
        disabledDate: (time) => {
          // return time.getTime() < date1 || time.getTime() > Date.now()
          return time.getTime() < date1 - 8.64e7
        }
      }
    },
    // 搜索
    searchApi() {
      this.pagination.current = 1
      this.updateTable(this.searchValue)
    },

    // 分页触发的事件
    handleSizeChange(val) {
      this.pagination.size = val
      this.updateTable()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagination.current = val
      this.updateTable()
      console.log(`当前页: ${val}`)
    },
    // 查询数据
    updateTable(params) {
      let data = {
        current: this.pagination.current,
        size: this.pagination.size
      }
      if (params) {
        data.startPoint = this.searchValue.startPoint
        data.endPoint = this.searchValue.endPoint
        data.jcStartDate = this.searchValue.startDate
        data.jcEndDate = this.searchValue.finishDate
      }
      queryPageAssessment({ ...data, wordInfoState: 1 }).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
        // this.$message.success("上传成功");
      })
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['multipleTable'].doLayout()
    })
  },
  watch: {
    'searchValue.startDate': function (n) {
      this.searchValue.finishDate = n
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 12px;

  // 表格样式
  .table-box {
    height: 100%;
    width: 96%;
    margin: auto;
    display: flex;
    margin: auto;
    flex-direction: column;
    .top-tool {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .serch-engineering {
        display: flex;
        justify-content: space-around;
        align-items: center;
        /deep/ .el-select {
          margin-right: 10px;
          .el-input__inner {
            width: 120px;
          }
        }
        .sampleTime {
          width: 308px !important;
          margin-right: 10px;
          .el-input {
            width: 140px;
          }
        }
        /deep/.el-input__inner {
          width: 140px;
          height: 34px;
        }

        .title {
          font-size: 14px;
          color: #606266;
          font-family: Arial;
          white-space: nowrap;
        }
      }

      .right-btn {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        // transform: translateX(20%);
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
      .hover-row {
        color: #e6a23c;
        background-color: rgba($color: #2d74e7, $alpha: 0.1);
      }
      .rowBgBlue {
        & > td {
          color: #fff;
          border-right: 1px solid #ebeef5;
          background-color: #69a8ea !important;
        }
      }
    }
  }
  // 日期选择
  /deep/ .el-form-item__content {
    .el-input__inner {
      width: 100% !important;
    }
  }

  .delete-box {
    /deep/.el-dialog {
      margin-top: 30vh !important;
      .el-dialog__header {
        border-bottom: none;
      }
    }
  }
}

/deep/ .upload-demo {
  position: relative;
  & > .el-upload {
    // width: 100%;
  }
  .add-btn {
    // cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btns {
      position: absolute;
      right: 0;
    }
  }
}
</style>