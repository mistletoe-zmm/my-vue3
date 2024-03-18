import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/index',
          name: 'home',
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/other',
          name: 'other',
          component: () => import('@/views/other/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/user/login/index.vue')
    }
  ]
})


const isAuthenticated = true

router.beforeEach((to, from, next) => {
  // 判断是否登录
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else if (to.fullPath === '/') {
    next({ name: 'home' })
  }
   else {
    next()
  }
})

export default router
