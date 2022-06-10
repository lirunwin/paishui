<template>
    <div class="floodReportCard">
        <div class="title">汛情上报</div>
        <div class="content">
            <div class="infoItem" v-for="item in dataList" :key="item.name">
                <div class="itemName">{{item.name}}：</div>
                <div class="itemValue">{{item.value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"floodReportCard",//汛情上报信息卡
    data(){
        return{
            dataList:[
                {
                    name:"隧道名称",
                    value:"1#孔板洞",
                },
                {
                    name:"汛情描述",
                    value:"********",
                },
                {
                    name:"位置",
                    value:"xxx",
                },
                {
                    name:"照片",
                    value:"xxx"
                },
                {
                    name:"视频",
                    value:"123m"
                },
                {
                    name:"语音",
                    value:"22m"
                }
            ]
        }
    },
}
</script>

<style lang="scss" scoped>
.floodReportCard{
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
        padding: .104167rem /* 20/192 */ .052083rem /* 10/192 */;
    }
    .content{
        height: calc(100% - .083333rem /* 16/192 */);
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
}
</style>