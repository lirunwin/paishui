<template>
  <div class="route-card" :style="`background-image:url(${plan.type === 'person' ? svg.user : svg.car})`">
    <div class="route-card-left">
      <div :class="`route-card-distance ${backup ? 'backup' : ''}`">{{ plan.distance }}公里</div>
      <div class="route-card-btn">
        <el-button type="text" icon="el-icon-map-location" />
        <el-button type="text" icon="el-icon-setting" />
      </div>
    </div>
    <div class="route-card-right">
      <div class="route-card-title">抢维修人员: {{ plan.dep }} {{ plan.name }}</div>
      <div class="route-card-tel">联系电话: {{ plan.tel }}</div>
      <div class="route-card-address">位置: {{ plan.address }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import car from './car.svg'
import user from './user.svg'

@Component({ name: 'RouteCard', components: {} })
export default class RouteCard extends Vue {
  @Prop({ type: Boolean }) backup!: boolean
  @Prop({ type: Object, default: () => ({}) }) plan!: {
    id?: string
    type?: string
    name?: string
    dep?: string
    tel?: string
    distance?: string
    address?: string
    car?: string
  }
  svg = { car, user }
  mounted() {
    console.log(car)
  }
}
</script>

<style lang="scss" scoped>
.route-card {
  display: flex;
  align-items: center;
  border: 1px solid #dedede;
  background-repeat: no-repeat;
  background-position: center right;
  padding: 9px 15px;
  margin-bottom: 1em;
  &-left {
    flex: 0 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-right {
    margin-left: 15px;
    flex: 1 1 auto;
    font-size: 14px;
    line-height: 1.6;
  }
  &-title {
    font-weight: 600;
  }
  &-distance {
    font-size: 20px;
    color: $--color-primary;
    font-weight: 600;
    &.backup {
      color: #333333;
      font-weight: normal;
    }
  }
  &-btn {
    margin-bottom: -10px;
  }
  &-tel,
  &-address {
    color: rgba(51, 51, 51, 0.6);
  }
}
</style>
