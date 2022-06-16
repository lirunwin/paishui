<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2">名称</span>
      <el-input v-model="name" style="width: 150px;" size="small" placeholder="请输入名称" />
      <el-button size="small" type="primary" @click="getData()">查询</el-button>
      <el-button size="small" type="primary" @click="addLine">添加</el-button>
      <el-button size="small" type="primary" :disabled="canAlter" @click="alterLine('update')">修改</el-button>
      <el-button size="small" type="primary" :disabled="canDelete" @click="xjLineDelete()">删除</el-button>
      <el-checkbox v-model="showHistoryLine">地图显示巡检线</el-checkbox>
    </el-row>
    <el-table ref="table1" class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" height="calc(100% - 88px)" stripe highlight-current-row @row-dblclick="alterLine" @select="table1Select" @select-all="table1Select" @cell-click="cellSingleClick">
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column type="selection" width="55" />
      <el-table-column :formatter="formatter" prop="name" sortable label="名称" />
      <el-table-column :formatter="formatter" prop="length" sortable label="长度（m）" />
      <el-table-column :formatter="formatter" prop="regionName" sortable label="所在片区" />
      <el-table-column :formatter="formatter" prop="note" sortable label="备注信息" />
      <el-table-column :formatter="formatter" prop="createTime" sortable label="创建时间" />
      <el-table-column :formatter="formatter" prop="createUserName" sortable label="创建人" />
    </el-table>
    <el-row style="margin-top: 8px;width:350px;">
      <el-col :span="20">
        <el-pagination v-model="pagination" small background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :total="pagination.total" @size-change="changeSize" @current-change="changeCurrent" @prev-click="changeCurrent" @next-click="changeCurrent" />
      </el-col>
    </el-row>
    <el-dialog v-dialogDrag :title="title" :visible.sync="diaVisiable" width="1200px" top="calc(50vh - 436px)" @close="closeEvent">
      <tf-table-legend label="巡检线信息" isopen="true">
        <div style="width:100%;">
          <div style="width:100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv">
              <span class="flexTitle">名称：</span>
              <div class="flexInfo">
                <el-input v-model="editInfo.name" style="width: 100%;" size="small" placeholder="请输入名称" />
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">所在片区：</span>
              <div class="flexInfo">
                <el-select v-model="editInfo.regionId" size="small" placeholder="请选择所在片区">
                  <el-option v-for="item of regions" :key="item.CODE" :value="item.CODE" :label="item.NAME"></el-option>
                </el-select>
              </div>
            </div>
            <div class="flexDiv">
              <span class="flexTitle">长度（m）：</span>
              <div class="flexInfo">
                <el-input v-model="editInfo.length" style="width: 100%;" size="small" placeholder="请输入长度" :disabled="true" />
              </div>
            </div>
            <div class="flexDiv" style="position: relative;left: 4%;">
              <el-button size="small" type="primary" @click="drawLine()">绘制</el-button>
              <el-button size="small" type="primary" @click="drawLineClose()">取消绘制</el-button>
              <el-checkbox v-model="showHistoryLine">地图显示巡检线</el-checkbox>
            </div>
          </div>
        </div>
      </tf-table-legend>
      <tf-table-legend label="坐标选取" isopen="true" style="margin-top: 8px;">
        <div ref="mapBox" style="width:100%; height: 310px; margin-top:8px;" />
      </tf-table-legend>
      <tf-table-legend label="备注" isopen="true" style="margin-top: 8px;">
        <el-input v-model="editInfo.note" type="textarea" style="margin-top: 8px;" :rows="3" placeholder="请输入内容" />
      </tf-table-legend>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="showAddConfirmButton" size="small" @click="clearTableData()">取消</el-button>
        <el-button v-show="showAlterConfirmButton" size="small" @click="clearTableData()">取消</el-button>
        <el-button v-show="showAddConfirmButton" type="primary" size="small" @click="xjLineInfoSubmit()">确定</el-button>
        <el-button v-show="showAlterConfirmButton" type="primary" size="small" @click="xjLineAlterInfoSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <div ref="cctvMap" style="width:100%;height:100%;display:none;" />
    <el-dialog v-dialogDrag title="确认删除" :visible.sync="dialogDelete" width="500px">
      <span>确认是否删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检线功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { Map, View } from 'ol'
import { unByKey } from 'ol/Observable'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import { Point, MultiPoint, LineString } from 'ol/geom'
import { getLength } from 'ol/sphere'
import { Icon, Stroke, Style } from 'ol/style'
import Draw from 'ol/interaction/Draw'
import tfLegend from '@/views/zhpt/common/Legend.vue'
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue'
import {appconfig } from 'staticPub/config'
import { queryXjLine, addXjLine, alterXjLine, deleteXjLine } from '@/api/xjDailyManageApi'
import $ from 'jquery'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import { Coordinate } from 'ol/coordinate'
import { DoubleClickZoom } from 'ol/interaction'
@Component({
  name: 'xjMissionLineManagement',
  components: { tfTableLegend, tfLegend }
})
export default class XjMissionLineManagement extends Vue {
  @Prop() data: any
  // 弹出页面标题
  title = ''
  // 控制删除确认页面的显示
  dialogDelete = false
  // 控制修改按钮是否不可点击
  canAlter = true
  // 控制删除按钮是否不可点击
  canDelete = true
  // 显示添加巡检线信息确定按钮
  showAddConfirmButton = false
  // 显示修改巡检线信息确定按钮
  showAlterConfirmButton = false
  //绘制图层
  drawLayer: VectorLayer<VectorSource<any>> = null
  //巡检线图层
  xjGraphicLayer: VectorLayer<VectorSource<any>> = null
  //高亮图层
  highGraphicLayer: VectorLayer<VectorSource<any>> = null
  //查询名称
  name = ''
  updateRow = null
  multipleSelection = [] //已选择的行
  diaVisiable = false //是否展示编制页面
  isDrawEnd = true //是否绘制完成
  geometryEngine = null //地图geometryEngine类
  GeometryService = null //GeometryService服务类
  LineSymbol = null //线样式类
  LengthsParameters = null //GeometryService计算长度的参数
  isRefreshMap = true //是否刷新地图
  regions = [] //片区数据集合
  regionsFea = [] //片区featrue几何
  showHistoryLine = true //是否显示巡检线
  breakLength = 10 //打断参数
  fristBreak = {
    polylines: [], //线段数组
    lengths: [] //长度数据
  }
  draw: Draw = null
  //编辑数据
  editInfo = {
    geometry: '',
    length: '',
    name: '',
    note: '',
    regionId: '',
    regionName: '',
    id: ''
  }
  //翻页
  pagination = {
    size: 10,
    current: 1,
    total: 10
  }
  layerId = 17 //片区图层id
  dataT1 = []
  mapV: Map = null
  defaultStyle: Style = new Style({
    stroke: new Stroke({
      color: '#2D74E7',
      width: 2
    })
  })
  mounted() {
    this.getData()
    this.addMap()
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
  @Watch('showHistoryLine')
  showHistoryLineChange() {
    if (this.xjGraphicLayer) {
      this.xjGraphicLayer.setVisible(this.showHistoryLine)
    }
  }
  destroyed() {
    let mapV = this.data.mapView as Map
    if (this.xjGraphicLayer) {
      mapV.removeLayer(this.xjGraphicLayer)
    }
    if (this.highGraphicLayer) {
      mapV.removeLayer(this.highGraphicLayer)
    }
  }
  /**
   * 在模块打开的时候预先加载地图
   */
  addMap() {
    if (!this.$store.getters.appconfig) {
      this.$message('服务加载失败 启用默认服务配置')
      return
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
    this.drawLayer = vectorLayer
    map.addLayer(this.drawLayer)
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
  //清除高亮图层
  clearHighGra() {
    if (this.highGraphicLayer) {
      this.highGraphicLayer.getSource().clear()
    }
  }
  //选中表格行时触发事件
  cellSingleClick(val) {
    this.clearHighGra()
    if (val.geometry && val.geometry != '') {
      const style = new Style({
        stroke: new Stroke({
          color: '#00FFFF',
          width: 2
        })
      })
      const geom = JSON.parse(val.geometry) as Array<Coordinate>
      const line = new LineString(geom)
      const feature = new Feature({
        geometry: line
      })
      feature.setStyle(style)
      const mainmap = this.data.mapView as Map
      this.highGraphicLayer.getSource().addFeature(feature)
      mainmap.getView().fit(line, {
        size: mainmap.getSize(),
        maxZoom: 19,
        duration: 1000
      })
      // let geo = JSON.parse(val.geometry)
      // geo.type = 'polyline'
      // let graphic = new this.data.mapView.TF_graphic({
      //   geometry: geo,
      //   symbol: lineSymbol
      // })
      // this.highGraphicLayer.add(graphic)
      // this.data.mapView.extent = graphic.geometry.extent
    }
  }
  // 点击确定，提交添加的巡检线信息
  xjLineInfoSubmit() {
    if (this.editInfo.geometry == '') {
      this.$message({
        type: 'info',
        message: '请先绘制巡检线！'
      })
      return
    }
    for (let key in this.regions) {
      let item = this.regions[key]
      if (item.CODE === this.editInfo.regionId) {
        this.editInfo.regionName = item.NAME
      }
    }
    addXjLine(this.editInfo).then((res) => {
      this.isRefreshMap = true
      this.getData()
      this.clearTableData()
    })
  }
  // 点击确定,提交修改后巡检线信息
  xjLineAlterInfoSubmit() {
    const mapV = this.data.mapView
    const map = mapV.map
    if (!this.isDrawEnd) {
      this.$message({
        type: 'info',
        message: '修改的巡检线未绘制完成，请完成或者取消绘制！'
      })
    }
    for (let key in this.regions) {
      let item = this.regions[key]
      if (item.CODE === this.editInfo.regionId) {
        this.editInfo.regionName = item.NAME
      }
    }
    alterXjLine(this.editInfo).then((res) => {
      this.isRefreshMap = true
      this.clearTableData()
      this.getData()
    })
  }
  // 点击主页面删除按钮后弹出删除确认框
  xjLineDelete() {
    this.$confirm('确定删除选中的' + this.multipleSelection.length + '条巡检线?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.confirmDelete()
        this.isRefreshMap = true
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
  }
  // 点击确定删除后触发
  confirmDelete() {
    const ids = []
    for (let i = 0; i < this.multipleSelection.length; i++) {
      ids.push(this.multipleSelection[i].id)
    }
    const data = {
      idList: ids.toString()
    }
    const _this = this
    deleteXjLine(data).then((res) => {
      this.getData()
      _this.$message.success('删除成功')
    })
    this.dialogDelete = false
  }
  // 判断主页表单选中条数，据此判断是否让修改、删除按钮可编辑
  table1Select(e, s) {
    this.canAlter = e.length != 1
    this.canDelete = e.length < 1
    this.multipleSelection = e
  }
  loadMap() {
    ;(this.$refs.mapBox as HTMLElement).appendChild(this.$refs.cctvMap as HTMLElement)
    ;(this.$refs.cctvMap as HTMLElement).style.display = ''
    //地图容器初始隐藏，需要更新size
    if (this.mapV) {
      this.mapV.updateSize()
    }
    //添加历史巡检点图层
    // if(this.historyPointLayaer){
    //   this.mapV.addLayer(this.historyPointLayaer);
    // }
  }
  addText(text, length) {
    // var myField = this.$refs.textBox.$el
    // var startL = myField.selectionStart || 0
    // this.queText =
    //   this.queText.substring(0, startL) + text + this.queText.substring(myField.selectionEnd, myField.value.length)
    // myField.blur()
    // setTimeout(() => {
    //   myField.selectionStart = myField.selectionEnd = startL + length
    //   myField.focus()
    // })
  }
  // 点击主页面添加按钮后触发
  addLine() {
    var mapV = this.data.mapView
    var map = mapV.map
    this.showAddConfirmButton = true // 添加确认按钮显示
    this.showAlterConfirmButton = false // 编辑确认按钮隐藏
    this.editInfo.name = ''
    this.editInfo.note = ''
    this.editInfo.regionId = ''
    this.editInfo.regionName = ''
    this.editInfo.geometry = ''
    this.editInfo.id = ''
    this.editInfo.length = ''
    this.diaVisiable = true
    this.title = '巡检线添加'
    this.$nextTick(this.loadMap)
  }
  //取消绘制
  drawLineClose() {
    if (this.draw) {
      this.mapV.removeInteraction(this.draw)
      this.draw = null
    }
    if (this.drawLayer) {
      this.drawLayer.getSource().clear()
    }
    //如果处于修改状态，取消绘制过后，将目前的图形还原为最初始的图形
    if (this.showAlterConfirmButton) {
      //@ts-ignore
      const infoTable = this.$refs.table1.selection
      let data = infoTable[0]
      this.editInfo.regionId = data.regionId
      this.editInfo.regionName = data.regionName
      this.editInfo.geometry = data.geometry
      this.editInfo.length = data.length
    }
    this.isDrawEnd = true
  }
  // 绘制线
  drawLine() {
    const mapV = this.data.mapView
    const map = this.mapV
    this.drawLineClose()
    this.isDrawEnd = false
    this.draw = new Draw({
      type: 'LineString',
      source: this.drawLayer.getSource()
    })
    //地图默认的双击事件
    const dblclickevt = map
      .getInteractions()
      .getArray()
      .find((interaction) => {
        return interaction instanceof DoubleClickZoom
      })
    this.draw.on('drawstart', (e) => {
      //删除默认的双击事件，防止双击完成绘制时放大地图
      map.removeInteraction(dblclickevt)
    })
    this.draw.on('drawend', (e) => {
      const geometry = (e.feature as Feature<LineString>).getGeometry()
      const length = getLength(geometry, { projection: 'EPSG:4326' })
      this.editInfo.length = length.toFixed(2)
      //记录组成线的点信息
      let geometrys = geometry.getCoordinates()
      this.editInfo.geometry = JSON.stringify(geometrys)
      map.removeInteraction(this.draw)
      setTimeout(() => {
        map.addInteraction(dblclickevt);
      }, 100)
      this.draw = null
    })
    map.addInteraction(this.draw)
  }
  //绘制巡检线第一个点所在的片区
  fristPointR(lon, lat) {
    let sp = this.data.mapView.spatialReference
    let point = {
      type: 'point',
      x: lon,
      y: lat,
      spatialReference: sp
    }
    let index = undefined
    for (let key in this.regionsFea) {
      let item = this.regionsFea[key]
      item.geometry.spatialReference = sp
      let isIn = this.geometryEngine.intersects(item.geometry, point)
      if (isIn === true) {
        index = item.attributes.CODE
      }
    }
    this.editInfo.regionId = index
  }
  //计算长度
  mathLength(polylines) {
    this.fristBreak.polylines = polylines
    let url = ''
    let that = this
    if (
      !appconfig.gisResource.geometry ||
      !appconfig.gisResource.geometry.config[0] ||
      !appconfig.gisResource.geometry.config[0].url
    ) {
      url = 'http://192.168.2.245:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
    } else {
      url = appconfig.gisResource.geometry.config[0].url
    }
    let geometryService = new this.GeometryService(url)
    let lengthsParameters = new this.LengthsParameters({
      geodesic: true,
      polylines: polylines,
      lengthUnit: this.GeometryService.UNIT_METER
    })
    geometryService.lengths(lengthsParameters).then((res) => {
      if (res && res.lengths && res.lengths.length > 0) {
        this.fristBreak.lengths = res.lengths
        this.breakLine()
        let total = 0
        res.lengths.forEach((item) => {
          total += item
        })
        this.editInfo.length = total.toFixed(2)
      }
    })
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
    this.canDelete = true
    let data = {
      current: this.pagination.current,
      size: this.pagination.size,
      name: this.name
    }
    this.dataT1 = []
    queryXjLine(data).then((res) => {
      this.dataT1 = res.result.records
      this.pagination.total = res.result.total
      this.clearHighGra()
      this.setDisable()
    })
    this.getAllData()
  }
  //查询条件下的所有数据
  getAllData() {
    let data = {
      current: 1,
      size: 10000,
      name: this.name
    }
    if (this.isRefreshMap) {
      queryXjLine(data).then((res) => {
        let lines = []
        let mapV = this.data.mapView as Map
        if (this.xjGraphicLayer) {
          this.xjGraphicLayer.getSource().clear()
        } else {
          this.xjGraphicLayer = new VectorLayer({
            source: new VectorSource()
          })
          mapV.addLayer(this.xjGraphicLayer)
        }
        if (!this.highGraphicLayer) {
          this.highGraphicLayer = new VectorLayer({
            source: new VectorSource()
          })
          mapV.addLayer(this.highGraphicLayer)
        }
        this.clearHighGra()
        if (res.result.records && res.result.records.length > 0) {
          res.result.records.forEach((item) => {
            if (item.geometry && item.geometry != '') {
              let geo = JSON.parse(item.geometry)
              const linestring = new LineString(geo)
              const feature = new Feature({
                geometry: linestring
              })
              feature.setStyle(this.defaultStyle)
              this.xjGraphicLayer.getSource().addFeature(feature)
            }
          })
        } else {
          return
        }
      })
    }
    this.isRefreshMap = false
  }
  // 点击主页面修改触发事件
  alterLine(type) {
    this.showAlterConfirmButton = true
    this.showAddConfirmButton = false
    this.diaVisiable = true
    this.title = '巡检线修改'
    this.$nextTick(this.loadMap)
    //@ts-ignore
    let infoTable = this.$refs.table1.selection
    if (type != 'update') {
      infoTable = [type]
    }
    this.updateRow = infoTable
    let data = infoTable[0]
    this.editInfo.name = data.name
    this.editInfo.note = data.note
    this.editInfo.regionId = data.regionId
    this.editInfo.regionName = data.regionName
    this.editInfo.geometry = data.geometry
    this.editInfo.id = data.id
    this.editInfo.length = data.length
  }
  //打断线并求取长度
  breakLine() {
    var cnum = this.fristBreak.polylines.length
    var polylines = this.fristBreak.polylines
    let lengths = this.fristBreak.lengths
    let d = this.breakLength
    let geoEnd = []
    for (var i = 0; i < cnum; i++) {
      var len = lengths[i]
      let path = polylines[i].paths
      let pointOne = path[0][0]
      let pointTwo = path[0][1]
      let prePoint = path[0][0]
      if (len > d) {
        //大于规定距离
        var count = Math.floor(len / d) - 1
        if (count > 0) {
          var pt1 = pointOne,
            pt2 = pointTwo
          var k = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0])
          var mlen = Math.sqrt((pt2[1] - pt1[1]) * (pt2[1] - pt1[1]) + (pt2[0] - pt1[0]) * (pt2[0] - pt1[0]))
          var md = mlen / (count + 1)
          var sqk = Math.sqrt(1 + k * k)
          var dd = md
          let x, y
          for (var j = 0; j < count; j++) {
            x = dd / sqk + pt1[0]
            y = (k * dd) / sqk + pt1[1]
            if ((x > pt1[0] && x > pt2[0]) || (x < pt1[0] && x < pt2[0])) {
              x = pt1[0] - dd / sqk
            }
            if ((y > pt1[1] && y > pt2[1]) || (y < pt1[1] && y < pt2[1])) {
              y = pt1[1] - (k * dd) / sqk
            }
            dd = dd + md
            geoEnd.push([prePoint, [x, y]])
            prePoint = [x, y]
          }
          geoEnd.push([[x, y], pointTwo])
        }
      }
    }
    this.editInfo.geometry = JSON.stringify({
      paths: geoEnd,
      spatialReference: 'EPSG:4326',
      type: 'polyline'
    })
  }
  // 清空修改/添加表单内容
  clearTableData() {
    this.diaVisiable = false
    this.editInfo.name = ''
    this.editInfo.note = ''
    this.editInfo.regionId = ''
    this.editInfo.regionName = ''
    this.editInfo.geometry = ''
    this.editInfo.id = ''
    this.editInfo.length = ''
  }
  // 清空地图上覆盖内容
  clearMapCoverage() {}
  //关闭面板时触发
  closeEvent() {
    this.drawLineClose()
  }
  setDisable() {
    this.canAlter = true
    this.canDelete = true
  }
}
</script>
<style scoped>
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
