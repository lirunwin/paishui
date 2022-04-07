<template>
  <div class="param-container">
    <el-tabs v-model="activeName" @tab-click="getSavedParams">
      <template v-for="item in tabList">
        <el-tab-pane :key="item.name" :label="item.label" :name="item.name">
          <el-form
            label-position="right"
            label-width="200px"
            class="custom-form"
            :ref="item.name"
            :model="activeName === 'paramSetting' ? appFormModel : webFormModel"
            inline-message
          >
            <template v-if="activeName === 'paramSetting'">
              <template v-for="appForm in appForms">
                <el-form-item
                  :key="appForm.prop"
                  :label="`${appForm.label}：`"
                  class="custom-form-item"
                  :rules="appForm.rules"
                  :prop="appForm.prop"
                >
                  <el-input v-if="appForm.type === 'input'" v-model="appFormModel[appForm.prop]"></el-input>
                  <el-select
                    v-if="appForm.type === 'select'"
                    v-model="appFormModel[appForm.prop]"
                    style="display: inline-block"
                  >
                    <template v-for="option in appForm.appSelects">
                      <el-option :key="option.id" :value="option.id" :label="option.name"></el-option>
                    </template>
                  </el-select>
                  <el-tooltip class="item" effect="dark" :content="appForm.title || ''" placement="right">
                    <i class="el-icon-info" style="font-size: 16px;color: gray;" />
                  </el-tooltip>
                </el-form-item>
              </template>
            </template>
            <template v-else>
              <template v-for="webForm in webForms">
                <el-form-item
                  :key="webForm.prop"
                  :label="`${webForm.label}：`"
                  class="custom-form-item"
                  :rules="webForm.rules"
                  :prop="webForm.prop"
                >
                  <el-input v-if="webForm.type === 'input'" v-model="webFormModel[webForm.prop]"></el-input>
                  <el-color-picker
                    v-if="webForm.type === 'color'"
                    v-model="webFormModel[webForm.prop]"
                  ></el-color-picker>
                  <el-tooltip class="item" effect="dark" :content="webForm.title || ''" placement="right">
                    <i class="el-icon-info" style="font-size: 16px;color: gray;" />
                  </el-tooltip>
                </el-form-item>
              </template>
            </template>
            <el-form-item>
              <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { getParams, saveParams } from './api/index.js'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'ParamSetting'
})
export default class ParamSetting extends Vue {
  tabList = [{ name: 'paramSetting', label: 'APP端参数设置' }, { name: 'Web', label: '系统轨迹参数设置' }]
  activeName = 'paramSetting'
  id = ''
  appFormModel = {
    peopleSpeed: 50,
    peopleMaxalw: 10,
    carSpeed: 120,
    carMaxalw: 30,
    uploadRate: 10,
    routeMaxspeed: 120,
    ismark: false
  }
  webFormModel = {
    plineColor: '#ff0000',
    pointColor: '#2d74e7',
    lineColor: '#2d74e7',
    routePt: 2,
    routeLine: 3,
    routePtnum: 10
  }
  appForms = [
    {
      label: '人巡最快速度（km/h）',
      prop: 'peopleSpeed',
      type: 'input',
      rules: [
        { required: true, message: '人巡最快速度不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '速度必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '人员人巡模式下巡查过程中最快的速度，当大于此速度时，系统判断此人员未到位'
    },
    {
      label: '人巡最大到位容差（m）',
      prop: 'peopleMaxalw',
      type: 'input',
      rules: [
        { required: true, message: '人巡最大到位容差不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '容差必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '人员人巡模式下巡查过程中，巡查地物在此距离范围内，系统认为人员已巡查到位'
    },
    {
      label: '车巡最快速度（km/h）',
      prop: 'carSpeed',
      type: 'input',
      rules: [
        { required: true, message: '车巡最快速度不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '速度必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '人员巡查任务切换到车巡模式时，人员巡查最快的速度，当大于此速度，系统判断此人员未到位'
    },
    {
      label: '车巡最大到位容差（m）',
      prop: 'carMaxalw',
      type: 'input',
      rules: [
        { required: true, message: '车巡最大到位容差不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '容差必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '人员巡查任务切换到车巡模式时，巡查地物在此距离范围内，系统认为人员已巡查到位'
    },
    {
      label: '上传频率（秒/次）',
      prop: 'uploadRate',
      type: 'input',
      rules: [
        { required: true, message: '上传频率不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '频率必须为大于0的数字值', transform: (val) => +val }
      ],
      title: 'app端登录签到上班后，手机位置坐标上传频率'
    },
    {
      label: '轨迹最大速度（km/h）',
      prop: 'routeMaxspeed',
      type: 'input',
      rules: [
        { required: true, message: '轨迹最大速度不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '速度必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '人员登录签到上班后，上传时的位置坐标时，当速度大于此速度，此位置不参与人员轨迹绘制'
    },
    {
      label: '是否添加时间水印',
      prop: 'ismark',
      type: 'select',
      rules: [{ required: true, message: '是否添加时间水印不能为空！', trigger: 'blur' }],
      appSelects: [{ id: '0', name: '否' }, { id: '1', name: '是' }],
      title: '用于开启手机端拍照时统一开启添加时间水印'
    }
  ]
  webForms = [
    {
      label: '轨迹颜色',
      prop: 'plineColor',
      type: 'color',
      rules: [{ required: true, message: '轨迹颜色不能为空！', trigger: 'change' }],
      title: '系统轨迹绘制渲染颜色'
    },
    {
      label: '播放轨迹点颜色',
      prop: 'pointColor',
      type: 'color',
      rules: [{ required: true, message: '播放轨迹点颜色不能为空！', trigger: 'change' }],
      title: '系统播放轨迹点绘制渲染颜色'
    },
    {
      label: '播放轨迹线颜色',
      prop: 'lineColor',
      type: 'color',
      rules: [{ required: true, message: '播放轨迹线颜色不能为空！', trigger: 'change' }],
      title: '系统播放轨迹线绘制渲染颜色'
    },
    {
      label: '轨迹点细度（px）',
      prop: 'routePt',
      type: 'input',
      rules: [
        { required: true, message: '轨迹点细度不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '轨迹点细度必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '轨迹上点的大小'
    },
    {
      label: '轨迹线细度（px）',
      prop: 'routeLine',
      type: 'input',
      rules: [
        { required: true, message: '轨迹线细度不能为空！', trigger: 'blur' },
        { type: 'number', min: 0, message: '轨迹线细度必须为大于0的数字值', transform: (val) => +val }
      ],
      title: '轨迹线的粗细'
    }
  ]

  mounted() {
    this.getSavedParams()
  }

  // 获取已经存在的参数配置
  getSavedParams() {
    return getParams().then((res) => {
      const {
        id,
        peopleSpeed,
        peopleMaxalw,
        carSpeed,
        carMaxalw,
        uploadRate,
        routeMaxspeed,
        ismark,
        plineColor,
        pointColor,
        lineColor,
        routePt,
        routeLine,
        routePtnum
      } = res.result.records[0]
      this.appFormModel = { peopleSpeed, peopleMaxalw, carSpeed, carMaxalw, uploadRate, routeMaxspeed, ismark }
      this.webFormModel = { plineColor, pointColor, lineColor, routePt, routeLine, routePtnum }
      this.id = id
    })
  }

  // 点击保存按钮
  handleSave() {
    var data = {
      // peopleSpeed: this.appFormModel.peopleSpeed,
      // peopleMaxalw: this.appFormModel.peopleMaxalw,
      // carSpeed: this.appFormModel.carSpeed,
      // carMaxalw: this.appFormModel.carMaxalw,
      // uploadRate: this.appFormModel.uploadRate,
      // routeMaxspeed: this.appFormModel.routeMaxspeed,
      // ismark: this.appFormModel.ismark,
      // plineColor: this.webFormModel.plineColor,
      // pointColor: this.webFormModel.pointColor,
      // lineColor: this.webFormModel.lineColor,
      // routePt: this.webFormModel.routePt,
      // routeLine: this.webFormModel.routeLine,
      // routePtnum: this.webFormModel.routePtnum
      ...this.appFormModel,
      ...this.webFormModel,
      id: this.id
    }
    console.log(this.activeName, this.$refs[this.activeName])
    const form: any = this.$refs[this.activeName]
    ;(Array.isArray(form) ? form[0] : form).validate((valid) => {
      if (valid) {
        saveParams(data).then((res) => {
          if (res.code == 1) this.$message.success('保存成功')
          else this.$message.error('保存失败')
        })
      }
    })
  }
  @Watch('activeName')
  validate() {
    setTimeout(() => {
      const form: any = this.$refs[this.activeName]
      ;(Array.isArray(form) ? form[0] : form).validate()
    }, 0)
  }
}
</script>

<style lang="scss" scoped>
.param-container {
  padding: 0 20px;
  .custom-form {
    padding: 10px 0;
    /deep/ .el-form-item__content {
      display: flex;
      align-items: center;
    }
    /deep/ .el-form-item__error--inline {
      padding-top: 0;
    }
    .custom-form-item {
      height: 60px;
      line-height: 60px;
      .el-input,
      .el-select {
        width: 300px;
        margin-right: 20px;
      }
      .el-color-picker {
        margin-right: 20px;
      }
    }
  }

  // /deep/ .el-tabs .el-tabs__header { // tab的背景色
  //   background: #eaeaea;
  // }
}
</style>
