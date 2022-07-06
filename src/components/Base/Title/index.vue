<template>
  <div :class="{ 'tf-title': true, 'tf-title--top': alignTop }">
    <div :class="{ content: true, 'content--bold': isBold }"><slot /></div>
    <div class="append"><slot name="append" /></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'Title' })
export default class Title extends Vue {
  @Prop({ type: Boolean, default: true }) isBold!: boolean
  @Prop({ type: Boolean, default: false }) alignTop!: boolean
}
</script>

<style lang="scss" scoped>
.tf-title {
  padding: 4px 0 4px 10px;
  margin-bottom: 15px;
  font-size: 16px;
  position: relative;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &--top {
    align-items: center;
  }
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: $--color-primary;
  }
  .content {
    flex: 1 1 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 3em;
  }
  .append {
    flex: 0 0 auto;
  }
}
</style>
