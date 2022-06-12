<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="关键字" prop="queryLike">
      <el-input v-model="formData.queryLike" placeholder="请输入关键字" size="small" clearable />
    </el-form-item>
    <el-form-item label="监测分组" prop="siteGroup">
      <el-select v-model="formData.siteGroup" multiple placeholder="请选择监测分组" size="small" clearable>
        <!-- <el-option value="" label="全部" /> -->
        <el-option v-for="item of groups" :value="item" :label="item" :key="item" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="排水分区" prop="siteGroup">
      <el-select v-model="formData.psArea" multiple placeholder="请选择排水分区" size="small" clearable>
        <el-option value="" label="全部" />
        <el-option v-for="item of sections" :value="item" :label="item" :key="item" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="判定结果" prop="levelName">
      <el-select v-model="formData.levelName" multiple placeholder="请选择判定结果" size="small" clearable>
        <!-- <el-option value="" label="全部" /> -->
        <el-option value="正常" label="正常" />
        <el-option v-for="item of levels" :value="item.notes" :label="item.notes" :key="item.codeValue" />
        <el-option value="无效" label="无效" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        icon="el-icon-search"
        @click="onQuery"
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IDictionary, IMonitorItem } from '@/views/monitoring/api'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, export: false }) })
  loading!: { query?: boolean; export?: boolean }

  @Prop({ type: Array, default: () => [] }) selected!: IMonitorItem[]
  @Prop({ type: Array, default: () => [] }) groups!: string[]
  @Prop({ type: Array, default: () => [] }) sections!: string[]
  @Prop({ type: Array, default: () => [] }) levels!: IDictionary[]

  formData: { levelName: string[]; queryLike: string; siteGroup: string[] } = {
    levelName: [],
    queryLike: '',
    siteGroup: []
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }

  onQuery() {
    const { levelName, queryLike = '', siteGroup } = this.formData
    this.$emit('query', {
      queryLike: queryLike.trim(),
      levelName: levelName.join(),
      siteGroup: siteGroup.join()
    })
  }
}
</script>
