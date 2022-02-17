<template>
  <!-- 弹出框 -->
  <div>
    <div
      class="content"
    >
      <div class="hander">
        <span>{{ title }}</span>
        <span class="close" @click="handelClose(item)">
          <i class="el-icon-close" />
        </span>
      </div>
      <slot />
    </div>
  </div>

</template>

<script>
export default {
  name: 'HalfPanel',
  components: { },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
    handelClose(data) {
      this.$store.dispatch('map/handelClose', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  min-height: 200px;
  position: absolute;
  bottom: 0;
  top: 55%;
  z-index: 2;
  .hander{
    color: #fff;
    height: 34px;
    line-height: 34px;
    background: #2D74E7;
    padding: 0 5px;
    position: relative;
    .close{
      position: absolute;
      right: 5px;
      cursor: pointer;
    }
  }

}
</style>
