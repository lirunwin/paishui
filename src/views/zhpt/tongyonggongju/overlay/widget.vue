<template>
    <div ref="overlay" style="display: none; width: 600px; height: 400px; position: absolute;transition: 0.3s;transition-property: width,height;">
        <div style="width:100%;height:30px;background:#2D74E7;padding:5px;color:#fff;">
            <span style="line-height: 20px;">{{ title }}</span>
            <i ref="close" class="el-icon-close" style="float:right;font-size:20px;cursor: pointer; font-weight: bold;"></i>
            <i ref="moreInfoShow" class="el-icon-copy-document" style="float:right;font-size:20px;cursor: pointer; font-weight: bold;margin-left:5px;"></i>
        </div>
        <div id="overlayContant" ref="thing" style="width:100%;height:calc(100% - 29px);background:#fff;border: 1px solid #2D74E7;overflow: auto;padding:10px;">
        </div>
    </div>
</template>

<script>
export default {
    name: 'overlay',
    props: { param: Object },
    data() {
        return {
            title: ''
        }
    },
    mounted: function() {
        var overlay = this.$refs.overlay
        var mapView = this.mapView = this.param
        var isOpen = false
        var cache
        mapView.TF_overlay = {
            show:(position, title) => {
                if(title) this.title = title
                overlay.style.display = ''
                var divLocation = mapView.toScreen(cache = position)
                overlay.style.left = divLocation.x + 'px'
                overlay.style.top = divLocation.y + 'px'
                if(this.isOnMove) this.extentMove.remove()
                this.isOnMove = true
                this.extentMove = mapView.watch('extent', () => {
                    if(isOpen) return
                    var ne = mapView.toScreen(cache)
                    overlay.style.left = ne.x + 'px';
                    overlay.style.top = ne.y + 'px';
                })
                return this.$refs.thing
            },
            off:() => {
                this.$refs.thing.innerHTML = ''
                isOpen = false                
                moreInfoShow.className = 'el-icon-copy-document'
                overlay.style.cssText = 'display:none;width: 600px; height: 400px; position: absolute; transition: 0.3s;transition-property: width,height;'
                if(this.isOnMove) {
                    this.extentMove.remove()
                    this.isOnMove = false
                }                
            }
        }
        this.$refs.close.onclick = mapView.TF_overlay.off
        var moreInfoShow = this.$refs.moreInfoShow
        moreInfoShow.onclick = () => {
            if(isOpen = !isOpen) {
                moreInfoShow.className = 'el-icon-minus'
                overlay.style.cssText = "width: 80%; height: 80%; position: absolute; transition: 0.3s;left: 10%;top: 10%;transition-property: width,height;"
            }
            else {
                moreInfoShow.className = 'el-icon-copy-document'
                var ne = mapView.toScreen(cache)
                overlay.style.cssText = "width: 600px; height: 400px; position: absolute; transition: 0.3s;left: " + ne.x + 'px;top: '+ ne.y + 'px;transition-property: width,height;'
            }
        }
    },
    destroyed: function() {
        if(this.isOnMove) this.extentMove.remove()
        delete this.mapView.TF_overlay
    }
}
</script>
<style type="scss" scoped>
#overlayContant >>> .flexDiv {
    width: 33%;
    min-height: 30px;
    line-height: 30px;
    margin-top: 10px;
    color: #606266;
}
#overlayContant >>> .flexDiv .flexTitle{
    min-width: 90px;
    display: inline-block;
    text-align: right;
}
#overlayContant >>> .flexDiv .flexInfo{
    display: inline-block;
    width: calc(100% - 90px);
}
</style>