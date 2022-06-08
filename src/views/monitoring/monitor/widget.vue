<template>
  <div style="padding-top: 15px">
    <MonitorStage />
    <CommonPopup
      :popupShow="popupShow"
      :popupPosition="[104.75231999734498, 31.525963399505617]"
      :mapView="view"
      headerStyle=""
      isSetCenter
    >
      <InfoCard @distribute="onDistribute" />
    </CommonPopup>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MonitorStage from './pages/Monitor.vue'
import InfoCard from './components/InfoCard/index.vue'
import CommonPopup from '@/components/CommonPopup/index.vue'

@Component({
  name: 'Monitor',
  components: { MonitorStage, InfoCard, CommonPopup }
})
export default class Monitor extends Vue {
  drawer = true
  view = null
  missionVisible = false
  current = {}
  popupShow = true
  onDistribute(obj) {
    this.popupShow = false
    this.current = obj
    this.missionVisible = true
  }
  mounted() {
    this.view = (this.$attrs.data as any).mapView
  }
}
</script>

<style lang="scss" scoped>
</style>
