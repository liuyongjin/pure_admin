import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import Cookies from 'js-cookie'
import i18n from './lang' // Internationalization
import * as filters from './filters' // global filters
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data


Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
