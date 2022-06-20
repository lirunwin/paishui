<template>
    <div class="videoManagement">
        <div class="searchContainer">
            <el-row type="flex" :gutter="10">
                <el-col :span="3">
                    <el-input
                        placeholder="支持搜索排水户名称、地址"
                        suffix-icon="el-icon-search"
                        size="mini"
                        v-model="keyValue"
                        clearable>
                    </el-input>
                </el-col>
                <el-col :span="21">
                    <div class="btnGroup">
                        <el-button type="primary" size="mini" >查询</el-button>
                        <el-button type="success" size="mini" @click="addData()">新增</el-button>
                        <el-button type="warning" size="mini" @click="infoDetail()">修改</el-button>
                        <el-button type="danger" size="mini" >删除</el-button>
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
        <editDialog
            ref="dHI"
            :visible="dialogVisible"
            :showName="dialogName"
            @cancelOperation="cancelOperation"
        />
    </div>
</template>

<script>
import config from './config.json'
import tableItem from "@/components/Table/index.vue"
import editDialog from './editDialog.vue'
export default {
    name:"videoManagement",//易涝点视频管理
        components:{
        tableItem,
        editDialog
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
        }
    },
    mounted(){
        this.column=config.column
    },
    methods:{
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
        //新增数据
        addData(){
            this.dialogVisible=true;
            this.dialogName="新增"
        },
        //编辑查看详情
        infoDetail(row,field){
            console.log("详情",row)
            this.dialogVisible=true;
            this.dialogName="编辑"
            // this.$refs.dHI.setData(row)
        },
        //弹窗组件回调操作
        cancelOperation(){
            this.dialogVisible=false
        },
    }
}
</script>

<style lang="scss" scoped>
.videoManagement{
    width: 100%;
    padding: 20px 5px;
    .searchContainer{
        height: 40px;
        .title{
            font-family: Arial;
            white-space: nowrap;
            line-height: 26px;
        }
        // .btnGroup{
        //     float:right;
        // }
    }
    .tableContainer{
        height: calc(100% - 25px);
    }
}
</style>>