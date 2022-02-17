<template>
  <div class="login-container">
    <div class="company-name">
      <img src="./images/logo.png" />
    </div>
    <div class="fill-container">
      <div class="left">
        <img src="./images/pipe.png" />
      </div>
      <div class="right">
        <div class="top">
          <span>欢迎登录</span>
          <span>智慧水务综合管理平台</span>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form middle"
          auto-complete="on"
          label-position="left"
        >
          <el-input
            ref="username"
            v-model="loginForm.username"
            suffix-icon="el-icon-user"
            placeholder="请输入账号"
            name="username"
            type="text"
            class="form-input"
            tabindex="1"
            auto-complete="on"
          />
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            class="form-input"
            auto-complete="on"
            suffix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin"
          />
        </el-form>
        <el-button
          class="login-btn"
          :loading="loading"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </div>
    </div>
    <el-dialog
      title="密码修改"
      :visible.sync="passwordDialog"
      append-to-body
      width="520px"
      top="25vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        ref="changePwdForm"
        :model="changePwd"
        :rules="pwdRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="密码：" prop="pass" style="margin-bottom: 25px">
          <el-input
            v-model="changePwd.pass"
            autocomplete="off"
            type="password"
            placeholder="请输入密码"
            suffix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input
            v-model="changePwd.checkPass"
            autocomplete="off"
            type="password"
            placeholder="请输入密码"
            suffix-icon="el-icon-lock"
          />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="handleDialogBtnClick('cancel')">取消</el-button>
        <el-button type="primary" @click="handleDialogBtnClick('confirm')"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import { userFirstLogin } from "@/api/user";
import { changePassword } from "@/api/base";
import { regPassword } from "@/utils/reg";
import { ElForm } from "element-ui/types/form";
const sha1Hex = require("sha1-hex");
@Component
export default class Login extends Vue {
  name = "Login";
  url = "@/assets/images/login/logo.png";
  loginForm = {
    username: "",
    password: "",
  };
  loginRules = {
    username: [{ required: true, trigger: "blur", message: "请输入账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  };
  loading = false;
  passwordType = "password";
  redirect = undefined;
  error = 1;
  // warning: true,
  msg = "";
  passwordDialog = false; // 重置密码用弹窗显隐控制
  changePwd = {
    pass: "", // 重置密码用新密码
    checkPass: "", // 重置密码用确认密码
  };
  pwdRules = {};
  userId = "";
  get sysTitle() {
    return this.$store.state.settings.sysTitle;
  }
  mounted() {
    this.pwdRules = {
      pass: [
        { required: true, validator: this.validatePwd1st, trigger: "blur" },
      ],
      checkPass: [
        { required: true, validator: this.validatePwd2nd, trigger: "blur" },
      ],
    };
  }
  validatePwd1st(rule, value, callback) {
    if (value === "") {
      callback(new Error("请输入密码！"));
    } else {
      if (this.changePwd.pass !== "") {
        if (!regPassword().test(value)) {
          callback(
            new Error(
              "密码位数8-16位，必须包含大小写字母和数字，不可包含非法字符！"
            )
          );
          return;
        }
      }
      callback();
    }
  }
  validatePwd2nd(rule, value, callback) {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.changePwd.pass && value !== "") {
      callback(new Error("两次输入密码不一致！"));
    } else {
      callback();
    }
  }
  @Watch("$route", { immediate: true })
  changeValue(route, oldvalue) {
    this.redirect = route.query && route.query.redirect;
  }
  // 是否显示密码
  showPwd() {
    if (this.passwordType === "password") {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
    this.$nextTick(() => {
      (this.$refs.password as HTMLElement).focus();
    });
  }
  // 登录
  handleLogin() {
    (this.$refs.loginForm as ElForm).validate((valid) => {
      // console.log('111222', this.loginForm)
      if (valid) {
        this.loading = true;
        this.$store
          .dispatch("user/login", this.loginForm)
          .then((res) => {
            const { id } = res.result;
            // 判断是否首次登录或者重置过密码
            userFirstLogin(id)
              .then((res) => {
                // 先判断用户是否被禁用了 如果是申请的用户 还需要要判断是否同意申请了
                const { auditstatus, enableFlag } = res.result;
                if (enableFlag === "0") {
                  this.$message({
                    message: "用户已被禁用，请先启用！",
                    type: "error",
                  });
                  this.loading = false;
                  sessionStorage.clear();
                  return;
                }
                if (auditstatus !== "2" && auditstatus !== null) {
                  this.$message({
                    message:
                      auditstatus === 1
                        ? "账户还未审核通过！"
                        : "账户审核未被通过！",
                    type: "error",
                  });
                  this.loading = false;
                  sessionStorage.clear();
                  return;
                }
                // 是首次登录 打开弹窗 修改密码
                if (res.result.firstlog === "1") {
                  this.userId = id;
                  this.passwordDialog = true;
                  // 清除掉用户id 防止用户没有修改密码刷新进入页面
                  sessionStorage.removeItem("userId");
                  this.$store.state.user.userId = undefined;
                } else {
                  this.loading = false;
                  this.$router.push({ path: "/" });
                }
              })
              .catch(() => {
                sessionStorage.clear();
                this.loading = false;
              });
            // this.$router.push({ path: '/' })
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        console.log("error submit!!");
        return false;
      }
      // this.$router.push('/dashboard')
    });
  }
  // 修改密码弹窗
  handleDialogBtnClick(type) {
    if (type === "cancel") {
      this.$nextTick(() => {
        (this.$refs.changePwdForm as ElForm).resetFields();
      });
      this.passwordDialog = false;
      this.changePwd.pass = "";
      this.changePwd.checkPass = "";
      sessionStorage.clear();
      this.loading = false;
    } else {
      (this.$refs.changePwdForm as ElForm).validate((valid) => {
        if (valid) {
          const originalPassword = "000000";
          const data = {
            originalPassword: sha1Hex(originalPassword),
            id: this.userId,
            firstlog: 0,
            password: sha1Hex(this.changePwd.checkPass),
          };
          changePassword(data).then((res) => {
            if (res.code !== -1) {
              this.$message({
                message: "密码修改成功，请您重新登录！",
                type: "success",
              });
              this.passwordDialog = false;
              this.loading = false;
              this.changePwd.pass = "";
              this.changePwd.checkPass = "";
              sessionStorage.clear();
            } else {
              this.$nextTick(() => {
                (this.$refs.changePwdForm as ElForm).resetFields();
              });
              this.passwordDialog = false;
              this.loading = false;
              this.changePwd.pass = "";
              this.changePwd.checkPass = "";
              sessionStorage.clear();

              this.$message({
                message: res.message,
                type: "error",
              });
            }
          });
        } else return false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./images/background.png") no-repeat fixed center/100%;
  img {
    user-select: none;
    height: 100%;
  }
  .fill-container {
    width: 1000px;
    height: 580px;
    display: flex;
    border-radius: 10px;
    background-color: #ffffff;
    .left {
      flex: 1;
      overflow: hidden;
    }
    .right {
      width: 546px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 114px;
      .top {
        height: 76px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #333333;
        margin-bottom: 70px;
        > span {
          line-height: 30px;
          &:nth-of-type(2) {
            margin-top: 16px;
          }
        }
      }
      .middle {
        width: 320px;
        height: 106px;
        margin-bottom: 80px;
        > .form-input {
          height: 36px;
          line-height: 36px;
          /deep/ input {
            height: 36px;
          }
          &:nth-of-type(2) {
            margin-top: 34px;
          }
        }
      }
      .login-btn {
        width: 320px;
        height: 44px;
        border-radius: 4px;
        overflow: hidden;
        font-size: 16px;
        background: #2d74e7;
        transition: background 0.3s linear;
        color: #ffffff;
        &:hover {
          background: #2467d3;
        }
      }
    }
  }
}
</style>
