<script setup>
// App.vue - 主应用组件
import CustomTitleBar from './components/CustomTitleBar.vue';
import { onMounted } from 'vue';
import { isTauri, initWindow, logAvailableApis } from './utils/tauri';

// 初始化窗口API
onMounted(async () => {
  console.log('App 组件已挂载');

  // 初始化窗口API
  const window = await initWindow();
  console.log('窗口API可用性:', !!window);

  // 只在开发模式下输出详细诊断信息
  if (import.meta.env.DEV) {
    // 打印可用的API
    logAvailableApis();
  }
});
</script>

<template>
  <div class="app-container">
    <!-- 自定义标题栏 -->
    <CustomTitleBar />
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<style>
/* 全局样式已在 style.css 中定义 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 防止全局滚动条 */
  background-color: #f5f5f5;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止全局滚动条 */
}

.app-content {
  flex: 1;
  position: relative;
  overflow: hidden; /* 防止app-content产生滚动条 */
  margin-top: 32px; /* 为自定义标题栏留出空间，从30px改为32px */
  height: calc(100vh - 32px); /* 减去标题栏高度，从30px改为32px */
}

/* 确保code-container可以滚动 */
:deep(.code-container) {
  overflow-y: auto;
  height: 100%;
}

/* 确保main-content和content容器也不会产生滚动条 */
:deep(.main-content),
:deep(.content) {
  overflow: hidden;
}

/* 确保sidebar和tree-content可以滚动 */
:deep(.sidebar),
:deep(.tree-content) {
  overflow-y: auto;
  height: 100%;
}
</style>
