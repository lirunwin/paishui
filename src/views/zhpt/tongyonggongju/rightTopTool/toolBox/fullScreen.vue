
<template>
</template>

<script>
export default {
  props: {
    map:null
  },
  data() {
    return {
    }
  },
  mounted(){
    this.setScreenFull();
  },
  methods: {
    // 全屏
    setScreenFull() {
      const isFullScreen=document.fullscreenElement;
      if(isFullScreen){
        if(document.exitFullscreen){
          document.exitFullscreen();
        }else if(document.msExitFullscreen){
          document.msExitFullscreen();
        }else if(document.mozCancelFullscreen){
          document.mozCancelFullscreen();
        }else if(document.webkitCancelFullscreen){
          document.webkitCancelFullscreen();
        }
      }else{
        const fullScreen=document.documentElement;
        if(fullScreen){
          if(fullScreen.requestFullscreen){
            fullScreen.requestFullscreen();
          }else if(fullScreen.mozRequestFullscreen){
            fullScreen.mozRequestFullscreen();
          }else if(fullScreen.msRequestFullscreen){
            fullScreen.msRequestFullscreen();
          }else if(fullScreen.webkitRequestFullscreen){
            fullScreen.webkitRequestFullscreen();
          }
        }
      }
    },
  }
}
</script>
