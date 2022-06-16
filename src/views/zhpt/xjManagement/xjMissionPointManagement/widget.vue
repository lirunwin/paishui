<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2">名称</span>
      <el-input style="width: 150px;" size="small" v-model="name" placeholder="请输入名称" />
      <el-button size="small" type="primary" @click="xjPointQuery()">查询</el-button>
      <el-button size="small" type="primary" @click="addPoint">添加</el-button>
      <el-button size="small" type="primary" :disabled="canAlter" @click="alterPoint('update'),toPoint(pointLon, pointLat)">修改</el-button>
      <el-button size="small" type="primary" :disabled="canDelete" @click="xjPointDelete()">删除</el-button>
      <el-checkbox v-model="showHistoryPoint">地图显示巡检点</el-checkbox>
    </el-row>
    <el-table class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" ref="table1" height="calc(100% - 88px)" stripe highlight-current-row @cell-click="cellSingleClick" @select="table1Select" @select-all="table1Select" @row-dblclick="alterPoint">
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="55" sortable />
      <el-table-column :formatter="formatter" prop="name" sortable label="名称" />
      <el-table-column :formatter="formatter" prop="note" sortable label="备注信息" />
      <el-table-column :formatter="formatter" prop="createTime" sortable label="创建时间" />
      <el-table-column :formatter="formatter" prop="createUserName" sortable label="创建人" />
    </el-table>
    <el-row style="margin-top: 8px;width:350px;">
      <el-col :span="20">
        <el-pagination v-model="pagination" small background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :total="pagination.total" @size-change="changeSize" @current-change="changeCurrent" @prev-click="changeCurrent" @next-click="changeCurrent" />
      </el-col>
    </el-row>
    <el-dialog :title="title" v-dialogDrag :visible.sync="diaVisiable" width="1200px" top="calc(50vh - 436px)" @close="closeEvent">
      <tf-table-legend label="巡检点信息" isopen="true">
        <div style="width:100%;">
          <div style="width:100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv">
              <span class="flexTitle">名称：</span>
              <div class="flexInfo">
                <el-input size="small" v-model="pointname" placeholder="请输入名称" />
              </div>
            </div>
            <!-- <div class="flexDiv">
              <span class="flexTitle">所在片区：</span>
              <div class="flexInfo">
                <el-select v-model="pointPlace" size="small" placeholder="请选择所在片区">
                  <el-option v-for="item of pointPlaces" :key="item.CODE" :value="item.CODE" :label="item.NAME"></el-option>
                </el-select>
              </div>
            </div> -->
            <div class="flexDiv">
              <span class="flexTitle" id="longitude">经度：</span>
              <div class="flexInfo">
                <el-input size="small" v-model="pointLon" placeholder="请输入经度" :disabled="true" />
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle" id="latitude">纬度：</span>
              <div class="flexInfo">
                <el-input size="small" v-model="pointLat" placeholder="请输入纬度" :disabled="true" />
              </div>
            </div>
            <div class="flexDiv" style="width: 25%;position: relative;left: 20px;">
              <el-button size="small" type="primary" @click="chageFlagStatus()">添加</el-button>
              <el-button size="small" type="primary" @click="toPoint(pointLon, pointLat)">定位</el-button>
              <el-checkbox v-model="showHistoryPoint">地图显示巡检点</el-checkbox>
            </div>
          </div>
        </div>
      </tf-table-legend>
      <tf-table-legend label="坐标选取" isopen="true" style="margin-top: 8px;">
        <div style="width:100%; height: 310px; margin-top:8px;" ref="mapBox"></div>
      </tf-table-legend>
      <tf-table-legend label="备注" isopen="true" style="margin-top: 8px;">
        <el-input type="textarea" style="margin-top: 8px;" :rows="3" placeholder="请输入内容" v-model="note"></el-input>
      </tf-table-legend>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="showAddConfirmButton" @click="clearTableData()" size="small">取消</el-button>
        <el-button v-show="showAlterConfirmButton" @click="clearTableData()" size="small">取消</el-button>
        <el-button v-show="showAddConfirmButton" type="primary" @click="xjPointInfoSubmit()" size="small">确定</el-button>
        <el-button v-show="showAlterConfirmButton" type="primary" @click="xjPointAlterInfoSubmit()" size="small">确定</el-button>
      </span>
    </el-dialog>
    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>
  </div>
</template>

<script lang='ts'>
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检点功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { Map, View } from 'ol'
import {unByKey} from 'ol/Observable'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import { Point,MultiPoint } from 'ol/geom'
import { Icon, Style } from 'ol/style'
import tfLegend from '@/views/zhpt/common/Legend.vue'
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue'
import { appconfig } from 'staticPub/config'
import $ from 'jquery'
import { queryXjPoint, addXjPoint, alterXjPoint, deleteXjPoint } from '@/api/xjDailyManageApi'
import { xjTypeQuery } from '@/api/xjConfigManageApi'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import request from '@/utils/request'
import axios from 'axios'
import locationIcon from '@/assets/images/map/location.png'
@Component({
  name: 'XjMissionPointManagement',
  components: { tfTableLegend, tfLegend }
})
export default class XjMissionPointManagement extends Vue {
  @Prop() data: any
  title = '' //弹出页面标题
  note = ''
  name = ''
  updateRow = null
  showHistoryPoint = true
  dialogDelete = false //控制删除确认页面的显示
  canAlter = true //控制修改按钮是否不可点击
  canDelete = true //控制删除按钮是否不可点击
  pointname = ''
  isRefreshMap = true
  pointType = '' //绑定巡查类型
  multipleSelection = []
  graphicsLayer: VectorLayer<VectorSource<any>> = null //绘制点图层
  historyPointLayaer: VectorLayer<VectorSource<any>> = null //已经绘制的点图层
  highGraphicLayer: VectorLayer<VectorSource<any>> = null //高亮图层
  showAddConfirmButton = false //显示添加巡检点信息确定按钮
  showAlterConfirmButton = false //显示修改巡检点信息确定按钮
  pointPlace = '' //绑定片区
  pointPlaces = [] //存储片区信息
  pointGeo = [] //存储片区几何信息
  pointLat = '' //纬度
  pointLon = '' //经度
  diaVisiable = false
  flag = false
  dataT1 = []
  pagination = {
    size: 10,
    current: 1,
    total: 10
  }
  addMapEvent = null
  total = 10
  layerId = 17 //片区图层id
  mapV: Map = null
  defaultStyle=new Style({
    image:new Icon({
      src:locationIcon,
      scale:0.5,
      color:'#2D74E7'
    })
  });
  mounted() {
    // this.getXjType() //绑定新增页面的巡查类型
    this.getData() //获取首页表格数据
    var that = this
    //this.initMapSource()
    this.addMap();
  }

  destroyed() {
    let mapV = this.data.mapView as Map;
    let map = this.mapV;
    
    if (this.addMapEvent) {
      unByKey(this.addMapEvent);
      this.addMapEvent=null;
    }
    if (this.graphicsLayer) {
      map.removeLayer(this.graphicsLayer)
    }
    if (this.historyPointLayaer) {
      map.removeLayer(this.historyPointLayaer)
      mapV.removeLayer(this.historyPointLayaer)
    }
    if (this.highGraphicLayer) {
      map.removeLayer(this.highGraphicLayer)
    }
  }
  @Watch('pagination.current')
  currentPageChange() {
    this.getData()
  }
  @Watch('pagination.size')
  pageSizeChange() {
    this.getData()
  }
  @Watch('name')
  nameChange() {
    this.isRefreshMap = true
  }
  @Watch('showHistoryPoint')
  showHistoryPointChange() {
    if (this.historyPointLayaer) {
      this.historyPointLayaer.setVisible(this.showHistoryPoint)
    }
  }
  /**
   * 该方法用于创建矢量图层
   */
  addVectorLayer() {
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    })
    this.graphicsLayer = vectorLayer
  }
  /**
   * 在模块打开的时候预先加载地图
   */
  addMap() {
    if(!this.$store.getters.appconfig){
      this.$message('服务加载失败 启用默认服务配置')
      return;
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
    new TF_Layer().createLayers(layerResource).then(layers => {
      layers.forEach((layer:any) => {
        layer && map.addLayer(layer)
      })
    })
   
    //添加矢量点图层
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    })
    this.graphicsLayer = vectorLayer
    map.addLayer(this.graphicsLayer)
    this.addMapEvent = map.on('singleclick', (e) => {
      if (this.flag === true) {
        this.pointLon = e.coordinate[0].toFixed(6) //经度
        this.pointLat = e.coordinate[1].toFixed(6) //纬度
        this.drawPoint(e.coordinate[0], e.coordinate[1])
        this.flag = false
      }
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
  //选中表格行时触发事件
  cellSingleClick(val) {
    this.clearHighGra()
    if (val && val.lng && val.lat) {
      this.toPoint(val.lng, val.lat)
      let point = {
        type: 'point',
        latitude: val.lat,
        longitude: val.lng,
        spatialReference: this.data.mapView.spatialReference
      }
      const simpleMarkerSymbol = {
        path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
        color: '#FFD700',
        outline: { color: '#FFD700', width: '1px' },
        size: '30px',
        yoffset: '15px',
        xoffset: '0px',
        type: 'simple-marker'
      }
      // let graphic = new this.data.mapView.TF_graphic({
      //   geometry: point,
      //   symbol: simpleMarkerSymbol
      // })
      //this.highGraphicLayer.add(graphic)
    }
  }
  //翻页改变
  changeCurrent(data) {
    this.pagination.current = data
  }
  //页数
  changeSize(data) {
    this.pagination.size = data
  }
  //主页面数据查询
  getData() {
    this.canAlter = true
    // 控制删除按钮是否不可点击
    this.canDelete = true
    let data = {
      current: this.pagination.current,
      size: this.pagination.size,
      name: this.name
    }
    this.dataT1 = []
    queryXjPoint(data).then((res) => {
      console.log(res)
      this.dataT1 = res.result.records
      this.pagination.total = res.result.total
      this.clearHighGra()
      this.setDisable()
    })
    this.getAllData()
  }
  clearHighGra() {
    if (this.highGraphicLayer) {
      this.highGraphicLayer.getSource().clear()
    }
  }
  /**
   * 获取查询条件下的所有数据并渲染地图
   */
  getAllData() {
    let data = {
      current: 1,
      size: 10000,
      name: this.name
    }
    if (this.isRefreshMap) {
      queryXjPoint(data).then((res) => {
        console.log(res)
        let points = []
        let map = this.data.mapView as Map;
        if (this.historyPointLayaer) {
          this.historyPointLayaer.getSource().clear()
        } else {
          this.historyPointLayaer = new VectorLayer({
            source: new VectorSource(),
            style:this.defaultStyle
          })
          map.addLayer(this.historyPointLayaer)
        }
        if (!this.highGraphicLayer) {
          this.highGraphicLayer = new VectorLayer({
            source: new VectorSource()
          })
          map.addLayer(this.highGraphicLayer)
        }
        this.clearHighGra()
        if (res.result.records && res.result.records.length > 0) {
          res.result.records.forEach((item) => {
            if (item.lng && item.lat) {
              points.push([item.lng, item.lat])
            }
          })
        } else {
          return
        }
        const pointSymbols=new Feature({
          geometry:new MultiPoint(points)
        })
        
        this.historyPointLayaer.getSource().addFeature(pointSymbols)
      })
    }
    this.isRefreshMap = false
  }
  //主页面表单数据查询结果
  xjPointQuery() {
    this.getData()
  }
  closeEvent() {
    if (this.graphicsLayer) {
      this.graphicsLayer.getSource().clear()
    }
  }
  //点击主页面添加按钮后触发
  addPoint() {
    let that = this
    var mapV = this.data.mapView
    that.showAddConfirmButton = true //添加确认按钮显示
    that.showAlterConfirmButton = false //编辑确认按钮隐藏
    that.diaVisiable = true
    this.pointname = ''
    this.pointPlace = ''
    this.pointLon = ''
    this.pointLat = ''
    this.note = ''
    that.title = '巡检点添加'
    that.$nextTick(that.loadMap)
    that.flag = false
  }
  //点击确定，提交添加的巡检点信息
  xjPointInfoSubmit() {
    let regionName = ''
    for (let item of this.pointPlaces) {
      if (item.CODE === this.pointPlace) {
        regionName = item.NAME
      }
    }
    if (!this.pointLon || !this.pointLat) {
      this.$message.info('请添加巡检点！')
      return
    }
    let data = {
      lng: this.pointLon,
      lat: this.pointLat,
      name: this.pointname,
      regionId: this.pointPlace,
      regionName: regionName,
      note: this.note
    }
    console.log(data)
    addXjPoint(data)
      .then((res) => {
        this.isRefreshMap = true
        this.getData()
      })
      .catch((err) => {
        console.log(err)
      })
    this.diaVisiable = false
    this.clearTableData()
  }
  //改变flag的值
  chageFlagStatus() {
    this.flag = true
  }
  //巡检点添加页面点绘制事件
  drawPoint(lon, lat) {
    if (!this.graphicsLayer) {
      this.$message.error('巡检点图层创建失败')
      return
    } else {
      this.graphicsLayer.getSource().clear()
    }
   
    const style = new Style({
      image: new Icon({
        src: locationIcon,
        scale: 0.5,
        color: 'rgba(255,0,0,1.0)'
      })
    })
    const feature = new Feature({
      geometry: new Point([lon, lat])
    })
    feature.setStyle(style)
    this.graphicsLayer.getSource().addFeature(feature)
  }
  //跳转到坐标点
  toPoint(lon, lat) {
    if (lon == '' || lat == '') {
      return
    }
    let mapV = this.data.mapView
    const options = {
      center: [lon, lat],
      zoom: 17
    }
    if (this.mapV) {
      this.mapV.getView().animate(options)
    }
    mapV.getView().animate(options)
  }
  //点击主页面删除按钮后弹出删除确认框
  xjPointDelete() {
    this.$confirm('确定删除选中的' + this.multipleSelection.length + '条巡检点?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.confirmDelete()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
  }
  //点击确定删除后触发
  confirmDelete() {
    const ids = []
    for (let i = 0; i < this.multipleSelection.length; i++) {
      ids.push(this.multipleSelection[i].id)
    }
    const data = {
      idList: ids.toString()
    }
    console.log(data)
    deleteXjPoint(data)
      .then((res) => {
        console.log(res)
        this.isRefreshMap = true
        this.getData()
      })
      .catch((err) => {
        console.log(err)
      })
    this.dialogDelete = false
  }
  //判断主页表单选中条数，据此判断是否让修改、删除按钮可编辑
  table1Select(e, s) {
    this.canAlter = e.length != 1
    this.canDelete = e.length < 1
    this.multipleSelection = e
  }
  //加载地图
  loadMap() {
    //@ts-ignore
    this.$refs.mapBox.appendChild(this.$refs.cctvMap)
    //@ts-ignore
    this.$refs.cctvMap.style.display = ''
    //地图容器初始隐藏，需要更新size
    if (this.mapV) {
      this.mapV.updateSize()
    }
    //添加历史巡检点图层
    if(this.historyPointLayaer){
      this.mapV.addLayer(this.historyPointLayaer);
    }
    //this.mapV.extent = this.data.mapView.extent
  }
  addText(text, length) {
    // var myField = this.$refs.textBox.$el;
    // var startL = myField.selectionStart || 0;
    // this.queText =
    //   this.queText.substring(0, startL) +
    //   text +
    //   this.queText.substring(myField.selectionEnd, myField.value.length);
    // myField.blur();
    // setTimeout(() => {
    //   myField.selectionStart = myField.selectionEnd = startL + length;
    //   myField.focus();
    // });
  }
  //点击主页面修改按钮后触发
  alterPoint(type) {
    this.showAlterConfirmButton = true
    this.showAddConfirmButton = false
    this.diaVisiable = true
    this.title = '巡检点修改'
    this.$nextTick(this.loadMap)
    //@ts-ignore
    let infoTable = this.$refs.table1.selection
    if (type != 'update') {
      infoTable = [type]
    }
    this.updateRow = infoTable
    this.pointname = infoTable[0].name
    this.pointPlace = infoTable[0].regionId
    this.pointLon = infoTable[0].lng
    this.pointLat = infoTable[0].lat
    this.note = infoTable[0].note
    this.drawPoint(this.pointLon, this.pointLat) //绘制修改信息
  }
  //点击确定,提交修改后巡检点信息
  xjPointAlterInfoSubmit() {
    let regionName = ''
    for (let item of this.pointPlaces) {
      if (item.CODE === this.pointPlace) {
        regionName = item.NAME
      }
    }
    let data = {
      lng: this.pointLon,
      lat: this.pointLat,
      name: this.pointname,
      regionId: this.pointPlace,
      regionName: regionName,
      note: this.note,
      id: this.updateRow[0].id
    }
    alterXjPoint(data).then((res) => {
      console.log(res)
    })
    this.clearTableData()
    this.isRefreshMap = true
    this.getData()
  }
  //清空添加或者修改表格数据
  clearTableData() {
    this.diaVisiable = false
    this.pointname = ''
    this.pointPlace = ''
    this.pointLat = ''
    this.pointLon = ''
    this.note = ''
    this.clearMapCoverage()
  }
  //清空地图上覆盖内容
  clearMapCoverage() {
    this.diaVisiable = false //关闭弹窗
    //this.graphicsLayer.removeAll()
    this.pointLon = ''
    this.pointLat = ''
    this.flag = false
  }
  setDisable() {
    this.canAlter = true
    this.canDelete = true
  }
}
</script>
<style scoped>
.flexDiv {
  width: 25%;
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
  width: calc(100% - 100px);
}
.el-table__empty-text {
  margin-top: 30px;
  line-height: 30px;
}
.el-table__empty-text .empty-p {
  margin-top: -7px;
}
.mapTable >>> .el-table__header-wrapper table th {
  /* height: 60px; */
  text-align: center;
}
.mapTable >>> .el-table__body-wrapper table td {
  text-align: center;
}
</style>
