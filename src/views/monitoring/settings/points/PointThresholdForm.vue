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
            <el-option v-for="item in points" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>

      <BaseTitle style="margin-top: 20px">监测参数基本设置</BaseTitle>
      <BaseTable :columns="settingPointBasisCols" :data="formData.system" border>
        <template v-for="(item, index) of formData.system" v-slot:[`index-${index}`]="{ row }">
          <el-form-item
            :key="`index-${item.id}`"
            :prop="`system[${index}].index`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].index" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.system" v-slot:[`paramCode-${index}`]="{ row }">
          <el-form-item
            :key="`paramCode-${item.id}`"
            :prop="`system[${index}].paramCode`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].paramCode" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.system" v-slot:[`display-${index}`]="{ row }">
          <el-form-item
            :key="`display-${item.id}`"
            :prop="`system[${index}].display`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.system[index].display" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.system" v-slot:[`note-${index}`]="{ row }">
          <el-form-item
            :key="`note-${item.id}`"
            :prop="`system[${index}].note`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].note" :placeholder="row.name" />
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
      <BaseTable :columns="settingPointParamCols" :data="formData.param" border>
        <template v-for="(item, index) of formData.param" v-slot:[`name-${index}`]="{ row }">
          <template v-if="row.id.startsWith('__new__')">
            <el-form-item
              :key="`name-${item.id}`"
              :prop="`param[${index}].id`"
              label-width="0"
              style="margin-bottom: 0"
            >
              <el-select v-model="formData.param[index].id" :placeholder="`请选择${row.name}`">
                <el-option v-for="sys of standards" :label="sys.name" :value="sys.id" :key="sys.id" />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            {{ row.name }}
          </template>
        </template>

        <template v-for="(item, index) of formData.param" v-slot:[`value-${index}`]="{ row }">
          <el-form-item
            :key="`value-${item.id}`"
            :prop="`param[${index}].value`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-select v-model="formData.param[index].value" :placeholder="`请选择${row.name}`">
              <el-option v-for="level of levels" :label="level.notes" :value="level.id" :key="level.id" />
            </el-select>
          </el-form-item>
        </template>

        <template v-for="(item, index) of formData.param" v-slot:[`interval-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`interval-${item.id}`">
            <el-col>
              <el-form-item :prop="`param[${index}].interval[0]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval[0]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item :prop="`param[${index}].interval[1]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval[1]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.param" v-slot:[`interval1-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`interval1-${item.id}`">
            <el-col>
              <el-form-item :prop="`param[${index}].interval1[0]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval1[0]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item
                :key="`interval1-${item.id}`"
                :prop="`param[${index}].interval1[1]`"
                label-width="0"
                style="margin-bottom: 0"
              >
                <el-input v-model="formData.param[index].interval1[1]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of formData.param" v-slot:[`time-${index}`]="{ row }">
          <el-time-picker
            v-model="formData.param[index].time"
            is-range
            range-separator="~"
            :key="`time-${item.id}`"
            :placeholder="row.name"
            style="width:100%"
            format="HH:mm"
            value-format="HH:mm"
            size="small"
          />
        </template>

        <template v-for="(item, index) of formData.param" v-slot:[`msgPush-${index}`]>
          <el-form-item
            :key="`msgPush-${item.id}`"
            :prop="`param[${index}].msgPush`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.param[index].msgPush" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of formData.param" v-slot:[`action-${index}`]="{ row }">
          <el-button :key="`action-${item.id}`" type="text" @click="() => onParamDel(row)">删除</el-button>
        </template>
      </BaseTable>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingPointBasisCols, settingPointParamCols } from '@/views/monitoring/utils'
import {
  addDictionary,
  defaultValuesForMonitorStandardLevel,
  getDictKeys,
  IDictionary,
  IPoint,
  IStandard,
  IStandardParam,
  monitorStandardLevelKey,
  pointsPage,
  standardParamsPage,
  standardsPage
} from '@/views/monitoring/api'
import { ElForm } from 'element-ui/types/form'

interface FormData {
  threshold?: { [x: string]: string }[]
  param?: { [x: string]: string | number }[]
  [x: string]: any
}

@Component({ name: 'PointForm', components: { BaseDialog, BaseTitle, BaseTable } })
export default class PointForm extends Vue {
  $refs!: { form: ElForm }
  $listeners!: { open?: () => void; submit?: () => void; closed: () => void }
  dialogVisible = false
  dialogImageUrl = ''
  formData: FormData = { system: [], param: [] }
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
        console.log('valid')
      }
    })
  }

  getDefaultParam(key: string = 'threshold') {
    return {
      param: settingPointBasisCols,
      threshold: settingPointParamCols
    }[key]
      .filter((item) => item._interval)
      .reduce(
        (data, current = {}) => {
          const temp = { ...data }
          temp[current.prop] = []
          return temp
        },
        {} as { [x: string]: any }
      )
  }

  async onStandardQuery() {
    try {
      const {
        result: { records }
      } = await standardsPage({ current: 1, size: 999999 })
      this.standards = records || []
    } catch (error) {
      console.log(error)
    }
    this.standards = [{ id: '1', name: '第一系统' }, { id: '2', name: '第二系统' }, { id: '3', name: '第三系统' }]
  }

  async onStandardChange(indicateId) {
    try {
      const {
        result: { records }
      } = await standardParamsPage({ indicateId, current: 1, size: 999999 })
      this.formData = {
        ...this.formData,
        param: records.map(({ id, name, code, unit, upper, lower }) => ({
          id,
          name,
          code,
          unit,
          upper,
          lower,
          ...this.getDefaultParam('param')
        })),
        threshold: records.map(({ id }) => ({ id, ...this.getDefaultParam() }))
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
      // 如果没有， 添加默认值
      if (values.length === 0) {
        const { username: creater = '' }: { username: string } = this.$store.state.user || {}
        await Promise.all([
          addDictionary({ ...monitorStandardLevelKey, ulevel: 1, creater }),
          ...defaultValuesForMonitorStandardLevel.map((item) =>
            addDictionary({ ulevel: 2, ...monitorStandardLevelKey, creater, ...item })
          )
        ])
        // 完成后，再次获取判定值
        this.getLevels()
      }
    } catch (error) {
      console.log(error)
    }
  }

  onParamAdd() {
    this.formData = {
      ...this.formData,
      threshold: [
        ...this.formData.threshold,
        Object.defineProperty(this.getDefaultParam(), 'id', { enumerable: false, value: '__new__' + new Date() })
      ]
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
.upload {
  /deep/ .el-upload-list--picture-card .el-upload-list__item,
  /deep/ .el-upload--picture-card {
    width: 128px;
    height: 128px;
  }
  /deep/ .el-upload--picture-card {
    line-height: normal;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
.preview {
  /deep/ .el-dialog .el-dialog__header {
    border-bottom: 0;
  }
}
</style>
