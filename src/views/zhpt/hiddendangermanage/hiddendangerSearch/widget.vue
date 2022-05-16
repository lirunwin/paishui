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
        <el-table-column prop="regionName" :formatter="formatter" show-overflow-tooltip sortable label="所属片区" width="120px" align="center" />
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
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
    address: undefined
  }
  pageInfo = { current: 1, size: 10, tableTotal: 1 } //分页数据
  troubleAry = {} //组件参数
  // 上报隐患数据
  hiddendangerData = []

  @Watch('$store.state.map.halfP_editableTabsValue')
  editableTabsValueChange() {
    console.log('进入页面:hiddendangerSearch')
  }
  mounted() {
    var that = globalThis
    var div = this.$refs.cctvMap
    var mapV = this.data.mapView
    var map = mapV.map
    loadModules(['esri/views/MapView'], { url: esriConfig.baseUrl }).then(([MapView]) => {
      const mapview = new MapView({
        container: div,
        map: map
      })
      that.mapV = mapview
      mapview.ui.components = []
      mapview.constraints.lods = mapV.constraints.lods
    })

    this.getData() //渲染主页表格
  }
  destroyed() {
    console.log('实例销毁完成')
    let mapV = this.data.mapView
    let map = mapV.map
    // if (this.graphicsLayer) {
    // 	map.remove(this.graphicsLayer);
    // }
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
    let that = this
    let mapV = this.data.mapView
    let map = mapV.map
    loadModules(
      ['esri/views/MapView', 'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/symbols/PictureMarkerSymbol'],
      { url: esriConfig.baseUrl }
    ).then(([MapView, Graphic, GraphicsLayer, PictureMarkerSymbol]) => {
      const point = {
        type: 'point',
        x: lon,
        y: lat,
        spatialReference: mapV.spatialReference
      }
      const simpleMarkerSymbol = {
        path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
        color: 'red',
        outline: { color: 'red', width: '1px' },
        size: '30px',
        yoffset: '15px',
        xoffset: '0px',
        type: 'simple-marker'
      }
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
      })
    //   if (that.graphicsLayer) {
    //     that.graphicsLayer.removeAll()
    //   } else {
    //     that.graphicsLayer = new GraphicsLayer()
    //     map.add(that.graphicsLayer)
    //   }
    //   that.graphicsLayer.add(pointGraphic)
    })
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
    let gotoJson = {
      target: new mapV.TF_graphic({
        geometry: {
          type: 'point',
          x: lon,
          y: lat,
          spatialReference: mapV.spatialReference
        }
      }),
      zoom: 10
    }
    // if (this.mapV) {
    //   this.mapV.goTo(gotoJson, { duration: 1000 })
    // }
    // mapV.goTo(gotoJson, { duration: 1000 })
  }

  /**
   * @description 清除图层
   */
  clearLayer(layer) {
    if (layer && layer.removeAll) {
      layer.removeAll()
    }
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
    //that.postProblems.startDate = that.problems.startTime ? that.problems.startTime + ' 00:00:00' : ''
    //that.postProblems.endDate = that.problems.endTime ? that.problems.endTime + ' 23:59:59' : ''
   

    Object.assign(query, that.postProblems)
    console.log('page参数：' + JSON.stringify(query))
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
    console.log(row, event, column)
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
