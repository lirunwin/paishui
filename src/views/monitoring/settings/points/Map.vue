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
import { getDistance } from '@/utils/constant'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import {Style, Circle,Fill,} from 'ol/style';
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
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

  timer: NodeJS.Timeout = null

  vectorLayer:VectorLayer<any>=null
  queryLayer:VectorLayer<any>=null
  lightLayer:VectorLayer<any>=null

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
        // const distance = getDistance(this.center, e.coordinate)
        // console.log(distance)
        // if (distance * 1000 > 10) this.spaceQuery(e.coordinate)
        if(this.queryLayer.getSource().getFeatures().length>0){
          this.clickHightlight(e)
        }else{
          this.$message('当前站点10m范围内无相关设施，请重新选择站点')
        }
      }
      if (this.enableCoordinateSelect) {
        this.coordinateChange(e.coordinate)
      }
    })
    // this.vectorLayer = new VectorLayer({
    //   source: new VectorSource(),
    //   style: comSymbol.getAllStyle(3, 'f00', 5, '#00ffff', 'rgba(255, 255, 255, 0.6)')
    // })
    // this.view.addLayer(this.vectorLayer)
  }

  async spaceQuery(position) {
    this.queryLayer.getSource().clear()
    const bufferDis = 10e-3
    let queryFeature = turf.buffer(turf.point(position), bufferDis, { units: 'kilometers' })
    let queryData = await new iQuery().spaceQuery(queryFeature)
    let multiData=[];
    for (let data of queryData as any) {
      let multifeatures = data.result.features
      if (multifeatures.totalCount !== 0) {
        multiData.push(multifeatures)
      }
    }
    multiData.forEach(feaJson => {
      let feas = new GeoJSON().readFeatures(feaJson)
      this.queryLayer.getSource().addFeatures(feas)
    })
  }

  clickHightlight(e){
      let gl =this;
      gl.lightLayer.getSource().clear()
      let pixel = gl.view.getEventPixel(e.originalEvent)
      gl.view.forEachFeatureAtPixel(pixel,function(feature){
          const featureInfo={
              geometry:feature.getGeometry(),
              id:feature.getId(),
              properties: feature.getProperties()
          }
          gl.deviceChange(featureInfo)
          gl.lightLayer.getSource().addFeature(feature)
      });
  }

  addLayers(layersSource) {
    new TF_Layer().createLayers(layersSource).then((layers: any[]) => {
      layers.forEach((layer) => {
        layer && this.view.addLayer(layer)
      })
    }).then(()=>{
      this.initVectorLayer()
      if(this.center) this.showDevicePosition(this.center)
    })
  }
  showDevicePosition(position){
      this.showPointSymbol(position)
      this.spaceQuery(position)
  }
  @Watch('center', { immediate: true })
  setCenter(coordinate: number[]) {
    this.clearVectorLayer()
    const [lat, lng] = coordinate || []
    if (!lat || !lng) return
    
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.view.getView().setCenter([lat, lng])
      this.view.getView().setZoom(19)
      this.showDevicePosition([lat, lng])
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

  //初始化矢量图层源
  initVectorLayer(){
      this.vectorLayer = new VectorLayer({
          source: new VectorSource({wrapX: false,}),
          style: new Style({
              image: new Circle({
                  fill: new Fill({
                      color: 'red'
                  }),
                  radius: 5
              }),
          })
      })
      this.view.addLayer(this.vectorLayer);
      this.queryLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
      this.view.addLayer(this.queryLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
      this.view.addLayer(this.lightLayer)
  }
  //显示点符号
  showPointSymbol(position){
      const feature = new Feature({
          geometry: new Point(position),
          name:'monitorPoint',
      })
      this.vectorLayer.getSource().clear()
      this.vectorLayer.getSource().addFeature(feature)
  }
  //清除地图元素
  clearVectorLayer(){
    if(!this.vectorLayer||!this.queryLayer||!this.lightLayer) return
    this.vectorLayer.getSource().clear()
    this.queryLayer.getSource().clear()
    this.lightLayer.getSource().clear()
  }
}
</script>

<style lang="scss" scoped>
#point-view {
  height: 100%;
  width: 100%;
}
</style>
