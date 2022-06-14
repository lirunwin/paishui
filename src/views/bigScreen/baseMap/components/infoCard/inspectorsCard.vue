<template>
    <div class="inspectorsCard">
        <div class="title">巡查人员</div>
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
    name:"inspectorsCard",//巡查人员信息卡
    data(){
        return{
            dataList:[
                {
                    name:"人员名称",
                    value:"某某",
                },
                {
                    name:"所属部门",
                    value:"设计部",
                },
                {
                    name:"联系方式",
                    value:"12345678901",
                },
                {
                    name:"当前位置",
                    value:"xxx"
                },
                {
                    name:"巡检总里程",
                    value:"123m"
                },
                {
                    name:"今日巡检里程",
                    value:"22m"
                }
            ]
        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.inspectorsCard{
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