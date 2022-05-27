<template>
    <transition 
    appear               
    name="animate__animated animate__move2"
    enter-active-class="animate__slideInLeft"
    leave-active-class="animate__slideOutLeft">
        <div class="widget-PNIARStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">管网巡检与上报统计</span>
                    <el-select v-model="value" placeholder="请选择" size="mini">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="content-info">

            </div>
        </div>
    </transition>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"PNIARStatistic",//易漏点水位监测统计
    props:{
        show:{},
        fontSize:{
            type: Function,
            default: () => {
                return Function
            }
        }
    },
    data(){
        return{
            options: [{
                value: '选项1',
                label: '今年'
            }, {
                value: '选项2',
                label: '昨年'
            }],
            value: '今年',
        }
    },
    watch:{
        show:{
            handler(n,o){
                if(n){
                    this.$nextTick(()=>{

                    })
                }
            }
        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.animate__slideInLeft,.animate__slideOutLeft{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-PNIARStatistic{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom: $size10/* 10/192 */;
    margin-left: $size20 /* 20/192 */;
    position: absolute;
    //size
    height: calc(100% - .505208rem /* 97/192 */);//618-47+32
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
            align-items: center;
            .icon{
                height: .166667rem /* 32/192 */;
                width: .34375rem /* 66/192 */;
                background: url("./images/管网与上报.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
            .el-select{
                width: .572917rem /* 110/192 */;
                position: absolute;
                right: 0;
                /deep/ input{
                    background: transparent;
                    border: none;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 500;
                    color: #2BA7FF;
                }
                /deep/ .el-icon-arrow-up:before {
                    content: '';
                    display: block;
                    // 定义元素宽高
                    margin-top:.041667rem /* 8/192 */;
                    width: .130208rem /* 25/192 */;
                    height: .078125rem /* 15/192 */;
                    background: url("./images/三角下.png") no-repeat center center;
                    background-size: 100% 100%;
                    transform: rotate(180deg);
                }
            }
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        overflow: auto;
        display: flex;
        flex-flow: row wrap;
        padding: 2px;
    }
}
</style>