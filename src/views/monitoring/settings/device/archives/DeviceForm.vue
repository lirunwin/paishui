<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" width="876px" top="7vh">
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
            v-for="{ name, label, type, required, options, onChange, disabled, ...rest } of formItems"
            :key="name"
            :required="required"
            :label="label"
            :prop="name"
          >
            <el-date-picker
              v-if="type === 'date'"
              v-model="formData[name]"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :disabled="disabled"
              :placeholder="`请选择${label}`"
              clearable
              size="small"
              v-bind="rest"
            />
            <el-select
              v-else-if="type === 'select'"
              v-model="formData[name]"
              filterable
              :placeholder="`请选择${label}`"
              size="small"
              clearable
              v-bind="rest"
              @change="onChange"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-input
              v-else
              v-model="formData[name]"
              :type="type || 'text'"
              :disabled="disabled"
              :placeholder="name === 'no' ? '系统自动添加' : `请输入${label}`"
              size="small"
              clearable
              v-bind="rest"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        设备照片
        <span style="margin-left:5px; color:#ccc">(最多上传9张)</span>
        <div style="margin-top:20px" class="upload">
          <el-upload
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemovePic"
            multiple
            :auto-upload="false"
            :file-list="formData.fileList"
            :on-change="onFileChange"
            action="whatever"
            accept=".jpg,.jpeg,.png"
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
import { IDeviceType, IDevice, typeParamsPage } from '@/views/monitoring/api'
import { ElForm } from 'element-ui/types/form'
import { getRemoteImg } from '@/api/ftp'
import { ElUploadInternalFileDetail } from 'element-ui/types/upload'

const getDefaultValue = (): IDevice => ({
  name: '',
  no: '',
  sn: '',
  model: '',
  type: '',
  companyName: '',
  companyUser: '',
  companyPhone: '',
  purchaseTime: '',
  note: ''
})

@Component({ name: 'TypeForm', components: { BaseDialog, BaseTitle } })
export default class TypeForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Array, default: () => [] }) types!: IDeviceType[]
  $refs!: { form: ElForm }
  dialogVisible = false
  dialogImageUrl = ''
  formData: Omit<IDevice, 'fileList'> & { fileList?: Partial<ElUploadInternalFileDetail>[]; param?: string } = {
    ...getDefaultValue(),
    fileList: [],
    param: ''
  }

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  get formItems() {
    return [
      {
        label: '设备名称',
        name: 'name',
        required: true,
        maxlength: 50
      },
      {
        /** ①	设备编码: 系统维护。编码规则: 项目编号 + JCSB_+ 4位流水号，如: HN01JCSB0004。（JCSB表示监测设备） */
        label: '设备编码',
        name: 'no',
        disabled: true,
        maxlength: 64
      },
      {
        /** ②	设备出厂唯一编号: 必填，自定义录入文本，要求与设备上的信息一致。 */
        label: '出厂编码',
        name: 'sn',
        maxlength: 64
      },
      {
        /** ③	设备型号: 必填，自定义录入文本。 */
        label: '设备型号',
        name: 'model',
        maxlength: 50
      },
      {
        /** ④	设备类型: 必填，下拉框，在【设备类型配置】中配置的设备类型。 */
        label: '设备类型',
        name: 'type',
        type: 'select',
        required: true,
        options: this.types,
        onChange: this.getAllTypeParams
      },
      {
        /** ⑤	监测参数: 系统自动显示，根据设备类型关联显示该设备监测参数。 */
        label: '监测参数',
        name: 'param',
        type: 'textarea',
        rows: 3,
        disabled: true
      },
      {
        /** ⑥	设备厂商: 必填，自定义录入文本。 */
        label: '设备厂商',
        name: 'companyName',
        maxlength: 50
      },
      {
        /** ⑦	厂家联系人: 必填，自定义录入文本。 */
        label: '厂家联系人',
        name: 'companyUser',
        maxlength: 50
      },
      {
        /** ⑧	联系方式: 必填，自定义录入文本。 */
        label: '联系方式',
        name: 'companyPhone',
        maxlength: 50
      },
      {
        /** ⑨	采购时间: 必填，自定义录入文本。 */
        label: '采购时间',
        name: 'purchaseTime',
        type: 'date',
        style: 'width:100%'
      },
      {
        label: '备注',
        name: 'note',
        type: 'textarea',
        maxlength: 256
      }
      // {
      //   /** ⑩	设备照片: 选填，最多上传9张，格式支持jpg、jpeg、png，单个图片大小不超过10M，上传后照片压缩不超过1M，同时生成一套缩略图，用于前端展示。 */
      //   label: '设备照片',
      //   name: 'photo',
      //   type: 'textarea'
      // }
    ]
  }

  rules = {
    name: [
      { required: true, message: '设备名称不能为空！' },
      { max: 50, message: '设备名称不超过50个字符' },
      { pattern: /^[\u4e00-\u9fa5\w -]+$/, message: '允许输入汉字、英文、数字' }
    ],
    /** ①	设备编码: 系统维护。编码规则: 项目编号 + JCSB_+ 4位流水号，如: HN01JCSB0004。（JCSB表示监测设备） */
    // no: [
    //   { type: 'string', max: 128, message: '设备编码不能超过128个字符' }
    // ],
    // /** ②	设备出厂唯一编号: 必填，自定义录入文本，要求与设备上的信息一致。 */
    // sn: [
    //   { type: 'string', max: 128, message: '设备SN码不能超过128个字符' }
    // ],
    // /** ③	设备型号: 必填，自定义录入文本。 */
    // model: [
    //   { type: 'string', max: 128, message: '设备型号不能超过128个字符' }
    // ],
    /** ④	设备类型: 必填，下拉框，在【设备类型配置】中配置的设备类型。 */
    type: [{ required: true, message: '请选择设备类型' }]
    /** ⑤	监测参数: 系统自动显示，根据设备类型关联显示该设备监测参数。 */
    // param: []
    /** ⑥	设备厂商: 必填，自定义录入文本。 */
    // companyName: [{ type: 'string', max: 50, message: '设备厂商不能超过50个字符' }],
    /** ⑦	厂家联系人: 必填，自定义录入文本。 */
    // companyUser: [{ type: 'string', max: 50, message: '厂家联系人不能超过50个字符' }],
    /** ⑧	联系方式: 必填，自定义录入文本。 */
    // companyPhone: [{ type: 'string', max: 50, message: '联系方式不能超过50个字符' }],
    /** ⑨	采购时间: 必填，自定义录入文本。 */
    // purchaseTime: [{ type: 'string', max: 10, message: '采购时间不能超过10个字符' }],
    // note: [{ type: 'string', required: false, max: 255, message: '备注不能超过255个字符' }]
  }

  /** 没有查询全部类型参数的接口, 暂用分页接口 */
  async getAllTypeParams(typeId: string) {
    try {
      const {
        result: { records }
      } = await typeParamsPage({ typeId, current: 1, size: 9999999 })
      this.formData = { ...this.formData, param: records.length ? records.map((item) => item.name).join(', ') : '无' }
    } catch (error) {
      console.log(error)
    }
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        const { param, fileList, ...rest } = this.formData
        this.$emit('submit', { ...rest, fileList: fileList.map(({ raw }) => raw) })
      }
    })
  }

  onFileChange(file, fileList) {
    console.log(fileList)
    const isJPG = file.raw.type === 'image/jpeg'
    const isPng = file.raw.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2
    let needRemove = false
    if (!isJPG && !isPng) {
      this.$message.error('上传图片只能是 JPG/JPEG或png 格式!')
      needRemove = true
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!')
      needRemove = true
    }
    if (fileList.length > 9) {
      this.$message.error('最多可以上传9张图片!')
      needRemove = true
    }

    this.formData.fileList = needRemove ? fileList.filter((item) => item.uid !== file.uid) : [...fileList]
  }

  handleRemovePic(file, fileList) {
    this.formData.fileList = fileList.filter((item) => item.uid !== file.uid)
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    this.formData = val.id
      ? {
          ...val,
          fileList: (val.filePathList || []).map((path, index) => ({
            name: path,
            url: getRemoteImg(path),
            uid: +new Date() + index
          }))
        }
      : { ...getDefaultValue(), param: '', fileList: [] }
    if (val.type) this.getAllTypeParams(val.type)
  }
}
</script>
<style lang="scss" scoped>
.upload {
  /deep/ .el-upload-list--picture-card .el-upload-list__item,
  /deep/ .el-upload--picture-card {
    width: 120px;
    height: 120px;
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
