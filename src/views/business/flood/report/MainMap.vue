<template>
  <div v-show="false"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { floodPage, IFlood } from '../../api'
@Component({})
export default class MainMap extends Vue {
  /** 地图实例 */
  @Prop({ type: Object }) view!: any
  @Prop({ type: Boolean, default: false }) isActive!: boolean
  floods: {
    /** 警情 */
    urgency: IFlood[]
    /** 非警情 */
    ordinary: IFlood[]
  } = { urgency: [], ordinary: [] }
  loading: boolean = false

  /** 当天上报的警情 */
  async getEvents() {
    this.loading = true
    try {
      const {
        result: { records }
      } = await floodPage({
        current: 1,
        size: 9999999,
        createTime: this.$moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      })

      this.floods.urgency = records.filter((item) => item.police)
      this.floods.ordinary = records.filter((item) => !item.police)
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

<style lang="scss"></style>
