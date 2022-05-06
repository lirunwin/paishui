<template>
  <div class="pdf">
    <pdf v-for="i in numPages" :key="i" :src="laoclUrl" :page="i"></pdf> 
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: "index",
  props: {
    // 当前pdf的路径
    pdfUrl: {
      type: String,
      default: '/static/pdf/攀枝花市主城区排水管网排查检测项目紫荆巷污水评估报告-20220306_20220506154745.pdf'
    }
  },
  components: {
    pdf 
  },
  data () {
    return {
     // 当前页数
      numPages: 1,
      // 预览路径
      laoclUrl: '',
    };
  },
  watch: {},
  computed: {},
  created () {
    this.laoclUrl = this.pdfUrl;
  },
  mounted () {
    this.getNumPages()
  },
  methods: {
    getNumPages() {
      let loadingTask = pdf.createLoadingTask(this.laoclUrl)
      // 网上查询 都没有加promise执行的整页渲染 emmmm... 不知道他们怎么运行的
      loadingTask.promise.then(pdf => {
        this.laoclUrl = loadingTask
        this.numPages = pdf.numPages
      }).catch((err) => {
        console.error('pdf加载失败')
      })
    },
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
