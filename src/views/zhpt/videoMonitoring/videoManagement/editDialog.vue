<template>
  <el-dialog :title="dialogName + '视频监控点'" :visible.sync="dialogVisible" :before-close="handleClose" width="50%">
    <div class="contentInfo">
      <div class="leftPanel">
        <!------基本信息------>
        <div class="title">
          <div class="iconSymbol"></div>
          <div class="titleName">视频监控点基本信息</div>
        </div>
        <div class="content">
          <el-form ref="form" :model="form" label-width="100px" size="small">
            <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="视频点位名称">
                  <el-input v-model="form.name" placeholder="请输入视频点位名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="视频点位编号">
                  <el-input v-model="form.no" placeholder="自动产生" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="所属权属状态">
                  <el-input v-model="form.name" placeholder="请输入所属权属状态"></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="设备厂家">
                  <el-input v-model="form.company" placeholder="请输入设备厂家"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备型号">
                  <el-input v-model="form.model" placeholder="请输入设备型号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row type="flex" align="center">
              <el-col :span="24">
                <el-form-item label="安装地址">
                  <el-input v-model="form.name" placeholder="请输入安装地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="安装单位">
                  <el-input v-model="form.installDept" placeholder="请输入安装单位"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="安装人员">
                  <el-input v-model="form.installUserName" placeholder="请输入安装人员"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安装时间">
                  <el-date-picker v-model="form.installTime" type="date" placeholder="选择安装时间"> </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" align="center">
              <el-col :span="12">
                <el-form-item label="负责人">
                  <el-input v-model="form.chargeUserName" placeholder="请输入负责人姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话">
                  <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" align="center">
              <el-col :span="15">
                <el-form-item label="经纬度">
                <el-input v-model="form.lng" style="width: 100px" placeholder="经度"></el-input>~
                <el-input v-model="form.lat" style="width: 100px" placeholder="纬度"></el-input>
                <!-- <img src="./images/视频监控.png" class="img-button" /> -->
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button size="mini"  plain title="图上选择" @click="selectOnMap()" :disabled="dialogName=='详情'">
                    <img src="./images/视频监控.png" width="15px" height="15px" style="object-fit: contain" />
                </el-button>
              </el-col>
            </el-row>
            <el-row type="flex" align="center">
              <el-col :span="24">
                <el-form-item label="详细描述">
                  <el-input type="textarea" :rows="2" placeholder="请输入详细描述" v-model="form.note"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" v-show="dialogName!='详情'">
          <el-button type="primary" @click="submit()">确 定</el-button>
          <el-button @click="cancel()">取 消</el-button>
        </span>
      </div>
      <div class="rightPanel">
        <div class="mapContent">
          <common-map :mapname="'videoManagementMap'"></common-map>
        </div>
        <div class="videoContent">
          <div class="title">
            <div class="iconSymbol"></div>
            <div class="titleName">视频监控画面</div>
          </div>
          <div class="video">
            <hls-video></hls-video>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import hlsVideo from '@/views/bigScreen/monitoringCenter/components/hlsVideo.vue'
import commonMap from '@/views/zhpt/drainageManagement/commonMap.vue'
export default {
  name: 'editDialog', //视频管理新建、修改弹窗
  components: {
    commonMap,hlsVideo
  },
  props: {
    visible: { required: true },
    showName: { required: true }
  },
  data() {
    return {
      dialogVisible: false,
      view: null,
      form:{
        name:'',
        no:'',
        company:'',
        model:'',
        installDept:'',
        installUserName:'',
        installTime:'',
        chargeUserName:'',
        phone:'',
        lng:'',
        lat:'',
        note:'',
      }
    }
  },
  computed: {
    dialogName() {
      return this.showName
    }
  },
  mounted() {
    // console.log('地图对象', this.$children[0].view)
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
          if (valid) {
              this.$emit('submitOperation',this.form)
          } else {
              return false;
          }
      });
    },
    cancel() {
      this.$emit('cancelOperation')
    },
    handleClose(done) {
      this.$emit('cancelOperation')
      done()
    },
    //图上选点
    selectOnMap(){
        const that=this
        this.view = this.$children[0].view
        this.mapEvent=this.view.on('click',function(e){
            that.form.lng=parseFloat(e.coordinate[0])
            that.form.lat=parseFloat(e.coordinate[1])
        })
    },
    setData(data){
        for(let i in data){
            this.form[i]=data[i]
        }
    },
    reset(){
        this.$refs['form'].resetFields();
        Object.assign(this.$data.form,this.$options.data().form)
    }
  },
  watch: {
    visible: {
      handler(n, o) {
        this.dialogVisible = n
        if(!n&&this.view&&this.mapEvent) this.view.un(this.mapEvent.type, this.mapEvent.listener)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__header {
    background-color: royalblue !important;
    .el-dialog__title {
      color: white !important;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: white !important;
      line-height: 28px;
    }
  }
  .el-dialog__body {
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.contentInfo {
  height: 100%;
  width: 100%;
  display: flex;
  .title {
    height: 20px;
    width: 100%;
    font-size: 16px;
    .iconSymbol {
      height: 100%;
      width: 5px;
      background-color: royalblue;
      float: left;
    }
    .titleName {
      margin-left: 20px;
    //   line-height: 24px;
    }
  }
  .leftPanel,
  .rightPanel {
    display: flex;
    flex-flow: column;
  }
  .leftPanel {
    flex: 0.6;
    .content {
      padding: 10px;
      /deep/ .el-form-item__content {
        display: flex;
      }
    //   .img-button{
    //     object-fit: contain;
    //     width:30px;
    //     height:30px;
    //     cursor: pointer;
    //   }
    }
  }
  .rightPanel {
    flex: 0.4;
    .mapContent {
      flex: 0.5;
    }
    .videoContent {
      flex: 0.5;
      padding: 5px 0;
      .video {
        height: calc(100% - 50px);
        margin-top: 5px;
      }
    }
  }
}
</style>