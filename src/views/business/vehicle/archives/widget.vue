<template>
  <div class="page-container">
    <div class="actions small">
      <QueryForm @query="onQuery" :loading="loading" :departments="departments" />
    </div>
    <BaseTable
      v-loading="loading.query"
      :columns="columns"
      :data="vehicleArchives"
      @page-change="onPageChange"
      :pagination="pagination"
      style="max-height:100%"
    >
      <template v-for="(_, index) of vehicleArchives" v-slot:[`name1-${index}`]="{ row }">
        <el-button type="text" :key="index">{{ row.id }}</el-button>
      </template>
      <template v-for="(_, index) of vehicleArchives" v-slot:[`name2-${index}`]="{ row }">
        <el-button type="text" :key="index" @click="() => onShow(row)">{{ row.id }}</el-button>
      </template>
    </BaseTable>
    <!-- <CommonPopup
      v-for="key of popupIds"
      :key="key"
      :ref="`popup-${key}`"
      :popupPosition="popups[key].coordinate"
      :mapView="popups[key].map"
      :isSetCenter="popups[key].center"
      @close="() => onPopupClose(key)"
    >
      <InfoCard
        :data="popups[key].data"
        :colors="levelColors"
      />
    </CommonPopup> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { vehicleArchiveCols } from '../../utils'
import { vehicleArchivePage, getUsers, IPagination, IDepartment, IVehicleArchive } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import CommonPopup from '@/components/CommonPopup/index.vue'
import QueryForm from './QueryForm.vue'

@Component({ name: 'VehicleArchives', components: { BaseTable, QueryForm, CommonPopup } })
export default class VehicleArchives extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = vehicleArchiveCols.filter((col) => col.type !== 'selection')
  vehicleArchives: IVehicleArchive[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query', boolean>> = { query: false }
  query: Partial<IVehicleArchive & { statusMuti: string }> = {}
  departments: IDepartment[] = []
  opened: IVehicleArchive[] = []
  current: Partial<IVehicleArchive> = {}
  view = null

  async getUsers() {
    const { result } = await getUsers()
    this.departments = result
  }

  onShow(row: IVehicleArchive) {
    this.current = { ...row }
    this.opened = [...this.opened.filter((item) => item.id !== row.id), { ...row }]
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
      } = await vehicleArchivePage({ ...this.query, ...this.pagination })
      this.pagination = { current, size, total }
      this.vehicleArchives = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  preparing() {
    this.getUsers()
    this.view = (this.$attrs.data as any).mapView
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
