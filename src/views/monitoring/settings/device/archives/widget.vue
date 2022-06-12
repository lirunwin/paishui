<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm
        :selected="selected"
        :types="types"
        :loading="loading"
        @query="onQuery"
        @add="onAdd"
        @update="onUpdate"
        @del="onDel"
        @export="onExport"
      />
    </div>
    <BaseTable
      :columns="settingDeviceArchiveCols"
      :data="archives"
      :pagination="pagination"
      v-loading="loading.query"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
    />
    <DeviceForm
      :visible.sync="visible"
      :title="`${current.id ? '修改' : '新增'}设备档案`"
      :data="current"
      :types="types"
      @submit="onSubmit"
      :loading="loading.add || loading.update"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingDeviceArchiveCols } from '@/views/monitoring/utils'
import QueryForm, { ILoading, IQuery } from './QueryForm.vue'
import DeviceForm from './DeviceForm.vue'
import {
  IDevice,
  IPagination,
  IDeviceType,
  devicesPage,
  updateDevice,
  addDevice,
  deleteDeviceBatch,
  deviceTypesPage
} from '@/views/monitoring/api'

import { getDefaultPagination } from '@/utils/constant'

@Component({ name: 'DeviceDeviceArchives', components: { BaseTable, QueryForm, DeviceForm } })
export default class DeviceDeviceArchives extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  settingDeviceArchiveCols = settingDeviceArchiveCols

  visible = false

  current: IDevice = {}

  selected: IDevice[] = []

  types: IDeviceType[] = []

  archives: IDevice[] = []

  loading: ILoading = { query: false, add: false, update: false, del: false, export: false }

  pagination: IPagination = getDefaultPagination()

  query: IQuery = {}

  onQuery(query) {
    this.query = { ...query }
    this.doQuery({ current: 1 })
  }

  async doQuery(query = {}) {
    this.loading.query = true
    try {
      const {
        result: { records, size, total, current }
      } = await devicesPage({ ...this.pagination, ...this.query, ...query })
      this.pagination = { current, size, total }
      this.archives = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.doQuery()
  }

  async onSubmit(data: IDevice) {
    this.loading[data.id ? 'update' : 'add'] = true
    try {
      const { result } = await (data.id ? updateDevice(data) : addDevice(data))
      this.$message[result ? 'success' : 'error'](`${data.id ? '修改' : '新增'}设备档案${result ? '成功!' : '失败!'}`)
      if (result) {
        this.visible = false
        this.doQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading[data.id ? 'update' : 'add'] = false
  }

  onAdd() {
    this.current = {}
    this.visible = true
  }

  onUpdate(row) {
    this.current = { ...row }
    this.visible = true
  }

  async onDel(ids) {
    await this.$confirm(`是否确认删除这${this.selected.length}项设备档案？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.del = true
    try {
      const { result } = await deleteDeviceBatch(ids)
      this.$message[result ? 'success' : 'error'](`删除设备档案${result ? '成功!' : '失败!'}`)
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.del = false
  }

  onExport(ids) {
    console.log(ids)
  }

  onDblClick(row) {
    this.current = { ...row }
    this.visible = true
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  async getAllTypes() {
    try {
      const {
        result: { records }
      } = await deviceTypesPage({ current: 1, size: 9999999 })
      this.types = records || []
    } catch (error) {
      console.log(error)
    }
  }

  mounted() {
    this.doQuery()
    this.getAllTypes()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.getAllTypes()
    }
  }
}
</script>
