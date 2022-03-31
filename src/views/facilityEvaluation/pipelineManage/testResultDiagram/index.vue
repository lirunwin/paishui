<!--vue文件模板-->

<template>
  <div class="app-container">
    <div class="hander_car">

      <div class="btn_box">
          <p>这是检测成果专题图</p>
        <!-- <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button type="success" size="small" @click="handleAddCar">新增车辆</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import {Vue,Component,Prop,Watch} from 'vue-property-decorator'
@Component({
  name:'Car',
  components:{}
})
export default class template extends Vue {
  mounted() {
    
  }
  created() {
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
