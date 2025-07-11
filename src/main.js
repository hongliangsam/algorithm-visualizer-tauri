import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { refreshAllIcons } from './utils/windowIcons'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')

// 应用启动后设置图标
document.addEventListener('DOMContentLoaded', async () => {
  // 延迟执行以确保窗口已完全加载
  setTimeout(async () => {
    await refreshAllIcons()
  }, 1000)
})
