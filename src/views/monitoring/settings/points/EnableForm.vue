<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" :rules="rules">
      <el-tooltip :content="no" placement="top">
        <el-form-item required label="监测点编号" prop="monitorSiteIds">
          <el-input v-model="no" disabled clearable />
        </el-form-item>
      </el-tooltip>

      <el-form-item required label="修改人" prop="operateUserName">
        <el-input v-model="formData.operateUserName" placeholder="请输入修改人" clearable />
      </el-form-item>
      <el-form-item required label="修改时间" prop="operateTime">
        <el-date-picker
          type="datetime"
          v-model="formData.operateTime"
          placeholder="请选择修改时间"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width:100%"
        />
      </el-form-item>
      <el-form-item required label="站点状态" prop="type">
        <el-switch v-model="formData.type" active-value="start" inactive-value="stop" />
      </el-form-item>
      <el-form-item label="说明" prop="note">
        <el-input v-model="formData.note" type="textarea" :rows="4" clearable />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import { ElForm } from 'element-ui/types/form'
import { IPointConnectDevice, IPointEnableParams } from '@/views/monitoring/api'

@Component({ name: 'EnableForm', components: { BaseDialog } })
export default class EnableForm extends Vue {
  @Prop({ type: Array, default: () => [] }) selected!: IPointConnectDevice[]
  @Prop({ type: Object, default: () => ({}) }) data!: IPointConnectDevice
  @Prop({ type: Boolean, default: () => false }) loading!: boolean
  $refs!: { form: ElForm }
  formData: IPointEnableParams = { monitorSiteIds: '', operateUserName: '', operateTime: '', type: 'stop', note: '' }

  no: string = ''

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  rules = {
    operateUserName: [{ required: true, message: '请输入操作人姓名' }],
    operateTime: [{ required: true, message: '请选择修改时间' }],
    type: [{ required: true, message: '请选择站点状态' }],
    note: [{ required: false, max: 255, message: '说明最长为255个字符' }]
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        this.$emit('submit', this.formData)
      }
    })
  }

  @Watch('data', { immediate: true })
  setDefaultValue(val: IPointConnectDevice) {
    const { realName: operateUserName = '' } = this.$store.state.user || {}

    const disabledPoints = !val.id
      ? this.selected.filter((item) => item.status !== '1')
      : val.status === '1'
      ? []
      : [val]

    this.formData = {
      monitorSiteIds: val.id
        ? String(val.id)
        : (disabledPoints.length ? disabledPoints : this.selected).map((item) => item.id).join(),
      operateUserName,
      operateTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      type: val.id ? (val.status === '1' ? 'stop' : 'start') : disabledPoints.length ? 'start' : 'stop',
      note: ''
    }

    this.no = val.id
      ? val.no
      : (disabledPoints.length ? disabledPoints : this.selected).map((item) => item.no).join(', ')
  }
}
</script>
