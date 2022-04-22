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
          <div class="release-radio">
            <p class="release-title">检测状态:</p>
            <el-radio v-model="searchParams.jcStatus" label="0">未检测</el-radio>
            <el-radio v-model="searchParams.jcStatus" label="1">已检测</el-radio>
          </div>
          <div class="title">结构性缺陷等级：</div>
          <el-select v-model="searchParams.funcClass" placeholder="">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchParams.structClass" placeholder="">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary" @click="resetBtn"> 重置 </el-button>
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

        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="v in tableContent"
          :key="v.name"
        >
        </el-table-column>

        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$message('该功能暂未开放')">详情</el-button>
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
  </div>
</template>

<script>
import { queryPageHistory } from '@/api/pipelineManage'

export default {
  data() {
    return {
      // 表格参数
      tableContent: [
        { label: '工程名称', name: 'prjName' },
        { label: '管段编号', name: 'expNo' },
        { label: '管段类型', name: 'pipeType' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '材质', name: 'material' },
        { label: '道路名称', name: 'address' },
        { label: '所属片区', name: 'checkAddress' },
        { label: '检测次数', name: 'jcNum' },
        { label: '最近检测日期', name: 'jcNewDate' },
        { label: '最新结构性缺陷等级', name: 'newStructClass' },
        { label: '最新结构性缺陷评价', name: 'newStructEstimate' },
        { label: '最新功能性缺陷等级', name: 'newFuncClass' },
        { label: '最新功能性缺陷评价', name: 'newFuncEstimate' }
      ],
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 搜索需要的参数
      searchParams: {
        keyword: '',
        jcDate: '',
        defectLevelA: '',
        defectLevelB: ''
      },
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
   
    }
  },
  created() {
    let res = this.getDate()
  },
  methods: {
    // 重置
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchParams = {
        keyword: '',
        jcDate: '',
        funcClass: '',
        structClass: ''
      }
        await this.getDate()
    },
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
        data.jcDate = params.jcDate
        data.state = params.checkList
        data.funcClass = params.funcClass
        data.structClass = params.structClass
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