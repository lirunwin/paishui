<template>
</template>

<script>
import { esriConfig, appconfig } from "staticPub/config";
export default {
    props: {
        map: null,
        rootPage: null
    },
    methods: {
        showlegend () {
            console.log("加载图例")
            this.rootPage.$data.labelShow = !this.rootPage.$data.labelShow
            if (this.rootPage.$data.labelShow) this.setLegend()
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
        }
    },
    mounted () {
        this.showlegend()
    }

}
</script>

<style>

</style>