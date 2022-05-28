<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData">
      <el-form-item
        :key="name"
        :required="required"
        :label="label"
        :rules="rules"
        v-for="{ name, label, type, required = false, rules, items, ...rest } of formItems"
        :prop="name !== 'range' ? name : ''"
      >
        <el-row v-if="name === 'range'" type="flex" justify="space-between">
          <el-col>
            <el-form-item :rules="items[0].rules" :prop="items[0].name">
              <el-input-number
                v-model="formData[items[0].name]"
                :placeholder="`${items[0].label}`"
                v-bind="items[0].rest"
              />
            </el-form-item>
          </el-col>
          <el-col style="flex:0 0 2em;text-align:center">至</el-col>
          <el-col>
            <el-form-item :rules="items[1].rules" :prop="items[1].name">
              <el-input-number
                v-model="formData[items[1].name]"
                :placeholder="`${items[1].label}`"
                v-bind="items[1].rest"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-switch v-else-if="type === 'switch'" v-model="formData[name]" v-bind="rest" />
        <el-input-number
          v-else-if="type === 'number'"
          v-model="formData[name]"
          controls-position="right"
          :placeholder="`请输入${label}`"
          v-bind="rest"
        />
        <el-input
          v-else
          v-model="formData[name]"
          :placeholder="`请输入${label}`"
          :type="type || 'text'"
          v-bind="rest"
          clearable
        >
          <template slot="suffix" v-if="name === 'rate'">
            分钟
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import { ElForm } from 'element-ui/types/form'
const getDefalutNumberProp = () => ({
  min: 0,
  max: 9999999,
  size: 'small',
  precision: 0,
  stepStrictly: true,
  style: { width: '100%', textAlign: 'left' },
  class: 'input-number',
  clearable: true
})

const getDefaultData = () => ({ isDisplay: false, sort: 0 })

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Watch('data', { immediate: true })
  setDefaultData(val) {
    this.formData = val.id ? { ...val } : getDefaultData()
  }
  $refs!: { form: ElForm }
  formData: { [x: string]: any } = {}
  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }
  get formItems() {
    return [
      {
        label: '显示顺序',
        name: 'sort',
        type: 'number',
        rules: [{ type: 'integer', min: -1, message: '显示顺序为数字' }],
        size: 'small',
        ...getDefalutNumberProp()
      },
      {
        label: '参数名称',
        name: 'name',
        rules: [
          { required: true, message: '参数名称不能为空！', trigger: 'blur' },
          { max: 20, message: '参数名称不超过20个字符' },
          { pattern: /^[\u4e00-\u9fa5\w-]+$/, message: '允许输入汉字、英文、数字', trigger: 'blur' }
        ],
        size: 'small',
        required: true
      },
      {
        label: '参数代码',
        name: 'code',
        rules: [
          { required: true, message: '参数代码不能为空！', trigger: 'blur' },
          { max: 20, message: '参数代码不超过20个字符' },
          { pattern: /^[a-zA-Z][\w-]+$/, message: '字母开头,允许输入英文、数字', trigger: 'blur' }
        ],
        size: 'small',
        required: true
      },
      {
        label: '参数简称',
        name: 'codeAbridge',
        rules: [
          { required: false, message: '参数简称不能为空！', trigger: 'blur' },
          { max: 20, message: '参数简称不超过20个字符' },
          { pattern: /^[a-zA-Z][\w-]+$/, message: '字母开头,允许输入英文、数字', trigger: 'blur' }
        ],
        size: 'small'
      },
      {
        label: '参数单位',
        name: 'unit',
        rules: [
          { required: true, message: '参数单位不能为空！', trigger: 'blur' },
          { max: 20, message: '参数单位不超过20个字符' }
        ],
        size: 'small'
      },
      {
        label: '量程',
        name: 'range',
        items: [
          {
            label: '量程下限',
            name: 'LRangeLow',
            type: 'number',
            rest: {
              ...getDefalutNumberProp(),
              precision: 2,
              max: this.formData.LRangeUp || 9999999,
              controls: false
            }
          },
          {
            label: '量程上限',
            name: 'LRangeUp',
            type: 'number',
            rest: {
              ...getDefalutNumberProp(),
              precision: 2,
              min: this.formData.LRangeLow || 0,
              controls: false
            },
            rules: [
              {
                validator: (_, value, callback) => {
                  if (value <= (+this.formData.LRangeLow || 0)) callback('上限需大于下限')
                }
              }
            ]
          }
        ]
      },
      {
        label: '采集频率',
        name: 'rate',
        type: 'number',
        rules: [
          { required: true, message: '数据采集频率不能为空！', trigger: 'blur' },
          {
            type: 'number',
            message: '数据采集频率须为数字 ',
            transform: (val) => (Number.isNaN(Number(val)) ? val : +val || -1)
          },
          { type: 'integer', min: -1, max: 60 * 24 * 30, message: `数据采集频率须大于0小于${60 * 24 * 30}` }
        ],
        ...getDefalutNumberProp()
      },
      {
        label: '是否显示',
        name: 'isDisplay',
        type: 'switch',
        rules: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
        size: 'small'
      },
      {
        label: '备注',
        name: 'note',
        rules: [{ required: false, max: 255, message: '备注不能超过255个字符' }],
        type: 'textarea',
        rows: 4,
        size: 'small'
      }
    ]
  }
  onSubmit() {
    console.log('submit')
    this.$refs.form.validate((valid) => {
      console.log(valid, this.formData)
      if (valid) {
        this.$emit('submit', this.formData)
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
