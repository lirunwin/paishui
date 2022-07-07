<template>
  <tf-dialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading" width="1280px" @closed="onClosed">
    <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" :rules="rules">
      <tf-title v-if="!tabVisible.report">
        <a @click="tabVisible = { ...tabVisible, report: true }">基本信息</a>
      </tf-title>
      <el-row :gutter="15" type="flex" v-show="tabVisible.report">
        <el-col :span="12">
          <tf-title><a @click="tabVisible = { ...tabVisible, report: false }">基本信息</a></tf-title>
          <el-row>
            <el-col :span="24">
              <el-form-item label="事件类别" required prop="event.category">
                <el-radio-group v-model="formData.event.category" size="small">
                  <el-radio v-for="(value, key) of DICTONARY.event.category" :key="key" :label="key">
                    {{ value }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="事件类型" required prop="event.type">
                <el-select v-model="formData.event.type" size="small" clearable placeholder="请选择事件类型">
                  <el-option v-for="(value, key) of DICTONARY.event.type" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="事件名称" prop="event.name">
                <el-input
                  v-model="formData.event.name"
                  size="small"
                  placeholder="请输入事件名称"
                  clearable
                  maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发现时间" prop="event.findDate">
                <el-date-picker
                  v-model="formData.event.findDate"
                  clearable
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择发现日期"
                  type="datetime"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发现人员" prop="event.findUser">
                <el-select
                  v-model="formData.event.findUser"
                  size="small"
                  clearable
                  filterable
                  placeholder="请选择发现人员"
                  @change="onFindUserChange"
                >
                  <el-option-group v-for="dept in users" :key="dept.id" :label="dept.name">
                    <el-option
                      v-for="user in dept.users"
                      :key="user.id"
                      :label="user.realName"
                      :value="String(user.id)"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="event.findPhone">
                <el-input
                  v-model="formData.event.findPhone"
                  size="small"
                  placeholder="请输入联系电话"
                  clearable
                  maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="事件地址" prop="event.address">
                <el-input
                  v-model="formData.event.address"
                  size="small"
                  placeholder="请输入事件地址"
                  clearable
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联设施" prop="event.facility">
                <el-input v-model="facility" size="small" placeholder="请选择关联设施" clearable>
                  <template v-slot:suffix>
                    <el-button icon="el-icon-top-left" type="text" style="padding: 7px 5px" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经纬度" prop="coordinate">
                <el-input v-model="formData.coordinate" size="small" placeholder="请选择在地图上选择">
                  <template v-slot:suffix>
                    <el-button icon="iconfont iconzhongdian11" type="text" style="padding: 7px 5px" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细描述" prop="event.detail">
                <el-input
                  v-model="formData.event.detail"
                  type="textarea"
                  size="small"
                  placeholder="请输入详细描述"
                  clearable
                  maxlength="255"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="处理建议" prop="event.handingAdvice">
                <el-input
                  v-model="formData.event.handingAdvice"
                  type="textarea"
                  size="small"
                  placeholder="请输入处理建议"
                  clearable
                  maxlength="255"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件">
                <el-row>
                  <el-upload
                    :on-remove="onRemovePic"
                    multiple
                    :auto-upload="false"
                    :file-list="formData.fileList"
                    :on-change="onFileChange"
                    action="whatever"
                    accept=".jpg,.jpeg,.png,.amr"
                    :disabled="formData.fileList.length >= 3"
                    class="upload"
                  >
                    <el-button size="small" type="primary" :disabled="formData.fileList.length >= 3">
                      点击上传
                    </el-button>
                    <div slot="tip" class="text">
                      ⚠️ 注意：请上传.jpg/.jpeg、.png、.pdf格式的文件，且大小不能超10MB，最多上传3个文件。
                    </div>
                    <template v-slot:file="{ file }">
                      <el-row type="flex" align="center" class="file-list">
                        <el-col class="name" @click.native="() => onPicturePreview(file)">
                          <el-button type="text" :icon="`el-icon-${getFileType(file, true)}`" />
                          {{ file.name }}
                        </el-col>
                        <el-button type="text" icon="el-icon-delete" @click="() => onRemovePic(file)" />
                      </el-row>
                    </template>
                  </el-upload>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <Map
            ref="map"
            @coordinate-change="onCoordinateChange"
            @device-change="onDeviceChange"
            :enableCoordinateSelect="enable.coordinate"
            :enableDeviceSelect="enable.device"
            :center="(formData.coordinate || '').split(',')"
          />
        </el-col>
      </el-row>
      <tf-title><a @click="tabVisible = { ...tabVisible, assign: !tabVisible.assign }">派工信息</a></tf-title>
      <div v-show="tabVisible.assign">
        <el-row>
          <el-col :span="6">
            <el-form-item label="处理人" prop="assign.majorHandler">
              <el-select
                v-model="formData.assign.majorHandler"
                size="small"
                clearable
                filterable
                placeholder="请选择处理人"
                @change="onMajorHandlerChange"
                :disabled="!!assign.id"
              >
                <el-option
                  v-for="user of assign.majorHandler ? allUsers : usersInMyDepartment"
                  :key="user.id"
                  :value="String(user.id)"
                  :label="user.realName"
                  :disabled="formData.assign.collaborateHanler.includes(String(user.id))"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话" prop="assign.phone">
              <el-input
                v-model="formData.phone"
                size="small"
                placeholder="请输入联系电话"
                clearable
                maxlength="30"
                :disabled="!!assign.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协同处理人" prop="assign.collaborateHanler" label-width="9em">
              <el-select
                v-model="formData.assign.collaborateHanler"
                size="small"
                placeholder="请选择协同处理人"
                clearable
                multiple
                filterable
                @change="setPhones"
                :disabled="!!assign.id"
              >
                <el-option
                  v-for="user of assign.majorHandler ? allUsers : usersInMyDepartment"
                  :key="user.id"
                  :value="String(user.id)"
                  :label="user.realName"
                  :disabled="String(user.id) === formData.assign.majorHandler"
                >
                  <span>{{ user.realName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="assign.message">
              <template v-slot:label>
                <el-checkbox
                  v-model="formData.assign.isPush"
                  :true-label="1"
                  :false-label="0"
                  @change="onSendMsgChange"
                  :disabled="!!assign.id"
                >
                  发送短信
                </el-checkbox>
              </template>
              <el-input
                v-model="formData.assign.message"
                type="textarea"
                size="small"
                placeholder="请输入短信内容"
                clearable
                maxlength="255"
                :disabled="!formData.assign.isPush || !!assign.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信接收电话" prop="phones" label-width="9em">
              <el-select
                v-model="formData.phones"
                size="small"
                clearable
                multiple
                placeholder="请选择短信接收电话"
                :disabled="!formData.assign.isPush || !!assign.id"
              >
                <el-option
                  v-for="user of assign.majorHandler ? allUsers : usersInMyDepartment"
                  :key="user.id"
                  :value="String(user.phone)"
                  :label="String(`${user.realName} ${user.phone}`).trim()"
                  :disabled="!user.phone"
                >
                  <span>{{ user.realName }} {{ user.phone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <tf-dialog :visible.sync="visible" width="80vw" :footer="false" :gutter="false">
      <img width="100%" :src="picturePreviewUrl" alt="" style="display:block" />
    </tf-dialog>
  </tf-dialog>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import { IEvent, IAssign, IDepartment, assignPage } from '../../api'
import { DICTONARY } from '../../utils'
import { telAndMobileReg } from '@/utils/constant'
import { ElUploadInternalFileDetail } from 'element-ui/types/upload'
import Map from './Map.vue'
import { getRemoteImg } from '@/api/ftp'

interface IFormData {
  event: Partial<Omit<IEvent, 'findDate'>> & { findDate?: string | Date }
  assign: Partial<Omit<IAssign, 'collaborateHanler' | 'isPush' | 'findDate'>> & {
    collaborateHanler?: string[]
    isPush?: number
  }
  coordinate?: string
  phone?: string
  phones?: string[]
  fileList?: Partial<ElUploadInternalFileDetail>[]
}

const getDefaultData = (): IFormData => ({
  event: { category: '1', findPhone: '', facility: null },
  assign: { collaborateHanler: [] },
  phones: [],
  fileList: [],
  coordinate: ''
})

@Component({ components: { Map } })
export default class ReportAndAssignForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IEvent
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: Array, default: () => [] }) users!: IDepartment[]
  @PropSync('contentVisible', { type: Object }) tabVisible!: { report: boolean; assign: boolean }

  $refs!: { form: ElForm; map: Map }
  DICTONARY = DICTONARY

  formData: IFormData = getDefaultData()
  assign: Partial<IAssign> = {}
  enable = { coordinate: true, device: true }
  picturePreviewUrl: string = ''
  visible: boolean = false
  facility = ''
  get allUsers() {
    return this.users
      .map(({ users }) => users)
      .flat()
      .filter((item) => !!item)
  }

  get usersInMyDepartment() {
    const { users } = this.users.find((item) => String(item.id) === String(this.$store.getters['deptId'])) || {}
    return users || []
  }

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }

  rules = {
    'event.category': [{ required: true, message: '请选事件别' }],
    'event.type': [{ required: true, message: '请选择事件类型' }],
    'event.name': [{ required: true, message: '请输入事件名称' }, { max: 30, message: '事件名称不能超过30个字符' }],
    'event.findPhone': [{ pattern: telAndMobileReg(), message: '请输入正确的联系方式' }],
    'event.detail': [{ max: 255, message: '详细描述不能超过255个字符' }],
    'event.handingAdvice': [{ max: 255, message: '处理建议不能超过255个字符' }],
    'assign.phone': [{ pattern: telAndMobileReg(), message: '请输入正确的联系方式' }],
    'assign.message': [{ max: 255, message: '短信内容不能超过255个字符' }]
  }

  getFileType(file, returnIConName: boolean = false) {
    const { raw = {}, name } = file || {}
    let txt = ''
    const icon = { image: 'picture-outline', audio: 'video-play' }
    if (raw.type) {
      if (String(raw.type).startsWith('image')) txt = 'image'
      if (String(raw.type).startsWith('audio')) txt = 'audio'
    } else {
      const imgs = ['png', 'jpg', 'jpeg']
      const audios = ['.amr']
      if (imgs.some((item) => name.endsWith(item))) txt = 'image'
      if (audios.some((item) => name.endsWith(item))) txt = 'audio'
    }
    return returnIConName ? icon[txt] || 'document' : txt
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        const {
          event,
          assign: { collaborateHanler, ...resetAssign },
          coordinate,
          fileList
        } = this.formData
        const [x, y] = !coordinate ? [] : (coordinate || '').split(',')
        const data = {
          event: { ...event, x, y, fileList: fileList.map(({ raw, url }) => raw || url) },
          assign: { ...resetAssign, collaborateHanler: collaborateHanler.join(), type: '1' }
        }
        this.$emit('submit', data)
      }
    })
  }

  onCoordinateChange(coordiate: number[]) {
    this.formData.coordinate = coordiate.join()
  }

  onDeviceChange(geo) {
    console.log(geo)
    const { geometry, id, properties } = geo
    let pipeid = ''
    if (geometry.type === 'LineString') {
      if (properties.hasOwnProperty('S_POINT')) {
        //排水管线
        pipeid = properties['S_POINT'] + '_' + properties['E_POINT']
      } else if (properties.hasOwnProperty('START_SID')) {
        //综合管线
        pipeid = properties['START_SID'] + '_' + properties['END_SID']
      }
    } else if (geometry.type === 'Point') {
      if (properties.hasOwnProperty('EXP_NO')) {
        //排水管线
        pipeid = properties['EXP_NO']
      } else if (properties.hasOwnProperty('FEATURECODE')) {
        //综合管线
        pipeid = properties['FEATURECODE']
      }
    }
    const facilitystr = { geometry, id, pipeid }
    this.facility = pipeid
    this.formData.event.facility = JSON.stringify(facilitystr)
  }

  onFindUserChange(id: string) {
    const { phone } = this.allUsers.find((item) => String(item.id) === id) || {}
    this.formData.event.findPhone = phone || ''
  }
  onMajorHandlerChange(id: string) {
    const { phone } = this.usersInMyDepartment.find((item) => String(item.id) === id) || {}
    this.formData.phone = phone || ''
    this.setPhones()
  }

  onCollaborateHanlerChange() {
    this.setPhones()
  }

  onSendMsgChange(isPush: IAssign['isPush']) {
    if (isPush) {
      this.setPhones()
    } else {
      this.formData.phones = []
    }
  }

  setPhones() {
    if (this.formData.assign.isPush) {
      this.usersInMyDepartment
        .filter((item) =>
          [this.formData.assign.majorHandler, ...this.formData.assign.collaborateHanler].includes(String(item.id))
        )
        .forEach((item) => {
          if (!this.formData.phones.includes(item.phone) && !!item.phone) {
            this.formData.phones = [...this.formData.phones, item.phone]
          }
        })
    }
  }

  onFileChange(file) {
    const allowedTypes = ['image/jpeg', 'image/png']
    const isLt10M = file.size / 1024 / 1024 < 10
    const max = 3
    let pass = true

    if (
      !allowedTypes.includes(file.raw.type) &&
      !String(file.raw.type).endsWith('.amr')
      // && !String(file.raw.type).startsWith('audio')
    ) {
      this.$message.error('上传文件只能是 JPG/JPEG、png、pdf 格式!')
      pass = false
    }

    if (!isLt10M) {
      this.$message.error('上传文件大小不能超过 10MB!')
      pass = false
    }

    if (this.formData.fileList.length >= max) {
      this.$message.error(`最多可以上传${max}张图片!`)
      pass = false
    }

    this.formData.fileList = pass ? [...this.formData.fileList, file] : [...this.formData.fileList]
  }

  onClosed() {
    this.tabVisible = { assign: false, report: true }
    this.assign = {}
    this.$emit('closed')
    this.clearMap()
  }

  clearMap() {
    this.$refs.map.clearMap()
  }

  onRemovePic(file) {
    this.formData.fileList = this.formData.fileList.filter((item) => item.uid !== file.uid)
  }

  onPicturePreview(file) {
    const { type } = file.raw || {}
    if (this.getFileType(file) === 'image') {
      if (type) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.picturePreviewUrl = e.target.result.toString()
          this.visible = true
        }
        reader.readAsDataURL(file.raw)
      } else {
        this.picturePreviewUrl = getRemoteImg(file.url)
        this.visible = true
      }
    }
  }

  @Watch('data', { immediate: true })
  async setDefaultData({ id, x, y, filePathList, findDate, ...rest }: IEvent) {
    console.log(this.$store)
    this.formData = getDefaultData()
    if (id) {
      this.formData = {
        ...this.formData,
        event: { id, x, y, findDate: findDate ? this.$moment(findDate).toDate() : '', ...rest },
        coordinate: `${x},${y}`,
        fileList: (filePathList || []).map((path, index) => ({
          name: path,
          url: path,
          uid: +new Date() + index
        }))
      }
      //@ts-ignore
      // this.facility = rest.facility.pipeid
      this.onMajorHandlerChange(String(id))
      const {
        result: { records = [] }
      } = await assignPage({ current: 1, size: 1, sourceId: id })
      this.assign = records[0] || {}
      const { collaborateHanler, isPush, id: assignId, ...assign } = this.assign
      if (assignId) this.tabVisible = { ...this.tabVisible, assign: true }
      this.formData = {
        ...this.formData,
        assign: {
          id: assignId,
          ...assign,
          collaborateHanler: collaborateHanler ? collaborateHanler.split(',') : [],
          isPush: Number(isPush)
        }
      }
      this.setPhones()
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .upload {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .text {
      font-size: $--font-size-extra-small;
      margin-left: 1em;
      line-height: 1.4;
    }
    .el-upload {
      flex: 0 0 80px;
    }
    .text {
      flex: 0 0 calc(100% - 80px - 1em);
    }
    .el-upload-list {
      flex: 1 1 100%;
      .file-list {
        font-size: 14px;
        .name {
          cursor: pointer;
          &:hover {
            color: $--color-primary;
          }
        }
        .el-button {
          color: $--color-info;
          padding: 5px;
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
  }
}
</style>
