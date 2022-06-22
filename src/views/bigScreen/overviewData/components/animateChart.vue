<template>
    <div class="animateChart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"animateChart",//环形动画图表
    props:{
        img:{},
        fontSize:{
            type: Function,
            default: () => {
                return Function
            }
        }
    },
    data(){
        return{
            timerId:null
        }
    },
    mounted(){
        this.animateChart(this.img,this.$refs.chart)
    },
    methods:{
        animateChart(img,ref){
            let chart = echarts.init(ref);//this.$refs.chart
            let angle = 0; //角度，用来做简单的动画效果的
            this.timerId=null;
            let option = {
                backgroundColor: 'transparent',
                graphic: {//图形中间图片
                    elements: [{
                        type: "image",
                        style: {
                            image: img,
                            width: this.fontSize(45),
                            height: this.fontSize(45),
                        },
                        left: "center",
                        top: "center",
                    }],
                },
                series: [
                    {
                        name: "ring",
                        type: 'custom',
                        coordinateSystem: "none",
                        renderItem: function(params, api) {
                            return {
                                type: 'arc',
                                shape: {
                                    cx: api.getWidth() / 2,
                                    cy: api.getHeight() / 2,
                                    r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95,
                                    startAngle: (0 + -angle) * Math.PI / 180,
                                    endAngle: (320 + -angle) * Math.PI / 180
                                },
                                style: {
                                    stroke: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                        offset: 0, color: '#00BCFF' // 0% 处的颜色
                                    }, {
                                        offset: 0.5, color: 'rgba(0, 188, 255, 0.7)' // 50% 处的颜色
                                    }, {
                                        offset: 1, color: 'rgba(0, 188, 255, 0)' // 100% 处的颜色
                                    }]),
                                    fill: "transparent",
                                    lineWidth: 3
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
                        radius: ['60%', '48%'],
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
                                value: 0,
                                name: "",
                                itemStyle: {
                                    normal: {
                                        color: 'transparent',
                                    }
                                }
                            },
                        ]
                    },

                ]
            };
            function draw() {
                angle = angle + 3
                chart.resize();
                chart.setOption(option,{
                    notMerge: true,
                });
                //图表大小自适应
                window.addEventListener("resize", ()=>{
                    chart.resize()
                })
            }
            if (this.timerId) {
                clearInterval(this.timerId);
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

<style lang='scss' scoped>
.animateChart{
    height: 100%;
    width: 100%;
}
</style>