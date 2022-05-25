<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="listeners"
    @submit="onSubmit"
    :loading="loading"
    width="768px"
    @open="onOpen"
    :disabled="disabled"
  >
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" :rules="rules">
      <template v-for="form of formItems">
        <template>
          <BaseTitle :key="`title-${form.name}`">{{ form.name }}</BaseTitle>
        </template>
        <template>
          <el-row :key="form.name" :gutter="20">
            <el-col
              v-for="{
                label,
                name,
                col,
                type = 'text',
                disabled,
                required,
                rows,
                options = [],
                onChange,
                ...rest
              } of form.items"
              :span="col"
              :key="name"
            >
              <el-form-item :label="label" :prop="name" :required="required">
                <template v-if="type === 'cascader'">
                  <el-cascader
                    popper-class="cascader"
                    v-model="formData[name]"
                    :placeholder="`请选择${label}`"
                    :options="options"
                    :props="{ expandTrigger: 'hover', label: 'name', value: 'id', checkStrictly: true }"
                    size="small"
                    style="width:100%"
                    filterable
                    clearable
                    @change="onChange"
                  />
                </template>
                <template v-else-if="type === 'select'">
                  <el-select
                    v-model="formData[name]"
                    :placeholder="`请选择${label}`"
                    v-bind="rest"
                    clearable
                    size="small"
                    @change="onChange"
                  >
                    <el-option
                      v-for="item of options"
                      :key="item.id"
                      :index="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </template>
                <template v-else>
                  <el-input
                    :type="type || 'text'"
                    v-model="formData[name]"
                    :placeholder="name === 'no' ? '系统生成' : `请输入${label}`"
                    :disabled="disabled"
                    :rows="rows"
                    size="small"
                    clearable
                    v-bind="rest"
                  />
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </template>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import { getDepartments, getUsers } from './api'

@Component({ name: 'DeviceForm', components: { BaseDialog, BaseTitle } })
export default class DeviceForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: { id?: string; dataSource?: 'web' | 'app' }
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean

  get isApp(): boolean {
    return (this.data || {}).dataSource === 'app'
  }

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  dialogVisible = false
  dialogImageUrl = ''
  formData: { [x: string]: any } = { useDeptId: [] }
  departments = []
  users = []
  get formItems(): {
    name: string
    items: {
      label: string
      name: string
      col?: number
      type?: string
      disabled?: boolean
      required?: boolean
      rows?: number
      options?: { id?: string; name?: string }[]
      onChange?: (val: any) => void
      [x: string]: any
    }[]
  }[] {
    return [
      {
        name: '基本信息',
        items: [
          { label: '设备编号', name: 'no', col: 12, disabled: true },
          { label: '设备名称', name: 'name', col: 12, disabled: this.isApp, required: !this.isApp },
          { label: '设备型号', name: 'type', col: 12, disabled: this.isApp, required: !this.isApp },
          { label: '设备手机号', name: 'devicePhone', col: 12, required: !this.isApp, type: 'tel' },
          { label: '设备序列号', name: 'meid', col: 24, disabled: this.isApp, required: !this.isApp },
          { label: '备注', name: 'note', col: 24, type: 'textarea', rows: 3 }
        ]
      },
      {
        name: '绑定人员',
        items: [
          {
            label: '使用部门',
            name: 'useDeptId',
            col: 12,
            type: 'cascader',
            options: this.deptmentTree,
            required: true,
            onChange: () => {
              this.formData.userUserId && this.$set(this.formData, 'userUserId', '')
            }
          },
          {
            label: '使用人员',
            name: 'userUserId',
            col: 12,
            type: 'select',
            options: this.users,
            required: true,
            onChange: this.onUserChange
          },
          { label: '员工编号', name: 'worknumber', col: 12, disabled: true },
          { label: '联系电话', name: 'phone', col: 12, disabled: true, type: 'tel' }
        ]
      }
    ]
  }

  rules = {
    name: [{ required: true, message: '请输入设备名称' }],
    type: [{ required: true, message: '请输入设备型号' }],
    meid: [{ required: true, message: '请输入设备序列号' }],
    devicePhone: [
      { required: true, message: '请输入手机号' },
      { type: 'string', pattern: /^1\d{10}$/, message: '请输入正确的手机号' }
    ],
    note: [{ type: 'string', max: 255, message: '备注不能超过255个字符' }],
    useDeptId: [
      {
        type: 'array',
        required: true,
        message: '请选择使用部门',
        fields: [{ type: 'number', required: true, message: '请选择使用部门' }]
      }
    ],
    userUserId: [{ required: true, message: '请选择使用人员' }]
  }

  onSubmit() {
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        const { useDeptId } = this.formData
        this.$emit('submit', { ...this.formData, useDeptId: useDeptId[useDeptId.length - 1] })
      }
    })
  }

  onUserChange(val) {
    const { worknumber, phone } = this.users.find(({ id }) => id === val) || {}
    this.formData = { ...this.formData, worknumber, phone }
  }

  get deptmentTree() {
    const getChildren = (parent) => {
      const { id: parentId } = parent
      const children = this.departments.filter((item) => item.parentId === parentId)
      if (!!children.length) parent.children = children.map(getChildren)
      return parent
    }
    return this.departments.filter((item) => !item.parentId).map(getChildren)
  }

  fetchingDepartments = false

  async onOpen() {
    if (this.fetchingDepartments) return
    this.fetchingDepartments = true
    try {
      const { result = [] } = (await getDepartments()) || {}
      this.departments = result
    } catch (error) {
      console.log(error)
    }
    this.fetchingDepartments = false
  }

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const temp = val || {}
    this.formData = { ...temp, useDeptId: [temp.useDeptId] }
    setTimeout(() => {
      if (!this.fetchingDepartments) this.onOpen()
    }, 0)
  }

  get useDeptId() {
    const { useDeptId = [] } = this.formData
    return useDeptId[useDeptId.length - 1]
  }

  @Watch('useDeptId')
  async getUsersByDepartmentId(val, oldVal) {
    // console.log(val, oldVal)
    this.users = []
    if (val && this.$attrs.visible) {
      const { result = [] } = (await getUsers(val)) || {}
      this.users = (result || []).map(({ id, realName: name, username, ...rest }) => ({
        id,
        name: `${name} | ${username}`,
        ...rest
      }))
      this.onUserChange(this.formData.userUserId)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  /deep/ .el-upload-list--picture-card .el-upload-list__item,
  /deep/ .el-upload--picture-card {
    width: 128px;
    height: 128px;
  }
  /deep/ .el-upload--picture-card {
    line-height: normal;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
.preview {
  /deep/ .el-dialog .el-dialog__header {
    border-bottom: 0;
  }
}
</style>
