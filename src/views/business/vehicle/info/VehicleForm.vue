<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading" width="678px">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'small' }" :model="formData" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="车牌号" prop="carNo">
            <el-input
              v-model="formData.carNo"
              size="small"
              placeholder="请输入车牌号"
              clearable
              maxlength="20"
              :disabled="data.isUsed"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="type">
            <el-input v-model="formData.type" size="small" placeholder="请输入车辆类型" clearable maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆型号" prop="model">
            <el-input v-model="formData.model" size="small" placeholder="请输入车辆型号" clearable maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理部门" prop="department">
            <el-select
              v-model="formData.department"
              size="small"
              clearable
              filterable
              placeholder="请选择管理部门"
              @change="onDepartmentChange"
            >
              <el-option v-for="dept of departments" :key="dept.id" :value="String(dept.id)" :label="dept.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="chargePerson">
            <el-select
              v-model="formData.chargePerson"
              size="small"
              clearable
              filterable
              placeholder="请选择负责人"
              @change="onChargePeopleChange"
            >
              <el-option v-for="user of users" :key="user.id" :value="String(user.id)" :label="user.realName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="formData.phone" size="small" placeholder="请输入联系方式" clearable maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态:" prop="status">
            <el-radio-group v-model="formData.status" size="small">
              <el-radio v-for="(value, key) of DICTONARY.vehicle.status" :key="key" :label="key">
                {{ value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="note">
            <el-input
              v-model="formData.note"
              type="textarea"
              size="small"
              placeholder="请输入备注"
              clearable
              maxlength="255"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import { IVehicle, IDepartment } from '../../api'
import { DICTONARY } from '../../utils'
import { telAndMobileReg } from '@/utils/constant'

type IFormData = Partial<IVehicle>

const getDefaultData = (): IFormData => ({ status: '1', chargePerson: undefined, phone: undefined })

@Component({ components: { BaseDialog, BaseTitle } })
export default class ReportAndAssignForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IVehicle
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: Array, default: () => [] }) departments!: IDepartment[]
  $refs!: { form: ElForm }
  DICTONARY = DICTONARY

  formData: IFormData = getDefaultData()
  enable = { coordinate: true, device: true }

  get users() {
    const { users } = this.departments.find((item) => String(item.id) === this.formData.department) || {}
    return users
  }

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  rules = {
    carNo: [{ required: true, message: '请输入车牌号' }],
    department: [{ required: true, message: '请选择管理部门' }],
    chargePerson: [{ required: true, message: '请选择负责人' }],
    phone: [{ pattern: telAndMobileReg(), message: '请输入正确的联系方式' }]
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        this.$emit('submit', { ...this.formData })
      }
    })
  }

  onDepartmentChange() {
    this.formData.chargePerson = undefined
    this.formData.phone = undefined
  }

  onChargePeopleChange(id: string) {
    const { phone } = this.users.find((user) => String(user.id) === id) || {}
    if (phone) {
      this.formData.phone = phone
    }
  }

  @Watch('data', { immediate: true })
  async setDefaultData({ id, department, chargePerson, ...rest }: IVehicle) {
    this.formData = getDefaultData()
    if (id) {
      this.formData = {
        ...this.formData,
        id,
        chargePerson: String(chargePerson),
        department: String(department),
        ...rest
      }
    }
  }
}
</script>

<style lang="scss"></style>
