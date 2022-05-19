<template>
  <div class="engineering-manage">
    <!-- 管道评估汇总 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">起始井号：</div>
          <el-select size="small" v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">终止井号：</div>
          <el-select size="small" v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">检测日期：</div>
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker> ~
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
          <div class="title">整改建议：</div>
          <el-select size="small" v-model="form.name" placeholder="--选择建议--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>

          <el-button size="small" style="margin-left: 26px" type="primary"> 查询 </el-button>
          <el-button size="small" type="primary"> 导出 </el-button>
        </div>
        <div class="right-btn"></div>
      </div>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        height="100%"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
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
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
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
      </el-table>
      <!-- 分页 -->
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
export default {
  data() {
    return {
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      // 表格参数
      tableContent: [
        { label: '检测日期', name: 'prjNo' },
        { label: '起始井号', name: 'prjName' },
        { label: '终止井号', name: 'sgunit' },
        { label: '起点埋深(m)', name: 'proIntroduction' },
        { label: '终点埋深(m)', name: 'createTime' },
        { label: '管段类型', name: 'prjNo' },
        { label: '管段材质', name: 'prjName' },
        { label: '管段直径', name: 'sgunit' },
        { label: '管段长度', name: 'proIntroduction' },
        { label: '检测长度', name: 'createTime' },
        { label: '整改建议', name: 'proIntroduction' },
        { label: '检测方向', name: 'createTime' },
        { label: '检测人员', name: 'createTime' }
      ],
      multipleSelection: [], // 表格被选中的数据
      zero: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      form: {
        name: '',
        number: '',
        constructionUnit: '',
        designUnit: '',
        workUnit: '',
        testUnit: '',
        probeUnit: '',
        supervisorUnit: '',
        projectIntroduction: ''
      }
    }
  },
  methods: {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      flex-direction: row;
      // flex-wrap: wrap;
      font-size: 14px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;

        .serch-input {
          width: 245px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 135px;
        }

        .title {
          font-size: 14px;
          color: #606266;
          font-family: Arial;
          white-space: nowrap;
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

  // 选择框
  /deep/ .el-select {
    width: 130px;
    margin-right: 20px;
  }
}
</style>