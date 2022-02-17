<template>
  <div id="scale" class="littleWidget">
    比例尺：1:{{ scale ? scale.toFixed(0) : 1 }}
  </div>
</template>
<script>
export default {
  name: 'Scalebar',
  components: {},
  props: {
    mapView: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      scale: undefined
    }
  },
  watch: {
    mapView: function(e) {
      var that = this
      var bar = document.getElementById('scale')
      this.mapView.watch('resolution', function(e) {
        // var nextNumber = parseInt(50 * e).toString();
        // nextNumber =
        //   Math.pow(10, nextNumber.length) *
        //   (Number(nextNumber[0]) > 5 ? 1 : 0.5);
        // bar.style.width = nextNumber / e + "px";
        that.scale = that.mapView.scale
        // nextNumber >= 1000 ? nextNumber / 1000 + "km" : nextNumber + "m";
      })
    }
  }
}
</script>
<style type="scss" scoped>
#scale {
  position: absolute;
  bottom: 45px;
  left: 30px;
  /* border-bottom: 2px solid #323232;
  border-left: 2px solid #323232;
  border-right: 2px solid #323232; */
  /* padding: 0 7px; */
}
</style>
<style type="scss">
.littleWidget {
    font-size: 12px;
    /* font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif; */
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0.33);
    line-height: 1.5em;
    padding-left: 5px;
    padding-right: 5px;
}
</style>
