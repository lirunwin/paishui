<template>
  <div class='peoplePage'>
    <template v-for='(item,key) in layerList'>
      <div :key="'layerControl_'+key" class='layerItem'>
          <el-checkbox v-model="item.show" @change="layerControl(item)" :label="item.title" ></el-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props:{
    layerList:{}
  },
  methods:{
    layerControl(layerData){
      layerData.layer.setVisible(layerData.show)
    }
  }
}
</script>

<style lang="scss" scoped>
.layerItem{
    font-size: 16px;
    padding: 5px;
}
</style>