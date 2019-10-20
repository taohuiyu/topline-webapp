import Vue from 'vue'
import VueRouter from 'vue-router'

import Tab from '@/views/tab'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
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
      // 搜索结果页面
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    },
    {
      // 文章详情
      name: 'article',
      path: '/article/:articleId',
      component: Article
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
