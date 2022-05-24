<template>
  <div style="padding: 0 8px; height:100%; overflow: auto">
    <el-tabs v-model="activeName" style="height:100%">
      <el-tab-pane label="属性标注" name="attQuerry" style="height:100%">        
        <div ref="legend" id="Legend" class="Legend">
          <div class="label" @click="openstate = !openstate">要素选择
            <el-tooltip class="item" effect="dark" content="在地图上点击选取要素。下方将会列出所选要素的相关信息。" placement="right">
              <i class="el-icon-info" ref="info"></i>
            </el-tooltip><el-checkbox style="margin-left: 4px;" v-model="ractSelect" @change="isDrawRect">框选</el-checkbox>
            <div ref="isQuery" style="display: none;"><i class="el-icon-loading" />查询中</div>
          </div>
          <div v-show="openstate" class="content">
            <el-table highlight-current-row :data="featureData" stripe height="200px" style="width: 100%;margin-bottom: 8px" row-class-name="selectRowC" @row-click="showFea">
              <template slot="empty">
                <img src="@/assets/icon/null.png" alt="">
                <p class="empty-p">暂无数据</p>
              </template>
              <el-table-column type="index" width="55" label="序号" align="center"/>
              <el-table-column prop="layer" width="105" label="图层" align="center"/>
              <el-table-column prop="name" label="编码" align="center"/>
            </el-table>
          </div>
        </div>
        <tf-legend class="legend_dept" label="要素详细" isopen="true" title="显示标注要素字段及属性。" style="height:600px">
          <el-table :data="attData" stripe height="calc(100% - 8px)" style="width: 100%;margin-bottom: 8px">
              <template slot="empty">
                <img src="@/assets/icon/null.png" alt="">
                <p class="empty-p">暂无数据</p>
              </template>
              <!-- <el-table-column type="index" label="序号" align="center"/> -->
            <el-table-column prop="fix" width="150" label="字段" align="center"/>
            <el-table-column prop="att" label="属性" align="center"/>
          </el-table>
        </tf-legend>
      </el-tab-pane>
      <el-tab-pane label="设置" name="setting" style="height:100%">
        <tf-legend class="legend_dept" label="图层名称" isopen="true" title="指定查询的图层。">
          <el-select v-model="layerName" size="small" placeholder="请选择">
            <el-option v-for="(item, index) in layersAtt" :key="index" :value="item.label"/>
          </el-select>
        </tf-legend>
        <tf-legend class="legend_dept" label="可见属性" isopen="true" title="指定所要查询的属性字段。">
          <el-table ref="attTable" :data="attDatas" stripe height="600px" style="width: 100%" @select="selectChange" @select-all="selectChange">
              <template slot="empty">
                <img src="@/assets/icon/null.png" alt="">
                <p class="empty-p">暂无数据</p>
              </template>
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="name" label="属性" align="center"/></el-table>
        </tf-legend>
        <el-button size="mini" type="primary" style="width:100%" @click="saveLayer">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { comSymbol } from '@/utils/comSymbol'
import GeoJSON from 'ol/format/GeoJSON';
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'


export default {
  name: 'QueryResult',
  components: { tfLegend },
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el)
    }
  },
  props: { data: Object },
  data() {
    return {
      ami: 8,
      inr: {},
      attData: [],
      attDatas: [],
      elements: {},
      openstate: true,

      layersAtt: [],
      activeName: 'attQuerry',
      ractSelect: false,

      // 
      drawer: null,
      vectorLayer: null,
      layerName: '',
      featureData: [],
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {
    this.init()
  },
  destroyed () {
    this.clearAll()
  },
  watch:{
    layerName(n, o) {
      let tableName = this.layersAtt.find(item => item.label === n)
      mapUtil.getFilds(tableName.name).then(res => {
        if (res) {
          this.attDatas = res
          this.attDatas.forEach(row => this.$refs.attTable.toggleRowSelection(row, true))
        } else this.$message.error('获取字段数据失败')
      })
    },
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      console.log('侧边栏', newTab)
      if(newTab !== 'attrSearch') {
        this.clearAll()
      } else this.init()
    }
  },
  methods: {
    init () {
      console.log('初始化')
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(5, '#0ff', 7, 'rgba(0, 255, 255, 0.7)') })
      this.data.mapView.addLayer(this.vectorLayer)
      //
      let sources = appconfig.gisResource['iserver_resource'].layerService.layers.filter(item => item.type === 'smlayer')
      let info = sources.map(source => source.sublayers.map(sublayer => {
        return { name: sublayer.name, label: sublayer.title }
      }))
      this.layersAtt = info[0]
    },
    clearAll () {
      this.vectorLayer && this.data.mapView.removeLayer(this.vectorLayer)
      this.drawer && this.drawer.end()
    },
    isDrawRect: function(checked) {
      if (!checked) {
        this.drawer && this.drawer.end()
        return
      }
      const KeyId = {
        'TF_PSPS_PIPE_B': 'LNO',
        "TF_PSPS_POINT_B": 'EXP_NO',
        "TF_PSPS_OUTFALL_B": 'EXP_NO'
      }
      this.drawer = new iDraw(this.data.mapView, 'rect', {
        startDrawCallBack: () => {
          this.vectorLayer.getSource().clear()
          this.drawer && this.drawer.clearFea()
        },
        endDrawCallBack: fea => {
          this.getFacilities(fea).then(res => {
            let data = res.map(obj => {
              let { layerName, result, tableName } = obj
              return result.features.features.map(fea => {
                return { 
                  properties: fea.properties, 
                  tableName, 
                  feature: fea, name: fea.properties[KeyId[tableName]] || fea.properties['EXP_NO'], 
                  layer: layerName 
                }
              })
            })
            this.featureData = data.flat()
          })
        },
        showCloser: false
      })
      this.drawer.start()
    },
    // 空间查询 获取设施
    getFacilities (fea) {
      let sources = appconfig.gisResource['iserver_resource'].layerService.layers.filter(item => item.type === 'smlayer')
      let info = sources.map(source => source.sublayers.map(sublayer => {
        return { name: sublayer.name, label: sublayer.title }
      }))
      info = info.flat()
      return new Promise(resolve => {
        new iQuery(info).spaceQuery(fea).then(res => {
          console.log('返回的数据', res)
          let data = res.filter(item => item.type === "processCompleted")
          resolve(data)
        })
      })

    },
    showFea(row) {
      let { feature, properties, layer, tableName } = row
      let fea = new GeoJSON().readFeature(feature)
      this.vectorLayer.getSource().clear()
      this.vectorLayer.getSource().addFeature(fea)
      let center = new mapUtil().getCenterFromFeatures(fea)
      let view = this.data.mapView.getView()
      view.setCenter(center)
      view.setZoom(20)
      // 要素详细信息
      mapUtil.getFilds(tableName).then(res => {
        let data = []
        if (res) {
          for(let key in properties) {
            let obj = res.find(item => item.field == key)
            if (obj) {
              data.push({ fix: obj.name,  att: properties[key] })
            }
          }
        }
        this.attData = data
      })
    },
    // 保存设置
    saveLayer() {

    },
    // 勾选属性
    selectChange(select, row) {
      
    }
  }
}
</script>
