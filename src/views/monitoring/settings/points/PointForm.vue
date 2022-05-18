<template>
  <BaseDialog v-bind="$attrs" v-on="$listeners" @submit="onSubmit" width="876px" top="7vh">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'small' }" :model="formData" :rules="rules">
      <template v-for="{ name: sectionName, title, items } of formItems">
        <template
          ><BaseTitle :key="`${sectionName}-title`">{{ title }}</BaseTitle></template
        >
        <el-row v-if="sectionName === 'device'" :key="`${sectionName}-items`" :gutter="20">
          <el-col :span="12">
            <el-row type="flex" :gutter="10">
              <el-col>
                <el-form-item label="关联设施" prop="device-note">
                  <el-input v-model="formData['connect-deivce']" placeholder="请选择排水设施" size="small" />
                </el-form-item>
              </el-col>
              <el-col style="flex:0 0 5em;text-align:center">
                <el-button type="primary" size="small">图上选点</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" />
          <el-col v-for="{ name, label } of items.filter((item) => item.type === 'txt')" :key="name" :span="8">
            <el-form-item :label="label" :prop="name">
              <span>asdsa</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="device-note">
              <el-input type="textarea" v-model="formData['device-note']" placeholder="请输入备注" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else :gutter="20" :key="`else-${sectionName}-items`">
          <el-col :span="12">
            <el-form-item
              v-for="{ name, label, type = 'text', required = true, disabled = false } of items"
              :key="name"
              :required="required"
              :label="label"
              :prop="name"
              :show-message="name !== 'coordinate'"
            >
              <template v-if="name === 'coordinate'">
                <el-row type="flex" justify="space-between" :gutter="10">
                  <el-col>
                    <el-form-item prop="longitude">
                      <el-input v-model="formData.longitude" placeholder="经度" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col style="flex:0 0 1em;text-align:center"> ~ </el-col>
                  <el-col>
                    <el-form-item prop="latitude">
                      <el-input v-model="formData.latitude" placeholder="纬度" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col style="flex:0 0 5em;text-align:center">
                    <el-button type="primary" size="small">图上选点</el-button>
                  </el-col>
                </el-row>
              </template>
              <template v-else-if="type === 'select'">
                <el-select
                  v-model="formData[name]"
                  :placeholder="`请输入${label}`"
                  :disabled="disabled"
                  size="small"
                  clearable
                >
                  <el-option value="" label="全部" />
                </el-select>
              </template>
              <template v-else-if="type === 'date'">
                <el-date-picker
                  v-model="formData[name]"
                  :placeholder="`请选择${label}`"
                  :disabled="disabled"
                  size="small"
                  style="width:100%"
                  clearable
                />
              </template>
              <template v-else>
                <el-input
                  v-model="formData[name]"
                  :type="type || 'text'"
                  :disabled="disabled"
                  :placeholder="`请输入${label}`"
                  clearable
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <template v-if="sectionName === 'install'">
              设备照片
              <span style="margin-left:5px; color:#ccc">(最多上传9张)</span>
              <div style="margin-top:20px" class="upload">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemovePic"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </template>
            <template v-else>
              <div>this is a map</div>
            </template>
          </el-col>
        </el-row>
      </template>
      <BaseTitle style="margin-top: 20px">监测参数基本设置</BaseTitle>
      <el-row type="flex" style="align-items:center; margin-bottom: 20px">
        监测体系
        <el-select
          v-model="formData['systemId']"
          placeholder="请输入监测体系"
          size="small"
          style="margin-left:10px; width: 200px"
          @change="onSystemChange"
        >
          <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item of systems" />
        </el-select>
      </el-row>
      <BaseTable :columns="settingPointBasisCols" :data="monitorSystems" border>
        <template v-for="(item, index) of monitorSystems" v-slot:[`index-${index}`]="{ row }">
          <el-form-item
            :key="`index-${item.id}`"
            :prop="`system[${index}].index`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].index" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of monitorSystems" v-slot:[`paramCode-${index}`]="{ row }">
          <el-form-item
            :key="`paramCode-${item.id}`"
            :prop="`system[${index}].paramCode`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].paramCode" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of monitorSystems" v-slot:[`display-${index}`]="{ row }">
          <el-form-item
            :key="`display-${item.id}`"
            :prop="`system[${index}].display`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.system[index].display" :placeholder="row.name" />
          </el-form-item>
        </template>
        <template v-for="(item, index) of monitorSystems" v-slot:[`note-${index}`]="{ row }">
          <el-form-item
            :key="`note-${item.id}`"
            :prop="`system[${index}].note`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.system[index].note" :placeholder="row.name" />
          </el-form-item>
        </template>
      </BaseTable>
      <BaseTitle style="margin-top: 20px"
        >监测参数阈值设置
        <el-button
          type="primary"
          size="small"
          style="margin: -10px 0 -10px 1em"
          @click="onParamAdd"
          :disabled="!formData.param"
          >添加</el-button
        ></BaseTitle
      >
      <BaseTable :columns="settingPointParamCols" :data="monitorSystemParams" border>
        <template v-for="(item, index) of monitorSystemParams" v-slot:[`name-${index}`]="{ row }">
          <template v-if="row.id.startsWith('__new__')">
            <el-form-item
              :key="`name-${item.id}`"
              :prop="`param[${index}].id`"
              label-width="0"
              style="margin-bottom: 0"
            >
              <el-select v-model="formData.param[index].id" :placeholder="`请选择${row.name}`">
                <el-option v-for="sys of monitorSystems" :label="sys.name" :value="sys.id" :key="sys.id" />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            {{ row.name }}
          </template>
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`value-${index}`]="{ row }">
          <el-form-item
            :key="`value-${item.id}`"
            :prop="`param[${index}].value`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-input v-model="formData.param[index].value" :placeholder="row.name" />
          </el-form-item>
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`interval-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`interval-${item.id}`">
            <el-col>
              <el-form-item :prop="`param[${index}].interval[0]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval[0]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item :prop="`param[${index}].interval[1]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval[1]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`interval1-${index}`]="{ row }">
          <el-row type="flex" align="middle" justify="space-between" :gutter="10" :key="`interval1-${item.id}`">
            <el-col>
              <el-form-item :prop="`param[${index}].interval1[0]`" label-width="0" style="margin-bottom: 0">
                <el-input v-model="formData.param[index].interval1[0]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
            <el-col style="flex: 0 0 1em">~</el-col>
            <el-col>
              <el-form-item
                :key="`interval1-${item.id}`"
                :prop="`param[${index}].interval1[1]`"
                label-width="0"
                style="margin-bottom: 0"
              >
                <el-input v-model="formData.param[index].interval1[1]" :placeholder="row.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`time-${index}`]="{ row }">
          <el-time-picker
            v-model="formData.param[index].time"
            is-range
            range-separator="~"
            :key="`time-${item.id}`"
            :placeholder="row.name"
            style="width:100%"
            format="HH:mm"
            value-format="HH:mm"
            size="small"
          />
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`msgPush-${index}`]>
          <el-form-item
            :key="`msgPush-${item.id}`"
            :prop="`param[${index}].msgPush`"
            label-width="0"
            style="margin-bottom: 0"
          >
            <el-switch v-model="formData.param[index].msgPush" />
          </el-form-item>
        </template>

        <template v-for="(item, index) of monitorSystemParams" v-slot:[`action-${index}`]="{ row }">
          <el-button :key="`action-${item.id}`" type="text" @click="() => onParamDel(row)">删除</el-button>
        </template>
      </BaseTable>

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
import { settingPointBasisCols, settingPointParamCols } from '@/views/monitoring/utils'

interface FormItem {
  label: string
  name: string
  type?: string
  required?: boolean
  disabled?: boolean
}

interface FormData {
  system?: { [x: string]: string }[]
  param?: { [x: string]: string }[]
  [x: string]: any
}

@Component({ name: 'PointForm', components: { BaseDialog, BaseTitle, BaseTable } })
export default class PointForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  dialogVisible = false
  dialogImageUrl = ''
  formData: FormData = {}
  settingPointBasisCols = settingPointBasisCols
  settingPointParamCols = settingPointParamCols

  formItems: {
    name: string
    title: string
    items: {
      label: string
      name: string
      required?: boolean
      disabled?: boolean
      type?: 'txt' | 'date' | 'textarea' | 'select'
    }[]
  }[] = [
    {
      name: 'basis',
      title: '监测站点基本信息',
      items: [
        {
          /**①	监测站点编号: 系统维护，编码规则: 项目编号 +JCZD_+ 4位流水号，如: HN01JCZD0004（JCZD代表监测站点）。 */
          label: '监测站点编号',
          name: 'no',
          required: false
        },
        {
          /**②	监测点名称: 必填，自定义录入。 */
          label: '监测点名称',
          name: 'name'
        },
        {
          /**③	监测点编码: 必填，自定义录入，可用于与其他系统对接。 */
          label: '监测点编码',
          name: 'pointNo'
        },
        {
          /**④	地址: 必填，自定义录入。 */
          label: '地址',
          name: 'address'
        },
        {
          /**⑤	坐标: 必填，支持录入，同时支持点击【图上选点】，在地图上点击一个点位获取坐标信息。 */
          label: '坐标',
          name: 'coordinate'
        }
      ]
    },
    {
      name: 'device',
      title: '关联排水设施信息',
      items: [
        { label: '关联设施', name: 'connect-deivce' },
        { label: '设施编码', name: 'connect-no', type: 'txt' },
        { label: '设施类型', name: 'connect-type', type: 'txt' },
        { label: '道路名称', name: 'connect-road', type: 'txt' },
        { label: '备注', name: 'connect-note', type: 'textarea' }
      ]
    },
    {
      name: 'install',
      title: '设备安装信息',
      items: [
        { label: '设备类型', name: 'device-type', type: 'select', required: false },
        { label: '设备SN序列', name: 'device-sn', type: 'select', required: false },
        { label: '安装负责人', name: 'device-director' },
        { label: '联系方式', name: 'device-contact' },
        { label: '安装时间', name: 'device-time', type: 'date' }
      ]
    }
  ]

  rules = {
    name: [
      { required: true, message: '监测点名称不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '监测点名称不能超过50个字符' }
    ],
    pointNo: [
      { required: true, message: '监测点编码不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '监测点编码不能超过50个字符' }
    ],
    address: [
      { required: true, message: '地址不能为空！', trigger: 'blur' },
      { type: 'string', max: 100, message: '地址不能超过100个字符' }
    ],
    longitude: [
      { required: true, message: '经度不能为空！', trigger: 'blur' },
      { type: 'number', message: '请输入数字', transform: (val) => +val }
    ],
    latitude: [
      { required: true, message: '纬度不能为空！', trigger: 'blur' },
      { type: 'number', message: '请输入数字', transform: (val) => +val }
    ],
    'device-director': [
      { required: true, message: '安装负责人不能为空！', trigger: 'blur' },
      { type: 'string', max: 50, message: '安装负责人不能超过50个字符' }
    ],
    'device-contact': [
      { required: true, message: '联系方式不能为空！', trigger: 'blur' },
      { type: 'string', max: 100, message: '联系方式不能超过100个字符' }
    ],
    'device-time': [{ required: true, message: '请选择安装时间' }],
    note: [{ type: 'string', required: false, max: 255, message: '备注不能超过255个字符' }]
  }

  monitorSystems = []

  monitorSystemParams = []

  systems = [{ id: '1', name: '第一系统' }, { id: '2', name: '第二系统' }, { id: '3', name: '第三系统' }]

  onSubmit() {
    console.log('submit')
    const form = this.$refs['form'] as any
    form.validate((valid) => {
      if (valid) {
        console.log('valid')
      }
    })
  }

  getDefaultParam() {
    return settingPointParamCols
      .filter((item) => item._interval)
      .reduce(
        (data, current = {}) => {
          const temp = { ...data }
          temp[current.prop] = []
          return temp
        },
        {} as { [x: string]: any }
      )
  }

  onSystemChange(id) {
    // 根据id 找到对应的 参数s  需要把id写入formData.sysytem 和 formData.param
    const countParams = +id * 2
    this.formData = {
      ...this.formData,
      system: Array(countParams)
        .fill('')
        .map((_) => ({})),
      param: Array(countParams)
        .fill('')
        .map((_) => {
          return this.getDefaultParam()
        })
    }

    this.monitorSystems = Array(countParams)
      .fill('')
      .map((_, index) => ({ id: String(index), name: `参数${index}` }))

    this.monitorSystemParams = Array(countParams)
      .fill('')
      .map((_, index) => ({ id: String(index), name: `参数${index}` }))
  }

  onParamAdd() {
    this.formData = {
      ...this.formData,
      param: [...this.formData.param, this.getDefaultParam()]
    }
    setTimeout(() => {
      this.monitorSystemParams = [...this.monitorSystemParams, { id: `__new__${+new Date()}`, name: '' }]
    }, 0)
  }

  onParamDel({ id }) {
    this.monitorSystemParams = this.monitorSystemParams.filter((item) => item.id !== id)
  }

  handleRemovePic(file, fileList) {
    console.log(file, fileList)
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }

  @Watch('data', { immediate: true })
  setDefaultData(val) {
    const defaultFormData = { system: [] }
    this.formData = { ...defaultFormData, ...val }
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
