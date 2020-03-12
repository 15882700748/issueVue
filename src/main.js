import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import api from './config/vue.config'

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
