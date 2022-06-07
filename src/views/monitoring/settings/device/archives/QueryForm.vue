<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="SN序列号" prop="sn">
      <el-input v-model="formData.sn" placeholder="请输入指标标准名称" size="small" clearable />
    </el-form-item>
    <el-form-item label="设备名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入指标标准名称" size="small" clearable />
    </el-form-item>
    <el-form-item label="设备类型" prop="type">
      <el-select v-model="formData.type" filterable placeholder="请选择设备类型" size="small" clearable>
        <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        @click="$emit('query', { ...formData })"
        icon="el-icon-search"
      >
        查询
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.add"
        :disabled="loading.add"
        @click="$emit('add')"
        icon="el-icon-plus"
      >
        新增
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.update"
        :disabled="loading.update || ids.length !== 1"
        @click="$emit('update', selected[0])"
        icon="el-icon-edit"
      >
        修改
      </el-button>
      <el-button
        type="danger"
        size="small"
        :loading="loading.del"
        :disabled="loading.del || !ids.length"
        @click="$emit('del', ids)"
        icon="el-icon-delete"
      >
        删除
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.export"
        :disabled="loading.export || !ids.length"
        @click="$emit('export', ids)"
        icon="el-icon-download"
      >
        导出
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IDeviceType, IDevice } from '@/views/monitoring/api'

export interface ILoading {
  query: boolean
  add: boolean
  update: boolean
  del: boolean
  export: boolean
}

export interface IQuery {
  sn?: string
  name?: string
  type?: string | number
}

@Component({ name: 'QueryForm', components: {} })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) loading!: ILoading
  @Prop({ type: Array, default: () => [] }) selected!: IDevice[]
  @Prop({ type: Array, default: () => [] }) types!: IDeviceType[]

  formData: IQuery = {}

  get ids() {
    return this.selected.map((item) => item.id).join()
  }
}
</script>
