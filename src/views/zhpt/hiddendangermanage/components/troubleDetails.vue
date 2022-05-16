<template>
  <div id="troubleInfo" class="troubleInfo">
    <tf-table-legend label="隐患记录" :isopen="optionType === '1' ? 'true' : 'false'">
      <div style="width: 100%; display: flex; flex-wrap: wrap;">
        <div class="flexDiv">
          <span class="flexTitle">管线名称：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.pipeName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患部位：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.location" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患原因：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.typeName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患等级：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.toubleRangeName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">所在片区：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.regionName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">地址：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.address" type="textarea" :rows="2" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">隐患原因备注：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.notes" type="textarea" :rows="2" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患上报人：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.submitUserName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患上报时间：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.submitTime" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">是否进入工地管理：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.isbuild" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">施工单位名称：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.sgdw" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">施工负责人：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.gdfzr" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">联系电话：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.phone" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">消除隐患建议：</span>
          <div class='flexInfo'>
            <el-input v-model="dangerRecordData.suggest" size="small" type="textarea" :rows="2" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexImage">
          <span class="flexTitle">附件：</span>
          <div class="flexInfo demo-image__preview">
            <div style="float:left;">
              <el-image v-for="(item,index) in dangerRecordData.filelist" :key="index" style="" :src="item" :preview-src-list="dangerRecordData.filelist">
              </el-image>
            </div>
            <div>
              <audio v-for="(item,index) in dangerRecordData.audioFileList" :key="index" controls='controls' preload='auto' :src="item" />
            </div>
          </div>
        </div>
      </div>
    </tf-table-legend>
    <tf-table-legend label="审核处理" isopen="false" style="margin-top: 8px;">
      <div style="width: 100%; display: flex; flex-wrap: wrap;">
        <div class="flexDiv">
          <span class="flexTitle">审核结果：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.auditResult" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">是否需要人员巡查：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.isrespect" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">审核时间：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.auditTime" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">审核人员：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.auditUserName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">审核意见：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.auditNotes" size="small" type="textarea" :rows="1" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
          <span class="flexTitle">巡检组：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.inspectGroupIdName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
          <span class="flexTitle">巡查人：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.inspectUserName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
          <span class="flexTitle">巡查周期：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.periodName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax" v-show="checkHandleData.isrespect==='是'">
          <span class="flexTitle">起止时间：</span>
          <div class='flexInfo'>
            <el-input v-model="checkHandleData.planDate" size="small" :disabled="true"></el-input>
          </div>
        </div>
      </div>
    </tf-table-legend>
    <tf-table-legend label="隐患巡查记录" isopen="false" style="margin-top: 8px;">
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerXjRecordData.length>0" v-for="(item,index) in dangerXjRecordData" :key="index">
        <div class="flexDiv">
          <span class="flexTitle">上报时间：</span>
          <div class='flexInfo'>
            <el-input v-model="item.createTime" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">上报人：</span>
          <div class='flexInfo'>
            <el-input v-model="item.createUser" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">情况说明：</span>
          <div class='flexInfo'>
            <el-input v-model="item.note" size="small" type="textarea" :rows="1" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">地址：</span>
          <div class='flexInfo'>
            <el-input v-model="item.address" size="small" type="textarea" :rows="1" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexImage">
          <span class="flexTitle">附件：</span>
          <div class="flexInfo demo-image__preview">
            <div style="float:left;">
              <el-image v-for="(file,fileindex) in item.filelist" :key="fileindex" style="" :src="file" :preview-src-list="item.filelist">
              </el-image>
            </div>
            <div>
              <audio v-for="(file,index) in item.audioFileList" :key="index" controls='controls' preload='auto' :src="file" />
            </div>
          </div>
        </div>
        <hr v-show=" index !== (dangerXjRecordData.length-1) " class="box-hr">
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerXjRecordData.length <=0 ">
        <div style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无隐患巡查记录</div>
      </div>
    </tf-table-legend>
    <tf-table-legend label="隐患消除登记" isopen="false" style="margin-top: 8px;">
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerRemoveCheckData.length>0" v-for="(item,index) in dangerRemoveCheckData" :key="index">
        <div class="flexDivMax">
          <span class="flexTitle">消除隐患情况：</span>
          <div class='flexInfo'>
            <el-input v-model="item.notes" placeholder="消除隐患情况说明" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexImage">
          <span class="flexTitle">附件：</span>
          <div class="flexInfo demo-image__preview">
            <div style="float:left;">
              <el-image v-for="(file,fileindex) in item.filelist" :key="fileindex" style="" :src="file" :preview-src-list="item.filelist">
              </el-image>
            </div>
            <div>
              <audio v-for="(file,index) in item.audioFileList" :key="index" controls='controls' preload='auto' :src="file" />
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerRemoveCheckData.length <=0 ">
        <div style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无隐患消除登记</div>
      </div>
    </tf-table-legend>

    <tf-table-legend v-if="optionType === '1' " label="隐患消除审核" :isopen="optionType !== '1' ? 'true' : 'false'" style="margin-top: 8px;">
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerRemoveCheckData.length>0" v-for="(item,index) in dangerRemoveCheckData" :key="index">
        <div class="flexDiv">
          <span class="flexTitle">审核结果：</span>
          <div class='flexInfo'>
            <el-input v-model="item.auditResult" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">审核人名称：</span>
          <div class='flexInfo'>
            <el-input v-model="item.auditUserName" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">审核时间：</span>
          <div class='flexInfo'>
            <el-input v-model="item.auditTime" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <div class="flexDivMax" style="width: 99%;">
          <span class="flexTitle">审核意见：</span>
          <div class='flexInfo'>
            <el-input v-model="item.auditNotes" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
          </div>
        </div>
        <hr v-show=" index !== (dangerRemoveCheckData.length-1) " class="box-hr">
      </div>
      <div style="width: 100%; display: flex; flex-wrap: wrap;" v-show="dangerRemoveCheckData.length <=0 ">
        <div style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无隐患消除审核</div>
      </div>
    </tf-table-legend>

    <tf-table-legend v-if="optionType !== '1' " label="隐患消除审核" :isopen="optionType !== '1' ? 'true' : 'false'" style="margin-top: 8px;">
      <div style="width: 100%; display: flex; flex-wrap: wrap;">
        <div class="flexDiv">
          <span class="flexTitle">审核结果：</span>
          <div class="flexInfo">
            <el-select v-model="auditForm.auditResult" style="width:100%;" size="small" placeholder="请选择审核结果" clearable>
              <el-option v-for="item of auditStatus" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">审核意见：</span>
          <div class="flexInfo">
            <el-input v-model="auditForm.auditNotes" type="textarea" :rows="1" placeholder="请输入审核意见" size="small"></el-input>
          </div>
        </div>
      </div>
    </tf-table-legend>

    <span slot="footer" class="dialog-footer" v-if="optionType !== '1' ">
      <el-button @click="dialogClose()" size="small">取 消</el-button>&nbsp;&nbsp;
      <el-button type="primary" @click="confirmRemove()" size="small">确 定</el-button>
    </span>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import tfLegend from '@/views/zhpt/common/Legend.vue'
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue'
import { getHiddenDangerId, getHiddenDangerBuildId, getFileImg, reportDangerCheck } from '@/api/xjHiddenDangerManageApi'
import { IP } from '@/utils/request'
@Component({
  name: 'TroubleDetails',
  components: { tfLegend, tfTableLegend }
})
export default class TroubleDetails extends Vue {
  @Prop() troubleAry: any
  optionType = '1' //1=>详情，2=审核操作
  isopen = false

  //隐患记录展开项的数据
  dangerRecordData = {
    pipeName: '', // 隐患所在管线名称
    location: '', //隐患部位
    typeName: '', //隐患原因
    toubleRangeName: '', //隐患等级
    address: '', //隐患地址
    regionName: '', //隐患所在片区
    notes: '', //隐患原因备注
    submitUserName: '', //上报人员
    submitTime: '', //隐患上报时间
    isbuild: '', //是否进入工地
    //工地相关
    sgdw: '', //施工单位名称
    gdfzr: '', //施工负责人
    phone: '', //联系电话
    suggest: '', //消除隐患建议
    dangerReasonNote: '', //隐患原因备注
    dangerOccurTime: '', // 隐患发生时间
    filelist: [], //附件
    audioFileList: [] //语音文件
  }
  //审核处理展开项的数据
  checkHandleData = {
    inspectGroupIdName: '', //巡检组
    inspectUserName: '', //巡查人
    periodName: '', //巡查周期
    planDate: '', //审核时间
    auditResult: '', //审核结果
    isrespect: '', //是否需要人员巡查
    auditTime: '', //审核时间
    auditUserName: '', //审核人名称
    auditNotes: '' //审核意见
  }

  //隐患巡查记录展开项的数据
  dangerXjRecordData = []
  //隐患消除申请信息
  dangerRemoveCheckData = []

  // //隐患消除登记数据
  // dangerRemoveRegisterData: {
  // 	removeDangerSituation: '', //排除隐患情况说明
  // 	annex: '' //附件
  // },
  //隐患消除审核数据
  dangerCheckData = {
    checkIdea: '', //审核意见
    checkIdeaAnnex: '' //审核意见备注
  }

  //审核结果码表
  auditStatus = [
    { id: '1', name: '通过' },
    { id: '2', name: '未通过' }
  ]

  // 上报审核表单信息
  auditForm = {
    auditResult: undefined, //审核结果 1：通过；2：未通过
    auditNotes: '', //审核意见
    templateServiceType: '03' //审核类型:  02:隐患审核 03:隐患消除审核
  }
  mounted() {
    this.$nextTick(() => {
      console.log('入口参数：' + JSON.stringify(this.troubleAry))
      this.optionType = this.troubleAry.optionType
      this.getTroubleById()
    })
  }
  @Watch('troubleAry')
  troubleAryChange(newV, oldV) {
    console.log('隐患ID：' + JSON.stringify(newV))
    this.troubleAry = newV
    this.optionType = this.troubleAry.optionType
    this.getTroubleById()
  }
  /**
   * @description 获取隐患信息
   */
  getTroubleById() {
    var that = this
    that.dangerXjRecordData = []
    that.dangerRemoveCheckData = []

    //this.disableReport = true
    getHiddenDangerId(that.troubleAry.troubleId).then((res) => {
      // console.log("隐患上报："+JSON.stringify(res))

      if (res.code == -1) {
        that.$message.error(res.message)
        return
      }
      var result = res.result
      console.log('隐患上报：' + JSON.stringify(result))
      //隐患基础信息
      var troubleVo = result.troubleVo //隐患基础信息
      var troubleDispatchingVo = result.troubleDispatchingVo //隐患派工记录
      var planchildVo = result.planchildVo //子计划信息
      var recordVoList = result.recordVoList //隐患巡查记录
      var troubleClearVoList = result.troubleClearVoList //隐患消除记录

      /*--------------- 隐患基础信息 -------------*/
      if (!that.arrayIsNull(troubleVo)) {
        /*------------- 隐患基础信息 ------------*/
        that.dangerRecordData.pipeName = troubleVo.pipeName //管线名称
        that.dangerRecordData.location = troubleVo.location //隐患部位
        that.dangerRecordData.typeName = troubleVo.typeName //隐患原因
        that.dangerRecordData.toubleRangeName = troubleVo.toubleRangeName //隐患等级
        that.dangerRecordData.address = troubleVo.address //隐患地址
        that.dangerRecordData.regionName = troubleVo.regionName //隐患所在片区
        that.dangerRecordData.notes = troubleVo.notes //隐患原因备注
        that.dangerRecordData.submitUserName = troubleVo.submitUserName //隐患上报人名称
        that.dangerRecordData.submitTime = troubleVo.submitTime //隐患上报时间
        that.dangerRecordData.isbuild = troubleVo.isbuild //是否进入工地
        that.dangerRecordData.suggest = troubleVo.suggest //消除隐患建议
        that.dangerRecordData.filelist = that.getFilePaths(troubleVo.filePathList, 1) //图片信息
        that.dangerRecordData.audioFileList = that.getFilePaths(troubleVo.filePathList, 0) //图片信息
        // 	that.dangerRecordData.filelist = [
        // 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        // 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
        // 'http://192.168.2.231:1111/base/file/loadImg?remotePath=/xrty/missbxx/1394622588845096961.jpg&access_token=c70ed22c-bc22-40da-8a07-45d54ef7f106'
        // ]

        //获取工地的详情
        that.getBuildById(troubleVo.buildId)

        /*--------------- 隐患审核信息 -------------*/
        that.checkHandleData.auditResult = troubleVo.auditResult //审核结果
        that.checkHandleData.isrespect = troubleVo.isrespect //是否需要人员巡查
        that.checkHandleData.auditTime = troubleVo.auditTime //审核时间
        that.checkHandleData.auditUserName = troubleVo.auditUserName //审核人名称
        that.checkHandleData.auditNotes = troubleVo.auditNotes //审核意见
      }

      /*--------------- 隐患审核信息 -------------*/
      if (!that.arrayIsNull(troubleDispatchingVo)) {
        if (troubleDispatchingVo.isrespect == '是') {
          /*--------------- 隐患审核信息 -------------*/
          that.checkHandleData.inspectGroupIdName = troubleDispatchingVo.inspectGroupIdName //巡检组
          that.checkHandleData.inspectUserName = troubleDispatchingVo.inspectUserName //巡查人
          that.checkHandleData.periodName = troubleDispatchingVo.periodName //巡查周期
          that.checkHandleData.planDate = troubleDispatchingVo.planBegindate + ' 至 ' + troubleDispatchingVo.planEnddate //起止时间
        }
      }

      /*--------------- 隐患巡查记录 -------------*/
      if (!that.arrayIsNull(recordVoList)) {
        if (recordVoList.length > 0) {
          recordVoList.forEach((element) => {
            that.dangerXjRecordData.push({
              address: element.address, //地址描述
              createTime: element.createTime, //创建时间
              createUser: element.createUserName, //创建人
              filelist: that.getFilePaths(element.filePathList, 1), //图片信息
              audioFileList: that.getFilePaths(element.filePathList, 0),
              note: element.note, //情况说明
              xaddr: element.xaddr, //地址描述
              yaddr: element.yaddr //地址描述
            })
          })
        }
      }

      /*--------------- 隐患消除记录 -------------*/
      if (!that.arrayIsNull(troubleClearVoList)) {
        if (troubleClearVoList.length > 0) {
          troubleClearVoList.forEach((element) => {
            that.dangerRemoveCheckData.push({
              auditNotes: element.auditNotes, //审核意见
              auditResult: element.auditResult, //0：未审核；1：通过；2：未通过
              auditTime: element.auditTime, //审核时间
              auditUserName: element.auditUserName, //审核人名称
              filelist: that.getFilePaths(element.filePathList, 1), //图片信息
              audioFileList: that.getFilePaths(element.filePathList, 0), //语音信息
              createTime: element.createTime, //创建时间
              createUser: element.createUser, //创建人
              notes: element.notes, //消除隐患情况说明
              state: element.state //状态，1未审核，2同意、0不同意
            })
          })
        }
      }
    })
  }

  /**
   * @description 获取工地详情
   */
  getBuildById(buildId) {
    var that = this
    buildId = buildId || ''
    if (buildId == '' || typeof buildId == 'undefined') {
      return
    }
    getHiddenDangerBuildId(buildId).then((res) => {
      var result = res.result
      if (res.code == -1) {
        that.$message.error('获取工地详情出错')
        return
      }
      //工地基础信息
      var buildVo = result.buildVo //隐患基础信息
      that.dangerRecordData.sgdw = buildVo.sgdw //施工单位名称
      that.dangerRecordData.gdfzr = buildVo.gdfzr //施工负责人
      that.dangerRecordData.phone = buildVo.phone //联系电话
    })
  }

  /**
   * @description 附件处理
   */
  getFilePaths(filePathList, fileType) {
    var that = this
    if (that.arrayIsNull(filePathList)) {
      return
    }
    var token = that.$store.state.user.token
    var filepath = []
    filePathList.map((es) => {
      //判断后缀，是否是语音文件
      let esuffixt = es.substr(es.lastIndexOf('.') + 1)
      if (esuffixt === 'amr' && fileType === 0) {
        let audioPath = `${IP}/base/file/loadAudio?remotePath=${es}&access_token=${token}`
        filepath.push(audioPath)
      }
      if ((esuffixt === 'jpeg' || esuffixt === 'png' || esuffixt === 'jpg') && fileType === 1) {
        let imagePath = `${IP}/base/file/loadImg?remotePath=${es}&access_token=${token}`
        filepath.push(imagePath)
      }

      // getFileImg(token,es).then(src => {
      // if (src) {
      // 	var reader = new FileReader();
      // 	reader.readAsDataURL(src);
      // 	reader.onload = (s) => filepath.push(s.target.result)
      // }
      // else
      // 	this.$message.error('隐患图片加载失败：' + src.message)
      // })
    })

    return filepath
  }

  /**
   * @description 确认提交审核意见
   */
  confirmRemove() {
    var that = this
    that
      .$confirm('确认提交审核意见?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        var auditModel = {
          id: that.troubleAry.auditId, //选中的隐患ID
          auditNotes: that.auditForm.auditNotes, //审核意见 备注
          auditResult: that.auditForm.auditResult ////审核结果 1：通过；2：未通过、
        }

        console.log('auditModel：' + JSON.stringify(auditModel))
        //提交审核
        let auditData = JSON.parse(JSON.stringify(auditModel))
        reportDangerCheck(that.auditForm.templateServiceType, auditData).then((res) => {
          if (res.code == -1) {
            that.$message.error('上报审核出错,请重试')
            return
          } else {
            that.$message({ message: '上报消除隐患审核成功!', type: 'success' })
            that.dialogClose()
          }
        })
      })
      .catch((ex) => {
        that.$message.error('上报审核出错,请重试' + ex.message)
      })
  }

  /**
   * @description 关闭弹窗
   */
  dialogClose() {
    console.log('触发关闭')
    // 触发父组件中的dialogVisibleEvent事件，并传递参数
    this.$emit('dialogVisibleEvent', false)
  }

  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
  }

  /**
   * @description 清空数据
   */
  destroyed() {
    console.log('实例销毁完成')
  }
}
</script>

<style lang='scss' scoped>
.troubleInfo {
  height: 100%;
  width: 100%;
  padding: 5px;
}
.flexDiv {
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 8px;
}
.flexDivMax {
  width: 99%;
  min-height: 30px;
  margin-top: 8px;
}
.flexImage {
  width: 100%;
  margin-top: 8px;
}
.flexTitle {
  min-width: 130px;
  display: inline-block;
  text-align: right;
}
.flexInfo {
  display: inline-block;
  margin-left: 5px;
  width: calc(100% - 140px);
}
/deep/.el-image__inner {
  width: 100px;
  height: 100px;
  margin-right: 8px;
}

.box-hr {
  width: 100%;
  height: 1px;
  background-color: #f0f0f0;
  margin: 10px 0px 10px 0px;
}

.dialog-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>