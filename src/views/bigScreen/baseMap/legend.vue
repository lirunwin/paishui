<template>
  <transition
    appear
    name="animate__animated animate__move"
    enter-active-class="animate__flipInX"
    leave-active-class="animate__flipOutX"
  >
    <div class="widget-MapLegend" ref="widget-MapLegend">
      <div class="wrap">
        <div class="icon" @click="legendBoardShow = !legendBoardShow" title="地图图例"><div class="img"></div></div>
        <div class="legendBoard" v-show="legendBoardShow">
          <div class="title">地图图例</div>
          <div class="legendItem">
            <div class="citem" v-for="item in legendList" :key="item.name">
              <div class="iconWrap"><img class="legendIcon" :src="item.img" /></div>
              <div class="legendName">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MapLegend', //地图图例
  props: {
    hideBoth:{}
  },
  data() {
    return {
      legendBoardShow: false,
      legendList: [
        { img: require('@/views/bigScreen/images/图例/液位仪.png'), name: '管网液位' },
        { img: require('@/views/bigScreen/images/图例/视频监控.png'), name: '易涝点视频' },
        { img: require('@/views/bigScreen/images/图例/巡查.png'), name: '巡检人员' },
        { img: require('@/views/bigScreen/images/图例/井盖.png'), name: '智慧井盖' },
        { img: require('@/views/bigScreen/images/图例/液位计.png'), name: '易涝点水位' },
        { img: require('@/views/bigScreen/images/图例/工程车.png'), name: '工程车辆' },
        { img: require('@/views/bigScreen/images/图例/事件.png'), name: '事件位置' },
        { img: require('@/views/bigScreen/images/图例/汛情.png'), name: '汛情位置' },
        { img: require('@/views/bigScreen/images/图例/隐患.png'), name: '隐患位置' }
      ]
    }
  },
  watch: {
    hideBoth(n){
        if(!n){
            this.$refs['widget-MapLegend'].style.setProperty('--bottom', '1.59375rem')
            this.$refs['widget-MapLegend'].style.setProperty('--left', '2.34375rem')
        }else{
            this.$refs['widget-MapLegend'].style.setProperty('--bottom', '.052083rem')
            this.$refs['widget-MapLegend'].style.setProperty('--left', '.052083rem')
        }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.animate__flipInX,
.animate__flipOutX {
  animation-duration: 3s; //动画持续时间
  animation-delay: 0s; //动画延迟时间
}
.widget-MapLegend {
  $size10: 0.052083rem /* 10/192 */;
  $size20: 0.104167rem /* 20/192 */;
  z-index: 2;
  //position
  bottom: var(--bottom);//1.59375rem /* 306/192 */;
  margin-left:var(--left); //2.34375rem /* 450/192 */;
  position: absolute;
  //background
  background-color: rgba(20, 24, 47, 0.5);
  color: #eee;
  box-shadow: 0 0 20px rgba(1, 9, 20, 1);
  //font
  font-family: Source Han Sans CN;
  .wrap {
    display: flex;
    align-items: flex-end;
    height: 0;
    .icon {
      width: 0.177083rem /* 34/192 */;
      height: 0.177083rem /* 34/192 */;
      background: rgba(3, 109, 190, 0.4);
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .img {
        width: 0.083333rem /* 16/192 */;
        height: 0.0625rem /* 12/192 */;
        background: url('~@/views/bigScreen/images/图例.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .legendBoard {
      margin-left: 0.052083rem /* 10/192 */;
      width: 1.84375rem /* 354/192 */;
      // height: .541667rem /* 104/192 */;
      background: rgba(3, 109, 190, 0.4);
      border-radius: 2px;
      display: flex;
      flex-flow: column;
      padding: 0.052083rem /* 10/192 */;
      .title {
        height: 0.078125rem /* 15/192 */;
        font-size: 0.072917rem /* 14/192 */;
        font-weight: bold;
        color: #2ba7ff;
      }
      .legendItem {
        height: calc(100% - 0.078125rem);
        width: 100%;
        .citem {
          float: left;
          height: 50%;
          width: 33%;
          display: flex;
          align-items: center;
          .iconWrap {
            height: 0.15625rem /* 30/192 */;
            width: 0.130208rem /* 25/192 */;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .legendName {
            font-size: 0.072917rem /* 14/192 */;
            font-weight: 400;
            color: #fefeff;
            padding: 0.026042rem /* 5/192 */;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>