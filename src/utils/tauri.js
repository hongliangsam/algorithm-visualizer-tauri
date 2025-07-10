// tauri.js - 窗口控制工具函数

/**
 * @typedef {Object} WindowLike
 * @property {function(): Promise<void>} minimize
 * @property {function(): Promise<void>} maximize
 * @property {function(): Promise<boolean>} [isMaximized]
 * @property {function(): Promise<void>} [unmaximize]
 * @property {function(): Promise<void>} [toggleMaximize]
 * @property {function(): Promise<void>} close
 * @property {function(string): Promise<void>} [setTitle]
 */

/** @type {WindowLike|null} */
let windowRef = null;

/**
 * 检查是否在Tauri环境中运行
 * @returns {boolean} 是否在Tauri环境中运行
 */
export const isTauri = () => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

/**
 * 初始化窗口
 * @returns {Promise<WindowLike|null>}
 */
export const initWindow = async () => {
  if (isTauri() && !windowRef) {
    try {
      // 使用Tauri 2.0 API获取当前窗口
      try {
        const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
        windowRef = getCurrentWebviewWindow();
        console.log('成功获取当前WebviewWindow');
      } catch (error) {
        console.warn('获取WebviewWindow失败', error);

        // 如果无法获取窗口对象，则使用全局API
        if (window.__TAURI__ && window.__TAURI__.window && window.__TAURI__.window.appWindow) {
          windowRef = window.__TAURI__.window.appWindow;
          console.log('成功通过全局对象获取窗口');
        } else {
          throw new Error('无法获取窗口对象');
        }
      }
    } catch (error) {
      console.error('初始化窗口失败:', error);
    }
  }
  return windowRef;
};

/**
 * 最小化窗口
 */
export const minimizeWindow = async () => {
  if (!isTauri()) return;

  try {
    const window = await initWindow();
    if (!window) {
      console.error('窗口API不可用');
      return;
    }

    if (!window.minimize) {
      console.error('窗口API不完整，minimize方法不可用');
      return;
    }

    await window.minimize();
    console.log('窗口已最小化');
  } catch (error) {
    console.error('最小化窗口失败:', error);
  }
};

/**
 * 最大化/还原窗口
 */
export const maximizeWindow = async () => {
  if (!isTauri()) return;

  try {
    const window = await initWindow();
    if (!window) {
      console.error('窗口API不可用');
      return;
    }

    // 首先检查是否已最大化，然后根据状态调用相应方法
    if (window.isMaximized && typeof window.isMaximized === 'function') {
      try {
        const isMaximized = await window.isMaximized();
        console.log('窗口' + (isMaximized ? '已最大化' : '未最大化'));

        if (isMaximized) {
          // 如果已最大化，则还原
          if (window.unmaximize && typeof window.unmaximize === 'function') {
            await window.unmaximize();
            console.log('窗口已还原');
            return;
          } else {
            console.error('窗口API不完整，unmaximize方法不可用');
          }
        } else {
          // 如果未最大化，则最大化
          if (window.maximize && typeof window.maximize === 'function') {
            await window.maximize();
            console.log('窗口已最大化');
            return;
          } else {
            console.error('窗口API不完整，maximize方法不可用');
          }
        }
      } catch (error) {
        console.error('检查窗口最大化状态失败:', error);
      }
    }

    // 如果无法检查状态或者前面的方法失败，尝试使用toggleMaximize
    if (window.toggleMaximize && typeof window.toggleMaximize === 'function') {
      await window.toggleMaximize();
      console.log('窗口已切换最大化状态');
      return;
    }

    // 如果没有toggleMaximize，默认尝试maximize操作
    if (window.maximize && typeof window.maximize === 'function') {
      await window.maximize();
      console.log('窗口已最大化');
      return;
    }

    console.error('无法找到可用的窗口最大化/还原方法');
  } catch (error) {
    console.error('最大化/还原窗口失败:', error);

    // 回退方案：尝试使用直接访问Tauri API
    try {
      if (window.__TAURI__ && window.__TAURI__.window) {
        const appWindow = window.__TAURI__.window.getCurrent
          ? window.__TAURI__.window.getCurrent()
          : window.__TAURI__.window.appWindow;

        if (appWindow) {
          // 尝试检查并执行相应操作
          if (typeof appWindow.isMaximized === 'function') {
            const isMaximized = await appWindow.isMaximized();
            if (isMaximized && typeof appWindow.unmaximize === 'function') {
              await appWindow.unmaximize();
              console.log('使用备用方法还原窗口');
            } else if (!isMaximized && typeof appWindow.maximize === 'function') {
              await appWindow.maximize();
              console.log('使用备用方法最大化窗口');
            }
          } else if (typeof appWindow.maximize === 'function') {
            // 没有isMaximized方法，直接尝试最大化
            await appWindow.maximize();
            console.log('使用备用方法最大化窗口');
          }
        }
      }
    } catch (fallbackError) {
      console.error('备用方案也失败:', fallbackError);
    }
  }
};

/**
 * 关闭窗口/应用程序
 */
export const closeWindow = async () => {
  if (!isTauri()) return;

  try {
    // 使用窗口API关闭
    const window = await initWindow();
    if (window && window.close) {
      try {
        await window.close();
        console.log('窗口已关闭');
        return;
      } catch (error) {
        console.error('关闭窗口失败:', error);
      }
    } else {
      console.error('窗口API不可用或close方法不存在');
    }
  } catch (error) {
    console.error('关闭窗口/应用程序失败:', error);
  }
};

/**
 * 设置窗口标题
 * @param {string} title 标题
 */
export const setWindowTitle = async (title) => {
  if (!isTauri()) return;

  try {
    const window = await initWindow();
    if (!window) {
      console.error('窗口API不可用');
      return;
    }

    if (!window.setTitle) {
      console.error('窗口API不完整，setTitle方法不可用');
      return;
    }

    await window.setTitle(title);
    console.log('窗口标题已设置为:', title);
  } catch (error) {
    console.error('设置窗口标题失败:', error);
  }
};

/**
 * 开始窗口拖拽
 */
export const startDragging = async () => {
  if (!isTauri()) return;

  try {
    const window = await initWindow();
    if (window && typeof window.startDragging === 'function') {
      await window.startDragging();
      return;
    }

    console.error('startDragging方法不可用');
  } catch (error) {
    console.error('开始拖拽窗口失败:', error);
  }
};

/**
 * 打印可用的Tauri API
 */
export const logAvailableApis = () => {
  if (!isTauri()) {
    console.log('不在Tauri环境中');
    return;
  }

  console.log('Tauri API 可用性:');

  // 打印window.__TAURI__结构
  if (window.__TAURI__) {
    console.log('window.__TAURI__结构:');
    const structure = {};

    for (const key in window.__TAURI__) {
      if (typeof window.__TAURI__[key] === 'object' && window.__TAURI__[key] !== null) {
        structure[key] = Object.keys(window.__TAURI__[key]);
      } else {
        structure[key] = typeof window.__TAURI__[key];
      }
    }

    console.log(structure);

    // 检查window对象
    if (window.__TAURI__.window) {
      console.log('window.__TAURI__.window:', Object.keys(window.__TAURI__.window));

      if (window.__TAURI__.window.appWindow) {
        console.log('window.__TAURI__.window.appWindow:', Object.keys(window.__TAURI__.window.appWindow));
      }
    }
  }
};

// 初始化窗口
if (isTauri()) {
  initWindow().catch(console.error);
}

export default {
  isTauri,
  initWindow,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  setWindowTitle,
  startDragging,
  logAvailableApis
};