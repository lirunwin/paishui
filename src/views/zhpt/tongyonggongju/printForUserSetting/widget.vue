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
    <tf-legend class="legend_dept" label="打印模板" isopen="true" isRequired='true' title="设定图纸尺寸。">
      <el-select v-model="type2Name" placeholder="请选择">
        <el-option v-for="item in types2Att" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="比例尺" isopen="true" isRequired='true' title="设定打印地图比例尺。">
      <el-row style="margin-bottom: 8px">
        <el-col :span="16">
          <el-input v-model="scaleBar" size="mini" placeholder="请输入比例尺" clearable/>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button size="mini" type="primary" @click="upload" style="width: 100%">更新</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button style="width: 100%" size="mini" type="primary" @click="getscale">获取当前比例尺</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="选取范围" isopen="true" title="点击按钮，然后到地图上点击确定打印范围。">
      <el-row style="margin-bottom: 8px">        
        <el-col :span="11">
          <el-button size="mini" style="width: 100%" type="primary" @click="reload">重置</el-button>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-button size="mini" style="width: 100%" type="primary" @click="goto">定位</el-button>
        </el-col>
      </el-row>
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
      <el-table ref="multipleTable" :data="printData" tooltip-effect="dark" style="width: 100%" max-height="200px">
        <el-table-column prop="name" label="打印图纸" width="80px" />
        <el-table-column prop="poj" label="文件类型" width="80px" />
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
        <el-button style="float:right;margin:8px;" ref="delete" size="mini" type="primary" @click="printData = []">清空所有</el-button>
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
  name: 'printForUserSetting',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      activeName: 'themShow',
      typeName: '',
      type2Name: '',
      show3: false,
      title: '',
      radio: 'show',
      person: '',
      source: '',
      scaleBar: '',
      elements: {},
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
        { value: 'DefaultA2P', label: 'A2纵向(42x59.4)(cm)' },
      ],
      printData: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {
    this.mapView = this.$attrs.data.mapView
    this.scaleBar = this.mapView.scale
    var graphic = this.mapView.TF_graphic
    this.printRect = new graphic({
      geometry: { type: 'polygon',  spatialReference: this.mapView.spatialReference },
      symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
    })
    this.rectExtent = this.printRect.geometry.extent
    this.mapView.graphics.add(this.printRect)
    this.addRectMove()

    var dir = {}
    for(let i=0,il=this.types2Att,ii=il.length;i<ii;i++) {
      var d = il[i]
      dir[d.value] = d
    }
    this.dir = dir
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
      if(newTab == 'printForUserSetting') {
        this.$nextTick(() => {
          this.printRect.visible = true
          this.addRectMove()
        })
      } 
      if(oldTab == 'printForUserSetting') {
        [this.move, this.down, this.up, this.drag].map((e) => e.remove())
        this.printRect.visible = false
      }
    },
    type2Name(e) {
      var wh = this.dir[e].label //A0横向(118.88x84.1)(cm)
      wh = wh.substring(wh.indexOf('(') + 1) //118.88x84.1)(cm)
      wh = wh.substring(0, wh.indexOf(')')) //118.88x84.1
      wh = wh.split('x')
      this.wh = wh
      this.upload()
    }
  },
  methods: {
    addRectMove() {     
      var sp = this.mapView.spatialReference 
      var [dxdy, wh, moveState, downState] = [[0, 0]]
      this.move = this.mapView.on('pointer-move', (evt) => {
        var xy = this.mapView.toMap({ x: evt.x, y: evt.y })
        if(!moveState && this.inRect(xy)) {
          this.mapView.container.style.cursor = 'move'
          moveState = true
          this.printRect.symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "5px" } }
        }
        if(moveState && !this.inRect(xy)) {
          this.mapView.container.style.cursor = ''
          moveState = false
          this.printRect.symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
        }
      })
      this.down = this.mapView.on('pointer-down', (evt) => {
        if(moveState) {
          var xy = this.mapView.toMap({ x: evt.x, y: evt.y })
          var extent = this.rectExtent
          dxdy = [xy.x - (extent.xmin + extent.xmax) / 2, xy.y - (extent.ymin + extent.ymax) / 2]
          downState = true
          this.printRect.symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "5px" } }
          wh = this.rectExtent
          wh = [(wh.xmax - wh.xmin) / 2, (wh.ymax - wh.ymin) / 2]
        }
      })
      this.up = this.mapView.on('pointer-up', (evt) => {
        downState = false
        this.printRect.symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
      })
      this.drag = this.mapView.on('drag', (evt) => {
        if(downState) {
          var xy = this.mapView.toMap({ x: evt.x, y: evt.y })
          xy.x -= dxdy[0]
          xy.y -= dxdy[1]
          var v = [xy.x - wh[0], xy.x + wh[0], xy.y - wh[1], xy.y + wh[1]]
          this.printRect.geometry = {
            type: 'polygon',
            rings: [[[v[0], v[2]], [v[1], v[2]], [v[1], v[3]], [v[0], v[3]]]],
            spatialReference: sp
          }
          this.rectExtent = this.printRect.geometry.extent
          evt.stopPropagation()
        }
      })
    },
    inRect({x, y}) {
      var extent = this.rectExtent
      return extent ? (x > extent.xmin && x < extent.xmax && y > extent.ymin && y < extent.ymax) : false
    },
    getRect(w, h, x, y) {
      if(!this.scaleBar) this.scaleBar = this.mapView.scale
      w = w * this.scaleBar / 100
      h = h * this.scaleBar / 100
      
      var widthMap = Math.asin(w / 2 / (6378137)) * 2 / Math.PI * 180 / 2
      var heightMap = Math.asin(h / 2 / (6378137)) * 2 / Math.PI * 180 / 2
      var v = [x - widthMap / 2, x + widthMap / 2, y - heightMap / 2, y + heightMap / 2]
      this.printRect.geometry = { type: 'polygon', rings: [[[v[0], v[2]], [v[1], v[2]], [v[1], v[3]], [v[0], v[3]]]], spatialReference: this.mapView.spatialReference }
      this.rectExtent = this.printRect.geometry.extent
    },
    upload() {
      var wh = this.wh || [0, 0]
      var c = this.rectExtent
      c =  c ? c.center : this.mapView.center
      this.getRect(wh[0], wh[1], c.x, c.y)
    },
    getscale() {
      this.scaleBar = this.mapView.scale
      this.upload()   
    },
    reload() {
      this.scaleBar = this.mapView.scale
      var wh = this.wh || [0, 0]
      var c = this.mapView.center
      this.getRect(wh[0], wh[1], c.x, c.y)
    },
    goto() {
      if(this.wh) this.mapView.goTo(this.rectExtent)
    },
    print: function() {
      if(!this.title) {
        this.$message.error("标题不能为空");
        return
      }
      if(!this.typeName) {
        this.$message.error("请选择打印格式");
        return
      }
      if(!this.wh) {
        this.$message.error("请选择打印模板");
        return
      }
      var extent = this.rectExtent
      var str = this.mapView.TF_printToJson(this.mapView, extent, undefined,
        this.title, this.person || this.$store.state.user.name, this.source || '拓源')
      var newPrint = { name: this.title, poj: '.' + this.typeName.toLowerCase(), state: undefined }
      this.printData.push(newPrint)
      $.ajax({
        url: appconfig.gisResource.print.config[0].url,
        type: 'POST',
        data:  {
          Web_Map_as_JSON: JSON.stringify(str),
          Format: this.typeName,
          Layout_Template: this.type2Name,
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
    [this.move, this.down, this.up, this.drag].map((e) => e.remove())
    this.mapView.graphics.remove(this.printRect)
  }
}
</script>
