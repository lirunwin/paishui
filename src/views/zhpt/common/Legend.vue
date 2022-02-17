<template>
  <div id="Legend" style="position: relative; width: 100%; padding: 5px; min-height: 30px;">
    <div ref="labelDiv" style="position: relative; width: 100%; height: 20px; color: #666; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e5e5e5;">
      <span v-if="isRequired" style="color:red;">* </span>{{ label }}
      <el-tooltip class="item" effect="dark" :content="title" placement="right">
        <i class="el-icon-info" ref="info"></i>
      </el-tooltip>
      <i ref="upAndDown" style="font-weight: bold; float: right; transform: rotateZ(0deg); transition: 0.4s;" class="el-icon-arrow-down"></i>
    </div>    
    <div ref="content" style="height: calc(100% - 25px); position: relative; width: 100%; margin-top: 5px;">
      <!-- <el-collapse-transition>
        <slot v-show="showContent" />
      </el-collapse-transition> -->
      <el-collapse-transition>
        <div style="height:100%;" v-show="showContent">
          <slot />
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Legend',
  components: {},
  props: ['label', 'isopen', 'title', 'canChange','isRequired'],
  data() {
    return {
      openstate: true,
      content: undefined,
      showContent: true
    }
  },
  watch: {
    isopen(e) {
      if(e === '') return
      this.showContent = e
      this.$refs.upAndDown.style.transform = 'rotateZ(' + (e ? '' : '18') + '0deg)'
    }
  },
  mounted() {
    // this.$refs.label.children[0].innerHTML = this.label
    this.showContent = this.isopen != 'false'
    // this.openstate = (!(this.isopen == 'false'))
    // this.content = this.$refs.content
    if(!this.title) {
      this.$refs.info.style.display = 'none'
    }
    this.$refs.upAndDown.style.transform = 'rotateZ(' + (this.showContent ? '' : '18') + '0deg)'

    var labelDiv = this.$refs.labelDiv
    if(this.canChange == false) {
      labelDiv.removeChild(this.$refs.upAndDown)
    } else {
      labelDiv.onclick = function() { this.changePanel() }.bind(this)
      labelDiv.style.cursor = 'pointer'
    }
  },
  methods: {
    changePanel() {
      this.showContent = !this.showContent
      // this.openstate = !this.openstate
      // this.content.style.display = this.openstate ? '' : 'none'
      this.$refs.upAndDown.style.transform = 'rotateZ(' + (this.showContent ? '' : '18') + '0deg)'
    }
  }
}
</script>

