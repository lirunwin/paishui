<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX">
        <div class="widget-monitorTree" ref="widget-monitorTree">
            <div class="wrap">
                <div class="icon" title="监测树" @click="showContent=!showContent">监测树<img :src="buttonImg" /></div>
                <div class="content" v-if="showContent">
                    <div class="header">
                        <div class="title">设备监测树</div>
                        <el-input placeholder="设备名称搜索" v-model="input" class="input-with-select" size="mini">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="close" @click="showContent=!showContent"><i class="el-icon-close"></i></div>
                    </div>
                    <div class="statistic">

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name:"monitorTree",//监测树
    props:{
        show:{},
    },
    data(){
        return{
            showContent:false,
            buttonImg:null,
            upImg:require('./images/三角上.png'),
            downImg:require('./images/三角下.png'),
            //
            input:"",
        }
    },
    mounted(){

    },
    watch:{
        show:{
        },
        showContent:{
            handler(n,o){
                this.buttonImg=n?this.upImg:this.downImg
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
.widget-monitorTree{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    top:.677083rem /* 130/192 */;
    margin-right: 2.34375rem /* 450/192 */;
    position: absolute;
    right: 0;
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
        flex-flow: column;
        align-items: flex-end;
        width: 0;
        .icon{
            width: .416667rem /* 80/192 */;
            height: .177083rem /* 34/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: .072917rem /* 14/192 */;
            font-weight: 500;
            color: #2BA7FF;
            img{
                width: .104167rem /* 20/192 */;
                height: .083333rem /* 16/192 */;
            }
        }
        .content{
            margin-top: .026042rem /* 5/192 */;
            width: 1.979167rem /* 380/192 */;
            height: 1.979167rem /* 380/192 */;
            background: linear-gradient(0deg, rgba(2, 20, 37, 0.56) 0%, #072643 100%);
            .header{
                height: .208333rem /* 40/192 */;
                margin: 0 .052083rem /* 10/192 */;
                padding: .026042rem /* 5/192 */;
                border-bottom: 1px solid rgba(255,255,255,0.7);
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title{
                    font-size: .083333rem /* 16/192 */;
                    font-weight: 500;
                    color: #2BA7FF;
                }
                .close{
                    display: flex;
                    align-items: center;
                    height: 100%;
                    color: rgba(138, 211, 253, 1);
                    font-size:.09375rem /* 18/192 */;
                    cursor: pointer;
                }
                .el-input {
                    width: 1.041667rem /* 200/192 */;
                }
                /deep/ .el-input__inner{
                    background-color: rgb(9, 48, 84);
                    border: none;
                    color: #eee;
                }
                /deep/ .el-input-group__append{
                    background-color: rgb(9, 48, 84);
                    border: none;
                }
                /deep/ .el-icon-search:before{
                    color: rgba(138, 211, 253, 1);
                    font-size:.09375rem /* 18/192 */;
                }
            }
        }
    }


}
</style>