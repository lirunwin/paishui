<template>
  <div class='leftTopTool'>
    <template v-for='(item,index) in toolList'>
      <component :map='map' v-bind:is="item.name" :key="'leftTopTool_'+index"> </component>
    </template>
  </div>
</template>

<script>
// 本模块用于管理左上角的工具栏,所有的左上角工具都是从这里进行加载

export default {
  name: 'leftTopTool',
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
<style lang="scss" scoped>
.leftTopTool{
  position:absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
}
</style>
