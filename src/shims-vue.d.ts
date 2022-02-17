
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
//typescript 无法引入非代码资源，需要声明
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
//vue.config.js中指定staticPub为 Public文件目录
declare module 'staticPub/config' {
  /**
 * 轮询时机设置
 */
  export const notificationInterval:number
  export const homeInterval:number
  export const esriConfig:any
  export const appconfig:any
}
