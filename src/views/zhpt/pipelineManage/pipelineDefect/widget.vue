<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道缺陷管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <el-input
            placeholder="支持搜索管段编号、材质、评价"
            v-model="searchValue.queryParams"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <el-date-picker v-model="searchValue.testTime" type="date" placeholder="入库时间" class="date-css">
          </el-date-picker>
          <div class="title">结构性缺陷等级：</div>
          <el-select v-model="searchValue.funcClass" placeholder="全部">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchValue.structClass" placeholder="全部">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary" @click="resetBtn"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" type="primary" @click="$message('该功能暂未开放')"
            >导出<i class="el-icon-download el-icon--right"></i
          ></el-button>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        height="250"
        stripe
        style="width: 100%"
        @row-click="viewPipe"
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
            <el-button type="text" size="small" @click.stop="$message('该功能暂未开放')">报告</el-button>
            <el-button type="text" size="small" @click.stop="$message('该功能暂未开放')">详情</el-button>
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
import { queryPageDefectInfo } from '@/api/pipelineManage'

export default {
  props: ['data'],
  data() {
    return {
      searchValue: {
        testTime: '', // 检测日期
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
      }, // 搜索关键字的值
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 表格参数
      tableContent: [
        { label: '工程名称', name: 'date' },
        { label: '管段编号', name: 'expNo' },
        { label: '管段类型', name: 'pipeType' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '材质', name: 'material' },
        { label: '结构性缺陷等级', name: 'structDefect' },
        { label: '结构性缺陷评价', name: 'structEstimate' },
        { label: '缺陷数量', name: 'defectNum' },
        { label: '检测照片', name: 'picnum' },
        { label: '检测视频', name: 'videoFileName' },
        { label: '检测地点', name: 'checkAddress' },
        { label: '检测日期', name: 'sampleTime' }
      ],
      paginationTotal: 0, // 总页数
      pagination: { current: 1, size: 30 }, // 分页参数信息
      tableData: []
    }
  },
  mounted() {
    console.log('其它页面传来的参数', this.data)
    let res = this.getDate()
  },
  methods: {
    viewPipe() {
      console.log("走了地图高亮功能");
      this.data.that.setPipesView()
    },
    // 搜索
    searchApi() {
      this.getDate(this.searchValue)
    },
    // 重置
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchValue = {
        testTime: '',
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
      }
      await this.getDate()
    },
    // 查询数据
    async getDate(params) {
      let data = this.pagination
      if (params) {
        data.queryParams = params.queryParams
        data.jcDate = params.testTime
        data.funcClass = params.funcClass
        data.structClass = params.structClass
      }
      await queryPageDefectInfo(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
        // this.$message.success("上传成功");
      })
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
      font-size: 12px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;

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
          margin-left: 20px;
        }
      }
      .serch-btn {
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2d74e7;
        // margin-left: 14px;
        padding: 12px;
        border: none !important;
      }

      .serch-btn:hover {
        opacity: 0.8;
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