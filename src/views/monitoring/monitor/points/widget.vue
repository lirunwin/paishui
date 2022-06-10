<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm :selected="selected" @query="onQuery" @export="onExport" />
    </div>
    <BaseTable
      :columns="monitorPointsCols"
      :data="points"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      :row-style="rowStyle"
      :row-key="'collectId'"
      @page-change="onPageChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { monitorPointsCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'
import { pointsMonitoring, IPointMonitoringQuery, IPointMonitoringItem } from '@/views/monitoring/api'
import {
  defaultValuesForMonitorStandardLevel,
  getDefaultPagination,
  monitorAutoRefreshInterval
} from '@/utils/constant'
import { IPagination } from '@/views/currentSystem/authorityManagement/mobileDevice/api'

@Component({ name: 'PointsMonitor', components: { BaseTable, QueryForm } })
export default class PointsMonitor extends Vue {
  monitorPointsCols = monitorPointsCols

  query: Partial<IPointMonitoringQuery> = {}
  loading: boolean = false
  points: IPointMonitoringItem[] = []
  selected: IPointMonitoringItem[] = []
  pagination: IPagination = getDefaultPagination()

  timer = null
  onExport(ids) {
    console.log(ids)
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onQuery(query) {
    this.query = { ...query }
    this.startInterval()
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.startInterval()
  }

  async doQuery(query = {}) {
    this.loading = true
    try {
      const {
        result: { records, size, total, current }
      } = await pointsMonitoring({ ...this.query, ...this.pagination, ...query })
      this.pagination = { current, size, total }

      this.points = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  }

  rowStyle({ row }) {
    const { level } = row
    const { color } = defaultValuesForMonitorStandardLevel.find((item) => item.codeValue === String(level)) || {}
    return { color }
  }

  onDblClick(row) {}

  mounted() {
    this.startInterval()
  }

  stopInterval() {
    if (this.timer) clearInterval(this.timer)
  }

  startInterval() {
    this.stopInterval()
    this.doQuery()
    this.timer = setInterval(() => {
      this.doQuery()
    }, monitorAutoRefreshInterval)
  }

  beforeDestroy() {
    this.stopInterval()
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
