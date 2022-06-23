<template>
  <div id="point-view" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { View, Map } from 'ol'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import iQuery from '@/views/zhpt/common/mapUtil/query'
// import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import * as turf from '@turf/turf'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Style, Circle, Fill } from 'ol/style'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { Select } from 'ol/interaction';
type Coordinate = number[]

@Component({})
export default class MapView extends Vue {
  /** 启用坐标选择 */
  @Prop({ type: Boolean, default: false }) enableCoordinateSelect!: boolean
  /** 启用设施选择 */
  @Prop({ type: Boolean, default: false }) enableDeviceSelect!: boolean
  /** 中心点, 但不一定有, 没有时获取配置的默认中心点 */
  @Prop({ type: Array }) center!: Coordinate

  view: Map = null
  centerPointLayer: VectorLayer<any> = null
  queryLayer: VectorLayer<any> = null
  centerCoor:Array<any>=null
  select:Select=null

  async initMap() {
    const { initCenter, initZoom } = appconfig
    const layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
    const map = new Map({
      target: 'point-view',
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 25,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.view = map
    this.addLayers(layerResource)
    // 点击查询管段详情
    this.view.on('click', (e) => {
      if (this.enableDeviceSelect) {
        if (this.queryLayer.getSource().getFeatures().length > 0) {
          this.clickHightlight()
        } else {
          this.$message('当前站点10m范围内无相关设施，请重新选择监测站')
        }
      }
      if (this.enableCoordinateSelect) {
        this.coordinateChange(e.coordinate)
      }
    })
  }

  async spaceQuery(position) {
    this.queryLayer.getSource().clear()
    const bufferDis = 10e-3
    let queryFeature = turf.buffer(turf.point(position), bufferDis, { units: 'kilometers' })
    let queryData = await new iQuery().spaceQuery(queryFeature)
    let multiData = []
    for (let data of queryData as any) {
      let multifeatures = data.result.features
      if (multifeatures.totalCount !== 0) {
        multiData.push(multifeatures)
      }
    }
    multiData.forEach((feaJson) => {
      let feas = new GeoJSON().readFeatures(feaJson)
      this.queryLayer.getSource().addFeatures(feas)
    })
  }

  clickHightlight() {
    //定义选择器
    this.select = new Select({
        multi: false, //单选
        layers: [this.queryLayer],
        style:mapUtil.getCommonStyle(true)
    });
    this.select.on('select',e=>{
      const feature = e.selected[0]
      if(!feature) return
      const featureInfo = {
        geometry: feature.getGeometry(),
        id: feature.getId(),
        properties: feature.getProperties()
      }
      console.log('要素信息',featureInfo)
      this.deviceChange(featureInfo)
    })
    //选择器注册
    this.view.addInteraction(this.select)
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
        this.showDevicePosition()
      })
  }
  showDevicePosition() {
    if(!this.view) return
    this.view.getView().setCenter(this.centerCoor)
    this.view.getView().setZoom(19)
    this.showPointSymbol(this.centerCoor)
    this.spaceQuery(this.centerCoor)
  }
  @Watch('center', { immediate: true })
  setCenter(coordinate: number[]) {
    this.clearVectorLayer()
    const [lat, lng] = coordinate || []
    if (!lat || !lng) return
    this.centerCoor=[lat, lng]
    this.showDevicePosition()
  }

  @Watch('enableDeviceSelect')
  removeMapEvent(val){
    if(!val) this.view.removeInteraction(this.select)
  }

  @Emit()
  coordinateChange(coordinate: Coordinate) {
    if (!this.enableCoordinateSelect) return Promise.reject()
    return coordinate
  }

  @Emit()
  deviceChange(deviceInfo: any) {
    if (!this.enableDeviceSelect) return Promise.reject()
    return deviceInfo
  }

  mounted() {
    this.initMap()
  }

  //初始化矢量图层源
  initVectorLayer() {
    this.centerPointLayer = new VectorLayer({
      source: new VectorSource({ wrapX: false }),
      style: new Style({
        image: new Circle({
          fill: new Fill({
            color: 'red'
          }),
          radius: 5
        })
      })
    })
    this.view.addLayer(this.centerPointLayer)
    this.queryLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
    this.view.addLayer(this.queryLayer)
  }
  //显示点符号
  showPointSymbol(position) {
    const feature = new Feature({
      geometry: new Point(position),
      name: 'monitorPoint'
    })
    this.centerPointLayer.getSource().clear()
    this.centerPointLayer.getSource().addFeature(feature)
  }
  //清除地图元素
  clearVectorLayer() {
    if (!this.centerPointLayer || !this.queryLayer) return
    this.centerPointLayer.getSource().clear()
    this.queryLayer.getSource().clear()
  }
}
</script>

<style lang="scss" scoped>
#point-view {
  height: 100%;
  width: 100%;
}
</style>
