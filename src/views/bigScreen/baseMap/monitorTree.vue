<template>
    <transition 
    appear               
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX">
        <div class="widget-monitorTree" ref="widget-monitorTree">
            <div class="wrap">
                <div class="icon" title="监测树" @click="showContent=!showContent">监测树<img :src="buttonImg" /></div>
                <div class="content" v-if="showContent">
                    <div class="header">
                        <div class="title">设备监测树</div>
                        <el-input placeholder="设备名称搜索" v-model="filterText" class="input-with-select" size="mini">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="close" @click="showContent=!showContent"><i class="el-icon-close"></i></div>
                    </div>
                    <div class="statistic">
                        <div class="deviceStatus">
                            <div class="statusItem" v-for="item of statusList" :key="item.type">
                                <div class="itemIcon" :style="setStatusIconColor(item.type)"></div>
                                <div class="itemText" :title="item.num+'个'">{{item.type}}：{{item.num}}个</div>
                            </div>
                        </div>
                        <div class="deviceTypeGroup">
                            <el-tree
                                class="filter-tree"
                                show-checkbox
                                :data="data"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
                                ref="tree">
                                <span slot-scope="{ node }">
                                    {{ node.label }}
                                    <img :src="(`${setNodeImg(node)}`)" style="width: 16px; height: 16px" />
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from '@/utils/request'
export default {
    name:"monitorTree",//监测树
    props:{
        show:{},
    },
    data(){
        return{
            showContent:false,
            buttonImg:null,
            upImg:require('./images/三角上.png'),
            downImg:require('./images/三角下.png'),
            statusList:[
                {code:"onlineNum",type:'在线',num:20},
                {code:"offlineNum",type:'离线',num:20},
                {code:"normalNum",type:'正常',num:20},
                {code:"warnNum",type:'报警',num:20},
            ],
            deviceList:[],
            //
            filterText: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            onlineIcon:require('@/views/bigScreen/baseMap/images/在线.png'),
            offlineIcon:require('@/views/bigScreen/baseMap/images/离线.png'),
            normalIcon:require('@/views/bigScreen/baseMap/images/正常.png'),
            warnIcon:require('@/views/bigScreen/baseMap/images/报警.png'),
        }
    },
    mounted(){
        this.getPageData()
    },
    watch:{
        show:{
        },
        showContent:{
            handler(n,o){
                this.buttonImg=n?this.upImg:this.downImg
            },
            immediate:true
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods:{
        getPageData(){
            const {getRequestResult} = this.$listeners
            getRequestResult({blockCode:'deviceStatuCount'}).then(res=>{
                Object.keys(res).forEach((item)=>{
                    this.statusList[this.statusList.findIndex(c=>c.code===item)].num=res[item]
                })
            }).then(()=>{
                axios.request({ url: '/monitor/device/deviceTypeGroup', method: 'get', data:{} }).then(res=>{
                    let result = res.result
                    Object.keys(result).forEach((item,index)=>{
                        if(item==='device-type') delete result[item]
                        else{
                            this.data.push({id:index,name:item,children:result[item]})
                        }
                    })
                    this.deviceList=result
                    console.log(this.deviceList)
                })
            })
        },
        setStatusIconColor(type){
            let color=(type==='在线')?'#2BA7FF':(type==='离线'?'grey':(type==='正常'?"rgb(30, 203, 30)":'red'))
            return 'background-color:'+color
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        setNodeImg(node){
            const {data} = node
            const type = data.deviceStatus
            let iconSrc;
            if(node.isLeaf == false && node.parent.parent == null){
                iconSrc=""
            }else{
                iconSrc=(type==='在线')?this.onlineIcon:(type==='离线'?this.offlineIcon:(type==='正常'?this.normalIcon:this.warnIcon))
            }
            return iconSrc
        }
    }
}
</script>

<style lang="scss" scoped>
.animate__flipInX,.animate__flipOutX{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-monitorTree{
    $size10:.052083rem /* 10/192 */;
    $size20:.104167rem /* 20/192 */;
    z-index: 2;
    //position
    top:.505208rem /* 97/192 */;
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
        flex-flow: column;
        align-items: flex-end;
        width: 0;
        .icon{
            width: .416667rem /* 80/192 */;
            height: .177083rem /* 34/192 */;
            background: rgba(3, 109, 190,0.4);
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: .072917rem /* 14/192 */;
            font-weight: 500;
            color: #2BA7FF;
            img{
                width: .104167rem /* 20/192 */;
                height: .083333rem /* 16/192 */;
            }
        }
        .content{
            margin-top: .026042rem /* 5/192 */;
            width: 1.979167rem /* 380/192 */;
            height: 1.979167rem /* 380/192 */;
            background: linear-gradient(0deg, rgba(2, 20, 37, 0.56) 0%, #072643 100%);
            .header{
                height: .208333rem /* 40/192 */;
                margin: 0 .052083rem /* 10/192 */;
                padding: .026042rem /* 5/192 */;
                border-bottom: 1px solid rgba(255,255,255,0.7);
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title{
                    font-size: .083333rem /* 16/192 */;
                    font-weight: 500;
                    color: #2BA7FF;
                    white-space: nowrap;
                }
                .close{
                    display: flex;
                    align-items: center;
                    height: 100%;
                    color: rgba(138, 211, 253, 1);
                    font-size:.09375rem /* 18/192 */;
                    cursor: pointer;
                }
                .el-input {
                    width: 1.041667rem /* 200/192 */;
                }
                /deep/ .el-input__inner{
                    background-color: rgb(9, 48, 84);
                    border: none;
                    color: #eee;
                }
                /deep/ .el-input-group__append{
                    background-color: rgb(9, 48, 84);
                    border: none;
                }
                /deep/ .el-icon-search:before{
                    color: rgba(138, 211, 253, 1);
                    font-size:.09375rem /* 18/192 */;
                }
            }
            .statistic{
                display: flex;
                flex-flow: column;
                width: 100%;
                height: calc(100% - .208333rem /* 40/192 */);
                .deviceStatus{
                    width: 100%;
                    height: .104167rem /* 20/192 */;
                    display: flex;
                    margin: .052083rem /* 10/192 */ 0;
                    .statusItem{
                        height: 100%;
                        width: 25%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: .072917rem /* 14/192 */;
                        .itemIcon{
                            border-radius: 50%;
                            height: .052083rem /* 10/192 */;
                            width: .052083rem /* 10/192 */;
                            margin-right: .026042rem /* 5/192 */;
                        }
                        .itemText{
                            white-space: nowrap;
                            flex: 1;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                }
                .deviceTypeGroup{
                    width: 100%;
                    height: calc(100% - .104167rem /* 20/192 */);
                    overflow: auto;
                    /deep/ .el-tree {
                        background: transparent;
                        color: #fff;
                        .el-tree-node__content:hover {
                            background-color: rgb(62, 70, 112);
                        }
                        div[role="group"] > .el-tree-node{
                            width: 50%;
                            float: left;
                        }
                        .el-tree-node.is-current > .el-tree-node__content {
                            background: rgba(22, 119, 255, 0.1);
                            border-right: 3px solid #1677ff;
                            color: #187aff;
                            /deep/ .el-tree-node__expand-icon {
                                color: rgb(0, 112, 255);
                            }
                            /deep/ .is-leaf {
                                color: rgba(0, 0, 0, 0);
                            }
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
    }


}
</style>