<template>
    <div class="widget-infoPopup" ref="infoPopup" 
    v-if="isShow"
    @mouseenter="setPanActive(false)" 
    @mouseleave="setPanActive(true)"
    @click="reload()">
        <div class="box">
            <slot />
        </div>
        <div class="box-close" @click="closePopup()"></div>
        <div class="box-line"></div>
        <div class="box-point"></div>
        <div class="box-outline"></div>
    </div>
</template>

<script>
import Overlay from 'ol/Overlay';
import DragPan from 'ol/interaction/DragPan'//先在项目中引用此包
export default {
    name:'infoPopup',//信息弹窗载体
    props: {
        mapView:{required:true},//地图对象
        popupPosition: { type: Array },//弹窗位置(经纬度)
        isSetCenter:{type: Boolean,default: false},//是否视图定位至中心
        styleData:{
            type:Object,
            default:()=>{
                return{
                    '--height':'1.09375rem' /* 210/192 */,      //高度
                    '--width':'1.25rem' /* 240/192 */,          //宽度
                    '--borderColor':'rgba(255, 172, 41,0.76)',  //边框线颜色
                    '--backgroundColor':'rgba(7, 38, 67,0.54)', //背景颜色
                }
            }
        }
    },
    data(){
        return{
            dialogOverlay: null,//组件Overlay
            isShow: false,       //弹窗显示
            pan:null,
        }
    },
    watch:{
        mapView(n,o){
            this.mapView=n
        },
        popupPosition:{
            handler(n,o){
                n?this.showPopup():this.closePopup()
            }
        }
    },
    mounted(){
    },
    methods:{
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
        showPopup(){
            this.isShow=true
            this.$nextTick(()=>{
                this.setStyle()
                this.setPopup()
            })
        },
        setStyle(){
            for(let i in this.styleData){
                this.$refs.infoPopup.style.setProperty(i, this.styleData[i]) // 给变量赋值
            }
        },
        //显示弹窗
        setPopup(){
            if(this.dialogOverlay) {
                this.mapView.removeOverlay(this.dialogOverlay)
            }
            this.dialogOverlay= new Overlay({
                element: this.$refs.infoPopup,
                stopEvent: false,
                offset: [0, 0],
                autoPan: {
                    animation: {
                        duration: 1000,
                    },
                },
                insertFirst:false
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
        reload(){
            this.mapView.removeOverlay(this.dialogOverlay)
            this.mapView.addOverlay(this.dialogOverlay)
            this.dialogOverlay.setPosition(this.popupPosition)
        },
        //弹窗关闭
        closePopup(){
            this.isShow=false
            if(this.pan) this.pan.setActive(true)
            this.dialogOverlay.setPosition(undefined);
            this.mapView.removeOverlay(this.dialogOverlay)
            // return false;
        },
    }
}
</script>

<style lang="scss" scoped>
.widget-infoPopup{
    $borderColor:var(--borderColor);
    $backgroundColor:var(--backgroundColor);
    position: absolute;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    left: .260417rem /* 50/192 */;
    top:calc(-1 * (var(--height)/2 + .15625rem /* 30/192 */));
    height: var(--height);
    width: var(--width);
    .box {
        position: relative;
        width: 100%;
        height: 100%;
        clip-path:polygon(0 0, 0 0, 100% 0, 100% calc(100% - .208333rem /* 40/192 */), calc(100% - .260417rem /* 50/192 */) 100%, 0 100%, 0 0, 0 0);
        background:linear-gradient(-39deg,$borderColor .161458rem /* 31/192 */, $backgroundColor 0) bottom right,
            linear-gradient(45deg,$borderColor 0, $backgroundColor 0) bottom left,
            linear-gradient(135deg,$borderColor 0, $backgroundColor 0) top left,
            linear-gradient(-135deg,$borderColor 0,$backgroundColor 0) top right;
        border: solid 1px $borderColor;
    }
    .box-line{
        position: absolute;
        top: 50%;
        left:-.182292rem /* 35/192 */;
        width: .15625rem /* 30/192 */;
        height: .010417rem /* 2/192 */;
        margin: .010417rem /* 2/192 */ 0;
        background: $borderColor;
    }
    .box-point{
        position: absolute;
        left: -.036458rem /* 7/192 */;
        top: 50%;
        border-radius: 50% 50%;
        background: $borderColor;
        height: .03125rem /* 6/192 */;
        width: .03125rem /* 6/192 */;
    }
    .box-outline{
        position: absolute;
        top: .182292rem /* 35/192 */;
        left: -.026042rem /* 5/192 */;
        height: calc(var(--height) - .15625rem /* 30/192 */);
        width: calc(var(--width) - .052083rem /* 10/192 */);
        clip-path:polygon(10px 0, 0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 30px) 100%, 0 100%, 0 0, 0 10px);
        background:linear-gradient(-39deg,$borderColor 20px, transparent 0) bottom right,
            linear-gradient(45deg,$borderColor 0, transparent 0) bottom left,
            linear-gradient(135deg,$borderColor 8px, transparent 0) top left,
            linear-gradient(-135deg,$borderColor 0,transparent 0) top right;
        border-bottom: 1px solid $borderColor;
        border-left:1px solid $borderColor ;
        z-index: -1;
    }
    .box-close{
        position: absolute;
        top: .052083rem /* 10/192 */;
        right: .052083rem /* 10/192 */;
        color: #fff;
        cursor: pointer;
    }
    .box-close:after {
        content: "✖";
    }
}
</style>