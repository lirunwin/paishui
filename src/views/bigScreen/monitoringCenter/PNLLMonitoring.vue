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
                @rowDblclick="rowDblclick"
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
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {Style,Icon,} from 'ol/style';
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
            vectorLayer:null,
            feature:null,
        }
    },
    computed:{
        config(){
            return Config
        },
        view(){
            return this.$store.state.bigScreen.view
        }
    },
    mounted(){
        this.column=this.config.PNLLMColumn
        this.getPageData()
    },
    watch:{
        show(n,o){
            if(!n){
                this.vectorLayer.getSource().clear()
            }
        },
        view:{
            handler(n,o){
                if(n) this.initVector()
            }
        }
    },
    methods:{
        initVector(){
            const gl =this;
            this.view.on('click',function(e){
                let pixel = gl.view.getEventPixel(e.originalEvent)
                gl.view.forEachFeatureAtPixel(pixel,function(feature){
                    const {info} = feature.getProperties()
                    gl.dialogVisible=true
                    gl.title=info.deviceName+"-"+"监测数据"
                });
            })
            //创建矢量层
            this.vectorLayer = new VectorLayer({
                source: new VectorSource({wrapX: false,})
            });
            //将图层添加到地图中
            this.view.addLayer(this.vectorLayer);
        },
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'gwywjc'}).then(res=>{
                this.tableData=res.map(item=>{
                    Object.keys(item).forEach((val) => (item[val] = item[val] || "/"));
                    return {
                        ...item,
                        deviceStatus:item.deviceStatus=='0'?'离线':"在线",
                        isAlarm:item.deviceStatus=='0'?'/':(!item.isAlarm=='0'?'正常':'报警')
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
                if(row.isAlarm=='报警') color='#FF3F40'
            }
            return {
                color:color,
                fontSize:'.067708rem',
                textAlign: 'center',
                'border-bottom':'1px solid rgba(236, 236, 236, 0.3)',
                'border':'none'
            }
        },
        rowClick(row){
            this.located(row,[parseFloat(104.146864578),parseFloat(30.013916023)]);
        },
        rowDblclick(row){
            this.dialogVisible=true
            this.title=row.deviceName+"-"+"监测数据"
        },
        //定位方法
        located(info,position){
            this.showPointSymbol(info,position)
            this.view.getView().setCenter(position)
        },
        showPointSymbol(info,position){
            this.vectorLayer.getSource().clear()
            //创建Feature，并添加进矢量容器中
            this.feature = new Feature({
                geometry: new Point(position),
                name: 'My point',
                info
            });
            //创建标记的样式
            this.feature.setStyle(this.setFeatureStyle());
            this.vectorLayer.getSource().addFeature(this.feature);
        },
        /**
         * @description 为要素设置样式
         */
        setFeatureStyle() {
            return new Style({
                image: new Icon({
                    anchor: [0.5, 0.7],
                    scale:1,
                    //图标的url
                    src: require('@/views/bigScreen/monitoringCenter/images/液位.png')
                })
            });
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
                // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
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
