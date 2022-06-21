<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道检测历史管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            size="small"
            placeholder="请输入管段编号、道路名称"
            v-model="searchParams.keyword"
            clearable
            class="serch-input"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <!-- <el-date-picker v-model="searchParams.jcDate" type="date" placeholder="选择日期" class="date-css">
          </el-date-picker> -->
          <div class="sampleTime">
            <el-row style="display: flex; justify-content: center; align-items: center">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchParams.jcDate.startDate"
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
                  v-model="searchParams.jcDate.finishDate"
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
          <el-select clearable v-model="searchParams.funcClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i + gradeArr.length" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select clearable v-model="searchParams.structClass" placeholder="全部">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="right-btn">
          <el-button size="small" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button size="small" type="primary" @click="resetBtn"> 重置 </el-button>
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
        <el-table-column  align="center" type="index" label="序号" width="50"> </el-table-column>
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

        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDetails(scope.row)">详情</el-button>
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
    <!-- 详情卡片 -->
    <transition name="el-fade-in-linear">
      <div class="histroyPipeData" v-show="dialogFormVisible">
        <div class="detailsCrad" v-show="dialogFormVisible">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-size: 16px">管道检测历史详情（{{ detailsTitle.pipeType + detailsTitle.expNo }}）</span>
              <span style="float: right; padding: 3px 0; cursor: pointer; user-select: none">
                <i class="el-icon-caret-left" type="text" @click="lastPage"></i>
                {{ currentIndex + 1 }}/{{ cardTable.length }}
                <i class="el-icon-caret-right" type="text" @click="nextPage"></i>
                <i class="el-icon-close" type="text" @click="dialogFormVisible = false"></i>
              </span>
            </div>
            <div class="content">
              <div class="box1">
                <el-form ref="form" :model="tableForm" label-width="auto" label-position="right">
                  <div class="detailsTitle">管段信息</div>
                  <el-row v-for="v in cardTableContent" :key="v[0].name">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input size="small" v-model="tableForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input size="small" v-model="tableForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">检测历史</div>
                  <div class="historyList" v-if="currentForm.jcNum">
                    <div class="historyTitle">
                      <div>
                        <span style="margin-right: 40px">{{ tableForm.sampleTime }}</span>
                        <span v-if="tableForm.funcClass"> 功能性缺陷（{{ tableForm.funcClass }}）</span>
                        <span v-else> 结构性缺陷（{{ tableForm.structClass }}）</span>
                      </div>
                      <el-link type="primary" @click="openCheck(tableForm.id)">详情</el-link>
                    </div>
                    <!-- 内容 -->
                    <div style="margin-top: 20px; height: 200px">
                      <div class="info-box">
                        <div
                          class="info-text"
                          style="width: 48%; display: flex; justify-content: center; align-items: center"
                        >
                          <el-form label-position="right" label-width="70px" :model="currentForm" size="mini">
                            <el-form-item label="工程名称">
                              <el-input v-model="tableForm.prjName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="工程地点">
                              <el-input v-model="tableForm.checkAddress" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="检测单位">
                              <el-input v-model="tableForm.detectDept" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="检测人员">
                              <el-input v-model="tableForm.detectPerson" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="检测报告">
                              <div class="text-space">
                                <el-link
                                  style="font-size: 12px; margin-left: 10px"
                                  v-if="tableForm.wordFilePath"
                                  type="primary"
                                  @click.stop="downloadDocx"
                                  >{{ tableForm.wordInfoName + 'docx' }}</el-link
                                >
                              </div>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div class="info-video">
                          <el-tabs v-model="activeName">
                            <el-tab-pane :label="'照片（' + urlArr.length + '）'" name="first">
                              <div class="image-list">
                                <el-image
                                  style="width: 100%; height: 80%; margin-top: 6px; -webkit-user-drag: none"
                                  :src="getImgUrl"
                                  :preview-src-list="urlArr"
                                >
                                </el-image>

                                <div
                                  ref="scrollContainer"
                                  style="
                                    height: 20%;
                                    margin-top: 4px;
                                    cursor: pointer;
                                    white-space: nowrap;
                                    overflow: hidden;
                                  "
                                  @mousewheel="MouseWheel"
                                >
                                  <el-image
                                    v-for="(v, i) in urlArr"
                                    :key="i"
                                    style="width: 40px; height: 30px; margin-right: 4px; -webkit-user-drag: none"
                                    :src="v"
                                    @click="imgArrIndex = i"
                                  >
                                  </el-image>
                                </div>
                              </div>
                            </el-tab-pane>
                            <el-tab-pane label="视频" name="second">
                              <div style="width: 100%; height: 155px" v-if="tableForm.videoPath">
                                <video controls="controls" width="100%" height="83%">
                                  <source :src="getVideoUrl" type="video/mp4" />
                                </video>
                              </div>
                              <div v-show="!tableForm.videoPath" style="text-align: center; margin-top: 20px">
                                暂无视频
                              </div>
                            </el-tab-pane>
                          </el-tabs>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!currentForm.jcNum" style="text-align: center">
                    <img
                      style="width: 100px; height: 100px; -webkit-user-drag: none"
                      src="@/assets/images/nullData.png"
                      alt="暂无数据"
                      srcset=""
                    />
                    <p style="color: #999999; font-size: 14px">暂无数据</p>
                  </div>
                </el-form>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </transition>
    <!-- 管段检测详情卡片 -->
    <transition name="el-fade-in-linear">
      <delete-dialog @sendBool="getBool" v-show="checkdialogFormVisible" :checkParam="id"></delete-dialog>
    </transition>
    
    <!-- 管道弹窗 -->
    <transition name="el-fade-in-linear">
      <div id="popupCardIns" class="PipeEvData" v-show="currentInfoCard2">
        <div class="detailsCrad" v-if="currentInfoCard2">
          <el-card class="box-card" style="width: 440px; min-height: 310px; border: none; border-radius: 5px">
            <div class="table-content">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              >
                <span style="font-weight: bold; user-select: none"
                  >{{ getCurrentForm.expNo || '' + getCurrentForm.pipeType || '' }}
                  <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastPageEv"></i>
                  {{ currentForm2.length ? currentIndex2 + 1 : 0 }}/{{ currentForm2.length }}
                  <i class="el-icon-caret-right" style="cursor: pointer" type="text" @click="nextPageEv"></i>
                </span>
                <a
                  style="font-size: 12px; color: #2d74e7; text-decoration: underline"
                  @click="openCheck(getCurrentForm.id)"
                  >详情</a
                >
              </div>
              <div style="margin-top: 10px; font-size: 12px">
                管径：{{ getCurrentForm.diameter }}mm 材质：{{ getCurrentForm.material }}
              </div>
              <div class="content-info" style="justify-content: space-between; display: flex; font-size: 12px">
                <div class="left" style="width: 200px">
                  <div class="detailsTitle" style="margin-top: 5px">检测日期 {{ getCurrentForm.sampleTime }}</div>
                  <!-- <p style="padding-left: 10px">无文档</p> -->
                  <div class="text-space" style="margin: 10px 0">
                    <el-link
                      style="font-size: 12px; margin-left: 10px"
                      v-if="getCurrentForm.wordFilePath"
                      type="primary"
                      @click.stop="downloadDocx2"
                      ><div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                        {{ getCurrentForm.wordInfoName + 'docx' }}
                      </div></el-link
                    >
                  </div>
                  <div class="detailsTitle">结构性缺陷 等级:{{ getCurrentForm.structClass }}</div>
                  <p style="padding-left: 10px">评价: {{ getCurrentForm.structEstimate }}</p>
                  <div class="detailsTitle">功能性缺陷 等级:{{ getCurrentForm.funcClass }}</div>
                  <p style="padding-left: 10px">评价: {{ getCurrentForm.funcEstimate }}</p>
                </div>
                <div class="right" style="width: 250px; margin-left: 20px; min-height: 240px">
                  <el-tabs v-model="activeName2">
                    <!-- <el-tab-pane :label="`照片(${getCurrentForm.pipeDefects ? (getCurrentForm.pipeDefects.length || 0): 0})`" name="picnum"> -->
                      <el-tab-pane :label="`照片`" name="picnum">
                      <div class="container">
                        <el-image
                          style="width: 100%; height: 90%; -webkit-user-drag: none"
                          :src="getImgUrlEV"
                          :preview-src-list="getImgUrlArrEV"
                        >
                        </el-image>
                        <div style="text-align: center">
                          <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastImg"></i>
                          {{ getCurrentForm.pipeDefects ? (getCurrentForm.pipeDefects.length ? imgArrIndex + 1 : 0) : 0 }}/{{
                            getCurrentForm.pipeDefects ? (getCurrentForm.pipeDefects.length || 0) : 0
                          }}
                          <i class="el-icon-caret-right" style="cursor: pointer" type="text" @click="nextImg"></i>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`视频`" name="viedoNum">
                      <div style="width: 100%; height: 100%" v-if="getCurrentForm.videoPath">
                        <video controls="controls" width="100%" height="83%">
                          <source :src="getVideoUrlEV" type="video/mp4" />
                        </video>
                      </div>
                      <div v-show="!getCurrentForm.videoPath" style="text-align: center; margin-top: 20px">
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

  </div>
</template>

<script>
import { queryPageHistory, histroyPipeData, downloadFile } from '@/api/pipelineManage'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature, Overlay } from 'ol'
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
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
// 引入管道检测组件
import deleteDialog from '../components/checkDetails.vue'
// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'
import axios from 'axios'
export default {
  props: ['data'],
  components: {
    deleteDialog
  },
  data() {
    return {
      multipleSelection: [], // 选中的表格
      id: null,
      checkdialogFormVisible: false,
      imgArrIndex: 0,
      urlArr: [],
      activeName: 'first',
      activeName2: "picnum",
      currentForm: {}, // 当前详情表单
      detailsTitle: {}, // 详情头部信息
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
      currentIndex: 0, // 详情页数
      cardTable: [], // 详情表格数据
      activeIndex: '1', // 详情导航索引
      dialogFormVisible: false, // 详情弹框显影
      // 表格参数
      tableContent: [
        { width: '100', sortable: false, label: '管段编号', name: 'expNo' },
        { width: '100', sortable: false, label: '管段类型', name: 'pipeType' },
        { width: '120', sortable: true, label: '管径(mm)', name: 'diameter' },
        { width: '100', sortable: false, label: '材质', name: 'material' },
        // { width: '100',sortable: false,label: '道路名称', name: 'checkAddress' },
        { width: '100', sortable: false, label: '所属片区', name: 'checkAddress' },
        { width: '100', sortable: true, label: '检测次数', name: 'jcNum' },
        { width: '100', sortable: true, label: '最近检测日期', name: 'newJcDate' },
        { width: '180', sortable: true, label: '最新结构性缺陷等级', name: 'newStructClass' },
        { width: '180', sortable: false, label: '最新结构性缺陷评价', name: 'newStructEstimate' },
        { width: '180', sortable: true, label: '最新功能性缺陷等级', name: 'newFuncClass' },
        { width: '', sortable: false, label: '最新功能性缺陷评价', name: 'newFuncEstimate' }
      ],
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      // 搜索需要的参数
      searchParams: {
        jcStatus: [],
        keyword: '',
        jcDate: {
          startDate: '',
          finishDate: ''
        },
        defectLevelA: '',
        defectLevelB: ''
      },
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
      isPromptBox: {}, // 当前列信息
      form: {},
      //
      vectorLayer: null,
      map: null,
      lightLayer: null,
      clickEvent: null,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj44', // 当前坐标系
      // 
      currentInfoCard2: false,
      currentForm2: [],
      currentIndex2: 0,
      popup: null,
      hasLoad: false

    }
  },
  created() {
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
  watch: {
    '$store.state.map.halfP_editableTabsValue': function (n, o) {
      if (n !== 'pipelineInspection') {
        this.clearAll()
        this.hasData = false
      } else {
        this.init()
      }
    },
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n === '检测成果专题图') this.clearAll()
    },
    'searchParams.jcDate.startDate': function (n) {
      this.searchParams.jcDate.finishDate = n
    }
  },
  computed: {
    // 获取文件url
    getImgUrlEV() {
      let address = baseAddress + '/psjc/file' + this.getCurrentForm.pipeDefects[this.imgArrIndex].picPath
      console.log('address', address)
      return address
    },
    getVideoUrlEV() {
      console.log('照片', this.getCurrentForm.pipeDefects.length)
      let address = baseAddress + '/psjc/file' + this.getCurrentForm.videoPath
      console.log('address', address)
      return address
    },
    // 获取文件url
    getImgUrl() {
      let address = this.urlArr[this.imgArrIndex]
      console.log('address', address)
      return address
    },
    getVideoUrl() {
      let address = baseAddress + '/psjc/file' + this.tableForm.videoPath
      console.log('address', address)
      return address
    },
    tableForm() {
      // console.log("当前详情页数",this.cardTable[this.currentIndex]);
      return this.cardTable[this.currentIndex] || {}
    },
    getCurrentForm () {
      return this.currentForm2 ? this.currentForm2[this.currentIndex2] : {}
    },
    getImgUrlArrEV() {
      let arr = this.getCurrentForm.pipeDefects.map((v) => {
        return baseAddress + '/psjc/file' + v.picPath
      })
      return arr
    }
  },
  methods: {
    lastImg() {
      console.log('上一张照片', this.getCurrentForm.pipeDefects)

      if (this.imgArrIndex <= 0) {
        this.imgArrIndex = 0
        return
      }
      this.imgArrIndex--
    },
    nextImg() {
      if (this.imgArrIndex + 1 >= this.getCurrentForm.pipeDefects.length) {
        this.imgArrIndex = this.getCurrentForm.pipeDefects.length - 1
        return
      }
      this.imgArrIndex++
    },
    // 下载文档
    downloadDocx() {
      this.$message('正在加载文档地址...')
      let url = baseAddress + '/psjc/file' + this.tableForm.wordFilePath
      let label = this.tableForm.wordInfoName + '.docx'
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
    downloadDocx2() {
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
    // 照片缩略图列表滑动事件
    MouseWheel(e) {
      let eventDelta = -e.wheelDelta || -e.deltaY * 40

      let $scrollWrapper = this.$refs.scrollContainer
      console.log('触发滑动事件', eventDelta, $scrollWrapper)

      // console.log($scrollWrapper.scrollLeft)

      // 0到scrollLeft为滚动区域隐藏部分

      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
      console.log('盒子位置', $scrollWrapper.scrollLeft)
    },
    // 打开管道详情
    openCheck(id) {
      // this.id = this.tableForm.id
      this.id = id
      // console.log("打开详情",this.tableForm.id);
      this.checkdialogFormVisible = true
    },
    // 关闭弹框
    getBool(bool) {
      this.checkdialogFormVisible = bool
    },
    // 下载附件
    fileLinkToStreamDownload(id) {
      let res = downloadFile(id)
      return baseAddress + res.url
    },
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      if (!this.searchParams.jcDate.startDate) {
        this.searchParams.jcDate.startDate = this.searchParams.jcDate.finishDate
      }
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.searchParams.jcDate.startDate).getTime()
      let date2 = new Date(this.searchParams.jcDate.finishDate).getTime()
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
    init() {
      this.getDate()
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
          let expNo = feas[0].get('expNo')
          this.openPromptBox({ expNo })
        } else {
          this.currentInfoCard2 = false
          this.dialogFormVisible = false
          this.popup && this.popup.setPosition(null)
          this.lightLayer.getSource().clear()
        }
      })
      this.getPipeDefectData()
    },
    clearAll() {
      this.vectorLayer && this.map.removeLayer(this.vectorLayer)
      this.lightLayer && this.map.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
      this.popup && this.popup.setPosition(null)
      this.currentInfoCard2 = false
      this.vectorLayer = this.lightLayer = this.clickEvent = this.popup = null
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
              this.vectorLayer.getSource().addFeatures([...strucDefectFeatures, ...funcDefectFeatures])
            }
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
            let fFea = feature.clone()
            let fColor = findFuncColor ? findFuncColor.color : '#070358'
            fFea.setStyle(comSymbol.getLineStyle(5, fColor))
            for (let i in feaObj) {
              i !== 'geometry' && fFea.set(i, feaObj[i])
            }
            features.funcDefectFeatures.push(fFea)
          
          // 结构性缺陷

            let sFea = feature.clone()
            let sColor = findStrucColor ? findStrucColor.color : '#070358'
            sFea.setStyle(comSymbol.getLineStyle(5, sColor))
            for (let i in feaObj) {
              i !== 'geometry' && sFea.set(i, feaObj[i])
            }
            features.strucDefectFeatures.push(sFea)
          
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
    // 根据状态设置每列表格样式
    modality(obj) {
      // 通过id标识来改变当前行的文字颜色
      let expNoArr
      if (this.multipleSelection != []) {
        expNoArr = this.multipleSelection.map((v) => v.expNo)
      }
      if (expNoArr.some((v) => v == obj.row.expNo)) {
        return 'rowBgBlue'
      }
    },

    async openPromptBox(row) {
      console.log('打开弹窗')
      if (!this.hasLoad) return this.$message.warning('地图数据未加载完')
      // 点击行勾选数据
      let length = this.multipleSelection.length
      let expNo = this.multipleSelection.length == 1 ? this.multipleSelection[0].expNo : null
      // let
      this.$refs.multipleTable.clearSelection(row)
      if (length > 1 || length < 1) {
        this.$refs.multipleTable.toggleRowSelection(row)
      } else if (expNo) {
        if (row.expNo == expNo) {
          this.$refs.multipleTable.toggleRowSelection(row, false)
        } else {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      }
      
      if (!(this.vectorLayer && this.lightLayer)) return
      let fea = this.vectorLayer.getSource().getFeatures().find(fea => fea.get('expNo') === row.expNo)
      let center = mapUtil.getCenter(fea)
      if (center instanceof Array) {
        let resEV = await histroyPipeData({ expNo: row.expNo })
        this.lightLayer.getSource().clear()
        this.currentIndex2 = 0
        this.currentForm2 = resEV.result
        this.currentInfoCard2 = true
        this.popup = new Overlay({
          element: document.getElementById('popupCardIns'),
          autoPan: true,
          positioning: 'bottom-center',
          stopEvent: true,
          offset: [18, -25],
          autoPanAnimation: { duration: 250 }
        })
        this.map.addOverlay(this.popup)
        this.popup.setPosition(center)

        this.lightLayer.getSource().addFeature(new Feature({ geometry: fea.getGeometry().clone() }))
        let view = this.map.getView()
        this.map.getView().animate({ zoom: 19 }, { center }, { duration: 0.5 })
      } else this.$message.error('该管线无位置信息!')
    },
    // 上一页
    lastPage() {
      if (this.currentIndex <= 0) {
        this.currentIndex = 0
        return
      }
      this.currentIndex--
      // this.openDetails(this.isPromptBox)
    },
    // 下一页
    nextPage() {
      if (this.currentIndex + 1 >= this.cardTable.length) {
        this.currentIndex = this.cardTable.length - 1
        return
      }
      this.currentIndex++
      // this.openDetails(this.isPromptBox)
    },
    // 上一页
    lastPageEv() {
      if (this.currentIndex2 <= 0) {
        this.currentIndex2 = 0
        return
      }
      this.currentIndex2--
      // this.openDetails(this.isPromptBox)
    },
    // 下一页
    nextPageEv() {
      if (this.currentIndex2 + 1 >= this.currentForm2.length) {
        this.currentIndex2 = this.currentForm2.length - 1
        return
      }
      this.currentIndex2++
      // this.openDetails(this.isPromptBox)
    },
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(key, keyPath)
      console.log(this.activeIndex)
    },
    // 详情
    async openDetails(row) {
      console.log('详情触发')

      this.currentForm = row // 保存当前列信息
      this.isPromptBox = { ...row }
      let res = await histroyPipeData({ expNo: row.expNo })
      this.detailsTitle = {
        expNo: row.expNo,
        pipeType: row.pipeType
      }
      this.cardTable = res.result

      this.urlArr = this.tableForm.pipeDefects.map((v) => {
        return baseAddress + '/psjc/file' + v.picPath
      })
      this.dialogFormVisible = true
    },
    // 重置
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchParams = {
        keyword: '',
        jcDate: {
          startDate: '',
          finishDate: ''
        },
        funcClass: '',
        structClass: ''
      }
      this.changeDate()
      await this.getDate()
    },
    // 搜索
    searchApi() {
      this.getDate()
    },
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页触发的事件
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
    // 查询数据
    async getDate() {
      let data = { ...this.pagination }
      data.wordInfoState = 1

        data.jcStartDate = this.searchParams.jcDate.startDate
        data.jcEndDate = this.searchParams.jcDate.finishDate
        data.queryParams = this.searchParams.keyword
        data.state = this.searchParams.checkList
        data.funcClass = this.searchParams.funcClass
        data.structClass = this.searchParams.structClass

      console.log('最后传进去的参数', data)
      await queryPageHistory(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
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
      font-size: 12px;
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
        .release-radio {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .el-radio {
            margin-right: 10px;
          }
          .release-title {
            margin: 0 10px;
          }
          .el-checkbox {
            margin-right: 12px;
          }
        }
        .serch-input {
          width: 245px;
          // margin-right: 20px;
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
          margin-left: 10px;
        }
      }

      .right-btn {
        margin-bottom: 14px;
        display: flex;
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

  .histroyPipeData {
    position: fixed;
    top: 120px;
    z-index: 999;
    right: 50px;
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
          }
        }
        .content {
          height: 600px;
          // padding: 22px;
          // box-sizing: border-box;
          .box1 {
            overflow-y: scroll;
            // max-height: 545px;
            height: 100%;
            padding: 10px 20px;
            .el-row {
              padding: 0 10px;
            }
            .historyList {
              .historyTitle {
                height: 30px;
                color: #555555;
                font-weight: bold;
                padding: 5px 10px;
                box-sizing: border-box;
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #f6f9fe;
              }

              .info-box {
                height: 100%;
                display: flex;
                margin: 5px 0;
                justify-content: space-between;
                .info-text {
                  width: 48%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  .el-form {
                    .el-form-item {
                      margin-bottom: 10px;
                    }
                    .el-link--inner {
                      max-width: 140px;
                      /* 1.先强制一行内显示文本 */
                      white-space: nowrap;
                      /* 2.超出部分隐藏 */
                      overflow: hidden;
                      /* 3.文字用省略号替代超出的部分 */
                      text-overflow: ellipsis;
                    }
                  }
                }
                .info-video {
                  width: 48%;
                  .image-list {
                    height: 155px;
                    display: flex;
                    flex-direction: column;
                  }
                  .el-tabs {
                    .el-tabs__nav-wrap {
                      width: 100% !important;
                    }
                    .el-tabs__item {
                      margin: 11px 0 0 0 !important;
                      background: transparent !important;
                    }
                    .el-tabs__header {
                      border-top: 0 !important;
                      background: transparent !important;
                    }
                  }
                }
              }
            }

            .el-textarea__inner,
            .el-input__inner {
              color: #666;
            }
            .detailsTitle {
              position: relative;
              font-size: 16px;
              padding: 5px 10px;
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
        .table-content {
          padding: 15px;
          /deep/ .content-info {
            font-size: 12px;
            display: flex;
            justify-content: space-between;

            .detailsTitle {
              position: relative;
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
  .PipeEvData {
    position: fixed;
    top: 100px;
    right: 45px;
    z-index: 9;
    .detailsCrad {
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }

      .box-card {
        width: 550px;
        min-height: 310px;
        border: none;
        border-radius: 5px;
        /deep/ .el-card__header {
          height: 48px;
          color: #fff;
          background-color: #2d74e7;
        }
        /deep/.el-card__body {
          padding: 15px !important;
          .el-menu-item {
            height: 45px;
            font-size: 16px;
          }
        }
        .content {
          .content-info {
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
            /deep/.el-form {
              .el-link--inner {
                max-width: 416px;
                /* 1.先强制一行内显示文本 */
                white-space: nowrap;
                /* 2.超出部分隐藏 */
                overflow: hidden;
                /* 3.文字用省略号替代超出的部分 */
                text-overflow: ellipsis;
              }
              /deep/.is-disabled {
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
            /deep/.el-textarea__inner,
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
                margin: 10px 0;
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
            .right {
              flex: 1;

              /deep/.is-top {
                margin: 0 0 10px;
              }
              // .el-tabs__header{
              //   border-top: none;
              //       margin-bottom: 6px;
              //   background-color: transparent !important;
              // }
              /deep/.el-tabs {
                .container {
                  height: 100%;
                  width: 100%;
                  padding-top: 5px;
                  box-sizing: border-box;
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
}



#popupCardIns {
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