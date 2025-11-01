import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import RecordAction from '@/views/RecordAction.vue'

const router = createRouter({
  mode: 'hash',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/config',
      component: Home,
    },
  ],
})

export default router
