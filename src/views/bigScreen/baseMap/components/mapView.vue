<template>
  <div class="mapView" :id="mapTarget"></div>
</template>

<script>
import axios from 'axios'
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import request from '@/utils/request'
import TileLayer from 'ol/layer/Tile'
import { TileSuperMapRest, SuperMap, LayerInfoService, DatasetService } from '@supermap/iclient-ol'
export default {
  name: 'mapView', //地图
  data() {
    return {
      mapTarget: 'bigScreenBaseMap'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initConfig()
      // this.initMap()
    })
  },
  methods: {
    initConfig() {
      let resource = appconfig.bigScreenMapService
      if (appconfig.isloadServer) {
        request({ url: '/base/sourcedic/getTreeService', method: 'get' }).then((res1) => {
          if (res1.code == 1) {
            const res = res1.result.filter(item=>item.code==='bigScreen_config')
            // 替换服务
            const mapService=resource.layerService.layers
            res[0].child.forEach((child) => {
              if(child.ckey==='bigScreenCenter') resource.initCenter=child.cval.split(',')
              if(child.ckey==='bigScreenZoom') resource.initZoom=child.cval
              if(child.ckey==='bigScreenBaseMap') {
                mapService[mapService.findIndex(item=>item.type===child.ckey)].url=child.cval
              }
              if(child.ckey==='bigScreenPipeMap') {
                mapService[mapService.findIndex(item=>item.type===child.ckey)].url=child.cval
              }
            })
            this.$nextTick(this.initMap)
          } else this.$message('服务加载失败 启用默认服务配置')
        })
      } else this.$nextTick(this.initMap)
    },
    //初始化地图对象
    initMap() {
      let { initCenter, initZoom } = appconfig.bigScreenMapService
      this.view = new Map({
        target: this.mapTarget,
        view: new View({
          center: initCenter,
          zoom: initZoom,
          maxZoom: 20,
          minZoom: 9,
          projection: 'EPSG:4326'
        })
      })
      this.addBaseLayer()
    },
    //底图加载
    addBaseLayer() {
      //添加图层
      let BaseMap = appconfig.bigScreenMapService['layerService'].layers.filter((item) => item.type == 'bigScreenBaseMap')
      const {url} = BaseMap[0]
      let layer = new TileLayer({
        source: new TileSuperMapRest({
          url: url,
          wrapX: true
        }),
        projection: 'EPSG:4326'
      })
      this.view.addLayer(layer)
      this.addLayers()
    },
    //图层添加
    addLayers() {
      let layersSource = appconfig.bigScreenMapService['layerService'].layers.filter(
        (item) => item.type == 'bigScreenPipeMap'
      )
      this.$store.state.bigScreen.layersSource = layersSource
      new TF_Layer().createLayers(layersSource).then((layers) => {
        layers.forEach((layer) => {
          layer && this.view.addLayer(layer)
        })
        // console.log(this.view.getLayers())
        this.$parent.view = this.view
        this.$store.state.bigScreen.view = this.view
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mapView {
  height: 100%;
  width: 100%;
  background: #000a23;
  // /deep/ .ol-layer{
  //     filter: invert(100%) hue-rotate(180deg);//实现天地图从白色变成暗黑模式的地图服务
  //     -webkit-filter: invert(100%) hue-rotate(180deg);
  // }
  /**地图控件隐藏 */
  /deep/ .ol-zoom {
    display: none !important;
  }
  /deep/ .ol-attribution {
    display: none !important;
  }
}
</style>