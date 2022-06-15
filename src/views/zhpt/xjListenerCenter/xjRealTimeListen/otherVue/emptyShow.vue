<template>
  <div style='width:100%;height:100%;text-align: center; padding-top: 10%;' slot="empty">
    <img src="@/assets/icon/null2.png" alt="">
    <p class="empty-p">{{title}}</p>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:'暂无数据'
    }
  }
}
</script>

<style>

</style>