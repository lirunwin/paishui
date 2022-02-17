<template>
  <div ref="mouse" style="position: absolute; bottom: 5px; left: 5px;" class="littleWidget">
    <span style="padding-left:5px" ref="scale">比例尺:1:125000</span>
    <span style="padding-left:5px" ref="location">坐标:</span>
  </div>
</template>
<script>
import { esriConfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'MouseLocation',
  components: {},
  props: {
    mapView: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {}
  },
  watch: {
    mapView: function(e) {
      var scale = this.$refs.scale
      var location = this.$refs.location
      var view = this.mapView
      view.TF_mouseLocation = this
      this.mapView.on('pointer-move', function(evt) {
        var xy = view.toMap({ x: evt.x, y: evt.y })
        location.innerHTML = xy ? ('坐标:' + xy.x.toFixed(5) + ',' + xy.y.toFixed(5)) : '' // that.mapView.zoom+","+that.mapView.resolution+","+that.mapView.scale;//+"\n"+
      })
      this.mapView.watch('resolution', function(e) {
        scale.innerHTML = '比例尺:1:' + view.scale.toFixed(0);
      })
    }
  }
}
</script>
