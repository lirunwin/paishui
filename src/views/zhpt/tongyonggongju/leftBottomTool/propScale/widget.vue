<template>
  <div class='propScale'>
    <span style="width:100%" ref="propScaleShow"></span>
  </div>
</template>

<script>
// 本模块用于管理左下角比例尺工具
import {ScaleLine} from 'ol/control';
export default {
  name: 'propScale',

  props: { 
   map:{
      type:Object,
      default:null,
    }
  },
  computed:{
  },
  data() {
    return {
      
    }
  },
  mounted() {
    this.showPropScale();
  },
  methods: {
    /**
     * 展示比例尺
    */
    showPropScale(){
      let prop= new ScaleLine({
          units: 'metric',
          target: this.$refs['propScaleShow']
        })
      this.map.controls.push(prop);
    }
  }
}
</script>
<style lang='scss' scoped>
.propScale{
    width: 120px;
    position: relative;
    float: left;
    height: 30px;
}
</style>