<template>
  <blocks title="用户指标">
    <div ref="usertopHeight" class="usertop-container">
      <div class="usertop">
        <div v-if="validateAuth('positiveFeedback')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/haoping.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.haoping }}</span>
            <span class="spantitle">好评率</span>
          </div>
        </div>
        <div v-if="validateAuth('callIn')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/huru.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.huru }}</span>
            <span class="spantitle">呼入数</span>
          </div>
        </div>
        <div v-if="validateAuth('workOrder')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/paidan.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.paidan }}</span>
            <span class="spantitle">派单数</span>
          </div>
        </div>
        <div v-if="validateAuth('ranking')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/paihang.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.paihang }}</span>
            <span class="spantitle">个人排行</span>
          </div>
        </div>
        <div v-if="validateAuth('callOut')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/huchu.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.huchu }}</span>
            <span class="spantitle">呼出数</span>
          </div>
        </div>
        <div v-if="validateAuth('callBack')" class="useritem">
          <div class="usericon">
            <img src="../../../../../assets/images/home/huifang.png">
          </div>
          <div class="usercontent">
            <span class="spannum">{{ userinfo.huifang }}</span>
            <span class="spantitle">回访数</span>
          </div>
        </div>
      </div>
    </div>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import auth from '../../mixins/DashboardAuth'
import { getIndividualRanking } from '@/api/dashboard'

export default {
  components: { Blocks },
  mixins: [auth],
  data() {
    return {
      imageheight: 100,
      userinfo: {
        haoping: '0',
        huru: '0',
        paidan: '0',
        paihang: '0',
        huchu: '0',
        huifang: '0'
      }
    }
  },
  watch: {

  },
  destroyed() {

  },
  mounted() {
    this.getUserTop()
  },
  methods: {
    /**
     * @description 个人排行
     */
    getUserTop() {
      const that = this
      getIndividualRanking({}).then(res => {
        if (res.code === 1) {
          that.userinfo.haoping = res.result.favorableRate // 好评率
          that.userinfo.paihang = res.result.individualRanking // 个人排行
          that.userinfo.huru = res.result.inboundNumber // 呼入数
          that.userinfo.huchu = res.result.callSeveral // 呼出数
          that.userinfo.paidan = res.result.sendSingular // 派单数
          that.userinfo.huifang = res.result.numberVisit // 回访数
        }
      })
    },

    /**
		 * @description 判断字符串是否为空
		 */
    strIsNull(strVal) {
      strVal = strVal || ''
      return (typeof (strVal) === 'undefined' || strVal == null || strVal == '')
    }
  }
}
</script>

<style lang="scss" scoped>
.usertop-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;

  .usertop{
    // border:1px red solid;
    height: 100%;
    width: 100%;
    // display:flex;
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap:wrap;
    // border:1px red solid;

    .useritem {
      // border:1px red solid;
      width: 184px;
      margin: 5px 10px 5px 10px;
      height: 70px;
      background: #F8F8F8;
      border-radius: 4px;
      display: flex;

      .usericon {
        display: block;
        flex-direction: row;
        // border:1px red solid;
        width: 70px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        // display:flex;
        // justify-content:center;
        // align-items:center;
        img{
          vertical-align:middle;
          width: 70%;
          height: 70%;
        }
      }

      .usercontent{
        // border: 1px rgb(183, 0, 255) solid;
        height: 100%;
        width: calc(100% - 70px);

        span{
          display: block;
          width: 100%;
          text-align: center;
          // border: 1px red solid;
        }

        .spannum{
          height: 40px;
          line-height: 40px;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
        }

        .spantitle{
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          font-weight: 500;
          color: #555555;
        }
      }
    }
  }
}
</style>

