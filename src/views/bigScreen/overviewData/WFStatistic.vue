<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInLeft"
    leave-active-class="animate__slideOutLeft">
        <div class="widget-WFStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">工作人员统计</span>
                </div>
            </div>
            <div class="content-info">
                <div class="sta-info">
                    <div class="sta-item" v-for="(item,index) in staList" :key="item.title">
                        <div class="title">{{item.title}}</div>
                        <div class="value" :class="'value'+index">{{item.num}}个</div>
                    </div>
                </div>
                <div class="table-info">
                    <specificTable 
                    :column="column" 
                    :tableData="tableData" 
                    isScroll
                    @operation="showTrack"/>
                </div>
                <trackPlayer :show="showTrackPlayer"/>
            </div>
        </div>
    </transition>
</template>

<script>
import specificTable from './components/statisticTable.vue'
import trackPlayer from './components/trackPlayer.vue'
import Config from './config.json'
export default {
    name:"WFStatistic",//工作人员统计
    components:{
        specificTable,
        trackPlayer
    },
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
            staList:[
                {
                    title:'总数：',
                    num:20,
                },
                {
                    title:'上班：',
                    num:8,
                },
                {
                    title:'下班：',
                    num:10,
                },
                {
                    title:'未上班：',
                    num:2,
                },
            ],
            tableData:[
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"未上班",
                },
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"上班",
                },
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"未上班",
                },
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"上班",
                },
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"下班",
                },
                {
                    "expNo":"工程部",
                    "outfalltype":"xxx",
                    "outfallshape":"6",
                    "sewagesystemId":"12",
                    "status":"下班",
                },
            ],
            column:[],
            showTrackPlayer:false,
        }
    },
    watch:{
        show:{
            handler(n,o){
                if(n){

                }else{
                    this.showTrackPlayer=false
                }
            },
        },
    },
    computed:{
        config(){
            return Config
        }
    },
    mounted(){
        this.column=this.config.WFColumn
        this.getPageData()
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'troubleCount'}).then(res=>{
                // console.log('troubleCount',res)
            })
        },
        showTrack(data){
            console.log(data)
            this.showTrackPlayer=true
        },
    },
}
</script>

<style lang="scss" scoped>
.animate__slideInLeft,.animate__slideOutLeft{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-WFStatistic{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom:$size10;
    margin-left: $size20 /* 20/192 */;
    position: absolute;
    //size
    height: 1.71875rem /* 330/192 */;
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
                background: url("./images/工作人员.png") no-repeat center center;
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
        }
    }
    .content-info{
        width: 100%;
        height: calc(100% - .166667rem);
        overflow: hidden;
        display: flex;
        flex-flow: row wrap;
        .sta-info{
            width: 100%;
            height: .286458rem /* 55/192 */;
            display: flex;
            .sta-item{
                height: 100%;
                width: 25%;
                padding: .104167rem /* 20/192 */ 0;
                display: flex;
                justify-content: center;
                align-items: center;
                .title{
                    font-size: .072917rem /* 14/192 */;
                    font-weight: 500;
                    color: #FEFFFF;
                    white-space: nowrap;
                }
                .value{
                    font-size: .083333rem /* 16/192 */;
                    font-weight: bold;
                    white-space: nowrap;
                }
                .value0{
                    color: #2BA7FF;
                }
                .progressValue{
                    color: #06B062;
                }
                .value2{
                    color: #FFB54C;
                }
                .value3{
                    color: #81A5CA;
                }
            }
        }
        .table-info{
            width: 100%;
            height: calc(100% - .286458rem /* 55/192 */);
        }
    }
}
</style>