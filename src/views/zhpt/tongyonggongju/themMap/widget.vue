<template>
  <el-tabs v-loading="widgetLoading" v-model="activeName" ref="tabs" style="height:100%;">
    <el-tab-pane label="图层设置" name="themShow" style="height:100%;overflow-y:auto;">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层名称" isopen="true" title="请输入专题图图层名称">
          <el-input v-model="themLayerName" placeholder="请输入专题图图层名称" clearable maxlength="20" show-word-limit/>
        </tf-legend>
        <tf-legend class="legend_dept" label="图层选择" isopen="true" title="选择将要进行查询的图层">
          <el-select v-model="layerId" placeholder="请选择图层">
            <el-option v-for="item in layers" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </tf-legend>        
        <tf-legend class="legend_dept" label="图层字段" isopen="true" title="请选择图层查询字段。">
          <ul class="sqlQueryUl" style="height: 150px" v-loading="attLoading">
            <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 3, true)">{{ item.label }}</li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
             v-if="!analysisAtt.length">{{layerId ? '图层无字段' : '请选择图层查询字段'}}</span>
          </ul>
        </tf-legend>
        <tf-legend class="legend_dept" label="构造查询语句" isopen="true" title="查询条件的计算逻辑，及图层属性字段对应的唯一值。">
          <div style="width: 100%">
            <div style="width: 130px; float: left">
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('= ', 2)" style="width:56px">＝</el-button>
                <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
              </div>
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('> ', 2)" style="width:56px">＞</el-button>
                <el-button size="mini" type="primary" plain @click="addText('< ', 2)" style="width:56px">＜</el-button>
              </div>
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('<> ', 3)" style="width:56px">≠</el-button>
                <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
              </div>
              <div>
                <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
                <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
              </div>
            </div>
            <div style="width: calc(100% - 130px); float: right">
              <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
                <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
                <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
                  v-if="!layerFix.length">请选择字段</span>
              </ul>
            </div>
          </div>
        </tf-legend>
        <tf-legend class="legend_dept" label="组合查询条件" isopen="true" style="clear: both" title="选择字段、属性及构造语句组合成查询过滤的条件，通过构建的条件过滤数据。">
          <el-input v-model="queText" ref="textBox" type="textarea" :rows="4" placeholder="请输入查询过滤条件，如:OBJECTID > 0"/>
          <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{queTextName}}</label>
          <el-row style="margin-top: 8px">
            <el-col :span="5" style="float:right;">
              <el-button size="mini" type="primary" @click="queText = ''">删除</el-button>
            </el-col>
          </el-row>
        </tf-legend>
        <tf-legend class="legend_dept" label="空间过滤条件" isopen="true" style="clear: both" title="通过选择下面的条件，设置空间过滤条件进行查询。">
          <el-row style="margin-bottom: 8px">
            <el-col :span="6"><el-radio v-model="space" label="all" style="margin-right: 0;">全图</el-radio></el-col>
            <el-col :span="8"><el-radio v-model="space" label="draw" style="margin-right: 0;">绘制范围</el-radio></el-col>
            <el-col :span="5"><el-radio v-model="space" label="TF_JSJS_REGION_B" style="margin-right: 0;">片区</el-radio></el-col>
            <el-col :span="5"><el-radio v-model="space" label="TF_JSQT_DISTRICT_B">行政区</el-radio></el-col>
          </el-row>
          <el-select 
            v-if="['TF_JSQT_DISTRICT_B', 'TF_JSJS_REGION_B'].indexOf(space) > -1" 
            v-model="spaceSetting" 
            multiple
            @visible-change="visibleChangeHandler"
            @remove-tag="removeTagHandler"
            placeholder="请选择">
            <el-option v-for="(item, index) in spaceSettings[space]" :key="index" :value="index" :label="item.name"></el-option>
          </el-select>
        </tf-legend>
        <el-row style="margin-top: 8px">
          <el-button size="mini" type="primary" style="width:100%" @click="addThemLayer" :disabled="analysisDisable">
            <i v-if="analysisDisable" class="el-icon-loading"/>添加显示</el-button>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="图层列表" name="listShow" style="height:calc(100% - 40px);">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层" isopen="true" title="当前为你创建的专题图。">
          <el-table ref="multipleTable" :data="themLayerData" tooltip-effect="dark" max-height="400px"
            style="width: 100%" @select="selectChange" @select-all="selectChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="图层" /> 
            <el-table-column prop="size" label="操作" >
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row, scope.$index)">跳转</el-link>
                <el-link type="primary" @click="deleteFeas(scope.row, scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" type="primary" style="width:100%" @click="deleteSelectFeas">删除选中专题图</el-button>
        </tf-legend>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
import request from '@/utils/request'
import { reject } from 'q'
export default {
  name: 'ThemMap',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      widgetLoading: true,
      attLoading: false,
      fixLoading: false,
      activeName: 'themShow',
      themLayerName: '',
      layerId: '',
      layers: [],
      analysisAtt: [],
      layerFix: [],      
      queText: '',
      queTextName:'',
      space: 'all',
      spaceSetting: [],
      spaceSettings: { },
      themLayerData: [],
      analysisDisable: false
    }
  },
  computed: { 
    sidePanelOn() { return this.$store.state.map.P_editableTabsValue },
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'themMap') {
        this.$nextTick(() => {
          if(this.activeName != 'listShow') this.printRect.visible = true
          this.themLayerData.map(e => e.layer.visible = e.select)
          this.mainLayer.visible = false
        })  
      } 
      if(oldTab == 'themMap') {
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) draw.reset()
        view.container.style.cursor = ''
        this.printRect.visible = false
        this.themLayerData.map(e => e.layer.visible = false)
        this.mainLayer.visible = true
      }
    },
    layerId(e) {
      if(!e) return
      let seed = new Date().getTime()
      this.layerLoadSeed = seed
      this.analysisAtt = []
      this.attLoading = true
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + e + "/?f=pjson",
        type: 'GET',
        success: (data) => {
          if(this.layerLoadSeed != seed) return
          this.attLoading = false
          this.layerLoadSeed = undefined
          data = JSON.parse(data).fields
          if(!data) return this.$message.error('图层信息获取失败')
          this.analysisAtt = data.map((df) => { return { value: df.name, label: df.alias } })
        },
        error: (error) => this.$message.error(error)
      })
    },
    activeName(e) {
      this.printRect.visible = e != 'listShow'
      var view = this.mapView
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.container.style.cursor = ''    
    },
    // spaceSetting(e) {
    //   var rings = [];
    //   e.forEach(item => {
    //     rings.push(this.spaceSettings[this.space][item].rings);

    //   });
    //   if(rings.length > 0) {
    //     this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
    //     this.mapView.extent = this.printRect.geometry.extent
    //   }
    // }, 
    space(value) {
      if(value == 'draw') this.drawRect()
      else {
        var draw = this.mapView.TF_draw
        if(draw.activeAction) draw.reset()
        this.printRect.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference } 
      }
    },
    queText(newValue,oldValue){
      if(newValue.length < oldValue.length || newValue=="") this.queTextName = '';
    }
  },
  mounted() {
    this.$refs.tabs.$el.children[0].style.background = '#fff'
    this.init().then(() => this.widgetLoading = false)
    this.layers = []
    this.layersIndex = {}
  },
  methods: {
    async init() {
      // 先跳出，后面的方法用 ol 重写
      return new Promise(reject => reject())

      var mapView = this.mapView = this.$attrs.data.mapView
      for(var i=0,il=mapView.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
        var di = il[i]
        if (di.sublayers && di.sublayers.length > 0) {
          this.mainLayer = di
          break
        }
      }
      if(!this.mainLayer) return this.$message.error('管网地图加载失败')
      this.mainLayer.visible = false      
      // 获取图层
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/?f=pjson",
        type: 'GET',
        success: (data) => {
          data = JSON.parse(data).layers
          if(!data) return this.$message.error('图层字段获取失败')
          for(var i=0,ii=data.length,tId = [];i<ii;i++){
            var layer = data[i]
            //删除最上一层
            if(layer.parentLayerId != -1) tId.push({ value: layer.id, label: layer.name })
            // if([0, 16, 17].indexOf(layer.id) < 0){
            //   tId.push({ value: layer.id, label: layer.name })
            // }
          }
          this.layers = tId
        },
        error: (error) => this.$message.error(error)
      })
      // 定义绘制矩形几何
      this.printRect = new mapView.TF_graphic({
        geometry: { type: 'polygon', rings: [[[0,0]]], spatialReference: mapView.spatialReference },
        symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: '1px' }}
      })
      mapView.graphics.add(this.printRect)
      this.usertoken = appconfig.usertoken
      var business = this.businessMap = appconfig.gisResource.business_map.config[0].url
      var mapView = this.mapView
      var idsdata    
      for (let i=0,il= mapView.map.basemap.baseLayers.items,ii=il.length, sublayerids = [];i<ii; i++) {
        if(il[i].url && il[i].url == business) {
          for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
            var layer = jl[j]
            if(!layer.sublayers && layer.title != '图幅框') sublayerids.push(layer.id)
          }
          idsdata = sublayerids.sort((a, b) => a - b)
          break 
        }
      }
      if (idsdata.length == 0) return this.$message.error('管线图层无数据！')      
      var url = appconfig.gisResource.layer_name.config[0].url
      $.ajax({
        url: url,
        type: "POST",
        data: {
          usertoken: appconfig.usertoken,
          layerids: JSON.stringify(idsdata),
          f: "pjson"
        },
        dataType: "json",
        success: (data) => {
          if (data.code == 10000) {
            var layerIndex = {}
            for (let i=0,il=data.result.rows,ii=il.length;i<ii; i++) {
              var layer = il[i]
              if (['TF_JSQT_DISTRICT_B', 'TF_JSJS_REGION_B'].indexOf(layer.layerdbname) > -1) layerIndex[layer.layerdbname] = layer.layerid
            }
            this.layerIndex = layerIndex
            this.getPolygon()
          }
        }
      })
      request({ url: 'gis/themelayer/getMeThemelayer', method: 'get' }).then(res => {
        if(res.code == 1) {
          for (let i=0,il=res.result.records,ii=il.length;i<ii; i++) {
            var layer = il[i]
            this.addThemLayer(undefined, {
              name: layer.name || '',
              extent: layer.extent || '',
              comCondition: layer.comCondition || '',
              layerName: layer.layerName,
              id: layer.id
            })
          }
        }
      })
    },

    /**
     * select下拉框出现或者隐藏时触发  
     *    add for tengmingxue 2022-1-21
     * @param {boolean} evt true表示出现，false表示隐藏
     * 
    */
    visibleChangeHandler(evt){
      if(evt) return;
      let rings = [];
      let sp = this.spaceSetting;
      sp.forEach(item => {
        let ring = this.spaceSettings[this.space][item].rings;
        rings.push(...ring);
      });
      if(rings.length > 0) {
        this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
        this.mapView.extent = this.printRect.geometry.extent
      }
      else{
        this.printRect.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: this.mapView.spatialReference } 
      }
    },
    /**
     * select下拉框移出时触发
     *    add for tengmingxue 2022-1-21
     * @param {object}} tag 移出的值
     * 
    */
    removeTagHandler(tag){
      let rings = [];
      let sp = this.spaceSetting;
      sp.forEach(item => {
        let ring = this.spaceSettings[this.space][item].rings;
        rings.push(...ring);
      });
      if(rings.length > 0) {
        this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
        this.mapView.extent = this.printRect.geometry.extent
      }
      else{
        this.printRect.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: this.mapView.spatialReference } 
      }
    },
    drawRect() {
      var view = this.mapView
      var sp = view.spatialReference
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.TF_drawPolygon(() => {view.container.style.cursor = 'crosshair'}, () => {}, 
      (evt) => {
        var v = evt.vertices
        if (v.length > 1)
          this.printRect.geometry = {
            type: 'polygon', rings: v, spatialReference: sp
          } 
      }, () => {
        draw.reset()
        view.container.style.cursor = ''
      })
    },
    addText(text, length, isField) {
      var myField = this.$refs.textBox.$el.children[0]
      var startL = myField.selectionStart
      this.languageChange(text, length, isField);
      this.queText = this.queText.substring(0, startL) + text + this.queText.substring(myField.selectionEnd, myField.value.length)
      myField.blur()
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length
        myField.focus()
      })
      if(isField) this.getAtt(text.replace(/(\s*$)/g,""))
    },
    languageChange(text, length, isField){
      if(isField){
        const field = this.analysisAtt.find(item => item.value === text.replace(' ',''));
        const fname = field ? field.label : text;
        this.queTextName = this.queTextName +  fname;
      }
      else{
        if(text.indexOf('=') != -1) text = '等于';
        if(text.indexOf('like') != -1) text = '中存在';
        if(text.indexOf('>') != -1) text = '大于';
        if(text.indexOf('<') != -1) text = '小于';
        if(text.indexOf('<>') != -1) text = '不等于';
        if(text.indexOf('and') != -1) text = '并且';
        if(text.indexOf('or') != -1) text = '或者';
        if(text.indexOf('%') != -1) text = '占位';
        this.queTextName = this.queTextName +  text;
      }
    },    
    getAtt(field) {
      let seed = new Date().getTime()
      this.attLoadSeed = seed
      this.fixLoading = true
      $.ajax({
        url: appconfig.gisResource.fieldUniqueValue.config[0].url,
        type: 'POST',
        data: {
          usertoken: appconfig.usertoken,
          layerid: this.layerId,
          field_name: field,
          f: 'pjson'
        },
        success: (data) => {
          if(this.attLoadSeed != seed) return
          this.fixLoading = false
          this.attLoadSeed = undefined
          data = JSON.parse(data)
          if(data.code != 10000) return this.$message.error('图层字段获取失败')
          this.layerFix = data.result.rows
          if(data.result.rows.length == 0) this.$message.error('字段无唯一值')
        },
        error: (error) => this.$message.error(error)
      })
    },
    getPolygon() {
      for(let polygon in this.layerIndex) {
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + "/" + this.layerIndex[polygon] + "/query?where=1=1&f=pjson",
          type: 'GET',
          success: (data) => {
            data = JSON.parse(data)
            var name = data.displayFieldName
            data = data.features
            var pols = []
            for(var i=0,ii=data.length;i<ii;i++) {
              pols.push({ name: data[i].attributes[name] || "", rings: data[i].geometry.rings })
            }
            this.spaceSettings[polygon] = pols
          },
          error: (error) => this.$message.error(error)
        })
      }
    },
    addThemLayer(e, requestOptions) {
      var themLayerName, space, printRect, queText, layerName
      var mapView = this.mapView
      var Graphic = mapView.TF_graphic
      var layer = mapView.graphics
      var sp = mapView.spatialReference
      if(requestOptions) {
        themLayerName = requestOptions.name
        space = requestOptions.extent == '' ? 'all' : 'draw'
        printRect = new Graphic({
         geometry: { type: 'polygon', rings:requestOptions.extent == '' ? undefined : JSON.parse(requestOptions.extent), spatialReference: sp},
         symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
        })
        queText = requestOptions.comCondition || ''
        layerName = requestOptions.layerName
      } else {
        themLayerName = this.themLayerName
        space = this.space
        printRect = this.printRect
        queText = this.queText
        layerName = this.layerId
      }
      if(!themLayerName) return this.$message.error('请输入图层名称')
      if(['TF_JSQT_DISTRICT_B', 'TF_JSJS_REGION_B'].indexOf(this.space) > -1 && this.spaceSetting.length < 1){
        return this.$message.error('请选择' + (this.space === 'TF_JSQT_DISTRICT_B' ? '行政区':'片区'))
      }
      if(!requestOptions) this.analysisDisable = true
      
      var options = {
        outFields: 'OBJECTID',
        where: queText.replace(/(^\s*)|(\s*$)/g, "") || '1=1',
        f: 'pjson'
      }
      if(space != 'all') {        
        options.geometry = JSON.stringify(printRect.geometry.toJSON())
        options.geometryType = 'esriGeometryPolygon'
      }
      // 构建renderer
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + layerName + "?f=pjson",
        type: 'GET',
        success: (data) => {
          data = JSON.parse(data)
          if(data.drawingInfo) {
            var type = {"esriGeometryPoint":"point", "esriGeometryPolyline":"polyline", "esriGeometryPolygon":"polygon"}[data.geometryType]
            data = data.drawingInfo.renderer
            // return console.log(data)
            var symbolType = data.type
            var renderer
            switch (symbolType) {
              case 'uniqueValue':
                renderer = {
                  type: "unique-value",
                  field: data.field1,
                  field2: data.field2 || undefined,
                  field3: data.field3 || undefined,
                  fieldDelimiter: data.fieldDelimiter || undefined,
                  defaultSymbol: undefined,
                  uniqueValueInfos: []
                }
                if(data.defaultSymbol) renderer.defaultSymbol = getSymbol(type, data.defaultSymbol)
                for(var i=0,il=data.uniqueValueInfos,ii=il.length,dl=renderer.uniqueValueInfos;i<ii;i++) {
                  var di = il[i]
                  dl.push({
                    value: di.value,
                    symbol: getSymbol(type, di.symbol)
                  })
                }
                queryFea(type, renderer)
                break
              case 'simple':
                renderer = {
                  type: "simple",  // autocasts as new SimpleRenderer()
                  symbol: getSymbol(type, data.symbol)
                }
                queryFea(type, renderer)
                break
            }  
          }
        }
      })
      var getSymbol = (type, symbol) => {
        switch(type) {
          case 'point':
            return symbol.imageData ? {
              url: "data:image/png;base64," + symbol.imageData,  
              width: ~~symbol.width * 1.5 + "px",  
              height: ~~symbol.height * 1.5 + "px", 
              type: 'picture-marker'
            } : { 
              type: 'simple-marker', 
              color: symbol.color || [255, 255, 255], 
              size: symbol.size || 4, 
              angle: symbol.angle || 0,
              xoffset: symbol.xoffset || 0,
              yoffset: symbol.yoffset || 0,
              outline: symbol.outline || { color: [51, 133, 255], width: 1 }
            }
          case 'polyline':
            return { type: "simple-line", color: symbol.color, width: symbol.width * 1.5 + 'px'  }
          case 'polygon':
            return { 
              type: "simple-fill",
              color: symbol.color,
              style: "solid",
              outline: symbol.outline
            }
        }
      }
      var queryFea = (type, renderer) => {
        var fields = [{ name: "OBJECTID", alias: "OBJECTID", type: "oid" }]
        if(renderer.type == 'unique-value') {
          var f = [renderer.field, renderer.field2, renderer.field3].filter((e) => e)
          options.outFields += ',' + f.join(',')
          fields.push(...f.map((e) => {return { name: e, alias: e, type: "string" }}))
        }
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + "/" + layerName + "/query?f=pjson",
          type: 'POST',
          data: options,
          success: (data) => {
            data = JSON.parse(data)
            // if(data.features.length == 0) return this.$message('无查询结果')
            data = data.features
            var features = []
            for(let i=0,ii=data.length;i<ii;i++) {
              var fea = data[i]
              var geomentry = fea.geometry
              geomentry.type = type
              geomentry.spatialReference = sp
              features.push(new Graphic({                
                attributes: fea.attributes,
                geometry: geomentry
              }))
            }
            var featureLayer = new mapView.TF_featureLayer({
              source: features,
              fields: fields,
              objectIdField: "OBJECTID", geometryType: type,
              renderer: renderer,
            })
            mapView.map.add(featureLayer)
            update(featureLayer)
          },
          error: (error) => {
            this.analysisDisable = false
            this.$message.error('获取图元信息错误')
            console.error(error)
          }
        })
      }
      //上传新建图层
      var update = (layer) => {        
        let featureLayer = { name: themLayerName, layer: layer, select: true }
        this.themLayerData.push(featureLayer)
        this.$refs.multipleTable.toggleRowSelection(featureLayer)
        if(requestOptions) {
          featureLayer.id = requestOptions.id
        } else {
          this.uploadThemMap({
            name: themLayerName,
            extent: space == 'all' ? '' : JSON.stringify(printRect.geometry.toJSON().rings),
            comCondition: queText,
            layerName: layerName,
          }, (e) => {
            this.activeName = 'listShow'
            featureLayer.id = e.result
          })
        }
      }
    },
    uploadThemMap(options, callback) {
      var extent = options.extent
      if(extent.length > 3500) {
        var needLong = Math.ceil(extent.length / 4000)
        extent = JSON.parse(options.extent)[0]
        var finalExtent = []
        for(var i=0,ii=extent.length;i<ii;i+=needLong) {
          var dextent = [0,0], length = 0
          for(var j=0;j<needLong;j++) {
            if(extent[i]) {
              var de = extent[i]
              dextent[0] += de[0]
              dextent[1] += de[1]
              length += 1
            }
          }
          if(dextent[0] != 0) {
            finalExtent.push([dextent[0] / length, dextent[1] / length])
          }
        }
        extent = JSON.stringify([finalExtent])
      }
      request({ 
        url: 'gis/themelayer/save', 
        method: 'post',
        data: {
          name: options.name,
          extent: extent,
          comCondition: options.comCondition,
          layerName: options.layerName,
        } }).then(res => {
          this.analysisDisable = false
          if(res.code == 1) {
            this.$message.success('添加标识：' + options.name + ' 成功')
            callback(res)  
          }
      })
    }, 
    selectChange(select, row) {
      if(row) {
        row.layer.visible  = row.select = !row.select
      } else {
        select = select.length != 0
        for(let j=0,jl=this.themLayerData,jj=jl.length;j<jj;j++) {
          var ij = jl[j]
          ij.layer.visible = ij.select = select
        }
      }
    },
    deleteFeas(row, index) {
      if(row.id && row.id > -1) {
        this.$confirm('确定删除"' + row.name + '"图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
          request({ 
            url: 'gis/themelayer/deleteByIds?ids=' + row.id, 
            method: 'delete',
            }).then(res => {
            if(res.code == 1) {
              this.mapView.map.remove(row.layer)
              this.themLayerData.splice(index, 1)
            }
          })
        })
      }
    },
    deleteSelectFeas() {
      var selects = this.$refs.multipleTable.selection
      if(selects.length == 0) return this.$message('请选中至少一个专题图')
      var view = this.mapView
      const names = selects.map(item=> item.name).toString();;
      this.$confirm('确定删除选中的 ' + selects.length + '个图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
        request({ url: 'gis/themelayer/deleteByIds?ids=' + selects.map(e => e.id), method: 'delete', }).then(res => {
          if(res.code == 1) {
            for(var i=0,il=this.themLayerData,ii=il.length;i<ii;i++) {
              var di = il[i]
              if(di.select) {
                view.map.remove(di.layer)
                il.splice(i--, 1)
                ii -= 1
              }
            }
            this.$message.success('删除成功！')
          } else this.$message.success('删除失败：' + res.message)
        })
      })
    },
    jump(row) {
      if(row.layer.fullExtent) this.mapView.extent = row.layer.fullExtent
      this.$nextTick(() => this.mapView.zoom = this.mapView.zoom - 1)
    }
  },
  destroyed() { 
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    view.container.style.cursor = ''    
    this.mapView.graphics.remove(this.printRect)
    this.mapView.map.removeMany(this.themLayerData.map(e => e.layer))
    this.mainLayer.visible = true      
  }
}
</script>
