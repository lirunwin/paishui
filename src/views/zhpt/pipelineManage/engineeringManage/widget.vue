<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 工程管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            size="small"
            placeholder="请输入工程编号、工程名称"
            v-model="searchValue.prjNo"
            clearable
            style="margin-right: 10px"
          >
          </el-input>
          <el-button size="small" icon="el-icon-search" type="primary" @click="searchApi">搜索</el-button>
        </div>
        <div class="right-btn">
          <el-button size="small" @click="showForm" icon="el-icon-plus" type="primary">添加</el-button>
          <!-- multipleSelection -->
          <el-button
            size="small"
            :disabled="multipleSelection.length != 1"
            icon="el-icon-edit"
            type="primary"
            @click="updataInfo"
            >修改</el-button
          >
          <el-button
            size="small"
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
        @row-click="handleRowClick"
        :row-class-name="modality"
        height="100%"
        :data="tableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @row-dblclick="dblclickUpdata"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'date', order: 'descending' }"
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
          :sortable="v.sortable"
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
                  size="small"
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
                  size="small"
                  v-model="form[item[1].name]"
                  :maxlength="item[1].maxLength"
                  show-word-limit
                  :disabled="isDetails || (isEdit && item[1].label == '工程编号')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="隐蔽管线点数量(个)" prop="hpoints">
            <el-input
              size="small"
              v-model="form.hpoints"
              maxlength="15"
              show-word-limit
              :disabled="isDetails"
            ></el-input>
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
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions0"
                  @change="changeDate('startDate')"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  :disabled="isDetails"
                  v-model="form.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions1"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="工程简介" prop="proIntroduction">
            <el-input
              size="small"
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
              :action="getBaseAddress"
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
                <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
                <span class="btns">
                  <el-button size="small" @click.stop="dialogFormVisible = false" v-if="!isDetails">取 消</el-button>
                  <el-button size="small" type="primary" @click.stop="addTable('form')" v-if="!isDetails" >确 定</el-button>
                  <el-button size="small" @click.stop="dialogFormVisible = false" v-if="isDetails">退 出</el-button>
                </span>
              </div>
              <div slot="tip" class="el-upload__tip">
                <p style="line-height: 10px; margin: 10px 0">只能上传docx/doc文件</p>
                <p v-show="isEdit" style="height: 20px; font-size: 12px; border-bottom: 1px solid #dedede; margin: 0; line-height: 20px"></p>
                <!-- <p>只能上传docx/doc文件</p> -->
              </div>
            </el-upload>
            <!-- 附件列表 -->
            <p
              v-show="isEdit"
              style="
                height: 20px;
                font-size: 12px;
                border-bottom: 1px solid #dedede;
                border-top: 1px solid #dedede;
                margin: 0;
                margin-top: 10px;
                line-height: 20px;
              "
            >
              已上传的文件列表
            </p>
            <div
              v-show="isDetails || isEdit"
              class="hideScrollBar"
              style="max-height: 120px; overflow-y: scroll; border: 1px solid #dedede; padding-left: 10px"
            >
              <div
                v-for="(item, i) in fileListData"
                :key="i"
                class="text-space"
                style="height: 20px; line-height: 20px"
              >
                <el-link :href="fileLinkToStreamDownload(item.id)" type="primary">{{ item.originalName }}</el-link>
                <el-link type="danger" @click="removeFile(item)">删除</el-link>
              </div>
            </div>
            <p
              v-show="isDetails || isEdit"
              v-if="!fileListData.length"
              style="text-align: center; height: 20px; font-size: 12px; margin: 0px; line-height: 20px"
            >
              暂无附件
            </p>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 删除提示框 -->
    <div class="delete-box">
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
        <div style="display: flex; align-items: center">
          <!-- <i class="el-icon-info" style="color: #e6a23c"></i> -->
          <span class="iconfont icondtbz" style="font-size: 22px; color: #e6a23c"></span>
          &nbsp; 确认删除选中的{{ multipleSelection.length }}条工程项目吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="removeDatas">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 删除附件框 -->
    <div class="delete-box">
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="deleteFlieDialogVisible" width="30%">
        <div style="display: flex; align-items: center">
          <!-- <i class="el-icon-info" style="color: #e6a23c"></i> -->
          <span
            class="iconfont icondtbz"
            style="font-size: 22px; color: #e6a23c; margin-right: 10px; line-height: 20px"
          ></span>
          确认要删除附件《{{ currentFlie.fileName }}》吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteFlieDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="removeFlieDatas">确 定</el-button>
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
  downloadFile,
  removeEnclosureByIds
} from '@/api/pipelineManage'

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

import deleteDialog from '../components/deleteDialog.vue'

export default {
  components: {
    deleteDialog
  },
  data() {
    return {
      id: null, // 当前列id
      currentFlie: {}, // 删除时的当前附件
      fileListData: [], // 附件列表数据
      deleteDialogVisible: false, // 删除提示框显影
      deleteFlieDialogVisible: false, // 删除附件提示框显影

      updataParamsId: {
        itemId: '',
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      }, // 上传附件需要的参数id
      // 表格参数
      tableContent: [
        { sortable: false, label: '工程编号', name: 'prjNo' },
        { sortable: false, label: '工程名称', name: 'prjName' },
        // { sortable:false,label: '行政区划', name: 'area' },
        { sortable: false, label: '施工单位', name: 'sgunit' },
        { sortable: false, label: '工程简介', name: 'proIntroduction' },
        { sortable: true, label: '创建时间', name: 'createTime' }
      ],
      // 表单参数
      formContent: [
        [
          { maxLength: '100', label: '工程名称', name: 'prjName' },
          { maxLength: '20', label: '工程编号', name: 'prjNo' }
        ],
        [
          { maxLength: '25', label: '检测单位', name: 'jcunit' },
          { maxLength: '25', label: '勘察单位', name: 'kcunit' }
        ],
        [
          { maxLength: '25', label: '探测单位', name: 'tcunit' },
          { maxLength: '25', label: '设计单位', name: 'sjunit' }
        ],
        [
          { maxLength: '25', label: '建设单位', name: 'jsunit' },
          { maxLength: '25', label: '监理单位', name: 'ctunit' }
        ],
        [
          { maxLength: '25', label: '施工单位', name: 'sgunit' },
          { maxLength: '30', label: '施工负责人', name: 'constructionCharge' }
        ],
        [
          { maxLength: '20', label: '高程系统', name: 'ecoord' },
          { maxLength: '20', label: '平面坐标系统', name: 'pcoord' }
        ],
        [
          { maxLength: '7', label: '管线总长度(m)', name: 'pllength' },
          { maxLength: '9', label: '管线种类数量(个)', name: 'plnumber' }
        ],
        [
          { maxLength: '15', label: '接边点数(个)', name: 'jpoints' },
          { maxLength: '15', label: '明显管线点数量(个)', name: 'epoints' }
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
            message: '只能输入数字或英文字母',
            trigger: 'blur'
          }
        ],
        pllength: [
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
            message: '只能输入正数(小数不能超过两位)',
            trigger: 'change'
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
      // handleSelectionList: [] // 单击勾选
    }
  },
  computed: {
    // 动态设置上传地址
    getBaseAddress() {
      return baseAddress + '/psjc/sysUploadFile/uploadFile'
    },
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
    // 确认删除附件
    async removeFlieDatas() {
      let id = this.currentFlie.id
      let res = await removeEnclosureByIds({ ids: id + '' })
      if (res.result) {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }
      this.getFileList(this.id)
      this.deleteFlieDialogVisible = false
      this.currentFlie = {}
    },
    // 删除附件
    removeFile(file) {
      console.log('当前附件', file)
      this.currentFlie = file
      this.deleteFlieDialogVisible = true
    },
    // 判断个数小数位
    // inputSet(key) {
    //   let formArr = ['plnumber', 'jpoints', 'epoints', 'hpoints']
    //   if (formArr.some((v) => key == v)) {
    //     let form = this.form
    //     console.log('改对了',form.plnumber)
    //     if (form.plnumber ) {
    //       this.form.plnumber = form.plnumber.toFixed(0)
    //     }
    //     if (form.jpoints) {
    //       this.form.jpoints = form.jpoints.toFixed(0)
    //     }
    //     if (form.epoints) {
    //       this.form.epoints = form.epoints.toFixed(0)
    //     }
    //     if (form.hpoints) {
    //       this.form.hpoints = form.hpoints.toFixed(0)
    //     }
    //   }
    // },
    // 管道缺陷管理的信息
    openDefect() {
      let info = {
        icon: 'iconfont ',
        id: 'pipelineDefect',
        label: '管道缺陷管理',
        meta: { title: '管道缺陷管理' },
        name: 'PipelineDefect',
        noShowingChildren: true,
        parentPathid: '/pipelineDefect',
        path: '',
        type: 'gis',
        widgetid: 'HalfPanel'
      }
      // 这是map里的跳转方法
      this.$store.dispatch('map/changeMethod', info)
    },
    // 简化rules
    simplifyRules() {
      // 不能为空
      let rulesArrNull = ['prjName']
      // let rulesArrNull = ['prjName', 'requiredInput', 'tcunit', 'principal', 'ecoord', 'pcoord', 'constructionCharge']
      rulesArrNull.forEach((v) => {
        this.rules[v] = [{ required: true, message: '不能为空', trigger: 'blur' }]
      })
      // 只能输入整数
      let rulesArrNumber = ['plnumber', 'jpoints', 'epoints', 'hpoints']
      rulesArrNumber.forEach((v) => {
        this.rules[v] = [
          {
            pattern: /^[0-9]+$/,
            message: '只能输入整数(不能为负数)',
            trigger: 'change'
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
      this.changeDate()
    },
    // 获取日期范围
    // getDateRange() {
    //   this.form.startdate = this.dateRange[0]
    //   this.form.finishdate = this.dateRange[1]
    // },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate(str) {
      if (str == 'startDate') {
        this.form.finishDate = this.form.startDate
      }
      if (!this.form.startDate) {
        this.form.startDate = this.form.finishDate
      }
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
          return time.getTime() < date1 - 8.64e7
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
      this.pagination.current = 1
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
        this.deleteDialogVisible = false
      } else {
        this.$message.error('删除失败')
      }
    },
    // 上传触发的方法
    beforeUpload() {
      console.log('附件列表', this.fileList)
    },
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
          if (this.isEdit) {
            if (res.result) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message.error('修改失败')
            }
            this.isEdit = false
          } else {
            if (res.result) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            } else {
              this.$message.error('添加失败')
            }
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

    // 获取附件列表
    async getFileList(id) {
      // 获得字典id
      await this.getParamsId()
      // 获取附件列表
      let params = {
        current: this.paginationEnclosure.current,
        size: this.paginationEnclosure.size,
        itemId: id,
        uploadFileTypeDicId: this.updataParamsId.uploadFileTypeDicId,
        uploadItemDictId: this.updataParamsId.uploadItemDictId
      }
      let fileRes = await queryPageEnclosure(params)
      console.log('附件分页数据', fileRes)
      this.fileListData = fileRes.result.records
    },
    // 双击修改
    async dblclickUpdata(row, column, event) {
      // 打开修改
      let res = await projectDetailsQuery(row.id)
      this.id = row.id
      await this.getFileList(this.id)

      this.initForm = { ...this.form }
      this.form = res.result
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
      let res = downloadFile(id)
      return baseAddress + res.url
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
  },
  watch: {
    'form.startDate': function (n) {
      // if (!this.isDetails) {
      //   this.form.finishDate = n
      // }
      if (!this.isDetails && !this.isEdit) {
        this.form.finishDate = n
      }
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

  .hideScrollBar::-webkit-scrollbar {
    width: 0 !important;
  }
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
      .el-table__row--striped > td {
        background-color: #f3f7fe !important;
      }
      .rowBgBlue {
        & > td {
          color: #fff;
          border-right: 1px solid #ebeef5;
          background-color: #69a8ea !important;
        }
      }
      th.el-table__cell > .cell {
        color: rgb(50, 59, 65);
        height: 40px;
        line-height: 40px;
        background: rgb(234, 241, 253);
      }
      .hover-row {
        color: #e6a23c;
        background-color: rgba($color: #2d74e7, $alpha: 0.1);
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
      /deep/.el-link--inner {
        font-size: 12px;
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

/deep/ .upload-demo {
  position: relative;
  .el-upload-list {
    max-height: 100px;
    overflow-y: scroll;
  }
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