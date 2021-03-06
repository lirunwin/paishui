<template>
  <tf-page>
    <template v-slot:action>
      <el-row type="flex" justify="space-between" style="margin-bottom: 15px">
        <div>
          <el-button type="primary" size="small" :loading="loading.standardSubmitting" @click="onStandardAdd">
            新增指标标准
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="!selected.standard.length"
            :loading="loading.standardDeleting"
            @click="onStandardDelete"
          >
            删除指标标准
          </el-button>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            :loading="loading.paramSubmitting"
            :disabled="!current.standard.id"
            @click="onParamAdd"
          >
            新增指标参数
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="!selected.param.length"
            :loading="loading.paramDeleting"
            @click="onParamDelete"
          >
            删除指标参数
          </el-button>
        </div>
      </el-row>
    </template>
    <el-row :gutter="15" type="flex" class="fit">
      <el-col :span="10">
        <tf-table
          :data="standards"
          :columns="settingStandardCols"
          :pagination="pagination.standard"
          highlight-current-row
          current-row-key="id"
          v-loading="loading.standard"
          @row-dblclick="onStandardRowDblClick"
          @selection-change="onStandardSelectionChange"
          @page-change="onStandardQuery"
          @current-change="onCurrentStandardChange"
        />
      </el-col>
      <el-col :span="14">
        <tf-table
          :data="params"
          :columns="settingStandardParamCols"
          :pagination="pagination.param"
          v-loading="loading.param"
          @row-dblclick="onParamRowDblClick"
          @selection-change="onParamSelectionChange"
          @page-change="onParamQuery"
        >
          <template v-slot:isPush="{ row }">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              :value="row.isPush"
              size="small"
              style="user-select: none"
              @change="($event) => onParamSubmit({ ...row, isPush: $event })"
            />
          </template>
        </tf-table>
      </el-col>
    </el-row>
    <StandardForm
      :visible.sync="visible.standard"
      :title="`${current.standard.id ? '修改' : '新增'}指标标准`"
      :data="current.standard"
      :types="types"
      :loading="loading.standardSubmitting"
      @submit="onStandardSubmit"
      @closed="onRecoverLastCurrentStandard"
    />
    <ParamForm
      :visible.sync="visible.param"
      :title="`${current.param.id ? '修改' : '新增'}指标参数`"
      :data="current.param"
      :typeId="current.standard.type"
      :levels="levels"
      :loading="loading.paramSubmitting"
      @submit="onParamSubmit"
    />
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { settingStandardCols, settingStandardParamCols } from '@/views/monitoring/utils'
import StandardForm from './StandardForm.vue'
import ParamForm from './ParamForm.vue'
import {
  addStandard,
  addStandardParam,
  deleteStandardBatch,
  deleteStandardParamBatch,
  getDictKeys,
  IDictionary,
  IPagination,
  IStandard,
  IStandardParam,
  IDeviceType,
  standardParamsPage,
  standardsPage,
  deviceTypesPage,
  updateStandard,
  updateStandardParam
} from '@/views/monitoring/api'
import { getDefaultPagination } from '@/utils/constant'

@Component({ name: 'MonitoringStandards', components: { StandardForm, ParamForm } })
export default class MonitoringStandards extends Vue {
  settingStandardCols = settingStandardCols
  get settingStandardParamCols() {
    return settingStandardParamCols(this.levels || [])
  }

  visible = { standard: false, param: false }

  loading = {
    standard: false,
    param: false,
    standardDeleting: false,
    paramDeleting: false,
    standardSubmitting: false,
    paramSubmitting: false
  }

  current: { standard: IStandard; param: IStandardParam; lastStandard: IStandard } = {
    standard: {},
    param: {},
    lastStandard: {}
  }

  selected: { standard: IStandard[]; param: IStandardParam[] } = { standard: [], param: [] }

  levels: IDictionary[] = []

  pagination: { standard: IPagination; param: IPagination } = {
    standard: getDefaultPagination(),
    param: getDefaultPagination()
  }

  standards: IStandard[] = []
  params: IStandardParam[] = []
  types: IDeviceType[] = []

  onStandardAdd() {
    this.current = { ...this.current, lastStandard: this.current.standard, standard: {} }
    this.visible.standard = true
  }

  onRecoverLastCurrentStandard() {
    this.current = { ...this.current, standard: this.current.lastStandard }
  }

  onParamAdd() {
    this.current = { ...this.current, param: {} }
    this.visible.param = true
  }

  onStandardRowDblClick(row) {
    this.current = { ...this.current, lastStandard: this.current.standard, standard: { ...row } }
    this.visible.standard = true
  }

  onParamRowDblClick(row) {
    this.current = { ...this.current, param: { ...row } }
    this.visible.param = true
  }

  onStandardSelectionChange(selections) {
    this.selected = { ...this.selected, standard: selections }
  }

  onParamSelectionChange(selections) {
    this.selected = { ...this.selected, param: selections }
  }

  async onStandardQuery(query = {}) {
    this.loading.standard = true
    try {
      const {
        result: { records, size, total, current }
      } = await standardsPage({ ...this.pagination.standard, ...query })
      this.pagination = { ...this.pagination, standard: { current, size, total } }
      this.standards = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.standard = false
  }

  async onParamQuery(query = {}) {
    const { id: indicateId } = this.current.standard
    if (!indicateId) return
    this.loading.param = true
    try {
      const {
        result: { records, size, total, current }
      } = await standardParamsPage({ indicateId, ...this.pagination.param, ...query })
      this.pagination = { ...this.pagination, param: { current, size, total } }
      this.params = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.param = false
  }

  async onStandardSubmit(data) {
    this.loading.standardSubmitting = true
    try {
      const { result } = await (data.id ? updateStandard(data) : addStandard(data))
      this.$message[result ? 'success' : 'error'](`${data.id ? '修改' : '新增'}指标标准${result ? '成功!' : '失败!'}`)
      if (result) {
        this.visible.standard = false
        this.onStandardQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.standardSubmitting = false
  }

  async onParamSubmit(data) {
    try {
      this.loading.paramSubmitting = true
      const { result } = await (data.id
        ? updateStandardParam(data)
        : addStandardParam({ ...data, indicateId: this.current.standard.id }))
      this.$message[result ? 'success' : 'error'](`${data.id ? '修改' : '新增'}参数${result ? '成功!' : '失败!'}`)
      if (result) {
        this.visible.param = false
        this.onParamQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.paramSubmitting = false
  }

  async onStandardDelete() {
    await this.$confirm(`是否确认删除这${this.selected.standard.length}项设备？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.standardDeleting = true
    try {
      const { result } = await deleteStandardBatch(this.selected.standard.map(({ id }) => id).join())
      this.$message[result ? 'success' : 'error'](`删除设备类型${result ? '成功!' : '失败!'}`)
      result && this.onStandardQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.standardDeleting = false
  }

  async onParamDelete() {
    await this.$confirm(`是否确认删除这${this.selected.param.length}项设备参数？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.paramDeleting = true
    try {
      const { result } = await deleteStandardParamBatch(this.selected.param.map(({ id }) => id).join())
      this.$message[result ? 'success' : 'error'](`删除设备参数${result ? '成功!' : '失败!'}`)
      result && this.onParamQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.paramDeleting = false
  }

  onCurrentStandardChange(row) {
    this.current = { ...this.current, standard: row ? { ...row } : {} }
    !row && (this.params = [])
    this.onParamQuery(getDefaultPagination())
  }

  /** 没有查询全部类型的接口, 暂用分页接口 */
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

  async getLevels() {
    try {
      const values = await getDictKeys()
      this.levels = (values as IDictionary[]) || []
    } catch (error) {
      console.log(error)
    }
  }

  mounted() {
    this.onStandardQuery()
    this.getAllTypes()
    this.getLevels()
  }
}
</script>
