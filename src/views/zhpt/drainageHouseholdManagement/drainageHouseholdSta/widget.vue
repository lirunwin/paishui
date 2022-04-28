<template>
    <div class="drainagePortStatistic">
        <drainage-household-map></drainage-household-map>
        <div class="statisticContainer">
            <div class="title">
                <div class="iconSymbol"></div>
                <div class="titleName">统计条件</div>
            </div>
            <div class="statisticTerms">
                <div class="terms">
                    <label>项目名称：</label>
                    <el-select v-model="projectName" placeholder="请选择" size="small">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="terms">
                    <label>统计范围：</label>
                    <el-radio-group v-model="statisticRange">
                        <el-radio label="all">全部</el-radio>
                        <el-radio label="map">地图范围</el-radio>
                        <el-radio label="custom">自定义范围</el-radio>
                    </el-radio-group>
                    <div class="drawSelect">
                        <el-tooltip content="圆形选择" placement="top" effect="light">
                            <el-button size="mini"  plain :disabled="isCustom">
                                <img src="../images/C.png" width="20px" height="20px" style="object-fit: contain" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="矩形选择" placement="top" effect="light">
                            <el-button size="mini"  plain :disabled="isCustom">
                                <img src="../images/R.png" width="20px" height="20px" style="object-fit: contain" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="多边形选择" placement="top" effect="light">
                            <el-button size="mini"  plain :disabled="isCustom">
                                <img src="../images/P.png" width="20px" height="20px" style="object-fit: contain" />
                            </el-button>
                        </el-tooltip>
                    </div>
                    <el-radio-group v-model="statisticRange" style="margin-left:10px">
                        <el-radio label="region">
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    {{regionType}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="按行政区">按行政区</el-dropdown-item>
                                    <el-dropdown-item command="按排水分区">按排水分区</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-radio>
                    </el-radio-group>
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
                    <el-button type="primary" size="small" style="float:right">统计</el-button>
                </div>
            </div>
            <div class="title">
                <div class="iconSymbol"></div>
                <div class="titleName">统计结果{{statisticResultNum}}</div>
            </div>
            <div class="chartContainer">
                <div class="chartItem">
                    <drainage-household-chart></drainage-household-chart>
                </div>
                <div class="chartItem">
                    <road-name-chart></road-name-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import drainageHouseholdMap from './drainageHouseholdMap.vue'
import drainageHouseholdChart from './drainageHouseholdChart.vue'
import roadNameChart from './roadNameChart.vue'
export default {
    name:"drainagePortStatistic",//排放口统计
    components:{
        drainageHouseholdMap,
        drainageHouseholdChart,
        roadNameChart
    },
    data(){
        return{
            options: [{
                value: '0',
                label: 'xxx项目'
            }],
            projectName: '',
            statisticRange:"",
            regionType:"按行政区",
            region:"",
            isCustom:true,
            isRegion:true,
            isLinkMap:false,
            statisticResultNum:"(共1253个)"
        }
    },
    watch:{
        'statisticRange':{
            handler(n,o){
                this.isCustom=(n=="custom")?false:true
                this.isRegion=(n=="region")?false:true
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
                    margin-left: 5px;
                    .el-button{
                        padding: 2px;
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
                width: 100%;
                padding: 20px;
            }
            .chartItem:last-child{
                width: 100%;
            }
        }
    }
}
</style>