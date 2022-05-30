<template>
  <div class="page-container">
    <div class="actions">
      <div>
        <el-button type="primary" size="small" :loading="loading.standardSubmitting" @click="onStandardAdd"
          >新增指标标准</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!selected.standard.length"
          :loading="loading.standardDeleting"
          @click="onStandardDelete"
          >删除设备类型</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          :loading="loading.paramSubmitting"
          :disabled="!current.standard.id"
          @click="onParamAdd"
          >新增指标参数</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!selected.param.length"
          :loading="loading.paramDeleting"
          @click="onParamDelete"
          >删除指标参数</el-button
        >
      </div>
    </div>
    <el-row :gutter="15">
      <el-col :span="10">
        <BaseTable
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
        <BaseTable
          :data="params"
          :columns="settingStandardParamCols"
          :pagination="pagination.param"
          v-loading="loading.param"
          @row-dblclick="onParamRowDblClick"
          @selection-change="onParamSelectionChange"
          @page-change="onParamQuery"
        >
          <template v-for="(_, index) of params" v-slot:[`isPush-${index}`]="{ row }">
            <el-switch
              :key="`${index}-${row.id}`"
              :active-value="true"
              :inactive-value="false"
              :value="row.isPush"
              size="small"
              style="user-select:none"
              @change="($event) => onParamSubmit({ ...row, isPush: $event })"
            />
          </template>
        </BaseTable>
      </el-col>
    </el-row>
    <StandardForm
      :visible.sync="visible.standard"
      :title="`${current.standard.id ? '修改' : '新增'}指标标准`"
      :data="current.standard"
      :types="types"
      :loading="loading.standardSubmitting"
      @submit="onStandardSubmit"
    />
    <ParamForm
      :visible.sync="visible.param"
      :title="`${current.param.id ? '修改' : '新增'}指标参数`"
      :data="current.param"
      :loading="loading.paramSubmitting"
      @submit="onParamSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingStandardCols, settingStandardParamCols } from '@/views/monitoring/utils'
import StandardForm from './StandardForm.vue'
import ParamForm from './ParamForm.vue'
import {
  addStandard,
  addStandardParam,
  deleteStandardBatch,
  deleteStandardParamBatch,
  IPagination,
  IStandard,
  IStandardParam,
  IType,
  standardParamsPage,
  standardsPage,
  typesPage,
  updateStandard,
  updateStandardParam
} from '../../api'
const getDefaultPagination = () => ({ current: 1, size: 30 })

@Component({ name: 'MonitoringStandards', components: { BaseTable, StandardForm, ParamForm } })
export default class MonitoringStandards extends Vue {
  settingStandardCols = settingStandardCols
  settingStandardParamCols = settingStandardParamCols

  visible = { standard: false, param: false }

  loading = {
    standard: false,
    param: false,
    standardDeleting: false,
    paramDeleting: false,
    standardSubmitting: false,
    paramSubmitting: false
  }

  current: { standard: IStandard; param: IStandardParam } = { standard: {}, param: {} }

  selected: { standard: IStandard[]; param: IStandardParam[] } = { standard: [], param: [] }

  pagination: { standard: IPagination; param: IPagination } = {
    standard: getDefaultPagination(),
    param: getDefaultPagination()
  }

  standards: IStandard[] = []
  params: IStandardParam[] = []
  types: IType[] = []

  onStandardAdd() {
    this.visible.standard = true
    this.current = { ...this.current, standard: {} }
  }

  onParamAdd() {
    this.visible.param = true
    this.current = { ...this.current, param: {} }
  }

  onStandardRowDblClick(row) {
    this.current = { ...this.current, standard: { ...row } }
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
    await this.$confirm('是否确认删除设备？', '提示', {
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
    await this.$confirm('是否确认删除设备参数？', '提示', {
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
      } = await typesPage({ current: 1, size: 9999 })
      this.types = records || []
    } catch (error) {
      console.log(error)
    }
  }

  mounted() {
    this.onStandardQuery()
    this.getAllTypes()
  }
}
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22px;
  margin-bottom: 15px;
}
</style>
