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
      let resource = appconfig.gisResource['iserver_resource']
      if (appconfig.isloadServer) {
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
                    dataService: '数据服务'
                  }
                  // 替换服务
                  const repItems = [MAP_CONFIG.mapService, MAP_CONFIG.layerService, MAP_CONFIG.dataService]
                  res.forEach((service) => {
                    let resData = service.child,
                      source = null
                    if (repItems.includes(service.name) && resData && resData.length !== 0) {
                      if (service.name === MAP_CONFIG.layerService) {
                        source = resource.layerService.layers
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
                      } else if (service.name === '网络分析服务') {
                        source = resource.netAnalysisService
                        source.url = resData[0].cval
                      } else if (service.name === MAP_CONFIG.dataService) {
                        source = resource.dataService
                        source.url = resData[0].cval
                      }
                    }
                  })
                  this.$nextTick(this.initMap)
                })
            }
          } else this.$message('服务加载失败 启用默认服务配置')
        })
      } else this.$nextTick(this.initMap)
    },
    //初始化地图对象
    initMap() {
      let { initCenter, initZoom } = appconfig
      this.view = new Map({
        target: this.mapTarget,
        view: new View({
          // center: [104.22,30.02],
          // zoom: 10,
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
      var layer = new TileLayer({
        source: new TileSuperMapRest({
          url: 'http://221.182.8.141:8090/iserver/services/map-renshou/rest/maps/city',
          wrapX: true
        }),
        projection: 'EPSG:4326'
      })
      this.view.addLayer(layer)
      this.addLayers()
    },
    //图层添加
    addLayers() {
      let layersSource = appconfig.gisResource['iserver_resource'].layerService.layers.filter(
        (item) => item.type == 'smlayergroup'
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