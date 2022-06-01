<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData">
      <el-form-item
        v-for="{ name, label, rules, required = false, type = 'text', onChange, ...rest } of formItems"
        :key="name"
        :required="required"
        :label="label"
        :rules="rules"
        :prop="name"
      >
        <el-switch v-if="type === 'switch'" v-model="formData[name]" v-bind="rest" @change="onChange" />
        <el-input-number
          v-else-if="type === 'number'"
          v-model="formData[name]"
          controls-position="right"
          :placeholder="`请输入${label}`"
          v-bind="rest"
        />
        <el-input v-else v-model="formData[name]" :placeholder="`请输入${label}`" clearable v-bind="rest">
          <template slot="suffix" v-if="name === 'collectTime'">
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

const getDefaultValue = () => ({ sort: 1, isCollect: false })

@Component({ name: 'TypeForm', components: { BaseDialog } })
export default class TypeForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Boolean, default: false }) loading!: boolean
  $refs!: { form: ElForm }
  formData: { [x: string]: string | number | boolean } = getDefaultValue()
  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }
  get formItems() {
    return [
      {
        label: '设备类型名称',
        name: 'name',
        required: true,
        rules: [
          { required: true, message: '设备类型名称不能为空！', trigger: 'blur' },
          { max: 50, message: '设备类型名称不超过50个字符' },
          { pattern: /^[\u4e00-\u9fa5\w -]+$/, message: '允许输入汉字、英文、数字', trigger: 'blur' }
        ],
        size: 'small'
      },
      {
        label: '设备类型代码',
        name: 'typeCode',
        rules: [
          { required: false, message: '设备类型代码不能为空！', trigger: 'blur' },
          { max: 50, message: '设备类型代码不超过50个字符' },
          { pattern: /^[\w-]+$/, message: '允许输入英文、数字', trigger: 'blur' }
        ],
        size: 'small'
      },
      {
        label: '是否归集',
        name: 'isCollect',
        required: true,
        type: 'switch',
        rules: [{ required: true, message: '请选择是否归集', trigger: 'change' }],
        size: 'small',
        activeValue: 1,
        inactiveValue: 0,
        onChange: this.onIsCollectChange
      },
      {
        label: '数据归集时间',
        name: 'collectTime',
        rules: [
          { required: !!this.formData.isCollect, message: '数据归集时间不能为空！', trigger: 'blur' },
          {
            type: 'number',
            message: '数据归集时间须为数字 ',
            transform: (val) => (Number.isNaN(Number(val)) ? val : +val || -1)
          },
          { type: 'integer', min: -1, max: 60 * 24 * 30, message: `数据归集时间须大于0小于${60 * 24 * 30}` }
        ],
        size: 'small',
        disabled: !this.formData.isCollect,
        required: !!this.formData.isCollect,
        maxLength: 5
      },
      {
        label: '显示顺序',
        name: 'sort',
        type: 'number',
        rules: [{ type: 'integer', min: -1, message: '显示顺序为数字' }],
        min: 0,
        max: 999999,
        size: 'small',
        precision: 0,
        stepStrictly: true,
        style: { width: '100%', textAlign: 'left' },
        class: 'input-number'
      }
    ]
  }
  onIsCollectChange(val: 1 | 0) {
    if (!val) {
      this.formData.collectTime = undefined
      this.$refs.form.clearValidate('collectTime')
    }
  }
  onSubmit() {
    this.$refs.form.validate((valid) => valid && this.$emit('submit', this.formData))
  }
  
  @Watch('data', { immediate: true })
  setDefaultData(val: any) {
    this.formData = val.id ? { ...val } : getDefaultValue()
  }
}
</script>
