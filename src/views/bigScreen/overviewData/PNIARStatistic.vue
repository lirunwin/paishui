<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInLeft"
    leave-active-class="animate__slideOutLeft">
        <div class="widget-PNIARStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">管网巡检与上报统计</span>
                    <el-select v-model="value" placeholder="请选择" size="mini" :popper-append-to-body="false">
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
                <div class="pieChartArea">
                    <div class="pItem" v-for="item in staList" :key="item.title">
                        <div class="pchart">
                            <decorationChart  
                            :color="item.color" 
                            :chartData="item" 
                            :fontSize="$listeners.fontSize"/>
                        </div>
                        <div class="title">{{item.title}}</div>
                    </div>
                </div>
                <div class="barChartArea">
                    <div class="bItem" v-for="item in orderList" :key="item.title">
                        <div class="bchart">
                            <animateChart :img="item.img" :fontSize="$listeners.fontSize"/>
                        </div>
                        <div class="bcomb">
                            <div class="sta">
                                <div class="staWrap">
                                    <div class="staName">{{item.title}}：</div>
                                    <div class="staValue">{{item.value}}个</div>
                                </div>
                                <div class="staWrap">完成率：<div class="staPercent">{{item.percent}}%</div></div>
                            </div>
                            <div class="cha">
                                <batteryChart :value="item.percent" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="boardArea">
                    <div class="boardItem" v-for="item in reportList" :key="item.title">
                        <reportCard :reportData="item" />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import decorationChart from './components/decorationChart.vue'
import animateChart from './components/animateChart.vue'
import batteryChart from './components/batteryChart.vue'
import reportCard from './components/reportCard.vue'
export default {
    name:"PNIARStatistic",//管网巡检与上报统计
    components:{
        decorationChart,
        animateChart,
        batteryChart,
        reportCard
    },
    props:{
        show:{},
    },
    data(){
        return{
            options: [
                {value: '全部',label: '全部'},
                {value: '今年',label: '今年'},
                {value: '去年',label: '去年'},
            ],
            value: '全部',
            staList:[
                {
                    title:"巡检里程",
                    code:'length',
                    value:0,
                    unit:'km',
                    color:'#05BCD7'
                },
                {
                    title:"巡检任务数",
                    code:'taskNum',
                    value:0,
                    unit:'个',
                    color:'#FFB54C'
                },
                {
                    title:"工单总数",
                    code:"",
                    value:0,
                    unit:'个',
                    color:'#0EA7FF'
                }
            ],
            orderList:[
                {
                    title:"汛情工单总数",
                    value:100,
                    unit:'个',
                    percent:'82',
                    img:require('./images/汛情.png'),
                },
                {
                    title:"事件工单总数",
                    value:200,
                    unit:'个',
                    percent:'82',
                    img:require('./images/事件.png'),
                },
                {
                    title:"隐患工单总数",
                    value:300,
                    unit:'个',
                    percent:'60',
                    img:require('./images/维修.png'),
                }
            ],
            reportList:[
                {
                    title:"隐患上报",
                    normal:{
                        title:'一般',
                        value:30,
                    },
                    warning:{
                        title:'严重',
                        value:10,
                    }
                },
                {
                    title:"汛情上报",
                    normal:{
                        title:'普通',
                        value:30,
                    },
                    warning:{
                        title:'警情',
                        value:10,
                    }
                },
                {
                    title:"事件上报",
                    normal:{
                        title:'普通',
                        value:30,
                    },
                    warning:{
                        title:'紧急',
                        value:10,
                    }
                }
            ]
        }
    },
    mounted(){
        this.getPageData()
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'patrolCount'}).then(res=>{
                for(let i in res){
                    if(i=='length'){
                        this.staList[this.staList.findIndex(item=>item.code==i)].value=(res[i]/1000).toFixed(0)
                    }else{
                        this.staList[this.staList.findIndex(item=>item.code==i)].value=res[i]
                    }
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.animate__slideInLeft,.animate__slideOutLeft{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-PNIARStatistic{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    top: .505208rem /* 97/192 */;
    margin-left: $size20 /* 20/192 */;
    position: absolute;
    //size
    height: calc(100% - 2.380208rem /* 457/192 */);
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
                background: url("./images/管网与上报.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                flex: 1;
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
                padding: .041667rem /* 8/192 */;
            }
            .el-select{
                flex: 0.3;
                /deep/ input{
                    background: transparent;
                    border: none;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 500;
                    color: #2BA7FF;
                    padding: 0;
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
        overflow: hidden;
        padding: 2px;
        .pieChartArea{
            height: 25%;
            width: 100%;
            display: flex;
            justify-content: center;
            .pItem{
                width: 33%;
                height: 100%;
                display: flex;
                flex-flow: column;
                .pchart{
                    flex: 1;
                }
                .title{
                    flex: 0.2;
                    text-align: center;
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }
        }
        .barChartArea{
            height: 45%;
            width: 100%;
            display: flex;
            margin: .052083rem /* 10/192 */ 0;
            flex-flow: column;
            .bItem{
                width: 100%;
                height: 33%;
                display: flex;
                margin: 0 0 .052083rem /* 10/192 */ 0;
                .bchart{
                    flex: 0.2;
                }
                .bcomb{
                    margin: .026042rem /* 5/192 */;
                    flex: 1;
                    display: flex;
                    flex-flow: column;
                    background: linear-gradient(-90deg, rgba(43, 167, 255,0.2) 0%, rgba(43, 167, 255, 0.05) 100%);
                    .sta{
                        flex: 0.5;
                        padding: .026042rem /* 5/192 */ .104167rem /* 20/192 */;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: .072917rem /* 14/192 */;
                        .staWrap{
                            display: flex;
                        }
                        .staName{
                            font-weight: 400;
                            color: #0EA7FF;
                        }
                        .staValue{
                            font-weight: bold;
                        }
                        .staPercent{
                            font-weight: bold;
                            color: #0EA7FF;
                        }
                    }
                    .cha{
                        flex: 0.5;
                        padding: 5px;
                    }
                }
            }
        }
        .boardArea{
            height: 25%;
            width: 100%;
            display: flex;
            justify-content: center;
            .boardItem{
                width: 33%;
                height: 100%;
                display: flex;
                flex-flow: column;
            }
        }
    }
}
</style>