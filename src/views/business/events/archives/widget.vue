<template>
  <tf-page :isActive="isActive">
    <template v-slot:action>
      <QueryForm @query="onQuery" :loading="loading" :departments="departments" />
    </template>
    <tf-table
      v-loading="loading.query"
      :columns="columns"
      :data="events"
      @page-change="onPageChange"
      :pagination="pagination"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { eventCols } from '../../utils'
import { eventsPage, getUsers, IEvent, IPagination, IDepartment } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'

@Component({ name: 'EventArchives', components: { QueryForm } })
export default class EventArchives extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = eventCols.filter((col) => col.type !== 'selection')
  events: IEvent[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query', boolean>> = { query: false }
  query: Partial<IEvent & { statusMuti: string }> = {}
  departments: IDepartment[] = []

  async getUsers() {
    const { result } = await getUsers()
    this.departments = result
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
    this.getUsers()
  }

  mounted() {
    this.preparing()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.doQuery()
      this.preparing()
    }
  }
}
</script>

<style lang="scss"></style>
