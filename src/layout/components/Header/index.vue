<template>
  <div class="headerBox">
    <div class="header">
      <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
      <!-- <ThemePicker /> -->
      <div class="title">
        <!-- <img :src="logo" alt="" class="logo" /> -->
        <span class="title_text">{{ sysTitle }}</span>
      </div>
      <div class="sysNav">
        <!-- <i class="el-icon-caret-left" @click="scrollPrev" /> -->
        <!-- <div v-show="$store.state.topNavState==='home'" class="topbar-title"> -->
        <el-menu :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" style="padding: 0 20px">
          <el-menu-item
            v-for="item in menus.navList"
            :key="item.name"
            class="shape-change-outer"
            :index="item.name"
            @click="handleSys(item)"
          >
            <span class="shape-change-inner">{{ item.title }}</span>
          </el-menu-item>
          <el-submenu
            v-if="menus.moreNavList.length > 0"
            :index="'more'"
            class="active-background-remove"
            popper-class="custom-popper-list"
          >
            <template slot="title">
              <span>更多</span>
            </template>
            <el-menu-item
              v-for="item in menus.moreNavList"
              :key="item.name"
              :index="item.name"
              @click="handleSys(item)"
              >{{ item.title }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
        <!-- <i class="el-icon-caret-right" @click="scrollNext" /> -->
      </div>
      <div class="right-menu">
        <div class="btn_box">
          <div v-if="showDashboard" @click="home" title="首页"> 
            <svg-icon icon-class='home' className='sys-icon'></svg-icon>
          </div>
          <div v-if="showSystemSetting" @click="handleSys('sysSetting')" title="系统管理">
            <svg-icon icon-class='setting' className='sys-icon'></svg-icon>
          </div>
          <div @click="notificationDialog = true" title="消息提示" class="bell-info">
            <svg-icon icon-class='msg' className='sys-icon'></svg-icon>
            <span v-show="notificationNum !== 0" class="bell-dot">{{
              notificationNum > 100 ? '99+' : notificationNum
            }}</span>
            <el-dialog v-if="notificationDialog" :visible.sync="notificationDialog" title="消息" append-to-body>
              <notification @close-notification="handleCloseNotification" @reget-noti="handleMarked" />
            </el-dialog>
            <video ref="videoMsg" src="../../../assets/images/home/msg.mp3" style="display: none" />
            <!-- <audio autoplay="autoplay">
              <source src="/i/song.ogg" type="audio/ogg" />
              <source src="/i/song.mp3" type="audio/mpeg" />
            </audio> -->
          </div>
          
          <!-- <i class="el-icon-bell bell-info"  >
            <span v-show="notificationNum !== 0" class="bell-dot">{{
              notificationNum > 100 ? '99+' : notificationNum
            }}</span>
            <el-dialog v-if="notificationDialog" :visible.sync="notificationDialog" title="消息" append-to-body>
              <notification @close-notification="handleCloseNotification" @reget-noti="handleMarked" />
            </el-dialog>
            <video ref="videoMsg" src="../../../assets/images/home/msg.mp3" style="display: none" />

          </i> -->
          <!-- <i  class="el-icon-s-home"  />
          <i  class="el-icon-setting"   /> -->
          <!-- <span class="home" title="首页" @click="home" />
          <i class="el-icon-s-tools" title="系统管理" @click="handleSys('sysSeting')" />
          <i class="el-icon-chat-dot-round" title="消息提示" /> -->
          <el-button v-if="systemSwitchingBtn" type="text" class="switch" />
          <span v-if="systemSettingsBtn" class="interval" />
          <el-button v-if="systemSettingsBtn" type="text" class="theme" />
        </div>
        <el-divider direction="vertical" />
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <div>
              <img :src="avatar || headPortrait" class="user-avatar" />
            </div>
            <span class="username_text">{{ realName }}</span>
            <i class="el-icon-arrow-down" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item v-if="showAccountApply" @click.native="openApply = true">账号申请</el-dropdown-item>
            <el-dropdown-item v-if="showUserInfoEdit" divided @click.native="userEdit = true">
              账号编辑
            </el-dropdown-item>
            <el-dropdown-item :divided="showAccountApply" @click.native="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <scrollView> -->
      <!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper"> -->

      <!-- </scrollView> -->
      <!-- </scroll-pane> -->
      <el-dialog title="修改密码" :visible.sync="passWord" width="400px" append-to-body>
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
        center
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="500px"
      >
        <span>密码修改成功，请退出重新登录。</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmOut">确 定</el-button>
        </span>
      </el-dialog>
      <account-apply v-if="openApply" :show-apply.sync="openApply" />

      <user-info-edit v-if="userEdit" :show-apply.sync="userEdit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { changePassword } from '@/api/base'
import InputItem from '@/components/FormItem/Input/index.vue'
import { verification } from '@/utils/index'
import { geteSessionStorage } from '@/utils/auth'
import headPortrait from '@/assets/login/default.png'
// import ThemePicker from '@/components/ThemePicker'
import logo from '@/assets/images/logo1.png'
import AccountApply from './AccountApply.vue'
import Notification from './Notification.vue'
import { getNotifications, markAsRead } from '@/api/dashboard'
import { notificationInterval } from 'staticPub/config'
import { regPassword } from '@/utils/reg'
import UserInfoEdit from './UserInfoEdit.vue'
import { gisNames } from '@/utils/constant'

const sha1Hex = require('sha1-hex')
@Component({
  name: 'Headerdd',
  components: {
    AccountApply,
    InputItem,
    Notification,
    UserInfoEdit
  }
})
export default class Header extends Vue {
  name = 'Headerdd'
  ispersonalCenter = false
  passWord = false
  originalPassword = ''
  newPassword = ''
  confirmPassword = ''
  headPortrait = headPortrait
  dialogPassword = false
  logo = logo
  navOffset = 0
  openApply = false
  notificationDialog = false
  notificationNum = 0
  timer = null
  specialIndex = ''
  userEdit = false
  get sidebar() {
    return this.$store.getters.sidebar
  }
  get defaultActiveIndex() {
    if (this.specialIndex) return this.specialIndex
    const name = this.$route.name
    const source = this.$store.state.routeSetting.dynamicRoutes
    let result = ''
    const allKeys = Object.keys(source)
    for (const key of allKeys) {
      for (const el of source[key]) {
        if (el.name === name) {
          result = key
          return result
        } else {
          if (el.children) {
            for (const item of el.children) {
              if (item.name === name) {
                result = key
                return result
              }
            }
          }
        }
      }
    }
  }
  set defaultActiveIndex(name: string) {
    if (['map', ...gisNames].indexOf(name) > -1) this.specialIndex = name
    else this.specialIndex = ''
  }
  get avatar() {
    return this.$store.state.user.avatar || geteSessionStorage('avatar')
  }
  get systemSettingsBtn() {
    return this.$store.state.settings.systemSettingsBtn
  }
  get systemSwitchingBtn() {
    return this.$store.state.settings.systemSwitchingBtn
  }
  get realName() {
    return this.$store.state.user.realName || geteSessionStorage('realName')
  }
  get sysTitle() {
    return this.$store.state.settings.sysTitle
  }
  get menus() {
    const menuArr = this.$store.state.routeSetting.menus
    const result = {
      navList: [],
      moreNavList: []
    }
    for (let index = 0; index < menuArr.length; index++) {
      if (menuArr[index].name !== 'sysSetting' && menuArr[index].name !== 'dashboard') {
        if (index >= 7) result.moreNavList.push(menuArr[index])
        else result.navList.push(menuArr[index])
      }
    }
    return result
  }
  get showSystemSetting() {
    return this.$store.state.routeSetting.menus.some((item) => item.name === 'sysSetting')
  }
  get showDashboard() {
    return this.$store.state.routeSetting.menus.some((item) => item.name === 'dashboard')
  }
  get showAccountApply() {
    return (
      (this.$store.state.routeSetting.dynamicRoutes.sysSetting &&
        this.$store.state.routeSetting.dynamicRoutes.sysSetting.some((item) =>
          item.children.some((child) => child.name === 'accountApply')
        )) ||
      false
    )
  }
  get showUserInfoEdit() {
    return (
      (this.$store.state.routeSetting.dynamicRoutes.sysSetting &&
        this.$store.state.routeSetting.dynamicRoutes.sysSetting.some((item) =>
          item.children.some((child) => child.name === 'userinfoEdit')
        )) ||
      false
    )
  }
  mounted() {
    this.getNotificationNum()
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.getNotificationNum()
      }, 0)
    }, notificationInterval)
  }
  destroyed() {
    window.clearInterval(this.timer)
  }
  handleRemove(file, fileList) {
    console.log(file, fileList)
  }
  handlePreview(file) {
    console.log(file)
  }
  handleExceed(files, fileList) {
    this.$message.warning(
      `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
  }
  beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }
  // 打开或关闭左侧菜单
  toggleSideBar() {
    this.$store.dispatch('app/toggleSideBar')
  }
  // 退出登录
  async logout() {
    await this.$store.dispatch('user/logout')
    this.$router.push('/login')
  }
  // 个人中心
  personalCenter() {
    console.log('个人中心')
    this.ispersonalCenter = true
  }
  // 修改密码
  changePassword() {
    console.log('修改密码')
    this.passWord = true
    this.originalPassword = ''
    this.newPassword = ''
    this.confirmPassword = ''
  }
  /**
   * 输入框组件数据绑定方法事件
   * @param {*} key
   * @param {*} event
   */
  onInput(key, event) {
    this[key] = event
  }
  // 确定修改密码
  confirmModifyPassWord() {
    const verificationPwd = verification([
      { condition: !this.originalPassword, errmsg: '请输入原密码' },
      { condition: !this.newPassword, errmsg: '请输入新密码' },
      {
        condition: !regPassword().test(this.newPassword),
        errmsg: '密码包含大小写字母和数字，不可有非法字符！'
      },
      {
        condition: this.confirmPassword !== this.newPassword,
        errmsg: '两次密码输入不相同！'
      },
      {
        condition: this.originalPassword === this.newPassword,
        errmsg: '新密码和原始密码一样'
      }
    ])
    if (!verificationPwd.success) {
      this.$message.error(verificationPwd.errmsg[0])
      return false
    }
    changePassword({
      id: this.$store.state.user.userId,
      originalPassword: sha1Hex(this.originalPassword),
      password: sha1Hex(this.newPassword),
      firstlog: 1
    }).then((res) => {
      if (res.code !== -1) {
        this.passWord = false
        this.dialogPassword = true
      }
    })
  }
  confirmOut() {
    this.logout()
  }
  home() {
    // console.log('3333')
    const sideBarShow = this.$store.state.app.sidebar.show
    if (sideBarShow) this.$store.dispatch('app/toggleSideBarShow', false)
    this.$router.push('/dashboard')
    this.defaultActiveIndex = ''
  }
  handleSys(event) {
    if (event === 'sysSetting') event = this.$store.state.routeSetting.menus.find((item) => item.name === 'sysSetting')
    this.defaultActiveIndex = event.name
    if (event.path !== undefined && event.path !== '') this.$router.push({ path: event.path })
    else if (['map', ...gisNames].indexOf(event.name) > -1) this.$router.push('/map')

    const sideBarShow = this.$store.state.app.sidebar.show
    if (!sideBarShow) this.$store.dispatch('app/toggleSideBarShow', true)
    this.$store.dispatch('routeSetting/changeSys', event.name || event)
    this.$store.commit('map/RESET_ALL')
    //
    this.$store.state.gis.activeHeaderItem = this.defaultActiveIndex

    //大屏跳转
    if (event.name == 'bigScreen') this.$router.push('/bigScreen')
  }
  // scrollPrev() {
  //   this.$refs.navScroll.$el.scrollLeft = 0;
  // }
  // scrollNext() {
  //   this.$refs.navScroll.$el.scrollLeft = 550;
  // }
  // 轮询消息推送
  getNotificationNum() {
    getNotifications({ flag: '0' }).then((res) => {
      this.notificationNum = res.result.total

      // 判断消息条数，播放消息语音
      if (this.notificationNum > 0) {
        this.speckVideo()
      }
    })
  }
  // 消息界面跳转到对应处理的位置后 关闭弹窗
  handleCloseNotification() {
    this.notificationDialog = false
  }
  // 消息界面标记已读后 刷新条数
  handleMarked() {
    this.getNotificationNum()
  }

  /**
   * @description 消息播放
   */
  speckVideo() {
    this.$nextTick(() => {
      const _videoMsg = this.$refs.videoMsg as HTMLVideoElement
      _videoMsg.play()
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/basemapicon.scss";
/deep/.el-menu--horizontal > .el-menu-item,
.el-menu--horizontal > .el-submenu {
  float: none !important;
  display: inline-block !important;
}
.header {
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  // background: #304156;
  background: url('../../../assets/images/title.png') no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  /deep/.el-menu-item {
    color: #fff;
    opacity: 0.8;
    border: none;
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    &:focus {
      outline: none;
    }

    .avatar-container {
      cursor: pointer;
      .avatar-wrapper {
        position: relative;
        color: #fff;
        display: flex;
        align-items: center;
        > div {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 6px;
          background: #fff;
          border-radius: 50%;
          .user-avatar {
            width: 30px;
            height: 30px;
          }
        }

        // .user-avatar {
        //   cursor: pointer;
        //   display: inline-block;
        //   padding-right: 4px;
        // }
        .username_text {
          display: inline-block;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 1em;
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
    .btn_box {
      float: left;
      display: flex;
      align-items: center;
      > div {
        cursor: pointer;
        &:nth-of-type(2) {
          padding: 0 15px;
        }
      }
      .bell-info {
        position: relative;
        .bell-dot {
          width: 24px;
          height: 24px;
          color: #ffffff;
          background: red;
          border-radius: 50%;
          position: absolute;
          top: 9px;
          right: -13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bolder;
          overflow: hidden;
          transform: scale(0.8);
        }
      }
      // margin-right: 20px;
      // i {
      //   color: #fff;
      //   font-size: 28px;
      //   margin-left: 10px;
      //   cursor: pointer;
      // }
      // button {
      //   width: 28px;
      //   height: 28px;
      //   margin-right: 10px;
      // }
      .home {
        cursor: pointer;
        display: inline-block;
        width: 28px;
        height: 28px;
        background: url('../../../assets/images/home.png') 100% 100% no-repeat;
      }
      .switch {
        width: 32px;
        background: url('../../../assets/images/switch.png') 100% 100% no-repeat;
      }
      .theme {
        background: url('../../../assets/images/theme.png') 100% 100% no-repeat;
      }
      .interval {
        display: inline-block;
        width: 1px;
        height: 27px;
        background-color: #ffffff;
        border-radius: 1px;
        opacity: 0.3;
        position: relative;
        top: 12px;
        margin: 0 20px 0 10px;
      }
    }
  }
  .sysNav {
    margin-left: 10px;
    height: 100%;
    width: 57%;
    .shape-change-outer {
      transform: skew(-10deg);
      .shape-change-inner {
        display: block;
        transform: skew(10deg);
      }
    }
    .el-menu.el-menu--horizontal {
      border-bottom: solid 0px;
      .el-menu-item {
        height: 64px;
        line-height: 64px;
        background: transparent;
        font-size: 16px;
        &:hover {
          color: #fff;
          background: linear-gradient(#19489d, #429dd2) !important;
        }
      }
      .is-active {
        background-image: linear-gradient(#19489d, #429dd2);
        border-bottom: none;
        color: #fff;
        opacity: 1;
      }
      .active-background-remove {
        background: transparent;
      }
    }
    .el-submenu {
      border-bottom: none;
      height: 64px;
      line-height: 64px;
      /deep/ .el-submenu__title {
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        border-bottom: none;
        color: #fff;
        opacity: 0.8;
        background: transparent;
        > span {
          display: inline-block;
          height: 64px;
          line-height: 64px;
        }
        > i {
          color: #fff;
        }
      }
      &:hover {
        /deep/ .el-submenu__title {
          background: transparent;
        }
      }
    }
    .el-menu-demo {
      display: flex;
      align-items: center;
      width: 90%;
      float: left;
      white-space: nowrap;
      height: 64px;
      overflow: hidden;
      background: transparent;
    }
    i {
      cursor: pointer;
      float: left;
      color: #fff;
      font-size: 20px;
      margin-top: 22px;
    }
    &:after {
      width: 0;
      height: 0;
      content: '';
      display: block;
      clear: both;
    }
  }
  .title {
    .logo {
      width: 34px;
      height: 31px;
      border-radius: 8px;
      margin-right: 10px;
      position: relative;
      top: 4px;
    }
    .title_text {
      color: #fff;
      font-size: $size24;
      // font-family: FZZCHJW--GB1-0;
      font-weight: bold;
      letter-spacing: 0;
    }
  }
}
</style>
<style lang="scss">
.custom-popper-list {
  ul {
    min-width: 120px;
    > li {
      color: #333333;
      text-align: center;
      font-size: 14px;
      &.is-active {
        color: #2d74e7 !important;
      }
      &:hover {
        color: #2d74e7 !important;
      }
    }
  }
}
</style>
