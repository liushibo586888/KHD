import Vue from 'vue'
import App from './App'
import api from './common/http.js';

Vue.config.productionTip = false

// 获取屏幕可用高度
Vue.prototype.getWindowHeight = function() {
	let that = this
	let height = 0
	uni.getSystemInfo({
		success: function(res) {
			height = res.windowHeight
		}
	});
	return height
}
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
