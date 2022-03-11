<template>
  <div class='showLoaction'>
    <span ref="loactionShow"></span>
  </div>
</template>

<script>
// 本模块用于管理左下角坐标工具
import {MousePosition} from 'ol/control';
import { format } from 'ol/coordinate';
export default {
  name: 'showLoaction',

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
     * 展示坐标
    */
    showPropScale(){
      let position= new MousePosition({
          coordinateFormat: coordinate => {
            return format(coordinate, '经度：{x}  纬度：{y}', 6);
          }, // 保留6位小数位
          target: this.$refs['loactionShow']
        })
      this.map.controls.push(position);
    }
  }
}
</script>

<style lang="scss" scoped>
.showLoaction{
  position: relative;
  float: left;
  width: 340px;
  height: 100%;
  top: -6px;
  color: rgba(0,0,0,0.50);
}
</style>