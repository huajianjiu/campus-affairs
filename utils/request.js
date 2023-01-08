import axios from 'axios'

// 根据环境不同引入不同api地址
import {
    baseUrl
} from '../config/index.js'
// 引入api
import api from '../api/index.js'
const service = axios.create({
    baseURL: baseUrl, // url = base api url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5555000 // request timeout
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
        let access_token = uni.getStorageSync('access_token');
        if (access_token) {
            config.headers['Authorization'] = 'Bearer ' + access_token;
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        uni.showToast({
            title: "请求超时",
            icon: 'none'
        })
        return Promise.reject(error)
    }
)
let count = 1;
//登录失效处理
function handleLoginFail() {
    uni.setStorageSync('access_token', '')
    uni.showToast({
        title: "登录失效",
        icon: "none",
        duration: 1000
    })
    setTimeout(() => {
        uni.reLaunch({
            url: '/pages/login/login'
        });
    }, 1000)
}
async function handleRefresh(response) {
    count = count + 1
    try {
        let res = await api.user.getAuthRefresh();
        if (res.code == 200) {
            if (res.data.access_token) {
                uni.setStorageSync('access_token', res.data.access_token)
                let config = response.config;
                config.headers['Authorization'] = 'Bearer ' + res.data.access_token;
                const data = await service.request(config);
                count = 1;
                return data;
            }
        } else {
            count = 1;
            //清token
            handleLoginFail();
        }
    } catch (err) {
        //清token
        handleLoginFail();
        console.log(err);
    }
}
async function handleOtherRefresh(response) {
    let config = response.config;
    let access_token = uni.getStorageSync('access_token');

    if (access_token) {
        config.headers['Authorization'] = 'Bearer ' + access_token;
        const data = await service.request(config);
        return data;
    } else {
        //todo 没有token不刷新 具体逻辑再碰下
        handleLoginFail();
    }
}
// respone拦截器
service.interceptors.response.use(
    response => {
        // Toast.clear()
        const res = response.data
        if (res.status && res.status !== 200) {
            // 登录超时,重新登录
            if (res.status === 50014) {
                if (count == 1) {
                    return Promise.resolve(handleRefresh())
                } else {
                    count = 1;
                    return Promise.resolve(handleOtherRefresh())
                }
      
    }
            return Promise.reject(res || 'error')
        } else {
            return Promise.resolve(res)
        }
    },
    error => {
        // Toast.clear()
        if (error.response) {
            const code = error.response.status;
            uni.hideToast();
            if (code == 500) {
                Toast('接口错误，请联系管理员')
                uni.showToast({
                    title: "接口错误，请联系管理员",
                    icon: "none"
                })
                // utils.notice("接口错误，请联系管理员", 'error');
            }
            if (code == 404) {
                uni.showToast({
                    title: "404 NOT FOUND",
                    icon: "none"
                })
            }
            console.log('err' + error) // for debug
        }
        return Promise.reject(error)
    }
)


export default service