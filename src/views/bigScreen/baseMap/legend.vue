<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX">
        <div class="widget-MapLegend" ref="widget-MapLegend">
            <div class="wrap">
                <div class="icon" @click="legendBoardShow=!legendBoardShow" title="地图图例"><div class="img"></div></div>
                <div class="legendBoard" v-if="legendBoardShow">
                    <div class="title">地图图例</div>
                    <div class="legendItem">
                        <div class="citem" v-for="(item,index) in legendList" :key="item.name">
                            <div class="iconWrap"><img class="legendIcon" :src="item.img" :class="'legendIcon'+index"/></div>
                            <div class="legendName">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name:"MapLegend",//地图图例
    props:{
        show:{},
    },
    data(){
        return{
            legendBoardShow:false,
            legendList:[
                {
                    img:require('@/views/bigScreen/baseMap/images/液位仪.png'),
                    name:'管网液位'
                },
                {
                    img:require('@/views/bigScreen/baseMap/images/视频监控.png'),
                    name:'易涝点视频'
                },
                {
                    img:require('@/views/bigScreen/baseMap/images/巡查.png'),
                    name:'巡检人员'
                },
                {
                    img:require('@/views/bigScreen/baseMap/images/井盖.png'),
                    name:'智慧井盖'
                },
                {
                    img:require('@/views/bigScreen/baseMap/images/液位计.png'),
                    name:'易涝点水位'
                },
                {
                    img:require('@/views/bigScreen/baseMap/images/工程车.png'),
                    name:'工程车辆'
                },
            ]
        }
    },
    watch:{
        show:{
            handler(n,o){
                this.$nextTick(()=>{
                    //变量赋值
                    n?this.$refs['widget-MapLegend'].style.setProperty('--bottom', '1.546875rem'):
                    this.$refs['widget-MapLegend'].style.setProperty('--bottom', '.052083rem')
                })
            },
            immediate:true
        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.animate__flipInX,.animate__flipOutX{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-MapLegend{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom: var(--bottom);
    margin-left: 2.34375rem /* 450/192 */;
    position: absolute;
    //size
    // height: .546875rem /* 105/192 */;
    // width: 2.083333rem /* 400/192 */;
    //background
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
    //font
    font-family: Source Han Sans CN;
    .wrap{
        display: flex;
        align-items: flex-end;
        height: 0;
        .icon{
            width: .177083rem /* 34/192 */;
            height: .177083rem /* 34/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .img{
                width: .083333rem /* 16/192 */;
                height: .0625rem /* 12/192 */;
                background: url('./images/图例.png') no-repeat center center;
                background-size: 100% 100%;
            }
        }
        .legendBoard{
            margin-left: .052083rem /* 10/192 */;
            width: 1.84375rem /* 354/192 */;
            height: .541667rem /* 104/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            flex-flow: column;
            padding: .052083rem /* 10/192 */;
            .title{
                height: .078125rem /* 15/192 */;
                font-size: .072917rem /* 14/192 */;
                font-weight: bold;
                color: #2BA7FF;
            }
            .legendItem{
                height: calc(100% - .078125rem);
                width: 100%;
                .citem{
                    float: left;
                    height: 50%;
                    width: 33%;
                    display: flex;
                    align-items: center;
                    .iconWrap{
                        height: .15625rem /* 30/192 */;
                        width: .130208rem /* 25/192 */;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .legendName{
                        font-size: .072917rem /* 14/192 */;
                        font-weight: 400;
                        color: #FEFEFF;
                        padding: .026042rem /* 5/192 */;
                        white-space: nowrap;
                    }
                    .legendIcon0{
                        width: .083333rem /* 16/192 */;
                        height: .09375rem /* 18/192 */;
                    }
                    .legendIcon1{
                        width: .09375rem /* 18/192 */;
                        height: .088542rem /* 17/192 */;  
                    }
                    .legendIcon2{
                        width: .052083rem /* 10/192 */;
                        height: .104167rem /* 20/192 */;
                    }
                    .legendIcon3{
                        width: .098958rem /* 19/192 */;
                        height: .098958rem /* 19/192 */;
                    }
                    .legendIcon4{
                        width: .088542rem /* 17/192 */;
                        height: .088542rem /* 17/192 */; 
                    }
                    .legendIcon5{
                        width: .109375rem /* 21/192 */;
                        height: .067708rem /* 13/192 */;  
                    }
                }
            }
        }
    }


}
</style>