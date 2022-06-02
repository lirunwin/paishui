<template>
  <div class="reportCard">
    <div class="boardTitle">{{reportData.title}}</div>
    <div class="boardDetail">
        <div class="normal"><div>{{reportData.normal.title}}：</div><div class="normalValue">{{reportData.normal.value}}个</div></div>
        <div class="warning"><div>{{reportData.warning.title}}：</div><div class="warningValue">{{reportData.warning.value}}个</div></div>
    </div>
  </div>
</template>

<script>
export default {
    name:"reportCard",//上报信息卡片
    props:{
        reportData:{}
    }
}
</script>

<style lang='scss' scoped>
.reportCard{
    height: 100%;
    width: 100%;
    font-family: Source Han Sans CN;
    .boardTitle{
        margin: .026042rem /* 5/192 */;
        height: .177083rem /* 34/192 */;
        width: .625rem /* 120/192 */;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('../images/标题样式.png') no-repeat center center;
        background-size: 100% 100%;
        font-size: .072917rem /* 14/192 */;
        font-weight: 500;
        color: #0EA7FF;
    }
    .boardDetail{
        height: calc(100% - 41px);
        width: .625rem /* 120/192 */;
        margin: .026042rem /* 5/192 */;
        background: linear-gradient(0deg, rgba(14, 167, 255, 0.25) 0%, rgba(14, 167, 255, 0) 100%);
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: space-around;
        .normal{
            display: flex;
            align-items: center;
            font-size: .072917rem /* 14/192 */;
            font-weight: 400;
            color: #FFFFFF;
            white-space: nowrap;
            .normalValue{
                font-size: .083333rem /* 16/192 */;
                font-weight: bold;
                color: #FFB54C;
                white-space: nowrap;
            }
        }
        .warning{
            display: flex;
            align-items: center;
            font-size: .072917rem /* 14/192 */;
            font-weight: 400;
            color: #FFFFFF;
            white-space: nowrap;
            .warningValue{
                font-size: .083333rem /* 16/192 */;
                font-weight: bold;
                color: #FF3131;
                white-space: nowrap;
            }
        }
    }
}
</style>