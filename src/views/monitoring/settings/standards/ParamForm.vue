<template>
  <BaseDialog width="450px" v-bind="$attrs" v-on="listeners" @submit="onSubmit" @open="onOpen" top="8vh">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '10em', size: 'medium' }" :model="formData">
      <el-form-item
        v-for="{ name, label, type, required = true, disabled, rules, names, on = {}, options, ...rest } of formItems"
        :key="name"
        :required="required"
        :label="label"
        :rules="rules"
      >
        <el-row v-if="name === 'time'" type="flex" justify="space-between">
          <el-col>
            <el-form-item :rules="rules[0]" :prop="names[0]">
              <el-time-select
                v-model="formData[names[0]]"
                placeholder="开始时间"
                size="small"
                style="width: 100%"
                clearable
                v-on="on"
              />
            </el-form-item>
          </el-col>
          <el-col style="flex:0 0 2em;text-align:center"> ~ </el-col>
          <el-col>
            <el-form-item :rules="rules[1]" :prop="names[1]">
              <el-time-select
                v-model="formData[names[1]]"
                placeholder="结束时间"
                size="small"
                style="width: 100%"
                clearable
                v-on="on"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-select
          v-else-if="type === 'select'"
          v-model="formData[name]"
          :placeholder="`请选择${label}`"
          clearable
          v-bind="rest"
          v-on="on"
        >
          <el-option v-for="item of options" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <el-switch v-else-if="type === 'switch'" v-model="formData[name]" v-bind="rest" v-on="on" />
        <el-input-number
          v-else-if="type === 'number'"
          v-model="formData[name]"
          controls-position="right"
          :placeholder="`请输入${label}`"
          v-bind="rest"
          v-on="on"
        />
        <el-checkbox v-else-if="type === 'checkbox'" v-model="formData[name]" v-bind="rest" v-on="on">
          {{ label }}
        </el-checkbox>
        <el-input
          v-else
          v-model="formData[name]"
          :placeholder="`请输入${label}`"
          :type="type || 'text'"
          :disabled="disabled"
          clearable
          v-bind="rest"
          v-on="on"
        />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import { getDefalutNumberProp, settingDeviceTypeParamCols } from '@/views/monitoring/utils'
import { ElForm } from 'element-ui/types/form'
import { IDictionary, IStandardParam, ITypeParam, typeParamsPage } from '@/views/monitoring/api'
import { TableColumn } from 'element-ui/types/table-column'

const getDefaultFormData = () => ({ idPush: 1, isUse: 1 })

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IStandardParam
  @Prop({ type: Array, default: () => [] }) levels!: IDictionary[]
  @Prop({ type: [String, Number], default: '' }) typeId!: string | number

  $refs!: { form: ElForm }
  $listeners: { submit: Function; open: Function }

  get listeners() {
    const { submit, open, ...rest } = this.$listeners
    return rest
  }

  formData: IStandardParam & { unit?: string; range?: string } = {}

  typeParams: ITypeParam[] = []

  get keys() {
    return !this.formData.isSpecial ? ['specialVal'] : ['lower', 'lowerTolerance', 'upper', 'upperTolerance']
  }

  get formItems() {
    return [
      {
        label: '参数名称',
        name: 'deviceTypeParaId',
        type: 'select',
        rules: [{ required: true, message: '请选择参数名称', trigger: 'blur' }],
        size: 'small',
        options: this.typeParams.map(({ id: value, name, code }) => ({ value, label: `${name} | ${code}` })),
        on: { change: this.onTypeParamChange }
      },
      {
        label: '单位',
        name: 'unit',
        required: false,
        disabled: true,
        size: 'small'
      },
      {
        label: '量程',
        name: 'range',
        required: false,
        disabled: true,
        size: 'small'
      },
      {
        label: '是否特定阈值',
        name: 'isSpecial',
        type: 'checkbox',
        rules: [{ required: true, message: '请输入特定阈值' }],
        size: 'small',
        trueLabel: 1,
        falseLabel: 0,
        on: { change: this.onIsSpecialChange }
      },
      {
        label: '特定阀值',
        name: 'specialVal',
        type: 'number',
        ...getDefalutNumberProp(),
        controls: false,
        precision: 2
      },
      {
        label: '下限',
        name: 'lower',
        type: 'number',
        rules: [{ required: true, message: '下限不能为空！', trigger: 'blur' }],
        ...getDefalutNumberProp(),
        controls: false,
        precision: 2
      },
      {
        label: '下限预警容差',
        name: 'lowerTolerance',
        type: 'number',
        required: false,
        ...getDefalutNumberProp(),
        controls: false,
        precision: 2,
        on: { change: () => this.onWarningChange('upperTolerance') }
      },
      {
        label: '上限',
        name: 'upper',
        type: 'number',
        rules: [{ required: true, message: '上限不能为空！', trigger: 'blur' }],
        ...getDefalutNumberProp(),
        controls: false,
        precision: 2
      },
      {
        label: '上限预警容差',
        name: 'upperTolerance',
        type: 'number',
        required: false,
        ...getDefalutNumberProp(),
        controls: false,
        precision: 2,
        on: { change: () => this.onWarningChange('lowerTolerance') }
      },
      {
        label: '报警级别',
        name: 'level',
        type: 'select',
        rules: [{ required: true, message: '报警级别不能为空！' }],
        options: this.levels.map(({ codeValue: value, notes: label }) => ({ value, label })),
        size: 'small'
      },
      {
        label: '有效时间',
        name: 'time',
        names: ['start', 'end'],
        rules: [
          [{ required: true, message: '请选择开始时间' }],
          [
            { required: true, message: '请选择结束时间' }
            // {
            //   validator: (rule, value, callback) => {
            //     if (value <= (+this.formData.time[0] || 0)) callback('上限需大于下限')
            //   }
            // }
          ]
        ],
        size: 'small'
      },
      {
        label: '是否启用',
        name: 'isUse',
        type: 'switch',
        activeValue: 1,
        inactiveValue: 0,
        size: 'small'
      },
      {
        label: '是否发送警报消息',
        name: 'isPush',
        type: 'switch',
        activeValue: 1,
        inactiveValue: 0,
        size: 'small'
      }
    ].filter(({ name }) => !this.keys.includes(name))
  }

  onWarningChange(key: 'upperTolerance' | 'lowerTolerance') {
    this.formData[key] = undefined
  }

  onIsSpecialChange() {
    this.keys.forEach((key) => {
      this.formData[key] = undefined
    })
  }

  onTypeParamChange(id) {
    if (!id) return
    const { unit, lrangeLow, lrangeUp } = this.typeParams.find((item) => item.id === id) || {}
    this.formData.unit = unit
    const col = settingDeviceTypeParamCols.find((item) => item.prop === 'lrange') || {}
    this.formData.range =
      col.formatter &&
      col.formatter(
        {
          lrangeLow,
          lrangeUp
        },
        col as TableColumn
      )
    // !lrangeLow && !lrangeUp ? '∞' : `${lrangeLow || 0} ~ ${lrangeUp || '∞'}`
  }

  onSubmit() {
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        this.$emit('submit', { ...this.formData })
      }
    })
  }

  async onOpen(typeId = '') {
    if (!this.typeId) return
    try {
      const {
        result: { records }
      } = await typeParamsPage({ typeId, current: 1, size: 9999999 })
      this.typeParams = records || []
      const { deviceTypeParaId } = this.data
      deviceTypeParaId && this.onTypeParamChange(deviceTypeParaId)
    } catch (error) {
      console.log(error)
    }
  }

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const { id, isSpecial, isPush, isUse, level, ...rest } = val || {}
    this.formData = id
      ? {
          id,
          level: String(level),
          isPush: Number(isPush),
          isSpecial: Number(isSpecial),
          isUse: Number(isUse),
          ...rest
        }
      : getDefaultFormData()
  }
}
</script>
<style lang="scss" scoped>
.form {
  >>> .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
}
</style>
