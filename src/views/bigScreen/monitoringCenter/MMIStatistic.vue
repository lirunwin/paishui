<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__zoomIn"
    leave-active-class="animate__zoomOut">
        <div class="widget-MMIStatistic" v-if="show">
            <div class="boxpanel">
                <div class='statisticitem' v-for="item in dataList" :key="item.title">
                    <div class='itemName'>
                        <div class="title">{{item.title}}</div>
                        <div class="img" :class="item.imgClass"></div>
                    </div>
                    <div class='itemCount'>
                        <div class="wrap"><div class="status">正常：</div><div class="normal">{{item.normalNum}}个</div></div>
                        <div class="wrap"><div class="status">异常：</div><div class="error">{{item.errorNum}}个</div></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name:'MMIStatistic',//地图监测信息统计
    props:{
        show:{},
    },
    data(){
        return{
            dataList:[
                {
                    title:'管网液位监测',
                    imgClass:'img0',
                    normalNum:22,
                    errorNum:22,
                },
                {
                    title:'易涝点水位',
                    imgClass:'img1',
                    normalNum:22,
                    errorNum:22,
                },
                {
                    title:'易涝点视频',
                    imgClass:'img2',
                    normalNum:22,
                    errorNum:22,
                },
                {
                    title:'智慧井盖',
                    imgClass:'img3',
                    normalNum:22,
                    errorNum:22,
                },
            ]
        }
    }
}
</script>

<style lang='scss' scoped>
.animate__zoomIn,.animate__zoomOut{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-MMIStatistic{
    top: .505208rem /* 97/192 */;
    margin-left: 2.34375rem;
    height: .416667rem /* 80/192 */;
    width: 5.302083rem /* 1018/192 */;
    overflow: hidden;
    position: absolute;
    font-family: Source Han Sans CN;
    .boxpanel{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .statisticitem{
            width: 20%;
            height: 100%;
            display: flex;
            .itemName{
                display: flex;
                flex-flow: column nowrap;
                align-items: center;
                .title{
                    text-align: center;
                    font-size: .0625rem /* 12/192 */;
                    font-weight: bold;
                    white-space: nowrap;
                    color: rgb(43, 167, 255);
                    text-shadow: 0 0 10px rgba(43, 167, 255,0.3),0 0 20px rgba(43, 167, 255,0.3),0 0 30px rgba(43, 167, 255,0.3),0 0 40px rgba(43, 167, 255,0.3);  
                }
                .img{
                    height: .447917rem /* 86/192 */;
                    width: .385417rem /* 74/192 */;
                }
                .img0{
                    background: url('./images/管网液位.png') no-repeat center center;
                    background-size: 100% 100%;
                }
                .img1{
                    background: url('./images/水位.png') no-repeat center center;
                    background-size: 100% 100%;
                }
                .img2{
                    background: url('./images/视频.png') no-repeat center center;
                    background-size: 100% 100%;
                }
                .img3{
                    background: url('./images/井盖.png') no-repeat center center;
                    background-size: 100% 100%;
                }
            }
            .itemCount{
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                .wrap{
                    display: flex;
                    align-items: center;
                }
                .status{
                    white-space: nowrap;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: bold;
                    color: #FEFFFF;
                    background: linear-gradient(0deg, #9BD2FA 0%, #FFFFFF 100%);
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 10px rgba(155, 210, 250,0.3),0 0 20px rgba(155, 210, 250,0.3),0 0 30px rgba(155, 210, 250,0.3),0 0 40px rgba(155, 210, 250,0.3); 
                }
                .normal{
                    white-space: nowrap;
                    font-size: .09375rem /* 18/192 */;
                    font-weight: bold;
                    color: #2BA7FF;
                    text-shadow: 0 0 10px rgba(43, 167, 255,0.3),0 0 20px rgba(43, 167, 255,0.3),0 0 30px rgba(43, 167, 255,0.3),0 0 40px rgba(43, 167, 255,0.3); 
                }
                .error{
                    white-space: nowrap;
                    font-size: .09375rem /* 18/192 */;
                    font-weight: bold;
                    color: #FE4545;
                    text-shadow: 0 0 10px rgba(254, 69, 69,0.3),0 0 20px rgba(254, 69, 69,0.3),0 0 30px rgba(254, 69, 69,0.3),0 0 40px rgba(254, 69, 69,0.3); 
                }
            }
        }
    }
}
</style>