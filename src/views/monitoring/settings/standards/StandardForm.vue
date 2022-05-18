<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" :rules="rules">
      <el-form-item required label="设备类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择设备类型" :disabled="formData.id" clearable>
          <el-option value="1" label="test" />
        </el-select>
      </el-form-item>
      <el-form-item required label="指标标准名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入指标标准名称" clearable />
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
  rules = {
    type: [
      { required: true, message: '设备类型名称不能为空！', trigger: 'blur' },
      { max: 50, message: '设备类型名称不超过50个字符' }
    ],
    name: [
      { required: true, message: '指标标准名称不能为空！', trigger: 'blur' },
      { max: 50, message: '指标标准名称不超过50个字符' }
    ]
  }

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
