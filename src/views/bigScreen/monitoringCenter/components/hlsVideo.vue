<template>
    <video  ref="video_player" width=100% height=100% autoplay muted controls>
    </video>
</template>

<script>
import Hls from "hls.js"
export default {
    name:"hlsVideo",//hls视频播放
    data(){
        return{
            hlsPlayer:null
        }
    },
    mounted(){
        this.initVideo()
    },
    methods:{
        initVideo(){
            let url = 'http://223.87.72.104:7086/live/cameraid/1000000%240/substream/1.m3u8';
            const video = this.$refs.video_player
            if (this.hlsPlayer != null) {
                this.hlsPlayer.destroy();
            }
			this.hlsPlayer = new Hls();
			this.hlsPlayer.loadSource(url);
			this.hlsPlayer.attachMedia(video);
			this.hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, () => {
				this.hlsPlayer.loadSource(url)
			})
			this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				video.play()
			});
        }
    },
    destroyed(){
        this.hlsPlayer.destroy()
    }
}
</script>

<style>

</style>