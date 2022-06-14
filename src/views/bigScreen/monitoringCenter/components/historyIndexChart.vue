<template>
    <div class="historyIndexChart" ref="historyIndexChart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'historyIndexChart',//历史指标图表
    props:{
        timeData:{},
        infoData:{},
        fontSize:{
            type:Function,
            default:()=>{
                return Function
            }
        }
    },
    mounted(){
        this.$nextTick(()=>{this.showChart(this.timeData,this.infoData)})
    },
    methods:{
        showChart(timeData,data){
            let option = {
                backgroundColor: 'transparent',
                title: {
                    text: '监测站1-压力',
                    textStyle: {
                        align: 'center',
                        color: '#9CC0DE',
                        fontSize: this.fontSize(14),
                    },
                    top: '3%',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(0, 255, 233,0)'
                                }, {
                                    offset: 0.5,
                                    color: 'rgba(255, 255, 255,1)',
                                }, {
                                    offset: 1,
                                    color: 'rgba(0, 255, 233,0)'
                                }],
                                global: false
                            }
                        },
                    },
                },
                grid: {
                    top: '15%',
                    left: '10%',
                    right: '5%',
                    bottom: '10%',
                },
                xAxis: [{
                    type: 'category',
                    axisLine: {
                        show: true
                    },
                    splitArea: {
                        color: '#f00',
                        lineStyle: {
                            color: '#f00'
                        },
                    },
                    axisLabel: {
                        color: '#9CC0DE',
                        interval:0
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: true,
                    data: timeData,
                }],

                yAxis: [{
                    type: 'value',
                    name:"单位（pal）",
                    nameTextStyle: {
                        color: "#9CC0DE",
                        fontSize:this.fontSize(14)
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.2)'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#9CC0DE',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                }],
                series: [{
                        name: '压力',
                        type: 'line',
                        smooth: true, //是否平滑
                        showAllSymbol: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            normal: {
                                color: "#0FBECD",
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 5,
                                shadowOffsetX: 0,
                            },
                        },
                        itemStyle: {
                            color: "#002C44",
                            borderColor: "#0FBECD",
                            borderWidth: 2,
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 2,
                            shadowOffsetX: 2,
                        },
                        tooltip: {
                            show: true
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(15,190,205,0.8)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(15,190,205,0)'
                                    }
                                ], false),
                                shadowColor: 'rgba(15,190,205, 0.9)',
                                shadowBlur: 20
                            }
                        },
                        data: data
                    },
                ]
            };
            this.creatChart(option,this.$refs.historyIndexChart)
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

<style>
.historyIndexChart{
    height: 100%;
    width: 100%;
}
</style>