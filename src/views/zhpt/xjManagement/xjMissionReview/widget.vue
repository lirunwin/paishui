<template>
    <check :data="data" :isXj="true"></check>
</template>

<script lang="ts">
/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检计划审核功能
 * @author 梁罗、李顺<876330731@qq.com>
*/
import {Vue,Component,Prop} from 'vue-property-decorator'
import check from '@/views/zhpt/wxPlansManagement/wxCheck/widget.vue'
@Component({
    name: 'xjCheck',
    components: {check}
})
export default class xjCheck extends Vue {
    @Prop() data:any;
}
</script>
