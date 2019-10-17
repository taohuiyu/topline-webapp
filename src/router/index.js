import Vue from 'vue'
import VueRouter from 'vue-router'

import Tab from '@/views/tab'
import Home from '@/views/home'
import Search from '@/views/search'
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      // 登录页面的路由表
      name: 'login',
      path: '/login',
      component: () => import('../views/login')
    },
    {
      // 搜索页面
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      path: '/',
      component: Tab,
      children: [
        {
          name: 'home',
          path: '/',
          component: Home
        }
      ]
    }
  ]
})

export default router
