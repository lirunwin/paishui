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
                        <div class="img"><div class="num">{{item.num}}{{item.unit}}</div></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import config from './config.json'
export default {
    name:"MIDStatistic",//地图指标统计
    props:{
        show:{},
    },
    computed:{
        dataList(){
            return config.MIDStatisticList
        }
    },
    mounted(){
        this.getPageData()
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'dtzbtj'}).then(res=>{
                res.forEach(item => {
                    let index = this.dataList.findIndex(i=>i.code==item.typeCode)
                    if(index!=-1) this.dataList[index].num=item.total
                });
            })
        },
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
    left:50%;
    margin-left:-1.822917rem /* 350/192 */;
    height: .416667rem /* 80/192 */;
    width: 3.645833rem /* 700/192 */;
    overflow: hidden;
    position: absolute;
    font-family: Source Han Sans CN;
    .boxpanel{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .statisticitem{
            width: .645833rem /* 124/192 */;
            height: 100%;
            display: flex;
            .itemName{
                height: 100%;
                width: 100%;
                display: flex;
                flex-flow: column nowrap;
                align-items: center;
                .title{
                    text-align: center;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: bold;
                    color: rgb(43, 167, 255);
                    // text-shadow: 0 0 10px rgba(43, 167, 255,0.3),0 0 20px rgba(43, 167, 255,0.3),0 0 30px rgba(43, 167, 255,0.3),0 0 40px rgba(43, 167, 255,0.3);  
                }
                .img{
                    height: .447917rem /* 86/192 */;
                    width: .4375rem /* 84/192 */;
                    background: url('~@/views/bigScreen/overviewData/images/底座.png') no-repeat center center;
                    background-size: 100% 100%;
                    display: flex;
                    justify-content: center;
                    .num{
                        font-size: .09375rem /* 18/192 */;
                        font-weight: bold;
                        line-height: .244792rem /* 47/192 */;
                        color: #0EA7FF;
                        // text-shadow: 0px 2px 8px #031C2E;
                        background: linear-gradient(0deg, #8CCFFF 0%, #FFFFFF 100%);
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
            }
        }
    }
}
</style>
