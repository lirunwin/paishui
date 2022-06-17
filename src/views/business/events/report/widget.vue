<template>
  <div class="page-container">
    <div class="actions small">
      <QueryForm @query="onQuery" @report="onReport" @assign="onAssign" :loading="loading" />
    </div>
    <BaseTable
      v-loading="loading.query"
      :columns="columns"
      :data="events"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
      :pagination="pagination"
    />
    <ReportAndAssignForm :visible.sync="visible" :data="current" :loading="loading.report || loading.assign" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { eventCols } from '../../utils'
import { addEvent, addEventAssign, eventsPage, IEvent, IEventAssign, IPagination, updateEventAssign } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'
import ReportAndAssignForm from './ReportAndAssignForm.vue'

@Component({ name: 'EventReport', components: { BaseTable, QueryForm, ReportAndAssignForm } })
export default class EventReport extends Vue {
  // @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = eventCols
  events: IEvent[] = []
  selected: IEvent[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query' | 'report' | 'assign', boolean>> = {}
  query: Partial<IEvent> = {}
  current: IEvent | {} = {}
  visible: boolean = false

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onDblClick(row: IEvent) {}

  onReport() {
    this.current = {}
    this.visible = true
  }

  onAssign() {
    this.current = {}
    this.visible = true
  }

  async onSubmit({ event, assign }: { event: IEvent; assign: IEventAssign }) {
    let eventId: IEvent['id'] = null
    if (event.id) {
      this.loading.report = true
      try {
        const { result } = await addEvent(event)
        this.$message[result.id ? 'success' : 'error'](`上报${result ? '成功!' : '失败!'}`)
        eventId = result.id
      } catch (error) {
        console.log(error)
      }
      this.loading.report = false
    }
    this.loading.assign = true
    try {
      const { result } = await (assign.id
        ? updateEventAssign(assign)
        : addEventAssign({ ...assign, sourceId: eventId }))
      this.$message[result ? 'success' : 'error'](`${assign.id ? '修改' : ''}派工${result ? '成功!' : '失败!'}`)
    } catch (error) {
      console.log(error)
    }
    this.loading.assign = false
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
    this.loading.query = true
    try {
      const {
        result: { records, size, total, current }
      } = await eventsPage({ ...this.query, ...this.pagination })
      this.pagination = { current, size, total }
      this.events = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  preparing() {
    this.doQuery()
  }

  mounted() {
    this.preparing()
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
