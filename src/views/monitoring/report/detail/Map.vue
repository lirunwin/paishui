<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { IPointConnectDevice } from '../../api'

@Component({})
export default class Map extends Vue {
  @Prop({ type: Object, default: () => ({ all: false, selected: false }) }) display!: {
    /** 显示所有监测点 */
    all: boolean
    /** 显示选中监测点 */
    selected: boolean
  }
  @Prop({ type: Array, default: () => [] }) points!: (IPointConnectDevice & {
    /** 是否选中 */
    selected: boolean
  })[]

  @Emit('change')
  deviceChange(pointInfo: IPointConnectDevice) {
    return pointInfo
  }
}
</script>

<style lang="scss"></style>
