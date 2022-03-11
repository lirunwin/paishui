
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
  mounted(){
    this.startDis();
  },
  methods: {
    /**
     * 清除
    */
    startDis(){
      drawAndLayer.destory();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
