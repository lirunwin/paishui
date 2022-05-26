<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 检测报告管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <div class="title">关键字：</div>
          <el-input
            size="small"
            placeholder="请输入工程名称、地点、报告名称"
            v-model="searchValue.serchValue"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <div class="title">检测日期：</div>
          <!-- <el-date-picker
            v-model="searchValue.dateTime"
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
                  v-model="searchValue.dateTime.startDate"
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
                  v-model="searchValue.dateTime.finishDate"
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
          <div class="release-radio">
            <p class="release-title">发布状态:</p>
            <el-checkbox-group v-model="searchValue.checkList">
              <el-checkbox label="0">未发布</el-checkbox>
              <el-checkbox label="1">已发布</el-checkbox>
            </el-checkbox-group>
            <!-- <el-radio v-model="searchValue.checkList" label="0">未发布</el-radio> -->
            <!-- <el-radio v-model="searchValue.checkList" label="1">已发布</el-radio> -->
          </div>
          <el-button size="small" icon="el-icon-search" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button size="small" icon="el-icon-refresh-right" type="primary" @click="resetDate"> 重置 </el-button>
        </div>
        <div class="right-btn">
          <el-button size="small" type="primary" @click="showUpdata">报告上传</el-button>
          <!-- <el-button  type="primary" @click="dialogFormVisible2 = true">视频上传</el-button> -->
          <el-button size="small" type="primary" @click="videoShowUpdata">视频上传</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="!multipleSelection.length"
            @click="batchReleaseDialog = true"
            >批量发布</el-button
          >
          <el-button
            size="small"
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
        @row-click="lightFea"
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
          :sortable="v.sortable"
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
            <el-button
              type="text"
              size="small"
              :wu="scope"
              v-if="scope.row.state == '1'"
              @click.stop="withdrawBtn(scope.row.id, true)"
              >撤回</el-button
            >
            <el-button
              type="text"
              size="small"
              :wu="scope"
              v-if="scope.row.state == '0'"
              @click.stop="testReportDetails(scope.row.id, true)"
              >发布</el-button
            >
            <el-button
              type="text"
              size="small"
              :wu="scope"
              style="margin-left: 10px"
              @click.stop="testReportDetails(scope.row.id)"
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
    <div class="delete-box">
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="batchReleaseDialog" width="30%">
        <div style="display: flex; align-items: center">
          <!-- <i class="el-icon-info" style="color: #e6a23c"></i> -->
          <span class="iconfont icondtbz" style="font-size: 22px; color: #e6a23c"></span>
          &nbsp; 确认要发布选中的{{ multipleSelection.length }}条检测报告吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="batchReleaseDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmRelease">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 报告上传 -->
    <div class="public-box">
      <el-dialog title="检测报告上传" @close="closeDialogDocx" :visible.sync="dialogFormVisible">
        <el-form ref="formDocx" :model="form" :rules="rules">
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
              :action="getBaseAddress"
              accept=".doc,.docx"
              :data="getData"
              multiple
              :show-file-list="false"
              :before-upload="checkState"
              :on-success="handleAvatarSuccess"
              :before-remove="beforeRemove"
              :on-progress="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
            >
              <div class="btn-box">
                <el-button size="small" type="primary" :disabled="loadingBool">选择报告</el-button>
                <span class="btns">
                  <el-button size="small" @click.stop="hideUpdataDocx">取 消</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    :icon="isLoading"
                    @click.stop="uploadWord"
                    :disabled="this.loadingBool || !this.fileList.length"
                    >确 定</el-button
                  >
                </span>
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
                    <img
                      style="width: 100px; height: 100px; -webkit-user-drag: none"
                      src="@/assets/images/nullData.png"
                      alt="暂无数据"
                      srcset=""
                    />
                    <p>暂无数据</p>
                  </template>

                  <el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
                  <el-table-column property="name" label="报告名称" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column property="size" label="报告大小" align="center" width="80"> </el-table-column>
                  <el-table-column property="status" label="上传进度" align="center" width="80">
                    <!-- filter_schedule -->
                    <template slot-scope="scope">
                      <p
                        :class="{
                          'font-green': scope.row.status == 'success',
                          'font-blue': scope.row.status == 'uploading',
                          'font-red': scope.row.status == 'error'
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
      <el-dialog title="附件视频上传" @close="closeDialogVideo" :visible.sync="dialogFormVisible2">
        <el-form ref="formVideo" :model="form" :rules="rules">
          <!-- <el-input size="small" v-model="selectWord.name" disabled show-word-limit></el-input> -->
          <el-form-item label="报告名称" :label-width="formLabelWidth" prop="name">
            <el-select
              clearable
              v-model="form.name"
              placeholder="请选择报告名称"
              v-selectLoadMore="selectLoadMore"
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
              :action="getBaseAddress"
              accept=".mp4"
              :data="getVideoData"
              multiple
              :before-upload="checkState"
              :on-success="handleAvatarSuccessVideo"
              :before-remove="beforeRemove"
              :on-progress="beforeUpload"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
            >
              <div class="btn-box">
                <el-button size="small" type="primary" :disabled="loadingBool">选择视频</el-button>
                <span class="btns">
                  <el-button size="small" @click.stop="hideUpdataDocx">取 消</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    :icon="isLoading"
                    @click.stop="uploadVideoWord"
                    :disabled="this.loadingBool || !this.fileList.length"
                    >确 定</el-button
                  >
                </span>
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
                    <img
                      style="width: 100px; height: 100px; -webkit-user-drag: none"
                      src="@/assets/images/nullData.png"
                      alt="暂无数据"
                      srcset=""
                    />
                    <p>暂无数据</p>
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
                          'font-blue': scope.row.status == 'uploading',
                          'font-red': scope.row.status == 'error'
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
    <div class="public-box release-box">
      <el-dialog
        :title="setTitle"
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
                  <div class="detailsTitle">管道缺陷数量统计表</div>
                  <summary-form :tabelData="returnTabel"></summary-form>
                  <div class="detailsTitle">管道缺陷数量统计图</div>
                  <div id="statistics_echatrs" style="width: 600px; display: flex; height: 600px"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="管道缺陷" name="third">
                <div class="releaseContent">
                  <!-- <div class="detailsTitle">管道缺陷汇总一览表</div> -->
                  <!-- <defect-one :paramId="id"></defect-one> -->
                  <div class="detailsTitle">检测评估建议</div>
                  <proposal :paramId="id"></proposal>
                </div>
              </el-tab-pane>
              <el-tab-pane label="管段状态评估" name="fourth">
                <div class="releaseContent">
                  <div class="detailsTitle">管段状况评估表</div>
                  <assessment :paramId="id"></assessment>

                  <!-- <div class="detailsTitle">管段检测与评估成果表</div>
                  <inspect-form></inspect-form> -->
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 右边部分 -->
          <div class="right">
            <el-tabs v-model="activeRight" @tab-click="handleClick">
              <el-tab-pane label="原始检测报告" name="one">
                <div class="releaseContent">
                  <pdf-see :pdfUrl="pdfUrl"></pdf-see>
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
          <div style="justify-content: space-between; display: flex; align-items: center">
            <div style="display: flex; align-items: center; flex: 1">
              <span>备注：</span>
              <el-input
                size="small"
                style="flex: 1; padding-right: 40px"
                type="textarea"
                :rows="2"
                placeholder="请输入备注"
                :disabled="!isRelease"
                resize="none"
                v-model="remark"
                v-if="isRelease"
              >
              </el-input>
              <p v-if="!isRelease">{{ remark }}</p>
            </div>
            <div>
              <el-button size="small" type="primary" v-if="isRelease" @click="oneReleaseBtn">发 布</el-button>
              <el-button size="small" v-if="isRelease" @click="dialogFormVisible3 = false">取 消</el-button>
            </div>
          </div>
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
          <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="removeDatas">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 撤回提示框 -->
    <div class="delete-box">
      <!-- 撤回提示框 -->
      <el-dialog title="提示" :visible.sync="withdrawDialogVisible" width="30%">
        <div style="display: flex; align-items: center">
          <!-- <i class="el-icon-info" style="color: #e6a23c"></i> -->
          <span class="iconfont icondtbz" style="font-size: 22px; color: #e6a23c"></span>
          &nbsp; 确定要撤回这条检测报告吗?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="withdrawDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="isWithdraw">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 当前列缺陷信息弹出框 -->
    <transition name="el-fade-in-linear">
      <div id="popupCard" class="histroyPipeData" v-show="currentInfoCard">
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
                <span style="font-weight: bold"
                  >功能性缺陷:({{ DetailsForm.defectCode }}){{ DetailsForm.defectName }}
                </span>
                <a
                  style="font-size: 12px; color: #2d74e7; text-decoration: underline"
                  @click="openDetailsDialog(DetailsForm.stateId)"
                  >详情</a
                >
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

    <!-- 管道评估结果 -->
    <transition name="el-fade-in-linear">
      <div id="popupCardEV" class="PipeEvData" v-show="currentInfoCard2">
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
                  <i class="el-icon-caret-left" style="cursor: pointer" type="text" @click="lastPage"></i>
                  {{ currentForm.length ? currentIndex + 1 : 0 }}/{{ currentForm.length }}
                  <i class="el-icon-caret-right" style="cursor: pointer" type="text" @click="nextPage"></i>
                </span>
                <a
                  style="font-size: 12px; color: #2d74e7; text-decoration: underline"
                  @click="openDetailsDialog(getCurrentForm.id)"
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
                      @click.stop="downloadDocx"
                      ><div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                        {{ getCurrentForm.wordInfoName + 'docx' }}
                      </div></el-link
                    >
                  </div>
                  <div class="detailsTitle">结构性缺陷 等级:{{ getCurrentForm.structClass }}</div>
                  <p style="padding-left: 10px">评价:{{ getCurrentForm.structEstimate }}</p>
                  <div class="detailsTitle">功能性缺陷 等级:{{ getCurrentForm.funcClass }}</div>
                  <p style="padding-left: 10px">评价: {{ getCurrentForm.funcEstimate }}</p>
                </div>
                <div class="right" style="width: 250px; margin-left: 20px; min-height: 240px">
                  <el-tabs v-model="activeName">
                    <el-tab-pane :label="`照片(${getCurrentForm.pipeDefects.length || 0})`" name="picnum">
                      <div class="container">
                        <el-image
                          style="width: 100%; height: 90%; -webkit-user-drag: none"
                          :src="getImgUrlEV"
                          :preview-src-list="getImgUrlArrEV"
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

    <!-- 管段检测详情卡片 -->
    <transition name="el-fade-in-linear">
      <delete-dialog @sendBool="getBool" v-if="detailsDialogFormVisible" :checkParam="DetailsId"></delete-dialog>
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
  queryDefectdetails,
  histroyPipeData
} from '@/api/pipelineManage'

// 引入预览pdf插件
import pdfSee from '../components/OpenPdf.vue'
// 引入管道检测组件
import deleteDialog from '../components/checkDetails.vue'

// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

// 引入发布的组件
import summaryForm from '../components/summaryForm.vue'
import projectForm from './components/project'
import inspectForm from './components/inspect'
import defectOne from './components/defectOne'
import assessment from './components/assessment'
import proposal from './components/proposal'

import simpleMap from '@/components/SimpleMap'

import { getDefectDataById, getDefectData, getDefectDataBySE } from '@/api/sysmap/drain'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { comSymbol } from '@/utils/comSymbol'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'

import Text from 'ol/style/Text'
import { Style } from 'ol/style'

import defectImg1 from '@/assets/images/traingle1.png'
import defectImg2 from '@/assets/images/traingle2.png'
import defectImg3 from '@/assets/images/traingle3.png'
import defectImg4 from '@/assets/images/traingle4.png'
import defectImg0 from '@/assets/images/traingle0.png'

import Icon from 'ol/style/Icon'
import { unByKey } from 'ol/Observable'
import { Overlay } from 'ol'
import * as echarts from 'echarts'

export default {
  props: ['data'],
  components: {
    summaryForm,
    projectForm,
    inspectForm,
    defectOne,
    assessment,
    proposal,
    pdfSee,
    simpleMap,
    oneRelease,
    deleteDialog
  },
  data() {
    return {
      DetailsId: null, // 检测详情的id
      DetailsForm: {}, // 管道缺陷缩略框
      imgArrIndex: 0, // 缩略框照片索引
      detailsDialogFormVisible: false, // 检测详情弹框显影
      pipDialogFormVisible: false, // 详情弹框显影
      lastFileList: [], //上次上次的文件列表
      fullscreenLoading: false, // 加载
      remark: '', // 备注
      pdfUrl: '', // pdf地址
      activeName: 'picnum', // 照片视频tab标签
      activeNameEV: 'picnum', // 照片视频tab标签
      currentForm: [], // 缩略提示框
      currentIndex: 0, // 当前页数
      // 评估
      currentInfoCard: false, // 弹出框
      currentInfoCard2: false, // 弹出框
      deleteDialogVisible: false, // 删除提示框显影
      withdrawDialogVisible: false, // 撤回提示框显影
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
        { title: '(AJ)支管暗接', type: 'AJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(BX)变形', type: 'BX', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CK)错口', type: 'CK', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CR)异物穿入', type: 'CR', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(FS)腐蚀', type: 'FS', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(PL)破裂', type: 'PL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(QF)起伏', type: 'QF', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(SL)渗透', type: 'SL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(TJ)脱节', type: 'TJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(TL)接口材料脱落', type: 'TL', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 }
      ], // 管道缺陷数量统计表
      defectQuantityStatisticsB: [
        { title: '(CJ)沉积', type: 'CJ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(CQ)残墙、坝根', type: 'CQ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(FZ)浮渣', type: 'FZ', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(JG)结垢', type: 'JG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(SG)树根', type: 'SG', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 },
        { title: '(ZW)障碍物', type: 'ZW', oneValue: 0, twoValue: 0, threeValue: 0, fourValue: 0, value: 0 }
      ],
      batchReleaseDialog: false, // 批量发布弹框
      // 选择框分页参数
      selectParm: { current: 1, size: 30 },
      selectLoadTotal: 0, // 选择框总页数
      selectArr: [], // 选择工程数组(报告上传)
      videoSelectArr: [], // 选择工程数组(视频上传)
      // 表格参数
      tableContent: [
        { sortable: false, label: '检测报告名称', name: 'wordInfoName' },
        { sortable: true, label: '检测段数', name: 'jcnum' },
        { sortable: true, label: '检测长度', name: 'jclength' },
        { sortable: false, label: '工程名称', name: 'prjName' },
        { sortable: false, label: '工程地点', name: 'address' },
        { sortable: false, label: '施工单位', name: 'sgunit' },
        { sortable: true, label: '检测日期', name: 'jcDate' },
        { sortable: false, label: '入库人', name: 'createUserName' },
        { sortable: true, label: '入库时间', name: 'createTime' }
      ],
      // 日期选择器规则
      pickerOptions0: '',
      pickerOptions1: '',
      // 搜索功能参数
      searchValue: {
        dateTime: {
          startDate: '',
          finishDate: ''
        }, // 检测日期
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
      formLabelWidth: '84px',
      loadingBool: false, // 加载按钮显隐

      //
      showId: 0,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj43', // 当前坐标系
      vectorLayer: null,
      vectorLayer2: null,
      hasLoadMap: false,
      map: null,
      clickEvent: null
    }
  },
  created() {
    let res = this.getDate()
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n !== '检测报告管理') {
        this.clearAll()
      } else {
        this.init()
      }
    },
    'searchValue.dateTime.startDate': function (n) {
      this.searchValue.dateTime.finishDate = n
    }
  },
  computed: {
    // 提示框当前信息
    getCurrentForm() {
      return this.currentForm ? this.currentForm[this.currentIndex] : {}
    },
    // <--- 管道缺陷
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
    },
    // ------>
    // 设置发布标题
    setTitle() {
      return this.isRelease ? '检测报告发布' : '检测报告详情'
    },
    // 统计饼图数据信息
    defectTotal() {
      let arr = this.defectQuantityStatisticsA.concat(this.defectQuantityStatisticsB)
      let newArr = arr.map((v) => {
        if (!v.value) {
          return { label: { show: false } }
        } else {
          return { value: v.value, title: v.title }
        }
      })
      console.log('newArr', newArr)
      return newArr
    },
    // 提示框当前信息
    // 获取照片数组路径
    getImgUrlArrEV() {
      let arr = this.getCurrentForm.pipeDefects.map((v) => {
        return baseAddress + '/psjc/file' + v.picPath
      })
      return arr
    },
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
    // 动态设置上传地址
    getBaseAddress() {
      return baseAddress + '/psjc/sysUploadFile/uploadFile'
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
    console.log('IP', baseAddress)
    this.map = this.data.mapView
    this.projUtil = new projUtil()
    this.projUtil.resgis(this.currentDataProjName)
    this.init()
  },
  destroyed() {
    this.clearAll()
  },
  methods: {
    // 打开检测详情
    async openDetailsDialog(id) {
      this.DetailsId = id
      console.log('打开检测详情', this.DetailsId)
      this.detailsDialogFormVisible = true
    },

    // 关闭检测详情弹框
    getBool(bool) {
      this.detailsDialogFormVisible = bool
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

    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      //因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      let date1 = new Date(this.searchValue.dateTime.startDate).getTime()
      let date2 = new Date(this.searchValue.dateTime.finishDate).getTime()
      this.pickerOptions0 = {
        disabledDate: (time) => {
          if (date2 != '') {
            // return time.getTime() > Date.now() || time.getTime() > date2
            return time.getTime() >= date2
          } else {
            return time.getTime() >= Date.now()
          }
        }
      }
      this.pickerOptions1 = {
        disabledDate: (time) => {
          // return time.getTime() < date1 || time.getTime() > Date.now()
          return time.getTime() <= date1 - 8.64e7
        }
      }
    },
    // 绘制统计饼图
    renderEcharts() {
      console.log('渲染echarts')
      let chartDom = document.getElementById('statistics_echatrs')
      let myChart = echarts.init(chartDom)
      let option
      option = {
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            // console.log('标题参数', a)
            return `${a['data']['title']} 数量 ${a['data']['value']} `
          }
        },
        series: [
          {
            name: '管道缺陷数量统计图',
            type: 'pie',
            radius: '50%',
            data: this.defectTotal || [],
            label: {
              formatter: function (a) {
                // console.log('标题参数', a)
                return `${a['data']['title']} ${a['percent'].toFixed(1) + '%'} `
              },
              backgroundColor: '#F6F8FC',
              borderWidth: 1,
              borderRadius: 4
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
    },
    // 评估
    // 上一张照片
    lastImg() {
      console.log('上一张照片', this.getCurrentForm.pipeDefects)

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
    // 打开缩略提示框
    // type: 1: 缺陷，2：管线
    //  传缺陷id
    async openPromptBox(id, position, type) {
      if (type === 1) {
        let res = await queryDefectdetails(id)
        this.DetailsForm = res.result
        this.currentInfoCard = true
        console.log('管段缺陷', res)
      } else {
        // 管段评估(查询管段部分) 传管段编号
        let resEV = await histroyPipeData({ expNo: id })
        this.currentIndex = 0
        this.currentForm = resEV.result
        this.currentInfoCard2 = true
        console.log('管段评估', resEV)
      }

      if (position) {
        let popupId = type === 1 ? 'popupCard' : 'popupCardEV'
        this.popup = new Overlay({
          element: document.getElementById(popupId),
          //当前窗口可见
          autoPan: true,
          positioning: 'bottom-center',
          stopEvent: true,
          offset: [18, -25],
          autoPanAnimation: { duration: 250 }
        })
        this.map.addOverlay(this.popup)
        this.popup.setPosition(position)
      }
      // console.log('打开缩略提示框2', this.currentForm, this.isPromptBox)
    },
    // 双击打开详情或发布
    openDetails(row, column) {
      if (row.state == '1') {
        this.testReportDetails(row.id)
        console.log('详情', row.state)
      } else {
        this.testReportDetails(row.id, true)
        console.log('发布', row.state)
      }
    },

    addMapEvent() {
      this.clickEvent = this.map.on('click', (evt) => {
        let features = this.map.getFeaturesAtPixel(evt.pixel)
        this.lightLayer.getSource().clear()
        if (features.length !== 0) {
          let feature = features.find((fea) => fea.getGeometry() instanceof Point) || features[0]
          let type, id
          if (feature.getGeometry() instanceof Point) {
            type = 1
            id = feature.get('id')
          } else {
            type = 2
            id = feature.get('expNo')
          }
          let geometry = feature.getGeometry().clone()
          let position = new mapUtil().getCenterFromFeatures(feature)
          this.lightLayer.getSource().addFeature(new Feature({ geometry }))
          this.openPromptBox(id, position, type)
        } else {
          this.currentInfoCard = false
          this.currentInfoCard2 = false
        }
      })
    },
    init() {
      this.lightLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(8, 'rgba(0, 255, 255, 0.8)', 10, 'rgba(0, 255, 255, 0.6)')
      })
      this.vectorLayer = new VectorLayer({ source: new VectorSource() })
      this.map.addLayer(this.vectorLayer)
      this.map.addLayer(this.lightLayer)

      this.vectorLayer2 = new VectorLayer({ source: new VectorSource() })
      this.getPipeDefectData()
      this.addMapEvent()
    },
    clearAll() {
      this.map.removeLayer(this.vectorLayer)
      this.map.removeLayer(this.lightLayer)
      this.$refs.myMap && this.$refs.myMap.map.removeLayer(this.vectorLayer2)
      this.vectorLayer2.getSource().clear()
      this.clickEvent && unByKey(this.clickEvent)
    },
    // 根据状态设置每列表格样式
    modality(obj) {
      // 通过id标识来改变当前行的文字颜色
      console.log('obj', obj.row)
      let idArr
      if (this.multipleSelection != []) {
        idArr = this.multipleSelection.map((v) => v.id)
      }
      if (idArr.some((v) => v == obj.row.id)) {
        return 'rowBgBlue'
      }
    },
    lightFea(row) {
      let length = this.multipleSelection.length
      let id = this.multipleSelection.length == 1 ? this.multipleSelection[0].id : null
      // let
      this.$refs.multipleTable.clearSelection(row)
      if (row.state != '1') {
        if (length > 1 || length < 1) {
          this.$refs.multipleTable.toggleRowSelection(row)
        } else if (id) {
          if (row.id == id) {
            this.$refs.multipleTable.toggleRowSelection(row, false)
          } else {
            this.$refs.multipleTable.toggleRowSelection(row)
          }
        }
      }

      console.log('报告数据')
      let features = this.getPipeDefectData(1, row.id, true)
    },
    /**
     * 小地图完成加载后
     * */
    afterMapLoad() {
      console.log('小地图加载')
      this.getPipeDefectData(2, this.id)
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
      console.log('打开小地图')
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
          if (res.result) {
            let reportInfo = Array.isArray(res.result) ? res.result : [res.result]
            let pipeData = reportInfo.map((item) => item.pipeStates).flat()
            let { strucDefectFeatures, funcDefectFeatures, pipeDefectFeatures } = this.getFeatures(pipeData, !light)

            console.log('获取数据')
            let center = new mapUtil().getCenterFromFeatures([...strucDefectFeatures, ...funcDefectFeatures])
            map.getView().setCenter(center)
            if (light) {
              this.lightLayer.getSource().clear()
              this.lightLayer.getSource().addFeatures([...funcDefectFeatures, ...strucDefectFeatures])
              let center = new mapUtil().getCenterFromFeatures([...strucDefectFeatures, ...funcDefectFeatures])
              map.getView().setCenter(center)
              map.getView().setZoom(18)
            } else {
              this.lightLayer.getSource().clear()
              layer.getSource().clear()
              map.getView().setZoom(12)
              if (
                strucDefectFeatures.length !== 0 ||
                funcDefectFeatures.length !== 0 ||
                pipeDefectFeatures.length !== 0
              ) {
                layer.getSource().addFeatures([...strucDefectFeatures, ...funcDefectFeatures, ...pipeDefectFeatures])
              }
            }
            if (id) {
              map.getView().setZoom(18)
            }
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    /**
     * 构造要素
     * @param featureArr 数组
     * @param hasStyle 是否设置样式
     * */
    getFeatures(featureArr, hasStyle) {
      let style = null,
        features = { pipeDefectFeatures: [], funcDefectFeatures: [], strucDefectFeatures: [] }
      if (featureArr.length === 0 || !featureArr[0]) {
        return features
      }
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
            hasStyle && fFea.setStyle(comSymbol.getLineStyle(5, findFuncColor.color))
            for (let i in feaObj) {
              i !== 'geometry' && fFea.set(i, feaObj[i])
            }
            features.funcDefectFeatures.push(fFea)
          }
          // 结构性缺陷
          if (findStrucColor) {
            let sFea = feature.clone()
            hasStyle && sFea.setStyle(comSymbol.getLineStyle(5, findStrucColor.color))
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
                { level: '/', img: defectImg0, index: 4 }
              ]
              let findimg = null

              if (feaObj.defectLevel) {
                findimg = imgs.find((colorObj) => feaObj['defectLevel'].includes(colorObj.level))
              }
              // 缺少 defectLevel 字段
              if (findimg) {
                let rotation = getIconRat(lineCoors)
                hasStyle &&
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

    // 关闭上传弹框时
    closeDialogDocx() {
      this.loadingBool = false
      this.$refs['formDocx'] && this.$refs['formDocx'].resetFields()
      this.$refs['updataDocx'] && this.$refs['updataDocx'].clearFiles()
      console.log("this.$refs['updataDocx']", this.$refs['updataDocx'])
      this.selectParm = { current: 1, size: 30 }
      this.selectLoadTotal = 0 // 选择框总页数
      this.upDataTable = []
      this.fileList = []
      this.getPipeDefectData() // 刷新地图
      this.getDate()

      console.log('关闭了弹框')
      return false
    },
    closeDialogVideo() {
      this.loadingBool = false
      this.$refs['formVideo'] && this.$refs['formVideo'].resetFields()
      this.$refs['updataVideo'] && this.$refs['updataVideo'].clearFiles()
      console.log("this.$refs['updataVideo']", this.$refs['updataVideo'])
      this.selectParm = { current: 1, size: 30 }
      this.selectLoadTotal = 0 // 选择框总页数
      this.upDataTable = []
      this.getPipeDefectData() // 刷新地图
      this.getDate()

      console.log('关闭了弹框')
      return false
    },
    // 获取字典id
    async getParamsId(type1, type2) {
      // 获取字典id
      // uploadFileType
      let uploadFileTypeDicId = await queryDictionariesId({ keys: 'uploadFileType' })
      // uploadItem
      let uploadItemDictId = await queryDictionariesId({ keys: 'uploadItem' })
      uploadFileTypeDicId = uploadFileTypeDicId.result.uploadFileType
      uploadItemDictId = uploadItemDictId.result.uploadItem
      // await this.$refs.upload.submit()
      uploadFileTypeDicId.forEach((v) => {
        if (v.codeValue == type1) {
          this.updataParamsId.uploadFileTypeDicId = v.id
        }
      })
      uploadItemDictId.forEach((v) => {
        if (v.codeValue == type2) {
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
      // 显示加载
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let timeId = setTimeout(() => {
        loading.close()
        this.$message.error('系统错误')
        clearTimeout(timeId)
      }, 8000)

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
        v.value = v.oneValue + v.twoValue + v.threeValue + v.fourValue
        this.defectSumObj.oneSum += v.oneValue
        this.defectSumObj.twoSum += v.twoValue
        this.defectSumObj.threeSum += v.threeValue
        this.defectSumObj.fourSum += v.fourValue
        this.defectSumObj.total += v.value
      })
      this.defectQuantityStatisticsB.forEach((v) => {
        v.value = v.oneValue + v.twoValue + v.threeValue + v.fourValue
        this.defectSumObj.oneSum += v.oneValue
        this.defectSumObj.twoSum += v.twoValue
        this.defectSumObj.threeSum += v.threeValue
        this.defectSumObj.fourSum += v.fourValue
        this.defectSumObj.total += v.value
      })

      let resUrl = await queryPipeState(id)
      this.remark = resUrl.result.remark
      console.log('详情', resUrl)
      if (resUrl.result.pdfFilePath) {
        this.pdfUrl = baseAddress + '/psjc/file' + resUrl.result.pdfFilePath
        // console.log('this.pdfUrl',this.pdfUrl);
      } else {
        this.pdfUrl = null
      }
      this.dialogFormVisible3 = true
      this.$nextTick(() => {
        this.renderEcharts()

        loading.close()
      })
    },
    // 单个发布
    async oneReleaseBtn() {
      // &remark=${this.remark}
      let param = {
        id: this.id,
        remark: this.remark,
        state: '1'
      }
      let res = await oneRelease(param)
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
    withdrawBtn(id) {
      this.id = id
      this.withdrawDialogVisible = true
    },
    // 确认撤回
    async isWithdraw() {
      let res = await withdrawReport(this.id)
      if (res.result) {
        this.$message({
          message: '撤回成功',
          type: 'success'
        })
      } else {
        this.$message.error('撤回失败')
      }
      this.withdrawDialogVisible = false
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
      this.fileList = fileList
      let num = 1024.0 //byte
      // console.log('视频file', file)
      // console.log('上传file的状态', file.status)
      // console.log('视频fileList', fileList)
      this.upDataTable = this.fileList.map((v) => {
        return {
          name: v.name,
          size: (v.size / Math.pow(num, 2)).toFixed(2) + 'MB',
          status: v.status
        }
      })
      console.log('this.upDataTable', this.upDataTable)
      // console.log('this.fileList',this.fileList);
    },
    // 重置
    async resetDate() {
      this.searchValue.checkList = []
      this.searchValue.serchValue = ''
      this.searchValue.dateTime = {
        startDate: '',
        finishDate: ''
      }

      this.changeDate()
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
          name: v.wordInfoName,
          No: v.id
        })
      })
      console.log('下滑到底了')
    },
    // 视频上传
    async selectLoadMoreVideo() {
      if (this.selectParm.current * this.selectParm.size >= this.selectLoadTotal) return
      this.selectParm.current++
      let arr
      // 选择报告名称的分页查询
      await queryPageTestReportNew(this.selectParm).then((res) => {
        arr = res.result.records
      })
      arr.forEach((v) => {
        this.videoSelectArr.push({
          name: v.wordInfoName,
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
      let arr
      // 选择报告名称的分页查询
      await queryPageTestReportNew(this.selectParm).then((res) => {
        arr = res.result.records
        this.selectLoadTotal = res.result.total
      })
      this.videoSelectArr = arr.map((v) => {
        return {
          name: v.wordInfoName,
          No: v.id
        }
      })
      console.log('视频选择框数据', this.videoSelectArr)
      this.dialogFormVisible2 = true
    },
    // 上传按钮
    async uploadWord() {
      this.$refs['formDocx'].validate(async (valid) => {
        if (valid) {
          this.loadingBool = true
          // 获取字典id
          await this.getParamsId('wordInfoDoc', 'tf_ywpn_prjinfo_w')
          this.updataParamsId.itemId = this.form.name
          //  console.log('提交前', this.$refs.updataDocx.submit)
          await this.$refs.updataDocx.submit()
          //  console.log('提交后', this.$refs.updataDocx.submit)
        } else {
          console.log('不能提交!!')
          return false
        }
      })
    },
    async uploadVideoWord() {
      this.$refs['formVideo'].validate(async (valid) => {
        if (valid) {
          this.loadingBool = true
          // 获取字典id
          await this.getParamsId('pipeVideo', 'tf_ywpn_wordinfo_w')
          this.updataParamsId.itemId = this.form.name
          console.log('提交前', this.$refs.updataVideo)
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
      if (res.result == null || res.result.length == 0) {
        file.status = 'error'
        // this.$message.error('《' + file.name + '》上传失败,请检查文件格式')
      }
      if (arrState) {
        this.$message({
          showClose: true,
          message: '文件上传结束'
        })
        this.lastFileList = fileList
        this.loadingBool = false
        // let timeId = setTimeout(() => {
        //   this.dialogFormVisible = false
        //   this.form.name = ''
        //   clearTimeout(timeId)
        // }, 1500)
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
      // console.log('上传后的res信息', res)
      // console.log('上传后的file信息', file)
      // console.log('上传后的fileList信息', fileList)
      //     // console.log('上传后的文件列表信息', fileList)
      //   }
      // })
    },
    // 检测报告是否已被上传成功过
    checkState(file) {
      console.log('当前文件状态', file)
      console.log('上传的文件列表', this.upDataTable)
      if (file.status == 'success') {
        this.$message({
          message: '文件都已上传完成',
          type: 'success'
        })
        this.loadingBool = false
        return false
      }
    },
    // 视频
    handleAvatarSuccessVideo(res, file, fileList) {
      let arrState = fileList.every((v) => v.status != 'ready' && v.status != 'uploading')
      // console.log(arrState)
      if (res.result == null || res.result.length == 0) {
        file.status = 'error'
        // this.$message.error('《' + file.name + '》上传失败,请检查文件格式')
      }
      if (arrState) {
        this.$message({
          showClose: true,
          message: '文件上传结束'
        })
        this.loadingBool = false
        // let timeId = setTimeout(() => {
        //   this.dialogFormVisible2 = false
        //   this.form.name = ''
        //   clearTimeout(timeId)
        // }, 1500)
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
      console.log('文件上传中', file)
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
      // console.log('搜索时传的参数', params)
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
      // console.log('参数', params)
      if (params) {
        data.jcStartDate = params.dateTime.startDate
        data.jcEndDate = params.dateTime.finishDate
        data.state = params.checkList
        data.prjNo = params.serchValue
      }
      // console.log('最后传进去的参数', data)
      await queryPageTestReportNew(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
    },
    // 发布tab标签点击事件
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    add() {},
    // 表格选中事件
    handleSelectionChange(val) {
      // console.log('表格选中事件', val)
      if (val.length !== 0) {
        this.getPipeDefectData(1, val[0].id, true)
      } else {
        this.getPipeDefectData()
      }
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
      } else if (value == 'error') {
        return '×'
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
  color: #67c23a;
}
.font-blue {
  color: #2d74e7;
}
.font-red {
  font-weight: bold;
  color: #f65252;
}
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: $fontSize;
  /deep/.histroyPipeData {
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
  // 详情卡片的样式
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
          font-size: 14px;
          color: #606266;
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
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
  // 发布盒子布局
  .release-box {
    /deep/ .el-dialog {
      display: flex;
      flex-direction: column;
      .el-dialog__body {
        flex: 1;
        padding: 15px 20px !important;
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
        height: 78vh;
        max-width: 64vw;
        margin-top: -3px;
        padding: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
      }
    }
    .left {
      flex: 2;
      .releaseContent {
        height: 78vh;
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
        height: 78vh;
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
#popupCardEV {
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