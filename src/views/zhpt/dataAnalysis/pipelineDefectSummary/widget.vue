<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道缺陷汇总 -->
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
                  :picker-options="sOpition"
                  @change="sDateChange"
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
                  :picker-options="eOpition"
                  @change="eDateChange"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <div class="title">缺陷等级：</div>
          <el-select size="small" clearable v-model="searchValue.defectLevel" placeholder="选择缺陷等级">
            <el-option
              v-for="item in defectLevels"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <div class="title">整改建议：</div>
          <el-select size="small" clearable v-model="searchValue.checkSuggest" placeholder="选择建议">
            <el-option
              v-for="item in checkSuggestList"
              :key="item.codeValue"
              :label="item.codeValue"
              :value="item.codeValue"
            >
            </el-option>
          </el-select>
          <el-button size="small"  style="margin-right: 5px" type="primary" @click="searchApi">搜索</el-button>
          <download-excel
            :fields="exportFields"
            :data="exportData"
            :before-finish="afterExport"
            name="管道缺陷汇总表.xls"
            type="xls"
          >
           <el-button size="small" type="primary">导出</el-button>
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
import { queryPageDefectInfo, queryDictionariesId } from '@/api/pipelineManage'

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

export default {
  components: {},
  data() {
    return {
      checkSuggestList: [],
      searchValue: {
        startDate: '',
        finishDate: '',
        startPoint: '',
        endPoint: '',
        checkSuggest: '',
        defectLevel: ''
      },
      defectLevels: ['一级', '二级', '三级', '四级'],
      // 表格参数
      tableContent: [
        { width: '120', sortable: true, label: '检测日期', name: 'sampleTime' },
        { width: '110', sortable: false, label: '起始井号', name: 'startPoint' },
        { width: '110', sortable: false, label: '终止井号', name: 'endPoint' },
        { width: '110', sortable: true, label: '管径(mm)', name: 'diameter' },
        { width: '110', sortable: true, label: '管段长度(m)', name: 'pipeLength' },
        { width: '110', sortable: true, label: '检测长度(m)', name: 'checkLength' },
        { width: '130', sortable: false, label: '缺陷名称', name: 'defectName' },
        { width: '130', sortable: true, label: '缺陷等级', name: 'defectLevel' },
        { width: '120', sortable: false, label: '整改建议', name: 'checkSuggest' },
        { width: '', sortable: false, label: '结构性缺陷评价', name: 'structEstimate' },
        { width: '', sortable: false, label: '功能性缺陷评价', name: 'funcEstimate' }
      ],
      uploadHeaders: {
        Authorization: 'bearer ' + sessionStorage.getItem('token')
      }, // token值
      // ----------
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
      // 日期选择器规则
      sOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.finishDate) {
            return time > new Date(this.searchValue.finishDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.startDate) {
            return time < new Date(this.searchValue.startDate).getTime() || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      },
      multipleSelection: [], // 选择的列表
      //
      exportFields: {},
      exportData: [],

    }
  },
  computed: {},
  created() {
    this.updateTable()
    this.getParamsId()
    //
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
      let data = { current: 1, size: 1e4 }
      data.wordInfoState = 1
      data.startPoint = ''
      data.endPoint = ''
      data.jcStartDate = ''
      data.jcEndDate = ''
      data.checkSuggest = ''
      queryPageDefectInfo(data).then((res) => {
        if (res.code === 1) {
          this.exportData = res.result.records
        } else this.$message.error('请求数据失败')
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
    // 获取字典
    async getParamsId() {
      // 获取字典
      // check_suggest
      let checkSuggest = await queryDictionariesId({ keys: 'check_suggest' })
      this.checkSuggestList = checkSuggest.result.check_suggest
      console.log('checkSuggest', checkSuggest.result.check_suggest)
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    sDateChange (t) {
      console.log('时间选择')
      if (!this.searchValue.finishDate) {
        this.$nextTick(() => {
          this.searchValue.finishDate = this.searchValue.startDate
        })
      }
    },
    eDateChange (t) {
      if (!this.searchValue.startDate) {
        this.$nextTick(() => {
          this.searchValue.startDate = this.searchValue.finishDate
        })
      }
    },
    // 搜索
    searchApi() {
      this.pagination.current =1

      this.updateTable()
    },

    // 分页触发的事件
    handleSizeChange(val) {
      this.pagination.size = val
      this.updateTable()
    },
    handleCurrentChange(val) {
      this.pagination.current = val
      this.updateTable()
    },
    // 查询数据
    updateTable() {
      let data = {
        current: this.pagination.current,
        size: this.pagination.size
      }
      data.wordInfoState = 1
      data.startPoint = this.searchValue.startPoint
      data.endPoint = this.searchValue.endPoint
      data.jcStartDate = this.searchValue.startDate
      data.jcEndDate = this.searchValue.finishDate
      data.checkSuggest = this.searchValue.checkSuggest
      data.defectLevel = this.searchValue.defectLevel
      
      queryPageDefectInfo(data).then((res) => {
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