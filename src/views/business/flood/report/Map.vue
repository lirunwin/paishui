<template>
  <div id="flood-view" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { View, Map } from 'ol'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import * as turf from '@turf/turf'
import { getDistance } from '@/utils/constant'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import { Point, MultiPoint } from 'ol/geom'
import { Icon, Style } from 'ol/style'
import locationIcon from '@/assets/images/map/location.png'
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

  timer = null
  vectorLayer: VectorLayer<VectorSource<any>> = null
  async initMap() {
    const { initCenter, initZoom } = appconfig

    const layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
    const map = new Map({
      target: 'flood-view',
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 21,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.view = map
    this.addLayers(layerResource).then(() => {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource()
      })
      this.view.addLayer(this.vectorLayer)
    })

    // 点击查询管段详情
    this.view.on('singleclick', (e) => {
      console.log(e)

      if (this.enableDeviceSelect) {
        // const distance = getDistance(this.center, e.coordinate)
        // console.log(distance)
        // if (distance * 1000 > 10) this.spaceQuery(e.coordinate)
      }
      if (this.enableCoordinateSelect) {
        this.coordinateChange(e.coordinate)
        this.drawPoint(e.coordinate[0], e.coordinate[1])
      }
    })
  }
//巡检点添加页面点绘制事件
  drawPoint(lon, lat) {
    if (!this.vectorLayer) {
      this.$message.error('点图层创建失败')
      return
    } else {
      this.vectorLayer.getSource().clear()
    }

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
    this.vectorLayer.getSource().addFeature(feature)
  }
  async spaceQuery(position) {
    const bufferDis = 3e-3
    let queryFeature = turf.buffer(turf.point(position), bufferDis, { units: 'kilometers' })
    let queryData = await new iQuery().spaceQuery(queryFeature)
    let showData = []
    for (let data of queryData as any) {
      let features = data.result.features.features
      if (features.length !== 0) {
        showData.push(features)
      }
    }
    if (showData.length !== 0) {
      const feature = showData[0][0]
      this.deviceChange(feature)
    }
  }

  addLayers(layersSource) {
    return new Promise((resolve, reject) => {
      new TF_Layer()
        .createLayers(layersSource)
        .then((layers: any[]) => {
          layers.forEach((layer) => {
            layer && this.view.addLayer(layer)
          })
          resolve(null)
        })
        .catch(() => {
          reject()
        })
    })
  }

  @Watch('center', { immediate: true })
  setCenter(coordinate: number[]) {
    const [lat, lng] = coordinate || []
    if (!lat || !lng) return

    this.timer && clearTimeout(this.timer)
    this.timer = window.setTimeout(() => {
      this.view.getView().setCenter([lat, lng])
      this.view.getView().setZoom(19)
    }, 500)
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
  clearMap() {
   if(this.vectorLayer){
     this.vectorLayer.getSource().clear();
   } 
  }
}
</script>

<style lang="scss" scoped>
#flood-view {
  height: 100%;
  width: 100%;
}
</style>
