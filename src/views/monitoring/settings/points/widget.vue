<template>
  <div class="page-container">
    <div class="actions">
      <QueryForm
        :selected="selected"
        :types="types"
        :sections="sections"
        :groups="groups"
        @query="onQuery"
        @add="onAdd"
        @update="onUpdate"
        @del="onDel"
        @export="onExport"
        @setting="onSetting"
        @enable="onEnable"
      />
    </div>
    <BaseTable
      :columns="cols"
      :data="points"
      :pagination="pagination"
      v-loading="loading.query"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
      @page-change="onPageChange"
    >
      <template v-for="(_, index) of points" v-slot:[`status-${index}`]="{ row }">
        <el-switch
          :key="`${index}-${row.id}`"
          active-value="1"
          inactive-value="2"
          :value="row.status"
          size="small"
          style="user-select:none"
          @change="($event) => onSubmit({ ...row, status: $event }, false)"
        />
      </template>
    </BaseTable>
    <PointForm
      :visible.sync="visible.base"
      :title="`${current.id ? '修改' : '新增'}监测点`"
      :types="types"
      :data="current"
      @submit="onSubmit"
    />
    <PointThresholdForm :visible.sync="visible.setting" title="阈值设置" @submit="onSettingSubmit" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingPointCols as cols } from '@/views/monitoring/utils'
import QueryForm, { ILoading, IQuery } from './QueryForm.vue'
import PointForm from './PointForm.vue'
import PointThresholdForm from './PointThresholdForm.vue'
import {
  deletePointBatch,
  IType,
  IPagination,
  IPoint,
  pointsPage,
  typesPage,
  updatePoint,
  addPoint,
  addPointSetting,
  IPointSetting,
  groups,
  sections,
  IPointConnectDevice
} from '@/views/monitoring/api'
const getDefaultPagination = () => ({ current: 1, size: 30 })

@Component({ name: 'MonitoringPoints', components: { BaseTable, QueryForm, PointForm, PointThresholdForm } })
export default class MonitoringPoints extends Vue {
  cols = cols

  visible = { base: false, setting: false }

  current: IPoint = {}

  selected: IPoint[] = []

  types: IType[] = []

  points: IPoint[] = []

  loading: ILoading = {}

  pagination: IPagination = getDefaultPagination()

  query: IQuery = {}

  groups: string[] = []
  sections: string[] = []

  onQuery(query) {
    this.query = { ...query }
    this.doQuery(getDefaultPagination())
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
    try {
      const { result } = await (bind ? addPointSetting(data) : data.id ? updatePoint(data) : addPoint(data))
      this.$message[result ? 'success' : 'error'](
        `${data.id ? '修改' : '新增'}监测点${bind ? '并绑定' : ''}${result ? '成功!' : '失败!'}`
      )
      if (result) {
        this.visible.base = false
        this.doQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading[data.id ? 'update' : 'add'] = false
  }

  async onSettingSubmit(data: IPointSetting) {
    this.loading.setting = true
    try {
      const { result } = await addPointSetting(data)
      this.$message[result ? 'success' : 'error'](`阈值配置${result ? '成功!' : '失败!'}`)
      if (result) {
        this.visible.setting = false
        this.doQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.setting = false
  }

  onAdd() {
    this.visible.base = true
    this.current = {}
  }

  onUpdate(row) {
    this.current = { ...row }
    this.visible.base = true
  }

  async onDel(ids) {
    await this.$confirm('是否确认删除监测点？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.del = true
    try {
      const { result } = await deletePointBatch(ids)
      this.$message[result ? 'success' : 'error'](`删除监测点${result ? '成功!' : '失败!'}`)
      result && this.doQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.del = false
  }

  onExport(ids) {
    console.log(ids)
  }

  onEnable(ids) {
    console.log(ids)
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

  /** 没有查询全部类型的接口, 暂用分页接口 */
  async getAllTypes() {
    try {
      const {
        result: { records }
      } = await typesPage({ current: 1, size: 999999 })
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

  mounted() {
    this.doQuery()
    this.getAllTypes()
    this.getGroupsAndSections()
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
