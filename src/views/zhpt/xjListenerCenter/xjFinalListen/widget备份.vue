<template>
  <div style="width: 100%; height: 100%; padding:8px;" v-loading="loading">
    <el-row>
      <span class="title2" style="display:inline-block;width:50px;padding-left:8px;">部门：</span>
      <el-select @change="Bmchange" v-model="group" style="display: inline-block; width:130px;" size="small" placeholder="请选择">
        <el-option v-for="item of groups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">人员：</span>
      <el-select v-model="worker" style="display: inline-block; margin-left: 5px; width:130px;" size="small" placeholder="请选择人员" clearable>
        <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id">
        </el-option>
      </el-select>
      <span class="title2" style="margin-left:8px;">时间：</span>
      <!-- <div style="display:inline-block;width:300px">
        <el-date-picker v-model="times" style="width:100%" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="yyyy-MM-dd"></el-date-picker>
      </div> -->
      <el-date-picker v-model="startTime" style="width:150px" type="date" size="small" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd" /> ~
      <el-date-picker v-model="endTime" style="width:150px" type="date" size="small" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd" />
      <el-button size="small" type="primary" @click="getData">查询</el-button>
      <el-checkbox border size="small" v-model="typeSelect1" @change="changeType1" style="margin: 0">
        <img src="./images/all.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>全部（{{ allWorkerState.all || 0}}）</span>
      </el-checkbox>
      <el-checkbox border size="small" v-model="typeSelect2" @change="changeType2" style="margin: 0">
        <img src="./images/in.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>上班（{{ allWorkerState.onwork || 0}}）</span>
      </el-checkbox>
      <el-checkbox border size="small" v-model="typeSelect3" @change="changeType3" style="margin: 0">
        <img src="./images/out.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>下班（{{ allWorkerState.outwork || 0}}）</span>
      </el-checkbox>
      <el-checkbox border size="small" v-model="typeSelect4" style="margin: 0">
        <img src="./images/gps.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>GPS定位（{{ allWorkerState.gps || 0}}）</span>
      </el-checkbox>
      <el-checkbox border size="small" v-model="typeSelect5" style="margin: 0">
        <img src="./images/wifi.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>WIFI定位（{{ allWorkerState.wifi || 0}}）</span>
      </el-checkbox>
      <el-checkbox border size="small" v-model="typeSelect6" style="margin: 0">
        <img src="./images/base.png" width="15px" height="15px" style="vertical-align:middle;">
        <span>基站定位（{{ allWorkerState.side || 0}}）</span>
      </el-checkbox>
    </el-row>
    <el-table class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" ref="table2" height="calc(100% - 82px)" stripe>
      <el-table-column prop="userName" label="人员" />
      <el-table-column prop="workState" label="状态" show-overflow-tooltip>
        <template slot-scope="props">{{ [,'上班', '上班', '下班', '上班'][props.row.workState] }}</template><!-- [,'上班', '工作中', '下班', '异常'] -->
      </el-table-column>
      <el-table-column prop="uploadTime" label="时间" />
      <el-table-column prop="electricity" label="电量">
        <template slot-scope="props">{{ props.row.electricity + '%' }}</template>
      </el-table-column>
      <el-table-column prop="residualSpace" label="剩余空间(MB)" />
      <el-table-column prop="pdaid" label="型号">
        <template slot-scope="props">{{ props.row.equipmentModel || '-' }}</template>
      </el-table-column>
      <el-table-column prop="pdaid" label="定位类型">
        <template slot-scope="props">{{netWorkName[props.row.network]|| '-' }}</template>
      </el-table-column>
      <el-table-column prop="gpsPrecision" label="精度">
        <template slot-scope="props">{{ props.row.gpsPrecision ? props.row.gpsPrecision + 'm' : '-' }}</template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px">
      <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :total="total" @current-change="getData" @size-change="getData" style="display: inline-block;" />
      <!-- <span ref='pageLength' style="font-size: 13px;" class="el-pagination__total">0/0 页</span> -->
    </el-row>
  </div>
</template>

<script lang="ts">
/**
 * @description 该功能为管网巡检子系统，监控中心模块的终端监控功能
 * @author 梁罗、李顺 <876330731@qq.com>
 */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import request from '@/utils/request'
import { getDepartment, getDeptUserList } from '@/api/work'
import { ElPagination } from 'element-ui/types/pagination'
@Component({
  name: 'wxCheck',
  components: {}
})
export default class XjFinalListen extends Vue {
  @Prop() data: object
  worker = ''
  workers = []
  allWorkerState = {}
  total = 0
  times = ['', '']
  userList = []
  dataT1 = []
  group = 0
  groups = []
  typeSelect = []
  groupIndex = {}
  loading = false
  typeSelect1 = true
  typeSelect2 = true
  typeSelect3 = true
  typeSelect4 = false
  typeSelect5 = false
  typeSelect6 = false
  startTime = ''
  endTime = ''
  netWorkName={
    '1': 'GPS',
    '2': 'Wifi',
    '3': '基站定位'
  };
  startOptions = {
    disabledDate: (time) => {
      if (this.endTime) {
        return time.getTime() >= new Date(this.endTime)
      }
    }
  }
  endOptions = {
    disabledDate: (time) => {
      if (this.startTime) {
        return new Date(this.startTime).getMilliseconds() - 1000 * 60 * 60 * 24 > time.getTime()
      }
    }
  }
  @Watch('typeSelect4')
  typeSelect4Change() {
    this.getData()
  }
  @Watch('typeSelect5')
  typeSelect5Change() {
    this.getData()
  }
  @Watch('typeSelect6')
  typeSelect6Change() {
    this.getData()
  }
  mounted() {
    this.getData()
    window.requestAnimationFrame((_) => this.getData())
  }
  created() {
    this.group = parseInt(this.$store.state.user.departmentId)
    getDepartment({}).then((res) => {
      if (res.code === 1) {
        this.groups = res.result
        this.Bmchange()
      }
    })
    let currentday = this.getCurrentDate()
    ;[this.startTime, this.endTime] = [currentday.startTime, currentday.endTime]
  }
  Bmchange() {
    getDeptUserList({ deptId: this.group }).then((res) => {
      if (res.code === 1) {
        this.worker = ''
        this.userList = res.result
      }
    })
  }
  //获取当天
  getCurrentDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) {
      //@ts-ignore
      month = '0' + month as string
    }
    let day = date.getDate()
    if (day < 10) {
      //@ts-ignore
      day = '0' + day
    }
    let currentDay = year + '-' + month + '-' + day
    return {
      startTime: currentDay + '',
      endTime: currentDay + ''
    }
  }
  getData() {
    // if(this.loading) return
    // this.loading = true
    // debugger
    // if(!this.worker){
    //   this.$message.info("请选择人员")
    // }
    var pages = this.$refs.pagination as ElPagination
    var man = []
    if (this.typeSelect2) man.push(1, 2)
    if (this.typeSelect3) man.push(3)
    var net = []
    if (this.typeSelect4) net.push(1)
    if (this.typeSelect5) net.push(2)
    if (this.typeSelect6) net.push(3)
    // if(net.length == 0) net.push(...[2,4,8,9])

    // var times = this.times || ['', ''];
    // times = [times[0] ? times[0] + ' 00:00:00' : '', times[1] ? times[1] + ' 23:59:00' : '']'

    const data={
      current:pages.currentPage,
      size:pages.pageSize,
      deptId:this.group,
      userId:this.worker,
      startDate:  (this.startTime ? this.startTime + ' 00:00:00' : ''),
      endDate:(this.endTime ? this.endTime + ' 23:59:59' : ''),
      workState:(man.length > 0 ? man.join(',') : '999'),
      network:net.join(','),
      networkState:(this.typeSelect5 ? 1 : 0)
    }
    var url =
      '/gps/pda/terminalMonitoringQuery'
      // +'?&current=' +
    //   pages.currentPage +
    //   '&size=' +
    //   pages.pageSize +
    //   // '&groupId=' + this.group +
    //   '&deptId=' +
    //   this.group +
    //   '&userId=' +
    //   this.worker +
    //   '&startDate=' +
    //   (this.startTime ? this.startTime + ' 00:00:00' : '') +
    //   '&endDate=' +
    //   (this.endTime ? this.endTime + ' 23:59:59' : '') +
    //   '&workState=' +
    //   (man.length > 0 ? man.join(',') : '999') +
    //   '&network=' +
    //   net.join(',')
    // '&networkState=' + (this.typeSelect5 ? 1 : 0)
    request({ url: url, method: 'get',params:data }).then(res => {
      if(res.code == 1) {
        this.dealWithTotal(res.result.map)
        res = res.result.pagePdaInfo
        this.dataT1 = res.records
        this.total = res.total
        //this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
      } else this.$message(res.message)
      this.loading = false
    })
  }
  /**
   * 处理统计信息
   */
  dealWithTotal(res) {
    var [onwork, outwork, gps, wifi, side] = [0, 0, 0, 0, 0]
    var map = res
    if (map.hasOwnProperty('上班')) onwork += map['上班']
    if (map.hasOwnProperty('工作中')) onwork += map['工作中']
    if (map.hasOwnProperty('下班')) outwork += map['下班']
    if (map.hasOwnProperty('离线')) onwork += map['离线']
    if (map.hasOwnProperty('GPS')) gps += map['GPS']
    if (map.hasOwnProperty('Wifi')) wifi += map['Wifi']
    if (map.hasOwnProperty('基站定位')) side += map['基站定位']
    var all = onwork + outwork
    this.allWorkerState = { all, onwork, outwork, gps, wifi, side }
  }
  changeType1(n, o) {
    this.typeSelect2 = this.typeSelect3 = n
    this.getData()
  }
  changeType2(n, o) {
    if (n == this.typeSelect3) {
      this.typeSelect1 = n
    } else {
      this.typeSelect1 = false
    }
    this.getData()
  }
  changeType3(n, o) {
    if (n == this.typeSelect2) {
      this.typeSelect1 = n
    } else {
      this.typeSelect1 = false
    }
    this.getData()
  }
}
</script>
<style scoped>
.el-table >>> .el-table__header-wrapper table th {
  /* height: 60px; */
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td {
  text-align: center;
}
</style>
