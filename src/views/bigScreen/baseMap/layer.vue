<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX">
        <div class="widget-LayerControl" ref="widget-LayerControl">
            <div class="wrap">
                <div class="icon" title="图层控制" @click="layerBoardShow=!layerBoardShow"><div class="img"></div></div>
                <div class="layerBoard" v-show="layerBoardShow">
                    <div class="layerItem" v-for="item of layerGroup" :key="item.name">
                        <div class="layerCategory">{{item.title}}</div>
                        <el-checkbox-group v-model="layerList" v-for="layerItem of item.sublayers" :key="layerItem.name">
                            <el-checkbox 
                            :label="layerItem.title" 
                            :checked="layerItem.visible"
                             @change="setLayerVisible(layerItem.name,!layerItem.visible)">
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="layerItem">
                        <div class="layerCategory">其他</div>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="巡检人员"></el-checkbox>
                            <el-checkbox label="工程车辆"></el-checkbox>
                            <el-checkbox label="隐患位置"></el-checkbox>
                            <el-checkbox label="汛情位置"></el-checkbox>
                            <el-checkbox label="事件位置"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {Style,Icon} from 'ol/style';
import {getFloodseasonwPage,getTroublePage,getCarListPage,getEventPage,getUserGpsPage} from '@/api/bigScreenAPI/bigScreenRequest'
export default {
    name:"LayerControl",//图层控制
    props:{
        hideBoth:{},
        showMonitoringCenter:{}
    },
    data(){
        return{
            layerBoardShow:false,
            checkList:[],
            layerGroup:[],      
            layerList:[],    
            mapUtilObj:null,  
            //其他图层数据
            floodPosition:[],
            troublePosition:[],
            carPosition:[],
            eventPosition:[],
            userPosition:[],
            //图层名
            xqLayer:null,
            yhLayer:null,
            clLayer:null,
            sjLayer:null,
            ryLayer:null,
        }
    },
    computed:{
        layerSource(){
            return this.$store.state.bigScreen.layersSource 
        },
        view(){
            return this.$store.state.bigScreen.view
        }
    },
    watch:{
        hideBoth(n){
            if(!n){
                this.$refs['widget-LayerControl'].style.setProperty('--bottom', '1.59375rem')
                this.$refs['widget-LayerControl'].style.setProperty('--right', '2.34375rem')
            }else{
                this.$refs['widget-LayerControl'].style.setProperty('--bottom', '.052083rem')
                this.$refs['widget-LayerControl'].style.setProperty('--right', '.052083rem')
            }
        },
        showMonitoringCenter(n){
            if(!n){
                this.$refs['widget-LayerControl'].style.setProperty('--bottom', '1.59375rem')
            }else{
                this.$refs['widget-LayerControl'].style.setProperty('--bottom', '.052083rem')
            }
        },
        checkList:{
            handler(n,o){
                this.addFeature()
                n.find(item=>item==='汛情位置')?this.xqLayer.setVisible(true):this.xqLayer.setVisible(false)
                n.find(item=>item==='隐患位置')?this.yhLayer.setVisible(true):this.yhLayer.setVisible(false)
                n.find(item=>item==='工程车辆')?this.clLayer.setVisible(true):this.clLayer.setVisible(false)
                n.find(item=>item==='事件位置')?this.sjLayer.setVisible(true):this.sjLayer.setVisible(false)
                n.find(item=>item==='巡查人员')?this.ryLayer.setVisible(true):this.ryLayer.setVisible(false)
            },
        },
        layerSource:{
            handler(n,o){
                this.setLayerList()
            },
            deep:true
        },
        view(n,o){
            //初始化地图工具对象
            this.mapUtilObj=new mapUtil(n)
            this.initLayer()
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        initLayer() {
            this.view.addLayer(this.xqLayer = new VectorLayer({source: new VectorSource()}))
            this.view.addLayer(this.yhLayer = new VectorLayer({source: new VectorSource()}))
            this.view.addLayer(this.clLayer = new VectorLayer({source: new VectorSource()}))
            this.view.addLayer(this.sjLayer = new VectorLayer({source: new VectorSource()}))
            this.view.addLayer(this.ryLayer = new VectorLayer({source: new VectorSource()}))
        },
        //初始化图层列表
        setLayerList(){
            let layersSource = this.layerSource.filter(item=>item.type=='bigScreenPipeMap')
            this.layerGroup=layersSource[0].sublayers
        },
        //设置图层显隐
        setLayerVisible(layerName,visible){
            let source = this.mapUtilObj.getChangeResource(this.layerSource,layerName, visible)
            this.$store.state.bigScreen.layersSource =source
            this.mapUtilObj.setBigScreenGroupLayerVisible(source)
        },
        getData(){
            //获取汛情位置
            getFloodseasonwPage({size:9999}).then(res=>{
                this.floodPosition=res.result.records
            }).then(()=>{
                //获取隐患位置
                getTroublePage({size:9999}).then(res=>{
                    this.troublePosition=res.result.records
                })
            }).then(()=>{
                //获取车辆位置
                getCarListPage({size:9999}).then(res=>{
                    this.carPosition=res.result.records
                })
            }).then(()=>{
                //获取事件位置
                getEventPage({size:9999}).then(res=>{
                    this.eventPosition=res.result.records
                })
            }).then(()=>{
                //获取巡检人员
                // getUserGpsPage().then(res=>{
                //     console.log('人员',res)
                //     // this.eventPosition=res.result.records
                // })
            })
        },
        addFeature(){
            this.floodPosition.forEach(item => {
                let position = [item.x,item.y]
                let feature = new Feature({
                    geometry: new Point(position),
                    info:item
                });
                this.getTypeToShow(feature,item,'汛情位置')
            });
            this.troublePosition.forEach(item=>{
                let position = [item.lgtd,item.lttd]
                let feature = new Feature({
                    geometry: new Point(position),
                    info:item
                });
                this.getTypeToShow(feature,item,'隐患位置')
            })
            this.carPosition.forEach(item=>{
                let position = [item.lng,item.lat]
                let feature = new Feature({
                    geometry: new Point(position),
                    info:item
                });
                this.getTypeToShow(feature,item,'工程车辆')
            })
            this.eventPosition.forEach(item=>{
                let position = [item.x,item.y]
                let feature = new Feature({
                    geometry: new Point(position),
                    info:item
                });
                this.getTypeToShow(feature,item,'事件位置')
            })
        },
        getTypeToShow(feature,item,type){
            let src=null
            switch(type){
                case '汛情位置':
                    src=item.police?require('@/views/bigScreen/images/上报/上报汛情-报警.png'):
                    require('@/views/bigScreen/images/上报/上报汛情-一般.png')
                    feature.setStyle(new Style({image: new Icon({anchor: [0.5, 0.7],scale:0.7,src:src})}))
                    this.xqLayer.getSource().addFeature(feature)
                    break;
                case '隐患位置':
                    src=item.toubleRangeName!=='一般'?require('@/views/bigScreen/images/上报/上报隐患-报警.png'):
                    require('@/views/bigScreen/images/上报/上报隐患-一般.png')
                    feature.setStyle(new Style({image: new Icon({anchor: [0.5, 0.7],scale:0.7,src:src})}))
                    this.yhLayer.getSource().addFeature(feature)
                    break;
                case '工程车辆':
                    src=require('@/views/bigScreen/images/其他/其他-工程车辆.png')
                    feature.setStyle(new Style({image: new Icon({anchor: [0.5, 0.7],scale:0.7,src:src})}))
                    this.clLayer.getSource().addFeature(feature)
                    break;
                case '事件位置':
                    src=item.category!=='1'?require('@/views/bigScreen/images/上报/上报事件-报警.png'):
                    require('@/views/bigScreen/images/上报/上报事件-一般.png')
                    feature.setStyle(new Style({image: new Icon({anchor: [0.5, 0.7],scale:0.7,src:src})}))
                    this.sjLayer.getSource().addFeature(feature)
                    break;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.animate__flipInX,.animate__flipOutX{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-LayerControl{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    bottom: var(--bottom);//1.59375rem /* 306/192 */;
    margin-right: var(--right);//2.34375rem /* 450/192 */;
    position: absolute;
    right: 0;
    //background
    background-color: rgba(20, 24, 47, 0.5);
    color: #eee;
    box-shadow:0 0 20px rgba(1,9,20,1);
    //font
    font-family: Source Han Sans CN;
    .wrap{
        display: flex;
        align-items: flex-end;
        flex-flow: row-reverse;
        height: 0;
        .icon{
            width: .177083rem /* 34/192 */;
            height: .177083rem /* 34/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .img{
                width: .072917rem /* 14/192 */;
                height: .083333rem /* 16/192 */;
                background: url('~@/views/bigScreen/images/图层.png') no-repeat center center;
                background-size: 100% 100%;
            }
        }
        .layerBoard{
            margin-right: .052083rem /* 10/192 */;
            // width: .78125rem /* 150/192 */;
            height: 1.145833rem /* 220/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            flex-flow: column;
            padding: .052083rem /* 10/192 */ .104167rem /* 20/192 */;
            overflow: auto;
            .layerItem{
                display: flex;
                flex-flow: column;
                .layerCategory{
                    font-size: .072917rem /* 14/192 */;
                    font-weight: bold;
                    color: #8EB2CE;
                }
            }
            .el-checkbox-group{
                display: flex;
                flex-flow: column;
            }
            .el-checkbox{
                color: rgba(255, 255, 255,0.7);
                margin: .052083rem /* 10/192 */ 0;
                font-weight: bold;
            }
            /deep/ .el-checkbox__inner{
                background: #0A1525;
                border-color: rgba(3, 109, 190, 1)
            }
            /deep/ .el-checkbox__inner::after{
                border: 2px solid rgba(17, 156, 255, 1);
                border-left: 0;
                border-top: 0;
            }
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
                background: #0A1525;
                border-color: rgba(3, 109, 190, 1)
            }
            /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
                color: #fff;
            }
        }
    }


}
</style>