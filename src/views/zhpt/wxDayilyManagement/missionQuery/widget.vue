<template>
  <div class='queryPageInfo' style="width: 100%; height: 100%; padding:8px;">
    <div class='mapDiv' style="width: 100%; height: 60%;">
      <mapDiv @showPageInfo='showPageInfo'></mapDiv>
    </div>
    <div v-loading="loading" style="width: 100%; height: 40%;padding-top:5px">
    <!-- 查询条件 操作 -->
      <el-row>
        <span class="title2" style="margin-left:2px;">处理部门</span>
        <el-select @change="getUserList" v-model="deptId" style="display: inline-block; margin-left: 5px; width:100px;" size="small" placeholder="处理部门">
          <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="title2" style="margin-left:2px;">处理人员</span>
        <el-select v-model="userId" clearable="" style="display: inline-block; margin-left: 5px; width:100px;" size="small" placeholder="处理人员" >
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
        </el-select>
        <span class="title2" style="margin-left:2px;">工单编号</span>
        <el-input v-model="chooseMissionId" style="display: inline-block; margin-left: 5px; width:100px;" size="small" placeholder="工单编号" clearable />
        <span class="title2" style="margin-left:2px;">工单来源</span>
        <el-select v-model="chooseMissionFrom" style="display: inline-block; margin-left: 5px; width:100px;" size="small" placeholder="工单来源" clearable>
          <el-option label="计划工单" value="0" />
          <el-option label="自建工单" value="1" />
          <el-option label="热线工单" value="2" />
        </el-select>
        <span class="title2" style="margin-left:2px;">维修类型</span>
        <el-select v-model="chooseFixType" style="display: inline-block; margin-left: 5px; width:120px;" size="small" placeholder="维修类型" clearable>
          <el-option v-for="item in fixTyps" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="title2" style="margin-left:2px;">处理状态</span>
        <el-select v-model="chooseWorkStatus" style="display: inline-block; margin-left: 5px; width:100px;" size="small" placeholder="处理状态" clearable>
          <el-option label="未派工" value="0" />
          <el-option label="未审核" value="1" />
          <el-option label="未开始" value="2" />
          <el-option label="正在执行" value="3" />
          <el-option label="处理完成" value="4" />
          <el-option label="已开始未执行" value="5" />
          <el-option label="驳回" value="6" />
          <el-option label="转移申请" value="7" />
          <el-option label="已转移" value="8" />
        </el-select>
        <span class="title2" style="margin-left:2px;">处理时间</span>
        <el-date-picker v-model="startTime" size="small" style="display: inline-block; margin-left: 5px; width:140px;" type="date" placeholder="开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd" /> ~
        <el-date-picker v-model="endTime" size="small" style="display: inline-block; margin-left: 5px; width:140px;" type="date" placeholder="结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd" />
        <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
          <el-date-picker v-model="checkTime" type="daterange" size="small" style="width: 100%;" value-format="yyyy-MM-dd"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"/>
        </div> -->
        <el-button size="small" type="primary" @click="query">查询</el-button>
      </el-row>
      <!-- 工单表格 -->
      <el-table ref="table1" class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" height="calc(100% - 80px)" stripe @row-dblclick="showMissionInfo" @sort-change="rowChange">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="orderCode" label="工单编号" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="orderSource" label="工单来源" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">{{ scope.row.orderSource + '工单' }}</template>
        </el-table-column>
        <el-table-column label="维修类型" sortable="custom">
          <template slot-scope="scope">{{ scope.row.typeName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="percent" label="维修数量" sortable>
          <template slot-scope="scope">{{ 
            (scope.row.overNum || '0') + ' / ' + (scope.row.num || '0') + ' ' + fixTypeIndex[scope.row.typeId || ''] + ' (' + (scope.row.percent || '0') + '%)' 
          }}</template>
        </el-table-column>
        <el-table-column label="处理开始时间" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">{{ scope.row.startTime || '-' }}</template>
        </el-table-column>
        <el-table-column label="处理结束时间" show-overflow-tooltip sortable="custom">
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
        <el-table-column prop="state" label="处理状态" sortable="custom" />
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showMissionInfo(scope.row)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 工单分页 -->
      <el-row style="margin-top: 8px">
        <el-pagination
          ref="pagination"
          small
          background
          layout="total, sizes, prev, next,pager,jumper"
          :page-sizes="[10,20,30,50,100,1000]"
          :total="total"
          :page-size='30'
          style="display: inline-block;"
          @current-change="loadMission"
          @size-change="loadMission"
        />
        <!-- <span ref="pageLength" style="font-size: 13px;" class="el-pagination__total">0/0 页</span> -->
      </el-row>
      <!-- 工单详情弹窗 -->
      <!-- <tf-mission></tf-mission> -->
      <el-dialog v-dialogDrag title="工单详细" :visible.sync="pageInfoShow" width="1200px" top="calc(50vh - 436px)" @close="pageInfoShow=false">
        <wx-work-order-info v-if="pageInfoShow" :prop-data="propData" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/TableLegend'
import tfMission from '@/views/zhpt/common/MissionInfo'
import request from '@/utils/request'
import mapDiv from './map.vue'
import wxWorkOrderInfo from '@/views/zhpt/wxDayilyManagement/wxWorkOrderInfo/widget'
import {  getCompany,getUserList } from '@/api/base'
export default {
  name: 'WxMissionQuery',
  components: {mapDiv,tfLegend, tfMission, wxWorkOrderInfo },
  props: { data: Object },
  data() {
    return {
      deptId:'',
      userId:'',
      deptList:[],
      userList:[],
      propData: null,
      pageInfoShow: false,
      checkTime: ['', ''],
      chooseFixType: '',
      chooseMissionId: '',
      chooseWorkStatus: '',
      chooseMissionFrom: '',
      fixTypeIndex: { '': '' },
      fixTyps: [],
      checks: [],
      dataT1: [],
      total: 0,
      loading: true,
      startTime: '',
      endTime: '',
      startOptions: {
        disabledDate: time => {
          if (this.endTime) {
            return time.getTime() >= new Date(this.endTime)
          }
        }
      },
      endOptions: {
        disabledDate: time => {
          if (this.startTime) {
            return new Date(this.startTime) - 1000 * 60 * 60 * 24 > time.getTime()
          }
        }
      }
    }
  },
  mounted() { this.getCompanyInfo();this.deptId=this.$store.state.user.departmentI;this.getUserList();this.init(); },
  methods: {
    async init() {
      request({ url: '/gps/repairtype/page?size=1000', method: 'get' }).then(res => {
        if (res.code == 1) {
          var index = this.fixTypeIndex
          // this.fixTyps = res.result.records
          this.fixTyps = res.result.records.map(e => (index[e.id] = e.unit, e))
        } else this.$message(res.message)
      })

      var getOtherPartment = () => {
        request({ url: '/base/user/getUserByDepts?depts=' + this.user.depId, method: 'get' }).then(res => {
          if (res.code == 1) {
            if (!res.result.length) return
            this.checks = res.result[0].users
          } else this.$message(res.message)
        })
      }
      request({ url: '/base/user/getInfo', method: 'get' }).then(res => {
        if (res.code == 1) {
          res = res.result
          this.user = { id: res.id, name: res.realName, depId: res.departmentId }
          getOtherPartment()
          this.loadMission()
        } else this.$message(res.message)
      })
      this.order = ['', '']
    },
    query() {
      this.$refs.pagination.internalCurrentPage = 1
      this.loadMission()
    },
    loadMission() {
      this.loading = true
      var times = this.checkTime || ['', '']
      if (times[0]) times = [times[0] + ' 00:00:00', times[1] + ' 23:59:59']
      var pages = this.$refs.pagination
      var url = '/gps/repairorder/page?' +
      '&executorDeptId=' + (this.deptId||'') +
      '&executorId=' + (this.userId||'') +   
      '&current=' + pages.internalCurrentPage +
      '&size=' + pages.internalPageSize +
      // '&createUser=' + (this.user.id || '') +
      '&orders[0].asc=' + this.order[0] +
      '&orders[0].column=' + this.order[1] +
      '&orderCode=' + (this.chooseMissionId || '') +
      '&orderSource=' + (this.chooseMissionFrom || '') +
      '&typeId=' + (this.chooseFixType || '') +
      '&state=' + (this.chooseWorkStatus || '') +
      '&startTime=' + (this.startTime ? this.startTime + ' 00:00:00' : '') +
      '&endTime=' + (this.endTime ? this.endTime + ' 23:59:59' : '')
      request({ url: url, method: 'get' }).then(res => {
        if (res.code == 1) {
          res = res.result
          this.total = res.total
          //this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize) + '页'
          this.dataT1 = res.records
        } else this.$message.error(res.message)
        this.loading = false
      })
    },
    rowChange(column) {
      this.order = [{ 'ascending': 'true', 'descending': 'false', 'null': '' }[column.order], column.order == null ? '' : column.prop]
      this.loadMission()
    },
    showMissionInfo(row) {
      this.propData = row
      this.pageInfoShow = true

      // this.loadMissionInfo(row.id)
    },

    /**
     * 根据地图点击展示工单详情
    */
    showPageInfo(data){
      this.showMissionInfo({id:data})
    },

    // 获取部门信息
    getCompanyInfo() {
      getCompany({ size: 10000 }).then(res => {
        res.result.records.forEach(item => {
          item.id = item.id + ''
        })
        this.deptList = res.result.records;
      })
    },
     // 获取人员列表数据
    getUserList() {
      const data={
        size:1000,
        current:1,
        departmentId:this.deptId
      }
      getUserList(data).then(res => {
        this.userList = res.result.records
      })
    },
  }
}
</script>
<style scoped>
.el-table >>> .el-table__header-wrapper table th{
  /* height: 60px; */
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
