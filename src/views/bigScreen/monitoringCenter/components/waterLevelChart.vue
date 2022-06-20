<template>
    <div class="waterLevelChart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
// import config from '../config.json'
export default {
    name:"waterLevelChart",//水位图
    props:{
        intervalDays:{default:1},
        deviceSn:{},
        warningWl:{},
    },
    watch:{
        intervalDays:{
            handler(n,o){
                this.getPageData(n)
            },
            immediate:true
        }
    },
    methods:{
        getPageData(intervalDays){
            const {getRequestResult} = this.$listeners
            getRequestResult({deviceSn: this.deviceSn,blockCode:'singleDevice'}).then(res=>{
                const Final = res.filter((item) => (new Date(item.scadaTime).getTime() > Date.now() - intervalDays * 24 * 60 * 60 * 1000));
                console.log(res)
                let xData=[],yData=[],alarmData=[];
                Final.forEach(item => {
                    xData.push(moment(item.scadaTime).format('MM-DD'))
                    yData.push(item.itstrVal)
                    alarmData.push(this.warningWl)
                });
                this.$nextTick(()=>{
                    this.showChart(xData,yData,alarmData)
                })
            })
        },
        showChart(xData,yData,alarmData){
            let ref=this.$refs.chart
            let option = {
                grid: {
                    top: 35,
                    left: 50,
                    right: 25,
                    bottom:'15%'
                },
                dataZoom:{
                    type: 'inside' ,
                },
                legend: {
                    right: 0,
                    textStyle: {
                        color: "rgba(254, 255, 255, 0.7)",
                        fontSize:this.$listeners.fontSize(12)
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
                    data: xData,
                    splitLine: {
                        show: false
                    },
                    axisLabel:{
                        show:true,
                        // interval:0,
                        color:'rgba(254, 255, 255, 0.7)',
                        fontSize:this.$listeners.fontSize(12),
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
                        fontSize: this.$listeners.fontSize(12),
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
                        fontSize:this.$listeners.fontSize(12),
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
                                        fontSize: this.$listeners.fontSize(12),
                                        fontWeight:600,
                                        position: "top"
                                    }
                                },
                                // {
                                //     type: "max",
                                //     itemStyle: {
                                //         color: 'rgb(234, 58, 59)',
                                //         borderColor: 'rgba(234, 58, 59,0.5)',
                                //         borderWidth: 12
                                //     },
                                //     label: {
                                //         color: "rgba(234, 58, 59, 0.8)",
                                //         show: true,
                                //         fontSize: this.$listeners.fontSize(12),
                                //         fontWeight:600,
                                //         position: "top"
                                //     }
                                // }
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
                        data:yData
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
                        data: alarmData,
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

<style lang='scss' scoped>
.waterLevelChart{
    height: 100%;
    width: 100%;
}
</style>