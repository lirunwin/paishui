<template>
  <div class="batteryChart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"batteryChart",//电池进度条图表
    props:{
        value:{}
    },
    watch:{
        value:{
            handler(val){
                this.$nextTick(()=>{this.showChart(val)})
            },
            immediate:true
        }
    },
    methods:{
        showChart(value){
            let chart = echarts.init(this.$refs.chart);//
            let max = 100;
            let option = {
                grid:{
                    left:20,
                    right:20
                },
                xAxis: {
                    type: 'value',
                    max: max,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: [{
                    type: "category",
                    inverse: false,
                    data: [],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show:false
                    }
                }],
                series: [{ //内
                        type: 'bar',
                        barWidth: 10,
                        silent: true,
                        itemStyle: {
                            color: ' #29B1FF',
                        },
                        data: [value],
                        zlevel:0,
                    },
                    {
                        type: 'pictorialBar',
                        barWidth: 30,
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,63,119,1)', //数据的间隔颜色
                            },
                        },
                        symbolRepeat: 'fixed',
                        symbolClip:true,
                        symbolMargin: 3,
                        symbol: 'rect',
                        symbolSize: [4, 10],
                        symbolPosition: 'end',
                        symbolRotate:'-30',
                        symbolOffset: [4, 0],
                        data: [max],
                        zlevel: 1,
                    },
                ]
            };
            chart.resize();
            chart.setOption(option,{
                notMerge: true,
            });
            //图表大小自适应
            window.addEventListener("resize", ()=>{
                chart.resize()
            })
        },
    }
}
</script>

<style lang='scss' scoped>
.batteryChart{
    height: 100%;
    width: 100%;
}
</style>