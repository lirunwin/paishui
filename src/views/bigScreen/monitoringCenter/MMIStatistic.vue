<template>
  <transition
    appear
    name="animate__animated animate__move"
    enter-active-class="animate__zoomIn"
    leave-active-class="animate__zoomOut"
  >
    <div class="widget-MMIStatistic" v-if="show">
      <div class="boxpanel">
        <div class="statisticitem" v-for="(item, index) in dataList" :key="item.name">
          <div class="itemName">
            <div class="title">{{ item.name }}</div>
            <div class="img" :class="'img' + index"></div>
          </div>
          <div class="itemCount">
            <div class="wrap">
              <div class="status">正常：</div>
              <div class="normal">{{ item.normal }}个</div>
            </div>
            <div class="wrap">
              <div class="status">报警：</div>
              <div class="error">{{ item.warning }}个</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MMIStatistic', //地图监测信息统计
  props: {
    show: {}
  },
  data() {
    return {
      dataList: [
        { code:"ywj",name: '管网液位', normal: 0, warning: 0 },
        { code:"yldywj",name: '易涝点水位', normal: 0, warning: 0 },
        { code:"",name: '易涝点视频', normal: 3, warning: 0 },
        { code:"znjg",name: '智慧井盖', normal: 0, warning: 0 }
      ]
    }
  },
  mounted() {
    this.getPageData()
  },
  methods: {
    getPageData() {
      const { getRequestResult } = this.$listeners
      getRequestResult({ blockCode: 'typeOnline' }).then((res) => {
        res.forEach((item) => {
          let index = this.dataList.findIndex((i) => i.code == item.code)
          if (index != -1) {
            this.dataList[index].normal=item.normal
            this.dataList[index].warning=item.warning
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.animate__zoomIn,
.animate__zoomOut {
  animation-duration: 3s; //动画持续时间
  animation-delay: 0s; //动画延迟时间
}
.widget-MMIStatistic {
  top: 0.505208rem /* 97/192 */;
  left: 50%;
  margin-left: -1.822917rem /* 350/192 */;
  height: 0.416667rem /* 80/192 */;
  width: 3.645833rem /* 700/192 */;
  overflow: hidden;
  position: absolute;
  font-family: Source Han Sans CN;
  .boxpanel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .statisticitem {
      width: 25%;
      height: 100%;
      display: flex;
      .itemName {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        .title {
          text-align: center;
          font-size: 0.0625rem /* 12/192 */;
          font-weight: bold;
          white-space: nowrap;
          color: rgb(43, 167, 255);
          // text-shadow: 0 0 10px rgba(43, 167, 255, 0.3), 0 0 20px rgba(43, 167, 255, 0.3),
          //   0 0 30px rgba(43, 167, 255, 0.3), 0 0 40px rgba(43, 167, 255, 0.3);
        }
        .img {
          height: 0.447917rem /* 86/192 */;
          width: 0.385417rem /* 74/192 */;
        }
        .img0 {
          background: url('~@/views/bigScreen/images/模块图标/管网液位.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .img1 {
          background: url('~@/views/bigScreen/images/模块图标/水位.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .img2 {
          background: url('~@/views/bigScreen/images/模块图标/视频.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .img3 {
          background: url('~@/views/bigScreen/images/模块图标/井盖.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .itemCount {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        .wrap {
          display: flex;
          align-items: center;
        }
        .status {
          white-space: nowrap;
          font-size: 0.072917rem /* 14/192 */;
          font-weight: bold;
          color: #feffff;
          background: linear-gradient(0deg, #9bd2fa 0%, #ffffff 100%);
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(155, 210, 250, 0.3), 0 0 20px rgba(155, 210, 250, 0.3),
            0 0 30px rgba(155, 210, 250, 0.3), 0 0 40px rgba(155, 210, 250, 0.3);
        }
        .normal {
          white-space: nowrap;
          font-size: 0.09375rem /* 18/192 */;
          font-weight: bold;
          color: #2ba7ff;
          text-shadow: 0 0 10px rgba(43, 167, 255, 0.3), 0 0 20px rgba(43, 167, 255, 0.3),
            0 0 30px rgba(43, 167, 255, 0.3), 0 0 40px rgba(43, 167, 255, 0.3);
        }
        .error {
          white-space: nowrap;
          font-size: 0.09375rem /* 18/192 */;
          font-weight: bold;
          color: #fe4545;
          text-shadow: 0 0 10px rgba(254, 69, 69, 0.3), 0 0 20px rgba(254, 69, 69, 0.3), 0 0 30px rgba(254, 69, 69, 0.3),
            0 0 40px rgba(254, 69, 69, 0.3);
        }
      }
    }
  }
}
</style>