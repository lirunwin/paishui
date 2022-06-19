<template>
  <div class="page-container">
    <div class="actions small">
      <QueryForm @query="onQuery" @delete="onDelete" @add="onAdd" :loading="loading" :selected="selected" />
    </div>
    <BaseTable
      v-loading="loading.query"
      :columns="columns"
      :data="vehicles"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
      :pagination="pagination"
    />
    <VehicleForm
      :visible.sync="visible"
      :data="current"
      :loading="loading.add || loading.update"
      :departments="departments"
      :title="`${current.id ? '修改' : '新增'}`"
      @submit="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { vehicleCols } from '../../utils'
import {
  addVehicle,
  vehiclePage,
  getUsers,
  IVehicle,
  IPagination,
  IDepartment,
  updateVehicle,
  deleteVehicleBatch
} from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'
import VehicleForm from './VehicleForm.vue'

@Component({ name: 'VehicleInfo', components: { BaseTable, QueryForm, VehicleForm } })
export default class VehicleInfo extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = vehicleCols
  vehicles: IVehicle[] = []
  selected: IVehicle[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query' | 'delete' | 'add' | 'update', boolean>> = {
    query: false,
    delete: false,
    add: false,
    update: false
  }
  query: Partial<IVehicle> = {}
  current: Partial<IVehicle> = {}
  visible: boolean = false
  departments: IDepartment[] = []

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onDblClick(row: IVehicle) {
    this.current = { ...row }
    this.visible = true
  }

  onAdd() {
    this.current = {}
    this.visible = true
  }

  async onSubmit(vehicle: IVehicle) {
    this.loading[vehicle.id ? 'update' : 'add'] = true
    try {
      const { result } = await (vehicle.id ? updateVehicle(vehicle) : addVehicle(vehicle))
      this.$message[result ? 'success' : 'error'](`车辆${vehicle.id ? '修改' : '添加'}${result ? '成功!' : '失败!'}`)
    } catch (error) {
      console.log(error)
    }
    this.loading[vehicle.id ? 'update' : 'add'] = false

    this.visible = false
  }

  async onDelete() {
    await this.$confirm(`是否确认删除这${this.selected.length}辆车辆？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.delete = true
    try {
      const { result } = await deleteVehicleBatch(this.selected.map(({ id }) => id).join())
      this.$message[result ? 'success' : 'error'](`删除车辆${result ? '成功!' : '失败!'}`)
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.delete = false
  }

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
      } = await vehiclePage({ ...this.query, ...this.pagination })
      this.pagination = { current, size, total }
      this.vehicles = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  preparing() {
    this.doQuery()
    this.getUsers()
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
