import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/sort/:name',
      name: 'sort-algorithm',
      component: () => import('../views/AlgorithmPage.vue'),
      props: true,
    },
    {
      path: '/data-structure/:name',
      name: 'data-structure',
      component: () => import('../views/AlgorithmPage.vue'),
      props: true,
    },
    {
      path: '/search/:name',
      name: 'search-algorithm',
      component: () => import('../views/AlgorithmPage.vue'),
      props: true,
    },
  ],
})

router.beforeEach((to) => {
  const user = localStorage.getItem('codeviz_user')
  if (to.name !== 'login' && to.name !== 'register' && !user) {
    return { name: 'login' }
  }
})

export default router
