<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px" class="demo-ruleForm">
    <el-row type="flex" justify="space-around">
      <el-col :span="12">
        <el-form-item label="登陆名" prop="username">
          <el-input v-model="ruleForm.username" size="small" placeholder="请输入登陆名" :disabled="difference" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" size="small" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName">
          <el-input v-model="ruleForm.realName" size="small" placeholder="请输入客户名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="ruleForm.phone" size="small" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="ruleForm.email" size="small" placeholder="请输入email" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="ruleForm.departmentId" size="small" placeholder="请选择部门">
            <el-option v-for="item in company" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色绑定" prop="roles">
          <el-select v-model="ruleForm.roles" multiple size="small" placeholder="请选择用户管理权限">
            <el-option v-for="item in optionsRole" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="个性签名" label-width="7.5rem">
          <!-- :data="upLoadData" -->
          <el-upload
            class="avatar-uploader"
            action="111"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
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
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon el-upload" />
          </el-upload>
          <div class="msg">⚠️注意：上传图片只能是 JPG或png 格式!单张图片大小不能超过 2MB!</div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'bigPictureHead',
  props: {
    arrData: {
      //数据
      type: Array,
      required: true
    }
  },
  data() {
    return {
      sysName: '科学城综合管理地理信息系统',
      sysTime: '',
      sysDate: '',
      weekday: '',
      interval: null,
      unInterval: null,
      valMonth: ''
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {})
  },
  mounted() {
    this.getTime()
    if (this.interval == null) {
      this.interval = setInterval(() => {
        this.getTime()
      }, 1000)
    }
  },
  methods: {
    loginSys() {
      this.$router.push('/dashboard')
    },
    getTime() {
      var myDate = new Date()
      let yy = myDate.getFullYear()
      let mm = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      let dd = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      let hh = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
      let mi = myDate.getUTCMinutes() < 10 ? '0' + myDate.getUTCMinutes() : myDate.getUTCMinutes()
      let ss = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
      let d = myDate.getDay()
      let arrWeekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      this.sysTime = hh + ':' + mi + ':' + ss
      this.sysDate = yy + '-' + mm + '-' + dd
      this.weekday = arrWeekday[d]
    }
  }
}
</script>
<style lang="scss" scoped>
.handerContainer {
  height: 100%;
  width: 100%;
  color: #fff;
  margin: 0px !important;
  padding: 0px !important;
  background-image: url('../../../../public/images/bigPicture/导航样式.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .titleContent {
    width: 100%;
    height: 100%;
    position: absolute;
    line-height: 66px;
    font-size: 30px;
    text-align: center;
    color: #fff;
  }

  .dataContent {
    position: absolute;
    color: #fff;
    height: 40px;
    line-height: 40px;
    width: 260px;
    top: 20px;
    left: 20px;

    .sysTime-span {
      font-size: 26px;
    }
  }

  .weatherContent {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 160px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
