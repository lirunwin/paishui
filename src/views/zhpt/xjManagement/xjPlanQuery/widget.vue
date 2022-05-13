<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2" style="margin-left:8px;">巡查日期</span>
      <el-date-picker v-model="startTime" size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd" /> ~
      <el-date-picker v-model="endTime" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd" />
      <!-- <el-date-picker v-model="timeForMission" type="datetimerange" size="small" style="width:300px"
                range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" clearable/> -->
      <span class="title2">部门</span>
      <el-select v-model="chooseGroup" :disabled="hasGroup" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" @change="Bmchange()">
        <el-option v-for="item of searchGroupArray" :index='item.index' :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <span class="title2">人员</span>
      <el-select v-model="chooseWorker" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable>
        <el-option v-for="item in searchWorkers" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select>
      <span class="title2">巡检类型</span>
      <el-select v-model="planType" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择计划类型" clearable>
        <el-option v-for="item of planTypeArray" :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <span class="title2">状态</span>
      <el-select v-model="chooseStatus" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择状态" clearable>
        <el-option v-for="item of statusArray" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-button size="small" type="primary" @click="getData">查询</el-button>
    </el-row>
    <el-table class="mapTable" :data="dataT1" border @row-dblclick="planInfo" style="width: 100%;margin-top: 8px;" ref="table1" height="calc(100% - 88px)" stripe highlight-current-row>
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="departmentName" :formatter="formatter" sortable label="部门" show-overflow-tooltip />
      <el-table-column prop="inspectType" :formatter="formatter" sortable label="巡检类型" show-overflow-tooltip />
      <el-table-column prop="planType" :formatter="formatter" sortable label="计划类型" show-overflow-tooltip />
      <el-table-column prop="createTime" :formatter="formatter" sortable width="200px" label="派发时间" show-overflow-tooltip />
      <el-table-column prop="createUserName" :formatter="formatter" sortable label="创建人" />
      <el-table-column prop="inspectUserList" :formatter="formatter" sortable label="巡查人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="planBegindate" :formatter="formatter" sortable width="200px" label="起始时间" show-overflow-tooltip />
      <el-table-column prop="planEnddate" :formatter="formatter" sortable width="200px" label="结束时间" show-overflow-tooltip />
      <el-table-column prop="planState" :formatter="formatter" sortable label="执行状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isDispatching" :formatter="formatter" sortable label="是否派工" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isPlanStop" :formatter="formatter" sortable label="是否暂停" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isPlanInvalid" :formatter="formatter" sortable label="是否作废" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="planPercent" sortable label="计划完成率" show-overflow-tooltip></el-table-column>
            <el-table-column prop="percent" sortable label="实际完成率" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="planInfo(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px;width:350px;">
      <el-col :span="20">
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :current-page="pageInfo.current" :page-size="pageInfo.size" @size-change="changeSize" @current-change="changeCurrent" @prev-click="changeCurrent" @next-click="changeCurrent" :total="tableTotal" />
      </el-col>
    </el-row>
    <el-dialog v-dialogDrag title="任务详细" :visible.sync="diaVisiable3" width="100%" top="calc(50vh - 450px)" @close="clearSelectData">
      <div style="width:100%;padding-right:8px;">
        <tf-table-legend label="巡检信息" isopen="true" style="margin-top: 8px;">
          <div style="width:100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv" ref="xjType"><span class="flexTitle">巡查类型：</span>
              <div class="flexInfo">管线巡检</div>
            </div>
            <div class="flexDiv" ref="xjGroup">
              <span class="flexTitle">巡查组：</span>
              <div class="flexInfo">巡检组</div>
            </div>
            <div class="flexDiv" ref="xjWorker">
              <span class="flexTitle">巡查人：</span>
              <div class="flexInfo">张巡检</div>
            </div>
            <div class="flexDiv" ref="xjBeginAndEndTime">
              <span class="flexTitle">起止时间：</span>
              <div class="flexInfo">2020-01-01 18:00:00 - 2020-01-01 18:00:00</div>
            </div>
            <div class="flexDiv" ref="xjPlanNumber">
              <span class="flexTitle">计划完成率</span>
              <div class="flexInfo"></div>
            </div>
            <div class="flexDiv" ref="sjxjPlanNumber">
              <span class="flexTitle">实际完成率</span>
              <div class="flexInfo">0%</div>
            </div>
            <!-- <div class="flexDiv"  ref="sjxjAllTypeNumber">
                            <span class="flexTitle">各类型完成率</span><div class="flexInfo">0%</div>
                        </div> -->
          </div>
        </tf-table-legend>
        <tf-table-legend label="任务内容" isopen="true" style="margin-top: 8px;">
          <div style="width:100%;margin-top: 8px;height:650px">
            <div style="width:100%;height: calc(100% - 250px);" ref="mapBox1"></div>
            <div class='tableDiv' style="width:100%; height: 250px;">
              <el-tabs type="border-card" style="width:100%; height: 100%;">
                <el-tab-pane label="任务内容">
                  <el-table :data="currentDataT3" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column v-for="(item, index) in headerT3" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange3" :page-size="10" layout="total, prev, pager, next" :total="tableTotal3">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="上报记录">
                  <el-table :data="currentDataT4" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="上报时间：">
                            <span>{{ props.row.createTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报人：">
                            <span>{{ props.row.createUserName }}</span>
                          </el-form-item>
                          <el-form-item label="上报说明：">
                            <span>{{ props.row.note }}</span>
                          </el-form-item>
                          <el-form-item label="图片附件：">
                            <template v-if="props.row.filePathLists">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.filePathLists[0]" :preview-src-list="props.row.filePathLists">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="语音附件：">
                            <template v-if="props.row.videos">
                              <template v-for="(item,index) in props.row.videos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column v-for="(item, index) in headerT4" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange4" :page-size="10" layout="total, prev, pager, next" :total="tableTotal4">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="管线巡检记录">
                  <el-table :data="currentDataT5" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="阀顶高度(m)：">
                            <span>{{ props.row.fdH }}</span>
                          </el-form-item>
                          <el-form-item label="井盖直径(mm)：">
                            <span>{{ props.row.jgDiam }}</span>
                          </el-form-item>
                          <el-form-item label="井深(m)：">
                            <span>{{ props.row.jsDepth }}</span>
                          </el-form-item>
                          <el-form-item label="井室情况：">
                            <span>{{ props.row.jsqkNote }}</span>
                          </el-form-item>
                          <el-form-item label="井位情况：">
                            <span>{{ props.row.jwNote }}</span>
                          </el-form-item>
                          <el-form-item label="井位序号：">
                            <span>{{ props.row.jwNum }}</span>
                          </el-form-item>
                          <el-form-item label="开启度：">
                            <span>{{ props.row.kqd }}</span>
                          </el-form-item>
                          <el-form-item label="口径：">
                            <span>{{ props.row.pipeBore }}</span>
                          </el-form-item>
                          <el-form-item label="管线情况：">
                            <span>{{ props.row.pipeNotes }}</span>
                          </el-form-item>
                          <el-form-item label="路面情况：">
                            <span>{{ props.row.roadNote }}</span>
                          </el-form-item>
                          <el-form-item label="设施编号：">
                            <span>{{ props.row.sbCode }}</span>
                          </el-form-item>
                          <el-form-item label="设施类别：">
                            <span>{{ props.row.sbType }}</span>
                          </el-form-item>
                          <el-form-item label="上报时间：">
                            <span>{{ props.row.createTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报人：">
                            <span>{{ props.row.createUserName }}</span>
                          </el-form-item>
                          <el-form-item label="上报说明：">
                            <span>{{ props.row.note }}</span>
                          </el-form-item>
                          <el-form-item label="图片附件：">
                            <template v-if="props.row.filePathLists">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.filePathLists[0]" :preview-src-list="props.row.filePathLists">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="语音附件：">
                            <template v-if="props.row.videos">
                              <template v-for="(item,index) in props.row.videos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />
                                    <!-- <audio style="height:30px;width:100%" controlslist="nodownload" oncontextmenu="return false" controls="controls"><source :src="item">您的浏览器不支持 audio 标签。</audio> -->
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column v-for="(item, index) in headerT5" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange5" :page-size="10" layout="total, prev, pager, next" :total="tableTotal5">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="水压测试记录">
                  <el-table :data="currentDataT6" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="参考压力(Mpa)：">
                            <span>{{ props.row.cky }}</span>
                          </el-form-item>
                          <el-form-item label="实际压力(Mpa)：">
                            <span>{{ props.row.sjyl }}</span>
                          </el-form-item>
                          <el-form-item label="测量时间：">
                            <span>{{ props.row.yljcTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报时间：">
                            <span>{{ props.row.createTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报人：">
                            <span>{{ props.row.createUserName }}</span>
                          </el-form-item>
                          <el-form-item label="上报说明：">
                            <span>{{ props.row.note }}</span>
                          </el-form-item>
                          <el-form-item label="图片附件：">
                            <template v-if="props.row.filePathLists">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.filePathLists[0]" :preview-src-list="props.row.filePathLists">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="语音附件：">
                            <template v-if="props.row.videos">
                              <template v-for="(item,index) in props.row.videos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />

                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column v-for="(item, index) in headerT6" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange6" :page-size="10" layout="total, prev, pager, next" :total="tableTotal6">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="消防栓记录">
                  <el-table :data="currentDataT7" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="编号：">
                            <span>{{ props.row.sbCode }}</span>
                          </el-form-item>
                          <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="排放口径（mm）：">
                            <span>{{ props.row.stCaliber }}</span>
                          </el-form-item>
                          <el-form-item label="排放水量（m3）：">
                            <span>{{ props.row.stDischarge }}</span>
                          </el-form-item>
                          <el-form-item label="排放时间（秒）：">
                            <span>{{ props.row.stTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报时间：">
                            <span>{{ props.row.createTime }}</span>
                          </el-form-item>
                          <el-form-item label="上报人：">
                            <span>{{ props.row.createUserName }}</span>
                          </el-form-item>
                          <el-form-item label="上报说明：">
                            <span>{{ props.row.note }}</span>
                          </el-form-item>
                          <el-form-item label="图片附件：">
                            <template v-if="props.row.filePathLists">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.filePathLists[0]" :preview-src-list="props.row.filePathLists">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="语音附件：">
                            <template v-if="props.row.videos">
                              <template v-for="(item,index) in props.row.videos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />

                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column v-for="(item, index) in headerT7" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange7" :page-size="10" layout="total, prev, pager, next" :total="tableTotal7">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>

                <el-tab-pane label="探漏记录">
                  <el-table :data="currentDataT8" style="width: 100%;margin-top: 8px;" height="150" stripe highlight-current-row @row-click="rowClickT3">
                    <template slot="empty">
                      <img src="@/assets/icon/null.png" alt="">
                      <p class="empty-p">暂无数据</p>
                    </template>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="管材：">
                            <span>{{ props.row.pipe }}</span>
                          </el-form-item>
                          <el-form-item label="管径(mm)：">
                            <span>{{ props.row.pipeDiameter }}</span>
                          </el-form-item>
                          <el-form-item label="管道埋设年代：">
                            <span>{{ props.row.pipelineBurialAge }}</span>
                          </el-form-item>
                          <el-form-item label="管道埋深(m)：">
                            <span>{{ props.row.pipelineBuriedDepth }}</span>
                          </el-form-item>
                          <el-form-item label="地面介质：">
                            <span>{{ props.row.groundMedium }}</span>
                          </el-form-item>
                          <el-form-item label="上报日期：">
                            <span>{{ props.row.inspectTime }}</span>
                          </el-form-item>
                          <el-form-item label="管道破损情况：">
                            <span>{{ props.row.pipelineDamageCondition }}</span>
                          </el-form-item>
                          <el-form-item label="探测方法和使用仪器简要说明：">
                            <span>{{ props.row.detectionNode }}</span>
                          </el-form-item>
                          <el-form-item label="漏水点简要说明：">
                            <span>{{ props.row.leakSourceNode }}</span>
                          </el-form-item>
                          <el-form-item label="处理情况：">
                            <span>{{ props.row.handlingInformation }}</span>
                          </el-form-item>
                          <el-form-item label="开挖验证相关说明：">
                            <span>{{ props.row.excavationNode }}</span>
                          </el-form-item>
                          <el-form-item label="漏水点图片附件：">
                            <template v-if="props.row.leakSourceFilePathList2">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.leakSourceFilePathList2[0]" :preview-src-list="props.row.leakSourceFilePathList2">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="漏水点语音附件：">
                            <template v-if="props.row.leakSourceFileVideos">
                              <template v-for="(item,index) in props.row.leakSourceFileVideos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="开挖验证图片附件：">
                            <template v-if="props.row.excavationFilePathList2">
                              <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="props.row.excavationFilePathList2[0]" :preview-src-list="props.row.excavationFilePathList2">
                                </el-image>
                              </div>
                            </template>
                            <template v-else>
                              <span>未上传附件</span>
                            </template>
                          </el-form-item>
                          <el-form-item label="开挖验证语音附件：">
                            <template v-if="props.row.excavationVideos">
                              <template v-for="(item,index) in props.row.excavationVideos">
                                <div class="videosList" :key="index">
                                  <div style="width:150px;padding-right:5px;position:relative;float: left;">
                                    <audio controls="controls" preload='auto' :src="item" style="width: 100%; height: 40px;position: relative;float: left;" />
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <span>未上传语音</span>
                            </template>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column v-for="(item, index) in headerT8" :key="index" :label="item.label" align="center" :prop="item.value" show-overflow-tooltip />
                  </el-table>
                  <el-row style="margin-top: 8px;width:100%;">
                    <el-col :span="20">
                      <el-pagination small background @current-change="handleCurrentChange8" :page-size="10" layout="total, prev, pager, next" :total="tableTotal8">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </tf-table-legend>
      </div>
    </el-dialog>
    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>
  </div>
</template>

<script lang="ts">
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检计划查询功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import {Vue,Prop,Component,Watch} from 'vue-property-decorator'
import tfLegend from "@/views/zhpt/common/Legend.vue";
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { queryTaskArrange, addTaskArrange, editTaskArrange, deleteTaskArrange, submitPauseCheckInfo, submitAbandonCheckInfo, xjRoundDispose, queryDetail, getGroupPersonById,queryRegionRelation } from '@/api/xjDailyManageApi'
import { disposeXjType,getPiperecord,getPressrecord,getReportRecord,getPlanDetail,getAllPointTemp } from '@/api/xjApi'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
import { queryBuildList  } from '@/api/xjWorkSiteCheckApi'
import { queryXjPoint,queryXjLine } from '@/api/xjDailyManageApi'
import { getGroupUserMap} from '@/api/base';
import { imageByName} from '@/api/ftp'
import { graphic } from 'echarts/lib/export';
import { getDepartment, getDeptUserList } from '@/api/work'
import { IP } from '@/utils/request'
import { windowOpen } from 'echarts/lib/util/format';
@Component({
 name: 'XjPlanQuery',
components: { tfTableLegend, tfLegend }
})
export default class XjPlanQuery extends Vue {
   @Prop() data:any
    startTime='';
            endTime='';
            startOptions={
                disabledDate:time=> {
                if(this.endTime){
                    return time.getTime() >=new Date(this.endTime);
                }
                },
            }
            endOptions={
                disabledDate:time=> {
                if(this.startTime){
                    return  new Date(this.startTime).getMilliseconds()-1000*60*60*24>time.getTime();
                }
                },
            }
            Polygon=null//多边形类
            planType=''; //计划类型  
            planTypeArray=[];//查询时的巡检类型
            searchGroupUserVoList=[];//存储查询的巡检组和用户
            searchGroupArray=[]//查询时的巡查组
            periodId='';//巡检周期绑定
            periodIds=[]; //存储巡检周期
            diaVisiable3=false;
            hasGroup=false;//登陆用户是否属于一个巡检组
            chooseGroup='';//巡检组
            chooseWorker='';//巡检人
            workers=[]//任务安排时巡检组人员
            searchWorkers=[];//查询时巡检组人员（比workers多了一个全部）
            timeForMission='';//巡检时间段
            lookdataRows=null;//查询详情的数据
            chooseStatus=''; //首页状态
            statusArray=[
                { value: '0', label: '未提交' },
                { value: '1', label: '未审核' },
                { value: '2', label: '未开始' },
                { value: '3', label: '正在执行' },
                { value: '4', label: '计划完成' },
                { value: '7', label: '申请暂停' },
                { value: '9', label: '申请作废' },
                { value: '8', label: '计划已暂停' },
                { value: '10', label: '计划已作废' },
                { value: '5', label: '已开始未执行' },
            ];
            dataT1=[];
            tableTotal=0 //首页数据总条数 
            pageInfo={ current: 1, size: 30};//首页分页信息
            layersAtt=[];
            showPlace=true
            layerFix=[]//存储构造查询语句框的字段信息
            showTable=false;//是否显示查询结果表格
            dataT3=[];//查询结果存储
            headerT3=[];//查询结果表的表头
            currentDataT3=[];//当前页
            tableTotal3=0; //查询结果表的数据总条数
            dataT4=[];//查询结果存储
            headerT4=[]; //查询结果表的表头
            currentDataT4=[];//当前页
            tableTotal4=0; //查询结果表的数据总条数
            dataT5=[];//查询结果存储
            headerT5=[];//查询结果表的表头
            tableTotal5=0 //查询结果表的数据总条数
            currentDataT5=[];//当前页
            dataT6= []; //查询结果存储
            headerT6= []; //查询结果表的表头
            tableTotal6= 0; //查询结果表的数据总条数
            currentDataT6=[];//当前页
            dataT7= []; //查询结果存储
            headerT7= []; //查询结果表的表头
            tableTotal7= 0; //查询结果表的数据总条数
            currentDataT7=[];//当前页
            dataT8= []; //查询结果存储
            headerT8= []; //查询结果表的表头
            tableTotal8= 0; //查询结果表的数据总条数
            currentDataT8=[];//当前页
            pageInfo3= {current: 1, size: 10}; //查询结果表的分页信息
            planLayer=null;//计划图层
            highLayer=null;//高亮图层
            hasclayer=null;//完成情况
            highColor="#00FFFF";//高亮图层颜色
            planColor="#1E90FF";//计划图层颜色
            getQueryResult={
                allObjectIds:[],//最开始查询出的objectid
                groupObjectIds:[],//根据1000为刻度分割出的objectid组
                resultInfo:[],//请求出的所有图形信息
            };
            splitMonth=1000;//切割查询出的objectids（用于server查询）
            planHeader={
                xj:[                    
                    {label: '类型', value: 'layerName'},
                    {label: '到位情况', value: 'isoverName'},
                    {label: '到位时间', value: 'overDate'},
                    {label: '创建时间', value: 'createTime'}
                ],
                report:[
                    {label: '地址', value: 'address'},
                    {label: '上报时间', value: 'createTime'},
                    {label: '上报人', value: 'createUserName'},
                    {label: '上报说明', value: 'note'}
                ],
                press:[
                    {label: '地址', value: 'address'},
                    {label: '参考压力(Mpa)', value: 'ckyl'},
                    {label: '实际压力(Mpa)', value: 'sjyl'},
                    {label: '测量时间', value: 'yljcTime'},
                    {label: '上报时间', value: 'createTime'},
                    {label: '上报人', value: 'createUserName'},
                    {label: '上报说明', value: 'note'}
                ],
                pipe:[
                    {label: '地址', value: 'address'},
                    {label: '阀顶高度(m)', value: 'fdH'},
                    {label: '井盖直径(mm)', value: 'jgDiam'},
                    {label: '井深(m)', value: 'jsDepth'},     
                    {label: '上报时间', value: 'createTime'},
                    {label: '上报人', value: 'createUserName'},
                    {label: '上报说明', value: 'note'}
                ],
                hydrant:[
                    {label: '编号', value: 'sbCode'},
                    {label: '地址', value: 'address'},
                    {label: '排放口径（mm）', value: 'stCaliber'},
                    {label: '排放水量（m3）', value: 'stDischarge'},   
                    {label: '排放时间（秒）', value: 'stTime'},      
                    {label: '上报时间', value: 'createTime'},
                    {label: '上报人', value: 'createUserName'},
                    {label: '上报说明', value: 'note'}
                ],
                leakRecord:[
                    {label: '漏点编号', value: 'leakSourceCode'},
                    {label: '地址', value: 'address'},
                    {label: '管材', value: 'pipe'},      
                    {label: '管径（mm）', value: 'pipeDiameter'},
                    {label: '管段破损情况', value: 'pipelineDamageCondition'},
                    {label: '处理情况', value: 'handlingInformation'},
                    {label: '巡查人', value: 'inspectUser'},
                    {label: '巡查上报时间', value: 'inspectTime'},   
                ]
            };
            piperecord=[];//管线巡查记录
            pressrecord=[];//压力测试记录
            reportrecord=[];//过程上报记录
            mapV=null;
    mounted() {
        //获取巡检类型下拉框
        this.initXjType();
        //建立绘制图层、计划图层、高亮图层
        this.planLayer=new this.data.mapView.TF_graphicsLayer();
        this.hasclayer=new this.data.mapView.TF_graphicsLayer();
        this.highLayer=new this.data.mapView.TF_graphicsLayer();
        this.disposeDayPlanRound() //配置巡检周期
        //添加本模块使用的地图
        this.addMap();
        //获取巡检组
        this.getGroupUserMap();
    }
        @Watch("pageInfo.current")
        "currentChange"(){
            this.getData();
        }
        @Watch("pageInfo.size")
        "sizeChange"(){
            this.getData() 
        }
    created() {
        let currentDate=new Date();
        let month=currentDate.getMonth()+1;
        if(month<10){
            month=parseInt("0"+month.toString());
        }
        let currentDay=currentDate.getDate();
        if(currentDay<10){
            currentDay=parseInt("0"+currentDay.toString());
        }
        this.startTime=currentDate.getFullYear()+"-"+month+"-"+"01";
        this.endTime=currentDate.getFullYear()+"-"+month+"-"+currentDay;
    }
    destroyed(){
        this.mapV.map.removeAll();
    }
        /**
         * 渲染数据处理
        */
        formatter(row, column){
            let typeValue=typeof row[column.property];
            if(typeValue=="undefined"){
                return "-"
            }else if(typeValue=="object"||typeValue=="string"){
                if(!row[column.property]){
                    return "-"
                }else{
                    return row[column.property]
                }
            }else{
                return row[column.property]
            }
        }
        //翻页改变
        changeCurrent(data) {
            this.pageInfo.current = data;
        }
        //页数
        changeSize(data) {
            this.pageInfo.size = data;
        }
        //清除当前查询出的数据
        clearSelectData(){
            this.clearLayer(this.planLayer);
            this.clearLayer(this.highLayer);
            this.clearLayer(this.hasclayer);
            this.showTable=false;
            this.dataT3=[];
            this.currentDataT3=[];
            this.headerT3=[];
            this.dataT4=[];
            this.currentDataT4=[];
            this.tableTotal4=0;
            this.dataT5=[];
            this.tableTotal5=0;
            this.currentDataT5=[];
            this.dataT6=[];
            this.tableTotal6=0;
            this.currentDataT6=[];
            this.dataT7=[], //查询结果存储
            this.tableTotal7=0, //查询结果表的数据总条数
            this.currentDataT7=[],//当前页
            this.dataT8=[], //查询结果存储
            this.tableTotal8=0, //查询结果表的数据总条数
            this.currentDataT8=[],//当前页
            this.getQueryResult.allObjectIds=[];
            this.getQueryResult.groupObjectIds=[];
            this.getQueryResult.resultInfo=[];
        }
        /**
         * 在模块打开的时候预先加载地图
        */
        addMap(){
            var that = this
            var div = this.$refs.cctvMap
            // loadModules(
            // ['esri/Map','esri/views/MapView',"esri/tasks/GeometryService",
            // "esri/tasks/support/LengthsParameters","esri/geometry/geometryEngine",
            // "esri/geometry/Polygon",'esri/layers/WebTileLayer','esri/Basemap',
            // 'esri/layers/TileLayer','esri/layers/MapImageLayer','esri/layers/support/LOD',"esri/config"],
            // { url: esriConfig.baseUrl }).then((
            // [Map,MapView,GeometryService,LengthsParameters,geometryEngine,Polygon,
            //     WebTileLayer,Basemap,TileLayer,MapImageLayer,Lod,mapConfig]
            // ) => {
            //     mapConfig.fontsUrl = esriConfig.font_url
            //     var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
            //     var layersConfig
            //     var aconfig = appconfig
            //     var key = aconfig.isonline ? aconfig.tianMapKey : ''
            //     var baselayers
            //     // 判断在线/离线 设置天地图底图
            //     var tileInfo = aconfig.isonline ?{
            //         visible: true,
            //         // 天地图提供了’t0’,‘t1’,‘t2’,‘t3’,‘t4’,‘t5’,‘t6’,'t7’8个域名，服务端TCP最大链接数是有限制的，轮询机制下瓦片下载的速度更有保证； 
            //         subDomains: '01234567'.split('').map(e => 't' + e),
            //         tileInfo: {
            //             rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
            //             lods: Array.from({length:20}, (e, i) => i).map((e, i) => { return {level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i)}})
            //         }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
            //         } : { visible: true }
            //         layersConfig = aconfig.isonline ? [
            //         [ aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type ], 
            //         [ aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type ], 
            //         [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
            //         ] : [
            //         [ aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type ], 
            //         [ aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type ], 
            //         [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
            //     ]
            //     baselayers = [
            //         new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo),
            //         new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo),
            //         new layerType[layersConfig[2][1]]({ url: layersConfig[2][0] }),
            //         ]
            //     // 底图
            //     var basemap = new Basemap({
            //             baseLayers: baselayers,
            //             title: 'basemap',
            //             id: 'basemap'
            //         })
            //     // 地图视角设置缩放步进级别
            //     basemap.baseLayers.items[2].load().then((e) => {
            //         mapview.constraints.lods = [125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500].map((s, i) => { return new Lod({ level: i, scale: s }) })
            //     })
            //     let map = new Map({ basemap: basemap });
            //     let mapview = new MapView({
            //         container: div,
            //         map: map,
            //         spatialReference: { wkid: 4490 }
            //     });
            //     that.mapV = mapview;
            //     var mapV = mapview;
            //     mapview.ui.components = []
            //     mapview.constraints.lods = mapV.constraints.lods
            //     that.mapV.map.add(this.planLayer);
            //     that.mapV.map.add(this.hasclayer);
            //     that.mapV.map.add(this.highLayer);
            //     // this.arcgis.GeometryService = GeometryService ;
            //     // this.arcgis.LengthsParameters= LengthsParameters;
            //     // this.arcgis.geometryEngine= geometryEngine;
            //     // this.arcgis.Polygon = Polygon;
            // })
        }
        //获取部门下人员
        Bmchange() {
            getDeptUserList({ deptId: this.chooseGroup }).then(res => {
                if (res.code === 1) {
                    this.chooseWorker='';
                    this.searchWorkers = res.result;
                    //获取首页表格数据
                    this.$nextTick(()=>{
                        this.getData();
                    })
                }
            })
        }
        //获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容
        getGroupUserMap(){
            //this.chooseGroup=parseInt(this.$store.state.user.departmentId);
            getDepartment({}).then(res => {
                if (res.code === 1) {
                    this.searchGroupArray = res.result;
                    this.Bmchange();
                }
            });
            // getGroupUserMap().then(res=>{
            //     let userId=this.$store.state.user.userId;                                                                                     
            //     let groupUserMap=res.result.groupUserVoList;
            //     let addUser=[];
            //     res.result.groupUserDeptVoList.forEach(item=>{
            //         addUser.push({id:item.userId,name:item.userName});
            //     })
            //     res.result.groupUserVoList.forEach(item=>{
            //         let index=this.searchGroupUserVoList.findIndex(item2=>{ return item2.id==item.groupId});
            //         if(userId==item.userId){
            //             this.hasGroup=false;
            //             // this.chooseGroup=item.groupId;
            //         }
            //         if(index==-1){
            //             this.searchGroupUserVoList.push({index:this.searchGroupUserVoList.length+0,id:item.groupId,name:item.groupName,data:[{id:"",name:'全部'},{id:item.userId,name:item.userIdName}]})
            //         }else{
            //             this.searchGroupUserVoList[index].data.push({id:item.userId,name:item.userIdName});
            //         }
            //         addUser.push({id:item.userId,name:item.userIdName});
            //     });
            //     addUser.unshift({id:"",name:'全部'});
            //     this.searchGroupUserVoList.unshift({id:"",name:"全部",index:this.searchGroupArray.length+0,data:addUser});
            //     if(!this.hasGroup){
            //         this.chooseGroup="";
            //         this.searchWorkers=addUser;
            //     }else{
            //         let sIndex=this.searchGroupUserVoList.findIndex(item=>{ return item.id==this.chooseGroup});
            //         this.searchWorkers=this.searchGroupUserVoList[sIndex].data;
            //     }
            //     this.searchGroupArray=JSON.parse(JSON.stringify(this.searchGroupUserVoList));
            //      //获取首页表格数据
            //     this.$nextTick(e=>{
            //         this.getData();
            //     })
            // })
        }
        //改变巡检组的情况
        changeGroup(){
            let index=this.searchGroupUserVoList.findIndex(item=>{ return item.id==this.chooseGroup});
            let data=this.searchGroupUserVoList[index].data;
            this.searchWorkers=data;
        }
        //初始化巡检类型
        initXjType(){
            let data={
                size:10000,
				current:1,
            }
                disposeXjType(data).then(res => {
                this.planTypeArray = res.result.records;
            }).catch(err => {
                console.log(err);
            });
        }
        //获取首页表单数据
        getData() {
            this.dataT1 = [];
            // if(!this.timeForMission){
            //     this.timeForMission="";
            // }
            let user=[];
            if(this.chooseWorker==''){
                this.searchWorkers.forEach(item=>{
                    if(item.id!=""){
                        user.push(item.id)
                    }
                })
            }else{
                user=[this.chooseWorker];
            }
            let data = {
                current: this.pageInfo.current,
                size: this.pageInfo.size,
                // inspectGroupId:this.chooseGroup,
                inspectUsers:user.join(','),
                inspectType:this.planType+"",
                planState:this.chooseStatus,
                isDispatching:1,
                planBegindate:this.startTime?this.startTime+" 00:00:00":"",
                planEnddate:this.endTime?this.endTime+" 23:59:59":"",
                deptId:this.chooseGroup
            }
            queryTaskArrange(data).then(res => {
                this.dataT1 = res.result.records
                this.tableTotal = res.result.total
            }).catch(err => {
                console.log(err);
            })
        }
        //配置巡检周期
        disposeDayPlanRound() {
            xjRoundDispose({}).then(res => {
                this.periodIds = res.result.records
            })
        }
        //展示详细信息
        planInfo(e) {
            this.diaVisiable3 = true //显示详细页面弹窗
            this.clearLayer(this.planLayer);
            let sendData={
                id:e.id,
                flag:"1"
            }
            getPlanDetail(sendData).then(res => {
                let data=res.result[0].planVo;
                if(e.inspectGroup==""){
                    e.inspectGroup="全部"
                }
                let dataListInfo={
                    recordVoList:[],
                    pipeRecordVoList:[],
                    pressRecordVoList:[],
                    hydrantRecordList:[],
                    leakRecordList:[]
                };
                res.result.forEach(item=>{
                    if(item.recordVoList){
                        item.recordVoList.forEach(item2=>{
                            if(item2.filePathList&&item2.filePathList.length>0){
                                item2.filePathLists=[];
                                item2.videos=[];
                                item2.others=[];
                                item2.filePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.filePathLists.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.videos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            item2.lat=item2.yaddr;
                            item2.lng=item2.xaddr;
                            dataListInfo.recordVoList.push(item2);
                        })
                    }
                    if(item.pipeRecordVoList){
                        item.pipeRecordVoList.forEach(item2=>{
                            if(item2.filePathList&&item2.filePathList.length>0){
                                item2.filePathLists=[];
                                item2.videos=[];
                                item2.others=[];
                                item2.filePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.filePathLists.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.videos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            item2.lat=item2.yaddr;
                            item2.lng=item2.xaddr;
                            dataListInfo.pipeRecordVoList.push(item2);
                        })
                    }
                    if(item.pressRecordVoList){
                        item.pressRecordVoList.forEach(item2=>{
                            if(item2.filePathList&&item2.filePathList.length>0){
                                item2.filePathLists=[];
                                item2.videos=[];
                                item2.others=[];
                                item2.filePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.filePathLists.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.videos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            item2.lat=item2.yaddr;
                            item2.lng=item2.xaddr;
                            dataListInfo.pressRecordVoList.push(item2);
                        })
                    }
                    if(item.hydrantRecordList){
                        item.hydrantRecordList.forEach(item2=>{
                            if(item2.filePathList&&item2.filePathList.length>0){
                                item2.filePathLists=[];
                                item2.videos=[];
                                item2.others=[];
                                item2.filePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.filePathLists.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.videos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            item2.lat=item2.yaddr;
                            item2.lng=item2.xaddr;
                            dataListInfo.hydrantRecordList.push(item2);
                        })
                    }
                    if(item.leakRecordList){
                        item.leakRecordList.forEach(item2=>{
                            if(item2.leakSourceFilePathList&&item2.leakSourceFilePathList.length>0){
                                item2.leakSourceFilePathList2=[];
                                item2.leakSourceFileVideos=[];
                                item2.others=[];
                                item2.leakSourceFilePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.leakSourceFilePathList2.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.leakSourceFileVideos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            if(item2.excavationFilePathList&&item2.excavationFilePathList.length>0){
                                item2.excavationFilePathList2=[];
                                item2.excavationVideos=[];
                                item2.others=[];
                                item2.excavationFilePathList.forEach(item3=>{
                                    if(this.isImg(item3)){
                                        item2.excavationFilePathList2.push(`${IP}/base/file/loadImg?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }else if(this.isVoice(item3)){
                                        item2.excavationVideos.push(`${IP}/base/file/loadAudio?access_token=${this.tokenFormSession()}&remotePath=${item3}`)
                                    }else{
                                        item2.others.push(`${IP}/base/file/downloadFile?access_token=` + this.tokenFormSession() +'&remotePath=' + item3)
                                    }
                                })
                            }
                            item2.lat=item2.yaddr;
                            item2.lng=item2.xaddr;
                            dataListInfo.leakRecordList.push(item2);
                        })
                    }
                })
                this.headerT3=this.planHeader.xj
                this.headerT4=this.planHeader.report;
                this.headerT5=this.planHeader.pipe;
                this.headerT6=this.planHeader.press;
                this.headerT7=this.planHeader.hydrant;
                this.headerT8=this.planHeader.leakRecord;
                this.dataT4=dataListInfo.recordVoList;
                this.dataT5=dataListInfo.pipeRecordVoList;
                this.dataT6=dataListInfo.pressRecordVoList;
                this.dataT7=dataListInfo.hydrantRecordList,
                this.dataT8=dataListInfo.leakRecordList, 
                this.tableTotal4=this.dataT4.length;
                this.tableTotal5=this.dataT5.length;
                this.tableTotal6=this.dataT6.length;
                this.tableTotal7=this.dataT7.length, 
                this.tableTotal8=this.dataT8.length, 
                this.currentDataT7=this.dataT7.slice(0,10),//当前页
                this.currentDataT8=this.dataT8.slice(0,10),//当前页
                this.currentDataT5=this.dataT5.slice(0,10);
                this.currentDataT6=this.dataT6.slice(0,10);
                this.currentDataT4=this.dataT4.slice(0,10);
                //@ts-ignore
                this.$refs.xjType.innerHTML = '<span class="flexTitle">巡查类型：</span>' + '<span class="flexInfo">' + e.inspectType + '</span>'
                //@ts-ignore
                this.$refs.xjGroup.innerHTML = '<span class="flexTitle">巡查组：</span>' + '<span class="flexInfo">' + e.inspectGroup + '</span>'
                //@ts-ignore
                this.$refs.xjWorker.innerHTML = '<span class="flexTitle">巡查人：</span>' + '<span class="flexInfo">' + e.inspectUserList + '</span>'
                //@ts-ignore
                this.$refs.xjBeginAndEndTime.innerHTML = '<span class="flexTitle">起止时间：</span>' + '<span class="flexInfo">' + e.planBegindate + ' - ' + e.planEnddate + '</span>';
                // this.$refs.xjPlanNumber.innerHTML = '<span class="flexTitle">计划完成率：</span>' + '<span class="flexInfo">' + e.planPercent+'%</span>'
                let planPercents=[];
                let planCurrentPercents=[];
                if(e.planTypeOverList&&e.planTypeOverList.length>0){
                    e.planTypeOverList.forEach(item=>{
                        planPercents.push(item.typeName+":"+item.completionRate+"%");
                        planCurrentPercents.push(item.typeName+":"+(item.percent?item.percent:"")+"%")
                    })
                }
                let planPercentStr=planPercents.join(";");
                let planCurrentPercentStr=planCurrentPercents.join(";");
                //@ts-ignore
                this.$refs.xjPlanNumber.innerHTML = '<span class="flexTitle" style="position: relative;float: left;">计划完成率：</span>' + 
                '<span class="flexInfo" style="width: calc(100% - 100px);display: block; position: relative;float: left; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;" title="'
                +planPercentStr+'">' + planPercentStr+'</span>';
                //@ts-ignore
                this.$refs.sjxjPlanNumber.innerHTML = '<span class="flexTitle" style="position: relative;float: left;">实际完成率：</span>' + 
                '<span class="flexInfo" style="width: calc(100% - 100px);display: block; position: relative;float: left; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;" title="'
                +planCurrentPercentStr+'">' + planCurrentPercentStr+'</span>';
                
                // this.$refs.sjxjPlanNumber.innerHTML = '<span class="flexTitle">实际完成率：</span>' + '<span class="flexInfo">' + (e.percent?(e.percent+"%"):"0%")+'</span>';
                // let str=[];
                // if(e.planTypeOverList&&e.planTypeOverList.length>0){
                //     e.planTypeOverList.forEach(item=>{
                //         str.push((item.typeName+":"+(item.percent?(item.percent+"%"):"0%")));
                //     })
                // }
                // this.$refs.sjxjAllTypeNumber.innerHTML='<span class="flexTitle">各类型完成率：</span>' + '<span class="flexInfo">' + str.join(";")+'</span>'
                //@ts-ignore
                this.$refs.mapBox1.appendChild(this.$refs.cctvMap);
                //this.clearLayer(this.regionLayer);
                //@ts-ignore
                this.$refs.cctvMap.style.display = '';
                let geo=JSON.parse(data.inspectContents);
                this.mapV.extent=this.data.mapView.extent;
                this.lookdataRows=data;
                window.setTimeout(e=>{
                    //this.clearLayer(this.regionLayer);
                },300)
            }) 
            let sendData2={
                current:1,
                size:10000000,
                planId:e.id
            }
            this.dataT3=[];
            getAllPointTemp(sendData2).then(res => {
                if(res.code==1&&res.result&&res.result.length>0){
                    this.dataT3= res.result;
                    this.tableTotal3=this.dataT3.length;
                    this.currentDataT3=this.dataT3.slice(0,10);
                    let pointList_over=[];
                    let pathList_over=[];
                    let pointList_notOver=[];
                    let pathList_notOver=[];
                    res.result.forEach(item=>{
                        if(item.geometry){
                            let geo=JSON.parse(item.geometry);
                            if(item.isover=="1"){
                                if(geo.type=="point"){
                                    pointList_over.push([geo.longitude,geo.latitude]);
                                }else{
                                    pathList_over.push(geo.paths[0]);
                                }
                            }else{
                                if(geo.type=="point"){
                                    pointList_notOver.push([geo.longitude,geo.latitude]);
                                }else{
                                    pathList_notOver.push(geo.paths[0]);
                                }
                            }
                        }
                    });
                    if(this.hasclayer){
                        this.hasclayer.removeAll();
                    }
                    //未完成的颜色
                    let cColor="#87CEFA";
                    //完成的颜色
                    let sColor="#228B22";
                    //完成的点
                    if(pointList_over.length>0){
                        let sym=this.getSym(sColor,'point');
                        let geo=this.getGeo(pointList_over,'point');
                        let graphic=new this.data.mapView.TF_graphic({
                            geometry:geo,
                            symbol: sym
                        });
                        this.hasclayer.add(graphic);
                    }
                    if(pathList_over.length>0){
                        //完成的线
                        let sym =this.getSym(sColor,'line');
                        let geo=this.getGeo(pathList_over,'line');
                        let graphic=new this.data.mapView.TF_graphic({
                            geometry:geo,
                            symbol: sym
                        });
                        this.hasclayer.add(graphic);
                    }
                    if(pointList_notOver.length>0){
                        //未完成的点
                        let sym =this.getSym(cColor,'point');
                        let geo=this.getGeo(pointList_notOver,'point');
                        let graphic=new this.data.mapView.TF_graphic({
                            geometry:geo,
                            symbol: sym
                        });
                        this.hasclayer.add(graphic);
                    }
                    if(pathList_notOver.length>0){
                        //未完成的线
                        let sym =this.getSym(cColor,'line');
                        let geo=this.getGeo(pathList_notOver,'line');
                        let graphic=new this.data.mapView.TF_graphic({
                            geometry:geo,
                            symbol: sym
                        });
                        this.hasclayer.add(graphic);
                    }
                }
            })
        }

        getSym(cColor,type){
            let sym=null;
            if(type=='point'){
                sym={
                    type: "simple-marker", 
                    color: cColor,
                    outline: { 
                        color: cColor,
                        width: "1px"
                    }
                }
            }else{
                sym = {
                    color: cColor,
                    width: "4px",
                    type:"simple-line"
                };
            };
            return sym;
        }

        getGeo(data,type){
            let geo=null;
            if(type=='point'){
                geo={
                    points: data,
                    spatialReference:this.mapV.spatialReference,
                    type: "multipoint",
                }
            }else{
                geo={
                    paths: data,
                    spatialReference: this.mapV.spatialReference,
                    type: "polyline"
                }
            }
            return geo;
        }

        loadMap() {
            //@ts-ignore
            this.$refs.mapBox.appendChild(this.$refs.cctvMap)
            //@ts-ignore
            this.$refs.cctvMap.style.display = ''
            this.mapV.extent = this.data.mapView.extent      
        }
        //高亮点及定位pointData的格式[x,y]
        highPointToMap(pointData){
            this.clearLayer(this.highLayer);
            let point = {
                type: "point",
                latitude: pointData[0],
                longitude: pointData[1],
                spatialReference: this.data.mapView.spatialReference
            };
            const simpleMarkerSymbol = {
                path:
                "M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z",
                color: this.highColor,
                outline: { color: this.highColor, width: "1px" },
                size: "30px",
                yoffset: "15px",
                xoffset: "0px",
                type: "simple-marker"
            };
            let graphic = new this.data.mapView.TF_graphic({
                geometry: point,
                symbol: simpleMarkerSymbol
            });
            let gotoJson = {
                target:graphic,
                zoom: 15
            };
            this.mapV.goTo(gotoJson);
            this.highLayer.add(graphic);
        }
        //高亮线及定位(lines的格式[[[x,y],[x1,x2]],[[x3,y3],[x4,x4]]])
        hLineToMap(lines){
            this.clearLayer(this.highLayer);
            let mapView = this.mapV;
            let sp = mapView.spatialReference;
            let Graphic = this.data.mapView.TF_graphic;
            let lineSymbol = {
                color: this.highColor,
                width: "2px",
                type:"simple-line"
            };
            let graphic = new Graphic({
                geometry: {
                    paths: lines,
                    spatialReference: mapView.spatialReference,
                    type: "polyline"
                },
                symbol: lineSymbol
            });
            mapView.extent = graphic.geometry.extent;
            this.highLayer.add(graphic);
        }
        //清除图层
        clearLayer(layer){
            if(layer&&layer.removeAll){
                layer.removeAll();
            }
        }
        //单击查询结果表格数据项触发事件
        rowClickT3(row) {
            if(row.geometry){
                let geo=null;
                if(row.geometry.paths){
                    geo=row.geometry;
                }else{
                    geo = JSON.parse(row.geometry);
                }
                if(geo.paths){
                    let lines=geo.paths;
                    this.hLineToMap(lines);
                }else{
                    this.highPointToMap([geo.latitude,geo.longitude]);
                };
            }
        }
        //上报记录
        getReportInfo(e){
            let data={
                id:e.id
            }
            getReportRecord(data).then(res => {

            })
        }
        tokenFormSession() {
            return sessionStorage.getItem('token')
        }
        handleCurrentChange3(val){
            let tabalData=this.dataT3;
            this.currentDataT3=tabalData.slice((val-1)*10,val*10);
        }
        handleCurrentChange4(val){
            let tabalData=this.dataT4;
            this.currentDataT4=tabalData.slice((val-1)*10,val*10);
        }
        handleCurrentChange5(val){
            let tabalData=this.dataT5;
            this.currentDataT5=tabalData.slice((val-1)*10,val*10);
        }
        handleCurrentChange6(val){
            let tabalData=this.dataT6;
            this.currentDataT6=tabalData.slice((val-1)*10,val*10);
        }
        handleCurrentChange7(val){
            let tabalData=this.dataT7;
            this.currentDataT7=tabalData.slice((val-1)*10,val*10);
        }
        handleCurrentChange8(val){
            let tabalData=this.dataT8;
            this.currentDataT8=tabalData.slice((val-1)*10,val*10);
        }
        /**
         * 判断某附件是否为图片格式
         * @param name 文件名称
         * @returns {boolean}
         */
        isImg(name) {
            if(!name){
                return false;
            }
            var idx = name.indexOf('.');
            if (idx === -1) {
                console.warn('name格式不正确，请检查');
                return;
            }
            var type = name.substr(idx + 1);
            let imgArr = [
                'bmp', 'jpg', 'jpeg', , 'png', 'tif', 'gif',
                'pcx', 'tga', 'exif', 'fpx', 'svg',
                'psd', 'cdr', 'pcd', 'dxf', 'ufo',
                'eps', 'ai', 'raw', 'WMF', 'webp'
            ];
            return imgArr.indexOf(type) !== -1 ? true : false;
        }
        /**
         * 判断某附件是否为语音
         * @param name 文件名称
         * @returns {boolean}
         */
        isVoice(name) {
            if(!name){
                return false;
            }
            var idx = name.indexOf('.');
            if (idx === -1) {
                console.warn('name格式不正确，请检查');
                return;
            }
            var type = name.substr(idx + 1);
            let imgArr = [
                'ogg', 'mp3','amr'
            ];
            return imgArr.indexOf(type) !== -1 ? true : false;
        }
}
</script>
<style lang='scss' scoped>
.flexDiv {
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexTitle {
  min-width: 90px;
  display: inline-block;
  text-align: right;
}
.flexInfo {
  display: inline-block;
  width: calc(100% - 100px);
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand label {
  width: 100px !important;
  text-align: right !important;
  color: #99a9bf;
}
.el-table__empty-text {
  margin-top: 30px;
  line-height: 30px;
}
.el-table__empty-text .empty-p {
  margin-top: -7px;
}
.mapTable >>> .el-table__header-wrapper table th {
  /* height: 60px; */
  text-align: center;
}
.mapTable >>> .el-table__body-wrapper table td {
  text-align: center;
}

.tableDiv .mapTable >>> .el-form-item__content {
  width: calc(100% - 82px) !important;
  position: relative !important;
  float: left !important;
}
.tableDiv .el-form-item__content {
  width: calc(100% - 82px) !important;
  position: relative !important;
  float: left !important;
}
/deep/.el-dialog__body {
  padding: 10px 20px !important;
}
</style>
