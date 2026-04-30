import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

export default router
