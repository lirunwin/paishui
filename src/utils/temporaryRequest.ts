import axios from 'axios';
import { geteSessionStorage } from '@/utils/auth'
const service = axios.create({
    timeout: 5000,
    baseURL: 'http://221.182.8.141:1118',
    withCredentials: true, // 跨域请求时发送cookiesokies
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
service.defaults.headers['Authorization'] = 'bearer ' + geteSessionStorage('token')
export default service;