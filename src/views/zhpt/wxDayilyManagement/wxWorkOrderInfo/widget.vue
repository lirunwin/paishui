<template>

  <div style="width:100%" class="wxWorkOrderInfoPage">
    <el-button v-if="auditAction&&exportBtn" type="primary" size="small" style="position: relative;float: right;margin-bottom: 10px;"><a :href="doUrl" download="导出文件">导出</a>	</el-button>
    <el-steps :active="node" finish-status="success" process-status="finish" style="width:100%;background:rgb(245, 247, 250);padding:10px 0;" align-center>
      <el-step title="工单登记" />
      <el-step title="维修处理" />
      <el-step title="维修审核" />
      <el-step title="归档" />
      <span v-if="propData&&propData.state&&propData.state=='超时'" style=" color: red;font-size: 20px;padding: 10px;">超时</span>
    </el-steps>
    <table class="tableDiv" cellspacing="0" :style="!auditAction?'margin-bottom: 20px;':''">
      <!-- 这里的工单编号使用的是抢维修工单的工单编号 -->
      <tr v-if="hotlineInfoVo"><td colspan="8">工单编号：{{ hotlineInfoVo?(hotlineInfoVo.gdbh):"-" }}</td></tr>
      <!-- 热线信息 -->
      <template v-if="hotlineInfoVo">
        <tr><td colspan="8" style="background: rgb(197,218,252);">工单内容</td></tr>
        <tr><td rowspan="3" class="tdTtitle">客户信息</td><td class="tdTtitle">客户编号</td><td>{{ hotlineInfoVo.khbh | emptyRe }}</td><td class="tdTtitle">客户姓名</td><td colspan="2">{{ hotlineInfoVo.kuxm | emptyRe }}</td><td class="tdTtitle">联系电话</td><td>{{ hotlineInfoVo.lxdh | emptyRe }}</td></tr>
        <tr><td class="tdTtitle">用水性质</td><td>{{ hotlineInfoVo.ysxzMc | emptyRe }}</td><td class="tdTtitle">水表表号</td><td colspan="2">{{ hotlineInfoVo.sbbh | emptyRe }}</td><td class="tdTtitle">口径</td><td>{{ hotlineInfoVo.sbkj | emptyRe }}</td></tr>
        <tr><td class="tdTtitle">地址</td><td colspan="4">{{ hotlineInfoVo.khdz | emptyRe }}</td><td class="tdTtitle">实际电话</td><td>{{ hotlineInfoVo.sjdh|emptyRe }}</td></tr>
        <tr><td class="tdTtitle">工单类型</td><td colspan="2">{{ hotlineInfoVo.typeName | emptyRe }}</td><td class="tdTtitle">工单细分</td><td colspan="2">{{ hotlineInfoVo.typeXFName | emptyRe }}</td><td class="tdTtitle">优先级别</td><td>{{ hotlineInfoVo.jjcdName | emptyRe }}</td></tr>
        <tr><td class="tdTtitle">工单说明</td><td colspan="7">{{ hotlineInfoVo.gdms | emptyRe }}</td></tr>
        <!-- 工单附件内容 -->
        <tr v-if="(hotlineInfoVo.fileGList.isImg&&hotlineInfoVo.fileGList.isImg.length>0)||(hotlineInfoVo.fileGList.isVoice&&hotlineInfoVo.fileGList.isVoice.length>0)||(hotlineInfoVo.fileGList.otherFile&&hotlineInfoVo.fileGList.otherFile.length>0)">
          <td colspan="8">
            <!-- 渲染图片 -->
            <div v-if="hotlineInfoVo.fileGList.isImg&&hotlineInfoVo.fileGList.isImg.length>0" class="picDiv">
              <template v-for="(item,index) in hotlineInfoVo.fileGList.isImg">
                <el-image
                  :key="index+'_img'"
                  style="width: 100px; height: 100px;padding:5px;position: relative;float: left;"
                  :src="item"
                  :preview-src-list="hotlineInfoVo.fileGList.isImg"
                />
              </template>
            </div>
            <!-- 熏染语音 -->
            <div v-if="hotlineInfoVo.fileGList.isVoice&&hotlineInfoVo.fileGList.isVoice.length>0" class="voiceDiv">
              <template v-for="(item,index) in hotlineInfoVo.fileGList.isVoice">
                <audio :key="index+'_audio'" controls="controls" style="width: 100px; height: 40px;position: relative;float: left;">
                  <source :src="item" type="audio/mp3">
                  <source :src="item" type="audio/ogg">
                  <embed style="width: 100px; height: 40px;padding:5px;position: relative;float: left;" :src="item">
                </audio>
              </template>
            </div>
            <!-- 熏染文件 -->
            <div v-if="hotlineInfoVo.fileGList.otherFile&&hotlineInfoVo.fileGList.otherFile.length>0" class="FileDiv">
              <template v-for="(item,index) in hotlineInfoVo.fileGList.otherFile">
                <span :key="index+'_file'" style="position: relative;padding:5px;float: left; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                  <a style="width:100%;height:100%" :href="item">{{ '文件'+(index+1) }}</a>
                </span>
              </template>
            </div>
          </td>
        </tr>
        <tr><td class="tdTtitle">登记部门</td><td>{{ hotlineInfoVo.djbmName | emptyRe }}</td><td class="tdTtitle">登记职员</td><td>{{ hotlineInfoVo.djryName | emptyRe }}</td><td class="tdTtitle">登记时间</td><td>{{ hotlineInfoVo.djsj | emptyRe }}</td><td colspan="2">{{ hotlineInfoVo.lcjdName | emptyRe }}</td></tr>
      </template>
      <!-- 工单信息 -->
      <template v-if="baseInfoVo">
        <tr><td colspan="8" style="background: rgb(197,218,252);">维修/保养内容</td></tr>
        <tr><td class="tdTtitle">维修工单编号</td><td>{{ baseInfoVo.orderCode | emptyRe }}</td><td class="tdTtitle">维修/保养类型</td><td>{{ baseInfoVo.typeName | emptyRe }}</td><td class="tdTtitle">数量</td><td colspan="3">{{ baseInfoVo.num }}<span style="position: relative;float: right;" title="点击可在地图上查看位置" @click="lookInMap(baseInfoVo,'allPoint')"><i class="el-icon-map-location" /></span></td></tr>
        <tr><td class="tdTtitle">地址</td><td colspan="7"><template v-if="(baseInfoVo.addressList&&baseInfoVo.addressList.length>0)">
          <span v-for="(item,index) in baseInfoVo.addressList" :key="index">{{ item+"；" }} <br></span>
        </template><template v-else>-</template></td></tr>
        <tr><td class="tdTtitle">备注</td><td colspan="7">{{ baseInfoVo.notes | emptyRe }}</td></tr>
        <tr><td class="tdTtitle">派单职员</td><td>{{ baseInfoVo.dispatchingIdName | emptyRe }}</td><td class="tdTtitle">派单时间</td><td>{{ baseInfoVo.createTime | emptyRe }}</td><td class="tdTtitle">完成情况 </td><td colspan="3">{{ '完成数量：'+baseInfoVo.overNum+',完成情况：'+baseInfoVo.percent }}</td></tr>
        <tr><td class="tdTtitle">计划开始时间</td><td>{{ baseInfoVo.startTime | emptyRe }}</td><td class="tdTtitle">计划结束时间</td><td colspan="2">{{ baseInfoVo.endTime | emptyRe }}</td><td colspan="3">{{ baseInfoVo.stateName | emptyRe }}</td></tr>
      </template>
      <!-- 处理维修/保养情况-->
      <template v-if="(recordInfoVoList&&recordInfoVoList.length>0)||(pipeMfRecordList&&pipeMfRecordList.length>0)">
        <tr><td colspan="8" style="background: rgb(197,218,252);">处理维修/保养情况</td></tr>
        <!-- 热线驳回信息 -->
        <template v-if="repairRejectList&&repairRejectList.length>0">
          <template v-for="(item,index) in repairRejectList">
            <tr :key="index+'_0'"><td class="tdTtitle">处理职员</td><td>{{ item.rejectUserIdName | emptyRe }}</td><td class="tdTtitle">处理时间</td><td colspan="5">{{ item.rejectTime | emptyRe }}</td></tr>
            <tr :key="index+'_1'"><td class="tdTtitle">处理说明</td><td colspan="7">{{ item.rejectNote | emptyRe }}</td></tr>
          </template>
        </template>
        <!-- 处理维修情况  -->
        <template v-if="recordInfoVoList&&recordInfoVoList.length>0">
          <template v-for="(item,index) in recordInfoVoList">
            <template v-if="item.showHisTitle"><tr :key="index+'_2'"><td style="background:#FFD700" colspan="8">历史处理信息</td></tr></template>
            <template v-if="item.showNowTitle"><tr :key="index+'_3'"><td style="background:#00CED1" colspan="8">最终处理信息</td></tr></template>
            <tr :key="index+'_4'"><td class="tdTtitle">处理职员</td><td>{{ item.respUserName | emptyRe }}</td><td class="tdTtitle">处理时间</td><td>{{ item.createTime| emptyRe }}</td><td class="tdTtitle">协同处理职员</td><td colspan="3">{{ item.teamUserName| emptyRe }}</td></tr>
            <!-- <tr v-if="item.flagName"><td class="tdTtitle">处理说明</td><td colspan="7">{{}}</td></tr> -->
            <tr :key="index+'_5'"><td class="tdTtitle">片区名称</td><td colspan="3">{{ item.regionName | emptyRe }}</td><td class="tdTtitle">维修设施</td><td colspan="3">{{ item.repairDevice | emptyRe }}<span style="position: relative;float: right;" title="点击可在地图上查看位置" @click="lookInMap(item,'searchGis')"><i class="el-icon-map-location" /></span></td></tr>
            <!-- <tr><td class="tdTtitle">产品名称</td><td>{{}}</td> -->
            <tr :key="index+'_6'"><td class="tdTtitle">地址</td><td colspan="7">{{ item.address | emptyRe }}</td></tr>
            <tr :key="index+'_7'"><td class="tdTtitle">处理说明</td><td colspan="7">{{ item.notes | emptyRe }}</td></tr>
            <template v-if="(item.goodsList&&item.goodsList.length>0)">
              <tr :key="index+'_8'"><td class="tdTtitle">序号</td><td class="tdTtitle" colspan="3">产品名称</td><td class="tdTtitle" colspan="2">规格型号</td><td class="tdTtitle">数量</td><td class="tdTtitle">单位</td></tr>
              <template v-for="(item2,index2) in item.goodsList">
                <tr :key="index+'_'+index2+'_9'"><td class="tdTtitle">{{ index2+1 }}</td><td class="tdTtitle" colspan="3">{{ item2.materialTypeName| emptyRe }}</td><td class="tdTtitle" colspan="2">{{ item2.specification| emptyRe }}</td><td class="tdTtitle">{{ item2.num | emptyRe }}</td><td class="tdTtitle">{{ item2.unit| emptyRe }}</td></tr>
              </template>
            </template>
            <tr :key="index+'_10'">
              <td class="tdTtitle">保养前</td>
              <td colspan="7">
                <template v-if="item.oneImgList&&item.oneImgList.length>0">
                  <template v-for="(item2,index2) in item.oneImgList">
                    <el-image
                      :key="index2+'_img1'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.oneImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
            <tr :key="index+'_11'">
              <td class="tdTtitle">保养中</td>
              <td colspan="7">
                <template v-if="item.twoImgList&&item.twoImgList.length>0">
                  <template v-for="(item2,index2) in item.twoImgList">
                    <el-image
                      :key="index2+'_img12'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.twoImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
            <tr :key="index+'_13'">
              <td class="tdTtitle">保养后</td>
              <td colspan="7">
                <template v-if="item.threeImgList&&item.threeImgList.length>0">
                  <template v-for="(item2,index2) in item.threeImgList">
                    <el-image
                      :key="index2+'_img14'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.threeImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
          </template>
        </template>
        <!-- 处理养护情况  -->
        <template v-if="pipeMfRecordList&&pipeMfRecordList.length>0">
          <template v-for="(item,index) in pipeMfRecordList">
            <tr :key="index+'_15'"><td class="tdTtitle">处理职员</td><td>{{ item.createUserName | emptyRe }}</td><td class="tdTtitle">处理时间</td><td colspan="5">{{ item.createTime | emptyRe }}</td></tr>
            <tr :key="index+'_16'"><td class="tdTtitle">设施编号</td><td colspan="3">{{ item.code | emptyRe }}<span style="position: relative;float: right;" title="点击可在地图上查看位置" @click="lookInMap(item,'searchGis')"><i class="el-icon-map-location" /></span></td><td class="tdTtitle">设施类型</td><td colspan="3">{{ item.facilitiesType | emptyRe }}</td></tr>
            <tr :key="index+'_17'"><td class="tdTtitle">设施口径</td><td colspan="3">{{ item.facilitiesCaliber | emptyRe }}</td><td class="tdTtitle">维修时间</td><td colspan="3">{{ item.maintainTime | emptyRe }}</td></tr>
            <tr :key="index+'_18'"><td class="tdTtitle">维修设施地址</td><td colspan="7">{{ item.valveLocation | emptyRe }}</td></tr>
            <!-- 养护内容 -->
            <template v-if="item.contentInfo.data&&item.contentInfo.data.length>0">
              <template v-for="(item2,index2) in item.contentInfo.data">
                <tr v-if="index2==0" :key="index2+'_19'">
                  <td :rowspan="item.contentInfo.data.length" class="tdTtitle">{{ item.contentInfo.title | emptyRe }}</td>
                  <td colspan="5">{{ item2.ccode +" "+ item2.pcname }}</td>
                  <td colspan="2">{{ item2.currentValue | emptyRe }}</td>
                </tr>
                <tr v-else :key="index2+'_20'">
                  <td colspan="5">{{ item2.ccode +" "+ item2.pcname }}</td>
                  <td colspan="2">{{ item2.currentValue | emptyRe }}</td>
                </tr>
              </template>
            </template>
            <!-- 评价内容 -->
            <template v-if="item.evaluate.data&&item.evaluate.data.length>0">
              <template v-for="(item2,index2) in item.evaluate.data">
                <tr v-if="index2==0" :key="index2+'_21'">
                  <td :rowspan="item.evaluate.data.length" class="tdTtitle">{{ item.evaluate.title | emptyRe }}</td>
                  <td colspan="5">{{ item2.ccode +" "+ item2.pcname }}</td>
                  <td colspan="2">{{ item2.currentValue | emptyRe }}</td>
                </tr>
                <tr v-else :key="index2+'_22'">
                  <td colspan="5">{{ item2.ccode +" "+ item2.pcname }}</td>
                  <td colspan="2">{{ item2.currentValue | emptyRe }}</td>
                </tr>
              </template>
            </template>
            <tr :key="index+'_23'">
              <td class="tdTtitle">保养前</td>
              <td colspan="7">
                <template v-if="item.oneImgList&&item.oneImgList.length>0">
                  <template v-for="(item2,index2) in item.oneImgList">
                    <el-image
                      :key="index2+'_img24'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.oneImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
            <tr :key="index+'_25'">
              <td class="tdTtitle">保养中</td>
              <td colspan="7">
                <template v-if="item.twoImgList&&item.twoImgList.length>0">
                  <template v-for="(item2,index2) in item.twoImgList">
                    <el-image
                      :key="index2+'_img26'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.twoImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
            <tr :key="index+'_27'">
              <td class="tdTtitle">保养后</td>
              <td colspan="7">
                <template v-if="item.threeImgList&&item.threeImgList.length>0">
                  <template v-for="(item2,index2) in item.threeImgList">
                    <el-image
                      :key="index2+'_img28'"
                      style="width: 100px; height: 100px;padding:5px"
                      :src="item2"
                      :preview-src-list="item.threeImgList"
                    />
                  </template>
                </template>
                <template v-else>
                  未上传图片
                </template>
              </td>
            </tr>
          </template>
        </template>
      </template>
      <!-- 处理审核情况 -->
      <template v-if="auditList&&auditList.length>0">
        <tr><td colspan="8" style="background: rgb(197,218,252);">审核处理</td></tr>
        <template v-for="(item,index) in auditList">
          <tr :key="index+'_29'"><td class="tdTtitle">审核意见</td><td colspan="3">{{ item.auditStateName | emptyRe }}</td><td class="tdTtitle">核定用时（h）</td><td colspan="3">{{ item.length | emptyRe }}</td></tr>
          <tr :key="index+'_30'"><td class="tdTtitle">审核说明</td><td colspan="7">{{ item.auditNote | emptyRe }}</td></tr>
          <tr :key="index+'_31'"><td class="tdTtitle">审核人</td><td colspan="3">{{ item.auditUserName | emptyRe }}</td><td class="tdTtitle">审核时间</td><td colspan="3">{{ item.auditTime | emptyRe }}</td></tr>
        </template>
      </template>
    </table>
    <el-button v-if="!auditAction&&exportBtn" type="primary" size="small" style="position: relative;float: right;bottom: 10px;"><a :href="doUrl" download="导出文件">导出</a>	</el-button>
    <template v-if="auditAction">
      <div style="margin-top: 6px;">
        <span style="width:60px; display: inline-block;">审核意见</span>
        <el-select v-model="audAction.auditResult" style="display: inline-block; margin-left: 5px; width:calc(100% - 70px);" size="small" placeholder="请选择审核意见">
          <el-option label="通过" value="1" />
          <el-option label="不通过" value="2" />
        </el-select>
      </div>
      <div style="margin-top: 6px;">
        <span style="width:60px;display:inline-block; vertical-align: top;">审核说明</span>
        <div style="display: inline-block; margin-left: 5px; width:calc(100% - 70px);">
          <el-input v-model="audAction.auditNotes" placeholder="请输入审核说明" size="small" type="textarea" :rows="4" />
        </div>
      </div>
    </template>
    <el-dialog v-dialogDrag title="地图查看" :visible.sync="mapPageInfo" width="1200px" top="calc(50vh - 436px)" append-to-body @close="mapPageInfo=false">
      <look-point-in-map v-if="mapPageInfo" :prop-data="mapData" />
    </el-dialog>
  </div>
</template>
<script>

import { getNewRepairOrderDetail } from '@/api/wxYearPlan'
import request from '@/utils/request'
import { IP } from '@/utils/request'
import lookPointInMap from '@/views/zhpt/wxDayilyManagement/lookPointInMap/widget'
import { getMonth } from '../../../../api/meterReading'
export default {
  name: 'WxWorkOrderInfo',
  filters: {
    emptyRe(value) {
      let returnData = '-'
      if (value) {
        returnData = value
      }
      return returnData
    }
  },
  components: { lookPointInMap },
  props: {
    propData: Object,
    auditAction: {
      type: Boolean,
      default: false
    }, // 默认不显示审核
    auditActionSure: {
      type: Boolean,
      default: false
    }, // 是否提交审核
    exportBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      audAction: {
        'id': '',
        'auditId': '',
        'auditResult': '',
        'auditNotes': ''
      },
      doUrl: '', // 导出路径
      node: -1, // 状态
      hotlineInfoVo: null, // 热线相关内容
      repairRejectList: null, // 热线工单驳回记录
      baseInfoVo: null, // 工单基础信息
      pipeMfRecordList: null, // 养护内容
      recordInfoVoList: null, // 抢维修处理内容
      newList: [], // 最新的数据
      orderList: [], // 历史数据
      auditList: null, // 审核内容
      contentInfo: {
        title: '',
        data: []
      }, // 维护码表内容
      evaluate: {
        title: '',
        data: []
      }, // 评价码表内容
      mapPageInfo: false, // 是否展示地图
      mapData: null, // 地图展示的数据
      lastTime: 0
    }
  },
  watch: {
    propData() {
      this.getWHInfo()
      this.getDoUrl()
    },
    auditActionSure() {
      this.cheakTrue()
    }
  },
  mounted() {
    this.getDoUrl();
    this.getWHInfo();
  },
  methods: {
    /*
    *地图上查看坐标
    */
    lookInMap(item, type) {
      // type 可能的值有（allPoint渲染所有点，传入的是点数据；searchGis查询gis数据）
      const data = {
        type: type
      }
      debugger
      if (type == 'allPoint') {
        if (item.pointList && item.pointList.length > 0) {
          data.pointList = item.pointList
        } else {
          this.$message.info('未上传坐标，无法进行地图定位！')
          return
        }
      } else if (type == 'searchGis') {
        // const allList = this.recordInfoVoList

        const pointList = []
        const point = {
          sid: this.recordInfoVoList?item.repairDevice:item.code,
          layerId: this.recordInfoVoList?item.repairLayer:item.layer,
          type: 'hi'
        }
        if(!point.sid||point.sid=='无'){
          this.$message.info('未上传坐标，无法进行地图定位！')
          return
        }
        pointList.push(point)
        const allPointList = []
        if (this.baseInfoVo.repairUserVoList) {
          this.baseInfoVo.repairUserVoList.forEach(itemV => {
            if (item.respUser == itemV.respUser) {
              const lngLats = JSON.parse(itemV.lngLats)
              if (lngLats && lngLats.length > 0) {
                lngLats.forEach(item2 => {
                  if (item2.x && item2.y) {
                    allPointList.push({
                      x: item2.x,
                      y: item2.y
                    })
                  }
                })
              }
            }
          })
        }
        data.searchGis = pointList
        data.allPointList = allPointList
        if (!pointList || !(pointList.length > 0)) {
          this.$message.info('未上传坐标，无法进行地图定位！')
          return
        }
        // if (!allPointList || !(allPointList.length > 0)) {
        //   this.$message.info('未上传坐标，无法进行地图定位！')
        //   return
        // }
      }
      this.mapData = data
      this.mapPageInfo = true
    },
    /**
     * 获取维护内容
     * */
    getWHInfo() {
      request({ url: '/base/syscommoncode/getByfjId?pCid=40020', method: 'get' }).then(res => {
        if (res.code == 1) {
          this.contentInfo.title = res.result[0].cname
          this.contentInfo.data = res.result[0].codeList
          request({ url: '/base/syscommoncode/getByfjId?pCid=40030', method: 'get' }).then(res => {
            if (res.code == 1) {
              this.evaluate.title = res.result[0].cname
              this.evaluate.data = res.result[0].codeList
              this.getInfo()
            } else {
              this.$message(res.message)
            }
          })
        } else {
          this.$message(res.message)
        }
      })
    },
    // 模板下载
    getDoUrl() {
      if(this.propData&&this.propData.id){
        const dto = encodeURI(JSON.stringify({
          id: this.propData.id }
        ))
        this.doUrl = `${IP}/gps/excel-dispose-info/exportData?access_token=` + sessionStorage.getItem('token') + '&templateServiceType=repairorderService' + '&templateFlag=0' + '&dto=' + dto
      }
    },
    /**
     *获取当前展示的工单信息
     * */
    getInfo() {
      if (this.propData.id) {
        getNewRepairOrderDetail({ orderId: this.propData.id }).then(res => {
          if (res && res.code == 1 && res.result) {
            const info = res.result
            if (this.auditAction) {
              // 获取审核id
              this.audAction.id = this.propData.id
              this.audAction.auditId = this.$store.state.user.userId
            }
            // 状态
            this.node = parseInt(info.node - 1)
            // 处理热线信息
            let hotlineInfoVo = null
            hotlineInfoVo = info.hotlineInfoVo
            if (hotlineInfoVo) {
              hotlineInfoVo.fileGList = this.handleFileList(hotlineInfoVo.gddjFileIdList)
            }
            this.hotlineInfoVo = hotlineInfoVo
            // 热线驳回信息处理
            if (info.repairRejectList) {
              this.repairRejectList = info.repairRejectList
            }
            // 处理工单信息
            info.baseInfoVo.overNum = info.baseInfoVo.overNum ? info.baseInfoVo.overNum : 0
            info.baseInfoVo.percent = info.baseInfoVo.percent ? info.baseInfoVo.percent : 0
            const pointList = []
            const addressList = []
            if (info.baseInfoVo.addressVoList) {
              info.baseInfoVo.addressVoList.forEach(item => {
                if (item.x && item.y) {
                  pointList.push({ x: item.x, y: item.y })
                }
                if (item.address) {
                  addressList.push(item.address)
                }
              })
            }
            info.baseInfoVo.pointList = pointList
            info.baseInfoVo.addressList = addressList
            this.baseInfoVo = info.baseInfoVo

            // 处理内容
            const recordInfoVoList = info.recordInfoVoList
            if (recordInfoVoList && recordInfoVoList.length > 0) {
              recordInfoVoList.forEach((item, index) => {
                let oneImgList = []
                let twoImgList = []
                let threeImgList = []
                if (item.fileIdsOneList && item.fileIdsOneList.length > 0) {
                  oneImgList = this.handleImageList(item.fileIdsOneList)
                }
                if (item.fileIdsTowList && item.fileIdsTowList.length > 0) {
                  twoImgList = this.handleImageList(item.fileIdsTowList)
                }
                if (item.fileIdsThreeList && item.fileIdsThreeList.length > 0) {
                  threeImgList = this.handleImageList(item.fileIdsThreeList)
                }
                item.oneImgList = oneImgList
                item.twoImgList = twoImgList
                item.threeImgList = threeImgList
                // 判断是否存在审核驳回
                if (info.auditList && info.auditList.length > 0 && (info.auditList[0].auditStateName == '未通过')) {
                  // 存在驳回则显示历史信息标题
                  if (index == 0 && item.flag == '0') {
                    item.showHisTitle = true
                  } else if (item.flag == '1' && recordInfoVoList[index - 1].flag == '0') {
                    item.showNowTitle = true
                  }
                }
              })
            }
            this.recordInfoVoList = recordInfoVoList
            // 养护内容
            const pipeMfRecordList = info.pipeMfRecordList
            if (pipeMfRecordList && pipeMfRecordList.length > 0) {
              pipeMfRecordList.forEach(item => {
                const contentInfo = JSON.parse(JSON.stringify(this.contentInfo))
                // 是否存在养护内容
                if (item.pipeMfContentList && item.pipeMfContentList.length > 0) {
                  contentInfo.data.forEach(itemValue => {
                    const index = item.pipeMfContentList.findIndex(item2 => { return item2.mfSerialNumber == itemValue.ccode })
                    if (index != -1) {
                      itemValue.currentValue = (item.pipeMfContentList[index].mfFlag ? '是' : '否')
                    }
                  })
                }
                item.contentInfo = contentInfo
                // 是否存在评价内容
                let isEva = ''
                let notes = ''
                if (item.pipeMfEvaluateList && item.pipeMfEvaluateList.length > 0) {
                  const evaData = item.pipeMfEvaluateList[0]
                  isEva = evaData.mfEvaluateFlag ? '是' : '否'
                  // notes = evaData.mfEvaluateNode?evaData.mfEvaluateNode:item.pipeMfEvaluateList[1].mfEvaluateNode
                  // notes = evaData.mfEvaluateResult?evaData.mfEvaluateResult:item.pipeMfEvaluateList[1].mfEvaluateResult
                  notes =item.pipeMfEvaluateList[1].mfEvaluateResult
                }
                const evaluate = JSON.parse(JSON.stringify(this.evaluate))
                evaluate.data.forEach(item2 => {
                  if (item2.ccode == '2.1') {
                    item2.currentValue = isEva
                  } else if (item2.ccode == '2.2') {
                    item2.currentValue = notes
                  }
                })
                item.evaluate = evaluate
                // 养护图片处理
                const oneImgList = this.handleImageList(item.filePathOneList)
                const twoImgList = this.handleImageList(item.filePathTowList)
                const threeImgList = this.handleImageList(item.filePathThreeList)
                item.oneImgList = oneImgList
                item.twoImgList = twoImgList
                item.threeImgList = threeImgList
              })
            }
            this.pipeMfRecordList = pipeMfRecordList
            // 审核内容
            this.auditList = info.auditList
          }
        })
      }
    },

    /**
   * 处理抢维修处理的图片
   * */
    handleImageList(imgList) {
      const img = []
      if (Array.isArray(imgList) && imgList.length > 0) {
        imgList.forEach(item => {
          img.push(this.getImageUrl(item))
        })
      }
      return img
    },

    /**
     * 处理后端返回的文件集合
     * @param fileList 后端返回的文件集合
     * @returns {isImg,isVoice,otherFile} 图片集合，语音集合，其它文件集合，当集合内容没有的时候返回空数组
     *
    */
    handleFileList(fileList) {
      const isImg = []
      const isVoice = []
      const otherFile = []
      if (fileList && fileList.length > 0) {
        const imgArr = [
          'bmp', 'jpg', 'jpeg', , 'png', 'tif', 'gif',
          'pcx', 'tga', 'exif', 'fpx', 'svg',
          'psd', 'cdr', 'pcd', 'dxf', 'ufo',
          'eps', 'ai', 'raw', 'WMF', 'webp'
        ]
        const voiceArr = [
          'ogg', 'mp3', 'amr'
        ]
        fileList.forEach(item => {
          const index = item.indexOf('.')
          var type = item.substr(index + 1)
          if (imgArr.indexOf(type) != -1) {
            isImg.push(this.getImageUrl(item))
          } else if (voiceArr.indexOf(type) != -1) {
            isVoice.push(this.getVoiceUrl(item))
          } else {
            otherFile.push(this.getOtherUrl(item))
          }
        })
      }
      return {
        isImg, isVoice, otherFile
      }
    },

    /**
     * 审核提交
     * */
    cheakTrue() {
      if (!this.audAction.auditResult) return this.$message.error('请选择审核意见')
      request({
        url: '/gps/audit/auditDispose?templateServiceType=10',
        method: 'post',
        data: this.audAction
      }).then(res => {
        this.$emit('auditActionEnd', res)
      })
    },

    /**
     *  获取图片地址
     * @param value 后端返回的初始文件
    */
    getImageUrl(value) {
      return `${IP}/base/file/loadImg?access_token=` + sessionStorage.getItem('token') + '&remotePath=' + value
    },

    /**
     * 获取语音地址
     * @param value 后端返回的初始文件
    */
    getVoiceUrl(value) {
      return `${IP}/base/file/loadAudio?access_token=` + sessionStorage.getItem('token') + '&remotePath=' + value
    },

    /**
     * 获取其它文件地址
     * @param value 后端返回的初始文件
    */
    getOtherUrl(value) {
      // let currentData=new Date();
      // currentData.getFullYear()+""+(currentData.getMonth()+1)+currentData.getDate()
      return `${IP}/base/file/downloadFile?access_token=` + sessionStorage.getItem('token') + '&remotePath=' + value + '&fileName=' + value
    }
  }
}
</script>
<style scoped>
.wxWorkOrderInfoPage td{
  padding: 10px;
  width: 200px;
  border-right: 1px solid gray;
  border-top: 1px solid gray;
  font-size: 16px;
}
.wxWorkOrderInfoPage td:first{
  width: 100px;
}
.wxWorkOrderInfoPage td.tdTtitle{
  text-align: center;
}
.wxWorkOrderInfoPage .tableDiv{
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
   /* border-bottom: 1px solid #EBEEF5; */
}
.wxWorkOrderInfoPage .pageContentTitle{
  width: 100%;
  text-align: center;
  font-size: 22px;
  padding-bottom:10px ;
  display: block;
}
</style>
