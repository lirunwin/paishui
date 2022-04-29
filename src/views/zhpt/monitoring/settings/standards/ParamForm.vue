<template>
  <BaseDialog width="450px" v-bind="$attrs" v-on="$listeners" @submit="onSubmit">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '10em', size: 'medium' }" :model="formData">
      <template v-for="{ name, label, type, required = true, rules, ...rest } of formItems">
        <el-form-item :key="name" v-if="name === 'time'" :required="required" :label="label" :rules="rules">
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item :rules="rules[0]" prop="time.0">
                <el-time-select v-model="formData.time[0]" placeholder="开始时间" style="width: 100%" clearable />
              </el-form-item>
            </el-col>
            <el-col style="flex:0 0 2em;text-align:center"> ~ </el-col>
            <el-col>
              <el-form-item :rules="rules[1]" prop="time.1">
                <el-time-select v-model="formData.time[1]" placeholder="结束时间" style="width: 100%" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-else-if="type === 'select'" :key="name" :label="label" :rules="rules" :prop="name">
          <el-select v-model="formData[name]" :placeholder="`请选择${label}`" clearable>
            <el-option
              v-for="item of options[name]"
              :key="item.id || item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else :key="name" :label="label" :rules="rules" :prop="name">
          <el-input
            v-model="formData[name]"
            :placeholder="`请输入${label}`"
            :type="type || 'text'"
            v-bind="rest"
            clearable
          />
        </el-form-item>
      </template>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
const toNumber = (val?: string): number => (val ? +val : 0)

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const { time = [], display = '1', msg = '1', ...rest } = val || {}
    this.formData = { ...rest, time, display, msg }
  }

  formData = {}

  get options() {
    return {
      name: 'names',
      level: [
        { id: '0', label: '优质', value: '0' },
        { id: '1', label: '轻度', value: '1' },
        { id: '2', label: '中度', value: '2' },
        { id: '3', label: '严重', value: '3' }
      ],
      display: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
      msg: [{ label: '是', value: '1' }, { label: '否', value: '0' }]
    }
  }
  formItems = [
    {
      label: '参数名称',
      name: 'name',
      type: 'select',
      rules: [{ required: true, message: '参数名称不能为空！', trigger: 'blur' }]
    },
    {
      label: '单位',
      name: 'unit',
      required: false,
      rules: [{ type: 'string', max: 10, message: '参数代码不能超过10个字符' }]
    },
    {
      label: '下限',
      name: 'range-left',
      rules: [
        { required: true, message: '下限不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }
      ]
    },
    {
      label: '下限预警容差',
      name: 'range-left1',
      required: false,
      rules: [{ required: false, type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }]
    },
    {
      label: '上限',
      name: 'range-right',
      rules: [
        { required: true, message: '上限不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }
      ]
    },
    {
      label: '下限预警容差',
      name: 'range-right1',
      required: false,
      rules: [{ required: false, type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }]
    },
    {
      label: '报警级别',
      name: 'level',
      type: 'select',
      rules: [{ required: true, message: '报警级别不能为空！' }]
    },
    {
      label: '有效时间',
      name: 'time',
      rules: [
        [{ required: true, message: '请选择开始时间' }],
        [
          { required: true, message: '请选择结束时间' },
          { type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }
          // {
          //   validator: (rule, value, callback) => {
          //     if (value <= (+this.formData.time[0] || 0)) callback('上限需大于下限')
          //   }
          // }
        ]
      ]
    },
    {
      label: '是否启用',
      name: 'display',
      type: 'select',
      rules: [{ required: true, message: '请选择是否启用' }]
    },
    {
      label: '是否发送警报消息',
      name: 'msg',
      type: 'select',
      rules: [{ required: true, message: '请选择是否发送警报消息' }]
    }
  ]
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
<style lang="scss" scoped></style>
