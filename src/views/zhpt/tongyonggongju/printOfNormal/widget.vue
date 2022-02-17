<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标题" isopen="true" isRequired='true' title="设置打印结果中的标题。">
      <el-input v-model="title" placeholder="请输入标题" clearable maxlength="20" show-word-limit/>
    </tf-legend>
    <tf-legend class="legend_dept" label="格式" isopen="true" isRequired='true' title="设定打印结果的格式。">
      <el-select v-model="typeName" placeholder="请选择">
        <el-option v-for="item in typesAtt" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="高级设置" isopen="true" isRequired='true' title="设定打印的详细参数。单击可打开选项。">      
      <el-row style="margin-bottom: 8px">
        <span style="font-size:14px;">出图范围：</span>
        <el-radio v-model="radio" label="all">当前范围</el-radio>
        <el-radio v-model="radio" label="draw">绘制范围</el-radio>
      </el-row>
      <el-input v-model="person" size="small" placeholder="请输入内容" clearable style="margin-bottom: 5px" maxlength="20" show-word-limit>
        <template slot="prepend">出图人员</template>
      </el-input>
      <el-input v-model="source" size="small" placeholder="请输入内容" clearable maxlength="20" show-word-limit>
        <template slot="prepend">出图单位</template>
      </el-input>
    </tf-legend>
    <tf-legend class="legend_dept" label="打印结果" :isopen="true" title="打印结果显示。">
      <el-table ref="multipleTable" :data="printData" tooltip-effect="dark" style="width: 100%" max-height="200px">
        <el-table-column prop="name" label="打印图纸" width="80px" />
        <el-table-column prop="poj" label="文件类型" width="80px" />
        <el-table-column prop="size" label="操作" >
          <template slot-scope="scope">
            <span v-if="scope.row.state && isNaN(+ scope.row.state)">
              <el-link type="primary" :href="scope.row.state" target="_blank">查看</el-link>
              <el-link type="primary" @click="downMap(scope.row)" target="_blank">下载</el-link>
              <el-link type="primary" @click="deleteThis(scope.row.state)" target="_blank">删除</el-link>
            </span>
            <span v-if="!scope.row.state"><i class="el-icon-loading"></i>生成中</span>
            <span v-if="+ scope.row.state > 0" style="color: #f56c6c;">打印错误：{{ scope.row.state }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button style="float:right;margin:8px;" ref="delete" size="mini" type="primary" @click="printData = []">清空所有</el-button>
      </el-row>
    </tf-legend>
    <el-row>
      <el-button size="mini" type="primary" style="width: 100%" @click="print">打印</el-button>
    </el-row>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import request from '@/utils/request'
export default {
  name: 'printOfNormal',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      typeName: '',
      title: '',
      radio: 'all',
      person: '',
      source: '',
      typesAtt: [
        { value: 'PNG', label: 'PNG' },
        { value: 'PDF', label: 'PDF' },
        { value: 'JPG', label: 'JPG' }
      ],
      printData: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {
    this.mapView = this.$attrs.data.mapView
    this.printRect = new this.mapView.TF_graphic({
      geometry: { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
    })
    this.printRect.isDraw = false
    this.mapView.graphics.add(this.printRect)
    request({ url: '/base/user/getInfo', method: 'get' }).then(res => {
      if(res.code == 1) {
        res = res.result
        this.person = res.realName
        this.source = res.departmentName
      }
    })
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'printOfNormal') {
        this.$nextTick(() => {
          this.printRect.visible = true
          if(this.isDrawing) this.drawRect()   
        })     
      } 
      if(oldTab == 'printOfNormal') {
        var view = this.mapView
        var draw = view.TF_draw
        if(draw.activeAction) {
          this.isDrawing = true
          draw.reset()
        }
        view.container.style.cursor = ''
        this.printRect.visible = false
      }
    },
    radio(value) {   
      if(value == 'draw') this.drawRect()
      else {
        var draw = this.mapView.TF_draw
        if(draw.activeAction) draw.reset()
        this.printRect.isDraw = false
        this.printRect.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference } 
      }
    }
  },
  methods: {
    drawRect() {
      var view = this.mapView
      var sp = view.spatialReference
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.TF_drawRect(() => {view.container.style.cursor = 'crosshair'}, () => {}, 
      (evt) => {
        var v = evt.vertices
        if (v.length > 1)
          this.printRect.geometry = {
            type: 'polygon', rings: [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]], spatialReference: sp
          } 
      }, () => {
        draw.reset()
        this.printRect.isDraw = true
        this.isDrawing = false
        view.container.style.cursor = ''
      })
    },
    print() {
      if(!this.title) return this.$message.error('打印标题不能为空')
      if(!this.typeName) return this.$message.error('请选择打印格式')
      var extent, scale
      if(this.printRect.isDraw) {
        var rect = this.printRect.geometry.extent
        extent = rect
        scale = undefined
      } else {
        extent = this.mapView.extent
        scale = this.mapView.scale
      }
      var str = this.mapView.TF_printToJson(this.mapView, extent, scale,
        this.title, this.person || this.$store.state.user.name, this.source || '拓源')
      var newPrint = { name: this.title, poj: '.' + this.typeName.toLowerCase(), state: undefined }
      this.printData.push(newPrint)
      $.ajax({
        url: appconfig.gisResource.print.config[0].url,
        type: 'POST',
        data:  {
          Web_Map_as_JSON: JSON.stringify(str),
          Format: this.typeName,
          Layout_Template: "Default",
          Georef_info: "False",
          Template_Folder: appconfig.templateFolder,
          f: 'pjson'
        },
        success: function(data) {
          data = JSON.parse(data)
          if(data.error) return {}
          newPrint.state = data.results[0].value.url
        },
        error: (error) => this.$message.error(error)
      })
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
    var view = this.mapView
    var draw = view.TF_draw
    if(draw.activeAction) draw.reset()
    view.container.style.cursor = ''    
    this.mapView.graphics.remove(this.printRect)
  }
}
</script>
