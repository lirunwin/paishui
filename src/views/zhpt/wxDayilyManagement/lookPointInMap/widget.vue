<template>
  <div style="width: 100%; height: 100%; padding:8px;" >
    <div ref='lookPointInMapDiv' style="width: 100%; height: 600px;" class='lookPointInMapDiv'>
    </div>
  </div>
</template>


<script>
import { esriConfig, appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置 
import { loadModules } from 'esri-loader' // 地图包引用
export default {
  name: 'lookPointInMap',
  props: { propData: Object },
  data() {
    return {
      mapShow:null,
      usColor:"#1E90FF",//普通颜色
      hiColor:"#00FFFF",//高亮颜色
    }
  },
  watch:{propData(){
    this.loadMap();
  }},
  mounted() { this.loadMap() },
  methods: {    
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
          'esri/layers/support/LOD', "esri/config", 'esri/Graphic'
        ],
        { url: esriConfig.baseUrl }
      ).then(([ Map, MapView, WebTileLayer, Basemap, TileLayer, MapImageLayer, Lod, mapConfig, Graphic]) => {
        mapConfig.fontsUrl = esriConfig.font_url
        var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
        var layersConfig
        var aconfig = appconfig
        var key = aconfig.isonline ? aconfig.tianMapKey : ''
        var baselayers
        // 判断在线/离线 设置天地图底图
        var tileInfo = aconfig.isonline ?{
          visible: true,
          // 天地图提供了’t0’,‘t1’,‘t2’,‘t3’,‘t4’,‘t5’,‘t6’,'t7’8个域名，服务端TCP最大链接数是有限制的，轮询机制下瓦片下载的速度更有保证； 
          subDomains: '01234567'.split('').map(e => 't' + e),
          tileInfo: {
            rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
            lods: Array.from({length:20}, (e, i) => i).map((e, i) => { return {level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i)}})
          }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
        } : { visible: true }
        layersConfig = aconfig.isonline ? [
          [ aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type ], 
          [ aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type ], 
          [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
        ] : [
          [ aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type ], 
          [ aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type ], 
          [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
        ]
        baselayers = [
          new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo),
          new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo),
          new layerType[layersConfig[2][1]]({ url: layersConfig[2][0] }),
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

        let map = new Map({ basemap: basemap });
        let mapview = this.mapView = new MapView({
          container: this.$refs.lookPointInMapDiv,
          map: map,
          spatialReference: { wkid: 4490 }
        });
          mapview.TF_floatPanel = this.$refs.floatPanels
          mapview.TF_layerInfo = tileInfo
        //初始视角
        this.$nextTick(() => {
          mapview.ui.components = [];
          mapview.center = { x: appconfig.initCenter.x, y: appconfig.initCenter.y, spatialReference: mapview.spatialReference }
          this.mapClear();
          mapview.zoom = appconfig.initZoom;
          this.mapShow=mapview;
          this.$nextTick(()=>{
            debugger
            if(this.propData.type=="allPoint"){
              this.goManyPoint(this.propData.pointList,mapview);
              this.propData.pointList.forEach(item=>{
                this.addPoint(mapview,item,'us',Graphic)
              })
            }else if(this.propData.type=='searchGis'){
              this.propData.searchGis.forEach(item=>{
                this.queryServce(item,mapview,Graphic);
              });
              this.goManyPoint(this.propData.allPointList,mapview);
              this.propData.allPointList.forEach(item=>{
                this.addPoint(mapview,item,'us',Graphic)
              })
            }
          })
        });
      })
    },

    /**
     * 多点的范围
     * 
     * list 多点的集合 view 操作的地图
     * */ 
    goManyPoint(list,view){
      let extent = { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity, spatialReference: view.spatialReference };
      if(list&&list.length>0){
        list.forEach(item=>{
          if (item.x < extent.xmin) extent.xmin = item.x
          if (item.y < extent.ymin) extent.ymin = item.y
          if (item.x > extent.xmax) extent.xmax = item.x
          if (item.y > extent.ymax) extent.ymax = item.y
        })
      };
      if(extent.xmin != Infinity) {
        if(extent.xmin == extent.xmax) {
          view.center = { type: 'point', x: extent.xmin, y: extent.ymin, spatialReference: view.spatialReference }
          if(view.zoom < 6) view.zoom = 6
        } else view.extent = extent
      }
    },

    /**
     * 地图清空
     * mapview 需要清空的地图
     * */ 
    mapClear(mapview){
      if(mapview){
        mapview.graphics.removeAll()
      }
    },

    /**
     * 添加点
     * mapview 添加的地图
     * point   添加的点
     * type    高亮颜色或者普通颜色；高亮点(hi)和普通点(us)
    */
    addPoint(mapview,point,type,Graphic){
      let simpleMarkerSymbol = {
          path:"M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z",
          color: this.usColor,
          outline: { color: this.usColor, width: "1px" },
          size: "30px",
          yoffset: "15px",
          xoffset: "0px",
          type: "simple-marker"
        };
      if(type=='hi'){
        simpleMarkerSymbol.color=this.hiColor;
        simpleMarkerSymbol.outline.color=this.hiColor;
      }
      if(point.x&&point.y){
        let onePoint = new Graphic({
          geometry: { type: 'point', x: point.x, y:point.y, spatialReference: mapview.spatialReference },
          symbol:simpleMarkerSymbol
        })
        mapview.graphics.add(onePoint);
        if(type=="hi"){
          let gotoJson = {
              target:onePoint,
              zoom: 14
          };
          mapview.goTo(gotoJson);
        }
      }
    },

    /**
     * 添加线
     * mapview 添加的地图
     * point   添加的点
     * type    高亮颜色或者普通颜色；高亮点(hi)和普通点(us)
    */
    addLine(mapview,line,type,Graphic){
      let simpleLineSymbol = {
          color: this.usColor,
          width :"10px",
          type: "simple-line"
        };
      if(type=='hi'){
        simpleLineSymbol.color=this.hiColor;
      }
      if(line){
        let onePoint = new Graphic({
          geometry: { type: 'polyline',paths:line, spatialReference: mapview.spatialReference },
          symbol:simpleLineSymbol
        })
        this.addPoint(mapview,{x:line[0][0][0],y:line[0][0][1]},type,Graphic)
        mapview.graphics.add(onePoint);
        if(type=="hi"){
          let gotoJson = {
              target:onePoint,
              zoom: 14
          };
          mapview.goTo(gotoJson);
        }
      }
    },

    /**
     * 查询地图服务(item查询需要的信息,mapview加载的地图)
    */
    queryServce(item,mapview,Graphic){
      let option={
            where:"sid ='"+item.sid+"'",
            returnGeometry: true,
            returnIdsOnly: false,
            outFields: 'sid',
        }
        $.ajax({
            url: appconfig.gisResource.business_map.config[0].url + "/" + item.layerId + "/query?f=pjson",
            type: 'POST',
            data: option,
            success: (data) => {
                data = JSON.parse(data);
                if(data.features&&data.features[0].geometry&&data.features[0].geometry.paths){
                  this.addLine(mapview,data.features[0].geometry.paths,item.type,Graphic)
                }else if(data.features&&data.features[0].geometry){
                  this.addPoint(mapview,data.features[0].geometry,item.type,Graphic)
                }
            },
            error: (error) => this.$message.error(error)
        })
    },
  },
  destroyed(){
    this.mapShow.destroy();
  }
}
</script>
<style scoped>

</style>
