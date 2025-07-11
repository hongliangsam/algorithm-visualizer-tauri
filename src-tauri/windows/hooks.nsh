!macro NSIS_HOOK_PREINSTALL
  ; 安装前显示欢迎信息
  DetailPrint "欢迎安装算法可视化器..."
  DetailPrint "正在准备安装环境..."
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; 在此检查系统环境和依赖项
  DetailPrint "正在检查系统环境..."

  ; 在注册表中记录安装时间
  WriteRegStr HKCU "Software\algorithm\visualizer" "InstallDate" "${__DATE__}"
  DetailPrint "已记录安装信息"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  ; 在此执行卸载前的清理操作
  DetailPrint "正在准备卸载..."

  ; 删除桌面快捷方式
  Delete "$DESKTOP\算法可视化器.lnk"
  DetailPrint "已删除桌面快捷方式"
!macroend