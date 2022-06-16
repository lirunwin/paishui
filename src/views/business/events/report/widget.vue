<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm @query="onQuery" @report="onReport" @assign="onAssign" />
    </div>
    <BaseTable
      :columns="columns"
      :data="events"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
      :pagination="pagination"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { eventCols, DICTONARY } from '../../utils'
import { eventsPage, IEvent, IPagination } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'

@Component({ name: 'EventReport', components: { BaseTable, QueryForm } })
export default class EventReport extends Vue {
  // @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = eventCols
  events: IEvent[] = []
  selected: IEvent[] = []
  pagination: IPagination = getDefaultPagination()
  loading: boolean = false
  query: Partial<IEvent> = {}

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onDblClick(row: IEvent) {
    console.log(row)
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.doQuery()
  }
  onQuery(query) {
    this.query = { ...query }
    this.doQuery()
  }

  async doQuery() {
    this.loading = true
    try {
      const {
        result: { records, size, total, current }
      } = await eventsPage({ ...this.query, ...this.pagination })
      this.pagination = { current, size, total }
      this.events = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  }

  onReport() {}
  onAssign() {}

  preparing() {
    this.doQuery()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.preparing()
    }
  }
}
</script>

<style lang="scss"></style>
