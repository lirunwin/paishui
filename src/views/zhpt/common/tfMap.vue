
<template>
  <div style="width:100%;height:400px">
    <div ref="map" style="width:100%;height:100%;"
      v-loading="loading" :element-loading-text="loadText"  element-loading-spinner="el-icon-loading" 
      element-loading-background="rgba(255, 255, 255, 0.8)"> 
    </div>
  </div>
</template>

<script>
import request from "@/utils/request"
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import {getTDTAPI} from '@/utils/request'
export default {
  name: 'tfMap',
  data() {
    return {
      loading: true,
      loadText: '',
    }
  },
  watch:{

  }, 
  mounted() {
    this.initConfig()
  },
  methods: {
    initMap() {
      loadModules(
      [
        'esri/Map', 'esri/views/MapView',
        'esri/layers/WebTileLayer', 'esri/Basemap',
        'esri/layers/TileLayer', 'esri/layers/MapImageLayer',
        'esri/layers/support/LOD', "esri/config", 'esri/Graphic'
      ],
      { url: esriConfig.baseUrl }
      ).then(([ Map, MapView, WebTileLayer, Basemap, TileLayer, MapImageLayer, Lod, mapConfig, Graphic]) => {
        mapConfig.fontsUrl = esriConfig.font_url
        this.Graphic = Graphic
        var aconfig = appconfig
        var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
        var layersConfig
        var key = aconfig.isonline ? aconfig.tianMapKey : ''
        var baselayers
        // 判断在线/离线 设置天地图底图
        var tileInfo = aconfig.isonline ? (visible) => {
          return {
            visible: visible,
            subDomains: '01234567'.split('').map(e => 't' + e),
            tileInfo: {
              rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
              lods: Array.from({length:20}, (e, i) => i).map((e, i) => { return {level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i)}})
            }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
          }
        } : (visible) => { return { visible: visible } }
        layersConfig = aconfig.isonline ? [
          [ aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type ], 
          [ aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type ], 
          [ aconfig.gisResource.tian_online_raster.config[0].url, aconfig.gisResource.tian_online_raster.type ], 
          [ aconfig.gisResource.tian_online_raster_label.config[0].url, aconfig.gisResource.tian_online_raster_label.type ], 
          [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
        ] : [
          [ aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type ], 
          [ aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type ], 
          [ aconfig.gisResource.tian_offline_raster.config[0].url, aconfig.gisResource.tian_offline_raster.type ], 
          [ aconfig.gisResource.tian_offline_raster_label.config[0].url, aconfig.gisResource.tian_offline_raster_label.type ], 
          [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
        ]
        baselayers = [
          new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo(true)),
          new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo(true)),
          new layerType[layersConfig[2][1]](layersConfig[2][0] + key, tileInfo(false)),
          new layerType[layersConfig[3][1]](layersConfig[3][0] + key, tileInfo(false)),
          new layerType[layersConfig[4][1]]({ url: layersConfig[4][0] }),
        ]
        // 底图
        var basemap = new Basemap({
          baseLayers: baselayers,
          title: 'basemap',
          id: 'basemap'
        })
        // 地图视角设置缩放步进级别
        basemap.baseLayers.items[4].load().then((e) => {
          mapview.constraints.lods = [125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500, 100].map((s, i) => { return new Lod({ level: i, scale: s }) })
        })
        const map = new Map({ basemap: basemap })
        const mapview = this.mapView = new MapView({
          container: this.$refs.map,
          map: map,
          spatialReference: { wkid: 4490 }
        })
        mapview.ui.components = []
        //初始视角
        this.$nextTick(() => {
          mapview.center = { x: aconfig.initCenter.x, y: aconfig.initCenter.y, spatialReference: mapview.spatialReference }
          mapview.zoom = aconfig.initZoom
          this.Point = new Graphic({
            geometry: { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference },
            symbol: {
              path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
              color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
              size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
            }
          })
          mapview.graphics.add(this.Point)
          this.loading = false
          this.$nextTick(() => {
            if(this.loadDone) this.loadDone() 
          })
        })
      })
    },
    initConfig() {
      var index = appconfig.gisResource
      var nextDo = () => {    
        this.loadText = '地图加载中'
        this.$nextTick(this.initMap)
      }
      if(appconfig.isloadServer) {
        this.loadText = '服务加载中'
        //通过访问天地图地址判断是否可以连接外网
        request({ url: '/base/sourcedic/getTreeService', method: 'get' }).then(res => {
          if (res.code == 1) {
            res = res.result;
            //通过访问天地图地址判断是否可以连接外网,先获取编码isOnlineAddress下的外网地址
            let onlineIndex=res.findIndex(item=>{return item.code=='isOnlineAddress'});
            if(onlineIndex!=-1){
              let isOnline=true;
              let onLineAddress=res[onlineIndex].child[0].cval;
              console.log('判断地址'+onLineAddress);
              axios.get(onLineAddress).then(res=>{
                if(res.status==200){//正常返回
                  isOnline=true
                }else{
                  isOnline=false
                }
              },error=>{//异常返回
                isOnline=false
              }).catch(e=>{
                isOnline=false//异常返回
              }).finally(e=>{
                for (var i = 0, ii = res.length; i < ii; i++) {
                  var dr = res[i]
                  if (index.hasOwnProperty(dr.code)) {
                  //天地图相关的编码
                  let replaceItems=['tian_online_vector','tian_online_raster','tian_online_vector_label','tian_online_raster_label'];
                    //离线状况下替换天地图地址
                    if (!isOnline) {
                      if(replaceItems.findIndex(valItem=> {return valItem==dr.code})!=-1){
                        let index2=res.findIndex(item=>{return item.code==dr.code+'_dl'});
                        if(index2!=-1){
                          let dataItem=res[index2];
                          var odr = index[dr.code]
                          odr.type = dataItem.type
                          odr.groupname = dataItem.name
                          if (dataItem.child) {
                            odr.config = dataItem.child.map(e => {
                              return { 'name': e.name, 'url': e.cval }
                            })
                          }
                        }
                        continue
                      }
                    } 
                    var odr = index[dr.code]
                    odr.type = dr.type
                    odr.groupname = dr.name
                    if (dr.child) {
                      odr.config = dr.child.map(e => {
                        return { 'name': e.name, 'url': e.cval }
                      })
                    }
                  }
                }
                nextDo()
              })
            }
          } else this.$message('服务加载失败 启用默认服务配置')
        })
      } else nextDo()
    },
    drawPoint(isJump, callback) {
      var view = this.mapView
      var dc = callback
      view.container.style.cursor = 'pointer'
      this.click = view.on('click', (evt) => {
        var point = this.Point
        var geo = point.geometry = view.toMap({ x: evt.x, y: evt.y })
        if(isJump) view.goTo({ target: geo, zoom: 6 }, { duration: 1000 }).catch(() => {})
        if(dc) dc(geo.x, geo.y)
        
        this.$nextTick(() => {
          this.click.remove()
          this.click = undefined
          view.container.style.cursor = ''
        })
      })
    },
    setPoint(x, y, isJump) {
      this.loadDone = () => {
        this.Point.geometry = { type: 'point', x, y, spatialReference: this.mapView.spatialReference }
        if(isJump) {
          this.mapView.center = { x, y, spatialReference: this.mapView.spatialReference }
          this.mapView.zoom = appconfig.initZoom
        }
      }
      if(!this.loading) this.loadDone()
    },
    clear() {
      this.loadDone = () => {
        this.Point.geometry = { type: 'point', x: 0, y: 0, spatialReference: this.mapView.spatialReference }
      }
      if(!this.loading) this.loadDone()
    },
    undo() {
      if(this.click) {
        this.click.remove()
        this.click = undefined
        this.mapView.container.style.cursor = ''
      }
    }
  }
}
</script>
