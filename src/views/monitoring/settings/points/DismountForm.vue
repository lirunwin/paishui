<template>
  <tf-dialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" @open="onOpen" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" :rules="rules">
      <el-form-item required label="拆除人" prop="operateUserName">
        <el-input v-model="formData.operateUserName" placeholder="请输入修改人" clearable />
      </el-form-item>
      <el-form-item required label="拆除人电话" prop="operateUserPhone">
        <el-input v-model="formData.operateUserPhone" placeholder="请输入拆除人电话" clearable type="tel" />
      </el-form-item>
      <el-form-item required label="拆除时间" prop="operateTime">
        <el-date-picker
          type="datetime"
          v-model="formData.operateTime"
          placeholder="请选择拆除时间"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="拆除原因" prop="note">
        <el-input v-model="formData.note" type="textarea" :rows="4" clearable />
      </el-form-item>
    </el-form>
  </tf-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { IPointConnectDevice, IPointDismountParams } from '@/views/monitoring/api'
import { telAndMobileReg } from '@/utils/constant'

@Component({ name: 'DismountForm', components: {} })
export default class DismountForm extends Vue {
  @Prop({ type: Array, default: () => [] }) selected!: IPointConnectDevice[]
  @Prop({ type: Boolean, default: () => false }) loading!: boolean
  $refs!: { form: ElForm }
  $listeners!: { open: Function; submit: Function }
  formData: IPointDismountParams = {
    monitorSiteIds: '',
    operateUserName: '',
    operateUserPhone: '',
    operateTime: '',
    type: 'del',
    note: ''
  }

  get listeners() {
    const { submit, open, ...rest } = this.$listeners
    return rest
  }

  rules = {
    operateUserName: [{ required: true, message: '请输入拆除人姓名' }],
    operateUserPhone: [
      { required: true, message: '请输入拆除人电话' },
      { type: 'string', max: 50, message: '联系方式不能超过50个字符' },
      { pattern: telAndMobileReg(), message: '请输入正确的联系方式', trigger: 'blur' }
    ],
    operateTime: [{ required: true, message: '请选择修改时间' }],
    note: [
      { required: true, message: '请输入拆除原因' },
      { required: false, max: 255, message: '拆除原因最长为255个字符' }
    ]
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        this.$emit('submit', this.formData)
      }
    })
  }

  onOpen() {
    this.setDefaultValue()
    this.$listeners.open && this.$listeners.open()
  }
  setDefaultValue() {
    console.log(this.$store.state.user)
    const { realName: operateUserName = '' } = this.$store.state.user || {}
    const { id } = this.selected[0] || {}
    this.formData = {
      ...this.formData,
      monitorSiteIds: String(id),
      operateUserName,
      operateTime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
