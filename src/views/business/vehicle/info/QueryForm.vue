<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" inline>
    <el-form-item label="关键字:">
      <el-input v-model="formData.queryLike" placeholder="支持车牌号、负责人" size="small" maxlength="50" clearable />
    </el-form-item>

    <el-form-item label="状态:">
      <el-checkbox-group v-model="formData.status" size="small">
        <el-checkbox v-for="(value, key) of DICTONARY.vehicle.status" :key="key" :label="key">{{ value }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item class="btns">
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        @click="onQuery"
        style="margin-left: 3em"
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
        :loading="loading.delete"
        :disabled="loading.delete || ids.length !== 1"
        @click="$emit('delete', ids)"
        icon="el-icon-delete"
      >
        删除
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IEvent } from '../../api'
import { DICTONARY } from '../../utils'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, add: false, update: false, delete: false }) })
  loading!: Partial<Record<'query' | 'add' | 'update' | 'delete', boolean>>
  @Prop({ type: Array, default: () => [] }) selected!: IEvent[]

  DICTONARY = DICTONARY

  formData: { queryLike: string; category: string[]; status: string[] } = { queryLike: '', category: [], status: [] }

  onQuery() {
    const { queryLike, status } = this.formData
    this.$emit('query', { queryLike, status: status.join() })
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
