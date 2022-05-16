<template>
  <div id="troubleReport" class="troubleReport">
    <div class="troubleinfo" />
    <div class="operate">
      <el-button>取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>

  </div>
</template>
<script>
export default {
  name: 'TroubleReport',
  components: {
  },
  props: ['data'],
  data() {
    return {
    }
  },
  watch: {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.troubleReport {
  position: relative;
  height: 600px;
  width: 100%;
  overflow-y: auto;
  padding: 5px;
  .troubleinfo{
    position: relative;
    height: 700px;
    width: 100%;
    background-image: url('../images/troubleReport.png');
    background-size: 100% 100%;
  }
  .operate{
      position:relative;
      height:50px;
      margin-top: 8px;
      text-align:center;
  }
}
</style>
