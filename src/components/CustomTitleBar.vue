<template>
  <div class="titlebar">
    <!-- 标题部分 -->
    <div class="titlebar-title">
      <!-- 算法可视化器 -->
    </div>

    <!-- 窗口控制按钮 -->
    <div class="titlebar-buttons">
      <button class="titlebar-button" id="minimize-button" @click.stop="handleMinimize">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <path d="M0 0h10v1H0z" fill="currentColor" />
        </svg>
      </button>

      <button class="titlebar-button" id="maximize-button" @click.stop="handleToggleMaximize">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" fill="currentColor" />
        </svg>
      </button>

      <button class="titlebar-button" id="close-button" @click.stop="handleClose">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { minimizeWindow, maximizeWindow, closeWindow } from '../utils/tauri';

// 窗口对象和API状态
let appWindow = null;
let windowAPI = null;
let tauriAvailable = false;

// 拖拽事件处理函数
const dragHandler = async (event) => {
  // 如果不是在按钮区域点击，就可以拖拽
  if (!event.target.closest('.titlebar-button')) {
    console.log('开始拖拽窗口');

    try {
      if (appWindow && appWindow.startDragging) {
        await appWindow.startDragging();
      } else if (windowAPI && windowAPI.appWindow && windowAPI.appWindow.startDragging) {
        await windowAPI.appWindow.startDragging();
      } else if (window.__TAURI__ && window.__TAURI__.window && window.__TAURI__.window.appWindow) {
        await window.__TAURI__.window.appWindow.startDragging();
      } else {
        console.warn('无法找到startDragging方法');
      }
    } catch (error) {
      console.error('拖拽窗口失败:', error);
    }
  }
};

// 初始化Tauri窗口API
async function initTauriWindow() {
  console.log('初始化Tauri窗口API...');

  if (!window.__TAURI__) {
    console.warn('未检测到Tauri运行环境');
    return false;
  }

  try {
    // 在Tauri环境中，尝试获取窗口API
    tauriAvailable = true;

    // 尝试导入getCurrentWebviewWindow API (Tauri v2.0)
    try {
      const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      appWindow = getCurrentWebviewWindow();
      console.log('已获取当前WebviewWindow (Tauri v2.0)');
      return true;
    } catch (err) {
      console.warn('导入getCurrentWebviewWindow失败，尝试替代API', err);
    }

    // 尝试导入旧版API (Tauri v1.x)
    try {
      windowAPI = await import('@tauri-apps/api/window');
      if (windowAPI && windowAPI.getCurrent) {
        appWindow = windowAPI.getCurrent();
        console.log('已获取当前Window (Tauri v1.x)');
        return true;
      } else {
        console.warn('window.getCurrent API不可用');
      }
    } catch (err) {
      console.warn('导入@tauri-apps/api/window失败', err);
    }

    // 尝试通过全局对象获取
    if (window.__TAURI__.window) {
      if (window.__TAURI__.window.getCurrent) {
        appWindow = window.__TAURI__.window.getCurrent();
        console.log('已通过__TAURI__.window.getCurrent获取窗口');
        return true;
      } else if (window.__TAURI__.window.appWindow) {
        appWindow = window.__TAURI__.window.appWindow;
        console.log('已通过__TAURI__.window.appWindow获取窗口');
        return true;
      }
    }

    console.error('无法获取窗口API');
    return false;
  } catch (err) {
    console.error('初始化Tauri窗口API失败:', err);
    return false;
  }
}

// 点击最小化按钮
async function handleMinimize() {
  console.log('尝试最小化窗口');

  try {
    await minimizeWindow();
  } catch (err) {
    console.error('最小化窗口失败:', err);

    // 回退方法：尝试直接使用窗口对象
    if (appWindow && appWindow.minimize) {
      try {
        await appWindow.minimize();
        console.log('通过appWindow直接最小化成功');
      } catch (directErr) {
        console.error('直接最小化也失败:', directErr);
      }
    } else if (window.__TAURI__ && window.__TAURI__.window) {
      // 再次尝试通过全局对象
      try {
        await window.__TAURI__.window.appWindow.minimize();
        console.log('通过全局对象最小化成功');
      } catch (globalErr) {
        console.error('通过全局对象最小化失败:', globalErr);
      }
    }
  }
}

// 切换窗口最大化状态
async function handleToggleMaximize() {
  console.log('尝试切换窗口最大化状态');

  try {
    await maximizeWindow();
  } catch (err) {
    console.error('切换窗口最大化状态失败:', err);

    // 回退方法：尝试直接使用窗口对象
    if (appWindow) {
      try {
        // 判断当前是否已最大化
        if (appWindow.isMaximized && typeof appWindow.isMaximized === 'function') {
          const isMax = await appWindow.isMaximized();
          if (isMax && appWindow.unmaximize && typeof appWindow.unmaximize === 'function') {
            await appWindow.unmaximize();
            console.log('通过appWindow直接还原窗口成功');
          } else if (!isMax && appWindow.maximize && typeof appWindow.maximize === 'function') {
            await appWindow.maximize();
            console.log('通过appWindow直接最大化窗口成功');
          }
        } else if (appWindow.maximize && typeof appWindow.maximize === 'function') {
          // 无法判断状态，直接尝试最大化
          await appWindow.maximize();
          console.log('通过appWindow直接最大化窗口成功');
        } else if (window.__TAURI__ && window.__TAURI__.window) {
          // 尝试使用全局API
          try {
            if (typeof window.__TAURI__.window.isMaximized === 'function') {
              const isMax = await window.__TAURI__.window.isMaximized();
              if (isMax && typeof window.__TAURI__.window.unmaximize === 'function') {
                await window.__TAURI__.window.unmaximize();
                console.log('通过全局API还原窗口成功');
              } else if (!isMax && typeof window.__TAURI__.window.maximize === 'function') {
                await window.__TAURI__.window.maximize();
                console.log('通过全局API最大化窗口成功');
              }
            } else if (typeof window.__TAURI__.window.maximize === 'function') {
              await window.__TAURI__.window.maximize();
              console.log('通过全局API最大化窗口成功');
            }
          } catch (globalErr) {
            console.error('通过全局API操作窗口失败:', globalErr);
          }
        }
      } catch (directErr) {
        console.error('直接切换最大化状态也失败:', directErr);
      }
    }
  }
}

// 关闭窗口
async function handleClose() {
  console.log('尝试关闭窗口');

  try {
    await closeWindow();
  } catch (err) {
    console.error('关闭窗口失败:', err);

    // 回退方法：尝试直接使用窗口对象
    if (appWindow && appWindow.close) {
      try {
        await appWindow.close();
        console.log('通过appWindow直接关闭成功');
      } catch (directErr) {
        console.error('直接关闭也失败:', directErr);
      }
    } else if (window.__TAURI__ && window.__TAURI__.window) {
      // 再次尝试通过全局对象
      try {
        await window.__TAURI__.window.appWindow.close();
        console.log('通过全局对象关闭成功');
      } catch (globalErr) {
        console.error('通过全局对象关闭失败:', globalErr);

        // 最后尝试退出进程
        if (window.__TAURI__ && window.__TAURI__.process) {
          try {
            await window.__TAURI__.process.exit(0);
            console.log('通过进程退出成功');
          } catch (processErr) {
            console.error('通过进程退出失败:', processErr);
          }
        }
      }
    }
  }
}

// 组件挂载后初始化
onMounted(async () => {
  await initTauriWindow();

  // 设置拖拽区域
  const el = document.querySelector('.titlebar');
  if (el) {
    el.addEventListener('mousedown', dragHandler);
  }
});

// 在组件卸载前移除事件监听
onBeforeUnmount(() => {
  const el = document.querySelector('.titlebar');
  if (el) {
    el.removeEventListener('mousedown', dragHandler);
  }
});
</script>

<style scoped>
/* 现代化标题栏样式 */
.titlebar {
  height: 32px;
  background: linear-gradient(90deg, #1a1b2a, #232338);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  user-select: none;
  z-index: 9999;
  /* border-bottom: 1px solid #374151; */
  -webkit-app-region: drag; /* 使用CSS控制拖拽区域作为备用 */
}

/* 标题样式 */
.titlebar-title {
  font-size: 14px;
  font-weight: 500;
  margin-left: 12px;
  flex: 1;
}

/* 控制按钮容器 */
.titlebar-buttons {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag; /* 按钮区域不可拖拽 */
}

/* 控制按钮基础样式 */
.titlebar-button {
  width: 46px;
  height: 32px;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.15s;
}

/* 按钮悬停效果 */
.titlebar-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* 关闭按钮特殊样式 */
#close-button:hover {
  background-color: #ef4444;
  color: white;
}

/* 确保SVG图标显示正确 */
.titlebar-button svg {
  width: 10px;
  height: 10px;
}
</style>