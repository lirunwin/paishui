<template>
  <div class="detailsCradS">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">管道检测详情</span>
        <span style="float: right; padding: 3px 0; cursor: pointer">
          <i class="el-icon-close" type="text" @click="closeDialog"></i>
        </span>
      </div>
      <div class="content">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">检测信息</el-menu-item>
          <el-menu-item index="2">功能性缺陷（{{ DetailsForm.funcClass }}）</el-menu-item>
          <el-menu-item index="3">结构性缺陷（{{ DetailsForm.structClass }}）</el-menu-item>
          <el-menu-item index="4">工程信息</el-menu-item>
        </el-menu>
        <div class="content-info">
          <!-- 检测信息 -->
          <div class="box1" v-show="activeIndex == '1'">
            <div class="detailsTitle">管段信息</div>
            <el-form ref="form" :model="DetailsForm" label-width="100px" label-position="right">
              <el-row v-for="(v, i) in cardTableContent" :key="i">
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item v-if='!v[0].unit' :label="v[0].label">
                    <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item v-else :label="v[0].label">
                    <el-col :span="22">
                      <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align:center;">{{ v[0].unit }}</el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item v-if='!v[1].unit'  :label="v[1].label">
                    <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item v-else :label="v[1].label">
                    <el-col :span="22">
                      <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align:center;">{{ v[1].unit }}</el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="detailsTitle">检测信息</div>
              <el-row>
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item label="检测方向">
                    <el-input size="small" v-model="DetailsForm.detectDir" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item label="检测长度">
                    <el-col :span="22" >
                      <el-input size="small" v-model="DetailsForm.checkLength" disabled show-word-limit></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align:center;"> m </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item label="修复指数">
                    <el-input size="small" v-model="DetailsForm.repairIndex" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item label="养护指数">
                    <el-input size="small" v-model="DetailsForm.maintainIndex" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="detailsTitle">管段剖面图</div>
              <div class="profile-box">
                <div ref="profile_echatrs" class="profile-echarts"></div>
                <div class="profile-info">
                  <div class="info-item">
                    <div class="profile-text">管径</div>
                    <span>{{ DetailsForm.diameter || 0 }}mm</span>
                  </div>
                  <div class="info-item">
                    <div class="profile-text">管道长度</div>
                    <span>{{ DetailsForm.pipeLength || 0 }}m</span>
                  </div>
                  <div class="info-item">
                    <div class="profile-text">检测方向</div>
                    <span>{{ DetailsForm.detectDir }}</span>
                  </div>
                  <div class="info-item">
                    <div class="profile-text">检测长度</div>
                    <span>{{ DetailsForm.checkLength || 0 }}m</span>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!-- 功能性缺陷 -->
          <div class="box1" v-show="activeIndex == '2'">
            <el-form ref="form" :model="DetailsForm" label-width="100px" label-position="right">
              <div class="detailsTitle">功能性缺陷评价（等级：{{ DetailsForm.funcClass }}）</div>
              <el-row v-for="(v) in funcArr" :key="v[0].label">
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item :label="v[0].label">
                    <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item :label="v[1].label">
                    <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="padding-right: 15px">
                  <el-form-item label="评价">
                    <el-input
                      size="small"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 4 }"
                      disabled
                      placeholder="无"
                      resize="none"
                      v-model="DetailsForm.funcEstimate"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="detailsTitle">功能性缺陷信息（{{ structDefectArr.length }}）</div>

              <div v-if="!structDefectArr" style="text-align: center">
                <img
                  style="width: 100px; height: 100px; -webkit-user-drag: none"
                  src="@/assets/images/nullData.png"
                  alt="暂无数据"
                  srcset=""
                />
                <p style="color: #999999; font-size: 14px">暂无数据</p>
              </div>
              <div v-show="structDefectArr" v-for="(v, i) in structDefectArr" :key="i" style="margin-top: 20px; height: 200px">
                <div class="info-title">（{{ v.defectCode }}）{{ v.defectName }} 距离：{{ v.distanceStartPoint }}m</div>
                <div class="info-box">
                  <div class="info-text">
                    <p>分值：{{ v.defectNum }}</p>
                    <p>等级：{{ v.defectLevel }}</p>
                    <p style="line-height: 15px">评价： {{ v.pipeNote }}</p>
                  </div>
                  <div class="info-video">
                    <el-image
                      style="width: 100%; height: 100%; -webkit-user-drag: none"
                      :src="getImgUrl(v.picPath)"
                      :preview-src-list="[getImgUrl(v.picPath)]"
                    >
                    </el-image>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!-- 结构性缺陷 -->
          <div class="box1" v-show="activeIndex == '3'">
            <el-form ref="form" :model="DetailsForm" label-width="100px" label-position="right">
              <div class="detailsTitle">结构性缺陷评价（等级：{{ DetailsForm.structClass }}）</div>
              <el-row v-for="v in structArr" :key="v[0].label">
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item :label="v[0].label">
                    <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item :label="v[1].label">
                    <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="padding-right: 15px">
                  <el-form-item label="评价">
                    <el-input
                      size="small"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 4 }"
                      disabled
                      placeholder="无"
                      resize="none"
                      v-model="DetailsForm.structEstimate"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="detailsTitle">结构性缺陷信息（{{ funcDefectArr.length }}）</div>

              <div v-if="!funcDefectArr" style="text-align: center">
                <img
                  style="width: 100px; height: 100px; -webkit-user-drag: none"
                  src="@/assets/images/nullData.png"
                  alt="暂无数据"
                  srcset=""
                />
                <p style="color: #999999; font-size: 14px">暂无数据</p>
              </div>

              <div v-show="funcDefectArr" v-for="(v, i) in funcDefectArr" :key="i" style="margin-top: 20px; height: 240px">
                <div class="info-title">（{{ v.defectCode }}）{{ v.defectName }} 距离：{{ v.distanceStartPoint }}m</div>
                <div class="info-box">
                  <div class="info-text">
                    <p>分值：{{ v.defectNum }}</p>
                    <p>等级：{{ v.defectLevel }}</p>
                    <p style="line-height: 15px">评价： {{ v.pipeNote }}</p>
                  </div>
                  <div class="info-video">
                    <el-image
                      style="width: 100%; height: 100%; -webkit-user-drag: none"
                      :src="getImgUrl(v.picPath)"
                      :preview-src-list="[getImgUrl(v.picPath)]"
                    >
                    </el-image>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!-- 工程信息 -->
          <div class="box1" v-show="activeIndex == '4'">
            <el-form ref="form" :model="DetailsForm" label-width="100px" label-position="right">
              <div class="detailsTitle">工程信息</div>
              <el-row v-for="(v, i) in projectArr" :key="i">
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item :label="v[0].label">
                    <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item :label="v[1].label">
                    <el-input size="small" v-model="DetailsForm[v[1].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="padding-right: 15px">
                  <el-form-item label="检测报告">
                    <!-- <el-link :href="baseAddress + '/psjc/file' + DetailsForm.wordFilePath" type="primary">{{
                      DetailsForm.wordInfoName
                    }}</el-link> -->
                    <!-- 附件列表 -->
                    <!-- wordFilePath -->
                    <el-link v-if="DetailsForm.wordFilePath" style="max-width: 836px" @click="downloadDocx" type="primary">{{
                      DetailsForm.wordInfoName + '.docx'
                    }}</el-link>
                    <p v-if="!DetailsForm.wordFilePath" style="text-align: center">暂无报告</p>
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="width: 100%; height: 330px" v-if="DetailsForm.videoPath">
                <video controls="controls" width="100%" height="83%" style="padding-right: 15px">
                  <source :src="getVideoUrl(DetailsForm.videoPath)" type="video/mp4" />
                </video>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { assessmentDetails, queryPageEnclosure, queryDictionariesId } from '@/api/pipelineManage'
import * as echarts from 'echarts'
// 引入公共ip地址
import { baseAddress } from '@/utils/request.ts'

import axios from 'axios'

export default {
  props: ['checkParam'],
  data() {
    return {
      nullArr: [],
      seriesXArr: [],
      echartsArr: [],
      funcDefectArr: [],
      structDefectArr: [],
      defectQuantityStatisticsA: ['AJ', 'BX', 'CK', 'CR', 'FS', 'PL', 'QF', 'SL', 'TJ', 'TL'], // 结构性缺陷
      defectQuantityStatisticsB: ['CJ', 'CQ', 'FZ', 'JG', 'SG', 'ZW'], // 功能性缺陷
      // 附件分页
      paginationEnclosure: { current: 1, size: 30 }, // 分页参数信息
      paginationEnclosureTotal: 0, // 总页数
      // 查询附件列表需要的参数id
      updataParamsId: {
        uploadFileTypeDicId: '',
        uploadItemDictId: ''
      },
      projectArr: [
        [
          { label: '工程名称', name: 'prjName' },
          { label: '检测地点', name: 'checkAddress' }
        ],
        [
          { label: '检测日期', name: 'sampleTime' },
          { label: '检测人员', name: 'detectPerson' }
        ]
      ], // 工程信息数据
      structArr: [
        [
          { label: '平均值S', name: 'structYmean' },
          { label: '最大值Smax', name: 'structYmax' }
        ],
        [
          { label: '缺陷密度', name: 'structDensity' },
          { label: '修复指数RI', name: 'repairIndex' }
        ]
      ], // 结构性数据
      funcArr: [
        [
          { label: '平均值Y', name: 'funcYmean' },
          { label: '最大值Ymax', name: 'funcYmax' }
        ],
        [
          { label: '缺陷密度', name: 'funcDensity' },
          { label: '养护指数MI', name: 'maintainIndex' }
        ]
      ], // 功能性数据
      cardTableContent: [
        [
          { label: '管段编号', name: 'expNo' },
          { label: '管段类型', name: 'pipeType' }
        ],
        [
          { label: '起点埋深', name: 'startDepth', unit: 'm' },
          { label: '终点埋深', name: 'endDepth', unit: 'm' }
        ],
        [
          { label: '管径', name: 'diameter', unit: 'mm' },
          { label: '材质', name: 'material' }
        ],
        [
          { label: '敷设年代', name: 'constr' },
          { label: '长度', name: 'pipeLength', unit: 'm'  }
        ]
      ], // 详情表格参数
      activeIndex: '1', // 详情导航索引
      checkDialogFormVisible: false, // 详情弹框显影
      DetailsForm: {} // 详情表单
    }
  },
  created () {
    console.log('初始化界面详情', this.checkParam)
  },
  async mounted() {
    // this.checkDialogFormVisible = this.checkParam.bool
    await this.openDetails()
  },
  activated() {
    console.log('切换了组价')
  },
  methods: {
    // 下载文档
    downloadDocx() {
      this.$message('正在加载文档地址,请稍等...')
      let url = baseAddress + '/psjc/file' + this.DetailsForm.wordFilePath
      let label = this.DetailsForm.wordInfoName + '.docx'
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data])
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = label
          link.click()
          URL.revokeObjectURL(link.href)
        })
        .catch(console.error)
    },
    // 获取视频url
    getVideoUrl(url) {
      let address = baseAddress + '/psjc/file' + url
      console.log('address', address)
      return address
    },
    // 获取文件url
    getImgUrl(url) {
      let address = baseAddress + '/psjc/file' + url
      console.log('address', address)
      return address
    },
    //   关闭弹框
    closeDialog() {
      this.$emit('sendBool', false)
    },
    // 详情
    async openDetails() {
      console.log('管道检测开始', this.checkParam)
      if (this.checkParam) {
        // console.log('走了有id的方法')
        let res = await assessmentDetails(this.checkParam)
        if (!res.result) {
          this.$message.error('管道详情数据为空!')
          this.closeDialog()
          return false
        }
        this.DetailsForm = res.result
        let nullArr = [{ value: '起点' + this.DetailsForm.startPoint }, { value: '终点' + this.DetailsForm.endPoint }]
        let seriesXArr = [this.DetailsForm.startDepth + '', this.DetailsForm.endDepth + '']
        // let seriesXArr = []
        for (let i = 0; i < this.DetailsForm.pipeDefects.length - 1; i++) {
          nullArr.splice(1, 0, '')
          seriesXArr.splice(
            1,
            0,
            (((this.DetailsForm.startDepth + this.DetailsForm.endDepth) / 2) * (i + 1)).toFixed(4)
          )
        }

        // 折线图计算
        let ecArr = res.result.pipeDefects.map((v, i) => {
          // seriesXArr.push(v.distanceStartPoint)
          return {
            type: v.defectCode,
            name: v.defectName,
            value: seriesXArr[i],
            distance: v.distanceStartPoint
          }
        })

        this.nullArr = nullArr
        this.seriesXArr = seriesXArr
        this.echartsArr = ecArr
        // 缺陷信息分类
        console.log('缺陷信息分类')
        this.funcDefectArr = []
        this.structDefectArr = []
        this.DetailsForm.pipeDefects.forEach((v) => {
          if (this.defectQuantityStatisticsA.includes(v.defectCode)) {
            // 放入结构性缺陷
            this.funcDefectArr.push(v)
          } else if (this.defectQuantityStatisticsB.includes(v.defectCode)) {
            // 放入功能性缺陷
            this.structDefectArr.push(v)
          }
        })

        // 附件
        // 获得字典id
        await this.getParamsId()
        // 获取附件列表
        let params = {
          current: this.paginationEnclosure.current,
          size: this.paginationEnclosure.size,
          itemId: res.result.id,
          uploadFileTypeDicId: this.updataParamsId.uploadFileTypeDicId,
          uploadItemDictId: this.updataParamsId.uploadItemDictId
        }
        let fileRes = await queryPageEnclosure(params)
        console.log('附件分页数据', fileRes)

        // 绘制剖面图
        this.$nextTick(() => {
          this.renderEcharts()
        })
      }
    },
    format (obj) {
      let res = {}
      for (let key in obj) {
        if (obj[key] === 0) {
          res[key] = obj[key].toString()
        } else {
          res[key] = obj[key]
        }
      }
      return res
    },
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },

    // 获取字典id
    async getParamsId() {
      // 获取字典id
      // uploadFileType
      let uploadFileTypeDicId = await queryDictionariesId({ keys: 'uploadFileType' })
      // uploadItem
      let uploadItemDictId = await queryDictionariesId({ keys: 'uploadItem' })
      uploadFileTypeDicId = uploadFileTypeDicId.result.uploadFileType
      uploadItemDictId = uploadItemDictId.result.uploadItem
      // await this.$refs.upload.submit()
      uploadFileTypeDicId.forEach((v) => {
        if (v.codeValue == 'wordInfoDoc') {
          this.updataParamsId.uploadFileTypeDicId = v.id
        }
      })
      uploadItemDictId.forEach((v) => {
        if (v.codeValue == 'tf_ywpn_wordinfo_w') {
          this.updataParamsId.uploadItemDictId = v.id
        }
      })
    },

    // 绘制剖面图
    renderEcharts() {
      console.log('渲染echarts')
      // let chartDom = document.getElementById('profile_echatrs')
      // let myChart = echarts.init(chartDom)
      let myChart = echarts.getInstanceByDom(this.$refs.profile_echatrs)
      if (myChart == null) {
        myChart = echarts.init(this.$refs.profile_echatrs)
      }
      let option
      option = {
        xAxis: {
          type: 'category',
          data: this.nullArr,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '埋深：m',
          axisLine: {
            show: true, //隐藏y轴
            axisLine: {
              bottom: 'bottom'
            }
          },
          axisLabel: {
            show: false //隐藏刻度值
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          scale: false
        },
        series: [
          {
            data: this.seriesXArr,
            type: 'line',
            color: '#CFCCCC',
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true,
                padding: [0, 0, -60, 0],
                formatter: function (a) {
                  console.log('标题参数', a)
                  return ` 埋深 ${a['name']}m `
                }
              },
              data: [
                { xAxis: 0, name: this.DetailsForm.startDepth + '' },
                { xAxis: this.DetailsForm.pipeDefects.length * 1, name: this.DetailsForm.endDepth + '' }
              ]
            }
          },

          {
            data: this.echartsArr,
            type: 'line',
            symbol: 'triangle',
            symbolSize: 10,
            symbolOffset: [0, -20],
            itemStyle: {
              normal: {
                label: {
                  // formatter: '（CJ）{b}[0]，{c}m   ',
                  formatter: function (a) {
                    console.log('标题参数', a)
                    return `（${a['data']['type']}）${a['data']['name']},${a['data']['distance']}m   `
                  },
                  backgroundColor: '#fff',
                  borderColor: '#8C8D8E',
                  borderWidth: 1,
                  borderRadius: 2,
                  lineHeight: 15,
                  padding: 5,
                  show: true,
                  textStyle: {
                    color: '#000'
                  }
                },
                textColor: '#8C8D8E',
                // textColor: 'red',
                borderWidth: 6
                // borderColor: '#E91111',
                // color: '#2D74E7'
                // color: '#8C8D8E'
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
    }
  },
  //基础数据类型
  watch: {
    checkParam(newVal) {
      this.openDetails()
      console.log('切换了组件', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
// 详情卡片的样式
.detailsCradS {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($color: #333333, $alpha: 0.7);
  z-index: 1001;
  display: flex;
  justify-content: center;
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  /deep/ .box-card {
    // width: 50vw;
    width: 1000px;
    max-height: 80vh;
    margin-top: 4%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    border: none;
    .box1 {
      .profile-box {
        display: flex;
        align-items: center;
        .profile-echarts {
          // width: 80%;
          flex: 1;
          height: 200px;
        }
        .profile-info {
          padding-top: 48px;
          height: 200px;
          width: 200px;
          .info-item {
            display: flex;
            margin-top: 10px;
            align-items: center;
            .profile-text {
              width: 100px;
              text-align: right;
              margin-right: 10px;
            }
          }
        }
      }
    }
    .el-card__header {
      height: 48px;
      color: #fff;
      background-color: #2d74e7;
    }
    .el-card__body {
      padding: 0;
      .el-menu-item {
        height: 45px;
        font-size: 16px;
      }
    }
    .content {
      .content-info {
        overflow-y: scroll;
        height: 600px;
        padding: 10px 30px;

        .info-title {
          font-size: 14px;
          font-weight: bold;
          margin: 5px 0;
        }
        .info-box {
          height: 100% !important;
          display: flex;
          justify-content: space-between;
          .info-text {
            width: 37%;
            padding: 10px;
            box-sizing: border-box;
            background-color: #f3f7fe;
            border: 1px solid #dedede;
          }
          .info-video {
            width: 60%;
            border: 1px solid #dedede;
          }
        }
        .el-form {
          .el-link--inner {
            max-width: 834px;
            /* 1.先强制一行内显示文本 */
            white-space: nowrap;
            /* 2.超出部分隐藏 */
            overflow: hidden;
            /* 3.文字用省略号替代超出的部分 */
            text-overflow: ellipsis;
          }
          .is-disabled {
            .el-input__inner {
              background-color: transparent;
            }
            .el-textarea__inner {
              background-color: transparent;
            }
          }
          .el-form-item {
            margin-bottom: 10px;
          }
        }
        .el-textarea__inner,
        .el-input__inner {
          color: #666;
        }
        .detailsTitle {
          position: relative;
          font-size: 16px;
          padding: 5px 0;
          box-sizing: border-box;
        }
        .detailsTitle::after {
          position: absolute;
          top: 5px;
          left: -10px;
          content: '';
          width: 4px;
          height: 65%;
          background-color: #2d74e7;
        }
      }
    }
    .table-content {
      padding: 15px;
      .content-info {
        font-size: 12px;
        display: flex;
        justify-content: space-between;

        .left {
          flex: 1;
        }
        /deep/ .right {
          flex: 1;
          .container {
            height: 100%;
            width: 100%;
            padding: 5px;
            box-sizing: border-box;
          }

          .is-top {
          }
          .el-tabs__item {
            margin: 11px 0 0 0 !important;
            background: transparent !important;
          }
          .el-tabs__header {
            border-top: 0 !important;
            background: transparent !important;
          }
          // .el-tabs__nav-wrap::after {
          //   z-index: 2;
          // }
          // .el-tabs__active-bar
        }
        .detailsTitle {
          position: relative;
          margin: 6px 0;
          padding-left: 10px;
          box-sizing: border-box;
        }
        .detailsTitle::after {
          position: absolute;
          left: 0;
          content: '';
          width: 4px;
          height: 100%;
          background-color: #2d74e7;
        }
      }
    }
  }
}
</style>