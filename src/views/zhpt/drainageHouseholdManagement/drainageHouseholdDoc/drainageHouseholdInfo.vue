<template>
    <el-dialog
    :title="dialogName"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="50%"
    top="5vh">
    <div class="drainageHouseholdInfo">
        <!------基本信息------>
        <div class="title">
            <div class="iconSymbol"></div>
            <div class="titleName">基本信息</div>
        </div>
        <div class="formItem">
            <el-form :model="baseInfoForm" :rules="rules" ref="baseInfoForm" label-width="auto" size="mini" :disabled="dialogName=='详情'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="排水户编号" prop="expNo" >
                            <el-input v-model="baseInfoForm.expNo"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水户名称" prop="name">
                            <el-input v-model="baseInfoForm.name" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水户分类" prop="sort">
                            <el-input v-model="baseInfoForm.sort" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <el-form-item label="地址" prop="address" >
                            <el-input v-model="baseInfoForm.address"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <el-form-item label="接入检查井编码" prop="connManholeid" >
                            <el-input v-model="baseInfoForm.connManholeid"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="项目编号" prop="prjNo" >
                            <el-input v-model="baseInfoForm.prjNo"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="项目名称" prop="prjName" >
                            <el-input v-model="baseInfoForm.prjName"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="探测日期" prop="sdate" >
                            <el-input v-model="baseInfoForm.sdate"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="探测单位" prop="sunit" >
                            <el-input v-model="baseInfoForm.sunit"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!------组织结构信息------>
        <div class="title">
            <div class="iconSymbol"></div>
            <div class="titleName">组织结构信息</div>
        </div>
        <div class="formItem">
            <el-form :model="baseInfoForm"  label-width="auto" size="mini" :disabled="dialogName=='详情'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="组织机构代码" prop="codeid" >
                            <el-input v-model="baseInfoForm.codeid"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人代表" prop="representative">
                            <el-input v-model="baseInfoForm.representative" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="tel">
                            <el-input v-model="baseInfoForm.tel" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="主管单位" prop="manager" >
                            <el-input v-model="baseInfoForm.manager"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水许可证编号" prop="licenceId">
                            <el-input v-model="baseInfoForm.licenceId" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="许可证颁发日期" prop="licenceIssueDate">
                            <el-input v-model="baseInfoForm.licenceIssueDate" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <el-form-item label="主要业务活动" prop="business" >
                            <el-input v-model="baseInfoForm.business"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="主要生产工艺" prop="process" >
                            <el-input v-model="baseInfoForm.process"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="主要污染物名称" prop="pollutantName" >
                            <el-input v-model="baseInfoForm.pollutantName"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!------排水情况------>
        <div class="title">
            <div class="iconSymbol"></div>
            <div class="titleName">排水情况</div>
        </div>
        <div class="formItem">
            <el-form :model="baseInfoForm"  label-width="auto" size="mini" :disabled="dialogName=='详情'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="排水预处理方式" prop="treatmentMethod" >
                            <el-input v-model="baseInfoForm.treatmentMethod"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水预处理设施" prop="treatmentFacilities">
                            <el-input v-model="baseInfoForm.treatmentFacilities" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水预处理能力" prop="treatmentCapacity">
                            <el-input v-model="baseInfoForm.treatmentCapacity" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="用水总量" prop="waterDailyConsumption" >
                            <el-input v-model="baseInfoForm.waterDailyConsumption"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="自备水量" prop="waterSelfSupplyDaily">
                            <el-input v-model="baseInfoForm.waterSelfSupplyDaily" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总排水量" prop="waterDischargeQuantity">
                            <el-input v-model="baseInfoForm.waterDischargeQuantity" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="生产污水量" prop="productionWasteQuantity" >
                            <el-input v-model="baseInfoForm.productionWasteQuantity"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生活污水量" prop="sanitaryWasteQuantity">
                            <el-input v-model="baseInfoForm.sanitaryWasteQuantity" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!------水质排放指标（上限）------>
        <div class="title">
            <div class="iconSymbol"></div>
            <div class="titleName">排水情况</div>
        </div>
        <div class="formItem">
            <el-form :model="baseInfoForm" label-width="auto" size="mini" :disabled="dialogName=='详情'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="排水温度" prop="temp" >
                            <el-input v-model="baseInfoForm.temp"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="pH值" prop="ph">
                            <el-input v-model="baseInfoForm.ph" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水总悬浮固体" prop="ss">
                            <el-input v-model="baseInfoForm.ss" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="排水生化需氧量" prop="bod5" >
                            <el-input v-model="baseInfoForm.bod5"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水化学需氧量" prop="codcr">
                            <el-input v-model="baseInfoForm.codcr" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水氨氮" prop="nh3_n">
                            <el-input v-model="baseInfoForm.nh3_n" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="排水总氮" prop="tn" >
                            <el-input v-model="baseInfoForm.tn"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排水总磷" prop="tp">
                            <el-input v-model="baseInfoForm.tp" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
    <span slot="footer" class="dialog-footer" v-show="dialogName!='详情'">
        <el-button type="primary" @click="submit()">提 交</el-button>
        <el-button @click="cancel()">取 消</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    name:"drainageHouseholdInfo",//排水户档案添加、修改
    props:{
        visible:{
            required:true  
        },
        showName:{
            required:true  
        },
    },
    data(){
        return{
            dialogName:"",
            dialogVisible:false,
            baseInfoForm:{
                expNo:"",name:"",sort:"",address:"",connManholeid:"",prjNo:"",prjName:"",sdate:"", sunit:"",
                codeid:"",representative:"",tel:"",manager:"",licenceId:"",licenceIssueDate:"",business:"",process:"",pollutantName:"",
                treatmentMethod:"",treatmentFacilities:"",treatmentCapacity:"",waterDailyConsumption:"",waterSelfSupplyDaily:"",waterDischargeQuantity:"",
                productionWasteQuantity:"",sanitaryWasteQuantity:"",temp:"",ph:"",ss:"",bod5:"",codcr:"",nh3_n:"",tn:"",tp:"",
            },
            rules:{
                expNo:[
                    { required: true, message: '请填写排水户编号', trigger: 'blur' }
                ],
                name:[
                    { required: true, message: '请填写排水户名称', trigger: 'blur' }
                ],
                sort:[
                    { required: true, message: '请填写排水户分类', trigger: 'blur' }
                ],
                address:[
                    { required: true, message: '请填写地址', trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        submit(){
            this.$refs['baseInfoForm'].validate((valid) => {
                if (valid) {
                    this.$emit('submitOperation',this.baseInfoForm)
                } else {
                    return false;
                }
            });
        },
        cancel(){
            // this.$refs['baseInfoForm'].resetFields();
            this.$emit('cancelOperation')
        },
        handleClose(done) {
            // this.$refs['baseInfoForm'].resetFields();
            this.$emit('cancelOperation')
            done();
        },
        setData(data){
            for(let i in data){
                this.baseInfoForm[i]=data[i]
            }
        },
        reset(){
            this.$refs['baseInfoForm'].resetFields();
            Object.assign(this.$data.baseInfoForm,this.$options.data().baseInfoForm)
        }
    },
    watch:{
        visible:{
            handler(n,o){
                this.dialogVisible=n
            }
        },
        showName:{
            handler(n,o){
                this.dialogName=n
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog .el-dialog__header {
    background-color: royalblue;
    padding: 10px;
}
/deep/.el-dialog .el-dialog__header .el-dialog__title {
    color: white;
}
/deep/.el-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
    color: white !important;
}
.drainageHouseholdInfo{
    height: 100%;
    width: 100%;
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
    .formItem{
        padding: 10px 20px;
    }
}
</style>