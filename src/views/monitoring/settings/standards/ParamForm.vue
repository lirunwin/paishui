<template>
  <BaseDialog width="450px" v-bind="$attrs" v-on="listeners" @submit="onSubmit" top="8vh">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '10em', size: 'medium' }" :model="formData">
      <el-form-item
        v-for="{ name, label, type, required = true, disabled, rules, names, onChange, options, ...rest } of formItems"
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
        >
          <el-option v-for="item of options" :key="item.id || item.value" :value="item.value" :label="item.label" />
        </el-select>
        <el-switch v-else-if="type === 'switch'" v-model="formData[name]" v-bind="rest" />
        <el-input-number
          v-else-if="type === 'number'"
          v-model="formData[name]"
          controls-position="right"
          :placeholder="`请输入${label}`"
          v-bind="rest"
        />
        <el-checkbox v-else-if="type === 'checkbox'" v-model="formData[name]" @change="onChange" v-bind="rest">{{
          label
        }}</el-checkbox>
        <el-input
          v-else
          v-model="formData[name]"
          :placeholder="`请输入${label}`"
          :type="type || 'text'"
          :disabled="disabled"
          clearable
          v-bind="rest"
        />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import { getDefalutNumberProp } from '@/views/monitoring/utils'

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const { time = [], display = '1', msg = '1', ...rest } = val || {}
    this.formData = { ...rest, time, display, msg }
  }

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  formData: { [x: string]: string } = {}

  levels = []
  get keys() {
    return !this.formData.isSpecial ? ['specialVal'] : ['lower', 'lowerTolerance', 'upper', 'upperTolerance']
  }
  get formItems() {
    return [
      {
        label: '参数名称',
        name: 'name',
        type: 'select',
        rules: [{ required: true, message: '请选择参数名称', trigger: 'blur' }],
        size: 'small'
      },
      {
        label: '单位',
        name: 'unit',
        required: false,
        disabled: true,
        rules: [{ type: 'string', max: 10, message: '单位不能超过10个字符' }],
        size: 'small'
      },
      {
        label: '是否特定阈值',
        name: 'isSpecial',
        type: 'checkbox',
        rules: [{ required: true, message: '请输入特定阈值' }],
        size: 'small',
        trueLabel: true,
        falseLabel: false,
        onChange: this.onIsSpecialChange
      },
      {
        label: '特定阀值',
        name: 'specialVal',
        rules: [{ required: true, message: '请输入特定阈值' }],
        size: 'small'
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
        onChange: () => this.onWarningChange('upperTolerance')
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
        onChange: () => this.onWarningChange('lowerTolerance')
      },
      {
        label: '报警级别',
        name: 'level',
        type: 'select',
        rules: [{ required: true, message: '报警级别不能为空！' }],
        options: this.levels,
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
        name: 'display',
        type: 'switch',
        rules: [{ required: true, message: '请选择是否启用' }],
        activeValue: 'true',
        inactiveValue: 'false',
        size: 'small'
      },
      {
        label: '是否发送警报消息',
        name: 'msg',
        type: 'switch',
        rules: [{ required: true, message: '请选择是否发送警报消息' }],
        activeValue: 'true',
        inactiveValue: 'false',
        size: 'small'
      }
    ].filter(({ name }) => !this.keys.includes(name))
  }

  onWarningChange(key: string) {
    this.formData[key] = ''
  }
  onIsSpecialChange() {
    this.keys.forEach((key) => this.formData[key] === '')
  }
  onSubmit() {
    console.log('submit')
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        console.log(JSON.stringify(this.formData, null, 2))
      }
    })
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
