import axios from 'axios'
import { IP } from '@/utils/request'
// import { getToken } from '@/utils/auth'

// const imgUrl = 'http://192.168.2.235:1111/base/file/loadImg?access_token=' + getToken()
// 获取图片地址
const tokenFormSession = () => sessionStorage.getItem('token')

export const getRemoteImg = (path: string) =>
  path
    ? `${String(IP.startsWith('http://192') ? 'http://221.182.8.141:1118' : IP).replace(
        /\/$/,
        ''
      )}/base/file/loadImg?access_token=${tokenFormSession()}&remotePath=${path}`
    : ''
