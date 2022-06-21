<template>
  <div
    id="viewDiv"
    ref="back_box"
    v-loading="loading"
    :element-loading-text="loadText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <tf-dialog
      :show.sync="panels.tfDialog.Show"
      :hide.sync="panels.tfDialog.Hide"
      :set-size.sync="panels.tfDialog.setSize"
    />
    <el-container style="height: 100%; width: 100%">
      <el-container
        :style="{
          height: 'calc(100% - ' + footer_height + ')',
          width: '100%'
        }"
      >
        <el-main>
          <!-- <float-panels :data='FloatPanels' @handelClose='handelClose'></float-panels> -->
          <div
            id="antherPanel"
            ref="antP"
            style="width: 100%; display: none; width: calc(50% - 2px); height: 100%; float: left"
          >
            <!-- <div class="qufen" style="left:calc(50% - 175px)"><span>副视图</span><span>主视图</span></div> -->
          </div>
          <div
            style="
              display: none;
              width: 4px;
              height: 100%;
              background: #ccc;
              z-index: 2;
              float: left;
              position: relative;
            "
          />
          <div id="mapView" class="mapView">
            <div
              id="any"
              ref="any"
              style="position: absolute; left: calc(50% - 250px); top: calc(50% - 150px);display:none;width:600px;border"
            >
              <div
                id="any_title"
                class="label"
                style="width: 100%; height: 40px; background: rgb(45, 116, 231); border-radius: 5px 5px 0px 0px"
              >
                <div
                  class="label"
                  style="float: left; color: #fff; font-size: 18px; padding-left: 20px; padding-top: 10px"
                >
                  分析结果
                </div>
                <span
                  class="label"
                  style="float: right; cursor: pointer; color: #fff; margin-right: 10px; margin-top: 10px"
                  @click="closeAny"
                  ><i class="el-icon-close"
                /></span>
              </div>
              <div
                id="any_contant"
                style="
                  width: 100%;
                  height: 400px;
                  background: #fff;
                  border: 1px solid rgb(218, 218, 218);
                  border-radius: 0px 0px 5px 5px;
                "
              />
            </div>
            <!-- 视图工具 -->
            <!-- <WidgetGroup :map-view="view" :that="this" /> -->
            <!-- 测量工具 -->
            <!-- <MeasureTool :map-view="view" /> -->
            <!-- 查询 -->
            <!-- <QueryTool :map-view="view" :that="this" /> -->
            <!-- 鹰眼 -->
            <!-- <OverviewMap :map-view="view" /> -->
            <!-- 弹出框 -->
            <popupWindow v-if="view" ref="popupWindow" :map="view"></popupWindow>
          </div>
          <!-- 左下角工具栏 -->
          <leftBottomTool
            :toolList="leftBottomTool.children"
            :map="view"
            v-if="leftBottomTool && leftBottomTool.children && leftBottomTool.children.length > 0"
          ></leftBottomTool>

          <!-- 右下角工具栏 -->
          <rightBottomTool
            :toolList="rightBottomTool.children"
            :map="view"
            v-if="rightBottomTool && rightBottomTool.children && rightBottomTool.children.length > 0"
          ></rightBottomTool>
          <!-- 右上角工具栏 -->
          <rightTopTool
            :toolList="rightTopTool.children"
            :map="view"
            :rootPage="this"
            v-if="rightTopTool && rightTopTool.children && rightTopTool.children.length > 0"
          ></rightTopTool>
          <!-- 左上角工具栏 -->
          <leftTopTool
            :toolList="leftTopTool.children"
            :map="view"
            v-if="leftTopTool && leftTopTool.children && leftTopTool.children.length > 0"
          ></leftTopTool>
          <div v-show="labelShow" id="mapLabel">
            <span id="mapView_title">地图图例</span>
            <span id="mapView_close" ref="legend_close" title="收缩" @click="legendClick">▼</span>
            <div id="mapView_legend" ref="legend" style="height: 350px" />
          </div>
          <!-- 公共图例 -->
          <transition name="el-zoom-in-top">
            <div v-show="showMapLengend" class="map-legend">
              <div class="map-legend-title">
                <span>图例</span>
                <!-- <span ref="legendCloser" style="float: right; cursor: pointer" title="收缩" @click="legendChange">▼</span> -->
              </div>
              <div v-show="showLegendBox" class="map-legend-item" v-for="(item, index) in legendData" :key="index">
                <div style="flex: 0.3; text-align: center">
                  <div :class="'map-legend-' + item.type" :style="'background-color:' + item.color"></div>
                </div>
                <div style="flex: 0.7; text-align: center">
                  <div class="map-legend-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </transition>
          <div></div>

          <float-panels :panels="FloatPanels" :data="panels" />
          <div id="map-index-floatPanels" ref="floatPanels" />
          <!-- width: side_width,
              'user-drag': 'none',
              height: '620px', -->
          <!-- draggable="true"
            @dragstart.native="dragstart($event)"
            @dragend.native="dragend($event)" -->
          <!-- @dragover.prevent -->
          <!-- width: $store.state.specialWidth || side_width, -->
          <!-- position: 'fixed',
              right: elLeft+'px',
              top: elTop+'px', -->
          <!-- <el-aside
            :style="{
              width: side_width,
              'user-drag': 'none',
              height: '620px',
              borderRadius: '5px',
            }"
          >
            <side-panels
              :panels="Panels"
              :data="panels"
              :side-width.sync="side_width"
              :panel-visible.sync="sidepanel_visible"
              @handelClose="handelClose"
            />
          </el-aside> -->
        </el-main>
        <el-aside :style="{ width: side_width, height: '100%' }">
          <side-panels
            :panels="Panels"
            :data="panels"
            :side-width.sync="side_width"
            :panel-visible.sync="sidepanel_visible"
            @handelClose="handelClose"
          />
        </el-aside>
      </el-container>
      <el-footer :style="{ height: footer_height, width: '100%', padding: '0px' }">
        <half-panels
          :panels="HalfPanels"
          :data="panels"
          :footer-height.sync="footer_height"
          :default-height.sync="halfpanel_defaultHeight"
          :panel-visible.sync="halfpanel_visible"
          :fullpanel-visible.sync="fullpanel_visible"
          :style="{ display: fullpanel_visible ? 'none' : 'block' }"
          @handelClose="handelClose()"
        />
        <full-panels
          :panels="FullPanels"
          :data="panels"
          :footer-height.sync="footer_height"
          :panel-visible.sync="fullpanel_visible"
          :halfpanel-visible.sync="halfpanel_visible"
          :style="{ display: !fullpanel_visible ? 'none' : 'block' }"
          @handelClose="handelClose()"
        />
      </el-footer>
    </el-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { Logo, TileSuperMapRest, SuperMap, LayerInfoService } from '@supermap/iclient-ol'
import axios from 'axios'
import Comps from '@/layout/components/loadComps'
import { HalfPanels, FullPanels, FloatPanels, SidePanels } from '@/layout/components/index'
import { appconfig } from 'staticPub/config'
import { loadCss } from '@/utils/loadResources'
import request from '@/utils/request'
import tfDialog from './common/Dialog.vue'
import WidgetGroup from './tongyonggongju/widgetGroup/widget.vue'
import MeasureTool from './tongyonggongju/measureTool/widget.vue'
import QueryTool from './tongyonggongju/queryTool/widget.vue'
import SimpleQueryTool from './tongyonggongju/simpleQueryTool/widget.vue'
import leftBottomTool from './tongyonggongju/leftBottomTool/widget.vue'
import leftTopTool from './tongyonggongju/leftTopTool/widget.vue'
import rightBottomTool from './tongyonggongju/rightBottomTool/widget.vue'
import rightTopTool from './tongyonggongju/rightTopTool/widget.vue'
import popupWindow from '@/components/PopupWindow/popupWindow.vue'

// 投影
import { Projection, addProjection, get as getProjection, fromLonLat, transform } from 'ol/proj'
import { register as olRegisterProj } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { comSymbol } from '@/utils/comSymbol'
import { LegendConfig } from '@/views/zhpt/common/legendConfig'

import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import { Polygon } from 'ol/geom'
import { WMTS } from 'ol/source'
import * as olExtent from 'ol/extent'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import * as olProj from 'ol/proj'
import { defaults as controls } from 'ol/control'
import * as turf from '@turf/turf'
import iQuery from './common/mapUtil/query'
import { unByKey } from 'ol/Observable'
import GeoJSON from 'ol/format/GeoJSON'

@Component({
  components: {
    HalfPanels,
    FullPanels,
    FloatPanels,
    SidePanels,
    tfDialog,
    WidgetGroup,
    MeasureTool,
    QueryTool,
    SimpleQueryTool,
    leftBottomTool,
    leftTopTool,
    rightBottomTool,
    rightTopTool,
    popupWindow
  }
})
export default class BaseMap extends Vue {
  LOADING!: (payload: boolean) => void
  currTitle = ''
  showMapLengend = false
  /** 开启点击事件弹窗 */
  openPopupSwitch = true
  //
  showLegendBox = true
  // 图例数据
  legendData = []
  // 用于管线定位
  vectorLayer = null
  // 空间参考
  projection = null

  /**左上角工具栏列表*/
  leftTopTool = null
  /**左下角工具栏列表*/
  leftBottomTool = null
  /**右上角工具栏列表*/
  rightTopTool = null //
  /**右下角工具栏列表*/
  rightBottomTool = null
  @Prop(Object) params: object
  view = null
  Comps
  show = true
  themSrc = ''
  labelShow = false
  side_width = '0%'
  footer_height = '0%'
  sidepanel_visible = false
  floatpanel_visible = false
  halfpanel_visible = false
  fullpanel_visible = false
  halfpanel_defaultHeight = '400px'
  legendHide = true
  loading = true
  loadText = ''
  // initWidth = 0 // 父元素的宽-自适应值
  // initHeight = 0 // 父元素的高-自适应值
  // startclientX = 0 // 元素拖拽前距离浏览器的X轴位置
  // startclientY = 0 //元素拖拽前距离浏览器的Y轴位置
  // elLeft = 20 // 元素的左偏移量
  // elTop = 120 // 元素的右偏移量
  panels = {
    mapView: this.view,
    that: this,
    // 当前激活的模块
    activeModel: null,
    tfDialog: { Show: null, Hide: null, setSize: null }
  }

  get Panels() {
    return this.$store.state.map.panels
  }
  get FullPanels() {
    return this.$store.state.map.fullPanels
  }
  get HalfPanels() {
    return this.$store.state.map.halfPanels
  }
  get FloatPanels() {
    return this.$store.state.map.floatPanels
  }
  get jumpText() {
    return this.$store.state.jumpText
  }
  get activeHeaderItem() {
    return this.$store.state.gis.activeHeaderItem
  }
  @Watch('Panels')
  PanelsChange(n, o) {
    if (n.length === 0) {
      this.$nextTick(() => {
        this.view.updateSize()
      })
    }
  }
  @Watch('HalfPanels')
  HalfPanelsChange(n, o) {
    if (n.length === 0) {
      this.$nextTick(() => {
        this.view.updateSize()
      })
    }
  }
  @Watch('FullPanels')
  FullPanelsChange() {
    this.show = true
  }
  @Watch('loading')
  loadingChange(value) {
    console.log('跳转', value)
    if (value == false) {
      var str = this.$store.state.jumpText
      if (!str) return
      str = str.split(',')
      this.$store.dispatch('map/changeMethod', {
        pathId: str[0],
        widgetid: str[1],
        label: str[2]
      })
    }
  }
  @Watch('jumpText')
  jumpTextChange(n, o) {
    if (!n) return
    console.log('跳转', n)
    n = n.split(',')
    this.$store.dispatch('map/changeMethod', {
      pathId: n[0],
      widgetid: n[1],
      label: n[2]
    })
  }
  @Watch('activeHeaderItem', { immediate: true })
  activeHeaderItemChange(n, o) {
    this.currTitle = n
  }
  created() {
    console.log('=====', this.Comps)
  }
  mounted() {
    console.log('地图重新加载')
    this.initConfig() // 加载配置 ==> 加载地图
  }
  // 页面初始化
  // initBodySize() {
  //   this.initWidth = document.body.clientWidth // 拿到父元素宽
  //   // this.initHeight = this.initWidth * (1080 / 1920);
  //   this.initHeight = this.initWidth * ((1080 * 0.88) / (1920 - 1080 * 0.02)) // 根据宽计算高实现自适应
  // }
  // 拖拽开始事件
  // dragstart(e) {
  //   // console.log("拖拽开始事件",e)
  //   this.startclientX = e.clientX // 记录拖拽元素初始位置
  //   this.startclientY = e.clientY
  // }
  // 拖拽完成事件
  // dragend(e) {
  //   // console.log("拖拽完成事件",e)
  //   let x = e.clientX - this.startclientX // 计算偏移量
  //   let y = e.clientY - this.startclientY
  //   this.elLeft -= x // 实现拖拽元素随偏移量移动
  //   this.elTop += y
  // }
  handelClose() {
    this.show = false
  }
  async initMap() {
    let { initCenter, initZoom } = appconfig

    let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
    let map = new Map({
      target: 'mapView',
      controls: controls({
        zoom: false,
        attribution: false
      }),
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 21,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.panels.mapView = this.view = this.$store.state.gis.map = map
    this.addLayers(layerResource)

    this.loading = false
    this.$store.commit('map/LOADING', false)
    this.$nextTick(this.controlToolDisplay)
    // 触发地图视野变化
    let timer = null, time = 500
    this.view.getView().on('change', (evt) => {
      // console.log('级别变化', this.view)
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        let extent = new mapUtil(this.view).getCurrentViewExtent()
        this.$store.state.gis.mapExtent = extent
      }, time)
    })
    // 点击查询管段详情
    this.view.on('click', (evt) => {
      let filter = this.$store.state.routeSetting.routes[0].name === "leftBottomTool"
      if (!filter || !this.openPopupSwitch) return
      this.spaceQuery(evt.coordinate)
    })
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: comSymbol.getAllStyle(3, 'f00', 5, '#00ffff', 'rgba(255, 255, 255, 0.6)')
    })

    this.view.addLayer(this.vectorLayer)
    // this.view.getView().setCenter([101.724022, 26.580702])
  }

  spaceQuery(position) {
    console.log('查询')
    let queryFeature = turf.buffer(turf.point(position), 2, { units: 'meters' }) as any
    queryFeature = new GeoJSON().readFeature(queryFeature)
    let dataServerConfig = appconfig.gisResource.iserver_resource.dataService
    new iQuery().spaceQuery(queryFeature).then((queryData) => {
      let showData = []
      for (let data of queryData as any) {
        let features = data ? data.result.features.features : []
        if (features.length !== 0) {
          showData.push(data)
        }
      }
      if (showData.length !== 0) {
        let openData = showData.find((data) => data.result.features.features[0].geometry.type === 'Point')
        // 点优于线显示
        let featureData = openData ? openData : showData[0]
        let layerName = featureData.tableName
        //
        let layer = mapUtil.getAllSubLayerNames('pipemap', 'smlayergroup')
        let feature = featureData.result.features.features[0]
        let findLayer
        layer.sublayers.forEach((p) => {
          let layername = p.title
          let sublayer = p.sublayers.find((sub) => sub.name.split('@')[0] === layerName)
          if (sublayer) {
            feature.layerName = layername
            feature.tableName = sublayer.name.split('@')[0]
          }
        })

        let com = this.$refs.popupWindow as any
        com.showPopup(position, feature, afterClosePopup, true)
        let vectorLayer = new VectorLayer({
          source: new VectorSource(),
          style: mapUtil.getCommonStyle()
        })
        let ifeature = new GeoJSON().readFeature(feature)
        if (ifeature) {
          vectorLayer.getSource().addFeature(ifeature)
          this.view.addLayer(vectorLayer)
        }
        // 关闭弹窗后
        function afterClosePopup() {
          vectorLayer.getSource().removeFeature(ifeature)
        }
      }
    })
  }

  // 设置是否开启弹窗
  setPopupSwitch(isopen) {
    this.openPopupSwitch = isopen
  }
  // 加载图层
  addLayers(layersSource) {
    new TF_Layer().createLayers(layersSource).then((layers) => {
      layers.forEach((layer) => {
        layer && this.view.addLayer(layer)
      })
    })
  }

  legendClick() {
    this.legendHide = !this.legendHide
    var whichP = [['收缩', 350, '▼'], ['展开', 0, '▲']][this.legendHide ? 0 : 1]
    //@ts-ignore
    this.$refs.legend_close.title = whichP[0]
    //@ts-ignore
    this.$refs.legend.style.height = whichP[1] + 'px'
    //@ts-ignore
    this.$refs.legend_close.innerHTML = whichP[2]
  }

  // 定位某条管线
  setPipesView(pipes) {
    let coors = pipes || [[113.14459646427814, 29.365111002105298], [113.14462310850658, 29.36565173168358]]
    let feature = new Feature({ geometry: new LineString(coors) })
    if (!this.vectorLayer) {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(3, 'f00', 5, '#00ffff', 'fff6')
      })
      this.view.addLayer(this.vectorLayer)
    }
    this.vectorLayer.getSource().clear()
    this.vectorLayer.getSource().addFeature(feature)
    //
    let extent = feature.getGeometry().getExtent()
    this.view.getView().setCenter([(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2])
    this.view.getView().setZoom(20)
  }
  // 清除地图
  clearMap() {
    this.vectorLayer.getSource().clear()
  }
  // 根据 extent 查询 数据
  queryForExtent(extent) {
    new mapUtil(this.view).queryForExtent(extent, this.vectorLayer)
  }
  // 显示图例
  showLegend(legendName, visible) {
    if (!legendName) return
    this.legendData = LegendConfig[legendName]
    this.showMapLengend = visible
  }
  legendChange() {
    this.showLegendBox = !this.showLegendBox
    let dom: any = this.$refs.legendCloser
    dom.innerHTML = this.showLegendBox ? '▼' : '▲'
  }

  closeAny() {
    //@ts-ignore
    this.$refs.any.style.display = 'none'
  }
  initConfig() {
    var resource = appconfig.gisResource['iserver_resource']
    var nextDo = () => {
      this.loadText = '地图加载中'
      this.$nextTick(this.initMap)
    }

    if (appconfig.isloadServer) {
      this.loadText = '服务加载中'
      request({ url: '/base/sourcedic/getTreeService', method: 'get' }).then((res1) => {
        if (res1.code == 1) {
          const res = res1.result
          //通过访问天地图地址判断是否可以连接外网,先获取编码isOnlineAddress下的外网地址
          let onlineIndex = res.findIndex((item) => item.code == 'isOnlineAddress')
          if (onlineIndex !== -1) {
            let isOnline = true
            let onLineAddress = res[onlineIndex].child[0].cval
            axios
              .get(onLineAddress)
              .then(
                (res) => {
                  isOnline = res.status === 200
                },
                (error) => {
                  isOnline = false // 异常返回
                }
              )
              .catch((e) => {
                isOnline = false //异常返回
              })
              .finally(() => {
                // 服务配置名称
                const MAP_CONFIG = {
                  mapService: '地图配置服务',
                  layerService: '图层服务',
                  dataService: '数据服务',
                  analysisService: '网络分析服务'
                }
                // 需要替换的服务
                const repItems = [MAP_CONFIG.mapService, MAP_CONFIG.layerService, MAP_CONFIG.dataService, MAP_CONFIG.analysisService]
                res.forEach((service) => {
                  let resData = service.child,
                    source = null
                  if (repItems.includes(service.name) && resData && resData.length !== 0) {
                    if (service.name === MAP_CONFIG.layerService) {
                      source = resource.layerService.layers
                      console.log('图层服务配置')
                      resData.forEach((data) => {
                        let findItem = source.find((sourceItem) => {
                          if (sourceItem.name.includes('底图')) {
                            return data.name === (isOnline ? sourceItem.name : '离线' + sourceItem.name)
                          } else {
                            return data.name === sourceItem.name
                          }
                        })
                        if (findItem) {
                          findItem.url = data.cval
                        }
                      })
                    } else if (service.name === MAP_CONFIG.mapService) {
                      source = appconfig
                      resData.forEach((item) => {
                        if (item.ckey === 'center') {
                          source.initCenter = item.cval.split(',')
                        } else if (item.ckey === 'zoom') {
                          source.initZoom = item.cval
                        }
                      })
                    } else if (service.name === MAP_CONFIG.analysisService) {
                      source = resource.netAnalysisService
                      source.url = resData[0].cval
                    } else if (service.name === MAP_CONFIG.dataService) {
                      source = resource.dataService
                      source.url = resData[0].cval
                    }
                  }
                })
                nextDo()
              })
          }
        } else this.$message('服务加载失败 启用默认服务配置')
      })
    } else nextDo()
  }

  /**
   * 根据权限控制地图四个角的工具栏的展示
   */
  controlToolDisplay() {
    //本功能必须在权限管理-系统管理-模块管理的系统新增中分配leftTopTool,leftBottomTool,rightTopTool,rightBottomTool四个类型
    //这四个类型分别对应地图工具栏的左上角,左下角,右上角,右下角
    //这四个工具栏不在左边的功能列表中展示（改设置在src\layout\components\Sidebar\index.vue中）
    if (this.$store.state && this.$store.state.routeSetting && this.$store.state.routeSetting.routes) {
      const allModel = this.$store.state.routeSetting.dynamicRoutes['map'] //获取所有功能
      if (!allModel) return
      /**工具栏识别的字符集合*/
      const toolBoxList = ['leftTopTool', 'leftBottomTool', 'rightBottomTool', 'rightTopTool']
      const toolcomponentList = {
        leftTopTool,
        leftBottomTool,
        rightTopTool,
        rightBottomTool
      }
      //根据模块管理将组件注入
      allModel.forEach((item) => {
        let index = toolBoxList.findIndex((val) => {
          return val == item.type
        })
        if (index != -1) {
          this[item.type] = item || []
          let temp = this.getComponents(item.type)
          temp.forEach((item2) => {
            toolcomponentList[item.type]['components'][item2.name] = item2.component
          })
        }
      })
    }
  }

  /**
   * 获取指定层级下面的组件
   * @param typeString 指定层级的名称
   * */
  getComponents(typeString) {
    let temp = this.$store.state.routeSetting.addRoutes.find((val) => {
      return val.name && val.name == typeString
    })
    return temp.children || []
  }
}
</script>
<style lang="scss" scoped>
#viewDiv {
  position: absolute;
  margin: 0px auto;
  width: calc(100% - 0px);
  height: 100%;
  .el-main {
    padding: 0px;
    display: flex; // *
  }
  .mapView {
    position: relative;
    height: 100%;
    width: 100%;
  }
}
.close {
  position: absolute;
  right: 0;
  cursor: pointer;
}
#mapLabel {
  background: #fffc;
  position: absolute;
  bottom: 30px;
  left: 10px;
  padding: 5px;
  #mapView_legend {
    display: flex;
    width: 360px;
    flex-direction: column;
    flex-wrap: wrap;
    margin-top: 4px;
    overflow: hidden hidden;
    transition: 0.4s;
    >>> div {
      padding: 2px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
      span {
        padding-left: 3px;
        font-size: 12px;
      }
    }
  }
  #mapView_title {
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    border-left: 3px solid #2d74e7;
    padding-left: 4px;
  }
  #mapView_close {
    float: right;
    color: #2d74e7;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }
}
.qufen {
  position: absolute;
  top: 0px;
  background: chartreuse;
  padding: 5px;
}
#antherPanel::after {
  content: '副视图  主视图';
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #2d74e7;
  background: #ecf2ffcc;
  position: absolute;
  top: -1px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  text-align: center;
  padding: 10px 0px;
  display: block;
  letter-spacing: 1px;
}
#map-index-floatPanels {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
#map-index-floatPanels >>> .floatBox {
  pointer-events: all;
  white-space: nowrap;
  position: absolute;
  background: #fff;
  transform: translate(-50%, calc(-100% - 37px));
  border-radius: 7px;
  padding: 8px 8px 2px 8px;
  box-shadow: 0px 6px 23px #afafaf;
  .widgets-scadaLayer-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    span {
      line-height: 20px;
      letter-spacing: 1px;
    }
  }
  .widgets-scadaLayer-box {
    max-height: 69px;
    overflow: hidden;
    transition: 0.6s;
    padding-top: 8px;
    border-top: 1px solid #e0e0e0;
    div {
      line-height: 20px;
      font-size: 14px;
      display: flex;
      cursor: pointer;
      &:hover {
        background: #000;
        color: #eee;
        .scadaLayer-float-name {
          color: #eee;
        }
        .scadaLayer-float-value {
          color: #eee;
        }
      }
      .scadaLayer-float-name {
        color: #373737;
        flex: 1;
        &::after {
          content: '：';
        }
      }
      .scadaLayer-float-value {
        color: #2d74e7;
        font-weight: bold;
        margin-left: 8px;
        animation: mymove 0.8s;
        border-radius: 3px;
      }
      // .scadaLayer-float-unit {
      // }
      .scadaLayer-float-arrow2::after {
        content: '↑';
        color: #f56c6c;
        animation: mymove 0.8s;
      }
      .scadaLayer-float-arrow0::after {
        content: '↓';
        color: #67c23a;
        animation: mymove 0.8s;
      }
      .scadaLayer-float-arrow1::after {
        content: '-';
        color: #909399;
        animation: mymove 0.8s;
      }
    }
  }
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 9px solid #fff;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    position: absolute;
    left: calc(50% - 9px);
    bottom: -9px;
  }
  &:hover {
    z-index: 1;
    .widgets-scadaLayer-box {
      max-height: 500px;
    }
  }
  @keyframes mymove {
    from {
      background: rgb(158, 54, 153);
      color: #fff;
    }
    to {
      background: #fff0;
      color: #2d74e7;
    }
  }
}

.map-legend {
  background: #fffc;
  position: absolute;
  bottom: 40px;
  left: 10px;
  min-height: 30px;
  width: 200px;
  border: 1px solid rgb(13, 186, 255);
}

.map-legend-title {
  color: #fff;
  font-weight: 600;
  padding: 3px 10px;
  height: 30px;
  font-size: 15px;
  line-height: 25px;
  background-color: rgb(13, 186, 255);
}
.map-legend-item {
  display: flex;
  height: 20px;
  line-height: 20px;
  font-size: 13px;
  margin: 15px 10px;
}
.map-legend-label {
  margin-left: 5px;
}
.map-legend-rect {
  display: inline-block;
  width: 30px;
  height: 100%;
}
.map-legend-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.map-legend-line {
  display: inline-block;
  width: 50px;
  height: 8px;
}
.map-legend-traingle1 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle1.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle2 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle2.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle3 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle3.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle4 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle4.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle0 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle0.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
</style>
