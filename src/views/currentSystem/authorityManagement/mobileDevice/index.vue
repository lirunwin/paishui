<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm
        :selected="selected"
        @query="onQuery"
        @add="onAdd"
        @del="onDel"
        @review="onReview"
        :loading="loading"
      />
    </div>
    <BaseTable
      v-loading="loading.query"
      :columns="mobileDeviceCols"
      :pagination="pagination"
      :data="devices"
      @row-dblclick="onEdit"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
    >
      <template v-for="(_, index) of devices" v-slot:[`action-${index}`]="{ row }">
        <el-button type="text" :key="`${index}-${row.id}`" @click.stop="() => onEdit(row)">编辑</el-button>
      </template>
    </BaseTable>
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
import {
  deleteMobileDeviceByIds,
  getDevices,
  IMobileDeviceQuery,
  IPagination,
  postMobileDevice,
  putMobileDevice,
  reviewMobileDeviceByIds
} from './api'
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
    addOrUpdate: false,
    del: false,
    review: false
  }
  pagination: IPagination = {}
  query: IMobileDeviceQuery = {}

  onQuery(query: IMobileDeviceQuery = {}) {
    this.query = { current: 1, size: 30, ...this.query, ...query }
  }

  onPageChange(pagination) {
    console.log(pagination)
    this.pagination = { ...this.pagination, ...pagination }
    this.query = { ...this.query, ...this.pagination }
  }

  @Watch('query')
  async doQuery(query) {
    this.loading.query = true
    try {
      const {
        result: { records, total, size }
      } = await getDevices(query)
      this.pagination = { ...this.pagination, size, total }

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

  async onDel(ids) {
    try {
      await this.$confirm('是否确认删除设备？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.loading.del = true
      try {
        const { result } = await deleteMobileDeviceByIds((ids || []).join())
        if (result) {
          this.$message({ type: 'success', message: '删除成功!' })
          this.onQuery()
        } else this.$message({ type: 'error', message: '删除失败!' })
      } catch (error) {
        console.log(error)
      }
      this.loading.del = false
    } catch (error) {
      this.$message({ type: 'info', message: '已取消删除' })
    }
  }

  async onReview(ids) {
    try {
      await this.$confirm('是否确认注册选中设备？', '提示', {
        confirmButtonText: '注册审核',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.loading.review = true
      try {
        const { result } = await reviewMobileDeviceByIds({ ids: (ids || []).join() })
        if (result) {
          this.$message({ type: 'success', message: '审核成功!' })
          this.onQuery()
        } else this.$message({ type: 'error', message: '审核失败!' })
      } catch (error) {
        console.log(error)
      }
      this.loading.review = false
    } catch (error) {
      this.$message({ type: 'info', message: '已取消审核' })
    }
  }

  async onSubmit(data: any = {}) {
    this.loading.addOrUpdate = true
    try {
      const { result } = await (this.current.id ? putMobileDevice(data) : postMobileDevice(data))
      if (result) {
        this.$message.success(`${this.current.id ? '修改' : '新增'}移动设备成功`)
        this.visible = false
        this.onQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.addOrUpdate = false
  }

  onEdit(row) {
    const { useUser, department, ...rest } = row || {}
    this.current = { userUserId: (useUser || {}).id, useDeptId: (department || {}).departmentId, ...rest }
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
