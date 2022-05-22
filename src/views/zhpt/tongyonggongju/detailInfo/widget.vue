<template>
  <div class="container i-scrollbar">
    <el-form v-if="formData.length !== 0" :inline="true" class="">
        <el-form-item style="width:23%" label-width='150px' v-for="(item, index) in formData" :key="index" :label="item.label">
            <el-input v-model="item.value" disabled></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fieldDoc, pointFieldDoc } from '@/views/zhpt/common/doc'

export default {
    props: ['param'],
    data () {
        return {
            doc: null,
            formData: []
        }
    },
    mounted () {
        let { geometry, properties } = this.param.info
        if (geometry.type === 'LineString') {
            this.doc = fieldDoc
        } else {
            this.doc = pointFieldDoc
        }
        let data = []
        for (let key in properties) {
            if (this.doc[key]) {
                data.push({ label: this.doc[key], value: properties[key] })
            }
        }
        this.formData = data
    }
}
</script>

<style lang='scss' scoped>
    @import "~@/styles/mixin.scss";
    .i-scrollbar {
        overflow: scroll;
        @include scrollBar;
    }
    .container {
        padding: 50px 10px;
        width: 100%;
        height: 800px;
    }
</style>