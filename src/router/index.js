import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      // 登录页面的路由表
      name: 'login',
      path: '/login',
      component: () => import('../views/login')
    }
  ]
})

export default router
