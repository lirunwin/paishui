<template>
  <BaseDialog v-bind="$attrs" v-on="listeners" @submit="onSubmit" :loading="loading">
    <el-form class="form" ref="form" v-bind="{ labelWidth: '7.5em', size: 'small' }" :model="formData">
      <el-row type="flex">
        <el-col :span="14">
          <BaseTitle>基本信息</BaseTitle>
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item label="事件类别" required prop="event.category">
                <el-radio-group v-model="formData.event.category" size="small">
                  <el-radio v-for="(value, key) of DICTONARY.event.category" :key="key" :value="key">{{
                    value
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事件类型" required prop="event.type">
                <el-select v-model="formData.event.type" size="small" clearable placeholder="请选择事件类型">
                  <el-option v-for="(value, key) of DICTONARY.event.category" :key="key" :value="value" :label="key" />
                </el-select>
              </el-form-item>
            </el-col>
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
              <el-form-item label="发现日期" prop="event.findDate">
                <el-date-picker
                  v-model="formData.event.findDate"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="请选择发现日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发现人员" prop="event.findUser">
                <el-select v-model="formData.event.findUser" size="small" clearable placeholder="请选择发现人员">
                  <el-option v-for="(value, key) of DICTONARY.event.category" :key="key" :value="value" :label="key" />
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
                <el-input
                  v-model="formData.event.facility"
                  size="small"
                  placeholder="请选择关联设施"
                  clearable
                  readonly
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经纬度" prop="coordinate">
                <el-input
                  v-model="formData.coordinate"
                  size="small"
                  placeholder="请选择在地图上选择"
                  clearable
                  readonly
                />
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
                <el-upload />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10"> this is a map</el-col>
      </el-row>
      <BaseTitle>派工信息</BaseTitle>
      <el-row>
        <el-col :span="6">
          <el-form-item label="处理人" prop="assign.majorHandler">
            <el-select v-model="formData.assign.majorHandler" size="small" clearable placeholder="请选择处理人">
              <el-option v-for="(value, key) of DICTONARY.event.category" :key="key" :value="value" :label="key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话" prop="assign.phone">
            <el-input v-model="formData.phone" size="small" placeholder="请输入联系电话" clearable maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="协同处理人" prop="assign.collaborateHanler">
            <el-select
              v-model="formData.assign.collaborateHanler"
              size="small"
              clearable
              placeholder="请选择协同处理人"
            >
              <el-option v-for="(value, key) of DICTONARY.event.category" :key="key" :value="value" :label="key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否发送短信" prop="assign.isPush">
            <el-switch v-model="formData.assign.isPush" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="短信内容" prop="assign.message">
            <el-input
              v-model="formData.assign.message"
              type="textarea"
              size="small"
              placeholder="请输入详细描述"
              clearable
              maxlength="255"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="短信接收电话" prop="phones">
            <el-select v-model="formData.phones" size="small" clearable multiple placeholder="请选择短信接收电话">
              <el-option v-for="(value, key) of DICTONARY.event.category" :key="key" :value="value" :label="key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BaseDialog>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseDialog from '@/views/monitoring/components/BaseDialog/index.vue'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import { IEvent, IEventAssign } from '../../api'
import { DICTONARY } from '../../utils'

const getDefaultData = () => ({ event: {}, assign: {}, phones: [] })

@Component({ components: { BaseDialog, BaseTitle } })
export default class ReportAndAssignForm extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: object
  @Prop({ type: Boolean, default: false }) loading!: boolean
  $refs!: { form: ElForm }
  DICTONARY = DICTONARY

  formData: {
    event: Partial<IEvent>
    assign: Partial<IEventAssign>
    coordinate?: string
    phone?: string
    phones?: string[]
  } = getDefaultData()

  get listeners() {
    const { submit, ...rest } = this.$listeners
    return rest
  }
  onSubmit() {
    this.$refs.form.validate((valid) => valid && this.$emit('submit', { ...this.formData }))
  }

  @Watch('data', { immediate: true })
  setDefaultData({ lrangeLow, lrangeUp, isDisplay, id, ...rest }) {
    this.formData = id
      ? {
          event: { id, ...rest },
          assign: {},
          phones: []
        }
      : getDefaultData()
  }
}
</script>

<style lang="scss"></style>
