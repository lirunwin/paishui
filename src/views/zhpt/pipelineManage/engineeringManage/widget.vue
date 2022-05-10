<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 工程管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input placeholder="搜索工程编号、工程名称" v-model="searchValue.prjNo" clearable class="serch-input">
          </el-input>
          <el-button class="serch-btn" icon="el-icon-search" type="primary" @click="searchApi">搜索</el-button>
        </div>
        <div class="right-btn">
          <el-button @click="showForm" class="serch-btn" icon="el-icon-plus" type="primary">添加</el-button>
          <!-- multipleSelection -->
          <el-button
            class="serch-btn"
            :disabled="multipleSelection.length != 1"
            icon="el-icon-edit"
            type="primary"
            @click="updataInfo"
            >修改</el-button
          >
          <el-button
            class="serch-btn"
            icon="el-icon-delete"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="removeBtn"
            >删除</el-button
          >
        </div>
      </div>

      <el-table
        ref="multipleTable"
        height="100%"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @row-dblclick="dblclickUpdata"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
        </template>
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>
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
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDetails(scope.row)">详情</el-button>
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
    <div class="add-box">
      <el-dialog title="工程内容" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form ref="form" :rules="rules" :model="form" label-width="auto" label-position="right">
          <el-row v-for="(item, i) in formContent" :key="i">
            <el-col :span="12">
              <el-form-item :label="item[0].label" :prop="item[0].name">
                <el-input
                  v-model="form[item[0].name]"
                  :maxlength="item[0].maxLength"
                  show-word-limit
                  :disabled="isDetails"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="item[1].label" :prop="item[1].name">
                <el-input
                  v-model="form[item[1].name]"
                  :maxlength="item[1].maxLength"
                  show-word-limit
                  :disabled="isDetails || (isEdit && item[1].label == '工程编号')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="隐蔽管线点数量" prop="hpoints">
            <el-input v-model="form.hpoints" maxlength="15" show-word-limit :disabled="isDetails"></el-input>
          </el-form-item>
          <el-form-item label="工程日期范围">
            <!-- <el-date-picker
            :disabled="isDetails"
            v-model="dateRange"
            @change="getDateRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker> -->
            <el-row>
              <el-col :span="11">
                <el-date-picker
                  :disabled="isDetails"
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="small"
                  :picker-options="pickerOptions0"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  :disabled="isDetails"
                  v-model="form.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="small"
                  :picker-options="pickerOptions1"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="工程简介" prop="proIntroduction">
            <el-input
              type="textarea"
              resize="none"
              v-model="form.proIntroduction"
              maxlength="400"
              show-word-limit
              :disabled="isDetails"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="附件:">
            <!-- action="http://192.168.2.78:1111/psjc/pipeState/pipeStateUpload" -->
            <el-upload
              v-show="!isDetails"
              show-file-list
              ref="updataDocx"
              class="upload-demo"
              :headers="uploadHeaders"
              action="http://117.174.10.73:1114/psjc/sysUploadFile/uploadFile"
              accept=".doc,.docx"
              :data="getIdData"
              multiple
              :before-remove="beforeRemove"
              :on-progress="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
            >
              <div class="add-btn">
                <el-button size="small" type="primary" slot="trigger">选择文件夹</el-button>
                <span class="btns">
                  <el-button @click.stop="dialogFormVisible = false" v-if="!isDetails">取 消</el-button>
                  <el-button type="primary" @click.stop="addTable('form')" v-if="!isDetails">确 定</el-button>
                  <el-button @click.stop="dialogFormVisible = false" v-if="isDetails">退 出</el-button>
                </span>
              </div>
              <div slot="tip" class="el-upload__tip">
                <!-- <p>只能上传docx/doc文件</p> -->
              </div>
            </el-upload>
            <!-- 附件列表 -->
            <div v-show="isDetails" style="max-height: 120px; overflow-y: scroll">
              <div v-for="(item, i) in fileListData" :key="i" class="text-space">
                <el-link type="primary">{{ item.originalName }}</el-link
                >&nbsp;<el-link type="success" @click="fileLinkToStreamDownload(item.id)">下载</el-link>
              </div>
              <p v-if="!fileListData.length" style="text-align: center;">暂无附件</p>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 删除提示框 -->
    <div class="delete-box">
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
        <div>
          <i class="el-icon-info" style="color: #e6a23c"></i>&nbsp; 确认删除选中的{{
            multipleSelection.length
          }}条工程项目吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeDatas">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <button @click="fileLinkToStreamDownload('http://117.174.10.73:1114/psjc/opt2/upload/projectInfoDoc/36/202205081114180005.docx')">下载附件</button> -->
  </div>
</template>

<script>
import {
  projectPagingQueryNew,
  addData,
  changeInfo,
  deleteData,
  deleteDatas,
  importFiles,
  queryDictionariesId,
  projectDetailsQuery,
  queryPageEnclosure,
  downloadFile
} from '@/api/pipelineManage'

import deleteDialog from '../components/deleteDialog.vue'

export default {
  components: {
    deleteDialog
  },
  data() {
    return {
      fileListData: [], // 附件列表数据
      deleteDialogVisible: false, // 删除提示框显影
      updataParamsId: {
        itemId: '',
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      }, // 上传附件需要的参数id
      // 表格参数
      tableContent: [
        { label: '工程编号', name: 'prjNo' },
        { label: '工程名称', name: 'prjName' },
        // { label: '行政区划', name: 'area' },
        { label: '施工单位', name: 'sgunit' },
        { label: '工程简介', name: 'proIntroduction' },
        { label: '创建时间', name: 'createTime' }
      ],
      // 表单参数
      formContent: [
        [
          { maxLength: '100', label: '工程名称', name: 'prjName' },
          { maxLength: '20', label: '工程编号', name: 'prjNo' }
        ],
        [
          { maxLength: '50', label: '检测单位', name: 'principal' },
          { maxLength: '50', label: '勘察单位', name: 'kcunit' }
        ],
        [
          { maxLength: '4', label: '探测单位', name: 'tcunit' },
          { maxLength: '4', label: '设计单位', name: 'sjunit' }
        ],
        [
          { maxLength: '4', label: '建设单位', name: 'jsunit' },
          { maxLength: '50', label: '监理单位', name: 'ctunit' }
        ],
        [
          { maxLength: '255', label: '施工单位', name: 'sgunit' },
          { maxLength: '30', label: '施工负责人', name: 'constructionCharge' }
        ],
        [
          { maxLength: '20', label: '高程系统', name: 'ecoord' },
          { maxLength: '20', label: '平面坐标系统', name: 'pcoord' }
        ],
        [
          { maxLength: '9', label: '管线总长度', name: 'pllength' },
          { maxLength: '9', label: '管线种类数量', name: 'plnumber' }
        ],
        [
          { maxLength: '15', label: '接边点数', name: 'jpoints' },
          { maxLength: '15', label: '明显管线点数量', name: 'epoints' }
        ]
      ],
      isDetails: false, // 判断是否是详情
      isEdit: false, // 判断是否是修改数据
      uploadHeaders: {
        Authorization: 'bearer ' + sessionStorage.getItem('token')
      }, // token值
      // 上传需要的数据
      fileList: [],
      // 'Content-Type': 'application/x-www-form-urlencoded'
      searchValue: {
        prjNo: '',
        prjName: ''
      }, // 搜索关键字的值
      // ----------
      multipleSelection: [], // 表格被选中的数据
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      dialogFormVisible: false,
      tableData: [],
      initForm: {}, // 初始化表单
      form: {
        prjName: '', //
        prjNo: '', // 50 不能为空
        principal: '', // 50
        kcunit: '', // 50
        tcunit: '', // 4
        sjunit: '', // 50
        jsunit: '', // 4
        ctunit: '', // 50
        sgunit: '', // 50
        constructionCharge: '', // 30
        ecoord: '', // 20
        pcoord: '', // 20
        pllength: '', // 9 0
        plnumber: '', // 9 小数0
        jpoints: '', // 15 0
        epoints: '', // 15 0
        hpoints: '', // 15 0
        startDate: '', // date
        finishDate: '', /// date
        proIntroduction: '' // 10
      },
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      rules: {
        prjNo: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '只能输入数字或英文',
            trigger: 'blur'
          }
        ],
        pllength: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
            message: '只能输入数字',
            trigger: 'blur'
          }
        ]
      },
      // 查询附件列表需要的参数id
      updataParamsId: {
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      },
      // 附件分页
      paginationEnclosure: { current: 1, size: 30 }, // 分页参数信息
      paginationEnclosureTotal: 0 // 总页数
    }
  },
  computed: {
    // 动态设置上传携带参数
    getIdData() {
      return this.updataParamsId
    }
  },
  created() {
    let res = this.getDate()
    this.simplifyRules()
  },
  methods: {
    // 简化rules
    simplifyRules() {
      // 不能为空
      let rulesArrNull = ['prjName', 'requiredInput', 'tcunit', 'principal', 'ecoord', 'pcoord', 'constructionCharge']
      rulesArrNull.forEach((v) => {
        this.rules[v] = [{ required: true, message: '不能为空', trigger: 'blur' }]
      })
      // 只能输入整数
      let rulesArrNumber = ['plnumber', 'jpoints', 'epoints', 'hpoints']
      rulesArrNumber.forEach((v) => {
        this.rules[v] = [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9]+$/,
            message: '只能输入整数',
            trigger: 'blur'
          }
        ]
      })
      // 没有验证
      let wu = ['jsunit', 'sjunit', 'sgunit', 'proIntroduction']
      wu.forEach((v) => {
        this.rules[v] = []
      })
    },
    // 获取字典id
    async getParamsId() {
      // 获取字典id
      // uploadFileType
      let uploadFileTypeDicId = await queryDictionariesId({ keys: 'uploadFileType' })
      // uploadItem
      let uploadItemDictId = await queryDictionariesId({ keys: 'uploadItem' })
      uploadFileTypeDicId = uploadFileTypeDicId.result.uploadFileType
      uploadItemDictId = uploadItemDictId.result.uploadItem
      // await this.$refs.upload.submit()
      uploadFileTypeDicId.forEach((v) => {
        if (v.codeValue == 'projectInfoDoc') {
          this.updataParamsId.uploadFileTypeDicId = v.id
        }
      })
      uploadItemDictId.forEach((v) => {
        if (v.codeValue == 'tf_ywpn_prjinfo_w') {
          this.updataParamsId.uploadItemDictId = v.id
        }
      })
    },
    // 打开详情
    async openDetails(row) {
      // 获得详情数据
      let res = await projectDetailsQuery(row.id)
      // 获得字典id
      await this.getParamsId()
      // 获取附件列表
      let params = {
        current: this.paginationEnclosure.current,
        size: this.paginationEnclosure.size,
        itemId: row.id,
        uploadFileTypeDicId: this.updataParamsId.uploadFileTypeDicId,
        uploadItemDictId: this.updataParamsId.uploadItemDictId
      }
      let fileRes = await queryPageEnclosure(params)
      console.log('附件分页数据', fileRes)
      this.fileListData = fileRes.result.records

      this.initForm = { ...this.form }
      this.form = res.result
      this.isDetails = true
      this.dialogFormVisible = true
    },
    // 关闭对话框
    closeDialog() {
      console.log('关闭了对话框', this.initForm)
      this.form = { ...this.initForm }
      this.$refs['form'].resetFields()
      this.$refs['updataDocx'] && this.$refs['updataDocx'].clearFiles()
      // 提交条件初始化
      this.isEdit = false
      this.isDetails = false
      this.fileListData = []
    },
    // 获取日期范围
    // getDateRange() {
    //   this.form.startdate = this.dateRange[0]
    //   this.form.finishdate = this.dateRange[1]
    // },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.form.startDate).getTime()
      let date2 = new Date(this.form.finishDate).getTime()
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
          return time.getTime() < date1
        }
      }
    },
    // 显示添加表单
    showForm() {
      this.initForm = { ...this.form }
      console.log('initForm', this.initForm)
      this.dialogFormVisible = true
    },
    // 搜索
    searchApi() {
      this.getDate(this.searchValue)
    },
    // 删除按钮
    removeBtn() {
      this.deleteDialogVisible = true
    },
    // 确认删除
    async removeDatas() {
      let res = {}
      if (this.multipleSelection.length == 1) {
        res = await deleteData(this.multipleSelection[0].id)
      } else {
        let idArr = this.multipleSelection.map((v) => v.id)
        res = await deleteDatas({ ids: idArr.join(',') })
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
    },
    // 上传触发的方法
    beforeUpload() {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // ----------
    async addTable(formName) {
      // 上传附件
      // async uploadWord() {
      //   await this.$refs.updataDocx.submit()
      // },
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 将文件上传到服务器，先触发beforeUpload事件，对上传的文件进行校验，校验通过后才会上传
          let res
          // 获取入库人id和名称
          this.form.createUserId = sessionStorage.getItem('userId') * 1
          this.form.createUserName = sessionStorage.getItem('username')
          if (this.isEdit) {
            res = await changeInfo(this.form)
            this.isEdit = false
          } else {
            res = await addData(this.form)
          }
          // console.log('工程添加成功后', res)
          // 如果有附件则再上传附件
          if (this.fileList) {
            this.updataParamsId.itemId = res.result.id
            // 获得字典id
            await this.getParamsId()
            // console.log('附件参数', this.updataParamsId)
            await this.$refs.updataDocx.submit()
          }
          if (res.result) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message.error('添加失败')
          }
          await this.getDate()
          // 最后清空表单
          this.form = { ...this.initForm }
          this.dialogFormVisible = false
          // this.$store.dispatch('app/toggleSideBarShow', true)
        } else {
          console.log('不能提交!!')
          return false
        }
      })
    },
    // 双击修改
    dblclickUpdata(row, column, event) {
      console.log(row, column, event)
      this.initForm = { ...this.form }
      this.form = row
      this.isEdit = true
      this.dialogFormVisible = true
    },
    // 修改信息
    updataInfo() {
      this.initForm = { ...this.form }
      console.log('initForm', this.initForm)
      this.form = this.multipleSelection[0]
      this.isEdit = true
      this.dialogFormVisible = true
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
      let data = this.pagination
      if (params) {
        // data.prjName = params.prjName
        data.prjNo = params.prjNo
      }
      await projectPagingQueryNew(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
        // this.$message.success("上传成功");
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选项发生了变化', this.multipleSelection.length == 1)
    },
    // 下载附件
    fileLinkToStreamDownload(id) {
      downloadFile(id)
    },
    downloadExportFile(blob, tagFileName) {
      let downloadElement = document.createElement('a')
      let href = blob
      if (typeof blob == 'string') {
        downloadElement.target = '_blank'
      } else {
        href = window.URL.createObjectURL(blob) //创建下载的链接
      }
      downloadElement.href = href
      downloadElement.download =
        tagFileName +
        //下载后文件名
        document.body.appendChild(downloadElement)
      downloadElement.click() //点击下载
      document.body.removeChild(downloadElement) //下载完成移除元素
      if (typeof blob != 'string') {
        window.URL.revokeObjectURL(href) //释放掉blob对象
      }
    },
    // getDay()方法:拿当前的时间戳拼接，保证文件名字的唯一性，避免重名
    getDay() {
      let time = new Date(),
        year = time.getFullYear(),
        month = time.getMonth() + 1,
        day = time.getDate(),
        timeStem = time.getTime()
      return `${year}/${month}/${day}/${timeStem}.jpg`
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
        /deep/.el-input__inner {
          width: 210px;
          height: 34px;
        }

        .title {
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
        height: 40px;
        line-height: 40px;
        background-color: #dfeffe;
      }
    }
  }
  // 日期选择
  /deep/ .el-form-item__content {
    .el-input__inner {
      width: 100% !important;
    }
  }
  // 卡片样式
  .add-box {
    /deep/ .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      box-sizing: border-box;
      .el-dialog {
        margin-top: 0vh !important;
        font-size: 12px;
        .el-date-editor {
          width: 100%;
        }
        .el-dialog__body {
          padding: 10px 0px !important;
        }
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
          .el-form-item {
            margin-bottom: 14px;
          }
        }
        .el-dialog__footer {
          padding: 0 20px 5px !important;
        }
      }
    }
    .text-space {
      /deep/.el-link--inner{
        max-width: 650px;
        // 1.先强制一行内显示文本
      white-space: nowrap;

      // 2.超出部分隐藏
      overflow: hidden;
      // 3.文字用省略号替换超出的部分
      text-overflow: ellipsis;
      }
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
.serch-btn {
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #2d74e7;
  margin-left: 20px;
  border: none !important;
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