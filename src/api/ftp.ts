import axios from 'axios'
import { IP } from '@/utils/request'
// import { getToken } from '@/utils/auth'

// const imgUrl = 'http://192.168.2.235:1111/base/file/loadImg?access_token=' + getToken()
// 获取图片地址
function tokenFormSession() {
  return sessionStorage.getItem('token')
}
export function imageByName(data) {
  // console.log('2222', getToken())
  // return axios.get(`${IP}/base/file/loadImg?access_token=` + tokenFormSession() +
  //   '&remotePath=' + data, {
  //   responseType: 'blob'
  // })
  return `${IP}/base/file/${data}`
}
