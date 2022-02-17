import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
import qs from 'qs'
import router from '@/router'
// 创建axios实例
// export const IP = 'http://58.17.241.6:1212'
// export const IP = 'http://xrty.vipgz4.idcfengye.com'
const service = axios.create({
  // baseURL: 'http://192.168.2.231/omsweb' // url = base url + request url
  baseURL: '/omsweb'
  // withCredentials: true, // 跨域请求时发送cookiesokies
  // timeout: 30000 // 请求超时
})
function sessGetToken() {
  // console.log('token:', sessionStorage.getItem('token'))
  return sessionStorage.getItem('token')
}
let requestTimes = 0
// 请求拦截器
service.interceptors.request.use(
  config => {
    requestTimes += 1
    if (config.method === 'post' && config.url === '/auth/oauth/login') { // 请求为post    使用qs转换数据
      config.data = qs.stringify(config.data)
      config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    } else {
      config.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
    }
    if (config.file) {
      config.headers.post['Content-Type'] = 'multipart/form-data'
    }
    // 在发出请求前做点什么
    if (store.getters.token) {
      config.headers['Authorization'] = 'bearer ' + sessGetToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想要获取诸如头或状态之类的http信息
   * return  response => response
   */

  /**
   * 通过自定义代码确定请求状态
   */
  response => {
    requestTimes -= 1

    const res = response.data

    // 如果直接返回字符串（请求的图片 直接返回base64
    if (typeof res === 'string') return res

    // 下载文件 后端返回二进制流 直接返回data
    if (res instanceof ArrayBuffer) return res

    // 如果自定义代码不是1，则判断为错误。
    if (res.code !== '0000') {
      if (res.message.length < 20) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
      }
    }
    // 50008:非法令牌；50012:其他客户端登录；50014:令牌过期； 暂时没用
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('您已注销，您可以取消以停留在此页，或重新登录', '确认注销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      return res
    }
    return Promise.reject(new Error(res.message || 'Error'))
  },
  error => {
    requestTimes -= 1
    function clearSession() {
      return new Promise(resolve => {
        sessionStorage.clear()
        resolve(1)
      })
    }
    if (error.response.data.code === 401) {
      if (requestTimes === 0) {
        MessageBox.confirm('登录失效，请重新登录！', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false
        }).then(async () => {
          const result = await clearSession()
          if (result === 1) {
            router.replace('/login')
          }
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    // return Promise.reject(error)
  }
)

export default service
