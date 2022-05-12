<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2" style="margin-left:8px;">审核状态</span>
      <el-select v-model="chooseCheckStatus" style="display: inline-block; margin-left: 5px; width:130px;" size="small" placeholder="请选择审核意见">
        <el-option label="未审核" value="0" />
        <el-option label="已审核" value="1" />
      </el-select>
      <span class="title2" style="margin-left:8px;">维修类型</span>
      <el-select v-model="chooseFixType" style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请选择维修类型">
        <el-option v-for="item in fixTyps" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">处理人</span>
      <el-select v-model="chooseWorker" style="display: inline-block; margin-left: 5px; width:130px;" size="small" placeholder="请选择处理人">
        <el-option v-for="item in workers" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
      <span class="title2" style="margin-left:8px;">审核时间</span>
      <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker
          v-model="workTime"
          type="daterange"
          size="small"
          style="width: 100%;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </div>
      <span class="title2" style="margin-left:8px;">处理时间</span>
      <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker
          v-model="checkTime"
          type="daterange"
          size="small"
          style="width: 100%;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </div>
      <el-button size="small" type="primary" @click="missionCheckQuery()">查询</el-button>
      <el-button size="small" type="primary" @click="checkMission">审核</el-button>
    </el-row>
    <el-table ref="table1" class="mapTable" :data="dataT1" border style="width: 100%;margin-top: 8px;" height="calc(100% - 80px)" stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="missionId" label="工单编号" />
      <el-table-column prop="missionFrom" label="工单来源" show-overflow-tooltip>
        <template slot-scope="props">{{ ['计划工单', '日常工单', '热线工单'][props.row.missionFrom] }}</template>
      </el-table-column>
      <el-table-column prop="fixType" label="维修类型" show-overflow-tooltip>
        <template slot-scope="props">{{ fixTypsIndex[props.row.fixType] }}</template>
      </el-table-column>
      <el-table-column prop="worker" label="处理人">
        <template slot-scope="props">{{ workersIndex[props.row.worker] }}</template>
      </el-table-column>
      <el-table-column prop="workerTime" label="处理时间" show-overflow-tooltip />
      <el-table-column prop="cheakStatus" label="审核状态">
        <template slot-scope="props">{{ ['已审核', '未审核'][props.row.cheakStatus] }}</template>
      </el-table-column>
      <el-table-column prop="cheakTime" label="审核时间" show-overflow-tooltip />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showYearInfo(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-dialogDrag :title="digTitle" :visible.sync="diaVisiable1" width="976px" top="calc(50vh - 400px)">
      <div style="height: 700px; overflow: auto;padding-right: 8px;">
        <tf-legend label="工单登记" isopen="true" style="margin-top: 8px;">
          <div style="width: 100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv"><span class="flexTitle">工单编号：</span><div class="flexInfo">GW202101230001</div></div>
            <div class="flexDiv"><span class="flexTitle">工单来源：</span><div class="flexInfo">计划工单</div></div>
            <div class="flexDiv"><span class="flexTitle">故障类型：</span><div class="flexInfo">爆管</div></div>
            <div class="flexDiv"><span class="flexTitle">电话号码：</span><div class="flexInfo">12345679123</div></div>
            <div class="flexDiv"><span class="flexTitle">维修类型：</span><div class="flexInfo">管网设备维护</div></div>
            <div class="flexDiv"><span class="flexTitle">月份：</span><div class="flexInfo">2020-01</div></div>
            <div class="flexDiv"><span class="flexTitle">开始时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">结束时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">数量：</span><div class="flexInfo">3</div></div>
            <div class="flexDiv"><span class="flexTitle">是否确认：</span><div class="flexInfo">是</div></div>
            <div class="flexDiv"><span class="flexTitle">确认时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">地理位置：</span><div class="flexInfo" style="width: auto">X:102.2,Y:30.3</div>
              <el-button style="float: right; height: 30px; border-radius: 0px 4px 4px 0px;" type="primary" icon="el-icon-location" size="small" plain />
            </div>
            <div class="flexDiv" style="width: 100%;">
              <span class="flexTitle">地址：</span><div class="flexInfo">备注备备注备注注备注备注</div>
            </div>
            <div class="flexDiv" style="width: 100%;">
              <span class="flexTitle">详细说明：</span><div class="flexInfo">详细说明详细说明详细说明详细说明详细说明</div>
            </div>
          </div>
        </tf-legend>
        <tf-legend label="工单派发" isopen="true" style="margin-top: 8px;">
          <div style="width: 100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv"><span class="flexTitle">派工人：</span><div class="flexInfo">张一修</div></div>
            <div class="flexDiv"><span class="flexTitle">派工时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">是否确认：</span><div class="flexInfo">是</div></div>
            <div class="flexDiv"><span class="flexTitle">确认时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
          </div>
        </tf-legend>
        <tf-legend label="工单处理（处理记录）" isopen="true" style="margin-top: 8px;">
          <div style="width: 100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv"><span class="flexTitle">处理人：</span><div class="flexInfo">张处理</div></div>
            <div class="flexDiv"><span class="flexTitle">处理时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">处理用时：</span><div class="flexInfo">5.2小时</div></div>
            <div class="flexDiv" style="width: 100%;">
              <span class="flexTitle">处理说明：</span><div class="flexInfo">详细说明详细说明详细说明详细说明详细说明</div>
            </div>
            <div class="flexDiv"><span class="flexTitle">所属片区：</span><div class="flexInfo">5.2小时</div></div>
            <div class="flexDiv" style="width: 66%;">
              <span class="flexTitle">实际地址：</span><div class="flexInfo">实际地址实际地址实际地址实际地址实际地址实际地址</div>
            </div>
            <div class="flexDiv"><span class="flexTitle">地址位置：</span><div class="flexInfo" style="width: auto">X:102.2,Y:30.3</div>
              <el-button style="float: right; height: 30px; border-radius: 0px 4px 4px 0px;" type="primary" icon="el-icon-location" size="small" plain /></div>
            <div class="flexDiv"><span class="flexTitle">维修设备地理位置：</span><div class="flexInfo" style="width: auto">X:102.2,Y:30.3</div>
              <el-button style="float: right; height: 30px; border-radius: 0px 4px 4px 0px;" type="primary" icon="el-icon-location" size="small" plain /></div>
            <div class="flexDiv"><span class="flexTitle">人员轨迹：</span><el-button class="flexInfo" type="primary" size="mini">查看</el-button></div>
          </div>
          <div ref="mapBox" style="height: 310px; width:100%; margin-top: 8px; padding:0px 10px;" />
          <div style="width: 100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv"><span class="flexTitle">用材：</span><div class="flexInfo">铁</div></div>
            <div class="flexDiv"><span class="flexTitle">是否确认：</span><div class="flexInfo">否</div></div>
            <div class="flexDiv"><span class="flexTitle">确认时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
            <div class="flexDiv"><span class="flexTitle">是否返工：</span><div class="flexInfo">否</div></div>
            <div class="flexDiv"><span class="flexTitle">是否超时：</span><div class="flexInfo">否</div></div>
            <div class="flexDiv"><span class="flexTitle">返工次数：</span><div class="flexInfo">0</div></div>
            <div class="flexDiv" style="width: 100%;"><span class="flexTitle">维修前附件：</span></div>
            <div style="width: 95%; margin-left: 2.5%; overflow: auto hidden; height:200px; margin-top: 8px; white-space: nowrap;">
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[0]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[2]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[1]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[3]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[2]" :preview-src-list="srcList" /></div>
            </div>
            <div class="flexDiv" style="width: 100%;"><span class="flexTitle">维修中附件：</span></div>
            <div style="width: 95%; margin-left: 2.5%; overflow: auto hidden; height:200px; margin-top: 8px; white-space: nowrap;">
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[1]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[0]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[2]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[1]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[3]" :preview-src-list="srcList" /></div>
            </div>
            <div class="flexDiv" style="width: 100%;"><span class="flexTitle">维修后附件：</span></div>
            <div style="width: 95%; margin-left: 2.5%; overflow: auto hidden; height:200px; margin-top: 8px; white-space: nowrap;">
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[1]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[3]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[0]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[2]" :preview-src-list="srcList" /></div>
              <div class="flexImgBox"><el-image style="width:100%; height:100%;" :src="srcList[1]" :preview-src-list="srcList" /></div>
            </div>
          </div>
        </tf-legend>
        <tf-legend label="工单审核" isopen="true" style="margin-top: 8px;">
          <div ref="yearPlanInfo" style="width:100%;">
            <div>
              <div style="margin-top: 6px;">
                <span style="width:60px; display: inline-block;">审核意见</span>
                <el-select v-model="checkSugForMain" style="display: inline-block; margin-left: 5px; width:calc(100% - 70px);" size="small" placeholder="请选择审核意见">
                  <el-option label="同意" value="1" />
                  <el-option label="不同意" value="0" />
                </el-select>
              </div>
              <div style="margin-top: 6px;">
                <span style="width:60px;display:inline-block; vertical-align: top;">审核说明</span>
                <div style="display: inline-block; margin-left: 5px; width:calc(100% - 70px);">
                  <el-input v-model="checkTagForMain" placeholder="请输入审核说明" size="small" type="textarea" :rows="4" />
                </div>
              </div>
            </div>
            <div style="width: 100%; display: flex; flex-wrap: wrap;">
              <div class="flexDiv" style="width: 66%;"><span class="flexTitle">审核状态：</span><div class="flexInfo">已审核</div></div>
              <div class="flexDiv"><span class="flexTitle">核定用时：</span><div class="flexInfo">20小时</div></div>
              <div class="flexDiv" style="width: 66%;"><span class="flexTitle">审核说明：</span><div class="flexInfo">审核说明审核说明审核说明审核说明审核说明审核说明</div></div>
              <div class="flexDiv"><span class="flexTitle">审核时间：</span><div class="flexInfo">2019-12-22 18:00:00</div></div>
              <div class="flexDiv" style="width: 66%;"><span class="flexTitle">审核意见：</span><div class="flexInfo">同意</div></div>
              <div class="flexDiv"><span class="flexTitle" style="vertical-align: top;">审核人：</span><div class="flexInfo"><img src="./images/checkMan.png"></div></div>
            </div>
          </div>
        </tf-legend>
      </div>
      <span slot="footer" ref="planFooter" class="dialog-footer">
        <el-button size="small" @click="confirmCheckMissionCheck()">确定</el-button>
        <el-button size="small" @click="diaVisiable1 = false">取消</el-button>
      </span>
    </el-dialog>
    <div ref="cctvMap" style="width:100%;height:100%;display:none;" />
  </div>
</template>

<script>
import img1 from './images/V1.jpg'
import img2 from './images/V2.jpg'
import img3 from './images/V3.jpg'
import img4 from './images/V4.jpg'
import tfLegend from '@/views/zhpt/common/TableLegend'
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import { queryMissionCheck, checkMissionCheck } from '@/api/wxDailyManageApi'
export default {
  name: 'WxCheck',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      digTitle: '',
      workTime: '',
      checkTime: '',
      diaVisiable1: false,
      chooseWorker: '',
      chooseFixType: '',
      chooseCheckStatus: '',
      checkSugForMain: '',
      checkTagForMain: '',
      srcList: [img1, img2, img3, img4],
      fixTyps: [
        { id: 0, value: '管网设备维护', unit: '套' },
        { id: 1, value: '井体维护', unit: '个' },
        { id: 2, value: '表位整改', unit: '个' },
        { id: 3, value: '表箱更换', unit: '个' },
        { id: 4, value: '机具设备维护保养', unit: '套' },
        { id: 5, value: '办公设备设施维护', unit: '套' }
      ],
      fixTypsIndex: { '-1': { value: '/', unit: '/' }},
      workers: [{ id: 0, value: '张四修' }, { id: 1, value: '张一修' }, { id: 2, value: '张三修' }, { id: 3, value: '张二修' }, { id: 4, value: '张五修' }],
      workersIndex: { '-1': '/' },
      dataT1: [
        { missionId: 'GW202101230001', missionFrom: 0, fixType: 2, worker: 1, workerTime: '2021-12-20 18:00:00', cheakStatus: 0, cheakTime: '2021-12-20 18:00:00' },
        { missionId: 'GW202101230002', missionFrom: 1, fixType: 3, worker: 2, workerTime: '2021-12-20 18:00:00', cheakStatus: 1, cheakTime: '2021-12-20 18:00:00' }
      ]
    }
  },
  mounted: function() {
    for (let i = 0, il = this.fixTyps, ii = il.length; i < ii; i++) {
      this.fixTypsIndex[il[i].id] = il[i].value
    }
    for (let i = 0, il = this.workers, ii = il.length; i < ii; i++) {
      this.workersIndex[il[i].id] = il[i].value
    }

    var that = this
    var div = this.$refs.cctvMap
    var mapV = this.data.mapView
    var map = mapV.map

    loadModules(['esri/views/MapView', 'esri/Graphic', 'esri/layers/GraphicsLayer'], { url: esriConfig.baseUrl }).then(([MapView, Graphic, GraphicsLayer]) => {
      const mapview = new MapView({
        container: div,
        map: map
      })
      that.mapV = mapview
      mapview.ui.components = []
      mapview.constraints.lods = mapV.constraints.lods
      that.point = new Graphic({
        geometry: mapV.center,
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          path: 'M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z',
          color: '2D74E7',
          outline: { color: '#2D74E7', width: '1px' },
          size: '30px',
          yoffset: '15px',
          xoffset: '0px'
        }
      })
      mapview.map.layers.items[2].add(this.point)
    })
  },
  created() {},
  methods: {
    showYearInfo: function() {
      this.diaVisiable1 = true
      this.digTitle = '详细'
      this.$nextTick(() => {
        this.loadMap()
        var info = this.$refs.yearPlanInfo
        info.children[0].style.display = 'none'
        info.children[1].style.display = ''
        info.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].style.display = 'none'
      })
    },
    checkMission: function() {
      this.diaVisiable1 = true
      this.digTitle = '审核'
      this.$nextTick(() => {
        this.loadMap()
        var info = this.$refs.yearPlanInfo
        info.children[0].style.display = ''
        info.children[1].style.display = 'none'
        info.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].style.display = ''
      })
    },
    loadMap: function() {
      this.$refs.mapBox.appendChild(this.$refs.cctvMap)
      this.$refs.cctvMap.style.display = ''
      this.mapV.extent = this.data.mapView.extent
    },
    // 主页面查询接口，点击渲染表单数据
    missionCheckQuery() {
      queryMissionCheck().then(res => {
        console.log(res)
      })
    },
    // 确认审核，调用审核接口
    confirmCheckMissionCheck() {
      checkMissionCheck().then(res => {
        console.log(res)
      })
      this.diaVisiable1 = false
    }
  }
}
</script>
<style scoped>
.flexDiv{
    width: 33%;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
}
.flexTitle{
    min-width: 90px;
    display: inline-block;
    text-align: right;
}
.flexInfo{
    display: inline-block;
    width: calc(100% - 90px);
}
.flexImgBox{
    width: 33%;
    height: 100%;
    padding: 0px 3px;
    display: inline-block;
}
.el-table >>> .el-table__header-wrapper table th{
  /* height: 60px; */
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
