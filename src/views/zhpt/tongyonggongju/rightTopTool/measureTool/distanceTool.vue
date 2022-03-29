
<template>
</template>

<script>
import {drawAndLayer,optionAction} from"./drawAndLayer"
export default {
  props: {
    map:null
  },
  data() {
    return {
    }
  },
  created(){
  },
  mounted(){
    this.startDis();
  },
  methods: {
    /**
     * 开始测量
    */
    startDis(){
      drawAndLayer.initValue(this.map);
      drawAndLayer.measure(optionAction.distance);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
