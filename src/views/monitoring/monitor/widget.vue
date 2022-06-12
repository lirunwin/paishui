<template>
  <div style="padding-top: 15px">
    <MonitorStage :view="view" :isActive="isActive" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MonitorStage from './pages/Monitor.vue'

@Component({
  name: 'Monitor',
  components: { MonitorStage }
})
export default class Monitor extends Vue {
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  view = null
  mounted() {
    this.view = (this.$attrs.data as any).mapView
  }
}
</script>

<style lang="scss" scoped></style>
