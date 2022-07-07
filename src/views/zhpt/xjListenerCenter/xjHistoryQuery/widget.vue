<template>
  <div style="width:100%;height:100%;">
    <el-row style="margin-top: 8px;">
      <span class="title2" style="display:inline-block;width:70px;">部门:</span>
      <el-select
        v-model="department"
        style="display: inline-block;width:calc(100% - 100px);"
        @change="departmentChage"
        size="small"
        placeholder="请选择"
      >
        <el-option v-for="item of departmentList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span class="title2" style="display:inline-block;width:70px;margin-top:5px">人员:</span>
      <el-select
        v-model="group"
        style="display: inline-block;width:calc(50% - 80px);margin-top:5px"
        size="small"
        placeholder="请选择"
        @change="loadStute"
      >
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span class="title2" style="display:inline-block;width:52px;padding-left: 10px;margin-top:5px">状态:</span>
      <el-select
        v-model="status"
        style="display: inline-block;width:calc(50% - 82px);margin-top:5px"
        size="small"
        placeholder="请选择"
        @change="loadStute"
      >
        <el-option label="全部" value="" />
        <el-option label="上班" value="上班" />
        <el-option label="下班" value="下班" />
        <el-option label="离线" value="离线" />
        <el-option label="停用" value="停用" />
      </el-select>
      <span class="title2" style="display:inline-block;width:70px">日期：</span>
      <el-date-picker
        style="margin-top:5px;width:calc(100% - 100px);"
        v-model="time"
        type="date"
        value-format="yyyy-MM-dd"
        @change="loadStute"
        :picker-options="startOptions"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-row>
    <ul
      style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
    width:100%;height:calc(100% - 85px);margin-top:8px;"
    >
      <template v-if="workerTable.length > 0">
        <li
          v-for="(item, index) in workerTable"
          :key="index"
          style="width:100%;padding: 5px;border: 1px solid #dadada; padding: 10px 5px;margin-top:4px;"
        >
          <div style="display:flex;justify-content:space-between;align-items:center; ">
            <div style="border: 1px solid #dadada; padding: 5px 5px 2px 5px;">
              <el-badge :value="item.signType" :type="{ 下班: 'info', 上班: 'primary' }[item.signType]">
                <el-avatar shape="square" :src="item.src"></el-avatar
                ><!-- "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" -->
              </el-badge>
            </div>
            <el-link target="_blank" class="nameList" :title="item.signUserName" @click="jump(item)">{{
              item.signUserName
            }}</el-link>
            <div style="float:right;">
              <el-tooltip effect="dark" content="人员轨迹" placement="top-start">
                <el-button size="mini" style="padding:4px;" @click="showWay(index)">
                  <img src="./images/guiji.png" width="20px" height="20px" style="object-fit: contain" />
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="设备日志" placement="top-start">
                <el-button size="mini" style="padding:4px;" @click="showLog(index)">
                  <img src="./images/sbrj.png" width="20px" height="20px" style="object-fit: contain" />
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务完成情况" placement="top-start">
                <el-button size="mini" style="padding:4px;" @click="showDone(index)">
                  <img src="./images/cbjhgl.png" width="20px" height="20px" style="object-fit: contain" />
                </el-button>
              </el-tooltip>
            </div>
            <el-tooltip
              effect="dark"
              :content="
                '上报隐患数量：' +
                  (item.troubleNum || 0) +
                  '\n已完成任务数量：' +
                  (item.completeOrderNum || 0) +
                  '\n总巡查任务数量：' +
                  (item.totalOrderNum || 0)
              "
              placement="top-start"
            >
              <span class="titleS">{{
                (item.troubleNum || 0) + '/' + (item.completeOrderNum || 0) + '/' + (item.totalOrderNum || 0)
              }}</span>
            </el-tooltip>
          </div>
          <div :ref="'li' + index" style="width:100%; height:0px; transition: 0.3s; overflow:hidden;"></div>
        </li>
      </template>

      <template v-else>
        <div style="width:100%;height:100%;text-align: center; padding-top: 10%;" slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
        </div>
      </template>
    </ul>
    <div v-loading="runLoading" ref="table" style="display:none;width:100%;height:100%; padding: 5px 0px;">
      <el-table
        class="mapTable"
        :show-header="tableType === 'log'"
        :default-expand-all="tableType != 'log'"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="dataT"
        border
        style="width: 100%;"
        height="calc(100% - 40px)"
      >
        <el-table-column key="1" v-if="tableType === 'log'" prop="gpsTime" label="时间" show-overflow-tooltip />
        <el-table-column key="2" v-if="tableType === 'log'" prop="network" label="设备状态">
          <template slot-scope="scope">{{
            ([, '卫星', '前次', , '缓存', 'Wifi', '基站', , '离线', '最后位置'][scope.row.network] || '未知类型') +
              '定位'
          }}</template>
          <!-- <template slot-scope="scope">{{ (['GPS', '基站', 'WIFI'][scope.row.network] || '未知类型') + '定位' }}</template> -->
        </el-table-column>
        <el-table-column key="3" v-if="tableType === 'info'" prop="type" label="任务状态" />
        <el-table-column key="4" v-if="tableType === 'info'" prop="state" label="完成率" width="100" />
      </el-table>
      <el-row style="margin-top: 8px">
        <el-pagination
          ref="paginationTable"
          small
          background
          layout="total, sizes, prev, next"
          :page-sizes="[5, 10, 50, 100]"
          :total="totalTable"
          @current-change="loadRoad(true)"
          @size-change="loadRoad(true)"
          style=" width: 250px; display: inline-block;"
        />
        <span ref="pageTableLength" style="font-size: 13px;" class="el-pagination__total">1/30 页</span>
      </el-row>
    </div>
    <div ref="run" style="display:none;width:100%;height:100%;">
      <ul
        v-loading="runLoading"
        style="list-style-type: none; padding: 2px; margin: 0px; font-size: 14px; border: 1px solid #dadada; overflow-x: hidden; overflow-y: auto;
              width:100%;height:100%;margin-top:8px;"
      >
        <li
          v-for="(item, index) in logTable"
          :key="index"
          style="width:100%;padding: 5px; padding: 5px 0px;margin-top:4px;"
        >
          <el-button
            icon="el-icon-video-play"
            style="padding:8px;margin-right: 4px;"
            @click="playMove(item)"
          ></el-button>
          <span class="name">{{ item.timeFrom + ' - ' + item.timeTo.split(' ')[1] }}</span>
        </li>
        <li
          v-if="logTable.length == 0"
          class="el-link el-link--default"
          style="width:100%;padding: 5px; padding: 5px 0px;margin-top:4px;"
        >
          暂无数据
        </li>
      </ul>
    </div>
    <tf-mission ref="mission"></tf-mission>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import noPointImg from './images/noWork.png'
import onPointImg from './images/onWork.png'
import { IP } from '@/utils/request'
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/TableLegend.vue'
import tfMission from '@/views/zhpt/common/MissionInfo.vue'
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { getCompany } from '@/api/base'
import { Map } from 'ol'
import { ElPagination } from 'element-ui/types/pagination'
@Component({
  name: 'MapWatching',
  components: { tfLegend, tfMission }
})
export default class XjHistoryQuery extends Vue {
  @Prop() param: object
  @Prop() data: any
  workerTable = []
  dataT = []
  department = ''
  departmentList = []
  startOptions = {
    //开始时间控制选择
    disabledDate: (time) => {
      return time.getTime() > new Date()
    }
  }
  status = ''
  peopelFea = []
  tableType = 'info'
  fixTable = []
  logTable = []
  dataLayer = []
  total = 0
  totalTable = 0
  totalWarring = 0
  runLoading = false
  time = ''
  group = ''
  groups = []
  errorVisiable = false
  selectRow = {}
  mapView: Map = null
  features = []
  showLi = []
  index = null
  get sidePanelOn() {
    return this.$store.state.map.P_editableTabsValue
  }
  @Watch('time')
  timeChange(e) {
    this.loadStute()
  }
  @Watch('sidePanelOn')
  panelOnChange(newTab, oldTab) {
    if (newTab == oldTab) return
    if (newTab == 'xjHistoryQuery') {
      this.$nextTick(() => {
        for (var i = 0, il = this.features, ii = il.length; i < ii; i++) {
          il[i].visible = true
        }
      })
    }
    if (oldTab == 'xjHistoryQuery') {
      for (var i = 0, il = this.features, ii = il.length; i < ii; i++) {
        il[i].visible = false
      }
    }
  }
  mounted() {
    this.mapView = this.data.mapView
    this.features = []
    this.showLi = [undefined, undefined]
    let date = new Date()
    this.department = this.$store.state.user.departmentId + '' //默认当前部门
    this.time =
      date.getFullYear() + '-' + this.timeAddZero(date.getMonth() + 1) + '-' + this.timeAddZero(date.getDate())
    this.getCompanyInfo()
    this.loadStute()
  }
  timeAddZero(value) {
    if (value < 10) {
      value = '0' + value
    }
    return value
  }
  // 获取部门信息
  getCompanyInfo() {
    getCompany({ size: 10000 }).then((res) => {
      res.result.records.forEach((item) => {
        item.id = item.id + ''
      })
      this.departmentList = res.result.records
    })
  }
  departmentChage() {
    this.groups = []
    this.group = ''
    this.loadStute()
  }
  loadStute() {
    var dDay = new Date()
    var url = '/gps/pdasign/getUserSignList'
    let params = { time: this.time + ' 23:59:59', deptId: '' }
    if (this.department) {
      params.deptId = this.department
    }
    this.hideData()
    this.playClose()
    var view = this.mapView
    //view.graphics.removeMany(this.peopelFea)
    //view.graphics.removeMany(this.features)
    this.features = []
    this.peopelFea = []
    this.workerTable = []
    var state = this.status
    // request({ url: url, method: 'get', params }).then((res) => {
    //   if (res.code == 1) {
    //     res = res.result.pdasignVoList || []
    //     this.total = res.total
    //     var sp = view.spatialReference
    //     var Graphic = view.TF_graphic
    //     var features = []
    //     var rows = []
    //     let groups = []

    //     var extent = {
    //       xmin: Infinity,
    //       xmax: -Infinity,
    //       ymin: Infinity,
    //       ymax: -Infinity,
    //       spatialReference: view.spatialReference
    //     }
    //     for (var i = 0, ii = res.length; i < ii; i++) {
    //       var row = res[i]
    //       groups.push({ id: row.signUser, name: row.signUserName })
    //       if (state && state != row.signType) continue
    //       if (this.group != '' && this.group != row.signUser) continue
    //       if (row.lng && row.lat) {
    //         var feature = new Graphic({
    //           geometry: { type: 'point', x: row.lng, y: row.lat, spatialReference: sp },
    //           symbol: {
    //             url: row.signType == '上班' ? onPointImg : noPointImg,
    //             width: '36px',
    //             height: '36px',
    //             yoffset: '13px',
    //             xoffset: '0px',
    //             type: 'picture-marker'
    //           }
    //         })
    //         var featureT = new Graphic({
    //           geometry: { type: 'point', x: row.lng, y: row.lat, spatialReference: sp },
    //           symbol: {
    //             type: 'text',
    //             color: 'white',
    //             haloColor: 'black',
    //             haloSize: '1px',
    //             text: row.signUserName || '',
    //             yoffset: '-15px',
    //             verticalAlignment: 'bottom',
    //             font: { size: '14px', weight: 'bold' }
    //           }
    //         })
    //         this.peopelFea.push(feature, featureT)
    //         if (row.lng < extent.xmin) extent.xmin = row.lng
    //         if (row.lat < extent.ymin) extent.ymin = row.lat
    //         if (row.lng > extent.xmax) extent.xmax = row.lng
    //         if (row.lat > extent.ymax) extent.ymax = row.lat
    //       }
    //       row.src = ''
    //       rows.push(row)
    //     }
    //     if (this.groups.length == 0) {
    //       groups.unshift({ id: '', name: '全部' })
    //       this.groups = groups
    //     }
    //     view.graphics.addMany(this.peopelFea)
    //     if (extent.xmin != Infinity) {
    //       if (extent.xmin == extent.xmax) {
    //         view.center = { type: 'point', x: extent.xmin, y: extent.ymin, spatialReference: view.spatialReference }
    //         if (view.zoom < 6) view.zoom = 6
    //       } else view.extent = extent
    //     }
    //     var token = this.$store.state.user.token
    //     this.$nextTick((_) =>
    //       rows.map((e, i) => {
    //         request({ url: '/base/user/' + e.signUser, method: 'get' }).then((res) => {
    //           e.src = IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + res.result.avatar
    //           if (i == rows.length - 1) {
    //             this.workerTable = rows
    //           }
    //         })
    //       })
    //     )
    //   } else this.$message.error(res.message)
    // })
  }
  showDable(index, w) {
    var table = this.$refs.table
    var run = this.$refs.run
    if (this.showLi[0] == index && this.showLi[1] == w) {
      this.$refs['li' + this.showLi[0]][0].style.height = '0'
      //@ts-ignore
      table.style.display = run.style.display = 'none'
      this.showLi = [undefined, undefined]
      return false
    }
    if (this.showLi[0] == undefined && this.showLi[1] == undefined) {
      var inLi = this.$refs['li' + index][0]
      inLi.style.height = '400px'
      inLi.appendChild([run, table, table][w])
      //@ts-ignore
      ;[run, table, table][w].style.display = ''
      this.showLi = [index, w]
      return true
    }
    if (this.showLi[0] == index && this.showLi[1] != w) {
      var inLi = this.$refs['li' + index][0]
        //@ts-ignore
      ;[run, table][1 - (w > 0 ? 1 : 0)].style.display = 'none'
      inLi.appendChild([run, table, table][w])
      //@ts-ignore
      ;[run, table, table][w].style.display = ''
      this.showLi = [index, w]
      return true
    }
    if (this.showLi[0] != index && this.showLi[1] != w) {
      this.$refs['li' + this.showLi[0]][0].style.height = '0'
      //@ts-ignore
      ;[run, table, table][this.showLi[1]].style.display = 'none'
      var inLi = this.$refs['li' + index][0]
      inLi.style.height = '400px'
      inLi.appendChild([run, table, table][w])
      //@ts-ignore
      ;[run, table, table][w].style.display = ''
      this.showLi = [index, w]
      return true
    }
    if (this.showLi[0] != index && this.showLi[1] == w) {
      this.$refs['li' + this.showLi[0]][0].style.height = '0'
      var inLi = this.$refs['li' + index][0]
        //@ts-ignore
      ;[run, table, table][this.showLi[1]].style.display = 'none'
      inLi.style.height = '400px'
      inLi.appendChild([run, table, table][w])
      //@ts-ignore
      ;[run, table, table][w].style.display = ''
      this.showLi = [index, w]
      return true
    }
  }
  showWay(index) {
    this.playClose()
    if (!this.showDable(index, 0)) return
    var use = this.workerTable[index]
    var startDate = this.time + ' 00:00:00'
    var endDate = this.time + ' 23:59:59'
    var url = '/gps/gps/getSection?userId=' + use.signUser + '&startDate=' + startDate + '&endDate=' + endDate
    request({ url: url, method: 'get' }).then((res: any) => {
      this.runLoading = false
      if (res.code == 1) {
        res = res.result
        this.logTable = res.map((e) => {
          e = e.split('段:')[1].split(' - ')
          return { useId: use.signUser, timeFrom: e[0], timeTo: e[1] }
        })
      } else this.$message.error(res.message)
    })
    this.runLoading = true
  }
  showLog(index) {
    this.playClose()
    this.index = index
    if (!this.showDable(index, 1)) return
    this.tableType = 'log'
    this.$nextTick(this.loadRoad)
  }
  showDone(index) {
    this.playClose()
    this.index = index
    if (!this.showDable(index, 2)) return
    this.tableType = 'info'
    this.$nextTick(this.loadRoad)
  }
  loadRoad(isChangePage?) {
    var use = this.workerTable[this.index]
    if (!use) return
    this.runLoading = true
    var pages = this.$refs.paginationTable as ElPagination
    var url =
      (this.tableType == 'log'
        ? '/gps/gps/page?startDate=' + this.time + ' 00:00:00' + '&endDate=' + this.time + ' 23:59:59&userId='
        : '/gps/plan/page?planBegindate=' +
          this.time +
          ' 00:00:00' +
          '&deptId=' +
          this.$store.state.user.departmentId +
          '&inspectUsers=') +
      use.signUser +
      '&current=' +
      (isChangePage ? pages.currentPage : (pages.currentPage = 1)) +
      '&size=' +
      pages.pageSize
    request({ url: url, method: 'get' }).then((res: any) => {
      this.runLoading = false
      if (res.code == 1) {
        res = res.result
        this.totalTable = res.total
        //@ts-ignore
        this.$refs.pageTableLength.innerHTML = pages.currentPage + '/' + Math.ceil(res.total / pages.pageSize) + '页'
        if (this.tableType == 'log') {
          this.dataT = res.records
        } else {
          let dataList = []
          res.records.forEach((item, index) => {
            let itemOne = {
              id: 'one' + index,
              type: item.inspectType,
              state: item.planState,
              children: []
            }
            item.planTypeOverList.forEach((item2, index2) => {
              itemOne.children.push({
                id: 'two' + index + '' + index2,
                type: item2.typeName,
                state: item2.percent ? item2.percent + '%' : '0%'
              })
            })
            dataList.push(itemOne)
          })
          this.dataT = dataList
        }
      } else this.$message.error(res.message)
    })
  }
  playMove(item) {
    var view = this.mapView
    // mapdiv = view.container
    var url =
      '/gps/gps/getAll?userId=' + item.useId + '&startDate=' + item.timeFrom + '&endDate=' + item.timeTo + '&isAsc=true'
    var timeTable = []
    request({ url: url, method: 'get' }).then((res: any) => {
      if (res.code == 1) {
        res = res.result
        timeTable = res.map((e) => {
          return {
            x: e.locationLongitude,
            y: e.locationLatitude,
            t: e.checkTime
          }
        })
        if (timeTable.length > 0) run()
      } else this.$message.error(res.message)
    })
    var run = () => {
      this.$store.dispatch('map/changeMethod', {
        pathId: 'roadPlayer',
        widgetid: 'FloatPanel',
        label: '浮动框',
        param: { view: this.mapView, times: timeTable }
      })
      // if (this.mapView.TF_roadPlayer) this.mapView.TF_roadPlayer.reload(timeTable)
      // this.$nextTick(() => {
      //   this.mapView.graphics.removeMany(this.features)
      //   this.mapView.graphics.addMany(this.features)
      // })
    }
  }
  hideData() {
    var table = this.$refs.table
    var run = this.$refs.run
    if (table && run) {
      //@ts-ignore
      table.style.display = run.style.display = 'none'
    }
    if (this.showLi && this.showLi[0] != undefined) {
      this.$refs['li' + this.showLi[0]][0].style.height = '0'
    }
    this.showLi = [undefined, undefined]
  }
  playClose() {
    // if (this.mapView.TF_roadPlayer) {
    //   this.mapView.TF_roadPlayer.close()
    // }
  }
  jump(row, dia) {
    // if ((row.lgtd || row.lng) && (row.lttd || row.lat)) {
    //   var view = dia ? this.mapView1 : this.mapView
    //   view.center = {
    //     type: 'point',
    //     x: row.lgtd || row.lng,
    //     y: row.lttd || row.lat,
    //     spatialReference: view.spatialReference
    //   }
    //   view.zoom = dia ? 4 : 6
    // } else {
    //   this.$message.info('暂未上传坐标信息！')
    // }
  }
  showMissionInfo(row) {
    //@ts-ignore
    this.$refs.mission.showMissionInfo(row.id)
  }
  destroyed() {
    // if (this.mapView.TF_roadPlayer) {
    //   this.mapView.TF_roadPlayer.close()
    // }
    // this.mapView.graphics.removeMany(this.peopelFea)
    // this.mapView.graphics.removeMany(this.features)
  }
}
</script>
<style lang="scss" scoped>
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
