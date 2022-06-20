<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInRight"
    leave-active-class="animate__slideOutRight">
        <div class="widget-EMDStatistic" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">设备监测详情统计</span>
                </div>
            </div>
            <div class="content-info">
                <div class="sta-info">
                    <div class="sta-item" v-for="(item,index) in staList" :key="item.title">
                        <div class="title">{{item.title}}：</div>
                        <div class="value" :class="'value'+index">{{item.num}}个</div>
                    </div>
                </div>
                <div class="table-info">
                    <statisticTable :column="column" :tableData="tableData" isScroll/>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import statisticTable from './components/statisticTable.vue'
import Config from './config.json'
export default {
    name:"EMDStatistic",//设备监测详情统计
        components:{
        statisticTable
    },
    props:{
        show:{},
    },
    data(){
        return{
            staList:[
                {title:'视频',num:0,},
                {title:'水位',num:0,},
                {title:'液位',num:0,},
                {title:'井盖',num:0,},
            ],
            tableData:[],
            column:[],
        }
    },
    computed:{
        config(){
            return Config
        }
    },
    mounted(){
        this.column=this.config.EMDColumn
        this.getPageData()
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'deviceMonitorDetail'}).then(res=>{
                let result=res.filter(item=>item.typeCode)
                this.tableData=result.map((item)=>{
                    this.resetStaList(item)
                    return{
                        ...item,
                        deviceStatus:item.deviceStatus=='0'?'正常':"报警",
                        address:item.address?item.address:'无'
                    }
                })
            })
        },
        resetStaList(item){
            switch(item.typeName){
                case '液位监测仪':this.staList[this.staList.findIndex(child => (child.title === '液位' ))].num++
                                break;
                case '智慧井盖':this.staList[this.staList.findIndex(child => (child.title === '井盖' ))].num++
                                break;
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.animate__slideInRight,.animate__slideOutRight{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-EMDStatistic{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    top: 1.911458rem /* 367/192 */;
    bottom: 1.5625rem /* 300/192 */;
    margin-right: $size20 /* 20/192 */;
    right: 0rem /* 0/192 */;
    position: absolute;
    //size
    height: calc(100% - 3.489583rem /* 670/192 */);
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
            .icon{
                height: .166667rem /* 32/192 */;
                width: .34375rem /* 66/192 */;
                background: url("./images/设备监测.png") no-repeat center center;
                background-size: 100% 100%;
            }
            span{
                font-weight: bold;
                font-size: .083333rem /* 16/192 */;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
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
                    color: red;
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