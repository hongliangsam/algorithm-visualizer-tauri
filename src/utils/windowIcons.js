import { getCurrentWindow } from '@tauri-apps/api/window';

/**
 * 设置应用窗口图标
 * 注意：此功能需要在Cargo.toml中启用image-png或image-ico特性
 */
export async function setAppIcon() {
  try {
    // 使用绝对路径指向图标文件
    await getCurrentWindow().setIcon('icons/icon.png');
    console.log('窗口图标设置成功');
  } catch (error) {
    console.error('设置窗口图标失败:', error);
  }
}

/**
 * 重置所有图标缓存并应用新图标
 * 包括窗口图标和任务栏图标
 */
export async function refreshAllIcons() {
  try {
    // 先使用PNG图标
    await getCurrentWindow().setIcon('icons/icon.png');
    // 然后使用ICO图标（Windows更常用）
    setTimeout(async () => {
      await getCurrentWindow().setIcon('icons/icon.ico');
    }, 100);

    console.log('所有图标刷新成功');
  } catch (error) {
    console.error('刷新图标失败:', error);
  }
}