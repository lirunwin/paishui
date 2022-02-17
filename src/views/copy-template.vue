<template>
  <div class="app-container">
    <div class="hander_car">

      <div class="btn_box">
        <!-- <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button type="success" size="small" @click="handleAddCar">新增车辆</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Car',
  components: { },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.hander_car{
  // display: inline-block;
  line-height: 54px;
}
.btn_box{
  display: inline-block;
  margin-left: 20px;
}
</style>
