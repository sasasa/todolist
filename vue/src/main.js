import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import { localize, extend } from 'vee-validate';
import { required, min } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'

extend('required', {
  ...required,
})
extend('min', {
  ...min,
})
localize('ja', ja)
// Vue.component('ValidationProvider', ValidationProvider)
// Vue.component('ValidationObserver', ValidationObserver)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
