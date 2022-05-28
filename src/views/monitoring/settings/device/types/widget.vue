<template>
  <div class="page-container">
    <div class="actions">
      <div>
        <el-button type="primary" size="small" :loading="loading.typeSubmitting" @click="onTypeAdd">
          新增设备类型
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="!selected.type.length"
          :loading="loading.typeDeleting"
          @click="onTypeDelete"
        >
          删除设备类型
        </el-button>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          :loading="loading.paramSubmitting"
          :disabled="!current.type.id"
          @click="onParamAdd"
          >新增参数</el-button
        >
        <el-button
          type="primary"
          size="small"
          :disabled="!selected.param.length"
          :loading="loading.paramDeleting"
          @click="onParamDelete"
        >
          删除参数
        </el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <el-col :span="12">
        <BaseTable
          :data="types"
          :columns="settingDeviceTypeCols"
          :pagination="pagination.type"
          highlight-current-row
          current-row-key="id"
          v-loading="loading.type"
          @row-dblclick="onTypeRowDblClick"
          @selection-change="onTypeSelectionChange"
          @page-change="onTypeQuery"
          @current-change="onCurrentTypeChange"
        />
      </el-col>
      <el-col :span="12">
        <BaseTable
          :data="params"
          :columns="settingDeviceTypeParamCols"
          :pagination="pagination.param"
          v-loading="loading.param"
          @row-dblclick="onParamRowDblClick"
          @selection-change="onParamSelectionChange"
          @page-change="onParamQuery"
        >
          <template v-for="(_, index) of params" v-slot:[`isDisplay-${index}`]="{ row }">
            <el-switch
              :key="`${index}-${row.id}`"
              :active-value="true"
              :inactive-value="false"
              :value="row.isDisplay"
              size="small"
              style="user-select:none"
              @change="($event) => onParamSubmit({ ...row, isDisplay: $event })"
            />
          </template>
        </BaseTable>
      </el-col>
    </el-row>
    <TypeForm
      :visible.sync="visible.type"
      :title="`${current.type.id ? '修改' : '新增'}设备类型`"
      :data="current.type"
      :loading="loading.typeSubmitting"
      @submit="onTypeSubmit"
    />
    <ParamForm
      :visible.sync="visible.param"
      :title="`${current.param.id ? '修改' : '新增'}设备参数`"
      :data="current.param"
      :loading="loading.paramSubmitting"
      @submit="onParamSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingDeviceTypeCols, settingDeviceTypeParamCols } from '@/views/monitoring/utils'
import TypeForm from './TypeForm.vue'
import ParamForm from './ParamForm.vue'
import {
  typesPage,
  IPagination,
  typeParamsPage,
  addType,
  updateType,
  deleteTypeBatch,
  updateTypeParam,
  addTypeParam,
  deleteTypeParamBatch,
  IType,
  ITypeParam
} from '@/views/monitoring/api'

const getDefaultPagination = () => ({ current: 1, size: 30 })

@Component({ name: 'DeviceTypes', components: { BaseTable, TypeForm, ParamForm } })
export default class DeviceTypes extends Vue {
  settingDeviceTypeCols = settingDeviceTypeCols
  settingDeviceTypeParamCols = settingDeviceTypeParamCols

  visible = { type: false, param: false }
  loading = {
    type: false,
    param: false,
    typeDeleting: false,
    paramDeleting: false,
    typeSubmitting: false,
    paramSubmitting: false
  }

  current: { type: IType; param: ITypeParam } = { type: {}, param: {} }

  selected: { type: IType[]; param: ITypeParam[] } = { type: [], param: [] }

  pagination: { type: IPagination; param: IPagination } = {
    type: getDefaultPagination(),
    param: getDefaultPagination()
  }
  types: IType[] = []
  params: ITypeParam[] = []

  onTypeAdd() {
    this.current = { ...this.current, type: {} }
    this.visible.type = true
  }

  onParamAdd() {
    this.current = { ...this.current, param: {} }
    this.visible.param = true
  }

  onTypeRowDblClick() {
    this.visible.type = true
  }

  onParamRowDblClick(row) {
    this.current = { ...this.current, param: { ...row } }
    this.visible.param = true
  }

  onTypeSelectionChange(selections) {
    this.selected = { ...this.selected, type: selections }
  }

  onParamSelectionChange(selections) {
    this.selected = { ...this.selected, param: selections }
  }

  async onTypeQuery(query = {}) {
    this.loading.type = true
    try {
      const {
        result: { records, size, total, current }
      } = await typesPage({ ...this.pagination.type, ...query })
      this.pagination = { ...this.pagination, type: { current, size, total } }
      this.types = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.type = false
  }

  async onParamQuery(query = {}) {
    const { id: typeId } = this.current.type
    if (!typeId) return
    this.loading.param = true
    try {
      const {
        result: { records, size, total, current }
      } = await typeParamsPage({ typeId, ...this.pagination.param, ...query })
      this.pagination = { ...this.pagination, param: { current, size, total } }
      this.params = records || []
    } catch (error) {
      console.log(error)
    }
    this.loading.param = false
  }

  async onTypeSubmit(data) {
    this.loading.typeSubmitting = true
    try {
      const { result } = await (data.id ? updateType(data) : addType(data))
      this.$message[result ? 'success' : 'error'](`${data.id ? '修改' : '新增'}设备类型${result ? '成功!' : '失败!'}`)
      if (result) {
        this.visible.type = false
        this.onTypeQuery()
      }
    } catch (error) {
      console.log(error)
    }
    this.loading.typeSubmitting = false
  }

  async onParamSubmit(data) {
    try {
      this.loading.paramSubmitting = true
      const { result } = await (data.id
        ? updateTypeParam(data)
        : addTypeParam({ ...data, typeId: this.current.type.id }))
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

  async onTypeDelete() {
    await this.$confirm('是否确认删除设备？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.typeDeleting = true
    try {
      const { result } = await deleteTypeBatch(this.selected.type.map(({ id }) => id).join())
      this.$message[result ? 'success' : 'error'](`删除设备类型${result ? '成功!' : '失败!'}`)
      result && this.onTypeQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.typeDeleting = false
  }

  async onParamDelete() {
    await this.$confirm('是否确认删除设备参数？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    this.loading.paramDeleting = true
    try {
      const { result } = await deleteTypeParamBatch(this.selected.param.map(({ id }) => id).join())
      this.$message[result ? 'success' : 'error'](`删除设备参数${result ? '成功!' : '失败!'}`)
      result && this.onParamQuery()
    } catch (error) {
      console.log(error)
    }
    this.loading.paramDeleting = false
  }

  onCurrentTypeChange(row) {
    this.current = { ...this.current, type: row ? { ...row } : {} }
    !row && (this.params = [])
    this.onParamQuery(getDefaultPagination())
  }

  mounted() {
    this.onTypeQuery()
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
