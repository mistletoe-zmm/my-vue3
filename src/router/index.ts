import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'user/login',
      component: ()=> import('@/views/user/login/index.vue')
    }
  ]
})

export default router
