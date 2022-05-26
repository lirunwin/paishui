<template>
  <div class='upOrDownView'>
    <span class='remark' title='上一视图' @click="upView"><i class="el-icon-back" /></span>
    <span class='lineSplit'></span>
    <span class='remark' title='下一视图' @click="downView"><i class="el-icon-right" /></span>
  </div>
</template>

<script>
// 上一视图和下一视图

export default {
  name: 'upOrDownView',
  // components: { tfLegend },
  props: { 
    map:{
      type:Object,
      default:null,
    }
  },
  data() {
    return {
      /**存储视图范围*/ 
      viewExtents:[],
      /**当前视图对应的视图索引*/ 
      pointer: -1,
      /**用于区分是按钮操作还是鼠标操作,点击上一视图和下一视图为1,鼠标操作为0*/ 
      clickFlag:0,
    }
  },
  mounted() {
    this.mapMoveListener();
  },
  methods: {
    /**
     * 监听视图的移动变化
    */
    mapMoveListener(){
      this.map.on('moveend', res => {
        // 视图的变化不是触发前一视图、后一视图事件时
        if (this.clickFlag == 0&&this.map.getView().getCenter()[0]) {
          this.viewExtents.splice(this.pointer, this.viewExtents.length - this.pointer-1);
          this.viewExtents.push({
            zoom: this.map.getView().getZoom(),
            center: this.map.getView().getCenter()
          })
          this.pointer += 1;
        } else {
          this.clickFlag = 0;
        }
      });
    },

    /**
     * 上一视图
    */
    upView(){
      this.clickFlag=1;
      if (this.pointer == 0) {
        return;
      }
      this.pointer -= 1;
      this.setView();
    },

    /**
     * 下一视图
    */
    downView(){
      this.clickFlag=1;
      if (this.pointer >= this.viewExtents.length - 1) {
        return;
      }
      this.pointer += 1;
      this.setView();
    },

    /**
     * 设置wiew范围
     */
    setView() {
      let view = this.map.getView();
      view.setZoom(this.viewExtents[this.pointer].zoom);
      view.animate({
        center: this.viewExtents[this.pointer].center,
        duration: 600
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.upOrDownView{
  position: relative;
  float: left;
  width: 74px;
  height: 40px;
  font-size: 30px;
  color: rgb(179,178,178);
  background: white;
  left: 5px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  border-radius: 2px;
  .lineSplit{
    border-left: 1px solid rgba(128,128,128,0.2);
    height: 30px;
    display: inline-block;
    position: relative;
    float: left;
    top: 5px;
  }
  .remark{
    position: relative;
    float: left;
    padding: 0px 3px;
    top: 2px;
    &:hover {
      cursor: pointer;
      color: rgb(64, 158, 255);
      transform: scale(1.2);
    }
  }
}
</style>