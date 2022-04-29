<template>
<div class="drainageHouseholdThe">
    <div class="title">
        <div class="iconSymbol"></div>
        <div class="titleName">显示设置</div>
    </div>
    <div class="visibleSettings">
        <el-form :model="visibleSettings" :rules="rules" size="mini" label-width="100px" ref="visibleSettings"> 
            <el-form-item label="项目名称：" prop="projectName">
                <el-select v-model="visibleSettings.projectName" placeholder="请选择项目" multiple clearable>
                    <el-option label="xxx项目" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址：">
                <el-select v-model="visibleSettings.address" placeholder="请选择地址" multiple clearable>
                    <el-option label="xxx路" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="统计范围：">
                <el-radio-group v-model="visibleSettings.statisticRange">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="map">地图范围</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="">
                <el-radio-group v-model="visibleSettings.statisticRange" style="float:left">
                    <el-radio label="custom">自定义范围</el-radio>
                </el-radio-group>
                <div class="right-group">
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
            </el-form-item>
            <el-form-item label="">
                <el-radio-group v-model="visibleSettings.statisticRange" style="float:left">
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
                <div class="right-group">
                    <el-select v-model="visibleSettings.region" placeholder="请选择" style="margin-left:14px" :disabled="isRegion" multiple clearable>
                        <el-option label="xxx片区" value="0"></el-option>
                    </el-select>
                </div>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="mini" style="width:100%;margin-bottom:20px" @click="viewThematicMap()">查看</el-button>
    </div>
    <div class="title">
        <div class="iconSymbol"></div>
        <div class="titleName">专题图列表</div>
    </div>
    <div class="thematicMapList">
        <div v-for="(item, index) in thematicMapList" :key="index" class="thematicMap-list">
        <div>
            <div class="thematicMap-title">
            <i
                style="cursor: pointer"
                @click="changeArrow(index)"
                :class="{ 'el-icon-caret-bottom': showThemBox[index], 'el-icon-caret-right': !showThemBox[index] }"
            ></i>
            <el-checkbox
                @change="setThemLayerVisible(index, item.open)"
                v-model="item.open"
                :label="item.title"
            ></el-checkbox>
            </div>
            <transition name="el-zoom-in-top">
            <div v-if="item.type === 'gradient' && showThemBox[index]" class="transition-box">
                <div class="line-color"></div>
                <div class="text-mix-max">
                <span>{{ item.start }}</span>
                <span>{{ item.end }}</span>
                </div>
            </div>
            <div v-else-if="showThemBox[index]" class="transition-box">
                <ul>
                <li v-for="(level, i) in item.level" :key="i" :class="comStyle(item.type, level.color)">
                    {{ level.label + "("+level.num + level.unit +")"}}
                </li>
                </ul>
            </div>
            </transition>
        </div>
        </div>
    </div>
</div>
</template>

<script>
import VectorSource from 'ol/source/Vector'
export default {
    name:"drainageHouseholdThe",//排放口专题图
    data(){
        return{
            visibleSettings:{
                projectName:"",
                address:"",
                statisticRange:"",
                region:""
            },
            rules:{
                projectName: [
                    { required: true, message: '请选择项目', trigger: 'blur' },
                ],
            },
            isCustom:true,
            isRegion:true,
            regionType:"按行政区",

            //
            thematicMapList: [
                {
                    title: '排放口类型专题图',
                    layerName: 'pipeDefectLayer',
                    open: false,
                    type: 'circle',
                    level: [
                        { color: 'blue', label: '雨水', num: 111, unit: '个' },
                        { color: 'red', label: '污水', num: 111, unit: '个' },
                        { color: 'brown', label: '雨污合流', num: 111, unit: '个' }
                    ]
                },
            ],
            showThemBox: [true, true, true, true],
            outletLayer:null,
        }
    },
    watch:{
        'visibleSettings.statisticRange':{
            handler(n,o){
                this.isCustom=(n=="custom")?false:true
                this.isRegion=(n=="region")?false:true
            }
        }
    },
    methods:{
        //专题图查看
        viewThematicMap(){
            this.$refs['visibleSettings'].validate((valid) => {
                if (valid) {
                    
                } else {
                    return false;
                }
            });
        },
        //区域选择操作
        handleCommand(command){
            this.regionType=command
        },
        changeArrow(index) {
            this.$set(this.showThemBox, index, !this.showThemBox[index])
        },
        setThemLayerVisible(index, visible) {
            this.outletLayer = new VectorLayer({ source: new VectorSource(), visible: false })
            this.outletLayer.setVisible(visible)
            visible && this.openDefect()
        },
        comStyle(type, color) {
        let className = ''
        switch (type) {
            case 'circle':
            className = 'type-circle'
            break
            case 'square':
            className = 'type-square'
            break
            case 'line':
            className = 'type-line'
            break
        }
        return `item-${color} ${className}`
        },
    },
}
</script>

<style lang="scss" scoped>
.drainageHouseholdThe{
    width: 100%;
    height: 100%;
    .title{
        height: 20px;
        width: 100%;
        font-size: 14px;
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
    .visibleSettings{
        // height: 100px;
        padding: 10px 0 0 0;
        // /deep/ 换成 >>>也可以
        // /deep/.el-form-item__label{
        //     width: 100px;
        //     text-align: right;
        // }
        /deep/.el-form-item__content{
            // display: flex;
            // float:left
            width: 260px;
        }
        .right-group{
            padding-left: 20px;
            margin-top: -8px;
            display: flex;
            line-height: 1;
            vertical-align: middle;
            .el-button{
                padding: 2px;
            }
        }
    }
    .thematicMapList{
        width: 100%;
        height: calc(100% - 320px);
        overflow-y: auto;
        ul,
        li {
            padding: 0;
            margin: 0;
            list-style: none;
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
        }
        .thematicMap-list {
            padding: 10px 0 0 5%;
            display: flex;
            flex-direction: column;
            .transition-box {
                padding: 6px 0 6px 44px;
                box-sizing: border-box;
            }
        }
        .line-color {
        width: 140px;
        height: 10px;
        border: 1px solid #666;
        background: linear-gradient(to right, #3ce10f, #ff0602); /* 标准的语法 */
        }
        .text-mix-max {
        width: 140px;
        display: flex;
        padding: 8px 0;
        box-sizing: border-box;
        justify-content: space-between;
        }
        .type-circle {
        margin: 10px 0 10px 20px !important;
        &::before {
            position: relative;
            left: -20px;
            top: -2px;
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        }
        .type-square {
        margin: 10px 0 10px 20px !important;
        &::before {
            position: relative;
            left: -20px;
            top: -2px;
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: transparent !important;
            display: inline-block;
        }
        }
        .type-line {
        margin: 10px 0 10px 18px !important;
        &::before {
            position: relative;
            top: -2px;
            left: -20px;
            content: '';
            width: 40px;
            height: 8px;
            display: inline-block;
        }
        }
        .item-blue {
            &::before {
                background-color: royalblue;
                border: 1px solid royalblue;
            }
        }
        .item-brown {
            &::before {
                background-color: brown;
                border: 1px solid brown;
            }
        }
        .item-red {
            &::before {
                background-color: #ff0000;
                border: 1px solid #ff0000;
            }
        }
    }
}
</style>