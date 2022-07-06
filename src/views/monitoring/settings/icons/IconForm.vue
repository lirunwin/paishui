<template>
  <tf-dialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit" width="600px">
    <tf-title>设备基本信息</tf-title>
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row type="flex" align="middle">
            <el-col style="flex: 1">
              <el-form-item required label="图标选择" prop="icon">
                <el-input
                  v-model="formData.icon"
                  readonly
                  size="small"
                  placeholder="点击 + 开始上传"
                  clearable
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">
              <el-form-item label-width="0">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="fileList"
                  :show-file-list="false"
                >
                  <el-button size="small" type="primary" icon="el-icon-plus" class="btn-upload" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="图标基本信息" prop="info">
            <div class="img-info">文件类型: 图标<br />格式: png<br />尺寸: 32*32</div>
          </el-form-item>
          <el-form-item label="图标代码" prop="code" required>
            <el-input v-model="formData.code" placeholder="请输入图标代码" />
          </el-form-item>
          <el-form-item label="图标名称" prop="name" required>
            <el-input v-model="formData.name" placeholder="请输入图标名称" />
          </el-form-item>
          <el-form-item label="图标分组" prop="team">
            <el-input v-model="formData.team" placeholder="请输入图标分组" />
          </el-form-item>
        </el-col>
        <el-col :span="8"> 对接upload接口后再说 </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="note">
            <el-input v-model="formData.note" type="textarea" rows="2" placeholder="请输入备注" />
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
  dialogVisible = false
  dialogImageUrl = ''
  formData: { [x: string]: string } = {}
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

  handleRemove(file, fileList) {
    console.log(file, fileList)
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    this.formData = val || {}
  }
}
</script>
<style lang="scss" scoped>
.img-info {
  background-color: #ccc;
  border-radius: $radius5;
  padding: 10px;
  font-size: 85%;
  line-height: 1.4;
}

.btn-upload {
  padding: 8px 8px 9px;
  transform: translateY(-1px);
}
</style>
