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
                <div class="content-item" v-for="item in siteList" :key="item.name">
                    <div class="title"><div class="icon"></div><span class="site-name">易漏点{{item.name}}水位监测</span></div>
                    <div class="content" ref="chart"></div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"ELPWLMStatistic",//易漏点水位监测统计
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
                label: '近24小时'
            }, {
                value: '选项2',
                label: '近48小时'
            }],
            value: '近24小时',
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
                        this.showIndicatorChart()
                    })
                }
            }
        }
    },
    mounted(){

    },
    methods:{
        //生成指标图表
        showIndicatorChart(){
            this.siteList.forEach((item,index)=>{
                let ref=this.$refs.chart[index]
                let option = {
                    grid: {
                        top: 35,
                        left: 50,
                        right: 25,
                        bottom:'15%'
                    },
                    legend: {
                        right: 0,
                        textStyle: {
                            color: "rgba(254, 255, 255, 0.7)",
                            fontSize:this.fontSize(12)
                        }
                    },
                    tooltip : {
                        trigger: 'axis',
                        backgroundColor:'rgba(50,50,50,0.7)',
                        confine:true,
                        borderWidth:0,
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#002442'
                            }
                        },
                        textStyle:{
                            color:'#BBE1FF'
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                        splitLine: {
                            show: false
                        },
                        axisLabel:{
                            show:true,
                            interval:0,
                            color:'rgba(254, 255, 255, 0.7)',
                            fontSize:this.fontSize(12),
                            fontFamily:'Source Han Sans CN',
                            fontWeight:400
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(255,255,255,0.3)'
                            }
                        },
                        axisTick:{
                            show:true,
                            length:5,
                            lineStyle:{
                                color:'rgba(255,255,255,0.1)'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: "单位：m",
                        nameTextStyle:{
                            align:'right',
                            fontFamily: 'Source Han Sans CN',
                            fontSize: this.fontSize(12),
                            fontStyle: 'normal',
                            fontWeight: '400',
                            color: 'rgba(254, 255, 255, 0.7)'
                        },
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color:'rgba(255, 255, 255, 0.14)'
                            }
                        },
                        axisLabel:{
                            show:true,
                            color:'rgba(254, 255, 255, 0.7)',
                            fontSize:this.fontSize(12),
                            fontFamily:'Source Han Sans CN',
                            fontWeight:400
                        },
                        axisLine:{
                            show:false,
                            lineStyle:{
                                color:'rgba(255,255,255,0.3)'
                            }
                        },
                        axisTick:{
                            show:true,
                            length:5,
                            lineStyle:{
                                color:'rgba(255,255,255,0.1)'
                            }
                        }
                    },
                    series: [
                        {
                            name: '当前水位',
                            type: 'line',
                            stack: 'a',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 5,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(14, 167, 255, 0.8)'
                                    },{
                                        offset: 0.9,
                                        color: "rgba(14, 167, 255, 0)"
                                    }]),
                                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                                    shadowBlur: 10
                                }
                            },
                            itemStyle: {
                                color: 'rgb(0,136,212)',
                                borderColor: 'rgba(0,136,212,0.2)',
                                borderWidth: 12
                            },
                            markPoint: {
                                data: [
                                    {
                                        type: "min",
                                        itemStyle: {
                                            color: 'rgb(0,136,212)',
                                            borderColor: 'rgba(0,136,212,0.5)',
                                            borderWidth: 12
                                        },
                                        label: {
                                            color: "rgba(14, 167, 255, 0.8)",
                                            show: true,
                                            fontSize: this.fontSize(12),
                                            fontWeight:600,
                                            position: "top"
                                        }
                                    },
                                    {
                                        type: "max",
                                        itemStyle: {
                                            color: 'rgb(234, 58, 59)',
                                            borderColor: 'rgba(234, 58, 59,0.5)',
                                            borderWidth: 12
                                        },
                                        label: {
                                            color: "rgba(234, 58, 59, 0.8)",
                                            show: true,
                                            fontSize: this.fontSize(12),
                                            fontWeight:600,
                                            position: "top"
                                        }
                                    }
                                ],
                                symbol:'circle',
                                symbolSize :5,

                            },
                            // markArea: {
                            //     data : [ [ {
                            //         xAxis:'16:00',
                            //         yAxis : parseInt(180),//y轴坐标控制
                            //         itemStyle : {
                            //             color : 'rgb(234, 58, 59,0.7)'
                            //         }
                            //     }, {
                            //         xAxis:'18:00',
                            //         yAxis : parseInt(220),//y轴坐标控制
                            //         itemStyle : {
                            //             color : 'rgb(234, 58, 59,0.7)'
                            //         }
                            //     } ] ],
                            //     silent: true,
                            // },
                            data: [120, 110, 125, 145,220, 210, 191]
                        },
                        {
                            name: '报警水位',
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 5,
                            showSymbol: false,
                            lineStyle: {
                                width: 1,
                                type: "dashed"
                            },
                            itemStyle: {
                                color: 'rgb(234, 58, 59)',
                                borderColor: 'rgba(234, 58, 59, 0.27)',
                                borderWidth: 12
                            },
                            data: [180,180,180,180,180,180,180],
                        }, 
                    ],
                    visualMap:[
                        {
                            seriesIndex:0,
                            pieces:[
                                {
                                    gt:0,
                                    lt:180,
                                    color:"rgb(0,136,212)",
                                },
                                {
                                    gte:180,
                                    color:"rgb(234, 58, 59)"
                                },
                            ],
                            show:false,//标签是否显示
                        }
                    ],
                };
                this.creatChart(option,ref)
            })            
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
            } 
        }
    }
}
</style>