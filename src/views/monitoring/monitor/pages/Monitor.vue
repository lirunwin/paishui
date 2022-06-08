<template>
  <div>
    <el-form ref="form" :model="query" size="small" label-width="5em" class="form">
      <el-form-item label="监测分组">
        <el-select v-model="formData.siteGroup" placeholder="请选择分组" size="small" @change="onQueryChange">
          <el-option label="全部" value="" />
          <el-option v-for="group of groups" :key="group" :label="group" :value="group" />
        </el-select>
      </el-form-item>
      <el-form-item label="排水分区">
        <el-select v-model="formData.psArea" placeholder="请选择分组" size="small" @change="onQueryChange">
          <el-option label="全部" value="" />
          <el-option v-for="section of sections" :key="section" :label="section" :value="section" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input
          v-model="formData.queryStr"
          placeholder="支持搜索监测站点名称、地址"
          size="small"
          @keyup.enter.native="onQueryChange"
        />
      </el-form-item>
      <el-form-item label="监测状态" size="small">
        <el-checkbox-group v-model="formData.monitorStatus" size="small" @change="onQueryChange">
          <el-checkbox v-for="status of statuses" :key="status.code" :label="status.code">
            {{ status.label }} {{ getTotal(status.code) }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <BaseTitle>
        <el-row type="flex" justify="space-between">
          监测点列表（共{{ pagination.total }}个）
          <el-switch active-text="开启监测窗" v-model="monitoring" :active-value="1" :inactive-value="0" />
        </el-row>
      </BaseTitle>
      <BaseTable
        :columns="settingMonitorCols"
        :data="monitorItems"
        :row-style="rowStyle"
        @current-change="onCurrentChange"
        @page-change="onPageChange"
        :pagination="{ ...pagination, pagerCount: 5, layout: 'total, sizes, prev, pager, next' }"
        style="padding: 0"
      >
        <template v-for="(item, index) of monitorItems" v-slot:[`action-${index}`]>
          <div :key="`index-${item.id}`">
            <el-button type="text" icon="el-icon-location" />
            <el-button type="text" icon="el-icon-data-analysis" />
          </div>
        </template>
      </BaseTable>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingMonitorCols } from '@/views/monitoring/utils'
import {
  groups,
  IMonitorItem,
  IMonitorItemSummary,
  IPagination,
  monitorItemsPage,
  monitorItemsSummary,
  sections
} from '@/views/monitoring/api'
import { getDefaultPagination, monitorAutoRefreshInterval } from '@/utils/constant'

interface IQuery {
  siteGroup?: string
  queryStr?: string
  monitorStatus?: string[]
  psArea?: string
}

@Component({ name: 'Monitor', components: { BaseTitle, BaseTable } })
export default class Monitor extends Vue {
  formData: IQuery = { monitorStatus: ['0', '1', '2'], siteGroup: '', psArea: '', queryStr: undefined }
  query: IQuery = {}
  monitoring: 1 | 0 = 0
  monitorStatusColor = { '0': 'rgba(51,51,51,0.6)', '1': '#333333', '2': '#F65252' }

  settingMonitorCols = settingMonitorCols

  current: Partial<IMonitorItem> = {}
  selected = { standard: [], param: [] }
  groups: string[] = []
  sections: string[] = []
  loading: boolean = false

  pagination: IPagination = getDefaultPagination()

  monitorItems: IMonitorItem[] = []

  statuses: IMonitorItemSummary[] = []

  timer = null

  rowStyle({ row }) {
    return { color: this.monitorStatusColor[String(row.status)] }
  }
  getTotal(code: string) {
    const total = (this.statuses.find((item) => item.code === code) || {}).total
    return Number(total) ? `: ${total}个` : ''
  }

  async onQuery(query: IQuery & IPagination = {}) {
    const { monitorStatus, ...queryCombine } = { ...this.pagination, ...this.query, ...query }
    this.loading = true
    try {
      this.statuses = await monitorItemsSummary({ ...queryCombine, monitorStatus: monitorStatus.join() })
      const {
        result: { records, size, total, current }
      } = await monitorItemsPage({ ...queryCombine, monitorStatus: monitorStatus.join() })
      this.pagination = { current, size, total }
      this.monitorItems = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  }

  onCurrentChange(row) {
    this.current = { ...row }
  }

  async getGroupsAndSections() {
    try {
      const { result } = await groups()
      this.groups = (result || []).filter((item) => !!item)
    } catch (error) {
      console.log(error)
    }
    try {
      const { result } = await sections()
      this.sections = (result || []).filter((item) => !!item)
    } catch (error) {
      console.log(error)
    }
  }

  startInterval() {
    if (this.timer) clearInterval(this.timer)
    this.onQuery()

    this.timer = setInterval(() => {
      this.onQuery()
    }, monitorAutoRefreshInterval)
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.startInterval()
  }

  onQueryChange() {
    this.query = { ...this.formData }
    this.onPageChange({ current: 1 })
  }

  // @Watch('monitoring', { immediate: true })
  // onMonitoringChange(val: 0 | 1) {
  //   if (val) this.onQueryChange()
  //   else if (this.timer) clearInterval(this.timer)
  // }

  mounted() {
    this.onQueryChange()
    this.getGroupsAndSections()
  }
}
</script>

<style lang="scss" scoped>
</style>
