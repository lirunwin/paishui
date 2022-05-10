<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 检测报告管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            placeholder="搜索工程名称、地点、报告名称"
            v-model="searchValue.serchValue"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <el-date-picker
            v-model="searchValue.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <div class="release-radio">
            <p class="release-title">发布状态:</p>
            <el-checkbox-group v-model="searchValue.checkList">
              <el-checkbox label="0">未发布</el-checkbox>
              <el-checkbox label="1">已发布</el-checkbox>
            </el-checkbox-group>
            <!-- <el-radio v-model="searchValue.checkList" label="0">未发布</el-radio> -->
            <!-- <el-radio v-model="searchValue.checkList" label="1">已发布</el-radio> -->
          </div>
          <el-button class="serch-btn" icon="el-icon-search" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" icon="el-icon-refresh-right" type="primary" @click="resetDate"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" type="primary" @click="showUpdata">报告上传</el-button>
          <!-- <el-button class="serch-btn" type="primary" @click="dialogFormVisible2 = true">视频上传</el-button> -->
          <el-button class="serch-btn" type="primary" @click="videoShowUpdata">视频上传</el-button>
          <el-button
            class="serch-btn"
            type="primary"
            :disabled="!multipleSelection.length"
            @click="batchReleaseDialog = true"
            >批量发布</el-button
          >
          <el-button
            class="serch-btn"
            icon="el-icon-delete"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="removeBtn"
            >删除</el-button
          >
        </div>
      </div>
      <!-- <el-empty description="暂无数据" v-if="!tableData"></el-empty> -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        height="250"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-dblclick="openDetails"
        @row-click="openPromptBox"
      >
        <template slot="empty">
          <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
        </template>
        <el-table-column header-align="center" :selectable="checkSelect" align="center" type="selection" width="55">
        </el-table-column>
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

        <el-table-column prop="state" header-align="center" label="发布状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{ stateRedClass: scope.row.state == '0', stateGreenClass: scope.row.state == '1' }">{{
              scope.row.state | filter_state
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="##FFDF84"
              title="确定要撤回吗?"
              v-if="scope.row.state == '1'"
              @confirm="withdrawBtn(scope.row.id)"
            >
              <el-button slot="reference" type="text" size="small" :wu="scope">撤回</el-button>
            </el-popconfirm>
            <el-button
              type="text"
              size="small"
              :wu="scope"
              v-if="scope.row.state == '0'"
              @click="testReportDetails(scope.row.id, true)"
              >发布</el-button
            >
            <el-button
              type="text"
              size="small"
              :wu="scope"
              style="margin-left: 10px"
              @click="testReportDetails(scope.row.id)"
              >详情</el-button
            >
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
    <!-- 批量发布 -->
    <div class="public-box">
      <el-dialog title="批量发布" :visible.sync="batchReleaseDialog" width="30%">
        <span>确定要发布选中的信息吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchReleaseDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmRelease">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 报告上传 -->
    <div class="public-box">
      <el-dialog title="检测报告上传" @close="closeDialog" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="工程名称" :label-width="formLabelWidth" prop="name">
            <el-select
              clearable
              v-model="form.name"
              placeholder="请选择工程名称"
              v-selectLoadMore="selectLoadMore"
              @blur="initSelectDate"
              filterable
              :disabled="loadingBool"
            >
              <el-option v-for="(item, i) in selectArr" :key="i" :label="item.name" :value="item.No"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="检测报告" :label-width="formLabelWidth" class="hd-input" prop="report">
            <!-- action="http://192.168.2.78:1111/psjc/pipeState/pipeStateUpload" -->
            <el-upload
              :on-change="getFile"
              ref="updataDocx"
              class="upload-demo"
              :headers="uploadHeaders"
              action="http://117.174.10.73:1114/psjc/sysUploadFile/uploadFile"
              accept=".doc,.docx"
              :data="getData"
              multiple
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-remove="beforeRemove"
              :on-progress="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
            >
              <div class="btn-box">
                <el-button size="small" type="primary" :disabled="loadingBool">选择报告</el-button>
                <span class="btns"
                  ><el-button type="primary" :icon="isLoading" @click.stop="uploadWord" :disabled="loadingBool"
                    >确 定</el-button
                  >
                  <el-button @click.stop="hideUpdataDocx">取 消</el-button></span
                >
              </div>
              <div slot="tip" class="el-upload__tip">
                <p style="line-height: 10px">只能上传docx/doc文件</p>
                <el-table
                  ref="singleTable"
                  :data="upDataTable"
                  stripe
                  highlight-current-row
                  style="width: 100%"
                  height="250"
                >
                  <template slot="empty">
                    <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
                  </template>

                  <el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
                  <el-table-column property="name" label="视频名称" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column property="size" label="视频大小" align="center" width="80"> </el-table-column>
                  <el-table-column property="status" label="上传进度" align="center" width="80">
                    <!-- filter_schedule -->
                    <template slot-scope="scope">
                      <p
                        :class="{
                          'font-green': scope.row.status == 'success',
                          'font-blue': scope.row.status == 'uploading'
                        }"
                      >
                        {{ scope.row.status | filter_schedule }}
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 视频上传 -->
    <div class="public-box">
      <el-dialog title="附件视频上传" @close="closeDialog" :visible.sync="dialogFormVisible2">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="工程名称" :label-width="formLabelWidth" prop="name">
            <el-select
              clearable
              v-model="form.name"
              placeholder="请选择工程名称"
              v-selectLoadMore="selectLoadMoreVideo"
              @blur="initSelectDate"
              filterable
              :disabled="loadingBool"
            >
              <el-option v-for="(item, i) in videoSelectArr" :key="i" :label="item.name" :value="item.No"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检测视频" :label-width="formLabelWidth" class="hd-input" prop="report">
            <!-- action="http://192.168.2.78:1111/psjc/pipeState/pipeStateUpload" -->
            <el-upload
              :on-change="getFile"
              :show-file-list="false"
              ref="updataVideo"
              class="upload-demo"
              :headers="uploadHeaders"
              action="http://117.174.10.73:1114/psjc/sysUploadFile/uploadFile"
              accept=".mp4"
              :data="getVideoData"
              multiple
              :on-success="handleAvatarSuccessVideo"
              :before-remove="beforeRemove"
              :on-progress="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
            >
              <div class="btn-box">
                <el-button size="small" type="primary" :disabled="loadingBool">选择视频</el-button>
                <span class="btns"
                  ><el-button type="primary" :icon="isLoading" @click.stop="uploadVideoWord" :disabled="loadingBool"
                    >确 定</el-button
                  >
                  <el-button @click.stop="hideUpdataDocx">取 消</el-button></span
                >
              </div>

              <div slot="tip" class="el-upload__tip">
                <p style="line-height: 10px">只能上传mp4文件</p>
                <el-table
                  ref="singleTable"
                  :data="upDataTable"
                  stripe
                  highlight-current-row
                  style="width: 100%"
                  height="250"
                >
                  <template slot="empty">
                    <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
                  </template>
                  <el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
                  <el-table-column property="name" label="视频名称" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column property="size" label="视频大小" align="center" width="80"> </el-table-column>
                  <el-table-column property="status" label="上传进度" align="center" width="80">
                    <!-- filter_schedule -->
                    <template slot-scope="scope">
                      <p
                        :class="{
                          'font-green': scope.row.status == 'success',
                          'font-blue': scope.row.status == 'uploading'
                        }"
                      >
                        {{ scope.row.status | filter_schedule }}
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 发布 -->
    <div class="public-box">
      <el-dialog
        title="检测报告发布"
        :visible.sync="dialogFormVisible3"
        @open="openRelease"
        @close="closeRelease"
        :fullscreen="true"
      >
        <div class="releaseTop-box">
          <!-- 左边部分 -->
          <div class="left">
            <el-tabs v-model="activeLeft" @tab-click="handleClick">
              <el-tab-pane label="统计汇总" name="first">
                <div class="releaseContent">
                  <div class="detailsTitle">主要工程量表</div>
                  <project-form :paramId="id"></project-form>
                  <div class="detailsTitle">检查井检查情况汇总表</div>
                  <inspect-form></inspect-form>
                  <div class="detailsTitle">管道缺陷数量统计表</div>
                  <summary-form :tabelData="returnTabel"></summary-form>
                  <div class="detailsTitle">管道缺陷数量统计图</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="检查井缺陷" name="second">检查井缺陷</el-tab-pane>
              <el-tab-pane label="管道缺陷" name="third">管道缺陷</el-tab-pane>
              <el-tab-pane label="管段状态评估" name="fourth">管段状态评估</el-tab-pane>
            </el-tabs>
          </div>
          <!-- 右边部分 -->
          <div class="right">
            <el-tabs v-model="activeRight" @tab-click="handleClick">
              <el-tab-pane label="原始检测报告" name="one">
                <div class="releaseContent">
                  <pdf-see></pdf-see>
                </div>
              </el-tab-pane>
              <el-tab-pane label="数据地图" name="two">
                <!-- 数据地图 -->
                <div class="map-box">
                  <simple-map @afterMapLoad="afterMapLoad" ref="myMap"></simple-map>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="isRelease" @click="oneReleaseBtn">发 布</el-button>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 删除提示框 -->
    <div class="delete-box">
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
        <div style="display: flex; align-items: center">
          <!-- <i class="el-icon-info" style="color: #e6a23c"></i> -->
          <span class="iconfont icondtbz" style="font-size: 22px; color: #e6a23c"></span>
          &nbsp; 确认删除选中的{{ multipleSelection.length }}条检测报告吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeDatas">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 表格当前列信息弹出框 -->
    <transition name="el-fade-in-linear">
      <div class="detailsCrad" style="top: 10%; left: 20%; right: 55%" v-if="currentInfoCard">
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
                @click="testReportDetails(getCurrentForm.id)"
                >详情</a
              >
            </div>
            <div>管径：{{ getCurrentForm.diameter }}mm 材质：{{ getCurrentForm.material }}</div>
            <div class="content-info">
              <div class="left">
                <div class="detailsTitle">检测日期 {{ getCurrentForm.sampleTime }}</div>
                <p style="padding-left: 10px">无文档</p>
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
  </div>
</template>

<script>
import {
  queryPageTestReportNew,
  deleteIdData,
  deleteTestReport,
  projectPagingQuery,
  batchRelease,
  withdrawReport,
  queryPipecheckDetails,
  queryDictionariesId,
  oneRelease,
  queryProjectDetails,
  queryDefectFormDetails,
  queryPipeStateDetails,
  queryPipeState,
  assessmentDefect
} from '@/api/pipelineManage'

// 引入预览pdf插件
import pdfSee from '../components/OpenPdf.vue'

// 引入发布的组件
import summaryForm from './components/summaryForm'
import projectForm from './components/project'
import inspectForm from './components/inspect'
import simpleMap from '@/components/SimpleMap'

import { getDefectDataById, getDefectData } from '@/api/sysmap/drain'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { comSymbol } from '@/utils/comSymbol'
import { transform } from 'ol/proj'
import * as olProj from 'ol/proj'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'
import Text from 'ol/style/Text'
import { Style } from 'ol/style'

import defectImgR from '@/assets/images/traingle-r.png';
import defectImgB from '@/assets/images/traingle-b.png';
import defectImgY from '@/assets/images/traingle-y.png';

import Icon from 'ol/style/Icon';

export default {
  props: ['data'],
  components: {
    summaryForm,
    projectForm,
    inspectForm,
    pdfSee,
    simpleMap
  },
  data() {
    return {
      activeName: 'picnum', // 照片视频tab标签
      currentForm: [], // 缩略提示框
      currentIndex: 0, // 当前页数
      currentInfoCard: false, // 弹出框
      deleteDialogVisible: false, // 删除提示框显影
      // 数据为空时的图片
      // imgUrl:"@/assets/images/nullData.png",
      // 上传文件表格
      upDataTable: [],
      updataParamsId: {
        itemId: '',
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      }, // 上传视频需要的参数id
      id: '', // 发布时的id
      isRelease: false, // 判断是否从发布按钮进入详情
      defectSumObj: { oneSum: 0, twoSum: 0, threeSum: 0, fourSum: 0, total: 0 }, // 合计
      defectQuantityStatisticsA: [
        { title: '(AJ)支管暗接', type: 'AJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(BX)变形', type: 'BX', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(CK)错口', type: 'CK', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(CR)异物穿入', type: 'CR', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(FS)腐蚀', type: 'FS', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(PL)破裂', type: 'PL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(QF)起伏', type: 'QF', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(SL)渗透', type: 'SL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(TJ)脱节', type: 'TJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(TL)接口材料脱落', type: 'TL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 }
      ], // 管道缺陷数量统计表
      defectQuantityStatisticsB: [
        { title: '(CJ)沉积', type: 'CJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(CQ)残墙、坝根', type: 'CQ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(FZ)浮渣', type: 'FZ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(JG)结垢', type: 'JG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(SG)树根', type: 'SG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 },
        { title: '(ZW)障碍物', type: 'ZW', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, sum: 0 }
      ],
      batchReleaseDialog: false, // 批量发布弹框
      // 选择框分页参数
      selectParm: { current: 1, size: 30 },
      selectLoadTotal: 0, // 选择框总页数
      selectArr: [], // 选择工程数组(报告上传)
      videoSelectArr: [], // 选择工程数组(视频上传)
      // 表格参数
      tableContent: [
        { label: '检测报告名称', name: 'wordInfoName' },
        { label: '检测段数', name: 'jcnum' },
        { label: '检测长度', name: 'jclength' },
        { label: '工程名称', name: 'prjName' },
        { label: '工程地点', name: 'address' },
        { label: '施工单位', name: 'sgunit' },
        { label: '检测日期', name: 'jcDate' },
        { label: '入库人', name: 'createUserName' },
        { label: '入库时间', name: 'createTime' }
      ],
      // 搜索功能参数
      searchValue: {
        dateTime: '', // 检测日期
        checkList: [], // 发布状态
        serchValue: '' // 搜索关键字
      },
      // 上传需要的数据
      fileList: [],
      UpdataList: '', // 上传文件携带的参数
      updataDialog: false, // 上传对话框
      uploadHeaders: {
        Authorization: 'bearer ' + sessionStorage.getItem('token')
      }, // token值
      activeLeft: 'first', // 发布默认激活的导航（左）
      activeRight: 'two', // 发布默认激活的导航（右）
      multipleSelection: [], // 被选中的表格数据
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      // ------------
      radio: '',
      tableData: [],
      //  报告上传数据
      rules: {
        name: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        report: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 报告上传
      dialogFormVisible: false,
      // 视频上传
      dialogFormVisible2: false,
      // 报告发布
      dialogFormVisible3: false,
      form: {
        name: '',
        report: '1'
      },
      formLabelWidth: '120px',
      loadingBool: false, // 加载按钮显隐

      //
      showId: 0,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj43', // 当前坐标系
      vectorLayer: null,
      vectorLayer2: null,
      hasLoadMap: false,
      map: null
    }
  },
  async created() {
    let res = this.getDate()
    queryPipeState('113')
  },
  computed: {
    // 提示框当前信息
    getCurrentForm() {
      let obj = { ...this.currentForm[this.currentIndex] }
      return obj ? Object.assign(obj, this.isPromptBox) : {}
    },
    returnTabel() {
      let obj = {
        defectQuantityStatisticsA: this.defectQuantityStatisticsA,
        defectQuantityStatisticsB: this.defectQuantityStatisticsB,
        defectSumObj: this.defectSumObj
      }
      return obj
    },
    // 加载按钮
    isLoading() {
      return this.loadingBool ? 'el-icon-loading' : ''
    },
    // 动态设置上传携带参数
    getData() {
      return this.updataParamsId
    },
    getVideoData() {
      return this.updataParamsId
    }
  },
  mounted() {
    this.map = this.data.mapView
    this.projUtil = new projUtil()
    this.projUtil.resgis(this.currentDataProjName)

    this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(4, '#0ff', 10, 'rgba(0, 255, 255, 0.6)') })
    this.vectorLayer = new VectorLayer({ source: new VectorSource() })
    this.map.addLayer(this.vectorLayer)
    this.map.addLayer(this.lightLayer)

    this.vectorLayer2 = new VectorLayer({ source: new VectorSource() })
    this.getPipeDefectData()
    this.addMapEvent()
    this.data.that.showLegend('testReport', true)
  },
  destroyed() {
    this.vectorLayer.getSource().clear()
    this.vectorLayer2.getSource().clear()
    this.lightLayer.getSource().clear()
    this.data.that.showLegend('testReport', false)
  },
  methods: {
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
    // 打开缩略提示框
    async openPromptBox(row, column, cell, event) {
      console.log('打开缩略提示框', row)
      this.isPromptBox = { ...row }
      let res = await assessmentDefect(row.id)
      this.currentIndex = 0
      this.currentForm = res.result
      this.currentInfoCard = true
      // console.log('打开缩略提示框2', this.currentForm, this.isPromptBox)
    },
    // 双击打开详情或发布
    openDetails(row, column) {
      this.testReportDetails(row.id)
    },
    addMapEvent () {
      let vectorLayer = new VectorLayer({ source: new VectorSource() })
      let feature = new Feature({ geometry: new Point([101.731040, 26.505465]) })
      feature.setStyle(comSymbol.getPointStyle(5, "#f00"))
      vectorLayer.getSource().addFeature(feature)
      this.map.addLayer(vectorLayer)

      this.map.on('click', evt => {
        let features = this.map.getFeaturesAtPixel(evt.pixel)
        if (features.length !== 0) {
          console.log(features)
        } else {
          console.log('无特征点')
        }
      })
    },
    handleAdd () {},
    /**
     * 小地图完成加载后
     * */
    afterMapLoad() {
      let id = this.id
      this.getPipeDefectData(2, id)
    },
    /**
     * 构造要素
     * @param type 地图: 1：主地图，2 小地图
     * @param id 报告编号
     * @param light 是否高亮
     * */
    getPipeDefectData(type = 1, id, light = false) {
      let dataApi = null,
        map,
        layer
      if (type === 1) {
        map = this.data.mapView
        layer = this.vectorLayer
      } else {
        map = this.$refs.myMap.map
        layer = this.vectorLayer2
        if (!this.hasLoadMap) {
          map.addLayer(layer)
          this.hasLoadMap = true
        }
      }
      if (id) {
        dataApi = getDefectDataById
      } else {
        dataApi = getDefectData
      }
      dataApi(id).then((res) => {
        if (res.code === 1) {
          let dFeas = [],
            pFeas = []
          if (res.result && res.result.length !== 0) {
            let reportInfo = res.result[0] ? res.result : [res.result],
              pipeData = [],
              defectData = []
            reportInfo.forEach((rpt) => {
              let { pipeStates } = rpt
              pipeData = [...pipeData, ...pipeStates.map((pipe) => pipe)]
              defectData = [...defectData, ...pipeStates.map((pipe) => pipe.pipeDefects.map((defect) => defect)).flat()]
            })
            dFeas = this.getFeatures(defectData, 2, !light)
            pFeas = this.getFeatures(pipeData, 1, !light)
          }

          if (light) {
            map.getView().setCenter(dFeas[0].getGeometry().getCoordinates())
            map.getView().setZoom(16)
            this.lightLayer.getSource().addFeatures([...dFeas, ...pFeas])
          } else {
            this.lightLayer.getSource().clear()
            layer.getSource().clear()
            if (dFeas.length !== 0 || pFeas.length !== 0) {
              layer.getSource().addFeatures([...dFeas, ...pFeas])
            }
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    /**
     * 构造要素
     * @param type 类型1: 线，2：点
     * @param hasStyle 是否设置样式
     * */
    getFeatures(featureArr, type, hasStyle) {
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
              { level: 'Ⅰ', color: '#0ff' },
              { level: 'Ⅱ', color: '#0c9923' },
              { level: 'Ⅲ', color: '#f405ff' },
              { level: 'Ⅳ', color: '#f00' }
            ]
            let findColor = colors.find((colorObj) => feaObj['funcClass'].includes(colorObj.level))
            if (findColor) {
              hasStyle && feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
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
            hasStyle && feature.setStyle(new Style({ image: new Icon({ size: [48, 48], src: defectImgR, scale: 0.4 }) }))

            features.push(feature)

            // let fea = feature.clone()
            // fea.setStyle(new Style({ text: new Text({ text: `${index}`, offsetY: -20 }) }))
            // features.push(fea)
          }
        })
      }
      return features
    },

    // 关闭上传弹框时
    closeDialog() {
      this.loadingBool = false
      this.$refs['form'].resetFields()
      this.$refs['updataDocx'] && this.$refs['updataDocx'].clearFiles()
      this.$refs['updataVideo'] && this.$refs['updataVideo'].clearFiles()
      this.upDataTable = []
      console.log('关闭了弹框')
      return false
    },
    // 获取字典id
    async getParamsId(type) {
      // 获取字典id
      // uploadFileType
      let uploadFileTypeDicId = await queryDictionariesId({ keys: 'uploadFileType' })
      // uploadItem
      let uploadItemDictId = await queryDictionariesId({ keys: 'uploadItem' })
      uploadFileTypeDicId = uploadFileTypeDicId.result.uploadFileType
      uploadItemDictId = uploadItemDictId.result.uploadItem
      // await this.$refs.upload.submit()
      uploadFileTypeDicId.forEach((v) => {
        if (v.codeValue == type) {
          this.updataParamsId.uploadFileTypeDicId = v.id
        }
      })
      uploadItemDictId.forEach((v) => {
        if (v.codeValue == 'tf_ywpn_prjinfo_w') {
          this.updataParamsId.uploadItemDictId = v.id
        }
      })
    },
    // 判断表格当前行是否可被选中
    checkSelect(row, index) {
      let isChecked = true
      if (row.state == '0') {
        // 判断里面是否存在某个参数
        isChecked = true
      } else {
        isChecked = false
      }
      return isChecked
    },
    // 打开弹框时
    openRelease() {
      console.log('打开了弹框')
    },
    // 关闭发布弹框时触发
    closeRelease() {
      this.id = ''
      this.defectSumObj = { oneSum: 0, twoSum: 0, threeSum: 0, fourSum: 0, total: 0 }
      this.isRelease = false
      console.log('关闭了弹框')
    },
    // 单行管段详情
    async testReportDetails(id, isRelease) {
      // 判断是否已加载地图
      if (this.hasLoadMap) {
        this.getPipeDefectData(2, id, false)
      }

      this.id = id
      console.log('当前id', id)
      isRelease ? (this.isRelease = true) : ''
      // console.log('是不是发布', this.isRelease)
      let res = await queryPipecheckDetails(id)
      // this.defectQuantityStatisticsA
      // 按缺陷名称给数据分类
      // 缺陷数量统计
      res.result.forEach((resValue) => {
        this.defectQuantityStatisticsA.forEach((sumValue) => {
          // console.log("类型是否相等",typeof resValue.defectCode,sumValue.type);
          if (resValue.defectCode == sumValue.type) {
            if (resValue.defectLevel == '一级') {
              sumValue.oneValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '二级') {
              sumValue.twoValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '三级') {
              sumValue.threeValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '四级') {
              sumValue.fourValue = resValue.defectNums
              return
            }
          }
        })

        this.defectQuantityStatisticsB.forEach((sumValue) => {
          if (resValue.defectCode == sumValue.type) {
            if (resValue.defectLevel == '一级') {
              sumValue.oneValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '二级') {
              sumValue.twoValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '三级') {
              sumValue.threeValue = resValue.defectNums
              return
            } else if (resValue.defectLevel == '四级') {
              sumValue.fourValue = resValue.defectNums
              return
            }
          }
        })
      })

      this.defectQuantityStatisticsA.forEach((v) => {
        v.sum = v.oneValue + v.twoValue + v.threeValue + v.fourValue
        this.defectSumObj.oneSum += v.oneValue
        this.defectSumObj.twoSum += v.twoValue
        this.defectSumObj.threeSum += v.threeValue
        this.defectSumObj.fourSum += v.fourValue
        this.defectSumObj.total += v.sum
      })
      this.defectQuantityStatisticsB.forEach((v) => {
        v.sum = v.oneValue + v.twoValue + v.threeValue + v.fourValue
        this.defectSumObj.oneSum += v.oneValue
        this.defectSumObj.twoSum += v.twoValue
        this.defectSumObj.threeSum += v.threeValue
        this.defectSumObj.fourSum += v.fourValue
        this.defectSumObj.total += v.sum
      })

      

      this.dialogFormVisible3 = true
    },
    // 单个发布
    async oneReleaseBtn() {
      let res = await batchRelease(this.id)
      if (res.result) {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      }
      await this.getDate()
      this.dialogFormVisible3 = false
    },
    // 单个撤回
    async withdrawBtn(id) {
      let res = await withdrawReport(id)
      if (res.result) {
        this.$message({
          message: '撤回成功',
          type: 'success'
        })
      }
      await this.getDate()
    },
    // 批量发布确认
    async confirmRelease() {
      let idArr = this.multipleSelection.map((v) => {
        return v.id
      })
      let res = await batchRelease(idArr.join(','))
      if (res.result) {
        this.getPipeDefectData() // 刷新地图
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      }
      this.batchReleaseDialog = false
      await this.getDate()
    },
    // 文件发生变化时触发
    getFile(file, fileList) {
      let num = 1024.0 //byte
      // console.log('file', file)
      console.log('上传file的状态', file.status)
      console.log('fileList', fileList)
      this.upDataTable = fileList.map((v) => {
        return {
          name: v.name,
          size: (v.size / Math.pow(num, 2)).toFixed(2) + 'MB',
          status: v.status
        }
      })
      console.log('this.upDataTable', this.upDataTable)
    },
    // 重置
    async resetDate() {
      this.searchValue.checkList = []
      this.searchValue.serchValue = ''
      this.searchValue.dateTime = ''
      await this.getDate()
    },
    // 报告上传取消按钮
    hideUpdataDocx() {
      this.form.name = ''
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
      return false
    },
    // 失去焦点时
    initSelectDate() {
      this.selectParm.current = 1
      console.log('选择的选项值', this.form.name)
    },
    // 选择工程下拉刷新加载更多数据（报告上传）
    async selectLoadMore() {
      if (this.selectParm.current * this.selectParm.size >= this.selectLoadTotal) return
      this.selectParm.current++
      let res = await projectPagingQuery(this.selectParm)
      let data = res.result.records
      console.log('data', data)
      data.forEach((v) => {
        this.selectArr.push({
          name: v.prjName,
          No: v.prjNo
        })
      })
      console.log('下滑到底了')
    },
    // 视频上传
    async selectLoadMoreVideo() {
      if (this.selectParm.current * this.selectParm.size >= this.selectLoadTotal) return
      this.selectParm.current++
      let res = await projectPagingQuery(this.selectParm)
      let data = res.result.records
      data.forEach((v) => {
        this.videoSelectArr.push({
          name: v.prjName,
          No: v.id
        })
      })
      console.log('下滑到底了')
    },
    // 报告上传按钮
    async showUpdata() {
      // 选择工程名称的分页查询
      let res = await projectPagingQuery(this.selectParm)
      this.selectLoadTotal = res.result.records
      let data = res.result.records
      this.selectArr = data.map((v) => {
        return {
          name: v.prjName,
          No: v.id
        }
      })
      // this.selectArr
      console.log('选择框数据', this.selectArr)
      this.dialogFormVisible = true
    },
    // 视频上传按钮
    async videoShowUpdata() {
      // 选择工程名称的分页查询
      let res = await projectPagingQuery(this.selectParm)
      let data = res.result.records
      this.selectLoadTotal = res.result.records
      this.videoSelectArr = data.map((v) => {
        return {
          name: v.prjName,
          No: v.id
        }
      })
      // this.selectArr
      console.log('选择框数据', this.videoSelectArr)
      this.dialogFormVisible2 = true
    },
    // 上传按钮
    async uploadWord() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loadingBool = true
          // 获取字典id
          await this.getParamsId('wordInfoDoc')
          this.updataParamsId.itemId = this.form.name
          await this.$refs.updataDocx.submit()
        } else {
          console.log('不能提交!!')
          return false
        }
      })
    },
    async uploadVideoWord() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loadingBool = true
          // 获取字典id
          await this.getParamsId('pipeVideo')
          this.updataParamsId.itemId = this.form.name
          await this.$refs.updataVideo.submit()
        } else {
          console.log('不能提交!!')
          return false
        }
      })
    },
    // 上传触发的方法
    handleAvatarSuccess(res, file, fileList) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      let arrState = fileList.every((v) => v.status != 'ready' && v.status != 'uploading')
      // console.log(arrState)
      if (res.result.length == 0) {
        this.$message.error('《' + file.name + '》上传失败,请检查文件格式')
      }
      if (arrState) {
        this.$message({
          message: '文件已全部上传',
          type: 'success'
        })
        this.getPipeDefectData() // 刷新地图
        this.getDate()
        let timeId = setTimeout(() => {
          this.dialogFormVisible = false
          this.form.name = ''
          clearTimeout(timeId)
        }, 1500)
      }

      // fileList.forEach((v) => {
      //   if (v.status == 'ready' || v.status == 'uploading') {
      //     return false
      //   } else {
      //     // let timeId = setTimeout(() => {
      //     //   this.dialogFormVisible = false
      //     //   this.form.name = ''
      //     //   clearTimeout(timeId)
      //     // }, 2000)
      //     // console.log('上传后的code码', res)
      console.log('上传后的文件信息', file)
      //     // console.log('上传后的文件列表信息', fileList)
      //   }
      // })
    },
    // 视频
    handleAvatarSuccessVideo(res, file, fileList) {
      let arrState = fileList.every((v) => v.status != 'ready' && v.status != 'uploading')
      // console.log(arrState)
      if (res.result.length == 0) {
        this.$message.error('《' + file.name + '》上传失败,请检查文件格式')
      }
      if (arrState) {
        this.$message({
          message: '文件已全部上传',
          type: 'success'
        })
        this.getDate()
        let timeId = setTimeout(() => {
          this.dialogFormVisible2 = false
          this.form.name = ''
          clearTimeout(timeId)
        }, 1500)
      }
      // fileList.forEach((v) => {
      //   if (v.status == 'ready' || v.status == 'uploading') {
      //     return false
      //   } else {
      //     if (res.result.length != 0) {
      //       this.$message({
      //         message: '上传成功',
      //         type: 'success'
      //       })
      //       this.getDate()
      //     } else {
      //       this.$message.error('上传文件失败,请检查文件格式')
      //     }
      //     let timeId = setTimeout(() => {
      //       this.dialogFormVisible2 = false
      //       this.form.name = ''
      //       clearTimeout(timeId)
      //     }, 2000)
      //     // console.log('上传后的code码', res)
      // console.log('上传后的文件信息', file)
      //   }
      // })
    },
    beforeUpload(event, file, fileList) {
      let num = 1024.0 //byte
      // console.log('file', file)
      // console.log('上传file的状态', file.status)
      // console.log('fileList', fileList)
      this.upDataTable = fileList.map((v) => {
        return {
          name: v.name,
          size: (v.size / Math.pow(num, 2)).toFixed(2) + 'MB',
          status: v.status
        }
      })
      // console.log('文件上传时', this.upDataTable)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 搜索
    searchApi() {
      let params = { ...this.searchValue }
      if (params.checkList.length == 1) {
        params.checkList = params.checkList[0]
      } else {
        params.checkList = ''
      }
      console.log('搜索时传的参数', params)
      this.getDate(params)
    },
    // 删除按钮
    removeBtn() {
      this.deleteDialogVisible = true
    },
    // 确认删除
    async removeDatas() {
      let res = {}
      if (this.multipleSelection.length == 1) {
        // res = await deleteIdData(this.multipleSelection[0].id)
        res = await deleteTestReport({ ids: this.multipleSelection[0].id })
      } else {
        let idArr = this.multipleSelection.map((v) => v.id)
        res = await deleteTestReport({ ids: idArr.join(',') })
      }
      if (res.result) {
        this.getPipeDefectData()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteDialogVisible = false
        this.getDate()
      } else {
        this.$message.error('删除失败')
      }
    },
    // 查询数据
    async getDate(params) {
      let data = { ...this.pagination }
      console.log('参数', params)
      if (params) {
        data.jcStartDate = params.dateTime[0]
        data.jcEndDate = params.dateTime[1]
        data.state = params.checkList
        data.prjNo = params.serchValue
      }
      console.log('最后传进去的参数', data)
      await queryPageTestReportNew(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
    },
    // 发布tab标签点击事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    add() {},
    // 表格选中事件
    handleSelectionChange(val) {
      console.log('表格选中事件', val)
      if (val.length !== 0) this.getPipeDefectData(1, val[0].id, true)
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
    }
  },
  // 过滤器
  filters: {
    // 过滤发布状态
    filter_state(value) {
      return value == 0 ? '未发布' : '已发布'
    },
    // 过滤上传进度
    filter_schedule(value) {
      if (value == 'ready') {
        return '未开始'
      } else if (value == 'uploading') {
        return '进行中...'
      } else if (value == 'success') {
        return '√'
      } else {
        return value
      }
    }
  }
}
</script>


<style lang="scss" scoped>
$fontSize: 14px !important;
// 上传进度样式
.font-green {
  color: #26b54b;
}
.font-blue {
  color: #2d9eeb;
}
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: $fontSize;

  .delete-box {
    /deep/.el-dialog {
      margin-top: 30vh !important;
      .el-dialog__header {
        border-bottom: none;
      }
    }
  }
  /deep/ .el-date-editor {
  }
  // 表格样式
  .table-box {
    width: 96%;
    margin: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    // 发布状态样式
    .stateRedClass {
      color: #ff0017;
    }
    .stateGreenClass {
      color: #5c9a44;
    }
    .top-tool {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      font-size: $fontSize;
      /deep/ .el-radio__label {
        font-size: $fontSize;
      }
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .release-radio {
          display: flex;
          align-items: center;
          white-space: nowrap;
          margin-right: 5px;
          font-size: $fontSize;
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
          width: 240px;
        }
        .el-input__inner {
          height: 34px;
        }
        .el-range-editor {
          width: 270px;
        }
        .date-css {
          width: 140px;
        }

        .title {
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }
      .serch-btn {
        height: 34px;
        display: flex;
        font-size: $fontSize;
        justify-content: center;
        align-items: center;
        // background-color: #2d74e7;
        // margin-left: 14px;
        padding: 10px;
        border: none !important;
      }

      .right-btn {
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        font-size: $fontSize;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }
  }
  /deep/ .el-table {
    font-size: $fontSize;
    th.el-table__cell > .cell {
      height: 40px;
      line-height: 40px;
      background-color: #dfeffe;
    }
  }

  // 报告上传样式
  .public-box {
    /deep/ .el-dialog__header {
      background-color: #2d74e7;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn > .el-icon-close {
        color: #fff !important;
      }
    }
  }
  .hd-input {
    /deep/.el-input__inner {
      width: 70%;
    }
    .upData-class {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: $fontSize;
      font-weight: bold;
      background-color: #dfeffe;
    }
    /deep/ .el-upload-list__item-name {
      text-align: center;
    }
  }
  .release-radio {
    .el-radio {
      margin-right: 8px !important;
      .radio__label {
        padding-left: 4px;
      }
    }
  }
  .el-select {
    width: 70%;
  }
  /deep/ .is-required {
    position: relative;
    .select-btn {
      position: absolute;
      top: 0;
      left: 72%;
    }
  }
  // 报告发布
  .releaseTop-box {
    display: flex;
    justify-content: space-between;
    .left,
    .right {
      /deep/ .el-tabs__header {
        background: transparent;
        border-top: none;
      }
      /deep/.el-tabs__item {
        margin: 0 !important;
        margin-top: 11px !important;
        background: transparent !important;
      }
      /deep/.releaseContent {
        width: 100%;
        height: 600px;
        margin-top: -3px;
        padding: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
      }
    }
    .left {
      flex: 2;
      .releaseContent {
        height: 597px;
        border: 1px solid #9a9a9a;
        overflow: scroll;
        .detailsTitle {
          margin: 24px 0;
          position: relative;
        }
        .detailsTitle::after {
          position: absolute;
          left: -10px;
          content: '';
          width: 4px;
          height: 100%;
          background-color: #2d74e7;
        }
      }
    }
    .right {
      flex: 1;
      .map-box {
        height: 597px;
        border: 1px solid #666;
      }
    }
  }
  /deep/ .upload-demo {
    position: relative;
    & > .el-upload {
      // width: 100%;
    }
    .btn-box {
      // cursor: default;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btns {
        position: absolute;
        right: 0;
      }
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
        /deep/ .content-info {
          overflow-y: scroll;
          max-height: 545px;
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