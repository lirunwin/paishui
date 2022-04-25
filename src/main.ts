import Vue from 'vue'
import Print from 'vue-print-nb'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import '../theme/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import './directives'

import App from './App.vue'
import store from './store'
import router from './router'
import { comMethod } from '@/utils/comMethod'
import '@/icons'
import '@/permission' // 权限控制

import BaiduMap from 'vue-baidu-map'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'

import Moment from 'vue-moment'

// import htmlToPdf from './utils/htmlToPdf'
// Vue.use(htmlToPdf)
// dialog拖动
import './utils/dialog'
import '@/assets/font/al_font/iconfont.css'// 阿里的icon图标
import '@/assets/font/other_font/iconfont.css'//
// 全局修改默认配置，点击空白处不能关闭弹窗
// @ts-ignore
ElementUI.Dialog.props.closeOnClickModal.default = false
import echarts from 'echarts'

// declare module 'vue/types/vue'{
//   interface Vue{
//     value:string;
//     /**
//      * dashboard混入函数
//      * @param voucher
//      */
//     validateAuth(voucher:string):any;

//     /**
//      *$comMethod混入函数
//      * @param voucher
//      */
//     $comMethod:dStore.utils.comMethod
//   }
// }
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);

Vue.prototype.$echarts = echarts
Vue.prototype.$comMethod = comMethod
import html2pdf from '@/utils/html2pdf'
Vue.use(html2pdf)

Vue.use(BaiduMap, {
  ak: 'CO5txfs21UEm2XUgiaPiGhZcvfpjVBXS'
})

// Vue.filter('formatDate', function (value) {
//   return moment(value).format('YYYY-MM-DD HH:mm')
// })

// 全局引入moment
Vue.prototype.$moment = Moment//挂载Vue上

/**
  * select 下拉框 底部触发指令
 */
Vue.directive('selectLoadMore', {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
        binding.value()
      }
    })
  }
})

/**
 * mock数据
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// // }

Vue.use(ElementUI)
Vue.use(Print)
Vue.use(<any>Moment)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
