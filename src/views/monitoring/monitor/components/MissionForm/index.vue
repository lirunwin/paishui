<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit" width="768px">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="24">
          <BaseTitle>基本信息</BaseTitle>
        </el-col>
        <el-col :span="10">
          <el-form-item label="工单类型" prop="info">
            <el-input value="监测报警" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="地址" prop="info">
            <el-input value="四川省成都市青羊区光华大道25号" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题描述" prop="info">
            <el-input
              value="【童家河入河口水质监测点】2022-03-01 09:03:03  发生【严重报警】。化学需氧量【严重报警：90-100】，监测值为97.13 mg/L ，浊度【中度报警：200-300】，监测值为211.76 NTU。"
              type="textarea"
              :rows="3"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <BaseTitle>派工信息</BaseTitle>
        </el-col>

        <el-col :span="12">
          <el-form-item label="紧急程度" prop="info" required>
            <el-select v-model="formData.code" placeholder="请选择紧急程度">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="处理部门" prop="info" required>
            <el-select v-model="formData.code" placeholder="请选择处理部门">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="处理负责人" prop="info" required>
            <el-select v-model="formData.code" placeholder="请选择处理负责人">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="协同处理人" prop="info">
            <el-select v-model="formData.code" placeholder="请选择协同处理人">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="info" required>
            <el-input v-model="formData.code" placeholder="请输入图标代码" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否发送短信" prop="info" required>
            <el-radio-group v-model="formData.radio">
              <el-radio :label="3">是</el-radio>
              <el-radio :label="6">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="处理方案" prop="info">
            <el-input v-model="formData.code" type="textarea" placeholder="请输入图标代码" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'

@Component({ name: 'IconForm', components: { BaseDialog, BaseTitle } })
export default class IconForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  formData = {}
  fileList = []

  rules = {
    icon: [{ required: true, message: '请选择图标' }],
    code: [
      { required: true, message: '请输入图标代码' },
      { type: 'string', max: 50, message: '图标代码不能超过50个字符' }
    ],
    name: [
      { required: true, message: '请输入图标名称' },
      { type: 'string', max: 50, message: '图标名称不能超过50个字符' }
    ],

    note: [{ type: 'string', required: false, max: 255, message: '备注不能超过255个字符' }]
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
}
</script>
<style lang="scss" scoped></style>
