<template>
  <div id="siteMap" style="height:100%">
    <!-- <pre>
      {{ JSON.stringify(points, null, 2) }}
    </pre> -->
    <CommonPopup :popupPosition="popupPosition" :mapView="view" :right="-130" :showIcon="false">
      <div class="infoList">
        <div class="infoItem" v-for="(item, index) of siteInfo" :key="index">
          <div class="key">{{ item.key }}:</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </CommonPopup>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { IPointConnectDevice } from '../../api'
import { appconfig } from 'staticPub/config'
import CommonPopup from '@/components/CommonPopup/index.vue'
import { View, Map as MapObject } from 'ol'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Style, Icon } from 'ol/style'
import lodash from 'lodash'
@Component({
  name: 'Map',
  components: { CommonPopup }
})
export default class Map extends Vue {
  @Prop({ type: Boolean, default: false }) enable!: boolean
  @Prop({ type: Object, default: () => ({ all: false, selected: false }) }) display!: {
    /** 显示所有监测点 */
    all: boolean
    /** 显示选中监测点 */
    selected: boolean
  }
  @Prop({ type: Array, default: () => [] }) points!: (IPointConnectDevice & {
    /** 是否选中 */
    selected: boolean
  })[]

  view: MapObject = null
  popupPosition: Array<any> = null
  siteInfo: Array<any> = []
  pointLayer: VectorLayer<any> = null
  selectedLayer: VectorLayer<any> = null
  showAll: Boolean = null
  showSelected: Boolean = null
  mapEvent = null
  centerPoints: Array<any> = []

  mounted() {
    this.initMap()
  }

  @Emit('change')
  deviceChange(pointInfo: IPointConnectDevice & { selected: boolean }) {
    return pointInfo
  }

  @Watch('enable')
  activeMapEvent(enable) {
    enable ? this.initMapClickEvent() : this.removeMapClickEvent()
  }

  @Watch('display', { deep: true })
  getDisplay({ all, selected }) {
    if (!this.pointLayer || !this.selectedLayer) return
    if (all && selected) {
      this.pointLayer.setVisible(true)
      this.selectedLayer.setVisible(true)
    }
    if (!all && selected) {
      this.pointLayer.setVisible(false)
      this.selectedLayer.setVisible(true)
    }
    if (all && !selected) {
      this.pointLayer.setVisible(true)
      this.selectedLayer.setVisible(true)
    }
    if (!all && !selected) {
      this.pointLayer.setVisible(false)
      this.selectedLayer.setVisible(false)
    }
  }
  @Watch('points', { deep: true, immediate: true })
  showPoints(points) {
    // console.log('点位', points)
    if (!this.view || !points) return
    this.clear()
    points.forEach((item) => {
      const { coordiateX, coordiateY } = item
      const layer = item.selected ? this.selectedLayer : this.pointLayer
      this.showPointSymbol([coordiateX, coordiateY], item, layer)
    })
    this.centerPoints = points.filter((item) => item.selected)
  }
  @Watch('centerPoints', { deep: true })
  setCenterPoints(newVal: Array<any>, oldVal: Array<any>) {
    let center = lodash.differenceWith(newVal, oldVal, lodash.isEqual)
    if (center.length != 0)
      this.view
        .getView()
        .setCenter([parseFloat(center[center.length - 1].coordiateX), parseFloat(center[center.length - 1].coordiateY)]) //给视图设置中心点坐标的时候，坐标值需要使用parseFloat转换，否则会出现问题
  }

  async initMap() {
    const { initCenter, initZoom } = appconfig
    const layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
    const map = new MapObject({
      target: 'siteMap',
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 18,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.view = map
    this.addLayers(layerResource)
  }
  addLayers(layersSource) {
    new TF_Layer()
      .createLayers(layersSource)
      .then((layers: any[]) => {
        layers.forEach((layer) => {
          layer && this.view.addLayer(layer)
        })
      })
      .then(() => {
        this.initVectorLayer()
        this.initMapMoveEvent()
      })
  }
  initMapMoveEvent() {
    let that = this
    //移动查看监测站点信息
    this.view.on('pointermove', (e) => {
      let pixel = that.view.getEventPixel(e.originalEvent)
      that.popupPosition = null
      that.view.forEachFeatureAtPixel(pixel, function(feature) {
        that.siteInfo = []
        const geometry = feature.getProperties().property
        if (!geometry) return
        that.popupPosition = [geometry.coordiateX, geometry.coordiateY]
        for (let key in geometry) {
          if (key === 'name' || key === 'no') that.siteInfo.push({ key, value: geometry[key] })
        }
      })
    })
  }
  //初始化地图点击事件
  initMapClickEvent() {
    let that = this
    // 点击选择监测站点
    this.mapEvent = this.view.on('click', (e) => {
      let pixel = that.view.getEventPixel(e.originalEvent)
      that.view.forEachFeatureAtPixel(pixel, function(feature) {
        that.modifyPoints(feature.getProperties().property.id)
      })
    })
  }
  //清楚地图点击事件
  removeMapClickEvent() {
    this.view.un(this.mapEvent.type, this.mapEvent.listener)
  }
  //修改点状态
  modifyPoints(id) {
    let index = this.points.findIndex((i) => i.id == id)
    if (index == -1) return
    // this.points[index].selected = true
    this.deviceChange(this.points[index])
  }
  //初始化矢量图层源
  initVectorLayer() {
    this.pointLayer = new VectorLayer({
      source: new VectorSource({ wrapX: false }),
      style: this.setFeatureStyle('point')
    })
    this.view.addLayer(this.pointLayer)
    this.selectedLayer = new VectorLayer({ source: new VectorSource(), style: this.setFeatureStyle('select') })
    this.view.addLayer(this.selectedLayer)
  }
  //设置要素样式
  setFeatureStyle(type) {
    let src = type === 'point' ? require('@/assets/images/point.png') : require('@/assets/images/select.png')
    return new Style({
      image: new Icon({
        anchor: [0.5, 0.7],
        scale: 0.15,
        //图标的url
        src
      })
    })
  }
  //显示点符号
  showPointSymbol(position, property, layer) {
    const feature = new Feature({
      geometry: new Point(position),
      name: 'monitorPoint',
      property
    })
    layer.getSource().addFeature(feature)
  }
  clear() {
    if (this.pointLayer) this.pointLayer.getSource().clear()
    if (this.selectedLayer) this.selectedLayer.getSource().clear()
  }
}
</script>

<style lang="scss" scoped>
.infoList {
  display: flex;
  flex-flow: column;
  font-size: 14px;
  padding: 10px;
  .infoItem {
    display: flex;
    padding: 5px;
  }
}
</style>
