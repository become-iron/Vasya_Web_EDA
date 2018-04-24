// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './globals'

import Vue from 'vue'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import store from './store/graph'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.min.css'
import 'open-iconic/font/css/open-iconic-bootstrap.min.css'

import './assets/style/main.css'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.http.options.root = '/'

Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
