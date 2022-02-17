<template>
  <div style="width: 100%; height: 100%; padding:15px;">
    <i class="el-icon-info" style="font-size: 16px;color: gray;" title="点击地图选取地点" />
    <div ref="lookPointInMapDiv" style="width: 100%; height: 600px;padding-bottom: 10px;" class="lookPointInMapDiv" />
    <span slot="footer" style="float:right;margin-top:10px" right class="dialog-footer">
      <el-button type="primary" size="small" @click="closePop">取消</el-button>
      <el-button type="primary" size="small" @click="addPoint">确定</el-button>
    </span>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置
import { loadModules } from 'esri-loader' // 地图包引用
export default {
  name: 'GetPointInMap',
  data() {
    return {
      point: {
        x: 0,
        y: 0
      },
      popupShow: false
    }
  },
  mounted() { this.loadMap() },
  methods: {
    /**
       * 关闭指令
       * */
    closePop() {
      this.$emit('popState', false)
    },

    /**
     * 传送点信息
     * */
    addPoint() {
      if (this.point.x == 0 || this.point.y == 0) {
        this.$message.info('请点击地图选取地点')
        return
      }
      this.$emit('getPoint', this.point)
    },

    /**
     * 加载地图
     * */
    loadMap() {
      // loadModules( [ ], options) 用于加载arcgis 模块,
      loadModules(
        /**
         * @param 'esri/Map' map类是每个地图控件中必须引入的类，通过Map()对地图进行操作 Map有一个类型为GraphicsLayer的graphics属性。在没有创建新的GraphicsLayer的情况下我所画的graphic都是放在Map的graphics里面。由于map通常都是一个全局变量，因此我们能够在随时的获取到在Map里面的graphic（例如：map.graphics.graphics[0]）。
         */
        [
          'esri/Map', 'esri/views/MapView',
          'esri/layers/WebTileLayer', 'esri/Basemap',
          'esri/layers/TileLayer', 'esri/layers/MapImageLayer',
          'esri/layers/support/LOD', 'esri/config', 'esri/Graphic'
        ],
        { url: esriConfig.baseUrl }
      ).then(([Map, MapView, WebTileLayer, Basemap, TileLayer, MapImageLayer, Lod, mapConfig, Graphic]) => {
        mapConfig.fontsUrl = esriConfig.font_url
        var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
        var layersConfig
        var aconfig = appconfig
        var key = aconfig.isonline ? aconfig.tianMapKey : ''
        var baselayers
        // 判断在线/离线 设置天地图底图
        var tileInfo = aconfig.isonline ? {
          visible: true,
          // 天地图提供了’t0’,‘t1’,‘t2’,‘t3’,‘t4’,‘t5’,‘t6’,'t7’8个域名，服务端TCP最大链接数是有限制的，轮询机制下瓦片下载的速度更有保证；
          subDomains: '01234567'.split('').map(e => 't' + e),
          tileInfo: {
            rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
            lods: Array.from({ length: 20 }, (e, i) => i).map((e, i) => { return { level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i) } })
          }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
        } : { visible: true }
        layersConfig = aconfig.isonline ? [
          [aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type],
          [aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type],
          [aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type]
        ] : [
          [aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type],
          [aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type],
          [aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type]
        ]
        baselayers = [
          new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo),
          new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo),
          new layerType[layersConfig[2][1]]({ url: layersConfig[2][0] })
        ]
        // 底图
        var basemap = new Basemap({
          baseLayers: baselayers,
          title: 'basemap',
          id: 'basemap'
        })
        // 地图视角设置缩放步进级别
        basemap.baseLayers.items[2].load().then((e) => {
          mapview.constraints.lods = [125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500].map((s, i) => { return new Lod({ level: i, scale: s }) })
        })

        const map = new Map({ basemap: basemap })
        const mapview = this.mapView = new MapView({
          container: this.$refs.lookPointInMapDiv,
          map: map,
          spatialReference: { wkid: 4490 }
        })
        mapview.TF_floatPanel = this.$refs.floatPanels
        mapview.TF_layerInfo = tileInfo
        // 初始视角
        this.$nextTick(() => {
          mapview.ui.components = []
          mapview.center = { x: appconfig.initCenter.x, y: appconfig.initCenter.y, spatialReference: mapview.spatialReference }
          mapview.zoom = appconfig.initZoom
          mapview.on('click', event => {
            const simpleMarkerSymbol = {
              path:
                'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
              color: '#48D1CC',
              outline: { color: '#48D1CC', width: '1px' },
              size: '30px',
              yoffset: '15px',
              xoffset: '0px',
              type: 'simple-marker'
            }
            mapview.graphics.removeAll()
            const onePoint = new Graphic({
              geometry: { type: 'point', x: event.mapPoint.x, y: event.mapPoint.y, spatialReference: mapview.spatialReference },
              symbol: simpleMarkerSymbol
            })
            mapview.graphics.add(onePoint)
            this.point.x = event.mapPoint.x
            this.point.y = event.mapPoint.y
          })
        })
      })
    }
  }
}
</script>
<style scoped>

</style>
