<script setup>
// App.vue - 主应用组件
</script>

<template>
  <div class="app-container">
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
