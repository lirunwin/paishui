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
    <div class="table-container">
      <BaseTable :columns="cols" :data="archives" @row-dblclick="onDblClick" @selection-change="onSelectionChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingSiteCols as cols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'MonitoringSites', components: { BaseTable, QueryForm } })
export default class MonitoringSites extends Vue {
  cols = cols

  visible = false

  current = {}

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
