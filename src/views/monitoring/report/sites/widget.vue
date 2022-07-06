<template>
  <tf-page :isActive="isActive">
    <template v-slot:action>
      <QueryForm :selected="selected" @query="onQuery" @export="onExport" />
    </template>
    <tf-table
      :columns="monitorPointReportCols"
      :data="points"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { monitorPointReportCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'

@Component({ name: 'ReportSites', components: { QueryForm } })
export default class ReportSites extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  monitorPointReportCols = monitorPointReportCols

  visible = false

  current = {}

  selected = []

  points = [
    { id: '1', name: '测试', code: '1231', time: ['00:00', '23:59'] },
    { id: '2', name: '测试1', code: '1232', time: ['00:00', '23:59'] },
    { id: '3', name: '测试2', code: '1233', time: ['00:00', '23:59'] }
  ]

  onQuery(query) {
    console.log(query)
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
