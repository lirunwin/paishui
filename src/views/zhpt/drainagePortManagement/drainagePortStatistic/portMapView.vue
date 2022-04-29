<template>
    <div class="portMapView" id="portMapView">
        <!-- 左下角工具栏 -->
        <leftBottomTool style="bottom:20px"
            :toolList="leftBottomTool.children"
            :map="view"
            v-if="leftBottomTool && leftBottomTool.children && leftBottomTool.children.length > 0"
        ></leftBottomTool>
    </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol'
import { esriConfig, appconfig } from 'staticPub/config'
import leftBottomTool from '@/views/zhpt/tongyonggongju/leftBottomTool/widget.vue'
export default {
    name:"portMapView",//
    components: {
        leftBottomTool
    },
    data(){
        return{
            view:null,
            leftBottomTool:null
        }
    },
    mounted(){
        this.initMap();
    },
    methods:{
        initMap(){
            let { initCenter, initZoom } = appconfig
            this.view = new Map({
                target: 'portMapView',
                view: new View({
                    center: initCenter,
                    zoom: initZoom,
                    projection: 'EPSG:4326'
                })
            })
            this.addLayers()
        },
        addLayers(){
            let layerResource = appconfig.gisResource['iserver_resource'].layers
            layerResource.forEach((layerConfig) => {
                let { name, url, parentname, id, visible = true } = layerConfig
                let layer = new TileLayer({
                    name,
                    parentname,
                    id,
                    visible,
                    source: new TileSuperMapRest({
                        url,
                        crossOrigin: 'anonymous', // 是否请求跨域操作
                        wrapX: true
                    }),
                    properties: {
                        projection: 'EPSG:4326'
                    }
                })
                this.view.addLayer(layer)
                this.$nextTick(this.controlToolDisplay)
            })
        },
        /**
         * 根据权限控制地图四个角的工具栏的展示
         */
        controlToolDisplay() {
            //本功能必须在权限管理-系统管理-模块管理的系统新增中分配leftTopTool,leftBottomTool,rightTopTool,rightBottomTool四个类型
            //这四个类型分别对应地图工具栏的左上角,左下角,右上角,右下角
            //这四个工具栏不在左边的功能列表中展示（改设置在src\layout\components\Sidebar\index.vue中）
            if (this.$store.state && this.$store.state.routeSetting && this.$store.state.routeSetting.routes) {
            const allModel = this.$store.state.routeSetting.routes //获取所有功能
            /**工具栏识别的字符集合*/
            const toolBoxList = ['leftBottomTool']
            const toolcomponentList = {
                leftBottomTool,
            }
            //根据模块管理将组件注入
            allModel.forEach((item) => {
                let index = toolBoxList.findIndex((val) => {
                return val == item.type
                })
                if (index != -1) {
                this[item.type] = item || []
                let temp = this.getComponents(item.type)
                temp.forEach((item2) => {
                    toolcomponentList[item.type]['components'][item2.name] = item2.component
                })
                }
            })
            }
        },
        /**
         * 获取指定层级下面的组件
         * @param typeString 指定层级的名称
         * */
        getComponents(typeString) {
            let temp = this.$store.state.routeSetting.addRoutes.find((val) => {
            return val.name && val.name == typeString
            })
            return temp.children || []
        }
    }
}
</script>

<style lang="scss" scoped>
    .portMapView{
        height: 100%;
        width: 50%;
        // float: left;
        /deep/ .ol-zoom {
        display: none !important;
        }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
</style>