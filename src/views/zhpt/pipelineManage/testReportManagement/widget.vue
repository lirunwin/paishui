<template>
  <div class="engineering-manage">
    <!-- 检测报告管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            placeholder="搜索工程名称、地点、报告名称"
            v-model="serchValue"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <el-date-picker
            v-model="searchValue.dateTime"
            type="date"
            class="date-css"
            value-format="yyyy-MM-dd"
            placeholder="检测日期"
          >
          </el-date-picker>
          <div class="release-radio">
            <p class="release-title">发布状态:</p>
            <el-radio v-model="searchValue.checkList" label="0">未发布</el-radio>
            <el-radio v-model="searchValue.checkList" label="1">已发布</el-radio>
          </div>
          <el-button class="serch-btn" icon="el-icon-search" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" icon="el-icon-refresh-right" type="primary" @click="resetDate"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" type="primary" @click="showUpdata">报告上传</el-button>
          <!-- <el-button class="serch-btn" type="primary" @click="dialogFormVisible2 = true">视频上传</el-button> -->
          <el-button class="serch-btn" type="primary" @click="$message('该功能暂未开放')">视频上传</el-button>
          <el-button class="serch-btn" type="primary" @click="$message('该功能暂未开放')">批量发布</el-button>
          <el-button
            class="serch-btn"
            icon="el-icon-delete"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="removeDatas"
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

        <!-- <el-table-column prop="prjNo" header-align="center" label="检测报告名称" align="center" show-overflow-tooltip>
        </el-table-column> -->
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

        <el-table-column prop="state" header-align="center" label="发布状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{ stateRedClass: scope.row.state == '0', stateGreenClass: scope.row.state == '1' }">{{
              scope.row.state | filter_state
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" :wu="scope" @click="$message('该功能暂未开放')">发布</el-button>
            <!-- <el-button type="text" size="small" :wu="scope" @click="$message('该功能暂未开放')">撤回</el-button> -->
            <el-button type="text" size="small" :wu="scope" @click="dialogFormVisible3 = true">详情</el-button>
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
          <el-select
            clearable
            v-model="form.name"
            placeholder="请选择工程名称"
            v-selectLoadMore="selectLoadMore"
            @blur="initSelectDate"
            filterable
          >
            <el-option v-for="(item, i) in selectArr" :key="i" :label="item.name" :value="item.No"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="检测报告" :label-width="formLabelWidth" class="hd-input" prop="report">
          <!-- action="http://192.168.2.78:1111/psjc/pipeState/pipeStateUpload" -->
          <el-upload
            :on-change="getFile"
            show-file-list
            ref="updataDocx"
            class="upload-demo"
            :headers="uploadHeaders"
            action="http://117.174.10.73:1114/psjc/pipeState/pipeStateUpload"
            accept=".doc,.docx"
            :data="getData"
            multiple
            :on-success="handleAvatarSuccess"
            :before-remove="beforeRemove"
            :on-progress="beforeUpload"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">选择文件夹</el-button>
            <div slot="tip" class="el-upload__tip">只能上传docx/doc文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadWord">确 定</el-button>
        <el-button @click="hideUpdataDocx">取 消</el-button>
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
import { queryPageTestReport, deleteIdData, deleteTestReport, projectPagingQuery } from '@/api/pipelineManage'

export default {
  data() {
    return {
      // 选择框分页参数
      selectParm: { current: 1, size: 30 },
      selectArr: [], // 选择工程数组
      // 表格参数
      tableContent: [
        { label: '检测段数', name: 'jcnum' },
        { label: '检测长度', name: 'jclength' },
        { label: '工程名称', name: 'prjName' },
        { label: '施工单位', name: 'sgunit' },
        { label: '检测日期', name: 'jcDate' },
        { label: '入库人', name: 'createUserName' },
        { label: '入库时间', name: 'createTime' }
      ],
      // 搜索功能参数
      searchValue: {
        dateTime: '', // 检测日期
        checkList: '0' // 发布状态
      },
      serchValue: '', // 搜索关键字
      testDate: '', // 检测日期
      // 上传需要的数据
      fileList: [],
      UpdataList: '', // 上传文件携带的参数
      updataDialog: false, // 上传对话框
      uploadHeaders: {
        Authorization: 'bearer ' + sessionStorage.getItem('token')
      }, // token值
      activeLeft: 'first', // 发布默认激活的导航（左）
      activeRight: 'one', // 发布默认激活的导航（右）
      multipleSelection: [], // 被选中的表格数据
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      // ------------
      radio: '',
      tableData: [],
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
  created() {
    let res = this.getDate()
  },
  computed: {
    // 动态设置上传携带参数
    getData() {
      return { prjNo: this.form.name }
    }
  },
  mounted() {},
  methods: {
    // 文件发生变化时触发
    getFile(file, fileList) {
      console.log('file', file)
      console.log('fileList', fileList)
    },
    // 重置
    async resetDate() {
      this.searchValue.checkList = '0'
      this.serchValue = ''
      this.testDate = ''
      await this.getDate()
    },
    // 报告上传取消按钮
    hideUpdataDocx() {
      this.form.name = ''
      this.dialogFormVisible = false
    },
    // 失去焦点时
    initSelectDate() {
      this.selectParm.current = 1
    },
    // 选择工程下拉刷新加载更多数据
    async selectLoadMore() {
      this.selectParm.current++
      let res = await projectPagingQuery(this.selectParm)
      data.forEach((v) => {
        this.selectArr.push({
          name: v.prjName,
          No: v.prjNo
        })
      })
      console.log('下滑到底了')
    },
    // 报告上传按钮
    async showUpdata() {
      // 选择工程名称的分页查询
      let res = await projectPagingQuery(this.selectParm)
      let data = res.result.records
      this.selectArr = data.map((v) => {
        return {
          name: v.prjName,
          No: v.prjNo
        }
      })
      // this.selectArr
      console.log('选择框数据', this.selectArr)
      this.dialogFormVisible = true
    },
    // 上传按钮
    async uploadWord() {
      await this.$refs.updataDocx.submit()
    },
    // 上传触发的方法
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      if (res.code) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.getDate()
      }
      this.form.name = ''
      this.dialogFormVisible = false
      console.log('上传后的code码', res)
    },
    beforeUpload() {},
    handleExceed(files, fileList) {
      this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 搜索
    searchApi() {
      this.getDate(this.searchValue)
    },
    // 删除
    removeDatas() {
      this.$confirm(`确定删除选中的数据吗？`)
        .then(async () => {
          let res = {}
          if (this.multipleSelection.length == 1) {
            res = await deleteIdData(this.multipleSelection[0].id)
          } else {
            let idArr = this.multipleSelection.map((v) => v.id)
            res = await deleteTestReport({ ids: idArr.join(',') })
          }
          if (res.result) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDate()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          console.log('err')
        })
    },
    // 查询数据
    async getDate(params) {
      let data = { ...this.pagination }
      console.log('参数', params)
      if (params) {
        data.jcDate = params.dateTime
        params.checkList.length == 1 ? (data.state = params.checkList[0] * 1) : ''
      }
      console.log('最后传进去的参数', data)
      await queryPageTestReport(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
    },
    // 发布tab标签点击事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    add() {},
    // 表格选中事件
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
  },
  // 过滤器
  filters: {
    filter_state(value) {
      return value == 0 ? '未发布' : '已发布'
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
    // 发布状态样式
    .stateRedClass {
      color: #ff0017;
    }
    .stateGreenClass {
      color: #5c9a44;
    }
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
  .release-radio {
    .el-radio {
      margin-right: 8px !important;
      .radio__label {
        padding-left: 4px;
      }
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