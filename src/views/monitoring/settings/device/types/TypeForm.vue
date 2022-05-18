<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData">
      <el-form-item
        v-for="{ name, label, rules } of formItems"
        :key="name"
        required
        :label="label"
        :rules="rules"
        :prop="name"
      >
        <el-input v-model="formData[name]" :placeholder="`请输入${label}`" clearable>
          <template slot="suffix" v-if="name === 'time'"
            >分钟</template
          >
        </el-input>
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'

@Component({ name: 'TypeForm', components: { BaseDialog } })
export default class TypeForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  formData: { [x: string]: string } = {}
  formItems = [
    {
      label: '设备类型名称',
      name: 'name',
      rules: [
        { required: true, message: '设备类型名称不能为空！', trigger: 'blur' },
        { max: 50, message: '设备类型名称不超过50个字符' }
      ]
    },
    {
      label: '设备类型代码',
      name: 'code',
      rules: [
        { required: true, message: '设备类型代码不能为空！', trigger: 'blur' },
        { max: 50, message: '设备类型代码不超过50个字符' }
      ]
    },
    {
      label: '数据归集时间',
      name: 'time',
      rules: [
        { required: true, message: '数据归集时间不能为空！', trigger: 'blur' },
        {
          type: 'number',
          message: '数据归集时间须为数字 ',
          transform: (val) => (Number.isNaN(Number(val)) ? val : +val || -1)
        },
        { type: 'number', min: 0, message: '数据归集时间须大于0 ' }
      ]
    }
  ]
  onSubmit() {
    console.log('submit')
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        console.log('valid')
      }
    })
  }
  @Watch('data', { immediate: true })
  setDefaultData(val) {
    this.formData = val || {}
  }
}
</script>
<style lang="scss" scoped></style>
