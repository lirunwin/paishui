<template>
  <div class="page-container">
    <div class="actions">
      <div>
        <el-button type="primary" size="small" @click="onTypeAdd">新增设备类型</el-button>
        <el-button type="primary" size="small" :disabled="!selected.type.length">删除设备类型</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="onParamAdd">新增参数</el-button>
        <el-button type="primary" size="small" :disabled="!selected.param.length">删除参数</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <el-col :span="12">
        <div class="table-container">
          <BaseTable
            :columns="settingDeviceTypeCols"
            :data="types"
            @row-dblclick="onTypeRowDblClick"
            @selection-change="onTypeSelectionChange"
          /></div
      ></el-col>
      <el-col :span="12">
        <div class="table-container">
          <BaseTable
            :columns="settingDeviceTypeParamCols"
            :data="params"
            @row-dblclick="onParamRowDblClick"
            @selection-change="onParamSelectionChange"
          /></div
      ></el-col>
    </el-row>
    <TypeForm
      :visible.sync="visible.type"
      :title="`${current.type.id ? '修改' : '新增'}设备类型`"
      :data="current.type"
    />
    <ParamForm
      :visible.sync="visible.param"
      :title="`${current.param.id ? '修改' : '新增'}设备参数`"
      :data="current.param"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingDeviceTypeCols, settingDeviceTypeParamCols } from '@/views/monitoring/utils'
import TypeForm from './TypeForm.vue'
import ParamForm from './ParamForm.vue'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'DeviceTypes', components: { BaseTable, TypeForm, ParamForm } })
export default class DeviceTypes extends Vue {
  settingDeviceTypeCols = settingDeviceTypeCols
  settingDeviceTypeParamCols = settingDeviceTypeParamCols

  visible = { type: false, param: false }

  current: {
    type: { id?: string; [x: string]: string }
    param: { id?: string; [x: string]: string }
    [x: string]: any
  } = {
    type: {},
    param: {}
  }

  selected = { type: [], param: [] }

  types = [
    { id: '1', name: '测试', code: '1231', time: 'ss' },
    { id: '2', name: '测试1', code: '1232', time: 'ss' },
    { id: '3', name: '测试2', code: '1233', time: 'ss' }
  ]
  params = [
    { id: '1', name: '测试', code: '1231', time: 'ss' },
    { id: '2', name: '测试1', code: '1232', time: 'ss' },
    { id: '3', name: '测试2', code: '1233', time: 'ss' }
  ]

  onTypeAdd() {
    this.visible.type = true
    this.current = { ...this.current, type: {} }
  }

  onParamAdd() {
    this.visible.param = true
    this.current = { ...this.current, param: {} }
  }

  onTypeRowDblClick(row) {
    this.current = { ...this.current, type: { ...row } }
    this.visible.type = true
  }

  onParamRowDblClick(row) {
    this.current = { ...this.current, param: { ...row } }
    this.visible.param = true
  }

  onTypeSelectionChange(selections) {
    this.selected = { ...this.selected, type: selections }
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
