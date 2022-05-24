<template>
<!-- 快捷查询 -->
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="选择图层" isopen="true" title="选择查询要素图层">
      <el-select v-model="layerName" placeholder="请选择">
        <el-option v-for="item in layersAtt" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="选择字段" isopen="true" title="选择查询图层对应的字段">
      <el-select v-model="attList" placeholder="请选择">
        <el-option v-for="(item, i) in attLists" :key="i" :label="item.label" :value="item.name"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询条件" isopen="true" title="设置查询内容信息进行搜索">
      <el-input v-if="selectType == 'text'" v-model="queText" :placeholder="textHolder" clearable/>
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-radio v-model="radio" label="<">小于</el-radio>
        <el-radio v-model="radio" label=">">大于</el-radio>
        <el-radio v-model="radio" label="=">等于</el-radio>
      </el-row>
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-input v-model="queRadioText" :placeholder="radioHolder" clearable />
      </el-row>
      <el-checkbox-group v-if="selectType == 'cheaked'" v-model="checkList">
        <el-checkbox v-for="item in checkListAtt" :key="item" :label="item"/>
      </el-checkbox-group>
      <el-date-picker v-if="selectType == 'date'" v-model="dateDistancs" type="daterange" style="width:100%"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy/M/d"/>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width:100%" @click="queryResult" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>查询</el-button>
      </el-row>
    </tf-legend>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'queryForSinple',
  components: { tfLegend },
  props: { param: Object },
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
      selectType: -1,
      layersAtt: [],
      attLists: [],
      panel: {
        pathId: 'queryResult3',
        widgetid: 'HalfPanel',
        label: '查询结果',
        param: {}
      },
      analysisDisable: false
    }
  },
  watch: {
    layerName() {
      var that = this
      if(!this.layerName) return
      var config = attConfig.hide
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + this.layerName + "/?f=pjson",
        type: 'GET',
        success: function(data) {
          data = JSON.parse(data).fields
          var fields = [] 
          that.attListIndex = {}
          for(let i=0,ii=data.length;i<ii;i++){
            var fix = data[i]
            if(config.indexOf(fix.name) > -1) continue
            var type = fix.type.substring(13)
            var inPut = {
              name: fix.name,
              label: fix.alias,
              type: {"OID": "text", "String": "text", "Double": "radio", "Integer": "radio", "Date": "date"}[type]
            }
            if(fix.domain) {
              inPut.type = "cheaked"
              inPut.typeList = fix.domain.codedValues.map((e) => e.code)
            }
            fields.push(inPut)
            that.attListIndex[fix.name] = inPut
          }
          that.attLists = fields
          that.attList = ''
        },
        error: (error) => this.$message.error(error)
      })
    },
    attList(e) {
      if(!e) {
        this.queText = this.queRadioText = ''
        this.checkList = []
        this.selectType = -1
        this.checkListAtt = []
        return
      }
      e = this.attListIndex[e]
      this.queText = this.queRadioText = ''
      this.checkList = []
      this.selectType = e.type
      if(e.type) this.checkListAtt = e.typeList
    }
  },
  mounted() {    
    // var that = this
    // var layerIndex = this.layersIndex = {}
    // this.mapView = this.$attrs.data.mapView
    // $.ajax({
    //   url: appconfig.gisResource.business_map.config[0].url + "/?f=pjson",
    //   type: 'GET',
    //   success: function(data) {
    //     data = JSON.parse(data).layers
    //     var tId = [] 
    //     for(let i=0,ii=data.length;i<ii;i++){
    //       var layer = data[i]
    //       // if([0, 16, 17].indexOf(layer.id) < 0){
    //       //   tId.push({ value: layer.id, label: layer.name })
    //       //   layerIndex[layer.id] = layer.name
    //       // }
    //       tId.push({ value: layer.id, label: layer.name })
    //       layerIndex[layer.id] = layer.name
    //     }
    //     that.layersAtt = tId
    //   },
    //   error: (error) => this.$message.error(error)
    // })
  },
  methods: {
    queryResult() {
      var layerName = this.layerName
      var attList = this.attList
      if(!layerName) return this.$message.error('请选择图层')
      if(!attList) return this.$message.error('请选择字段')
      var queryText = ''
      switch(this.selectType) {
        case 'text': 
          // if(!this.queText) return this.$message.error('请输入查询值')
          queryText = attList + " like '%" + this.queText + "%'"          
          break
        case 'radio': 
          if(!this.queRadioText) return this.$message.error('请输入查询值')
          queryText = attList + this.radio + this.queRadioText
          break
        case 'cheaked': 
          if(this.checkList.length == 0) return this.$message.error('请选择查询值')
          var fixed = attList
          queryText = this.checkList.map((e) => fixed + "='" + e + "'").join(' OR ')
          break
        case 'date': 
          if(!this.dateDistancs || !this.dateDistancs[0]) return this.$message.error('请选择查询范围')
          var fixed = attList
          var query = this.dateDistancs
          queryText = fixed + " > DATE '" + query[0] + "' and " + fixed + " < DATE '" + query[1] + "'"
          break
      }
      this.analysisDisable = true
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + layerName + "/query",
        type: 'POST',
        data: {
          where: queryText,
          outFields: 'OBJECTID',
          f: 'pjson'
        },
        success: (data) => {
          data = JSON.parse(data)
          this.analysisDisable = false
          if(data.error) return this.$message(data.error.message)
          if(data.features.length < 1) return this.$message("无查询结果")
          var oids = data.features.map((e) => e.attributes.OBJECTID)
          this.$message('查询结果：' + data.features.length + ' 项')          
          this.panel.param = {
            oids: oids,
            layer: layerName,
            showId: 'queryForSinple'
          }

          var mapview = this.mapView
          if(mapview.TF_resultFeatures) {
            mapview.TF_resultFeatures.load(oids, layerName, 'queryForSinple')
          } else {
            this.$store.dispatch('map/changeMethod', this.panel)
          }
        },
        error: (error) => this.$message.error(error)
      })
    }
  },
  destroyed() {
    // var mapView = this.mapView
    // if(mapView.TF_resultFeatures) mapView.TF_resultFeatures.destroy('queryForSinple')
  }
}
</script>
