<template>
    <div ref="commonPopup" class="common-popup" v-show="isShow">
        <div class="popup-header"  :style="headerStyle">
            <div class="popup-title">{{ title || ' ' }}</div>
            <div class="popup-operation">
                <i :class="item.icon" :style="{'color':item.color}" v-for="item of operationGroup" :key="item.action" @click="operationClick(item)"></i>
            </div>
        </div>
        <a href="#" class="common-popup-closer" @click="closePopup()"></a>
        <div class="popup-content">
            <slot/>
        </div>
    </div>
</template>

<script>
import Overlay from 'ol/Overlay';
export default {
    name:"commonPopup",//公共地图信息弹窗
    props: {
        mapView:{required:true},//地图对象
        popupPosition: { type: Array },//弹窗位置(经纬度)
        popupShow: { type: Boolean },//弹窗显示
        popupTitle: {type: String },//弹窗标题
        headerStyle: {type: String,default:"border-bottom:1px solid #cccccc"},//头部样式
        isSetCenter:{type: Boolean,default: false},//是否视图定位至中心
        operationGroup:{type:Array,default: () => []}//例如：operationGroup:[{icon:"iconfont icondtbz",color:"royalblue",action:"detail"},],
    },
    data() {
        return {
            dialogOverlay: null,//组件Overlay
            isShow: true,       //弹窗显示
            title:"",           //弹窗标题
            center:null,        //是否设置定位
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
            handler () {
                this.showPopup()
            },
            deep: true
        },
        popupShow:{
            handler(val){
                this.isShow = val
            },
            deep: true,
            immediate: true
        }
    },
    methods:{
        //显示弹窗
        showPopup(){
            if(this.dialogOverlay) {
                this.mapView.removeOverlay(this.dialogOverlay)
            }
            this.dialogOverlay= new Overlay({
                element: this.$refs.commonPopup,
                stopEvent: false,
                offset: [0, 0],
                autoPan: {
                    animation: {
                        duration: 250,
                    },
                },
            });
            this.mapView.addOverlay(this.dialogOverlay)
            this.dialogOverlay.setPosition(this.popupPosition)
            if(this.isSetCenter) this.setCenter()
        },
        //设置视图定位
        setCenter(){
            this.mapView.getView().setCenter(this.popupPosition)
            this.mapView.getView().setZoom(20)
        },
        //弹窗关闭
        closePopup(){
            this.dialogOverlay.setPosition(undefined);
            this.mapView.removeOverlay(this.dialogOverlay)
            return false;
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
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
}
.popup-header{
    padding-bottom: 4px;
    margin-bottom: 10px;
    padding-right: 20px;
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
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.common-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.common-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 14px;
    right: 15px;
}
.common-popup-closer:after {
    content: "✖";
}
</style>