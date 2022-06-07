<template>
  <div>
    <el-form ref="form" :model="query" size="medium" label-width="5em" class="form">
      <el-form-item label="监测分组">
        <el-select v-model="query.team" placeholder="请选择分组">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="query.keyword" placeholder="支持搜索监测站点名称、地址" />
      </el-form-item>
      <el-form-item label="监测状态" size="small">
        <el-checkbox-group v-model="query.state" size="small">
          <el-checkbox v-for="state of monitorStates" :key="state.name" :label="state.name">{{
            state.label
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <BaseTitle>
        <el-row type="flex" justify="space-between">
          监测点列表（共52个）
          <el-switch active-text="开启监测窗" v-model="monitoring" />
        </el-row>
      </BaseTitle>
      <BaseTable :columns="settingMonitorCols" :data="monitorItems" :row-style="rowStyle">
        <template v-for="(item, index) of monitorItems" v-slot:[`action-${index}`]>
          <div :key="`index-${item.id}`">
            <el-button type="text" icon="el-icon-location" />
            <el-button type="text" icon="el-icon-data-analysis" />
          </div>
        </template>
      </BaseTable>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { monitorStates } from '@/views/monitoring/utils'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingMonitorCols, monitorResultStates } from '@/views/monitoring/utils'

@Component({ name: 'Monitor', components: { BaseTitle, BaseTable } })
export default class Monitor extends Vue {
  query: {
    team?: number
    keyword?: string
    state?: string[]
  } = { state: [] }
  monitoring = false
  monitorStates = monitorStates
  settingMonitorCols = settingMonitorCols

  selected = { standard: [], param: [] }

  monitorItems = [
    { id: '1', name: '正常', code: '1231', state: 'normal' },
    { id: '2', name: '优质', code: '1232', state: 'good' },
    { id: '3', name: '轻度', code: '1233', state: 'light' },
    { id: '4', name: '中度', code: '1233', state: 'medium' },
    { id: '5', name: '严重', code: '1233', state: 'heavy' },
    { id: '6', name: '无效', code: '1233', state: 'invalid' }
  ]

  rowStyle({ row }) {
    return { color: (monitorResultStates.find((item) => item.name === row.state) || {}).color }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
