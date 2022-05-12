<template>
  <div style="width: 100%; height: 100%; padding:8px;" v-loading="loading">
    <div>
      <span class="title2" style="margin-left:8px;">处理时间</span>
      <el-date-picker v-model="startTime"  size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd"/> ~
      <el-date-picker v-model="endTime" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd"/> 
      <!-- <el-date-picker v-model="times" type="daterange" size="small" style="width:400px"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" align="right"/> -->
      <el-button size="small" type="primary" @click="queryList">查询</el-button>
      <el-button size="small" type="primary" @click="addMission(false)">制定</el-button>
      <el-button size="small" type="primary" :disabled="canSetMan" @click="addMission(true)">派工</el-button>
      <el-button size="small" type="primary" :disabled="canDeleteMan" @click="deleteMission">删除</el-button>
    </div>
    <el-table ref="table1" class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;"
      height="calc(100% - 80px)" stripe @select="tableSelect"   @row-dblclick="showMissionInfo" @select-all="tableSelect"  >
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderCode" label="工单编号" show-overflow-tooltip sortable/>
      <el-table-column prop="orderSource" label="工单来源" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ (scope.row.orderSource || '未知') + '工单' }}</template>
      </el-table-column>
      <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip sortable/>
      <el-table-column prop="percent" label="维修数量" sortable>
        <template slot-scope="scope">{{ 
          (scope.row.overNum || '0') + ' / ' + (scope.row.num || '0') + ' ' + fixTypeIndex[scope.row.typeId || ''] + ' (' + (scope.row.percent || '0') + '%)' 
        }}</template>
      </el-table-column>
      <el-table-column prop="notes" label="备注" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ (scope.row.notes || '-')  }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="处理开始时间" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ scope.row.startTime || '-' }}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="处理结束时间" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ scope.row.endTime || '-' }}</template>
      </el-table-column>
      <!-- <el-table-column prop="address" label="地址描述" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ scope.row.address || '-' }}</template>
      </el-table-column> -->
      <el-table-column label="派单人" sortable="custom">
        <template slot-scope="scope">{{ scope.row.dispatchingName || '-' }}</template>
      </el-table-column>
      <!-- <el-table-column prop="confirmTime" label="查收时间" show-overflow-tooltip sortable>
        <template slot-scope="scope">{{ scope.row.confirmTime || '-' }}</template>
      </el-table-column> -->
      <el-table-column label="创建时间" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">{{ scope.row.createTime || '-' }}</template>
      </el-table-column>
      <el-table-column prop="state" label="处理状态" width="150px" sortable/>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showMissionInfo(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px">
      <el-pagination ref="pagination" small background     :page-size='30'   layout="total, sizes, prev, next,pager,jumper"
          :page-sizes="[10,20,30,50,100,1000]" :total="total"
        @current-change="loadMission" @size-change="loadMission" style="display: inline-block;" />
      <!-- <span ref='pageLength' style="font-size: 13px;" class="el-pagination__total">1/1 页</span> -->
    </el-row>

    <el-dialog v-dialogDrag title="任务制定" :close-on-click-modal="false" :visible.sync="visiable" width="1600px" left>
      <div style="width:100%;min-height:455px;" v-loading="dialoading">
        <div style="width:55%;float:left;">          
          <tf-table-legend label="任务信息" isopen="true">
            <el-switch slot="title" v-if="!addFunType" inactive-text="自动派工" v-model="isDispatching" style="margin-top: 5px;"/>
            <div style="width: 100%; display: flex; flex-wrap: wrap;">
              <div class="flexDiv" style="width:33%"><span class="flexTitle">维修类型：</span>
                <el-select v-model="addType" :disabled="addFunType && isByPlan" style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" size="small" placeholder="请选择维修类型" clearable>
                  <el-option v-for="item in fixTyps" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="flexDiv" style="width:66%;"><span class="flexTitle">起始时间：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <el-date-picker v-model="addStartTime" style="width: calc(100% - 130px);" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" size="small" :clearable="false"
                    :picker-options="{ disabledDate: addSDisable}"/>
                  <el-time-select placeholder="起始时间" style="width: 120px;float:right;" size="small" v-model="addStartHour"
                    :picker-options="{ start: '00:00', step: '01:00', end: '23:00', maxTime: getStringTime(addStartTime) == getStringTime(addStopTime) ? addStopHour : '24:00' }" :clearable="false"/>
                </div>
              </div>
              <div class="flexDiv" style="width:33%"><span class="flexTitle">数量：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <span v-if="isByPlan">{{ addNum }}</span>
                  <span v-else>{{ eval(items) }}</span>
                  <span> {{ fixTypeIndex[addType] }}</span>
                </div>
              </div>
              <div class="flexDiv" style="width:66%;"><span class="flexTitle">结束时间：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <el-date-picker v-model="addStopTime" style="width: calc(100% - 130px);" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束日期" size="small" :clearable="false"
                    :picker-options="{ disabledDate: addEDisable}"/>
                  <el-time-select placeholder="结束时间" style="width: 120px;float:right;" size="small" v-model="addStopHour"
                    :picker-options="{ start: '00:00', step: '01:00', end: '23:00', minTime: getStringTime(addStartTime) == getStringTime(addStopTime) ? addStartHour : '-01:00' }" :clearable="false"/>
                </div>
              </div>
              <div class="flexDiv" style="width:33%"><span class="flexTitle">是否保养：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <!-- <span v-if="isByPlan">{{ addNum }}</span>
                  <span v-else>{{ eval(items) }}</span>
                  <span> {{ fixTypeIndex[addType] }}</span> -->
                  <el-checkbox v-model="maintenanceFlag">保养</el-checkbox>
                </div>
              </div>
              <div class="flexDiv" style="width:33%"><span class="flexTitle">手动结束：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <el-checkbox v-model="artificialEndFlag">结束</el-checkbox>
                  <!-- <span v-if="isByPlan">{{ addNum }}</span>
                  <span v-else>{{ eval(items) }}</span>
                  <span> {{ fixTypeIndex[addType] }}</span> -->
                </div>
              </div>
              <div class="flexDiv" style="width:calc(100% - 5px);height:auto;"><span class="flexTitle" style="vertical-align: top;">备注：</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                  <el-input v-model="addNote" type="textarea" :rows="3" placeholder="请输入内容" maxlength="200" show-word-limit/>          
                </div>
              </div>
            </div>
          </tf-table-legend>
          <tf-table-legend label="任务分配" isopen="true" style="margin-top: 8px;">
            <div slot="title">
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addItem"
                :disabled="isByPlan && (eval(items) || 0) >= addNum">添加</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clearItem">清空</el-button>
            </div>
            <div ref="gundong" style="width:100%;max-height:280px;border: 1px solid rgb(232,232,232);padding:5px;overflow-y:auto;margin-top:8px;background:rgb(248,248,248);border-radius:4px;">
              <transition-group name="el-zoom-in-top">
                <div v-show="true" style="width:100%;display: flex;margin-bottom:8px;border: 1px solid rgb(191,191,191);border-radius:4px;" v-for="(item, index) of items" :key="item.id">
                  <div style="flex:1; padding:5px 5px 15px 0;flex-wrap: wrap;display: flex;" >
                    <div class="flexDiv"><span class="flexTitle">处理人：</span>
                      <el-select v-model="item.addMainWorker" @focus="changeUser(items,index)" style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" 
                        size="small" placeholder="请选择处理人" @change="workerChange(item, index)">
                        <el-option v-for="item2 in item.userList" :key="item2.id" :label="item2.realName" :value="item2.id" />
                      </el-select>
                    </div>
                    <div class="flexDiv"><span class="flexTitle">协同处理人：</span>
                      <el-select v-model="item.addWorker" @focus="changeUser2(items,index)"  multiple collapse-tags style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" size="small" placeholder="请选择处理人">
                        <el-option v-for="item2 in item.userListTwo" :key="item2.id" :label="item2.realName" :value="item2.id" />
                      </el-select>
                    </div>
                    <div class="flexDiv"><span class="flexTitle">电话：</span>
                      <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                        <el-input v-model="item.phone" @input="item.phone = item.phone.replace(/[^\d]/g,'')" placeholder="请输入联系方式" size="small" />
                      </div>
                    </div>
                    <div class="flexDiv"><span class="flexTitle">数量：</span>
                      <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                        <el-input-number @change="addAddress(item)" style="width:100%" v-model="item.num" controls-position="right" 
                          :max="isByPlan ? (addNum - eval(items) + item.num) : Infinity"
                          :min="(item.setNum.length + (item.addPoint ? 1 : 0)) || 1" :step="1" placeholder="请填写数量" size="small" />
                      </div>
                    </div>  
                    <div class="flexDiv"><span class="flexTitle">核定用时：</span>
                      <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                        <el-input v-model="item.addTime" @input="item.addTime = item.addTime.replace(/[^\d.]/g,'').replace(/^0{1,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')" placeholder="请输入用时" size="small">
                          <template slot="append">小时</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="flexDiv"><span class="flexTitle">选定位置：</span>{{ item.setNum.length + '/' + item.num }}
                      <el-button-group class='missionSendTooltip' style="float:right;">
                        <el-tooltip content="点击地图获取点位" placement="bottom" effect="light">
                          <el-button type="primary" plain size="small" :disabled="item.setNum.length == item.num"
                            @click="getPoint(item, index)" icon="el-icon-location"></el-button>
                        </el-tooltip>
                        <el-tooltip content="点击地图绘制范围获取设备" placement="bottom" effect="light">
                          <el-button type="primary" plain size="small" :disabled="item.setNum.length == item.num"
                            @click="getSearchList(item, index)" icon="el-icon-search"></el-button>
                        </el-tooltip>
                        <el-tooltip content="清空" placement="bottom" effect="light">
                          <el-button type="primary" plain size="small" @click="clearPoint(item, index)" icon="el-icon-delete-solid"></el-button>
                        </el-tooltip>
                        <el-tooltip content="辅助派工" placement="bottom" effect="light">
                          <el-popover placement="right" width="400" trigger="click" v-model="item.addMan" style="flex:1" @show="getMinDistance(item, index)">
                            <el-table :data="distanceTable" v-loading="distanceTableShow" height="300px">
                              <template slot="empty">
                                <img src="@/assets/icon/null.png" alt="">
                                <p class="empty-p">暂无数据</p>
                              </template>
                              <el-table-column property="name" label="人员"></el-table-column>
                              <el-table-column property="distance" label="距离"></el-table-column>
                              <el-table-column label="操作">
                                <template slot-scope="scope">
                                  <el-button type="text" size="small" @click="item.addMan = false, item.addMainWorker = scope.row.id">设定</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-button type="primary" plain size="small" icon="el-icon-s-order" 
                              :disabled="item.setNum.length == 0" slot="reference" ></el-button>
                          </el-popover>
                        </el-tooltip>
                      </el-button-group>
                    </div>
                    <template v-if="(item.address&&item.address.length>0)">
                      <template v-for="(item2,index2) in item.address">
                        <div :key="index2+'setNum'" class="flexDiv"><span class="flexTitle">{{"地址"+(index2+1)+":"}}</span>
                        <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                          <el-input v-model="item2.value"  :placeholder="'请输入地址'+(index2+1)" size="small">

                          </el-input>
                        </div>
                      </div>
                      </template>
                    </template>
                    <!-- <div class="flexDiv"><span class="flexTitle">地址：</span>
                      <div style="display: inline-block; margin-left: 5px; width:calc(100% - 100px);">
                        <el-input v-model="item.addTime"  placeholder="请输入地址" size="small">
                        </el-input>
                      </div>
                    </div> -->
                  </div>
                  <div class="off" @click="deleteItem(item, index)"><i class="el-icon-close"/></div>
                </div>
              </transition-group >
            </div>
          </tf-table-legend>
        </div>
        <div style="width:calc(45% - 5px);float:left;margin-left:5px;position: relative;">
          <div style=" position: absolute; z-index: 99;right: 10px; bottom: 10px;background: white;" v-if='searchList.length>0'>
            <div class='spanDiv' style="width:300px;height:30px">
                <span style="position: absolute;top: 4px;right: 0px; width: 30px;height: 30px;font-size: 20px;color: rgb(96, 98, 102);"  size="small"  @click="clearDraw">
                  <i class="el-icon-close"></i>
                </span>
            </div>
            <div class='tableDiv' style="width:300px;max-height:300px;overflow: auto;">
              <el-table ref="table3" class="mapTable2" :data="searchList" border style="width:300px"
                height="calc(100% - 40px)" stripe @cell-mouse-enter="showPoint"   >
              <el-table-column prop="name" label="设备类型"  width="80" align='center' show-overflow-tooltip />
              <el-table-column prop="address" label="设备地址" align='center' show-overflow-tooltip />
              <el-table-column label="操作"  align='center' width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="addMissPoint(scope.row)">确认</el-button>
                </template>
              </el-table-column>
              </el-table>
            </div>

          </div>
          <div ref="addMapBox" style="width:100%;" />
        </div><div style="clear:both;"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="visiable = false">取消</el-button>
        <el-button size="small" type="primary" @click="addFunTrue" :disabled="addDisable">
					<i v-if="addDisable" class="el-icon-loading"/>确定</el-button>
      </span>
    </el-dialog>
    
    <div ref="cctvMap" style="width:100%;height:450px;display:none;border:1px solid rgb(45,116,231)" ></div>
    <el-dialog v-dialogDrag title="工单详细" :visible.sync="pageInfoShow" width="1200px" top="calc(50vh - 436px)"  @close='pageInfoShow=false'>
      <wx-work-order-info v-if='pageInfoShow' :propData='propData'></wx-work-order-info>
    </el-dialog>
    <!-- <tf-mission ref="missionInfo"></tf-mission> -->
  </div>
</template>

<script>
import proj4 from "@/components/proj4/index.js" // 坐标转换
import request from '@/utils/request' // 请求
import tfLegend from '@/views/zhpt/common/TableLegend' // 
import tfTableLegend from '@/views/zhpt/common/TableLegend' // 
import tfMission from '@/views/zhpt/common/MissionInfo' // 工单详情
import { loadModules } from 'esri-loader' // 地图包引用
import { esriConfig, appconfig } from 'staticPub/config' // 地图配置
import wxWorkOrderInfo from "@/views/zhpt/wxDayilyManagement/wxWorkOrderInfo/widget"
export default {
  name: 'WxMissionSend',
  components: { tfLegend, tfTableLegend, tfMission,wxWorkOrderInfo },
  props: { data: Object },
  data() {
    return {
      // 主表格
      loading: true,
      times: ['', ''],
      
      checks: [],
      pageInfoShow:false,
      canSetMan: false,
      canDeleteMan: false,
      fixTyps: [],
      fixTypeIndex: { '': '' },
      dataT1: [],
      total: 0,
      textGeo:[],
      propData:null,
      // 制定界面
      dialoading: false,
      visiable: false,
      searchList:[],//框选获取的值
      drawLayer:null,//绘制的图层
      drawEvent:null,//绘制事件
      drawItem:null,//记录操作的item
      highLayer:null,//范围框选高亮图层
      addDisable: false,
      addFunType: false, // 是否 派工(t) or 制定(f)
      isDispatching: true, // 是否 自动派工
      isByPlan: true, // 是否 计划(t) or 自建(f)
      addType: '',
			addStartTime: new Date(),
      addStartHour: '00:00',
			addStopTime: new Date(),
      addStopHour: '23:00',
      addNum: 0,
      addNote: '',
      items: [],
      maintenanceFlag:false,//是否保养
      artificialEndFlag:false,//手动结束

      // 辅助派工
      distanceTable: [],
      distanceTableShow: false,

      startTime:'',
      endTime:'',
      startOptions:{
        disabledDate:time=> {
          if(this.endTime){
            return time.getTime() >=new Date(this.endTime);
          }
        },
      },
      endOptions:{
        disabledDate:time=> {
          if(this.startTime){
            return  new Date(this.startTime)-1000*60*60*24>time.getTime();
          }
        },
      }
    }
  },
  watch: {
  },
  mounted() { this.init() },
  methods: {
    showMissionInfo(row){
      this.propData=row;
      this.pageInfoShow=true;
    },
    //双击事件
    // dblclickEvent(e){
    //   this.$refs.missionInfo.showMissionInfo(e.id);
    // },
    eval(items) {
      var num = 0
      for(var i=0,ii=items.length;i<ii;i++) {
        num += items[i].num
      }
      return num
    },
    async init() {
      request({ url: '/gps/repairtype/page?size=1000', method: 'get' }).then(res => {
        if(res.code == 1) {
          var index = this.fixTypeIndex
          this.fixTyps = res.result.records.map(e => (index[e.id] = e.unit, e))
        } else this.$message('维修类型加载失败：' + res.message)
      })
      var getOtherPartment = () => {
        request({ url: '/base/user/getDeptUserList?deptId=' + this.user.depId+'&enableFlag=1', method: 'get' }).then(res => {
          if(res.code == 1) {
            if(!res.result.length) return
            this.cheacksArray = []
            this.phoneIndex = {};
            (this.checks = res.result).map(e => (this.phoneIndex[e.id] = e.phone, this.cheacksArray.push(e.id)))
          } else this.$message('处理人加载失败：' + res.message)
        })
      }  
      request({ url: '/base/user/getInfo', method: 'get' }).then(res => {
        if(res.code == 1) {
          res = res.result
          this.user = { id: res.id, depId: res.departmentId}
          getOtherPartment()
          this.loadMission()
        } else this.$message(res.message)
      })
      var div = this.$refs.cctvMap
      var mapV = this.mainMap = this.data.mapView
      const mapview = this.mapView1 = new mapV.TF_mapView({
        container: div,
        map: { basemap: mapV.map.basemap }
      })      
      mapview.ui.components = []
      mapview.constraints.lods = mapV.constraints.lods
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if(month < 10) month = '0' + month
      if(day < 10) day = '0' + day
      // this.addStopTime = this.addStartTime = [year, month, day].join('-')
      this.order = ['', '']
    },
   
    addSDisable(time){
      let tempDate=new Date;
      let tempString=this.getStringTime(tempDate);
      let tempString2=this.getStringTime(time);
      let lessThanEnd=tempString!=tempString2;//小于等于最后一天
      return lessThanEnd;
    },
    addEDisable(time){
      let greaterThanNew=(time.getTime() < Date.now() - 8.64e7);
      return greaterThanNew
    },
    loadMission() {
      this.canDeleteMan = this.canSetMan = this.loading = true      
      var pages = this.$refs.pagination
      var plans = this.queryMission || ['', '', '']
      var url = '/gps/repairorder/page?&current=' + pages.internalCurrentPage + '&size=' + pages.internalPageSize + '&dispatchingId=' + this.user.id + 
      '&orders[0].asc=' + this.order[0] + '&orders[0].column=' + this.order[1] + 
      '&startTime=' + (this.startTime ? this.startTime + ' 00:00:00' : '') + '&endTime=' + (this.endTime ? this.endTime + ' 23:59:59' : '')
      request({ url: url, method: 'get' }).then(res => {
        if(res.code == 1) {
          res = res.result
          if(!res) res = { total: 0, records: [] }
					this.total = res.total
          this.dataT1 = res.records
          //this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
        } else this.$message.error(res.message)
        this.loading = false
      })
    },
    queryList() {      
      this.queryMission = [...(this.times || ['', ''])]
      this.$refs.pagination.internalCurrentPage = 1
      this.loadMission()
    },
    tableSelect(e) {
      var cand = true
      e.map(de => { if(de.state == '未派工' && de.orderSource == '自建') cand = false })
      this.canDeleteMan = e.length == 0 || cand
      this.canSetMan = e.length != 1 || e[0].state != '未派工'
    },
    //获取字体样式
    getTextSym(text){
      return{  
        type: "text",  // autocasts as new TextSymbol()
        color: "#000000",
        haloColor: "#000000",
        haloSize: "0.5x",
        text: text,
        xoffset: 3,
        yoffset: 3,
        font: { 
          size: 14,
          family: "Josefin Slab"
        }
      }
    },
    //添加地址
    addAddress(item){
      let address=[];
      if(item.num>item.address.length){
        let addNum=item.num-item.address.length;
        for(let i=0;i<addNum;i++){
          address.push({
            value:""
          })
        }
        item.address.splice(item.address.length,0,...address);
      }else{
        let reNum=item.address.length-item.num;
        item.address.splice(item.address.length-reNum,reNum);
      }

    },
    addMission(bool) { //  T 派工 F 制定,
      this.visiable = true
      var mapview = this.mapView1
      var graphic = this.mainMap.TF_graphic
      var sp = mapview.spatialReference;
      this.maintenanceFlag=false;
      this.artificialEndFlag=false;
      if(this.addFunType = bool) {        
        var select = this.$refs.table1.selection[0]
        if(this.isByPlan = select.orderSource == '计划') {
          this.addType = select.typeId
          this.addNum = select.num
        } else {        
          this.dialoading = true  
          request({
            url: '/gps/repairorder/getPlanRepairOrderDetail?id=' + select.id + '&flag=1', method: 'get'
          }).then(res => {
            if(res.code == 1) {
              var repairUserVoList = res.result.repairUserVoList
              var repairorderVo = res.result.repairorderVo
              var cache

              this.addType = repairorderVo.typeId
              // this.addNum = repairorderVo.typeId
              cache = repairorderVo.startTime.split(' ')
              this.addStartTime = cache[0]
              this.addStartHour = cache[1].split(':')[0] + ':00';
        // ['maintenanceFlag',this.maintenanceFlag?1:0],
              this.maintenanceFlag=(repairorderVo.maintenanceFlag+""=="1"?true:false);
              this.artificialEndFlag=(repairorderVo.artificialEndFlag+""=="1"?true:false);
              cache = repairorderVo.endTime.split(' ')
              this.addStopTime = cache[0]
              this.addStopHour = cache[1].split(':')[0] + ':00'
              this.addNote = repairorderVo.notes;
              this.textGeo=[];
              this.items = repairUserVoList.map(e => {
                let addressList=[];
                let geoList=[];
                (JSON.parse(e.lngLats) || []).forEach((item,index)=>{
                  addressList.push({value:item.address});
                  if(item.x&&item.y){
                    var geo = new graphic({
                        geometry: { type: 'point', x: item.x, y: item.y, spatialReference: sp },
                        symbol: { type: 'simple-marker', color: 'FFFFFF', size: 12, outline: { color: '2D74E7', width: 2 }},
                      })
                      mapview.graphics.add(geo);
                      geoList.push(geo);
                    var textGeo = new graphic({
                        geometry: { type: 'point', x: item.x, y: item.y, spatialReference: sp },
                        symbol:this.getTextSym("地址"+(index+1))
                      })
                      mapview.graphics.add(textGeo);
                      this.textGeo.push(textGeo);
                  }
                })
                return {
                  id: e.id,
                  userList:JSON.parse(JSON.stringify(this.checks)),
                  userListTwo:JSON.parse(JSON.stringify(this.checks)),
                  address:addressList,
                  addMainWorker: e.respUser,
                  addWorker: e.teamUser ? e.teamUser.split(',').map(e => ~~ e) : [],
                  phone: e.phone?e.phone:'',
                  addTime: e.ratifyTime,
                  num: e.planNum,
                  setNum: geoList,
                  addPoint: false,
                  addMan: false,
                }
              })
            } else { this.$message('工单详情加载失败：' + res.message), this.visiable = false }
            this.dialoading = false
          })
        }
        this.isDispatching = true
      } else this.isByPlan = false
      this.$nextTick(() => {        
        this.$refs.addMapBox.appendChild(this.$refs.cctvMap)
        this.$refs.cctvMap.style.display = ''
        this.mapView1.extent = this.mainMap.extent
        if(this.items.length != 0) this.clearItem()
        this.addItem()
      })
    },
    //选择处理人员
    changeUser(items,index){
      let data=items[index];
      let list=JSON.parse(JSON.stringify(this.checks));
      //去除人员选项中的人员
      items.forEach((item,num)=>{
        if(item.addMainWorker&&num!=index){
          let number=list.findIndex(itemss=>{return itemss.id==item.addMainWorker });
          list.splice(number,1);
        }
      });
      //去除同栏的协同人员
      if(data.addWorker&&data.addWorker.length>0){
        data.addWorker.forEach(itemw=>{
          let number=list.findIndex(itemss=>{return itemss.id==itemw });
          list.splice(number,1);
        });
      }
      items[index].userList=list
    },
    //选择协同处理人员
    changeUser2(items,index){
      let data=items[index];
      let list=JSON.parse(JSON.stringify(this.checks));
      //去除同栏的协同人员
      if(data.addMainWorker){
        let number=list.findIndex(itemss=>{return itemss.id==data.addMainWorker });
        list.splice(number,1);
      }
      items[index].userListTwo=list
    },
    addItem() {
      var div = this.$refs.gundong
      this.items.push({ id: new Date().getTime(), addMainWorker: '', addWorker: [], phone: '', addTime: 1, num: 1,userList:[],userListTwo:[], address:[{value:""}],setNum: [], addPoint: false, addMan: false })
      this.$nextTick(_ => $(div).animate({scrollTop: div.scrollHeight}, 100))
    },
    getPoint(item, index){
      var click = this.click
      this.clearDraw();
      if(click && click.fun) {
        click.fun.remove()
        click.fun = undefined
        click.item.addPoint = false
      }
      var mapview = this.mapView1
      mapview.container.style.cursor = 'pointer'
      item.addPoint = true

      click = this.click = {
        fun: mapview.on('click', (e) => {
          e = [(e = e.mapPoint).longitude, e.latitude]
          item.addPoint = false
          var geo = new this.mainMap.TF_graphic({
            geometry: { type: 'point', x: e[0], y: e[1], spatialReference: mapview.spatialReference },
            symbol: { type: 'simple-marker', color: 'FFFFFF', size: 12, outline: { color: '2D74E7', width: 2 }}
          })
          mapview.graphics.add(geo);
          item.setNum.push(geo)
          var textGeo = new this.mainMap.TF_graphic({
            geometry: { type: 'point',  x: e[0], y: e[1], spatialReference: mapview.spatialReference },
            symbol:this.getTextSym("地址"+item.setNum.length)
          })
          mapview.graphics.add(textGeo);
          this.textGeo.push(textGeo);
  
          mapview.container.style.cursor = ''
          click.fun.remove()
          click.fun = undefined
          delete this.click
        }),        
        item: item
      }
    },
    clearPoint(item, index) {
      var mapview = this.mapView1
      mapview.graphics.removeMany(item.setNum);
      mapview.graphics.removeMany(this.textGeo);
      item.address.forEach(item2=>{
        item2.value='';
      })
      this.textGeo=[];
      item.setNum = []
    },
    getSearchList(item, index){
      var click = this.click
      if(click && click.fun) {
        click.fun.remove()
        click.fun = undefined
        click.item.addPoint = false
      }
      this.clearDraw();
      this.drawItem={
        item:item,
        index:index
      };
      var mapview = this.mapView1
      mapview.container.style.cursor = 'pointer'
      item.addPoint = true
      this.drawReact();
    },

    /**
     * 绘制范围
    */
    drawReact(){
      let that=this;
      var mapview = this.mapView1
      loadModules(
        [
          "esri/Graphic",
          "esri/views/draw/Draw",
          "esri/geometry/Polygon",
          "esri/geometry/Point",
          "esri/layers/GraphicsLayer",
          "esri/symbols/LineSymbol"
        ],
        { url: esriConfig.baseUrl }
      ).then(([Graphic, Draw, Polygon, Point, GraphicsLayer, LineSymbol]) => {
        //绘制图层
        if (!that.drawLayer) {
          that.drawLayer = new GraphicsLayer();
          mapview.map.add(that.drawLayer);
        } else {
          that.drawLayer.removeAll();
        }
        if(!that.highLayer){
          that.highLayer = new GraphicsLayer();
          mapview.map.add(that.highLayer);
        } else {
          that.highLayer.removeAll();
        }
        //绘制对象
        that.drawEvent = new Draw({
          view: mapview
        });
        //绘制形状的样式
        var symbol = {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [ 255,165,0,0.2],
          style: "solid",
          outline: {  // autocasts as new SimpleLineSymbol()
            color: [ 255,165,0,0],
            width: 1
          }
        };
        var action = that.drawEvent.create("rectangle", { mode: "click" });
        action.on("vertex-add", function(evt) {
          if (evt.vertices.length == 1) {
            addReact(evt);
          } else {
            addReact(evt);
          }
        });
        action.on("cursor-update", function(evt) {
          addReact(evt);
        });
        action.on("vertex-remove", function(evt) {
          addReact(evt);
        });
        action.on("draw-complete", function(evt) {
          addReact(evt, true);
        });
        function addReact(evt,action){
          if (evt.vertices.length > 1) {
            that.drawLayer.removeAll();
            let point2=[evt.vertices[0][0],evt.vertices[1][1]]
            let point4=[evt.vertices[1][0],evt.vertices[0][1]];
            let ring=[evt.vertices[0],point2,evt.vertices[1],point4,evt.vertices[0]];
            const polygon = new Polygon({
              hasZ: false,
              hasM: false,
              rings: [ring],
              type:"polygon",
              spatialReference:mapview.spatialReference
            });
            const graphic = new Graphic({
              geometry:polygon,
              symbol: symbol
            });
            that.drawLayer.add(graphic);
            if(action){
              var returnLayers = []
              for(var i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
                var layer = il[i]
                if(!(layer.url && layer.visible)) continue
                for(var j=0,jl=layer.sublayers.items,jj=jl.length;j<jj;j++){
                  var subLayer = jl[j]
                  if(!subLayer.visible) continue
                  if(!subLayer.sublayers) returnLayers.push(subLayer.id)
                  else {
                    for(var k=0,kl=subLayer.sublayers.items,kk=kl.length;k<kk;k++){
                      var inSubLayer = kl[k]
                      if(inSubLayer.visible) returnLayers.push(inSubLayer.id)
                    }
                  }
                }
              }
              let getLayers = returnLayers.sort((a, b) => a - b)
              let searchParam={
                  geometry: JSON.stringify(polygon.toJSON()),
                  geometryType: 'esriGeometryPolygon',
                  layers: 'all:'+getLayers,
                  tolerance: '1',
                  mapExtent: '1',
                  imageDisplay: '1',
                  f: 'pjson'
              }
              that.queryServce(searchParam,e=>{
                if(e.results&&e.results.length==0){
                  that.$message.info('未在指定范围内查询到数据，请重新选取范围进行查询！');
                }else if(e.results&&e.results.length>10){
                  that.$message.info('选取的范围过大，查询到的数据过多,为保证数据的精准，请放大地图后重新选择范围进行查询');
                }else if(e.results&&e.results.length<=10&&e.results.length>0){
                  let searchList=[];
                  e.results.forEach(item=>{
                    let point=null;
                    let line=null;
                    if(item.geometry.paths){
                      let point1=item.geometry.paths[0][0];
                      let point2=item.geometry.paths[0][1];
                      line=item.geometry;
                      point=[(point1[0]+point2[0])/2,(point1[1]+point2[1])/2]
                    }else{
                      point=[item.geometry.x,item.geometry.y]
                    }
                    searchList.push({
                      name:item.layerName,
                      address:item.attributes['地址'],
                      point:point,
                      lineGeometry:line,
                      pointGeometry: { type: 'point', x: point[0], y: point[1], spatialReference: mapview.spatialReference },
                    })
                  });
                  that.searchList=searchList;
                }else{
                  that.$message.info('查询失败！');
                }
              })
            }
          }
        };
      });
    },

    /**
     * 查询地图服务(option：查询条件，id:图层id,call回调函数)
    */
    queryServce(option,call){
        $.ajax({
            url: appconfig.gisResource.business_map.config[0].url + "/identify",
            type: 'POST',
            data: option,
            success: (data) => {
                data = JSON.parse(data);
                call(data);
            },
            error: (error) => this.$message.error(error)
        })
    },

    /**
     * 清空设备
    */
    clearDraw(){
      if (this.drawEvent) {
        this.drawEvent.reset();
        this.drawEvent=null;
      }
      if (this.drawLayer) {
        this.drawLayer.removeAll();
        this.mapView1.map.remove(this.drawLayer);
        this.drawLayer=null;
      }
      if (this.highLayer) {
        this.highLayer.removeAll();
        this.mapView1.map.remove(this.highLayer);
        this.highLayer=null;
      }
      this.searchList=[];
      this.drawItem=null;
      this.mapView1.container.style.cursor = ''
    },

    /**
     * 确认设备
    */
    addMissPoint(row){
      let mapview=this.mapView1;
      let item=this.items[this.drawItem.index];
      item.addPoint=false;
      var geo = new this.mainMap.TF_graphic({
        geometry: { type: 'point', x: row.point[0], y: row.point[1], spatialReference: mapview.spatialReference },
        symbol: { type: 'simple-marker', color: 'FFFFFF', size: 12, outline: { color: '2D74E7', width: 2 }}
      });
      mapview.graphics.add(geo);
      item.setNum.push(geo);
      var textGeo = new this.mainMap.TF_graphic({
        geometry: { type: 'point',  x: row.point[0], y: row.point[1], spatialReference: mapview.spatialReference },
        symbol:this.getTextSym("地址"+item.setNum.length)
      });
      item.address[item.setNum.length-1].value=row.address;
      mapview.graphics.add(textGeo);
      this.textGeo.push(textGeo);
      this.clearDraw();
    },

    /**
     * 展示设备
    */
    showPoint(row){
      this.highLayer.removeAll();
      if(row.pointGeometry){
          let simpleMarkerSymbol = {
            color: '#00FFFF',
            outline: { color: '#00FFFF', width: "1px" },
            size: "10px",
            yoffset: "0px",
            xoffset: "0px",
            type: "simple-marker"
          };
          this.highLayer.add(
              new this.data.mapView.TF_graphic({
                geometry:row.pointGeometry,
                symbol: simpleMarkerSymbol
            })
          )
      }
      if(row.lineGeometry){
        row.lineGeometry.type='polyline'
          let lineSymbol = {
            color: "#00FFFF",
            width: "2px",
            type:"simple-line"
        };
          this.highLayer.add(
            new this.data.mapView.TF_graphic({
                geometry:row.lineGeometry,
                symbol: lineSymbol
            })
          )
      }
    },

    deleteItem(item, index) {
      var click = this.click
      if(click && click.item.id == item.id) {
        click.fun.remove()
        click.fun = undefined
        this.mapView1.container.style.cursor = ''
        delete this.click
      }
      this.clearPoint(item)
      this.items.splice(index, 1)
    },
    clearItem() {
      var click = this.click
      if(click) {
        click.fun.remove()
        click.fun = undefined
        delete this.click
      }
      var mapview = this.mapView1
      var cont = []
      this.items.map(e => e.setNum).map(e => cont = cont.concat(e))
      mapview.graphics.removeMany(cont);
      mapview.graphics.removeMany(this.textGeo);
      this.addType='';
      this.maintenanceFlag=false;
      this.artificialEndFlag=false;
      this.addStartTime=new Date();
      this.addStartHour= '00:00';
      this.addStopTime= new Date();
      this.addStopHour= '23:00';
      this.isDispatching=true;
      this.textGeo=[];
      this.items = []
    },
    getMinDistance(item, index) {
      let seed = new Date().getTime()
      this.seed = seed
      this.distanceTableShow = true
      
      var [dx, dy, length] = [0, 0, item.setNum.length]
      item.setNum.map(e => {
        var {x, y} = e.geometry
        dx += x, dy += y
      })
      dx /= length, dy /= length
      var array = this.cheacksArray
      request({ url: '/gps/repairorder/getAuxiliarySingle', method: 'get' }).then(res => {
        if(this.seed != seed) return
        if(res.code == 1) {
          var point2 = proj4('EPSG:4490', 'EPSG:4544', [dx, dy])
          this.distanceTable = res.result.filter(e => array.indexOf(e.userId) > -1).map(e => {          
            var point1 = proj4('EPSG:4490', 'EPSG:4544', [e.lgtd, e.lttd])
            var d = Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2))
            return {
              id: e.userId,
              name: e.userName,
              distance: (d > 1000 ? (d / 1000).toFixed(2) + 'k' : d.toFixed(2)) + 'm',
            }
          }).sort((a, b) => b.distance - a.distance)
        } else this.$message.error(res.message)
        this.distanceTableShow = false
      })
    },
    addFunTrue() {
      if(this.isDispatching) {
        if(!this.addType) return this.$message.error('请选择维修类型')
        if(!this.items.length) return this.$message.error('请至少添加一个维修任务')
      }
      this[this.addFunType ? 'cheakMan' : 'addMissionTrue']()
    },
    cheak() {
      var list = [], num = 0, isDispatching = this.isDispatching, bool = this.addFunType
      var isOut = false
      var worry = (i, message) => {
        if(isOut) return
        var div = this.$refs.gundong
        var st = div.children[0].children[i].style
        st.borderColor = '#e7304e'
        this.$nextTick(_ => $(div).animate({scrollTop: (div.children[0].children[0] || {clientHeight: 0}).clientHeight * i}, 100))
        setTimeout(_ => st.borderColor = 'rgb(191,191,191)', 500)
        this.$message.error('第' + (i + 1) + '条任务 ' + message)
        isOut = true
      }
      for(var i=0,il=this.items,ii=il.length;i<ii;i++) {
        var di = il[i]
        num += di.num
        if(!di.addMainWorker) worry(i, '请选择处理人')
        if(isDispatching) {
          if(!di.phone) worry(i, '请填写电话')
          if(!di.addTime) worry(i, '请填写核定时间')
          // if(!di.addWorker.length) worry(i, '请选择协同处理人')
          if(!di.setNum.length) worry(i, '请选定至少一个任务位置')
        }
        if(isOut) return false
        let lngLats=[];
        let dataSource=(di.address.length>di.setNum.length)?di.address:di.setNum;
        dataSource.forEach((valItem,valIndex)=>{
          let address="";
          let x="";
          let y="";
          if(di.address.length>valIndex){
            address=di.address[valIndex].value;
          }
          if(di.setNum.length>valIndex){
            x=di.setNum[valIndex].geometry.x;
            y=di.setNum[valIndex].geometry.y;
          }
          lngLats.push({
            x:x,
            y:y,
            address:address
          })
        })
        list.push(
          ['repairUserChildDtoList[' + i + '].lngLats', JSON.stringify(lngLats)],
          ['repairUserChildDtoList[' + i + '].phone', di.phone?di.phone:""],
          ['repairUserChildDtoList[' + i + '].planNum', di.num],
          ['repairUserChildDtoList[' + i + '].ratifyTime', di.addTime],
          ['repairUserChildDtoList[' + i + '].respUser', di.addMainWorker],
          ['repairUserChildDtoList[' + i + '].teamUser', di.addWorker.join(',')],    
        )
      }
      if(this.isByPlan && this.addNum != num) return this.$message.error('任务数量不足'), false
      list = [
        ['typeId', this.addType],
        ['num', num],
        ['startTime', this.getStringTime(this.addStartTime) + ' ' + this.addStartHour + ':00'],
        ['endTime', this.getStringTime(this.addStopTime) + ' ' + this.addStopHour + ':00'],
        ['notes', this.addNote],
        ['isDispatching', isDispatching ? 1 : 0],
        ['orderSource', this.isByPlan ? 0 : 1],
        ['maintenanceFlag',this.maintenanceFlag?1:0],
        ['artificialEndFlag',this.artificialEndFlag?1:0]
      ].concat(list)
      return list
    },
    getStringTime(date){
      let dateTemp=new Date(date);
      return dateTemp.getFullYear()+"-"+this.dateAddZero((dateTemp.getMonth()+1))+"-"+this.dateAddZero((dateTemp.getDate()))
    },
        /**
     * 日期处理时，月及日小于10的情况下补0
     * */ 
    dateAddZero(value){
      if(value<10){
        value="0"+value;
      }
      return value;
    },
		addMissionTrue() {
      var list = this.cheak()
      if(list == false) return
      var fd = new FormData();
      list.map(e => fd.append(...e));
      fd.append('createUser', this.$store.state.user.userId);
      fd.append('dispatchingId', this.$store.state.user.userId);
      // list.push(['createUser', createUser]);
      // fd.append('createUser',this.)
			this.addDisable = true
			request({
        url: '/gps/repairorder/save', method: 'post', file: true, data: fd
      }).then(res => {
        if(res.code == 1) {
          this.$message('添加成功')
          this.visiable = false
        } else this.$message.error(res.message)
        this.loadMission()
			  this.addDisable = false
      })
    },
    cheakMan() {
      var list = this.cheak()
      if(list == false) return
      var select = this.$refs.table1.selection[0]
      list.push(['id', select.id])
      this.addDisable = true
      request({
        url: '/gps/repairorder/' + select.id, method: 'get'
      }).then(res => {
        if(res.code == 1) {
          nextDo(res.result.state, res.result.createUser)
        } else this.$message.error(res.message)
      })
      var nextDo = (id, createUser) => {
        list.push(['state', id])
        list.push(['createUser', createUser]);
        list.push(['dispatchingId', select.dispatchingId]);
        var fd = new FormData();
        list.map(e => fd.append(...e))
        request({
          url: '/gps/repairorder/updata', method: 'put', file: true, data: fd
        }).then(res => {
          if(res.code == 1) {
            this.$message('派工成功！')
            this.visiable = false
          } else this.$message.error(res.message)
          this.loadMission()
          this.addDisable = false
        })
      }
    },
    cheakMan1() {
      var list = this.cheak()
      if(list == false) return
      var select = this.$refs.table1.selection[0]
      list.id = select.id
			this.addDisable = true
      request({ 
        url: '/gps/audit/auditDispose?templateServiceType=09', 
        method: 'post',
        data: {
          "id": select.id,
          "auditId": this.user.id,
          "repairorderDto": list
        }}).then(res => {
        if(res.code == 1) {
          this.$message.success('派工成功！')
          this.visiable = false
        } else this.$message.error('派工失败：' + res.message)
        this.loadMission();
			  this.addDisable = false
      })
    },
    deleteMission() {
      var select = this.$refs.table1.selection   
      this.$confirm('确定删除选中的'+select.length+'条工单?', '提示', {
        confirmButtonText: '确定', type: 'warning'
      }).then(() => {        
        request({ 
          url: '/gps/repairorder/deleteByIds?idList=' + select.map(e => e.id).join(','), method: 'delete',
        }).then(res => {
          this.$message[res.code == 1 ? 'success' : 'error'](res.code == 1 ? '删除成功!' : '删除失败')
          var pages = this.$refs.pagination
          if(pages.internalPageSize * pages.internalCurrentPage + 1 == this.total && pages.internalCurrentPage > 1) pages.internalCurrentPage -= 1
          this.loadMission()
        })
      })
    },
    workerChange(item, i) {
      this.items[i].phone = (!this.phoneIndex[item.addMainWorker]||this.phoneIndex[item.addMainWorker]=="null")?"":this.phoneIndex[item.addMainWorker]
    }
  }
}
</script>
<style scoped>
.missionSendTooltip .el-button--small,.missionSendTooltip .el-button--small.is-round {
    padding: 9px 12px !important;
}
.off{
  width:13px;
  background:#fdeaed;
  border-left: 1px solid #f5acb8;
  transition: 0.3s;
  position: relative;
  text-align: center;
  cursor: pointer;
}
.off i{
  transition: 0.3s;
  transform: translateY(45px);
  color: #e7304e;
}
.off:hover i{
  transform: translateY(9px);
  color: #fff;
}
.off:hover{
  width: 40px;
  background:#e7304e;
  border-left: 1px solid #e7304e;
}
.off::after{
  content: '清除';
  opacity: 0;
  position: absolute;
  width: 0;
  left: 0;
  top: 30px;
  pointer-events: none;
  transition: 0.3s;
  color: #e7304e;
}
.off:hover::after{
  opacity: 1;
  left: 13px;
  color: #fff;
}
.flexDiv{
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexTitle{
  min-width: 90px;
  display: inline-block;
  text-align: right;
}
.flexInfo{
  display: inline-block;
  width: calc(100% - 90px);
}
.el-table.mapTable >>> .el-table__header-wrapper table th{
  /* height: 60px; */
  text-align: center;
}
.el-table.mapTable >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
