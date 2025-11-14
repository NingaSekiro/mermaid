import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import RecordAction from '@/views/RecordAction.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RecordAction,
  },
  {
    path: '/result',
    component: Home,
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router