<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道评估结果管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            size="small"
            placeholder="请输入管段编号、材质"
            v-model="searchValue.queryParams"
            clearable
            class="serch-input"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchValue.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="sOpition"
                  @change="sDateChange"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center; margin: 0 5px">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="searchValue.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="eOpition"
                  @change="eDateChange"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="title">结构性缺陷等级：</div>
          <el-select clearable v-model="searchValue.structClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select> -->
          <div class="title">缺陷等级：</div>
          <el-select clearable v-model="searchValue.defectLevel" placeholder="全部">
            <el-option v-for="(item, i) in defectLevel" :key="i" :label="item" :value="item"></el-option>
          </el-select>
          <!-- <div class="title">功能性缺陷等级：</div>
          <el-select clearable v-model="searchValue.funcClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select> -->
          <el-button size="small" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button size="small" type="primary" @click="resetBtn"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <download-excel
            :fields="json_fields"
            :data="multipleSelection"
            :before-generate="startDownload"
            :before-finish="finishDownload"
            name="管道缺陷管理表单.xls"
            type="xls"
          >
            <el-button size="small" type="primary">导出</el-button>
          </download-excel>
          <!-- <el-button  type="primary" @click="openDialogEnclosure" :disabled="multipleSelection.length != 1"
            >导出<i class="el-icon-download el-icon--right"></i
          ></el-button> -->
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        height="250"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="openPromptBox"
        :row-class-name="modality"
      >
        <template slot="empty">
          <img
            style="width: 100px; height: 100px; -webkit-user-drag: none"
            src="@/assets/images/nullData.png"
            alt="暂无数据"
            srcset=""
          />
          <p>暂无数据</p>
        </template>
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="v in tableContent"
          :key="v.name"
          :width="v.width"
          :sortable="v.sortable"
        >
        </el-table-column>
        <el-table-column width="120" header-align="center" label="缺陷名称代码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: center">{{ `(${scope.row.defectCode})${scope.row.defectName}` }}</div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" width="200" label="管道内部状况描述" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: center">{{ scope.row.pipeNote }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="120" header-align="center" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="toVideo(scope.row)">视频</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="openDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 30, 50, 100, 1000]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationTotal"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 表格当前列信息弹出框 -->
    <transition name="el-fade-in-linear">
      <div id="popupCardDefect" class="histroyPipeData" v-show="currentInfoCard">
        <div
          class="detailsCrad"
          style="top: 10%; left: 20%; right: 62%; font-size: 14px; color: red"
          v-if="currentInfoCard"
        >
          <el-card class="box-card" style="width: 300px">
            <div class="table-content" style="padding: 15px">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  box-sizing: border-box;
                "
              >
                <span style="font-weight: bold" >功能性缺陷:({{ DetailsForm.defectCode }}){{ DetailsForm.defectName }}
                </span>
                <a style="font-size: 12px; color: #2d74e7; text-decoration: underline" @click="openDetails">详情</a>
              </div>
              <div style="padding: 3px 0">{{ DetailsForm.expNo + DetailsForm.pipeType }}</div>
              <div class="content-info" style="font-size: 12px">
                <div class="left">
                  <div style="padding: 3px 0">检测日期&emsp; {{ DetailsForm.sampleTime }}</div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="flex: 1">距离:&emsp;{{ DetailsForm.distanceStartPoint }}</span
                    ><span style="flex: 1">等级:&emsp;{{ DetailsForm.defectLevel }}</span>
                  </div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="width: 40px">评价:</span>
                    <span style="line-height: 16px; padding-left: 10px">{{ DetailsForm.pipeNote }}</span>
                  </div>
                </div>
                <div class="right">
                  <el-tabs v-model="activeName">
                    <el-tab-pane :label="`照片`" name="picnum">
                      <div class="container" v-if="getImgUrl.length">
                        <el-image
                          style="width: 100%; height: 90%; -webkit-user-drag: none"
                          :src="getImgUrl"
                          :preview-src-list="[getImgUrl]"
                        >
                        </el-image>
                      </div>
                      <div v-show="!getImgUrl.length" style="text-align: center; margin-top: 20px">暂无照片</div>
                    </el-tab-pane>
                    <el-tab-pane :label="`视频`" name="viedoNum">
                      <div style="width: 100%; height: 100%" v-if="DetailsForm.videopath">
                        <video controls="controls" width="100%" height="83%">
                          <source :src="getVideoUrl" type="video/mp4" />
                        </video>
                      </div>
                      <div v-show="!DetailsForm.videopath" style="text-align: center; margin-top: 20px">暂无视频</div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </transition>

    <!-- 管段检测详情卡片 -->
    <transition name="el-fade-in-linear">
      <delete-dialog @sendBool="getBool" v-if="dialogFormVisible" :checkParam="id"></delete-dialog>
    </transition>

    <el-dialog width='80%' :title="videoTitle" v-if="showVideo" :visible.sync="showVideo" :append-to-body="true">
      <div style="width: 100%; height: 80%">
        <video controls="controls" width="100%" height="83%">
            <source :src="videoUrl" type="video/mp4" />
        </video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPageAssessment,
  downloadFile,
  queryPageEnclosure,
  queryDictionariesId,
  assessmentDetails,
  histroyPipeData,
  assessmentDefect,
  queryPageDefectInfo,
  queryDefectdetails
} from '@/api/pipelineManage'

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

import { geteSessionStorage } from '@/utils/auth'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'
import { comSymbol } from '@/utils/comSymbol'
import { unByKey } from 'ol/Observable'
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon'
import { getDefectData } from '@/api/sysmap/drain'
import defectImg1 from '@/assets/images/traingle1.png'
import defectImg2 from '@/assets/images/traingle2.png'
import defectImg3 from '@/assets/images/traingle3.png'
import defectImg4 from '@/assets/images/traingle4.png'
import defectImg0 from '@/assets/images/traingle0.png'
import JsonExcel from 'vue-json-excel'

// 引入管道检测组件
import deleteDialog from '../components/checkDetails.vue'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { Overlay } from 'ol'

import axios from 'axios'

export default {
  props: ['param', 'data'],
  components: {
    deleteDialog,
    'download-excel': JsonExcel
  },
  data() {
    return {
      json_fields: {
        '管段编号': 'expNo',
        '管段类型': 'pipeType',
        '管径(mm)': 'diameter',
        '材质': 'material',
        '检测方向': 'detectDir',
        '距离(m)': 'checkLength',
        '分值': 'defectNum',
        '等级': 'defectLevel',
        '检测视频': 'videoFileName',
        '工程名称': 'prjName',
        '工程地点': 'checkAddress',
        '检测日期': 'sampleTime',
        '管道内部状况描述': 'structEstimate',
        '缺陷名称代码': 'defectCode'
      },
      currentId: null,
      id: null,
      activeName: 'picnum', // 照片视频tab标签
      currentForm: [], // 缩略提示框
      currentIndex: 0, // 当前页数
      structArr: [
        [
          { label: '平均值S', name: 'structYmean' },
          { label: '最大值Smax', name: 'structYmax' }
        ],
        [
          { label: '缺陷密度', name: 'structDensity' },
          { label: '修复指数RI', name: 'repairIndex' }
        ]
      ], // 结构性数据
      funcArr: [
        [
          { label: '平均值S', name: 'funcYmean' },
          { label: '最大值Smax', name: 'funcYmax' }
        ],
        [
          { label: '缺陷密度', name: 'funcDensity' },
          { label: '养护指数MI', name: 'maintainIndex' }
        ]
      ], // 功能性性数据
      DetailsForm: {}, // 详情表单
      cardTableContent: [
        [
          { label: '整改建议', name: 'checkSuggest' },
          { label: '缺陷等级', name: 'defectLevel' }
        ],
        [
          { label: '缺陷类型', name: 'defectType' },
          { label: '缺陷代码', name: 'defectCode' }
        ],
        [
          { label: '环向', name: 'circular' },
          { label: '纵向', name: 'direction' }
        ]
      ], // 详情表格参数
      activeIndex: '1', // 详情导航索引
      dialogFormVisible: false, // 详情弹框显影
      detailsArr: [], // 缺陷信息
      // 查询附件列表需要的参数id
      updataParamsId: {
        itemId: '',
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      },
      // 附件弹框参数
      enclosureGridData: [], // 表格数据
      dialogEnclosure: false, // 显示隐藏
      paginationEnclosure: { current: 1, size: 30 }, // 分页参数信息
      paginationEnclosureTotal: 0, // 总页数
      // -------->
      // 表格参数
      tableContent: [
        { width: '200', sortable: false, label: '管段编号', name: 'expNo' },
        { width: '100', sortable: false, label: '管段类型', name: 'pipeType' },
        { width: '120', sortable: true, label: '管径(mm)', name: 'diameter' },
        { width: '100', sortable: false, label: '材质', name: 'material' },
        { width: '100', sortable: false, label: '检测方向', name: 'detectDir' },
        { width: '100', sortable: true, label: '距离(m)', name: 'distanceStartPoint' },
        { width: '80', sortable: true, label: '分值', name: 'defectNum' },
        { width: '100', sortable: true, label: '等级', name: 'defectLevel' },
        { width: '100', sortable: false, label: '工程名称', name: 'prjName' },
        { width: '100', sortable: false, label: '工程地点', name: 'checkAddress' },
        { width: '100', sortable: true, label: '检测日期', name: 'sampleTime' }
        // { label: '结构性缺陷评价', name: 'structEstimate' },
        // { label: '检测地点', name: 'checkAddress' },
      ],
      // gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      defectLevel: ['一级', '二级', '三级', '四级'], 
      // 日期选择器规则
      sOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.finishDate) {
            return time > new Date(this.searchValue.finishDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.searchValue.startDate) {
            return time < new Date(this.searchValue.startDate).getTime() - 8.64e7 || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      },
      searchValue: {
        startDate: '',
        finishDate: '',
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '', // 结构型缺陷等级
        defectLevel: ''
      }, // 搜索关键字的值
      trueValue: true,
      currentId: '', // 当前列的id
      currentInfoCard: false, // 弹出框
      tableVisible: false, // 表格当前列信息弹出框
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
      multipleSelection: [], // 表格被选中的数据
      dialogTableVisible: false,
      isPromptBox: {}, // 当前列信息
      form: {},

      // 地图参数
      map: null,
      vectorLayer: null,
      lightLayer: null,
      clickEvent: null,
      projUtil: null,
      currentDataProjName: 'proj44',
      // 
      hadLoad: false,
      popup: null,
      // 
      showVideo: false,
      videoUrl: '',
      videoTitle: '视频',
      hasLoad: false,
      themLayerName: 'pipeAndDefectLayer',
      themLayer: null
    }
  },
  watch: {
    '$store.state.map.halfP_editableTabsValue': function (n, o) {
      if (n !== 'pipelineDefect') {
        this.clearAll()
      } else {
        this.init()
      }
    },
    '$store.state.map.panels': function (n, o) {
      if (n.find(item => item.com === 'testResultDiagram')) {
        this.clearAll()
        let layer = this.getThemLayer()
        layer.setVisible(false)
      }
    }
  },
  created() {
  },
  computed: {
    // 获取文件url
    getVideoUrl() {
      let address = baseAddress + '/psjc/file' + this.DetailsForm.videopath
      console.log('address', address)
      return address
    },
    getImgUrl() {
      let address = baseAddress + '/psjc/file' + this.DetailsForm.picPath
      console.log('address', address)
      return address
    }
    // ----->
  },
  mounted() {
      this.projUtil = new projUtil()
      this.projUtil.resgis(this.currentDataProjName)
      this.map = this.data.mapView
      this.init()
  },
  destroyed() {
    if (this.$store.state.gis.activeHeaderItem !== 'psjc') {
      let layer = this.getThemLayer()
      layer && this.map.removeLayer(layer) 
    }
    this.popup && this.map.removeOverlay(this.popup)
    this.popup = null
    this.clearAll()
  },
  methods: {
    sDateChange(t) {
      if (!this.searchValue.finishDate) {
        this.$nextTick(() => {
          this.searchValue.finishDate = this.searchValue.startDate
        })
      }
    },
    eDateChange(t) {
      if (!this.searchValue.startDate) {
        this.$nextTick(() => {
          this.searchValue.startDate = this.searchValue.finishDate
        })
      }
    },
    toVideo (row) {
      let { videopath, videoFileName } = row
      if (!videopath) return this.$message.warning('暂无视频')
      let address = baseAddress + '/psjc/file' + videopath
      this.videoTitle = `${videoFileName} 视频`
      this.videoUrl = address
      this.showVideo = true
    },
    //导出前确认
    //导出表格
    startDownload() {
      let self = this
      if (self.multipleSelection.length == 0) {
        self.$message({
          message: '请勾选数据',
          type: 'warning'
        })
      }
    },
    finishDownload() {
      let self = this
      self.$message({
        message: '数据导出成功',
        type: 'success'
      })
    },
    // 关闭弹框
    getBool(bool) {
      this.dialogFormVisible = bool
    },
    // 重置
    resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchValue = {
        startDate: '',
        finishDate: '',
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '', // 结构型缺陷等级
        defectLevel: ''
      }
      this.getDate()
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间

    clearAll() {
      this.vectorLayer && this.map.removeLayer(this.vectorLayer)
      this.lightLayer && this.map.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
      this.currentInfoCard = false
      this.popup && this.popup.setPosition(null)
      this.vectorLayer = this.lightLayer = this.clickEvent
    },
    init() {
      this.getDate()
      this.vectorLayer = new VectorLayer({ source: new VectorSource() })
      this.lightLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(8, 'rgba(255, 0, 0, 0.8)', 9, 'rgba(0, 255, 255, 0.6)')
      })
      this.map.addLayer(this.vectorLayer)
      this.map.addLayer(this.lightLayer)

      //
      let layer = this.getThemLayer()
      if (layer) {
        layer.setVisible(false)
        this.setThemLayer()
        this.hasLoad = true
      } else {
        this.setMainMap()
      }

      this.clickEvent = this.map.on('click', (evt) => {
        let features = this.map.getFeaturesAtPixel(evt.pixel)
        if (features.length !== 0) {
          let id = features[0].get('id')
          this.openPromptBox({ id })
        } else {
          this.currentInfoCard = false
          this.popup && this.popup.setPosition(null)
          this.lightLayer.getSource().clear()
        }
      })
    },
    setThemLayer () {
      let layer = this.getThemLayer()
      let features = layer.getSource().getFeatures().filter(fea => fea.getGeometry() instanceof Point).map(fea => fea.clone())
      this.vectorLayer.getSource().addFeatures(features)
    },
    getThemLayer () {
      return this.map.getLayers().getArray().find(layer => layer.get('layername') === this.themLayerName)
    },
    /**
     * 添加、更新地图管道缺陷
     * */
    setMainMap () {
      let map = this.data.mapView
      if (this.vectorLayer && this.lightLayer) {
          this.$store.dispatch('map/mapLaoding', true)
          getDefectData().then(res => {
            this.hasLoad = true
            this.$store.dispatch('map/mapLaoding', false)
            if (res.code === 1 && res.result) {
                let { strucDefectFeatures, funcDefectFeatures, pipeDefectFeatures } = this.getReportFeatures(res.result, true)
                this.lightLayer.getSource().clear()
                if ([...strucDefectFeatures, ...funcDefectFeatures, ...pipeDefectFeatures].length !== 0) {
                  let center = mapUtil.getCenterFromFeatures([...strucDefectFeatures, ...funcDefectFeatures])
                  this.themLayer = new VectorLayer({ source: new VectorSource() })
                  this.themLayer.setVisible(false)
                  this.themLayer.set('layername', this.themLayerName)
                  this.map.addLayer(this.themLayer)
                  this.themLayer.getSource().addFeatures([...strucDefectFeatures, ...funcDefectFeatures, ...pipeDefectFeatures])
                  map.getView().setZoom(15)
                  map.getView().setCenter(center)
                  // 
                  this.setThemLayer()
                } else {
                  this.vectorLayer.getSource().clear()
                }
            } else this.$message.error('管线缺陷数据请求失败')
          })
      }
    },
    /**
     * 构造管道缺陷地图要素
     * @param reportInfos 报告数据
     * */
    getReportFeatures (defectInfos, hasStyle) {
      let style = null, features = { pipeDefectFeatures: [], funcDefectFeatures: [], strucDefectFeatures: [] }
      if (defectInfos.length === 0) { return features }
      defectInfos.forEach(defect => {
        let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = defect
        if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
          let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
          let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
          startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
          endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')
          let lineCoors = [startPoint, endPoint]
          let feature = new Feature({ geometry: new LineString(lineCoors) })
          // 健康等级颜色
            let colors = [
              { level: 'Ⅰ', color: 'green' },
              { level: 'Ⅱ', color: 'blue' },
              { level: 'Ⅲ', color: 'pink' },
              { level: 'Ⅳ', color: 'red' }
            ]
            let findFuncColor = colors.find(colorObj => defect['funcClass'] && defect['funcClass'].includes(colorObj.level))
            let findStrucColor = colors.find(colorObj => defect['structClass'] && defect['structClass'].includes(colorObj.level))
              // 功能性缺陷
            if (!isExit(defect.expNo, 'funcDefectFeatures')) {
              let fFea = feature.clone()
              let fColor = findFuncColor ? findFuncColor.color : "#070358"
              hasStyle && fFea.setStyle(comSymbol.getLineStyle(5, fColor))
              for (let i in defect) {
                i !== 'geometry' && fFea.set(i, defect[i])
              }
              features.funcDefectFeatures.push(fFea)
            }
              // 结构性缺陷
            if (!isExit(defect.expNo, 'strucDefectFeatures')) {
              let sFea = feature.clone()
              let sColor = findStrucColor ? findStrucColor.color : "#070358"
              hasStyle && sFea.setStyle(comSymbol.getLineStyle(5, sColor))
              for (let i in defect) {
                i !== 'geometry' && sFea.set(i, defect[i])
              }
              features.strucDefectFeatures.push(sFea)
            }
            // 缺陷点
            if (defect.geometry) {
              let coors = JSON.parse(defect.geometry)
              let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
              let feature = new Feature({ geometry: new Point(point) })
              let imgs = [
                { level: ['一级', '1'], img: defectImg1, index: 0 },
                { level: ['二级', '2'], img: defectImg2, index: 1 },
                { level: ['三级', '3'], img: defectImg3, index: 2 },
                { level: ['四级', '4'], img: defectImg4, index: 3 },
                // { level: '/', img: defectImg0, index: 4 }
              ]
              let findimg = null
              if (defect.defectLevel) {
                findimg = imgs.find((colorObj) => colorObj.level.includes(defect['defectLevel']))
              }
              // 缺少 defectLevel 字段
              if (findimg) {
                let rotation = getIconRat(lineCoors)
                hasStyle && feature.setStyle( new Style({ image: new Icon({ size: [48, 48], anchor: [0.5, 0], src: findimg.img, scale: 0.4, rotation }) }) )
                for (let i in defect) {
                  i !== 'geometry' && feature.set(i, defect[i])
                }
                features.pipeDefectFeatures.push(feature)
              }
            }

        }
      })
      return features
      function isExit(pipeId, feasType) {
        return features[feasType].some(fea => fea.get('expNo') === pipeId)
      }
      function getIconRat([startPoint, endPoint]) {
        let rotation = 0
        // 因为要垂直管线显示，所以图片旋转 90°
        let imgRt = Math.PI / 2

        // 计算旋转弧度
        if (endPoint[0] === startPoint[0]) {
          // 竖直
          rotation = endPoint[1] > startPoint[1] ? -imgRt : Math.PI - imgRt
        } else if (endPoint[1] === startPoint[1]) {
          // 水平
          rotation = endPoint[1] > startPoint[1] ? Math.PI / 2 - imgRt : (Math.PI * 3) / 2 - imgRt
        } else {
          // 其他角度
          rotation = Math.atan((endPoint[0] - startPoint[0]) / (endPoint[1] - startPoint[1])) - imgRt
        }
        return rotation
      }
    },
    // 获取缺陷数据
    getPipeDefectData() {
      getDefectData({ state: 1 }).then((res) => {
        this.hasLoad = true
        if (res.code === 1) {
          if (res.result && res.result.length !== 0) {
            let reportInfo = res.result[0] ? res.result : [res.result]
            let pipeData = reportInfo.map((item) => item.pipeStates).flat()
            let { strucDefectFeatures, funcDefectFeatures, pipeDefectFeatures } = this.getFeatures(pipeData)
            if (!(this.vectorLayer && this.lightLayer)) return
            this.vectorLayer.getSource().clear()
            this.lightLayer.getSource().clear()
            if ([...strucDefectFeatures, ...funcDefectFeatures, ...pipeDefectFeatures].length !== 0) {
              let center = new mapUtil().getCenterFromFeatures([...strucDefectFeatures, ...funcDefectFeatures])
              let view = this.map.getView()
              view.setCenter(center)
              view.animate({ zoom: 13 })
              this.vectorLayer.getSource().addFeatures(pipeDefectFeatures)
            }
            this.hadLoad = true
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    /**
     * 构造要素
     * @param featureArr 数组
     * */
    getFeatures(featureArr) {
      let style = null,
        features = { pipeDefectFeatures: [], funcDefectFeatures: [], strucDefectFeatures: [] }
      featureArr.forEach((feaObj) => {
        let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
        if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
          let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
          let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
          startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
          endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')
          let lineCoors = [startPoint, endPoint]
          let feature = new Feature({ geometry: new LineString(lineCoors) })

          // 健康等级颜色
          let colors = [
            { level: 'Ⅰ', color: 'green' },
            { level: 'Ⅱ', color: 'blue' },
            { level: 'Ⅲ', color: 'pink' },
            { level: 'Ⅳ', color: 'red' },
            { level: '/', color: '#070358' }
          ]
          let findFuncColor = colors.find(
            (colorObj) => feaObj['funcClass'] && feaObj['funcClass'].includes(colorObj.level)
          )
          let findStrucColor = colors.find(
            (colorObj) => feaObj['structClass'] && feaObj['structClass'].includes(colorObj.level)
          )

          // 功能性缺陷
          if (findFuncColor) {
            let fFea = feature.clone()
            fFea.setStyle(comSymbol.getLineStyle(5, findFuncColor.color))
            for (let i in feaObj) {
              i !== 'geometry' && fFea.set(i, feaObj[i])
            }
            features.funcDefectFeatures.push(fFea)
          }
          // 结构性缺陷
          if (findStrucColor) {
            let sFea = feature.clone()
            sFea.setStyle(comSymbol.getLineStyle(5, findStrucColor.color))
            for (let i in feaObj) {
              i !== 'geometry' && sFea.set(i, feaObj[i])
            }
            features.strucDefectFeatures.push(sFea)
          }
          // 管道缺陷等级数据
          feaObj.pipeDefects.forEach((feaObj, index) => {
            if (feaObj.geometry) {
              let coors = JSON.parse(feaObj.geometry)
              let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
              let feature = new Feature({ geometry: new Point(point) })
              let imgs = [
                { level: '一级', img: defectImg1, index: 0 },
                { level: '二级', img: defectImg2, index: 1 },
                { level: '三级', img: defectImg3, index: 2 },
                { level: '四级', img: defectImg4, index: 3 },
                // { level: '/', img: defectImg0, index: 4 }
              ]
              let findimg = null

              if (feaObj.defectLevel) {
                findimg = imgs.find((colorObj) => feaObj['defectLevel'].includes(colorObj.level))
              }
              // 缺少 defectLevel 字段
              if (findimg) {
                let rotation = getIconRat(lineCoors)
                feature.setStyle(
                  new Style({
                    image: new Icon({ size: [48, 48], anchor: [0.5, 0], src: findimg.img, scale: 0.4, rotation })
                  })
                )
                for (let i in feaObj) {
                  i !== 'geometry' && feature.set(i, feaObj[i])
                }
                features.pipeDefectFeatures.push(feature)
              }
            }
          })
        } else {
          // console.log('没有geometry')
        }
      })
      return features

      function getIconRat([startPoint, endPoint]) {
        let rotation = 0
        // 因为要垂直管线显示，所以图片旋转 90°
        let imgRt = Math.PI / 2

        // 计算旋转弧度
        if (endPoint[0] === startPoint[0]) {
          // 竖直
          rotation = endPoint[1] > startPoint[1] ? -imgRt : Math.PI - imgRt
        } else if (endPoint[1] === startPoint[1]) {
          // 水平
          rotation = endPoint[1] > startPoint[1] ? Math.PI / 2 - imgRt : (Math.PI * 3) / 2 - imgRt
        } else {
          // 其他角度
          rotation = Math.atan((endPoint[0] - startPoint[0]) / (endPoint[1] - startPoint[1])) - imgRt
        }
        return rotation
      }
    },
    setPositionByPipeId(id) {
      let features = this.vectorLayer.getSource().getFeatures()
      let filterFea = features.find((fea) => fea.get('id') === id)
      if (filterFea) {
        this.lightLayer.getSource().clear()
        let feature = new Feature({
          geometry: filterFea.getGeometry().clone(),
          style: comSymbol.getAllStyle(5, '#DCDC8B', 5, '#DCDC8B')
        })
        this.lightLayer.getSource().addFeature(feature)
        let center = new mapUtil().getCenterFromFeatures(feature)
        this.map.getView().animate({ zoom: 20 }, { center }, { duration: 0.5 })
        return center
      }
    },
    // 根据状态设置每列表格样式
    modality(obj) {
      // 通过id标识来改变当前行的文字颜色
      // console.log('obj', obj.row)
      let idArr
      if (this.multipleSelection != []) {
        idArr = this.multipleSelection.map((v) => v.id)
      }
      if (idArr.some((v) => v == obj.row.id)) {
        return 'rowBgBlue'
      }
    },
    // 点击行勾选数据
    handleRowClick(row, column, event) {
      let length = this.multipleSelection.length
      let id = this.multipleSelection.length == 1 ? this.multipleSelection[0].id : null
      // let
      this.$refs.multipleTable.clearSelection(row)
      if (length > 1 || length < 1) {
        this.$refs.multipleTable.toggleRowSelection(row)
      } else if (id) {
        if (row.id == id) {
          this.$refs.multipleTable.toggleRowSelection(row, false)
        } else {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      }
    },
    // 打开缩略提示框
    openPromptBox(row, column, cell, event) {
      if (!this.hasLoad) return this.$message.warning('地图数据未加载完')
      this.handleRowClick(row)
      if (!(this.vectorLayer && this.lightLayer)) return
      let position = this.setPositionByPipeId(row.id)
      //
      if (position) {
        this.currentId = row.id
        queryDefectdetails(row.id).then(res => {
          this.DetailsForm = res.result
          this.currentInfoCard = true
          this.popup = new Overlay({
            element: document.getElementById('popupCardDefect'),
            autoPan: true,
            positioning: 'bottom-center',
            stopEvent: true,
            offset: [18, -25],
            autoPanAnimation: { duration: 250 }
          })
          this.map.addOverlay(this.popup)
          this.popup.setPosition(position)
        })
      } else this.$message.error('该点无位置信息')

      // console.log('打开缩略提示框2', this.currentForm, this.isPromptBox)
    },
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
      // console.log(key, keyPath)
      // console.log(this.activeIndex)
    },
    // 详情
    async openDetails() {
      console.log('DetailsForm', this.DetailsForm)
      this.id = this.DetailsForm.stateId
      this.dialogFormVisible = true
    },
    // 搜索
    searchApi() {
      this.getDate()
    },
    // 表格多选事件
    handleSelectionChange(val) {
      console.log('缺陷')
      this.multipleSelection = val.map(item => {
        return { ...item, defectCode: `(${item.defectCode})${item.defectName}` }
      })
    },
    // 查询数据
    getDate() {
      console.log('更新数据')
      let data = {
        ...this.pagination,
        wordInfoState: 1,
        jcStartDate: this.searchValue.startDate,
        jcEndDate: this.searchValue.finishDate,
        queryParams: this.searchValue.queryParams,
        funcClass: this.searchValue.funcClass,
        structClass: this.searchValue.structClass,
        defectLevel: this.searchValue.defectLevel
      }
      queryPageDefectInfo(data).then((res) => {
        let { records, total } = res.result
        this.tableData = records
        this.paginationTotal = total
      })
    },
    // 分页触发的事件(主表格)
    handleSizeChange(val) {
      this.pagination.size = val
      this.getDate()
    },
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 12px;
  // 卡片样式
  /deep/ .el-dialog {
    margin-top: 9vh !important;
    font-size: 12px;
    .el-dialog__body {
      padding: 20px 36px !important;
      box-sizing: border-box;
      .el-table__body-wrapper {
        min-height: 400px;
      }
    }
    .el-dialog__header {
      background-color: #2d74e7;
      .el-dialog__title {
        color: #dfeffe;
      }
      .el-icon-close:before {
        color: #fff;
      }
    }

    .el-dialog__footer {
      padding: 0 20px 5px !important;
    }
  }
  // 表格样式
  .table-box {
    width: 96%;
    margin: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    .top-tool {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      // flex-wrap: wrap;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .sampleTime {
          width: 308px !important;
          .el-input {
            width: 140px;
          }
        }
        .serch-input {
          width: 245px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 140px;
        }

        .title {
          font-size: 14px;
          color: #606266;
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }

      .right-btn {
        margin-bottom: 14px;
        display: inline-block;
        // display: flex;
        // align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }

    /deep/ .el-table {
      flex: 1;
      // overflow-y: scroll;
      th.el-table__cell > .cell {
        color: rgb(50, 59, 65);
        height: 40px;
        line-height: 40px;
        background: rgb(234, 241, 253);
      }
      .el-table__row--striped > td {
        background-color: #f3f7fe !important;
      }
      .hover-row {
        color: #e6a23c;
        background-color: rgba($color: #2d74e7, $alpha: 0.1);
      }
      .rowBgBlue {
        & > td {
          color: #fff;
          border-right: 1px solid #ebeef5;
          background-color: #69a8ea !important;
        }
      }
    }
  }
  .hd-input {
    /deep/.el-input__inner {
      width: 70%;
    }
  }
  .el-select {
    width: 8%;
  }
  /deep/ .is-required {
    position: relative;
    .select-btn {
      position: absolute;
      top: 0;
      left: 72%;
    }
  }
  /deep/.histroyPipeData {
    // 详情卡片的样式
    .detailsCrad {
      z-index: 9;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }

      .box-card {
        width: 500px;
        max-height: 80vh;
        .el-card__header {
          height: 48px;
          color: #fff;
          background-color: #2d74e7;
        }
        .el-card__body {
          padding: 0 !important;
          .el-menu-item {
            height: 45px;
            font-size: 16px;
          }
        }
        .content {
          height: 600px;
          /deep/ .content-info {
            overflow-y: scroll;
            // max-height: 545px;
            height: 100%;
            padding: 10px 20px;
            .el-textarea__inner,
            .el-input__inner {
              color: #666;
            }
            .detailsTitle {
              position: relative;
              font-size: 16px;
              padding: 5px 0;
              box-sizing: border-box;
            }
            .detailsTitle::after {
              position: absolute;
              top: 5px;
              left: -10px;
              content: '';
              width: 4px;
              height: 65%;
              background-color: #2d74e7;
            }
            /deep/ .el-form {
              .is-disabled {
                .el-input__inner {
                  background-color: transparent;
                }
                .el-textarea__inner {
                  background-color: transparent;
                }
              }
              .el-form-item {
                margin-bottom: 10px;
              }
            }
          }
        }
        .table-content {
          padding: 15px;
          .content-info {
            font-size: 12px;
            display: flex;
            // justify-content: space-between;
            flex-direction: column;
            align-content: center;
            .left {
              font-family: 'Microsoft YaHei UI', sans-serif;
              flex: 1;
            }
            .right {
              flex: 1;
              .container {
                height: 100%;
                width: 100%;
                padding: 5px;
                box-sizing: border-box;
              }

              .is-top {
              }
              .el-tabs__item {
                margin: 11px 0 0 0;
                background: transparent;
              }
              .el-tabs__header {
                border-top: 0;
                background: #fff;
              }
              // .el-tabs__nav-wrap::after {
              //   z-index: 2;
              // }
              // .el-tabs__active-bar
            }
            .detailsTitle {
              position: relative;
              margin: 6px 0;
              padding-left: 10px;
              box-sizing: border-box;
              margin-bottom: 10px;
            }
            .detailsTitle::after {
              position: absolute;
              left: 0;
              content: '';
              width: 4px;
              height: 100%;
              background-color: #2d74e7;
            }
          }
        }
      }
    }
  }
}
#popupCardDefect {
  &::after {
    content: '';
    display: block;
    width: 45px;
    height: 27px;
    background: url('../components/testImg/corner.png');
    position: absolute;
    bottom: -26px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>