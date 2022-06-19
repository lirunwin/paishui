<template>
  <div v-show="false"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IVehicleArchive } from '../../api'
@Component({})
export default class MainMap extends Vue {
  /** 地图实例 */
  @Prop({ type: Object }) view!: any
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  /** 当前勾选的 */
  @Prop({ type: Array, default: () => [] }) selected!: IVehicleArchive[]
  /** 当前点击的行 */
  @Prop({ type: Object, default: () => ({}) }) data!: IVehicleArchive

  // @Watch('isActive')
  // refetchData(active: boolean) {
  //   if (active) {
  //   }
  // }
}
</script>

<style lang="scss">
</style>