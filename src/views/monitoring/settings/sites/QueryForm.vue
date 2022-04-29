<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData" inline>
    <el-form-item label="关键字" prop="name">
      <el-input v-model="formData.no" placeholder="请输入站点名称" size="small" clearable />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        icon="el-icon-search"
        @click="$emit('query', { ...formData })"
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
        icon="el-icon-edit"
        @click="$emit('update', ids.toString())"
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
        icon="el-icon-scissors"
      >
        拆卸
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
  }

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  formData = {}

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
