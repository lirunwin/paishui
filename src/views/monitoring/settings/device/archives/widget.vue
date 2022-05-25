<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm
        :selected="selected"
        @query="onQuery"
        @add="onAdd"
        @update="onUpdate"
        @del="onDel"
        @export="onExport"
      />
    </div>
    <BaseTable
      :columns="settingArchiveCols"
      :data="archives"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
    />
    <DeviceForm :visible.sync="visible" :title="`${current.id ? '修改' : '新增'}采集设备`" :data="current" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingArchiveCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'
import DeviceForm from './DeviceForm.vue'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'DeviceArchives', components: { BaseTable, QueryForm, DeviceForm } })
export default class DeviceArchives extends Vue {
  settingArchiveCols = settingArchiveCols

  visible = false

  current: {
    [x: string]: string
  } = {}

  selected = []

  archives = [
    { id: '1', name: '测试', code: '1231', time: ['00:00', '23:59'] },
    { id: '2', name: '测试1', code: '1232', time: ['00:00', '23:59'] },
    { id: '3', name: '测试2', code: '1233', time: ['00:00', '23:59'] }
  ]

  onQuery(query) {
    console.log(query)
  }

  onAdd() {
    this.visible = true
    this.current = {}
  }
  onUpdate(id) {
    console.log(id)
  }

  onDel(ids) {
    console.log(ids)
  }

  onExport(ids) {
    console.log(ids)
  }

  onDblClick(row) {
    this.current = { ...row }
    this.visible = true
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }
}
</script>

<style scoped>
.actions {
  padding: 22px 15px 0;
  margin-bottom: 15px;
  background: #fff;
}

.table-container {
  padding: 15px;
  background-color: #fff;
}
</style>
