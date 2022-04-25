import axios from 'axios';

const service = axios.create({
    timeout: 5000,
    baseURL: 'http://192.168.2.235:1118//'
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
service.defaults.headers['Authorization'] = 'bearer ' + "cc5c9126-4a04-455c-883a-a3d254d2f8a4"
export default service;