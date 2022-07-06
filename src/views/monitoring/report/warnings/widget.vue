<template>
  <tf-page :isActive="isActive">
    <template v-slot:action>
      <QueryForm
        :selected="selected"
        @query="onQuery"
        @export="onExport"
        :loading="loading"
        :groups="groups"
        :setions="sections"
        :levels="levels"
        :paramNames="paramNames"
      />
    </template>
    <tf-table
      :columns="monitorWarningReportCols"
      :data="reports"
      :selected="selected"
      @selection-change="onSelectionChange"
      :pagination="pagination"
      @page-change="onPageChange"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { monitorWarningReportCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'
import { getDefaultPagination } from '@/utils/constant'
import {
  IPagination,
  IWarningReport,
  warningReports,
  IDictionary,
  groups,
  sections,
  getDictKeys,
  deviceTypeParamsPage
} from '@/views/monitoring/api'

type IQuery = Record<
  'queryLike' | 'siteGroup' | 'beginTime' | 'endTime' | 'indicateNames' | 'levelName' | 'warnType',
  string
>

@Component({ name: 'ReportWarnings', components: { QueryForm } })
export default class ReportWarnings extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  monitorWarningReportCols = monitorWarningReportCols

  selected = []

  loading = { query: false, export: false }

  pagination: IPagination = getDefaultPagination()

  query: Partial<IQuery> = {}

  reports: IWarningReport[] = []

  groups: string[] = []
  sections: string[] = []
  levels: IDictionary[] = []
  paramNames: string[] = []

  onQuery(query) {
    this.query = { ...query }
    this.doQuery({ current: 1 })
  }

  async doQuery(query = {}) {
    this.loading.query = true
    try {
      const {
        result: { records, size, total, current }
      } = await warningReports({ ...this.pagination, ...this.query, ...query })
      this.pagination = { current, size, total }
      this.reports = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.doQuery()
  }

  onExport(ids) {
    console.log(ids)
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  mounted() {
    this.preparing()
    this.doQuery()
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

  async getLevels() {
    try {
      const values = await getDictKeys()
      this.levels = (values as IDictionary[]) || []
    } catch (error) {
      console.log(error)
    }
  }

  async getAllParamNames() {
    try {
      const {
        result: { records }
      } = await deviceTypeParamsPage({ current: 1, size: 9999999 })
      this.paramNames = [...new Set(records.map((item) => item.name))]
    } catch (error) {
      console.log(error)
    }
  }

  preparing() {
    this.getGroupsAndSections()
    this.getLevels()
    this.getAllParamNames()
  }
}
</script>
