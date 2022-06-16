<template>
  <div id="hiddendangerSearch" class="hiddendangerSearch">
    <el-row>
      <span class="title2">名称</span>
      <el-input size="small" style="display: inline-block; margin-left: 5px; width:200px;" placeholder="请输入管线名称" v-model="problems.pipeName" />
      <span class="title2">上报时间</span>
      <el-date-picker v-model="problems.startTime" style="width:140px;" size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd" /> ~
      <el-date-picker v-model="problems.endTime" style="width:140px;" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd" />
      <span class="title2">地址</span>
      <el-input size="small" style="display: inline-block; margin-left: 5px; width:200px;" placeholder="请输入地址" v-model="problems.address" />
      <el-button type="primary" size="small" @click="searchDangerQuery()">查询</el-button>
    </el-row>
    <div class="datatable">
      <el-table border stripe class="mapTable" style="width: 100%;margin-top: 8px;" height="100%" :header-cell-style="{'text-align':'center'}" :data="hiddendangerData" @row-dblclick="showTrouble" @row-click="clickHiddendangerData">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column type="index" label="序号" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{((pageInfo.current - 1) * pageInfo.size) + (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pipeName" :formatter="formatter" show-overflow-tooltip sortable label="管线名称" width="200px" align="left" />
        <el-table-column prop="location" :formatter="formatter" show-overflow-tooltip sortable label="隐患部位" width="140px" align="center" />
        <el-table-column prop="typeName" :formatter="formatter" show-overflow-tooltip sortable label="隐患原因" width="180px" align="left" />
        <el-table-column prop="toubleRangeName" :formatter="formatter" show-overflow-tooltip sortable label="隐患等级" width="180px" align="left" />
        <el-table-column prop="address" :formatter="formatter" show-overflow-tooltip sortable label="地址" align="left" />
        <el-table-column prop="submitTime" :formatter="formatter" show-overflow-tooltip sortable label="上报时间" align="center" />
        <el-table-column prop="submitUserName" :formatter="formatter" show-overflow-tooltip sortable label="上报人" width="140px" align="center" />
        <el-table-column prop="state" :formatter="formatter" sortable show-overflow-tooltip label="状态" width="100px" align="center" />
        <el-table-column prop="auditResult" :formatter="formatter" show-overflow-tooltip sortable label="审批状态" width="140px" align="center" />
        <el-table-column prop="suggest" :formatter="formatter" show-overflow-tooltip sortable label="隐患消除建议" align="left" />
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showTrouble(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-area">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :page-size="pageInfo.size" :current-page="pageInfo.current" :total="pageInfo.tableTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogDetail" title="隐患详情" width="60%" top="10vh">
      <troubleDetail :troubleAry="troubleAry" />
    </el-dialog>
  </div>
</template>
<script lang='ts'>
/**
 * @description 该功能为巡检子系统，隐患管理模块中的隐患查询功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
import locationIcon from '@/assets/images/map/location.png'
import { Map, View } from 'ol'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import { Point, MultiPoint } from 'ol/geom'
import { Icon, Style } from 'ol/style'
@Component({
  name: 'HiddendangerSearch',
  components: { troubleDetail }
})
export default class HiddenDangerSearch extends Vue {
  @Prop() data: any
  dialogDetail = false //控制详情页面的显示
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
    pipeName: undefined,
    reportTime: undefined,
    address: undefined,
    startTime: '',
    endTime: ''
  }
  postProblems = {
    pipeName: undefined,
    startTime: undefined,
    endTime: undefined,
    address: undefined,
    startDate:undefined,
    endDate:undefined
  }
  pageInfo = { current: 1, size: 10, tableTotal: 1 } //分页数据
  troubleAry = {} //组件参数
  // 上报隐患数据
  hiddendangerData = []
  graphicsLayer: VectorLayer<VectorSource<any>> = null
  @Watch('$store.state.map.halfP_editableTabsValue')
  editableTabsValueChange() {
    console.log('进入页面:hiddendangerSearch')
  }
  mounted() {
    this.getData() //渲染主页表格
  }
  destroyed() {
    let mapV = this.data.mapView as Map
    if (this.graphicsLayer) {
      mapV.removeLayer(this.graphicsLayer)
      this.graphicsLayer = null
    }
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
   * @description 绘制坐标
   */
  drawPoint(lon, lat) {
    const map = this.data.mapView as Map
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

    if (this.graphicsLayer) {
      this.graphicsLayer.getSource().clear()
    } else {
      this.graphicsLayer = new VectorLayer({
        source: new VectorSource()
      })
      map.addLayer(this.graphicsLayer)
    }
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
    let mapV = this.data.mapView
    const options = {
      center: [lon, lat],
      zoom: 17
    }
    mapV.getView().animate(options)
  }
  /**
   * @description 获取列表信息
   */
  getData() {
    var that = this

    //追加分页参数
    const query = that.pageInfo
    that.postProblems.pipeName = that.problems.pipeName
    that.postProblems.address = that.problems.address
    if (!((!that.problems.startTime && !that.problems.endTime) || (that.problems.startTime && that.problems.endTime))) {
      this.$message.info('时间段请选择完整！')
      return
    }
    that.postProblems.startDate = that.problems.startTime ? that.problems.startTime + ' 00:00:00' : ''
    that.postProblems.endDate = that.problems.endTime ? that.problems.endTime + ' 23:59:59' : ''

    Object.assign(query, that.postProblems)
    that.hiddendangerData = []
    queryDangerReport(query).then((res) => {
      //数据总数
      that.pageInfo.tableTotal = res.result.total

      that.hiddendangerData = res.result.records
    })
  }
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
  /**
   * @description 点击查询，获取主页面表单数据
   */
  searchDangerQuery() {
    this.pageInfo.current = 1
    this.getData()
  }

  /**
   * @description Table的选中
   */
  clickHiddendangerData(row, event, column) {
    //经纬度坐标定位
    //  if(row.lgtd&&row.lttd){
    //     this.highPointToMap([row.lttd,row.lgtd]);
    // }
    this.toPoint(row.lgtd, row.lttd)
  }

  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
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
    console.log('主键编号：' + id)
  }
}
</script>

<style lang='scss' scoped>
.hiddendangerSearch {
  height: 100%;
  width: 100%;
  padding: 5px;
  .filteroption {
    width: 50%;
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    // align-self: flex-end;
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
.flexTitle {
  min-width: 130px;
  display: inline-block;
  text-align: right;
}
</style>
