<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px" class="demo-ruleForm">
    <el-row type="flex" justify="space-around">
      <el-col :span="12">
        <el-form-item style="margin-bottom: 18px" label="登录名" prop="username">
          <el-input v-model="ruleForm.username" size="small" placeholder="请输入登录名" :disabled="difference" />
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" size="small" type="password" placeholder="请输入密码" />
          </el-form-item> -->
        <el-form-item style="margin-bottom: 18px" label="用户姓名" prop="realName">
          <el-input v-model="ruleForm.realName" size="small" placeholder="请输入客户名" />
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone" size="small" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" size="small" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="部门" prop="departmentId">
          <!-- <el-select v-model="ruleForm.departmentId" size="small" placeholder="请选择部门">
            <el-option v-for="item in company" :key="item.id" :label="item.name" :value="item.id" />
          </el-select> -->
          <el-cascader
            popper-class="cascader"
            v-model="ruleForm.departmentId"
            :options="company"
            :props="{ expandTrigger: 'hover', label: 'name', value: 'id', checkStrictly: true }"
            size="small"
            style="width:100%"
            filterable
            clearable
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="角色复制">
          <el-select
            v-model="copyRole"
            multiple
            size="small"
            placeholder="请选择需要复制的用户角色"
            filterable
            clearable
            collapse-tags
            @focus="getCopyDeptUserList"
            @change="copyRoleChange"
          >
            <el-option v-for="item in copyUsers" :key="item.id" :label="item.realName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="角色绑定" prop="roles">
          <el-select v-model="ruleForm.roles" multiple size="small" placeholder="请选择用户管理权限">
            <el-option v-for="item in optionsRole" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="工作岗位" prop="job">
          <el-input v-model="ruleForm.job" />
        </el-form-item>
        <el-form-item style="margin-bottom: 18px" label="工作职责" prop="note">
          <el-input v-model="ruleForm.note" :rows="3" type="textarea" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="个性签名" label-width="7.5rem" style="margin-bottom: 18px">
          <!-- :data="upLoadData" -->
          <el-upload
            class="avatar-uploader"
            action="111"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="(file) => beforeAvatarUpload(file, 'sign')"
          >
            <img v-if="form.signPic" :src="form.signPic" class="avatar" />
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
            style="margin-bottom: 18px"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
          </el-upload>
          <div class="msg">
            ⚠️注意：上传图片只能是 JPG或png 格式!单张图片大小不能超过 2MB!
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { addUser, editUser, getDeptUserList, getUserList } from '@/api/base'
import { imageByName } from '@/api/ftp'
import { regUserName, regPhone, regEmail } from '@/utils/reg'
import { ElForm } from 'element-ui/types/form'

const sha1Hex = require('sha1-hex')
@Component({
  name: 'MergeUser'
})
export default class MergeUser extends Vue {
  @Prop() data!: any // 编辑的数据
  @Prop(Array) company!: any[] // 单位信息
  @Prop(Array) optionsRole!: any[]
  ruleForm = {
    username: '',
    // password: '',
    realName: '',
    phone: '',
    email: '',
    departmentId: [],
    roles: [],
    job: '',
    note: '',
    file: '',
    electronicFile: ''
  }
  form = {
    avatar: '',
    signPic: '',
    imageUrl: ''
  }
  rules = {
    username: [
      { required: true, message: '请输入登录名', trigger: 'blur' },
      {
        pattern: regUserName(),
        message: '登录名只能输入英文、数字',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
    ],
    realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
    phone: [{ pattern: regPhone(), message: '请输入正确联系手机号', trigger: 'blur' }],
    email: [{ pattern: regEmail(), message: '请输入正确邮箱', trigger: 'blur' }],
    departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
    roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
  }
  difference = false

  copyRole = [] //选择的复制角色用户
  copyUsers = [] // 用户列表
  created() {
    // console.log("333", JSON.stringify(this.data));
    this.difference = JSON.stringify(this.data) !== '{}'
    if (this.difference) {
      this.handleEdit()
    }

    // if(typeof(this.data.username) !== 'undefined'){
    //   this.handleEdit()
    // }else{
    //   this.ruleForm.roles = this.data.roles
    // }

    //获取用户信息
    this.getCopyDeptUserList()
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
    type === 'avatar' ? (this.ruleForm.file = file) : (this.ruleForm.electronicFile = file)
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
  // 重置
  resetFields() {
    ;(this.$refs.ruleForm as ElForm).resetFields()
  }
  // 拼接数据
  readyData() {
    const data = new FormData()
    // data.append('file', this.ruleForm.file)// 图片
    // 传其他参数
    for (const key in this.ruleForm) {
      if (key === 'departmentId') {
        data.append(key, Array.isArray(this.ruleForm[key]) ? [...this.ruleForm[key]].pop() : this.ruleForm[key])
      } else if (key === 'password') {
        data.append(key, sha1Hex(this.ruleForm[key]))
      } else if (key === 'roles') {
        data.append(key, this.ruleForm[key].toString())
      }
      // else if (key === 'phone' || key === 'email' || key === 'job' || key === 'note') {
      //   let tempVal = this.ruleForm[key] + ''
      //   if (this.strIsNull(tempVal)) {
      //     tempVal = 'null'
      //   }
      //   data.append(key, tempVal)
      // }
      else {
        data.append(key, this.ruleForm[key])
      }
      // }
    }
    // 编辑添加id
    if (this.difference) {
      data.append('id', this.data.id)
    }
    return data
  }
  // 提交
  submitForm() {
    const _this = this
    ;(this.$refs.ruleForm as ElForm).validate((valid) => {
      if (valid) {
        const data = _this.readyData()
        // console.log('file', data, _this.file)
        if (!this.difference) {
          _this.newAddUser(data)
        } else {
          _this.editSubmit(data)
        }
        return true
      }
    })
  }

  // 新增提交
  newAddUser(data) {
    const _this = this
    addUser(data).then((res) => {
      if (res.code !== -1) {
        if (res.result.code === -1) {
          this.$message.error(res.result.message)
        } else {
          _this.$message.success('新增成功')
          _this.$emit('remind', '成功')
          _this.resetFields()
        }
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
          _this.$emit('remind', '成功')
          _this.resetFields()
        }
      }
    })
  }

  // 编辑参数回显
  handleEdit() {
    this.ruleForm = this.assignment(this.ruleForm, this.data) as any
    // const arr = [this.data.avatar, this.data.esignature]
    // arr.forEach((item, index) => {
    //   if (item === null) return
    //   imageByName(item).then((res) => {
    //     if (res.status === 200) {
    //       index === 1 ? (this.form.signPic = res.config.url) : (this.form.avatar = res.config.url)
    //     }
    //   })
    // })
    this.form = {
      ...this.form,
      signPic: imageByName(this.data.esignature),
      avatar: imageByName(this.data.avatar)
    }
  }
  // 赋值
  assignment(par, role) {
    const data = {}
    for (const key in par) {
      if (key === 'departmentId') {
        data[key] = typeof role[key] === 'string' ? [role[key]] : Array.isArray(role[key]) ? role[key] : role[key]
      } else if (key === 'roles') {
        data[key] = role.roleIdList && role.roleIdList != null && role.roleIdList.split(',')
      } else {
        data[key] = role[key]
      }
    }
    return data
  }

  /**
   * @description 获取用户信息
   */
  getCopyDeptUserList() {
    let deptId = this.ruleForm.departmentId
    // console.log('部门编码：' + deptId)

    let data = {
      userLevel: 1,
      departmentId: deptId,
      current: 1,
      size: 10000000
    }
    getUserList(data).then((res) => {
      //console.log(res);
      this.copyUsers = res.result.records
    })
  }

  /**
   * @description 获取选中用户的角色，并赋值
   */
  copyRoleChange(roleAry) {
    // console.log('参数：' + roleAry)
    //筛选出角色
    let roleUsers = this.copyUsers.filter((item, index) => {
      return roleAry.includes(item.id)
    })

    let roleIdAry = []
    //获取选中的角色数据
    roleUsers.forEach((userinfo) => {
      let roleIdList = userinfo.roleIdList
      if (!this.strIsNull(roleIdList)) {
        let roleIds = roleIdList.split(',')
        //角色ID
        roleIds.forEach((roleId) => {
          roleIdAry.push(roleId)
        })
      }
    })
    let roleId = Array.from(new Set(roleIdAry))
    this.ruleForm.roles = roleId
  }

  /*
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return typeof strVal == 'undefined' || strVal == null || strVal == ''
  }
}
</script>
<style lang="scss" scoped>
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
</style>
