import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import api from '@/api/index.js';
// import config from './config/index.js'

Vue.config.productionTip = false;
Vue.prototype.api=api;
App.mpType = 'app'
Vue.use(uView);
uni.$u.config.unit = 'rpx'

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif