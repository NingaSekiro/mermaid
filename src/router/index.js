import { createRouter, createWebHistory } from 'vue-router'
import MermaidRenderer from '@/components/MermaidRenderer.vue'
import Home from '@/views/Home.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mermaid',
      component: MermaidRenderer
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

export default router
