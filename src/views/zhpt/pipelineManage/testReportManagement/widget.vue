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
          <!-- <el-date-picker
            v-model="searchValue.dateTime"
            type="date"
            class="date-css"
            value-format="yyyy-MM-dd"
            placeholder="检测日期"
          >
          </el-date-picker> -->
          <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
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
            <el-radio v-model="searchValue.checkList" label="0">未发布</el-radio>
            <el-radio v-model="searchValue.checkList" label="1">已发布</el-radio>
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
            @click="removeDatas"
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
      >
        <el-table-column header-align="center" :selectable="checkSelect" align="center" type="selection" width="55">
        </el-table-column>

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
            <!-- <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="##FFDF84"
              title="确定要发布吗?"
              v-if="scope.row.state == '0'"
              @confirm="oneRelease(scope.row.id)"
            >
              <el-button slot="reference" type="text" size="small" :wu="scope">发布</el-button>
            </el-popconfirm> -->

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
            <!-- <el-button
              v-if="scope.row.state == '1'"
              type="text"
              size="small"
              :wu="scope"
              @click="$message('该功能暂未开放')"
              >撤回</el-button
            > -->
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
    <el-dialog title="批量发布" :visible.sync="batchReleaseDialog" width="30%">
      <span>确定要发布选中的信息吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchReleaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRelease">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 报告上传 -->
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
            <el-button size="small" type="primary">选择文件夹</el-button>
            <div slot="tip" class="el-upload__tip">
              <p>只能上传docx/doc文件</p>
              <el-table ref="singleTable" :data="upDataTable" stripe highlight-current-row style="width: 100%">
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :icon="isLoading" @click="uploadWord" :disabled="loadingBool">确 定</el-button>
        <el-button @click="hideUpdataDocx">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 视频上传 -->
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
            <el-button size="small" type="primary">选择文件夹</el-button>
            <div slot="tip" class="el-upload__tip">
              <p>只能上传mp4文件</p>
              <el-table ref="singleTable" :data="upDataTable" stripe highlight-current-row style="width: 100%">
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :icon="isLoading" @click="uploadVideoWord" :disabled="loadingBool">确 定</el-button>
        <el-button @click="hideUpdataDocx">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发布 -->
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
                <div class="detailsTitle">管道缺陷数量统计表</div>
                <table width="560" height="300" border="1" class="left-table" cellspacing="0" align="center">
                  <thead>
                    <tr height="34">
                      <th rowspan="2" colspan="2">缺陷名称\缺陷数量\缺陷级别</th>
                      <th>1级(轻微)</th>
                      <th>2级(中等)</th>
                      <th>3级(严重)</th>
                      <th>4级(重大)</th>
                      <th rowspan="2">小计</th>
                    </tr>
                    <tr height="34">
                      <th>缺陷个数</th>
                      <th>缺陷个数</th>
                      <th>缺陷个数</th>
                      <th>缺陷个数</th>
                    </tr>
                  </thead>
                  <tr v-for="(v, i) in defectQuantityStatisticsA" :key="v.title">
                    <td rowspan="10" v-if="i < 1">结构性缺陷</td>
                    <td>{{ v.title }}</td>
                    <td>{{ v.oneValue }}</td>
                    <td>{{ v.twoValue }}</td>
                    <td>{{ v.threeValue }}</td>
                    <td>{{ v.fourValue }}</td>
                    <td>{{ v.sum }}</td>
                  </tr>
                  <tr v-for="(v, i) in defectQuantityStatisticsB" :key="i">
                    <td rowspan="6" v-if="i < 1">功能性缺陷</td>
                    <td>{{ v.title }}</td>
                    <td>{{ v.oneValue }}</td>
                    <td>{{ v.twoValue }}</td>
                    <td>{{ v.threeValue }}</td>
                    <td>{{ v.fourValue }}</td>
                    <td>{{ v.sum }}</td>
                  </tr>
                  <tr class="defectSum">
                    <td colspan="2">合计</td>
                    <td v-for="(key, i) in defectSumObj" :key="i">{{ key }}</td>
                  </tr>
                </table>
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
            <el-tab-pane label="原始检测报告" name="one"> <div class="releaseContent">原始检测报告</div> </el-tab-pane>
            <el-tab-pane label="数据地图" name="two">数据地图</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="isRelease" @click="oneRelease">发 布</el-button>
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
      </div>
    </el-dialog>
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
  queryDictionariesId
} from '@/api/pipelineManage'

export default {
  data() {
    return {
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
        checkList: '', // 发布状态
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
      activeRight: 'one', // 发布默认激活的导航（右）
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
      loadingBool: false // 加载按钮显隐
    }
  },
  created() {
    let res = this.getDate()
  },
  computed: {
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
  mounted() {},
  methods: {
    // 关闭上传弹框时
    closeDialog() {
      this.loadingBool = false
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
      this.id = id
      isRelease ? (this.isRelease = true) : ''
      console.log('是不是发布', this.isRelease)
      let res = await queryPipecheckDetails(id)
      // this.defectQuantityStatisticsA
      // 按缺陷名称给数据分类
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

      if (res.result) {
        this.dialogFormVisible3 = true
      }
    },
    // 单个发布
    async oneRelease() {
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
      this.searchValue.checkList = ''
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
          No: v.prjNo
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
      fileList.forEach((v) => {
        if (v.status == 'ready' || v.status == 'uploading') {
          return false
        } else {
          if (res.code) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.getDate()
          }
          let timeId = setTimeout(() => {
            this.dialogFormVisible = false
            this.form.name = ''
            clearTimeout(timeId)
          }, 1000)
          // console.log('上传后的code码', res)
          // console.log('上传后的文件信息', file)
        }
      })
    },
    // 视频
    handleAvatarSuccessVideo(res, file, fileList) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      fileList.forEach((v) => {
        if (v.status == 'ready' || v.status == 'uploading') {
          return false
        } else {
          if (res.code) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.getDate()
          } else {
            this.$message.error('上传文件失败' + res.message)
          }
          let timeId = setTimeout(() => {
            this.dialogFormVisible2 = false
            this.form.name = ''
            clearTimeout(timeId)
          }, 1000)
          // console.log('上传后的code码', res)
          // console.log('上传后的文件信息', file)
        }
      })
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
      this.getDate(this.searchValue)
    },
    // 删除
    removeDatas() {
      this.$confirm(`确定删除选中的数据吗？`)
        .then(async () => {
          let res = {}
          if (this.multipleSelection.length == 1) {
            res = await deleteIdData(this.multipleSelection[0].id)
          } else {
            let idArr = this.multipleSelection.map((v) => v.id)
            res = await deleteTestReport({ ids: idArr.join(',') })
          }
          if (res.result) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDate()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          console.log('err')
        })
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
// 上传进度样式
.font-green {
  color: #26b54b;
}
.font-blue {
  color: #2d9eeb;
}
.engineering-manage {
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
      font-size: 12px;
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
        }
        .el-input__inner {
          height: 34px;
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
        justify-content: center;
        align-items: center;
        // background-color: #2d74e7;
        // margin-left: 14px;
        padding: 12px;
        border: none !important;
      }

      .right-btn {
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }
  }
  /deep/ .el-table th.el-table__cell > .cell {
    height: 40px;
    line-height: 40px;
    background-color: #dfeffe;
  }
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 12px;

  // 报告上传样式
  /deep/ .el-dialog__header {
    background-color: #2d74e7;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn > .el-icon-close {
      color: #fff !important;
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
      font-size: 12px;
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
      .releaseContent {
        width: 100%;
        height: 600px;
        margin-top: -3px;
        padding: 20px;
        box-sizing: border-box;
      }
    }
    .left {
      flex: 2;
      .releaseContent {
        border: 1px solid #9a9a9a;
        overflow: scroll;
        .detailsTitle {
          margin: 10px 0;
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
        .left-table {
          width: 100%;
          font-weight: bold;
          text-align: center;
          th {
            color: #666;
            background: #eeece1;
          }
          tr {
            height: 38px;
          }
          .defectSum {
            height: 45px;
            background-color: #eeece1;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
  }
}
</style>