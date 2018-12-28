import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Create from '@/pages/Create'
import Monitor from '@/pages/Monitor'
// import CatSdg from '@/components/CatSdg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    }
  ]
})
