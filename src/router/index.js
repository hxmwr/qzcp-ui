import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import myMap3 from '@/views/myMap3';
import login from '@/views/login'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      name:'login',
      component:login
    },
    {
      path: '/index',
      name: 'myMap3',
      component: myMap3
    }
  ]
})
