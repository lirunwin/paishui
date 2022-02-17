<template>
  <el-tabs :tab-position="tabPosition">
    <el-tab-pane label="样式">
      换个颜色，换种心情～
      <ul>
        <li v-for="(item,idx) in menu" :key="idx" :class="idx == index ? 'active' : ''" @click="son(item,idx)">
          <div :class="item.style">
            <i class="current-theme" />
          </div>
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
    </el-tab-pane>
    <!-- <el-tab-pane label="首页">首页</el-tab-pane>
    <el-tab-pane label="快捷">快捷</el-tab-pane> -->
  </el-tabs>
</template>

<script>
export default {
  name: 'Configure',
  components: { },
  data() {
    return {
      tabPosition: 'left',
      menu: [
        {
          name: '墨蓝',
          type: 'inkBlueTheme',
          style: 'blue-ink'
        },
        {
          name: '宝蓝',
          type: 'royalBlueTheme',
          style: 'blue-square'
        }
      ],
      index: 0
    }
  },
  created() {
  },
  methods: {
    son(item, idx) {
      this.index = idx
      //  设置主题
      // this.$store.dispatch('settings/setThem', item.type)
    }
  }
}
</script>

<style lang="scss" scoped>
ul{
  list-style: none;
  // height: 400px;
  padding-left: 0;
  li{
    cursor: pointer;
    float: left;
    margin: 0 10px;
    border: 1px solid #fff;
    div{
      width: 64px;
      height: 64px;
      display: block;
      margin: 12px;
      border-radius: 4px;
      border: none;
      box-shadow: none;
      position: relative;
    }
    span{
      display: inline-block;
      text-align: center;
      width: 88px;
      height: 30px;
      line-height: 30px;
    }
  }
}
.blue-square{
  background:linear-gradient(180deg,#327ed3,#327ed3 0,#8ab6e6 100%,#8ab6e6 0)
}
.blue-ink{
 background:linear-gradient(180deg,#2f4254,#2f4254 0,#7595b3 100%,#7595b3 0)
}
.obsidian{
  background:linear-gradient(180deg,#383838,#383838 0,#8b8b8b 100%,#8b8b8b 0)
}
.active{
  border: 1px solid #e4e4e4;
  .current-theme{
    position: absolute;
    width: 16px;
    height: 16px;
    top: -8px;
    left: 56px;
    background-color: #409eff;
    border-radius: 8px;
    &::after{
      transform: rotate(45deg) scaleY(1);
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 6px;
      position: absolute;
      top: 3px;
      // transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }
  }
}
</style>
