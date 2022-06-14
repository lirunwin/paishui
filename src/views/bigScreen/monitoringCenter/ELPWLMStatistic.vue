<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInLeft"
    leave-active-class="animate__slideOutLeft">
        <div class="widget-ELPWLMStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">易漏点水位监测统计</span>
                    <el-select v-model="value" placeholder="请选择" size="mini" ref="date-select" > 
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                        @click.native="showDatePicker(item)">
                        </el-option>
                    </el-select>
                    <div class="datePicker" v-if="isShowDatePicker">
                        <el-date-picker
                        size="mini"
                        v-model="value2"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="content-info">
                <div class="content-item" v-for="item in siteList" :key="item.name">
                    <div class="title"><div class="icon"></div><span class="site-name">易漏点{{item.name}}水位监测</span></div>
                    <div class="content">
                        <waterLevelChart :fontSize="fontSize"/>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import waterLevelChart from './components/waterLevelChart.vue'
export default {
    name:"ELPWLMStatistic",//易漏点水位监测统计
    components:{
        waterLevelChart
    },
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
            isShowDatePicker:false,
            options: [
            {
                value: '选项1',
                label: '近24小时'
            }, 
            {
                value: '选项2',
                label: '近一周'
            },
            {
                value: '选项3',
                label: '最近一年'
            },
            {
                value: '选项4',
                label: '自定义'
            },
            ],
            value: '近24小时',
            value2: [],
            siteList:[
                {
                    name:'(1)',
                },
                {
                    name:'(2)',
                },
                {
                    name:'(3)',
                },
            ],
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
        },
        value2:{
            handler(n,o){
                if(n){
                    // this.isShowDatePicker=false
                }
            },
        }
    },
    mounted(){

    },
    methods:{
        showDatePicker(item){
            this.isShowDatePicker=(item.label==='自定义')?true:false
        },
        //时间转换
        timeConversion(date){
            let time = new Date(date);
            //getMonth()的返回值是0-11也就是从0开始而不是从1开始。所以一般都需要加一个1 才能达到1-12月。否则就成了0-11月了
            return time.getFullYear()+'-'+this.formatTen((time.getMonth()+1))+'-'+this.formatTen(time.getDate())
        },
        //时间取0位
        formatTen(num) { 
            return num > 9 ? (num + "") : ("0" + num); 
        }, 
    }
}
</script>

<style lang="scss" scoped>
.animate__slideInLeft,.animate__slideOutLeft{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-ELPWLMStatistic{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom: $size10/* 10/192 */;
    margin-left: $size20 /* 20/192 */;
    position: absolute;
    //size
    height: calc(100% - .557292rem /* 107/192 */);
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
                background: url("./images/监测统计.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                flex: 1;
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
            .el-select{
                flex: 0.4;
                /deep/ input{
                    padding: 0;
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
            .datePicker{
                position: absolute;
                left: 1.041667rem /* 200/192 */;
                top: .182292rem /* 35/192 */;
                .el-range-editor--mini.el-input__inner {
                    width: 1.041667rem /* 200/192 */;
                    height: .145833rem /* 28/192 */;
                }
                /deep/ .el-date-editor .el-range-input{
                    width: 100%;    
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
        .content-item{
            width: 100%;
            height: 33%;
            display: flex;
            flex-flow: column;
            .title{
                width: 100%;
                display:flex;
                padding: .145833rem 0 .104167rem 0;
                .icon{
                    height: .072917rem /* 14/192 */;
                    width: .052083rem /* 10/192 */;
                    margin-right: .046875rem /* 9/192 */;
                    background: url("./images/三角.png") no-repeat center center;
                    background-size: 100% 100%;
                }
                .site-name{
                    color: #FFFFFF;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 500;
                }
            }
            .content{
                height:calc(100% - .072917rem);
                width: 100%;
                overflow: hidden;
            } 
        }
    }
}
</style>