<template>
  <div class="compass">
    <div class="turn-left" title="顺时针转动" @click="mapRotating(0)"></div>
    <div class="compass-middle" :style="{transform:'rotate('+rRotating+'deg)',transition:'transform 0.6s linear'}"></div>
    <div class="turn-right" title="逆时针转动" @click="mapRotating(1)"></div>
  </div>
</template>

<script>
export default {
  props: ["map"],
  data() {
    return {
      rRotating: 0
    }
  },
  methods: {
    mapRotating(type) {
      if (type == 0) {
        this.rRotating -= 90
        this.map.getView().animate({
          rotation: this.map.getView().getRotation() - 90*(Math.PI/180),
          duration: 600
        }); 
      } else {
        this.rRotating += 90
        this.map.getView().animate({
          rotation: this.map.getView().getRotation() + 90*(Math.PI/180),
          duration: 600
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.compass {

  margin-bottom:5px ;
  position: relative;
  float: left;
  height: 54px;
  width: 54px;
  line-height: 54px;
  background: url('../../../../../assets/images/bgcicle.png') no-repeat;
  background-size: 54px 54px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  padding: 0 !important;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  left: -13px;
  border-radius: 32px;
  .turn-left {
    display: inline-block;
    vertical-align: middle;
    width: 7px;
    margin-left: 3px;
    margin-right: 2px;
    height: 28px;
    background: url('../../../../../assets/images/turn.png') no-repeat;
    background-size: 7px 28px;
    cursor: pointer;
    // margin-top: 15px;
    &:hover {
      background: url('../../../../../assets/images/turnhover.png') no-repeat;
      background-size: 8px 28px;
    }
  }
  .compass-middle {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    margin: 0 5px;
    height: 38px;
    // margin-top: 13px;
    background: url('../../../../../assets/images/compass.png') no-repeat;
    background-size: 12px 38px;
  }
  .turn-right {
    display: inline-block;
    vertical-align: middle;
    width: 7px;
    // margin-right: 3px;
    // margin-left: 2px;
    height: 28px;
    background: url('../../../../../assets/images/turn.png') no-repeat;
    background-size: 7px 28px;
    transform: scaleX(-1);
    // margin-top: 15px;
    cursor: pointer;
    &:hover {
      background: url('../../../../../assets/images/turnhover.png') no-repeat;
      background-size: 8px 28px;
    }
  }
}
</style>