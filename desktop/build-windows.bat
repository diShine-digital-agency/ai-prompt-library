@echo off
REM Build a Windows application for Prompt Workshop
REM Creates a self-contained directory with native-style launcher and installer
REM Usage: desktop\build-windows.bat

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "REPO_DIR=%SCRIPT_DIR%.."
set "APP_NAME=PromptWorkshop"
set "OUTPUT_DIR=%REPO_DIR%\dist"
set "INSTALL_DIR=%OUTPUT_DIR%\%APP_NAME%"

echo Building %APP_NAME% for Windows...

REM Clean
if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
mkdir "%INSTALL_DIR%"

REM Copy the HTML
copy "%REPO_DIR%\viewer.html" "%INSTALL_DIR%\viewer.html" > nul

REM Copy the icon
if exist "%SCRIPT_DIR%icons\PromptWorkshop.ico" (
    copy "%SCRIPT_DIR%icons\PromptWorkshop.ico" "%INSTALL_DIR%\PromptWorkshop.ico" > nul
)

REM Create native VBS launcher — opens in Edge/Chrome app mode
(
echo ' Prompt Workshop — Native-style launcher for Windows
echo ' Opens in its own window using Edge or Chrome app mode.
echo Set shell = CreateObject("WScript.Shell"^)
echo Set fso = CreateObject("Scripting.FileSystemObject"^)
echo scriptDir = fso.GetParentFolderName(WScript.ScriptFullName^)
echo htmlFile = fso.BuildPath(scriptDir, "viewer.html"^)
echo htmlUrl = "file:///" ^& Replace(htmlFile, "\", "/"^)
echo edgePath = shell.ExpandEnvironmentStrings("%%ProgramFiles(x86^)%%"^) ^& "\Microsoft\Edge\Application\msedge.exe"
echo If Not fso.FileExists(edgePath^) Then edgePath = shell.ExpandEnvironmentStrings("%%ProgramFiles%%"^) ^& "\Microsoft\Edge\Application\msedge.exe"
echo If Not fso.FileExists(edgePath^) Then edgePath = shell.ExpandEnvironmentStrings("%%LocalAppData%%"^) ^& "\Microsoft\Edge\Application\msedge.exe"
echo If fso.FileExists(edgePath^) Then
echo   shell.Run """" ^& edgePath ^& """ --app=""" ^& htmlUrl ^& """ --user-data-dir=""" ^& fso.BuildPath(scriptDir, "appdata"^) ^& """", 1, False
echo Else
echo   shell.Run htmlUrl, 1, False
echo End If
) > "%INSTALL_DIR%\PromptWorkshop.vbs"

REM Create .bat launcher as fallback
(
echo @echo off
echo REM Prompt Workshop — opens in your default browser
echo start "" "%%~dp0viewer.html"
) > "%INSTALL_DIR%\PromptWorkshop.bat"

REM Create one-click installer
(
echo @echo off
echo REM Prompt Workshop — One-click installer for Windows
echo setlocal enabledelayedexpansion
echo set "SOURCE_DIR=%%~dp0"
echo set "INSTALL_DIR=%%LocalAppData%%\PromptWorkshop"
echo set "START_MENU=%%AppData%%\Microsoft\Windows\Start Menu\Programs"
echo echo.
echo echo   ====================================
echo echo     Prompt Workshop — Installing...
echo echo   ====================================
echo echo.
echo if not exist "%%INSTALL_DIR%%" mkdir "%%INSTALL_DIR%%"
echo echo   Copying files...
echo copy /Y "%%SOURCE_DIR%%viewer.html" "%%INSTALL_DIR%%\viewer.html" ^> nul
echo copy /Y "%%SOURCE_DIR%%PromptWorkshop.vbs" "%%INSTALL_DIR%%\PromptWorkshop.vbs" ^> nul
echo copy /Y "%%SOURCE_DIR%%PromptWorkshop.bat" "%%INSTALL_DIR%%\PromptWorkshop.bat" ^> nul
echo if exist "%%SOURCE_DIR%%PromptWorkshop.ico" copy /Y "%%SOURCE_DIR%%PromptWorkshop.ico" "%%INSTALL_DIR%%\PromptWorkshop.ico" ^> nul
echo echo   Creating shortcuts...
echo set "ICON_PATH=%%INSTALL_DIR%%\PromptWorkshop.ico"
echo powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%%UserProfile%%\Desktop\Prompt Workshop.lnk'^); $s.TargetPath = '%%INSTALL_DIR%%\PromptWorkshop.vbs'; $s.WorkingDirectory = '%%INSTALL_DIR%%'; $s.Description = 'Prompt Workshop'; if (Test-Path '%%ICON_PATH%%'^) { $s.IconLocation = '%%ICON_PATH%%,0' }; $s.Save(^)"
echo powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%%START_MENU%%\Prompt Workshop.lnk'^); $s.TargetPath = '%%INSTALL_DIR%%\PromptWorkshop.vbs'; $s.WorkingDirectory = '%%INSTALL_DIR%%'; $s.Description = 'Prompt Workshop'; if (Test-Path '%%ICON_PATH%%'^) { $s.IconLocation = '%%ICON_PATH%%,0' }; $s.Save(^)"
echo echo.
echo echo   Done! Prompt Workshop has been installed.
echo echo   Launch it from your Desktop or Start Menu.
echo echo.
echo pause
) > "%INSTALL_DIR%\Install.bat"

REM Create README
(
echo Prompt Workshop — diShine Digital Agency
echo.
echo EASY INSTALL:
echo   Double-click Install.bat
echo   This creates Desktop and Start Menu shortcuts.
echo.
echo PORTABLE USE (no install^):
echo   Double-click PromptWorkshop.vbs to launch directly.
echo.
echo Built by diShine Digital Agency — https://dishine.it
) > "%INSTALL_DIR%\README.txt"

echo.
echo Done! Output: %INSTALL_DIR%
echo.
echo To install:
echo   1. Double-click Install.bat (creates shortcuts^)
echo   2. Launch from Desktop or Start Menu
echo.
echo Or portable: double-click PromptWorkshop.vbs
