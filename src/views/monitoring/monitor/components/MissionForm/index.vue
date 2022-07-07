<template>
  <tf-dialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit" width="768px" ref="dialog">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="24">
          <tf-title>基本信息</tf-title>
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
          <tf-title>派工信息</tf-title>
        </el-col>

        <el-col :span="12">
          <el-form-item label="紧急程度" prop="aaa" required>
            <el-select v-model="formData.aaa" placeholder="请选择紧急程度">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="处理部门" prop="bbb" required>
            <el-select v-model="formData.bbb" placeholder="请选择处理部门">
              <el-option value="q">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="处理负责人" prop="ccc" required>
            <el-select v-model="formData.ccc" placeholder="请选择处理负责人">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="协同处理人" prop="ddd">
            <el-select v-model="formData.ddd" placeholder="请选择协同处理人">
              <el-option value="">全部</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="eee" required>
            <el-input v-model="formData.eee" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否发送短信" prop="fff" required>
            <el-radio-group v-model="formData.fff">
              <el-radio :label="3">是</el-radio>
              <el-radio :label="6">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="处理方案" prop="ggg">
            <el-input v-model="formData.ggg" type="textarea" placeholder="请输入处理方案" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </tf-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({ name: 'IconForm', components: {} })
export default class IconForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  formData: {
    [x: string]: string
  } = {}
  fileList = []

  rules = {
    aaa: [{ required: true, message: '请选择紧急程度' }],
    bbb: [{ required: true, message: '请选择处理部门' }],
    ccc: [{ required: true, message: '请选择处理负责人' }],
    eee: [{ required: true, message: '请输入联系电话' }],
    fff: [{ required: true, message: '请选择是否发送短信' }],
    ggg: [{ type: 'string', required: false, max: 255, message: '处理方案不能超过255个字符' }]
  }

  onSubmit() {
    console.log(this.$refs['dialog'])
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
