<template>
</template>

<script>
import { esriConfig, appconfig } from "staticPub/config";
export default {
    props: {
        map: null,
        rootPage: null,
    },
    methods: {
        close () {
            this.showlegend(false)
        },
        showlegend (visible) {
            if (this.$store.state.gis.activeHeaderItem === 'psjc') {
                this.rootPage.showLegend('testReport', visible)
            } else {
                this.rootPage.$data.labelShow = visible
                if (this.rootPage.$data.labelShow) this.setLegend()
            }
            console.log("加载图例")
        },
        setLegend () {
            $.ajax({
            url: appconfig.gisResource.legend[0].url + '/legend?f=pjson', 
            type: 'GET',
            success: legendJson => {
              let resData = JSON.parse(legendJson)
              if (resData.error) {
                return this.$message.error('图例加载失败:' + data.error.message)
              }
              let layerData = resData.layers
              let htmlStr = layerData.map(layer => {
                  let label = layer.layerName
                  return layer.legend.map(legend => {
                     return `<div><img src='data:image/png;base64,${legend.imageData}'><span>${legend.label || label}</span></div>`
                  }).join("")
              })
              this.rootPage.$refs.legend.innerHTML = htmlStr.join("")
            },
            error: error => console.error(error)
          })
        },
        keyUpEvent (e) {
            if (e.keyCode == 27) {
                this.close()
                document.removeEventListener('keyup', this.keyUpEvent)
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            document.addEventListener('keyup', this.keyUpEvent)
        })
        this.showlegend(true)
        this.$notify({
            title: '操作提示',
            message: '按ESC键关闭图例',
            type: 'success',
            position: 'bottom-right'
        });
    }

}
</script>

<style>

</style>