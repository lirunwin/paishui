<template>
    <el-dialog
    v-dialogDrag
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :modal="false"
    width="50%"
    @close="dialogVisible = false">
        <slot />
    </el-dialog>
</template>

<script>
export default {
    name:'infoDialog',//历史监测数据弹框
    props:{
        visible:{},
        title:{}
    },
    data(){
        return{
            dialogVisible: null,
        }
    },
    watch:{
        visible:{
            handler(n,o){
                this.dialogVisible=n
            },
            immediate:true
        },
        dialogVisible:{
            handler(n,o){
                this.$parent.dialogVisible=n
            },
        }
    },
}
</script>

<style lang="scss" scoped>
// 覆盖层元素增加可穿透点击事件
.el-dialog__wrapper{
  pointer-events:none;
}

/deep/ .el-dialog{
    background-color: rgba(6, 37, 70,0.8);
    pointer-events:auto;// 弹窗层元素不可穿透点击事件（不影响弹窗层元素的点击事件）
}
/deep/.el-dialog .el-dialog__header {
    background-color: #030f1c;
    box-shadow: inset 0 0 30px #116fb9;
    padding: .026042rem /* 5/192 */;
    border: none;
    .el-dialog__title{
        font-size: .072917rem /* 14/192 */;
    }
    .el-dialog__headerbtn{
        top: .052083rem /* 10/192 */;
    }
}
/deep/.el-dialog .el-dialog__header .el-dialog__title {
    color: white;
}
/deep/.el-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
    color: white !important;
}
</style>