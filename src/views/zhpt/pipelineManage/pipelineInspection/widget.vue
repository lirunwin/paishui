<template>
  <div class="engineering-manage" @keyup.enter="searchApi">
    <!-- 管道检测历史管理 -->
    <div class="table-box">
      <div class="top-tool">
        <div class="serch-engineering">
          <el-input
            placeholder="支持搜索管段编号、道路名称"
            v-model="searchParams.keyword"
            clearable
            class="serch-input"
            suffix-icon="el-input__icon el-icon-search"
          >
          </el-input>
          <el-date-picker v-model="searchParams.jcDate" type="date" placeholder="检测日期" class="date-css">
          </el-date-picker>
          <div class="release-radio">
            <p class="release-title">检测状态:</p>
            <el-radio v-model="searchParams.jcStatus" label="0">未检测</el-radio>
            <el-radio v-model="searchParams.jcStatus" label="1">已检测</el-radio>
            <!-- <el-checkbox-group v-model="searchValue.jcStatus">
              <el-checkbox label="">全部</el-checkbox>
              <el-checkbox label="0">未检测</el-checkbox>
              <el-checkbox label="1">已检测</el-checkbox>
            </el-checkbox-group> -->
          </div>
          <div class="title">结构性缺陷等级：</div>
          <el-select v-model="searchParams.funcClass" placeholder="">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select>
          <div class="title">功能性缺陷等级：</div>
          <el-select v-model="searchParams.structClass" placeholder="">
            <el-option v-for="(item, i) in gradeArr" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="right-btn">
          <el-button class="serch-btn" style="margin-left: 26px" type="primary" @click="searchApi"> 搜索 </el-button>
          <el-button class="serch-btn" type="primary" @click="resetBtn"> 重置 </el-button>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        height="250"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="openPromptBox"
      >
        <template slot="empty">
          <img style="-webkit-user-drag: none" src="@/assets/images/nullData.png" alt="暂无数据" srcset="" />
        </template>
        <el-table-column header-align="center" align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column
          :prop="v.name"
          header-align="center"
          :label="v.label"
          align="center"
          show-overflow-tooltip
          v-for="v in tableContent"
          :key="v.name"
        >
        </el-table-column>

        <el-table-column fixed="right" header-align="center" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 30, 50, 100, 1000]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情卡片 -->
    <transition name="el-fade-in-linear">
      <div class="detailsCrad" v-show="dialogFormVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>管道检测详情 ({{ detailsTitle.pipeType + detailsTitle.expNo }})</span>
            <span style="float: right; padding: 3px 0; cursor: pointer; user-select: none">
              <i class="el-icon-caret-left" type="text" @click="lastPage"></i>
              {{ currentIndex + 1 }}/{{ cardTable.length }}
              <i class="el-icon-caret-right" type="text" @click="nextPage"></i>
              <i class="el-icon-close" type="text" @click="dialogFormVisible = false"></i>
            </span>
          </div>
          <div class="content">
            <div class="box1">
              <el-form ref="form" :model="tableForm" label-width="auto" label-position="right">
                <div class="detailsTitle">管段信息</div>
                <el-row v-for="(v, i) in cardTableContent" :key="i">
                  <el-col :span="12" style="padding-right: 15px">
                    <el-form-item :label="v[0].label">
                      <el-input v-model="tableForm[v[0].name]" disabled show-word-limit></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right: 15px"
                    ><el-form-item :label="v[1].label">
                      <el-input v-model="tableForm[v[1].name]" disabled show-word-limit></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="detailsTitle">检测历史</div>
                <div class="historyTitle">
                  <div>
                    <span style="margin-right: 40px">2021-01-09</span>
                    <span> (无)</span>
                  </div>
                  <div>详情</div>
                </div>
                <el-row>
                  <el-col :span="12" style="padding-right: 15px">
                    <el-form-item label="检测方向">
                      <el-input v-model="tableForm.detectDir" disabled show-word-limit></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right: 15px"
                    ><el-form-item label="检测长度">
                      <el-input v-model="tableForm.checkLength" disabled show-word-limit></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { queryPageHistory, histroyPipeData } from '@/api/pipelineManage'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'
import { comSymbol } from '@/utils/comSymbol'
import { unByKey } from 'ol/Observable'
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon'
import { getDefectData } from '@/api/sysmap/drain'
import defectImgR from '@/assets/images/traingle-r.png';
import defectImgB from '@/assets/images/traingle-b.png';
import defectImgY from '@/assets/images/traingle-y.png';
import defectImgLB from '@/assets/images/traingle-lb.png';


export default {
  props: ['data'],
  data() {
    return {
      detailsTitle: {}, // 详情头部信息
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
      currentIndex: 0, // 详情页数
      cardTable: [], // 详情表格数据
      activeIndex: '1', // 详情导航索引
      dialogFormVisible: false, // 详情弹框显影
      // 表格参数
      tableContent: [
        { label: '工程名称', name: 'prjName' },
        { label: '管段编号', name: 'expNo' },
        { label: '管段类型', name: 'pipeType' },
        { label: '管径(mm)', name: 'diameter' },
        { label: '材质', name: 'material' },
        { label: '道路名称', name: 'address' },
        { label: '所属片区', name: 'checkAddress' },
        { label: '检测次数', name: 'jcNum' },
        { label: '最近检测日期', name: 'jcNewDate' },
        { label: '最新结构性缺陷等级', name: 'newStructClass' },
        { label: '最新结构性缺陷评价', name: 'newStructEstimate' },
        { label: '最新功能性缺陷等级', name: 'newFuncClass' },
        { label: '最新功能性缺陷评价', name: 'newFuncEstimate' }
      ],
      gradeArr: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], // 缺陷等级
      // 搜索需要的参数
      searchParams: {
        keyword: '',
        jcDate: '',
        defectLevelA: '',
        defectLevelB: ''
      },
      // 分页需要的值
      pagination: { current: 1, size: 30 }, // 分页参数信息
      paginationTotal: 0, // 总页数
      tableData: [],
      isPromptBox: {}, // 当前列信息
      form: {},
      //
      vectorLayer: null,
      map: null,
      lightLayer: null,
      clickEvent: null,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj43', // 当前坐标系
    }
  },
  created() {
    let res = this.getDate()
  },
  mounted () {
    this.map = this.data.mapView
    this.projUtil = new projUtil()
    this.projUtil.resgis(this.currentDataProjName)
    this.init()
  },
  destroyed () {
    this.clearAll()
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n !== '管道评估结果管理') {
        this.clearAll()
        this.hasData = false
      } else {
        this.init()
      }
    }
  },
  computed: {
    tableForm() {
      // console.log("当前详情页数",this.cardTable[this.currentIndex]);
      return this.cardTable[this.currentIndex] || {}
    }
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource()})
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(6, 'rgba(0, 255, 255, 0.6)', 9, 'rgba(0, 255, 255, 0.6)') })
      this.map.addLayer(this.vectorLayer)
      this.map.addLayer(this.lightLayer)
      this.clickEvent = this.map.on('click', evt => {
        let feas = this.map.getFeaturesAtPixel(evt.pixel)
        if (feas.length !== 0) {
          let id = feas[0].get('id')
          // this.openPromptBox({id})
        }
      })
      this.getPipeDefectData()
    },
    clearAll () {
      this.vectorLayer && this.map.removeLayer(this.vectorLayer)
      this.lightLayer && this.map.removeLayer(this.lightLayer)
      this.clickEvent && unByKey(this.clickEvent)
    },
    getPipeDefectData() {
      getDefectData().then(res => {
        if (res.code === 1) {
          let dFeas = [], pFeas = []
          if (res.result && res.result.length !== 0) {
            let reportInfo = res.result[0] ? res.result : [res.result],
              pipeData = [],
              defectData = []
            reportInfo.forEach(rpt => {
              let pipeStates = rpt.pipeStates
              pipeData = [...pipeData, ...pipeStates]
              defectData = [...defectData, ...pipeStates.map(pipe => pipe.pipeDefects).flat()]
            })
            dFeas = this.getFeatures(defectData, 2)
            pFeas = this.getFeatures(pipeData, 1)
          }
          this.vectorLayer.getSource().clear()
          this.lightLayer.getSource().clear()

          if (dFeas.length !== 0 || pFeas.length !== 0) {
            this.vectorLayer.getSource().addFeatures([...dFeas, ...pFeas])
          }
        } else this.$message.error('管线缺陷数据请求失败')
      })
    },
    getFeatures(featureArr, type, hasStyle = true) {
      let style = null,
        features = []
      if (type === 1) {
        featureArr.forEach((feaObj) => {
          let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
          if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
            endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')

            let coors = [startPoint, endPoint]
            let feature = new Feature({ geometry: new LineString(coors) })
            // 健康等级颜色
            let colors = [
              { level: 'Ⅰ', color: 'green', index: 0 },
              { level: 'Ⅱ', color: 'blue', index: 1 },
              { level: 'Ⅲ', color: 'pink', index: 2 },
              { level: 'Ⅳ', color: 'red', index: 3 }
            ]
            let findColor = colors.find((colorObj) => feaObj['funcClass'].includes(colorObj.level))

            if (findColor) {
              feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
          }
        })
      } else {
        featureArr.forEach((feaObj, index) => {
          if (feaObj.geometry) {
            let coors = JSON.parse(feaObj.geometry)
            let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
            let feature = new Feature({ geometry: new Point(point) })
            let colors = [
              { level: '一级', color: 'green', index: 0 },
              { level: '二级', color: 'blue', index: 1 },
              { level: '三级', color: 'pink', index: 2 },
              { level: '四级', color: 'red', index: 3 }
            ]
            let findColor = colors.find(colorObj => feaObj['defectLevel'].includes(colorObj.level))
            if (findColor) {
              let imgBox = [defectImgLB, defectImgB, defectImgY, defectImgR], img = imgBox[3]
              feature.setStyle(new Style({ image: new Icon({ size: [48, 48], src: img, scale: 0.3 }) }))
              // feature.setStyle(comSymbol.getAllStyle(5, findColor.color, 0, 'rgba(0,0,0,0)'))
              for (let i in  feaObj) {
                i !== "geometry" && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
          }
        })
      }
      return features
    },
    setPositionByPipeId (id) {
      let features = this.vectorLayer.getSource().getFeatures()
      let filterFea = features.find(fea => fea.get("expNo") === id)
      console.log('定位')
      if (filterFea) {
        let feature = new Feature({ geometry: filterFea.getGeometry().clone(), style: comSymbol.getAllStyle(5, '#DCDC8B', 5, '#DCDC8B')})
        this.lightLayer.getSource().clear()
        this.lightLayer.getSource().addFeature(feature)
        let position = feature.getGeometry().getCoordinates().flat()
        position.length = 2
        this.map.getView().setCenter(position)
        this.map.getView().setZoom(21) 
      }
    },
    openPromptBox (row) {
      let id = row.expNo
      this.setPositionByPipeId(id)
    },
    // 上一页
    lastPage() {
      if (this.currentIndex <= 0) {
        this.currentIndex = 0
        return
      }
      this.currentIndex--
      // this.openDetails(this.isPromptBox)
    },
    // 下一页
    nextPage() {
      if (this.currentIndex + 1 >= this.cardTable.length) {
        this.currentIndex = this.cardTable.length - 1
        return
      }
      this.currentIndex++
      // this.openDetails(this.isPromptBox)
    },
    // 详情导航选择事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(key, keyPath)
      console.log(this.activeIndex)
    },
    // 详情
    async openDetails(row) {
      console.log('详情触发')
      this.isPromptBox = { ...row }
      let res = await histroyPipeData({ expNo: row.expNo })
      this.detailsTitle = {
        expNo: row.expNo,
        pipeType: row.pipeType
      }
      this.cardTable = res.result
      this.dialogFormVisible = true
    },
    // 重置
    async resetBtn() {
      this.pagination = { current: 1, size: 30 }
      this.searchParams = {
        keyword: '',
        jcDate: '',
        funcClass: '',
        structClass: ''
      }
      await this.getDate()
    },
    // 搜索
    searchApi() {
      this.getDate(this.searchParams)
    },
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页触发的事件
    async handleSizeChange(val) {
      this.pagination.size = val
      await this.getDate()
      console.log(`每页 ${val} 条`)
    },
    async handleCurrentChange(val) {
      this.pagination.current = val
      await this.getDate()
      console.log(`当前页: ${val}`)
    },
    // 查询数据
    async getDate(params) {
      let data = { ...this.pagination }
      console.log('参数', params)
      if (params) {
        data.queryParams = params.keyword
        data.jcDate = params.jcDate
        data.state = params.checkList
        data.funcClass = params.funcClass
        data.structClass = params.structClass
      }
      console.log('最后传进去的参数', data)
      await queryPageHistory(data).then((res) => {
        // console.log('接口返回', res)
        this.tableData = res.result.records
        this.paginationTotal = res.result.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100vh;
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 12px;
  // 表格样式
  .table-box {
    width: 96%;
    margin: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    .top-tool {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      // flex-wrap: wrap;
      font-size: 12px;
      /deep/ .serch-engineering {
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin-bottom: 14px;
        .release-radio {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .el-radio {
            margin-right: 10px;
          }
          .release-title {
            margin: 0 10px;
          }
          .el-checkbox {
            margin-right: 12px;
          }
        }
        .serch-input {
          width: 245px;
          margin-right: 20px;
        }
        .el-input__inner {
          height: 34px;
        }
        .date-css {
          width: 140px;
        }

        .title {
          font-family: Arial;
          white-space: nowrap;
          margin-left: 5px;
        }
      }
      .serch-btn {
        height: 34px;
        background-color: #2d74e7;
        padding: 12px;
        border: none !important;
      }

      .serch-btn:hover {
        opacity: 0.8;
      }
      .right-btn {
        margin-bottom: 14px;
        display: flex;
        // display: flex;
        // align-items: center;
        // flex-direction: row;
        // flex-wrap: wrap;
      }
    }

    /deep/ .el-table th.el-table__cell > .cell {
      height: 40px;
      line-height: 40px;
      background-color: #dfeffe;
    }
  }

  .hd-input {
    /deep/.el-input__inner {
      width: 70%;
    }
  }
  .el-select {
    width: 8%;
  }
  /deep/ .is-required {
    position: relative;
    .select-btn {
      position: absolute;
      top: 0;
      left: 72%;
    }
  }

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
        }
      }
      .content {
        // padding: 22px;
        // box-sizing: border-box;
        /deep/ .box1 {
          overflow-y: scroll;
          max-height: 545px;
          padding: 10px 20px;
          .el-row {
            padding: 0 10px;
          }
          .historyTitle {
            height: 30px;
            font-weight: bold;
            padding: 5px 10px;
            box-sizing: border-box;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f6f9fe;
          }
          .el-textarea__inner,
          .el-input__inner {
            color: #666;
          }
          .detailsTitle {
            position: relative;
            font-size: 16px;
            padding: 5px 10px;
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
        /deep/ .content-info {
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          .detailsTitle {
            position: relative;
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
}
</style>