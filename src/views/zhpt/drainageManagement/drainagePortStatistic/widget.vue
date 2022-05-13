<template>
    <div class="drainagePortStatistic">
        <port-map-view ref="portMap"></port-map-view>
        <div class="statisticContainer">
            <div class="title">
                <div class="iconSymbol"></div>
                <div class="titleName">统计条件</div>
            </div>
            <div class="statisticTerms">
                <div class="terms">
                    <label>项目名称：</label>
                    <el-select v-model="projectName" placeholder="请选择" size="small" multiple clearable>
                        <el-option
                        v-for="item in projectInfo"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="terms">
                    <el-form :inline="true" :disabled="isOpenRange">
                        <el-form-item label="统计范围">
                            <!-- <label style="white-space:nowrap">统计范围：</label> -->
                            <el-radio-group v-model="statisticRange">
                                <el-radio label="all">全部</el-radio>
                                <el-radio label="map">地图范围</el-radio>
                                <el-radio label="custom">自定义范围</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item >
                            <div class="drawSelect">
                                <el-tooltip content="圆形选择" placement="top" effect="light">
                                    <el-button size="mini"  plain :disabled="isCustom" @click="customRange('circle')">
                                        <img src="../images/C.png" width="20px" height="20px" style="object-fit: contain"/>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="矩形选择" placement="top" effect="light">
                                    <el-button size="mini"  plain :disabled="isCustom" @click="customRange('rect')">
                                        <img src="../images/R.png" width="20px" height="20px" style="object-fit: contain"/>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="多边形选择" placement="top" effect="light">
                                    <el-button size="mini"  plain :disabled="isCustom" @click="customRange('polygon')">
                                        <img src="../images/P.png" width="20px" height="20px" style="object-fit: contain"/>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                        <el-form-item >
                            <el-radio-group v-model="statisticRange" style="margin-left:10px">
                                <el-radio label="region">
                                    <el-dropdown @command="handleCommand" :disabled="isRegion">
                                        <span class="el-dropdown-link">
                                            {{regionType}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown" >
                                            <el-dropdown-item command="按行政区">按行政区</el-dropdown-item>
                                            <el-dropdown-item command="按排水分区">按排水分区</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="region" 
                                placeholder="请选择" 
                                style="margin-left:14px;width:164px" 
                                :disabled="isRegion"
                                multiple 
                                clearable 
                                size="mini"
                            >
                                <el-option label="xxx片区" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="terms link-map">
                    <div>
                        <label>地图联动：</label>
                        <el-switch
                        v-model="isLinkMap"
                        active-text="开启"
                        inactive-text="关闭">
                        </el-switch>
                    </div>
                    <el-button type="primary" size="small" style="float:right" @click="checkStatistic()" :disabled="isOpenRange">统计</el-button>
                </div>
            </div>
            <div class="title">
                <div class="iconSymbol"></div>
                <div class="titleName">统计结果（共{{statisticResultNum}}个）</div>
            </div>
            <div class="chartContainer">
                <div class="chartItem">
                    <port-type-chart :resultInfo="portTypeInfo"></port-type-chart>
                </div>
                <div class="chartItem">
                    <ownership-units-chart :resultInfo="ownershipUnits"></ownership-units-chart>
                </div>
                <div class="chartItem">
                    <road-name-chart :resultInfo="roadName"></road-name-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import portMapView from './portMapView.vue'
import portTypeChart from './portTypeChart.vue'
import ownershipUnitsChart from './ownershipUnitsChart.vue'
import roadNameChart from '@/views/zhpt/drainageManagement/roadNameChart.vue'
export default {
    name:"drainagePortStatistic",//排放口统计
    components:{
        portMapView,
        portTypeChart,
        ownershipUnitsChart,
        roadNameChart
    },
    data(){
        return{
            projectInfo: [],
            projectName: '',
            statisticRange:"all",
            regionType:"按行政区",
            region:"",
            isLinkMap:false,
            //统计条件操作变量
            isCustom:true,
            isCustomOrg:true,
            isRegion:true,
            isRegionOrg:true,
            isOpenRange:false,
            //统计结果变量
            statisticResultNum:0,
            portTypeInfo:[],
            ownershipUnits:[],
            roadName:[],
        }
    },
    watch:{
        statisticRange:{
            handler(n,o){
                if(n=="custom"){
                    this.isCustomOrg=this.isCustom=false
                }else{
                    this.isCustomOrg=this.isCustom=true
                    if(this.$refs['portMap'].drawer) this.$refs['portMap'].drawer.remove()
                }
                this.isRegionOrg=this.isRegion=(n=="region")?false:true
            }
        },
        isLinkMap:{
            handler(n,o){
                if(n) {
                    this.isOpenRange=true;
                    this.isCustom=true
                    this.isRegion=true
                    this.$refs['portMap'].zoomAndMove()
                    this.$refs['portMap'].removeLayer()
                }else{
                    this.isOpenRange=false;
                    this.isCustom=this.isCustomOrg?true:false
                    this.isRegion=this.isRegionOrg?true:false
                    this.$refs['portMap'].removeZoomRegister()
                }
            }
        },
        projectName:{
            handler(n,o){
                this.$refs['portMap'].projectName=n
            }
        }
    },
    mounted(){

    },
    methods:{
        //区域选择操作
        handleCommand(command){
            this.regionType=command
        },
        //自定义范围
        customRange(type){
            this.$refs['portMap'].customRange(type)
        },
        //开始统计
        checkStatistic(){
            this.$refs['portMap'].checkResult(this.statisticRange)
        },
        //接收项目信息
        getProjectInfo(value){
            this.projectInfo=value
        }
    }
}
</script>

<style lang="scss" scoped>
.drainagePortStatistic{
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .statisticContainer{
        height: 100%;
        width: 48%;
        .title{
            height: 20px;
            width: 100%;
            font-size: 16px;
            .iconSymbol{
                height: 100%;
                width: 5px;
                background-color: royalblue;
                float: left;
            }
            .titleName{
                margin-left: 20px;
                line-height: 24px;
            }
        }
        .statisticTerms{
            width: 100%;
            display: flex;
            flex-flow: column;
            padding: 10px 20px;
            font-size: 14px;
            .terms{
                display: flex;
                align-items: center;
                padding: 10px;
                .drawSelect{
                    display: flex;
                    margin-left: 5px;
                    .el-button{
                        padding: 2px;
                    }
                }
                .el-radio-group{
                    display: flex;
                }
                .el-form{
                    display: flex;
                }
                .el-form-item{
                    display: flex;
                    align-items: center;
                    margin: 0;
                    /deep/.el-form-item__label{
                        white-space:nowrap
                    }
                }
            }
            .link-map{
                justify-content: space-between;
            }
        }
        .chartContainer{
            width: 100%;
            height: calc(100% - 210px);
            .chartItem{
                float: left;
                height: 50%;
                width: 50%;
                padding: 20px;
            }
            .chartItem:last-child{
                width: 100%;
            }
        }
    }
}
</style>