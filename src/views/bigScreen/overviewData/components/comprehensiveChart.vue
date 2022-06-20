<template>
    <div class="comprehensiveChart" ref="comprehensiveChart"> </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"comprehensiveChart",//综合管网数据图表
    mounted(){
        this.$nextTick(()=>{
            this.showChart()
        })
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
                            fontSize: this.$listeners.fontSize(14)
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
            this.creatChart(option,this.$refs.comprehensiveChart)
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
.comprehensiveChart{
    height: 100%;
    width: 100%;
}
</style>