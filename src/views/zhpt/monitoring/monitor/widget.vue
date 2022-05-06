<template>
  <div class="container" :style="`background-image: url('${mapPng}')`">
    <el-tabs type="border-card" closable :class="`tabs ${drawer ? 'show' : ''}`" v-show="drawer" v-model="tab">
      <el-tab-pane lazy v-for="page of pages" :key="page.name" :name="page.name">
        <span slot="label">{{ page.label }}</span>
        <component :is="page.component" />
      </el-tab-pane>
    </el-tabs>
    <WarningCard />
    <InfoCard @distribute="onDistribute" />
    <MissionForm :visible.sync="missionVisible" :title="`工单`" :data="current" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import mapPng from './map.png'
import MonitorStage from './pages/Monitor.vue'
import RoutePlan from './pages/RoutePlan.vue'
import WarningCard from './components/WarningCard/index.vue'
import InfoCard from './components/InfoCard/index.vue'
import MissionForm from './components/MissionForm/index.vue'

@Component({ name: 'Monitor', components: { MonitorStage, RoutePlan, WarningCard, InfoCard, MissionForm } })
export default class Monitor extends Vue {
  mapPng = mapPng
  drawer = true
  tab = 'monitor'
  pages = [
    { name: 'monitor', label: '监控台', component: 'MonitorStage' },
    { name: 'route-plan', label: '路径规划', component: 'RoutePlan' }
  ]
  missionVisible = false
  current = {}
  onDistribute(obj) {
    this.current = obj
    this.missionVisible = true
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
