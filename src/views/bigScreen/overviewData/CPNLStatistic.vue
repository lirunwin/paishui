<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInUp"
    leave-active-class="animate__slideOutDown">
        <div class="widget-CPNLStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">综合管网长度统计</span>
                    <span class="pipe-length">总长度：{{pipeLength}}km</span>
                </div>
            </div>
            <div class="content-info" ref="chart">
                
            </div>
        </div>
    </transition>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"CPNLStatistic",//综合管网长度统计
    props:{
        show:{},
        fontSize:{
            type:Function,
            default:()=>{
                return Function
            }
        }
    },
    data(){
        return{
            pipeLength:20000
        }
    },
    watch:{
        show(n,o){
            if(n){
                this.$nextTick(()=>{
                    this.showChart()
                })
            }
        }
    },
    methods:{
        showChart(){
            let option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '15%',
                    right: '3%',
                    left: '5%',
                    bottom: '12%'
                },
                xAxis: [{
                    type: 'category',
                    data: ['供水管网', '电力供电', '电力路灯', '交通信号', '燃气管网', '通讯管线','监控信号','排水管网'],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#e2e9ff',
                        textStyle: {
                            fontSize: 14
                        },
                    },
                }],
                yAxis: [{
                    name: '单位：km',
                    nameTextStyle: {
                    align: "center"
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: '#FFFFFF',
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#FFFFFF'
                        }
                    },
                    axisTick:{
                    show:false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    data: [6000, 2100, 3700, 1992, 4508, 3700,2100,6700],
                    barWidth: '16px',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,244,255,1)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(0,77,167,1)' // 100% 处的颜色
                        }], false),
                        barBorderRadius: [30, 30, 30, 30],
                        shadowColor: 'rgba(0,160,221,1)',
                        shadowBlur: 4,
                    },
                    label: {
                        show: true,
                        position: ['-5', '-20'],
                        color:'#03CDE7'
                    }
                }]
            };
            this.creatChart(option,this.$refs.chart)
        },
        creatChart(option,ref){
            let chart = echarts.init(ref);//this.$refs.chart
            chart.resize();
            chart.setOption(option,{
                notMerge: true,
            });
            //图表大小自适应
            window.addEventListener("resize", ()=>{
                chart.resize()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.animate__slideInUp,.animate__slideOutDown{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-CPNLStatistic{
    z-index: 2;
    margin-left: 2.34375rem /* 450/192 */;
    bottom: .052083rem /* 10/192 */;
    height:  1.458333rem /* 280/192 */;
    width: 5.302083rem /* 1018/192 */;
    overflow: hidden;
    position: absolute;
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
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
            .icon{
                height: .166667rem /* 32/192 */;
                width: .34375rem /* 66/192 */;
                background: url("./images/综合管网.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
            .pipe-length{
                position: absolute;
                right: 0;
                font-size: 14px;
                font-weight: bold;
                color: #00CCE5;
            }
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        display: flex;
        flex-flow: row wrap;
        padding: .010417rem /* 2/192 */;
    }
}
</style>>
