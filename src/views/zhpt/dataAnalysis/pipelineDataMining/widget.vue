<template>
  <div class="engineering-manage">
    <!-- 管道检测数据挖掘 -->
    <div class="releaseTop-box">
      <!-- 左边部分 -->
      <div class="right">
        <!-- 地图 -->
        <div class="map-box">
          <simple-map @mapMoveEvent="mapMoveEvent" ref="myMap"></simple-map>
        </div>
      </div>
      <!-- 右边部分 -->
      <div class="left">
        <div class="top-title">管道检测数据挖掘</div>
        <el-divider></el-divider>
        <div class="top-title flexCss">
          <el-checkbox v-model="linkage">联动</el-checkbox>
          <el-button type="primary" size="small" @confirm="$message('该功能暂未开放')"
            >导出<i class="el-icon-download el-icon--right"></i
          ></el-button>
        </div>
        <el-divider></el-divider>
        <!-- 视图列表 -->
        <div class="echarts-list">
          <div class="threeBottom">
            <div class="threeBottom-one">
              <echarts-two v-if="redayY" :paramData="defectTypeObj"></echarts-two>
            </div>
            <div class="threeBottom-two">
              <echarts-three v-if="redayY" :paramData="defectLevel"></echarts-three>
            </div>
          </div>

          <div class="threeBottom">
            <div class="threeBottom-one">
              <echarts-four v-if="redayY" :paramData="defectLevel"></echarts-four>
            </div>
            <div class="threeBottom-two">
              <echarts-five v-if="redayY" :paramData="defectLevel"></echarts-five>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import simpleMap from '@/components/SimpleMap'
import { getDefectDataBySE } from '@/api/sysmap/drain'
// import echartsOne from './components/echartsOne.vue'
import echartsTwo from './components/echartsTwo.vue'
import echartsThree from './components/echartsThree.vue'
import echartsFour from './components/echartsFour.vue'
import echartsFive from './components/echartsFive.vue'

export default {
  props: ['data'],
  components: { simpleMap, echartsTwo, echartsThree, echartsFour, echartsFive },
  data() {
    return {
      redayY: false, // 数据是否已加载完毕
      linkage: true, // 是否联动
      defectTypeObj: {
        funcArr: [],
        structArr: []
      }, // 缺陷类型统计图
      defectLevel: [] // 其它统计图
    }
  },
  mounted() {
    this.$refs.myMap.showLegend('testReport', true)
  },
  destroyed() {
    this.$refs.myMap.showLegend('testReport', false)
    this.data.that.clearMap()
  },
  beforeCreate() {
    console.log('销毁echatrs')
    // document.getElementById('mainB').removeAttribute('_echarts_instance_')
  },
  methods: {
    // 处理地图数据
    getData(res) {
      let pipArr = res.pipeData // 管道列表
      let defectArr = res.defectData // 缺陷列表

      // 缺陷等级统计图
      // 缺陷数量统计图
      // 处理方式统计图
      this.defectLevel = defectArr
      this.redayY = true
      // console.log('this.defectLevel', this.defectLevel)

      // 管道检测情况统计图

      // 缺陷类型统计图
      defectArr.forEach((v) => {
        // console.log('结构性缺陷循环', v.defectType)
        // 结构性 列表
        if (v.defectType == '结构性缺陷') {
          this.defectTypeObj.funcArr.push(v)
        }
        // 功能性性 列表
        if (v.defectType == '功能性缺陷') {
          this.defectTypeObj.structArr.push(v)
          // console.log('功能性缺陷', v)
        }
      })

      // console.log('this.defectTypeObj', this.defectTypeObj)
    },
    // 绘制
    drawFeature() {
      this.$refs.myMap.draw((fea) => {
        this.getDataFromExtent({}, fea).then((res) => {
          // 联动时数据变化
          if (this.linkage) {
            this.getData(res)
          }
          console.log('绘制,过滤后', res)
        })
      })
    },
    mapMoveEvent(extent) {
      this.getDataFromExtent({}, extent).then((res) => {
        // 联动时数据变化
        if (this.linkage) {
          this.getData(res)
        }
        console.log('地图变化,过滤后', res)
      })
    },
    async getDataFromExtent(params, extent) {
      let data = await this.getPipeData(params)
      if (data.code === 1) {
        // 地图范围过滤数据
        return this.$refs.myMap.getDefectDataInMap(data.result, extent)
      } else this.$message.error('请求数据出错')
    },
    // 根据条件获取缺陷数据
    getPipeData(filter = {}) {
      let params = {
        startPoint: '',
        endPoint: '',
        funcClass: '',
        structClass: '',
        jcStartDate: '',
        jcEndDate: '',
        checkSuggest: '修复计划',
        ...filter
      }
      return getDefectDataBySE(params)
    }
  },
  computed: {
    mapExtent() {
      return this.$store.state.gis.mapExtent
    }
  },
  watch: {
    mapExtent: {
      handler(nv, ov) {
        console.log('视图改变')
        if (this.data.mapView.getView().getZoom() > 16) {
          this.data.that.queryForExtent(nv)
        } else {
          // 在地图界别较小时，移除管网
          this.data.that.clearMap()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.engineering-manage {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  //   overflow-y: scroll;
  padding: 20px;
  overflow: hidden;

  // 分左右布局
  .releaseTop-box {
    height: 100%;
    display: flex;
    justify-content: space-between;

    .left {
      flex: 4;
      // overflow-y: scroll;

      .echarts-list {
        padding: 0 20px;
        box-sizing: border-box;
        .threeTop {
          width: 100%;
          height: 300px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          & > .threeTop-item:nth-child(1),
          & > .threeTop-item:nth-child(2) {
            border-right: 1px solid #dedede;
          }
          .threeTop-item {
            height: 100%;
            // flex: 1;
            width: 32%;
            // border: 1px solid #666;
          }
        }
        .threeBottom {
          width: 100%;
          height: 310px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;

          .threeBottom-one,
          .threeBottom-two {
            height: 100%;
            // flex: 1;
            // border: 1px solid #666;
          }
          .threeBottom-one {
            width: 66%;
            border-right: 1px solid #dedede;
          }
          .threeBottom-two {
            width: 32%;
          }
        }
      }

      /deep/ .el-divider--horizontal {
        margin: 10px 0 !important;
      }
      .top-title {
        color: #555555;
        font-size: 16px;
        margin: 0 20px;
        font-family: Arial, Helvetica, sans-serif;
      }
      .flexCss {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .right {
      flex: 3;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
      //   border: 1px solid #666;
      .map-box {
        height: 100%;
      }
    }
  }
}
</style>