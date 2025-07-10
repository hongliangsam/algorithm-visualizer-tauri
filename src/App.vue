<script setup>
// App.vue - 主应用组件
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="app-container">
    <el-menu mode="horizontal" router class="app-menu">
      <el-menu-item index="/" @click="router.push('/')">
        <el-icon><Monitor /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/tauri-test" @click="router.push('/tauri-test')">
        <el-icon><Connection /></el-icon>
        <span>Tauri测试</span>
      </el-menu-item>
    </el-menu>

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

.app-menu {
  border-bottom: 1px solid #ebeef5;
}

.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
