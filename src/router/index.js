import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import myMap from '@/views/myMap'
import myMap2 from '@/views/myMap2'
import myMap3 from '@/views/myMap3'
import myMap4 from '@/views/myMap4'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'myMap',
    //   component: myMap
    // }
    // {
    //   path: '/',
    //   name: 'myMap2',
    //   component: myMap2
    // }
    {
      path: '/',
      name: 'myMap4',
      component: myMap4
    }
  ]
})
