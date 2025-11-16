import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import RecordAction from '@/views/RecordAction.vue'
import RecordSetting from '@/views/RecordSetting.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RecordAction',
    component: RecordAction,
    meta: { title: '录制', icon: 'home', order: 1 },
  },
  {
    path: '/result',
    name: 'RecordResult',
    component: Home,
    meta: { title: '录制结果', icon: 'appstore', order: 2 },
  },
  {
    path: '/setting',
    name: 'RecordSetting',
    component: RecordSetting,
    meta: { title: '录制设置', icon: 'setting', order: 3 },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router