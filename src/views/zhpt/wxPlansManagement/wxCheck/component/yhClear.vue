<template>
  <div id="hiddendangerCheckAuditAssignment" class="hiddendangerCheckAuditAssignment">
    <el-row>
      <span class="title2">管线名称</span>
      <el-input style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请输入管线名称" v-model="problems.name" />
      <!-- <span>上报时间</span>
      <el-date-picker v-model="problems.startTime" style="width:140px;"  size="small" type="date" placeholder="请选择开始时间" :picker-options="startOptions" value-format="yyyy-MM-dd"/> ~
        <el-date-picker v-model="problems.endTime"  style="width:140px;" size="small" type="date" placeholder="请选择结束时间" :picker-options="endOptions" value-format="yyyy-MM-dd"/>       -->
      <!-- <div>
        <el-date-picker size="small" v-model="problems.reportTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div> -->
      <span class="title2">地址</span>
      <el-input style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请输入地址" v-model="problems.address" />
      <el-button type="primary" size="small" @click="dangerCheckArrangeQuery()">查询</el-button>
    </el-row>
    <div class="datatable">
      <el-table border ref="table1" class="mapTable" stripe style="width: 100%;margin-top: 8px;" height="100%" :data="hiddendangerData" @row-dblclick="dblclick" :header-cell-style="{'text-align':'center'}">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{((pageInfo.current - 1) * pageInfo.size) + (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pipeName" :formatter="formatter" sortable label="管线名称" width="200px" align="left" />
        <el-table-column prop="address" :formatter="formatter" sortable label="地址" align="left" />
        <el-table-column prop="typeName" :formatter="formatter" sortable label="隐患原因" width="180px" align="left" />
        <el-table-column prop="toubleRangeName" :formatter="formatter" sortable label="隐患等级" width="180px" align="left" />
        <el-table-column prop="submitTime" :formatter="formatter" sortable label="上报时间" width="200px" align="center" />
        <el-table-column prop="submitUserName" :formatter="formatter" sortable label="上报人员" width="140px" align="center" />
        <el-table-column prop="notes" sortable :formatter="formatter" label="消除情况" width="140px" align="center" />
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="isCheak" size="small" @click="removeCheck(scope.row)">审核</el-button>
            <el-button type="text" v-if="!isCheak" size="small" @click="showTrouble(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-area">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :page-size="pageInfo.size" :current-page="pageInfo.current" :total="pageInfo.tableTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>

    <el-dialog v-dialogDrag :visible.sync="dialogDetail" :title="troubleTitle" append-to-body width="60%" top="10vh">
      <troubleDetail :troubleAry="troubleAry" @dialogVisibleEvent="showDialog" />
    </el-dialog>
  </div>
</template>
<script lang='ts'>
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检计划审核功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Watch, Prop, Component } from 'vue-property-decorator'
import troubleDetail from '@/views/zhpt/hiddendangermanage/components/troubleDetails.vue'
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { getHiddenDangerClear } from '@/api/xjHiddenDangerManageApi'
import { ElTable } from 'element-ui/types/table'
@Component({
  name: 'hiddendangerCheckAuditAssignment',
  components: { troubleDetail }
})
export default class HiddendangerCheckAuditAssignment extends Vue {
  @Prop() isCheak: boolean
  @Prop() data: any
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
    endTime: '',
    startDate:'',
    endDate:''
  }
  pageInfo = { current: 1, size: 30, tableTotal: 1,auditResult:'' } //分页数据		//分页数据
  troubleAry = {} //组件参数
  troubleTitle = '隐患详情' //组件标题

  // 规则
  auditRule = {}
  // 部门筛选信息
  dept_select = {
    options: [
      { value: 1, label: '巡检组' },
      { value: 2, label: '抢修组' },
      { value: 3, label: '维护组' }
    ],
    value: 1
  }
  // 日期筛选信息
  date_select = {
    value: ''
  }
  //待消除隐患审核列表
  hiddendangerData = []
  mapV=null
  mounted() {
    var that = this
    var div = this.$refs.cctvMap
    var mapV = this.data.mapView
    var map = mapV.map
    // loadModules(['esri/views/MapView'],{ url: esriConfig.baseUrl }).then(([MapView]) => {
    //     const mapview = new MapView({
    //         container: div,
    //         map: map,
    //     })
    //     that.mapV = mapview
    //     mapview.ui.components = []
    //     mapview.constraints.lods = mapV.constraints.lods
    //     that.mapV.on('click', function(e) {
    //         if(that.flag === true) {
    //             that.reportForm.pointLon = e.mapPoint.longitude //经度
    //             that.reportForm.pointLat = e.mapPoint.latitude //纬度
    //             that.drawPoint()
    //         that.flag = false
    //       }
    //     })
    // })

    this.dangerCheckArrangeQuery() //渲染主页表格
  }
  destroyed() {
    console.log('实例销毁完成')
    let mapV = this.data.mapView
    let map = mapV.map
    // if (this.click) {
    //   this.click.remove();
    // }
    // if (this.graphicsLayer) {
    //   map.remove(this.graphicsLayer);
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
   * @description 加载地图
   */
  loadMap() {
    //@ts-ignore
    this.$refs.mapBox.appendChild(this.$refs.cctvMap)
    //@ts-ignore
    this.$refs.cctvMap.style.display = ''
  }
  /**
   * @description 绘制隐患点位
   */
  drawPoint(lon, lat) {
    let that = this
    let mapV = this.data.mapView
    let map = mapV.map
    // loadModules(
    //   ['esri/views/MapView', 'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/symbols/PictureMarkerSymbol'],
    //   { url: esriConfig.baseUrl }
    // ).then(([MapView, Graphic, GraphicsLayer, PictureMarkerSymbol]) => {
    //   const point = {
    //     type: 'point',
    //     x: lon,
    //     y: lat,
    //     spatialReference: mapV.spatialReference
    //   }
    //   const simpleMarkerSymbol = {
    //     path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
    //     color: '2D74E7',
    //     outline: { color: '2D74E7', width: '1px' },
    //     size: '30px',
    //     yoffset: '15px',
    //     xoffset: '0px',
    //     type: 'simple-marker'
    //   }
    //   const pointGraphic = new Graphic({
    //     geometry: point,
    //     symbol: simpleMarkerSymbol
    //   })
    //   if (that.graphicsLayer) {
    //     // map.remove(that.graphicsLayer)
    //     // that.graphicsLayer = null
    //     map.removeAll()
    //   }
    //   that.graphicsLayer = new GraphicsLayer()
    //   that.graphicsLayer.add(pointGraphic)
    //   map.add(that.graphicsLayer)
    // })
  }
  /**
   * @description 定位到点
   */
  toPoint(lon, lat) {
    this.drawPoint(lon, lat)
    var mapV = this.mapV
    // console.log(this.mapV);
    let Graphic = this.data.mapView.TF_graphic
    let centerPt = {
      type: 'point',
      x: parseFloat(lon),
      y: parseFloat(lat),
      spatialReference: mapV.spatialReference
    }
    const simpleMarkerSymbol = {
      path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
      color: '2D74E7',
      outline: { color: '2D74E7', width: '1px' },
      size: '30px',
      yoffset: '15px',
      xoffset: '0px',
      type: 'simple-marker'
    }
    const pointGraphic = new Graphic({
      geometry: centerPt,
      symbol: simpleMarkerSymbol
    })
    let opts = {
      duration: 1000
    }
    // mapV.goTo(
    //   {
    //     target: pointGraphic,
    //     zoom: 5
    //   },
    //   opts
    // ) //跳转至地图上添加的点
  }

  //获取主页面表格数据
  getData() {
    var that = this
    console.log('page参数：' + JSON.stringify(that.pageInfo))
    //追加分页参数
    const query = that.pageInfo
    // delete query.auditResult;
    // if(this.isCheak){
    //   query.auditResults='0'
    // }else{
    //   query.auditResults='1,2'
    // }
    that.problems.auditUser = this.$store.state.user.userId || ''
    if (that.strIsNull(that.problems.auditUser)) {
      that.$message.error('获取审核人失败!')
      return
    }
    if (!((!that.problems.startTime && !that.problems.endTime) || (that.problems.startTime && that.problems.endTime))) {
      this.$message.info('时间段请选择完整！')
      return
    }
    that.problems.startDate = that.problems.startTime ? that.problems.startTime + ' 00:00:00' : ''
    that.problems.endDate = that.problems.endTime ? that.problems.endTime + ' 23:59:59' : ''
    Object.assign(query, that.problems)
    that.hiddendangerData = []
    debugger
    // delete query.auditResults
    if (this.isCheak) {
      query.auditResult = '0'
    } else {
      query.auditResult = '1,2'
    }
    getHiddenDangerClear(query).then((res) => {
      if (res.code !== 1) {
        that.$message.error('获取隐患消除审核列表出错!')
        return
      }
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

  //点击主页面查询按钮，获取接口数据渲染主页面表格
  dangerCheckArrangeQuery() {
    this.pageInfo.current = 1
    //this.removeAuditDisable = false
    this.getData()
  }

  /**
   * @description 关闭Dialog
   */
  showDialog(visible) {
    console.log('是否关闭：' + visible)
    this.dialogDetail = visible

    //渲染主页
    this.dangerCheckArrangeQuery()
  }

  /**
   * @description 消除隐患审核
   */
  removeCheck(e) {
    const that = this;
    //选中行
    (that.$refs.table1 as ElTable).toggleRowSelection(e)
    // var troubleId = scope.row.troubleId
    // console.log("选中："+rowData.toubleId+" "+rowData.pipeName+" "+rowData.id);
    that.troubleTitle = '消除隐患'
    that.dialogDetail = true
    that.troubleAry = {
      troubleId: e.toubleId,
      auditId: e.id,
      optionType: '2' //1=>详情，2=审核操作
    }
  }

  /**
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return typeof strVal == 'undefined' || strVal == null || strVal == ''
  }

  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
  }

  /*------------------ 查看详情 -------------------*/

  /**
   * @description  双击事件
   */
  dblclick(e) {
    if (this.isCheak) {
      this.removeCheck(e)
    } else {
      this.showTrouble(e)
    }
  }

  /**
   * @description 查看隐患详情
   */
  showTrouble(e) {
    this.troubleTitle = '查看隐患详情'
    this.dialogDetail = true
    this.troubleAry = {
      troubleId: e.toubleId,
      auditId: e.id,
      optionType: '1' //1=>详情，2=审核操作
    }
  }
}
</script>

<style lang='scss' scoped>
.hiddendangerCheckAuditAssignment {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 5px;
  .filteroption {
    width: 32%;
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
  }
  /deep/ .el-button {
    margin-left: 0;
  }
}
.flexDiv {
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexDivMax {
  width: 99%;
  min-height: 50px;
  line-height: 50px;
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
