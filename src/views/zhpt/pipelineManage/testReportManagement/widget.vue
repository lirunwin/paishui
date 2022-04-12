<template>
  <div class="engineering-manage">
    <!-- 检测报告管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            placeholder="搜索工程名称、地点、报告名称"
            v-model="input"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <el-date-picker v-model="value1" type="date" placeholder="检测日期" class="date-css"> </el-date-picker>
          <div class="release-radio">
            <p class="release-title">发布状态:</p>
            <el-checkbox-group v-model="checkList" max="1">
              <el-checkbox label="未发布"></el-checkbox>
              <el-checkbox label="已发布"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button class="serch-btn" icon="el-icon-search" type="primary"> 搜索 </el-button>
          <el-button class="serch-btn" icon="el-icon-refresh-right" type="primary"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" type="primary" @click="dialogFormVisible = true">报告上传</el-button>
          <el-button class="serch-btn" type="primary" @click="dialogFormVisible2 = true">视频上传</el-button>
          <el-button
            class="serch-btn"
            type="primary"
            @click="dialogFormVisible3 = true"
            :disabled="!multipleSelection.length"
            >批量发布</el-button
          >
          <el-button class="serch-btn" icon="el-icon-delete" type="danger" :disabled="!multipleSelection.length"
            >删除</el-button
          >
        </div>
      </div>
      <!-- <el-empty description="暂无数据" v-if="!tableData"></el-empty> -->

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

        <el-table-column prop="date" header-align="center" label="工程编号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" header-align="center" label="工程名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="行政区划" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="委托单位" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="施工单位" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="工程简介" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" header-align="center" label="创建时间" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" :wu="scope" @click="dialogFormVisible3 = true">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 视频上传 -->
    <el-dialog title="检测视频上传" v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="工程名称" :label-width="formLabelWidth" prop="name">
          <el-select v-model="form.name" placeholder="请选择工程名称">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测视频" :label-width="formLabelWidth" class="hd-input" prop="report">
          <el-button class="select-btn" type="primary">选择</el-button>
        </el-form-item>
      </el-form>
      <!-- 进度表格 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发布 -->
    <el-dialog title="检测报告发布" v-if="dialogFormVisible3" :visible.sync="dialogFormVisible3" fullscreen="true">
      <div class="releaseTop-box">
        <!-- 左边部分 -->
        <div class="left">
          <el-tabs v-model="activeLeft" @tab-click="handleClick">
            <el-tab-pane label="统计汇总" name="first"> <div class="releaseContent"></div> </el-tab-pane>
            <el-tab-pane label="检查井缺陷" name="second">检查井缺陷</el-tab-pane>
            <el-tab-pane label="管道缺陷" name="third">管道缺陷</el-tab-pane>
            <el-tab-pane label="管段状态评估" name="fourth">管段状态评估</el-tab-pane>
          </el-tabs>
        </div>
        <!-- 右边部分 -->
        <div class="right">
          <el-tabs v-model="activeRight" @tab-click="handleClick">
            <el-tab-pane label="原始检测报告" name="one"> <div class="releaseContent">原始检测报告</div> </el-tab-pane>
            <el-tab-pane label="数据地图" name="two">数据地图</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible3 = false">发 布</el-button>
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addPipecheck } from '@/api/pipelineManage'

export default {
  data() {
    return {
      activeLeft: 'first', // 发布默认激活的导航（左）
      activeRight: 'one', // 发布默认激活的导航（右）
      multipleSelection: [], // 被选中的表格数据
      // 分页需要的值
      currentPage4: 4,
      // ------------
      checkList: [],
      radio: '',
      tableData: [
        
      ],
      //  报告上传数据
      rules: {
        name: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        report: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 报告上传
      dialogFormVisible: false,
      // 视频上传
      dialogFormVisible2: false,
      // 报告发布
      dialogFormVisible3: false,
      form: {
        name: '',
        report: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 发布tab标签点击事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    add() {},
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页的事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
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
      flex-wrap: wrap;
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
        // background-color: #2d74e7;
        // margin-left: 14px;
        padding: 12px;
        border: none !important;
      }

      .right-btn {
        margin-bottom: 14px;
        display: flex;
        align-items: center;
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
    .el-dialog__headerbtn > .el-icon-close {
      color: #fff !important;
    }
  }
  .hd-input {
    /deep/.el-input__inner {
      width: 70%;
    }
  }
  .el-select {
    width: 70%;
  }
  /deep/ .is-required {
    position: relative;
    .select-btn {
      position: absolute;
      top: 0;
      left: 72%;
    }
  }
  // 报告发布
  .releaseTop-box {
    display: flex;
    justify-content: space-between;
    .left,
    .right {
      /deep/ .el-tabs__header {
        background: transparent;
        border-top: none;
      }
      /deep/.el-tabs__item {
        margin: 0 !important;
        margin-top: 11px !important;
        background: transparent !important;
      }
      .releaseContent {
        width: 100%;
        height: 600px;
        margin-top: -3px;
      }
    }
    .left {
      flex: 2;
      .releaseContent {
        border: 1px solid #9a9a9a;
        overflow: scroll;
      }
    }
    .right {
      flex: 1;
    }
  }
}
</style>