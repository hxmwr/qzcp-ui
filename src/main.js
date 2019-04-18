// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
// import 'echarts/extension/bmap/bmap';
import remconfig from './api/remConfig'

Vue.use(Element);
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

remconfig();//'rem'转换
window.addEventListener('resize',function(){
  remconfig();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
