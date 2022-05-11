<template>
  <blocks title="用户信息">
    <div class="userinfo-container" ref="userinfoHeight">
      <div class="userDoc">
        <el-row>
          <span class="title">用户姓名：</span><span>{{ userinfo.realName | null2empty }}</span>
        </el-row>
        <el-row>
          <span class="title">所属部门：</span><span>{{ userinfo.departmentName | null2empty }}</span>
        </el-row>
        <!-- <el-row>
        <span class="title">联系电话：</span><span>{{ userinfo.phone }}</span>
      </el-row>
      <el-row>
        <span class="title">邮箱：</span><span>{{ userinfo.email }}</span>
      </el-row> -->
        <el-row>
          <span class="title">工作岗位：</span><span>{{ userinfo.job | null2empty }}</span>
        </el-row>
        <el-row>
          <span class="title">工作职责：</span
          ><span v-html="userinfo.note === 'null' ? '' : userinfo.note || ''"></span>
        </el-row>
      </div>
      <div class="userAvatar">
        <!-- <div :style="{width:'100%',height:'100%',backgroundSize:'cover',backgroundRepeat: 'no-repeat','background-image': 'url('+userinfo.avatar+')'}"></div> -->
        <img :src="avatar" width="100%" height="100%" v-if="avatar !== ''" />
        <img
          src="../../../../../assets/images/home/defultAvatar.png"
          width="100%"
          height="100%"
          v-if="userinfo.avatar == ''"
        />
      </div>

      <!-- <el-row>
      <el-col :span="6" :offset="4" class="base-info">
        <el-row>
          <div :height="imageheight">
            <img :src="userinfo.avatar" v-if="userinfo.avatar !== null">
          </div>
        </el-row>
      </el-col>
      <el-col :span="14" class="base-info">
        <el-row>
          <span class="title">用户姓名：</span><span>{{ userinfo.realName }}</span>
        </el-row>
        <el-row>
          <span class="title">所属部门：</span><span>{{ userinfo.departmentName }}</span>
        </el-row>
        <el-row>
          <span class="title">联系电话：</span><span>{{ userinfo.phone }}</span>
        </el-row>
        <el-row>
          <span class="title">邮箱：</span><span>{{ userinfo.email }}</span>
        </el-row>
        <el-row>
          <span class="title">工作职责：</span><span>{{ userinfo.note }}</span>
        </el-row>
      </el-col>
    </el-row> -->
    </div>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import { getInfo } from '@/api/dashboard'
import { imageByName } from '@/api/ftp'

export default {
  components: { Blocks },
  data() {
    return {
      userinfo: {
        realName: '',
        departmentName: '',
        phone: '',
        email: '',
        avatar: '',
        job: '', //工作岗位
        note: '' //工作职责
      }
    }
  },
  watch: {},
  destroyed() {},
  filters: {
    null2empty: (val) => (val === 'null' ? '' : val || '')
  },
  computed: {
    avatar() {
      return this.$store.getters.avatar
    }
  },
  methods: {
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      var that = this
      getInfo({}).then((res) => {
        console.log(res)
        if (res.code !== -1) {
          let result = res.result

          that.userinfo.realName = result.realName
          that.userinfo.departmentName = result.departmentName
          that.userinfo.phone = result.phone
          that.userinfo.email = result.email
          // that.userinfo.avatar = result.avatar
          that.userinfo.job = result.job
          if (!that.strIsNull(result.note)) {
            that.userinfo.note = result.note
              .replace(/\r\n/g, '<br/>')
              .replace(/\n/g, '<br/>')
              .replace(/\s/g, ' ')
          }

          //获取图片
          if (!that.strIsNull(result.avatar)) {
            that.getUserAvatar(result.avatar)
          }
        } else {
          that.$message.error(res.$message)
        }
      })
    },

    /**
     * @description 获取用户图片
     */
    getUserAvatar(avatar) {
      this.userinfo.avatar = imageByName(avatar)
      // imageByName(avatar).then((res) => {
      //   this.userinfo.avatar = null
      //   if (res.status === 200) {
      //     this.userinfo.avatar = res.config.url
      //   }
      // })
    },

    // 打开表格弹窗
    handleDialogShow(data) {
      console.log('参数：' + data)
    },

    /**
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal == 'undefined' || strVal == null || strVal == ''
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.userinfo-container {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  width: 100%;
  height: 100%;
  // border:1px red solid;
  // position: static;

  .userAvatar {
    // display: block;
    // border:1px red solid;
    // height: 100%;
    // width: 28%;

    // height: 50%;
    width: 30%;
    border-radius: 6px;
    // text-align: right;
    // clear: both;
    // overflow: hidden;
    //  transform:translate(-50%,-50%);

    img {
      display: inline;
      float: right;
      // border: 1px red solid;
      max-height: 260px;
      max-width: 200px;
    }
  }

  .userDoc {
    // border:1px red solid;
    height: 100%;
    padding: 10px;
    width: 70%;

    .el-row {
      display: flex;
      margin-bottom: 10px;
      // border: 1px red solid;
      overflow: hidden;
      .title {
        width: 100px;
        text-align: right;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        // border:1px red solid;
      }

      .title + span {
        display: inline-block;
        width: 100%;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
