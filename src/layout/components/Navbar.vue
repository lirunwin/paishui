<template>
  <div class="navbarBox">
    <div class="navbar">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

      <breadcrumb class="breadcrumb-container" />

      <div class="right-menu">
        <template v-if="device!=='mobile'" class="right-menu-btn">
          <el-button v-if="systemSettingsBtn" type="primary" icon="el-icon-s-tools" class="right-menu-item" circle @click="setConfig" />
          <el-button v-if="systemSwitchingBtn" type="success" icon="el-icon-crop" class="right-menu-item" circle @click="sysSwitch" />
        </template>
        <span class="username">{{ username }}</span>
        <el-dropdown class="avatar-container" trigger="click">

          <div class="avatar-wrapper">
            <img :src="avatar || headPortrait" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <!-- <el-dropdown-item @click.native="personalCenter">
              个人中心
            </el-dropdown-item> -->
            <el-dropdown-item @click.native="changePassword">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      title="个人中心"
      :visible.sync="ispersonalCenter"
      width="300px"
    >
      <div class="content">
        <div class="imgBox">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="imgStyle"> -->
          <el-avatar shape="square" :size="80" :src="avatar || headPortrait" />
        </div>
        <!-- <span>个人中心</span> -->
        <div class="marginTop">姓名： 张三</div>
        <div class="marginTop">电话： 13667892789</div>
        <div class="marginTop">邮箱： 123@qq.com</div>
        <div class="marginTop">所属单位： 成都</div>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="passWord"
      width="400px"
    >
      <!-- <span>修改密码</span> -->
      <input-item
        type="password"
        placeholder="请输入原始密码"
        title="原密码："
        nominate="originalPassword"
        custom-style="width: 320px;line-height:32px;"
        :value="originalPassword"
        :max-length="50"
        :disabled="false"
        :required="true"
        @changeValue="onInput"
      />
      <input-item
        type="password"
        placeholder="请输入新密码"
        title="新密码："
        nominate="newPassword"
        custom-style="width: 320px;line-height:32px; margin: 20px 0"
        :value="newPassword"
        :max-length="50"
        :disabled="false"
        :required="true"
        @changeValue="onInput"
      />
      <input-item
        type="password"
        placeholder="请确认密码"
        title="确认密码："
        nominate="confirmPassword"
        custom-style="width: 320px;line-height:32px;"
        :value="confirmPassword"
        :max-length="50"
        :disabled="false"
        :required="true"
        @changeValue="onInput"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="passWord = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyPassWord">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="退出重新登录"
      :visible.sync="dialogPassword"
      width="500px"
      center
    >
      <span>密码修改成功，请退出重新登录。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPassword = false">取 消</el-button>
        <el-button type="primary" @click="confirmOut">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="系统设置"
      :visible.sync="dialogConfig"
      width="600px"
      custom-class="config"
    >
      <el-divider />
      <Configure />
    </el-dialog>
    <el-dialog
      title="系统切换"
      :visible.sync="dialogSwitch"
      width="500px"
    >
      <span>系统切换</span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword } from '@/api/base'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import InputItem from '@/components/FormItem/Input'
import { verification } from '@/utils/index'
import { geteSessionStorage } from '@/utils/auth'
import headPortrait from '@/assets/login/headPortrait.gif'
import Configure from './Configure/index'

const sha1Hex = require('sha1-hex')

export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    InputItem,
    Configure
  },
  data() {
    return {
      headPortrait,
      ispersonalCenter: false,
      passWord: false,
      originalPassword: '',
      newPassword: '',
      confirmPassword: '',
      dialogPassword: false,
      dialogConfig: false,
      dialogSwitch: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ]),
    avatar() {
      return this.$store.state.user.avatar || geteSessionStorage('avatar')
    },
    username() {
      return geteSessionStorage('username')
    },
    systemSettingsBtn() {
      return this.$store.state.settings.systemSettingsBtn
    },
    systemSwitchingBtn() {
      return this.$store.state.settings.systemSwitchingBtn
    }
  },
  methods: {
    // 打开或关闭左侧菜单
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 个人中心
    personalCenter() {
      console.log('个人中心')
      this.ispersonalCenter = true
    },
    // 修改密码
    changePassword() {
      console.log('修改密码')
      this.passWord = true
      this.originalPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    /**
     * 输入框组件数据绑定方法事件
     * @param {*} key
     * @param {*} event
     */
    onInput(key, event) {
      this[key] = event
    },
    // 确定修改密码
    confirmModifyPassWord() {
      const verificationPwd = verification([
        { condition: !this.originalPassword, errmsg: '请输入原密码' },
        { condition: !this.newPassword, errmsg: '请输入新密码' },
        { condition: this.confirmPassword !== this.newPassword, errmsg: '请确认密码' },
        { condition: this.originalPassword === this.newPassword, errmsg: '新密码和原始密码一样' }
      ]
      )
      if (!verificationPwd.success) {
        this.$message.error(verificationPwd.errmsg[0])
        return false
      }
      changePassword({
        password: sha1Hex(this.newPassword)
      }).then(res => {
        this.passWord = false
        this.dialogPassword = true
      })
    },
    confirmOut() {
      this.logout()
    },
    // 设置
    setConfig() {
      this.dialogConfig = true
    },
    // 切换
    sysSwitch() {
      this.dialogSwitch = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-btn{
      display: flex;
    align-items: center;
    }
    .right-menu-item {
      display: inline-block;
      // padding: 0 8px;
      // height: 100%;
      font-size: 16px;
      // color: #5a5e66;
      vertical-align: text-bottom;
      margin-bottom: 6px;

      &.hover-effect {
        cursor: pointer;
        // transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .username{
      display: inline-block;
      height: 50px;
      line-height: 50px;
      min-width: 50px;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-bottom: 4px
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.marginTop{
  margin-top: 10px;
}
.imgBox{
  width: 100%;
  text-align:center;
  .imgStyle{
    border-radius: 10px;
  }
}
.content{
  width: 80%;
  margin: 0 auto;
}
</style>
<style lang="scss">
.config{
  .el-dialog__body{
    padding: 0 20px 30px;
    .el-tabs--left{
      height: 200px !important;
    }
  }
  .el-divider--horizontal{
    margin: 0 0 10px 0;
  }
}
</style>
