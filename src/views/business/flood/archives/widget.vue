<template>
  <div class="page-container">
    <div class="actions small">
      <QueryForm @query="onQuery" :loading="loading" :departments="departments" />
    </div>
    <BaseTable
      v-loading="loading.query"
      :columns="columns"
      :data="floods"
      @page-change="onPageChange"
      :pagination="pagination"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { floodCols } from '../../utils'
import { floodPage, getUsers, IPagination, IDepartment, IFlood } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'

@Component({ name: 'FloodArchives', components: { BaseTable, QueryForm } })
export default class FloodArchives extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = floodCols.filter((col) => col.type !== 'selection')
  floods: IFlood[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query', boolean>> = { query: false }
  query: Partial<IFlood & { statusMuti: string }> = {}
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
      } = await floodPage({ ...this.query, ...this.pagination })
      this.pagination = { current, size, total }
      this.floods = records || []
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
      this.preparing()
      this.doQuery()
    }
  }
}
</script>

<style lang="scss"></style>
