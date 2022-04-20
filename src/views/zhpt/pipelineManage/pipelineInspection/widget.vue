<template>
  <div class="engineering-manage">
    <!-- 管道检测历史管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <el-input
            placeholder="支持搜索管段编号、道路名称"
            v-model="searchParams.keyword"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <el-date-picker v-model="searchParams.jcDate" type="date" placeholder="检测日期" class="date-css">
          </el-date-picker>
          <!-- <div class="release-radio">
            <p class="release-title">检测状态:</p>
            <el-checkbox-group v-model="searchParams.jcStatus" max="1">
              <el-checkbox label="全部"></el-checkbox>
              <el-checkbox label="未检测"></el-checkbox>
              <el-checkbox label="已检测"></el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="release-radio">
            <p class="release-title">检测状态:</p>
            <el-radio v-model="searchParams.jcStatus" label="0">未检测</el-radio>
            <el-radio v-model="searchParams.jcStatus" label="1">已检测</el-radio>
          </div>
          <div class="title">结构性缺陷等级：</div>
          <el-select v-model="searchParams.defectLevelA" placeholder="">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchParams.defectLevelB" placeholder="">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary"> 重置 </el-button>
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
      >
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>

        <el-table-column prop="prjName" header-align="center" label="工程名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="expNo"
          min-width="150"
          header-align="center"
          label="管段编号"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="pipeType"
          min-width="150"
          header-align="center"
          label="管段类型"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="diameter"
          min-width="150"
          header-align="center"
          label="管径(mm)"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="material"
          min-width="150"
          header-align="center"
          label="材质"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="150"
          header-align="center"
          label="道路名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="checkAddress"
          min-width="150"
          header-align="center"
          label="所属片区"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="jcNum"
          min-width="150"
          header-align="center"
          label="检测次数"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="jcNewDate"
          min-width="150"
          header-align="center"
          label="最近检测日期"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="newStructClass"
          min-width="150"
          header-align="center"
          label="最新结构性缺陷等级"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="newStructEstimate"
          min-width="150"
          header-align="center"
          label="最新结构性缺陷评价"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="newFuncClass"
          header-align="center"
          label="最新功能性缺陷等级"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="newFuncEstimate"
          header-align="center"
          label="最新功能性缺陷评价"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="zero = scope">详情</el-button>
          </template>
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
    <!-- 添加卡片 -->
    <el-dialog title="检测报告上传" v-if="dialogFormVisible" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="工程名称" :label-width="formLabelWidth" prop="name">
          <el-select v-model="form.name" placeholder="请选择工程名称">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测报告" :label-width="formLabelWidth" class="hd-input" prop="report">
          <el-input v-model="form.report" autocomplete="off"></el-input>
          <el-button class="select-btn" type="primary">选择文件夹</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPageHistory } from '@/api/pipelineManage'

export default {
  data() {
    return {
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 搜索需要的参数
      searchParams: {
        keyword: '',
        jcDate: '',
        jcStatus: '',
        defectLevelA: '',
        defectLevelB: ''
      },
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      radio: '',
      zero: '',
      tableData: [],
      //  报告上传数据
      rules: {
        name: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        report: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    let res = this.getDate()
  },
  methods: {
    // 搜索
    searchApi() {
      this.getDate(this.searchParams)
    },
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页触发的事件
    async handleSizeChange(val) {
      this.pagination.size = val
      await this.getDate()
      console.log(`每页 ${val} 条`)
    },
    async handleCurrentChange(val) {
      this.pagination.current = val
      await this.getDate()
      console.log(`当前页: ${val}`)
    },
    // 查询数据
    async getDate(params) {
      let data = { ...this.pagination }
      console.log('参数', params)
      if (params) {
        data.queryParams = params.keyword
        data.jcDate = params.dateTime
        data.state = params.checkList
        data.prjNo = params.serchValue
      }
      console.log('最后传进去的参数', data)
      await queryPageHistory(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
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
      font-size: 14px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .release-radio {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .el-radio {
            margin-right: 10px;
          }
          .release-title {
            margin: 0 10px;
          }
          .el-checkbox {
            margin-right: 12px;
          }
        }
        .serch-input {
          width: 245px;
          margin-right: 20px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 140px;
         
        }

        .title {
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }
      .serch-btn {
        height: 34px;
        background-color: #2d74e7;
        padding: 12px;
        border: none !important;
      }

      .serch-btn:hover {
        opacity: 0.8;
      }
      .right-btn {
        margin-bottom: 14px;
        display: flex;
        // display: flex;
        // align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }

    /deep/ .el-table th.el-table__cell > .cell {
      height: 40px;
      line-height: 40px;
      background-color: #dfeffe;
    }
  }

  // 报告上传样式
  /deep/ .el-dialog__header {
    background-color: #2d74e7;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .hd-input {
    /deep/.el-input__inner {
      width: 70%;
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