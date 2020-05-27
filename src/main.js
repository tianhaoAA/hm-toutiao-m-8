import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant, { Lazyload } from 'vant'
import '@/permission'
import 'vant/lib/index.less'
import 'amfe-flexible'
import './styles/index.css' // 引入全局的自定义样式  因为要覆盖vant的样式
// 引入插件
import plugin from '@/utils/plugin'
Vue.use(vant)
Vue.use(plugin)
Vue.use(Lazyload)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
