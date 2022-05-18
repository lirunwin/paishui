<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="站点名称" prop="name">
      <el-input v-model="formData.no" placeholder="请输入站点名称" size="small" clearable />
    </el-form-item>
    <el-form-item label="站点地址" prop="address">
      <el-input v-model="formData.no" placeholder="请输入站点地址" size="small" clearable />
    </el-form-item>
    <el-form-item label="SN序列号" prop="no">
      <el-input v-model="formData.no" placeholder="请输入SN序列号" size="small" clearable />
    </el-form-item>
    <el-form-item label="设备类型" prop="type">
      <el-select v-model="formData.type" placeholder="请选择设备类型" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="排水分区" prop="section">
      <el-select v-model="formData.type" placeholder="请选择排水分区" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item label="监测分组" prop="team">
      <el-select v-model="formData.type" placeholder="请选择监测分组" size="small" clearable>
        <el-option value="" label="全部" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        @click="$emit('query', { ...formData })"
      >
        查询
      </el-button>
      <el-button type="primary" size="small" :loading="loading.add" :disabled="loading.add" @click="$emit('add')">
        新增
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.update"
        :disabled="loading.update || ids.length !== 1"
        @click="$emit('update', ids.toString())"
      >
        修改
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.del"
        :disabled="loading.del || !ids.length"
        @click="$emit('del', ids)"
      >
        删除
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.enable"
        :disabled="loading.enable || !ids.length"
        @click="$emit('enable', ids)"
      >
        启/停用
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.dismantle"
        :disabled="loading.dismantle || !ids.length"
        @click="$emit('dismantle', ids)"
      >
        拆卸
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.export"
        :disabled="loading.export || !ids.length"
        @click="$emit('export', ids)"
      >
        导出
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({ name: 'QueryForm', components: {} })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, add: false, update: false, del: false, export: false }) })
  loading!: {
    query?: boolean
    add?: boolean
    update?: boolean
    del?: boolean
    enable?: boolean
    dismantle?: boolean
    export?: boolean
  }

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  formData: { [x: string]: string } = {}

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
