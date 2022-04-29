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
                        <el-select v-model="portType" placeholder="" size="mini">
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
                        <el-select v-model="ownershipUnits" placeholder="" size="mini">
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
                    <el-button type="primary" icon="el-icon-download" size="mini" @click="exportOperation()">导出</el-button>
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
    :popupShow="popupShow" 
    :popupPosition="popupPosition"
    :popupTitle="popupTitle"
    :headerStyle="hstyle"
    :isSetCenter="true"
    :operationGroup="operationGroup"
    @detail="detail()"
    >
    <div class="drainagePortInfo">
        <div class="infoTerm"><div>排放口编码</div><div>PSK987667</div></div>
        <div class="infoTerm"><div>所在污水分区</div><div>临港污水片区</div></div>
        <div class="infoTerm"><div>所在排水分区</div><div>临港雨水片区</div></div>
        <div class="panelTerm">
            <div class="portTypeItem pfklx">
                <div class="itemTitle">排放口类型</div>
                <div class="itemValue">污水</div>
            </div>
            <div class="portTypeItem snst">
                <div class="itemTitle">收纳水体</div>
                <div class="itemValue">童家河</div>
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
import {getOutfall} from '@/api/drainage/drainage'
import Config from "./config.json"
import tableItem from "@/components/Table/index.vue"
import commonPopup from "@/components/CommonPopup/index.vue"
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
            portTypeOptions: [
                {
                    value: '1',
                    label: '排放口'
                }
            ],
            ownershipUnitsOptions:[
                {
                    value:"1",
                    label:"xxxx监管单位"
                }
            ],
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
            popupShow:false,
            popupPosition:null,
            popupTitle:null,
            view:null,
            operationGroup:[
                {icon:"iconfont icondtbz",color:"royalblue",action:"detail"},
            ],
            hstyle:'font-weight: bold;justify-content: center;'
        }
    },
    computed:{
        config:function(){
            return Config
        }
    },
    mounted(){
        this.getPage();
        this.column=this.config.column
    },
    methods:{
        getPage(){
            let data={
                current:this.pagination.current,
                size:this.pagination.size,
                nameAndAddress:this.keyValue
            }
            getOutfall(data).then(res=>{
                const result = res.data;
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
            console.log(row)
            this.located()
        },
        //定位方法
        located(){
            this.view=this.$attrs.data.mapView
            let gl =this
            this.mapEvent=this.view.on('singleclick', function (evt) {
                let pixel = gl.view.getEventPixel(evt.originalEvent)
                gl.view.forEachFeatureAtPixel(pixel,function(feature){
                    var attr = feature.getProperties();
                    var coordinate = evt.coordinate;
                    console.log(attr,coordinate)
                });
            });
            let center=[
                104.75231999734498,
                31.525963399505617
            ]
            this.popupShow=true
            this.popupPosition=center
            this.popupTitle="（排放口）锦绣家园小区"
            // this.view.animate({
            //     center: fromLonLat(center),
            //     duration: 2000,
            // });
        },
        detail(){
            
        }
    },
    beforeDestroy(){
        if(this.view) this.view.un(this.mapEvent.type, this.mapEvent.listener)
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