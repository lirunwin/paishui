<template>
  <div class="engineering-manage">
    <!-- 管道缺陷汇总 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">起始井号：</div>
          <el-select v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">终止井号：</div>
          <el-select v-model="form.name" placeholder="--选择井号--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">检测日期：</div>
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker> ~
          <el-date-picker v-model="value1" type="date" placeholder="年-月-日" class="date-css"> </el-date-picker>
          <div class="title">缺陷等级：</div>
          <el-select v-model="form.name" placeholder="--选择等级--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <div class="title">整改建议：</div>
          <el-select v-model="form.name" placeholder="--选择建议--">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>

          <el-button class="serch-btn" style="margin-left: 26px" type="primary"> 查询 </el-button>
          <el-button class="serch-btn" type="primary"> 导出 </el-button>
        </div>
        <div class="right-btn"></div>
      </div>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        :default-sort = "{prop: 'length', order: 'descending'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="date" header-align="center" label="检测日期" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" header-align="center" label="起始井号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="终止井号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="管径(mm)" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="length" sortable header-align="center" label="管段长度" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="检测长度" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="缺陷名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="缺陷等级" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="整改建议" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="结构性缺陷" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="功能性缺陷" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="起点埋深(m)" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="终点埋深(m)" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="管段类型" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="管段材质" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="管段直径" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="检测方向" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="检测人员" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="zero = scope">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 50, 100, 1000]"
          :page-size="30"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 添加卡片 -->
    <el-dialog title="添加工程" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form" label-width="auto" label-position="right">
        <el-form-item label="工程名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="工程编号" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="建设单位">
          <el-input v-model="form.constructionUnit"></el-input>
        </el-form-item>
        <el-form-item label="设计单位">
          <el-input v-model="form.designUnit"></el-input>
        </el-form-item>
        <el-form-item label="施工单位" prop="workUnit">
          <el-input v-model="form.workUnit"></el-input>
        </el-form-item>
        <el-form-item label="检测单位">
          <el-input v-model="form.testUnit"></el-input>
        </el-form-item>
        <el-form-item label="探测单位">
          <el-input v-model="form.probeUnit"></el-input>
        </el-form-item>
        <el-form-item label="监理单位">
          <el-input v-model="form.supervisorUnit"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工程开始日期">
              <el-date-picker v-model="form.name" placeholder="选择日期" type="date"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程结束日期">
              <el-date-picker v-model="form.name" placeholder="选择日期" type="date"> </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工程简介" prop="projectIntroduction">
          <el-input type="textarea" :rows="5" resize="none" v-model="form.projectIntroduction"> </el-input>
        </el-form-item>
        <el-form-item label="附件:">
          <el-col :span="12">
            <el-input v-model="form.name"></el-input>
          </el-col>
          <el-button type="primary" style="margin-left: 10px">选择文件</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      zero: '',
      dialogFormVisible: false,
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:151,
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:199,

        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:10,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:100,
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:85,
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:63,
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          length:530,
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
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ],
        number: [
          { max: 20, message: '内容不能超过20个字符串', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '只能输入数字或英文',
            trigger: 'blur'
          }
        ],
        workUnit: [{ max: 255, message: '内容不能超过255个字符串', trigger: 'blur' }],
        projectIntroduction: [{ max: 1000, message: '内容不能超过1000个字符串', trigger: 'blur' }]
      }
    }
  },
  methods: {
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
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
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
    /deep/ .el-table {
      flex: 1;
      // overflow-y: scroll;
      th.el-table__cell > .cell {
        height: 40px;
        line-height: 40px;
        background-color: #dfeffe;
      }
    }
  }

  // 卡片样式
  /deep/ .el-dialog {
    font-size: 14px;
    .el-dialog__header {
      background-color: #2d74e7;
      .el-dialog__title {
        color: #dfeffe;
      }
      .el-icon-close:before {
        color: #fff;
      }
    }
    .el-input__inner {
      height: 34px;
    }
    .el-form {
      padding: 0 35px;
      box-sizing: border-box;
    }
  }
  // 选择框
  /deep/ .el-select {
    width: 130px;
  }
}
</style>