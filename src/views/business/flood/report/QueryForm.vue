<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" inline>
    <el-form-item label="关键字:">
      <el-input v-model="formData.queryLike" placeholder="汛情位置地址模糊查询" size="small" maxlength="50" clearable />
    </el-form-item>

    <el-form-item label="是否为警情:">
      <el-checkbox-group v-model="formData.police" size="small" :max="1">
        <el-checkbox :label="1">是</el-checkbox>
        <el-checkbox :label="0">否</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item>
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
        :loading="loading.report"
        :disabled="loading.report"
        @click="$emit('report')"
        icon="el-icon-plus"
      >
        上报
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading.assign"
        :disabled="loading.assign || ids.length !== 1"
        @click="$emit('assign', ids)"
        icon="el-icon-plus"
      >
        派工
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IFlood } from '../../api'
import { DICTONARY } from '../../utils'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, report: false, assign: false }) })
  loading!: { query?: boolean; report?: boolean; assign?: boolean }
  @Prop({ type: Array, default: () => [] }) selected!: IFlood[]

  DICTONARY = DICTONARY

  formData: { queryLike: string; police: string[]; status: string[] } = { queryLike: '', police: [], status: [] }

  onQuery() {
    const { queryLike, police, status } = this.formData
    this.$emit('query', { queryLike, police: police.join(), status: status.join() })
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>
