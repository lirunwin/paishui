<template>
  <div class="engineering-manage">
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            placeholder="搜索工程名称、地点、报告名称"
            v-model="input"
            clearable
            class="serch-input"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="检测日期"
            class="date-css"
          >
          </el-date-picker>
          <div class="release-radio">
            <p class="release-title">发布状态:</p>
            <el-checkbox-group v-model="checkList" max="1">
              <el-checkbox label="未发布"></el-checkbox>
              <el-checkbox label="已发布"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button class="serch-btn" icon="el-icon-search" type="primary">
            搜索
          </el-button>
        </div>
        <div class="right-btn">
          <el-button
            @click="dialogFormVisible = true"
            class="serch-btn"
            icon="el-icon-plus"
            type="primary"
            >添加</el-button
          >
          <el-button class="serch-btn" icon="el-icon-edit" type="primary"
            >修改</el-button
          >
          <el-button class="serch-btn" icon="el-icon-upload" type="primary"
            >上传</el-button
          >
          <el-button class="serch-btn" icon="el-icon-download" type="primary"
            >下载</el-button
          >
          <el-button class="serch-btn" icon="el-icon-share" type="primary"
            >发布</el-button
          >
          <el-button
            class="serch-btn"
            style="background-color: #f56c6c"
            icon="el-icon-delete"
            type="primary"
            >删除</el-button
          >
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          header-align="center"
          align="center"
          type="selection"
          width="55"
        >
        </el-table-column>

        <el-table-column
          prop="date"
          header-align="center"
          label="工程编号"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          label="工程名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          label="行政区划"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          label="委托单位"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          label="施工单位"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          label="工程简介"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          label="操作"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="zero = scope"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加卡片 -->
    <el-dialog title="添加工程" :visible.sync="dialogFormVisible">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="auto"
        label-position="right"
      >
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
              <el-date-picker
                v-model="form.name"
                placeholder="选择日期"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程结束日期">
              <el-date-picker
                v-model="form.name"
                placeholder="选择日期"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工程简介" prop="projectIntroduction">
          <el-input
            type="textarea"
            :rows="5"
            resize="none"
            v-model="form.projectIntroduction"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="附件:">
          <el-col :span="12">
            <el-input v-model="form.name"></el-input>
          </el-col>
          <el-button type="primary" style="margin-left: 10px"
            >选择文件</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: [],
      radio: "",
      zero: "",
      dialogFormVisible: false,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      form: {
        name: "",
        number: "",
        constructionUnit: "",
        designUnit: "",
        workUnit: "",
        testUnit: "",
        probeUnit: "",
        supervisorUnit: "",
        projectIntroduction: "",
      },
      rules: {
        name: [
          { required: true, message: "不能为空", trigger: "blur" },
          { max: 100, message: "内容不能超过100个字符串", trigger: "blur" },
        ],
        number: [
          { max: 20, message: "内容不能超过20个字符串", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "只能输入数字或英文",
            trigger: "blur",
          },
        ],
        workUnit: [
          { max: 255, message: "内容不能超过255个字符串", trigger: "blur" },
        ],
        projectIntroduction: [
          { max: 1000, message: "内容不能超过1000个字符串", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
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
    .top-tool {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 25px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        .release-radio {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .release-title {
            margin: 0 10px;
          }
          .el-checkbox {
            margin-right: 12px;
          }
        }
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
        margin-left: 20px;
        border: none !important;
      }
      .serch-btn:hover {
        opacity: 0.8;
      }
      .right-btn {
        display: flex;
        justify-content: space-between;
      }
    }

    /deep/ .el-table th.el-table__cell > .cell {
      height: 40px;
      line-height: 40px;
      background-color: #dfeffe;
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
}
</style>