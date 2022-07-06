<template>
  <tf-dialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" :rules="rules">
      <el-form-item required label="设备类型" prop="type">
        <el-select
          v-model="formData.type"
          filterable
          placeholder="请选择设备类型"
          size="small"
          :disabled="!!formData.id"
          clearable
        >
          <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item required label="指标标准名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入指标标准名称" clearable />
      </el-form-item>
    </el-form>
  </tf-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { IDeviceType } from '@/views/monitoring/api'

@Component({ name: 'StandardForm', components: {} })
export default class StandardForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Array, default: () => [] }) types!: IDeviceType[]
  @Prop({ type: Boolean, default: false }) loading!: boolean
  $refs!: { form: ElForm }

  formData: { [x: string]: string } = {}

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  rules = {
    type: [{ required: true, message: '请选择设备类型' }],
    name: [
      { required: true, message: '指标标准名称不能为空！' },
      { max: 50, message: '指标标准名称不超过50个字符' }
    ]
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        this.$emit('submit', this.formData)
      }
    })
  }
  @Watch('data', { immediate: true })
  setDefaultData(val) {
    this.formData = val.id ? { ...val } : {}
  }
}
</script>
