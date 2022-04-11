<template>
  <div
    class="app-container"
    style="position: absolute;height:calc(100% - 40px);width:100%;overflow-y: auto;overflow-x: hidden;"
  >
    <!-- 服务配置 -->
    <el-row type="flex" :gutter="10" style="line-height: 54px;height:100%">
      <el-col style="height:100%;width:50%;padding-right:10px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="7">
            <div class="demo-input-suffix">
              <el-row>
                <el-col :span="5">
                  <span>名称:</span>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="serviceName" size="small" placeholder="请输入内容" clearable />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="demo-input-suffix">
              <el-row>
                <el-col :span="5">
                  <span>编码:</span>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="serviceCode" placeholder="请输入内容" size="small" clearable />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" size="small" @click="handleBtnClick('query', 'service')">查询</el-button>
            <el-button type="primary" size="small" @click="handleBtnClick('add', 'service')">新增</el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="serviceChoosing.length !== 1"
              @click="handleBtnClick('edit', 'service')"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              :disabled="serviceChoosing.length === 0"
              @click="handleBtnClick('delete', 'service')"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <div style="margin-top: 20px;height:100%;width:100%">
          <table-item
            :table-data="list"
            :column="column"
            :pagination="true"
            :pagesize="pagination.size"
            :currentpage="pagination.current"
            :tableheight="'calc(100% - 75px)'"
            :border="true"
            :multiple="true"
            :total="total"
            :fixed="false"
            :isdelete="true"
            :stripe="true"
            :is-select="false"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
            @handleSelectionChange="serviceSelection"
            @rowDblclick="handleServiceDbclick"
          />
        </div>
      </el-col>
      <el-col style="height:100%;width:50%;padding-left:10px">
        <el-row type="flex">
          <el-col :span="7">
            <div class="demo-input-suffix">
              <el-row>
                <el-col :span="5">
                  <span>名称:</span>
                </el-col>
                <el-col :span="15">
                  <el-input v-model="sourceName" size="small" placeholder="请输入内容" clearable />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="demo-input-suffix">
              <el-row>
                <el-col :span="8">
                  <span>资源值:</span>
                </el-col>
                <el-col :span="15">
                  <el-input v-model="sourceValue" size="small" placeholder="请输入内容" clearable />
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" size="small" @click="handleBtnClick('query', 'source')">查询</el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="serviceChoosing.length !== 1"
              @click="handleBtnClick('add', 'source')"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="small"
              :disabled="sourceChoosing.length !== 1"
              @click="handleBtnClick('edit', 'source')"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              :disabled="sourceChoosing.length === 0"
              @click="handleBtnClick('delete', 'source')"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <div style="margin-top: 20px;height:100%;width:100%">
          <table-item
            :table-data="list1"
            :column="column2"
            :pagination="false"
            :tableheight="'calc(100% - 75px)'"
            :border="true"
            :multiple="true"
            :fixed="false"
            :isdelete="true"
            :is-select="false"
            @handleSelectionChange="sourceSelection"
            @rowDblclick="handleSourceDbclick"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-if="dialogShow"
      v-dialogDrag
      :visible.sync="dialogShow"
      :title="dialogTitle"
      width="600px"
      @close="closedialogShow"
    >
      <template v-if="currDialog === 'service'">
        <el-form
          ref="serviceInfoForm"
          :model="serviceInfo"
          :rules="serviceInfoRule"
          label-position="right"
          label-width="140px"
        >
          <el-form-item label="服务编码：" prop="code">
            <el-input v-model="serviceInfo.code" size="small" placeholder="请输入服务编码" :disabled="currType !== 1" />
          </el-form-item>
          <el-form-item label="服务名称：" prop="name">
            <el-input v-model="serviceInfo.name" size="small" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="服务类型：" prop="type">
            <el-input v-model="serviceInfo.type" size="small" placeholder="请输入服务类型" />
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <el-form
          ref="sourceInfoForm"
          :model="sourceInfo"
          :rules="sourceInfoRule"
          label-position="right"
          label-width="140px"
        >
          <el-form-item label="资源编码：" prop="ckey">
            <el-input v-model="sourceInfo.ckey" size="small" placeholder="请输入资源编码" :disabled="currType !== 1" />
          </el-form-item>
          <el-form-item label="资源名称：" prop="name">
            <el-input v-model="sourceInfo.name" size="small" placeholder="请输入资源名称" />
          </el-form-item>
          <el-form-item prop="cval" label="资源值：">
            <el-input v-model="sourceInfo.cval" size="small" placeholder="请输入资源值" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <el-button @click="footerBtnClick('cancel')">取消</el-button>
        <el-button type="primary" @click="footerBtnClick('confirm')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import TableItem from '@/components/Table/index.vue'
import {
  serviceAdd,
  serviceDelete,
  serviceEdit,
  serviceList,
  sourceAdd,
  sourceDelete,
  sourceEdit,
  sourceList
} from '@/api/base'
@Component({
  name: 'ServiceConfig',
  components: { TableItem }
})
export default class ServiceConfig extends Vue {
  serviceName = ''
  serviceCode = ''
  sourceName = ''
  sourceValue = ''
  pagination = { current: 1, size: 30 } // 分页参数信息
  total = 1
  list = []
  column = [
    {
      label: '服务编码',
      prop: 'code'
    },
    {
      label: '服务名称',
      prop: 'name'
    },
    {
      label: '类型',
      prop: 'type'
    }
  ]
  list1 = []
  column2 = [
    {
      label: '资源编码',
      prop: 'ckey'
    },
    {
      label: '资源名称',
      prop: 'name'
    },
    {
      label: '资源值',
      prop: 'cval'
    }
  ]
  serviceInfo = {
    // 服务信息
    code: undefined,
    name: undefined,
    type: undefined,
    id: undefined
  }
  serviceInfoRule = {
    code: [{ required: true, message: '服务编码是必填项！', trigger: 'blur' }],
    name: [{ required: true, message: '服务名称是必填项！', trigger: 'blur' }],
    type: [{ required: true, message: '服务类型是必填项！', trigger: 'blur' }]
  }
  sourceInfoRule = {
    ckey: [{ required: true, message: '资源编码是必填项！', trigger: 'blur' }],
    name: [{ required: true, message: '资源名称是必填项！', trigger: 'blur' }],
    cval: [{ required: true, message: '资源值是必填项！', trigger: 'blur' }]
  }
  dialogShow = false // 弹窗
  currType = 1
  sourceInfo = {
    // 资源信息
    ckey: undefined,
    name: undefined,
    cval: undefined,
    pid: undefined,
    id: undefined
  }
  currDialog = 'service' // 弹窗当前为左侧服务
  serviceChoosing = []
  sourceChoosing = []
  get dialogTitle() {
    const title = this.currDialog === 'service' ? '服务' : '资源'
    return (this.currType === 1 ? '新增' : '修改') + title
  }
  @Watch('serviceChoosing')
  serviceChoosingChange() {
    if (this.serviceChoosing.length === 1) {
      this.getSourceList()
    } else this.list1 = []
  }
  @Watch('dialogShow')
  dialogShowChange(val) {
    if (!val) {
      this.$nextTick(() => {
        Object.keys(this.serviceInfo).forEach((item) => {
          this.serviceInfo[item] = undefined
        })
        Object.keys(this.sourceInfo).forEach((item) => {
          this.sourceInfo[item] = undefined
        })
      })
    }
  }
  // 获取服务列
  getServiceList() {
    // if (this.serviceName !== '' || this.serviceCode !== '') {
    //   this.pagination = { current: 1, size: 10 }
    // }
    const data = {
      name: this.serviceName || undefined,
      code: this.serviceCode || undefined,
      current: this.pagination.current,
      size: this.pagination.size,
      'orders[0].asc': false,
      'orders[0].column': 'ID'
    }
    serviceList(data).then((res) => {
      this.total = res.result.total
      // console.log(res.result.total, this.total)
      this.list = res.result.records || []
    })
  }
  // 新增服务
  addService() {
    // 新增需要的form数据
    serviceAdd(this.serviceInfo).then(() => {
      // 新增成功 刷新列表数据
      this.closedialogShow()
    })
  }
  // 编辑服务
  editService() {
    this.serviceInfo.id = this.serviceChoosing[0].id
    serviceEdit(this.serviceInfo).then(() => {
      // 编辑完成 关闭弹窗并获取新数据
      this.closedialogShow()
    })
  }
  // 新增编辑弹窗关闭公用方法
  closedialogShow() {
    this.dialogShow = false
    this.currDialog === 'service' ? this.getServiceList() : this.getSourceList()
    if (this.$refs.serviceInfoForm) {
      this.$refs.serviceInfoForm['resetFields']()
    }
    if (this.$refs.sourceInfoForm) {
      this.$refs.sourceInfoForm['resetFields']()
    }
  }
  // 删除服务项
  deleteService() {
    const data = { ids: this.serviceChoosing.map((item) => item.id).join(',') }
    serviceDelete(data).then((res) => {
      if (res.code !== -1) {
        this.$message.success('删除成功')
        this.getServiceList()
      }
    })
  }
  // 获取资源列
  getSourceList() {
    if (this.serviceChoosing.length === 0) {
      this.$message({
        message: '请先选择一项服务',
        type: 'error'
      })
      return
    }
    const data = {
      id: this.serviceChoosing[0].id,
      name: this.sourceName || undefined,
      cval: this.sourceValue || undefined,
      'orders[0].asc': false,
      'orders[0].column': 'ID'
    }
    sourceList(data).then((res) => {
      this.list1 = res.result.result || []
    })
  }
  // 新增资源
  addSource() {
    // 新增需要的form数据
    this.sourceInfo.pid = this.serviceChoosing[0].id
    sourceAdd(this.sourceInfo).then(() => {
      // 新增成功 刷新列表数据
      this.closedialogShow()
    })
  }
  // 编辑资源
  editSource() {
    sourceEdit(this.sourceInfo).then(() => {
      // 编辑完成 关闭弹窗并获取新数据
      this.closedialogShow()
    })
  }
  // 删除资源项
  deleteSource() {
    const data = { ids: this.sourceChoosing.map((item) => item.id).join(',') }
    sourceDelete(data).then((res) => {
      if (res.code !== -1) {
        this.$message.success('删除成功')
        this.getSourceList()
      }
    })
  }
  // 服务侧按钮点击
  handleBtnClick(type, dialog) {
    this.currDialog = dialog
    if (type === 'query') {
      dialog === 'service' ? this.getServiceList() : this.getSourceList()
    } else if (type === 'add') {
      this.currType = 1
      this.dialogShow = true
    } else if (type === 'edit') {
      this.currType = 2
      this.dialogShow = true
      // 判断是服务还是资源
      if (dialog === 'service') {
        const { code, name, type } = this.serviceChoosing[0]
        this.serviceInfo = { code, name, type, id: undefined }
      } else {
        const { ckey, name, cval, id } = this.sourceChoosing[0]
        this.sourceInfo = { ckey, name, cval, id, pid: undefined }
      }
    } else if (type === 'delete') {
      const deleteList = dialog === 'service' ? this.serviceChoosing : this.sourceChoosing
      const title = dialog === 'service' ? '服务信息?' : '资源信息?'
      this.$confirm('确定删除选中的' + deleteList.length + '条' + title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          dialog === 'service' ? this.deleteService() : this.deleteSource()
        })
        .catch(() => {
          return false
        })
    }
  }
  // 弹窗footer按钮点击
  footerBtnClick(type) {
    if (type === 'cancel') {
      // this.dialogShow = false;
      this.closedialogShow()
    } else if (type === 'confirm') {
      // 点击确定判断是服务还是资源
      if (this.currDialog === 'service') {
        this.$refs.serviceInfoForm['validate']((valid) => {
          if (valid) {
            // 再判断是新增还是编辑
            if (this.currType === 1) {
              this.addService()
            } else {
              this.editService()
            }
            // this.dialogShow = false;
          } else {
            return false
          }
        })
      } else {
        this.$refs.sourceInfoForm['validate']((valid) => {
          if (valid) {
            if (this.currType === 1) {
              this.addSource()
            } else {
              this.editSource()
            }
            // this.dialogShow = false;
          } else {
            return false
          }
        })
      }
    }
  }
  //  页码
  handleCurrentChange(current) {
    this.pagination = {
      ...this.pagination,
      current
    }
    this.getServiceList()
  }
  // 条数
  handleSizeChange(size = 1) {
    this.pagination = {
      ...this.pagination,
      size,
      current: 1
    }
    this.getServiceList()
  }
  // 服务列表选择
  serviceSelection(value) {
    this.serviceChoosing = value
  }
  // 资源列表选择
  sourceSelection(value) {
    this.sourceChoosing = value
  }

  // 双击查看
  handleServiceDbclick(data) {
    const that = this
    that.serviceChoosing = []
    that.serviceChoosing.push(data)
    // console.log('双击查看'+JSON.stringify(data))
    that.handleBtnClick('edit', 'service')
  }

  // 双击查看
  handleSourceDbclick(data) {
    const that = this
    that.sourceChoosing = []
    that.sourceChoosing.push(data)
    // console.log('双击查看'+JSON.stringify(data))
    that.handleBtnClick('edit', 'source')
  }
  mounted() {
    this.getServiceList()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  height: 680px;
}
</style>
