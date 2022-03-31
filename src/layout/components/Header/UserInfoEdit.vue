<template>
  <el-dialog
    title="账号编辑"
    :visible="showApply"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="90px"
      class="demo-ruleForm apply-account-container"
    >
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
          <el-form-item style="margin-bottom: 15px" label="登录名">
            <el-input
              v-model="ruleForm.username"
              size="small"
              placeholder="请输入登录名"
              :disabled="difference"
            />
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" size="small" type="password" placeholder="请输入密码" />
            </el-form-item> -->
          <el-form-item
            style="margin-bottom: 15px"
            label="用户名"
            prop="realName"
          >
            <el-input
              v-model="ruleForm.realName"
              size="small"
              placeholder="请输入客户名"
            />
          </el-form-item>
          <el-form-item
            style="margin-bottom: 15px"
            label="联系电话"
            prop="phone"
          >
            <el-input
              v-model="ruleForm.phone"
              size="small"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 15px" label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              size="small"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 15px" label="工作岗位" prop="job">
            <el-input v-model="ruleForm.job" />
          </el-form-item>
          <el-form-item
            style="margin-bottom: 15px"
            label="工作职责"
            prop="note"
          >
            <el-input v-model="ruleForm.note" :rows="3" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="个性签名"
            label-width="7.5rem"
            style="margin-bottom: 15px"
          >
            <!-- :data="upLoadData" -->
            <el-upload
              class="avatar-uploader"
              action="111"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="(file) => beforeAvatarUpload(file, 'sign')"
            >
              <img v-if="form.signPic" :src="form.signPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
            </el-upload>
          </el-form-item>
          <el-form-item label="头像" label-width="7.5rem">
            <!-- :data="upLoadData" -->
            <el-upload
              class="avatar-uploader"
              action="111"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="(file) => beforeAvatarUpload(file, 'avatar')"
              style="margin-bottom: 15px"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
            </el-upload>
            <div class="msg">
              ⚠️注意：上传图片只能是 JPG或png 格式!单张图片大小不能超过 2MB!
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
// import { getInfo } from '@/api/dashboard'
import { editUser, getUserList } from '@/api/base'
import { imageByName } from '@/api/ftp'
import { regUserName, regPhone, regEmail } from '@/utils/reg'
import { ElForm } from 'element-ui/types/form'
@Component({})
export default class UserInfoEdit extends Vue {
  @Prop({ default: false }) showApply: boolean;

  difference = true;
  data = null;
  ruleForm = {
    username: '',
    // password: '',
    realName: '',
    phone: '',
    email: '',
    departmentId: '',
    roles: [],
    job: '',
    note: '',
    file: '',
    electronicFile: ''
  };
  form = {
    avatar: '',
    signPic: '',
    imageUrl: ''
  };
  rules = {
    username: [
      { required: true, message: '请输入登录名', trigger: 'blur' },
      {
        pattern: regUserName(),
        message: '登录名只能输入英文、数字',
        trigger: 'blur'
      }
    ],
    realName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    phone: [
      { pattern: regPhone(), message: '请输入正确联系手机号', trigger: 'blur' }
    ],
    email: [
      { pattern: regEmail(), message: '请输入正确邮箱', trigger: 'blur' }
    ]
  };
  mounted() {
    this.getUserInfo()
  }
  /**
   * @description 获取用户信息
   */
  getUserInfo() {
    const userId = this.$store.state.user.userId

    var that = this
    getUserList({ id: userId }).then((res) => {
      console.log(res)
      if (res.code !== -1) {
        const result = res.result
        if (result.records.length > 0) {
          that.data = result.records[0]
          that.data.phone = that.strIsNull(that.data.phone)
            ? ''
            : that.data.phone // 联系电话
          that.data.email = that.strIsNull(that.data.email)
            ? ''
            : that.data.email // 邮箱
          that.data.job = that.strIsNull(that.data.job) ? '' : that.data.job // 工作岗位
          that.data.note = that.strIsNull(that.data.note) ? '' : that.data.note // 工作职责
          that.handleEdit()
        } else {
          that.$message.error('未查询到相关的用户信息')
        }
      } else {
        // @ts-ignore
        that.$message.error(res.$message)
      }
    })
  }

  // 上传之前的钩子函数
  beforeAvatarUpload(file, type) {
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
    // console.log('2222', file)
    type === 'avatar'
      ? (this.ruleForm.file = file)
      : (this.ruleForm.electronicFile = file)
    const _this = this
    const reader = new FileReader()
    // 转base64
    reader.onload = function(e) {
      type === 'sign'
        ? (_this.form.signPic = e.target.result.toString())
        : (_this.form.avatar = e.target.result.toString()) // 将图片路径赋值给src
    }
    reader.readAsDataURL(file)
    return false // 屏蔽了action的默认上传
  }
  // 图片上传成功实现本地预览
  handleAvatarSuccess(res, file) {
    this.form.imageUrl = URL.createObjectURL(file.raw) // 表单获取到提交时要传的图片路径
  }

  // 拼接数据
  readyData() {
    const data = new FormData()
    // data.append('file', this.ruleForm.file)// 图片
    // 传其他参数
    for (const key in this.ruleForm) {
      if (key === 'roles') {
        data.append(key, this.ruleForm[key].toString())
      } else if (
        key === 'phone' ||
        key === 'email' ||
        key === 'job' ||
        key === 'note'
      ) {
        let tempVal = this.ruleForm[key] + ''
        if (this.strIsNull(tempVal)) {
          tempVal = 'null'
        }
        data.append(key, tempVal)
      } else {
        data.append(key, this.ruleForm[key])
      }
    }
    // 编辑添加id
    data.append('id', this.data.id)
    return data
  }
  // 提交
  submitForm() {
    const _this = this;
    (this.$refs.ruleForm as ElForm).validate((valid) => {
      if (valid) {
        const data = _this.readyData()
        _this.editSubmit(data)
      } else {
        return false
      }
    })
  }

  // 修改提交
  editSubmit(data) {
    const _this = this
    editUser(data).then((res) => {
      if (res.code !== -1) {
        if (res.result.code === -1) {
          this.$message.error(res.result.message)
        } else {
          _this.$message.success('修改成功')
          _this.closeDialog()
        }
      }
    })
  }

  // 编辑参数回显
  handleEdit() {
    this.ruleForm = this.assignment(this.ruleForm, this.data) as any
    const arr = [this.data.avatar, this.data.esignature]
    arr.forEach((item, index) => {
      if (item === null) return
      imageByName(item).then((res) => {
        if (res.status === 200) {
          index === 1
            ? (this.form.signPic = res.config.url)
            : (this.form.avatar = res.config.url)
        }
      })
    })
  }

  // 赋值
  assignment(par, role) {
    const data = {}
    for (const key in par) {
      if (key === 'roles') {
        data[key] =
          role.roleIdList &&
          role.roleIdList != null &&
          role.roleIdList.split(',')
      } else {
        data[key] = role[key]
      }
    }
    return data
  }

  // 关闭dialog
  closeDialog() {
    this.$emit('update:showApply', false)
  }

  /*
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return (
      typeof strVal === 'undefined' ||
      strVal == null ||
      strVal == '' ||
      strVal == 'null'
    )
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
    // object-fit: cover;
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

