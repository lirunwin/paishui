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
          <div class="title">检测时间：</div>
          <!-- <el-date-picker v-model="searchValue.testTime" type="date" placeholder="入库时间" class="date-css">
          </el-date-picker> -->
          <el-date-picker
            v-model="searchValue.testTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
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
          v-for="(v, i) in tableContent"
          :key="i"
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
      <div class="detailsCrad" style="top: 10%; left: 20%; right: 0" v-if="currentInfoCard">
        <el-card class="box-card">
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
                >{{ getCurrentForm.expNo + getCurrentForm.pipeType }}
                <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastPage"></i>
                {{ currentIndex + 1 }}/{{ currentForm.length }}
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
                <div class="detailsTitle">结构性缺陷 等级:{{ getCurrentForm.structClass }}</div>
                <p style="padding-left: 10px">评价:{{ getCurrentForm.structEstimate }}</p>
                <div class="detailsTitle">功能性缺陷 等级:{{ getCurrentForm.funcClass }}</div>
                <p style="padding-left: 10px">评价: {{ getCurrentForm.funcEstimate }}</p>
              </div>
              <div class="right">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane :label="`照片(${getCurrentForm.picnum || '0'})`" name="picnum">
                    <div class="container">
                      <img src="./testImg/test.png" alt="" srcset="" />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`视频(${getCurrentForm.viedoNum || '0'})`" name="viedoNum"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>

    <!-- 详情卡片 -->
    <transition name="el-fade-in-linear">
      <div class="detailsCrad" v-if="dialogFormVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px">管道检测详情</span>
            <span style="float: right; padding: 3px 0; cursor: pointer">
              <i class="el-icon-close" type="text" @click="dialogFormVisible = false"></i>
            </span>
          </div>
          <div class="content">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">检测信息</el-menu-item>
              <el-menu-item index="2">功能性缺陷（{{ DetailsForm.funcClass }}）</el-menu-item>
              <el-menu-item index="3">结构性缺陷（{{ DetailsForm.structClass }}）</el-menu-item>
              <el-menu-item index="4">工程信息</el-menu-item>
            </el-menu>
            <div class="content-info">
              <!-- 检测信息 -->
              <div class="box1" v-show="activeIndex == '1'">
                <div class="detailsTitle">管段信息</div>
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <el-row v-for="(v, i) in cardTableContent" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">检测信息</div>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="检测方向">
                        <el-input size="small" v-model="DetailsForm.detectDir" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="检测长度">
                        <el-input size="small" v-model="DetailsForm.checkLength" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="修复指数">
                        <el-input size="small" v-model="DetailsForm.repairIndex" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="养护指数">
                        <el-input size="small" v-model="DetailsForm.maintainIndex" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">管段剖面图</div>
                  <div id="profile_echatrs" style="width: 500px; display: flex; height: 200px"></div>
                </el-form>
              </div>
              <!-- 功能性缺陷 -->
              <div class="box1" v-show="activeIndex == '2'">
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <div class="detailsTitle">功能性缺陷评价（等级：{{ DetailsForm.funcClass }}）</div>
                  <el-row v-for="(v, i) in funcArr" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="[v[1].label]">
                        <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <el-form-item label="评价">
                        <el-input
                          size="small"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 4 }"
                          disabled
                          placeholder="无"
                          resize="none"
                          v-model="DetailsForm.funcEstimate"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">功能性缺陷评信息（{{ DetailsForm.funcDensity.toFixed(0) }}）</div>
                  <div v-if="!DetailsForm.funcDensity" style="text-align: center">
                    <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
                  </div>
                  <div
                    v-if="DetailsForm.funcDensity"
                    v-for="v in DetailsForm.funcDensity"
                    style="margin-top: 20px; height: 200px"
                  >
                    <div class="info-title">（CJ）沉积 距离：2m</div>
                    <div class="info-box">
                      <div class="info-text">
                        <p>分值：2</p>
                        <p>等级：2</p>
                        <p style="line-height: 15px">评价： 功能性缺陷，环向0611位置，纵向长度1m。</p>
                      </div>
                      <div class="info-video">
                        <img
                          src="./testImg/video.png"
                          alt="视频"
                          style="width: 100%; height: 100%; -webkit-user-drag: none"
                        />
                      </div>
                    </div>
                  </div>
                </el-form>
              </div>
              <!-- 结构性缺陷 -->
              <div class="box1" v-show="activeIndex == '3'">
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <div class="detailsTitle">结构性缺陷评价（等级：{{ DetailsForm.structClass }}）</div>
                  <el-row v-for="(v, i) in structArr" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <el-form-item label="评价">
                        <el-input
                          size="small"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 4 }"
                          disabled
                          placeholder="无"
                          resize="none"
                          v-model="DetailsForm.structEstimate"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">结构性缺陷信息（{{ DetailsForm.structDensity.toFixed(0) }}）</div>
                  <div v-if="!DetailsForm.structDensity" style="text-align: center">
                    <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
                  </div>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <div></div>
                    </el-col>
                  </el-row>
                  <div
                    v-if="DetailsForm.structDensity"
                    v-for="v in DetailsForm.structDensity"
                    style="margin-top: 20px; height: 200px"
                  >
                    <div class="info-title">（BX）变形 距离：1m</div>
                    <div class="info-box">
                      <div class="info-text">
                        <p>分值：0.50</p>
                        <p>等级：1</p>
                        <p style="line-height: 15px">
                          评价：
                          (部分或整体缺陷)无或有轻微管道缺陷，结构状况基本不受影响，但具有潜在变坏的可能。结构条件基本完好，不需要修复。
                        </p>
                      </div>
                      <div class="info-video">
                        <img src="./testImg/video.png" alt="视频" style="width: 100%; height: 100%" />
                      </div>
                    </div>
                  </div>
                </el-form>
              </div>
              <!-- 工程信息 -->
              <div class="box1" v-show="activeIndex == '4'">
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <div class="detailsTitle">工程信息</div>
                  <el-row v-for="(v, i) in projectArr" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input size="small" v-model="currentForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input size="small" v-model="currentForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <el-form-item label="检测报告">
                        <el-link
                          :href="'http://117.174.10.73:1114/psjc/file' + currentForm.wordFilePath"
                          type="primary"
                          >{{ currentForm.wordInfoName }}</el-link
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div style="width: 100%; height: 330px">
                    <img src="./testImg/video.png" alt="视频" style="width: 100%; height: 100%" />
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-card>
      </div>
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
import defectImgR from '@/assets/images/traingle-r.png'
import defectImgB from '@/assets/images/traingle-b.png'
import defectImgY from '@/assets/images/traingle-y.png'
import defectImgLB from '@/assets/images/traingle-lb.png'

import * as echarts from 'echarts'

export default {
  props: ['data'],
  data() {
    return {
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
      ], // 功能性数据
      projectArr: [
        [
          { label: '工程名称', name: 'prjName' },
          { label: '检测地点', name: 'checkAddress' }
        ],
        [
          { label: '检测日期', name: 'sampleTime' },
          { label: '检测人员', name: 'detectPerson' }
        ]
      ], // 工程信息数据
      DetailsForm: {}, // 详情表单
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
        { label: '工程名称', name: 'prjName' },
        { label: '管段编号', name: 'expNo' },
        { label: '管段类型', name: 'pipeType' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '材质', name: 'material' },
        { label: '结构性缺陷等级', name: 'structClass' },
        { label: '结构性缺陷评价', name: 'structEstimate' },
        { label: '功能性缺陷等级', name: 'funcClass' },
        { label: '缺陷数量', name: 'defectnum' },
        { label: '检测照片', name: 'picnum' },
        { label: '检测视频', name: 'viedoNum' },
        { label: '检测地点', name: 'checkAddress' },
        { label: '检测日期', name: 'sampleTime' }
      ],
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      searchValue: {
        testTime: '', // 检测日期
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
      currentDataProjName: 'proj43' // 当前坐标系
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
    // 提示框照片视频
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 提示框当前信息
    getCurrentForm() {
      let obj = { ...this.currentForm[this.currentIndex] }
      return obj ? Object.assign(obj, this.isPromptBox) : {}
    }
  },
  mounted() {
    // 更新剖面图
    // this.renderEcharts()
  },
  methods: {
    // 跳转到pdf页面
    toPdfPage(url) {
      console.log('url', url)
      window.open('http://117.174.10.73:1114/psjc/file' + url, '_blank')
    },
    // 绘制剖面图
    renderEcharts() {
      console.log('渲染echarts')
      let chartDom = document.getElementById('profile_echatrs')
      let myChart = echarts.init(chartDom)
      let option
      option = {
        xAxis: {
          type: 'category',
          data: [{ value: '起点ADDLWS0001' }, '', { value: '终点ADDLWS0001-1' }],
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '埋深：m',
          axisLine: {
            show: true //隐藏y轴
          },
          axisLabel: {
            show: false //隐藏刻度值
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          scale: false
        },
        series: [
          {
            data: [10, 11.5, 13],
            type: 'line',
            color: '#CFCCCC',
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true,
                formatter: function (a) {
                  console.log('标题参数', a)
                  return ` 埋深 ${a['name']}m `
                }
              },
              data: [
                { xAxis: 0, name: 2.15 },
                { xAxis: 2, name: 2.15 }
              ]
            }
          },

          {
            data: [
              { value: 10, name: '沉积', type: 'CJ' },
              { value: 11.5, name: '变形', type: 'BX' }
            ],
            type: 'line',
            symbol: 'triangle',
            symbolSize: 10,
            symbolOffset: [0, -20],
            itemStyle: {
              normal: {
                label: {
                  // formatter: '（CJ）{b}[0]，{c}m   ',
                  formatter: function (a) {
                    console.log('标题参数', a)
                    return `（${a['data']['type']}）${a['name']},${a['value']}m  `
                  },
                  backgroundColor: '#fff',
                  borderColor: '#8C8D8E',
                  borderWidth: 1,
                  borderRadius: 2,
                  lineHeight: 15,
                  padding: 5,
                  show: true,
                  textStyle: {
                    color: '#000'
                  }
                },
                textColor: 'red',
                borderWidth: 6,
                borderColor: '#E91111',
                color: '#2D74E7'
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
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
              pipeData = [...pipeData, ...pipeStates]
              defectData = [...defectData, ...pipeStates.map((pipe) => pipe.pipeDefects).flat()]
            })
            dFeas = this.getFeatures(defectData, 2)
            pFeas = this.getFeatures(pipeData, 1)
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
      this.setPositionByPipeId(row.id)
      console.log('打开缩略提示框', row)
      this.isPromptBox = { ...row }
      let res = await assessmentDefect(row.id)
      this.currentIndex = 0
      this.currentForm = res.result
      this.currentInfoCard = true
      console.log('打开缩略提示框2', this.currentForm, this.isPromptBox)
    },
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
      // console.log(key, keyPath)
      // console.log(this.activeIndex)
    },
    // 详情
    async openDetails(row) {
      this.currentForm = row
      // console.log('row', row)
      let res = await assessmentDetails(row.id)
      this.DetailsForm = res.result
      // 绘制剖面图
      // console.log('res', res)
      // let res = await histroyPipeData({ expNo: row.expNo })
      // this.cardTable = res.result
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.renderEcharts()
      })
    },
    // 获取字典id
    // async getParamsId() {
    //   // 获取字典id
    //   // uploadFileType
    //   let uploadFileTypeDicId = await queryDictionariesId({ keys: 'uploadFileType' })
    //   // uploadItem
    //   let uploadItemDictId = await queryDictionariesId({ keys: 'uploadItem' })
    //   uploadFileTypeDicId = uploadFileTypeDicId.result.uploadFileType
    //   uploadItemDictId = uploadItemDictId.result.uploadItem
    //   // await this.$refs.upload.submit()
    //   uploadFileTypeDicId.forEach((v) => {
    //     if (v.codeValue == 'wordInfoDoc') {
    //       this.updataParamsId.uploadFileTypeDicId = v.id
    //     }
    //   })
    //   uploadItemDictId.forEach((v) => {
    //     if (v.codeValue == 'tf_ywpn_wordinfo_w') {
    //       this.updataParamsId.uploadItemDictId = v.id
    //     }
    //   })
    // },
    // 打开附件列表对话框
    // async openDialogEnclosure() {
    //   this.updataParamsId.itemId = this.multipleSelection[0].id
    //   // console.log("this.updataParamsId",this.updataParamsId);
    //   await this.getParamsId()
    //   let params = {
    //     current: this.paginationEnclosure.current,
    //     size: this.paginationEnclosure.size,
    //     itemId: this.updataParamsId.itemId,
    //     uploadFileTypeDicId: this.updataParamsId.uploadFileTypeDicId,
    //     uploadItemDictId: this.updataParamsId.uploadItemDictId
    //   }
    //   let res = await queryPageEnclosure(params)
    //   this.dialogEnclosure = true
    // },
    // 导出
    // async exportFile() {
    //   console.log('选择列信息', this.multipleSelection)
    //   let id = this.multipleSelection[0].id
    //   let res = await downloadFile(id)
    //   console.log('res', res)
    // },
    // 重置
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
        data.jcStartDate = params.testTime[0]
        data.jcEndDate = params.testTime[1]
        data.queryParams = params.queryParams
        data.funcClass = params.funcClass
        data.structClass = params.structClass
      }
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
</style>