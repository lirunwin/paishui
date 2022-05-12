<template>
    <div id="buildInfo" class="buildInfo">
		<tf-table-legend label="工地记录"  :isopen="optionType === '1' ? 'true' : 'false'">
			<div style="width: 100%; display: flex; flex-wrap: wrap;">
				<div class="flexDiv">
					<span class="flexTitle">工地类型：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.type" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">所属片区：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.regionName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">审核人：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.auditUserName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">施工单位名称：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.sgdw" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">施工负责人：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.gdfzr" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">联系人电话：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.phone" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">业主单位名称：</span>
					<div class="flexInfo">
						<el-input v-model="buildReportData.ownerUnitName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">业主负责人：</span>
					<div class="flexInfo">
						<el-input v-model="buildReportData.ownerUnitUser" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">业主联系电话：</span>
					<div class="flexInfo">
						<el-input v-model="buildReportData.ownerUnitPhone" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">地址：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.address" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">详细描述：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.notes"  type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">上报人员：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.submitUserName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">上报时间：</span>
					<div class = 'flexInfo'>
						<el-input v-model="buildReportData.submitTime" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexImage">
					<span class="flexTitle">附件：</span>
					<div class="flexInfo demo-image__preview">
						<div style="float:left;">
							<el-image v-for="(item,index) in buildReportData.filelist" :key="index"
								style=""
								:src="item" :preview-src-list="buildReportData.filelist">
							</el-image>
						</div>
						<div>
							<audio v-for="(item,index) in buildReportData.audioFileList" :key="index" controls='controls' preload='auto' :src="item" />
						</div>
					</div>
				</div>
			</div>
		</tf-table-legend>

		<tf-table-legend label="审核处理" isopen="false" style="margin-top: 8px;">
			<div style="width: 100%; display: flex; flex-wrap: wrap;">
				<div class="flexDiv">
					<span class="flexTitle">审核结果：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.auditResult" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">是否需要人员监护：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.isrespect" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">审核时间：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.auditTime" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">审核人员：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.auditUserName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">审核意见：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.auditNotes" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
					<span class="flexTitle">巡检组：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.inspectGroupIdName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
					<span class="flexTitle">巡查人：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.inspectUserName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv" v-show="checkHandleData.isrespect==='是'">
					<span class="flexTitle">巡查周期：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.periodName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax" v-show="checkHandleData.isrespect==='是'">
					<span class="flexTitle">起止时间：</span>
					<div class = 'flexInfo'>
						<el-input v-model="checkHandleData.planDate" size="small" :disabled="true"></el-input>
					</div>
				</div>
			</div>
		</tf-table-legend>
		<tf-table-legend label="工地巡查记录" isopen="false" style="margin-top: 8px;">
			<div style="width: 100%; display: flex; flex-wrap: wrap;" 
			 	v-show="dangerXjRecordData.length>0"
				v-for="(item,index) in dangerXjRecordData" :key="index" >
				<div class="flexDiv">
					<span class="flexTitle">上报时间：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.createTime" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">上报人：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.createUser" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">情况说明：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.note" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">地址：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.address" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexImage">
					<span class="flexTitle">附件：</span>
					<div class="flexInfo demo-image__preview">
						<div style="float:left;">
							<el-image v-for="(file,fileindex) in item.filelist" :key="fileindex"
								style=""
								:src="file" :preview-src-list="item.filelist">
							</el-image>
						</div>
						<div>
							<audio v-for="(file,index) in item.audioFileList" :key="index" controls='controls' preload='auto' :src="file" />
						</div>
					</div>
				</div>
				<hr v-show=" index !== (dangerXjRecordData.length-1) " class="box-hr">
			</div>
			<div style="width: 100%; display: flex; flex-wrap: wrap;"
				v-show="dangerXjRecordData.length <=0 " >
				<div style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无工地巡查记录</div>
			</div>
		</tf-table-legend>
		<tf-table-legend label="工地消除登记" isopen="false" style="margin-top: 8px;">
			<div style="width: 100%; display: flex; flex-wrap: wrap;"
				v-show="dangerRemoveCheckData.length>0"
				v-for="(item,index) in dangerRemoveCheckData" :key="index" >
				<div class="flexDivMax">
					<span class="flexTitle">消除工地情况：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.notes" placeholder="消除工地情况说明" 
							type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexImage">
					<span class="flexTitle">附件：</span>
					<div class="flexInfo demo-image__preview">
						<div style="float:left;">
							<el-image v-for="(file,fileindex) in item.filelist" :key="fileindex"
								style=""
								:src="file" :preview-src-list="item.filelist">
							</el-image>
						</div>
						<div>
							<audio v-for="(file,index) in item.audioFileList" :key="index" controls='controls' preload='auto' :src="file" />
						</div>
					</div>
				</div>
			</div>
			<div style="width: 100%; display: flex; flex-wrap: wrap;"
				v-show="dangerRemoveCheckData.length <=0 " >
				<div style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无工地消除登记</div>
			</div>
		</tf-table-legend>

		<tf-table-legend v-if="optionType === '1' " label="工地消除审核" :isopen="optionType !== '1' ? 'true' : 'false'" style="margin-top: 8px;">
			<div style="width: 100%; display: flex; flex-wrap: wrap;"
				v-show="dangerRemoveCheckData.length>0"
				v-for="(item,index) in dangerRemoveCheckData" :key="index" >
				<div class="flexDiv">
					<span class="flexTitle">审核结果：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.auditResult" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">审核人名称：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.auditUserName" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDiv">
					<span class="flexTitle">审核时间：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.auditTime" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<div class="flexDivMax" style="width: 99%;">
					<span class="flexTitle">审核意见：</span>
					<div class = 'flexInfo'>
						<el-input v-model="item.auditNotes" type="textarea" :rows="1" size="small" :disabled="true"></el-input>
					</div>
				</div>
				<hr v-show=" index !== (dangerRemoveCheckData.length-1) " class="box-hr">
			</div>
			<div style="width: 100%; display: flex; flex-wrap: wrap;"
				v-show="dangerRemoveCheckData.length <=0 " >
				<div  style="width: 100%; height:40px;line-height:40px; text-align:center;">暂无工地消除审核</div>
			</div>
		</tf-table-legend>


		<tf-table-legend v-if="optionType !== '1' " label="工地消除审核" :isopen="optionType !== '1' ? 'true' : 'false'" style="margin-top: 8px;">
			<div style="width: 100%; display: flex; flex-wrap: wrap; ">
				<div class="flexDiv">
					<span class="flexTitle">审核结果：</span>
					<div class="flexInfo">
						<el-select v-model="auditForm.auditResult" style="width:100%;" size="small" placeholder="请选择审核结果"  clearable>
							<el-option v-for="item of auditStatus" :key="item.id" :value="item.id" :label="item.name"></el-option>
						</el-select>
					</div>
				</div>
				<div class="flexDivMax">
					<span class="flexTitle">审核意见：</span>
					<div class="flexInfo">
						<el-input v-model="auditForm.auditNotes" type="textarea" :rows="1"  placeholder="请输入审核意见" size="small"></el-input>
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

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import tfTableLegend from '@/views/zhpt/common/TableLegend'
import { getBuildDetailId, getFileImg , getFileAudio , reportBuildCheck } from '@/api/xjWorkSiteCheckApi'
import { IP } from '@/utils/request'

export default {
  name: 'TroubleDetails',
  components: { tfLegend, tfTableLegend },
  props: {
	buildAry: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
		optionType:"1",		//1=>详情，2=审核操作
		isopen:false,

		//工地记录展开项的数据
		buildReportData: {
			type: '', //工地类型名称
			regionName: '', //工地所在片区
			auditUserName: '', //审核人员
			sgdw:'',			//施工单位名称
			gdfzr:'',			//施工负责人
			phone:'',			//联系电话
			address:'',	//工地地址
			notes:'',		//详细描述
			submitUserName: '',		//上报人员
			submitTime:'',		//工地上报时间
			filelist: [], //附件
			audioFileList:[],		//语音文件

			ownerUnitName:'',		//业主单位名称
			ownerUnitUser:'',		//业主负责人
			ownerUnitPhone:'',		//业主联系电话
		},
		//审核处理展开项的数据
		checkHandleData: {
			inspectGroupIdName: '', //巡检组
			inspectUserName: '',		//巡查人
			periodName: '', //巡查周期
			planDate: '', //审核时间
		},

		//工地巡查记录展开项的数据
		dangerXjRecordData: [],
		//工地消除申请信息
		dangerRemoveCheckData: [],

		// //工地消除登记数据
		// dangerRemoveRegisterData: {
		// 	removeDangerSituation: '', //排除工地情况说明
		// 	annex: '' //附件
		// },
		//工地消除审核数据
		dangerCheckData: {
			checkIdea: '', //审核意见
			checkIdeaAnnex: '' //审核意见备注
		},

		//审核结果码表
		auditStatus: [
			{ id:'1',name:'通过' },
			{ id:'2',name:'未通过' },
		], 

		// 上报审核表单信息
      	auditForm: {
			auditResult: undefined, //审核结果 1：通过；2：未通过
			auditNotes: "",   //审核意见
			templateServiceType: '05',   	//审核类型:  04:工地审核 05:工地监护消除审核
		},
    }
  },
  mounted() {	
    this.$nextTick(() => {
     	console.log("入口参数："+JSON.stringify(this.buildAry))
		this.optionType =  this.buildAry.optionType
	 	this.getTroubleById();
    });
  },
  watch: {
	  buildAry(newV, oldV) {
		console.log("工地ID："+ JSON.stringify(newV) )
		this.buildAry = newV;
		this.optionType =  this.buildAry.optionType
		this.getTroubleById();
	 },
  },
  methods: {
	  /**
	   * @description 获取工地信息
	   */
	  getTroubleById(){
		var that = this
		that.dangerXjRecordData = []
		that.dangerRemoveCheckData = []

		//this.disableReport = true
		getBuildDetailId(that.buildAry.buildId).then(res => {
			// console.log("工地上报："+JSON.stringify(res))

			if(res.code==-1){
				that.$message.error(res.message);
				return;
			}
			var result = res.result;
			console.log("工地上报："+JSON.stringify(result))
			//工地基础信息
			var buildVo = result.buildVo		//工地基础信息
			var buildDispatchingVo = result.buildDispatchingVo		//工地派工记录
			var planchildVo = result.planchildVo		//子计划信息
			var recordVoList = result.recordVoList			//工地巡查记录
			var bulidclearVoList = result.bulidclearVoList		//工地消除记录


			/*--------------- 工地基础信息 -------------*/
			if(!that.arrayIsNull(buildVo)){
				/*------------- 工地基础信息 ------------*/
				that.buildReportData.type = buildVo.type	//工地类型名称
				that.buildReportData.regionName = buildVo.regionName 	//工地所在片区
				that.buildReportData.auditUserName = buildVo.auditUserName //审核人员
				that.buildReportData.sgdw = buildVo.sgdw	//施工单位名称
				that.buildReportData.gdfzr = buildVo.gdfzr	//施工负责人
				that.buildReportData.phone = buildVo.phone	//联系人电话
				that.buildReportData.address = buildVo.address	//工地地址
				that.buildReportData.submitUserName = buildVo.submitUserName  //工地上报人员
				that.buildReportData.submitTime = buildVo.submitTime  //工地上报时间
				that.buildReportData.notes = buildVo.notes	//详细描述

				that.buildReportData.ownerUnitName = buildVo.ownerUnitName	//业主单位名称
				that.buildReportData.ownerUnitUser = buildVo.ownerUnitUser	//业主负责人
				that.buildReportData.ownerUnitPhone = buildVo.ownerUnitPhone	//业主联系电话


				that.buildReportData.filelist = that.getFilePaths(buildVo.filePathList,1);		//图片信息
				that.buildReportData.audioFileList = that.getFilePaths(buildVo.filePathList,0);		//图片信息

				console.log("图片")

				// 	that.buildReportData.filelist = [
				// 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
				// 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
				// 'http://192.168.2.231:1111/base/file/loadImg?remotePath=/xrty/missbxx/1394622588845096961.jpg&access_token=c70ed22c-bc22-40da-8a07-45d54ef7f106'
				// ]

				//获取工地的详情
				that.getBuildById(buildVo.buildId);

				/*--------------- 工地审核信息 -------------*/
				that.checkHandleData.auditResult = buildVo.auditResult	//审核结果
				that.checkHandleData.isrespect = buildVo.isrespect	//是否需要人员巡查
				that.checkHandleData.auditTime = buildVo.auditTime	//审核时间
				that.checkHandleData.auditUserName = buildVo.auditUserName	//审核人名称
				that.checkHandleData.auditNotes = buildVo.auditNotes	//审核意见
				
			}

			/*--------------- 工地审核信息 -------------*/
			if(!that.arrayIsNull(buildDispatchingVo)){
				if(buildDispatchingVo.isrespect == "是"){
					/*--------------- 工地审核信息 -------------*/
					that.checkHandleData.inspectGroupIdName = buildDispatchingVo.inspectGroupIdName	//巡检组
					that.checkHandleData.inspectUserName = buildDispatchingVo.inspectUserName	//巡查人
					that.checkHandleData.periodName = buildDispatchingVo.periodName	//巡查周期
					that.checkHandleData.planDate = buildDispatchingVo.planBegindate+' 至 '+buildDispatchingVo.planEnddate	//起止时间
				}
			}

			/*--------------- 工地巡查记录 -------------*/
			if(!that.arrayIsNull(recordVoList)){
				if(recordVoList.length > 0){
					recordVoList.forEach(element => {
						that.dangerXjRecordData.push({
							address : element.address,		//地址描述
							createTime : element.createTime,	//创建时间
							createUser : element.createUserName, //创建人
							filelist : that.getFilePaths(element.filePathList,1),		//图片信息
							audioFileList : that.getFilePaths(element.filePathList,0),		//语音信息
							note : element.note,	//情况说明
							xaddr : element.xaddr,		//地址描述
							yaddr : element.yaddr		//地址描述
						})
					});
				}
			}

			/*--------------- 工地消除记录 -------------*/
			if(!that.arrayIsNull(bulidclearVoList)){
				if(bulidclearVoList.length > 0){
					bulidclearVoList.forEach(element => {
						that.dangerRemoveCheckData.push({
							auditNotes : element.auditNotes,		//审核意见
							auditResult : element.auditResult,	//0：未审核；1：通过；2：未通过
							auditTime : element.auditTime, //审核时间
							auditUserName : element.auditUserName, //审核人名称
							filelist : that.getFilePaths(element.filePathList,1),		//图片信息
							audioFileList : that.getFilePaths(element.filePathList,0),		//语音信息
							createTime : element.createTime, //创建时间
							createUser : element.createUser, //创建人
							notes : element.notes,	//消除工地情况说明
							state : element.state,		//状态，1未审核，2同意、0不同意
							
						})
					});
				}
			}


		})
	  },

	/**
	 * @description 获取工地详情
	 */
	getBuildById(buildId){
		var that = this
		buildId = buildId || ""
		if(buildId =="" || typeof(buildId) ==  "undefined"){
			return;
		}

		getHiddenDangerBuildId(buildId).then(res => {
			var result = res.result;
			if(res.code==-1){
				that.$message.error("获取工地详情出错");
				return;
			}
			//工地基础信息
			var buildVo = result.buildVo		//工地基础信息
			that.buildReportData.sgdw = buildVo.sgdw	//施工单位名称
			that.buildReportData.gdfzr = buildVo.gdfzr	//施工负责人
			that.buildReportData.phone = result.phone	//联系电话
		});
	},

	/**
	 * @description 附件处理
	 */
	getFilePaths(filePathList,fileType){
		var that = this
		if(that.arrayIsNull(filePathList)){
			return;
		}
		var token = that.$store.state.user.token;
		var filepath = [];
		filePathList.map(es => {
			//判断后缀，是否是语音文件
			let esuffixt = es.substr(es.lastIndexOf(".")+1)
			if(esuffixt==='amr' && fileType === 0){
				let audioPath = `${IP}/base/file/loadAudio?remotePath=${es}&access_token=${token}`
				filepath.push(audioPath)
				// getFileAudio(token,es).then(src => {
				// 	if (src) {
				// 		var reader = new FileReader();
				// 		reader.readAsDataURL(src);
				// 		reader.onload = (s) => filepath.push(s.target.result)
				// 	}
				// 	else 
				// 		this.$message.error('工地图片加载失败：' + src.message)
				// })
			}
			if((esuffixt==='jpeg' || esuffixt==='png' || esuffixt==='jpg') && fileType === 1){
				let imagePath = `${IP}/base/file/loadImg?remotePath=${es}&access_token=${token}`
				filepath.push(imagePath)

				// getFileImg(token,es).then(src => {
				// 	if (src) {
				// 		var reader = new FileReader();
				// 		reader.readAsDataURL(src);
				// 		reader.onload = (s) => filepath.push(s.target.result)
				// 	}
				// 	else 
				// 		this.$message.error('工地图片加载失败：' + src.message)
				// })
			}
		})

		return filepath;
	},


	/**
	 * @description 确认提交审核意见
	 */
    confirmRemove() {
		var that = this
      	that.$confirm('确认提交审核意见?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
			var auditModel = {
				id:that.buildAry.auditId,    //选中的工地ID
				auditNotes: that.auditForm.auditNotes,   //审核意见 备注
				auditResult: that.auditForm.auditResult,   ////审核结果 1：通过；2：未通过、
			}

			console.log("auditModel："+JSON.stringify(auditModel))
			//提交审核
    		let auditData=JSON.parse(JSON.stringify(auditModel))
			reportBuildCheck(that.auditForm.templateServiceType,auditData).then(res => {
				if(res.code==-1){
					that.$message.error("上报审核出错,请重试");
					return;
				}else{
					that.$message({ message: '上报消除工地审核成功!',type: 'success' });
					that.dialogClose();
				}
			})
        }).catch((ex) => {
          that.$message.error("上报审核出错,请重试"+ex.message);
        });
    },
	
	/**
	 * @description 关闭弹窗
	 */
	dialogClose() {
		console.log("触发关闭");
      	// 触发父组件中的dialogVisibleEvent事件，并传递参数
      	this.$emit('dialogVisibleEvent', false);
    },

	/**
	 * @description 判断数组是否为空
	 */
	arrayIsNull(aryList) {
		return (typeof(aryList) == "undefined" || aryList == null || aryList.length == 0);
	}, 
  }
}
</script>

<style lang='scss' scoped>
.buildInfo {
	height: 100%;
	width: 100%;
	padding: 5px;
}
.flexDiv{
    width: 33%;
    height: 30px;
    line-height: 30px;
    margin-top: 8px;
}
.flexDivMax{
    width: 99%;
   	min-height: 30px;
    margin-top: 8px;
}
.flexImage{
    width: 100%;
    margin-top: 8px;
}
.flexTitle{
    min-width: 130px;
    display: inline-block;
    text-align: right;
}
.flexInfo{
	display: inline-block; 
	margin-left: 5px; 
	width:calc(100% - 140px);
}
/deep/.el-image__inner {
	width: 100px; 
	height: 100px;
	margin-right: 8px;
	
}

.box-hr{
    width: 100%;
    height: 1px;
    background-color: #F0F0F0;
    margin: 10px 0px 10px 0px;
  }

.dialog-footer{
	margin-top: 8px;
  	display: flex;
  	justify-content: flex-end;
	padding-top: 10px;
	text-align: right;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
</style>