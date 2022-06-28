<template>
  <transition
    appear
    name="animate__animated animate__move"
    enter-active-class="animate__slideInUp"
    leave-active-class="animate__slideOutDown"
  >
    <div class="widget-PNLLMonitoring" v-if="show">
      <div class="head">
        <div class="title">
          <div class="icon"></div>
          <span class="site-info">管网液位监测</span>
        </div>
      </div>
      <div class="content-info" id="content-info">
        <specificTable
          :column="column"
          :tableData="tableData"
          :cellStyle="cellStyle"
          isScroll
          @rowClick="rowClick"
          @rowDblclick="rowDblclick"
        />
      </div>
      <infoDialog :visible="dialogVisible" :title="title">
        <historyInfo v-on="$listeners" />
      </infoDialog>
    </div>
  </transition>
</template>

<script>
import config from './config.json'
import util from '@/views/bigScreen/util'
import specificTable from './components/specificTable.vue'
import infoDialog from './components/infoDialog.vue'
import historyInfo from './components/historyInfo.vue'
export default {
  name: 'PNLLMonitoring', //管网液位监测
  components: {
    specificTable,
    infoDialog,
    historyInfo
  },
  props: {
    show: {}
  },
  data() {
    return {
      tableData: [],
      column: config.PNLLMColumn,
      dialogVisible: false,
      title: '',
      vectorLayer: null,
      mapEvent: null,
      mapUtil: null
    }
  },
  computed: {
    view() {
      return this.$store.state.bigScreen.view
    }
  },
  mounted() {
    this.getPageData()
  },
  watch: {
    show(n, o) {
      if (!n) {
        this.clearMapObj()
      }
    },
    view: {
      handler(n, o) {
        if (n) {
          this.mapUtil = new util(n)
        }
      }
    }
  },
  methods: {
    initMapEvent() {
      const gl = this
      this.mapEvent = this.view.on('click', function (e) {
        let pixel = gl.view.getEventPixel(e.originalEvent)
        gl.view.forEachFeatureAtPixel(pixel, function (feature) {
          try {
            const { info } = feature.getProperties()
            gl.dialogVisible = true
            gl.title = info.deviceName + '-' + '监测数据'
          } catch (err) {}
        })
      })
    },
    getPageData() {
      const { getRequestResult } = this.$listeners
      getRequestResult({ blockCode: 'gwywjc' }).then((res) => {
        this.tableData = res.map((item) => {
          Object.keys(item).forEach((val) => (item[val] = item[val] || '/'))
          return {
            ...item,
            deviceStatus: item.deviceStatus == '0' ? '离线' : '在线',
            isAlarm: item.deviceStatus == '0' ? '/' : !item.isAlarm == '0' ? '正常' : '报警'
          }
        })
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let color = ''
      if (columnIndex == 4) {
        if (row.deviceStatus == '离线') color = '#FF3F40'
      }
      if (columnIndex == 5) {
        if (row.isAlarm == '报警') color = '#FF3F40'
      }
      return {
        color: color,
        fontSize: '.067708rem',
        textAlign: 'center',
        'border-bottom': '1px solid rgba(236, 236, 236, 0.3)',
        border: 'none'
      }
    },
    rowClick(row) {
      this.initMapEvent()
      let obj = {
        name: '管网液位',
        src: require('@/views/bigScreen/images/设备/设备-管网液位.png')
      }
      Object.assign(row, obj)
      this.vectorLayer = this.mapUtil.located(row, [parseFloat(104.146864578), parseFloat(30.013916023)])
    },
    rowDblclick(row) {
      this.dialogVisible = true
      this.title = row.deviceName + '-' + '监测数据'
    },
    clearMapObj() {
      if (!this.view) return
      if (this.vectorLayer) this.vectorLayer.getSource().clear()
      if (this.mapEvent) this.view.un(this.mapEvent.type, this.mapEvent.listener)
    }
  }
}
</script>

<style lang="scss" scoped>
.animate__slideInUp,
.animate__slideOutDown {
  animation-duration: 3s; //动画持续时间
  animation-delay: 0s; //动画延迟时间
}
.widget-PNLLMonitoring {
  z-index: 2;
  margin-left: 2.34375rem /* 450/192 */;
  bottom: 0.052083rem /* 10/192 */;
  height: 1.458333rem /* 280/192 */;
  width: 5.302083rem /* 1018/192 */;
  overflow: hidden;
  position: absolute;
  background-color: rgba(20, 24, 47, 0.5);
  color: #eee;
  box-shadow: 0 0 20px rgba(1, 9, 20, 1);
  .head {
    height: 0.166667rem /* 32/192 */;
    width: 100%;
    background: linear-gradient(-90deg, rgba(43, 167, 255, 0.2) 0%, rgba(43, 167, 255, 0.08) 100%);
    .title {
      width: 100%;
      height: 100%;
      display: flex;
      font-weight: 400;
      .icon {
        height: 0.166667rem /* 32/192 */;
        width: 0.34375rem /* 66/192 */;
        background: url('~@/views/bigScreen/images/模块图标/管网液位监测.png') no-repeat center center;
        background-size: 100% 100%;
      }
      span {
        font-weight: bold;
        font-size: 0.083333rem /* 16/192 */;
        color: #ffffff;
        // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
        padding: 0.041667rem /* 8/192 */;
      }
    }
  }
  .content-info {
    width: 100%;
    height: calc(100% - 0.166667rem);
    display: flex;
    flex-flow: row wrap;
    padding: 0.010417rem /* 2/192 */;
  }
}
</style>>
