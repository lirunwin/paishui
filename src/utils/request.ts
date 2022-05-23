import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { geteSessionStorage } from '@/utils/auth'
import qs from 'qs'
import router from '@/router'
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 是否上传静态文件
     */
    file?: boolean
  }
  export interface AxiosResponse<T = any> {
    result: T
    code: number
    message: string
  }
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}

// 创建axios实例
// export const IP = 'http://192.168.2.231:1111'
// export const IP = 'http://192.168.2.238:8080'
// export const IP = 'http://192.168.2.235:1118'
// export const IP = 'http://117.174.10.73:1114'
export const IP = 'http://117.174.10.73:1116'
// export const IP = 'http://192.168.2.203:1111'

// 暴露IP地址
export const baseAddress = IP

const service = axios.create({
  baseURL: IP,
  withCredentials: true, // 跨域请求时发送cookiesokies
  timeout: 30000 // 请求超时
})

let requestTimes = 0

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (config.method === 'post' && config.url === '/auth/oauth/login') {
      // 请求为post    使用qs转换数据
      // if (config.method === 'post') { // 请求为post    使用qs转换数据
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
      config.headers['Authorization'] = 'bearer ' + geteSessionStorage('token')
    }
    return config
  },
  (error) => {
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
  (response) => {
    const res = response.data

    // 如果直接返回字符串（请求的图片 直接返回base64
    if (typeof res === 'string') return res

    // 下载文件 后端返回二进制流 直接返回data
    if (res instanceof ArrayBuffer) return res

    // 下载文件 后端返回二进制流 直接返回data
    if (res instanceof Blob) return res

    // 如果自定义代码是-1，则判断为错误。
    if (res.code === -1) {
      if (!res.message || res.message.length < 100) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
      } else {
        Message({
          message: '系统错误',
          type: 'error',
          duration: 2 * 1000
        })
      }
    } else if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
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
      requestTimes = 0
      return res
    }
    return Promise.reject(new Error(res.message || 'Error')).catch((err) => {
      console.log(err)
    })
  },
  (error) => {
    function clearSession() {
      return new Promise((resolve) => {
        sessionStorage.clear()
        resolve(1)
      })
    }
    if (error.response.data.code === 401) {
      if (requestTimes === 0) {
        requestTimes = 1
        MessageBox.confirm('登录失效，请重新登录！', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false
        }).then(async () => {
          const result = await clearSession()
          if (result === 1) {
            requestTimes = 0
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
  }
)

// 森鑫炬接口
export function getSXJList(data) {
  return service({
    url: '/gis/sxjDocking/send',
    method: 'post',
    data
  })
}

export default service
