<template>
  <div class="testResultDiagram i-scrollbar" :data="'这个是data'">
    <!-- 检测成果专题图 -->
    <p class="title">查询设置</p>
    <el-form ref="form" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="工程名称:" prop="name">
        <el-select @change='projectChange' v-model="form.project">
          <el-option
            v-for="(item, index) in projectOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测报告:">
        <el-select :disabled="!form.project" v-model="form.report" placeholder="请选择检测报告" multiple>
          <el-option
            v-for="(item, index) in reportOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测日期:">
        <el-row style="margin-bottom:15px;">
          <el-date-picker
            type="date"
            placeholder="开始日期"
            v-model="form.startDate"
            :picker-options="sOpition"
            style="width: 100%"
          ></el-date-picker>
        </el-row>
        <!-- <el-col style="text-align: center" :span="2">至</el-col> -->
        <el-row>
          <el-date-picker
            type="date"
            placeholder="结束日期"
            v-model="form.endDate"
            :picker-options="eOpition"
            style="width: 100%"
          ></el-date-picker>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="see-btn">
      <el-button type="primary" @click="showLayer">查看<i :class="loading ? 'el-icon-loading' : ''"></i></el-button>
    </div>
    <p class="title">专题图列表</p>
    <div v-for="(item, index) in defectLegend" :key="index" class="thematicMap-list">
      <div>
        <div class="thematicMap-title">
          <i
            style="cursor: pointer"
            @click="changeArrow(index)"
            :class="{ 'el-icon-caret-bottom': showThemBox[index], 'el-icon-caret-right': !showThemBox[index] }"
          ></i>
          <el-checkbox
            @change="setThemLayerVisible(index, item.open)"
            v-model="item.open"
            :label="item.title"
          ></el-checkbox>
        </div>
        <transition>
          <div v-if="item.type === 'gradient' && showThemBox[index]" class="transition-box">
            <div class="line-color"></div>
            <div class="text-mix-max">
              <span>{{ item.start }}</span>
              <span>{{ item.end }}</span>
            </div>
          </div>
          <div v-else-if="showThemBox[index]" class="transition-box">
            <ul>
              <li @click="openBox(item.layerName, i)" v-for="(level, i) in item.level" :key="i" :class="comStyle(item.type, level.color)">
                {{ level.label + ' / ' + level.num + level.unit }}<i :class="(level.num || hasLoad) ? '' : 'el-icon-loading'"></i>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <!-- 表格当前列信息弹出框 -->

      <div id='popupCard' class="histroyPipeData" v-show="currentInfoCard">
        <div class="detailsCrad" v-if="currentInfoCard">
          <el-card class="box-card" style="width: 300px">
            <div class="table-content">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  box-sizing: border-box;
                "
              >
                <span style="font-weight: bold"
                  >功能性缺陷:({{ DetailsForm.defectCode }}){{ DetailsForm.defectName }}
                </span>
                <a style="font-size: 12px; color: #2d74e7; text-decoration: underline" @click="openDetails">详情</a>
              </div>
              <div style="padding: 3px 0">{{ DetailsForm.expNo + (DetailsForm.pipeType ? DetailsForm.pipeType : '') }}</div>
              <div class="content-info">
                <div class="left">
                  <div style="padding: 3px 0">检测日期&emsp; {{ DetailsForm.sampleTime }}</div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="flex: 1">距离:&emsp;{{ DetailsForm.distanceStartPoint }}</span
                    ><span style="flex: 1">等级:&emsp;{{ DetailsForm.defectLevel }}</span>
                  </div>
                  <div style="display: flex; padding: 3px 0">
                    <span style="width: 35px">评价:</span>
                    <span style="line-height: 16px; padding-left: 10px">{{ DetailsForm.pipeNote }}</span>
                  </div>
                </div>
                <div class="right">
                  <el-tabs v-model="activeName">
                    <el-tab-pane :label="`照片`" name="picnum">
                      <div class="container">
                        <el-image
                          style="width: 100%; height: 90%; -webkit-user-drag: none"
                          :src="getImgUrl"
                          :preview-src-list="[getImgUrl]"
                        >
                        </el-image>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`视频`" name="viedoNum">
                      <div style="width: 100%; height: 100%" v-if="DetailsForm.videopath">
                        <video controls="controls" width="100%" height="83%">
                          <source :src="getVideoUrl" type="video/mp4" />
                        </video>
                      </div>
                      <div v-show="!DetailsForm.videopath" style="text-align: center; height: 90%;margin-top: 20px">暂无视频</div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    <transition name="el-fade-in-linear">
      <check-details @close="dialogClose" v-show="dialogFormVisible" :checkParam="pipeId"></check-details>
    </transition>
  </div>
</template>

<script>
import Feature from 'ol/Feature'
import { Point, LineString, Polygon } from 'ol/geom'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { comSymbol } from '@/utils/comSymbol'
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { appconfig } from 'staticPub/config'
import GeoJSON from 'ol/format/GeoJSON'
import { getDefectDataById, getDefectData, getProject, getReportByProjecetId, getDefectDataByFilter } from '@/api/sysmap/drain'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'
import defectImg1 from '@/assets/images/traingle1.png';
import defectImg2 from '@/assets/images/traingle2.png';
import defectImg3 from '@/assets/images/traingle3.png';
import defectImg4 from '@/assets/images/traingle4.png';
import defectImg0 from '@/assets/images/traingle0.png';

import { unByKey } from 'ol/Observable'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { queryDefectdetails } from '@/api/pipelineManage'
import { Overlay } from 'ol';
import { baseAddress } from '@/utils/request';
import checkDetails from '@/views/zhpt/pipelineManage/components/checkDetails.vue'

export default {
  components: { checkDetails }, 
  props: { data: Object },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ]
      },
      form: {
        project: '',
        report: '',
        startDate: '',
        endDate: ''
      },

      // 报告数据
      reportOpt: [
      ],
      // 工程数据
      projectOpt: [
      ],
      defectLegend: [
        // {
        //   title: '管网缺陷密度图',
        //   layerName: 'heatLayer',
        //   open: false,
        //   type: 'gradient',
        //   start: '少',
        //   end: '多'
        // },
        {
          title: '管道缺陷分布图',
          layerName: 'pipeDefectLayer',
          open: true,
          type: 'img',
          level: [
            { color: '1', label: '一级', num: 0, unit: '个' },
            { color: '2', label: '二级', num: 0, unit: '个' },
            { color: '3', label: '三级', num: 0, unit: '个' },
            { color: '4', label: '四级', num: 0, unit: '个' },
            { color: '0', label: '未定级', num: 0, unit: '个' }
          ]
        },
        {
          title: '管道结构性缺陷等级分布图',
          layerName: 'pipeStrucLayer',
          open: true,
          type: 'line',
          level: [
            { color: 'green', label: 'Ⅰ级', num: 0, unit: '条' },
            { color: 'blue', label: 'Ⅱ级', num: 0, unit: '条' },
            { color: 'pink', label: 'Ⅲ级', num: 0, unit: '条' },
            { color: 'red', label: 'Ⅳ级', num: 0, unit: '条' },
            { color: 'un', label: '未定级', num: 0, unit: '条' }
          ]
        },    
        {
          title: '管道功能性缺陷等级分布图',
          layerName: 'pipeFuncLayer',
          open: true,
          type: 'line',
          level: [
            { color: 'green', label: 'Ⅰ级', num: 0, unit: '条' },
            { color: 'blue', label: 'Ⅱ级', num: 0, unit: '条' },
            { color: 'pink', label: 'Ⅲ级', num: 0, unit: '条' },
            { color: 'red', label: 'Ⅳ级', num: 0, unit: '条' },
            { color: 'un', label: '未定级', num: 0, unit: '条' }
          ]
        }
      ],
      showThemBox: [true, true, true, true],

      mapView: null,
      pipeDefectLayer: null,
      manholeDefectLayer: null,
      pipeHealthLayer: null,
      currentDataProjName: "proj43",
      projUtil: null,
      clickEvent: null,
      loading: false,
      currentInfoCard: false,
      DetailsForm: {},
      popup: null,
      activeName: 'picnum',
      // 时间过滤
      sOpition: {
        disabledDate: time => {
          time = time.getTime()
          if (this.form.endDate) {
            return time > new Date(this.form.endDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: time => {
          time = time.getTime()
          if (this.form.startDate) {
            return time < new Date(this.form.startDate).getTime() || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      },
      // 
      dialogFormVisible: false,
      pipeId: 0,
      hasLoad: false
    }
  },
  mounted() {
    this.init()
    console.log('加载检测成果专题图')
  },
  destroyed() {
    this.clearAll()
  },
  computed: {
    getVideoUrl() {
      let address = baseAddress + '/psjc/file' + this.DetailsForm.videopath
      console.log('address', address)
      return address
    },
    getImgUrl() {
      let address = baseAddress + '/psjc/file' + this.DetailsForm.picPath
      console.log('address', address)
      return address
    }
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n !== '检测成果专题图') {
        this.clearAll()
        this.$store.dispatch('map/handelClose', {
          box:'Panel',
          pathId: 'testReportManagement',
          widgetid: 'Panel',
        })
      } else {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.projUtil = new projUtil()
      this.projUtil.resgis(this.currentDataProjName)

      this.mapView = this.data.mapView
      // this.heatLayer = new Heatmap({
      //   source: new VectorSource(),
      //   gradient: ['#3ce10f', '#ff0602'],
      //   radius: 16,
      //   visble: false
      // })
      this.pipeDefectLayer = new VectorLayer({ source: new VectorSource(), visible: true })
      this.pipeFuncLayer = new VectorLayer({ source: new VectorSource(), visible: true })
      this.pipeStrucLayer = new VectorLayer({ source: new VectorSource(), visible: true })
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(7, 'rgba(255, 0, 0, 0.6)', 9, 'rgba(0, 255, 255, 0.6)') })
      this.addLayers([this.pipeFuncLayer, this.pipeStrucLayer, this.pipeDefectLayer, this.lightLayer])  

      this.setAllDefect()
      this.setProjectData()
    },
    clearAll () {
      this.pipeDefectLayer && this.mapView.removeLayer(this.pipeDefectLayer)
      this.pipeStrucLayer && this.mapView.removeLayer(this.pipeStrucLayer)
      this.pipeFuncLayer && this.mapView.removeLayer(this.pipeFuncLayer)
      this.lightLayer && this.mapView.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
      this.popup && this.mapView.removeOverlay(this.popup)
    },
    setProjectData () {
      getProject({ current: 1, size: 1e5 }).then(res => {
        if (res.code === 1) {
          // label, value
          this.projectOpt = res.result.records.map(record => {
            return { label: record.prjName, value: record.prjNo }
          })
          // 默认选择第一项
          // if (this.projectOpt.length !== 0) {
          //   this.$set(this.form, 'project', this.projectOpt[0].label)
          //   this.projectChange(this.projectOpt[0].value)
          // }
        } else this.$message.error('获取工程项目失败!')
      })
    },
    // 项目变化
    projectChange (prjNo) {
      prjNo = prjNo || this.form.project
      getReportByProjecetId({ prjNo }).then(res => {
        if (res.code === 1) {
          this.form.report = ''
          let data = res.result
          this.reportOpt = data.map(d => {
            return { label: d.wordInfoName, value: d.id }
          })
        } else this.$message.error('获取报告失败!')
      })
    },
    openBox (layerName, level) {
      if(!this.hasLoad) return
      let type = ['pipeDefectLayer', 'pipeFuncLayer', 'pipeStrucLayer'].indexOf(layerName)
      let filter = [
        { key: 'defectLevel', value: ['一','二','三','四', '/'] },
        { key: 'funcClass', value: ['Ⅰ','Ⅱ','Ⅲ','Ⅳ', '/'] },
        { key: 'structClass', value: ['Ⅰ','Ⅱ','Ⅲ','Ⅳ',  '/'] }
      ][type]
      console.log('图例信息', filter)
      let features = this[layerName].getSource().getFeatures()
      let filterFeas = features.filter(fea => fea.get(filter.key) && fea.get(filter.key).includes(filter.value[level]))
      // let lightFeas = filterFeas.map(fea => new Feature({ geometry: fea.getGeometry().clone() }))
      // this.lightLayer.getSource().clear()
      // this.lightLayer.getSource().addFeatures(lightFeas)
      let lv = filter.value[level] === '/' ? '未定': filter.value[level]
      this.openDefect(filter.key, lv, layerName, filterFeas)
    },
    addLayers(layers) {
      layers.forEach((layer) => this.mapView.addLayer(layer))
    },
    setAllDefect () {
      getDefectData().then(res => {
        if (res.code === 1) {
          this.initMap(res.result)
        } else this.$message.error('请求缺陷数据失败')
      })
    },
    initMap(data) {
      // 管网缺陷
      let pipeData = data.map(item => item.pipeStates).flat()
      let { strucDefectFeatures, funcDefectFeatures, pipeDefectFeatures } = this.getFeatures(pipeData)
      
      this.lightLayer.getSource().clear()
      this.pipeStrucLayer.getSource().clear()
      this.pipeFuncLayer.getSource().clear()
      this.pipeDefectLayer.getSource().clear()

      this.pipeStrucLayer.getSource().addFeatures(strucDefectFeatures)
      this.pipeFuncLayer.getSource().addFeatures(funcDefectFeatures)
      this.pipeDefectLayer.getSource().addFeatures(pipeDefectFeatures)

      let center = new mapUtil().getCenterFromFeatures([...strucDefectFeatures,  ...funcDefectFeatures])
      this.mapView.getView().setCenter(center)
      this.mapView.getView().setZoom(18)

      this.loading = false
      this.hasLoad = true

      this.clickEvent = this.mapView.on('click', (evt) => {
        let feas = this.mapView.getFeaturesAtPixel(evt.pixel)
        if (feas.length !== 0) {
          let point = feas.find(item => item.getGeometry() instanceof Point)
          if (point) {
            this.openPromptBox(point.get('id'), 'pipeDefectLayer')
          }
        } else {
          this.currentInfoCard = false
          this.lightLayer.getSource().clear()
        }
      })
    },

    /**
     * 构造要素
     * @param featureArr 数据
     * */
    getFeatures(featureArr) {
      let style = null, features = { pipeDefectFeatures: [], funcDefectFeatures: [], strucDefectFeatures: [] }
        let funcNum = [0, 0, 0, 0, 0]
        let strucNum = [0, 0, 0, 0, 0]
        let defectNum = [0, 0, 0, 0, 0]
        featureArr.forEach((feaObj) => {
          let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
          if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
            endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')
            let lineCoors = [startPoint, endPoint]
            let feature = new Feature({ geometry: new LineString(lineCoors) })

            // 健康等级颜色
            let colors = [
              { level: 'Ⅰ', color: 'green', index: 0 },
              { level: 'Ⅱ', color: 'blue', index: 1 },
              { level: 'Ⅲ', color: 'pink', index: 2 },
              { level: 'Ⅳ', color: 'red', index: 3 },
              { level: '/', color: '#070358', index: 4}
            ]
            let findFuncColor = colors.find(colorObj => feaObj['funcClass'] && feaObj['funcClass'].includes(colorObj.level))
            let findStrucColor = colors.find(colorObj => feaObj['structClass'] && feaObj['structClass'].includes(colorObj.level))

            if (findFuncColor) {
              let fFea = feature.clone()
              funcNum[findFuncColor.index] += 1
              fFea.setStyle(comSymbol.getLineStyle(5, findFuncColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && fFea.set(i, feaObj[i])
              }
              features.funcDefectFeatures.push(fFea)
            }
            if (findStrucColor) {
              let sFea = feature.clone()
              strucNum[findStrucColor.index] += 1
              sFea.setStyle(comSymbol.getLineStyle(5, findStrucColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && sFea.set(i, feaObj[i])
              }
              features.strucDefectFeatures.push(sFea)
            }
            // 缺陷数据
            feaObj.pipeDefects.forEach((feaObj, index) => {
              if (feaObj.geometry) {
                let coors = JSON.parse(feaObj.geometry)
                let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
                let feature = new Feature({ geometry: new Point(point) })
                let imgs = [
                  { level: '一级', img: defectImg1, index: 0 },
                  { level: '二级', img: defectImg2, index: 1 },
                  { level: '三级', img: defectImg3, index: 2 },
                  { level: '四级', img: defectImg4, index: 3 },
                  { level: '/', img: defectImg0, index: 4 }
                ]
                let findimg = null

                if (feaObj.defectLevel) {
                  findimg = imgs.find(colorObj => feaObj['defectLevel'].includes(colorObj.level))
                }
                // 缺少 defectLevel 字段
                if (findimg) {
                  defectNum[findimg.index] += 1
                  let rotation = getIconRat(lineCoors)
                  feature.setStyle(new Style({ image: new Icon({ size: [48, 48], anchor: [0.5, 0], src: findimg.img, scale: 0.4, rotation }) }))
                  for (let i in  feaObj) {
                    i !== "geometry" && feature.set(i, feaObj[i])
                  }
                  features.pipeDefectFeatures.push(feature)
                }
              }
            })
          } else {
            console.log('没有geometry')
          }
        })
        // 把数量填充到图例
        this.defectLegend[1].level.forEach((l, index) => {
          l.num = strucNum[index]
        })
        this.defectLegend[2].level.forEach((l, index) => {
          l.num = funcNum[index]
        })
        // 把数量填充到图例
        this.defectLegend[0].level.forEach((l, index) => {
          l.num = defectNum[index]
        })
      return features

      function getIconRat ([startPoint, endPoint]) {
        let rotation = 0
        // 因为要垂直管线显示，所以图片旋转 90°
        let imgRt = Math.PI / 2

        // 计算旋转弧度
        if (endPoint[0] === startPoint[0]) { // 竖直
          rotation = endPoint[1] > startPoint[1] ? -imgRt : Math.PI - imgRt
        } else if (endPoint[1] === startPoint[1]) { // 水平
          rotation = endPoint[1] > startPoint[1] ? Math.PI / 2 - imgRt : Math.PI * 3 / 2 - imgRt
        } else { // 其他角度
          rotation = Math.atan((endPoint[0] - startPoint[0]) / (endPoint[1] - startPoint[1])) - imgRt
        }
        return rotation
      }
    },

    randomPoint(center, range, num) {
      return new Array(num).fill(center).map(([centerX, centerY]) => {
        let x = Math.random() * range
        let y = Math.random() * range
        return [centerX + x, centerY + y]
      })
    },

    showLayer() {
      if (!this.form.project) return this.$message.warning('请先填写工程名称')
      this.loading = true
      let ids = this.form.report.join(",")
      let params = {
        prjNo: this.form.project,
        ids: this.form.report,
        jcStartDate: this.form.startDate ? this.form.startDate.toLocaleDateString().replace(/\//g, '-') : '',
        jcEndDate: this.form.endDate ? this.form.endDate.toLocaleDateString().replace(/\//g,   '-') : ''
      }
      getDefectDataByFilter(params).then(res => {
        if (res.code === 1) {
          let data = res.result
          if (data.length !== 0) {
            this.initMap(data)
          } else this.$message.info('无管线缺陷数据')
        } else this.$message.error('请求缺陷数据出错')

      })
      
      this.defectLegend.forEach((item) => {
        this[item.layerName].setVisible(item.open)
      })
    },

    setThemLayerVisible(index, visible) {
      let legendParams = this.defectLegend[index], 
          layer = this[legendParams.layerName]
      layer.setVisible(visible)
      this.lightLayer.getSource().clear()
    },
    changeArrow(index) {
      console.log('点击箭头')
      this.$set(this.showThemBox, index, !this.showThemBox[index])
    },
    comStyle(type, color) {
      if (type === 'img') return `type-${type}-${color}`
      return `item-${color} type-${type}`
    },
    // 管道缺陷管理的信息
    openDefect(type, level, layerName, data) {
      let doc = {
        structClass: `管道结构性缺陷`,
        funcClass: '管道功能性缺陷',
        defectLevel: '管道缺陷'
      }
      let com = type === 'defectLevel' ? 'testPipelineDefect' : 'testPipelineEvaluation'
      let info = {
        icon: 'iconfont',
        id: com,
        label: `${doc[type]} (${level}级)`,
        meta: {
          title: doc[type] + level
        },
        name: com,
        noShowingChildren: true,
        parentPathid: '/' + com,
        path: '',
        type: 'gis',
        widgetid: 'HalfPanel',
        param: { type, level, data, layerName, rootPage: this }
      }
      // 这是map里的跳转方法
      this.$store.dispatch('map/changeMethod', info)
    },
    // 打开弹窗
    async openPromptBox (id, layerName) {
      console.log('打开弹窗')
      let res = await queryDefectdetails(id)
      let position = this.lightFea(id, layerName)
      this.DetailsForm = res.result
      this.currentInfoCard = true
      // 
      if (position) {
        this.popup = new Overlay({
          element: document.getElementById("popupCard"),
          //当前窗口可见
          autoPan: true,
          positioning: 'bottom-center',
          stopEvent: true,
          offset: [18, -25],
          autoPanAnimation: { duration: 250 }
        });
        this.mapView.addOverlay(this.popup)
        this.popup.setPosition(position)
      }
    },
    clearLightFeas () {
      this.lightLayer.getSource().clear()
    },
    lightFea (feaid, layerName) {
      let feas = this[layerName].getSource().getFeatures()
      let fea = feas.find(fea => fea.get('id') === feaid)
      if (fea) {
        let geometry = fea.getGeometry().clone()
        this.lightLayer.getSource().clear()
        this.lightLayer.getSource().addFeature(new Feature({ geometry }))
        let coors = geometry.getCoordinates()
        let center = new mapUtil().getCenter(fea)
        
        this.mapView.getView().setCenter(center)
        this.mapView.getView().setZoom(20)
        return center
      } else {
        this.$message.warning('该点无位置信息')
        return null
      }
    },
    openDetails () {
      console.log('打开详情', this.DetailsForm)
      this.pipeId = this.DetailsForm.id
      this.dialogFormVisible = true
    },
    // 详情关闭
    dialogClose () {
      this.dialogFormVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}

.testResultDiagram {
  padding: 0 12px !important;
  overflow-y: scroll;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  .see-btn {
    display: flex;
    flex-direction: row-reverse;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
.title {
  padding-left: 16px;
}
.title::before {
  position: relative;
  left: -10px;
  top: 2px;
  content: '';
  width: 5px;
  height: 18px;
  display: inline-block;
  background-color: #2d74e7;
}
.thematicMap-list {
  display: flex;
  flex-direction: column;
  .transition-box {
    padding: 6px 0 6px 44px;
    box-sizing: border-box;
  }
}
.line-color {
  width: 140px;
  height: 10px;
  border: 1px solid #666;
  background: linear-gradient(to right, #3ce10f, #ff0602); /* 标准的语法 */
}
.text-mix-max {
  width: 140px;
  display: flex;
  padding: 8px 0;
  box-sizing: border-box;
  justify-content: space-between;
}
.type-img-3 {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../../../assets/images/traingle3.png');
    background-size: 100% 100%;;
    display: inline-block;
  }
}
.type-img-2 {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../../../assets/images/traingle2.png');
    background-size: 100% 100%;;
    display: inline-block;
  }
}
.type-img-1 {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../../../assets/images/traingle1.png');
    background-size: 100% 100%;;
    display: inline-block;
  }
}
.type-img-4 {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../../../assets/images/traingle4.png');
    background-size: 100% 100%;;
    display: inline-block;
  }
}
.type-img-0 {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../../../assets/images/traingle0.png');
    background-size: 100% 100%;;
    display: inline-block;
  }
}
.type-circle {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
}
.type-square {
  cursor: pointer;
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent !important;
    display: inline-block;
  }
}
.type-line {
  cursor: pointer;
  margin: 10px 0 10px 18px !important;
  &::before {
    position: relative;
    top: -2px;
    left: -20px;
    content: '';
    width: 40px;
    height: 8px;
    display: inline-block;
  }
}
.item-un {
  &::before {
    background-color: #070358;
    border: 1px solid #070358;
  }
}
.item-blue {
  &::before {
    background-color: blue;
    border: 1px solid blue;
  }
}
.item-green {
  &::before {
    background-color: #0c9923;
    border: 1px solid #0c9923;
  }
}
.item-pink {
  &::before {
    background-color: #f405ff;
    border: 1px solid #f405ff;
  }
}
.item-red {
  &::before {
    background-color: #ff0000;
    border: 1px solid #ff0000;
  }
}
#popupCard {
    .histroyPipeData {
    // 详情卡片的样式
    .detailsCrad {
      position: fixed;
      top: 100px;
      right: 24px;
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
        width: 500px;
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
          height: 600px;
          /deep/ .content-info {
            overflow-y: scroll;
            // max-height: 545px;
            height: 100%;
            padding: 10px 20px;
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
            /deep/ .el-form {
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
          }
        }
        .table-content {
          padding: 15px;
          .content-info {
            font-size: 12px;
            display: flex;
            // justify-content: space-between;
            flex-direction: column;
            align-content: center;
            .left {
              font-family: 'Microsoft YaHei UI', sans-serif;
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
                margin: 11px 0 0 0;
                background: transparent;
              }
              .el-tabs__header {
                border-top: 0;
                background: #fff;
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
              margin-bottom: 10px;
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
  }
  &::after {
    content: '';
    display: block;
    width: 45px;
    height: 27px;
    background: url('../components/testImg/corner.png');
    position: absolute;
    bottom: -26px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

</style>