<template>
  <div class="tauri-test">
    <h2>Tauri API 测试</h2>
    <div class="test-form">
      <el-input v-model="name" placeholder="请输入您的名字" />
      <el-button type="primary" @click="greet">问候</el-button>
    </div>
    <div v-if="greetMsg" class="response">
      <p>{{ greetMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 使用动态导入以避免构建问题
// import { invoke } from '@tauri-apps/api/tauri'

const name = ref('')
const greetMsg = ref('')

async function greet() {
  try {
    // 动态导入Tauri API
    const tauriApi = await import('@tauri-apps/api/tauri')
    greetMsg.value = await tauriApi.invoke('greet', { name: name.value || '访客' })
  } catch (error) {
    console.error('调用Tauri API出错:', error)
    greetMsg.value = `错误: ${error.message}`
  }
}
</script>

<style scoped>
.tauri-test {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.test-form {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.response {
  margin-top: 15px;
  padding: 10px;
  background-color: #ecf5ff;
  border-radius: 4px;
}
</style>