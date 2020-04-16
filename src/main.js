import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import api from './config/vue.config'
import BMap from 'vue-baidu-map'

import VueKindEditor from './plugins/kindeditor'
import '../public/kindeditor/themes/default/default.css'
import '../public/kindeditor/kindeditor-all-min.js'
import '../public/kindeditor/lang/zh-CN.js'

Vue.use(VueKindEditor)
Vue.use(BMap,{
  ak:'XSdzkf0NfDrhjsltQ2IQGTdA9GBXTr2K'
})
Vue.config.productionTip = false
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:8181/'
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token');
  return config
})
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
},
    api).$mount('#app')
