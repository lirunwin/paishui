<template>
  <div style="padding-top: 15px">
    <MonitorStage :view="view" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MonitorStage from './pages/Monitor.vue'

@Component({
  name: 'Monitor',
  components: { MonitorStage }
})
export default class Monitor extends Vue {
  view = null
  mounted() {
    this.view = (this.$attrs.data as any).mapView
  }
}
</script>

<style lang="scss" scoped></style>
