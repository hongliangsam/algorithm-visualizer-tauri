import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 确保生产构建输出到dist目录
  build: {
    outDir: 'dist'
  },
  // 开发服务器设置
  server: {
    port: 1420,
    strictPort: true
  }
})
