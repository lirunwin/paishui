<template>
    <div class="portMapView" id="portMapView">

    </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import {
  Style,
  Circle,
  Icon,
  Fill,
  RegularShape,
  Stroke,
  Text
} from 'ol/style'
export default {
    name:"portMapView",//
    data(){
        return{
            view:null,
            drawer:null,
            customFeature:null,
            ysFeatures:[],
            wsFeatures:[],
            yswsFeatures:[],
            ysLayer:null,
            wsLayer:null,
            yswsLayer:null,
        }
    },
    mounted(){
        this.initMap();
    },
    methods:{
        initMap(){
            let { initCenter, initZoom } = appconfig
            this.view = new Map({
                target: 'portMapView',
                view: new View({
                    center: initCenter,
                    zoom: initZoom,
                    maxZoom: 20,
                    minZoom: 9,
                    projection: 'EPSG:4326'
                })
            })
            this.addLayers();
            this.initDataSet();
        },
        addLayers(){
            let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
            layerResource.forEach((layerConfig) => {
                let { name, type, url, parentname, id, visible = true } = layerConfig
                let layer = new TF_Layer().createLayer({ url, type, visible, properties: { id, name, parentname } })
                this.view.addLayer(layer)
            })
        },
        initDataSet(){
            let dataService = appconfig.gisResource['iserver_resource'].dataService
            this.dataSetInfo = dataService.dataSetInfo.filter(info => info.label === '排放口')
        },
        // 开启缩放和拖动
        zoomAndMove() {
            //地图缩放和平移事件回调函数
            let mapZoomAndMove = () =>{
                // 展示 extent
                let extent=this.view.getView().calculateExtent(this.view.getSize());
                let feature = this.getMapRange(extent)
                this.query(feature)
            }
            //注册事件
            this.registerOnZoom(mapZoomAndMove);
        },
        // 注册地图缩放和拖动事件方法
        // 第一个参数是监听事件，第二个参数为是否开启监听拖动（true为不开启）
        registerOnZoom(eventListen, notListenMove) {
            let map =this.view
            // 记录地图缩放，用于判断拖动
            map.lastZoom = map.lastZoom || map.getView().getZoom();
            // 地图缩放事件
            let registerOnZoom = function (e) {
                // 不监听地图拖动事件
                if (notListenMove) {
                    if (map.lastZoom != map.getView().getZoom()) {
                        eventListen && eventListen(e);
                    }
                } else {
                    eventListen && eventListen(e);
                }
                map.lastZoom = map.getView().getZoom();
            }
            // 保存缩放和拖动事件对象，用于后期移除
            let registerOnZoomArr = map.get('registerOnZoom') || [];
            registerOnZoomArr.push(registerOnZoom);
            // 使用地图 set 方法保存事件对象
            map.set('registerOnZoom', registerOnZoomArr);
            // 监听地图移动结束事件
            map.on('moveend', registerOnZoom);
            return eventListen;
        },
        // 移除缩放和拖动事件对象
        removeZoomRegister() {
            this.removeLayer()
            let map = this.view
            let registerOnZoomArr = map.get('registerOnZoom');
            if (registerOnZoomArr && registerOnZoomArr.length > 0) {
                for (let i = 0; i < registerOnZoomArr.length; i++) {
                    map.un('moveend', registerOnZoomArr[i]);
                }
            }
            console.log(registerOnZoomArr)
        },
        //自定义范围
        customRange(type){
            this.drawer && this.drawer.end()
            this.removeLayer()
            // this.queryLayer && this.queryLayer.getSource().clear()
            this.drawer = new iDraw(this.view, type, {
                endDrawCallBack: feature => {
                    this.drawer.remove()
                    this.customFeature=feature
                },
                showCloser: true,
                drawStyle:{
                    pointSize:5,
                    pointColor:'rgb(246,82,82)',
                    lineWidth:2,
                    lineColor:'rgb(246,82,82)',
                    fillColor:'rgba(246,82,82,0.1)',
                    lineDash:[0,0]
                }
            })
            this.drawer.start()
        },
        checkType(type){
            switch(type){
                // case 'all': this.allRange();
                //             break;
                case 'map': let size =this.view.getSize();
                            let extent = this.view.getView().calculateExtent(size);
                            let feature=this.getMapRange(extent);
                            this.query(feature);
                            break
                case 'custom':this.query(this.customFeature);
                            break
            }
        },
        //地图范围
        getMapRange(extent){
            //创建Feature，并添加进矢量容器中
            let feature = new Feature({
                geometry: new Polygon([[[extent[0], extent[1]], [extent[0], extent[3]], [extent[2], extent[3]], [extent[2], extent[1]],[extent[0], extent[1]]]]),
                name: 'mapRange'
            });
            return feature
        },
        //空间查询
        query(feature) {
            console.log(feature)
            if(!feature) return
            let that=this;
            this.removeLayer()
            let queryTask = new iQuery({ dataSetInfo:this.dataSetInfo })
            queryTask.spaceQuery(feature).then(resArr => {
                let features = []
                console.log("结果",resArr)
                resArr.forEach(item => {
                    if (item && item.result.featureCount !== 0) {
                        features.push(item.result.features)
                    }
                })
                if(features.length==0){
                    that.$message('暂无数据！')
                    return
                }
                that.ysFeatures=[];
                that.wsFeatures=[];
                that.yswsFeatures=[];
                features.forEach(feaJson => {
                    that.classification(new GeoJSON().readFeatures(feaJson))
                })
                that.initLayer();
            })
        },
        classification(features){
            features.forEach(item=>{
                switch(item.values_.TYPE){
                    case '雨水':this.ysFeatures.push(item)
                              break
                    case '污水':this.wsFeatures.push(item)
                              break
                }
            })
        },
        // 初始化图层
        initLayer() {
            this.ysLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'blue'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                })
            })
            this.wsLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'red'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                })
            })
            this.view.addLayer(this.ysLayer)
            this.view.addLayer(this.wsLayer)
            this.ysLayer.getSource().addFeatures(this.ysFeatures)
            this.wsLayer.getSource().addFeatures(this.wsFeatures)
        },
        //删除
        removeLayer(){
            this.view.removeLayer(this.ysLayer)
            this.view.removeLayer(this.wsLayer)
            this.view.removeLayer(this.yswsLayer)
        },
    }
}
</script>

<style lang="scss" scoped>
    .portMapView{
        height: 100%;
        width: 50%;
        // float: left;
        /deep/ .ol-zoom {
        display: none !important;
        }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
</style>