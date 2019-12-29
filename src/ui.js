import Vue from 'vue'
import App from './App'
import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
