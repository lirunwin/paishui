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
export default {
    name:"LayerControl",//图层控制
    props:{
        hideBoth:{}
    },
    data(){
        return{
            layerBoardShow:false,
            checkList:[],
            layerGroup:[],      
            layerList:[],    
            mapUtilObj:null,  
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
        checkList:{

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
        }
    },

    methods:{
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
        }
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
                background: url('./images/图层.png') no-repeat center center;
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
                    color: #2BA7FF;
                }
            }
            .el-checkbox-group{
                display: flex;
                flex-flow: column;
            }
            .el-checkbox{
                color: #fff;
                margin: .052083rem /* 10/192 */ 0;
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