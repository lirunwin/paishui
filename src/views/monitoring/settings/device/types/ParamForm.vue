<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData">
      <template v-for="{ name, label, type, required = true, rules, ...rest } of formItems">
        <el-form-item :key="name" v-if="name === 'distance'" :required="required" :label="label" :rules="rules">
          <el-row type="flex" justify="space-between">
            <el-col>
              <el-form-item :rules="rules[0]" prop="distance.0">
                <el-input v-model="formData.distance[0]" placeholder="下限" clearable />
              </el-form-item>
            </el-col>
            <el-col style="flex:0 0 2em;text-align:center"> 至 </el-col>
            <el-col>
              <el-form-item :rules="rules[1]" prop="distance.1">
                <el-input v-model="formData.distance[1]" placeholder="上限" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-else-if="name === 'display'" :key="name" :label="label" :rules="rules" :prop="name">
          <el-select v-model="formData.display" :placeholder="`请选择${label}`" clearable>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
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
const toNumber = (val?: string): number => (val ? +val : -1)

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const { distance = [], display = '1', ...rest } = val || {}
    this.formData = { ...rest, distance, display }
  }
  formData = {
    distance: [],
    display: '1'
  }
  formItems = [
    {
      label: '序号',
      name: 'name',
      rules: [{ required: true, message: '序号不能为空！', trigger: 'blur' }]
    },
    {
      label: '参数代码',
      name: 'code',
      rules: [
        { required: true, message: '参数代码不能为空！', trigger: 'blur' },
        { type: 'string', pattern: /^[a-zA-Z]\w{0,10}$/, message: '参数代码须以字母开头, 允许输入英文+数字' },
        { type: 'string', max: 10, message: '参数代码不能超过10个字符' }
      ]
    },
    {
      label: '参数名称',
      name: 'time',
      rules: [
        { required: true, message: '参数名称不能为空！', trigger: 'blur' },
        { max: 20, message: '参数名称不超过20个字符' }
      ]
    },
    {
      label: '参数缩写',
      name: 'short',
      rules: [
        { required: true, message: '参数缩写不能为空！', trigger: 'blur' },
        { max: 20, message: '参数缩写不超过20个字符' }
      ]
    },
    {
      label: '参数单位',
      name: 'unit',
      rules: [
        { required: true, message: '参数单位不能为空！', trigger: 'blur' },
        { max: 20, message: '参数单位不超过20个字符' }
      ]
    },
    {
      label: '量程',
      name: 'distance',
      rules: [
        [
          { required: true, message: '请输入量程下限', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber }
        ],
        [
          { required: true, message: '请输入量程上限', trigger: 'blur' },
          { type: 'number', min: 0, message: '请输入双精度数字', transform: toNumber },
          {
            validator: (rule, value, callback) => {
              if (value <= (+this.formData.distance[0] || 0)) callback('上限需大于下限')
            }
          }
        ]
      ]
    },
    {
      label: '是否显示',
      name: 'display',
      rules: [{ required: true, message: '请选择是否显示', trigger: 'blur' }]
    },
    {
      label: '备注',
      name: 'note',
      rules: [{ required: false, max: 255, message: '备注不能超过255个字符' }],
      type: 'textarea',
      rows: 4,
      required: false
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
