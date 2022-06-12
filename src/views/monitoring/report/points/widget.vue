<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm :selected="selected" @query="onQuery" @export="onExport" :loading="loading" />
    </div>
    <BaseTable
      :columns="monitorPointReportCols"
      :data="reports"
      :selected="selected"
      @selection-change="onSelectionChange"
      :pagination="pagination"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { monitorPointReportCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'
import { getDefaultPagination } from '@/utils/constant'
import { IPagination, IPointReport, pointReports } from '@/views/monitoring/api'

type IQuery = Record<'queryLike' | 'siteGroup' | 'beginTime' | 'endTime' | 'indicateNames' | 'levelName', string>

@Component({ name: 'ReportPoints', components: { BaseTable, QueryForm } })
export default class ReportPoints extends Vue {
  monitorPointReportCols = monitorPointReportCols

  selected = []

  loading = { query: false, export: false }

  pagination: IPagination = getDefaultPagination()

  query: Partial<IQuery> = {}

  reports: IPointReport[] = []

  onQuery(query) {
    this.query = { ...query }
    this.doQuery({ current: 1 })
  }

  async doQuery(query = {}) {
    this.loading.query = true
    try {
      const {
        result: { records, size, total, current }
      } = await pointReports({ ...this.pagination, ...this.query, ...query })
      this.pagination = { current, size, total }
      this.reports = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.doQuery()
  }

  onExport(ids) {
    console.log(ids)
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  mounted() {
    this.doQuery()
  }
}
</script>