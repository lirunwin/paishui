<template>
  <div v-show="false"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { eventsPage, IEvent } from '../../api'

@Component({})
export default class MainMap extends Vue {
  /** 地图实例 */
  @Prop({ type: Object }) view!: any
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  events: {
    /** 紧急事件 */
    urgency: IEvent[]
    /** 普通事件 */
    ordinary: IEvent[]
  } = { urgency: [], ordinary: [] }
  loading: boolean = false

  /** 当天上报的警情 */
  async getEvents() {
    this.loading = true
    try {
      const {
        result: { records }
      } = await eventsPage({ current: 1, size: 9999999, createTime: this.$moment().format('YYYY-MM-DD') })

      this.events.urgency = records.filter((item) => item.category === '2')
      this.events.ordinary = records.filter((item) => item.category === '1')
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  }

  preparing() {
    this.getEvents()
  }

  mounted() {
    this.preparing()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.preparing()
    }
  }
}
</script>

<style lang="scss">
</style>