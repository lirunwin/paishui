<template>
  <div id="QAbutton_group" style="padding: 0 8px">
    <tf-legend class="legend_dept" label="标绘工具" isopen="true" title="将当前地图显示区域保存为一个疑问标识。">
      <el-button-group class="QAbutton_group">
        <el-button size="mini" title="矩形标识" @click="draw('rect')"><img src="./images/R.png" width="20px" height="20px" style="object-fit: contain"></el-button>
        <el-button size="mini" title="圆形标识" @click="draw('circle')"><img src="./images/C.png" width="20px" height="20px" style="object-fit: contain"></el-button>
        <el-button size="mini" title="箭头标识" @click="draw('arrow')"><img src="./images/A.png" width="20px" height="20px" style="object-fit: contain"></el-button>
        <el-button size="mini" title="曲线标识" @click="draw('line')"><img src="./images/L.png" width="20px" height="20px" style="object-fit: contain"></el-button>
        <el-button size="mini" title="文本标识" @click="drawText"><img src="./images/T.png" width="20px" height="20px" style="object-fit: contain"></el-button>
        <el-button size="mini" title="清空" @click="clearAll"><img src="./images/D.png" width="20px" height="20px" style="object-fit: contain"></el-button>
      </el-button-group>
    </tf-legend>
    <tf-legend class="legend_dept" label="标示名称" isopen="true" title="设置疑问标识显示名称。">
      <el-input v-model="markName" placeholder="请输入内容" clearable maxlength="10" show-word-limit/>
    </tf-legend>
    <tf-legend class="legend_dept" label="标示内容" isopen="true" title="设置疑问标识显示名称。">
      <el-input v-model="markText" type="textarea" :rows="4" placeholder="请输入内容" maxlength="100" show-word-limit/>
      <el-row style="margin-top: 8px">
        <el-button size="mini" style="width: 100%;" type="primary" @click="update">保存疑问标识</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="我的疑问标识" isopen="true" title="查看所有已保存的疑问标识,双击可切换至此疑问标识。">
      <el-table ref="markTable" :data="dataTable" stripe style="width: 100%;" height="350px" row-class-name="selectRowC" @row-click="rowClick">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="name" label="名称" width="70" show-overflow-tooltip/>
        <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip/>
        <el-table-column prop="state" label="状态" width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ ['未处理', '已处理', '未上报'][scope.row.state] }}
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 8px">
        <el-col :span="20">
          <el-pagination ref="pagination" small background layout="total, sizes, prev, next" :page-sizes="[5, 10, 50, 100]"
            :total="total" @current-change="loadSign" @size-change="loadSign" />
        </el-col>
        <el-col :span="4">
          <span ref="pageLength" style="font-size: 13px;" class="el-pagination__total">1/30 页</span>
        </el-col>
      </el-row>
      <div style="margin-top: 8px">
        <el-button size="mini" style="width: 100%;" type="primary" @click="deleteMarks">删除勾选标识</el-button>
      </div>
      <div style="margin-top: 8px">
        <el-button size="mini" style="width: 100%;" type="primary" @click="uploadMarks">上报勾选标识</el-button>
      </div>
    </tf-legend>
    <el-dialog v-dialogDrag title="疑问标识" :visible.sync="qandADialogVisiable" width="800px" top="calc(50vh - 300px)">
      <div style="width:100%;padding-right:8px;">
        <tf-table-legend label="标识信息" isopen="true">
          <div style="margin-top:8px;">
            <span style="display:inline-block;width: 100px;">标识名称：</span>
            <div ref="signName" style="display:inline-block; width:calc(100% - 110px); margin-left: 5px; " />
          </div>
          <div style="margin-top:8px;">
            <span style="display:inline-block;width: 100px; vertical-align: top;">标识内容：</span>
            <div ref="signThing" style="display:inline-block; width:calc(100% - 110px); margin-left: 5px; " />
          </div>
        </tf-table-legend>
        <tf-table-legend label="标识图片" isopen="true" style="margin-top: 8px;">
          <div style="width:100%;height:400px;overflow-y:auto;padding-top:8px;">
            <img ref="QAimage" style="max-width:100%; margin: 0 auto; display: block;">
          </div>
        </tf-table-legend>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateSign">确定</el-button>
        <el-button size="small" @click="qandADialogVisiable = false">取消</el-button>
      </span>
    </el-dialog>    
    <el-dialog v-dialogDrag title="疑问上报" :visible.sync="updateVisiable" width="400px" top="calc(50vh - 300px)">
      <div class="flexDiv" style="width:100%;"><span class="flexTitle">处理人：</span>
        <!-- <el-select v-model="cheakMan" style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" size="small" placeholder="请选择处理人">
          <el-option v-for="item in checks" :key="item.id" :label="item.realName" :value="item.id" />
        </el-select> -->
        <el-select v-model="value" style="display: inline-block; margin-left: 5px; width: calc(100% - 100px);" size="small" placeholder="请选择">
          <el-option-group
            v-for="group in checks"
            :key="group.label"
            :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
          </el-option-group>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateTrue">确定</el-button>
        <el-button size="small" @click="updateVisiable = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import tfLegend from '@/views/zhpt/common/Legend'
import TableItem from '@/components/Table'
import tfTableLegend from '@/views/zhpt/common/TableLegend'
import {IP} from '@/utils/request'
import request from '@/utils/request'
export default {
  name: 'QandA',
  components: { TableItem, tfLegend, tfTableLegend },
  props: { param: Object },
  data() {
    return {
      qandADialogVisiable: false,
      total: 0,
      markName: '',
      markText: '',
      dataTable: [],
      cheakMan: '',
      checks: [],
      updateVisiable: false,
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab == oldTab) return
      if (newTab == 'qAndA') {
        this.$nextTick(() => {
          for (var i = 0, il = this.signs, ii = il.length; i < ii; i++) { il[i].visible = true }
          for (var i = 0, il = this.objs, ii = il.length; i < ii; i++) { il[i].visible = true }
        })
      }
      if (oldTab == 'qAndA') {
        for (var i = 0, il = this.signs, ii = il.length; i < ii; i++) { il[i].visible = false }
        for (var i = 0, il = this.objs, ii = il.length; i < ii; i++) { il[i].visible = false }
        var view = this.mapView
        var draw = view.TF_draw
        if (this.textBox) this.destroy()
        if (draw.activeAction) draw.reset()
        view.container.style.cursor = ''
        if (this.overlay) this.overlay.off()
        if (this.move) [this.move, this.click].map((e) => e.remove())
        this.move = this.click = undefined
      }
    }
  },
  created(){
    this.getDealUsers();
  },
  mounted() {
    this.mapView = this.$attrs.data.mapView
    this.loadSign()
    console.log('this',this);
    this.minExtent = undefined
    // var getOtherPartment = () => {
    //   request({ url: '/base/user/getUserByDepts?depts=' + this.user.depId, method: 'get' }).then(res => {
    //     if(res.code == 1) {
    //       if(!res.result.length) return
    //       this.checks = res.result[0].users
    //     } else this.$message('处理人加载失败：' + res.message)
    //   })
    // }  
    request({ url: '/base/user/getInfo', method: 'get' }).then(res => {
      if(res.code == 1) {
        res = res.result
        this.user = { id: res.id, name: res.realName, depId: res.departmentId}
        //getOtherPartment()
      } else this.$message(res.message)
    })
  },
  destroyed: function() {
    if (this.overlay) {
      this.overlay.off()
    }
    var view = this.mapView
    var draw = view.TF_draw
    view.graphics.removeMany(this.objs.concat(this.signs))
    if (this.textBox) this.destroy()
    if (draw.activeAction) draw.reset()
    view.container.style.cursor = ''
    if (this.move) [this.move, this.click].map((e) => e.remove())
  },
  methods: {
    /**
    * 获取处理人
    */
    getDealUsers(){
      request({ url: '/base/menu/list?label=疑问标识&type=cs', method: 'get' }).then(res => {
        if(res.code == 1 && res.result.length > 0){
          let id = res.result[0].id;
          if(!id)return;
          request({ url: '/base/user/getUserAndDepatmentByPerssion?ids='+id, method: 'get' }).then(result => {
            if(result.code == 1){
              const data = result.result;
              this.dealDeptAndUser(data)
            }
          });
        }
      })
    },

    dealDeptAndUser(data){
      if(data && data.length > 0){
        this.checks = [];
        let selectUser = []
        data.forEach(item => {
          let index = selectUser.findIndex(su => su.deptid == item.departmentId);
          if(index == -1){
            selectUser.push(
              { label: item.departmentName,
                deptid: item.departmentId,
                options:[
                  {
                   value:item.id,
                   label:item.realName
                 }
                ]
              }
            );
          }
          else{
            selectUser[index].options.push({value:item.id,label:item.realName});
          }
        });
        console.log(selectUser);
        this.checks = selectUser;
      }
      let options= [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }]
    },

    loadSign() {
      var pages = this.$refs.pagination
      if (this.overlay) this.overlay.off()
      request({
        url: 'gis/customMark/getMeMark?&current=' + pages.internalCurrentPage + '&size=' + pages.internalPageSize,
        method: 'get'
      }).then(res => {
        if (res.code == 1) {
          res = res.result
          this.total = res.total
          var list = []
          for (let i = 0, il = res.records, ii = il.length; i < ii; i++) {
            var ni = il[i]
            list.push({ 
              id: ni.id, title: ni.caption, path: ni.filePath, createUserName: ni.createUserName, createDate: ni.createDate,
              x: ni.x, y: ni.y, scale: ni.scale, status: ~~ ni.status, handleUserName: ni.handleUserName, 
              handleUser: ni.handleUser, handleDate: ni.handleDate, notes: ni.notes 
            })
          }
          this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize)
          this.loadMapSign(list)
        } else this.$message.error(res.message)
      })
    },
    loadMapSign(ajaxData) {
      var view = this.mapView
      if (this.signs) view.graphics.removeMany(this.signs)
      var signs = []
      var signsIndex = {}; var signsTabledata = []
      var sp = view.spatialReference
      var Graphic = view.TF_graphic
      for (let i = 0, ii = ajaxData.length; i < ii; i++) {
        var qa = ajaxData[i]
        signsIndex[qa.id] = qa
        signsTabledata.push(
          { id: qa.id, 
            name: qa.title,
            notes: qa.notes,
            createUser: qa.createUserName,
            createDate: qa.createDate,
            state: qa.status,
            handleCaption:qa.handleCaption ? qa.handleCaption : '',
            handleUser:qa.handleUserName ? qa.handleUserName : '',
            handleDate:qa.handleDate ? qa.handleDate : ''
          }
        )

        var feature = new Graphic({
          geometry: { type: 'point', x: qa.x, y: qa.y, spatialReference: sp },
          symbol: {
            path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
            color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
            size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
          }
        })

        var featureT = new Graphic({
          geometry: { type: 'point', x: qa.x, y: qa.y, spatialReference: sp },
          symbol: {
            type: 'text', color: 'white', haloColor: 'black', haloSize: '1px',
            text: qa.title || '', yoffset: '-15px', verticalAlignment: 'bottom', font: { size: '14px', weight: 'bold' }
          }
        })
        qa.feature = feature
        featureT.id = (feature.id = qa.id.toString()) + '/text'
        featureT.isSign = true
        feature.isSign = true
        signs.push(feature, featureT)
      }
      view.graphics.addMany(signs)
      this.objs = []
      this.signs = signs
      this.signsIndex = signsIndex
      this.dataTable = signsTabledata
      this.loadOverlay()
    },
    draw(type) {
      if (this.move) [this.move, this.click].map((e) => e.remove())
      this.move = this.click = undefined
      var view = this.mapView
      var sp = view.spatialReference
      var layer = view.graphics
      var draw = view.TF_draw
      var Graphic = view.TF_graphic
      if (draw.activeAction) draw.reset()
      var [mapdiv, obj, mapR] = [view.container]
      var drawFun = type != 'line' ? (evt) => { if (obj) obj.geometry = { type: 'polygon', rings: this.getPolygon(type, evt.vertices, mapR, obj), spatialReference: sp } }
        : (evt) => { if (obj) obj.geometry = { type: 'polyline', paths: this.getPolygon(type, evt.vertices, mapR, obj), spatialReference: sp } }
      view.TF_drawRect(() => { mapdiv.style.cursor = 'crosshair' },
        (evt) => {
          var v = evt.vertices
          if (v.length > 1) return
          mapR = view.resolution
          layer.add(obj = new Graphic({
            geometry: type != 'line' ? { type: 'polygon', rings: [[v[0]]], spatialReference: sp } : { type: 'polyline', paths: [v[0]], spatialReference: sp },
            symbol: { type: 'simple-fill', color: [0, 0, 0, 0], outline: { color: [45, 116, 231, 1], width: '3px' }}
          }))
          obj.isQandAFeature = true
          obj.lastP = [v[0]]
        }, drawFun, () => {
          mapdiv.style.cursor = ''
          var extent = this.minExtent
          var objExtent = obj.geometry.extent
          if (extent) {
            if (extent.xmin > objExtent.xmin) extent.xmin = objExtent.xmin
            if (extent.ymin > objExtent.ymin) extent.ymin = objExtent.ymin
            if (extent.xmax < objExtent.xmax) extent.xmax = objExtent.xmax
            if (extent.ymax < objExtent.ymax) extent.ymax = objExtent.ymax
          } else {
            this.minExtent = { xmin: objExtent.xmin, ymin: objExtent.ymin, xmax: objExtent.xmax, ymax: objExtent.ymax }
          }
          this.objs.push(obj)
          this.loadMapSignEvent()
        })
    },
    getPolygon(type, v, mapR, obj) {
      switch (type) {
        case 'rect':
          return [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]]
        case 'circle':
          var [x, y] = v[0]
          var [dx, dy] = [v[1][0] - x, v[1][1] - y]
          var r = Math.sqrt(dx * dx + dy * dy); var da = Math.PI / 20
          var ret = []
          var PI2 = Math.PI * 2; var sin = Math.sin; var cos = Math.cos
          for (let i = 0; i < PI2; i += da) {
            ret.push([x + r * cos(i), y + r * sin(i)])
          }
          return [ret]
        case 'arrow':
          var [x, y] = v[0]
          var [fx, fy] = v[1]
          var dx = fx - x; var dy = fy - y
          var r = Math.sqrt(dx * dx + dy * dy)
          if (r < mapR * 20) return [[[x + dy, y - dx], [fx, fy], [x - dy, y + dx]]]
          r = mapR * 10 / r, dx *= r, dy *= r
          return [[
            [x + dy, y - dx], [fx + dy - dx * 2, fy - dx - dy * 2],
            [fx + dy * 2 - dx * 2, fy - dx * 2 - dy * 2], [fx, fy], [fx - dy * 2 - dx * 2, fy + dx * 2 - dy * 2],
            [fx - dy - dx * 2, fy + dx - dy * 2], [x - dy, y + dx]
          ]]
        case 'line':
          var lasts = obj.lastP
          if (lasts.length == 1) return obj.lastP = [lasts[0], v[1]]
          var lastP = lasts[lasts.length - 1]
          var dx = v[1][0] - lastP[0]; var dy = v[1][1] - lastP[1]
          if (Math.sqrt(dx * dx + dy * dy) > mapR * 5) lasts.push(v[1])
          else obj.lastP[lasts.length - 1] = v[1]
          return lasts
      }
    },
    update() {
      var mapView = this.mapView
      var draw = mapView.TF_draw
      if (this.textBox) this.destroy()
      if (draw.activeAction) draw.reset()
      var extent = this.minExtent
      var markName = this.markName
      var markText = this.markText
      if (!markName) return this.$message.error('请输入疑问标识名称')
      if (!markText) return this.$message.error('请输入疑问标识描述')
      if (!extent) return this.$message.error('地图视图范围无任何绘制图元')
      for (var i = 0, il = this.signs, ii = il.length; i < ii; i++) {
        il[i].visible = false
      }
      var [dw, dh] = [(extent.xmax - extent.xmin) * 0.025, (extent.ymax - extent.ymin) * 0.025]
      extent = { xmin: extent.xmin - dw, ymin: extent.ymin - dh, xmax: extent.xmax + dw, ymax: extent.ymax + dh }
      var mapExtent = mapView.extent
      if (extent.xmin > mapExtent.xmax || extent.ymin > mapExtent.ymax || extent.xmax < mapExtent.xmin || extent.ymax < mapExtent.ymin) { return this.$message.error('地图视图范围无任何绘制图元') }
      var minExtent = [Math.max(mapExtent.xmin, extent.xmin), Math.max(mapExtent.ymin, extent.ymin),
        Math.min(mapExtent.xmax, extent.xmax), Math.min(mapExtent.ymax, extent.ymax)]
      var r = mapView.resolution
      var xy = mapView.toScreen({ x: minExtent[0], y: minExtent[3], spatialReference: mapView.spatialReference })
      minExtent = { x: xy.x, y: xy.y, width: (minExtent[2] - minExtent[0]) / r, height: (minExtent[3] - minExtent[1]) / r }
      this.qandADialogVisiable = true
      this.$nextTick(() => {
        this.$refs.signName.innerHTML = this.markName
        this.$refs.signThing.innerHTML = this.markText
        mapView.takeScreenshot({ quality: 50 }).then((img) => {//, area: minExtent
          this.$refs.QAimage.src = img.dataUrl
          for (var i = 0, il = this.signs, ii = il.length; i < ii; i++) {
            il[i].visible = true
          }
        })
      })
    },
    updateSign() {
      // if (!this.cheakMan) return this.$message.error('请选择处理人')
      var base64 = this.$refs.QAimage.src
      if (!base64) return this.$message.error('图片不存在')
      var array = []
      
      var arr = base64.split(','), bstr = atob(arr[1])
      for (var i = 0,ii = bstr.length; i < ii; i++) { array.push(bstr.charCodeAt(i)) }
      var blob = new File([new Uint8Array(array)], 'Q&Aimage.jpg', { type: 'image/jpeg' })

      // var blob = new File(bstr, 'Q&Aimage', { type: 'image/jpeg' })
      // var blob
      // for (var i = 0; i < base64.length; i++) { array.push(base64.charCodeAt(i)) }
      // var blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
      var fd = new FormData()
      var extent = this.minExtent
      var [cx, cy] = [(extent.xmax + extent.xmin) / 2, (extent.ymax + extent.ymin) / 2]
      fd.append('fileList', blob)
      fd.append('x', cx)
      fd.append('y', cy)
      // fd.append('handleUser', this.cheakMan)
      fd.append('scale', this.mapView.scale)
      fd.append('caption', this.markName)
      fd.append('notes', this.markText)
      request({
        url: 'gis/customMark/upLoadMark',
        method: 'post', data: fd, file: true
      }).then(res => {
        if (res.result) {
          this.loadSign()
          this.$message.success('添加标识：' + this.markName + ' 成功')
          var view = this.mapView
          view.graphics.removeMany(this.objs)
          this.minExtent = undefined
        } else {
          this.$message.error('添加标识失败' + res.message)
        }
      })
      this.qandADialogVisiable = false
    },
    drawText() {
      if (this.move) [this.move, this.click].map((e) => e.remove())
      this.move = this.click = undefined
      if (this.textBox) return
      var view = this.mapView
      var mapdiv = view.container
      mapdiv.style.cursor = 'crosshair'
      this.textBox = true
      this.$store.dispatch('map/changeMethod', { pathId: 'qAndaTextbox', widgetid: 'FloatPanel', label: '文本框', param: { that: this }})
      this.setText = (text, point) => {
        var testFea = new view.TF_graphic({
          geometry: { type: 'point', x: point.x, y: point.y, spatialReference: view.spatialReference },
          symbol: {
            type: 'text', color: 'white', haloColor: 'black', haloSize: '1px',
            text: text, verticalAlignment: 'bottom', font: { size: '14px', weight: 'bold' }
          }
        })
        view.graphics.add(testFea)
        mapdiv.style.cursor = ''
        var extent = this.minExtent
        var xy = testFea.geometry
        if (extent) {
          if (extent.xmin > xy.x) extent.xmin = xy.x
          if (extent.ymin > xy.y) extent.ymin = xy.y
          if (extent.xmax < xy.x) extent.xmax = xy.x
          if (extent.ymax < xy.y) extent.ymax = xy.y
        } else {
          this.minExtent = { xmin: xy.x, ymin: xy.y, xmax: xy.x, ymax: xy.y }
        }
        this.objs.push(testFea)
        this.destroy()
        this.loadMapSignEvent()
      }
    },
    clearAll() {
      var view = this.mapView
      var draw = view.TF_draw
      this.minExtent = undefined
      view.graphics.removeMany(this.objs)
      if (this.textBox) this.destroy()
      if (draw.activeAction) draw.reset()
      view.container.style.cursor = ''
    },
    deleteMarks() {
      let selects = this.$refs.markTable.selection;
      if (!selects.length) return this.$message.error('未选中任何标识')
      let names = selects.map(item => item.name);
      //已上报的疑问标识记录信息是不能进行删除的
      let exported = selects.find(item => item.state != 2);
      if(exported){
        this.$message.warning('标识【'+exported.name+'】已经上报，不允许删除！');
        return;
      }
      this.$confirm(
        '确定删除选中的' + selects.length + '条疑问标识信息？', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }
      ).then(() => {
        request({
          url: 'gis/questionmark/deleteByIds?&ids=' + selects.map((e) => e.id).join(','),
          method: 'delete'
        }).then(res => {
          if (res.code == 1) {
            this.$message('已删除')
            this.$refs.pagination.internalCurrentPage = 1
            this.loadSign()
          } else this.$message(res.message)
        })
      })
    },
    loadMapSignEvent() {
      var mapView = this.mapView
      var mapdiv = mapView.container
      var graphics = mapView.graphics
      this.move = mapView.on('pointer-move', (evt) => mapView.hitTest(evt, graphics).then((re) => {
        re = re.results
        var needShow = false
        if (re.length) {
          for (var i = 0, ii = re.length; i < ii; i++) {
            if (!re[i].graphic.isSign) continue
            re = re[i].graphic
            needShow = true
            break
          }
        }
        mapdiv.style.cursor = needShow ? 'pointer' : ''
      }))
      this.click = mapView.on('click', (evt) => {
        mapView.hitTest(evt, graphics).then((re) => {
          re = re.results
          if (!re.length) return
          var feature
          for (var i = 0, ii = re.length; i < ii; i++) {
            if (!re[i].graphic.isSign) continue
            feature = re[i].graphic
            break
          }
          if (!feature) return
          var id = feature.id.toString()
          if (id.indexOf('/text') > -1) id = id.split('/')[0]
          this.show(this.signsIndex[id])
        })
      })
    },
    loadOverlay() {
      if (this.mapView.TF_overlay) this.loadMapSignEvent(this.overlay = this.mapView.TF_overlay)
      else {
        this.$store.dispatch('map/changeMethod', {
          pathId: 'overlay', widgetid: 'FloatPanel',
          label: '浮动框', param: this.mapView
        }).then(() => {
          this.overlay = this.mapView.TF_overlay
          this.loadMapSignEvent()
        })
      }
    },
    rowClick(row) {
      var feaData = this.signsIndex[row.id]
      this.mapView.center = { x: feaData.x, y: feaData.y, spatialReference: this.mapView.spatialReference }
      this.mapView.scale = feaData.scale
      this.$message('当前标识：' + feaData.title)
      feaData['handleCaption'] = row.hasOwnProperty('handleCaption') ? row.handleCaption : '';
      this.show(feaData)
    },
    show(feaData) {
      var div = this.overlay.show(feaData.feature.geometry, '疑问标识')
      var str = '<div style=" width: 100%; display: flex; flex-wrap: wrap;border-top:1px solid #eee;">' +
        '<div class="flexDiv"><span class="flexTitle">标识名称：</span><div class="flexInfo">' + feaData.title + '</div></div>' +
        '<div class="flexDiv" style="width:100%"><span class="flexTitle" style="vertical-align: top;">标识内容：</span><div class="flexInfo">' + feaData.notes + '</div></div>' +
        '<div class="flexDiv"><span class="flexTitle">创建人：</span><div class="flexInfo">' + (feaData.createUserName || '-') + '</div></div>' +
        '<div class="flexDiv" style="width:66%"><span class="flexTitle">创建时间：</span><div class="flexInfo">' + (feaData.createDate || '-') + '</div></div>' +
        '<div class="flexDiv"><span class="flexTitle">处理状态：</span><div class="flexInfo">' + (['未处理', '已处理', '未上报'][feaData.status]) + '</div></div>' +
        '<div class="flexDiv" style="width:100%"><span class="flexTitle">处理说明：</span><div class="flexInfo">' + (feaData.handleCaption || '-') + '</div></div>'+
        
        '<div class="flexDiv"><span class="flexTitle">处理人：</span><div class="flexInfo">' + (feaData.handleUserName || '-') + '</div></div>' +
        '<div class="flexDiv" style="width:66%"><span class="flexTitle">处理时间：</span><div class="flexInfo">' + (feaData.handleDate || '-') + '</div></div></div>'
      div.innerHTML = '<div style="width:100%;min-height:200px;text-align: center;background:#ddd;">' +
        '<div style="padding-top:100px;"><i class="el-icon-loading"></i><span>加载中</span></div></div>' + str
      var image = new Image()
      let seed = new Date().getTime()
      this.seed = seed
      image.src = IP + '/base/file/loadImg?access_token=' + this.$store.state.user.token + '&remotePath=' + feaData.path.replace(/\//g, '%2f')
      image.style.width = '100%'
      image.onload = () => {
        if(this.seed != seed) return
        var d = div.children[0]
        d.innerHTML = ''
        d.appendChild(image)
      }
      image.onerror = () => {
        if(this.seed != seed) return
        var d = div.children[0]
        d.innerHTML = '<div style="padding-top:100px;"><span>加载失败</span></div>'
      }
    },
    uploadMarks() {
      var selects = this.$refs.markTable.selection
      if (!selects.length) return this.$message.error('未选中任何标识')
      //已上报的疑问标识不能二次上报
      let exported = selects.find(item => item.state != 2);
      if(exported){
        this.$message.warning('标识【'+exported.name+'】已经上报，不允许再次上报！');
        return;
      }
      this.updateVisiable = true  
    },
    updateTrue() {
      var selects = this.$refs.markTable.selection
      request({
        url: 'gis/customMark/handleMark?userId=' + this.cheakMan + '&ids=' + selects.map((e) => e.id).join(','),
        method: 'put'
      }).then(res => {
        if (res.code == 1) {
          this.$message('已上报')
          this.$refs.pagination.internalCurrentPage = 1
          this.loadSign()
        } else this.$message(res.message)
        this.updateVisiable = false  
      })
    },
    destroy() {
      for (let i = 0, il = this.$attrs.data.that.FloatPanels, ii = il.length; i < ii; i++) {
        if (il[i].com == 'qAndaTextbox') {
          il.splice(i, 1)
          this.textBox = undefined
          return
        }
      }
    }
  }
}
</script>
<style type="scss" scoped>
#QAbutton_group >>> .el-button-group button{
  border: 1px solid #fff;
}
#QAbutton_group >>> .el-button-group button:hover{
  border: 1px dashed #2d74e7;
}
</style>
