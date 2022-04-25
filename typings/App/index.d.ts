/// <reference path="./store.d.ts" />

//typescript 无法引入非代码资源，需要声明
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.scss'
//vue.config.js中指定staticPub为 Public文件目录
declare module 'staticPub/config' {
  /**
   * 轮询时机设置
   */
  export const notificationInterval: number
  export const homeInterval: number
  export const esriConfig: any
  export const appconfig: any
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
