<template>
    <div ref="textBox" style="position:absolute;display:none;">
      <div style="width:5px;height:5px;border-radio:3px;background:#f00;position:absolute; border-radius: 3px;"></div>
      <div style="position: relative; top: 10px;">
        <el-input class="helpInput" style="width: 120px; padding-left: 5px;" clearable size="small" v-model="inputT" placeholder="标识内容" /><!--
        --><el-button style="display: inline-block;height: 32px; border-radius: 0px 4px 4px 0px;" type="primary" size="small" plain @click="setText">确认</el-button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'qAndaTextbox',
  components: { },
  props: {
    param: Object
  },
  data() {
    return {
      inputT: ""
    }
  },
  mounted: function() {
    this.that = this.param.that
    var mapView = this.that.mapView
    this.point = undefined
    var textBoxDiv = this.$refs.textBox
    this.click = mapView.on('click', (evt) => {      
      this.point = mapView.toMap({ x: evt.x, y: evt.y })
      textBoxDiv.style.display = ''
      textBoxDiv.style.left = evt.x + 'px';
      textBoxDiv.style.top = evt.y + 'px';
    })
    this.extentMove = mapView.watch('extent', () => {      
      if(!this.point) return
      var ne = mapView.toScreen(this.point)
      textBoxDiv.style.left = ne.x + 'px';
      textBoxDiv.style.top = ne.y + 'px';
    })
  },
  methods: {
    setText() {
      this.that.setText(this.inputT, this.point)
    }
  },
  destroyed: function() {
    [this.click, this.extentMove].map((e) => e.remove())
  }
}
</script>
