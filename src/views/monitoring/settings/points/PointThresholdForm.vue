<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="listeners"
    @open="onOpen"
    @closed="onClosed"
    @submit="onSubmit"
    :disabled="!formData.param.length || fetchingStandardParam"
    :loading="fetchingStandardParam"
    width="80vw"
    top="7vh"
  >
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" :rules="rules">
      <BaseTitle>监测体系基本设置</BaseTitle>
      <el-form-item prop="indicateId" label="监测体系">
        <el-select
          v-model="formData.indicateId"
          placeholder="请选择监测体系"
          size="small"
          filterable
          clearable
          style="width:200px"
          :disabled="(selected[0]||{}).isConfigured"
          @change="onStandardChange"
        >
          <el-option v-for="item in standards" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <BaseTable :columns="settingPointBasisCols" :data="formData.param" v-loading="fetchingStandardParam" border>
        <template v-for="(item, index) of formData.param" v-slot:[`sort-${index}`]>
          <el-form-item
            :key="`sort-${item.id}`"
            :prop="`param[${index}].sort`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input-number
              v-model="formData.param[index].sort"
              size="small"
              :controls="false"
              :min="0"
              :precision="0"
              style="width:100%"
            />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`siteCode-${index}`]>
          <el-form-item
            :key="`siteCode-${item.id}`"
            :prop="`param[${index}].siteCode`"
            label-width="0"
            style="margin-bottom: 0"
            :rules="getRequiredRule(item.name)"
          >
            <el-input v-model="formData.param[index].siteCode" size="small" :max="50" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`isDisplay-${index}`]>
          <el-form-item
            :key="`isDisplay-${item.id}`"
            :prop="`param[${index}].isDisplay`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.param[index].isDisplay" size="small" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`note-${index}`]>
          <el-form-item
            :key="`note-${item.id}`"
            :prop="`param[${index}].note`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.param[index].note" size="small" :max="255" />
          </el-form-item>
        </template>
      </BaseTable>

      <BaseTitle style="margin-top: 20px">
        监测参数阈值设置
        <el-button
          type="primary"
          size="small"
          style="margin: -10px 0 -10px 1em"
          @click="onParamAdd"
          :disabled="
            !formData.param ||
              !formData.param.length ||
              formData.threshold.length >= formData.param.length * levels.length
          "
          >添加</el-button
        >
      </BaseTitle>
      <BaseTable :columns="settingPointParamCols" :data="formData.threshold" v-loading="fetchingStandardParam" border>
        <template v-for="(item, index) of formData.threshold" v-slot:[`name-${index}`]>
          <template v-if="String(item.id).startsWith('__new__')">
            <el-form-item
              :key="`name-${item.id}`"
              :prop="`threshold[${index}].id`"
              label-width="0"
              style="margin-bottom: 0"
              :rules="getRequiredRule(item.name, true, true)"
            >
              <el-select v-model="formData.threshold[index].paraId" placeholder="请选择参数名称">
                <el-option
                  v-for="param of standardParams"
                  :label="
                    param.deviceTypeParaVo
                      ? `${param.deviceTypeParaVo.name} | ${param.deviceTypeParaVo.code}`
                      : param.deviceTypeParaId
                  "
                  :value="param.id"
                  :key="param.id"
                  :disabled="formData.threshold.filter((i) => i.paraId === param.id).length === levels.length"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            {{ item.name }}
          </template>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`level-${index}`]>
          <el-form-item
            :key="`level-${item.id}`"
            :prop="`threshold[${index}].level`"
            label-width="0"
            style="margin-bottom: 0"
            :rules="getRequiredRule(item.name, true, true)"
          >
            <el-select v-model="formData.threshold[index].level" placeholder="请选择监测值判定" clearable>
              <el-option
                v-for="level of levels"
                :label="level.notes"
                :value="level.id"
                :key="level.id"
                :disabled="formData.threshold.some((i) => i.paraId === item.paraId && i.level === level.id)"
              />
            </el-select>
          </el-form-item>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`threshold-${index}`]>
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`threshold-${item.id}`">
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].lower`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name)"
              >
                <el-input-number
                  :controls="false"
                  :min="0"
                  :max="formData.threshold[index].upper - 0.01"
                  v-model="formData.threshold[index].lower"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].upper`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name)"
              >
                <el-input-number
                  v-model="formData.threshold[index].upper"
                  :controls="false"
                  :disabled="!formData.threshold[index].lower"
                  :min="formData.threshold[index].lower + 0.01"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`allowance-${index}`]>
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`allowance-${item.id}`">
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].lowerTolerance`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name, !formData.threshold[index].upperTolerance)"
              >
                <el-input-number
                  v-model="formData.threshold[index].lowerTolerance"
                  :controls="false"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onEarlyWarningChange(index, 'upperTolerance')"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].upperTolerance`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name, !formData.threshold[index].lowerTolerance)"
              >
                <el-input-number
                  v-model="formData.threshold[index].upperTolerance"
                  :controls="false"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onEarlyWarningChange(index, 'lowerTolerance')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`time-${index}`]>
          <el-time-picker
            v-model="formData.threshold[index].timeRange"
            is-range
            range-separator="~"
            :key="`time-${item.id}`"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
            size="small"
            prefix-icon=""
            arrow-control
            :clearable="false"
          />
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`isPush-${index}`]>
          <el-form-item
            :key="`isPush-${item.id}`"
            :prop="`threshold[${index}].isPush`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.threshold[index].isPush" size="small" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.threshold" v-slot:[`action-${index}`]>
          <el-button :key="`action-${item.id}`" type="text" @click="() => onParamDel(item)" size="small"
            >删除</el-button
          >
        </template>
      </BaseTable>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingPointBasisCols, settingPointParamCols } from '@/views/monitoring/utils'
import { ElForm } from 'element-ui/types/form'
import moment from 'moment'
const format = 'HH:mm'

import {
  getDictKeys,
  IDictionary,
  IPoint,
  IPointConnectDevice,
  IPointParam,
  IPointThreshold,
  isConfigured,
  IStandard,
  IStandardParam,
  pointsPage,
  standardParamsPage,
  standardsPage
} from '@/views/monitoring/api'
interface IThreshold extends IPointThreshold {
  timeRange?: (string | Date)[]
  name?: string
}

export interface IPointThresholdFormData {
  threshold?: IThreshold[]
  param?: (IPointParam & { unit?: string })[]
  indicateId?: string
}

const getDefaultThresholdValue = (
  id: string | number = '',
  value: { name?: string; paraId?: string } = { paraId: '' }
): IThreshold =>
  Object.defineProperty(
    {
      //  name
      // paraId   // 监测指标参数id 关联 设备基础配置信息id
      ...value,
      level: '',
      lower: undefined, // threshold
      upper: undefined, // threshold
      lowerTolerance: undefined, // allowance
      upperTolerance: undefined, // allowance
      start: undefined, // time
      end: undefined, // time
      specialVal: undefined,
      isPush: 1,
      timeRange: [moment('00:00', format).toDate(), moment('23:59', format).toDate()]
    },
    'id',
    { enumerable: false, configurable: true, value: id }
  )
const getDefaultFormData = ():IPointThresholdFormData => ({ threshold: [], param: [],indicateId: '' })

@Component({ name: 'PointForm', components: { BaseDialog, BaseTitle, BaseTable } })
export default class PointForm extends Vue {
  @Prop({ type: Array, default: () => [] }) selected!: IPointConnectDevice[]
  $refs!: { form: ElForm }
  $listeners!: { open?: Function; submit?: Function; closed: Function }
  dialogVisible = false
  dialogImageUrl = ''
  formData: IPointThresholdFormData = getDefaultFormData()
  settingPointBasisCols = settingPointBasisCols
  settingPointParamCols = settingPointParamCols

  rules = {
    indicateId: [{ required: true, message: '请选择体系！', trigger: 'blur' }],
    pointId: [{ required: true, message: '请选择检测点', trigger: 'blur' }]
  }

  fetchingStandardParam: boolean = false

  standards: IStandard[] = []

  standardParams: IStandardParam[] = []

  points: IPoint[] = []

  levels: IDictionary[] = []

  deviceId: string | number = ''

  get listeners() {
    const { submit, open, closed, ...rest } = this.$listeners
    return rest
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        const { indicateId, threshold, param } = this.formData
        console.log(JSON.stringify(this.formData, null, 2))
        this.$emit('submit', {
          indicateId,
          param: param.map<IPointParam>(({ id, unit, ...rest }) => {
            return {
              ...rest,
              id: String(id).startsWith('__new__') || String(id).startsWith('__temp__') ? undefined : id
            }
          }),
          threshold: threshold.map<IPointThreshold>(({ name, id, timeRange, ...rest }) => {
            const [start, end] = timeRange || []
            return {
              ...rest,
              start: moment(start, format).format(format),
              end: moment(end, format).format(format),
              id: String(id).startsWith('__new__') || String(id).startsWith('__temp__') ? undefined : id
            }
          })
        })
      }
    })
  }

  getRequiredRule = (message: string, required: boolean = true, isSelect: boolean = false) => [
    { required, message: `请${isSelect ? '选择' : '输入'}${message}` }
  ]

  async onStandardQuery() {
    const {
      bindDevice: { deviceVo, deviceId }
    } = this.selected[0] || {}
    this.deviceId = deviceId
    const { type } = deviceVo || {}
    try {
      const {
        result: { records }
      } = await standardsPage({ current: 1, size: 999999, type })
      this.standards = records || []
    } catch (error) {
      console.log(error)
    }
  }

  async onStandardChange(indicateId) {
    this.fetchingStandardParam = true
    try {
      const {
        result: { records }
      } = await standardParamsPage({ indicateId, current: 1, size: 999999 })
      this.standardParams = records
      this.formData = {
        ...this.formData,
        // 缺deviceId 设备id 但有deviceTypeParaId， indicateId 监测体系id
        param: records.map<IPointParam>(({ id, upper, lower, deviceTypeParaVo }, index) => {
          const { name, code, codeAbridge, unit } = deviceTypeParaVo || {}
          return {
            name,
            code,
            codeAbridge,
            deviceId: this.deviceId,
            indicateId,
            indicateParaId: id,
            unit,
            id: '__temp__' + id,
            lrangeUp: upper, // 体系参数叫upper 存的时候叫  lrangeUp
            lrangeLow: lower, // 体系参数叫lower 存的时候叫  lrangeLow
            sort: index + 1,
            siteCode: '', //  后台是 number
            isDisplay: 1
          }
        }),
        threshold: records.map<IPointThreshold>(({ id, deviceTypeParaVo }, index) => {
          const { name, code } = deviceTypeParaVo || {}
          return getDefaultThresholdValue(`__temp__${index}`, { name: `${name} | ${code}`, paraId: id })
        })
      }
    } catch (error) {
      console.log(error)
    }
    this.fetchingStandardParam = false
  }

  /** 获取体系指标判定 */
  async getLevels() {
    try {
      const values = await getDictKeys()
      this.levels = (values as IDictionary[]) || []
    } catch (error) {
      console.log(error)
    }
  }

  onParamAdd() {
    this.formData = {
      ...this.formData,
      threshold: [...this.formData.threshold, getDefaultThresholdValue('__new__' + new Date())]
    }
  }

  onParamDel({ id }: IThreshold) {
    this.formData = {
      ...this.formData,
      threshold: this.formData.threshold.filter((item) => item.id !== id)
    }
  }

  onEarlyWarningChange(index: number, key: string) {
    this.formData.threshold[index][key] = undefined
    setTimeout(() => {
      this.$refs.form.validateField(`threshold[${index}].${key}`)
    }, 100)
  }

  async getSettings() {
    const {id, isConfigured} = this.selected[0] || {}
    if(!isConfigured) return
    // const { result } = await isConfigured(id as any)
    // const { indicateId, param, threshold  } = result as IPointThresholdFormData || {}
    // this.formData = {
    //   indicateId,
    //   param: param.map(({indicateParaVo, ...rest})=> {
    //     return  {...rest, }
    //   }),
    //   threshold: threshold.map(() => {
    //     return {}
    //   })
    // }
  }

  onOpen() {
    this.getSettings()
    this.onStandardQuery()
    this.getLevels()
    this.$emit('open')
  }

  onClosed() {
    this.standardParams = []
    this.formData = getDefaultFormData()
    this.$emit('closed')
  }
}
</script>

<style lang="scss" scoped>
.form {
  >>> .el-input-number {
    .el-input__inner {
      padding-left: 3px;
      padding-right: 3px;
    }
  }
  >>> .el-date-editor--timerange {
    .el-input__icon {
      display: none;
    }
  }
}
</style>
