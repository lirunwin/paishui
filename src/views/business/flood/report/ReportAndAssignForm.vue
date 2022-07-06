<template>
  <tf-dialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" @closed="onClosed" :loading="loading" width="1280px">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7.5em', size: 'small' }" :model="formData" :rules="rules">
      <el-row :gutter="20" type="flex">
        <el-col :span="14">
          <tf-title>基本信息</tf-title>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否为警情" required prop="flood.police">
                <el-radio-group v-model="formData.flood.police" size="small">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="隧道名称" prop="flood.address">
                <el-input
                  v-model="formData.flood.facility"
                  size="small"
                  placeholder="请输入隧道名称"
                  clearable
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经纬度" prop="coordinate">
                <el-input v-model="formData.coordinate" size="small" placeholder="请选择在地图上选择">
                  <template v-slot:suffix>
                    <el-button
                      icon="iconfont iconzhongdian11"
                      type="text"
                      style="padding: 7px 5px"
                      :class="{ disabled: !enable.coordinate, 'coodinate-btn': true }"
                      @click="enable.coordinate = !enable.coordinate"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="汛情地址" prop="flood.address">
                <el-input
                  v-model="formData.flood.address"
                  size="small"
                  placeholder="请输入汛期地址"
                  clearable
                  maxlength="128"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="关联设施" prop="flood.facility">
                <el-input v-model="formData.flood.facility" size="small" placeholder="请选择关联设施" clearable>
                  <template v-slot:suffix>
                    <el-button icon="el-icon-top-left" type="text" style="padding: 7px 5px" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col> -->

            <el-col :span="24">
              <el-form-item label="汛情描述" prop="flood.detail">
                <el-input
                  v-model="formData.flood.detail"
                  type="textarea"
                  size="small"
                  placeholder="请输入汛情描述"
                  clearable
                  maxlength="255"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="处理建议" prop="flood.suggest">
                <el-input
                  v-model="formData.flood.suggest"
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
                    :on-remove="handleRemovePic"
                    multiple
                    :auto-upload="false"
                    :file-list="formData.fileList"
                    :on-change="onFileChange"
                    action="whatever"
                    accept=".jpg,.jpeg,.png,.amr"
                    :disabled="formData.fileList.length >= 3"
                  >
                    <el-button size="small" type="primary" :disabled="formData.fileList.length >= 3">
                      点击上传
                    </el-button>
                    <div slot="tip" style="font-size: 12px; display: inline-block; margin-left: 1em">
                      ⚠️ 注意：请上传.jpg/.jpeg .png .amr格式的文件，且文件大小不能超10MB，最多上传3个文件
                    </div>
                  </el-upload>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <Map
            ref="map"
            @coordinate-change="onCoordinateChange"
            :enableCoordinateSelect="enable.coordinate"
            :enableDeviceSelect="enable.device"
            :center="(formData.coordinate || '').split(',')"
          />
        </el-col>
      </el-row>
      <tf-title>派工信息</tf-title>
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
                v-for="user of usersInMyDepartment"
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
          <el-form-item label="协同处理人" prop="assign.collaborateHanler">
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
                v-for="user of usersInMyDepartment"
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
        <el-col :span="6">
          <el-form-item label="是否发送短信" prop="assign.isPush">
            <el-switch
              v-model="formData.assign.isPush"
              :active-value="1"
              :inactive-value="0"
              @change="onSendMsgChange"
              :disabled="!!assign.id"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="短信内容" prop="assign.message">
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
          <el-form-item label="短信接收电话" prop="phones">
            <el-select
              v-model="formData.phones"
              size="small"
              clearable
              multiple
              placeholder="请选择短信接收电话"
              :disabled="!formData.assign.isPush || !!assign.id"
            >
              <el-option
                v-for="user of usersInMyDepartment"
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
    </el-form>
  </tf-dialog>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { IEvent, IAssign, IDepartment, assignPage, IFlood } from '../../api'
import { DICTONARY } from '../../utils'
import { telAndMobileReg } from '@/utils/constant'
import { ElUploadInternalFileDetail } from 'element-ui/types/upload'
import Map from './Map.vue'

interface IFormData {
  flood: Partial<Omit<IFlood, 'police'>> & { police?: number }
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
  flood: { police: 1 },
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
  $refs!: { form: ElForm; map: Map }
  DICTONARY = DICTONARY

  formData: IFormData = getDefaultData()
  assign: Partial<IAssign> = {}
  enable = { coordinate: false, device: false }

  get allUsers() {
    return this.users
      .map(({ users }) => users)
      .flat()
      .filter((item) => !!item)
  }

  get usersInMyDepartment() {
    const { users } = this.users.find((item) => String(item.id) === String(this.$store.state.user.departmentId)) || {}
    return users || []
  }

  get listeners() {
    const { submit, closed, ...rest } = this.$listeners
    return rest
  }

  rules = {
    'flood.police': [{ required: true, message: '是否为警情' }],
    'flood.detail': [{ max: 255, message: '详细描述不能超过255个字符' }],
    'flood.suggest': [{ max: 255, message: '处理建议不能超过255个字符' }],
    'assign.phone': [{ pattern: telAndMobileReg(), message: '请输入正确的联系方式' }],
    'assign.message': [{ max: 255, message: '短信内容不能超过255个字符' }]
  }

  onSubmit() {
    this.$refs.form.validate((valid) => {
      if (valid) {
        const {
          flood,
          assign: { collaborateHanler, ...resetAssign },
          coordinate,
          fileList
        } = this.formData
        const [x, y] = !coordinate ? [] : (coordinate || '').split(',')
        const data = {
          flood: { ...flood, x, y, fileList: fileList.map(({ raw }) => raw) },
          assign: { ...resetAssign, collaborateHanler: collaborateHanler.join(), type: '1' }
        }
        console.log(JSON.stringify(data, null, 2))
        this.$emit('submit', data)
      }
    })
  }

  onCoordinateChange(coordiate: number[]) {
    const [x, y] = coordiate
    this.formData.coordinate = `${Math.floor(x * 10000000) / 10000000},${Math.floor(y * 10000000) / 10000000}`
  }

  // onDeviceChange(geo) {
  //   const {
  //     geometry,
  //     id,
  //     properties: { ADDRESS, LNO, TYPE }
  //   } = geo
  //   this.formData.flood.facility = id
  // }

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
      !String(file.raw.type).endsWith('.amr') &&
      !String(file.raw.type).startsWith('audio')
    ) {
      this.$message.error('上传文件只能是 JPG/JPEG、png、amr 格式!')
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

  handleRemovePic(file, fileList) {
    this.formData.fileList = fileList.filter((item) => item.uid !== file.uid)
  }

  onClosed() {
    this.enable = { coordinate: false, device: false }
    this.$emit('closed')
    this.clearMap()
  }
  /**
   * 关闭弹窗
   */
  clearMap() {
    this.$refs.map.clearMap()
  }
  @Watch('data', { immediate: true })
  async setDefaultData({ id, x, y, filePathList, police, ...rest }: IFlood) {
    this.formData = getDefaultData()
    if (id) {
      this.formData = {
        ...this.formData,
        flood: { id, x, y, police: Number(police), ...rest },
        coordinate: `${x},${y}`,
        fileList: (filePathList || []).map((path, index) => ({
          name: path,
          url: path,
          uid: +new Date() + index
        }))
      }
      this.$refs.map.drawPoint(x, y)
      this.onMajorHandlerChange(String(id))
      const {
        result: { records }
      } = await assignPage({ current: 1, size: 1, sourceId: id })
      this.assign = records[0] || {}
      const { collaborateHanler, isPush, ...assign } = this.assign
      this.formData = {
        ...this.formData,
        assign: {
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
  .coodinate-btn {
    &.disabled {
      color: $--color-warning;
    }
  }
}
</style>
