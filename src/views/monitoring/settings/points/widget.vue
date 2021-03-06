<template>
  <tf-page>
    <template v-slot:action>
      <QueryForm
        :selected="selected"
        :types="types"
        :sections="sections"
        :groups="groups"
        :loading="loading"
        @query="onQuery"
        @add="onAdd"
        @update="onUpdate"
        @delete="onDel"
        @export="onExport"
        @setting="onSetting"
        @enable="onEnable"
        @dismount="onDismount"
      />
    </template>
    <tf-table
      :columns="cols"
      :data="points"
      :pagination="pagination"
      v-loading="loading.query"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
    >
      <template v-slot:isConfigured="{ row }">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          :value="Number(row.isConfigured)"
          size="small"
          style="user-select: none"
        />
      </template>
      <template v-slot:status="{ row }">
        <el-switch
          :active-value="1"
          :inactive-value="2"
          :value="Number(row.status)"
          size="small"
          style="user-select: none"
          @change="() => onEnableSwitch(row)"
        />
      </template>
    </tf-table>
    <PointForm
      :title="`${current.id ? '修改' : '新增'}监测点`"
      :visible.sync="visible.base"
      :types="types"
      :data="current"
      @submit="onSubmit"
    />
    <EnableForm
      title="监测点状态"
      :visible.sync="visible.enable"
      :loading="loading.enable"
      :selected="selected"
      :data="current"
      @submit="onEnableSubmit"
    />
    <DismountForm
      title="监测点拆除"
      :visible.sync="visible.dismount"
      :loading="loading.dismount"
      :selected="selected"
      @submit="onDismountSubmit"
    />
    <PointThresholdForm
      title="阈值配置"
      :selected="selected"
      :visible.sync="visible.setting"
      :loading="loading.setting"
      :levels="levels"
      @submit="onBind"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingPointCols as cols } from '@/views/monitoring/utils'
import QueryForm, { ILoading, IQuery } from './QueryForm.vue'
import PointForm from './PointForm.vue'
import PointThresholdForm, { IPointThresholdFormData } from './PointThresholdForm.vue'
import DismountForm from './DismountForm.vue'
import EnableForm from './EnableForm.vue'
import { getDefaultPagination } from '@/utils/constant'

import {
  deletePointBatch,
  IDeviceType,
  IPagination,
  IPoint,
  pointsPage,
  deviceTypesPage,
  pointBindDevice,
  groups,
  sections,
  IPointConnectDevice,
  IPointEnableParams,
  pointEnable,
  pointDismount,
  IPointDismountParams,
  bindStandardAndSettings,
  submitPointSettings,
  IPointParam,
  IPointThreshold,
  getDictKeys,
  IDictionary
} from '@/views/monitoring/api'

@Component({
  name: 'MonitoringPoints',
  components: { QueryForm, PointForm, PointThresholdForm, EnableForm, DismountForm }
})
export default class MonitoringPoints extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  cols = cols

  visible = { base: false, setting: false, enable: false, dismount: false }

  current: IPoint = {}

  selected: IPoint[] = []

  types: IDeviceType[] = []

  points: IPoint[] = []

  levels: IDictionary[] = []

  loading: ILoading = {
    query: false,
    add: false,
    update: false,
    delete: false,
    enable: false,
    dismount: false,
    export: false,
    setting: false
  }

  pagination: IPagination = getDefaultPagination()

  query: IQuery = {}

  groups: string[] = []
  sections: string[] = []

  onQuery(query) {
    this.query = { ...query }
    this.doQuery({ current: 1 })
  }

  async doQuery(query = {}) {
    this.loading.query = true
    try {
      const {
        result: { records, size, total, current }
      } = await pointsPage({ ...this.pagination, ...this.query, ...query })
      this.pagination = { current, size, total }
      this.points = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.query = false
  }

  onPageChange(pagination) {
    this.pagination = { ...this.pagination, ...pagination }
    this.doQuery()
  }

  async onSubmit(data: IPointConnectDevice, bind: boolean = true) {
    this.loading[data.id ? 'update' : 'add'] = true
    console.log(JSON.stringify(data, null, 2))
    try {
      const { result } = await pointBindDevice(data)
      this.$message[result ? 'success' : 'error'](
        `${data.id ? '修改' : '新增'}监测点${bind ? '并绑定设备' : ''}${result ? '成功!' : '失败!'}`
      )
      if (result) {
        this.visible.base = false
        this.doQuery()
        this.preparing()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading[data.id ? 'update' : 'add'] = false
  }

  async onBind({ threshold, param }: { param: IPointParam[]; threshold: IPointThreshold[] }) {
    this.loading.setting = true
    try {
      const { result: baseSettings } = await bindStandardAndSettings(param)
      this.$message[baseSettings ? 'success' : 'error'](`监测点基础配置${baseSettings ? '成功!' : '失败!'}`)
      const { result } = await submitPointSettings(
        threshold.map<IPointThreshold>(({ id, paraId, ...rest }) => {
          const { id: newParaId } =
            baseSettings.find((item) => item.indicateParaId === paraId || item.id === paraId) || {}
          return { ...rest, id, paraId: newParaId || paraId }
        })
      )

      this.$message[result ? 'success' : 'error'](`阈值配置${result ? '成功!' : '失败!'}`)

      if (baseSettings && result) {
        this.visible.setting = false
        this.doQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.setting = false
  }

  onAdd() {
    this.current = {}
    this.visible.base = true
  }

  onUpdate(row) {
    this.current = { ...row }
    this.visible.base = true
  }

  async onDel(ids) {
    await this.$confirm(`是否确认删除这${this.selected.length}项监测点？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.delete = true
    try {
      const { result } = await deletePointBatch(ids)
      this.$message[result ? 'success' : 'error'](`删除监测点${result ? '成功!' : '失败!'}`)
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.delete = false
  }

  async onEnableSubmit(data: IPointEnableParams) {
    this.loading.enable = true
    try {
      const { result } = await pointEnable(data)
      this.$message[result ? 'success' : 'error'](
        `监测点${{ start: '开启', stop: '关闭' }[data.type]}${result ? '成功!' : '失败!'}`
      )
      this.visible.enable = false
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.enable = false
  }

  async onDismountSubmit(data: IPointDismountParams) {
    this.loading.dismount = true
    try {
      const { result } = await pointDismount(data)
      this.$message[result ? 'success' : 'error'](`监测点拆卸${result ? '成功!' : '失败!'}`)
      this.visible.dismount = false
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.dismount = false
  }

  onExport(ids) {
    console.log(ids)
  }

  onEnable() {
    this.current = {}
    this.visible.enable = true
  }

  onEnableSwitch(row) {
    this.current = { ...row }
    this.visible.enable = true
  }

  onDismount() {
    this.visible.dismount = true
  }

  onSetting() {
    this.visible.setting = true
  }

  onDblClick(row) {
    this.current = { ...row }
    this.visible.base = true
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }

  async getAllTypes() {
    try {
      const {
        result: { records }
      } = await deviceTypesPage({ current: 1, size: 999999 })
      this.types = records || []
    } catch (error) {
      console.log(error)
    }
  }

  async getGroupsAndSections() {
    try {
      const { result } = await groups()
      this.groups = result || []
    } catch (error) {
      console.log(error)
    }
    try {
      const { result } = await sections()
      this.sections = result || []
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

  preparing() {
    this.getLevels()
    this.getAllTypes()
    this.getGroupsAndSections()
  }

  mounted() {
    this.preparing()
    this.doQuery()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.preparing()
    }
  }
}
</script>
