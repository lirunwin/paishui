<template>
  <tf-page :isActive="isActive" :gutter="false">
    <template v-slot:action>
      <QueryForm @query="onQuery" :loading="loading" :departments="departments" />
    </template>
    <tf-table
      v-loading="loading.query"
      :columns="columns"
      :data="vehicleArchives"
      @page-change="onPageChange"
      :pagination="pagination"
      :tree-props="{ children: 'eventMangeList', hasChildren: 'hasChildren' }"
    >
      >
      <template v-slot:name1="{ row }">
        <el-button type="text" style="padding: 3px">{{ row.id }}</el-button>
      </template>
      <template v-slot:name2="{ row }">
        <el-button type="text" style="padding: 3px" @click="() => onShow(row)">{{ row.id }}</el-button>
      </template>
    </tf-table>
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
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { vehicleArchiveCols } from '../../utils'
import { vehicleArchivePage, getUsers, IPagination, IDepartment, IVehicleArchive } from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import CommonPopup from '@/components/CommonPopup/index.vue'
import QueryForm from './QueryForm.vue'

@Component({ name: 'VehicleArchives', components: { QueryForm, CommonPopup } })
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
      this.vehicleArchives = (records || []).map((vehicle) => {
        const { eventMangeList, id, ...reset } = vehicle
        return {
          id,
          ...reset,
          eventMangeList: (eventMangeList || []).map(({ id: eventId, ...resetEvent }) => {
            return { ...resetEvent, ...reset, id: `${id}-${eventId}`, hasChildren: false }
          })
        }
      })
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

<style lang="scss">
.table {
  flex: 1 1 auto;
}
</style>
