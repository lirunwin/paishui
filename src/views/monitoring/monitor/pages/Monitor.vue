<template>
  <div class="monitor">
    <el-form ref="form" :model="query" size="small" label-width="5em" class="form">
      <el-form-item label="监测分组">
        <el-select v-model="formData.siteGroup" placeholder="请选择分组" size="small" @change="onQueryChange">
          <el-option label="全部" value="" />
          <el-option v-for="group of groups" :key="group" :label="group" :value="group" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="排水分区">
        <el-select v-model="formData.psArea" placeholder="请选择分组" size="small" @change="onQueryChange">
          <el-option label="全部" value="" />
          <el-option v-for="section of sections" :key="section" :label="section" :value="section" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="关键字">
        <el-input
          v-model="formData.queryStr"
          placeholder="支持搜索监测站点名称、地址"
          size="small"
          @keyup.enter.native="onQueryChange"
        />
      </el-form-item>
      <el-form-item label="监测状态" size="small" class="status">
        <el-checkbox-group v-model="formData.monitorStatus" size="small" @change="onQueryChange">
          <el-checkbox v-for="status of statuses" :key="status.code" :label="status.code">
            {{ status.label }} {{ getTotal(status.code) }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <BaseTitle>
      <el-row type="flex" justify="space-between">
        监测点列表（共{{ pagination.total }}个）
        <el-switch
          active-text="开启监测窗"
          v-model="monitoring"
          :active-value="1"
          :inactive-value="0"
          @change="onMonitoringChange"
        />
      </el-row>
    </BaseTitle>
    <BaseTable
      :columns="settingMonitorCols"
      :data="monitorItems"
      :cell-style="cellStyle"
      @current-change="onCurrentChange"
      @page-change="onPageChange"
      :pagination="{ ...pagination, pagerCount: 5, layout: 'total, sizes, prev, pager, next' }"
      style="padding: 0"
    >
      <template v-for="(item, index) of monitorItems" v-slot:[`action-${index}`]>
        <div :key="`index-${item.id}`">
          <el-button type="text" icon="el-icon-location" size="small" @click="() => onShowPopup(item)" />
          <el-button type="text" icon="el-icon-data-analysis" size="small" />
        </div>
      </template>
    </BaseTable>
    <CommonPopup
      v-for="key of popupIds"
      :key="key"
      :ref="`popup-${key}`"
      :popupPosition="popup[key].coordinate"
      :mapView="popup[key].map"
      :isSetCenter="popup[key].center"
      @close="() => onPopupClose(key)"
    >
      <InfoCard
        @distribute="onDistribute"
        :data="popup[key].data"
        :colors="levelColors"
        :monitoring="Boolean(monitoring)"
      />
    </CommonPopup>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingMonitorCols } from '@/views/monitoring/utils'
import CommonPopup from '@/components/CommonPopup/index.vue'
import InfoCard from '@/views/monitoring/monitor/components/InfoCard/index.vue'
import {
  getDictKeys,
  groups,
  IDictionary,
  IMonitorItem,
  IMonitorItemSummary,
  IPagination,
  monitorItemsPage,
  monitorItemsSummary,
  sections
} from '@/views/monitoring/api'
import {
  getDefaultPagination,
  monitorAutoRefreshInterval,
  monitorStandardLevelKey,
  monitorStatusColor
} from '@/utils/constant'
import { Map } from 'ol'

interface IQuery {
  siteGroup?: string
  queryStr?: string
  monitorStatus?: string[]
  psArea?: string
}

@Component({ name: 'Monitor', components: { BaseTitle, BaseTable, CommonPopup, InfoCard } })
export default class Monitor extends Vue {
  @Prop({ type: Object }) view!: Map
  formData: IQuery = { monitorStatus: ['0', '1', '2'], siteGroup: '', psArea: '', queryStr: undefined }
  query: IQuery = {}
  monitoring: 1 | 0 = 0

  popup: { [x: string]: { coordinate: number[]; map: Map; center: boolean; data: IMonitorItem } } = {}

  settingMonitorCols = settingMonitorCols

  current: Partial<IMonitorItem> = {}
  selected = { standard: [], param: [] }
  groups: string[] = []
  sections: string[] = []
  loading: boolean = false

  pagination: IPagination = getDefaultPagination()

  monitorItems: IMonitorItem[] = []

  statuses: IMonitorItemSummary[] = []

  levelColors: IDictionary[] = []

  timer = null

  fetchCount: number = 0

  get popupIds() {
    return Object.keys(this.popup)
  }

  cellStyle({ row, column }: { row: IMonitorItem; column: any }) {
    return column.property === 'name'
      ? { height: '40px', color: monitorStatusColor[row.isAlarm ? '2' : String(row.status)] }
      : { height: '40px' }
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
      this.fetchCount = 0
    } catch (error) {
      console.log(error)
      if (this.fetchCount > 3) {
        this.stopInterval()
      }
      this.fetchCount += 1
    }
    this.loading = false
  }

  onCurrentChange(row) {
    this.current = { ...row }
  }

  onPopupClose(id) {
    const { [id]: closedItem, ...rest } = this.popup
    this.popup = rest
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

  async getLevelColors() {
    try {
      const values = await getDictKeys(`${monitorStandardLevelKey.codeKey}_colors`)
      this.levelColors = (values as IDictionary[]) || []
    } catch (error) {
      console.log(error)
    }
  }

  stopInterval() {
    if (this.timer) clearInterval(this.timer)
  }

  startInterval() {
    this.stopInterval()
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

  closeAllPopups() {
    this.popupIds.forEach((id) => {
      const ref = (this.$refs[`popup-${id}`] as any) || {}
      const { closePopup } = Array.isArray(ref) ? ref[0] : ref
      closePopup && closePopup()
    })
  }

  showAllPopups() {
    this.monitorItems.forEach((item, index) => {
      this.onShowPopup(item, this.monitorItems.length === index + 1)
    })
  }

  onMonitoringChange(monitoring) {
    console.log(this.$refs)
    if (monitoring) {
      this.showAllPopups()
    } else {
      this.closeAllPopups()
    }
  }

  onShowPopup(row: IMonitorItem, center: boolean = true) {
    const { coordiateX, coordiateY, id } = row || {}
    this.popup = {
      ...this.popup,
      [String(id)]: {
        map: this.view,
        center,
        coordinate: [Number(coordiateX), Number(coordiateY)],
        data: { ...row }
      }
    }
  }

  onDistribute() {}

  mounted() {
    this.onQueryChange()
    this.getGroupsAndSections()
    this.getLevelColors()
  }

  beforeDestroy() {
    this.stopInterval()
    this.closeAllPopups()
  }

  activated() {
    console.log('activated')
  }
}
</script>

<style lang="scss" scoped>
.monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  >>> .el-form-item {
    margin-block: 10px;
  }
  .status >>> {
    .el-form-item__label {
      line-height: 20px;
    }
    .el-form-item__content {
      line-height: 20px;
      .el-checkbox {
        &-group {
          display: flex;
          justify-content: space-between;
        }
        &:not(:last-of-type) {
          margin-right: 10px;
        }
        &__label {
          padding-left: 5px;
        }
      }
    }
  }
}
</style>
