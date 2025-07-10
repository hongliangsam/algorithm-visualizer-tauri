// tauriCompatLayer.js - Tauri 诊断工具

import { isTauri } from './tauri';

/**
 * 诊断Tauri API的可用性
 * @returns {Promise<Object>} 诊断信息
 */
export async function diagnoseTauriAPI() {
  const results = {
    isTauriEnvironment: isTauri(),
    globalTauri: typeof window !== 'undefined' && !!window.__TAURI__,
    availableAPIs: [],
    errors: []
  };

  // 检查全局API
  if (results.globalTauri) {
    // 列出可用的顶级API
    for (const key in window.__TAURI__) {
      results.availableAPIs.push(key);
    }

    // 尝试检查Tauri 2.0 API
    try {
      // 尝试导入WebviewWindow API
      try {
        const webviewWindowModule = await import('@tauri-apps/api/webviewWindow');
        results.webviewWindow = {
          available: true,
          methods: Object.keys(webviewWindowModule)
        };
      } catch (error) {
        results.webviewWindow = {
          available: false,
          error: error.message
        };
      }
    } catch (error) {
      results.errors.push('检查Tauri API失败: ' + error.message);
    }
  }

  return results;
}

export default {
  diagnoseTauriAPI
};