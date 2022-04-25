<template>
  <div class="page-container">
    <div class="actions">
      <div>
        <el-button type="primary" size="small" @click="onStandardAdd">新增指标标准</el-button>
        <el-button type="primary" size="small" :disabled="!selected.standard.length">删除设备类型</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="onParamAdd">新增指标参数</el-button>
        <el-button type="primary" size="small" :disabled="!selected.param.length">删除指标参数</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <el-col :span="10">
        <div class="table-container">
          <BaseTable
            :columns="settingStandardCols"
            :data="standards"
            @row-dblclick="onStandardRowDblClick"
            @selection-change="onStandardSelectionChange"
          />
        </div>
      </el-col>
      <el-col :span="14">
        <div class="table-container">
          <BaseTable
            :columns="settingStandardParamCols"
            :data="params"
            @row-dblclick="onParamRowDblClick"
            @selection-change="onParamSelectionChange"
          /></div
      ></el-col>
    </el-row>
    <StandardForm
      :visible.sync="visible.standard"
      :title="`${current.standard.id ? '修改' : '新增'}指标标准`"
      :data="current.standard"
    />
    <ParamForm
      :visible.sync="visible.param"
      :title="`${current.param.id ? '修改' : '新增'}指标参数`"
      :data="current.param"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingStandardCols, settingStandardParamCols } from '@/views/monitoring/utils'
import StandardForm from './StandardForm.vue'
import ParamForm from './ParamForm.vue'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'MonitoringStandards', components: { BaseTable, StandardForm, ParamForm } })
export default class MonitoringStandards extends Vue {
  settingStandardCols = settingStandardCols
  settingStandardParamCols = settingStandardParamCols

  visible = { standard: false, param: false }

  current = { standard: {}, param: {} }

  selected = { standard: [], param: [] }

  standards = [
    { id: '1', name: '测试', code: '1231', time: ['00:00', '23:59'] },
    { id: '2', name: '测试1', code: '1232', time: ['00:00', '23:59'] },
    { id: '3', name: '测试2', code: '1233', time: ['00:00', '23:59'] }
  ]
  params = [
    { id: '1', name: '测试', code: '1231', time: 'ss' },
    { id: '2', name: '测试1', code: '1232', time: 'ss' },
    { id: '3', name: '测试2', code: '1233', time: 'ss' }
  ]

  onStandardAdd() {
    this.visible.standard = true
    this.current = { ...this.current, standard: {} }
  }

  onParamAdd() {
    this.visible.param = true
    this.current = { ...this.current, param: {} }
  }

  onStandardRowDblClick(row) {
    this.current = { ...this.current, standard: { ...row } }
    this.visible.standard = true
  }

  onParamRowDblClick(row) {
    this.current = { ...this.current, param: { ...row } }
    this.visible.param = true
  }

  onStandardSelectionChange(selections) {
    this.selected = { ...this.selected, standard: selections }
  }

  onParamSelectionChange(selections) {
    this.selected = { ...this.selected, param: selections }
  }
}
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
}

.table-container {
  padding: 15px;
  background-color: #fff;
}
</style>
