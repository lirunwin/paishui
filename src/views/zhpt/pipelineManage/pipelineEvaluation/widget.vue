<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道评估结果管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
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
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary" @click="resetBtn"> 重置 </el-button>
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
            <el-button
              slot="reference"
              class="serch-btn"
              type="primary"
              size="small"
              :disabled="multipleSelection.length != 1"
              >导出<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </el-popconfirm>
          <!-- <el-button class="serch-btn" type="primary" @click="openDialogEnclosure" :disabled="multipleSelection.length != 1"
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

        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="$message('该功能暂未开放')">报告</el-button>
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

    <!-- 详情卡片 -->
    <transition name="el-fade-in-linear">
      <div class="detailsCrad" v-if="dialogFormVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>管道检测详情</span>
            <span style="float: right; padding: 3px 0; cursor: pointer">
              <i class="el-icon-close" type="text" @click="dialogFormVisible = false"></i>
            </span>
          </div>
          <div class="content">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">检测信息</el-menu-item>
              <el-menu-item index="2">缺陷信息</el-menu-item>
            </el-menu>
            <div class="content-info">
              <div class="box1" v-show="activeIndex == '1'">
                <div class="detailsTitle">管段信息</div>
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <el-row v-for="(v, i) in cardTableContent" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">检测信息</div>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="检测方向">
                        <el-input v-model="DetailsForm.detectDir" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="检测长度">
                        <el-input v-model="DetailsForm.checkLength" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="修复指数">
                        <el-input v-model="DetailsForm.repairIndex" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="养护指数">
                        <el-input v-model="DetailsForm.maintainIndex" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="box1" v-show="activeIndex == '2'">
                <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
                  <div class="detailsTitle">结构性缺陷评价(等级：{{ DetailsForm.structClass }})</div>
                  <el-row v-for="v in structArr" :key="v">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="v[1].label">
                        <el-input v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <el-form-item label="评价">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          disabled
                          v-model="DetailsForm.structEstimate"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="detailsTitle">功能性缺陷评价(等级：{{ DetailsForm.funcClass }})</div>
                  <el-row v-for="(v, i) in funcArr" :key="i">
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item :label="v[0].label">
                        <el-input v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item :label="[v[1].label]">
                        <el-input v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" style="padding-right: 15px">
                      <el-form-item label="评价">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          disabled
                          v-model="DetailsForm.funcEstimate"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
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

export default {
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
      ], // 功能性性数据
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
      form: {}
    }
  },
  created() {
    let res = this.getDate()
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
      // console.log('row', row)
      let res = await assessmentDetails(row.id)
      this.DetailsForm = res.result
      // console.log('res', res)
      // let res = await histroyPipeData({ expNo: row.expNo })
      // this.cardTable = res.result
      this.dialogFormVisible = true
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
        // margin-left: 14px;
        padding: 12px;
        border: none !important;
      }

      .serch-btn:hover {
        opacity: 0.8;
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

    /deep/ .el-table th.el-table__cell > .cell {
      height: 40px;
      line-height: 40px;
      background-color: #dfeffe;
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