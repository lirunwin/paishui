<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData">
      <el-form-item
        v-for="{ name, label, type, required = false, rules, items, ...rest } of formItems"
        :key="name"
        :required="required"
        :label="label"
        :rules="rules"
        :prop="name"
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
          <el-col style="flex: 0 0 2em; text-align: center">至</el-col>
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
import { IDeviceTypeParam } from '@/views/monitoring/api'
import { getDefalutNumberProp } from '@/views/monitoring/utils'

const getDefaultData = () => ({ isDisplay: 1, sort: 0, rate: 1 })

@Component({ name: 'ParamForm', components: { BaseDialog } })
export default class ParamForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Boolean, default: false }) loading!: boolean
  $refs!: { form: ElForm }
  formData: IDeviceTypeParam = getDefaultData()

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  validatelrangeLow(_, value, callback) {
    if (this.formData.lrangeUp && value >= +this.formData.lrangeUp) {
      callback(new Error('下限需小于上限'))
    } else {
      if (this.formData.lrangeUp !== '') {
        this.$refs.form.clearValidate('lrangeUp')
      }
      callback()
    }
  }
  validatelrangeUp(_, value, callback) {
    if (this.formData.lrangeLow && value <= +this.formData.lrangeLow) {
      callback(new Error('上限需大于下限'))
    } else {
      if (this.formData.lrangeLow !== '') {
        this.$refs.form.validateField('lrangeLow')
      }
      callback()
    }
  }
  get formItems() {
    return [
      {
        label: '参数名称',
        name: 'name',
        rules: [
          { required: true, message: '参数名称不能为空！' },
          { max: 20, message: '参数名称不超过20个字符' },
          { pattern: /^[\u4e00-\u9fa5\w -]+$/, message: '允许输入汉字、英文、数字', trigger: 'blur' }
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
          { required: false, message: '参数单位不能为空！', trigger: 'blur' },
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
            name: 'lrangeLow',
            type: 'number',
            rest: {
              ...getDefalutNumberProp(),
              precision: 2,
              max: Number(this.formData.lrangeUp) || 9999999,
              controls: false
            },
            rules: [{ validator: this.validatelrangeLow, trigger: 'blur' }]
          },
          {
            label: '量程上限',
            name: 'lrangeUp',
            type: 'number',
            rest: {
              ...getDefalutNumberProp(),
              precision: 2,
              min: Number(this.formData.lrangeLow) || 0,
              controls: false
            },
            rules: [{ validator: this.validatelrangeUp, trigger: 'blur' }]
          }
        ]
      },
      {
        label: '采集频率',
        name: 'rate',
        type: 'number',
        rules: [
          { required: true, message: '数据采集频率不能为空！', trigger: 'blur' },
          { type: 'integer', min: -1, max: 60 * 24 * 30, message: `数据采集频率须大于0小于${60 * 24 * 30}` }
        ],
        ...getDefalutNumberProp()
      },
      {
        label: '是否显示',
        name: 'isDisplay',
        type: 'switch',
        rules: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
        size: 'small',
        activeValue: 1,
        inactiveValue: 0
      },
      {
        label: '显示顺序',
        name: 'sort',
        type: 'number',
        rules: [{ type: 'integer', min: -1, message: '显示顺序为数字' }],
        size: 'small',
        ...getDefalutNumberProp()
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
    this.$refs.form.validate(
      (valid) =>
        valid &&
        this.$emit('submit', { ...this.formData, codeAbridge: this.formData.codeAbridge || this.formData.code })
    )
  }

  @Watch('data', { immediate: true })
  setDefaultData({ lrangeLow, lrangeUp, isDisplay, id, ...rest }) {
    this.formData = id
      ? {
          lrangeLow: lrangeLow || undefined,
          lrangeUp: lrangeUp || undefined,
          isDisplay: Number(isDisplay),
          ...rest
        }
      : getDefaultData()
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
