import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vuelidate from 'vuelidate'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import APIClient from './api/APIClient'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$api = new APIClient()

Vue.prototype.$noticeError = function(message = 'Error!') {
  this.$bvToast.toast(message, {
    toaster: 'b-toaster-top-center',
    solid: true,
    variant: 'danger',
    autoHideDelay: 2000
  })
}

Vue.prototype.$noticeSuccess = function(message = 'Successfully!') {
  this.$bvToast.toast(message, {
    toaster: 'b-toaster-top-center',
    solid: true,
    variant: 'success',
    autoHideDelay: 2000
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
