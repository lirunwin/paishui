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
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
</div>
</template>

<script>
import axios from "axios";
import { geteSessionStorage } from '@/utils/auth'
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {getOutfall} from '@/api/drainage/drainage'
import Config from "./config.json"
import tableItem from "@/components/Table/index.vue"
export default {
    name:"drainagePortSearch",//排水口管理
    components:{
        tableItem
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
            //地图事件
            mapEvent:null,
            overlay:null,
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
        this.view=this.$attrs.data.mapView
    },
    methods:{
        getPage(){
            let data={
                current:this.pagination.current,
                size:this.pagination.size,
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
            const gl = this
            const container = document.getElementById('popup');
            const content = document.getElementById('popup-content');
            const closer = document.getElementById('popup-closer');
            this.overlay = new Overlay({
                element: container,
                autoPan: {
                    animation: {
                    duration: 250,
                    },
                },
            });
            closer.onclick = ()=>{
                this.overlay.setPosition(undefined);
                closer.blur();
                return false;
            };
            this.view.addOverlay(this.overlay)
            // this.mapEvent=this.view.on('singleclick', function (evt) {
            //     const coordinate = evt.coordinate;
            //     const hdms = toStringHDMS(toLonLat(coordinate));
            //     content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
            //     console.log(coordinate)
            // });
            let center=[
                104.75231999734498,
                31.525963399505617
            ]
            gl.overlay.setPosition(center);
            // this.view.animate({
            //     center: fromLonLat(center),
            //     duration: 2000,
            // });
            this.view.getView().setCenter(center)
            this.view.getView().setZoom(20)
        }
    },
    beforeDestroy(){
        this.view.removeOverlay(this.overlay)
        // this.view.un(this.mapEvent.type, this.mapEvent.listener)
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