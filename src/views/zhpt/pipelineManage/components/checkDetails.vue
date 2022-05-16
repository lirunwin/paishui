<template>
  <div class="detailsCrad">
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
            <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
              <el-row v-for="(v, i) in cardTableContent" :key="i">
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
              <div class="detailsTitle">检测信息</div>
              <el-row>
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item label="检测方向">
                    <el-input size="small" v-model="DetailsForm.detectDir" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item label="检测长度">
                    <el-input size="small" v-model="DetailsForm.checkLength" disabled show-word-limit></el-input>
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
              <div id="profile_echatrs" style="width: 500px; display: flex; height: 200px"></div>
            </el-form>
          </div>
          <!-- 功能性缺陷 -->
          <div class="box1" v-show="activeIndex == '2'">
            <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
              <div class="detailsTitle">功能性缺陷评价（等级：{{ DetailsForm.funcClass }}）</div>
              <el-row v-for="(v, i) in funcArr" :key="v[0].label">
                <el-col :span="12" style="padding-right: 15px">
                  <el-form-item :label="v[0].label">
                    <el-input size="small" v-model="DetailsForm[v[0].name]" disabled show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 15px"
                  ><el-form-item :label="[v[1].label]">
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
              <div class="detailsTitle">功能性缺陷评信息（{{ DetailsForm.funcDensity.toFixed(0) }}）</div>
              <div v-if="!DetailsForm.funcDensity.toFixed(0)" style="text-align: center">
                <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
              </div>
              <div
                v-if="DetailsForm.funcDensity.toFixed(0) * 1"
                v-for="v in DetailsForm.funcDensity.toFixed(0)"
                style="margin-top: 20px; height: 200px"
              >
                <div class="info-title">（CJ）沉积 距离：2m</div>
                <div class="info-box">
                  <div class="info-text">
                    <p>分值：2</p>
                    <p>等级：2</p>
                    <p style="line-height: 15px">评价： 功能性缺陷，环向0611位置，纵向长度1m。</p>
                  </div>
                  <div class="info-video">
                    <img
                      src="./testImg/video.png"
                      alt="视频"
                      style="width: 100%; height: 100%; -webkit-user-drag: none"
                    />
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!-- 结构性缺陷 -->
          <div class="box1" v-show="activeIndex == '3'">
            <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
              <div class="detailsTitle">结构性缺陷评价（等级：{{ DetailsForm.structClass }}）</div>
              <el-row v-for="(v, i) in structArr" :key="i">
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
              <div class="detailsTitle">结构性缺陷信息（{{ DetailsForm.structDensity.toFixed(0) }}）</div>
              <div v-if="!DetailsForm.structDensity.toFixed(0)" style="text-align: center">
                <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
              </div>
              <el-row>
                <el-col :span="24" style="padding-right: 15px">
                  <div></div>
                </el-col>
              </el-row>
              <div
                v-if="DetailsForm.structDensity.toFixed(0) * 1"
                v-for="v in DetailsForm.structDensity.toFixed(0)"
                style="margin-top: 20px; height: 200px"
              >
                <div class="info-title">（BX）变形 距离：1m</div>
                <div class="info-box">
                  <div class="info-text">
                    <p>分值：0.50</p>
                    <p>等级：1</p>
                    <p style="line-height: 15px">
                      评价：
                      (部分或整体缺陷)无或有轻微管道缺陷，结构状况基本不受影响，但具有潜在变坏的可能。结构条件基本完好，不需要修复。
                    </p>
                  </div>
                  <div class="info-video">
                    <img src="./testImg/video.png" alt="视频" style="width: 100%; height: 100%" />
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!-- 工程信息 -->
          <div class="box1" v-show="activeIndex == '4'">
            <el-form ref="form" :model="DetailsForm" label-width="auto" label-position="right">
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
                    <div style="max-height: 120px; overflow-y: scroll">
                      <div v-for="(item, i) in fileListData" :key="i" class="text-space">
                        <el-link :href="fileLinkToStreamDownload(item.id)" type="primary">{{
                          item.originalName
                        }}</el-link>
                      </div>
                      <p v-if="!fileListData.length" style="text-align: center">暂无报告</p>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="width: 100%; height: 330px">
                <video controls="controls" width="100%" height="83%" style="padding-right: 15px;">
                  <source src="http://gossv.vcg.com/videos/mts_videos/medium/VCG2218090475.mp4" type="video/mp4" />
                </video>
                <!-- <video
                  src=""
                 
                ></video> -->
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

export default {
  props: ['checkParam'],
  data() {
    return {
      fileListData: [], // 附件列表数据
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
          { label: '平均值S', name: 'funcYmean' },
          { label: '最大值Smax', name: 'funcYmax' }
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
          { label: '起点埋深', name: 'startDepth' },
          { label: '终点埋深', name: 'endDepth' }
        ],
        [
          { label: '管径', name: 'diameter' },
          { label: '材质', name: 'material' }
        ],
        [
          { label: '敷设年代', name: 'constr' },
          { label: '长度', name: 'pipeLength' }
        ]
      ], // 详情表格参数
      activeIndex: '1', // 详情导航索引
      checkDialogFormVisible: false, // 详情弹框显影
      DetailsForm: {} // 详情表单
    }
  },
  async mounted() {
    // this.checkDialogFormVisible = this.checkParam.bool
    await this.openDetails()
  },
  activated() {
    console.log('切换了组价')
  },
  methods: {
    //   关闭弹框
    closeDialog() {
      this.$emit('sendBool', false)
    },
    // 详情
    async openDetails() {
      console.log('管道检测开始', this.checkParam)
      if (this.checkParam) {
        console.log('走了有id的方法')
        let res = await assessmentDetails(this.checkParam)
        this.DetailsForm = res.result

        // 附件
        // 获得字典id
        await this.getParamsId()
        // 获取附件列表
        let params = {
          current: this.paginationEnclosure.current,
          size: this.paginationEnclosure.size,
          itemId: this.checkParam,
          uploadFileTypeDicId: this.updataParamsId.uploadFileTypeDicId,
          uploadItemDictId: this.updataParamsId.uploadItemDictId
        }
        let fileRes = await queryPageEnclosure(params)
        console.log('附件分页数据', fileRes)
        this.fileListData = fileRes.result.records

        // 绘制剖面图
        this.$nextTick(() => {
          this.renderEcharts()
        })
      }
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
      let chartDom = document.getElementById('profile_echatrs')
      let myChart = echarts.init(chartDom)
      let option
      option = {
        xAxis: {
          type: 'category',
          data: [{ value: '起点' + this.DetailsForm.startPoint }, '', { value: '终点' + this.DetailsForm.endPoint }],
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '埋深：m',
          axisLine: {
            show: true //隐藏y轴
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
            data: [
              this.DetailsForm.startDepth,
              (this.DetailsForm.startDepth + this.DetailsForm.endDepth) / 2,
              this.DetailsForm.endDepth
            ],
            type: 'line',
            color: '#CFCCCC',
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true,
                formatter: function (a) {
                  console.log('标题参数', a)
                  return ` 埋深 ${a['name']}m `
                }
              },
              data: [
                { xAxis: 0, name: this.DetailsForm.startDepth },
                { xAxis: 2, name: this.DetailsForm.endDepth }
              ]
            }
          },

          {
            data: [
              { value: this.DetailsForm.startDepth, name: '沉积', type: 'CJ' },
              { value: (this.DetailsForm.startDepth + this.DetailsForm.endDepth) / 2, name: '变形', type: 'BX' }
            ],
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
                    return `（${a['data']['type']}）${a['name']},${a['value']}m  `
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
                textColor: 'red',
                borderWidth: 6,
                borderColor: '#E91111',
                color: '#2D74E7'
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
.detailsCrad {
  position: fixed;
  top: 100px;
  right: 45px;
  z-index: 9;
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  /deep/ .box-card {
    width: 550px;
    max-height: 80vh;
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
      /deep/ .content-info {
        overflow-y: scroll;
        height: 600px;
        padding: 10px 20px;
        .info-title {
          font-size: 14px;
          font-weight: bold;
          margin: 5px 0;
        }
        .info-box {
          height: 100%;
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
        /deep/ .el-form {
          .el-link--inner {
            max-width: 416px;
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