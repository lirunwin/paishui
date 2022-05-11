<template>
  <el-tabs v-model="activeName" ref="tabs" v-loading="mainLoading">
    <el-tab-pane :label="'人员\n(' + worker +')'" name="worker">
      <el-row style="margin-top: 8px;">
        <span class="title2" style="display:inline-block;width:45px;padding-left:8px;margin-bottom: 4px;">部门:</span>
        <el-select v-model="department" style="display: inline-block; margin-left: 3px;width:calc(100% - 63px);margin-bottom: 4px;" @change="departmentChage" size="small" placeholder="请选择">
          <el-option v-for="item of departmentList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="title2" style="display:inline-block;width:45px;padding-left:8px;">人员:</span>
        <el-select v-model="group" style="display: inline-block; margin-left: 3px;width:calc(50% - 55px);" size="small" placeholder="请选择" @change="loadStute">
          <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="title2" style="display:inline-block;width:45px;padding-left:8px;">状态:</span>
        <el-select v-model="status" style="display: inline-block; margin-left: 3px;width:calc(50% - 60px);" size="small" placeholder="请选择" @change="loadStute">
          <el-option label="全部" value="" />
          <el-option label="上班" value="上班" />
          <el-option label="下班" value="下班" />
          <el-option label="离线" value="离线" />
        </el-select>
      </el-row>
      <ul style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
                width:100%;height:calc(100% - 50px);margin-top:8px;">
        <template v-if="workerTable.length > 0">
          <li v-for="(item, index) in workerTable" :key="index" style="width:100%;padding: 5px;border: 1px solid #dadada; padding: 10px 5px;margin-top:4px;">
            <div style="display:flex;justify-content:space-between;align-items:center; ">
              <div style="border: 1px solid #dadada; padding: 5px 5px 2px 5px;">
                <el-badge :value="item.signType" :type="{'下班': 'info', '上班': 'primary'}[item.signType]">
                  <!-- <el-avatar shape="square" :src="item.src"></el-avatar> -->
                  <el-avatar shape="square" :src="item.src" @error="() => true">
                    <i class="el-icon-picture-outline"></i>
                  </el-avatar>
                </el-badge>
              </div>
              <el-link target="_blank" :title="item.signUserName" class='nameList' @click="jump(item)">{{item.signUserName}}</el-link>
              <div style="float:right;">
                <el-tooltip effect="dark" content="人员轨迹" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showWay(index)">
                    <img src="./images/guiji.png" width="20px" height="20px" style="object-fit: contain">
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="设备使用情况" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showLog(index)">
                    <img src="./images/sbrj.png" width="20px" height="20px" style="object-fit: contain">
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="任务完成情况" placement="top-start">
                  <el-button size="mini" style="padding:4px;" @click="showDone(index)">
                    <img src="./images/cbjhgl.png" width="20px" height="20px" style="object-fit: contain">
                  </el-button>
                </el-tooltip>
              </div>
              <el-tooltip effect="dark" :content="'上报隐患数量：' + (item.troubleNum || 0) + 
                '\n已完成任务数量：' + (item.completeOrderNum || 0) + 
                '\n总巡查任务数量：' + (item.totalOrderNum || 0)" placement="top-start">
                <span class="titleS">{{(item.troubleNum || 0) + '/' + (item.completeOrderNum || 0) + '/' + (item.totalOrderNum || 0)}}</span>
              </el-tooltip>
            </div>
            <div :ref="'li' + index" style="width:100%; height:0px; transition: 0.3s; overflow:hidden;">
            </div>
          </li>
        </template>
        <template v-else>
          <div style='width:100%;height:100%;text-align: center; padding-top: 10%;' slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </div>
        </template>
      </ul>
      <div v-loading="runLoading" ref="table" style="display:none;width:100%;height:100%; padding: 5px 0px;">
        <el-table class="mapTable" :show-header="tableType === 'log'" :default-expand-all="tableType != 'log'" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :data="dataT" border style="width: 100%;" height="calc(100% - 40px)">
          <el-table-column key="1" v-if="tableType === 'log'" prop="gpsTime" label="时间" show-overflow-tooltip />
          <el-table-column key="2" v-if="tableType === 'log'" prop="network" label="设备状态">
            <template slot-scope="scope">{{ ([,'卫星', '前次',, '缓存', 'Wifi', '基站',, '离线', '最后位置'][scope.row.network] || '未知类型') + '定位' }}</template>
          </el-table-column>
          <el-table-column key="3" v-if="tableType === 'info'" prop="type" label="任务状态" />
          <el-table-column key="4" v-if="tableType === 'info'" prop="state" label="完成率" width="100" />
        </el-table>
        <el-row style="margin-top: 8px">
          <el-pagination ref="paginationTable" small background layout="total, sizes, prev, next" :page-sizes="[5, 10, 50, 100]" :total="totalTable" @current-change="loadRoad(true)" @size-change="loadRoad(true)" style=" width: 250px; display: inline-block;" />
          <span ref='pageTableLength' style="font-size: 13px;" class="el-pagination__total">1/30 页</span>
        </el-row>
      </div>
      <div ref="run" style="display:none;width:100%;height:100%;">
        <ul v-loading="runLoading" style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
                width:100%;height:100%;margin-top:8px;">
          <li v-for="(item, index) in logTable" :key="index" style="width:100%;padding: 5px; padding: 5px 0px;margin-top:4px;">
            <el-button icon="el-icon-video-play" style="padding:8px;margin-right: 4px;" @click="playMove(item)"></el-button>
            <span class="name">{{ item.timeFrom + ' - ' + item.timeTo.split(' ')[1] }}</span>
          </li>
          <li v-if="logTable.length == 0" class="el-link el-link--default" style="width:100%;padding: 5px; padding: 5px 0px;margin-top:4px;">暂无数据</li>
        </ul>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="'隐患(' + totalWarring + ')'" name="warring">
      <ul style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
                width:100%;height:calc(100% - 48px);margin-top:8px;">
        <li v-for="(item, index) in fixTable" :key="index" style="width:100%;padding: 5px;border: 1px solid #dadada; padding: 10px 5px;margin-top:4px;height:80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;height:100%;">
            <div :ref="'troubleImg/' + index"></div>
            <!-- <el-image style="width: 80px; height: 60px" :src="item.src[0]" fit="cover"></el-image> -->
            <div style="display:inline-block;position: relative;width: calc(100% - 100px);height:80%;margin-left: 10px;">
              <el-link style="position: absolute;letter-spacing: 1px;" type="primary" @click="jump(item)">{{item.typeName || '未知类型'}}</el-link>
              <el-tooltip v-if="(item.address || '').length > 9" :content="item.address" placement="bottom" effect="light">
                <span style="position: absolute;bottom: 1px;">
                  {{ (item.address || '').substring(0, 8) + '...' }}
                </span>
              </el-tooltip>
              <span v-if="(item.address || '').length < 8" style="position: absolute;bottom: 1px;">
                {{ item.address }}
              </span>
            </div>
            <div style="display:inline-block;position: relative;width: 50px;height:80%;">
              <el-link type="primary" style="width: 100%;text-align: right;" @click="errorInfo(item, 1)">详情</el-link>
            </div>
          </div>
        </li>
      </ul>
      <el-row style="margin-top: 8px">
        <el-pagination ref="paginationWarring" small background layout="total, sizes, prev, next" :page-sizes="[5, 10, 50, 100]" :total="totalWarring" @current-change="loadWarring" @size-change="loadWarring" style=" width: 250px; display: inline-block;" />
        <span ref='pageTableWarring' style="font-size: 13px;" class="el-pagination__total">1/30 页</span>
      </el-row>
    </el-tab-pane>
    <el-tab-pane :label="'工地(' + placeTotal + ')'" name="place">
      <ul style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
                width:100%;height:calc(100% - 48px);margin-top:8px;">
        <li v-for="(item, index) in placeTable" :key="index" style="width:100%;padding: 5px;border: 1px solid #dadada; padding: 10px 5px;margin-top:4px;height:80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;height:100%;">
            <div :ref="'placeImg/' + index"></div>
            <!-- <el-image style="width: 80px; height: 60px" :src="item.src[0]" fit="cover"></el-image> -->
            <div style="display:inline-block;position: relative;width: calc(100% - 100px);height:80%;margin-left: 10px;">
              <el-link style="position: absolute;letter-spacing: 1px;" type="primary" @click="jump(item)">{{item.sgdw || '未知单位'}}</el-link>
              <el-tooltip v-if="(item.address || '').length > 9" :content="item.address" placement="bottom" effect="light">
                <span style="position: absolute;bottom: 1px;">
                  {{ (item.address || '').substring(0, 8) + '...' }}
                </span>
              </el-tooltip>
              <span v-if="(item.address || '').length < 8" style="position: absolute;bottom: 1px;">
                {{ item.address }}
              </span>
            </div>
            <div style="display:inline-block;position: relative;width: 50px;height:80%;">
              <el-link type="primary" style="width: 100%;text-align: right;" @click="placeInfo(item, 1)">详情</el-link>
            </div>
          </div>
        </li>
      </ul>
      <el-row style="margin-top: 8px">
        <el-pagination ref="paginationPlace" small background layout="total, sizes, prev, next" :page-sizes="[5, 10, 50, 100]" :total="placeTotal" @current-change="loadPlace" @size-change="loadPlace" style=" width: 250px; display: inline-block;" />
        <span ref='pageTablePlace' style="font-size: 13px;" class="el-pagination__total">1/30 页</span>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="图层" name="layer">
      <el-table ref="layerTable" :show-header='false' :data="dataLayer" stripe style="width: 100%; margin-top:8px;" height="calc(100% - 12px)" @select="layerSelect" @select-all="layerSelect">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="layer" label="图层" />
      </el-table>
    </el-tab-pane>
    <tf-mission ref="mission"></tf-mission>
    <el-dialog v-dialogDrag title="工地详情" :visible.sync="placeVisiable" width="976px" top="calc(50vh - 400px)">
      <build-detail :buildAry="buildAry"></build-detail>
    </el-dialog>
    <el-dialog v-dialogDrag title="隐患详情" :visible.sync="errorVisiable" width="976px" top="calc(50vh - 400px)">
      <troubleDetail :troubleAry="troubleAry" />
    </el-dialog>
  </el-tabs>
</template>
<script lang="ts">
/**
 * @description 该功能为巡检子系统，监控中心模块中的实时监控功能
 * @author 梁罗、李顺<8763330731@qq.com>
 */
import {Vue,Component,Watch,Prop} from 'vue-property-decorator'
// import pointImg from "./images/netError.png";
import noPointImg from "./images/noWork.png";
import onPointImg from "./images/onWork.png";
import {IP} from '@/utils/request'
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/TableLegend.vue'
import tfMission from '@/views/zhpt/common/MissionInfo.vue'
import buildDetail from '@/views/zhpt/buildsitemanage/components/buildDetails.vue'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import {  getCompany,getGroupUserMap } from '@/api/base'
import { Map } from 'ol';
import { ElTabs } from 'element-ui/types/tabs';
import { ElTable } from 'element-ui/types/table';
import { ElPagination } from 'element-ui/types/pagination';
@Component({
  name: 'MapWatching',
  components: { tfLegend, tfMission, buildDetail, troubleDetail },
})
export default class XjRealTimeListen extends Vue {
  @Prop(Object) param:Object
  @Prop() data!:any
  activeName='worker';
  departmentList=[];
  lineTypeId="12";//巡检线的类型ID
  pointTypeId='10';//巡检点的类型ID
  department="";
  setTime="";
  worker='';
  status='';
  workerTable=[];
  dataT=[];
  tableType='info';
  currentDepartList=[];
  fixTable=[];
  logTable=[];
  dataLayer=[];
  totalTable=0;
  totalWarring=0;
  mainLoading=true;
  runLoading=false;
  group=''
  groups=[];
  groupIndex={};
  errorVisiable=false;
  placeVisiable=false;
  selectRow={}
  placeTable=[]
  placeTotal=0
  buildAry={
    buildId: '',
    optionType: "1"      //1=>详情，2=审核操作
  };
  troubleAry={};
  showLi:number[]=[];
  mapView:Map=null;
  index=null;
  get sidePanelOn() { 
    return this.$store.state.map.P_editableTabsValue 
  }
    @Watch('sidePanelOn')
    PanelOnChange(newTab, oldTab) {
      if (newTab == oldTab) return
      if (newTab == 'xjRealTimeListen') {
        this.$nextTick(() => {
          this.dataLayer.map(e => e.feature.map(de => de.visible = true))
        })
      }
      if (oldTab == 'xjRealTimeListen') {
        this.dataLayer.map(e => e.feature.map(de => de.visible = false))
      }
    }
  mounted() {
      var date = new Date()
      var [year, month, day, hour, min, scond] = 
      ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'].map(e => date[e]())
      if(++ month < 10) month = '0' + month
      if(day < 10) day = '0' + day
      if(hour < 10) hour = '0' + hour
      if(min < 10) min = '0' + min
      if(scond < 10) scond = '0' + scond
      this.setTime = [year, month, day].join('-'); 
      this.init() 
    }
    // 获取部门信息
    getCompanyInfo() {
      getCompany({ size: 10000 }).then(res => {
        res.result.records.forEach(item => {
          item.id = item.id + ''
        })
        this.departmentList = res.result.records;
      });
    }
    hideData(){
      var table = this.$refs.table as HTMLElement
      var run = this.$refs.run as HTMLElement
      if(table&&run){
          table.style.display =  run.style.display = 'none'
      }
      if(this.showLi&&this.showLi[0]!=undefined){
        this.$refs['li' + this.showLi[0]][0].style.height = '0'
      }
      this.showLi = [undefined, undefined]
    }
    departmentChage(){
      this.groups=[];
      this.group="";
      this.loadStute();
    }
    async init() {
      var recoad = 0
      this.department=this.$store.state.user.departmentId+"";//默认当前部门
      this.getCompanyInfo();
      var mapV = this.mapView = this.data.mapView
      var done = () => {if(++recoad == 4) this.mainLoading = false}
      //@ts-ignore
      //this.$refs.tabs.$el.children[0].style.background = '#fff'
      (this.$refs.tabs as ElTabs).$el.children[0].children[0].style.padding = '0'
      this.dataLayer.push(
        { layer: '人员', feature: [], select: true }, 
        { layer: '隐患', feature: [], select: true }, 
        { layer: '工地', feature: [], select: true }, 
        { layer: '巡检点', feature: [], select: true }, 
        { layer: '巡检线', feature: [], select: true }
      )
      this.dataLayer.map(e => (this.$refs.layerTable as ElTable).toggleRowSelection(e));
      ['loadStute', 'loadWarring', 'loadPlace', 'loadMissionRoad'].map(e => this[e](0, 0, done))

      var mapdiv = mapV.container
      var graphics = mapV.graphics
      // arcgis 点击事件，需要修改
      // this.move = mapV.on('pointer-move', (evt) => mapV.hitTest(evt, graphics).then((re) => {
      //   re = re.results
      //   var needShow = false
      //   if (re.length) {
      //     for (var i = 0, ii = re.length; i < ii; i++) {
      //       var g = re[i].graphic
      //       if (g.isError || g.isPlance) {
      //         needShow = true
      //         break
      //       }
      //       continue
      //     }
      //   }
      //   mapdiv.style.cursor = needShow ? 'pointer' : ''
      // }))
      // this.click = mapV.on('click', (evt) => {
      //   mapV.hitTest(evt, graphics).then((re) => {
      //     re = re.results
      //     if (!re.length) return
      //     for (var i = 0, ii = re.length; i < ii; i++) {
      //       var g = re[i].graphic
      //       if (g.isError) {
      //         this.errorInfo(this.fixIndex[g.isError])
      //         break
      //       }
      //       if (g.isPlance) {
      //         this.placeInfo(this.placeIndex[g.isError])
      //         break
      //       }
      //     }
      //   })
      // })
      this.showLi = [undefined, undefined]
    }
    loadStute(nt?, nt2?, callback?) {
      var url = '/gps/pdasign/getUserSignList'
      let params={time:this.setTime+" 23:59:59",deptId:""}
      if(this.department){
        params.deptId=this.department;
      }
      var view = this.mapView
      this.playClose();
      this.hideData();
      var visible = this.dataLayer[0].select
      var callback = callback
      if(callback) callback()
      //20220511注释
      //view.graphics.removeMany(this.dataLayer[0].feature)
      var state = this.status 
      this.workerTable =[];
      // this.$nextTick(()=>{
      //   request({ url: url, method: 'get',params }).then(res => {
      //     if(res.code == 1) {
      //       res = res.result.pdasignVoList || []
      //       var sp = view.spatialReference
      //       var Graphic = view.TF_graphic
      //       var onworkCount = 0
      //       var extent = { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity, spatialReference: view.spatialReference }
      //       var features = []
      //       var rows = []
      //       let groups=[];
      //       for(var i=0,ii=res.length;i<ii;i++) {
      //         var row = res[i];
      //         groups.push({id:row.signUser,name:row.signUserName});
      //         if(row.signType == '上班') onworkCount += 1
      //         if(state && state != row.signType) continue
      //         if((this.group!="")&&this.group != row.signUser) continue
      //         if(row.lng&&row.lat){
      //           var feature = new Graphic({
      //             geometry: { type: 'point', x: row.lng, y: row.lat, spatialReference: sp },
      //             symbol: { url: (row.signType == '上班'?onPointImg:noPointImg),  width: "36px",  height: "36px", yoffset: '13px', xoffset: '0px', type: 'picture-marker' }
      //           })
      //           var featureT = new Graphic({
      //             geometry: { type: 'point', x: row.lng, y: row.lat, spatialReference: sp },
      //             symbol: {
      //               type: 'text', color: 'white', haloColor: 'black', haloSize: '1px',
      //               text: row.signUserName || '', yoffset: '-15px', verticalAlignment: 'bottom', font: { size: '14px', weight: 'bold' }
      //             }
      //           })
      //           if(!visible) feature.visible = featureT.visible = visible
      //           features.push(feature, featureT)
      //           if (row.lng < extent.xmin) extent.xmin = row.lng
      //           if (row.lat < extent.ymin) extent.ymin = row.lat
      //           if (row.lng > extent.xmax) extent.xmax = row.lng
      //           if (row.lat > extent.ymax) extent.ymax = row.lat
      //         }
      //         row.src = ""
      //         rows.push(row)
      //       }
      //       if(this.groups.length==0){
      //         groups.unshift({id:'',name:"全部"})
      //         this.groups=groups;
      //       }
      //       this.worker = onworkCount + '/' + res.length
      //       view.graphics.addMany(features)
      //       this.dataLayer[0].feature = features
      //       if(extent.xmin != Infinity) {
      //         if(extent.xmin == extent.xmax) {
      //           view.center = { type: 'point', x: extent.xmin, y: extent.ymin, spatialReference: view.spatialReference }
      //           if(view.zoom < 6) view.zoom = 6
      //         } else view.extent = extent
      //       }
      //       var token = this.$store.state.user.token;
      //       this.$nextTick(_ => rows.map((e, i) => {            
      //         request({ url: '/base/user/' + e.signUser, method: 'get' }).then(row => {
      //           e.src = IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + row.result.avatar
      //           if(i==(res.length-1)){
      //             this.workerTable = rows
      //           }
      //         })
      //       }))
      //     } else this.$message.error('人员信息加载失败：' + res.message)        
      //     if(callback) callback()
      //   })
      // })

    }
    loadWarring(nt, nt2, callback) {
      var pages = this.$refs.paginationWarring as ElPagination
      var url = '/gps/trouble/page?state=1,3&current=' + pages.currentPage + '&size=' + pages.pageSize
      var view = this.mapView
      var visible = this.dataLayer[1].select
      if(callback) callback()
      //view.graphics.removeMany(this.dataLayer[1].feature)
      // request({ url: url, method: 'get' }).then(res => {
      //   if(res.code == 1) {
      //     res = res.result
      //     this.images = []
			// 		this.totalWarring = res.total
      //     this.$refs.pageTableWarring.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
      //     var sp = view.spatialReference
      //     var Graphic = view.TF_graphic
      //     var features = []
      //     var token = this.$store.state.user.token;
      //     (res = res.records.filter(e => e.state != '已消除')).map(e => {
      //       var [x, y] = [e.lgtd || 0, e.lttd || 0]
      //       var feature = new Graphic({
      //         isError: e.id,
      //         geometry: { type: 'point', x: x, y: y, spatialReference: sp },              
      //         symbol: {            
      //           path: 'M512.170667 706.432c-25.173333 0-45.397333 20.48-45.397334 45.952 0 20.48 20.224 41.045333 45.397334 41.045333 25.173333 0 45.397333-20.522667 45.397333-45.952-4.906667-20.565333-25.130667-41.045333-45.397333-41.045333zM862.08 896H162.218667c-60.757333 0-96.341333-66.474667-65.621334-118.144 116.608-205.098667 233.258667-405.333333 349.909334-611.114667 30.72-51.626667 106.154667-51.626667 136.917333 0 111.786667 200.149333 228.394667 405.290667 345.045333 611.114667 30.037333 51.626667-10.496 118.101333-66.389333 118.101333V896z m-324.778667-261.717333l15.36-246.186667c0-25.429333-20.224-45.952-45.397333-45.952-20.266667 0-40.533333 20.522667-40.533333 45.952l15.445333 246.186667c4.821333 36.053333 55.125333 36.053333 55.125333 0z',
      //           color: [245, 108, 108], outline: { width: '0px' },
      //           size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
      //         }
      //       })
      //       var featureT = new Graphic({
      //         isError: e.id,
      //         geometry: { type: 'point', x: x, y: y, spatialReference: sp },
      //         symbol: {
      //           type: 'text', color: 'white', haloColor: 'black', haloSize: '1px',
      //           text: e.typeName || '', yoffset: '-15px', verticalAlignment: 'bottom', font: { size: '14px', weight: 'bold' }
      //         }
      //       })
      //       features.push(feature, featureT)
      //       if(!visible) feature.visible = featureT.visible = visible
      //       e.src = []
      //       if(e.filePathList) e.src = e.filePathList.map(es =>IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + es.replace(/\//g, '%2f'))
      //     })
      //     var index = this.fixIndex = {};
      //     this.fixTable = res
      //     this.$nextTick(_ => this.fixTable.map((e, i) => {
      //         index[e.id] = e
      //         var div = this.$refs['troubleImg/' + i][0]
      //         if(e.filePathList){
      //           div.style.width = '80px'
      //           div.style.height = '60px'
      //           div.innerHTML = '<img src="' + 
      //             IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + e.filePathList[0] + 
      //             // 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=374922965,3204292680&fm=190&app=60&f=JPEG' + 
      //             '" class="el-image__inner" style="object-fit: cover;"/>'
      //         } else {
      //           div.style.width = ''
      //           div.style.height = ''
      //           div.innerHTML = ''
      //         }
      //       })
      //     )
      //     view.graphics.addMany(features)
      //     this.dataLayer[1].feature = features
      //   } else this.$message.error(res.message)
      //   if(callback) callback()
      // })
    }
    loadPlace(nt, nt2, callback) {
      var pages = this.$refs.paginationPlace as ElPagination
      var url = '/gps/build/page?state=1,3&current=' + pages.currentPage + '&size=' + pages.currentPage
      var view = this.mapView
      var visible = this.dataLayer[2].select
      if(callback) callback()
      //view.graphics.removeMany(this.dataLayer[2].feature)
      // request({ url: url, method: 'get' }).then(res => {
      //   if(res.code == 1) {
      //     res = res.result
      //     this.images = []
			// 		this.placeTotal = res.total
      //     this.$refs.pageTablePlace.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
      //     var sp = view.spatialReference
      //     var Graphic = view.TF_graphic
      //     var features = []
      //     var token = this.$store.state.user.token;
      //     (res = res.records.filter(e => e.state != '已结束')).map(e => {
      //       var [x, y] = [e.lgtd || 0, e.lttd || 0]
      //       var feature = new Graphic({
      //         isPlance: e.id,
      //         geometry: { type: 'point', x: x, y: y, spatialReference: sp },              
      //         symbol: {    
      //           path: 'M896 704H128a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h768a128 128 0 0 1 128 128v320a128 128 0 0 1-128 128zM157.44 220.8a64 64 0 0 0-64 64v262.4a64 64 0 0 0 64 64h709.12a64 64 0 0 0 64-64v-262.4a64 64 0 0 0-64-64zM288 48V128H192V48A48 48 0 0 1 240 0a48 48 0 0 1 48 48zM832 48V128h-96V48a48 48 0 0 1 48-48 48 48 0 0 1 48 48zM288 704v320H192v-320z M64.64 646.016l280.064-484.992 83.136 48-280 484.992zM373.504 636.544l274.24-474.944 83.2 48-274.304 474.944zM667.2 650.432l267.84-463.936 83.136 48-267.84 464zM784 896.64h-544v-96h544z M832 704v320h-96v-320z',
      //           color: [245, 108, 108], outline: { width: '0px' },
      //           size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
      //         }
      //       })
      //       var featureT = new Graphic({
      //         isPlance: e.id,
      //         geometry: { type: 'point', x: x, y: y, spatialReference: sp },
      //         symbol: {
      //           type: 'text', color: 'white', haloColor: 'black', haloSize: '1px',
      //           text: e.sgdw || '', yoffset: '-15px', verticalAlignment: 'bottom', font: { size: '14px', weight: 'bold' }
      //         }
      //       })
      //       features.push(feature, featureT)
      //       if(!visible) feature.visible = featureT.visible = visible
      //       e.src = []
      //       if(e.filePathList) e.src = e.filePathList.map(es =>IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + es.replace(/\//g, '%2f'))
      //     })
      //     var index = this.placeIndex = {};
      //     this.placeTable = res
      //     this.$nextTick(_ => this.placeTable.map((e, i) => {
      //         index[e.id] = e
      //         var div = this.$refs['placeImg/' + i][0]
      //         if(e.filePathList){
      //           div.style.width = '80px'
      //           div.style.height = '60px'
      //           div.innerHTML = '<img src="' + 
      //             IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + e.filePathList[0] + 
      //             // 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=374922965,3204292680&fm=190&app=60&f=JPEG' + 
      //             '" class="el-image__inner" style="object-fit: cover;"/>'
      //         } else {
      //           div.style.width = ''
      //           div.style.height = ''
      //           div.innerHTML = ''
      //         }
      //       })
      //     )
      //     view.graphics.addMany(features)
      //     this.dataLayer[2].feature = features
      //   } else this.$message.error(res.message)
      //   if(callback) callback()
      // })
    }
    loadMissionRoad(nt, nt2, callback) {
      var view = this.mapView
      //var Graphic = view.TF_graphic
      //view.graphics.removeMany([...this.dataLayer[3].feature, ...this.dataLayer[4].feature])
      //var sp = view.spatialReference
      var date = new Date()
      var [year, month, day, hour, min, scond] = 
        ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'].map(e => date[e]())
      if(++ month < 10) month = '0' + month
      if(day < 10) day = '0' + day
      if(hour < 10) hour = '0' + hour
      if(min < 10) min = '0' + min
      if(scond < 10) scond = '0' + scond
      if(callback) callback()
      var startDate = [year, month, day].join('-') + ' 00:00:00'
      var endDate = [year, month, day].join('-') + ' ' + [hour, min, scond].join(':');
      //获取本部门所以人
        let data={
              size:10000,
              current:1
          }
        // getGroupUserMap(data).then(res=>{                                                                                
        //     //初始化显示所有人
        //     let addUser=[];
        //     res.result.groupUserDeptVoList.forEach(item=>{
        //         addUser.push(item.userId);
        //     });
        //     let url='/gps/plan/getPlanTimeIntervalPage?planEnddate='+startDate +'&planBegindate='+endDate+"&inspectType="+this.pointTypeId+','+this.lineTypeId+"&inspectUsers="+addUser.join(',')
        //     request({url,method: 'get'}).then(res=>{
        //       if(res.code==1){
        //         let pointList=[];
        //         let lineList=[];
        //         res.result.records.forEach(item=>{
        //           if(item.inspectContents){
        //             let tempJson=JSON.parse(item.inspectContents);
        //             tempJson.forEach(item2=>{
        //               if(this.pointTypeId==item2.typeId+""){
        //                 pointList.push(...item2.data);
        //               }else if(this.lineTypeId==item2.typeId+""){
        //                 lineList.push(...item2.data);
        //               }
        //             })
        //           }
        //         });
        //         pointList=Array.from(new Set(pointList));
        //         lineList=Array.from(new Set(lineList));
        //         const lineUrl='/gps/planpath/page?current=1&size=1000'
        //         const pointUrl='/gps/planpoint/page?current=1&size=1000'
        //         Promise.all([request({url:lineUrl,method: 'get'}), request({url:pointUrl,method: 'get'})]).then(res=>{
        //           let lineListRes=res[0];
        //           let pointListRes=res[1];
        //           let potFeatures=[];
        //           let lineFeatures=[];
        //           if(lineListRes.code==1){
        //               lineListRes.result.records.forEach(item2=>{
        //                 if(lineList.indexOf(item2.id)!=-1&&item2.geometry){
        //                   let geometry = JSON.parse(item2.geometry)
        //                   let symbol = { type: 'simple-line', color: [51, 133, 255], cap: 'square', width: "2px"  }
        //                   lineFeatures.push(new Graphic({ geometry, symbol }))
        //                 }
        //               })
        //           }
        //           if(pointListRes.code==1){
        //             pointListRes.result.records.forEach(item2=>{
        //               if(pointList.indexOf(item2.id)!=-1&&item2.lng&&item2.lat){
        //               let geometry = { type: 'point', x: item2.lng, y: item2.lat, spatialReference: sp }
        //               let  symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 } }
        //                 potFeatures.push(new Graphic({ geometry, symbol }))
        //               }
        //             })
        //           }
        //           view.graphics.addMany([...potFeatures, ...lineFeatures])
        //           this.dataLayer[3].feature = potFeatures
        //           this.dataLayer[4].feature = lineFeatures
        //           if(callback) callback()
        //         })          
        //       }
        //     })
        //   }
        // )
    }
    layerSelect(select, row) {
      if(row) {
        select = row.select = !row.select
        row.feature.map(e => e.visible = select)
      } else {
        select = select.length != 0
        this.dataLayer.map(e => {
          e.select = select
          e.feature.map(d => d.visible = select)
        })
      }
    }
    showDable(index, w) {
      var table = this.$refs.table
      var run = this.$refs.run
      if(this.showLi[0] == index && this.showLi[1] == w) {
        this.$refs['li' + this.showLi[0]][0].style.height = '0'
        //@ts-ignore
        table.style.display =  run.style.display = 'none'
        this.showLi = [undefined, undefined]
        return false
      }
      if(this.showLi[0] == undefined && this.showLi[1] == undefined) {
        var inLi = this.$refs['li' + index][0]
        inLi.style.height = '400px'
        inLi.appendChild([run, table, table][w]);
        //@ts-ignore
        [run, table, table][w].style.display = ''
        this.showLi = [index, w]
        return true
      }
      if(this.showLi[0] == index && this.showLi[1] != w) {
        var inLi = this.$refs['li' + index][0];
        //@ts-ignore
        [run, table][1 - (w > 0 ? 1 : 0)].style.display = 'none';
        inLi.appendChild([run, table, table][w]);
        //@ts-ignore
        [run, table, table][w].style.display = ''
        this.showLi = [index, w]
        return true
      }
      if(this.showLi[0] != index && this.showLi[1] != w) {
        this.$refs['li' + this.showLi[0]][0].style.height = '0';
        //@ts-ignore
        [run, table, table][this.showLi[1]].style.display = 'none'
        var inLi = this.$refs['li' + index][0];
        inLi.style.height = '400px'
        inLi.appendChild([run, table, table][w]);
        //@ts-ignore
        [run, table, table][w].style.display = ''
        this.showLi = [index, w]
        return true
      }
      if(this.showLi[0] != index && this.showLi[1] == w) {
        this.$refs['li' + this.showLi[0]][0].style.height = '0'
        var inLi = this.$refs['li' + index][0];
        //@ts-ignore
        [run, table, table][this.showLi[1]].style.display = 'none'
        inLi.style.height = '400px'
        inLi.appendChild([run, table, table][w]);
        //@ts-ignore
        [run, table, table][w].style.display = ''
        this.showLi = [index, w]
        return true
      }
    }
    showWay(index) {
      // if(this.mapView.TF_roadPlayer){
      //   this.mapView.TF_roadPlayer.close();
      // }
      if(!this.showDable(index, 0)) return
      var use = this.workerTable[index]
      var startDate = this.setTime + ' 00:00:00'
      var endDate = this.setTime + ' 23:59:59'
      var url = '/gps/gps/getSection?userId=' + use.signUser + '&startDate=' + startDate + '&endDate=' + endDate
      request({ url: url, method: 'get' }).then(response => {
        this.runLoading = false
        if(response.code == 1) {
          const res = response.result
          this.logTable = res.map((e) => {
            e = e.split('段:')[1].split(' - ')
            return  { useId: use.signUser, timeFrom: e[0], timeTo: e[1]}
          })
        } else this.$message.error(response.message)
      })
      this.runLoading = true
    }
    showLog(index) {
      // if(this.mapView.TF_roadPlayer){
      //   this.mapView.TF_roadPlayer.close();
      // }
      this.index = index
      if(!this.showDable(index, 1)) return
      this.tableType = 'log'
      this.$nextTick(this.loadRoad)
    }
    showDone(index) {
      // if(this.mapView.TF_roadPlayer){
      //   this.mapView.TF_roadPlayer.close();
      // }
      this.index = index
      if(!this.showDable(index, 2)) return
      this.tableType = 'info'
      this.$nextTick(this.loadRoad)
    }
    loadRoad(isChangePage?) {
      var use = this.workerTable[this.index]
      if(!use) return
      this.runLoading = true
      var pages = this.$refs.paginationTable as ElPagination
      var startDate = this.setTime + ' 00:00:00';
      var endDate =this.setTime+" 23:59:59";
      var url = (this.tableType == 'log' ? ('/gps/gps/page?startDate=' + startDate + '&endDate=' + endDate + '&userId=') :
        '/gps/plan/getPlanTimeIntervalPage?planEnddate='+this.setTime + ' 23:59:59'+'&planBegindate='+this.setTime + ' 00:00:00'+'&inspectUsers=') + use.signUser + '&current=' + (isChangePage ? pages.currentPage : (pages.currentPage = 1)) + '&size=' + pages.pageSize
      request({ url: url, method: 'get' }).then((res:any) => {
        this.runLoading = false
        if(res.code == 1) {
          res = res.result
					this.totalTable = res.total as number
          (this.$refs.pageTableLength as HTMLElement).innerHTML = pages.currentPage + '/' + Math.ceil(res.total / pages.currentPage) + '页'
          if(this.tableType=="log"){
            this.dataT = res.records
          }else{
            let dataList=[];
            res.records.forEach((item,index)=>{
              let itemOne={
                id:'one'+index,
                type:item.inspectType,
                state:item.planState,
                children:[],
              }
              item.planTypeOverList.forEach((item2,index2)=>{
                itemOne.children.push({
                  id:"two"+index+""+index2,
                  type:item2.typeName,
                  state:item2.percent?item2.percent+'%':'0%'
                })
              });
              dataList.push(itemOne);
            });
            this.dataT=dataList;
          }
        } else this.$message.error(res.message)
      })
    }
    playMove(item) {
      var view = this.mapView
      //var mapdiv = view.container
      var url = '/gps/gps/getAll?userId=' + item.useId + '&startDate=' + item.timeFrom + '&endDate=' + item.timeTo + '&isAsc=true'
      var timeTable = []
      request({ url: url, method: 'get' }).then((res:any) => {
        if(res.code == 1) {
          res = res.result
          timeTable = res.map((e) => {return {
            x: e.locationLongitude,
            y: e.locationLatitude,
            t: e.checkTime
          }})
          if(timeTable.length > 0) run()
        } else this.$message.error(res.message)
      })
      var run = () => {
        this.$store.dispatch('map/changeMethod', {
          pathId: 'roadPlayer', widgetid: 'FloatPanel',
          label: '浮动框', param: { view: this.mapView, times: timeTable }
        })
        //if(this.mapView.TF_roadPlayer) this.mapView.TF_roadPlayer.reload(timeTable)
      }
    }
    errorInfo(row, isJump) {
      this.errorVisiable = true   
			this.troubleAry = {
				troubleId: row.id,
				optionType:"1"			//1=>详情，2=审核操作
			}
      if(isJump) this.jump(row)
    }
    placeInfo(row, isJump) {  
      this.placeVisiable = true    
      this.buildAry = {
        buildId: row.id,
        optionType:"1"      //1=>详情，2=审核操作
      }
      if(isJump) this.jump(row)
    }
    jump(row, dia?) {
      if((row.lgtd || row.lng)&&(row.lttd || row.lat)){
        // var view = dia ? this.mapView1 : this.mapView
        // view.center = { type: 'point', x: row.lgtd || row.lng, y: row.lttd || row.lat, spatialReference: view.spatialReference }
        // view.zoom = dia ? 4 : 6
      }else{
        this.$message.info("暂未上传坐标信息！")
      }
    }
    playClose(){
      // if(this.mapView.TF_roadPlayer){
      //   this.mapView.TF_roadPlayer.close();
      // }
    }
    showMissionInfo(row) {
      //@ts-ignore
      this.$refs.mission.showMissionInfo(row.id)
    }
  destroyed() {
    this.playClose();
    ['move', 'click'].map(e => this[e].remove())
    var tr = []
    this.dataLayer.map(e => tr.push(...e.feature))
    //this.mapView.graphics.removeMany(tr)
  }
}
</script>
<style lang='scss' scoped>
/deep/.nameList span.el-link--inner {
  width: 70px !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  overflow: hidden !important;
}
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
  width: calc(100% - 90px);
}
</style>

