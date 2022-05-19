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
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">检测时间：</div>
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
            @confirm="$message('该功能暂未开放')"
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
        :default-sort="{ prop: 'date', order: 'descending' }"
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
        <el-table-column header-align="center" align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="(v, i) in tableContent"
          :key="i"
          :sortable="v.sortable"
          :width="v.width"
        >
        </el-table-column>

        <el-table-column
          prop="structClass"
          header-align="center"
          label="结构性缺陷等级"
          align="center"
          show-overflow-tooltip
          width="170"
          :sort-method="sortStruct"
          :sortable="true"
        >
        </el-table-column>
        <el-table-column
          prop="funcClass"
          header-align="center"
          label="功能性缺陷等级"
          align="center"
          show-overflow-tooltip
          width="180"
          :sortable="true"
          :sort-method="sortFunc"
        >
        </el-table-column>

        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="toPdfPage(scope.row.pdfFilePath)">报告</el-button>
            <el-button type="text" size="small" @click.stop="openDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>
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
      <div id='popupCard' class="detailsCrad" v-show="currentInfoCard">
        <el-card class="box-card" v-if="currentInfoCard">
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
              <span style="font-weight: bold; user-select: none"
                >{{ getCurrentForm.expNo || "" + getCurrentForm.pipeType || "" }}
                <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastPage"></i>
                {{ currentForm.length ? currentIndex + 1 : 0 }}/{{ currentForm.length }}
                <i class="el-icon-caret-right" style="cursor: pointer" type="text" @click="nextPage"></i>
              </span>
              <a
                style="font-size: 12px; color: #2d74e7; text-decoration: underline"
                @click="openDetails(getCurrentForm)"
                >详情</a
              >
            </div>
            <div>管径：{{ getCurrentForm.diameter }}mm 材质：{{ getCurrentForm.material }}</div>
            <div class="content-info">
              <div class="left">
                <div class="detailsTitle">检测日期 {{ getCurrentForm.sampleTime }}</div>
                <!-- <p style="padding-left: 10px">无文档</p> -->
                <div class="text-space">
                  <el-link
                    style="font-size: 12px; margin-left: 10px"
                    v-if="getCurrentForm.wordFilePath"
                    type="primary"
                    @click.stop="downloadDocx"
                    >{{ getCurrentForm.wordInfoName + 'docx' }}</el-link
                  >
                </div>
                <div class="detailsTitle">结构性缺陷 等级:{{ getCurrentForm.structClass }}</div>
                <p style="padding-left: 10px">评价:{{ getCurrentForm.structEstimate }}</p>
                <div class="detailsTitle">功能性缺陷 等级:{{ getCurrentForm.funcClass }}</div>
                <p style="padding-left: 10px">评价: {{ getCurrentForm.funcEstimate }}</p>
              </div>
              <div class="right">
                <el-tabs v-model="activeName">
                  <el-tab-pane :label="`照片(${getCurrentForm.pipeDefects.length || 0})`" name="picnum">
                    <div class="container">
                      <el-image
                        style="width: 100%; height: 90%; -webkit-user-drag: none"
                        :src="getImgUrl"
                        :preview-src-list="getImgUrlArr"
                      >
                      </el-image>
                      <div style="text-align: center">
                        <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastImg"></i>
                        {{ getCurrentForm.pipeDefects.length ? imgArrIndex + 1 : 0 }}/{{
                          getCurrentForm.pipeDefects.length || 0
                        }}
                        <i class="el-icon-caret-right" style="cursor: pointer" type="text" @click="nextImg"></i>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`视频`" name="viedoNum">
                    <div style="width: 100%; height: 100%" v-if="getCurrentForm.videoPath">
                      <video controls="controls" width="100%" height="83%">
                        <source :src="getVideoUrl" type="video/mp4" />
                      </video>
                    </div>
                    <div v-show="!getCurrentForm.videoPath" style="text-align: center; margin-top: 20px">暂无视频</div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>

    <!-- 管段检测详情卡片 -->
    <transition name="el-fade-in-linear">
      <delete-dialog @sendBool="getBool" v-show="dialogFormVisible" :checkParam="id"></delete-dialog>
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
  assessmentDefect
} from '@/api/pipelineManage'
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
import { Overlay } from 'ol';

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

import axios from 'axios'

// 引入管道检测组件
import deleteDialog from '../components/checkDetails.vue'
import { mapUtil } from '../../common/mapUtil/common'

export default {
  props: ['data'],
  components: {
    deleteDialog
  },
  data() {
    return {
      id: null, // 当前列表id
      activeName: 'picnum', // 照片视频tab标签
      imgArrIndex: 0, // 缩略框照片索引
      currentForm: [], // 缩略提示框
      currentIndex: 0, // 当前页数
      cardTableContent: [
        [
          { label: '管段编号', name: 'expNo' },
          { label: '管段类型', name: 'pipeType' }
        ],
        [
          { label: '起点埋深', name: 'startDepth' },
          { label: '终点埋深', name: 'endDepth' }
        ],
        [
          { label: '管径', name: 'diameter' },
          { label: '材质', name: 'material' }
        ],
        [
          { label: '敷设年代', name: 'constr' },
          { label: '长度', name: 'pipeLength' }
        ]
      ], // 详情表格参数
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
        { width: '100', sortable: false, label: '工程名称', name: 'prjName' },
        { width: '100', sortable: false, label: '管段编号', name: 'expNo' },
        { width: '100', sortable: false, label: '管段类型', name: 'pipeType' },
        { width: '120', sortable: true, label: '管径(mm)', name: 'diameter' },
        { width: '100', sortable: false, label: '材质', name: 'material' },
        { width: '', sortable: false, label: '结构性缺陷评价', name: 'structEstimate' },
        { width: '100', sortable: true, label: '缺陷数量', name: 'defectnum' },
        { width: '100', sortable: true, label: '检测照片', name: 'picnum' },
        { width: '100', sortable: false, label: '检测视频', name: 'videoFileName' },
        { width: '100', sortable: false, label: '检测地点', name: 'checkAddress' },
        { width: '100', sortable: true, label: '检测日期', name: 'sampleTime' }
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
      //
      vectorLayer: null,
      map: null,
      lightLayer: null,
      clickEvent: null,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj43', // 当前坐标系
      popup: null,
      hasLoad: false
    }
  },
  created() {
    let res = this.getDate()
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n !== '管道评估结果管理') {
        this.clearAll()
        this.hasData = false
      } else {
        this.init()
      }
    },
    'searchValue.testTime.startDate': function (n) {
      this.searchValue.testTime.finishDate = n
    }
  },
  mounted() {
    this.map = this.data.mapView
    this.projUtil = new projUtil()
    this.projUtil.resgis(this.currentDataProjName)
    this.init()
  },
  destroyed() {
    this.clearAll()
  },
  computed: {
    // 获取照片数组路径
    getImgUrlArr() {
      let arr = this.getCurrentForm.pipeDefects.map((v) => {
        return baseAddress + '/psjc/file' + v.picPath
      })
      return arr
    },
    // 获取文件url
    getImgUrl() {
      let address = baseAddress + '/psjc/file' + this.getCurrentForm.pipeDefects[this.imgArrIndex].picPath
      console.log('address', address)
      return address
    },
    getVideoUrl() {
      console.log('照片', this.getCurrentForm.pipeDefects.length)
      let address = baseAddress + '/psjc/file' + this.getCurrentForm.videoPath
      console.log('address', address)
      return address
    },
    // 传给管道检测组件的参数
    // sendParam() {
    //   return { bool: this.dialogFormVisible, id: this.id }
    // },
    // 提示框照片视频
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 提示框当前信息
    getCurrentForm() {
      return this.currentForm ? this.currentForm[this.currentIndex] : {}
    }
  },
  methods: {
    // 转换缺陷等级
    getDefectValue(level) {
      switch (level) {
        case 'Ⅰ':
          return 1
          break
        case 'Ⅱ':
          return 2
          break
        case 'Ⅲ':
          return 3
          break
        case 'Ⅳ':
          return 4
          break
        default:
          return 0
      }
      // let arr = [
      //   { name: , value: 1 },
      //   { name: 'Ⅱ', value: 2 },
      //   { name: 'Ⅲ', value: 3 },
      //   { name: 'Ⅳ', value: 4 }
      // ]
      // let rvalue
      // arr.forEach((v) => {
      //   if (level == v.name) {
      //     rvalue = v.value
      //   } else {
      //     rvalue = 0
      //   }
      // })
      // return rvalue
    },
    // 自定义排序
    sortStruct(a, b) {
      let av = this.getDefectValue(a.structClass)
      let bv = this.getDefectValue(b.structClass)
      if (av < bv) {
        return -1
      }
    },
    sortFunc(a, b) {
      let av = this.getDefectValue(a.funcClass)
      let bv = this.getDefectValue(b.funcClass)
      if (av < bv) {
        return -1
      }
    },
    // 下载文档
    downloadDocx() {
      this.$message('正在加载文档地址...')
      let url = baseAddress + '/psjc/file' + this.getCurrentForm.wordFilePath
      let label = this.getCurrentForm.wordInfoName + '.docx'
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data])
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = label
          link.click()
          URL.revokeObjectURL(link.href)
        })
        .catch(console.error)
    },

    // 关闭弹框
    getBool(bool) {
      this.dialogFormVisible = bool
    },
    // 下载附件
    fileLinkToStreamDownload(id) {
      let res = downloadFile(id)
      return baseAddress + res.url
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
          return time.getTime() < date1 - 8.64e7
        }
      }
    },
    // 关闭缩略提示框的方法
    closePromptBox() {
      this.currentInfoCard = false
    },
    // 跳转到pdf页面
    toPdfPage(url) {
      if (!url) {
        console.log('没有url', url)
        this.$message({
          message: '暂无报告地址',
          type: 'warning'
        })
        return false
      } else {
        window.open(baseAddress + '/psjc/file' + url, '_blank')
      }
      console.log('url', !url)
    },

    init() {
      this.vectorLayer = new VectorLayer({ source: new VectorSource() })
      this.lightLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(6, 'rgba(0, 255, 255, 0.6)', 9, 'rgba(0, 255, 255, 0.6)')
      })
      this.map.addLayer(this.vectorLayer)
      this.map.addLayer(this.lightLayer)
      this.clickEvent = this.map.on('click', (evt) => {
        let feas = this.map.getFeaturesAtPixel(evt.pixel)
        if (feas.length !== 0) {
          let id = feas[0].get('id')
          this.openPromptBox({ id })
        } else {
          this.currentInfoCard = false
          this.lightLayer.getSource().clear()
        }
      })
      this.getPipeDefectData()
    },
    clearAll() {
      this.vectorLayer && this.map.removeLayer(this.vectorLayer)
      this.lightLayer && this.map.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
      this.popup && this.map.removeOverlay(this.popup)
    },
    // 获取缺陷数据
    getPipeDefectData() {
      getDefectData().then((res) => {
        if (res.code === 1) {
          if (res.result && res.result.length !== 0) {
            let reportInfo = res.result[0] ? res.result : [res.result]
            let pipeData = reportInfo.map(item => item.pipeStates).flat()
            let { strucDefectFeatures, funcDefectFeatures, pipeDefectFeatures } = this.getFeatures(pipeData)
            this.vectorLayer.getSource().clear()
            this.lightLayer.getSource().clear()
            if (strucDefectFeatures.length !== 0 || funcDefectFeatures.length !== 0 || pipeDefectFeatures.length !== 0) {
              this.vectorLayer.getSource().addFeatures([...strucDefectFeatures, ...funcDefectFeatures])
            }
            this.hasLoad = true
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    /**
     * 构造要素
     * @param featureArr 数组
     * */
    getFeatures(featureArr) {
      let style = null, features = { pipeDefectFeatures: [], funcDefectFeatures: [], strucDefectFeatures: [] }
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
            let findFuncColor = colors.find(colorObj => feaObj['funcClass'] && feaObj['funcClass'].includes(colorObj.level))
            let findStrucColor = colors.find(colorObj => feaObj['structClass'] && feaObj['structClass'].includes(colorObj.level))

            // 功能性缺陷
            if (findFuncColor) {
              let fFea = feature.clone()
              fFea.setStyle(comSymbol.getLineStyle(5, findFuncColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && fFea.set(i, feaObj[i])
              }
              features.funcDefectFeatures.push(fFea)
            }
            // 结构性缺陷
            if (findStrucColor) {
              let sFea = feature.clone()
              sFea.setStyle(comSymbol.getLineStyle(5, findStrucColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && sFea.set(i, feaObj[i])
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
                  { level: '/', img: defectImg0, index: 4 }
                ]
                let findimg = null

                if (feaObj.defectLevel) {
                  findimg = imgs.find(colorObj => feaObj['defectLevel'].includes(colorObj.level))
                }
                // 缺少 defectLevel 字段
                if (findimg) {
                  let rotation = getIconRat(lineCoors)
                  feature.setStyle(new Style({ image: new Icon({ size: [48, 48], anchor: [0.5, 0], offset:[0, -20], src: findimg.img, scale: 0.6, rotation }) }))
                  for (let i in  feaObj) {
                    i !== "geometry" && feature.set(i, feaObj[i])
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

      function getIconRat ([startPoint, endPoint]) {
        let rotation = 0
        // 因为要垂直管线显示，所以图片旋转 90°
        let imgRt = Math.PI / 2

        // 计算旋转弧度
        if (endPoint[0] === startPoint[0]) { // 竖直
          rotation = endPoint[1] > startPoint[1] ? -imgRt : Math.PI - imgRt
        } else if (endPoint[1] === startPoint[1]) { // 水平
          rotation = endPoint[1] > startPoint[1] ? Math.PI / 2 - imgRt : Math.PI * 3 / 2 - imgRt
        } else { // 其他角度
          rotation = Math.atan((endPoint[0] - startPoint[0]) / (endPoint[1] - startPoint[1])) - imgRt
        }
        return rotation
      }
    },
    // 上一张照片
    lastImg() {
      if (this.imgArrIndex <= 0) {
        this.imgArrIndex = 0
        return
      }
      this.imgArrIndex--
    },
    // 下一张照片
    nextImg() {
      if (this.imgArrIndex + 1 >= this.getCurrentForm.pipeDefects.length) {
        this.imgArrIndex = this.getCurrentForm.pipeDefects.length - 1
        return
      }
      this.imgArrIndex++
    },
    // 上一页
    lastPage() {
      if (this.currentIndex <= 0) {
        this.currentIndex = 0
        return
      }
      this.currentIndex--
    },
    // 下一页
    nextPage() {
      if (this.currentIndex + 1 >= this.currentForm.length) {
        this.currentIndex = this.currentForm.length - 1
        return
      }
      this.currentIndex++
    },
    setPositionByPipeId(id) {
      let features = this.vectorLayer.getSource().getFeatures()
      let filterFea = features.find((fea) => fea.get('id') === id)
      if (filterFea) {
        let feature = new Feature({
          geometry: filterFea.getGeometry().clone(),
          style: comSymbol.getAllStyle(5, '#DCDC8B', 5, '#DCDC8B')
        })
        this.lightLayer.getSource().clear()
        this.lightLayer.getSource().addFeature(feature)
        let center = new mapUtil().getCenterFromFeatures(feature)
        this.map.getView().setCenter(center)
        this.map.getView().setZoom(21)
        return center
      }
    },
    // 打开缩略提示框
    async openPromptBox(row, column, cell, event) {
      if (!this.hasLoad) return this.$message.warning('地图数据未加载完') 
      let position = this.setPositionByPipeId(row.id)
      console.log('打开缩略提示框', row)
      let res = await histroyPipeData({ expNo: row.expNo })
      this.currentIndex = 0
      this.currentForm = res.result
      this.currentInfoCard = true
      // 定位
      if (position) {
        this.popup = new Overlay({
          element: document.getElementById("popupCard"),
          //当前窗口可见
          autoPan: true,
          positioning: 'bottom-center',
          stopEvent: true,
          offset: [18, -25],
          autoPanAnimation: { duration: 250 }
        });
        this.map.addOverlay(this.popup)
        this.popup.setPosition(position)
      }
    },

    // 详情
    async openDetails(row) {
      this.id = row.id

      this.dialogFormVisible = true
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
      console.log('上传的参数', params)
      await queryPageAssessment(data).then((res) => {
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
  // 详情卡片的样式
  .detailsCrad {
    position: fixed;
    top: 100px;
    right: 45px;
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
      width: 550px;
      max-height: 80vh;
      border: none;
      border-radius: 5px;
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
        /deep/ .content-info {
          overflow-y: scroll;
          height: 600px;
          padding: 10px 20px;
          .info-title {
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
          }
          .info-box {
            height: 100%;
            display: flex;
            justify-content: space-between;
            .info-text {
              width: 37%;
              padding: 10px;
              box-sizing: border-box;
              background-color: #f3f7fe;
              border: 1px solid #dedede;
            }
            .info-video {
              width: 60%;
              border: 1px solid #dedede;
            }
          }
          /deep/ .el-form {
            .el-link--inner {
              max-width: 416px;
              /* 1.先强制一行内显示文本 */
              white-space: nowrap;
              /* 2.超出部分隐藏 */
              overflow: hidden;
              /* 3.文字用省略号替代超出的部分 */
              text-overflow: ellipsis;
            }
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
        }
      }
      .table-content {
        padding: 15px;
        .content-info {
          font-size: 12px;
          display: flex;
          justify-content: space-between;

          .left {
            flex: 1;
            .text-space {
              /deep/.el-link--inner {
                max-width: 240px;
                // 1.先强制一行内显示文本
                white-space: nowrap;

                // 2.超出部分隐藏
                overflow: hidden;
                // 3.文字用省略号替换超出的部分
                text-overflow: ellipsis;
              }
            }
          }
          /deep/ .right {
            flex: 1;
            .container {
              height: 100%;
              width: 100%;
              padding-top: 5px;
              box-sizing: border-box;
            }

            .is-top {
            }
            .el-tabs__content {
              height: 150px;
              width: 234px;
            }
            .el-tabs__item {
              margin: 11px 0 0 0 !important;
              background: transparent !important;
            }
            .el-tabs__header {
              border-top: 0 !important;
              background: transparent !important;
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
#popupCard {
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