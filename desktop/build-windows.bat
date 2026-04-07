@echo off
REM Build a Windows portable application for Prompt Workshop
REM Creates a self-contained directory with launcher
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

REM Create launcher batch file
(
echo @echo off
echo REM Prompt Workshop — opens in your default browser
echo start "" "%%~dp0viewer.html"
) > "%INSTALL_DIR%\PromptWorkshop.bat"

REM Create VBS launcher (double-click friendly, no console window)
(
echo Set shell = CreateObject("WScript.Shell"^)
echo scriptDir = CreateObject("Scripting.FileSystemObject"^).GetParentFolderName(WScript.ScriptFullName^)
echo shell.Run "file:///" ^& Replace(scriptDir, "\", "/"^) ^& "/viewer.html", 1, False
) > "%INSTALL_DIR%\PromptWorkshop.vbs"

REM Create README
(
echo Prompt Workshop — diShine
echo.
echo QUICK START:
echo   Double-click PromptWorkshop.vbs  (no console window^)
echo   Or double-click PromptWorkshop.bat (shows console briefly^)
echo   Or open viewer.html directly in any browser
echo.
echo INSTALL:
echo   Copy this entire folder anywhere you like.
echo   Pin PromptWorkshop.vbs to your Start menu or taskbar.
echo.
echo Your saved prompts are stored in the browser's localStorage
echo and persist across sessions.
echo.
echo Built by diShine Digital Agency — https://dishine.it
) > "%INSTALL_DIR%\README.txt"

echo.
echo Done! Output: %INSTALL_DIR%
echo.
echo To use:
echo   1. Copy the %APP_NAME% folder anywhere
echo   2. Double-click PromptWorkshop.vbs to launch
echo   3. Or open viewer.html directly in any browser
