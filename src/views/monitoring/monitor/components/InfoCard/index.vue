<template>
  <el-card class="info-card" :body-style="{ fontSize: '14px', padding: '15px' }">
    <div slot="header" class="info-card-title">
      <span>{{ (detail.monitorSiteVo || {}).name }}</span>
      <div>
        <el-button type="text" icon="el-icon-map-location" style="height: 1.2em; padding: 0" />
        <el-button
          type="text"
          icon="el-icon-s-tools"
          @click="() => $emit('distribute', data)"
          style="height: 1.2em; padding: 0"
        />
        <el-button type="text" icon="el-icon-data-line" style="height: 1.2em; padding: 0" />
      </div>
    </div>
    <h3 :style="`color:${monitorStatusColor[detail.isAlarm ? '2' : detail.status]}`">{{ noticeType }}</h3>
    <div class="item" v-for="item of detail.paraVoList" :key="item.name">
      <span class="param-name">
        {{ item.name }} 【{{ (item.siteDeviceParaVo || {}).levelName }}: {{ (item.siteDeviceParaVo || {}).lower }}-{{
          (item.siteDeviceParaVo || {}).upper
        }}】
      </span>
      <span>
        <span :style="`color:${levelColors[String((item.siteDeviceParaVo || {}).level)]}`"
          >{{ item.value }} {{ item.unit }}</span
        >
        <span v-html="arrow[String(item.direction)]" />
      </span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { monitorAutoRefreshInterval, monitorStatusColor, pointState } from '@/utils/constant'
import { getMonitorItemCurrentInfoById, IDictionary, IMonitorItem, IMonitorItemDetail } from '@/views/monitoring/api'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({ name: 'InfoCard' })
export default class InfoCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: IMonitorItem
  @Prop({ type: Array, default: () => [] }) colors!: IDictionary[]
  @Prop({ type: Boolean, default: false }) monitoring!: boolean
  arrow = { '1': '&uarr;', '0': '', '-1': '&darr;' }

  detail: Partial<IMonitorItemDetail> = {}
  monitorStatusColor = monitorStatusColor
  get noticeType() {
    const { status } = this.detail
    return pointState[String(status)]
  }

  get levelColors() {
    return this.colors.reduce<{ [x: string]: string }>((data, current) => {
      const { notes: color, codeValue } = current
      data[codeValue] = color
      return data
    }, {})
  }

  async fetchDetail() {
    const { id } = this.data || {}
    const { result } = await getMonitorItemCurrentInfoById(id)
    this.detail = result
  }

  timer = null

  stopInterval() {
    if (this.timer) clearInterval(this.timer)
  }

  startInterval() {
    this.stopInterval()
    this.fetchDetail()
    this.timer = setInterval(() => {
      this.fetchDetail()
    }, monitorAutoRefreshInterval * 2)
  }

  @Watch('data', { immediate: true })
  onDataChange(data) {
    if (data) {
      this.startInterval()
    } else {
      this.stopInterval()
    }
  }

  @Watch('monitoring')
  onMonitoringChange(monitoring) {
    if (!monitoring) this.stopInterval()
  }

  beforeDestroy() {
    this.stopInterval()
  }
}
</script>

<style lang="scss" scoped>
.info-card {
  width: 366px;
  /deep/ .el-card__header {
    padding: 15px;
  }
  /deep/ .el-card__body {
    width: 366px;
    padding: 15px;
  }

  &-title {
    display: flex;
    align-items: center;
    font-weight: 600;
    > span {
      flex: 1 1 auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    > div {
      flex: 0 0 auto;
    }
  }
  .type {
    margin-top: 0;
    font-size: 16px;
  }

  .item {
    margin-top: 10px;
    display: flex;
    align-items: top;
    justify-content: space-between;
    > span:last-child {
      font-weight: 600;
    }
  }
  .param-name {
    color: rgba(#333, 60%);
  }
}
</style>
