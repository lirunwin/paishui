<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInRight"
    leave-active-class="animate__slideOutRight">
        <div class="widget-ELPVmonitoring" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">易涝点视频监测</span>

                </div>
            </div>
            <div class="content-info">
                <div class="content-item" v-for="item of siteList" :key="item.name">
                    <div class="title">
                        <div class="siteInfo">
                            <div class="icon"></div>
                            <span class="site-name">{{item.name}}</span>
                            <div class="siteIcon" @click="located(item.coor)"></div>
                        </div>
                        <div class="waterLevel">
                            <div class="liquidFill">
                                <liquidFillChart isNormal/>
                            </div>
                            <div class="currentLevel">当前水位：<div class="value">{{item.waterLevel}}m</div></div>
                        </div>
                    </div>
                    <div class="content">
                        <hls-video></hls-video>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import liquidFillChart from '../overviewData/components/liquidFillChart.vue'
import hlsVideo from './components/hlsVideo.vue'
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {Style,Icon,} from 'ol/style';
export default {
    name:"ELPVmonitoring",//易涝点视频监测
    components:{
        liquidFillChart,
        hlsVideo
    },
    props:{
        show:{},
    },
    data(){
        return{
            siteList:[
            {name:'陵州大道东一段下穿隧道',waterLevel:1.3,coor:[104.1637934,30.0103335]},
            {name:'陵州大道东二段下穿隧道',waterLevel:1.3,coor:[104.1662752,30.0040547]},
            {name:'迎宾大道与绿岛街交叉口',waterLevel:1.3,coor:[104.1467149,29.9836909]}
            ]
        }
    },
    watch:{
        show(n,o){
            if(!n) this.vectorLayer.getSource().clear()
        },
        view:{
            handler(n,o){
                if(n) this.initVector()
            }
        }
    },
    computed:{
        view(){
            return this.$store.state.bigScreen.view
        }
    },
    methods:{
        initVector(){
            //创建矢量层
            this.vectorLayer = new VectorLayer({
                source: new VectorSource({wrapX: false,})
            });
            //将图层添加到地图中
            this.view.addLayer(this.vectorLayer);
        },
        //定位方法
        located(position){
            this.showPointSymbol(position)
            this.view.getView().setCenter(position)
        },
        showPointSymbol(position){
            this.vectorLayer.getSource().clear()
            //创建Feature，并添加进矢量容器中
            this.feature = new Feature({
                geometry: new Point(position),
                name: 'My point',
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
                    scale:1,
                    //图标的url
                    src: require('@/views/bigScreen/monitoringCenter/images/视频点.png')
                })
            });
        },
    },
}
</script>

<style lang='scss' scoped>
.animate__slideInRight,.animate__slideOutRight{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-ELPVmonitoring{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom: $size10/* 10/192 */;
    margin-right: $size20 /* 20/192 */;
    right: 0;
    position: absolute;
    //size
    height: calc(100% - .557292rem /* 107/192 */);
    width: 2.083333rem /* 400/192 */;
    //background
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
    //font
    font-family: Source Han Sans CN;
    .head{
        height: .166667rem /* 32/192 */;
        width: 100%; 
        background: linear-gradient(-90deg, rgba(43, 167, 255, 0.2) 0%, rgba(43, 167, 255, 0.08) 100%);
        .title{
            width:100%;
            height: 100%;
            display: flex; 
            font-weight: 400;
            .icon{
                height: .166667rem /* 32/192 */;
                width: .34375rem /* 66/192 */;
                background: url("./images/视频监测.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        overflow: auto;
        padding: 2px;
        .content-item{
            width: 100%;
            height: 33%;
            float: left;
            overflow: hidden;
            .title{
                width: 100%;
                display:flex;
                padding: .145833rem 0 0 0;
                justify-content: space-between;
                align-items: center;
                .siteInfo{
                    display: flex;
                }
                .icon{
                    height: .072917rem /* 14/192 */;
                    width: .052083rem /* 10/192 */;
                    margin-right: .046875rem /* 9/192 */;
                    background: url("./images/三角.png") no-repeat center center;
                    background-size: 100% 100%;
                }
                .site-name{
                    color: #FFFFFF;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 500;
                }
                .siteIcon{
                    background: url("./images/定位.png") no-repeat center center;
                    background-size: 100% 100%;
                    width: 13px;
                    height: 16px;
                    margin-left: .0625rem /* 12/192 */;
                    cursor: pointer;
                }
                .waterLevel{
                    display: flex;
                    align-items: center;
                    .liquidFill{
                        height: .114583rem /* 22/192 */;
                        width: .114583rem /* 22/192 */;
                    }
                    .currentLevel{
                        font-size: .0625rem /* 12/192 */;
                        font-weight: 500;
                        color: #FFFFFF;
                        display: flex;
                        align-items: baseline;
                        .value{
                            font-size: .072917rem /* 14/192 */;
                            font-weight: bold;
                            color: #2BA7FF;
                        }
                    }
                }
            }
            .content{
                height:calc(100% - .072917rem);
                width: 100%;
                padding: .052083rem /* 10/192 */;
            } 
        }
    }
}
</style>