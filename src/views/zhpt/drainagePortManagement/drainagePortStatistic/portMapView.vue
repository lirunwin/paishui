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
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature';
import {Polygon, LineString, Point } from 'ol/geom';
import CircleObject from 'ol/geom/Circle'
import {fromCircle} from 'ol/geom/Polygon';
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
            projectName:'',
            view:null,
            drawer:null,
            customFeature:null,
            limitFeature:null,
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
            this.getSelectInfo();
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
        //获取项目以及地址下拉框内容
        getSelectInfo(){
            let projectInfo=[];
            let queryTask = new iQuery({ dataSetInfo:this.dataSetInfo })
            let queryText = `SMID >= 0 `
            queryTask.sqlQuery(queryText).then(resArr => {
                let features = []
                resArr.forEach(item => {
                    if (item && item.result.featureCount !== 0) {
                        features.push(item.result.features)
                    }
                })
                if(features.length==0) return
                let featuresInfo = features[0].features
                featuresInfo.forEach(item=>{
                    let {PRJ_NAME} = item.properties
                    projectInfo.push(PRJ_NAME)
                })
                projectInfo=[...new Set(projectInfo)]
                this.$parent.getProjectInfo(projectInfo)
            }).catch(err=>{
                console.log(err)
            })
        },
        // 开启缩放和拖动
        zoomAndMove() {
            //地图缩放和平移事件回调函数
            let mapZoomAndMove = () =>{
                this.getMapRange()
                this.queryTerm()
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
        //查看结果
        checkResult(type){
            this.removeLayer();
            switch(type){
                case 'all':this.limitFeature=null;
                            break
                case 'map': this.getMapRange();
                            break
                case 'custom': this.limitFeature=this.customFeature;
                            break
            }
            this.queryTerm();
        },
        //地图范围
        getMapRange(){
            // 展示 extent
            let extent=this.view.getView().calculateExtent(this.view.getSize());
            //创建Feature，并添加进矢量容器中
            let feature = new Feature({
                geometry: new Polygon([[[extent[0], extent[1]], [extent[0], extent[3]], [extent[2], extent[3]], [extent[2], extent[1]],[extent[0], extent[1]]]]),
                name: 'mapRange'
            });
            this.limitFeature=feature
        },
        //条件查询
        queryTerm(){
            this.removeLayer();
            let prjName=[];
            this.projectName.forEach(item=>{
                prjName.push(`PRJ_NAME = '${item}'`)
            })
            prjName=prjName.join(' or ')
            let queryTask = new iQuery({ dataSetInfo:this.dataSetInfo })
            let queryText = ``
            // console.log(queryText)
            queryTask.sqlQuery(queryText).then(resArr => {
                let featruesData = resArr.filter(item => {
                    return item.result.featureCount !== 0
                })
                // 数据过滤
                if (featruesData.length !== 0) {
                    this.filterFeatures(featruesData)
                }else{
                    this.showThem=false;
                    this.$message('暂无数据！')
                    return
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        filterFeatures(featruesData){
            // console.log(featruesData)
            featruesData.forEach(featrueObj => {
                let features = featrueObj.result.features.features
                let themFeatures = features.map(feature => new GeoJSON().readFeature(feature))
                // 范围限制
                if (this.limitFeature) {
                    let limitGeometry 
                    if(this.limitFeature.getGeometry() instanceof CircleObject){
                        let polygon = fromCircle(this.limitFeature.getGeometry())
                        limitGeometry=turf.polygon(polygon.getCoordinates())
                    }else{
                        limitGeometry = turf.polygon(this.limitFeature.getGeometry().getCoordinates())
                    }
                    themFeatures = themFeatures.filter(feature => {
                        let geomtry = feature.getGeometry(), inGeometry
                        if (geomtry instanceof Point) {
                            inGeometry = turf.point(geomtry.getCoordinates())
                        } else if (geomtry instanceof LineString) {
                            inGeometry = turf.lineString(geomtry.getCoordinates())
                        } else return false
                        return turf.booleanContains(limitGeometry, inGeometry)
                    })
                }
                this.showTematicMap(themFeatures)
            })
        },
        showTematicMap(themFeatures){
            if(themFeatures.length==0){
                this.showThem=false;
                this.$message('暂无数据！')
                return
            }
            this.ysFeatures=[];
            this.wsFeatures=[];
            this.yswsFeatures=[];
            //地图要素添加
            themFeatures.forEach(feaJson => {
                this.classification(feaJson)
            })
            this.initLayer();
            this.resultStatistic(themFeatures);
        },
        classification(features){
            switch(features.values_.TYPE){
                case '雨水':this.ysFeatures.push(features)
                            break
                case '污水':this.wsFeatures.push(features)
                            break
                case '雨污合流':this.yswsFeatures.push(features)
                            break
            }
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
            this.yswsLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'brown'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                })
            })
            this.view.addLayer(this.ysLayer)
            this.view.addLayer(this.wsLayer)
            this.view.addLayer(this.yswsLayer)
            this.ysLayer.getSource().addFeatures(this.ysFeatures)
            this.wsLayer.getSource().addFeatures(this.wsFeatures)
            this.yswsLayer.getSource().addFeatures(this.yswsFeatures)
        },
        //结果统计
        resultStatistic(result){
            this.$parent.statisticResultNum=result.length;//结果总数
            //统计信息
            let all=this.ysFeatures.length+this.wsFeatures.length+this.yswsFeatures.length
            this.$parent.portTypeInfo=[
                { name: '雨水',value: this.ysFeatures.length,percent:this.calcPercent(this.ysFeatures.length,all)},
                { name: '污水',value: this.wsFeatures.length,percent:this.calcPercent(this.wsFeatures.length,all)},
                { name: '雨污合流',value:this.yswsFeatures.length,percent:this.calcPercent(this.yswsFeatures.length,all)},
            ];
            this.$parent.ownershipUnits=this.arrStatistic(result.map(item=>item.values_.BELONG))
            this.$parent.roadName=this.arrStatistic(result.map(item=>item.values_.ADDRESS))
        },
        calcPercent(index1,index2){
            return index2==0?0:((index1/index2)*100).toFixed(2)+"%"
        },
        arrStatistic(arr){
            let resArr=[];
            const obj = arr.reduce((obj,key)=>{
                if (key in obj){
                    obj[key]++
                }else{
                    obj[key]=1
                }
                return obj
            },{})
            for(let key in obj){
                resArr.push({name:key,value:obj[key],percent:this.calcPercent(obj[key],arr.length)})
            }
            return resArr
        },
        //删除
        removeLayer(){
            this.view.removeLayer(this.ysLayer)
            this.view.removeLayer(this.wsLayer)
            this.view.removeLayer(this.yswsLayer)
        },
        //变量清除
        resetStatistic(){

        }
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