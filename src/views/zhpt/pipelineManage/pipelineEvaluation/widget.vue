<template>
  <div class="engineering-manage">
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
          <el-select v-model="searchValue.funcClass" placeholder="全部">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchValue.structClass" placeholder="全部">
            <el-option v-for="item in gradeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary" @click="resetBtn"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" type="primary" @click="$message('该功能暂未开放')"
            >导出<i class="el-icon-download el-icon--right"></i
          ></el-button>
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
        @cell-dblclick="currentInfoCard = true"
      >
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>

        <el-table-column prop="prjName" header-align="center" label="工程名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="prjNo" header-align="center" label="管段编号" align="center" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="pipeType" header-align="center" label="管段类型" align="center" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="diameter" header-align="center" label="管径(mm)" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="material"
          header-align="center"
          label="材质"
          align="center"
          min-width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="structDefect"
          header-align="center"
          label="结构性缺陷等级"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="structEstimate"
          header-align="center"
          label="结构性缺陷评价"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="defectNum" header-align="center" label="缺陷数量" align="center" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column prop="address" header-align="center" label="检测照片" align="center" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column
          prop="videoFileName"
          header-align="center"
          label="检测视频"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="checkAddress"
          header-align="center"
          label="检测地点"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="sampleTime"
          header-align="center"
          label="检测日期"
          align="center"
          min-width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$message('该功能暂未开放')">报告</el-button>
            <el-button type="text" size="small" @click="dialogFormVisible = !dialogFormVisible">详情</el-button>
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
      <div class="detailsCrad" style="top: 10%; left: 20%; right: 0" v-show="currentInfoCard">
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
              <p style="font-weight: bold">功能性缺陷：(BX)变形</p>
              <a style="font-size: 13px; color: #2d74e7; text-decoration: underline">详情</a>
            </div>
            <div>管径：400mm 材质：HDPE双壁波纹管</div>
            <div class="content-info">
              <div class="left">
                <div class="detailsTitle">检测日期 2022-1-14</div>
                <a>xxx文档</a>
              </div>
              <div class="right"></div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>

    <!-- 详情卡片 -->
    <transition name="el-fade-in-linear">
      <div class="detailsCrad" v-show="dialogFormVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>管道检测详情</span>
            <i
              class="el-icon-close"
              style="float: right; padding: 3px 0; cursor: pointer"
              type="text"
              @click="dialogFormVisible = false"
            ></i>
          </div>
          <div class="content">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">检测信息</el-menu-item>
              <el-menu-item index="2">功能性缺陷</el-menu-item>
              <el-menu-item index="3">结构性缺陷</el-menu-item>
            </el-menu>
            <div class="content-info">
              <div class="box1">
                <div class="detailsTitle">管段信息</div>
                <el-form ref="form" :model="form" label-width="auto" label-position="right">
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="管段编号" prop="prjName">
                        <el-input
                          v-model="form.prjName"
                          maxlength="100"
                          show-word-limit
                          :disabled="isDetails"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="管段类型" prop="prjNo">
                        <el-input v-model="form.prjNo" maxlength="20" show-word-limit :disabled="isDetails"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="起点埋深" prop="prjName">
                        <el-input
                          v-model="form.prjName"
                          maxlength="100"
                          show-word-limit
                          :disabled="isDetails"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="终点埋深" prop="prjNo">
                        <el-input v-model="form.prjNo" maxlength="20" show-word-limit :disabled="isDetails"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="管径" prop="prjName">
                        <el-input
                          v-model="form.prjName"
                          maxlength="100"
                          show-word-limit
                          :disabled="isDetails"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="材质" prop="prjNo">
                        <el-input v-model="form.prjNo" maxlength="20" show-word-limit :disabled="isDetails"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" style="padding-right: 15px">
                      <el-form-item label="敷设年代" prop="prjName">
                        <el-input
                          v-model="form.prjName"
                          maxlength="100"
                          show-word-limit
                          :disabled="isDetails"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-right: 15px"
                      ><el-form-item label="长度" prop="prjNo">
                        <el-input v-model="form.prjNo" maxlength="20" show-word-limit :disabled="isDetails"></el-input>
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
  </div>
</template>

<script>
import { queryPageAssessment } from '@/api/pipelineManage'

export default {
  data() {
    return {
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      searchValue: {
        testTime: '', // 检测日期
        queryParams: '',
        funcClass: '', // 功能型缺陷等级
        structClass: '' // 结构型缺陷等级
      }, // 搜索关键字的值
      trueValue: true,
      currentId: '', // 当前列的id
      activeIndex: '1', // 详情导航索引
      currentInfoCard: false, // 弹出框
      dialogFormVisible: false, // 详情卡片
      tableVisible: false, // 表格当前列信息弹出框
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      radio: '',
      zero: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎11',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      dialogTableVisible: false,
      form: {},
      formLabelWidth: '120px'
    }
  },
  created() {
    let res = this.getDate()
  },
  methods: {
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
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
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
        console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
        // this.$message.success("上传成功");
      })
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
      font-size: 14px;
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
        background-color: #2d74e7;
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
        .content-info {
          padding: 10px 20px;
          .detailsTitle {
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
      .table-content {
        padding: 15px;
        .content-info {
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .detailsTitle {
            position: relative;
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