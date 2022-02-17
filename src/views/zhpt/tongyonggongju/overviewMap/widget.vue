<template>
  <div style="position: absolute; bottom: 5px; right: 10px;">
    <div class="widgetGroupButtoms" title="鹰眼" @click="showMap" style="right: 0; bottom: 0; position: absolute;" >
      <img src="./images/overviewMap.png">
    </div>
    <transition name="el-fade-in">
      <div v-show="isShow" ref="overviewMap_div"
      style="position: absolute; background: #fff; width: 291px; height: 164px; right: 40px; bottom: 0px; padding: 1px; 
      border: 1px solid #2D74E7; transition: 0.2s;" />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'OverviewMap',
  props: {
    mapView: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      isShow: false,
    }
  },
  mounted() {
    this.firstOpen = false
  },
  methods: {
    showMap() {
      this.isShow = !this.isShow
      if(!this.firstOpen) {
        this.firstOpen = true
        this.initMap()
        return
      }
      if(this.isShow) {
        this.addWatch()
      } else if(this.isWatch) {
        this.isWatch.remove()
        this.isWatch = undefined
      }
    },
    initMap() {
      var isDown = false
      var mainView = this.mapView
      var overView = new mainView.TF_mapView({
        container: this.$refs.overviewMap_div,
        map: { basemap: mainView.map.basemap }
      })
      window.requestAnimationFrame(_ => {
        overView.extent = mainView.extent
        this.addWatch()
      })

      var extentGeometry = new mainView.TF_graphic({
        geometry: mainView.extent,
        symbol: { type: 'simple-fill', color: [45, 116, 231, 0.7], outline: undefined }
      })

      overView.ui.components = []
      overView.graphics.add(extentGeometry)
      this.addWatch = () => {
        var timeout        
        this.isWatch = mainView.watch('extent', function(extent) {
          if (isDown) return
          if (timeout) clearTimeout(timeout)
          timeout = setTimeout(setExtent, 200)
          extentGeometry.geometry = extent
        })
      }
      var setExtent = _ => {
        if(isDown) return
        overView.goTo({
          center: mainView.center,
          scale: mainView.scale * 2 * Math.max(mainView.width / overView.width, mainView.height / overView.height)
        })
      }

      var offerXY = [0, 0]
      var div = overView.container.style
      overView.on('pointer-down', function(evt) {
        var {x, y} = overView.toMap({ x: evt.x, y: evt.y })
        var {xmin, ymin, xmax, ymax} = extentGeometry.geometry
        if (x > xmin && y > ymin && x < xmax && y < ymax) {
          isDown = true
          offerXY = [x - xmin, y - ymin, xmax - x, ymax - y]
        }
      })
      overView.on('pointer-up', _ => isDown = false)
      overView.on('pointer-move', function(evt) {
        var {x, y} = overView.toMap({ x: evt.x, y: evt.y })
        var {xmin, ymin, xmax, ymax} = extentGeometry.geometry
        div.cursor = x >= xmin && y >= ymin && x <= xmax && y <= ymax ? 'move' : ''
      })
      overView.on('drag', function(evt) {
        if(isDown) {
          var {x, y} = overView.toMap({ x: evt.x, y: evt.y })
          mainView.extent = {
            xmin: x - offerXY[0], ymin: y - offerXY[1],
            xmax: x + offerXY[2], ymax: y + offerXY[3],
            spatialReference: mainView.spatialReference
          }          
          extentGeometry.geometry = mainView.extent
        } 
        evt.stopPropagation()
      })
    }
  }
}
</script>
