!macro NSIS_HOOK_PREINSTALL
  ; 安装前显示欢迎信息
  DetailPrint "欢迎安装算法可视化器..."
  DetailPrint "正在准备安装环境..."
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; 在此检查系统环境和依赖项
  DetailPrint "正在检查系统环境..."

  ; 在注册表中记录安装时间
  WriteRegStr HKCU "Software\algorithm\visualizer" "InstallDate" "$TIMESTAMP"
  DetailPrint "安装完成！感谢您选择算法可视化器！"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  ; 卸载前确认
  MessageBox MB_YESNO "您确定要卸载算法可视化器吗？" IDYES confirm_uninstall IDNO cancel_uninstall
  confirm_uninstall:
    DetailPrint "准备卸载应用程序..."
    Goto continue_uninstall
  cancel_uninstall:
    Abort "卸载已取消"
  continue_uninstall:
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; 卸载后清理
  RMDir /r "$APPDATA\algorithm-visualizer"
  DetailPrint "已清理用户数据"

  uninstall_done:
    MessageBox MB_OK "卸载完成。感谢您使用算法可视化器！"
!macroend