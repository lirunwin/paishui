<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道评估结果管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            size="small"
            placeholder="支持搜索管段编号、材质"
            v-model="searchValue.queryParams"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">入库时间：</div>
          <!-- <el-date-picker v-model="searchValue.testTime" type="date" placeholder="入库时间" class="date-css">
          </el-date-picker> -->
          <!-- <el-date-picker
            v-model="searchValue.testTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker> -->
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchValue.testTime.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions0"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
              <el-col :span="1" style="text-align: center; margin: 0 5px">至</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="searchValue.testTime.finishDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="pickerOptions1"
                  @change="changeDate"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <div class="title">结构性缺陷等级：</div>
          <el-select v-model="searchValue.structClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchValue.funcClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select>
          <el-button size="small" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button size="small" type="primary" @click="resetBtn"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="##FFDF84"
            title="确定要导出吗?"
            @confirm="$message('该功能暂未开放', scope.row.prjName)"
          >
            <el-button slot="reference" type="primary" size="small" :disabled="multipleSelection.length != 1"
              >导出<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </el-popconfirm>
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
      >
        <template slot="empty">
          <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
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
        >
        </el-table-column>
        <el-table-column
          width="140"
          header-align="center"
          label="管道内部状况描述"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="text-align: center">{{ scope.row.structEstimate }}}</div>
          </template>
        </el-table-column>
        <el-table-column width="120" header-align="center" label="缺陷名称代码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: center">{{ `(${scope.row.defectCode})${scope.row.defectName}` }}</div>
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
      <div class="histroyPipeData">
        <div class="detailsCrad" style="top: 10%; left: 20%; right: 62%" v-if="currentInfoCard">
          <el-card class="box-card" style="width: 300px">
            <div class="table-content">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  box-sizing: border-box;
                "
              >
                <span style="font-weight: bold"
                  >功能性缺陷:({{ DetailsForm.defectCode }}){{ DetailsForm.defectName }}
                </span>
                <a style="font-size: 12px; color: #2d74e7; text-decoration: underline" @click="openDetails">详情</a>
              </div>
              <div style="padding: 3px 0">{{ DetailsForm.expNo + DetailsForm.pipeType }}</div>
              <div class="content-info">
                <div class="left">
                  <div style="padding: 3px 0">检测日期&emsp; {{ DetailsForm.sampleTime }}</div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="flex: 1">距离:&emsp;{{ DetailsForm.distanceStartPoint }}</span
                    ><span style="flex: 1">等级:&emsp;{{ DetailsForm.defectLevel }}</span>
                  </div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="width: 35px">评价:</span>
                    <span style="line-height: 16px; padding-left: 10px">{{ DetailsForm.pipeNote }}</span>
                  </div>
                </div>
                <div class="right">
                  <el-tabs v-model="activeName">
                    <el-tab-pane :label="`照片`" name="picnum">
                      <div class="container">
                        <el-image
                          style="width: 100%; height: 90%; -webkit-user-drag: none"
                          :src="getImgUrl"
                          :preview-src-list="[getImgUrl]"
                        >
                        </el-image>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`视频`" name="viedoNum">
                      <div style="width: 100%; height: 100%" v-if="DetailsForm.videopath">
                        <video controls="controls" width="100%" height="83%">
                          <source :src="getVideoUrl" type="video/mp4" />
                        </video>
                      </div>
                      <div v-show="!DetailsForm.videopath" style="text-align: center; margin-top: 20px">
                        暂无视频
                      </div>
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
    <!-- 导出弹框 -->
    <el-dialog title="附件列表" :visible.sync="dialogEnclosure">
      <el-table :data="enclosureGridData">
        <el-table-column property="address" label="地址"></el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <p v-if="false">{{ scope }}</p>
            <el-button type="text" size="small" @click="$message('该功能暂未开放')">报告</el-button>
            <el-button type="text" size="small" @click="dialogEnclosure = false">退出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChangeEnclosure"
          @current-change="handleCurrentChangeEnclosure"
          :current-page="paginationEnclosure.current"
          :page-sizes="[10, 20, 30, 50, 100, 1000]"
          :page-size="paginationEnclosure.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationEnclosureTotal"
        >
        </el-pagination>
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
import defectImgR from '@/assets/images/traingle-r.png'
import defectImgB from '@/assets/images/traingle-b.png'
import defectImgY from '@/assets/images/traingle-y.png'
import defectImgLB from '@/assets/images/traingle-lb.png'

// 引入管道检测组件
import deleteDialog from '../components/checkDetails copy2.vue'

export default {
  props: ['param', 'data'],
  components: {
    deleteDialog
  },
  data() {
    return {
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
        { label: '管段编号', name: 'expNo' },
        { label: '管段类型', name: 'pipeType' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '材质', name: 'material' },
        { label: '检测方向', name: 'detectDir' },
        { label: '距离(m)', name: 'checkLength' },
        { label: '分值', name: 'defectNum' },
        { label: '等级', name: 'defectLevel' },
        { label: '检测视频', name: 'videoFileName' },
        { label: '工程名称', name: 'prjName' },
        { label: '工程地点', name: 'checkAddress' },
        { label: '检测日期', name: 'sampleTime' }
        // { label: '结构性缺陷评价', name: 'structEstimate' },
        // { label: '检测地点', name: 'checkAddress' },
      ],
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      searchValue: {
        testTime: {
          startDate: '',
          finishDate: ''
        }, // 检测日期
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
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
      rootPage: null,
      vectorLayer: null,
      lightLayer: null,
      clickEvent: null,
      projUtil: null,
      currentDataProjName: 'proj43'
    }
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (this.param) return
      if (n !== '管道缺陷管理') {
        this.clearAll()
      } else {
        this.init()
      }
    },
    '$store.state.gis.pipeId': function (n, o) {
      if (n) this.openPromptBox(n)
    }
  },
  created() {
    let res = this.getDate()
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
    if (this.param && this.param.rootPage) {
      let { type, level, rootPage } = this.param
      this.rootPage = rootPage
      // type: funcClass表示管段, level表示缺陷
      // level: 级别
      console.log('这里是地图传入的参数', this.param)
    } else {
      this.projUtil = new projUtil()
      this.projUtil.resgis(this.currentDataProjName)
      this.map = this.data.mapView
      this.init()
    }
  },
  destroyed() {
    if (this.rootPage) {
      this.rootPage.clearLightFeas()
    } else {
      this.clearAll()
    }
  },
  methods: {
    // 关闭弹框
    getBool(bool) {
      this.dialogFormVisible = bool
    },
    // 重置
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchValue = {
        testTime: {
          startDate: '',
          finishDate: ''
        },
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
      }
      this.changeDate()
      await this.getDate()
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.searchValue.testTime.startDate).getTime()
      let date2 = new Date(this.searchValue.testTime.finishDate).getTime()
      this.pickerOptions0 = {
        disabledDate: (time) => {
          if (date2 != '') {
            // return time.getTime() > Date.now() || time.getTime() > date2
            return time.getTime() > date2
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
      this.pickerOptions1 = {
        disabledDate: (time) => {
          // return time.getTime() < date1 || time.getTime() > Date.now()
          return time.getTime() < date1
        }
      }
    },
    clearAll() {
      this.vectorLayer && this.map.removeLayer(this.vectorLayer)
      this.lightLayer && this.map.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
    },
    init() {
      this.vectorLayer = new VectorLayer({ source: new VectorSource() })
      this.lightLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(8, 'rgba(255, 0, 0, 0.8)', 9, 'rgba(0, 255, 255, 0.6)')
      })
      this.map.addLayer(this.vectorLayer)
      this.map.addLayer(this.lightLayer)
      this.getPipeDefectData()
      this.clickEvent = this.map.on('click', (evt) => {
        let features = this.map.getFeaturesAtPixel(evt.pixel)
        if (features.length !== 0) {
          let id = features[0].get('id')
          this.openPromptBox({ id })
        } else {
          this.currentInfoCard = false
          this.lightLayer.getSource().clear()
        }
      })
    },
    getPipeDefectData() {
      getDefectData().then((res) => {
        if (res.code === 1) {
          let dFeas = [],
            pFeas = []
          if (res.result && res.result.length !== 0) {
            let reportInfo = res.result[0] ? res.result : [res.result],
              pipeData = [],
              defectData = []
            reportInfo.forEach((rpt) => {
              let pipeStates = rpt.pipeStates
              // pipeData = [...pipeData, ...pipeStates]
              defectData = [...defectData, ...pipeStates.map((pipe) => pipe.pipeDefects).flat()]
            })
            dFeas = this.getFeatures(defectData, 2)
            // pFeas = this.getFeatures(pipeData, 1)
          }
          this.vectorLayer.getSource().clear()
          this.lightLayer.getSource().clear()

          if (dFeas.length !== 0 || pFeas.length !== 0) {
            this.vectorLayer.getSource().addFeatures([...dFeas, ...pFeas])
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    getFeatures(featureArr, type, hasStyle = true) {
      let style = null,
        features = []
      if (type === 1) {
        featureArr.forEach((feaObj) => {
          let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
          if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
            endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')

            let coors = [startPoint, endPoint]
            let feature = new Feature({ geometry: new LineString(coors) })
            // 健康等级颜色
            let colors = [
              { level: 'Ⅰ', color: 'green', index: 0 },
              { level: 'Ⅱ', color: 'blue', index: 1 },
              { level: 'Ⅲ', color: 'pink', index: 2 },
              { level: 'Ⅳ', color: 'red', index: 3 }
            ]
            let findColor = colors.find((colorObj) => feaObj['funcClass'].includes(colorObj.level))

            if (findColor) {
              feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
              for (let i in feaObj) {
                i !== 'geometry' && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
          }
        })
      } else {
        featureArr.forEach((feaObj, index) => {
          if (feaObj.geometry) {
            let coors = JSON.parse(feaObj.geometry)
            let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
            let feature = new Feature({ geometry: new Point(point) })
            let imgs = [
              { level: '一级', img: defectImgLB, index: 0 },
              { level: '二级', img: defectImgB, index: 1 },
              { level: '三级', img: defectImgY, index: 2 },
              { level: '四级', img: defectImgR, index: 3 }
            ]
            let findimg = null

            if (feaObj.defectLevel) {
              findimg = imgs.find((colorObj) => feaObj['defectLevel'].includes(colorObj.level))
            }
            // 缺少 defectLevel 字段
            if (findimg) {
              // hasStyle && feature.setStyle(comSymbol.getAllStyle(5, findColor.color, 0, 'rgba(0,0,0,0)'))
              hasStyle &&
                feature.setStyle(new Style({ image: new Icon({ size: [48, 48], src: findimg.img, scale: 0.3 }) }))
              for (let i in feaObj) {
                i !== 'geometry' && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
          }
        })
      }
      return features
    },
    setPositionByPipeId(id) {
      console.log('定位')
      let features = this.vectorLayer.getSource().getFeatures()
      let filterFea = features.find((fea) => fea.get('id') === id)
      if (filterFea) {
        let feature = new Feature({
          geometry: filterFea.getGeometry().clone(),
          style: comSymbol.getAllStyle(5, '#DCDC8B', 5, '#DCDC8B')
        })
        this.lightLayer.getSource().clear()
        this.lightLayer.getSource().addFeature(feature)
        let position = feature.getGeometry().getCoordinates().flat()
        position.length = 2
        this.map.getView().setCenter(position)
        this.map.getView().setZoom(21)
      }
    },

    // 打开缩略提示框
    async openPromptBox(row, column, cell, event) {
      if (this.rootPage) {
        this.rootPage.lightFea(row.id)
      } else {
        this.setPositionByPipeId(row.id)
      }
      console.log('打开缩略提示框', row)
      this.currentId = row.id
      let res = await queryDefectdetails(row.id)
      this.DetailsForm = res.result
      // this.isPromptBox = { ...row }
      // let res = await assessmentDefect(row.id)
      // this.currentForm = res.result
      this.currentInfoCard = true
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
      this.id = this.currentId
      this.dialogFormVisible = true
    },
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchValue = {
        testTime: '',
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
      }
      await this.getDate()
    },
    // 搜索
    searchApi() {
      this.pagination.current = 1
      this.getDate(this.searchValue)
      // console.log(this.searchValue.testTime)
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查询数据
    async getDate(params) {
      let data = this.pagination
      if (params) {
        data.jcStartDate = params.testTime.startDate
        data.jcEndDate = params.testTime.finishDate
        data.queryParams = params.queryParams
        data.funcClass = params.funcClass
        data.structClass = params.structClass
      }
      await queryPageDefectInfo(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
        // this.$message.success("上传成功");
      })
    },
    // 分页触发的事件(主表格)
    async handleSizeChange(val) {
      this.pagination.size = val
      await this.getDate()
      console.log(`每页 ${val} 条`)
    },
    async handleCurrentChange(val) {
      this.pagination.current = val
      await this.getDate()
      console.log(`当前页: ${val}`)
    },
    // 分页触发的事件(附件列表)
    async handleSizeChangeEnclosure(val) {
      this.pagination.size = val
      await this.getDate()
      console.log(`每页 ${val} 条`)
    },
    async handleCurrentChangeEnclosure(val) {
      this.pagination.current = val
      await this.getDate()
      console.log(`当前页: ${val}`)
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
  .histroyPipeData {
    // 详情卡片的样式
    .detailsCrad {
      position: fixed;
      top: 100px;
      right: 24px;
      z-index: 9;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }

      /deep/ .box-card {
        width: 500px;
        max-height: 80vh;
        .el-card__header {
          height: 48px;
          color: #fff;
          background-color: #2d74e7;
        }
        .el-card__body {
          padding: 0;
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
            /deep/ .right {
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
</style>