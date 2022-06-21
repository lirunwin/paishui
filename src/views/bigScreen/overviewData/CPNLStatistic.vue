<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInUp"
    leave-active-class="animate__slideOutDown">
        <div class="widget-CPNLStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">综合管网长度统计</span>
                    <span class="pipe-length">总长度：{{pipeLength}}km</span>
                </div>
            </div>
            <div class="content-info">
                <comprehensiveChart v-on="$listeners"/>
            </div>
        </div>
    </transition>
</template>

<script>
import comprehensiveChart from './components/comprehensiveChart.vue'
export default {
    name:"CPNLStatistic",//综合管网长度统计
    components:{
        comprehensiveChart
    },
    props:{
        show:{},
    },
    data(){
        return{
            pipeLength:1262
        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.animate__slideInUp,.animate__slideOutDown{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-CPNLStatistic{
    z-index: 2;
    margin-left: 2.34375rem /* 450/192 */;
    bottom: .052083rem /* 10/192 */;
    height:  1.458333rem /* 280/192 */;
    width: 5.302083rem /* 1018/192 */;
    overflow: hidden;
    position: absolute;
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
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
                background: url("./images/综合管网.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
            .pipe-length{
                position: absolute;
                right: 0;
                font-size: 14px;
                font-weight: bold;
                color: #00CCE5;
            }
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        display: flex;
        flex-flow: row wrap;
        padding: .010417rem /* 2/192 */;
    }
}
</style>>
