<template>
  <el-dialog
    title="账号申请"
    :visible="showApply"
    width="1500px"
    append-to-body
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="历史申请记录" name="history">
        <label for="queryCondition">用户名：</label>
        <el-input
          id="queryCondition"
          v-model="applyRealName"
          clearable
          size="small"
          placeholder="请输入查询条件"
          style="width: 150px"
        />
        <label for="auditOpinion">审核意见：</label>
        <el-select
          id="auditOpinion"
          v-model="applyStatus"
          clearable
          size="small"
          style="width: 150px; display: inline-block"
        >
          <el-option key="" value="" label="全部" />
          <el-option key="0" value="0" label="不同意" />
          <el-option key="2" value="2" label="同意" />
        </el-select>
        <label for="applyTime">申请时间：</label>
        <el-date-picker
          v-model="applyTime"
          clearable
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
        <el-button type="primary" size="small" @click="historyList">查询</el-button>
        <el-button type="primary" size="small" @click="toggleAccountApplyTab">账号申请</el-button>
        <el-table :data="applyHistory" stripe style="height: 400px; margin-top: 10px" border max-height="380px">
          <template v-for="item in columns">
            <el-table-column
              v-if="item.prop"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :formatter="item.formatter"
            />
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label">
              <template slot-scope="curr">
                <span
                  v-if="!item.prop"
                  style="cursor: pointer; color: #2d74e7"
                  @click="toggleAccountApplyDetailTab(curr.row)"
                  >详情</span
                >
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          style="text-align: right; margin-top: 10px"
          :current-page="page"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane v-if="accountApplyTab" label="账号申请" name="account" class="apply-account-container">
        <el-form
          ref="accountApply"
          size="small"
          :model="accountApply"
          :rules="accountApplyRules"
          label-width="110px"
          class="demo-ruleForm"
          style="width: 100%"
        >
          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="登录名：" prop="username">
                <el-input v-model="accountApply.username" />
              </el-form-item>
              <el-form-item label="密码：" prop="password">
                <el-input v-model="accountApply.password" type="password" />
              </el-form-item>
              <el-form-item label="用户名：" prop="realName">
                <el-input v-model="accountApply.realName" />
              </el-form-item>
              <el-form-item label="联系电话：" prop="phone">
                <el-input v-model="accountApply.phone" />
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="accountApply.email" />
              </el-form-item>
              <el-form-item label="部门：" prop="departmentId">
                <el-select
                  v-model="accountApply.departmentId"
                  placeholder="请选择"
                  @change="
                    () => {
                      accountApply.recipient = ''
                    }
                  "
                >
                  <el-option v-for="item in departmentIdOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="审核人：" prop="recipient">
                <el-select
                  v-model="accountApply.recipient"
                  filterable
                  placeholder="请选择"
                  :disabled="!accountApply.departmentId"
                >
                  <el-option
                    v-for="item in (recipients || []).filter(({ departmentId }) => {
                      return accountApply.departmentId === departmentId
                    })"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="工作岗位：" prop="applyJob">
                <el-input v-model="accountApply.job" />
              </el-form-item>
              <el-form-item label="工作职责：" prop="applyNote">
                <el-input v-model="accountApply.note" :rows="3" type="textarea" />
              </el-form-item>
              <el-form-item label="申请说明：" prop="applyState">
                <el-input v-model="accountApply.applystate" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="9">
              <el-row>
                <el-col :span="14">
                  <el-form-item label="个性签名图片：" prop="sign">
                    <el-upload
                      class="avatar-uploader"
                      action="fakeaction"
                      :show-file-list="false"
                      :before-upload="(file) => beforePicUpload(file, 'sign')"
                    >
                      <img v-if="esign" :src="esign" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="用户头像：" prop="sign">
                    <el-upload
                      class="avatar-uploader"
                      action="fakeaction"
                      :show-file-list="false"
                      :before-upload="(file) => beforePicUpload(file, 'avatar')"
                    >
                      <img v-if="head" :src="head" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
                    </el-upload>
                    <div class="msg">
                      ⚠️注意：上传图片只能是 JPG或png 格式!单张图片大小不能超过 2MB!
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div style="width: 100%; display: flex; justify-content: flex-end">
            <el-button type="primary" size="small" @click="submitApply">提交申请</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="applyDetailTab" label="申请详细查看" name="accountApplyDetail">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="baseInfo">
            <el-row>
              <el-col :span="12" class="base-info">
                <!-- <el-row>
                  <span class="title">申请人：</span><span>{{detailInfo.applyer}}</span>
                </el-row>
                <el-row>
                  <span class="title">申请时间：</span><span>{{detailInfo.applytime}}</span>
                </el-row> -->
                <el-row>
                  <span class="title">登录名：</span><span>{{ detailInfo.username }}</span>
                </el-row>
                <el-row>
                  <span class="title">用户名：</span><span>{{ detailInfo.realName }}</span>
                </el-row>
                <el-row>
                  <span class="title">联系电话：</span><span>{{ detailInfo.phone }}</span>
                </el-row>
                <el-row>
                  <span class="title">邮箱：</span><span>{{ detailInfo.email }}</span>
                </el-row>
                <el-row>
                  <span class="title">部门：</span><span>{{ detailInfo.deptName }}</span>
                </el-row>
                <el-row>
                  <span class="title">工作岗位：</span><span>{{ detailInfo.job }}</span>
                </el-row>
              </el-col>
              <el-col :span="12" class="base-info">
                <el-row>
                  <span class="title">个性签名图片：</span
                  ><img v-if="detailInfo.esignature !== null" :src="detailInfo.esignature" />
                </el-row>
                <el-row>
                  <span class="title">用户头像：</span
                  ><img v-if="detailInfo.avatar !== null" :src="detailInfo.avatar" />
                </el-row>
                <el-row>
                  <span class="title">工作职责：</span><span>{{ detailInfo.note }}</span>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="分配权限" name="authGruop">
            <el-row class="custom-row">
              <span class="title">角色：</span><span>{{ detailInfo.roleName }}</span>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="申请信息" name="applyInfo">
            <el-row class="custom-row">
              <span class="title">申请人：</span><span>{{ detailInfo.applyername }}</span>
            </el-row>
            <el-row class="custom-row">
              <span class="title">申请时间：</span><span>{{ detailInfo.createTime }}</span>
            </el-row>
            <el-row class="custom-row">
              <span class="title">申请说明：</span><span>{{ detailInfo.applystate }}</span>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="审核信息" name="auditInfo">
            <el-row class="custom-row">
              <span class="title">审核人：</span><span>{{ detailInfo.auditorname }}</span>
            </el-row>
            <el-row class="custom-row">
              <span class="title">审核时间：</span><span>{{ detailInfo.audittime }}</span>
            </el-row>
            <el-row class="custom-row">
              <span class="title">审核说明：</span><span>{{ detailInfo.auditstate }}</span>
            </el-row>
            <el-row class="custom-row">
              <span class="title">审核意见：</span><span>{{ detailInfo.auditstatus | formatteAuditStatus }}</span>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { accountApplyHistory, accountApplyFill, getCompanyAll, getAllAuditors } from '@/api/base'
import { imageByName } from '@/api/ftp'
import { regPhone, regEmail, regPassword, regUserName, regRealName } from '@/utils/reg'

// eslint-disable-next-line no-unused-vars
import { ElForm } from 'element-ui/types/form'

const sha1Hex = require('sha1-hex')
const columns = [
  { prop: 'order', label: '序号', width: '80' },
  { prop: 'username', label: '登录名' },
  { prop: 'realName', label: '用户名' },
  { prop: 'createTime', label: '申请时间' },
  { prop: 'applyername', label: '申请人' },
  {
    prop: 'auditstatus',
    label: '审核意见',
    formatter: (row, col, cellValue, index) => {
      if (cellValue === '0') return '不同意'
      if (cellValue === '1') return '未审核'
      if (cellValue === '2') return '同意'
    }
  },
  { prop: 'audittime', label: '审核时间' },
  { label: '操作', scopedSlot: 'actions' }
]
@Component({
  filters: {
    formatteAuditStatus(val) {
      switch (val) {
        case '0':
          return '不同意'

        case '1':
          return '未审核'

        case '2':
          return '同意'
      }
    }
  }
})
export default class AccountApply extends Vue {
  @Prop({ default: false }) showApply: boolean
  accountApply = {
    username: '',
    password: '',
    realName: '',
    phone: '',
    email: '',
    departmentId: '',
    recipient: '', // 审核人
    note: '',
    job: '',
    applystate: '',
    file: '', // 用户头像
    electronicFile: '' // 电子签名
  }
  accountApplyRules = {
    username: [
      { required: true, message: '请输入登录名', trigger: 'blur' },
      {
        pattern: regUserName(),
        message: '4-16位字母与数字，不可包含非法字符！',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: regPassword(),
        message: '密码位数8-16位，必须包含大小写字母和数字，不可包含非法字符！',
        trigger: 'blur'
      }
    ],
    realName: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        pattern: regRealName(),
        message: '2-6位中文字符，不可包含非法字符！',
        trigger: 'blur'
      }
    ],
    phone: [{ pattern: regPhone(), message: '请输入正确的联系电话', trigger: 'blur' }],
    email: [{ pattern: regEmail(), message: '请输入正确的邮箱', trigger: 'blur' }],
    // role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
    departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
    recipient: [{ required: true, message: '请选择审核人', trigger: 'blur' }]
    // sign: [{ required: true, message: '请上传个性签名', trigger: 'blur' }],
    // applyNote: [
    //   { required: true, message: '请输入备注信息', trigger: 'blur' }
    // ],
    // applyState: [
    //   { required: true, message: '请输入申请说明', trigger: 'blur' }
    // ]
  }
  accountApplyTab = false
  applyDetailTab = false
  columns
  activeTab = 'history'
  departmentIdOptions = []
  recipients = [] // 审核人列表
  value = ''
  fileList = []
  applyRealName = ''
  applyStatus = ''
  applyTime = ''
  applyHistory = []
  pageSize = 10
  page = 1
  total = 0
  detailInfo = null
  activeNames = ['baseInfo']
  esign = ''
  head = ''
  @Watch('showApply')
  showApplyChange(val) {
    if (val === false) {
      this.accountApplyTab && (this.$refs.accountApply as ElForm).resetFields()
      this.accountApplyTab = false
      this.applyDetailTab = false
      this.activeTab = 'history'
    }
  }
  mounted() {
    this.columns = columns
    this.historyList()
    this.getdepartmentId()
    this.getAuditors()
  }
  // 打开账号申请界面
  toggleAccountApplyTab() {
    this.accountApplyTab = true
    if (this.accountApplyTab) this.activeTab = 'account'

    console.log(this.recipients)
  }
  // 打开申请详情页面
  toggleAccountApplyDetailTab(data) {
    this.detailInfo = data
    this.applyDetailTab = true
    if (this.applyDetailTab) this.activeTab = 'accountApplyDetail'
    const arr = [this.detailInfo.avatar, this.detailInfo.esignature]
    // arr.forEach((item, index) => {
    // item !== null &&
    // imageByName(item).then((res) => {
    //   if (res.status === 200) {
    //     index === 1
    //       ? (this.detailInfo.esignature = res.config.url)
    //       : (this.detailInfo.avatar = res.config.url)
    //   }
    // })

    // })
    this.detailInfo = {
      ...this.detailInfo,
      esignature: imageByName(this.detailInfo.esignature),
      avatar: imageByName(this.detailInfo.avatar)
    }
  }
  // 关闭dialog
  closeDialog() {
    this.$emit('update:showApply', false)
  }
  // 历史申请记录
  historyList() {
    const data = {
      realName: this.applyRealName,
      auditStatus: this.applyStatus,
      startAuditTime: (this.applyTime !== null && this.applyTime[0]) || '',
      endAuditTime: (this.applyTime !== null && this.applyTime[1]) || '',
      current: this.page,
      size: this.pageSize
      // 'orders[0].asc': false,
      // 'orders[0].column': 'ID'
    }
    accountApplyHistory(data).then((res) => {
      this.total = res.result.total
      res.result.records.forEach((item, index) => {
        item.order = index + 1
      })
      this.applyHistory = res.result.records
    })
  }
  // 申请账号
  submitApply() {
    ;(this.$refs.accountApply as ElForm).validate((valid) => {
      if (valid) {
        const data = new FormData()
        for (const key in this.accountApply) {
          data.append(key, key === 'password' ? sha1Hex(this.accountApply[key]) : this.accountApply[key])
        }
        accountApplyFill(data).then((res) => {
          // 用户存在的时候， 后台返回的数据多包了一层，造成永远都是code = 1, 报错的时候是res.result.code === -1
          if ((res.result || {}).code === -1) {
            this.$message({
              type: 'warning',
              message: res.result.message
            })
            return
          }
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '用户申请成功'
            })

            this.accountApplyTab = false
            this.activeTab = 'history'
            this.$store.dispatch('user/finnishApply', true)
            this.historyList()
          }
        })
      } else {
        return false
      }
    })
  }
  // 上传之前做验证和文件转换
  beforePicUpload(file, type) {
    const isJPG = file.type === 'image/jpeg'
    const isPng = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG && !isPng) {
      this.$message.error('上传图片只能是 JPG或png 格式!')
      return false
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!')
      return false
    }
    const _this = this
    const reader = new FileReader()
    type === 'sign' ? (this.accountApply.electronicFile = file) : (this.accountApply.file = file)
    // 转base64
    reader.onload = function(e) {
      type === 'sign' ? (_this.esign = e.target.result.toString()) : (_this.head = e.target.result.toString()) // 将图片路径赋值给src
    }
    reader.readAsDataURL(file)
    return false
  }
  // 获取部门
  getdepartmentId() {
    getCompanyAll().then((res) => {
      this.departmentIdOptions = res.result
    })
  }
  // 获取审核人
  getAuditors() {
    getAllAuditors(null).then((res) => {
      this.recipients = res.result.map((item) => {
        return {
          name: item.realName,
          id: item.id,
          departmentId: item.departmentId
        }
      })
    })
  }
  handleSizeChange(size) {
    this.pageSize = size
    this.historyList()
  }
  handleCurrentChange(data) {
    this.page = data
    this.historyList()
  }
}
</script>

<style lang="scss" scoped>
.apply-account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
  .msg {
    color: #c0c4cc;
    font-size: 12px;
    line-height: 20px;
  }
}
.base-info {
  .el-row {
    display: flex;
    margin-bottom: 20px;
    .title {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .title + span,
    img {
      display: inline-block;
      width: 380px;
    }
    img {
      width: 120px;
    }
  }
}
.custom-row {
  display: flex;
  margin-bottom: 20px;
  span {
    display: inline-block;
    width: 80%;
    &.title {
      width: 100px;
      text-align: right;
    }
  }
}
</style>
