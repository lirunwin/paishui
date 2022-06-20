<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__slideInUp"
    leave-active-class="animate__slideOutDown">
        <div class="widget-PNLLMonitoring" v-if="show">
            <div class="head">
                <div class="title">
                    <div class="icon"></div>
                    <span class="site-info">管网液位监测</span>
                </div>
            </div>
            <div class="content-info" id="content-info">
                <specificTable 
                :column="column" 
                :tableData="tableData" 
                :cellStyle="cellStyle"
                isScroll
                @rowClick="rowClick"
                />
            </div>
            <infoDialog :visible="dialogVisible" :title="title">
                <historyInfo v-on="$listeners"/>
            </infoDialog>
        </div>
    </transition>
</template>

<script>
import Config from './config.json'
import specificTable from './components/specificTable.vue'
import infoDialog from './components/infoDialog.vue'
import historyInfo from './components/historyInfo.vue'
export default {
    name:"PNLLMonitoring",//管网液位监测
    components:{
        specificTable,
        infoDialog,
        historyInfo
    },
    props:{
        show:{},
    },
    data(){
        return{
            tableData:[],
            column:[],
            dialogVisible:false,
            title:"",
        }
    },
    computed:{
        config(){
            return Config
        }
    },
    mounted(){
        this.column=this.config.PNLLMColumn
        this.getPageData()
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'gwywjc'}).then(res=>{
                this.tableData=res.map(item=>{
                    return {
                        ...item,
                        deviceStatus:item.deviceStatus=='0'?'离线':"在线",
                        isAlarm:!item.isAlarm?'正常':'报警'
                    }
                })
            })
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            let color='';
            if(columnIndex==4){
                if(row.deviceStatus=='离线') color='#FF3F40'
            }
            if(columnIndex==5){
                if(row.monitorStatus=='报警') color='#FF3F40'
            }
            return {
                color:color,
                fontSize:'.067708rem',
                textAlign: 'center',
                'border-bottom':'1px solid rgba(236, 236, 236, 0.3)'
            }
        },
        rowClick(row){
            console.log("点击结果",row)
            this.dialogVisible=true
            this.title=row.deviceName+"-"+"监测数据"
        },
    }
}
</script>

<style lang="scss" scoped>
.animate__slideInUp,.animate__slideOutDown{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-PNLLMonitoring{
    z-index: 2;
    margin-left: 2.34375rem /* 450/192 */;
    bottom: .052083rem /* 10/192 */;
    height:  1.458333rem /* 280/192 */;
    width: 5.302083rem /* 1018/192 */;
    overflow: hidden;
    position: absolute;
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
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
                background: url("./images/管网液位监测.png") no-repeat center center;
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
        display: flex;
        flex-flow: row wrap;
        padding: .010417rem /* 2/192 */;
    }
}
</style>>
