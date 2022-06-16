<template>
  <div class="base-title" :style="bold ? 'font-weight: 600' : ''"><slot /></div>
</template>

<script>
export default {
  name: 'BaseTitle',
  props: {
    bold: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-title {
  padding: 4px 0 4px 10px;
  border-left: 3px solid $--color-primary;
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
