<template>
</template>

<script>
import { esriConfig, appconfig } from "staticPub/config";
import { mapUtil } from '../../../common/mapUtil/common';
export default {
    props: {
        map: null,
        rootPage: null,
    },
    data () {
        return {
            legends: []
        }
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
        },
        setLegend () {
            // let promises = this.legends.map(legend => mapUtil.getLegend(legend.name))
            // Promise.all(promises).then(resArr => {
            //     console.log('图例信息')
            //     let htmlStr = resArr.filter(res => res && res.data).map((res, index) => {
            //         let blob = new Blob([res.data], { type: 'image/png' })
            //         return `<div><img src='${URL.createObjectURL(blob)}'><span>${this.legends[index].title}</span></div>`
            //     }).join("")
            //     this.rootPage.$refs.legend.innerHTML = htmlStr
            // })
            console.log('图例', this.legends)
            let url = this.legends.legendUrl
            let dataSetName = this.legends.name
            let legendSourceName = this.legends.legendSource
            let htmlStr = this.legends.sublayers.map((group, index) => {
                let groupName = group.name.replace('#', '.')
                return group.sublayers.map(sub => {
                    let subName = sub.name.replace('#', '.')
                    let legendUrl = `${url + subName}@@${groupName}@@${dataSetName}/legend`
                    return `<div><img src='${legendUrl}'><div style='display:inline-block;font-size:14px'>${sub.title}</div></div>`
                })
            }).flat().join('')
            this.rootPage.$refs.legend.innerHTML = htmlStr

        // $.ajax({
        //     url: appconfig.gisResource.legend[0].url + '/legend?f=pjson', 
        //     type: 'GET',
        //     success: legendJson => {
        //       let resData = JSON.parse(legendJson)
        //       if (resData.error) {
        //         return this.$message.error('图例加载失败:' + data.error.message)
        //       }
        //       let layerData = resData.layers
        //       let htmlStr = layerData.map(layer => {
        //           let label = layer.layerName
        //           return layer.legend.map(legend => {
        //              return `<div><img src='data:image/png;base64,${legend.imageData}'><span>${legend.label || label}</span></div>`
        //           }).join("")
        //       })
              
        //     },
        //     error: error => console.error(error)
        //   })
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
        this.legends = mapUtil.getAllSubLayerNames('pipemap', 'smlayergroup')
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