var mixins = []

// 组件激活状态监控
mixins.push({
  props: ['name'],
  mounted() {
    var that = this

    that.$el.addEventListener('click', function(event) {
      if (that.data != null && that.data.activeModel != that.name) {
        that.data.activeModel = that.name
      }
    })
  },
  watch: {
    'data.activeModel': function() {
      if (this.name != this.data.activeModel) {
        this.isActive = false
        this.unActive()
      } else {
        this.isActive = true
      }
    }
  },
  data: function() {
    return {
      isActive: true
    }
  },
  methods: {
    unActive() {
    }
  }
})

export default mixins
