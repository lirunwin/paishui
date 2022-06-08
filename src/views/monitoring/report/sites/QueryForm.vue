<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="关键字" prop="no">
      <el-input v-model="formData.no" placeholder="请输入关键字" size="small" clearable />
    </el-form-item>
    <el-form-item label="监测分组" prop="type">
      <el-select v-model="formData.type" placeholder="请选择监测分组" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="监测状态" prop="type">
      <el-select v-model="formData.type" placeholder="请选择监测状态" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="数据时间" prop="type">
      <el-date-picker
        v-model="formData.value1"
        type="daterange"
        range-separator="到"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        style="width:230px"
        clearable
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        icon="el-icon-search"
        @click="$emit('query', { ...formData })"
        >查询</el-button
      >

      <el-button
        type="primary"
        size="small"
        :loading="loading.export"
        :disabled="loading.export || !ids.length"
        icon="el-icon-download"
        @click="$emit('export', ids)"
        >导出</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, add: false, update: false, del: false, export: false }) })
  loading!: { query?: boolean; add?: boolean; update?: boolean; del?: boolean; export?: boolean }

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  formData: { [x: string]: string } = {}

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
