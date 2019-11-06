import Vue from 'vue'
import App from './App'
import 'pages/style/init.css'


import MinRequest from './request/index'
import minRequest from './request/api'
Vue.use(MinRequest)

import Toast from './wxcomponents/dist/toast/toast';



Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App,
	minRequest
})
app.$mount()
