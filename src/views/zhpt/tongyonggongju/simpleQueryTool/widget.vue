<template>
  <div style="position: absolute; top: 20px; left: 30px;">
    <el-row style="width: 340px">
      <el-select v-model="selectT" style="float: left;width:100px;" placeholder="请选择" size="small">
        <el-option label="地名" value="1" />
        <el-option label="坐标" value="2" />
        <el-option label="管径" value="3" />
        <el-option label="管材" value="4" />
        <el-option label="设施编号" value="5" />
        <el-option label="阀门类型" value="6" />
        <el-option label="阀门规格" value="7" />
      </el-select>
      <el-autocomplete class="helpInput" style="width: 190px; float: left; padding-left: 5px;" clearable size="small" 
        popper-class="my-autocomplete" v-model="inputT" :fetch-suggestions="querySearch" :placeholder="selectTt" @clear="textClear">
        <template slot-scope="{ item }">
          <span class="name">{{ item.value }}</span>
        </template>
      </el-autocomplete>
      <el-button style="float: left; height: 32px; border-radius: 0px 4px 4px 0px;" type="primary" icon="el-icon-search" size="small" plain @click="queryFeature"/>
    </el-row>
    <div id="zoomH" style="position: absolute; top: 0px; left: 350px; width: 70px;">
      <div class="widgetGroupButtoms" title="前一视图" style="float: left;" @click="viewHistroy(true)">
        <img src="./images/left.png">
      </div>
      <div class="widgetGroupButtoms" title="后一视图" style="float: left;" @click="viewHistroy(false)">
        <img src="./images/right.png">
      </div>
    </div>
    <el-collapse-transition>
      <div id="resultDiv" v-show="showResult" ref="showResult" style="width:410px;margin-top:10px;">
        <div style="overflow:auto;max-height:380px;margin-bottom:10px;" >
          <ul id="resultUl" ref="scroll" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in queryResult" :key="index" @click="liClick(i)">
              <div>
                <span class="title">{{ queryTitle }}：<span v-html="i.text"></span></span>
              </div>
              <div style="margin-top: 13px;">
                <span class="other">编号：<span class="text">{{ i.id }}</span></span>
                <span class="other" style="margin-left: 8px;">设备类型：<span class="text">{{ i.layer }}</span></span>
              </div>
              <div class="icon"><i class="el-icon-arrow-right"/></div>
            </li>
          </ul>
          <div class="load" ref="queryLoading"><i class="el-icon-loading"/>加载中...</div>
          <div class="load" ref="queryNoMore">没有更多了...</div>
        </div>
        <div class="allResult" ref="statue"></div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import { queryConfig } from "./queryConfig"
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'SimpleQueryTool',
  components: {},
  props: {
    mapView: { type: Object, default: () => [] }
  },
  data() {
    return {
      inputT: '',
      selectT: '1',
      selectTt: '请输入地名',
      queryResult: [],
      allFea: [],
      testi: 0,
      disabled: false,
      showResult: false,
      queryTitle: ''
    }
  },
  watch: {
    selectT: function(e, old) {
      this.selectTt = [
        '请输入地名', '请输入X,Y', '请输入管径大小', '请输入管材类型',
        '请输入设施编号', '请输入阀门类型', '请输入阀门半径大小'
      ][e - 1]
      if(e != old) {
        this.queryResult = []
        this.showResult = false
      }
    },
    mapView: function(e) {
      var center = e.center
      this.extentGourp = []
      this.extentGourp.push({
        center: center,
        zoom: e.zoom
      })
      this.extentIndex = 0
      this.isExtentChange = true
      this.isExtentTime = undefined
      var sleepZoom = [[center.x, center.y], e.zoom, undefined]
      loadModules(['esri/Graphic'], { url: esriConfig.baseUrl }).then(([Graphic]) => {        
        this.showGeo = new Graphic({
          geometry: { type: 'point', x:0, y:0, spatialReference: this.mapView.spatialReference },
          symbol: {
            path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
            color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
            size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
          }
        })
        this.mapView.graphics.add(this.showGeo)
      })
      this.mapView.watch('center', (ec) => {
        if (this.isExtentChange && ec.x != sleepZoom[0][0] && ec.y != sleepZoom[0][1]) {
          if (sleepZoom[2]) clearTimeout(sleepZoom[2])
          sleepZoom[2] = setTimeout(() => {
            sleepZoom[0] = [ec.x, ec.y]
            if (this.extentIndex != this.extentGourp.length - 1) {
              this.extentGourp.splice(
                this.extentIndex + 1,
                this.extentGourp.length - this.extentIndex
              )
            }
            this.extentGourp.push({
              center: ec,
              zoom: this.mapView.zoom
            })
            this.extentIndex = this.extentGourp.length - 1
          }, 200)
        }
      })
      
    }
  },
  mounted() {
    this.queryConfig = queryConfig
    this.queryAllText = {}
    this.queryText(16, 'MATERIAL', this.queryAllText)
    this.queryText(9, 'VALVETYPE', this.queryAllText)
    this.loadLayerInfo()
    window.str = this.$refs.scroll
    this.disabled = true
  },
  methods: {
    loadLayerInfo() {
      $.ajax({  //结果
        url: appconfig.gisResource.business_map.config[0].url + '?f=pjson',
        type: 'GET',
        success: (data) => {          
          data = JSON.parse(data)
          data = data.layers   
          var layers = []
          for(let i=0,ii=data.length;i<ii;i++) {
            if(!data[i].subLayerIds) layers.push(data[i].id)
          }
          sencondFun(layers)
        },
        error: (error) => {
          this.$message.error('查询错误，请联系管理员')
          console.log(error)
        }
      })
      var sencondFun = (layers) => {
        $.ajax({  //结果
          url: appconfig.gisResource.layer_name.config[0].url,
          type: 'POST',
          data: {
            usertoken: appconfig.usertoken,
            layerids: JSON.stringify(layers),
            f: 'pjson'
          },
          success: (data) => {          
            data = JSON.parse(data)
            if(data.code == 10000){    
              data = data.result.rows
              var rows = {}
              var rows2 = {}
              for(let i=0,ii=data.length;i<ii;i++) {
                var dd = data[i]
                rows[data[i].layerdbname] = { id: dd.layerid, name: data[i].layername }
                rows2[dd.layerid] = data[i].layerdbname
              }
              this.layerIndex = rows
              this.layerIdIndex = rows2
            }
          },
          error: (error) => {
            this.$message.error('查询错误，请联系管理员')
            console.log(error)
          }
        })
      }
    },
    querySearch(queryString, cb) {
      switch(parseInt(this.selectT)) {
        default: 
          cb([])
          break
        case 4:
          cb(this.queryAllText['MATERIAL'].filter((e) => e.value.indexOf(queryString) > -1))
          break
        case 6:
          cb(this.queryAllText['VALVETYPE'].filter((e) => e.value.indexOf(queryString) > -1))
          break
      }
    },
    queryText(id, name, texts) {
      $.ajax({
        url: appconfig.gisResource.fieldUniqueValue.config[0].url,
        type: 'POST',
        data: {
          usertoken: appconfig.usertoken,
          layerid: id,
          field_name: name,
          f: 'pjson'
        },
        success: (data) => {
          data = JSON.parse(data)
          console.log(id, name, texts,appconfig.gisResource.fieldUniqueValue.config[0].url);
          texts[name] = data.result.rows.map((e) => {return {value: e}})
        }, 
        error: (error) => {
          this.$message.error('查询错误，请联系管理员')
          console.log(error)
        }
      })
    },
    queryFeature() {
      var Istr = this.inputT.replace(/^\s*|\s*$/g,"").toUpperCase()
      if(Istr == '') return this.$message('请输入查询内容')
      if(parseInt(this.selectT) == 2) {        
        Istr = Istr.replace('，', ',')
        if(Istr.indexOf(',') < 0) return this.$message.error('请以 X坐标,Y坐标 格式输入 如： 104.4,30.8 ')
        Istr = Istr.split(',')
        try{
          var x = parseFloat(Istr[0])
          var y = parseFloat(Istr[1])
        } catch {
          return this.$message.error('坐标格式错误 请输入正确坐标格式 如： 104.4,30.8 ')
        }
        this.mapView.center = {x: x, y: y, spatialReference: this.mapView.spatialReference}          
        if(this.mapView.zoom > 6) this.mapView.zoom = 6
        this.$message.success('跳转至 X:' + x + 'Y:' + y)
      } else {
        this.disabled = false
        this.queryResult = []
        this.showResult = true
        var config = this.queryConfig[[,'地名',,'管径','管材','设施编号','阀门类型','阀门规格'][this.selectT]]
        let seed = new Date().getTime()
        this.timeTable = seed      
        let ii = config.layers.length
        var statue = this.$refs.statue
        var dshow = 0, dquery = 0
        this.allFea = []
        this.setFea = 0
        var firstLoad = false
        var ilength = ii
        this.$refs.queryNoMore.style.display = 'none'
        this.showGeo.geometry = { type: 'point', x:0, y: 0, spatialReference: this.mapView.spatialReference }
        var fields = config.fields
        this.queryTitle = config.text
        for(let i=0;i<ii;i++) {
          var dc = config.layers[i]
          let layerId = this.layerIndex[dc].id
          $.ajax({
            url: appconfig.gisResource.business_map.config[0].url + '/' + layerId + '/query',
            type: 'POST',
            data: {              
              where: 'UPPER("' + fields + '")' + 
                (config.isLike ? 
                  " like '%" + Istr.replace(/_/g, '$_').replace(/\?/g, '$?').replace(/%/g, '$%') + "%' ESCAPE '$'" : 
                  (" = '" + Istr + "'")),
              returnIdsOnly: true,
              f: 'pjson'
            },
            success: (data) => {
              ilength -= 1
              if(seed != this.timeTable) return
              data = JSON.parse(data)
              var str = ''
              if(!data.error) {
                data = data.objectIds
                if(data) {
                  dquery += data.length
                  var newRows = []
                  for(var j=0,jj=data.length;j<jj;j++) {
                    newRows.push({ l: layerId, id: data[j]})
                  }
                  this.allFea = this.allFea.concat(newRows)
                }
                str += '找到相关结果：' + dquery + '个'
                if(!firstLoad && this.allFea.length > 0) {
                  this.loadFun()
                  firstLoad = true
                }
              }
              statue.innerHTML = str
              if(ilength == 0) {
                if(dquery == 0) {
                  this.disabled = true
                  this.showResult = false
                  this.$message('未查询出结果')
                  this.timeTable = undefined
                }
              }
            }, 
            error: (error) => {
              this.$message.error('查询错误，请联系管理员')
              console.log(error)
            }
          })
        }
        let setFea = 0
        var layerDir = this.layerIdIndex
        var layerNameDir = this.layerIndex
        var queryLoading = this.$refs.queryLoading
        this.loadFun = () => {
            this.disabled = true 
            var il=this.allFea
            var quertIds = {}
            var ii = Math.min(setFea + 4, il.length)
            if(ii == 0) queryLoading.style.display = 'none'
            for(;setFea<ii;setFea++) {
              var di = il[setFea]
              if(quertIds.hasOwnProperty(di.l)) {
                quertIds[di.l].push(di.id)
              } else {
                quertIds[di.l] = [di.id]
              }
            }
            let inlength = 0
            for(let iname in quertIds) {
              inlength += 1
              $.ajax({
                url: appconfig.gisResource.business_map.config[0].url + '/' + iname + '/query',
                type: 'POST',
                data: {
                  outFields: 'OBJECTID,SID,' + fields,
                  objectIds: quertIds[iname].join(','),
                  f: 'pjson'
                },
                success: (data) => {
                  if(seed != this.timeTable) return
                  data = JSON.parse(data).features
                  var addRows = []
                  for(var i=0,ii=data.length;i<ii;i++) {
                    var att = data[i].attributes
                    var text = (att[fields] || '').toString()
                    text = text.replace(
                      new RegExp(Istr,'g'),
                      '<span class="highLight">' + Istr + "</span>"
                    )
                    addRows.push({ layer: layerNameDir[layerDir[iname]].name, id: att.SID || '', text: text, geomentry: data[i].geometry })
                  }                  
                  this.queryResult.push(...addRows)
                  inlength -= 1
                  if(inlength == 0) {
                    queryLoading.style.display = 'none'
                    // console.log(this.queryResult.length + ',' + this.allFea.length)
                    this.disabled = false 
                    if(this.$refs.scroll.offsetHeight < 380){
                      if(ilength != 0){
                        firstLoad = false
                      } else {
                        this.$nextTick(this.load)
                      }
                    }
                  }
                },
                error: (error) => {
                  this.$message.error('查询错误，请联系管理员')
                }
              })
            }
        }
      }
    },
    load() {
      if(this.loadFun) {
        if(this.queryResult.length >= this.allFea.length) {
          this.disabled = true
          this.$refs.queryNoMore.style.display = ''
        }
        else {
          this.$refs.queryNoMore.style.display = 'none'
          this.$refs.queryLoading.style.display = ''
          this.disabled = true 
          window.requestAnimationFrame(this.loadFun)
        }
      }
    },
    liClick(row) {
      var geo = row.geomentry
      var x, y
      if (geo.paths) {
        geo = geo.paths[0]
        x = (geo[0][0] + geo[1][0]) / 2
        y = (geo[0][1] + geo[1][1]) / 2
      } else if (geo.rings) {

      } else {
        x = geo.x, y = geo.y
      }
      this.showGeo.geometry = { type: 'point', x: x, y: y, spatialReference: this.mapView.spatialReference }
      this.mapView.goTo(
        { 
          center: this.showGeo.geometry,
          zoom: 6
        }
      )
    },
    textClear() {
      this.queryResult = [] 
      this.showResult = false
      this.timeTable = undefined
      this.allFea = []
      this.showGeo.geometry = { type: 'point', x: 0, y: 0, spatialReference: this.mapView.spatialReference }
    },
    viewHistroy(isLast) {
      if (isLast) {
        if (this.extentIndex == 0) return
        this.extentIndex -= 1
      } else {
        if (this.extentIndex == this.extentGourp.length - 1) return
        this.extentIndex += 1
      }
      this.mapView.goTo(
        { center: this.extentGourp[this.extentIndex].center, zoom: this.extentGourp[this.extentIndex].zoom },
        { duration: 1000 }
      )
      this.isExtentChange = false
      if (this.isExtentTime) clearTimeout(this.isExtentTime)
      this.isExtentTime = setTimeout(() => { this.isExtentChange = true }, 1200)
    }
  }
}
</script>
<style lang="scss" scoped>
#resultDiv {
  padding: 15px 10px 10px 10px;
  background: rgb(246,246,246);
  border-radius: 5px;
  box-shadow: 0px 4px 18px #938cb3;
}
#resultDiv .load {  
  background: #fff;
  color: rgb(153,153,153);
  font-size: 14px;
  padding: 4px;
  text-align: center;
}
#resultDiv .allResult {  
  text-align: right;
  color: #555;
  font-size: 13px;
}
#resultUl {
  list-style-type: none;
  margin: 0px;
  padding: 0;
  padding-right: 5px;
}

#resultUl li {
  cursor: pointer;
  margin-bottom: 6px;
  background: #fff;
  position: relative;
  padding: 13px 10px;
}
#resultUl li .icon {
  position: absolute;
  right: 12px;
  top: 50%;
  font-size: 20px;
  transform: translateY(-50%);
}
#resultUl li div .title {
  font-size: 23px;
  letter-spacing: 1px;
}
#resultUl li div .other {
  color: rgb(153,153,153);
  font-size: 13px;
}
#resultUl li div .other .text {
  color: rgb(85,85,85);
}
#resultUl li:hover {
  background: #2d74e7;
  color: #fff;
}
#resultUl li div .title >>> .highLight {
  color: #2d74e7;
}
#resultUl li:hover div .title >>> .highLight {
  color: #fff;
}
#resultUl li:hover div .other {
  color: #fff;
}
#resultUl li:hover div .other .text {
  color: #fff;
}
</style>