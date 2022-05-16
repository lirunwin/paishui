<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit" width="876px" top="7vh">
    <BaseTitle>设备基本信息</BaseTitle>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form
          class="form"
          ref="form"
          v-bind="{ labelWidth: '8em', size: 'medium' }"
          :model="formData"
          :rules="rules"
        >
          <el-form-item
            v-for="{ name, label, type, required = true, disabled } of formItems"
            :key="name"
            :required="required"
            :label="label"
            :prop="name"
          >
            <el-input
              :type="type || 'text'"
              v-model="formData[name]"
              :disabled="disabled"
              :placeholder="`请输入${label}`"
              clearable
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        设备照片
        <span style="margin-left:5px; color:#ccc">(最多上传9张)</span>
        <div style="margin-top:20px" class="upload">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>

        <el-dialog :visible.sync="dialogVisible" title="" append-to-body class="preview">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-col>
    </el-row>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'

@Component({ name: 'TypeForm', components: { BaseDialog, BaseTitle } })
export default class TypeForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  dialogVisible = false
  dialogImageUrl = ''
  formData: { [x: string]: string } = {}
  formItems: {
    label: string
    name: string
    type?: string
    required?: boolean
    disabled?: boolean
  }[] = [
    {
      /** ①	设备编码: 系统维护。编码规则: 项目编号 + JCSB_+ 4位流水号，如: HN01JCSB0004。（JCSB表示监测设备） */
      label: '设备编码',
      name: 'no'
    },
    {
      /** ②	设备出厂唯一编号: 必填，自定义录入文本，要求与设备上的信息一致。 */
      label: '设备SN码',
      name: 'no1'
    },
    {
      /** ③	设备型号: 必填，自定义录入文本。 */
      label: '设备型号',
      name: 'mode'
    },
    {
      /** ④	设备类型: 必填，下拉框，在【设备类型配置】中配置的设备类型。 */
      label: '设备类型',
      name: 'type',
      type: 'select'
    },
    {
      /** ⑤	监测参数: 系统自动显示，根据设备类型关联显示该设备监测参数。 */
      label: '监测参数',
      name: 'param',
      type: 'textarea',
      required: false,
      disabled: true
    },
    {
      /** ⑥	设备厂商: 必填，自定义录入文本。 */
      label: '设备厂商',
      name: 'factor'
    },
    {
      /** ⑦	厂家联系人: 必填，自定义录入文本。 */
      label: '厂家联系人',
      name: 'name'
    },
    {
      /** ⑧	联系方式: 必填，自定义录入文本。 */
      label: '联系方式',
      name: 'tel'
    },
    {
      /** ⑨	采购时间: 必填，自定义录入文本。 */
      label: '采购时间',
      name: 'date'
    },
    {
      label: '备注',
      name: 'note',
      type: 'textarea',
      required: false
    }
    // {
    //   /** ⑩	设备照片: 选填，最多上传9张，格式支持jpg、jpeg、png，单个图片大小不超过10M，上传后照片压缩不超过1M，同时生成一套缩略图，用于前端展示。 */
    //   label: '设备照片',
    //   name: 'photo',
    //   type: 'textarea'
    // }
  ]
  rules = {
    /** ①	设备编码: 系统维护。编码规则: 项目编号 + JCSB_+ 4位流水号，如: HN01JCSB0004。（JCSB表示监测设备） */
    no: [
      { required: true, message: '设备编码不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '设备编码不能超过50个字符' }
    ],
    /** ②	设备出厂唯一编号: 必填，自定义录入文本，要求与设备上的信息一致。 */
    no1: [
      { required: true, message: '设备SN码不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '设备SN码不能超过50个字符' }
    ],
    /** ③	设备型号: 必填，自定义录入文本。 */
    mode: [
      { required: true, message: '设备型号不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '设备型号不能超过50个字符' }
    ],
    /** ④	设备类型: 必填，下拉框，在【设备类型配置】中配置的设备类型。 */
    type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
    /** ⑤	监测参数: 系统自动显示，根据设备类型关联显示该设备监测参数。 */
    param: [],
    /** ⑥	设备厂商: 必填，自定义录入文本。 */
    factor: [
      { required: true, message: '设备厂商不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '设备厂商不能超过50个字符' }
    ],
    /** ⑦	厂家联系人: 必填，自定义录入文本。 */
    name: [
      { required: true, message: '厂家联系人不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '厂家联系人不能超过50个字符' }
    ],
    /** ⑧	联系方式: 必填，自定义录入文本。 */
    tel: [
      { required: true, message: '联系方式不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '联系方式不能超过50个字符' }
    ],
    /** ⑨	采购时间: 必填，自定义录入文本。 */
    date: [
      { required: true, message: '采购时间不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '采购时间不能超过50个字符' }
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
