import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TauriTest from '../components/TauriTest.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/code/:filePath(.*)',
    name: 'code',
    component: HomePage
  },
  {
    path: '/tauri-test',
    name: 'tauri-test',
    component: TauriTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router