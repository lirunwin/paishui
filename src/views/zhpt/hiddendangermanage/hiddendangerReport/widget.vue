<template>
  <div id="hiddendangerReport" class="hiddendangerReport">
    <el-row>
      <span class="title2">名称</span>
      <el-input size="small" style="display: inline-block; margin-left: 5px; width:200px;" placeholder="请输入名称" v-model="problems.pipeName" />
      <span class="title2">地址</span>
      <el-input size="small" style="display: inline-block; margin-left: 5px; width:200px;" placeholder="请输入地址" v-model="problems.address" />
      <span class="title2">状态</span>
      <el-select style="display: inline-block; margin-left: 5px; width:200px;" v-model="problems.auditResult" size="small">
        <template v-for="item in auditStatus">
          <el-option :key="item.id" :label="item.name" :value="item.id"></el-option>
        </template>
      </el-select>
      <el-button type="primary" size="small" @click="dangerReportQuery()">查询</el-button>
      <el-button type="primary" :disabled="disableReport" size="small" @click="reportClick()">上报</el-button>
    </el-row>
    <div class="datatable">
      <el-table border ref="table1" class="mapTable" stripe style="width: 100%;margin-top: 8px;" height="100%" :data="hiddendangerData" @row-click="clickHiddendangerData" @row-dblclick="showTrouble" :header-cell-style="{'text-align':'center'}">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{((pageInfo.current - 1) * pageInfo.size) + (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pipeName" :formatter="formatter" show-overflow-tooltip sortable label="管线名称" width="200px" align="left" />
        <el-table-column prop="location" :formatter="formatter" show-overflow-tooltip sortable label="隐患部位" width="140px" align="center" />
        <el-table-column prop="typeName" :formatter="formatter" show-overflow-tooltip sortable label="隐患原因" width="180px" align="left" />
        <el-table-column prop="toubleRangeName" :formatter="formatter" show-overflow-tooltip sortable label="隐患等级" width="140px" align="center" />
        <el-table-column prop="address" :formatter="formatter" show-overflow-tooltip sortable label="地址" align="left" />
        <el-table-column prop="submitUserName" :formatter="formatter" show-overflow-tooltip sortable label="上报人" width="140px" align="center" />
        <el-table-column prop="submitTime" :formatter="formatter" show-overflow-tooltip sortable label="上报时间" width="200px" align="center" />
        <el-table-column prop="isSubmit" :formatter="formatter" show-overflow-tooltip sortable label="状态" width="140px" align="center" />
        <el-table-column prop="state" :formatter="formatter" show-overflow-tooltip sortable label="是否为隐患" width="140px" align="center" />
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showTrouble(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-area">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :page-size="pageInfo.size" :current-page="pageInfo.current" :total="pageInfo.tableTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-dialogDrag :visible.sync="reportDialog" title="隐患上报" width="1200px" top="10vh">
      <div style="width:100%; display: flex;flex-wrap: wrap; ">
        <div class="flexDiv">
          <span class="flexTitle">管线名称：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.name" style="width: 260px;" placeholder="请输入管线名称" size="small"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患部位：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.part" @focus="getDangerPart" size="small" style="width: 260px;" clearable>
              <el-option v-for="item of dangerpart" :key="item.ccode" :value="item.ccode" :label="item.cname"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患原因：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.reason" @focus="getDangerReason" size="small" style="width: 260px;" clearable>
              <el-option v-for="item of reasons" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">隐患等级：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.toubleRangeId" @focus="getToubleLevel" size="small" style="width: 260px;" clearable>
              <el-option v-for="item of levels" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">片区：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.pointPlace" size="small" placeholder="请选择片区" style="width: 260px;">
              <el-option v-for="item of pointPlaces" :key="item.OBJECTID" :value="item.OBJECTID" :label="item.NAME"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">是否进入工地：</span>
          <div class="flexInfo">
            <el-switch v-model="reportForm.isbuild" active-color="#13ce66" inactive-color="#ff4949" @change='changeBuildStatus($event)'></el-switch>
          </div>
        </div>
        <div class="flexDiv" v-show="reportForm.isbuild == true">
          <span class="flexTitle">所属工地：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.buildId" @focus="getDangerBuild" size="small" placeholder="请选择片区" style="width: 260px;">
              <el-option v-for="item of dangerbuild" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">审核人：</span>
          <div class="flexInfo">
            <el-select v-model="reportForm.checkMan" filterable style="width: 260px" size="small" @focus="getCheckMan">
              <el-option v-for="item of checkMen" :key="item.id" :value="item.id" :label="item.realName"></el-option>
            </el-select>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">附件：</span>
          <div class="flexInfo">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-change="beforeAvatarUpload" :on-success="handleAvatarSuccess" accept=".jpg,.jpeg,.png,.amr" :file-list="fileList" :auto-upload="false" multiple :limit="3" :on-exceed="handleExceed" style="width: 50%;" size="small">
              <el-button size="small" type="primary" style="margin-top: 3px; left:0px; float:left; ">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">⚠️注意：请上传jpg,png,jpeg,amr格式的文件，且大小不能超过10MB!最多3个文件!</div>
            </el-upload>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">地址：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.address" type="textarea" :rows="1" placeholder="请输入地址" size="small"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">隐患原因备注：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.note" type="textarea" :rows="2" placeholder="请输入隐患原因备注" size="small"></el-input>
          </div>
        </div>
        <div class="flexDivMax">
          <span class="flexTitle">消除隐患建议：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.suggest" type="textarea" :rows="2" placeholder="请输入消除隐患建议" size="small"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">经度：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.pointLon" placeholder="请输入经度" size="small"></el-input>
          </div>
        </div>
        <div class="flexDiv">
          <span class="flexTitle">纬度：</span>
          <div class="flexInfo">
            <el-input v-model="reportForm.pointLat" placeholder="请输入纬度" style="width: calc(100% - 60px);" size="small"></el-input>
            <el-button icon="el-icon-map-location" style="width: 50px; margin-bottom: 5px;" type="primary" size="small" @click="chageFlagStatus()"></el-button>
          </div>
        </div>
        <div class="flexDivMax">
          <div style="width:100%; height: 310px; margin-top:8px;" ref="mapBox"></div>
        </div>
      </div>

      <!-- <el-form :model="reportForm" :rules="reportRule" label-width="140px" label-position="right">
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="管线名称"  prop="name">
							<el-input v-model="reportForm.name" style="width: 260px;" placeholder="请输入管线名称" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="2">
						<el-form-item label="隐患部位">
							<el-select v-model="reportForm.part" @focus="getDangerPart" size="small" style="width: 260px;" clearable>
									<el-option v-for="item of dangerpart" :key="item.ccode" :value="item.ccode" :label="item.cname"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" style="margin-top:10px;">
					<el-col :span="10">
						<el-form-item label="隐患原因">
							<el-select v-model="reportForm.reason" @focus="getDangerReason" size="small" style="width: 260px;" clearable>
								<el-option v-for="item of reasons" :key="item.id" :value="item.id" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="2">
						<el-form-item label="片区">
							<el-select v-model="reportForm.pointPlace" size="small" placeholder="请选择片区" style="width: 260px;">
								<el-option v-for="item of pointPlaces" :key="item.OBJECTID" :value="item.OBJECTID" :label="item.NAME"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" style="margin-top:10px;">
					<el-col :span="10">
						<el-form-item label="是否进入工地">
							<el-switch  v-model="reportForm.isbuild" active-color="#13ce66" inactive-color="#ff4949"
								@change='changeBuildStatus($event)'
							></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="2">
						<el-form-item v-show="reportForm.isbuild == true" label="所属工地">
							<el-select v-model="reportForm.buildId" @focus="getDangerBuild" size="small" placeholder="请选择片区" style="width: 260px;">
								<el-option v-for="item of dangerbuild" :key="item.id" :value="item.id" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" style="margin-top:10px;">
					<el-col :span="10">
						<el-form-item label="附件">
							<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
								:on-preview="handlePreview" 
								:on-remove="handleRemove" 
								:before-remove="beforeRemove"
								:on-change="beforeAvatarUpload"
                      			:on-success="handleAvatarSuccess"
								:file-list="fileList" :auto-upload="false"
								multiple :limit="3" :on-exceed="handleExceed" style="width: 260px;" size="small">
								<el-button size="small" type="primary" style="width: 260px; margin-top: 3px;" >点击上传</el-button>
								<div slot="tip" class="el-upload__tip">⚠️注意：文件大小不能超过10MB!最多3个文件!</div>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="2">
						<el-form-item label="审核人">
							<el-select v-model="reportForm.checkMan" style="width: 260px" size="small" @focus="getCheckMan">
								<el-option v-for="item of checkMen" :key="item.id" :value="item.id" :label="item.realName"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px">
					<el-row :gutter="20">
						<el-col :span="10">
							<el-form-item label="地址">
								<el-input v-model="reportForm.address" type="textarea" style="width: 260px;"  placeholder="请输入地址" size="small"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="10" :offset="2">
							<el-form-item label="隐患原因备注">
								<el-input v-model="reportForm.note" type="textarea" placeholder="请输入隐患原因备注" style="width: 260px;" size="small"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-row>
				<el-row style="margin-top: 10px">
					<el-row :gutter="20">
						<el-col :span="10">
							<el-form-item label="消除隐患建议">
								<el-input v-model="reportForm.suggest" type="textarea" style="width: 260px;"  placeholder="请输入消除隐患建议" size="small"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-row>
				<el-row style="margin-top:10px;">
					<el-row :gutter="20">
						<el-col :span="10">
							<el-form-item label="经度">
								<el-input placeholder="请输入经度" style="width: 260px;"  v-model="reportForm.pointLon" size="small"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" :offset="2">
							<el-form-item label="纬度">
								<el-input style="width: 210px" placeholder="请输入纬度"  v-model="reportForm.pointLat" size="small"></el-input>
								<el-button icon="el-icon-map-location" style="width: 50px; margin-bottom: 5px;" type="primary" size="small" @click="chageFlagStatus()"></el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style="margin-top:10px;">
						<el-col :span="24">
							<div style="width:100%; height: 310px; margin-top:8px;" ref="mapBox"></div>
						</el-col>
					</el-row>
				</el-row>
			</el-form> -->
      <template slot="footer">
        <el-button @click="cancelReport" size="small">取消</el-button>
        <el-button type="primary" @click="confirmDangerReport()" size="small">确定</el-button>
      </template>
    </el-dialog>
    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>
    <el-dialog v-dialogDrag :visible.sync="dialogDetail" title="隐患详情" width="60%" top="10vh">
      <troubleDetail :troubleAry="troubleAry" />
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import {
  getCode,
  queryDangerReport,
  reportDanger,
  getHiddenDangerReason,
  getHiddenDangerCheckMan,
  queryDangerBuild,
  getToubleRange
} from '@/api/xjHiddenDangerManageApi'
@Component({
  name: 'HiddendangerReport',
  components: { troubleDetail }
})
export default class HiddenDangerReport extends Vue {
  @Prop() data: any
  dangerpart = [] //码表 => 隐患部位
  dangerbuild = [] //码表 => 工地码表
  auditStatus = [
    // 码表 => 审核状态
    { id: '', name: '全部' },
    { id: '0', name: '未审核' },
    { id: '1', name: '通过' },
    { id: '2', name: '未通过' }
  ]
  disableReport = false //按钮 => 是否可用
  dialogDetail = false //控制详情页面显示
  // 查询字段
  problems = {
    pipeName: undefined, //管线名称
    address: undefined, //地址
    auditResult: undefined //审核状态
  }
  pageInfo = { current: 1, size: 10, tableTotal: 1 } //分页数据
  troubleAry = {} //组件参数

  reportDialog = false // 上报弹窗
  flag = false //判断获取位置按钮是否被点击
  // model
  reportForm = {
    name: undefined, //管线名称
    part: undefined, //隐患部位
    acceptance: undefined,
    acceptanceTime: undefined,
    reason: undefined,
    toubleRangeId: undefined, //隐患等级
    note: '',
    address: '',
    suggest: '', //隐患消除建议
    pointLon: undefined,
    pointLat: undefined,
    pointPlace: undefined, //隐患片区
    checkMan: '',
    isbuild: true, //是否进入工地
    buildId: '', //工地编号
    fileList: undefined
  }
  checkMen = [] //存储审核人
  pointPlaces: []
  pointGeo = []
  reasons = [] //隐患原因
  levels = [] //隐患原因
  reportRule = {
    name: [{ required: true, message: '请输入管辖名称', trigger: 'blur' }]
  } // 规则
  fileList = [] // 上传文件
  hiddendangerData = [] // 上报隐患数据
  feature = '' //存储在地图上绘制的点的信息
  layerId = 17 //片区图层id
  mapV=null
  @Watch('$store.state.map.halfP_editableTabsValue')
  editableTabsValueChange() {
    console.log('进入页面:hiddendangerReport')
  }
  @Watch('reportDialog')
  reportDialogChange(newVal, oldVal) {
    console.log('上报Dialog：' + newVal ? '打开' : '关闭')
    if (!newVal) {
      this.flag = false
      this.clearPageInfo()
    }
  }
  mounted() {
    var that = this
    var div = this.$refs.cctvMap
    var mapV = this.data.mapView
    var map = mapV.map
    // loadModules(['esri/views/MapView'], { url: esriConfig.baseUrl }).then(([MapView]) => {
    //   const mapview = new MapView({
    //     container: div,
    //     map: map
    //   })
    //   that.mapV = mapview
    //   mapview.ui.components = []
    //   mapview.constraints.lods = mapV.constraints.lods
    //   mapview.on('click', function (e) {
    //     if (that.flag === true) {
    //       that.reportForm.pointLon = e.mapPoint.longitude.toFixed(6) //经度
    //       that.reportForm.pointLat = e.mapPoint.latitude.toFixed(6) //纬度
    //       that.drawPoint(e.mapPoint.longitude, e.mapPoint.latitude)
    //       that.getPartArea(e.mapPoint.longitude, e.mapPoint.latitude) //获取片区信息
    //       that.flag = false
    //     }
    //   })
    // })
    this.getData() //渲染主页表格
    this.getDangerPart() //获取隐患部位
    this.getDangerReason() //获取隐患原因
    this.getToubleLevel() //获取隐患等级
    this.getDangerBuild() //获取关联工地
    this.getCheckMan() //获取审核人
  }
  destroyed() {
    console.log('实例销毁完成')
    this.clearPageInfo()
  }
  /**
   * 渲染数据处理
   */
  formatter(row, column) {
    let typeValue = typeof row[column.property]
    if (typeValue == 'undefined') {
      return '-'
    } else if (typeValue == 'object' || typeValue == 'string') {
      if (!row[column.property]) {
        return '-'
      } else {
        return row[column.property]
      }
    } else {
      return row[column.property]
    }
  }

  /*--------------------- 地图相关 ----------------*/
  /**
   * @description 加载地图
   */
  loadMap() {
	//@ts-ignore
    this.$refs.mapBox.appendChild(this.$refs.cctvMap);
	//@ts-ignore
    this.$refs.cctvMap.style.display = ''
	//@ts-ignore
    this.mapV.extent = this.data.mapView.extent
  }
  /**
   * @description 绘制隐患点
   */
  drawPoint(lon, lat) {
    let that = this
    let mapV = this.data.mapView
    let map = mapV.map
    // loadModules(
    //   ['esri/views/MapView', 'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/symbols/PictureMarkerSymbol'],
    //   { url: esriConfig.baseUrl }
    // ).then(([MapView, Graphic, GraphicsLayer, PictureMarkerSymbol]) => {
    //   const point = {
    //     type: 'point',
    //     x: lon,
    //     y: lat,
    //     spatialReference: mapV.spatialReference
    //   }
    //   const simpleMarkerSymbol = {
    //     path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
    //     color: '2D74E7',
    //     outline: { color: '2D74E7', width: '1px' },
    //     size: '30px',
    //     yoffset: '15px',
    //     xoffset: '0px',
    //     type: 'simple-marker'
    //   }
    //   const pointGraphic = new Graphic({
    //     geometry: point,
    //     symbol: simpleMarkerSymbol
    //   })
    //   if (that.graphicsLayer) {
    //     // map.remove(that.graphicsLayer)
    //     // that.graphicsLayer = null
    //     map.removeAll()
    //   }
    //   that.graphicsLayer = new GraphicsLayer()
    //   that.graphicsLayer.add(pointGraphic)
    //   map.add(that.graphicsLayer)
    // })
  }

  /**
   * @description 定位到点
   */
  toPoint(lon, lat) {
    this.drawPoint(lon, lat)
    var mapV = this.mapV
    // console.log(this.mapV);
    let Graphic = this.data.mapView.TF_graphic
    let centerPt = {
      type: 'point',
      x: parseFloat(lon),
      y: parseFloat(lat),
      spatialReference: mapV.spatialReference
    }
    const simpleMarkerSymbol = {
      path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
      color: '2D74E7',
      outline: { color: '2D74E7', width: '1px' },
      size: '30px',
      yoffset: '15px',
      xoffset: '0px',
      type: 'simple-marker'
    }
    const pointGraphic = new Graphic({
      geometry: centerPt,
      symbol: simpleMarkerSymbol
    })
    let opts = {
      duration: 1000
    }
    mapV.goTo(
      {
        target: pointGraphic,
        zoom: 5
      },
      opts
    ) //跳转至地图上添加的点
  }

  /**
   * @description 获取片区
   */
  getPartArea(lon, lat) {
    // loadModules(['esri/geometry/geometryEngine', 'esri/geometry/Point', 'esri/geometry/geometryEngineAsync'], {
    //   url: esriConfig.baseUrl
    // }).then(([geometryEngine, Point, geometryEngineAsync]) => {
    //   let sp = this.data.mapView.spatialReference
    //   $.ajax({
    //     url: appconfig.gisResource.business_map.config[0].url + '/' + this.layerId + '/query?f=pjson',
    //     type: 'POST',
    //     data: {
    //       where: '1=1',
    //       f: 'pjson',
    //       outFields: '*'
    //     },
    //     success: (data) => {
    //       let point = {
    //         type: 'point',
    //         x: lon,
    //         y: lat,
    //         spatialReference: sp
    //       }
    //       this.pointPlaces = []
    //       this.pointGeo = []
    //       data = JSON.parse(data)
    //       data = data.features
    //       this.pointGeo = data
    //       for (let item of data) {
    //         this.pointPlaces.push(item.attributes)
    //       }
    //       let index = undefined
    //       for (let item of this.pointGeo) {
    //         item.geometry.spatialReference = sp
    //         let isIn = geometryEngine.intersects(item.geometry, point)
    //         if (isIn === true) {
    //           index = item.attributes.OBJECTID
    //         }
    //       }
    //       this.reportForm.pointPlace = index
    //     },
    //     error: (error) => this.$message.error(error)
    //   })
    // })
  }

  /**
   * @description 改变flag的值，false停止绘制
   */
  chageFlagStatus() {
    this.flag = true
  }

  /*--------------------- 界面操作 ----------------*/
  /**
   * @description 清除页面相关数据 => Map、表单数据
   */
  clearPageInfo() {
    //地图相关数据
    let mapV = this.data.mapView
    let map = mapV.map
    // if (this.click) {
    //   this.click.remove()
    // }
    // if (this.graphicsLayer) {
    //   map.remove(this.graphicsLayer)
    // }
    //表单数据
    for (var key in this.reportForm) {
      console.log('key值：' + key)
      if (key === 'isbuild') {
        this.reportForm.isbuild = true
      } else {
        this.reportForm[key] = undefined
      }
    }

    //清空附件
    this.fileList = []
  }

  /*--------------------- 附件上传 ----------------*/
  handleRemove(file, fileList) {
    console.log('文件列表移除文件时的钩子', file, fileList)
    this.fileList = fileList
  }
  handlePreview(file) {
    console.log('点击文件列表中已上传的文件时的钩子', file)
  }
  handleExceed(files, fileList) {
    this.$message.warning(
      `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
  }
  beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }
  onBeforeUpload(file) {
    console.log('图片格式', file.type)
    let fileName = file.name
    let esuffixt = fileName.substr(fileName.lastIndexOf('.') + 1)

    const isIMAGE = esuffixt === 'jpeg' || esuffixt === 'png' || esuffixt === 'jpg' || esuffixt === 'amr'
    const isLt1M = file.size / 1024 / 1024 < 10

    if (!isIMAGE) {
      this.$message.error('上传文件只能是jpg,png,jpeg,amr格式!')
    }
    if (!isLt1M) {
      this.$message.error('上传文件大小不能超过 10MB!')
    }
    return isIMAGE && isLt1M
  }
  //上传之前的钩子函数
  beforeAvatarUpload(response, file, fileList) {
    console.log(response, file)
    var isTrue = this.onBeforeUpload(response.raw)
    if (isTrue) {
      this.fileMap(file)
    } else {
      file.pop()
    }
  }
  fileMap(file) {
    if (file.length !== 0) {
      const files = file.map((v) => {
        return v.raw
      })
      //this.files = files
    }
  }
  handleAvatarSuccess(res, file, fileList) {
    console.log('文件上传成功时的钩子', res, file, fileList)
  }

  /*--------------------- 分页查询 ---------------*/
  /**
   * @description 按钮 => 上报
   */
  reportClick() {
    const that = this
    let mapView = this.data.mapView
    this.flag = true
    if ((this.flag = true)) {
    //   this.click = mapView.on('click', function (e) {
    //     that.reportForm.pointLon = e.mapPoint.longitude.toFixed(6) //经度
    //     that.reportForm.pointLat = e.mapPoint.latitude.toFixed(6) //纬度
    //     that.drawPoint(e.mapPoint.longitude, e.mapPoint.latitude)
    //     that.reportDialog = true //显示弹窗
    //     that.getPartArea(e.mapPoint.longitude, e.mapPoint.latitude)
    //     that.$nextTick(that.loadMap)
    //     that.flag = false
    //   })
    }
  }

  //获取主页面表格数据
  getData() {
    var that = this

    console.log('page参数：' + JSON.stringify(that.pageInfo))

    //追加分页参数
    const query = that.pageInfo

    Object.assign(query, that.problems)

    // this.disableReport = true
    that.hiddendangerData = []
    queryDangerReport(query).then((res) => {
      if (res.code !== 1) {
        that.$message.error('获取隐患上报列表出错!')
        return
      }
      //数据总数
      that.pageInfo.tableTotal = res.result.total

      that.hiddendangerData = res.result.records
    })
  }

  /**
   * @description 分页每页条数
   */
  handleSizeChange(pageSize) {
    this.pageInfo.size = pageSize
    this.getData()
  }
  /**
   * @description 改变当前页
   */
  handleCurrentChange(currentPage) {
    this.pageInfo.current = currentPage
    this.getData()
  }

  //点击查询，获取主页面表单数据
  dangerReportQuery() {
    this.pageInfo.current = 1
    this.getData()
  }
  /**
   * @description 隐患信息上报，提交数据库
   */
  confirmDangerReport() {
    var that = this
    //校验
    if (that.strIsNull(that.reportForm.name)) {
      this.$message.error('请输入管线名称')
      return
    }
    if (that.strIsNull(that.reportForm.reason)) {
      this.$message.error('请选择隐患原因')
      return
    }
    if (that.strIsNull(that.reportForm.toubleRangeId)) {
      this.$message.error('请选择隐患等级')
      return
    }
    if (that.strIsNull(that.reportForm.pointPlace)) {
      this.$message.error('请选择隐患所属片区')
      return
    }
    if (that.reportForm.isbuild) {
      if (that.strIsNull(that.reportForm.buildId)) {
        this.$message.error('请选择隐患所属工地')
        return
      }
    }
    if (that.strIsNull(that.reportForm.checkMan)) {
      this.$message.error('请选择审核人')
      return
    }
    if (that.strIsNull(that.reportForm.pointLon)) {
      this.$message.error('请输入经度')
      return
    }
    if (that.strIsNull(that.reportForm.pointLat)) {
      this.$message.error('请输入经度')
      return
    }

    //获取码表值
    var _pointPlace = that.pointPlaces.find((item:any) => {
      return item.OBJECTID === that.reportForm.pointPlace
    }) as any

    let data = {
      pipeName: that.reportForm.name, //管线名称
      location: that.reportForm.part, //隐患部位
      typeId: that.reportForm.reason, //隐患原因编码
      toubleRangeId: that.reportForm.toubleRangeId, //隐患原因编码
      regionId: _pointPlace.CODE || '', //片区编码
      regionName: _pointPlace.NAME || '', //片区名称
      auditUser: that.reportForm.checkMan, //审核人
      address: that.reportForm.address, //隐患地址
      notes: that.reportForm.note, //隐患原因备注
      lgtd: that.reportForm.pointLon, //上报地址经度
      lttd: that.reportForm.pointLat, //上报地址纬度
      isbuild: that.reportForm.isbuild ? '1' : '0', //是否上报工地
      buildId: that.reportForm.buildId, //上报工地编号
      suggest: that.reportForm.suggest //消除隐患建议

      // fileList: this.reportForm.fileList //上传附件
    }
    console.log('隐患上报Model：' + JSON.stringify(data))

    //附件上传
    const formdata = new FormData()
    Object.keys(data).forEach((key) => {
      formdata.append(key, data[key])
    })
    // if (typeof this.files != 'undefined') {
    //   if (this.files.length > 0) {
    //     for (let i = 0; i < this.files.length; i++) {
    //       formdata.append('fileList', this.files[i])
    //     }
    //   }
    // }

    reportDanger(formdata)
      .then((res) => {
        console.log(res)
        if (res.code !== 1) {
          that.$message.error('系统错误:' + res.message)
          return
        }
        that.getData()
        that.flag = false //关闭绘制
        that.reportDialog = false //关闭弹窗
      })
      .catch((err) => {
        console.log(err)
      })
    this.cancelReport()
  }
  /**
   * @description 取消上报
   */
  cancelReport() {
    this.reportDialog = false //关闭上报弹窗
    this.clearPageInfo()
  }
  //上报页面隐患原因
  getDangerReason() {
    getHiddenDangerReason({}).then((res) => {
      this.reasons = res.result.records
    })
  }
  //上报页面隐患等级
  getToubleLevel() {
    getToubleRange({ size: 10000 }).then((res) => {
      this.levels = res.result.records
    })
  }
  //上报页面隐患部位
  getDangerPart() {
    getCode({ size: 10000 }).then((res) => {
      const data = res.result
      //隐患部位
      this.dangerpart = this.getCodeOf(data, 721)
    })
  }
  //上报页面工地列表
  getDangerBuild() {
    var that = this
    queryDangerBuild({ size: 10000 }).then((res) => {
      that.dangerbuild = []
      res.result.records.forEach((element) => {
        that.dangerbuild.push({
          id: element.id,
          name: element.address
        })
      })
    })
  }

  //是否进入工地 true/false
  changeBuildStatus($event) {
    console.log('只：' + $event) // 默认参数，当前状态改变值
    if (!$event) {
      this.reportForm.buildId = ''
    }
  }

  getCodeOf(data, id) {
    const code = data.filter((val) => {
      return val.id === id
    })
    return code[0].codeList
  }

  //获取当前登录用户所在部门的审核人
  getCheckMan() {
    getHiddenDangerCheckMan({}).then((res) => {
      // console.log("登录用户对应的审核人："+JSON.stringify(res))
      this.checkMen = res.result
    })
  }

  /**
   * @description Table的选中
   */
  clickHiddendangerData(row, event, column) {
    console.log(row, event, column)
    this.toPoint(row.lgtd, row.lttd)
  }

  /**
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return typeof strVal == 'undefined' || strVal == null || strVal == ''
  }

  /*------------------ 查看详情 -------------------*/
  /**
   * @description 查看隐患详情
   */
  showTrouble(e) {
    var id = e.id
    this.dialogDetail = true
    this.troubleAry = {
      troubleId: id,
      optionType: '1' //1=>详情，2=审核操作
    }
    console.log('主键编号：' + id)
  }
}
</script>

<style lang='scss' scoped>
.hiddendangerReport {
  height: 100%;
  width: 100%;
  padding: 5px;
  .filteroption {
    width: 40%;
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .datatable {
    flex: 1;
    height: calc(100% - 100px);
  }
  .pagination-area {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // align-self: flex-end;
  }
  /deep/ .el-button {
    margin-left: 0;
  }
}
.flexDiv {
  width: 33%;
  min-height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexDivMax {
  width: 99%;
  margin-top: 10px;
}
.flexDivFile {
  width: 99%;
  min-height: 100px;
  line-height: 100px;
  margin-top: 8px;
}
.flexDivMap {
  width: 99%;
  height: 310px;
  line-height: 310px;
  margin-top: 8px;
}
.flexTitle {
  min-width: 120px;
  display: inline-block;
  text-align: right;
}
.flexInfo {
  display: inline-block;
  width: calc(100% - 150px);
}

/deep/ .el-upload {
  justify-content: flex-start;
}
// /deep/.el-upload-list {
// 	max-height: 50px;
// 	overflow-x: hidden;
// }
</style>
