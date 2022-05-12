<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row v-if="!searchData">
      <span class="title2">关键字：</span>
      <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-input v-model="orderNumber" size="small" style="width: 100%;" placeholder="请输入工单编号、维修内容、处理地址" clearable />
      </div>

      <span class="title2">保养类型：</span>
      <el-select v-model="guaranteeProperty_select.value" size="small" style="display: inline-block; width:200px;" placeholder="请选择" filterable clearable multiple collapse-tags @change="getList">
        <el-option v-for="item in guaranteeProperty_select.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <span class="title2">时间：</span>
      <el-date-picker v-model="startTime" size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd" @change="getList" /> ~
      <el-date-picker v-model="endTime" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd" @change="getList" />

      <!-- <span class="title2">地址：</span>
      <div style="display: inline-block; margin-left: 5px; width:350px;">
        <el-input size="small" v-model="address" placeholder="请输入地址" clearable></el-input>
      </div> -->
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="exportList">导出</el-button>
      <!-- <export-btn table-id="repairRecordTable" :file="title"></export-btn> -->
    </el-row>
    <div v-loading="mainLoading" style="width:100%;height:calc(100% - 46px);margin-top:8px;">
      <h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{ title }}</h3>
      <el-table id="repairRecordTable" class="mapTable" :data="tableData" border stripe height="calc(100% - 80px)" @row-dblclick="showMissionInfo">
        <!-- <el-table-column :formatter="formatter"  type="index" width="50" label="序号" /> -->
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column :formatter="formatter" type="index" width="50" align="center" label="序号" />
        <el-table-column :formatter="formatter" prop="orderCode" width="180" :show-overflow-tooltip="true" label="工单编号" align="center" />
        <!-- <el-table-column :formatter="formatter"  prop="orderSourceName" :show-overflow-tooltip='true' label="工单来源" align="center">
        </el-table-column> -->
        <el-table-column :formatter="formatter" prop="typeName" :show-overflow-tooltip="true" label="保养类型" align="center" />
        <el-table-column :formatter="formatter" prop="notes" :show-overflow-tooltip="true" label="备注" header-align="center" align="left" />
        <el-table-column :formatter="formatter" prop="dispatchingName" :show-overflow-tooltip="true" label="派单职员" align="center" />
        <el-table-column :formatter="formatter" prop="dispatchingTime" width="180" :show-overflow-tooltip="true" label="派单时间" align="center" />
        <el-table-column :formatter="formatter" prop="regionName" :show-overflow-tooltip="true" label="片区名称" align="center" />

        <el-table-column :formatter="formatter" prop="facilitiesType" :show-overflow-tooltip="true" label="设施类型" align="center" />
        <el-table-column :formatter="formatter" prop="facilitiesCode" :show-overflow-tooltip="true" label="设施编号" align="center" />
        <el-table-column :formatter="formatter" prop="facilitiesCaliber" :show-overflow-tooltip="true" label="设施口径" align="center" />

        <el-table-column :formatter="formatter" prop="disposeUserName" :show-overflow-tooltip="true" label="处理职员" header-align="center" align="left" />
        <el-table-column :formatter="formatter" prop="disposeTime" width="180" :show-overflow-tooltip="true" label="处理时间" header-align="center" align="left" />
        <el-table-column :formatter="formatter" prop="disposeAddress" :show-overflow-tooltip="true" label="处理地址" header-align="center" align="left" />

        <!-- <el-table-column :formatter="formatter"  prop="mfNode" :show-overflow-tooltip='true' label="保养内容情况" header-align="center" align="left">
        </el-table-column>

        <el-table-column :formatter="formatter"  prop="excelISPJ" :show-overflow-tooltip='true' label="设施是否能启闭" align="center">
        </el-table-column>
        <el-table-column :formatter="formatter"  prop="pjconten" :show-overflow-tooltip='true' label="设施维护保养效果" header-align="center" align="left">
        </el-table-column> -->

        <el-table-column :formatter="formatter" label="操作" width="100" align="center">
          <template slot-scope="data">
            <el-button type="text" size="small" @click="showMissionInfo(data.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :current-page="currentPage"
          layout="total, sizes, prev, next,pager"
          :page-sizes="[10,20,30,50,100,1000]"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <tf-mission />
    <el-dialog v-dialogDrag title="工单详细" :visible.sync="pageInfoShow" width="1200px" top="calc(50vh - 436px)" @close="pageInfoShow=false">
      <wx-work-order-info v-if="pageInfoShow" :prop-data="propData" />
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import tfLegend from '@/views/zhpt/common/TableLegend'
import tfMission from '@/views/zhpt/common/MissionInfo'
import ExportBtn from '../components/ExportBtn'
import wxWorkOrderInfo from '@/views/zhpt/wxDayilyManagement/wxWorkOrderInfo/widget'
import { getMaintenanceMaintain, exportMaintenanceMaintain, repairTypeStatistic } from '../api/reportFormApis.js'
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'WxWeiXiuBaoYangTaiZhang',
  components: { tfLegend, ExportBtn, tfMission, wxWorkOrderInfo },
  props: {
    searchData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 保修性质筛选信息
      guaranteeProperty_select: {
        options: [],
        value: ''
      },
      input: '',
      // 日期筛选信息
      date_select: {
        value: ''
      },
      tableData: [],
      currentPage: 1,
      pageInfoShow: false,
      propData: null,
      pageSize: 30,
      total: 0,
      orderNumber: '',
      address: '',
      title: '维修记录台账数据表',
      mainLoading: false,
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
  mounted() {
    request({ url: '/gps/repairtype/page?size=1000', method: 'get' }).then(res => {
      if (res.code == 1) {
        this.guaranteeProperty_select.options = res.result.records.map((e) => { return { value: e.id, label: e.name } })
      } else this.$message(res.message)
    })
    var date = new Date()
    var year = date.getFullYear()
    var lastyear = year
    var month = date.getMonth() + 1
    // var lastmonth = month - 3
    var day = date.getDate()
    if (month < 10) month = '0' + month
    // if(lastmonth < 1) lastmonth += 12, year-=1
    // if(lastmonth < 10) lastmonth = '0' + lastmonth
    if (day < 10) day = '0' + day
    this.startTime = year + '-' + month + '-' + '01'
    this.endTime = year + '-' + month + '-' + day
    this.date_select.value = [this.startTime, this.endTime]
    this.$nextTick(e => {
      this.getList()
    })
  },
  methods: {
    /**
     * 渲染数据处理
    */
    formatter(row, column) {
      const typeValue = typeof row[column.property]
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
    },

    exportList() {
      if (!this.startTime || !this.endTime) return this.$message.error('请选择统计时间')
      let data = [
        'current=' + this.currentPage,
        'size=' + this.pageSize,
        'startDate=' + this.startTime + ' 00:00:00',
        'endDate=' + this.endTime + ' 23:59:59',
        'likeSel=' + this.orderNumber,
        'typeId=' + this.guaranteeProperty_select.value,
        'deptId=' + this.$store.state.user.departmentId,
        'exportFlag=' + 1,
        'orders[0].asc=' + 'true',
        'orders[0].column=' + 'dispatchingTime'
      ]
      this.date_select.value = [this.startTime, this.endTime]
      if (this.searchData) {
        switch (this.searchData.timeType) {
          case '1':
            this.searchData.startTime = this.searchData.startTime + ' 00:00:00'
            this.searchData.endTime = this.searchData.endTime + ' 23:59:59'
            break
          case '2':
            this.searchData.startTime = this.searchData.startTime + '-01 00:00:00'
            let endMonth = parseInt(this.searchData.endTime.split('-')[1]) + 1
            const endYear = this.searchData.endTime.split('-')[0]
            endMonth = endMonth < 10 ? ('0' + endMonth) : endMonth
            this.searchData.endTime = endYear + '-' + endMonth + '-01 00:00:00'
            break
          case '3':
            this.searchData.endTime = ~~this.searchData.startTime + 1 + '-01-01 00:00:00'
            this.searchData.startTime = this.searchData.startTime + '-01-01 00:00:00'
            break
        }
        data = [
          'current=' + this.currentPage,
          'size=' + this.pageSize,
          'startDate=' + this.searchData.startTime,
          'endDate=' + this.searchData.endTime,
          'typeId=' + ((this.searchData.typeId + '' != 'undefined') ? this.searchData.typeId : ''),
          'startBore=' + this.searchData.startBore,
          'endBore=' + this.searchData.endBore,
          'deptId=' + this.$store.state.user.departmentId,
          'exportFlag=' + 1,
          'orders[0].asc=' + 'true',
          'orders[0].column=' + 'dispatchingTime'
        ]
      }
      exportMaintenanceMaintain(data).then(res => {
        var reader = new FileReader()
        reader.readAsDataURL(res)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = '维护保养记录台账信息表（' + this.date_select.value.map(e =>
            e.split(' ')[0].split('-')).map(e =>
            e[0] + '年' + e[1] + '月' + e[2] + '日').join('~') + '）.xls'
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    },
    // 获取维修记录列表数据
    getList() {
      if (!this.startTime || !this.endTime) return this.$message.error('请选择统计时间')
      this.mainLoading = true
      let data = [
        'current=' + this.currentPage,
        'size=' + this.pageSize,
        'startDate=' + this.startTime + ' 00:00:00',
        'endDate=' + this.endTime + ' 23:59:59',
        'likeSel=' + this.orderNumber,
        'typeId=' + this.guaranteeProperty_select.value,
        'deptId=' + this.$store.state.user.departmentId
      ]
      this.date_select.value = [this.startTime, this.endTime]
      if (this.searchData) {
        switch (this.searchData.timeType) {
          case '1':
            this.searchData.startTime = this.searchData.startTime + ' 00:00:00'
            this.searchData.endTime = this.searchData.endTime + ' 23:59:59'
            break
          case '2':
            this.searchData.startTime = this.searchData.startTime + '-01 00:00:00'
            let endMonth = parseInt(this.searchData.endTime.split('-')[1]) + 1
            const endYear = this.searchData.endTime.split('-')[0]
            endMonth = endMonth < 10 ? ('0' + endMonth) : endMonth
            this.searchData.endTime = endYear + '-' + endMonth + '-01 00:00:00'
            break
          case '3':
            this.searchData.endTime = ~~this.searchData.startTime + 1 + '-01-01 00:00:00'
            this.searchData.startTime = this.searchData.startTime + '-01-01 00:00:00'
            break
			  }
        data = [
          'current=' + this.currentPage,
          'size=' + this.pageSize,
          'startDate=' + this.searchData.startTime,
          'endDate=' + this.searchData.endTime,
          'typeId=' + ((this.searchData.typeId + '' != 'undefined') ? this.searchData.typeId : ''),
          'startBore=' + this.searchData.startBore,
          'endBore=' + this.searchData.endBore,
          'deptId=' + this.$store.state.user.departmentId
        ]
        this.date_select.value = [this.searchData.startTime, this.searchData.endTime]
      }
      getMaintenanceMaintain(data).then(res => {
        res = res.result
        this.tableData = res.records
        this.total = res.total
        this.title = '维护保养记录台账信息表（' + this.date_select.value.map(e =>
          e.split(' ')[0].split('-')).map(e =>
          e[0] + '年' + e[1] + '月' + e[2] + '日').join('~') + '）'
        this.mainLoading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    showMissionInfo(row) {
      row.id = row.orderId
      this.propData = row
      this.pageInfoShow = true
      // this.loadMissionInfo(row.orderId)
    }
  }
}
</script>

<style lang='scss' scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 60px;
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
