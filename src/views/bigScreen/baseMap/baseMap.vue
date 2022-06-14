<template>
    <div class="widget-bigScreenBaseMap">
        <MapView />
        <!--巡查人员信息弹窗-->
        <InfoPopup
            ref="inspectorsPopup"
            :mapView="view"
            :popupPosition="inspectorsPosition"
            :styleData="inspectorsCardStyle"
        >
            <InspectorsCard />
        </InfoPopup>
        <!--汛情上报信息弹窗-->
        <InfoPopup
            ref="floodReportPopup"
            :mapView="view"
            :popupPosition="floodReportPosition"
            :styleData="floodReportCardStyle"
        >
            <FloodReportCard />
        </InfoPopup>
        <!--易涝点视频信息弹窗-->
        <InfoPopup
            ref="floodProneVideoPopup"
            :mapView="view"
            :popupPosition="videoPosition"
            :styleData="floodProneVideoCardStyle"
        >
            <FloodProneVideoCard v-on="$listeners"/>
        </InfoPopup>
    </div>
</template>

<script>
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {
  Style,
  Circle,
  Icon,
  Fill,
  RegularShape,
  Stroke,
  Text
} from 'ol/style';
import MapView from './components/mapView.vue'
import InfoPopup from './components/infoPopup.vue'
import InspectorsCard from './components/infoCard/inspectorsCard.vue'
import FloodReportCard from './components/infoCard/floodReportCard.vue'
import FloodProneVideoCard from './components/infoCard/floodProneVideoCard.vue'
import config from './config.json'
export default {
    name:'bigScreenBaseMap',//大屏背景地图
    components:{
        MapView,
        InfoPopup,
        InspectorsCard,
        FloodReportCard,
        FloodProneVideoCard
    },
    props:{
        fontSize:{
            type:Function,
            default:()=>{
                return Function
            }
        }
    },
    data(){
        return{
            view:null,
            mapEvent:"",//地图事件

            vectorSource:null,
            vectorLayer:null,
            featureList:[
                {
                    type:"工程车辆",
                    position:[
                        101.71269021536666,
                        26.584189390793085
                    ],
                    info:{}
                },
                {
                    type:"巡检人员",
                    position:[
                        101.72248091953819,
                        26.58450934844575
                    ],
                    info:{}
                },
                {
                    type:"视频",
                    position:[
                        101.71708430046324,
                        26.580627195593422
                    ],
                    info:{}
                },
            ],
            //弹窗位置
            inspectorsPosition:null,
            floodReportPosition:null,
            videoPosition:null,
            //信息卡弹窗样式
            inspectorsCardStyle:config.inspectorsCardStyle,
            floodReportCardStyle:config.floodReportCardStyle,
            floodProneVideoCardStyle:config.floodProneVideoCardStyle,
        }
    },
    watch:{
        view(){
            this.initMapEvent();
            this.initVectorLayer();
        }
    },
    mounted(){

    },
    methods:{
        //初始化地图事件
        initMapEvent(){
            //地图单击事件
            let gl = this;
            this.mapEvent=this.view.on('singleclick', function (evt) {
                let pixel = gl.view.getEventPixel(evt.originalEvent)
                gl.view.forEachFeatureAtPixel(pixel,function(feature){
                    gl.handleClick(feature.getProperties())
                });
            });
        },
        //初始化矢量图层源
        initVectorLayer(){
            // 矢量图层源
            this.vectorSource = new VectorSource({
                wrapX: false,
            });
            //创建矢量层
            this.vectorLayer = new VectorLayer({
                source: this.vectorSource
            });
            //将图层添加到地图中
            this.view.addLayer(this.vectorLayer);
            this.showMapFeatureInfo()
        },
        //显示地图要素
        showMapFeatureInfo(){
            this.featureList.forEach((item)=>{
                const {type,position,info}=item
                this.showPointSymbol(type,position,info)
            })
        },
        //显示点符号
        showPointSymbol(type,position,info){
            // this.vectorSource.clear()
            //创建Feature，并添加进矢量容器中
            const feature = new Feature({
                geometry: new Point(position),
                name:type,
                info
            });
            //创建标记的样式
            feature.setStyle(this.setFeatureStyle(type));
            this.vectorSource.addFeature(feature);
        },
        //地图点击回调 @data 要素信息
        handleClick(data){
            const {geometry,info,name}=data;
            switch(name){
                case '工程车辆':
                    this.inspectorsPosition=[...geometry.flatCoordinates];
                    break;
                case '巡检人员':
                    this.floodReportPosition=[...geometry.flatCoordinates];
                    break;
                case '视频':
                    this.videoPosition=[...geometry.flatCoordinates];
                    break;
            }
        },
        //为要素设置样式
        setFeatureStyle(type) {
            switch(type){
                case '工程车辆':return new Style({
                            image: new Icon({
                                anchor: [0.5, 0.7],
                                scale:0.7,
                                //图标的url
                                src: require('@/views/bigScreen/baseMap/images/工程车辆.png')
                            })
                        });
                case '巡检人员':return new Style({
                            image: new Icon({
                                anchor: [0.5, 0.7],
                                scale:0.7,
                                //图标的url
                                src: require('@/views/bigScreen/baseMap/images/巡查人员.png')
                            })
                        });
                case '视频':return new Style({
                            image: new Icon({
                                anchor: [0.5, 0.7],
                                scale:0.7,
                                //图标的url
                                src: require('@/views/bigScreen/baseMap/images/视频.png')
                            })
                        });
            }

        },
    }
}
</script>

<style lang='scss' scoped>
.widget-bigScreenBaseMap{
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    // background: #000;
}
</style>