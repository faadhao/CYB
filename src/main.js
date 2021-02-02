import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'
import Photoswipe from 'vue-pswipe'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimesCircle, faUserCircle, faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faEnvelope, faPhoneAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

axios.defaults.withCredentials = true

Vue.config.productionTip = false


library.add(faTimesCircle, faEnvelope, faFacebook, faPhoneAlt, faUserCircle, faUserCog, faInstagram, faCopyright)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2)
Vue.use(Photoswipe)
Vue.component('ImgInputer', ImgInputer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
