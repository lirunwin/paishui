<template>
<div class="drainagePortSearch">
    <div class="searchContainer">
        <el-row :gutter="40">
            <el-col :span="4">
                <el-row>
                    <el-col :span="6">
                        <div class="title">关键字：</div>
                    </el-col>
                    <el-col :span="18">
                        <el-input
                            placeholder="支持搜索地址、项目名称"
                            suffix-icon="el-icon-search"
                            size="mini"
                            v-model="keyValue"
                            clearable>
                        </el-input>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="5">
                <el-row>
                    <el-col :span="7">
                        <div class="title">排放口类别：</div>
                    </el-col>
                    <el-col :span="16">
                        <el-select v-model="portType" placeholder="" size="mini" clearable>
                            <el-option
                            v-for="item in portTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="5">
                <el-row>
                    <el-col :span="6">
                        <div class="title">权属单位：</div>
                    </el-col>
                    <el-col :span="16">
                        <el-select v-model="ownershipUnits" placeholder="" size="mini" clearable>
                            <el-option
                            v-for="item in ownershipUnitsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="10">
                <div class="btnGroup">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getPage()">搜索</el-button>
                    <el-button type="primary" icon="el-icon-download" size="mini" @click="exportConfirm()">导出</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
    <div class="tableContainer">
      <table-item
        :table-data="list"
        :column="column"
        :pagination="true"
        :pagesize="pagination.size"
        :currentpage="pagination.current"
        :tableheight="'100%'"
        :border="true"
        :multiple="true"
        :total="total"
        :stripe="true"
        :headerStyle="headerStyle"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @rowDblclick="rowDblclick"
      />
    </div>
    <common-popup 
    ref="commonPopup"
    :mapView="view"
    :popupPosition="popupPosition"
    :popupTitle="popupTitle"
    :headerStyle="hstyle"
    :isHeaderShow="true"
    :isSetCenter="true"
    :operationGroup="operationGroup"
    @detail="detailInfo()"
    @close="closePopup()"
    >
    <div class="drainagePortInfo">
        <div class="infoTerm"><div>排放口编码</div><div>{{detail.prjNo}}</div></div>
        <div class="infoTerm"><div>所在污水分区</div><div>{{detail.sewagesystemId}}</div></div>
        <div class="infoTerm"><div>所在雨水分区</div><div>{{detail.stormsystemId}}</div></div>
        <div class="panelTerm">
            <div class="portTypeItem pfklx">
                <div class="itemTitle">排放口类型</div>
                <div class="itemValue">{{detail.type}}</div>
            </div>
            <div class="portTypeItem snst">
                <div class="itemTitle">收纳水体</div>
                <div class="itemValue">{{detail.receivewater}}</div>
            </div>
            <div class="portTypeItem pfkj">
                <div class="itemTitle">排放口径</div>
                <div class="itemValue">DN400</div>
            </div>
        </div>
    </div>
    </common-popup>
</div>
</template>

<script>
import axios from "axios";
import { geteSessionStorage } from '@/utils/auth'
import { getOutfall,getDepartment,getKeyPage } from '@/api/drainage/drainage'
import Config from "./config.json"
import tableItem from "@/components/Table/index.vue"
import commonPopup from "@/components/CommonPopup/index.vue"
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import proJ4 from "proj4";
import {
  Style,
  Circle,
  Icon,
  Fill,
  RegularShape,
  Stroke,
  Text
} from 'ol/style';
export default {
    name:"drainagePortSearch",//排水口管理
    components:{
        tableItem,
        commonPopup
    },
    data(){
        return{
            keyValue:"",//关键字
            portType: '',//排放口类型
            ownershipUnits:"",//权属单位
            portTypeOptions: [],
            ownershipUnitsOptions:[],
            //表格内容
            //表头样式
            headerStyle:{
                background: '#E0EAFB',
                color: 'rgb(50,59,65)',
                height: '38px',
                textAlign: 'center'
            },
            //表格数据
            list:[],
            //表格列
            column:[],
            //分页信息
            total:0,//总数
            pagination:{
                size:10,
                current:1
            },
            //导出url
            expXls:'/psjc/outfall/export',
            //地图弹窗
            mapEvent:null,
            popupPosition:null,
            popupTitle:null,
            view:null,
            operationGroup:[
                {icon:"iconfont icondtbz",color:"royalblue",action:"detail"},
            ],
            hstyle:'font-weight: bold;justify-content: center;',
            //定位图标
            vectorLayer:null,
            vectorSource:null,
            feature:null,
            //详细信息
            detail:{
                prjNo:null,
                sewagesystemId:null,
                stormsystemId:null,
                type:null,
                receivewater:null
            }
        }
    },
    computed:{
        config:function(){
            return Config
        }
    },
    mounted(){
        this.getPage();
        this.getPortType();
        this.getDepartMentAll();
        this.column=this.config.column
        this.view=this.$attrs.data.mapView
        this.initMap();
    },
    methods:{
        initMap(){
            let gl =this;
            // 矢量图层源
            this.vectorSource = new VectorSource({
                wrapX: false,
            });
            //创建矢量层
            this.vectorLayer = new VectorLayer({
                source: this.vectorSource
            });
            //将图层添加到地图中
            this.view.addLayer(this.vectorLayer);
            //地图单击事件
            this.mapEvent=this.view.on('singleclick', function (evt) {
                let pixel = gl.view.getEventPixel(evt.originalEvent)
                gl.view.forEachFeatureAtPixel(pixel,function(feature){
                    var attr = feature.getProperties();
                    var coordinate = evt.coordinate;
                    console.log(attr,coordinate)
                    gl.showInfoPop(attr.info,coordinate)
                });
            });
        },
        //获取排放口类别
        getPortType(){
            let keys={
                ulevel: 2,
                codeKey:"outfall_type"
            }
            getKeyPage(keys).then(res=>{
                const result = res
                result.result.records.forEach(item=>{
                    if(item.notes) 
                    this.portTypeOptions.push({value:item.notes,label:item.notes})
                })
            })
        },
        //获取部门（权属单位）
        getDepartMentAll(){
            getDepartment().then(res=>{
                const result = res
                this.ownershipUnitsOptions=result.result.map(item=>{
                    return {value:item.name,label:item.name}
                })
            }).catch(err=>{
                console.log(err)
            })
        },
        getPage(){
            let data={
                current:this.pagination.current,
                size:this.pagination.size,
                nameAndAddress:this.keyValue,
                belong:this.ownershipUnits,
                type:this.portType
            }
            getOutfall(data).then(res=>{
                const result = res;
                this.list=result.result.records.map((item)=>{
                    return{
                        ...item
                    }
                })
                this.total=result.result.total
            }).catch(err=>{
                console.log(err)
            })
        },
        // 页码改变
        handleCurrentChange(currentPage) {
            this.pagination.current = currentPage
            this.getPage()
        },
        // 每页显示条数
        handleSizeChange(pagesize) {
            this.pagination.size = pagesize
            this.getPage()
        },
        //导出前确认
        exportConfirm(){
            if(this.total<=1000){
                this.exportOperation();
                return
            }
            this.$confirm('仅支持导出前1000条数据，是否确认导出？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                this.exportOperation()
            }).catch(() => {});
        },
        //导出数据
        exportOperation(){
            axios.defaults.baseURL = "/api";
            axios({
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization':'bearer ' + geteSessionStorage('token')
                },
                method: 'get',
                url:this.expXls,
                responseType:"blob",
            }).then(res=>{
                var blob = res.data;
                const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = href // 指定下载链接
                a.download ='排水口数据.xls' // 指定下载文件名
                a.click()
            }).catch(err=>{
                console.log(err)
            })
        },
        //列表双击定位
        rowDblclick(row, column, event) {
            this.located(row,[row.x,row.y]);
        },
        //定位方法
        located(info,position){
            let center = this.projectConvert(position)
            console.log(center)
            this.showInfoPop(info,center)
            this.showPointSymbol(info,center)
        },
        showInfoPop(info,center){
            this.popupPosition=center
            this.popupTitle=`（${info.type}排放口）${info.address}`;
            let dinfo={};
            for(let i in info){
                dinfo[i] = info[i]?info[i]:'无';
            }
            let {prjNo,sewagesystemId,stormsystemId,type,receivewater}=dinfo
            this.detail={
                prjNo,
                sewagesystemId,
                stormsystemId,
                type,
                receivewater
            }
        },
        showPointSymbol(info,position){
            this.vectorSource.clear()
            //创建Feature，并添加进矢量容器中
            this.feature = new Feature({
                geometry: new Point(position),
                name: 'My point',
                info
            });
            //创建标记的样式
            this.feature.setStyle(this.setFeatureStyle());
            this.vectorSource.addFeature(this.feature);

        },
        /**
         * @description 为要素设置样式
         */
        setFeatureStyle() {
            return new Style({
                image: new Icon({
                    anchor: [0.5, 0.7],
                    scale:0.15,
                    //图标的url
                    src: require('@/assets/images/locate.png')
                })
            });
        },
        //坐标转换
        projectConvert(position){
            proJ4.defs("EPSG:4543","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
            proJ4.defs("EPSG:4326","+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
            return proJ4('EPSG:4543', 'EPSG:4326', position) 
        },
        detailInfo(){
            
        },
        closePopup(){
            console.log('关闭弹窗')
        }
    },
    beforeDestroy(){
        if(this.view&&this.mapEvent) {
            this.view.un(this.mapEvent.type, this.mapEvent.listener)
            this.view.removeLayer(this.vectorLayer)
        }
        if(this.$refs.commonPopup.isShow) this.$refs.commonPopup.closePopup()
    }
}
</script>

<style lang="scss" scoped>
.drainagePortSearch{
    width: 100%;
    padding: 20px 5px;
    .searchContainer{
        height: 40px;
        .title{
            font-family: Arial;
            white-space: nowrap;
            line-height: 26px;
        }
        .btnGroup{
            float:right;
        }
    }
    .tableContainer{
        height: calc(100% - 25px);
    }
}
</style>
<style lang="scss">
.drainagePortInfo{
    width:400px;
    display:flex;
    flex-flow:column;
    .infoTerm{
        display:flex;
        justify-content:space-between;
        padding:10px
    }
    .panelTerm{
        display:flex;
        justify-content:space-between;
        padding:10px;
        .portTypeItem{
            flex: 0.3;
            display: flex;
            flex-flow: column;
            border-radius: 5px;
            color: white;
            .itemTitle{
                padding: 10px 5px;
                font-size: 14px;
            }
            .itemValue{
                padding:10px 20px;
                font-size: 16px;
            }
        }
        .pfklx{
            background-color: rgba(131,122,254,0.7);
        }
        .snst{
            background-color: rgba(85,186,254,0.7);
        }
        .pfkj{
            background-color: rgba(247,179,85,0.7);
        }
    }
}
</style>