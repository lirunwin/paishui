<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm :selected="selected" @query="onQuery" @add="onAdd" @del="onDel" :loading="loading" />
    </div>
    <div class="table-container">
      <BaseTable
        v-loading="loading.query"
        :columns="mobileDeviceCols"
        :data="devices"
        @row-dblclick="onEdit"
        @selection-change="onSelectionChange"
        @page-change="onPageChange"
        :pagination="pagination"
      >
        <template v-for="(item, index) of devices" v-slot:[`action-${index}`]="{ row }">
          <el-button type="text" :key="`${index}-${row.id}`" @click.stop="() => onEdit(row)">编辑</el-button>
        </template>
      </BaseTable>
    </div>
    <DeviceForm
      :visible.sync="visible"
      :title="`${current.id ? '修改' : '新增'}采集设备`"
      :data="current"
      :loading="loading.addOrUpdate"
      :disabled="query.status === '0'"
      @submit="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import QueryForm from './QueryForm.vue'
import DeviceForm from './DeviceForm.vue'
import { getDevices, IMobileDeviceQuery, IPagination, postMobileDevice, putMobileDevice } from './api'
import { mobileDeviceCols } from './utils'

@Component({ name: 'MobileDevice', components: { BaseTable, QueryForm, DeviceForm } })
export default class MobileDevice extends Vue {
  mobileDeviceCols = mobileDeviceCols

  visible = false

  current: { [x: string]: string } = {}

  selected = []

  devices = []

  loading = {
    query: false,
    addOrUpdate: false
  }
  pagination: IPagination = {}
  query: IMobileDeviceQuery = {}

  async onQuery(query: IMobileDeviceQuery = {}) {
    this.query = { ...this.query, ...query, current: 1 }
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.query = { ...this.query, ...this.pagination }
  }

  @Watch('query')
  async doQuery(query) {
    this.loading.query = true
    try {
      const {
        result: { records, total }
      } = await getDevices(query)
      this.pagination = { ...this.pagination, total }

      this.devices = records
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  onAdd() {
    this.visible = true
    this.current = {}
  }

  onDel(ids) {
    console.log(ids)
  }

  onExport(ids) {
    console.log(ids)
  }

  async onSubmit(data: any = {}) {
    this.loading.addOrUpdate = true
    const { result } = await (this.current.id ? putMobileDevice(data) : postMobileDevice(data))
    if (result) {
      this.$message.success(`${this.current.id ? '修改' : '新增'}移动设备成功`)
      this.visible = false
      this.onQuery()
    }
    // try {
    //   const { result } = await (data.id ? putMobileDevice(data) : postMobileDevice(data))
    //   if (result) {
    //     this.$message.success(`${data.id ? '修改' : '新增'}移动设备成功`)
    //     this.visible = false
    //     this.onQuery()
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
    this.loading.addOrUpdate = false
  }

  onEdit(row) {
    console.log(row)
    const { useUser, department, ...rest } = row || {}
    this.current = { userUserId: useUser.id, useDeptId: department.departmentId, ...rest }
    this.visible = true
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  created() {
    this.onQuery()
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
