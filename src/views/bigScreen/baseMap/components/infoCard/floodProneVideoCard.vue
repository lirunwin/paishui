<template>
    <div class="floodProneVideoCard">
        <div class="title">易涝点视频</div>
        <div class="content">
            <div class="left-part">
                <div class="part-name">
                    <div class="icon"></div>
                    <div class="name">隧道名称</div>
                </div>
                <div class="infoItem" v-for="item in dataList" :key="item.name">
                    <div class="itemName">{{item.name}}：</div>
                    <div class="itemValue">{{item.value}}</div>
                </div>
            </div>
            <div class="right-part">
                <div class="part-name">
                    <div class="icon"></div>
                    <div class="name">水位变化信息统计</div>
                </div>
                <div class="chart">
                    <WaterLevelChart :fontSize="$listeners.fontSize" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WaterLevelChart from '@/views/bigScreen/monitoringCenter/components/waterLevelChart.vue'
export default {
    name:"floodProneVideoCard",//易涝点视频
    components:{
        WaterLevelChart
    },
    data(){
        return{
            dataList:[
                {
                    name:"上报编号",
                    value:"xxxxxxx",
                },
                {
                    name:"设备名称",
                    value:"********",
                },
                {
                    name:"负责人员",
                    value:"xxx",
                },
                {
                    name:"联系方式",
                    value:"123456789"
                },
                {
                    name:"安装地址",
                    value:"xxx"
                },
                {
                    name:"安装时间",
                    value:"2022-06-08"
                },
                {
                    name:"状态",
                    value:"正常"
                }
            ]
        }
    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
.floodProneVideoCard{
    height: 1.5625rem;
    width: 2.65625rem;
    color: #fff;
    display: flex;
    flex-flow: column;
    font-family: Source Han Sans CN;
    .title{
        display: flex;
        align-items: center;
        height: .104167rem /* 20/192 */;
        font-size: .083333rem /* 16/192 */;
        font-weight: bold;
        color: #0EA7FF;
        margin:  .052083rem /* 10/192 */;
        padding: .104167rem /* 20/192 */ 0;
        border-bottom: 1px solid rgba(14, 167, 255,0.84);
    }
    .content{
        width: 100%;
        height: calc(100% - .083333rem /* 16/192 */);
        display: flex;
        .part-name{
            display: flex;
            align-items: center;
            padding: .026042rem /* 5/192 */ .052083rem /* 10/192 */;
            .icon{
                height: .072917rem /* 14/192 */;
                width: .020833rem /* 4/192 */;
                background: #0EA7FF;
            }
            .name{
                margin-left: .041667rem /* 8/192 */;
                font-size: .072917rem /* 14/192 */;
                font-weight: 400;
                color: #FFFFFF;
            }
        }
        .left-part{
            height: 100%;
            width: .9375rem /* 180/192 */;
            display: flex;
            flex-flow: column;
            .infoItem{
                display: flex;
                font-size: .072917rem /* 14/192 */;
                padding: .026042rem /* 5/192 */ .052083rem /* 10/192 */;
                .itemName{
                    color: #fff;
                }
                .itemValue{
                    color: #0EA7FF;
                }
            }
        }
        .right-part{
            height: 100%;
            width: calc(100% - 1.041667rem /* 200/192 */);
            display: flex;
            flex-flow: column;
            .chart{
                width: 100%;
                height: calc(100% - .104167rem /* 20/192 */);
            }
        }
    }
}
</style>