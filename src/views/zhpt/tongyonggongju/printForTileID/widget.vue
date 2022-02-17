<template>
  <div style="padding: 0 8px;overflow-y:auto;">
    <div ref="legend" id="Legend" class="Legend">
      <div class="label" @click="openstate = !openstate"><span style="color:red;">* </span>图幅选择
        <el-tooltip class="item" effect="dark" content="显示选中图幅。" placement="right">
          <i class="el-icon-info" ref="info"></i>
        </el-tooltip><el-checkbox style="margin-left: 4px;" v-model="ractSelect" @change="isDrawRect">框选</el-checkbox>
      </div>
      <div v-show="openstate" class="content">
        <el-table v-loading="loading" ref="multipleTable" :data="mapId" tooltip-effect="dark" style="width: 100%;" max-height="200px" @cell-mouse-enter="hoverIn" @cell-mouse-leave="hoverOut">
          <el-table-column prop="id" label="图幅号" style="cursor: pointer;" >
            <template slot-scope="scope">
              <el-link v-if="scope.row.id" type="primary" @click="rowClick(scope.row)">{{ scope.row.id }}</el-link>
              <!-- <span v-if="!scope.row.id"><i class="el-icon-loading"></i>查询中</span> -->
            </template>
          </el-table-column>        
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link v-if="scope.row.id" type="primary" @click="mapIdForDelete(scope.$index, scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <tf-legend class="legend_dept" label="格式" isopen="true" isRequired='true' title="设定打印结果的格式。">
      <el-select v-model="typeName" placeholder="请选择">
        <el-option v-for="item in typesAtt" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="打印模板" isopen="true" isRequired='true' title="设定图纸尺寸。">
      <el-select v-model="type2Name" placeholder="请选择">
        <el-option v-for="item in types2Att" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="高级设置" isopen="true" title="设定打印的详细参数。">
      <el-input v-model="person" size="small" placeholder="请输入内容" clearable style="margin-bottom: 5px" maxlength="20" show-word-limit>
        <template slot="prepend">出图人员</template>
      </el-input>
      <el-input v-model="source" size="small" placeholder="请输入内容" clearable maxlength="20" show-word-limit>
        <template slot="prepend">出图单位</template>
      </el-input>
    </tf-legend>
    <tf-legend class="legend_dept" label="打印结果" isopen="true"  title="打印结果显示。">
      <el-table ref="printTable" :data="printData" tooltip-effect="dark" style="width: 100%" max-height="200px">
        <el-table-column prop="name" label="打印图纸" width="80px" />
        <el-table-column prop="type" label="文件模板" width="80px" />
        <el-table-column prop="size" label="操作" >
          <template slot-scope="scope">
            <span v-if="scope.row.state && isNaN(+ scope.row.state)">
              <el-link type="primary" :href="scope.row.state" target="_blank">预览</el-link>
              <el-link type="primary" @click="downMap(scope.row)" target="_blank">下载</el-link>
              <el-link type="primary" @click="deleteThis(scope.row.state)" target="_blank">删除</el-link>
            </span>
            <span v-if="!scope.row.state"><i class="el-icon-loading"></i>生成中</span>
            <span v-if="+ scope.row.state > 0" style="color: #f56c6c;">打印错误：{{ scope.row.state }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button style="float:right;margin:8px;" ref="delete" size="mini" type="primary" @click="clearAll">清空所有</el-button>
      </el-row>
    </tf-legend>    
    <el-row>
      <el-button size="mini" type="primary" style="width: 100%" @click="print">输出结果</el-button>
    </el-row>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import request from '@/utils/request'
export default {
  name: 'PrintForMapIds',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      loading: false,
      typeName: '',
      type2Name: '',
      openstate: true,
      ractSelect: false,
      title: '',
      person: '',
      source: '',
      title1: '',
      typesAtt: [
        { value: 'PNG', label: 'PNG' },
        { value: 'PDF', label: 'PDF' },
        { value: 'JPG', label: 'JPG' }
      ],
      types2Att: [
        { value: 'DefaultA4L', label: 'A4横向(29.7x21)(cm)' },
        { value: 'DefaultA4P', label: 'A4纵向(21x29.7)(cm)' },
        { value: 'DefaultA3L', label: 'A3横向(42x29.7)(cm)' },
        { value: 'DefaultA3P', label: 'A3纵向(29.7x42)(cm)' },
        { value: 'DefaultA2L', label: 'A2横向(59.4x42)(cm)' },
        { value: 'DefaultA2P', label: 'A2纵向(42x59.4)(cm)' }
      ],
      printData: [],
      mapId: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {
    var mapview = this.mapView = this.$attrs.data.mapView
    for(let i=0,il=mapview.map.basemap.baseLayers.items,ii=il.length;i<ii;i++) {
      if(!il[i].url) continue     
      for(let j=0,jl=il[i].sublayers.items,jj=jl.length;j<jj;j++){
        if(jl[j].title != '图幅框') continue
        jl[j].visible = true
        this.tileIdLayer = jl[j]
        break
      }
      if(this.tileIdLayer) break
    }
    if(!this.tileIdLayer) this.$message.error('图幅框图层缺失')
    this.loadClick()
    this.rectIdIndex = {}
    this.rectIds = []
    this.highLightStyle = { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "4px" } }
    this.normalStyle = { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "2px" } }
    var Graphic = mapview.TF_graphic
    this.gra = new Graphic({
      geometry: { type: 'polygon', rings: [[[0, 0]]], spatialReference: mapview.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: '1px' }}
    })
    mapview.graphics.add(this.gra)
    request({ url: '/base/user/getInfo', method: 'get' }).then(res => {
      if(res.code == 1) {
        res = res.result
        this.person = res.realName
        this.source = res.departmentName
      }
    })
    var index = {}    
    for(var i=0,il=this.types2Att,ii=il.length;i<ii;i++) {
      index[il[i].value] = il[i].label
    }
    this.type2Index = index
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      var isShow
      if(newTab == 'printForTileID') {
        this.$nextTick(() => {
          this.ractSelect = false
          this.loadClick()
          this.tileIdLayer.visible = true
        })
        isShow = true
      } 
      if(oldTab == 'printForTileID') {
        [this.move, this.click].map((e) => e.remove())
        this.tileIdLayer.visible = false
        this.mapView.container.style.cursor = ''
        isShow = false
        var draw = this.mapView.TF_draw
        if (draw.activeAction) draw.reset()
      }
      if(isShow != undefined){
        for(let i=0,il=this.rectIds,ii=il.length;i<ii;i++) {
          il[i].visible = isShow
        }
      }
    }
  },
  methods: {
    isDrawRect() {
      if(this.click) {        
        [this.move, this.click].map((e) => e.remove())
        this.move = this.click = undefined
      }
      var draw = this.mapView.TF_draw
      if (draw.activeAction) draw.reset()
      this[this.ractSelect ? 'onDrawRect' : 'loadClick']()
    },
    loadClick() {
      var mapView = this.mapView
      mapView.container.style.cursor = 'pointer'
      this.click = mapView.on('click', (evt) => {        
        var xy = mapView.toMap({ x: evt.x, y: evt.y })
        this.queryId(xy, mapView)
      })      
      this.lastHightId = undefined
      var graphics = mapView.graphics
      var divs = this.$refs.multipleTable.$refs.bodyWrapper.children[0].children[1]
      this.move = mapView.on('pointer-move', (evt) => {
        mapView.hitTest(evt, graphics).then((re) => {
          re = re.results
          if (re.length) {
            var gra
            for(var i=0,ii=re.length;i<ii;i++) {
              if(re[i].graphic.isMapTileId){
                gra = re[i].graphic
                break
              }
            }
            if(gra) {
              if(this.lastHightId) {
                if(this.lastHightId == gra.id) return
                this.rectIdIndex[this.lastHightId].symbol = this.normalStyle
                divs.children[this.rectIds.indexOf(this.rectIds.filter(e=>e.id ==this.lastHightId)[0])].style.background = ''
              }
              gra.symbol = this.highLightStyle
              divs.children[this.rectIds.indexOf(this.rectIds.filter(e=>e.id == gra.id)[0])].style.background = '#ecf2ff'
              this.lastHightId = gra.id
            }
          } else if(this.lastHightId) {
            this.rectIdIndex[this.lastHightId].symbol = this.normalStyle
            divs.children[this.rectIds.indexOf(this.rectIds.filter(e=>e.id ==this.lastHightId)[0])].style.background = ''
            this.lastHightId = undefined
          }
        })
      })
    },
    onDrawRect: function() {
      var view = this.mapView
      var sp = view.spatialReference
      this.action = view.TF_drawRect(() => { view.container.style.cursor = 'crosshair' },
        (evt) => {
          if (evt.vertices.length < 2) {
            this.gra.geometry = { type: 'polygon', spatialReference: sp }
          }
        }, (evt) => {
          var v = evt.vertices
          if (v.length > 1) {
            this.gra.geometry = { type: 'polygon', rings: [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]], spatialReference: sp }
          }
        }, () => {
          this.queryId(this.gra.geometry, view)
          this.$nextTick(() => {
            this.loadClick()
            this.ractSelect = false
            this.gra.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: sp }
          })
        })
    },
    queryId(geometry, mapView) {
      this.loading = true
      $.ajax({
        url: this.tileIdLayer.url + '/query',
        type: 'POST',
        data: {
          geometry: JSON.stringify(geometry.toJSON()),
          geometryType: geometry.rings ? 'esriGeometryPolygon' : 'esriGeometryPoint',
          f: 'pjson'
        },        
        success: (data) => {
          this.loading = false
          data = JSON.parse(data).features
          if(data.length < 1) return this.$message('无查询结果')
          for(var i=0,ii=data.length;i<ii;i++) {
            var dd = data[i]
            var id = dd.attributes['FRAMENO']
            if(!this.rectIdIndex.hasOwnProperty(id)) {
              var rect = new mapView.TF_graphic({
                id: id,
                geometry: { type: 'polygon', rings:dd.geometry.rings, spatialReference: mapView.spatialReference },
                symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "2px" } }
              })
              this.mapId.push({ id: id })
              rect.isMapTileId = true
              this.rectIds.push(this.rectIdIndex[id] = rect)
              mapView.graphics.add(rect)
            }
          }
          // data = data[0]
          // var id = data.attributes['FRAMENO']
          // if(!this.rectIdIndex.hasOwnProperty(id)) {
          //   var rect = new mapView.TF_graphic({
          //     geometry: { type: 'polygon', rings:data.geometry.rings, spatialReference: mapView.spatialReference },
          //     symbol: { type: 'simple-fill', color: [0, 0, 0, 0.1], outline: { color: [45, 116, 231, 1], width: "2px" } }
          //   })
          //   rect.id = row.id = id
          //   rect.isMapTileId = true
          //   this.rectIds.push(this.rectIdIndex[id] = rect)
          //   mapView.graphics.add(rect)
          // } else list.splice(index, 1)
        },
        error: (error) => this.$message.error(error)
      })
    },
    mapIdForDelete(e, r){
      this.mapId.splice(e, 1)      
      this.mapView.graphics.remove(this.rectIds.splice(e, 1)[0])
      delete this.rectIdIndex[r.id]},
    clearAll() {
      this.printData = []      
      this.rectIdIndex = {}
      this.rectIds = []
    },
    hoverIn(row) {
      if(this.rectIdIndex.hasOwnProperty(this.lastHightId)) {
        if(this.lastHightId == row.id) return
        this.rectIdIndex[this.lastHightId].symbol = this.normalStyle
      }
      this.lastHightId = row.id
      this.rectIdIndex[this.lastHightId].symbol = this.highLightStyle
    },
    hoverOut() {
      if(!this.rectIdIndex.hasOwnProperty(this.lastHightId)) return        
      this.rectIdIndex[this.lastHightId].symbol = this.normalStyle   
      this.lastHightId = undefined      
    },
    rowClick(row) { this.mapView.goTo(this.rectIdIndex[row.id].geometry.extent) },
    print() {
      if(!this.typeName) return this.$message.error('请选择打印格式')
      if(!this.type2Name) return this.$message.error('请选择打印模板')
      var mapView = this.mapView
      var person = this.person || this.$store.state.user.name
      var typeName = this.typeName
      var type2Name = this.type2Name
      var source = this.source
      var fun = this.mapView.TF_printToJson
      for(let i=0,il=this.rectIds,ii=il.length;i<ii;i++) {
        let rect = il[i]
        var str = fun(mapView, rect.geometry.extent, undefined, rect.id, person, source || '拓源')
        let newPrint = { name: rect.id, poj: '.' + typeName.toLowerCase(), type: this.type2Index[type2Name].substring(0, 4), state: undefined }
        this.printData.push(newPrint)
        $.ajax({
          url: appconfig.gisResource.print.config[0].url,
          type: 'POST',
          data:  {
            Web_Map_as_JSON: JSON.stringify(str),
            Format: typeName,
            Layout_Template: type2Name,
            Georef_info: "False",
            Template_Folder: appconfig.templateFolder,
            f: 'pjson'
          },
          success: (data) => {
            data = JSON.parse(data)
            if(data.error) return newPrint.state = data.error.code
            newPrint.state = data.results[0].value.url
          },
          error: (error) => this.$message.error(error)
        })
      }
    },
    deleteThis(url) {
      for(var i=0,il=this.printData,ii=il.length;i<ii;i++) {
        if(il[i].state == url) {
          return il.splice(i, 1)
        }
      }
    },
    downMap(row) {
      var url = row.state
      var xhr=new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = 'blob';
      xhr.onload = function(e){
        if (xhr.status === 200) {
          var export_blob = new Blob([xhr.response])
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.style.display='none'
          a.href = window.URL.createObjectURL(export_blob)
          a.download = row.name + row.poj
          a.click()
          document.body.removeChild(a)
        }
      }
      xhr.send()
    }
  },
  destroyed() {
    [this.move, this.click].map((e) => e.remove())
    this.tileIdLayer.visible = false
    this.mapView.container.style.cursor = ''
    this.mapView.graphics.removeMany(this.rectIds)
    var draw = this.mapView.TF_draw
    if (draw.activeAction) draw.reset()
  }
}
</script>
