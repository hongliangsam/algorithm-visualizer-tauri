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
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
