<template>
  <div class='rightBottomTool' :style="'bottom:'+(toolList.length*37+5)+'px'">
    <template v-for='(item,index) in toolList'>
      <component :map='map' v-bind:is="item.name" :key="'rightBottomTool_'+index"> </component>
    </template>
  </div>
</template>

<script>
// 本模块用于管理右下角的工具栏,所有的右下角工具都是从这里进行加载
export default {
  name: 'rightBottomTool',
  components: {},
  props: { 
    toolList:{
      type:Array,
      default:[]
    },
    map:null
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>
<style lang='scss' scoped>
.rightBottomTool{
    position: absolute;
    right: 20px;
    bottom: 5px;
    height: 30px;
    width: 30px;
    background: rgba(0,0,0,0);
    z-index: 2;
}
</style>