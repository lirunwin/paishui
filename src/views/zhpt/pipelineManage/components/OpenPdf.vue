<template>
  <div class="pdf">
    <div v-loading="loading" style="margin-top: 50%; text-align: center"></div>
    <div style="margin-top: 50%;text-align: center;" v-if="isNull">暂无报告地址</div>
    <pdf  v-for="i in numPages" :key="i" :src="laoclUrl" :page="i"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: 'index',
  props: {
    // 当前pdf的路径
    pdfUrl: {
      type: String,
      // default: 'http://117.174.10.73:1114/psjc/file/opt2/upload/wordInfoDoc/84/202205091057240051.pdf'
      default: ''
    }
  },
  components: {
    pdf
  },
  data() {
    return {
      isNull: false, // 报告地址为空时
      loading: true,
      // 当前页数
      numPages: 1,
      // 预览路径
      laoclUrl: ''
    }
  },
  watch: {},
  computed: {},
  created() {
    this.laoclUrl = this.pdfUrl
  },
  mounted() {
    console.log('传来的路径', this.pdfUrl)
    this.getNumPages()
  },
  methods: {
    getNumPages() {
      this.loading = true
      if (!this.pdfUrl) {
        this.loading = false
        this.isNull = true
        // console.log('无报告', this.isNull)
      } else {
        this.isNull = false
        // console.log('有报告', this.isNull)
      }
      let loadingTask = pdf.createLoadingTask(this.laoclUrl)

      // 网上查询 都没有加promise执行的整页渲染 emmmm... 不知道他们怎么运行的
      loadingTask.promise
        .then((pdf) => {
          this.loading = false
          this.laoclUrl = loadingTask
          this.numPages = pdf.numPages
        })
        .catch((err) => {
          // console.error('pdf加载失败')
        })
    }
  }
}
</script>


<style lang="scss" scoped>
.container {
  font-family: PingFang SC;
  width: 100%;
  height: 100%;
}
</style>
