<template>
  <div class='leftBottomTool'>
    <template v-for='(item,index) in toolList'>
      <component :map='map' v-bind:is="item.name" :key="'leftBottomTool_'+index"> </component>
    </template>
  </div>
</template>

<script>
// 本模块用于管理左下角的工具栏,所有的左上角工具都是从这里进行加载
export default {
  name: 'leftBottomTool',

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
.leftBottomTool{
  position: absolute;
    bottom: 0px;
    width: 460px;
    z-index: 2;
}
</style>