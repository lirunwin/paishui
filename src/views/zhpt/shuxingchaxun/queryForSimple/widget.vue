<template>
<!-- 快捷查询 -->
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="选择图层" isopen="true" title="选择查询要素图层">
      <el-select v-model="layerName" placeholder="请选择">
            <el-option-group v-for='group in layerGroups' :key="group.label" :label="group.label">
               <el-option v-for="item in group.layers" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-option-group>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="选择字段" isopen="true" title="选择查询图层对应的字段">
      <el-select v-model="attList" placeholder="请选择">
        <el-option v-for="(item, i) in attLists" :key="i" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询条件" isopen="true" title="设置查询内容信息进行搜索">
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-radio style="width:18%;" v-model="radio" label="<">小于</el-radio>
        <el-radio style="width:18%;" v-model="radio" label=">">大于</el-radio>
        <el-radio style="width:18%;" v-model="radio" label="=">等于</el-radio>
        <el-radio style="width:18%;" v-model="radio" label="%%">模糊</el-radio>
        <el-radio style="width:18%;" v-model="radio" label="≠">不等于</el-radio>
        <!-- <el-radio style="width:18%;" v-model="radio" label=" or ">或</el-radio>
        <el-radio style="width:18%;" v-model="radio" label=" and ">与</el-radio> -->
      </el-row>
      <!-- <el-checkbox-group v-if="selectType == 'cheaked'" v-model="checkList">
        <el-checkbox v-for="item in checkListAtt" :key="item" :label="item"/>
      </el-checkbox-group> -->
              <el-row v-if="selectType == 'date'" style="margin-top: 8px">
                <el-date-picker 
                  style="width: 100%"
                  v-model="startDate"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="sOpition"
                ></el-date-picker>
              </el-row>
              <el-row v-if="selectType == 'date'" style="margin-top: 8px">
                <el-date-picker
                  style="width: 100%"
                  v-model="endDate"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                  :picker-options="eOpition"
                ></el-date-picker>
              </el-row>
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-input v-model="inputText" placeholder="输入查询值" clearable/>
      </el-row>
      <el-row style="margin-top: 8px">
        <el-button type="text">{{ queText }}</el-button>
      </el-row>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width:100%" @click="queryResult" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>查询</el-button>
      </el-row>
      <el-row v-show="attList" style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width:100%" @click="clear"> 清除</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询结果" isopen="true" title="显示查询统计结果。">
      <el-table @row-click='showDetail' :data="finalData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="layername" label="类型" width="80px" align="center"/>
        <el-table-column prop="num" label="数量(个)" align="center"/>
        <!-- <el-table-column label="操作" width="50px" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="rowC(scope.row)">详情</el-link>
          </template>
        </el-table-column> -->
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import { mapUtil } from '../../common/mapUtil/common'
import iQuery from '../../common/mapUtil/query'
import VectorSource from 'ol/source/Vector'
import { comSymbol } from '@/utils/comSymbol'
import VectorLayer from 'ol/layer/Vector'
import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON';

export default {
  name: 'queryForSimple',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      elements: {},
      layerName: '',
      queText: '',
      queRadioText: '',
      checkList: [],
      radio: '',
      attList: '',
      checkListAtt: [],
      textHolder: '',
      radioHolder: '',
      dateDistancs: ['', ''],
      selectType: '',
      layerGroups: [],
      attLists: [],
      panel: {
        pathId: 'queryResult3',
        widgetid: 'HalfPanel',
        label: '查询结果',
        param: {}
      },
      analysisDisable: false,

      startDate: '',
      endDate: '',
      finalData: [],
      inputText: '',
      // 时间过滤
      sOpition: {
        disabledDate: time => {
          time = time.getTime()
          if (this.endDate) {
            return time > new Date(this.endDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: time => {
          time = time.getTime()
          if (this.startDate) {
            return time < new Date(this.startDate).getTime() || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      }
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    layerName(n, o) {
      if (!n) return
      mapUtil.getFields(n).then(res => {
        if (res) {
          this.attList = ''
          this.attLists = res.map(item => {
            return { value: item.field , label: item.name }
          })
        } else this.$message.error('获取字段数据失败')
      })
    },
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab !== 'queryForSimple') {
        this.clearAll()
      } else this.init()
    },
    attList(n, o) {
      let att = this.attLists.find(item => item.value === n)
      // this.selectType = 'rideo'
      if (att.label.includes('日期') || att.label.includes('时间')) {
        this.selectType = "date"
      } else {
        this.selectType = 'radio'
      }
      this.queText = att.label
    },
    radio (n, o) {
      let att = this.attLists.find(item => item.value === this.attList)
      if (n === '%%') {
        this.queText = `${att.label} = % ${this.inputText} %`
      } else {
        this.queText = `${att.label + n + this.inputText}`
      }
      
    },
    inputText (n, o) {
      let att = this.attLists.find(item => item.value === this.attList)
      if (this.radio === '%%') {
        this.queText = `${att.label} = % ${n} %`
      } else {
        this.queText = `${att.label + this.radio + n}`
      }
    },
    endDate (n, o) {
      let att = this.attLists.find(item => item.value === this.attList)
      this.queText = `${att.label} 从 ${this.startDate} 到 ${n}`
    },
    startDate (n, o) {
      let att = this.attLists.find(item => item.value === this.attList)
      this.queText = `${att.label} 从 ${n} 到 ${this.endDate}`
    }
  },
  mounted() {
    this.init()
  },
  destroyed () {
    this.clearAll()
  },

  methods: {
    clear () {
      this.queText = ''
      this.inputText = ''
      this.attList = ''
      this.radio = ''
      this.selectType = ''
      this.finalData = []
    },
    init () {
      // 加载图层
      let [name, type] = appconfig.initLayers.split("&&")
      let layer = mapUtil.getAllSubLayerNames(name, type)
      // 设置图层
      this.layerGroups = layer.sublayers.map(layer => {
        let layers = layer.sublayers.map(sub => {
          return { label: sub.title, value: sub.name.split('@')[0] }
        })
        return { label: layer.title, value: layer.name, layers }
      })

      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style:  comSymbol.getAllStyle(5, "#f00", 6, 'rgb(64, 158, 255)') })
      this.data.mapView.addLayer(this.vectorLayer)
    },
    clearAll () {
      this.vectorLayer && this.data.mapView.removeLayer(this.vectorLayer)
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
    },
    queryResult() {
      console.log(11111)
      var layerName = this.layerName
      var attList = this.attList
      if(!layerName) return this.$message.error('请选择图层')
      if(!attList) return this.$message.error('请选择字段')
      var queryText = ''

      if (this.selectType === 'radio') {
        if(!this.radio) return this.$message.error('请选择查询条件')
        if(!this.inputText) return this.$message.error('请输入查询值')
        if (this.radio === '%%') {
          queryText = attList + " like '%" + this.inputText + "%'" 
          queryText = `${attList} like '%${this.inputText}%'`
        } else {
          queryText = attList + this.radio + this.inputText
        }
      } else if (this.selectType === 'date') {
        if (this.endDate && this.startDate) {
          queryText = `${attList} > ${this.startDate} and ${attList} < ${this.endDate}`
        } else if (this.endDate) {
          queryText = `${attList} < ${this.endDate}`
        } else if (this.startDate) {
          queryText = `${attList} > ${this.startDate}`
        } else {
          queryText = '1=1'
        }
      }
      let layer = null
      this.layerGroups.forEach(item => {
        let find = item.layers.find(sub => sub.value === layerName)
        if (find) { layer = find }
      })
      let dataSetInfo = [{ label: layer.label, name: layer.value }]
      this.analysisDisable = true
      new iQuery({ dataSetInfo }).sqlQuery(queryText).then(res => {
        this.analysisDisable = false
        let data = res.filter(item => item.type === "processCompleted" && item.result.featureCount !== 0)
        let layername = data[0].layerName
        let tablename = data[0].tableName
        let features = data[0].result.features
        this.finalData = [{ layername, tablename, num: features.features.length, features }]
      })
      // switch(this.selectType) {
      //   case 'text': 
      //     // if(!this.queText) return this.$message.error('请输入查询值')
      //     queryText = attList + " like '%" + this.queText + "%'"          
      //     break
      //   case 'radio': 
      //     if(!this.queRadioText) return this.$message.error('请输入查询值')
      //     queryText = attList + this.radio + this.inputText
      //     break
      //   case 'cheaked': 
      //     if(this.checkList.length == 0) return this.$message.error('请选择查询值')
      //     var fixed = attList
      //     queryText = this.checkList.map((e) => fixed + "='" + e + "'").join(' OR ')
      //     break
      //   case 'date': 
      //     if(!this.dateDistancs || !this.dateDistancs[0]) return this.$message.error('请选择查询范围')
      //     var fixed = attList
      //     var query = this.dateDistancs
      //     queryText = fixed + " > DATE '" + query[0] + "' and " + fixed + " < DATE '" + query[1] + "'"
      //     break
      // }
      // this.analysisDisable = true
    },
    showDetail (row) {
      let { layername, features, tablename } = row
      mapUtil.getFields(tablename).then(res => {
        console.log('字段选择', res)
        let rowData = [], colsData = []
        rowData = features.features.map(fea => {
          return { ...fea.properties, geometry: fea.geometry }
        })
        colsData = res.map(item => {
          return { label: item.name, prop: item.field }
        })
        this.$store.dispatch('map/changeMethod', {
          pathId: 'queryResultMore',
          widgetid: 'HalfPanel',
          label: '详情',
          param: { rootPage: this, data: rowData, colsData }
        })
      })
    },
    gotoGeometry (geometry) {
      geometry = new GeoJSON().readGeometry(geometry)
      let feature = new Feature({ geometry })
      this.vectorLayer.getSource().clear()
      this.vectorLayer.getSource().addFeature(feature)
      //
      let center = mapUtil.getCenter(feature)
      let view = this.data.mapView.getView()
      view.setCenter(center)
      view.setZoom(19)
    }
  }
}
</script>
