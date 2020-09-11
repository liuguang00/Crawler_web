// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import vuetify from '@/plugins/vuetify' // path to vuetify export

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

Vue.prototype.$axios = axios
//axios.defaults.baseURL = ''
Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
