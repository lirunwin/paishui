<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'medium' }" :model="formData" inline>
    <el-form-item label="站点名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入站点名称" size="small" clearable />
    </el-form-item>
    <el-form-item label="站点地址" prop="address">
      <el-input v-model="formData.address" placeholder="请输入站点地址" size="small" clearable />
    </el-form-item>
    <el-form-item label="出厂编码" prop="no">
      <el-input v-model="formData.sn" placeholder="请输入出厂编码" size="small" clearable />
    </el-form-item>
    <el-form-item label="设备类型" prop="type">
      <el-select v-model="formData.type" filterable placeholder="请选择设备类型" size="small" clearable>
        <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="排水分区" prop="psArea">
      <el-select v-model="formData.psArea" placeholder="请选择排水分区" size="small" filterable clearable>
        <el-option :key="item" :value="item" :label="item || '(无分区)'" v-for="item of sections" />
      </el-select>
    </el-form-item>
    <el-form-item label="监测分组" prop="team">
      <el-select v-model="formData.siteGroup" placeholder="请选择监测分组" size="small" filterable clearable>
        <el-option :key="item" :value="item" :label="item || '(无分组)'" v-for="item of groups" />
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
        type="primary"
        size="small"
        :loading="loading.setting"
        :disabled="loading.setting || ids.length !== 1 || !selected[0].bindDevice.id"
        @click="$emit('setting', ids.join())"
        icon="el-icon-setting"
      >
        配置
      </el-button>
      <el-button
        type="danger"
        size="small"
        :loading="loading.delete"
        :disabled="loading.delete || !ids.length"
        @click="$emit('delete', ids.join())"
        icon="el-icon-delete"
      >
        删除
      </el-button>
      <el-button
        :type="`${on ? 'success' : 'danger'}`"
        size="small"
        :loading="loading.enable"
        :disabled="loading.enable || !ids.length"
        @click="$emit('enable', on, ids.join())"
        :icon="`${on ? 'el-icon-circle-check' : 'el-icon-remove-outline'}`"
      >
        {{ `${on ? '启' : '停'}` }}用
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.dismount"
        :disabled="loading.dismount || ids.length !== 1"
        @click="$emit('dismount')"
        icon="el-icon-scissors"
      >
        拆卸
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
import { IPointConnectDevice, IDeviceType } from '@/views/monitoring/api'
export interface ILoading {
  query: boolean
  add: boolean
  update: boolean
  delete: boolean
  enable: boolean
  dismount: boolean
  export: boolean
  setting: boolean
}

export interface IQuery {
  name?: string
  address?: string
  sn?: string
  type?: string
  psArea?: string
  siteGroup?: string
}

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) loading!: ILoading
  @Prop({ type: Array, default: () => [] }) selected!: IPointConnectDevice[]
  @Prop({ type: Array, default: () => [] }) types!: IDeviceType[]
  @Prop({ type: Array, default: () => [] }) groups!: string[]
  @Prop({ type: Array, default: () => [] }) sections!: string[]

  get on() {
    return this.selected.some((item) => item.status !== '1')
  }

  formData: IQuery = {}

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
