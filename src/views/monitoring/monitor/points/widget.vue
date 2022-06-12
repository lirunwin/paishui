<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm
        :selected="selected"
        @query="onQuery"
        @export="onExport"
        :groups="groups"
        :sections="sections"
        :levels="levels"
      />
    </div>
    <BaseTable
      :columns="monitorPointsCols"
      :data="points"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      :row-style="rowStyle"
      :row-key="'collectId'"
      @page-change="onPageChange"
    />

    <CommonPopup
      v-for="key of popupIds"
      :key="key"
      :ref="`popup-${key}`"
      :popupPosition="popups[key].coordinate"
      :mapView="popups[key].map"
      :isSetCenter="popups[key].center"
      @close="() => onPopupClose(key)"
    >
      <InfoCard @distribute="onDistribute" :data="popups[key].data" :colors="levelColors" />
    </CommonPopup>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { monitorPointsCols } from '@/views/monitoring/utils'
import QueryForm from './QueryForm.vue'
import CommonPopup from '@/components/CommonPopup/index.vue'
import InfoCard from '@/views/monitoring/monitor/components/InfoCard/index.vue'
import {
  pointsMonitoring,
  IPointMonitoringQuery,
  IPointMonitoringItem,
  IPagination,
  groups,
  sections,
  getDictKeys,
  IDictionary,
  IMonitorItem
} from '@/views/monitoring/api'
import {
  defaultValuesForMonitorStandardLevel,
  getDefaultPagination,
  monitorAutoRefreshInterval,
  monitorStandardLevelKey
} from '@/utils/constant'
import { Map } from 'ol'

@Component({ name: 'PointsMonitor', components: { BaseTable, QueryForm, CommonPopup, InfoCard } })
export default class PointsMonitor extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  @Prop({ type: Object }) view!: Map
  monitorPointsCols = monitorPointsCols

  query: Partial<IPointMonitoringQuery> = {}
  loading: boolean = false
  points: IPointMonitoringItem[] = []
  selected: IPointMonitoringItem[] = []
  pagination: IPagination = getDefaultPagination()
  fetchCount: number = 0

  groups: string[] = []
  sections: string[] = []
  levels: IDictionary[] = []
  levelColors: IDictionary[] = []
  popups: { [x: string]: { coordinate: number[]; map: Map; center: boolean; data: IMonitorItem } } = {}
  get popupIds() {
    return Object.keys(this.popups)
  }
  timer = null
  onExport(ids) {
    console.log(ids)
  }

  onDistribute() {}

  onPopupClose(id) {
    const { [id]: closedItem, ...rest } = this.popups
    this.popups = rest
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  onQuery(query) {
    this.query = { ...query }
    this.startInterval()
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.startInterval()
  }

  async doQuery(query = {}) {
    this.loading = true
    try {
      const {
        result: { records, size, total, current }
      } = await pointsMonitoring({ ...this.query, ...this.pagination, ...query })
      this.pagination = { current, size, total }
      this.points = records || []
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

  rowStyle({ row }) {
    const { level } = row
    const { color } = defaultValuesForMonitorStandardLevel.find((item) => item.codeValue === String(level)) || {}
    return { color }
  }

  onDblClick(row) {
    this.onShowPopup(row)
  }

  mounted() {
    this.startInterval()
  }

  stopInterval() {
    if (this.timer) clearInterval(this.timer)
  }

  startInterval() {
    this.stopInterval()
    this.doQuery()
    this.timer = setInterval(() => {
      this.doQuery()
    }, monitorAutoRefreshInterval)
  }

  beforeDestroy() {
    this.stopInterval()
    this.closeAllPopups()
  }

  onShowPopup(row: IMonitorItem, center: boolean = true) {
    const { coordiateX, coordiateY, id } = row || {}
    this.popups = {
      ...this.popups,
      [String(id)]: {
        map: this.view,
        center,
        coordinate: [Number(coordiateX), Number(coordiateY)],
        data: { ...row }
      }
    }
  }

  closeAllPopups() {
    this.popupIds.forEach((id) => {
      const ref = (this.$refs[`popup-${id}`] as any) || {}
      const { closePopup } = Array.isArray(ref) ? ref[0] : ref
      closePopup && closePopup()
    })
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

  async getLevelColors() {
    try {
      const values = await getDictKeys(`${monitorStandardLevelKey.codeKey}_colors`)
      this.levelColors = (values as IDictionary[]) || []
    } catch (error) {
      console.log(error)
    }
  }

  preparing() {
    this.getGroupsAndSections()
    this.getLevels()
    this.getLevelColors()
  }
  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.preparing()
    }
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
