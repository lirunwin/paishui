<template>
  <div id="event-view" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { View, Map } from 'ol'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import * as turf from '@turf/turf'
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

  async initMap() {
    const { initCenter, initZoom } = appconfig

    const layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
    const map = new Map({
      target: 'event-view',
      view: new View({
        center: initCenter,
        zoom: initZoom,
        maxZoom: 21,
        minZoom: 5,
        projection: 'EPSG:4326'
      })
    })
    this.view = map
    this.addLayers(layerResource)

    // 点击查询管段详情
    this.view.on('click', (e) => {
      console.log(e)
      if (this.enableDeviceSelect) {
        // const distance = getDistance(this.center, e.coordinate)
        // console.log(distance)
        // if (distance * 1000 > 10) this.spaceQuery(e.coordinate)
      }
      if (this.enableCoordinateSelect) {
        this.coordinateChange(e.coordinate)
      }
    })
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
    new TF_Layer().createLayers(layersSource).then((layers: any[]) => {
      layers.forEach((layer) => {
        layer && this.view.addLayer(layer)
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
}
</script>

<style lang="scss" scoped>
#event-view {
  height: 100%;
  width: 100%;
}
</style>
