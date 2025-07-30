import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { refreshAllIcons } from './utils/windowIcons'
import { isTauri } from './utils/tauri'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')

// 应用启动后设置图标 - 仅在Tauri环境中尝试
document.addEventListener('DOMContentLoaded', async () => {
  // 检查是否在Tauri环境中运行
  if (!isTauri()) {
    console.log('非Tauri环境，跳过图标设置')
    return
  }

  try {
    // 延迟执行以确保窗口已完全加载
    setTimeout(async () => {
      try {
        await refreshAllIcons()
      } catch (error) {
        console.error('刷新图标失败，但应用将继续运行:', error)
      }
    }, 1000)
  } catch (error) {
    // 捕获所有错误，确保不会阻止应用启动
    console.error('设置图标过程中出错:', error)
  }
})
