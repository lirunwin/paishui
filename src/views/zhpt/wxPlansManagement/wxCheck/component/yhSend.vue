<template>
  <div id="hiddendangerAuditAssignment" class="hiddendangerAuditAssignment">
    <el-row>
      <span class="title2">管线名称</span>
      <el-input
        style="display: inline-block; margin-left: 5px; width:200px;"
        size="small"
        placeholder="请输入管线名称"
        v-model="problems.pipeName"
      />
      <span class="title2">上报时间</span>
      <el-date-picker
        v-model="problems.startTime"
        style="width:140px;"
        size="small"
        type="date"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      ~
      <el-date-picker
        v-model="problems.endTime"
        style="width:140px;"
        size="small"
        type="date"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />
      <!-- <div>
        <el-date-picker size="small" v-model="problems.reportTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div> -->
      <span class="title2">地址</span>
      <el-input
        style="display: inline-block; margin-left: 5px; width:200px;"
        size="small"
        placeholder="请输入地址"
        v-model="problems.address"
      />
      <el-button type="primary" size="small" @click="dangerCheckArrangeQuery()">查询</el-button>
      <!-- <el-button type="primary" size="small" :disabled="auditDisable" @click="reportClick()">上报审核</el-button> -->
    </el-row>
    <div class="datatable">
      <el-table
        border
        ref="table1"
        class="mapTable"
        stripe
        style="width: 100%;margin-top: 8px;"
        height="100%"
        :data="hiddendangerData"
        @row-dblclick="dblclick"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
        </template>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ (pageInfo.current - 1) * pageInfo.size + (scope.$index + 1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pipeName" :formatter="formatter" sortable label="管线名称" width="200px" align="left" />
        <el-table-column prop="address" :formatter="formatter" sortable label="地址" align="left" />
        <el-table-column prop="typeName" :formatter="formatter" sortable label="隐患原因" width="180px" align="left" />
        <el-table-column
          prop="toubleRangeName"
          :formatter="formatter"
          sortable
          label="隐患等级"
          width="180px"
          align="left"
        />
        <el-table-column
          prop="submitTime"
          :formatter="formatter"
          sortable
          label="上报时间"
          width="200px"
          align="center"
        />
        <el-table-column
          prop="submitUserName"
          :formatter="formatter"
          sortable
          label="上报人员"
          width="140px"
          align="center"
        />
        <el-table-column prop="isSubmit" :formatter="formatter" sortable label="状态" width="140px" align="center" />
        <el-table-column prop="state" :formatter="formatter" sortable label="是否为隐患" width="140px" align="center" />
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="isCheak" size="small" @click="reportClick(scope.row)">审核</el-button>
            <el-button type="text" v-if="!isCheak" size="small" @click="showTrouble(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-area">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50, 100, 1000]"
        :page-size="pageInfo.size"
        :current-page="pageInfo.current"
        :total="pageInfo.tableTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-dialogDrag :visible.sync="auditDialog" title="上报审核" width="1400px" top="5vh" append-to-body>
      <div style="width:100%;padding-right:8px;" ref="parentDiv">
        <tf-table-legend label="隐患审核" isopen="true" style="margin-top: 8px;">
          <div style="width:100%; display: flex; flex-wrap: wrap;" ref="parentDiv">
            <div class="flexDiv">
              <span class="flexTitle">审核结果：</span>
              <div class="flexInfo">
                <el-select
                  v-model="auditForm.auditResult"
                  style="width:100%;"
                  size="small"
                  placeholder="请选择审核结果"
                  @change="changeAuditResult"
                  clearable
                >
                  <el-option v-for="item of auditStatus" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </div>
            </div>
            <div class="flexDiv" v-show="isrespect === true">
              <span class="flexTitle">是否需人员巡查：</span>
              <div class="flexInfo">
                <el-select
                  v-model="auditForm.isrespect"
                  style="width:100%;"
                  size="small"
                  @change="changeIsRespect"
                  clearable
                >
                  <el-option
                    v-for="item of respectStatus"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <!-- <div class="flexDiv" v-show="isdispatching === true">
                <span class="flexTitle">是否需要派工：</span>
                <div class="flexInfo">
                  <el-select v-model="auditForm.isDispatching" style="width:100%;" size="small" clearable>
                    <el-option v-for="item of dispatchingtatus" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </div>
              </div> -->
            <div class="flexDivMax">
              <span class="flexTitle">审核意见：</span>
              <div class="flexInfo">
                <el-input
                  v-model="auditForm.auditNotes"
                  type="textarea"
                  placeholder="请输入审核意见"
                  size="small"
                ></el-input>
              </div>
            </div>
            <div class="flexDiv" v-show="isxjshow === true">
              <span class="flexTitle">巡检组：</span>
              <div class="flexInfo">
                <el-select v-model="auditForm.inspectGroupId" size="small" @change="changeGroupData" clearable>
                  <el-option
                    v-for="item of groupData"
                    :key="item.groupId"
                    :value="item.groupId"
                    :label="item.groupName"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="flexDiv" v-show="isxjshow === true">
              <span class="flexTitle">巡查人：</span>
              <div class="flexInfo">
                <el-select
                  v-model="auditForm.inspectUsers"
                  filterable
                  style="width:100%;"
                  size="small"
                  multiple
                  collapse-tags
                  clearable
                >
                  <el-option
                    v-for="item of userData"
                    :key="item.userId"
                    :value="item.userId"
                    :label="item.userIdName"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="flexDiv" v-show="isxjshow === true">
              <span class="flexTitle">巡查周期：</span>
              <div class="flexInfo" style="display: inline-flex;">
                <el-select
                  v-model="auditForm.periodId"
                  style="width:100%;"
                  size="small"
                  placeholder="请选择巡查周期"
                  clearable
                  @change="changePeriodId"
                >
                  <el-option
                    v-for="item of periodData"
                    :key="item.id"
                    :value="item.id"
                    :label="item.periodName"
                  ></el-option>
                </el-select>
                <!-- <el-input v-if="auditForm.periodId == 4"  v-model="auditForm.intervalDay" size="small">
                      <template slot="append">天一巡</template>
                    </el-input> -->
              </div>
            </div>
            <div class="flexDiv" v-show="isxjshow === true">
              <span class="flexTitle">起止时间：</span>
              <div class="flexInfo">
                <el-date-picker
                  v-model="auditForm.planBegindate"
                  v-show="dateShow.moreDate"
                  @change="changeCustomS"
                  style="width: 132px;"
                  type="date"
                  size="small"
                  placeholder="请选择开始时间"
                  :picker-options="auditForm.planBegindatePick"
                  value-format="yyyy-MM-dd"
                  clearable
                /><span v-show="dateShow.moreDate"> ~</span>
                <el-date-picker
                  v-model="auditForm.planEnddate"
                  v-show="dateShow.moreDate"
                  @change="changeCustomE"
                  style="width: 132px;"
                  type="date"
                  size="small"
                  placeholder="请选择结束时间"
                  :picker-options="auditForm.planEnddatePick"
                  value-format="yyyy-MM-dd"
                  clearable
                />
                <el-date-picker
                  v-model="auditForm.planBegindate2"
                  v-show="dateShow.singeDate"
                  style="width: 132px;"
                  type="month"
                  :picker-options="auditForm.planBegindate2Pick"
                  size="small"
                  placeholder="选择巡检月份"
                  value-format="yyyy-MM"
                  clearable
                />
                <span v-show="dateShow.singeDate"> ~</span>
                <el-date-picker
                  v-model="auditForm.planEnddate2"
                  v-show="dateShow.singeDate"
                  style="width: 132px;"
                  type="month"
                  :picker-options="auditForm.planEnddate2Pick"
                  size="small"
                  placeholder="选择巡检月份"
                  value-format="yyyy-MM"
                  clearable
                />
                <!-- <el-date-picker  v-show="dateShow.moreDate"  v-model="auditForm.inspectionTime"  style="width:100%;" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" size="small"   clearable>
                  </el-date-picker>
                  <el-date-picker v-show="dateShow.singeDate" v-model="auditForm.inspectionTime" type="month"  style="width:100%;"
                      value-format="yyyy-MM" placeholder="选择巡检月份" :picker-options="pickerOptions"  size="small"  clearable>
                  </el-date-picker> -->
              </div>
            </div>
            <div class="flexDiv" v-show="isxjshow === true">
              <span class="flexTitle">计划完成率：</span>
              <div class="flexInfo">
                <el-input
                  type="number"
                  v-model="auditForm.planPercent"
                  oninput="if(value>100)value=100;if((value+'').indexOf('0')==0)value=0;if(value<0)value=0"
                  style="width:100%;"
                  size="small"
                >
                  <template slot="append"
                    >%</template
                  >
                </el-input>
              </div>
            </div>
          </div>
        </tf-table-legend>

        <tf-table-legend label="隐患信息" isopen="false" style="margin-top: 8px;">
          <div style="width:100%; display: flex; flex-wrap: wrap;" ref="parentDiv">
            <div class="flexDiv">
              <span class="flexTitle">管线名称：</span>
              <div class="flexInfo">
                {{ reportDetailForm.pipeName }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患部位：</span>
              <div class="flexInfo">
                {{ reportDetailForm.location }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患原因：</span>
              <div class="flexInfo">
                {{ reportDetailForm.typeName }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患等级：</span>
              <div class="flexInfo">
                {{ reportDetailForm.toubleRangeName }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患上报时间：</span>
              <div class="flexInfo">
                {{ reportDetailForm.submitTime }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">是否进入工地管理：</span>
              <div class="flexInfo">
                {{ reportDetailForm.isbuild }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">施工单位名称：</span>
              <div class="flexInfo">
                {{ reportDetailForm.sgdw }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">施工负责人：</span>
              <div class="flexInfo">
                {{ reportDetailForm.gdfzr }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">联系电话：</span>
              <div class="flexInfo">
                {{ reportDetailForm.phone }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患上报人：</span>
              <div class="flexInfo">
                {{ reportDetailForm.submitUserName }}
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">隐患上报时间：</span>
              <div class="flexInfo">
                {{ reportDetailForm.submitTime }}
              </div>
            </div>
            <div class="flexDivMax">
              <span class="flexTitle">地址：</span>
              <div class="flexInfo">
                {{ reportDetailForm.address }}
              </div>
            </div>
            <div class="flexDivMax">
              <span class="flexTitle">消除隐患建议：</span>
              <div class="flexInfo">
                {{ reportDetailForm.suggest }}
              </div>
            </div>
            <div class="flexDivMax">
              <span class="flexTitle">隐患原因备注：</span>
              <div class="flexInfo">
                {{ reportDetailForm.notes }}
              </div>
            </div>
            <div class="flexDivFile">
              <span class="flexTitle">附件：</span>
              <div class="flexInfo">
                <div style="float:left;">
                  <el-image v-for="(item, index) in filelist" :key="index" :src="item" :preview-src-list="filelist">
                  </el-image>
                </div>
                <div>
                  <audio
                    v-for="(item, index) in audioFileList"
                    :key="index"
                    controls="controls"
                    preload="auto"
                    :src="item"
                  />
                </div>
              </div>
            </div>
            <div class="flexDivMap">
              <span class="flexTitle">位置：</span>
              <div class="flexInfo">
                <div style="width:100%; height: 310px;" ref="mapBox"></div>
              </div>
            </div>
          </div>
        </tf-table-legend>
      </div>

      <template slot="footer">
        <el-button @click="auditDialog = false" size="small">取消</el-button>
        <el-button type="primary" @click="dangerCheckReport()" size="small">确定</el-button>
      </template>
    </el-dialog>
    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>

    <el-dialog v-dialogDrag :visible.sync="dialogDetail" title="隐患详情" width="60%" top="10vh" append-to-body>
      <troubleDetail :troubleAry="troubleAry" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检计划审核功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue'
import { IP } from '@/utils/request'
import {
  queryDangerReport,
  getHiddenDangerId,
  getHiddenDangerUpdateId,
  getHiddenDangerBuildId,
  queryGroupUserMap,
  queryPeriod,
  getFileImg,
  reportDangerCheck
} from '@/api/xjHiddenDangerManageApi'
import { ElTable } from 'element-ui/types/table'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import locationIcon from '@/assets/images/map/location.png'
import { Map, View } from 'ol'
import { unByKey } from 'ol/Observable'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import { Point, MultiPoint } from 'ol/geom'
import { Icon, Style } from 'ol/style'
@Component({
  name: 'HiddendangerAuditAssignment',
  components: { tfTableLegend, troubleDetail }
})
export default class HiddendangerAuditAssignment extends Vue {
  @Prop() isCheak: boolean
  @Prop() data: any
  disabledCheckIdea = true //控制审核意见栏是否可编辑
  disabledCheckIdeaAnnex = true //控制审核意见说明是否可编辑
  showFooter = false //控制footer的显示
  dialogDetail = false //控制详情页面显示
  startOptions = {
    //开始时间控制
    disabledDate: (time) => {
      if (this.problems.endTime) {
        return time.getTime() >= new Date(this.problems.endTime)
      }
    }
  }
  endOptions = {
    //结束时间控制
    disabledDate: (time) => {
      if (this.problems.startTime) {
        return new Date(this.problems.startTime).getTime() - 1000 * 60 * 60 * 24 > time.getTime()
      }
    }
  }
  // 筛选条件
  problems = {
    auditUser: '', //审核人员
    auditResult: '0', //0：未审核；1：通过；2：未通过
    isSubmit: '1', //上报状态；0：未提交；1：已提交
    pipeName: undefined,
    reportTime: undefined,
    address: undefined,
    startTime: '',
    endTime: ''
  }
  postProblems = {
    auditUser: '', //审核人员
    auditResult: '0', //0：未审核；1：通过；2：未通过
    isSubmit: '1', //上报状态；0：未提交；1：已提交
    pipeName: undefined,
    startTime: undefined,
    endTime: undefined,
    address: undefined,
    startDate: '',
    endDate: ''
  }
  pageInfo = { current: 1, size: 30, tableTotal: 1, auditResult: '', auditResults: '' } //分页数据
  troubleAry = {} //组件参数

  //隐患记录展开项的数据
  dangerRecordData = {
    pipeName: '', // 隐患所在管线名称
    dangerPosition: '', //隐患部位
    positionDetail: '', //隐患详细地址描述
    geographicalPosition: '', //地理位置
    dangerLocationArea: '', //隐患所在片区
    //隐患原因
    dangerReason: [
      { value: 0, label: '占压' },
      { value: 1, label: '渗水' },
      { value: 2, label: '周边打围开挖' },
      { value: 3, label: '其他管线穿越或并行' }
    ],
    dangerReasonNote: '', //隐患原因备注
    dangerOccurTime: '', // 隐患发生时间
    isIntoWorkStageManage: '', //是否进入工地管理
    constructionUnitName: '', //施工单位名称
    constructionLeader: '', //施工负责人
    phoneNo: '', // 联系电话
    removeDangerAdvice: '', //消除隐患建议
    annex: '' //附件
  }
  dialogDelete = false //控制是否确认删除弹框显示
  multipleSelection = []

  // 上报审核弹窗
  auditDialog = false

  //审核结果码表
  auditStatus = [{ id: '1', name: '通过' }, { id: '2', name: '未通过' }]
  //是否需要人员巡查
  respectStatus = [{ id: '0', name: '否' }, { id: '1', name: '是' }]
  dispatchingtatus = [
    //码表 => 是否需要派工
    { id: '0', name: '否' },
    { id: '1', name: '是' }
  ]
  // 上报审核表单信息
  auditForm = {
    dangerId: '', //隐患主键编号
    isrespect: '0', //是否需要人员巡查
    auditResult: undefined, //审核结果 1：通过；2：未通过
    auditNotes: '', //审核意见
    templateServiceType: '02', //审核类型:  02:隐患审核 03:隐患消除审核
    inspectGroupId: undefined, //巡检组
    inspectUsers: undefined, //巡检人员(可多人)
    periodId: undefined, //巡检周期
    intervalDay: undefined, //间隔天数
    inspectionTime: undefined, //起止时间
    // planBegindate: undefined,     //计划开始时间
    // planEnddate: undefined,     //计划结束时间
    planPercent: 100, //计划完成率
    isDispatching: '1', //是否自动派工 => 1 默认派工
    planType: '1', //计划类型；0：计划性；1：隐患 2:工地 3:临时性任务
    inspectType: 14, //巡查类型：14=隐患点
    planState: '0', //巡检计划状态；0：未提交；1：未审核，2：未开始，3：正在执行 4：计划完成 5: 已开始未执行 7：申请暂停 8：计划已暂停 9：申请作废 10：计划已作废
    totalCount: 1, //总点数=> 隐患默认为1个
    totalLength: 1, //记录计划任务情况（点是个数，线是长度）=> 隐患默认为1个
    planBegindate: '', //起始时间
    planEnddate: '', //终止时间
    planBegindate2: '', //巡查时间
    planEnddate2: '',
    planBegindatePick: { disabledDate(time) {} }, //起始时间选择控制
    planEnddatePick: { disabledDate(time) {} }, //终止时间选择控制
    planBegindate2Pick: { disabledDate(time) {} }, //终止时间选择控制
    planEnddate2Pick: { disabledDate(time) {} }
  }

  // 隐患基础信息 => 详情
  reportDetailForm = {
    pipeName: '',
    location: '',
    typeName: '',
    toubleRangeName: '',
    address: '',
    regionId: '',
    regionName: '',
    submitUserName: '',
    submitTime: '',
    notes: '',
    isbuild: '',
    suggest: '',
    lgtd: '',
    lttd: '',
    sgdw: '',
    gdfzr: '',
    phone: ''
  }
  filelist = []
  audioFileList = []
  isrespect = true //未通过，隐藏是否需要人员巡查信息
  isdispatching = false //是否需要派工：否=>隐藏,是=>展示
  isxjshow = false //巡检信息是否隐藏

  dateShow = {
    //时期选择切换
    moreDate: true,
    singeDate: false
  }
  // 规则
  auditRule = {}
  // 上报隐患数据
  hiddendangerData = []

  //码表
  groupDeptUser = [] //分组、部门人员组合
  periodData = [] //巡检周期

  groupData = [] //组数据
  userData = [] //人员数据

  //巡检日期
  pickerOptions = { disabledDate(time) {} }
  mapV: Map = null
  graphicsLayer: VectorLayer<VectorSource<any>> = null
  mounted() {
    this.addMap()
    //隐患审核、详情
    this.dangerCheckArrangeQuery() //渲染主页表格
    this.getGroupUserMap() //巡检组、巡检人
    this.getPeriodData() //巡检周期
  }
  destroyed() {
    console.log('实例销毁完成')
    //地图相关数据
    let mapV = this.data.mapView
    let map = mapV.map
    // if (this.click) {
    //   this.click.remove();
    // }
    // if (this.graphicsLayer) {
    //   map.remove(this.graphicsLayer);
    // }
    this.clearPageInfo()
  }
  /**
   * 在模块打开的时候预先加载地图
   */
  addMap() {
    if (!this.$store.getters.appconfig) {
      this.$message('服务加载失败 启用默认服务配置')
      return
    }
    let { initCenter, initZoom } = this.$store.getters.appconfig
    var div = this.$refs.cctvMap as HTMLElement
    let layerResource = this.$store.getters.appconfig.gisResource['iserver_resource'].layerService.layers
    const map = new Map({
      target: div,
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 21,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.mapV = map
    //添加矢量点图层
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    })
    this.graphicsLayer = vectorLayer
    new TF_Layer().createLayers(layerResource).then((layers: any[]) => {
      layers.forEach((layer) => {
        layer && map.addLayer(layer)
      })
      map.addLayer(this.graphicsLayer)
    })
  }
  /**
   * 渲染数据处理
   */
  formatter(row, column) {
    let typeValue = typeof row[column.property]
    if (typeValue == 'undefined') {
      return '-'
    } else if (typeValue == 'object' || typeValue == 'string') {
      if (!row[column.property]) {
        return '-'
      } else {
        return row[column.property]
      }
    } else {
      return row[column.property]
    }
  }
  /*--------------------- 地图相关 ---------------*/
  /**
   * @description 加载地图
   */
  //加载地图
  loadMap() {
    //@ts-ignore
    this.$refs.mapBox.appendChild(this.$refs.cctvMap)
    //@ts-ignore
    this.$refs.cctvMap.style.display = ''
    if (this.mapV) {
      this.toPoint(this.reportDetailForm.lgtd, this.reportDetailForm.lttd)
      this.mapV.updateSize()
    }
  }

  /**
   * @description 绘制坐标
   */
  drawPoint(lon, lat) {
    if (!this.graphicsLayer) {
      this.$message.error('隐患图层创建失败')
      return
    } else {
      this.graphicsLayer.getSource().clear()
    }
    const style = new Style({
      image: new Icon({
        src: locationIcon,
        scale: 0.5,
        color: '#2D74E7'
      })
    })
    const feature = new Feature({
      geometry: new Point([lon, lat])
    })
    feature.setStyle(style)
    this.graphicsLayer.getSource().addFeature(feature)
  }
  /**
   * @description 定位到点
   */
  toPoint(lon, lat) {
    if (lon == '' || lat == '') {
      return
    }
    this.drawPoint(lon, lat)
    const options = {
      center: [lon, lat],
      zoom: 17
    }
    if (this.mapV) {
      this.mapV.getView().animate(options)
    }
  }

  /*--------------------- 分页查询 ---------------*/
  /**
   * @description 分页每页条数
   */
  handleSizeChange(pageSize) {
    this.pageInfo.size = pageSize
    this.getData()
  }
  /**
   * @description 改变当前页
   */
  handleCurrentChange(currentPage) {
    this.pageInfo.current = currentPage
    this.getData()
  }

  /*--------------------- 界面操作 ----------------*/
  /**
   * @description 清除页面相关数据 => Map、表单数据
   */
  clearPageInfo() {
    //表单数据
    // this.dangerId = ""; //隐患主键编号
    // this.isrespect = "0"; //是否需要人员巡查
    // this.auditResult= undefined; //审核结果 1：通过；2：未通过
    // this.auditNotes= "";   //审核意见
    // this.templateServiceType= '02';    //审核类型:  02:隐患审核 03:隐患消除审核
    // this.inspectGroupId= undefined;    //巡检组
    // this.inspectUsers= undefined;      //巡检人员(可多人)
    // this.periodId= undefined;    //巡检周期
    // this.intervalDay= undefined;   //间隔天数
    // this.inspectionTime= undefined;     //起止时间
    // this.planBegindate= undefined;     //计划开始时间
    // this.planEnddate= undefined;     //计划结束时间
    // this.planPercent= 100;   //计划完成率
    // this.isDispatching= "1"; //是否自动派工 => 1 默认派工
    // this.planType= "1";      //计划类型；0：计划性；1：隐患 2:工地 3:临时性任务
    // this.inspectType= 14;  //巡查类型：14=隐患点
    // this.planState= "0";   //巡检计划状态；0：未提交；1：未审核，2：未开始，3：正在执行 4：计划完成 5: 已开始未执行 7：申请暂停 8：计划已暂停 9：申请作废 10：计划已作废
    // this.totalCount= 1;    //总点数=> 隐患默认为1个
    // this.totalLength= 1;   //记录计划任务情况（点是个数，线是长度）=> 隐患默认为1个
  }

  /*--------------------- API请求 ----------------*/

  /**
   * @description  双击事件
   */
  dblclick(e) {
    if (this.isCheak) {
      this.reportClick(e)
    } else {
      this.showTrouble(e)
    }
  }

  /**
   * @description  审核派工
   */
  reportClick(e) {
    const that = this
    //主键编号
    var dangerId = e.id
    that.auditForm.dangerId = dangerId
    //选中行
    ;(that.$refs.table1 as ElTable).toggleRowSelection(e)
    // //审核派工前初始化数据
    // this.clearPageInfo();
    //获取隐患展示的基础信息
    that.$nextTick(() => {
      that.getTroubleById(dangerId)
    })
  }

  //获取主页面表格数据
  getData() {
    var that = this
    console.log('page参数：' + JSON.stringify(that.pageInfo))
    //追加分页参数
    const query = that.pageInfo
    delete query.auditResult
    if (this.isCheak) {
      query.auditResults = '0'
    } else {
      query.auditResults = '1,2'
    }
    that.postProblems.pipeName = that.problems.pipeName
    that.postProblems.address = that.problems.address
    that.postProblems.auditUser = this.$store.state.user.userId || ''
    // that.getDateDiff()
    if (!((!that.problems.startTime && !that.problems.endTime) || (that.problems.startTime && that.problems.endTime))) {
      this.$message.info('时间段请选择完整！')
      return
    }
    that.postProblems.startDate = that.problems.startTime ? that.problems.startTime + ' 00:00:00' : ''
    that.postProblems.endDate = that.problems.endTime ? that.problems.endTime + ' 23:59:59' : ''
    if (that.strIsNull(that.postProblems.auditUser)) {
      that.$message.error('获取审核人失败!')
      return
    }
    Object.assign(query, that.postProblems)
    // this.disableReport = true
    that.hiddendangerData = []
    queryDangerReport(query).then((res) => {
      if (res.code !== 1) {
        that.$message.error('获取隐患审核列表出错!')
        return
      }
      //数据总数
      that.pageInfo.tableTotal = res.result.total
      that.hiddendangerData = res.result.records
    })
  }

  //点击主页面查询按钮，获取接口数据渲染主页面表格
  dangerCheckArrangeQuery() {
    this.pageInfo.current = 1
    this.getData()
  }

  //点击主页面上报审核按钮，确定上报后调用接口上传审核数据
  dangerCheckReport() {
    var that = this
    console.log('隐患时间：' + that.auditForm.inspectionTime)
    //获取当前登录人员
    var auditUserId = that.$store.state.user.userId
    if (that.strIsNull(auditUserId)) {
      that.$message.error('获取当前审核人员失败!')
      return
    }
    //组合审核相关数据
    let time = [that.auditForm.planBegindate, that.auditForm.planEnddate]
    if (that.auditForm.periodId == 3) {
      time = [that.auditForm.planBegindate2, that.auditForm.planEnddate2]
    }
    let times = that.DateDiff(time, that.auditForm.periodId, that.auditForm.intervalDay) //获取时间段及时间间隔
    ;[that.auditForm.planBegindate, that.auditForm.planEnddate, that.auditForm.intervalDay] = [
      times.planBegindate,
      times.planEnddate,
      times.intervalDay
    ]
    var dangerId = that.auditForm.dangerId
    if (that.strIsNull(dangerId)) {
      that.$message.error('请选择需要审核的隐患')
      return
    }
    if (that.strIsNull(that.auditForm.auditResult)) {
      that.$message.error('请选择审核结果')
      return
    }
    if (that.auditForm.isrespect == '1') {
      if (that.strIsNull(that.auditForm.periodId)) {
        that.$message.error('请选择巡检周期')
        return
      }

      if (that.strIsNull(that.auditForm.inspectUsers.join(';'))) {
        that.$message.error('请选择巡检人员')
        return
      }
      if (that.strIsNull(that.auditForm.planBegindate)) {
        that.$message.error('请选择计划开始时间')
        return
      }
      if (that.strIsNull(that.auditForm.planEnddate)) {
        that.$message.error('请选择计划结束时间')
        return
      }

      // //校验计算开始巡检开始日期、结束日期是否一致
      // if(that.auditForm.periodId==2){
      //     let first=new Date(this.auditForm.planBegindate);
      //     let second=new Date(this.auditForm.planEnddate);
      //     //一周一巡
      //     const datesAreOnSameDay = (first, second) =>
      //       first.getFullYear() === second.getFullYear() &&
      //       first.getMonth() === second.getMonth() &&
      //       first.getDate() === second.getDate();

      //     if(datesAreOnSameDay(first,second)){
      //         that.$message.error("一周一巡起止日期错误,请重新选择")
      //         return;
      //     }
      // }else if(that.auditForm.periodId==4){
      //   if(that.strIsNull(that.auditForm.intervalDay)){
      //     that.$message.error("自定义周期请输入间隔天数")
      //     return;
      //   }
      //   let first=new Date(this.auditForm.planBegindate);
      //   let second=new Date(this.auditForm.planEnddate);
      //   //一周一巡
      //   const datesAreOnSameDay = (first, second) =>
      //     first.getFullYear() === second.getFullYear() &&
      //     first.getMonth() === second.getMonth() &&
      //     first.getDate() === second.getDate();
      //   if(that.auditForm.intervalDay > 1 && datesAreOnSameDay(first,second) ){
      //     that.$message.error("自定义周期起止日期和间隔日期不符,请重新选择")
      //     return;
      //   }
      // }
    }

    var auditModel = {
      id: dangerId, //选中的隐患ID
      auditId: auditUserId, //审核人员编号 => 登录人员
      isrespect: that.auditForm.isrespect, //是否需要巡查人员
      auditNotes: that.auditForm.auditNotes, //审核意见 备注
      auditResult: that.auditForm.auditResult, ////审核结果 1：通过；2：未通过
      planDto: {
        //巡检计划(含有点到位信息列表)
        isDispatching: that.auditForm.isDispatching, //自动派工
        inspectGroupId: that.auditForm.inspectGroupId, //巡检组id
        inspectType: that.auditForm.inspectType, //巡查类型
        periodId: that.auditForm.periodId, //巡检周期
        inspectUsers: that.auditForm.inspectUsers.join(';'), //巡检人员 多个逗号隔开
        planBegindate: that.auditForm.planBegindate, //计划开始时间
        planEnddate: that.auditForm.planEnddate, //计划结束时间
        intervalDay: that.auditForm.intervalDay, //间隔天数
        // planPercent: that.auditForm.planPercent,    //计划完成率
        planState: that.auditForm.planState, //巡检计划状态；0：未提交；1：未审核，2：未开始，3：正在执行
        planPercent: that.auditForm.planPercent, //计划完成率
        regionId: that.reportDetailForm.regionId, //所属片区编码
        regionName: that.reportDetailForm.regionName, //片区名称
        totalCount: that.auditForm.totalCount, //总点数=> 隐患默认为1个
        totalLength: that.auditForm.totalLength, //记录计划任务情况（点是个数，线是长度）=> 隐患默认为1个
        planTypeOverList: [
          {
            completionRate: that.auditForm.planPercent,
            typeId: that.auditForm.inspectType,
            typeName: '隐患点',
            totalCount: 1
          }
        ],
        //巡检内容
        inspectContents: JSON.stringify([
          {
            // geometryInfo: {
            //   points: [
            //     [that.reportDetailForm.lgtd,that.reportDetailForm.lttd]
            //   ]
            // },
            // type:"xjyh",
            // ids:dangerId,

            typeId: that.auditForm.inspectType,
            layerName: '隐患点',
            layerId: '',
            data: [dangerId]
          }
        ]),
        //点集合
        pointTempList: [
          {
            geometry: JSON.stringify({
              type: 'point',
              latitude: that.reportDetailForm.lttd,
              longitude: that.reportDetailForm.lgtd,
              spatialReference: that.data.mapView.spatialReference
            }), //巡检点几何坐标信息
            lng: that.reportDetailForm.lgtd, //经度坐标
            lat: that.reportDetailForm.lttd, //纬度度坐标
            pipeLength: 0, //管线长度

            typeId: that.auditForm.inspectType,
            layerName: '隐患点'
          }
        ]
      }
    }

    console.log('隐患参数：' + JSON.stringify(auditModel))

    //提交审核
    let auditData = JSON.parse(JSON.stringify(auditModel))

    if (that.auditForm.isrespect == '0') {
      delete auditData.planDto
    }
    reportDangerCheck(that.auditForm.templateServiceType, auditData).then((res) => {
      if (res.code == -1) {
        that.$message.error('上报审核出错,请重试')
        return
      } else {
        that.$message({ message: '上报审核成功!', type: 'success' })
        that.getData()
      }
    })
    that.auditDialog = false
  }

  //自定义开始时间的改变
  changeCustomS() {
    // let input=this.auditForm
    // if(input.periodId== 4){
    //     let timeSplit=24 * 60 * 60 * 1000 * parseInt(input.intervalDay - 1);
    //     let planBegindate=new Date(input.planBegindate);
    //     let nextDay = new Date(planBegindate.getTime() + timeSplit);
    //     let nextDate = nextDay.getFullYear() + "-" + (nextDay.getMonth()+1) + "-" + nextDay.getDate();
    //     input.planEnddate=nextDate;
    // }
  }

  //自定义结束时间的改变
  changeCustomE() {
    // let input=this.auditForm;
    // if(input.periodId== 4){
    //     let timeSplit=24 * 60 * 60 * 1000 * parseInt(input.intervalDay - 1);
    //     let planEnddate=new Date(input.planEnddate);
    //     let nextDay = new Date(planEnddate - timeSplit);
    //     let nextDate = nextDay.getFullYear() + "-" + (nextDay.getMonth()+1) + "-" + nextDay.getDate();
    //     input.planBegindate=nextDate;
    // }
  }

  // 获取下个月的全日期
  getNextTime(time) {
    const nextMonthString = time.split('-')[0] + '-' + (parseInt(time.split('-')[1]) + 1) + '-01'
    const date = new Date(new Date(nextMonthString).getTime() - 8.64e7)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return year + '-' + month + '-' + day + ' 23:59:59'
  }

  /**
   * 计算间隔天数,设置计划开始时间和计划结束时间
   */
  DateDiff(dayPlanTime, periodId, periodDay) {
    let planBegindate = null
    let planEnddate = null
    let intervalDay = 0
    if (periodId != 3) {
      planBegindate = dayPlanTime[0] + ' 00:00:00'
      planEnddate = dayPlanTime[1].split(' ')[0] + ' 23:59:59'
    } else {
      planBegindate = dayPlanTime[0] + '-01 00:00:00'
      planEnddate = this.getNextTime(dayPlanTime[1])
    }
    if (periodId == 1) {
      //一天一巡
      intervalDay = 1
    } else if (periodId == 2) {
      //一周一巡
      intervalDay = 7
    } else if (periodId == 3) {
      //一月一巡
      intervalDay = 0
    } else if (periodId == 4) {
      //自定义
      intervalDay = periodDay
    }
    return {
      planBegindate: planBegindate,
      planEnddate: planEnddate,
      intervalDay: intervalDay
    }
  }

  /**
   * @description 时间选择器切换
   */
  changeDate(show) {
    if (show) {
      this.dateShow.moreDate = true
      this.dateShow.singeDate = false
    } else {
      this.dateShow.moreDate = false
      this.dateShow.singeDate = true
    }
  }

  //获取巡检分组及分组人员
  getGroupUserMap() {
    var that = this
    let data = {
      size: 10000,
      current: 1,
      enableFlag: 1
    }
    queryGroupUserMap(data)
      .then((res) => {
        if (res.code !== 1) {
          that.$message.error('获取分组信息出错')
          return
        }
        var groupUserVoList = res.result.groupUserVoList //分组信息
        var groupUserDeptVoList = res.result.groupUserDeptVoList //部门用户

        if (that.arrayIsNull(groupUserVoList) && that.arrayIsNull(groupUserDeptVoList)) {
          that.$message.error('获取分组信息出错')
          return
        }
        if (that.arrayIsNull(groupUserVoList) && !that.arrayIsNull(groupUserDeptVoList)) {
          //分组为空，部门用户信息不为空
          that.groupData.push({ id: '', name: '全部' })
          var deptUserData = []
          groupUserDeptVoList.forEach((element) => {
            deptUserData.push({
              userId: element.userId,
              userIdName: element.userName
            })
          })

          that.groupDeptUser.push({
            groupId: '',
            groupName: '全部',
            data: deptUserData
          })
        } else if (!that.arrayIsNull(groupUserVoList) && !that.arrayIsNull(groupUserDeptVoList)) {
          //获取组合后的数据
          that.groupDeptUser = that.arrayGroupUser(groupUserVoList)

          //分组不为空，部门用户信息也不为空，表示当前登录人员不在巡检组中，增加全部
          var deptUserData = []
          groupUserDeptVoList.forEach((element) => {
            deptUserData.push({
              userId: element.userId,
              userIdName: element.userName
            })
          })

          that.groupDeptUser.push({
            groupId: '',
            groupName: '全部',
            data: deptUserData
          })
        } else if (!that.arrayIsNull(groupUserVoList) && that.arrayIsNull(groupUserDeptVoList)) {
          //分组不为空，部门用户信息为空，表示当前登录人员在巡检组中
          that.groupDeptUser = that.arrayGroupUser(groupUserVoList)
        }

        console.log('参数：' + JSON.stringify(that.groupDeptUser))
        //利用组合后的参数，拆分巡检组 和 巡检人
        that.groupDeptUser.forEach((element, index) => {
          that.groupData.push({
            groupId: element.groupId,
            groupName: element.groupName
          })
          if (index === 0) {
            //默认显示第一个
            that.userData = element.data
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /**
   * @description 巡检周期
   */
  getPeriodData() {
    var that = this
    queryPeriod({}).then((res) => {
      if (res.code !== 1) {
        that.$message.error('获取巡检周期出错!')
        return
      }
      this.periodData = res.result.records
    })
  }

  /**
   * @description 组合当前分组用户信息
   */
  arrayGroupUser(aryList) {
    let map = {}

    for (let i = 0; i < aryList.length; i++) {
      let ai = aryList[i]
      if (!map[ai.groupId]) {
        map[ai.groupId] = [{ userId: ai.userId, userIdName: ai.userIdName }]
        map[ai.groupId].groupName = ai.groupName
      } else {
        map[ai.groupId].push({ userId: ai.userId, userIdName: ai.userIdName })
        map[ai.groupId].groupName = ai.groupName
      }
    }
    let res = []
    Object.keys(map).forEach((key) => {
      res.push({
        groupId: key,
        groupName: map[key].groupName,
        data: map[key]
      })
    })
    return res
  }

  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
  }

  /**
   * @description 审核结果 change事件
   */
  changeAuditResult(auditStatus) {
    console.log('审核结果：' + auditStatus)
    if (auditStatus === '2') {
      //审核不通过，不需要派工、巡查
      this.isrespect = false
      // this.isdispatching = false
      this.isxjshow = false
      this.auditForm.isrespect = '0'
      // this.auditForm.isDispatching = "0"
    } else {
      this.isrespect = true
      // this.isdispatching = false
      this.isxjshow = false
      this.auditForm.isrespect = '0'
      // this.auditForm.isDispatching = "1"
    }
  }

  /**
   * @description 是否需要巡检人员 change事件
   */
  changeIsRespect(isrespect) {
    if (isrespect === '0') {
      this.isxjshow = false
      // this.isdispatching = false
      // this.auditForm.isDispatching = "0"
    } else {
      this.isxjshow = true
      // this.isdispatching = true
      // this.auditForm.isDispatching = "1"
    }
  }

  /**
   * @description 巡检组 change事件
   */
  changeGroupData(groupId) {
    //根据选择项，选择项中的巡检人员
    var newAryList = this.groupDeptUser.filter((item) => item.groupId == groupId)
    if (newAryList.length > 0) {
      this.userData = newAryList[0].data
    } else {
      this.userData = []
    }

    this.auditForm.inspectGroupId = groupId
  }

  /**
   * @description 巡检周期 change事件
   */
  changePeriodId(periodId) {
    console.log('周期：' + periodId)
    var obj = {}
    obj = this.periodData.find(function(item) {
      return item.id == periodId
    })
    let input = this.auditForm
    //input.planBegindatePick.onPick = item => { };
    //input.planEnddatePick.onPick = item => { };
    input.planBegindatePick.disabledDate = (item) => {}
    input.planEnddatePick.disabledDate = (item) => {}
    input.planBegindate2Pick.disabledDate = (item) => {}
    input.planEnddate2Pick.disabledDate = (item) => {}
    input.planBegindate = ''
    input.planBegindate2 = ''
    input.planEnddate2 = ''
    input.planEnddate = ''
    //禁用时间控件
    if (periodId == 1) {
      //一天一巡
      this.changeDate(true)
      //只能选择当天及以后并且小于等于结束时间
      input.planBegindatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planEnddate) {
          let lessThanEnd = time.getTime() >= new Date(input.planEnddate) //小于等于最后一天
          return lessThanEnd || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
      //只能选择当天及以后并且大于等于结束时间
      input.planEnddatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planBegindate) {
          let greaterThanStart = new Date(input.planBegindate).getTime() - 1000 * 60 * 60 * 24 > time.getTime() //大于等于开始时间
          return greaterThanStart || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
    } else if (periodId == 2) {
      //一周一巡
      this.changeDate(true)
      let dayList = this.getTime()
      // let mondayTime = new Date(dayList.mondayTime).getDay();
      // let sundayTime = new Date(dayList.sundayTime).getDay();
      input.planBegindatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        // let isMonDay=(time.getDay() != mondayTime);//是否是周一
        if (input.planEnddate) {
          let lessThanEnd = new Date(input.planEnddate) > time.getTime() //小于等于最后一天
          return greaterThanNew || !lessThanEnd
        } else {
          return greaterThanNew
        }
      }
      input.planEnddatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        // let isSunDay= (time.getDay() != sundayTime);//是否是周天
        if (input.planBegindate) {
          let greaterThanStart = new Date(input.planBegindate).getTime() - 1000 * 60 * 60 * 24 > time.getTime() //大于等于开始时间
          return greaterThanNew || greaterThanStart
        } else {
          return greaterThanNew
        }
      }
    } else if (periodId == 3) {
      //一月一巡
      this.changeDate(false)
      //一月一巡
      input.planBegindate2Pick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planEnddate2) {
          let lessThanEnd = time.getTime() >= new Date(input.planEnddate2) //小于等于最后一天
          return lessThanEnd || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
      //只能选择当天及以后并且大于等于结束时间
      input.planEnddate2Pick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planBegindate2) {
          let greaterThanStart = new Date(input.planBegindate2).getTime() - 1000 * 60 * 60 * 24 > time.getTime() //大于等于开始时间
          return greaterThanStart || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
    } else if (periodId == 4) {
      this.changeDate(true)
      input.intervalDay = ''
      input.planBegindatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planEnddate) {
          let lessThanEnd = time.getTime() >= new Date(input.planEnddate) //小于等于最后一天
          return lessThanEnd || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
      //只能选择当天及以后并且大于等于结束时间
      input.planEnddatePick.disabledDate = (time) => {
        let greaterThanNew = time.getTime() < Date.now() - 8.64e7 //大于等于当前
        if (input.planBegindate) {
          let greaterThanStart = new Date(input.planBegindate).getTime() - 1000 * 60 * 60 * 24 > time.getTime() //大于等于开始时间
          return greaterThanStart || greaterThanNew
        } else {
          return greaterThanNew
        }
      }
    }
  }

  //获取本周的周一和周末
  getTime() {
    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay()
    var oneDayTime = 24 * 60 * 60 * 1000
    if (day == 1) {
      nowTime = nowTime - oneDayTime
      day = 7
    }
    var MondayTime = nowTime - (day - 1) * oneDayTime //显示周一
    var SundayTime = nowTime + (7 - day) * oneDayTime //显示周日
    return {
      mondayTime: MondayTime,
      sundayTime: SundayTime
    }
  }

  /**
   * @description 获取隐患信息
   */
  getTroubleById(troubleId) {
    var that = this
    // that.reportDetailForm = {}
    //this.disableReport = true
    getHiddenDangerId(troubleId).then((res) => {
      // console.log("隐患上报："+JSON.stringify(res))
      if (res.code == -1) {
        that.$message.error(res.message)
        return
      }
      var result = res.result
      console.log('隐患上报：' + JSON.stringify(result))
      //隐患基础信息
      var troubleVo = result.troubleVo //隐患基础信息

      /*------------- 隐患基础信息 ------------*/
      that.reportDetailForm.pipeName = troubleVo.pipeName //管线名称
      that.reportDetailForm.location = troubleVo.location //隐患部位
      that.reportDetailForm.typeName = troubleVo.typeName //隐患原因
      that.reportDetailForm.toubleRangeName = troubleVo.toubleRangeName //隐患等级
      that.reportDetailForm.address = troubleVo.address //隐患地址
      that.reportDetailForm.regionId = troubleVo.regionId //隐患所在片区
      that.reportDetailForm.regionName = troubleVo.regionName //隐患所在片区

      that.reportDetailForm.submitUserName = troubleVo.submitUserName //隐患上报人名称
      that.reportDetailForm.submitTime = troubleVo.submitTime //隐患上报时间

      that.reportDetailForm.notes = troubleVo.notes //隐患原因备注
      that.reportDetailForm.isbuild = troubleVo.isbuild //是否进入工地
      that.reportDetailForm.suggest = troubleVo.suggest //消除隐患建议

      //经纬度坐标，地图点定位
      that.reportDetailForm.lgtd = troubleVo.lgtd //经度
      that.reportDetailForm.lttd = troubleVo.lttd //纬度

      //获取工地的详情
      that.getBuildById(troubleVo.buildId)

      //清空图片
      that.getFilePaths(troubleVo.filePathList) //图片信息

      that.drawPoint(that.reportDetailForm.lgtd, that.reportDetailForm.lttd)

      that.auditDialog = true
      that.$nextTick(that.loadMap)
    })
  }

  /**
   * @description 获取工地详情
   */
  getBuildById(buildId) {
    var that = this
    if (that.strIsNull(buildId)) {
      return
    }

    getHiddenDangerBuildId(buildId).then((res) => {
      if (res.code !== 1) {
        that.$message.error('获取工地信息错误')
        return
      }
      var result = res.result
      //工地基础信息
      var buildVo = result.buildVo //隐患基础信息
      if (!that.arrayIsNull(buildVo)) {
        that.reportDetailForm.sgdw = buildVo.sgdw //施工单位名称
        that.reportDetailForm.gdfzr = buildVo.gdfzr //施工负责人
        that.reportDetailForm.phone = buildVo.phone //联系电话
      }
    })
  }

  /**
   * @description 附件处理
   */
  getFilePaths(filePathList) {
    var that = this
    that.filelist = []
    that.audioFileList = []
    if (that.arrayIsNull(filePathList)) {
      return
    }
    var token = that.$store.state.user.token

    filePathList.map((es) => {
      //判断后缀，是否是语音文件
      let esuffixt = es.substr(es.lastIndexOf('.') + 1)
      if (esuffixt === 'amr') {
        let audioPath = `${IP}/base/file/loadAudio?remotePath=${es}&access_token=${token}`
        that.audioFileList.push(audioPath)
      }
      if (esuffixt === 'jpeg' || esuffixt === 'png' || esuffixt === 'jpg') {
        let imagePath = `${IP}/base/file/loadImg?remotePath=${es}&access_token=${token}`
        that.filelist.push(imagePath)
      }
      // getFileImg(token,es).then(src => {
      // if (src) {
      // 	var reader = new FileReader();
      // 	reader.readAsDataURL(src);
      // 	reader.onload = (s) => that.filelist.push(s.target.result)
      // }
      // else
      // 	this.$message.error('工地图片加载失败：' + src.message)
      // })
    })
  }

  /**
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return typeof strVal == 'undefined' || strVal == null || strVal == ''
  }

  /*------------------ 查看详情 -------------------*/
  /**
   * @description 查看隐患详情
   */
  showTrouble(e) {
    var id = e.id
    this.dialogDetail = true
    this.troubleAry = {
      troubleId: id,
      optionType: '1' //1=>详情，2=审核操作
    }
  }
}
</script>

<style lang="scss" scoped>
.hiddendangerAuditAssignment {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 5px;
  .filteroption {
    width: 100%;
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .datatable {
    flex: 1;
    height: calc(100% - 100px);
  }
  .pagination-area {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  /deep/ .el-button {
    margin-left: 0;
  }
}
.flexDiv {
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 8px;
}
.flexDivMax {
  width: 99%;
  line-height: 30px;
  margin-top: 8px;
}
.flexDivFile {
  width: 99%;
  height: 100px;
  line-height: 100px;
  margin-top: 8px;
}
.flexDivMap {
  width: 99%;
  height: 310px;
  line-height: 310px;
  margin-top: 8px;
}
.flexTitle {
  min-width: 120px;
  display: inline-block;
  text-align: right;
}
.flexInfo {
  display: inline-block;
  width: calc(100% - 150px);
}

/deep/.el-image__inner {
  width: 100px;
  height: 100px;
  margin-right: 8px;
}
</style>
