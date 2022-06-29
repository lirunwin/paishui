<template>
    <div class="decorationChart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'decorationChart',//动态装饰图表
    props:{
        color:{},
        chartData:{},
        fontSize:{
            type: Function,
            default: () => {
                return Function
            }
        }
    },
    watch:{
        chartData:{
            handler(n){
                this.animateChart(this.color,n.value,n.unit)
            },
            deep:true,
        },
    },
    data(){
        return{
            timerId:null,
            chart:null,
        }
    },
    mounted(){
        this.animateChart(this.color,this.chartData.value,this.chartData.unit)
    },
    methods:{
        animateChart(maincolor,value,unit){
            const that = this
            let ref =this.$refs.chart
            //清除上一个实例
            if(this.chart) this.chart.dispose();
            if (this.timerId) {clearInterval(this.timerId);}
            //初始化实例
            this.chart=echarts.init(ref);//this.$refs.chart
            let angle = 0; //角度，用来做简单的动画效果的
            this.timerId=null;
            let option = {
                backgroundColor: 'transparent',
                title: {
                    text: '{a|' + value + '}\n{c|'+unit+'}',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        rich: {
                            a: {
                                fontSize: this.fontSize(14),
                                color: '#ffffff'
                            },
                            c: {
                                fontSize: this.fontSize(12), 
                                color: '#ffffff',
                                // padding: [5,0]
                            }
                        }
                    }
                },
                series: [
                    {
                        name: "ring5",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            return {
                                type: 'arc',
                                shape: {
                                    cx: api.getWidth() / 2,
                                    cy: api.getHeight() / 2,
                                    r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80,
                                    startAngle: (0 + angle) * Math.PI / 180,
                                    endAngle: (90 + angle) * Math.PI / 180
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: "transparent",
                                    lineWidth: 1.5
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    }, 
                    {
                        name: "ring5", //点
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            let x0 = api.getWidth() / 2;
                            let y0 = api.getHeight() / 2;
                            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80;
                            let point = getCirlPoint(x0, y0, r, (90 + angle))
                            return {
                                type: 'circle',
                                shape: {
                                    cx: point.x,
                                    cy: point.y,
                                    r: 2
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: maincolor
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    },
                    {
                        name: "ring5",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            return {
                                type: 'arc',
                                shape: {
                                    cx: api.getWidth() / 2,
                                    cy: api.getHeight() / 2,
                                    r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80,
                                    startAngle: (180 + angle) * Math.PI / 180,
                                    endAngle: (270 + angle) * Math.PI / 180
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: "transparent",
                                    lineWidth: 1.5
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    },
                    {
                        name: "ring5", // 点
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            let x0 = api.getWidth() / 2;
                            let y0 = api.getHeight() / 2;
                            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80;
                            let point = getCirlPoint(x0, y0, r, (180 + angle))
                            return {
                                type: 'circle',
                                shape: {
                                    cx: point.x,
                                    cy: point.y,
                                    r: 2
                                },
                                style: {
                                    stroke: maincolor, //绿
                                    fill: maincolor
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    },
                    {
                        name: "ring5",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            return {
                                type: 'arc',
                                shape: {
                                    cx: api.getWidth() / 2,
                                    cy: api.getHeight() / 2,
                                    r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9,
                                    startAngle: (270 + -angle) * Math.PI / 180,
                                    endAngle: (40 + -angle) * Math.PI / 180
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: "transparent",
                                    lineWidth: 1.5
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    },
                    {
                        name: "ring5",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            return {
                                type: 'arc',
                                shape: {
                                    cx: api.getWidth() / 2,
                                    cy: api.getHeight() / 2,
                                    r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9,
                                    startAngle: (90 + -angle) * Math.PI / 180,
                                    endAngle: (220 + -angle) * Math.PI / 180
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: "transparent",
                                    lineWidth: 1.5
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    }, 
                    {
                        name: "ring5",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            let x0 = api.getWidth() / 2;
                            let y0 = api.getHeight() / 2;
                            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9;
                            let point = getCirlPoint(x0, y0, r, (90 + -angle))
                            return {
                                type: 'circle',
                                shape: {
                                    cx: point.x,
                                    cy: point.y,
                                    r: 2
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: maincolor
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    }, 
                    {
                        name: "ring5", //点
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            let x0 = api.getWidth() / 2;
                            let y0 = api.getHeight() / 2;
                            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9;
                            let point = getCirlPoint(x0, y0, r, (270 + -angle))
                            return {
                                type: 'circle',
                                shape: {
                                    cx: point.x,
                                    cy: point.y,
                                    r: 2
                                },
                                style: {
                                    stroke: maincolor,
                                    fill: maincolor
                                },
                                silent: true
                            };
                        },
                        data: [0]
                    },
                    //中间圆环 
                    {
                        name: '',
                        type: 'pie',
                        radius: ['70%', '58%'],
                        silent: true,
                        clockwise: true,
                        startAngle: 90,
                        z: 0,
                        zlevel: 0,
                        label: {
                            normal: {
                                position: "center",
                            }
                        },
                        data: [{
                                value: value,
                                name: "",
                                itemStyle: {
                                    normal: {
                                        color: maincolor,
                                    }
                                }
                            },
                        ]
                    },

                ]
            };
            //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
            function getCirlPoint(x0, y0, r, angle) {
                let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
                let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
                return {
                    x: x1,
                    y: y1
                }
            }
            function draw() {
                angle = angle + 3
                that.chart.resize();
                that.chart.setOption(option,{
                    notMerge: true,
                });
                //图表大小自适应
                window.addEventListener("resize", ()=>{
                    that.chart.resize()
                })
            }

            this.timerId = setInterval(function() {
                //用setInterval做动画感觉有问题
                draw()
            }, 100);
        }
    },
    beforeDestroy(){
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }
}
</script>

<style lang="scss" scoped>
.decorationChart{
    height: 100%;
    width: 100%;
}
</style>