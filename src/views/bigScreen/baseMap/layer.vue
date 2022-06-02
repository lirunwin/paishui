<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX">
        <div class="widget-LayerControl" ref="widget-LayerControl">
            <div class="wrap">
                <div class="icon" title="图层控制" @click="layerBoardShow=!layerBoardShow"><div class="img"></div></div>
                <div class="layerBoard" v-if="layerBoardShow">
                    <div class="layerItem">
                        <div class="layerCategory">其他</div>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="巡检人员"></el-checkbox>
                            <el-checkbox label="工程车辆"></el-checkbox>
                            <el-checkbox label="上报隐患"></el-checkbox>
                            <el-checkbox label="上报汛情"></el-checkbox>
                            <el-checkbox label="上报时间"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name:"LayerControl",//图层控制
    props:{
        show:{},
    },
    data(){
        return{
            layerBoardShow:false,
            checkList:[]
        }
    },
    mounted(){

    },
    watch:{
        show:{
            handler(n,o){
                if(n){
                    this.$nextTick(()=>{
                        this.$refs['widget-LayerControl'].style.setProperty('--bottom', '1.546875rem') // 给变量赋值
                    })
                }else{
                    this.$nextTick(()=>{
                        this.$refs['widget-LayerControl'].style.setProperty('--bottom', '.052083rem') // 给变量赋值
                    })

                }
            },
            immediate:true
        },
    },
    methods:{

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
    bottom: var(--bottom);
    margin-right: 2.34375rem /* 450/192 */;
    position: absolute;
    right: 0;
    //size
    // height: .546875rem /* 105/192 */;
    // width: 2.083333rem /* 400/192 */;
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
            width: 124px;
            // height: 144px;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            flex-flow: column;
            padding: .026042rem /* 5/192 */;
            .layerItem{
                display: flex;
                flex-flow: column;
                .layerCategory{
                    font-size: .072917rem /* 14/192 */;
                    font-weight: bold;
                    color: #2BA7FF;
                }
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