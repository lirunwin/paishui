<template>
  <transition
    appear
    name="animate__animated animate__move"
    enter-active-class="animate__slideInLeft"
    leave-active-class="animate__slideOutLeft"
  >
    <div class="widget-ELPWLMStatistic" v-if="show">
      <div class="head">
        <div class="title">
          <div class="icon"></div>
          <!-- <span class="site-info">易涝点水位监测统计</span> -->
          <span class="site-info">管网液位监测</span>
          <el-select v-model="selectValue" placeholder="请选择" size="mini" ref="date-select" :popper-append-to-body="false">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="showDatePicker(item)"
            >
            </el-option>
          </el-select>
          <div class="datePicker" v-if="isShowDatePicker">
            <el-date-picker
              size="mini"
              v-model="customDataValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="content-info">
        <el-carousel style="height:100%;width:100%" :interval="5000">
          <el-carousel-item v-for="(pitem,index) in siteList" :key="index" style="height:100%;width:100%">
              <div class="content-item" v-for="item in pitem" :key="item.deviceName">
                <div class="title">
                  <div class="icon"></div>
                  <span class="site-name">{{ item.deviceName + '（' + item.address + '）' }}</span>
                </div>
                <div class="content">
                  <waterLevelChart
                    v-on="$listeners"
                    :dateRange="dateRange"
                    :deviceSn="item.deviceSn"
                    :warningWl="item.warningWl"
                  />
                </div>
              </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </transition>
</template>

<script>
import waterLevelChart from './components/waterLevelChart.vue'
import moment from 'moment'
export default {
  name: 'ELPWLMStatistic', //易涝点水位监测统计
  components: {
    waterLevelChart
  },
  props: {
    show: {}
  },
  data() {
    return {
      isShowDatePicker: false,
      options: [
        {
          value: '1',
          label: '近1小时'
        },
        {
          value: '24',
          label: '近24小时'
        },
        {
          value: '7',
          label: '近一周'
        },
        {
          value: '365',
          label: '最近一年'
        },
        {
          value: 'custom',
          label: '自定义'
        }
      ],
      selectValue: '1',
      dateRange: {},
      customDataValue: [],
      siteList: []
    }
  },
  watch: {
    selectValue: {
      handler(val) {
        switch (val) {
          case '1':
            this.dateRange = { beginTime: new Date().setHours(new Date().getHours() - 1), endTime: Date.now() }
            break
          case '24':
            this.dateRange = { beginTime: new Date().setHours(new Date().getHours() - 24), endTime: Date.now() }
            break
          case '7':
            this.dateRange = { beginTime: new Date().setDate(new Date().getDate() - 7), endTime: Date.now() }
            break
          case '365':
            this.dateRange = { beginTime: new Date().setFullYear(new Date().getFullYear() - 1), endTime: Date.now() }
            break
        }
      },
      immediate: true
    },
    show: {
      handler(n, o) {
        if (n) {
          this.$nextTick(() => {})
        }
      }
    },
    customDataValue: {
      handler(n, o) {
        if (!n) {
          this.isShowDatePicker=false
          return
        }
        n.map((item) => moment(item).format('YYYY-MM-DD HH:mm:ss'))
        this.dateRange = { beginTime: n[0], endTime: n[1] }
      }
    },
    view: {
      handler(n, o) {
        if (n) this.initVector()
      }
    }
  },
  mounted() {
    this.getPageData()
  },
  methods: {
    getPageData() {
      const { getRequestResult } = this.$listeners
      let data = { blockCode: 'yldPage', 'page.size':9999,'paras[0].name': 'typeCode', 'paras[0].val': 'ywj' }
      getRequestResult(data).then((res) => {
        // this.siteList= res.records.filter(item=>item.typeCode=='ywj')
        for(var i=0;i<res.records.length;i+=3){
            this.siteList.push(res.records.slice(i,i+3));
        }
        console.log(this.siteList)
      })
    },
    //显示自定义事件项
    showDatePicker(item) {
      this.isShowDatePicker = item.label === '自定义' ? true : false
    },
    //时间转换
    timeConversion(date) {
      let time = new Date(date)
      //getMonth()的返回值是0-11也就是从0开始而不是从1开始。所以一般都需要加一个1 才能达到1-12月。否则就成了0-11月了
      return time.getFullYear() + '-' + this.formatTen(time.getMonth() + 1) + '-' + this.formatTen(time.getDate())
    },
    //时间取0位
    formatTen(num) {
      return num > 9 ? num + '' : '0' + num
    }
  }
}
</script>

<style lang="scss" scoped>
.animate__slideInLeft,
.animate__slideOutLeft {
  animation-duration: 3s; //动画持续时间
  animation-delay: 0s; //动画延迟时间
}
.widget-ELPWLMStatistic {
  $size10: 0.052083rem /* 10/192 */;
  $size20: 0.104167rem /* 20/192 */;
  z-index: 2;
  //position
  bottom: $size10 /* 10/192 */;
  margin-left: $size20 /* 20/192 */;
  position: absolute;
  //size
  height: calc(100% - 0.557292rem /* 107/192 */);
  width: 2.083333rem /* 400/192 */;
  //background
  background-color: rgba(20, 24, 47, 0.5);
  color: #eee;
  box-shadow: 0 0 20px rgba(1, 9, 20, 1);
  //font
  font-family: Source Han Sans CN;
  .head {
    height: 0.166667rem /* 32/192 */;
    width: 100%;
    background: linear-gradient(-90deg, rgba(43, 167, 255, 0.2) 0%, rgba(43, 167, 255, 0.08) 100%);
    .title {
      width: 100%;
      height: 100%;
      display: flex;
      font-weight: 400;
      align-items: center;
      .icon {
        height: 0.166667rem /* 32/192 */;
        width: 0.34375rem /* 66/192 */;
        background: url('~@/views/bigScreen/images/模块图标/监测统计.png') no-repeat center center;
        background-size: 100% 100%;
      }
      span {
        flex: 1;
        font-weight: bold;
        font-size: 0.083333rem /* 16/192 */;
        color: #ffffff;
        // text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
        padding: 0.041667rem /* 8/192 */;
      }
      .el-select {
        flex: 0.4;
        /deep/ input {
          padding: 0;
          background: transparent;
          border: none;
          font-size: 0.072917rem /* 14/192 */;
          font-weight: 500;
          color: #2ba7ff;
        }
        /deep/ .el-icon-arrow-up:before {
          content: '';
          display: block;
          // 定义元素宽高
          margin-top: 0.041667rem /* 8/192 */;
          width: 0.130208rem /* 25/192 */;
          height: 0.078125rem /* 15/192 */;
          background: url('~@/views/bigScreen/images/三角下.png') no-repeat center center;
          background-size: 100% 100%;
          transform: rotate(180deg);
        }
      }
      .datePicker {
        position: absolute;
        left: 1.041667rem /* 200/192 */;
        top: 0.182292rem /* 35/192 */;
        z-index: 999;
        .el-range-editor--mini.el-input__inner {
          width: 1.041667rem /* 200/192 */;
          height: 0.145833rem /* 28/192 */;
        }
        /deep/ .el-date-editor .el-range-input {
          width: 100%;
        }
      }
    }
  }
  .content-info {
    width: 100%;
    height: calc(100% - 0.166667rem);
    overflow: hidden;
    padding: 2px;
    /deep/ .el-carousel__container {
      width: 100%;
      height: 100%;
    }
    .content-item {
      width: 100%;
      height: 33%;
      float: left;
      overflow: hidden;
      .title {
        width: 100%;
        display: flex;
        // padding: .145833rem 0 .104167rem 0;
        padding: 0.145833rem 0 0.026042rem /* 5/192 */ 0;
        .icon {
          height: 0.072917rem /* 14/192 */;
          width: 0.052083rem /* 10/192 */;
          margin-right: 0.046875rem /* 9/192 */;
          background: url('~@/views/bigScreen/images/三角.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .site-name {
          color: #ffffff;
          font-size: 0.072917rem /* 14/192 */;
          font-weight: 500;
        }
      }
      .content {
        height: calc(100% - 0.338542rem /* 65/192 */);
        width: 100%;
      }
    }
  }
}
</style>