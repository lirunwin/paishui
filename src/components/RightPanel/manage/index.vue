<template>
  <div class="hotline" style="margin-top: 20px">
    <!-- 供水服务热线 -->
    <!-- <h3>服务热线</h3> -->
    <!-- <el-row>
      <el-col :span="24">
        <el-tabs tab-position="right" style="height: 100%;">
          <el-tab-pane label="呼入">呼入</el-tab-pane>
          <el-tab-pane label="呼出">呼出</el-tab-pane>
          <el-tab-pane label="通话记录">通话记录</el-tab-pane>
          <el-tab-pane label="转接">转接</el-tab-pane>
          <el-tab-pane label="监听">转接</el-tab-pane>
          <el-tab-pane label="我的工作">转接</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>-->
    <el-row class="top_box">
      <el-col :span="18">
        <el-input
          v-model="telephone"
          size="small"
          placeholder="请输入电话号码"
        />
      </el-col>
      <el-col :offset="2" :span="4">
        <el-button
          style="width: 100%"
          type="primary"
          size="small"
          icon="el-icon-caret-left"
        />
      </el-col>
    </el-row>
    <el-row
      style="padding: 10px 20px; width: 100%"
      type="flex"
      justify="space-between"
    >
      <el-col :span="8">
        <el-button
          type="text"
          icon="el-icon-notebook-1"
          @click="mailList"
        >通讯目录</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          type="text"
          icon="el-icon-odometer"
          @click="early"
        >流量预警</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          type="text"
          icon="el-icon-phone-outline"
          @click="callT"
        >来电弹屏</el-button>
      </el-col>
    </el-row>
    <div class="payinfo">
      <el-row class="keyboard">
        <el-col
          v-for="(v, i) in keyboard"
          :key="i"
          :span="8"
          @click="inputValue(v)"
        >{{ v }}</el-col>
      </el-row>
      <el-row style="padding: 10px 20px">
        <el-col :span="8">
          <el-button
            v-if="!disCall"
            type="primary"
            size="small"
            @click="call"
          >呼叫</el-button>
          <el-button
            v-if="disCall"
            type="primary"
            size="small"
            @click="cancelCall"
          >取消呼叫</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            size="small"
            @click="hangUp"
          >挂机</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            v-if="!disBusy"
            type="primary"
            size="small"
            @click="busy"
          >置忙</el-button>
          <el-button
            v-if="disBusy"
            type="primary"
            size="small"
            @click="free"
          >置闲</el-button>
        </el-col>
      </el-row>
      <el-row style="padding: 10px 20px">
        <el-col :span="8">
          <el-button
            v-if="!disTrans"
            type="primary"
            size="small"
            @click="trans"
          >转移</el-button>
          <el-button
            v-if="disTrans"
            type="primary"
            size="small"
            @click="transCancel"
          >取消转移</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            v-if="!disRest"
            type="primary"
            size="small"
            @click="rest"
          >小休</el-button>
          <el-button
            v-if="disRest"
            type="primary"
            size="small"
            @click="cancelRest"
          >取消小休</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            v-if="!disKeep"
            type="primary"
            size="small"
            @click="keep"
          >保持</el-button>
          <el-button
            v-if="disKeep"
            type="primary"
            size="small"
            @click="restore"
          >恢复</el-button>
        </el-col>
      </el-row>
      <el-row style="padding: 10px 20px">
        <el-col :span="8">
          <el-button
            v-if="!disSilence"
            type="primary"
            size="small"
            @click="silence"
          >静音</el-button>
          <el-button
            v-if="disSilence"
            type="primary"
            size="small"
            @click="restoreT"
          >取消静音</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            size="small"
            @click="logout"
          >注销</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="通讯录"
        :visible.sync="dialogMailList"
        width="500px"
        append-to-body
      >
        <mailList ref="mail" @remind="remind" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMailList = false">取 消</el-button>
          <el-button type="primary" @click="okMailList">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="流量预警"
        :visible.sync="dialogEarly"
        width="500px"
        append-to-body
      >
        <h3 style="color: red">是否提交流量预警</h3>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEarly = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogEarly = false"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        title="来电弹屏"
        :visible.sync="dialogCall"
        width="900px"
        append-to-body
        top="1vh"
      >
        <screenPopUp
          v-if="dialogCall"
          ref="screenPopUp"
          v-dialogDrag
          :data="editData"
          @remind="remind"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCall = false">取 消</el-button>
          <el-button type="primary" @click="register">工单受理</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import '../../../../public/Voice/qwebchannel'
import '../../../../public/Voice/qyagent-3.0.0'
import '../../../../public/Voice/qyproxy-3.0.0'
import '../../../../public/Voice/reconnecting-websocket'
import screenPopUp from './screenPopUp'
import { parseTime } from '@/utils/index'
import mailList from '@/components/mailList/index'
// let html = require('../../../../public/manage/')

export default {
  name: 'WaterHotline',
  components: { screenPopUp, mailList },
  data() {
    return {
      keyboard: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'],
      telephone: '',
      none: false,
      LoginParam: {
        ip: '192.168.2.242', // ip地址
        port: '7005', // 端口
        ExtPhone: '10001001', // 分机号
        Password: '11111111', // 密码
        cid: '1000', // 企业ID
        CidName: '同飞', // 企业名称
        HotlineNumberList: '87348740', // 热线号码列表， 以$分割
        Code: '1001', // 工号
        CodeName: '1001', // 姓名
        bLoginBusy: '0', // 登录后是否置忙 (默认0 – 登录后置闲 1 – 登录后置忙)
        Reserved: '', // 保留字段
        gid: '61,坐席,5,0', // 组信息格式串 “组id,组名称,分配策略,序列号$…”
        TerminalType: '2' // 终端类型(0 – 内线坐席 1 – 外线坐席 2 – voip电话 3 – voip pc)
      },
      label_agentstate: '空闲', // 坐席状态/
      label_otherinfo: '', // 提示信息
      queueLength: 0, // 排队人数
      btnstate: {
        btn_logout: false,
        btn_ClientAnswer: false,
        btn_ClientAnswerRefuse: false,
        btn_SetBusy: false,
        btn_SetRest: false,
        btn_SetFree: false,
        btn_Hangup: false,
        btn_Keep: false,
        btn_Silence: false,
        btn_Restore: false
      },
      dialogMailList: false,
      dialogEarly: false,
      dialogCall: false,
      callType: 1,
      editData: {},
      disCall: false,
      disBusy: false,
      disTrans: false,
      disRest: false,
      disKeep: false,
      disSilence: false,
      date: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  mounted() {
    this.event()

    this.initHotline()
    const _this = this
    setInterval(() => {
      _this.date = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    }, 1000)
  },
  methods: {
    inputValue(v) {
      console.log(v)
    },
    // 注册事件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    event() {
      console.log('322222', $)
      // var g_bTestAuto = false;        //是否自动测试
      //       var g_bLoginBusy = false; 		//是否登录置忙
      //       var g_Interval_TestAuto;        //自动测试的延时操作的定时器

      //       var g_interval_test_crash;

      //
      $.QYProxy.on('On_Mo_S_GetPageHead_R', 'On_Mo_S_GetPageHead_R')
      $.QYProxy.on('On_ErrorJsonMsg', this.On_ErrorJsonMsg)
      $.QYProxy.on('On_ServerNetInfo', this.On_ServerNetInfo)

      $.QYProxy.on('On_AbnormalReadyState', this.On_AbnormalReadyState)
      $.QYProxy.on('On_DoLogin_R', this.On_DoLogin_R)
      $.QYProxy.on('On_S_LoginOut_R', this.On_S_LoginOut_R)
      $.QYProxy.on('On_S_AgentState', this.On_S_AgentState)
      $.QYProxy.on('On_S_SetBusy_R', 'On_S_SetBusy_R')
      $.QYProxy.on('On_S_SetFree_R', 'On_S_SetFree_R')
      $.QYProxy.on('On_S_Rest_R', 'On_S_Rest_R')
      $.QYProxy.on('On_S_SetFree', 'On_S_SetFree')
      $.QYProxy.on('On_S_Snatch_R', 'On_S_Snatch_R')
      $.QYProxy.on('On_S_Keep_R', 'On_S_Keep_R')
      $.QYProxy.on('On_S_Restore_R', 'On_S_Restore_R')
      $.QYProxy.on('On_S_StartRing', 'On_S_StartRing')
      $.QYProxy.on('On_S_StopRing', 'On_S_StopRing')

      $.QYProxy.on('On_S_ClientAnswer_R', 'On_S_ClientAnswer_R')
      $.QYProxy.on('On_S_Hangup', 'On_S_Hangup')
      $.QYProxy.on('On_S_Transing', 'On_S_Transing')
      $.QYProxy.on('On_S_Trans_R', 'On_S_Trans_R')
      $.QYProxy.on('On_S_TransCancel_R', 'On_S_TransCancel_R')
      $.QYProxy.on('On_S_MakeCallingOut', 'On_S_MakeCallingOut')
      $.QYProxy.on('On_S_MakeCallOut_R', 'On_S_MakeCallOut_R')
      $.QYProxy.on('On_S_MakeCallOutCancel_R', 'On_S_MakeCallOutCancel_R')
      $.QYProxy.on('On_S_ConfStart_R', 'On_S_ConfStart_R')
      $.QYProxy.on('On_S_ConfStartCallResult', 'On_S_ConfStartCallResult')
      $.QYProxy.on('On_S_ConfStartCancel_R', 'On_S_ConfStartCancel_R')
      $.QYProxy.on('On_S_ConfConfirm_R', 'On_S_ConfConfirm_R')
      $.QYProxy.on('On_S_ConfExit_R', 'On_S_ConfExit_R')
      $.QYProxy.on('On_S_InManager_R', 'On_S_InManager_R')
      $.QYProxy.on('On_S_OutManager_R', 'On_S_OutManager_R')
      $.QYProxy.on('On_S_Listen_R', 'On_S_Listen_R')
      $.QYProxy.on('On_S_NotifyListen', 'On_S_NotifyListen')
      $.QYProxy.on('On_S_ForceInsert_R', 'On_S_ForceInsert_R')
      $.QYProxy.on('On_S_NotifyForceInsert', 'On_S_NotifyForceInsert')
      $.QYProxy.on('On_S_ExitForceInsert_R', 'On_S_ExitForceInsert_R')
      $.QYProxy.on('On_S_NotifyExitForceInsert', 'On_S_NotifyExitForceInsert')
      $.QYProxy.on('On_S_ExitListen_R', 'On_S_ExitListen_R')
      $.QYProxy.on('On_S_NotifyExitListen', 'On_S_NotifyExitListen')
      $.QYProxy.on('On_S_ForceSetBusy_R', 'On_S_ForceSetBusy_R')
      $.QYProxy.on('On_S_ForceSetFree_R', 'On_S_ForceSetFree_R')
      $.QYProxy.on('On_S_ForceLogout_R', 'On_S_ForceLogout_R')

      $.QYProxy.on('On_S_GetAgentInfo_R', 'On_S_GetAgentInfo_R')
      $.QYProxy.on('On_S_GetChannelQueueSize_R', 'On_S_GetChannelQueueSize_R')
      $.QYProxy.on('On_S_GetChannelQueueInfo_R', 'On_S_GetChannelQueueInfo_R')

      $.QYProxy.on('On_S_CTIMessage', 'On_S_CTIMessage')
      $.QYProxy.on('On_S_GetFreeAgentCount_R', 'On_S_GetFreeAgentCount_R')
      $.QYProxy.on('On_S_ApplyTelLogin_R', 'On_S_ApplyTelLogin_R')
      //            $.QYProxy.on('On_S_GetBusyState_R', 'On_S_GetBusyState_R');

      // 20170227
      $.QYProxy.on('S_GetIPPhonePort_R', 'S_GetIPPhonePort_R')

      // 20171020
      $.QYProxy.on('S_GetPredialInfo_R', 'S_GetPredialInfo_R')

      // 20150424
      $.QYProxy.on('On_S_ChatEvent', 'On_S_ChatEvent')

      $.QYProxy.SetDebug(0)
      $.QYProxy.UpdateCurrentState()
    },
    // 登录消息事件
    On_DoLogin_R(packet) {
      console.log('32232', packet)
      // packet.Result // 结果值
      // packet.SubResult // 二级结果值
      // packet.ErrorInfo // 错误信息

      this.label_otherinfo = packet.ErrorInfo
      // console.log('3333'，packet)
      // 开始接受坐席状态广播
      //                       $.QYProxy.GetChannelQueueInfo(61,0);
      $.QYProxy.GetAgentInfo(2, 0, '')

      // g_interval_test_crash = setInterval(on_timer_test_crash, "10");

      // var debug = 1
    },
    // 坐席状态事件
    On_S_AgentState(packet) {
      console.log('23222', packet)
      // packet.Channel // 通道号
      // packet.Code // 工号
      // packet.State // 坐席状态
      // packet.time // 状态时间点

      this.setAgentState(packet.State) // packet.State);
    },
    // 网络消息事件
    On_ServerNetInfo(state) {
      var s = '成功'
      if (state === 0) {
        s = '失败'
      }
      this.label_otherinfo = '网络连接' + s
    },
    // 网络socket状态异常事件
    On_AbnormalReadyState: function(_readyState) {
      this.label_otherinfo =
        '网络socket异常状态:readyState = ' + parseInt(_readyState)
    },
    // 注销
    On_S_LoginOut_R: function(packet) {
      packet.Channel // 通道号
      packet.Result // 结果值
      packet.pos // 注销方式 0 - 电话注销 1 - pc注销
      packet.State // 坐席状态
      packet._Reason // 原因(不为空串时需要展现出来)

      // var s
      // if (packet._Reason != '') {
      //   alert(packet._Reason)
      // }
    },

    initHotline() {
      // $.QYProxy.on('DoLogin', 'test')
      // window.test = function(packet) {
      //   console.log('21111', packet)
      // }
      $.QYProxy.DoLogin(this.LoginParam)
    },

    mailList() {
      this.dialogMailList = true
    },
    early() {
      this.dialogEarly = true
    },
    okMailList() {
      this.$refs.mail.getSelectData()
      this.dialogMailList = false
    },
    callT() {
      this.dialogCall = true
    },

    // 呼叫   CallerNo:主叫号码   CalledNo:被叫号码
    call() {
      this.disCall = !this.disCall
      const CallerNo = ''
      const CalledNo = ''
      $.QYProxy.MakeCallOut(CallerNo, CalledNo, '', '')
    },

    // 取消呼叫
    cancelCall() {
      this.disCall = !this.disCall
      $.QYProxy.MakeCallOutCancel()
    },

    // 挂机
    hangUp() {
      $.QYProxy.Hangup()
    },

    // 置忙
    busy() {
      this.disBusy = !this.disBusy
      $.QYProxy.SetBusy()
    },

    // 置闲
    free() {
      this.disBusy = !this.disBusy
      $.QYProxy.SetFree()
    },

    // 转移 CallerNo:主叫号码   CalledNo:被叫号码
    trans() {
      this.disTrans = !this.disTrans
      const CallerNo = ''
      const CalledNo = ''
      if (this.callType === 1) {
        // 外线
        $.QYProxy.TransTel(CallerNo, CalledNo, '', '')
      } else if (this.callType === 2) {
        // 内线
        $.QYProxy.TransAgent(0, CalledNo)
      }
    },

    // 取消转移
    transCancel() {
      this.disTrans = !this.disTrans
      $.QYProxy.TransCancel()
    },

    // 小休
    rest() {
      this.disRest = !this.disRest
      $.QYProxy.SetRest()
    },

    // 取消小休
    cancelRest() {
      this.disRest = !this.disRest
      $.QYProxy.cancelRest()
    },

    // 保持
    keep() {
      this.disKeep = !this.disKeep
      $.QYProxy.Keep()
    },

    // 恢复
    restore() {
      this.disKeep = !this.disKeep
      $.QYProxy.Restore()
    },

    // 静音
    silence() {
      this.disSilence = !this.disSilence
      $.QYProxy.Silence()
    },

    // 取消静音
    restoreT() {
      this.disSilence = !this.disSilence
      $.QYProxy.Restore()
    },

    // 注销
    logout() {
      $.QYProxy.Logout()
    },

    // 设置坐席状态
    setAgentState(state) {
      const btnstate = {
        // 按钮状态
        _login: true,
        _logout: false,
        _ClientAnswer: true,
        _ClientAnswerRefuse: true,
        _SetBusy: false,
        _SetRest: false,
        _SetFree: true,
        _Hangup: true,
        _Keep: true,
        _Silence: true,
        _Restore: true
      }

      switch (state) {
        case 0:
          this.label_agentstate = '坐席不可用'
          btnstate._login = false
          break
        case 1:
          this.label_agentstate = '空闲'
          // btnstate._logout = false;
          // btnstate._SetBusy = false;
          break
        case 2:
          this.label_agentstate = '置忙'
          btnstate._loginout = false
          btnstate._SetFree = false
          break
        case 3:
          this.label_agentstate = '抢接'
          btnstate._Hangup = false
          break
        case 4:
          this.label_agentstate = '选出队列'
          break
        case 5:
          this.label_agentstate = '来电振铃'
          btnstate._ClientAnswer = false
          btnstate._ClientAnswerRefuse = false
          break
        case 6:
          this.label_agentstate = '通话中'
          btnstate._Hangup = false
          btnstate._Keep = false
          btnstate._Silence = false
          break
        case 7:
          this.label_agentstate = '转接中'
          btnstate._Hangup = false
          break
        case 8:
          this.label_agentstate = '转接成功待确认'
          btnstate._Hangup = false
          break
        case 9:
          this.label_agentstate = '保持'
          btnstate._Hangup = false
          btnstate._Restore = false
          break
        case 10:
          this.label_agentstate = '会议中'
          btnstate._Hangup = false
          break
        case 11:
          this.label_agentstate = '话后处理'
          btnstate._Hangup = false
          break
        case 12:
          this.label_agentstate = '输入被叫号码状态'
          break
        case 13:
          this.label_agentstate = '发起呼叫'
          btnstate._Hangup = false
          break
        case 14:
          this.label_agentstate = '管理状态'
          break
        case 15:
          this.label_agentstate = '班长监听'
          btnstate._Hangup = false
          break
        case 16:
          this.label_agentstate = '班长强插'
          btnstate._Hangup = false
          break
        case 17:
          this.label_agentstate = '客户端pc登录成功后，等待电话登录'
          // btnstate._logout = false;
          break
        case 18:
          this.label_agentstate = '等待脚本设置成Free'
          btnstate._Hangup = false
          break
        case 19:
          this.label_agentstate = '被监听'
          btnstate._Hangup = false
          break
        case 20:
          this.label_agentstate = '被强插'
          btnstate._Hangup = false
          break
        case 21:
          this.label_agentstate = '三方通话发起邀请'
          btnstate._Hangup = false
          break
        case 22:
          this.label_agentstate = '三方通话确认第三方'
          btnstate._Hangup = false
          break
        case 23:
          this.label_agentstate = '三方通话主持人'
          btnstate._Hangup = false
          break
        case 24:
          this.label_agentstate = '三方通话被确认通话中'
          btnstate._Hangup = false
          break
        case 25:
          this.label_agentstate = '三方通话成员'
          btnstate._Hangup = false
          break
        case 26:
          this.label_agentstate = '电话端登录成功后，等待pc登录'
          break
        case 27:
          this.label_agentstate = '电话坐席正在呼叫第一被叫'
          break
        case 28:
          this.label_agentstate = '会议状态'
          break
        case 29:
          this.label_agentstate = '小休'
          btnstate._loginout = false
          btnstate._SetFree = false
          break
        case 30:
          this.label_agentstate = '静音'
          btnstate._Hangup = false
          btnstate._Restore = false
          break
        case 31:
          this.label_agentstate = '播音'
          btnstate._loginout = false
          btnstate._SetFree = false
          break
        case 32:
          this.label_agentstate = '播音可打断'
          btnstate._loginout = false
          btnstate._SetFree = false
          break
        default:
          this.label_agentstate = state
          break
      }

      this.SetAllBtnState(btnstate)
      // label_otherinfo.innerText = ''
    },
    SetAllBtnState(btnstate) {
      this.btnstate = {
        btn_logout: btnstate._logout,
        btn_ClientAnswer: btnstate._ClientAnswer,
        btn_ClientAnswerRefuse: btnstate._ClientAnswerRefuse,
        btn_SetBusy: btnstate._SetBusy,
        btn_SetRest: btnstate._SetRest,
        btn_SetFree: btnstate._SetFree,
        btn_Hangup: btnstate._Hangup,
        btn_Keep: btnstate._Keep,
        btn_Silence: btnstate._Silence,
        btn_Restore: btnstate._Restore
      }
    },

    register() {
      this.dialogCall = false
    },

    remind(data, jsf) {
      this.telephone = data.phon
    }
  }
}
</script>

<style lang="scss" scoped>
.top_box {
  padding: 0 20px;
}
.keyboard {
  padding: 0px 20px;
  .el-col-8 {
    cursor: pointer;
    height: 60px;
    border: 1px solid #eee;
    text-align: center;
    line-height: 60px;
    font-size: 16px;
  }
}
.hotline {
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>

