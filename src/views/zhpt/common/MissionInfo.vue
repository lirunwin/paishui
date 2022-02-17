<template>
  <div style="display:none">
    <el-dialog v-dialogDrag title="任务进度查看" :visible.sync="visiable" width="1100px" top="calc(50vh - 400px)" append-to-body>
      <el-steps :active="stepsActive" finish-status="success" style="background:rgb(245, 247, 250);padding:10px 0;" align-center>
        <el-step title="工单登记" :description="stepsActive > 0 ? '(已派工)' : '(未派工)'" v-loading="loading" ></el-step>
        <el-step title="工单派工" :description="stepsActive >= 1 ? (stepsActive == 1 ? '(未开始)' : '(已开始)') : ''" ></el-step>
        <el-step title="工单处理" :description="stepsActive >= 2 ? (stepsActive == 2 ? '(未完成)' : '(已完成)') : ''" ></el-step>
        <el-step title="工单审核" :description="stepsActive >= 3 ? (stepsActive == 3 ? '(未审核)' : '(已审核)') : ''" ></el-step>
      </el-steps>      
      <div ref="gundong" style="margin-top:5px;" v-loading="loading">
        <el-tabs v-model="first" type="border-card">
          <el-tab-pane label="工单登记" name="first">
            <tf-legend v-if="repairorderVo" label="工单信息" isopen="true" style="margin-top: 8px;">
              <div style="width: 100%; display: flex; flex-wrap: wrap;">
                <div class="flexDiv"><span class="flexTitle">工单编号：</span><div class="flexInfo">{{ repairorderVo['orderCode'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">工单来源：</span><div class="flexInfo">{{ repairorderVo['orderSource'] ? repairorderVo['orderSource'] + '工单' : '' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">维修类型：</span><div class="flexInfo">{{ repairorderVo['typeName'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">工单状态：</span><div class="flexInfo">{{ repairorderVo['state'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">维修数量：</span><div class="flexInfo">{{ repairorderVo['num'] || '' + (repairorderVo['unit'] || '') }}</div></div>
                <div class="flexDiv"><span class="flexTitle">完成数量：</span><div class="flexInfo">{{ repairorderVo['overNum'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">总完成率：</span><div class="flexInfo">{{ (repairorderVo['percent'] || '0') + '%' }}</div></div>
                <div class="flexDiv" style="width:100%;">
                  <span class="flexTitle" style="vertical-align: top;">详细说明：</span><div class="flexInfo">{{ repairorderVo['notes'] || '-' }}</div>
                </div>
              </div>
            </tf-legend>
            <tf-legend v-if="repairorderVo" label="派发情况" isopen="true" style="margin-top: 8px;">
              <div style="width: 100%; display: flex; flex-wrap: wrap;">
                <div class="flexDiv"><span class="flexTitle">开始时间：</span><div class="flexInfo">{{ repairorderVo['startTime'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">结束时间：</span><div class="flexInfo">{{ repairorderVo['endTime'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">是否派工：</span><div class="flexInfo">{{ repairorderVo['isDispatching'] || '-' }}</div></div>
                <!-- <div class="flexDiv"><span class="flexTitle">是否查收：</span><div class="flexInfo">{{ repairorderVo['isread'] || '-' }}</div></div> -->
                <div class="flexDiv"><span class="flexTitle">是否转发：</span><div class="flexInfo">{{ repairorderVo['isrelay'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">是否驳回：</span><div class="flexInfo">{{ repairorderVo['isrebut'] || '-' }}</div></div>
              </div>
            </tf-legend>
            <tf-legend v-if="repairorderVo" label="工单审核" isopen="true" style="margin-top: 8px;">
              <div style="width: 100%; display: flex; flex-wrap: wrap;">
                <div class="flexDiv"><span class="flexTitle">审核意见：</span><div class="flexInfo">{{ repairorderVo['auditSate'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">审核人：</span><div class="flexInfo">{{ repairorderVo['auditUserName'] || '-' }}</div></div>
                <div class="flexDiv"><span class="flexTitle">审核时间：</span><div class="flexInfo">{{ repairorderVo['auditTime'] || '-' }}</div></div>
                <div class="flexDiv" style="width:100%;">
                  <span class="flexTitle" style="vertical-align: top;">审核说明：</span><div class="flexInfo">{{ repairorderVo['auditNote'] || '-' }}</div>
                </div>
              </div>
            </tf-legend>
          </el-tab-pane>
          <el-tab-pane v-if="repairUserVoList.length" label="个人工单">
            <el-table class="mapTable" :data="repairUserVoList" border style="width: 100%;" height="230px" stripe>
              <el-table-column type="index" width="50" label="序号" />
              <el-table-column prop="respUserName" label="主负责人" show-overflow-tooltip/>
              <el-table-column label="协同处理人" show-overflow-tooltip >
                <template slot-scope="scope">{{ scope.row.teamUserName || '-' }}</template>
              </el-table-column>
              <el-table-column prop="state" label="工单状态" show-overflow-tooltip/>
              <el-table-column label="实际 / 核定用时" show-overflow-tooltip >
                <template slot-scope="scope">{{ (scope.row.realTime || '0') + ' / ' + (scope.row.ratifyTime || '0') }} H</template>
              </el-table-column>
              <el-table-column label="所在片区" show-overflow-tooltip >
                <template slot-scope="scope">{{ scope.row.regionName || '-' }}</template>
              </el-table-column>
              <el-table-column label="完成时间" show-overflow-tooltip >
                <template slot-scope="scope">{{ scope.row.overTime || '-' }}</template>
              </el-table-column>
              <el-table-column label="实际 / 计划完成" show-overflow-tooltip >
                <template slot-scope="scope">{{ (scope.row.overNum || '0') + ' / ' + (scope.row.planNum || '0') + (repairorderVo['unit'] || '') }}</template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="jump(scope.row)" :disabled="!scope.row.TF_center">跳转</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div ref="mapBox" style="margin-top: 8px;width:100%;position:relative;" />
          </el-tab-pane>
          <el-tab-pane v-if="repairRecordVoList.length" label="处理信息">
            <div style="width:calc(100% - 305px);float:left;max-height:380px;overflow: auto;">              
              <div v-for="(item, index) of repairRecordVoList" :key="index" style="padding-right:8px;" >            
                <tf-legend :label="'序号：' + (index + 1) + ' 处理人：' + '处理工单'" isopen="true">    
                  <div style="width:calc(100% - 210px);float:left;">
                    <div style="width:100%; display: flex; flex-wrap: wrap;">
                      <div class="flexDiv" style="width:50%;"><span class="flexTitle">定位网络：</span><div class="flexInfo">
                        <span>{{ [, 'GPS', '基站', 'WIFI'][item['network'] || 0] }}</span>
                        <el-button type="primary" plain size="mini" style="float: right;" @click="jump(item)">跳转</el-button>
                      </div></div>
                      <div class="flexDiv" style="width:50%;"><span class="flexTitle">口径：</span><div class="flexInfo">{{ item['bore'] || 0 }}</div></div>
                      <div class="flexDiv" style="width:50%;"><span class="flexTitle">是否有效：</span><div class="flexInfo">{{ item['flag'] || 0 }}</div></div>
                      <div class="flexDiv" style="width:50%;"><span class="flexTitle">片区名：</span><div class="flexInfo">{{ item['regionName'] || 0 }}</div></div>
                      <div class="flexDiv" style="width:100%;"><span class="flexTitle">设备编号：</span><div class="flexInfo">
                        <span>{{ item['repairDevice'] || 0 }}</span>                        
                        <el-button type="primary" plain size="mini" style="float: right;" @click="jump(item, true)">跳转</el-button>
                      </div></div>
                      <div class="flexDiv" style="width:100%;"><span class="flexTitle">详细说明：</span><div class="flexInfo">{{ item['notes'] || '-' }}</div></div>
                      <div class="flexDiv" style="width:100%;"><span class="flexTitle">地址描述：</span><div class="flexInfo">{{ item['address'] || '-' }}</div></div>
                    </div>
                  </div>
                  <div style="width:200px;height:200px;float:left;border-left: 1px solid rgb(64, 158, 255);margin-left:10px;padding-left:10px">
                    <div style="text-align: center; margin: 4px 0;"><span>耗材处理记录</span></div>
                    <div style="width:100%;overflow-y:auto;padding:8px;height:calc(100% - 28px);
                      border:1px solid rgb(232,232,232);background:rgb(248,248,248);border-radius:4px;">
                      <div v-for="(initem, index) of item['repairgoodsVoList']" :key="index"  style="width:100%;
                        padding:8px;border:1px solid rgb(64, 158, 255); border-radius:4px;">
                        <div style="text-align:center;"><span>{{initem.materialTypeName}}</span></div>
                        <div style="margin-top:8px"><span>材质：{{ initem['material'] || '-' }}</span></div>
                        <div style="margin-top:5px"><span>数量：{{ initem['num'] || '-' }}</span></div>
                        <div style="margin-top:5px"><span>口径：{{ initem['bore'] || '-' }} mm</span></div>
                      </div>
                    </div>
                  </div><div style="clear:both;"></div>
                  <el-tabs v-model="first2">
                    <el-tab-pane label="维修前附件" name="first">
                      <div style="width: 100%;overflow-x:auto;padding-top: 8px;">
                        <el-image v-for="(src, index) in oneSrcs[item.id]" :key="index"
                          style="width: 150px; height: 120px" :src="src" fit="cover" :preview-src-list="[src]"></el-image>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="维修中附件" name="second">
                      <div style="width: 100%;overflow-x:auto;padding-top: 8px;">
                        <el-image v-for="(src, index) in twoSrcs[item.id]" :key="index"
                          style="width: 150px; height: 120px" :src="src" fit="cover" :preview-src-list="[src]"></el-image>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="维修后附件" name="third">
                      <div style="width: 100%;overflow-x:auto;padding-top: 8px;">
                        <el-image v-for="(src, index) in threeSrcs[item.id]" :key="index"
                          style="width: 150px; height: 120px" :src="src" fit="cover" :preview-src-list="[src]"></el-image>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </tf-legend>
                <el-divider v-if="index != repairRecordVoList.length - 1"></el-divider>
              </div>
            </div>
            <div style="width:300px;float:left;margin-left:5px;">
              <div ref="mapBox2" style="margin-top: 8px;width:100%;position:relative;" />
            </div><div style="clear:both;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <div ref="cctvMap" style="width:100%;height:280px;display:none;border:1px solid rgb(45,116,231)" />
    <div ref="cctvMap2" style="width:100%;height:280px;display:none;border:1px solid rgb(45,116,231)" />
  </div>
</template>
<script>
import {IP} from '@/utils/request'
import request from '@/utils/request'
import { loadModules } from 'esri-loader'
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/TableLegend'
import nomalLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'missionInfo',
  components: { tfLegend, nomalLegend },
  props: { that: Object },
  data() {
    return {
      visiable: false,
      repairorderVo: {},
      repairUserVoList: [],
      repairRecordVoList: [],
      loading: false,
      oneSrcs: {},
      twoSrcs: {},
      threeSrcs: {},
      stepsActive: 0,
      first: 'first',
      first2: 'first'
    }
  },
  mounted(){
    var div = this.$refs.cctvMap
    var div2 = this.$refs.cctvMap2
    var mapV = this.mainMap = window.TF_mapView
    this.$parent.loadMissionInfo = this.showMissionInfo
    if(!mapV) return
    [div, div2].map((e, i) => {
      var view = this['mapView' + (i + 1)] = new mapV.TF_mapView({
        container: e,
        map: { basemap: mapV.map.basemap }
      })
      view.ui.components = []
      view.constraints.lods = mapV.constraints.lods
    })
  },
  methods: {
    showMissionInfo(id) {
      this.visiable = true
      this.loading = true
      this.first = this.first2 = 'first'      
      this.$nextTick(() => this.loadInfo(id))
    },
    loadInfo(id) {
      var token = this.$store.state.user.token;
      request({ url: '/gps/repairorder/getPlanRepairOrderDetail/?flag=1&id=' + id, method: 'get' }).then(res => {
        this.$nextTick(() => this.loading = false)
        if(res.code != 1) return this.$message.error(res.message)
        res = res.result
        this.repairorderVo = res.repairorderVo
        this.repairUserVoList = res.repairUserVoList || []
        if((this.repairRecordVoList = res.repairRecordVoList || []).length) {
          for(var i=0,il=res.repairRecordVoList,ii=il.length;i<ii;i++) {
            var di = il[i]
            if((di.filePathOneList || []).length) {
              this.$set(this.oneSrcs, di.id, di.filePathOneList.map(e => IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + e))
            }
            if((di.filePathTowList || []).length) {
              this.$set(this.twoSrcs, di.id, di.filePathTowList.map(e => IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + e))
            }
            if((di.filePathThreeList || []).length) {
              this.$set(this.threeSrcs, di.id, di.filePathThreeList.map(e => IP + '/base/file/loadImg?access_token=' + token + '&remotePath=' + e))
            }
          }
        }
        this.loadSteps()
        this.$nextTick(this.loadMap)
      })
    },
    loadSteps() {
      var info = this.repairorderVo
      this.stepsActive = 0
      if(info.isDispatching == '未派工') return
      if(info.isread == '未查看' && info.overNum == null) return this.stepsActive = 1
      if(info.percent != 100) return this.stepsActive = 2
      if(info.state == '未审核') return this.stepsActive = 3
      this.stepsActive = 4
    },
    loadMap() {
      var mapV = this.mainMap
      var Graphic = mapV.TF_graphic
      var div = this.$refs.cctvMap
      var div2 = this.$refs.cctvMap2
      if(this.repairUserVoList.length) {
        var view1 = this.mapView1
        this.$refs.mapBox.appendChild(div)
        div.style.display = ''
        var list = this.repairUserVoList
        view1.graphics.removeAll()
        var sp = view1.spatialReference
        var feas = []
        var [mx, my] = [0, 0]
        var num = 0
        for(var i=0,ii=list.length;i<ii;i++) {
          var di = JSON.parse(list[i].lngLats) || []
          var [x, y] = [0, 0]
          for(var j=0,jj=di.length;j<jj;j++,num++) {
            var dj = di[j]
            mx += dj[0], my += dj[1], x += dj[0], y += dj[1]
            var geo = new Graphic({
              geometry: { type: 'point', x: dj[0], y: dj[1], spatialReference: sp },
              symbol: {
                path: 'M911.609756 399.609756c0 220.659512-399.609756 624.390244-399.609756 624.390244S112.390244 620.269268 112.390244 399.609756a399.609756 399.609756 0 0 1 799.219512 0z',
                color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
                size: '30px', yoffset: '15px', type: 'simple-marker'
              }
            })
            feas.push(geo, new Graphic({ geometry: geo.geometry, symbol: { type: 'text', color: 'white', font: { size: '14px', weight: 'bold' }, text:  i + 1, yoffset: '15px', verticalAlignment: 'bottom' }}))
          }
          if(jj > 0) {
            x /= jj, y /= jj
            list[i].TF_center = new Graphic({ geometry: { type: 'point', x: x, y: y, spatialReference: sp } })
          }
        }
        view1.graphics.addMany(feas)
        if(num > 0) {          
          mx /= num, my /= num
          view1.goTo({
            target: new Graphic({ geometry: { type: 'point', x: mx, y: my, spatialReference: sp }}),
            zoom: 0,
          }, { duration: 400 })
        } else div.style.display = 'none'
      } else div.style.display = 'none'
      if(this.repairRecordVoList.length) {        
        var view2 = this.mapView2
        this.$refs.mapBox2.appendChild(div2)
        div2.style.display = ''
        var list = this.repairRecordVoList
        view2.graphics.removeAll()
        var sp = view2.spatialReference
        var feas = []
        var [mx, my] = [0, 0]
        var num = 0
        var pipe = []
        for(var i=0,ii=list.length;i<ii;i++, num++) {     
          var di = list[i]     
          mx += di.lgtd, my += di.lttd
          var geo = new Graphic({
            geometry: { type: 'point', x: di.lgtd, y: di.lttd, spatialReference: sp },
            symbol: {
              path: 'M911.609756 399.609756c0 220.659512-399.609756 624.390244-399.609756 624.390244S112.390244 620.269268 112.390244 399.609756a399.609756 399.609756 0 0 1 799.219512 0z',
              color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
              size: '30px', yoffset: '15px', type: 'simple-marker'
            }
          })
          di.TF_person = geo
          feas.push(geo, new Graphic({ geometry: geo.geometry, symbol: { type: 'text', color: 'white', font: { size: '14px', weight: 'bold' }, text:  i + 1, yoffset: '15px', verticalAlignment: 'bottom' }}))
          pipe.push([i, di.repairLayer, di.repairDevice])
        }
        view2.graphics.addMany(feas)
        if(num > 0) {          
          mx /= num, my /= num
          view2.goTo({
            target: new Graphic({ geometry: { type: 'point', x: mx, y: my, spatialReference: sp }}),
            zoom: 0,
          }, { duration: 400 })
          this.$nextTick(_ => this.addPipe(pipe))
        }
      } else div2.style.display = 'none'
    },
    jump(row, bool) {
      if(row.TF_center) return this.mapView1.goTo({ target: row.TF_center, zoom: Math.max(this.mapView1.zoom, 4), }, { duration: 400 })
      if(row.TF_geometry && bool) return this.mapView2.goTo({ target: row.TF_geometry, }, { duration: 400 })
      if(row.TF_person) return this.mapView2.goTo({ target: row.TF_person, zoom: Math.max(this.mapView2.zoom, 4), }, { duration: 400 })
    },
    addPipe(pipe) {
      var mapV = this.mainMap
      var Graphic = mapV.TF_graphic     
      var view2 = this.mapView2
      var sp = view2.spatialReference
      let seed = new Date().getTime()
      this.seed = seed
      var list = this.repairRecordVoList
      var layer = {}
      for(var i=0,ii=pipe.length;i<ii;i++) {
        var dp = pipe[i]
        if(layer.hasOwnProperty(dp[1])) layer[dp[1]].push({ sid: dp[2], index: dp[0] })
        else layer[dp[1]] = [{ sid: dp[2], index: dp[0] }]
      }
      for(let i in layer) {
        let pipes = {}
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + '/' + i + '/query',
          type: 'POST',
          data: {
            where: layer[i].map(e => { pipes[e.sid] = e.index; return "SID = '" + e.sid +  "' " }).join(' or '),
            outFields: 'SID',
            f: 'pjson'
          },
          success: (data) => {
            if(seed != this.seed) return
            data = JSON.parse(data).features
            var feas = []
            for(var i=0,ii=data.length;i<ii;i++) {
              var di = data[i]
              var geo = di.geometry
              var symbol = geo.x ? 
                { type: 'simple-marker', color: [200, 200, 200], size: 12, outline: { color: [0, 255, 255], width: 2 }} : 
                { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255, 1], width: "7px" } }
              if(geo.x) geo.type = 'point'
              else if(geo.paths) geo.type = 'polyline'
              else geo.type = 'polygon'
              geo.spatialReference = view2.spatialReference
              feas.push(list[pipes[di.attributes.SID]].TF_geometry = new Graphic({
                geometry: di.geometry,
                symbol: symbol
              }))
            }
            view2.graphics.addMany(feas)
          }
        })
      }
    }
  },
  destroyed() {
  }
}
</script>
<style lang='scss' scoped>
.flexDiv{
  width: 33%;
  min-height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexTitle{
  vertical-align: top;
  min-width: 90px;
  display: inline-block;
  text-align: right;
}
.flexInfo{
  display: inline-block;
  width: calc(100% - 90px);
}
</style>

