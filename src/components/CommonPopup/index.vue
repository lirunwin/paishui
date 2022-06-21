<template>
    <div ref="commonPopup" class="common-popup" 
    v-show="isShow" 
    @mouseenter="setPanActive(false)" 
    @mouseleave="setPanActive(true)"
    @click="reload()">
        <div class="popup-header"  :style="headerStyle" v-show="isHeaderShow">
            <div class="popup-title">{{ title || ' ' }}</div>
            <div class="popup-operation">
                <i :class="item.icon" :style="{'color':item.color}" v-for="item of operationGroup" :key="item.action" @click="operationClick(item)"></i>
            </div>
        </div>
        <div class="popup-content">
            <slot/>
        </div>
        <a href="#" class="common-popup-closer" @click="closePopup()"></a>
    </div>
</template>

<script>
import Overlay from 'ol/Overlay';
import DragPan from 'ol/interaction/DragPan'
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {Style,Icon,} from 'ol/style';
export default {
    name:"commonPopup",//公共地图信息弹窗
    props: {
        mapView:{required:true},//地图对象
        popupPosition: { type: Array },//弹窗位置(经纬度)
        popupTitle: {type: String },//弹窗标题
        isHeaderShow:{type: Boolean},//是否显示头部
        headerStyle: {type: String,default:"border-bottom:1px solid #cccccc"},//头部样式
        isSetCenter:{type: Boolean,default: false},//是否视图定位至中心
        operationGroup:{type:Array,default: () => []},//例如：operationGroup:[{icon:"iconfont icondtbz",color:"royalblue",action:"detail"},],
        right:{type:Number,default:-175}
    },
    data() {
        return {
            dialogOverlay: null,//组件Overlay
            isShow: false,       //弹窗显示
            title:"",           //弹窗标题
            center:null,        //是否设置定位
            pan:null,
            vectorLayer:null,
            feature:null,
        }
    },
    watch:{
        popupTitle:{
            handler (val) {
                this.title=val
            },
            deep: true
        },
        popupPosition: {
            handler (n,o) {
                if(n){
                    this.isShow=true
                    this.$nextTick(()=>{
                        this.showPopup()
                    })
                }else{
                    this.closePopup()
                }
            },
            deep: true,
            immediate:true
        },
    },
    mounted(){
        this.$refs['commonPopup'].style.setProperty('--right', this.right+'px')
    },
    methods:{
        initVector(){
            if(this.vectorLayer){
                this.vectorLayer.getSource().clear()
            }
            //创建矢量层
            this.vectorLayer = new VectorLayer({
                source: new VectorSource({wrapX: false,})
            });
            //将图层添加到地图中
            this.mapView.addLayer(this.vectorLayer);
        },
        getPan() {
            this.mapView.getInteractions().forEach(element => {
                if (element instanceof DragPan) {
                    this.pan = element
                }
            })
        },
        setPanActive(bool){
            this.getPan();
            this.pan.setActive(bool)
        },
        //显示弹窗
        showPopup(){
            this.initVector()
            if(this.dialogOverlay) {
                this.mapView.removeOverlay(this.dialogOverlay)
            }
            this.dialogOverlay= new Overlay({
                id:window.id,
                element: this.$refs.commonPopup,
                stopEvent: false,
                offset: [0, 0],
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
                insertFirst:false
            });
            this.mapView.addOverlay(this.dialogOverlay)
            this.dialogOverlay.setPosition(this.popupPosition)
            this.showPointSymbol(this.popupPosition)
            if(this.isSetCenter) this.setCenter()
        },
        //设置视图定位
        setCenter(){
            this.mapView.getView().setCenter(this.popupPosition)
            this.mapView.getView().setZoom(19)
        },
        //设置点要素
        showPointSymbol(position){
            this.vectorLayer.getSource().clear()
            //创建Feature，并添加进矢量容器中
            this.feature = new Feature({
                geometry: new Point(position),
                name: 'commonPopUpPoint',
            });
            //创建标记的样式
            this.feature.setStyle(this.setFeatureStyle());
            this.vectorLayer.getSource().addFeature(this.feature);
        },
        /**
         * @description 为要素设置样式
         */
        setFeatureStyle() {
            return new Style({
                image: new Icon({
                    anchor: [0.5, 0.7],
                    scale:0.15,
                    //图标的url
                    src: require('@/assets/images/point.png')
                })
            });
        },
        //重新加载弹窗
        reload(){
            if(this.dialogOverlay){
                this.mapView.removeOverlay(this.dialogOverlay)
                this.mapView.addOverlay(this.dialogOverlay)
                this.dialogOverlay.setPosition(this.popupPosition)
            }
        },
        //弹窗关闭
        closePopup(){
            this.reset();
            if(this.dialogOverlay){
                this.dialogOverlay.setPosition(undefined);
                this.mapView.removeOverlay(this.dialogOverlay)
                this.dialogOverlay=null
                this.vectorLayer.getSource().clear()
                this.vectorLayer=null
            }
            this.$emit('close')
            return false;
        },
        //变量清除
        reset(){
            this.isShow=false;
            if(this.pan) this.pan.setActive(true)
        },
        //右上角图标操作
        operationClick(item){
            this.$emit(item.action)
        }
    }
}
</script>

<style lang="scss" scoped>
.common-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    // padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    // bottom: 12px;
    // left: -50px;
    top: 30px;
    right: var(--right);
    min-width: 280px;
}
.popup-header{
    // padding-bottom: 4px;
    // margin-bottom: 10px;
    // padding-right: 20px;
    padding: 15px;
    min-height: 22px;
    display: flex;
    .popup-title{
        font-size: 16px;
    }
    .popup-operation{
        padding: 0 20px;
        letter-spacing: 10px;
        i{
            cursor: pointer;
        }
    }
}
.common-popup:after, .common-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.common-popup:after {
    border-bottom-color: white;
    border-width: 10px;
    left: 50%;
    top: -22px;
}
.common-popup:before {
    border-bottom-color: #cccccc;
    border-width: 10px;
    left: 50%;
    top: -23px;
}
.common-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 0;
    /* right: -10px; */
    right: -20px;
    background-color: white;
    padding: 2px;
    border-radius: 10px;
}
.common-popup-closer:after {
    content: "✖";
}
</style>