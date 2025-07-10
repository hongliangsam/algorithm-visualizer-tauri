// Tauri命令
use tauri::Manager;

#[tauri::command]
async fn greet(name: String) -> Result<String, String> {
    Ok(format!("你好，{}！欢迎使用算法可视化器！", name))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      // 在任何模式下都启用日志插件
      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log::LevelFilter::Info)
          .build(),
      )?;

      // 在开发模式下自动打开开发者工具
      #[cfg(debug_assertions)]
      {
          let window = app.get_webview_window("main").unwrap();
          window.open_devtools();
          println!("开发者工具已打开");
      }

      Ok(())
    })
    .plugin(tauri_plugin_http::init())
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
