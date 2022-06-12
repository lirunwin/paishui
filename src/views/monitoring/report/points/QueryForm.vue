<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="关键字" prop="queryLike">
      <el-input v-model="formData.queryLike" placeholder="请输入关键字" size="small" clearable />
    </el-form-item>
    <el-form-item label="监测分组" prop="siteGroup">
      <el-select v-model="formData.siteGroup" placeholder="请选择监测分组" size="small" clearable multiple>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="数据时间" prop="time">
      <el-date-picker
        v-model="formData.time"
        type="daterange"
        range-separator="到"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        style="width: 230px"
        clearable
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item label="监测指标" prop="indicateNames">
      <el-select v-model="formData.indicateNames" placeholder="请选择监测指标" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="判定结果" prop="levelName">
      <el-select v-model="formData.levelName" placeholder="请选择判定结果" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        icon="el-icon-search"
        @click="onSubmit"
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
  @Prop({ type: Object, default: () => ({ query: false, export: false }) })
  loading!: { query?: boolean; export?: boolean }

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  formData: {
    queryLike: string
    siteGroup: string[]
    time: Date[]
    indicateNames: string[]
    levelName: string[]
  } = { queryLike: '', siteGroup: [], time: [], indicateNames: [], levelName: [] }

  onSubmit() {
    const {
      queryLike,
      siteGroup,
      time: [beginTime, endTime],
      indicateNames,
      levelName
    } = this.formData
    this.$emit('query', {
      queryLike,
      siteGroup: siteGroup.join(),
      beginTime,
      endTime,
      indicateNames: indicateNames.join(),
      levelName: levelName.join()
    })
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>