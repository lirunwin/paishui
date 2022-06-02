<template>
  <div class="liquidFillChart" ref="liquidFill"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-liquidfill'
export default {
    name:"liquidFillChart",//水球图
    props:{
        isNormal:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            normalColor:['rgba(31, 136, 255, 1)','rgba(40, 202, 255, 1)','#06416F'],
            warningColor:['rgba(255, 27, 48, 1)','rgba(255, 162, 86, 1)','rgba(85, 32, 14, 1)'],
        }
    },
    mounted(){
        this.showChart()
    },
    methods:{
        //生成水球图
        showChart(){
            let color=this.isNormal?this.normalColor:this.warningColor;
            let ref=this.$refs.liquidFill
            var value = 0.45;
            var option = {
                series: [
                    {
                        type: 'liquidFill',
                        radius: '80%',
                        color: [
                            {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: color[0],
                                    },
                                    {
                                        offset: 1,
                                        color: color[1],
                                    },
                                ],
                                globalCoord: false,
                            },
                        ],
                        data: [value, value], // data个数代表波浪数
                        backgroundStyle: {
                            borderWidth: 1,
                            color: color[2],
                        },
                        label: {
                            show: false
                        },
                        outline: {
                            show: false,
                            borderDistance: 0,
                            itemStyle: {
                                borderWidth: 2,
                                borderColor: '#112165',
                            },
                        },
                    },

                ],
            };
            this.creatChart(option,ref)
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
.liquidFillChart{
    height: 100%;
    width: 100%;
}
</style>