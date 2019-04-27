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

import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';
import LMovingMarker from 'vue2-leaflet-movingmarker'
import { Icon } from 'leaflet'

import 'leaflet/dist/leaflet.css'

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup)
Vue.component('l-polyline', LPolyline)
Vue.component('l-moving-marker', LMovingMarker)


delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
