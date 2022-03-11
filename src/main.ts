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
import {comMethod} from '@/utils/comMethod'
import '@/icons'
import '@/permission' // 权限控制

import BaiduMap from 'vue-baidu-map'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'

// import htmlToPdf from './utils/htmlToPdf'
// Vue.use(htmlToPdf)
// dialog拖动
import './utils/dialog'
import '@/assets/font/other_font/iconfont.css'
// 全局修改默认配置，点击空白处不能关闭弹窗
//@ts-ignore
ElementUI.Dialog.props.closeOnClickModal.default = false

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.$comMethod = comMethod
import html2pdf from '@/utils/html2pdf'
Vue.use(html2pdf)

Vue.use(BaiduMap, {
  ak: 'CO5txfs21UEm2XUgiaPiGhZcvfpjVBXS'
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
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
