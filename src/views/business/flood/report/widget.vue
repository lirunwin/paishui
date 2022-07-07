<template>
  <tf-page :isActive="isActive" :gutter="false">
    <template v-slot:action>
      <QueryForm @query="onQuery" @report="onReport" @assign="onAssign" :loading="loading" :selected="selected" />
    </template>
    <tf-table
      v-loading="loading.query"
      :columns="columns"
      :data="floods"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
      :pagination="pagination"
    />
    <ReportAndAssignForm
      :visible.sync="visible"
      :data="current"
      :loading="loading.report || loading.assign"
      :users="users"
      title="汛情上报"
      @submit="onSubmit"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { floodCols } from '../../utils'
import {
  addFlood,
  addAssign,
  floodPage,
  getUsers,
  IFlood,
  IAssign,
  IPagination,
  IDepartment,
  updateAssign,
  updateFlood
} from '../../api'
import { getDefaultPagination } from '@/utils/constant'
import QueryForm from './QueryForm.vue'
import ReportAndAssignForm from './ReportAndAssignForm.vue'

@Component({ name: 'FloodReport', components: { QueryForm, ReportAndAssignForm } })
export default class FloodReport extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  columns = floodCols
  floods: IFlood[] = []
  selected: IFlood[] = []
  pagination: IPagination = getDefaultPagination()
  loading: Partial<Record<'query' | 'report' | 'assign', boolean>> = {}
  query: Partial<IFlood> = {}
  current: IFlood | {} = {}
  visible: boolean = false
  users: IDepartment[] = []
  view = null

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onDblClick(row: IFlood) {
    this.current = { ...row }
    this.visible = true
  }

  onReport() {
    this.current = {}
    this.visible = true
  }

  onAssign() {
    this.current = { ...this.selected[0] }
    this.visible = true
  }

  async onSubmit({ flood, assign }: { flood: IFlood; assign: IAssign }) {
    let { id } = flood
    this.loading.report = true
    try {
      const { result } = await (!id ? addFlood(flood) : updateFlood(flood))
      this.$message[result.id ? 'success' : 'error'](`${id ? '修改' : ''}上报${result ? '成功!' : '失败!'}`)
      id = result.id
    } catch (error) {
      console.log(error)
    }
    this.loading.report = false
    if (id && assign.majorHandler && !assign.id) {
      this.loading.assign = true
      try {
        const { result } = await addAssign({ ...assign, sourceId: id })
        this.$message[result ? 'success' : 'error'](`派工${result ? '成功!' : '失败!'}`)
      } catch (error) {
        console.log(error)
      }
      this.loading.assign = false
    }
    this.doQuery()
    this.visible = false
  }

  async getUsers() {
    const { result } = await getUsers()
    this.users = result
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
    this.doQuery()
    this.getUsers()
    this.view = (this.$attrs.data as any).mapView
  }

  mounted() {
    this.preparing()
  }
}
</script>

<style lang="scss"></style>
