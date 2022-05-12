<template>
  <div ref='queryMapDiv' id='queryMapDiv' style="width:100%;height:100%">
  </div>
</template>

<script>
import {IP} from '@/utils/request'
import { esriConfig, appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置 
import { loadModules } from 'esri-loader' // 地图包引用
import { loadCss } from '@/utils/loadResources'
import request from '@/utils/request'
export default {
  data(){
    return{
      mapView:null,//地图
      result:[],//所有已完成巡检点的完整参数
      pointList:[],//需要渲染的所有点
      pointLayer:[],//点图层
      FeatureLayer:null,//矢量图层对象
      Graphic:null,//图片对象
      graphics:null,//点对象集合
      mapClickEvent:null,//地图点击事件
      geometryEngine:null,//常用工具
      Polyline:null,//线对象
    }
  },
  mounted(){
    loadCss(esriConfig.baseCssUrl) // 本地css资源
    this.addMap();
  },
  methods:{
    /**
     * 加载地图
    */
    addMap(){
      loadModules(
        /**
         * @param 'esri/Map' map类是每个地图控件中必须引入的类，通过Map()对地图进行操作 Map有一个类型为GraphicsLayer的graphics属性。在没有创建新的GraphicsLayer的情况下我所画的graphic都是放在Map的graphics里面。由于map通常都是一个全局变量，因此我们能够在随时的获取到在Map里面的graphic（例如：map.graphics.graphics[0]）。
         */
        ['esri/layers/GraphicsLayer',     "esri/geometry/Polyline",
        "esri/geometry/geometryEngine",
          'esri/Map', 'esri/views/MapView',
          'esri/layers/WebTileLayer', 'esri/Basemap',
          'esri/layers/TileLayer', 'esri/layers/MapImageLayer',
          'esri/layers/support/LOD', "esri/config", 'esri/Graphic',
          "esri/layers/FeatureLayer","esri/smartMapping/labels/clusters",
          "esri/core/Collection", "esri/core/promiseUtils","esri/smartMapping/popup/clusters","esri/widgets/Popup"
        ],
        { url: esriConfig.baseUrl }
      ).then(([ GraphicsLayer,Polyline,geometryEngine,Map, MapView, WebTileLayer, Basemap, TileLayer, MapImageLayer, Lod, mapConfig, Graphic,FeatureLayer,clusterLabelCreator,Collection,promiseUtils,clusterPopupCreator,Popup]) => {
        mapConfig.fontsUrl = esriConfig.font_url
        this.Graphic = Graphic;
        // this.clusterLabelCreator=clusterLabelCreator;
        // this.clusterPopupCreator=clusterPopupCreator;
        // this.Collection=Collection;
        // this.FeatureLayer=FeatureLayer;
        // this.promiseUtils=promiseUtils;
        this.FeatureLayer=FeatureLayer;
        this.geometryEngine=geometryEngine;
        this.Polyline=Polyline;
        var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
        var layersConfig
        var aconfig = appconfig
        var key = aconfig.isonline ? aconfig.tianMapKey : ''
        var baselayers
        // 判断在线/离线 设置天地图底图
        var tileInfo = aconfig.isonline ?{
          visible: true,
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
        let popup=new Popup({
              alignment: 'top-center',
              defaultPopupTemplateEnabled:true,
              dockEnabled: true,
              featureMenuOpen:true,
              content:this.$refs.meterReaderPersonnelPopup,
              dockOptions: {  breakpoint: true,buttonEnabled: false }
          })
        let map = new Map({ basemap: basemap });
        let mapview = this.mapView = new MapView({
          container: this.$refs.queryMapDiv,
          map: map,
          spatialReference: { wkid: 4490 },
          popup: popup
        });
        //初始视角
        this.$nextTick(() => {
          mapview.ui.components = [];
          mapview.center = { x: appconfig.initCenter.x, y: appconfig.initCenter.y, spatialReference: mapview.spatialReference }
          mapview.zoom = appconfig.initZoom;
          this.mapView.map.add(this.pointLayer);
          this.getPointList();
          this.mapClick();
          // this.moveLine = new Graphic({
          //   geometry: { type: 'polyline', paths: [[0,0]], spatialReference: mapview.spatialReference },
          //   symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: this.moveColor, width:this.lineWidth } }
          // })
          // this.Line = new Graphic({
          //   geometry: { type: 'polyline', paths: [[0,0]], spatialReference: mapview.spatialReference },
          //   symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: this.pathColor, width:this.lineWidth } }
          // })
          // this.Point = new Graphic({
          //   geometry: { type: 'point', x: 0, y: 0, spatialReference: mapview.spatialReference },
          //   symbol: { type: 'simple-marker', color: [255, 255, 255], size: this.pointSize, outline: { color:this.pointColor, width: 2 }}
          // })
          // this.tempLayer=new GraphicsLayer();
          // this.mapView.map.add(this.tempLayer);
          // this.tempLayer.addMany([this.Line,this.moveLine, this.Point])
        });
      })
    },
    /**
     * 获取需要渲染的点数据
    */
    getPointList(){
      var url = '/gps/repairorder/getRepairOrderOverVo' 
      request({ url: url, method: 'get' }).then(res => {
        if (res.code == 1) {
          this.result = res.result;
          this.renderPoint();
        } else this.$message.error(res.message)
      })
    },

    /**
     * 地图点击事件
    */
    mapClick(){
      this.mapClickEvent=this.mapView.on('click',e=>{
        this.mapView.hitTest(e,{layer:this.featureLayer}).then(e=>{
          if(e.results){
            e.results.find(item=>{
              if(item.graphic.layer===this.featureLayer){
                const currentMape=item.graphic.attributes;
                if(currentMape.sysIndex){
                  const geo= item.graphic.layer.source.items.find(item2=>{return item2.attributes.sysIndex==currentMape.sysIndex})
                  this.$emit('showPageInfo',geo.attributes.orderId)
                }
              }
            })
          }
          return true
        })
      });
    },

    // /**
    //  * 将中心点转为屏幕点，并根据缓冲半径100px,计算出100px的坐标，计算其距离，然后进行半径缓冲
    // */
    // getPointExten(point){
    //   const screenPoint=this.mapView.toScreen(point);
    //   const tempScreenPoint={x:screenPoint.x-60,y:screenPoint.y};
    //   const temppoint=this.mapView.toMap(tempScreenPoint);
    //   const tempLine=new this.Polyline({ type: 'polyline', paths: [[[point.x,point.y],[temppoint.x,temppoint.y]]], spatialReference: {wkid:4326} });
    //   const length= this.geometryEngine.geodesicLength(tempLine,"meters" );
    //   const extent=this.geometryEngine.geodesicBuffer({ type: 'point', x:point.x,y:point.y, spatialReference: {wkid:4326} },length,"meters");
    //   this.mapView.graphics.add( new this.Graphic({
    //     geometry:extent,
    //     symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
    //   }))
    //   const graphics=[];
      
    //   this.featureLayer.source.items.forEach(item=>{
    //     if(this.geometryEngine.contains(extent, item.geometry)){
    //       graphics.push(item);
    //     }
    //   })
    //   return graphics;
    // },
    /**
     * 渲染点
    */
    renderPoint(){
      this.graphics=[];
      if(this.featureLayer){
        this.mapView.map.remove(this.featureLayer);
        this.featureLayer.destroy();
        this.featureLayer=null;
      }
      this.result.forEach(item=>{
        if(item.x&&item.y){
          this.graphics.push(new this.Graphic({
            geometry:{
              type:"point",
              x:item.x,
              y:item.y,  
              spatialReference:this.mapView.spatialReference
            },
            attributes: item,
          }));
        }
      });
      const featureReduction={
        type: "cluster",
        clusterRadius: "120px",
        clusterMinSize: "30px",
        clusterMaxSize: "60px",
        popupTemplate :{
            title: "维修个数",
            content:[
            {
              type: "text",
              text: "当前范围维修个数<b>{cluster_count}</b>个."
            },
            ],
          },
        popupEnabled:false,
        labelingInfo: [{
          deconflictionStrategy: "none",
          labelExpressionInfo: {
            expression: "Text($feature.cluster_count, '#,###')"
          },
          symbol: {
            type: "text",
            color: "#FFFFFF",
            font: {
              weight: "bold",
              family: "Noto Sans",
              size: "14px"
            }
          },
          labelPlacement: "center-center",
        }]
    }
      this.featureLayer=new this.FeatureLayer({
          source: this.graphics,
          popupEnabled:false,
          renderer: { type: "simple", symbol: { type: 'simple-marker', color: [	0,206,209,0.8], size: 10, outline: { color: [	0,206,209], width: 1 } } },
          // renderer: { type: "simple", symbol: { type: 'simple-marker', color: [64,145,255,0.8], size: 10, outline: { color: [64,145,255], width: 1 } } },
          objectIdField: "sysIndex",
          geometryType: "point",
          symbol:{
              type: "simple-marker", 
              color: "#00FFFF",
              size:'20px',
              outline: { 
                  color: "#00FFFF",
                  width: "10px"
              }
          },
          featureReduction:featureReduction,
          fields: [
          {
            name: "orderId",
            alias: "抢维修唯一值",
            type: "string"
          },
          {
            name: "y",
            alias: "y坐标",
            type: "double"
          },{
            name: "x",
            alias: "x坐标",
            type: "double"
          }],
        });
        this.mapView.map.add( this.featureLayer);
        this.mapView.watch('scale',res=>{
          if(res<=1000){
            this.featureLayer.featureReduction=null;
          }else{
          if(!this.featureLayer.featureReduction){
            this.featureLayer.featureReduction=featureReduction
          }
        }
      });
    }
  }
}
</script>
<style lang="sass" scoped>

</style>