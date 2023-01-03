import axios from 'axios'
import store from '../store/index.js'
// import { Toast } from 'vant'
import { getToken } from '../utils/auth.js'
// 根据环境不同引入不同api地址
import { baseUrl } from '../config/index.js'
// create an axios instance
const service = axios.create({
  baseURL:baseUrl, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    // if (!config.hideloading) {
    //   // loading
    //   Toast.loading({
    //     forbidClick: true
    //   })
    // }
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    // Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 50014) {
        store.dispatch('/user/logout').then(() => {
          console.log('过期')
          location.reload();
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    // Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
