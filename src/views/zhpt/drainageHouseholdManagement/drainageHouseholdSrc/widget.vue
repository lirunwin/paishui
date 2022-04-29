<template>
    <div class="drainageHouseholdSrc">
        <div class="searchContainer">
            <el-row :gutter="40">
                <el-col :span="4">
                    <el-row>
                        <el-col :span="6">
                            <div class="title">关键字：</div>
                        </el-col>
                        <el-col :span="18">
                            <el-input
                                placeholder="支持搜索排水户名称、地址"
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
                            <div class="title">排水户分类：</div>
                        </el-col>
                        <el-col :span="16">
                            <el-select v-model="householdType" placeholder="" size="mini" clearable>
                                <el-option
                                v-for="item in householdTypeOptions"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="15">
                    <div class="btnGroup">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="getPage()">查询</el-button>
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
                @handleSelectionChange="handleSelectionChange"
                @detail="infoDetail"
            />
        </div>
        <drainage-household-info
            ref="dHI"
            :visible="dialogVisible"
            :showName="dialogName"
            @cancelOperation="cancelOperation"
        >
            </drainage-household-info>
    </div>
</template>

<script>
import axios from "axios";
import Config from "./config.json"
import tableItem from "@/components/Table/index.vue"
import {getDischarger,getSortList} from '@/api/drainage/drainage'
import { geteSessionStorage } from '@/utils/auth'
import drainageHouseholdInfo from '../drainageHouseholdDoc/drainageHouseholdInfo.vue'
export default {
    name:"drainageHouseholdSrc",//排水户查询
    components:{
        tableItem,
        drainageHouseholdInfo
    },
    data(){
        return{
            keyValue:"",//关键字
            householdType: '',//排水户类型
            householdTypeOptions: [],//排水户类型下拉菜单
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
            selectedData:[],
            //操作弹窗
            dialogName:"",
            dialogVisible:false,
            //导出url
            expXls:"/psjc/discharger/export"
        }
    },
    computed:{
        config:function(){
            return Config
        }
    },
    mounted(){
        this.getSort();
        this.getPage();
        this.column=this.config.column
    },
    methods:{
        //获取排水户类型下拉菜单
        getSort(){
            getSortList().then(res=>{
                const result = res.data;
                this.householdTypeOptions=result.result.map((item)=>{return{...item}})
            }).catch(err=>console.log(err))
        },
        //获取排水户档案数据
        getPage(){
            let data={
                current:this.pagination.current,
                size:this.pagination.size,
                sort:this.householdType,
            }
            getDischarger(data).then(res=>{
                const result = res.data;
                this.list=result.result.records.map((item)=>{return{...item}})
                this.total=result.result.total
            }).catch(err=>console.log(err))
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
        handleSelectionChange(value){
            this.selectedData=value
        },
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
                a.download ='排水户档案.xls' // 指定下载文件名
                a.click()
            }).catch(err=>{
                console.log(err)
            })
        },
        infoDetail(row,field){
            console.log("详情",row)
            this.dialogVisible=true;
            this.dialogName="详情"
            this.$refs.dHI.setData(row)
        },
        //弹窗组件回调操作
        cancelOperation(){
            this.dialogVisible=false
        },
    }
}
</script>

<style lang="scss" scoped>
.drainageHouseholdSrc{
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