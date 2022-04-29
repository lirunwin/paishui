import axios from 'axios';
import { geteSessionStorage } from '@/utils/auth'
const service = axios.create({
    timeout: 5000,
    baseURL: '/api'
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
service.defaults.headers['Authorization'] = 'bearer ' + geteSessionStorage('token')
export default service;