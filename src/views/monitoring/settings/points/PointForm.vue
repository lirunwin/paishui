<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" @closed="onClosed" width="876px" top="7vh">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" :rules="rules">
      <template v-for="{ name: sectionName, title, items } of formItems">
        <template>
          <BaseTitle :key="`${sectionName}-title`">{{ title }}</BaseTitle>
        </template>
        <el-row v-if="sectionName === 'siteFacility'" :key="`${sectionName}-items`" :gutter="20">
          <el-col :span="12">
            <el-row type="flex" :gutter="10">
              <el-col>
                <el-form-item label="关联设施" :prop="`${sectionName}.facility`">
                  <el-input
                    v-model="formData[sectionName]['facility']"
                    placeholder="请选择排水设施"
                    size="small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col style="flex: 0 0 5em; text-align: center">
                <el-button
                  :type="enable.device ? 'warning' : 'primary'"
                  @click="enable.device = !enable.device"
                  :disabled="enable.coordinate || !formData.basis.coordiateX || !formData.basis.coordiateY"
                  size="small"
                  >图上选点</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" />
          <el-col v-for="{ name, label } of items.filter((item) => item.type === 'txt')" :key="name" :span="8">
            <el-form-item :label="`${label}: `" :prop="name">
              <span>{{ formData.siteFacility[name] }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" :prop="`${sectionName}.facilityNote`">
              <el-input
                type="textarea"
                v-model="formData[sectionName]['facilityNote']"
                placeholder="请输入备注"
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else :gutter="20" :key="`else-${sectionName}-items`" type="flex">
          <el-col :span="12">
            <el-form-item
              v-for="{
                name,
                label,
                required = false,
                type = 'text',
                disabled = false,
                options,
                optionDisabledKey,
                onChange,
                formatter
              } of items"
              :key="name"
              :label="label"
              :prop="name !== 'coordinate' ? `${sectionName}.${name}` : ''"
              :required="required"
              :show-message="name !== 'coordinate'"
              :style="name === 'coordinate' ? 'margin-bottom:0' : ''"
            >
              <template v-if="name === 'coordinate'">
                <el-row type="flex" justify="space-between" :gutter="10">
                  <el-col>
                    <el-form-item :prop="`${sectionName}.coordiateX`">
                      <el-input-number
                        v-model="formData[sectionName].coordiateX"
                        placeholder="经度"
                        v-bind="getDefalutNumberProp()"
                        :precision="7"
                        :controls="false"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col style="flex: 0 0 1em; text-align: center"> ~ </el-col>
                  <el-col>
                    <el-form-item :prop="`${sectionName}.coordiateY`">
                      <el-input-number
                        v-model="formData[sectionName].coordiateY"
                        placeholder="纬度"
                        v-bind="getDefalutNumberProp()"
                        :precision="7"
                        :controls="false"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col style="flex: 0 0 5em; text-align: center">
                    <el-button
                      :type="enable.coordinate ? 'warning' : 'primary'"
                      @click="enable.coordinate = !enable.coordinate"
                      :disabled="enable.device"
                      size="small"
                      >图上选点</el-button
                    >
                  </el-col>
                </el-row>
              </template>
              <template v-else-if="type === 'select'">
                <el-select
                  v-model="formData[sectionName][name]"
                  :placeholder="`请选择${label}`"
                  clearable
                  filterable
                  v-on="onChange ? { change: onChange } : {}"
                >
                  <el-option
                    v-for="item of options"
                    :key="item.id"
                    :value="item.id"
                    :label="formatter ? formatter(item) : item.name"
                    :disabled="
                      data.id ? data[sectionName][name] !== item.id && item[optionDisabledKey] : item[optionDisabledKey]
                    "
                  >
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="type === 'date'">
                <el-date-picker
                  v-model="formData[sectionName][name]"
                  :placeholder="`请选择${label}`"
                  :disabled="disabled"
                  size="small"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  clearable
                />
              </template>
              <template v-else>
                <el-input
                  v-model="formData[sectionName][name]"
                  :type="type || 'text'"
                  :disabled="disabled"
                  :placeholder="name === 'no' ? '系统自动添加' : `请输入${label}`"
                  clearable
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <template v-if="sectionName === 'bindDevice'">
              <div style="line-height: 32px; margin-bottom: 20px">
                现场安装照片
                <span style="margin-left: 5px; color: #ccc">(最多上传9张)</span>
              </div>
              <div class="upload">
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
            </template>
            <template v-else>
              <Map
                @coordinate-change="onCoordinateChange"
                @device-change="onDeviceChange"
                :enableCoordinateSelect="enable.coordinate"
                :enableDeviceSelect="enable.device"
                :center="mapCenter"
              />
            </template>
          </el-col>
        </el-row>
      </template>
      <el-dialog :visible.sync="dialogVisible" title="" append-to-body class="preview">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { IPointConnectDevice, IDeviceType, IDevice, devicesAvailable } from '@/views/monitoring/api'
import { ElForm } from 'element-ui/types/form'
import { getDefalutNumberProp } from '@/views/monitoring/utils'
import { telAndMobileReg } from '@/utils/constant'
import { ElUploadInternalFileDetail } from 'element-ui/types/upload'
import { getRemoteImg } from '@/api/ftp'
import Map from './Map.vue'

interface FormItem {
  name?: string
  title?: string
  items?: {
    label?: string
    name?: string
    type?: string
    disabled?: boolean
    required?: boolean
    options?: any[]
    optionDisabledKey?: string
    onChange?: (val: any) => void
    formatter?: (row: { [x: string]: any }) => string
  }[]
}

const defaultFormData = () => ({
  basis: {
    coordiateX: undefined,
    coordiateY: undefined,
    name: '',
    code: '',
    psArea: '',
    siteGroup: '',
    address: '',
    note: ''
  },
  siteFacility: { facility: '', facilityNote: '', facilityCode: '', facilityType: '', facilityRoadName: '' },
  bindDevice: { typeId: '', deviceId: '', installUser: '', installPhone: '', installTime: '' },
  fileList: []
})

interface IFormData extends IPointConnectDevice {
  basis: Omit<IPointConnectDevice, 'siteFacility' | 'bindDevice'>
  fileList?: Partial<ElUploadInternalFileDetail>[]
}

@Component({ name: 'PointForm', components: { BaseDialog, BaseTitle, BaseTable, Map } })
export default class PointForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IFormData
  @Prop({ type: Array, default: () => [] }) types!: IDeviceType[]
  $refs!: { form: ElForm }

  getDefalutNumberProp = getDefalutNumberProp
  get listeners() {
    const { submit, closed, ...rest } = this.$listeners
    return rest
  }

  get mapView() {
    return (this.$attrs.data as any).mapView
  }
  dialogVisible = false
  dialogImageUrl = ''
  formData: IFormData = defaultFormData()

  archives: IDevice[] = []

  mapCenter: number[] = []

  enable = { coordinate: false, device: false }

  get formItems(): FormItem[] {
    return [
      {
        name: 'basis',
        title: '监测站点基本信息',
        items: [
          { label: '监测点编号', name: 'no', disabled: true },
          { label: '监测点名称', name: 'name', required: true },
          { label: '监测点编码', name: 'code' },
          { label: '排水分区', name: 'psArea' },
          { label: '监测分组', name: 'siteGroup' },
          { label: '地址', name: 'address' },
          { label: '坐标', name: 'coordinate', required: true },
          { label: '备注', name: 'note', type: 'textarea' }
        ]
      },
      {
        name: 'siteFacility',
        title: '关联排水设施信息',
        items: [
          { label: '关联设施', name: 'facility' },
          { label: '设施编码', name: 'facilityCode', type: 'txt' },
          { label: '设施类型', name: 'facilityType', type: 'txt' },
          { label: '道路名称', name: 'facilityRoadName', type: 'txt' },
          { label: '备注', name: 'facilityNote', type: 'textarea' }
        ]
      },
      {
        name: 'bindDevice',
        title: '设备安装信息',
        items: [
          { label: '设备类型', name: 'typeId', type: 'select', options: this.types, onChange: this.onTypeChange },
          {
            label: '出厂编码',
            name: 'deviceId',
            type: 'select',
            options: this.archives,
            optionDisabledKey: 'hasBindMonitor',
            formatter: ({ sn, name }) => (sn ? `${sn} | ${name}` : name || '')
          },
          { label: '安装负责人', name: 'installUser' },
          { label: '联系电话', name: 'installPhone', type: 'tel' },
          { label: '安装时间', name: 'installTime', type: 'date' }
        ]
      }
    ]
  }

  rules = {
    'basis.name': [
      { required: true, message: '监测点名称不能为空！' },
      { type: 'string', max: 50, message: '监测点名称不能超过50个字符' }
    ],
    'basis.code': [{ type: 'string', max: 128, message: '监测点编码不能超过128个字符' }],
    'basis.address': [{ type: 'string', max: 128, message: '地址不能超过128个字符' }],
    'basis.coordiateX': [{ required: true, message: '经度不能为空' }],
    'basis.coordiateY': [{ required: true, message: '纬度不能为空' }],
    'bindDevice.typeId': [{ required: true, message: '请选择设备类型' }],
    'bindDevice.deviceId': [{ required: true, message: '请选择设备' }],
    'bindDevice.installUser': [
      { required: true, message: '安装负责人不能为空' },
      { type: 'string', max: 50, message: '安装负责人不能超过50个字符' }
    ],
    'bindDevice.installPhone': [
      { required: true, message: '联系方式不能为空！' },
      { type: 'string', max: 50, message: '联系方式不能超过50个字符' },
      { pattern: telAndMobileReg(), message: '请输入正确的联系方式' }
    ],
    'bindDevice.installTime': [{ required: true, message: '请选择安装时间' }],
    'basis.note': [{ type: 'string', required: false, max: 255, message: '备注不能超过255个字符' }]
  }

  async onTypeChange(id, reset: boolean = true) {
    try {
      reset && (this.formData.bindDevice.deviceId = '')
      const { result } = await devicesAvailable({ type: id })
      this.archives = result || []
    } catch (error) {
      console.log(error)
    }
  }

  onFileChange(file, fileList) {
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

  onSubmit() {
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        const { bindDevice = {}, siteFacility = {}, basis = {}, fileList } = this.formData
        this.$emit('submit', { ...basis, bindDevice, siteFacility, fileList: fileList.map(({ raw }) => raw) })
      }
    })
  }

  handleRemovePic(file, fileList) {
    this.formData.fileList = fileList.filter((item) => item.uid !== file.uid)
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }

  onCoordinateChange([coordiateX, coordiateY]) {
    this.mapCenter = [Number(coordiateX), Number(coordiateY)]
    this.formData.basis.coordiateX = Math.floor(coordiateX * 10000000) / 10000000
    this.formData.basis.coordiateY = Math.floor(coordiateY * 10000000) / 10000000
  }
  onDeviceChange(geo) {
    const {
      geometry,
      id,
      properties: { ADDRESS, LNO, TYPE }
    } = geo
    this.formData.siteFacility = {
      facility: id,
      facilityGeometry: JSON.stringify(geometry),
      facilityCode: LNO,
      facilityType: TYPE,
      facilityRoadName: ADDRESS
    }
  }

  @Watch('data', { immediate: true })
  setDefaultData(val: IPointConnectDevice) {
    const { id, siteFacility = {}, bindDevice = {}, coordiateX, coordiateY, ...rest } = val || {}
    const { filePathList, deviceVo } = bindDevice || {}
    const { type: typeId, id: deviceId } = deviceVo || {}
    typeId && this.onTypeChange(typeId, false)
    if (coordiateX && coordiateY) this.mapCenter = [Number(coordiateX), Number(coordiateY)]
    this.formData = val.id
      ? {
          basis: { id, coordiateX: coordiateX || undefined, coordiateY: coordiateY || undefined, ...rest },
          siteFacility: siteFacility || {},
          bindDevice: { ...(bindDevice || {}), typeId, deviceId },
          fileList: (filePathList || []).map((path, index) => ({
            name: path,
            url: getRemoteImg(path),
            uid: +new Date() + index
          }))
        }
      : defaultFormData()
  }

  onClosed() {
    this.enable = { coordinate: false, device: false }
    this.archives = []
    this.mapCenter = []
    this.$emit('closed')
  }
}
</script>

<style lang="scss" scoped>
.form {
  >>> .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
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
