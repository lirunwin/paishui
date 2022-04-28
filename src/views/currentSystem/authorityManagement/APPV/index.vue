<template>
  <div
    class="app-container"
    style="height:calc(100% - 40px);width:100%;position: absolute;overflow-y: auto;overflow-x: hidden;"
  >
    <div style="line-height: 54px">
      <!-- APP版本 -->
      <select-item
        can-clear
        placeholder="请选择应用程序类型"
        title="程序类型："
        nominate="appClassfication"
        :value="appClassfication"
        custom-style="display: inline-block; width: 300px;margin-right:10px"
        :disabled="false"
        :required="false"
        :filterable="true"
        :options="options1"
        @changeSelectValue="changeSelectValue"
      />
      <select-item
        can-clear
        placeholder="请选择发布状态"
        title="发布状态："
        nominate="publishStatus"
        :value="publishStatus"
        custom-style="display: inline-block; width: 300px;margin-right:10px"
        :disabled="false"
        :required="false"
        :filterable="true"
        :options="options2"
        @changeSelectValue="changeSelectValue"
      />
      发布时间：
      <!-- <el-date-picker v-model="publishTime" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" /> -->
      <el-date-picker
        v-model="publishTime.startTime"
        style="width: 160px"
        size="small"
        type="date"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      ~
      <el-date-picker
        v-model="publishTime.endTime"
        style="width: 160px"
        size="small"
        type="date"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />

      <el-button type="primary" size="small" @click="handleClick('query')">查询</el-button>
      <el-button type="primary" size="small" @click="uploadDialog = true">上传</el-button>
      <el-button type="primary" size="small" :disabled="deleteDisabled" @click="handleClick('delete')">删除</el-button>
      <el-button type="primary" size="small" :disabled="publishDisabled" @click="handleClick('publish')"
        >发布</el-button
      >
    </div>
    <div style="height:calc(100% - 76px);margin-top: 20px">
      <table-item
        :table-data="list"
        :column="column"
        :pagination="true"
        :pagesize="pagination.size"
        :currentpage="pagination.current"
        :tableheight="'100%'"
        :border="true"
        :multiple="true"
        :total="total"
        :fixed="false"
        :isdelete="true"
        :stripe="true"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="handleSelectionChange"
        @detail="detailsLook"
        @rowDblclick="detailsLook"
      />
    </div>
    <el-dialog v-dialogDrag :visible.sync="detailDialog" title="详细信息查看" width="900px">
      <div class="detail-container">
        <el-row class="info-row">
          <el-col class="info-col" :span="12">
            <span>应用程序类型：</span><span>{{ detailInfo.appType === '1' ? 'app' : '前端平台' }}</span>
          </el-col>
          <el-col class="info-col" :span="12">
            <span>版本号：</span><span>{{ detailInfo.version }}</span>
          </el-col>
        </el-row>
        <el-row class="info-row">
          <el-col class="info-col" :span="12">
            <span>上传包文件大小:</span><span>{{ detailInfo.appSize }}</span>
          </el-col>
          <el-col class="info-col" :span="12">
            <span>上传包文件名称:</span><span>{{ detailInfo.filename }}</span>
          </el-col>
        </el-row>
        <el-row class="info-row">
          <el-col class="info-col" :span="12">
            <span>上传时间:</span><span>{{ detailInfo.createTime }}</span>
          </el-col>
          <el-col class="info-col" :span="12">
            <span>上传人:</span><span>{{ detailInfo.createUserName }}</span>
          </el-col>
        </el-row>
        <el-row class="info-row">
          <el-col class="info-col" :span="12">
            <span>状态:</span><span>{{ detailInfo.releasestatus === '2' ? '已发布' : '未发布' }}</span>
          </el-col>
          <el-col class="info-col" :span="12">
            <span>发布人:</span><span>{{ detailInfo.releaserName }}</span>
          </el-col>
        </el-row>
        <el-row class="info-row">
          <el-col class="info-col" :span="12">
            <span>发布时间:</span><span>{{ detailInfo.releasetime }}</span>
          </el-col>
          <el-col class="info-col" :span="12">
            <span>版本说明信息:</span><span>{{ detailInfo.versionstate }}</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :visible.sync="uploadDialog"
      title="选取文件"
      width="400px"
      :before-close="canClose"
      :close-on-click-modal="false"
    >
      <div v-loading="uploadWaiting" style="width: 100%">
        <el-form ref="appForm" :model="appForm" :rules="appFormRules" label-width="90px" class="demo-ruleForm">
          <el-row type="flex" justify="space-around">
            <el-col :span="24">
              <el-form-item style="margin-bottom: 15px" prop="appType" label="app类型">
                <el-select v-model="appForm.appType" size="small" placeholder="请选择app类型">
                  <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="24">
              <el-form-item label="版本号" style="margin: 20px 0" prop="version">
                <el-input v-model="appForm.version" size="small" placeholder="请输入版本号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="24">
              <el-form-item style="margin-bottom: 15px" label="附件上传">
                <el-upload
                  action="fakeaction"
                  style="display: inline-block; width: 100%"
                  multiple
                  :show-file-list="true"
                  :on-change="verificationFileType"
                  :auto-upload="false"
                  :file-list="fileList"
                  :on-remove="deleteFile"
                  :on-exceed="overflow"
                  :limit="2"
                  accept=".txt,.apk,.zip"
                >
                  <div
                    style="
                      width: 100%;
                      display: flex;
                      justify-content: space-around;
                    "
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button
                      v-if="fileList.length !== 0"
                      style="margin-left: 20px"
                      size="small"
                      type="success"
                      @click.stop="upload"
                      >上传文件</el-button
                    >
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import TableItem from '@/components/Table/index.vue'
import SelectItem from '@/components/FormItem/Select/index.vue'
import { recordList, upLoadFiles, deleteRecord, publishRecord } from '@/api/base'
@Component({
  name: 'APPV',
  components: { TableItem, SelectItem }
})
export default class APPV extends Vue {
  pagination = { current: 1, size: 30 } // 分页参数信息
  total = 1
  appClassfication = '2'
  publishStatus = ''
  publishTime = {
    startTime: '',
    endTime: ''
  }
  startOptions = {
    // 开始时间控制
    disabledDate: (time) => {
      if (this.publishTime.endTime) {
        return time.getTime() >= new Date(this.publishTime.endTime)
      }
    }
  }
  endOptions = {
    // 结束时间控制
    disabledDate: (time) => {
      if (this.publishTime.startTime) {
        return new Date(this.publishTime.startTime).getTime() - 1000 * 60 * 60 * 24 > time.getTime()
      }
    }
  }

  options1 = [
    // {
    //   id: '1',
    //   name: 'APP'
    // },
    {
      id: '2',
      name: '前端平台'
    }
  ]
  options2 = [
    {
      id: '1',
      name: '未发布'
    },
    {
      id: '2',
      name: '已发布'
    }
  ]
  list = [
    {
      applx: '公众APP',
      bbh: 'V1.0.1',
      fbsj: '2020-11-06 11:27:12',
      wj: 'adsd.apk',
      bbsm: '版本说明'
    }
  ]
  column = [
    {
      label: '应用程序类型',
      prop: 'appType',
      width: '150',
      formatter: (row, col, cellValue, index) => {
        if (cellValue === '1') return 'app'
        if (cellValue === '2') return '前端平台'
      }
    },
    {
      label: '版本号',
      prop: 'version', // version
      width: '150'
    },
    {
      label: '上传包文件',
      prop: 'filename'
    },
    {
      label: '上传人员',
      prop: 'createUserName',
      width: '100'
    },
    {
      label: '上传时间',
      prop: 'createTime',
      width: '200'
    },
    {
      label: '状态',
      prop: 'releasestatus',
      width: '200',
      formatter: (row, col, cellValue, index) => {
        if (cellValue === '1') return '未发布'
        if (cellValue === '2') return '已发布'
      }
    },
    {
      label: '发布人员',
      prop: 'releaserName',
      width: '100'
    },
    {
      label: '发布时间',
      prop: 'releasetime',
      width: '200'
    },
    {
      label: '操作',
      slotScoped: 'action',
      emitWay: 'detail',
      width: '100',
      operation: '详细',
      acts: [{ emitWay: 'detail', operation: '详细', color: 'blue' }]
    }
  ]
  multipleSelection = []
  detailDialog = false
  uploadDialog = false
  detailInfo = {}
  fileList = []
  uploadWaiting = false
  appFormRules = {
    version: [{ required: true, message: '请输入版本号' }],
    appType: [{ required: true, message: '请选择上传类型' }]
  }
  appForm = {
    appType: '2', // app类型 1 APP；2 前端平台
    version: ''
  }
  get deleteDisabled() {
    const selAry = this.multipleSelection
    const newAry = selAry.filter((item) => item.releasestatus !== '2')

    const enableFlag = selAry.length > 0 && newAry.length === selAry.length

    return !enableFlag
    // return !(this.multipleSelection.length !== 0 && this.multipleSelection.some(item => item.releasestatus === '1'))
  }
  get publishDisabled() {
    return !(this.multipleSelection.length === 1 && this.multipleSelection[0].releasestatus === '1')
  }
  @Watch('uploadDialog')
  uploadDialogChange(val) {
    if (!val) {
      this.fileList = []
    }
  }
  mounted() {
    this.getRecords()
  }
  success() {
    console.log(arguments)
  }
  // 获取记录
  getRecords() {
    var that = this

    if (
      !(
        (!that.publishTime.startTime && !that.publishTime.endTime) ||
        (that.publishTime.startTime && that.publishTime.endTime)
      )
    ) {
      that.$message.info('时间段请选择完整！')
      return
    }

    const params = {
      type: that.appClassfication || undefined,
      releasestatus: that.publishStatus || undefined,
      startDate: that.publishTime.startTime ? that.publishTime.startTime + ' 00:00:00' : '',
      endDate: that.publishTime.endTime ? that.publishTime.endTime + ' 23:59:59' : '',
      current: that.pagination.current,
      size: that.pagination.size
    }
    recordList(params).then((res) => {
      that.list = res.result.records
      that.total = res.result.total
    })
  }
  // 上传文件之前进行文件类型验证
  verificationFileType(data) {
    // this.fileList.push(data.raw);
    if (
      data.raw.type === 'text/plain' ||
      // data.raw.type === 'application/vnd.android.package-archive' ||
      data.raw.type === 'application/x-zip-compressed'
    ) {
      this.fileList.push(data.raw)
    } else {
      this.$message({
        message: '只能上传apk、txt、zip文件',
        type: 'error'
      })
      return
    }
  }
  // 上传文件和版本说明
  upload() {
    const form = new FormData()
    // 增加类型
    form.append('appType', this.appForm.appType)
    form.append('version', this.appForm.version)
    for (const item of this.fileList) {
      if (item.type === 'text/plain') {
        form.append('txtFile', item)
      } else if (
        item.type === 'application/vnd.android.package-archive' ||
        item.type === 'application/x-zip-compressed'
      ) {
        form.append('appFile', item)
      }
    }
    // 判断附件是否存在
    if (!form.get('txtFile')) {
      this.$message({
        message: '请上传版本说明信息(txt格式)',
        type: 'error'
      })
      return
    }

    if (!form.get('appFile')) {
      this.$message({
        message: '请上传app、zip安装文件(apk格式、zip格式)',
        type: 'error'
      })
      return
    }

    this.uploadWaiting = true
    upLoadFiles(form)
      .then((res) => {
        // 上传成功后刷新列表
        if (res.code !== -1) {
          this.uploadDialog = false
          this.fileList = []
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.getRecords()
        } else {
          this.$message.error(res.result.message)
        }
      })
      .finally(() => {
        this.uploadWaiting = false
      })
  }
  // 关闭弹窗
  canClose(done) {
    if (this.uploadWaiting) return
    else done()
  }
  // 移除添加的文件
  deleteFile(params) {
    const delIndex = this.fileList.findIndex((item) => item === params)
    delIndex !== -1 ? this.fileList.splice(delIndex, 1) : null
    console.log(this.fileList)
  }
  // 超限
  overflow(file, list) {
    if (list.length === 2) {
      this.$message({
        message: '最多选择两个文件',
        type: 'error'
      })
      return
    }
  }
  // 删除记录
  deleteUnPublish() {
    const data = this.multipleSelection.map((item) => item.id).join(',')
    const batch = data.length !== 1
    deleteRecord({ ids: data }).then(() => {
      this.getRecords()
    })
  }
  // 发布版本
  publishVersion() {
    this.$confirm('是否要发布该版本?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
      .then(() => {
        publishRecord(this.multipleSelection[0]).then((res) => {
          if (res.code !== -1) {
            this.$message({
              type: 'success',
              message: '发布成功！'
            })
            this.getRecords()
          }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布！'
        })
      })
  }
  // 按钮点击
  handleClick(type) {
    if (type === 'query') {
      this.pagination.current = 1
      this.getRecords()
    } else if (type === 'delete') {
      this.$confirm('是否删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUnPublish()
      })
    } else if (type === 'publish') {
      this.publishVersion()
    }
  }
  // 详情查看
  detailsLook(data) {
    // console.log(data)
    this.detailDialog = true
    this.detailInfo = data
  }
  changeSelectValue(key, val) {
    this[key] = val
  }
  //  页码
  handleCurrentChange(currentPage) {
    this.pagination.current = currentPage
    this.getRecords()
  }

  // 条数
  handleSizeChange(size = 1) {
    this.pagination = {
      ...this.pagination,
      size,
      current: 1
    }
    this.getRecords()
  }

  // 选择
  handleSelectionChange(value) {
    this.multipleSelection = value
    //  console.log('1111', value)
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  .info-row {
    margin-bottom: 20px;
    .info-col {
      display: flex;
      span {
        display: block;
        width: 250px;
        &:nth-of-type(1) {
          display: inline-block;
          width: 120px;
          text-align: right;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
