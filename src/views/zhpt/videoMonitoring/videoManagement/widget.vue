<template>
    <div class="videoManagement">
        <div class="searchContainer">
            <el-row type="flex" :gutter="10">
                <el-col :span="3">
                    <el-input
                        placeholder="支持搜索视频点位名称"
                        suffix-icon="el-icon-search"
                        size="mini"
                        v-model="keyValue"
                        clearable>
                    </el-input>
                </el-col>
                <el-col :span="21">
                    <div class="btnGroup">
                        <el-button type="primary" size="mini" @click="getPage()">查询</el-button>
                        <el-button type="success" size="mini" @click="addData()">新增</el-button>
                        <el-button type="warning" size="mini" @click="modifyOperation()">修改</el-button>
                        <el-button type="danger" size="mini" @click="deleteOPeration()">删除</el-button>
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
            ref="vmd"
            :visible="dialogVisible"
            :showName="dialogName"
            @cancelOperation="cancelOperation"
            @submitOperation="submitOperation"
        />
    </div>
</template>

<script>
import config from './config.json'
import tableItem from "@/components/Table/index.vue"
import editDialog from './editDialog.vue'
import axios from '@/utils/request'
export default {
    name:"videoManagement",//易涝点视频管理
        components:{
        tableItem,
        editDialog
    },
    data(){
        return{
            searchUrl:'/monitor/yldvideo/page',//查询
            editUrl:'/monitor/yldvideo',//新增、修改
            delUrl:"/monitor/yldvideo/deleteByIds",//删除
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
            column:config.column,
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
        this.getPage()
    },
    methods:{
        //获取数据
        getPage(){
            let params={
                name:this.keyValue,
                current:this.pagination.current,
                size:this.pagination.size,
            };
            axios.request({ url: this.searchUrl, method: 'get', params }).then(res=>{
                let result=res.result.records
                this.list=result.map((item)=>{
                    return{
                        ...item
                    }
                })
                this.total=res.result.total
            }).catch(err=>{
                console.log(err)
            })
        },
        //修改
        modifyVideo( data){
            axios.request({ url: this.editUrl, method: 'PUT', data }).then(res=>{
                const result=res;
                if(result.code==1) {
                    this.$message.success("修改成功")
                    this.dialogVisible=false
                    this.getPage()
                }else{
                    this.$message.error("修改失败")
                }
            }).catch(err=>{
                this.$message.error("修改失败")
                console.log(err)
            })
        },
        //新增
        addVideo( data){
            axios.request({ url: this.editUrl, method: 'POST', data }).then(res=>{
                const result=res;
                if(result.code==1) {
                    this.$message.success("添加成功")
                    this.dialogVisible=false
                    this.getPage()
                }else{
                    this.$message.error("添加失败")
                }
            }).catch(err=>{
                this.$message.error("添加失败")
                console.log(err)
            })
        },
        //删除
        deleteVideo(params){
            axios.request({ url: this.delUrl, method: 'DELETE', params }).then(res=>{
                const result=res;
                if(result.code==1) {
                    this.$message.success("删除成功")
                    this.getPage()
                }else{
                    this.$message.error("删除失败")
                }
            }).catch(err=>{
                this.$message.error("删除失败")
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
        // 数据选择改变
        handleSelectionChange(value){
            this.selectedData=value
        },
        //新增数据
        addData(){
            this.dialogVisible=true;
            this.dialogName="新增"
            this.$nextTick(()=>{
                this.$refs.vmd.reset()
            })
        },
        //查看详情
        infoDetail(row,field){
            this.dialogVisible=true;
            this.dialogName="详情"
            this.$refs.vmd.setData(row)
        },
        //编辑视频点
        modifyOperation(){
            if(this.selectedData.length!=1){
                this.$message("请选择一行数据进行修改！")
                return
            }
            this.dialogVisible=true;
            this.dialogName="修改"
            this.$refs.vmd.setData(this.selectedData[0])
        },
        //删除视频点
        deleteOPeration(){
            if(this.selectedData.length==0){
                this.$message("请选择数据进行删除！")
                return
            }
            let ids=[]
            this.selectedData.forEach(item=>{
                ids.push(item.id)
            })
            this.deleteMessage(ids.join())
        },
        //删除前确认
        deleteMessage(ids){
            this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                this.deleteVideo({ids:ids})
            }).catch(() => {});
        },
        //弹窗组件回调操作
        cancelOperation(){
            this.dialogVisible=false
        },
        //弹窗提交回调
        submitOperation(value){
            console.log(value)
            if(this.dialogName=="修改"){
                this.modifyVideo(value)
            }else{
                this.addVideo(value)
            }
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