<template>
  <div class="container">
    <el-tabs type="border-card" closable :class="`tabs ${drawer ? 'show' : ''}`" v-show="drawer" v-model="tab">
      <el-tab-pane lazy v-for="page of pages" :key="page.name" :name="page.name">
        <span slot="label">{{ page.label }}</span>
        <component :is="page.component" />
      </el-tab-pane>
    </el-tabs>
    <WarningCard />
    <MissionForm :visible.sync="missionVisible" :title="`工单`" :data="current" />
    <CommonPopup
      :popupShow="popupShow"
      :popupPosition="[104.75231999734498, 31.525963399505617]"
      :mapView="view"
      isSetCenter
    >
      <InfoCard @distribute="onDistribute" />
    </CommonPopup>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MonitorStage from './pages/Monitor.vue'
import RoutePlan from './pages/RoutePlan.vue'
import WarningCard from './components/WarningCard/index.vue'
import InfoCard from './components/InfoCard/index.vue'
import MissionForm from './components/MissionForm/index.vue'
import CommonPopup from '@/components/CommonPopup/index.vue'

@Component({
  name: 'Monitor',
  components: { MonitorStage, RoutePlan, WarningCard, InfoCard, MissionForm, CommonPopup }
})
export default class Monitor extends Vue {
  drawer = true
  tab = 'monitor'
  pages = [
    { name: 'monitor', label: '监控台', component: 'MonitorStage' },
    { name: 'route-plan', label: '路径规划', component: 'RoutePlan' }
  ]
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
.container {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
}

.tabs {
  position: absolute;
  right: 0;
  top: 0;
  width: 450px;
  height: 100%;
  transform: translateX(100%);
  transition: translate 500ms;
  &.show {
    transform: translateX(0);
  }
}
</style>
