<template>
  <div class="TableLegend">
    <div v-show="showContent" style="position: absolute; left: 140px; margin-top: 2px;">
      <slot name="title"></slot>
    </div>
    <div @click="show" style="background: #f0f0f0; font-size: 17px; font-weight: bold; color: #555555; padding: 7px; cursor: pointer;" ref="label">
      <span style="padding-left: 12px; border-left: 5px solid #2d74e7;"></span>
      <i ref="upAndDown" style="font-weight: bold; float: right; transform: rotateZ(0deg); transition: 0.4s;" class="el-icon-arrow-down"></i>
    </div>
    <el-collapse-transition>
      <div v-show="showContent">
        <slot />
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  name: 'TableLegend',
  components: {},
  // props: ['label', 'isopen'],
  props:{
    label:{
      type:String,
      required: true
    },
    isopen: {
      type:String,
      required: true
    }
  },
  data() {
    return {
      openstate: true,
      showContent: true,
    }
  },
  watch: {
    isopen(newV, oldV) {
      console.log("isOpen："+ JSON.stringify(newV) )
       this.showContent = this.isopen !== 'false'
        this.$refs.upAndDown.style.transform = 'rotateZ(' + (this.showContent ? '' : '18') + '0deg)'
    },
  },
  mounted() {
    this.$refs.label.children[0].innerHTML = this.label
    console.log("isOpen："+JSON.stringify(this.isopen))
    this.showContent = this.isopen !== 'false'
    this.$refs.upAndDown.style.transform = 'rotateZ(' + (this.showContent ? '' : '18') + '0deg)'
  },
  methods: {
    show: function() {
      this.showContent = !this.showContent
      this.$refs.upAndDown.style.transform = 'rotateZ(' + (this.showContent ? '' : '18') + '0deg)'
    }
  }
}
</script>
