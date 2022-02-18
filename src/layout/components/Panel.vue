<template>
  <!-- 弹出框 -->
  <div>
    <div v-drag class="content">
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

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  name: "Panel",
})
export default class Panel extends Vue {
  @Prop({ default: {} }) item: object;
  @Prop({ default: "" }) title: string;
  handelClose(data) {
    this.$store.dispatch("map/handelClose", data);
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 350px;
  border: 3px solid #2d74e7;
  min-height: 100px;
  position: absolute;
  top: 70px;
  right: 20px;
  z-index: 1;
  .hander {
    color: #fff;
    height: 34px;
    line-height: 34px;
    background: #2d74e7;
    padding: 0 5px;
    position: relative;
    .close {
      position: absolute;
      right: 5px;
      cursor: pointer;
    }
  }
}
</style>
