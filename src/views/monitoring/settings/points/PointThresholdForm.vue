<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="listeners"
    @open="onOpen"
    @closed="onClosed"
    @submit="onSubmit"
    width="80vw"
    top="7vh"
  >
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" :rules="rules">
      <BaseTitle>体系 & 检测点</BaseTitle>
      <el-form-item prop="indicateId" label="监测体系">
        <el-col :span="12">
          <el-select
            v-model="formData.indicateId"
            placeholder="请选择监测体系"
            size="small"
            filterable
            clearable
            @change="onStandardChange"
          >
            <el-option v-for="item in standards" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="pointId" label="监测点">
        <el-col :span="12">
          <el-select v-model="formData.pointId" placeholder="请选择监测点" size="small" filterable clearable multiple>
            <el-option v-for="item in points" :key="item.id" :label="item.name" :value="item.id"
              >{{ item.name }} | {{ item.no }}</el-option
            >
          </el-select>
        </el-col>
      </el-form-item>

      <BaseTitle style="margin-top: 20px">监测参数基本设置</BaseTitle>
      <BaseTable :columns="settingPointBasisCols" :data="formData.param" border>
        <template v-for="(item, index) of formData.param" v-slot:[`sort-${index}`]="{ row }">
          <el-form-item
            :key="`sort-${item.id}`"
            :prop="`param[${index}].sort`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.param[index].sort" size="small" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`siteCode-${index}`]="{ row }">
          <el-form-item
            :key="`siteCode-${item.id}`"
            :prop="`param[${index}].siteCode`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input-number
              v-model="formData.param[index].siteCode"
              size="small"
              :controls="false"
              :min="0"
              :precision="0"
            />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`isDisplay-${index}`]="{ row }">
          <el-form-item
            :key="`isDisplay-${item.id}`"
            :prop="`param[${index}].isDisplay`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.param[index].isDisplay" size="small" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`note-${index}`]="{ row }">
          <el-form-item
            :key="`note-${item.id}`"
            :prop="`param[${index}].note`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.param[index].note" size="small" />
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
          :disabled="!formData.param"
          >添加</el-button
        >
      </BaseTitle>
      <BaseTable :columns="settingPointParamCols" :data="formData.threshold" border>
        <template v-for="(item, index) of formData.threshold" v-slot:[`name-${index}`]="{ row }">
          <template v-if="String(row.id).startsWith('__new__')">
            <el-form-item
              :key="`name-${item.id}`"
              :prop="`threshold[${index}].id`"
              label-width="0"
              style="margin-bottom: 0"
            >
              <el-select v-model="formData.threshold[index].id" :placeholder="`请选择${row.name}`">
                <el-option
                  v-for="standard of standards"
                  :label="standard.name"
                  :value="standard.id"
                  :key="standard.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            {{ row.name }}
          </template>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`level-${index}`]="{ row }">
          <el-form-item
            :key="`level-${item.id}`"
            :prop="`threshold[${index}].level`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-select v-model="formData.threshold[index].level" placeholder="请选择监测值判定">
              <el-option v-for="level of levels" :label="level.notes" :value="level.id" :key="level.id" />
            </el-select>
          </el-form-item>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`threshold-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`threshold-${item.id}`">
            <el-col>
              <el-form-item :prop="`threshold[${index}].lower`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model="formData.threshold[index].lower"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item :prop="`threshold[${index}].upper`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model="formData.threshold[index].upper"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`allowance-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`allowance-${item.id}`">
            <el-col>
              <el-form-item :prop="`threshold[${index}].lowerTolerance`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model="formData.threshold[index].lowerTolerance"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item :prop="`threshold[${index}].upperTolerance`" label-width="0" style="margin-bottom: 0">
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model="formData.threshold[index].upperTolerance"
                  size="small"
                  style="width: 70px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.threshold" v-slot:[`time-${index}`]="{ row }">
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
            <el-switch v-model="formData.threshold[index].isPush" size="small" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.threshold" v-slot:[`action-${index}`]="{ row }">
          <el-button :key="`action-${item.id}`" type="text" @click="() => onParamDel(row)" size="small">删除</el-button>
        </template>
      </BaseTable>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
  IPointParam,
  IPointThreshold,
  IStandard,
  IStandardParam,
  pointsPage,
  standardParamsPage,
  standardsPage
} from '@/views/monitoring/api'
interface IThreshold extends IPointThreshold {
  timeRange?: (string | Date)[]
}

interface IFormData {
  threshold?: IThreshold[]
  param?: IPointParam[]
  indicateId?: string
  pointId?: string
}

const getDefaultThresholdValue = (index?: string | number): IThreshold => ({
  id: index,
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
  timeRange: [moment('00:00', format).toDate(), moment('23:59', format).toDate()]
})

@Component({ name: 'PointForm', components: { BaseDialog, BaseTitle, BaseTable } })
export default class PointForm extends Vue {
  $refs!: { form: ElForm }
  $listeners!: { open?: () => void; submit?: () => void; closed: () => void }
  dialogVisible = false
  dialogImageUrl = ''
  formData: IFormData = { threshold: [], param: [] }
  settingPointBasisCols = settingPointBasisCols
  settingPointParamCols = settingPointParamCols

  rules = {
    indicateId: [{ required: true, message: '请选择体系！', trigger: 'blur' }],
    pointId: [{ required: true, message: '请选择检测点', trigger: 'blur' }]
  }

  standards: IStandard[] = []

  standardParams: IStandardParam[] = []

  points: IPoint[] = []

  levels: IDictionary[] = []

  get listeners() {
    const { submit, open, closed, ...rest } = this.$listeners
    return rest
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        console.log(JSON.stringify(this.formData, null, 2))
      }
    })
  }

  // getDefaultParam(key: string = 'threshold') {
  //   return {
  //     param: settingPointBasisCols,
  //     threshold: settingPointParamCols
  //   }[key]
  //     .filter((item) => item._slot)
  //     .reduce(
  //       (data, current) => {
  //         const temp = { ...data }
  //         temp[current.prop] = []
  //         return temp
  //       },
  //       {} as { [x: string]: any }
  //     )
  // }

  async onStandardQuery() {
    try {
      const {
        result: { records }
      } = await standardsPage({ current: 1, size: 999999 })
      this.standards = records || []
    } catch (error) {
      console.log(error)
    }
  }

  async onStandardChange(indicateId) {
    try {
      const {
        result: { records }
      } = await standardParamsPage({ indicateId, current: 1, size: 999999 })
      this.formData = {
        ...this.formData,
        // 缺deviceId 设备id 但有deviceTypeParaId， indicateId 监测体系id
        param: records.map<IPointParam>(({ id, upper, lower }, index) => ({
          //name, code, unit,    deviceTypeParaId
          id: 'temp-' + id,
          lrangeUp: upper, // 体系参数叫upper 存的时候叫  lrangeUp
          lrangeLow: lower, // 体系参数叫lower 存的时候叫  lrangeLow
          sort: index + 1,
          siteCode: '', //  后台是 number
          isDisplay: 1
        })),
        threshold: records.map<IPointThreshold>((_, index) => getDefaultThresholdValue(index))
      }
    } catch (error) {
      console.log(error)
    }
  }

  async onPointQuery() {
    try {
      const {
        result: { records }
      } = await pointsPage({ current: 1, size: 999999 })
      this.points = records || []
    } catch (error) {
      console.log(error)
    }
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

  onParamDel({ id }) {
    this.standardParams = this.standardParams.filter((item) => item.id !== id)
  }

  onOpen() {
    this.onStandardQuery()
    this.onPointQuery()
    this.getLevels()
    this.$listeners.open && this.$listeners.open()
  }

  onClosed() {
    this.standardParams = []
    this.$listeners.closed && this.$listeners.closed()
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
