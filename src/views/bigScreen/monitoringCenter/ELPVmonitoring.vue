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
                <div class="content-item">
                    <div class="title">
                        <div class="siteInfo">
                            <div class="icon"></div>
                            <span class="site-name">{{value}}</span>
                            <div class="siteIcon"></div>
                        </div>
                        <div class="waterLevel">
                            <div class="liquidFill">
                                <liquidFillChart isNormal/>
                            </div>
                            <div class="currentLevel">当前水位：<div class="value">42.3m</div></div>
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
            value:"易漏点（1）",
        }
    },
    watch:{
        show(n,o){}
    },
    methods:{},
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
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        display: flex;
        flex-flow: row wrap;
        .content-item{
            width: 100%;
            height: 33%;
            display: flex;
            flex-flow: column;
            .title{
                width: 100%;
                display:flex;
                padding: .145833rem 0 .104167rem 0;
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