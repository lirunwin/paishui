<template>
    <el-dialog
    :title="dialogName"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="50%">
    <div class="contentInfo">
        <div class="leftPanel">
            <!------基本信息------>
            <div class="title">
                <div class="iconSymbol"></div>
                <div class="titleName">视频监控点基本信息</div>
            </div>
            <div class="content">
                <el-form ref="form" :model="form" label-width="100px" size="small">
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="视频点位名称">
                                <el-input v-model="form.name" placeholder="请输入视频点位名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="视频点位编号">
                                <el-input v-model="form.name" placeholder="自动产生" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="所属权属状态">
                                <el-input v-model="form.name" placeholder="请输入所属权属状态"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="设备厂家">
                                <el-input v-model="form.name" placeholder="请输入设备厂家"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备型号">
                                <el-input v-model="form.name" placeholder="请输入设备型号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="24">
                            <el-form-item label="安装地址">
                                <el-input v-model="form.name" placeholder="请输入安装地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="安装单位">
                                <el-input v-model="form.name" placeholder="请输入安装单位"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="安装人员">
                                <el-input v-model="form.name" placeholder="请输入安装人员"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="安装时间">
                                <el-date-picker
                                    v-model="form.name"
                                    type="date"
                                    placeholder="选择安装时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="12">
                            <el-form-item label="负责人">
                                <el-input v-model="form.name" placeholder="请输入负责人姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话">
                                <el-input v-model="form.name" placeholder="请输入电话号码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="20">
                            <el-form-item label="经纬度">
                                <el-input v-model="form.name" style="width:100px"></el-input>~
                                <el-input v-model="form.name" style="width:100px"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="center">
                        <el-col :span="24">
                            <el-form-item label="详细描述">
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入详细描述"
                                    v-model="form.name">
                                    </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit()">确 定</el-button>
                <el-button @click="cancel()">取 消</el-button>
            </span>
        </div>
        <div class="rightPanel">
            <div class="map">
                <common-map :mapname="'videoManagementMap'"></common-map>
            </div>
            <div class="video">视频</div>
        </div>
    </div>
    </el-dialog>
</template>

<script>
import commonMap from '@/views/zhpt/drainageManagement/commonMap.vue'
export default {
    name:"editDialog",//排水户档案添加、修改
    components:{
        commonMap
    },
    props:{
        visible:{required:true},
        showName:{required:true},
    },
    data(){
        return{
            dialogVisible:false,
            view:null,
            form:{
                name:""
            }
        }
    },
    computed:{
        dialogName(){
            return this.showName+"视频监控点";
        }
    },
    mounted(){
        console.log('地图对象',this.$children[0].view)
    },
    methods:{
        submit(){
            // this.$refs['baseInfoForm'].validate((valid) => {
            //     if (valid) {
            //         this.$emit('submitOperation',this.baseInfoForm)
            //     } else {
            //         return false;
            //     }
            // });
            
        },
        cancel(){
            this.$emit('cancelOperation')
        },
        handleClose(done) {
            this.$emit('cancelOperation')
            done();
        },
    },
    watch:{
        visible:{
            handler(n,o){
                this.dialogVisible=n
            }
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
    .el-dialog__header {
        background-color: royalblue !important;
        .el-dialog__title {
            color: white !important;
        }
        .el-dialog__headerbtn .el-dialog__close{
            color: white !important;
        }
    }
    .el-dialog__body{
        .dialog-footer{
            display: flex;
            justify-content: flex-end;
        }
    }
}
.contentInfo{
    height: 100%;
    width: 100%;
    display: flex;
    .leftPanel,.rightPanel{
        display: flex;
        flex-flow: column;
    }
    .leftPanel{
        flex: 0.6;
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
        .content{
            padding:10px;
            /deep/ .el-form-item__content{
                display: flex;
            }
        }
    }
    .rightPanel{
        flex: 0.4;
        .map{
            flex: 0.5;
        }
        .video{
            flex: 0.5;
        }
    }

}
</style>