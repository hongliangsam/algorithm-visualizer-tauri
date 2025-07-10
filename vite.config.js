import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@tauri-apps/api': path.resolve(__dirname, 'node_modules/@tauri-apps/api')
      }
    },
    // 开发服务器设置，端口需要与tauri.conf.json中的devUrl一致
    server: {
      port: 3000,
      strictPort: true,
      host: true
    },
    optimizeDeps: {
      include: ['@tauri-apps/api/tauri']
    }
  };

  // 仅在构建模式下将Tauri API标记为外部依赖
  if (command === 'build') {
    config.build = {
      outDir: 'dist',
      rollupOptions: {
        external: [
          '@tauri-apps/api',
          '@tauri-apps/api/tauri'
        ],
      }
    };
  }

  return config;
})
