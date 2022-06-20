<template>
  <el-card class="info-card">
    <el-row type="flex" justify="space-between" align="center">
      <span class="title">
        <span>阀门</span>
        (张三 2022-02-02 12:12:12)
      </span>
      <span class="status">审核不通过</span>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div style="margin-top: 15px"><span>巡查对象: </span>阀门FS123213</div>
        <div style="margin-top: 15px"><span>巡查说明: </span>说明说明说明说明说明说明</div>
        <div style="margin-top: 15px"><span>审核信息: </span>照片拍摄不想清晰</div>
      </el-col>
      <el-col :span="10">
        <el-carousel :interval="3000" arrow="always">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3>{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IVehicleArchive } from '../../api'

@Component({})
export default class InfoCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IVehicleArchive
}
</script>

<style lang="scss" scoped>
.info-card {
  width: 460px;
  font-size: 14px;
  color: $--color-text-regular;
  .title {
    padding: 3px 0;
    span {
      font-weight: 600;
      color: $--color-text-primary;
    }
  }
  .status {
    padding: 3px 8px;
    color: $--color-danger;
    background-color: lighten($--color-danger, 40%);
  }
}
</style>
