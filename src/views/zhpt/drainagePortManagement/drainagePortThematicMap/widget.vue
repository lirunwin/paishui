<template>
<div class="drainagePortThematicMap">
    <div class="title">
        <div class="iconSymbol"></div>
        <div class="titleName">显示设置</div>
    </div>
    <div class="visibleSettings">
        <el-form :model="visibleSettings" :rules="rules" size="mini" label-width="100px" ref="visibleSettings"> 
            <el-form-item label="项目名称：" prop="projectName">
                <el-select v-model="visibleSettings.projectName" placeholder="请选择项目" multiple clearable>
                    <el-option  v-for="item of projectInfo" :key="item"
                    :label="item" 
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址：">
                <el-select v-model="visibleSettings.address" placeholder="请选择地址" multiple clearable>
                    <el-option  v-for="item of addressInfo" :key="item"
                    :label="item" 
                    :value="item">
                    </el-option>
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
                        <el-button size="mini"  plain :disabled="isCustom" @click="customRange('circle')">
                            <img src="../images/C.png" width="20px" height="20px" style="object-fit: contain" />
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="矩形选择" placement="top" effect="light">
                        <el-button size="mini"  plain :disabled="isCustom" @click="customRange('rect')">
                            <img src="../images/R.png" width="20px" height="20px" style="object-fit: contain" />
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="多边形选择" placement="top" effect="light">
                    <el-button size="mini"  plain :disabled="isCustom" @click="customRange('polygon')">
                        <img src="../images/P.png" width="20px" height="20px" style="object-fit: contain" />
                    </el-button>
                    </el-tooltip>
                </div>
            </el-form-item>
            <el-form-item label="">
                <el-radio-group v-model="visibleSettings.statisticRange" style="float:left">
                    <el-radio label="region">
                        <el-dropdown @command="handleCommand" :disabled="isRegion">
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
        <div v-for="(item, index) in thematicMapList" :key="index" class="thematicMap-list" v-show="showThem">
        <div>
            <div class="thematicMap-title">
            <i
                style="cursor: pointer"
                @click="showThemBox=!showThemBox"
                :class="{ 'el-icon-caret-bottom': showThemBox, 'el-icon-caret-right': !showThemBox }"
            ></i>
            <el-checkbox
                @change="setThemLayerVisible(index, item.open)"
                v-model="item.open"
                :label="item.title"
            ></el-checkbox>
            </div>
            <transition name="el-zoom-in-top">
            <div v-if="showThemBox" class="transition-box">
                <ul>
                <li v-for="(level, i) in item.level" :key="i" :class="comStyle(level.color)">
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
import { esriConfig, appconfig } from 'staticPub/config'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature';
import {Polygon, LineString, Point } from 'ol/geom';
import CircleObject from 'ol/geom/Circle'
import {fromCircle} from 'ol/geom/Polygon';
import {
  Style,
  Circle,
  Icon,
  Fill,
  RegularShape,
  Stroke,
  Text
} from 'ol/style'
export default {
    name:"drainagePortThematicMap",//排放口专题图
    data(){
        return{
            visibleSettings:{
                projectName:"",
                address:"",
                statisticRange:"all",
                region:""
            },
            projectInfo:[],//项目信息
            addressInfo:[],//地址信息
            rules:{
                projectName: [
                    { required: true, message: '请选择项目', trigger: 'blur' },
                ],
            },
            isCustom:true,
            isRegion:true,
            regionType:"按行政区",
            thematicMapList: [
                {
                    title: '排放口类型专题图',
                    layerName: 'pipeDefectLayer',
                    open: true,
                    type: 'circle',
                    level: [
                        { color: 'blue', label: '雨水', num: 0, unit: '个' },
                        { color: 'red', label: '污水', num: 0, unit: '个' },
                        { color: 'brown', label: '雨污合流', num: 0, unit: '个' }
                    ]
                },
            ],
            showThem:false,
            showThemBox:true,
            //地图要素变量
            drawer:null,
            customFeature:null,
            limitFeature:null,
            ysFeatures:[],
            wsFeatures:[],
            yswsFeatures:[],
            ysLayer:null,
            wsLayer:null,
            yswsLayer:null,
            dataSetInfo:null,//查询数据集
        }
    },
    mounted(){
        this.view=this.$attrs.data.mapView
        this.getDataSet();
        this.getSelectInfo();
    },
    watch:{
        'visibleSettings.statisticRange':{
            handler(n,o){
                this.isCustom=(n=="custom")?false:true
                this.isRegion=(n=="region")?false:true
            }
        },
        'thematicMapList':{
            handler(n,o){
                if(n[0].open){
                    this.ysLayer.setVisible(true)
                    this.wsLayer.setVisible(true)
                }else{
                    this.ysLayer.setVisible(false)
                    this.wsLayer.setVisible(false)
                }
            },
            deep:true
        }
    },
    methods:{
        setThemLayerVisible(){
            
        },
        getDataSet(){
            let dataService = appconfig.gisResource['iserver_resource'].dataService
            this.dataSetInfo = dataService.dataSetInfo.filter(info => info.label === '排放口')
            console.log("数据服务",this.dataSetInfo)
        },
        //获取项目以及地址下拉框内容
        getSelectInfo(){
            let queryTask = new iQuery({ dataSetInfo:this.dataSetInfo })
            let queryText = `SMID >= 0 `
            queryTask.sqlQuery(queryText).then(resArr => {
                let features = []
                resArr.forEach(item => {
                    if (item && item.result.featureCount !== 0) {
                        features.push(item.result.features)
                    }
                })
                if(features.length==0) return
                this.assembleSelectInfo(features[0].features)
            }).catch(err=>{
                console.log(err)
            })
        },
        //组装下拉框信息
        assembleSelectInfo(featuresInfo){
            featuresInfo.forEach(item=>{
                let {PRJ_NAME,ADDRESS} = item.properties
                this.projectInfo.push(PRJ_NAME)
                this.addressInfo.push(ADDRESS)
            })
            this.projectInfo=[...new Set(this.projectInfo)]
            this.addressInfo=[...new Set(this.addressInfo)]
        },
        //专题图查看
        viewThematicMap(){
            this.$refs['visibleSettings'].validate((valid) => {
                if (valid) {
                    this.checkResult();
                } else {
                    return false;
                }
            });
        },
        //区域选择操作
        handleCommand(command){
            this.regionType=command
        },
        comStyle(color) {
            return `item-${color} type-circle`
        },
        //查看结果
        checkResult(){
            this.removeLayer();
            switch(this.visibleSettings.statisticRange){
                case 'all':this.limitFeature=null;
                            break
                case 'map': this.mapRange();
                            break
                case 'custom': this.limitFeature=this.customFeature;
                            break
            }
            this.queryTerm();
        },
        //地图范围
        mapRange(){
            //地图范围
            let size =this.view.getSize()
            let extent = this.view.getView().calculateExtent(size)
            //创建Feature，并添加进矢量容器中
            let feature = new Feature({
                geometry: new Polygon([[[extent[0], extent[1]], [extent[0], extent[3]], [extent[2], extent[3]], [extent[2], extent[1]],[extent[0], extent[1]]]]),
                name: 'mapRange'
            });
            this.limitFeature=feature
        },
        //自定义范围
        customRange(type){
            this.drawer && this.drawer.end()
            this.showThem=false
            this.removeLayer()
            // this.queryLayer && this.queryLayer.getSource().clear()
            this.drawer = new iDraw(this.view, type, {
                endDrawCallBack: feature => {
                    this.drawer.remove()
                    this.customFeature=feature
                },
                showCloser: true,
                drawStyle:{
                    pointSize:5,
                    pointColor:'rgb(246,82,82)',
                    lineWidth:2,
                    lineColor:'rgb(246,82,82)',
                    fillColor:'rgba(246,82,82,0.1)',
                    lineDash:[0,0]
                }
            })
            this.drawer.start()
        },
        //条件查询
        queryTerm(){
            let prjName=[];
            let address=[];
            this.visibleSettings.projectName.forEach(item=>{
                prjName.push(`PRJ_NAME = '${item}'`)
            })
            this.visibleSettings.address.forEach(item=>{
                address.push(`ADDRESS = '${item}'`)
            })
            prjName=prjName.join(' or ')
            address=address.join(' or ')
            let queryTask = new iQuery({ dataSetInfo:this.dataSetInfo })
            let queryText = `PRJ_NAME = "" or ${address}`
            console.log(queryText)
            queryTask.sqlQuery(queryText).then(resArr => {
                console.log("条件查询结果",resArr)
                let featruesData = resArr.filter(item => {
                    return item.result.featureCount !== 0
                })
                // 数据过滤
                if (featruesData.length !== 0) {
                    this.filterFeatures(featruesData)
                }else{
                    this.showThem=false;
                    this.$message('暂无数据！')
                    return
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        filterFeatures(featruesData){
            // console.log(featruesData)
            featruesData.forEach(featrueObj => {
                let features = featrueObj.result.features.features
                let themFeatures = features.map(feature => new GeoJSON().readFeature(feature))
                // 范围限制
                if (this.limitFeature) {
                    let limitGeometry 
                    if(this.limitFeature.getGeometry() instanceof CircleObject){
                        let polygon = fromCircle(this.limitFeature.getGeometry())
                        limitGeometry=turf.polygon(polygon.getCoordinates())
                    }else{
                        limitGeometry = turf.polygon(this.limitFeature.getGeometry().getCoordinates())
                    }
                    themFeatures = themFeatures.filter(feature => {
                        let geomtry = feature.getGeometry(), inGeometry
                        if (geomtry instanceof Point) {
                            inGeometry = turf.point(geomtry.getCoordinates())
                        } else if (geomtry instanceof LineString) {
                            inGeometry = turf.lineString(geomtry.getCoordinates())
                        } else return false
                        return turf.booleanContains(limitGeometry, inGeometry)
                    })
                }
                this.showTematicMap(themFeatures)
            })
        },
        showTematicMap(themFeatures){
            if(themFeatures.length==0){
                this.showThem=false;
                this.$message('暂无数据！')
                return
            }
            this.ysFeatures=[];
            this.wsFeatures=[];
            this.yswsFeatures=[];
            themFeatures.forEach(feaJson => {
                this.classification(feaJson)
            })
            this.initLayer();
            this.showThem=true;
            this.thematicMapList[0].level.map(item=>{
                if(item.label=='雨水') return item.num=this.ysFeatures.length
                if(item.label=='污水') return item.num=this.wsFeatures.length
            })
        },
        classification(features){
            switch(features.values_.TYPE){
                case '雨水':this.ysFeatures.push(features)
                            break
                case '污水':this.wsFeatures.push(features)
                            break
            }
        },
        // 初始化图层
        initLayer() {
            this.ysLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'blue'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                })
            })
            this.wsLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    // 将点设置成圆形样式
                    image: new Circle({
                        // 点的颜色
                        fill: new Fill({
                            color: 'red'
                        }),
                        // 圆形半径
                        radius: 5
                    }),
                })
            })
            this.view.addLayer(this.ysLayer)
            this.view.addLayer(this.wsLayer)
            this.ysLayer.getSource().addFeatures(this.ysFeatures)
            this.wsLayer.getSource().addFeatures(this.wsFeatures)
        },
        //删除
        removeLayer(){
            this.view.removeLayer(this.ysLayer)
            this.view.removeLayer(this.wsLayer)
            this.view.removeLayer(this.yswsLayer)
        },
    },
    beforeDestroy(){
        this.removeLayer()
        if(this.drawer) this.drawer.clear()
    }
}
</script>

<style lang="scss" scoped>
.drainagePortThematicMap{
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
        // /deep/.el-form-item__content{
        //     // display: flex;
        //     // float:left
        //     width: 260px;
        // }
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