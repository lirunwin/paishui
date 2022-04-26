
<template>
</template>

<script>
import html2Canvas from 'html2canvas'
export default {
  props: {
    map:null
  },
  data() {
    return {
    }
  },
  mounted(){
    this.getImg();
  },
  methods: {
    // 截图方法
    getImg() {
      const mapViewHtml = $('.ol-viewport');
      // 存在多个 viewport , 分屏功能bug
      let viewImg = mapViewHtml[mapViewHtml.length - 2]
      html2Canvas(viewImg, {
        backgroundColor: null, // 画出来的图片有白色的边框,不要可设置背景为透明色（null）
        useCORS: true, // 支持图片跨域
        scale: 1 // 设置放大的倍数
      }).then(canvas => {
        // 如果你需要下载截图，可以使用a标签进行下载
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = '地图快照';
        a.click();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
