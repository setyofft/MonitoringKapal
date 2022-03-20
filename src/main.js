import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vuelidate from 'vuelidate'
import VueSession from 'vue-session'
import 'leaflet/dist/leaflet.css';
import LControlFullscreen from 'vue2-leaflet-fullscreen';
import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker'

import Sign from './components/Sign.vue'
import Perusahaan from './components/Perusahaan.vue'
import Customer from './components/Customer.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
Vue.use(VueSweetalert2)
Vue.use(Vuelidate)
Vue.use(VueSession)
Vue.component('l-control-fullscreen', LControlFullscreen);
Vue.component('l-rotated-marker', Vue2LeafletRotatedMarker)

Vue.config.productionTip = false

const routes = [
    {
        name: 'Sign',
        path: '/',
        component: Sign
    },
    {
        name: 'Perusahaan',
        path: '/perusahaan',
        component: Perusahaan
    },
    {
        name: 'Customer',
        path: '/customers',
        component: Customer
    }
];

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')