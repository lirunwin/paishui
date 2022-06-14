<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="listeners"
    @open="onOpen"
    @closed="onClosed"
    @submit="onSubmit"
    :disabled="!formData.param.length || fetching"
    :loading="fetching"
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
          style="width: 200px"
          :disabled="(selected[0] || {}).isConfigured"
          @change="onStandardChange"
        >
          <el-option v-for="item in standards" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <BaseTable :columns="settingPointBasisCols" :data="formData.param" v-loading="fetching" border>
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
              style="width: 100%"
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
      <BaseTable
        :columns="settingPointParamCols"
        :data="formData.threshold"
        v-loading="fetching || deletingParam"
        border
      >
        <template v-for="(item, index) of formData.threshold" v-slot:[`name-${index}`]>
          <template v-if="String(item.id).startsWith(idPrefix)">
            <el-form-item
              :key="`name-${item.id}`"
              :prop="`threshold[${index}].id`"
              label-width="0"
              style="margin-bottom: 0"
              :rules="getRequiredRule(item.name, true, true)"
            >
              <el-select v-model="formData.threshold[index].paraId" placeholder="请选择参数名称">
                <el-option
                  v-for="param of formData.param"
                  :label="param.name"
                  :value="String(param.id).startsWith(idPrefix) ? param.indicateParaId : param.id"
                  :key="param.id"
                  :disabled="
                    formData.threshold.filter((i) => i.paraId === param.id || i.paraId === param.indicateParaId)
                      .length === levels.length
                  "
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            {{ item.paraName }}
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
            <el-select
              v-model="formData.threshold[index].level"
              placeholder="请选择监测值判定"
              clearable
              :disabled="
                !formData.threshold[index].paraId || !String(formData.threshold[index].id).startsWith(idPrefix)
              "
              @change="($event) => onThresholdLevelChange(index, $event)"
            >
              <el-option
                v-for="level of levels"
                :label="level.notes"
                :value="level.codeValue"
                :key="level.id"
                :disabled="formData.threshold.some((i) => String(i.level) === String(level.codeValue))"
              />
            </el-select>
          </el-form-item>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`specialVal-${index}`]>
          <el-form-item
            :key="`specialVal-${item.id}`"
            :prop="`threshold[${index}].specialVal`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input
              v-model="formData.threshold[index].specialVal"
              size="small"
              style="width: 60px"
              @change="() => onSpecialValChange(index)"
            />
          </el-form-item>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`threshold-${index}`]>
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`threshold-${item.id}`">
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].lower`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name, !formData.threshold[index].specialVal)"
              >
                <el-input-number
                  :controls="false"
                  :min="0"
                  :max="Number(formData.threshold[index].upper) - 0.01"
                  v-model="formData.threshold[index].lower"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onWarningChange(index)"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item
                :prop="`threshold[${index}].upper`"
                label-width="0"
                style="margin-bottom: 0"
                :rules="getRequiredRule(item.name, !formData.threshold[index].specialVal)"
              >
                <el-input-number
                  v-model="formData.threshold[index].upper"
                  :controls="false"
                  :disabled="!(formData.threshold[index].lower >= 0)"
                  :min="Number(formData.threshold[index].lower) + 0.01"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onWarningChange(index)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`allowance-${index}`]>
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`allowance-${item.id}`">
            <el-col>
              <el-form-item :prop="`threshold[${index}].lowerTolerance`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  v-model="formData.threshold[index].lowerTolerance"
                  :controls="false"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onWarningChange(index, 'upperTolerance')"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item :prop="`threshold[${index}].upperTolerance`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  v-model="formData.threshold[index].upperTolerance"
                  :controls="false"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="width: 70px"
                  @change="() => onWarningChange(index, 'lowerTolerance')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`time-${index}`]>
          <el-form-item
            :key="`time-${item.id}`"
            :prop="`threshold[${index}].timeRange`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-time-picker
              v-model="formData.threshold[index].timeRange"
              is-range
              range-separator="~"
              style="width: 100%"
              format="HH:mm"
              value-format="HH:mm"
              size="small"
              prefix-icon=""
              arrow-control
              :clearable="false"
            />
          </el-form-item>
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
const thresholdKeys = ['upper', 'lower', 'upperTolerance', 'lowerTolerance']
import {
  getPointConfigurations,
  IDictionary,
  IPoint,
  IPointConnectDevice,
  IPointParam,
  IPointThreshold,
  IStandard,
  IDeviceTypeParam,
  standardsPage,
  deviceTypeParamsPage,
  IStandardParam,
  standardParamsPage,
  deleteConfiguredPointThreshold
} from '@/views/monitoring/api'

interface IThreshold extends IPointThreshold {
  timeRange?: (string | Date)[]
  name?: string
}

export interface IPointThresholdFormData {
  threshold?: IThreshold[]
  param?: (IPointParam & { unit?: string; codeAbridge?: string; isSpecial?: boolean | number })[]
  indicateId?: string
}

const getDefaultThresholdValue = (id: string | number = '', value: IThreshold = { paraId: '' }): IThreshold =>
  Object.defineProperty(
    {
      //  name
      // paraId   // 监测指标参数id 关联 设备基础配置信息id
      level: '',
      lower: undefined, // threshold
      upper: undefined, // threshold
      lowerTolerance: undefined, // allowance
      upperTolerance: undefined, // allowance
      start: undefined, // time
      end: undefined, // time
      specialVal: undefined,
      isPush: 1,
      isSpecial: false,
      timeRange: [moment('00:00', format).toDate(), moment('23:59', format).toDate()],
      ...value
    },
    'id',
    { enumerable: false, configurable: true, value: id, writable: true }
  )
const getDefaultFormData = (): IPointThresholdFormData => ({ threshold: [], param: [], indicateId: '' })

const idPrefix = '__temp__'

@Component({ name: 'PointThresholdForm', components: { BaseDialog, BaseTitle, BaseTable } })
export default class PointThresholdForm extends Vue {
  @Prop({ type: Array, default: () => [] }) selected!: IPointConnectDevice[]
  @Prop({ type: Array, default: () => [] }) levels!: IDictionary[]
  $refs!: { form: ElForm }
  $listeners!: { open?: Function; submit?: Function; closed: Function }
  dialogVisible = false
  dialogImageUrl = ''
  formData: IPointThresholdFormData = getDefaultFormData()
  settingPointBasisCols = settingPointBasisCols
  settingPointParamCols = settingPointParamCols
  idPrefix = idPrefix
  rules = {
    indicateId: [{ required: true, message: '请选择体系！', trigger: 'blur' }],
    pointId: [{ required: true, message: '请选择检测点', trigger: 'blur' }]
  }

  fetching: boolean = false

  deletingParam = false

  standards: IStandard[] = []

  deviceTypePrams: IDeviceTypeParam[] = []

  standardParams: IStandardParam[] = []

  points: IPoint[] = []

  deviceId: string | number = ''

  get listeners() {
    const { submit, open, closed, ...rest } = this.$listeners
    return rest
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        const { indicateId, threshold, param } = this.formData
        // console.log(JSON.stringify(this.formData, null, 2))
        const data = {
          indicateId,
          param: param.map<IPointParam>(({ id, ...rest }) => {
            return {
              ...rest,
              id: String(id).startsWith(idPrefix) ? undefined : id
            }
          }),
          threshold: threshold.map<IPointThreshold>(
            ({ name, id, timeRange, isSpecial, specialVal, lower, upper, lowerTolerance, upperTolerance, ...rest }) => {
              const [start, end] = timeRange || []
              return {
                ...rest,
                isSpecial,
                specialVal,
                lower: isSpecial ? '' : lower,
                upper: isSpecial ? '' : upper,
                lowerTolerance: isSpecial ? '' : lowerTolerance,
                upperTolerance: isSpecial ? '' : upperTolerance,
                start: moment(start, format).format(format),
                end: moment(end, format).format(format),
                id: String(id).startsWith(idPrefix) ? undefined : id
              }
            }
          )
        }
        console.log(JSON.stringify(data, null, 2))
        this.$emit('submit', data)
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

  onThresholdLevelChange(index: number, level: string) {
    const { paraId } = this.formData.threshold[index]
    const param = this.standardParams.find((item) => String(item.level) === String(level))

    if (param)
      this.formData.threshold[index] = Object.assign(
        this.formData.threshold[index],
        this.setupNewThreshold(param, { paraId, level: String(level) })
      )
  }

  setupNewThreshold(param: IStandardParam = {}, addtional: Partial<IThreshold> = {}): IThreshold {
    const {
      id: paraId,
      lower,
      upper,
      lowerTolerance,
      upperTolerance,
      start,
      end,
      isSpecial,
      specialVal,
      level = ''
    } = param

    return {
      paraId,
      lower: lower || undefined,
      upper: upper || undefined,
      lowerTolerance: lowerTolerance || undefined,
      upperTolerance: upperTolerance || undefined,
      start,
      end,
      isSpecial,
      specialVal,
      level: String(level),
      timeRange: [moment(start, format).toDate(), moment(end, format).toDate()],
      ...addtional
    }
  }

  async onStandardChange(indicateId: string, reset: boolean = true) {
    const { type: typeId } = this.standards.find((item) => item.id === indicateId) || {}
    if (!typeId) return
    this.fetching = true
    try {
      const {
        result: { records: deviceTypePrams }
      } = await deviceTypeParamsPage({ typeId, current: 1, size: 999999 })

      this.deviceTypePrams = deviceTypePrams
      const {
        result: { records: standardParams }
      } = await standardParamsPage({ indicateId, current: 1, size: 999999 })

      this.standardParams = standardParams
      if (reset) {
        this.formData = {
          ...this.formData,
          // 缺deviceId 设备id 但有deviceTypeParaId， indicateId 监测体系id
          param: deviceTypePrams.map<IPointParam>(({ id, lrangeUp, lrangeLow, ...rest }, index) => {
            return Object.defineProperty(
              {
                ...rest,
                deviceId: this.deviceId,
                indicateId,
                indicateParaId: (
                  standardParams.find((item) => item.deviceTypeParaVo && item.deviceTypeParaVo.id === id) || {}
                ).id,
                lrangeUp: lrangeUp || undefined,
                lrangeLow: lrangeLow || undefined,
                sort: index + 1,
                siteCode: '',
                isDisplay: 1,
                note: ''
              },
              'id',
              { enumerable: false, configurable: true, value: idPrefix + id, writable: true }
            )
          }),

          threshold: deviceTypePrams.map<IPointThreshold>(({ id, name }, index) =>
            getDefaultThresholdValue(
              `${idPrefix}${index}`,
              this.setupNewThreshold(
                this.standardParams.find((item) => item.deviceTypeParaVo && item.deviceTypeParaVo.id === id) || {},
                { name }
              )
            )
          )
        }
      }
    } catch (error) {
      console.log(error)
    }
    this.fetching = false
  }

  onParamAdd() {
    this.formData = {
      ...this.formData,
      threshold: [...this.formData.threshold, getDefaultThresholdValue(idPrefix + new Date())]
    }
  }

  async onParamDel({ id }: IThreshold) {
    this.deletingParam = true
    try {
      const { result } = await deleteConfiguredPointThreshold(id)
      if (result) this.$message[result ? 'success' : 'error'](`参数阈值配置删除${result ? '成功!' : '失败!'}`)
      if (result)
        this.formData = {
          ...this.formData,
          threshold: this.formData.threshold.filter((item) => item.id !== id)
        }
    } catch (error) {
      console.log(error)
    }
    this.deletingParam = false
  }

  onWarningChange(index: number | string, key: string = '') {
    if (key) {
      this.formData.threshold[index][key] = undefined
      setTimeout(() => {
        this.$refs.form.validateField(`threshold[${index}].${key}`)
      }, 100)
    }
    this.formData.threshold[index].specialVal = undefined
    this.formData.threshold[index].isSpecial = false
  }

  onSpecialValChange(index: number) {
    this.formData.threshold[index].isSpecial = true
    thresholdKeys.forEach((key) => {
      this.formData.threshold[index][key] = undefined
      setTimeout(() => {
        this.$refs.form.validateField(`threshold[${index}].${key}`)
      }, 100)
    })
  }

  async getSettings() {
    const { id, isConfigured } = this.selected[0] || {}
    if (!isConfigured) return
    this.fetching = true
    try {
      const { result } = await getPointConfigurations(id)
      const { siteDeviceIndicates: param, siteDeviceParas: threshold } = result || {}
      const indicateId = ((param || {})[0] || {}).indicateId
      this.onStandardChange(indicateId, false)
      this.formData = {
        indicateId,
        param: param.map(({ isDisplay, ...rest }) => ({ ...rest, isDisplay: Number(isDisplay) })),
        threshold: threshold.map(
          ({
            start,
            end,
            paraId,
            specialVal,
            lower,
            lowerTolerance,
            upper,
            upperTolerance,
            isPush,
            level = '',
            ...rest
          }) => {
            return {
              ...rest,
              paraId,
              timeRange: [moment(start, format).toDate(), moment(end, format).toDate()],
              specialVal: specialVal || undefined,
              lower: lower || undefined,
              lowerTolerance: lowerTolerance || undefined,
              upper: upper || undefined,
              upperTolerance: upperTolerance || undefined,
              isPush: Number(isPush),
              level: String(level)
            }
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
    this.fetching = false
  }

  onOpen() {
    this.getSettings()
    this.onStandardQuery()
    this.$emit('open')
  }

  onClosed() {
    this.deviceTypePrams = []
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
