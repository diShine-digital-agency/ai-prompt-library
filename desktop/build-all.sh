#!/bin/bash
# Build Prompt Workshop for all platforms (macOS, Linux, Windows)
# macOS native app requires building on macOS with Xcode CLI Tools
# Usage: ./desktop/build-all.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
VERSION=$(node -e "console.log(require('$REPO_DIR/package.json').version)")
OUTPUT_DIR="$REPO_DIR/dist"

echo "═══════════════════════════════════════════════════"
echo "  Prompt Workshop v$VERSION — Cross-platform build"
echo "═══════════════════════════════════════════════════"
echo ""

# ── macOS ──
echo "▸ Building macOS .app..."
"$SCRIPT_DIR/build-macos.sh"
echo ""

# ── Linux ──
echo "▸ Building Linux package..."
"$SCRIPT_DIR/build-linux.sh"
echo ""

# ── Windows ──
echo "▸ Building Windows package..."
WIN_DIR="$OUTPUT_DIR/PromptWorkshop-win"
rm -rf "$WIN_DIR" "$OUTPUT_DIR/PromptWorkshop-win.zip"
mkdir -p "$WIN_DIR"

# Copy HTML
cp "$REPO_DIR/viewer.html" "$WIN_DIR/viewer.html"

# Copy the app icon
if [ -f "$SCRIPT_DIR/icons/PromptWorkshop.ico" ]; then
  cp "$SCRIPT_DIR/icons/PromptWorkshop.ico" "$WIN_DIR/PromptWorkshop.ico"
fi

# Create native VBS launcher — opens in Edge/Chrome app mode (own window, no browser chrome)
cat > "$WIN_DIR/PromptWorkshop.vbs" << 'VBS'
' Prompt Workshop — Native-style launcher for Windows
' Opens in its own window using Edge or Chrome app mode (no browser chrome).
' Falls back to default browser if neither is available.

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
htmlFile = fso.BuildPath(scriptDir, "viewer.html")
htmlUrl = "file:///" & Replace(htmlFile, "\", "/")

' Try Microsoft Edge app mode (pre-installed on Windows 10/11)
edgePaths = Array( _
    shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Microsoft\Edge\Application\msedge.exe", _
    shell.ExpandEnvironmentStrings("%ProgramFiles%") & "\Microsoft\Edge\Application\msedge.exe", _
    shell.ExpandEnvironmentStrings("%LocalAppData%") & "\Microsoft\Edge\Application\msedge.exe" _
)
For Each edgePath In edgePaths
    If fso.FileExists(edgePath) Then
        shell.Run """" & edgePath & """ --app=""" & htmlUrl & """ --user-data-dir=""" & fso.BuildPath(scriptDir, "appdata") & """", 1, False
        WScript.Quit
    End If
Next

' Try Google Chrome app mode
chromePaths = Array( _
    shell.ExpandEnvironmentStrings("%ProgramFiles%") & "\Google\Chrome\Application\chrome.exe", _
    shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Google\Chrome\Application\chrome.exe", _
    shell.ExpandEnvironmentStrings("%LocalAppData%") & "\Google\Chrome\Application\chrome.exe" _
)
For Each chromePath In chromePaths
    If fso.FileExists(chromePath) Then
        shell.Run """" & chromePath & """ --app=""" & htmlUrl & """ --user-data-dir=""" & fso.BuildPath(scriptDir, "appdata") & """", 1, False
        WScript.Quit
    End If
Next

' Fallback: open in default browser
shell.Run htmlUrl, 1, False
VBS

# Create .bat launcher as fallback
cat > "$WIN_DIR/PromptWorkshop.bat" << 'BAT'
@echo off
REM Prompt Workshop — opens in your default browser
start "" "%~dp0viewer.html"
BAT

# Create Install.bat — one-click installer that creates Start Menu + Desktop shortcuts
cat > "$WIN_DIR/Install.bat" << 'INSTALLBAT'
@echo off
REM Prompt Workshop — One-click installer for Windows
REM Creates Start Menu and Desktop shortcuts. No admin rights needed.
setlocal enabledelayedexpansion

set "SOURCE_DIR=%~dp0"
set "INSTALL_DIR=%LocalAppData%\PromptWorkshop"
set "START_MENU=%AppData%\Microsoft\Windows\Start Menu\Programs"

echo.
echo   ====================================
echo     Prompt Workshop — Installing...
echo   ====================================
echo.

REM Create install directory
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copy files
echo   Copying files...
copy /Y "%SOURCE_DIR%viewer.html" "%INSTALL_DIR%\viewer.html" > nul
copy /Y "%SOURCE_DIR%PromptWorkshop.vbs" "%INSTALL_DIR%\PromptWorkshop.vbs" > nul
copy /Y "%SOURCE_DIR%PromptWorkshop.bat" "%INSTALL_DIR%\PromptWorkshop.bat" > nul

REM Create Desktop shortcut
echo   Creating Desktop shortcut...
set "SHORTCUT_DESKTOP=%UserProfile%\Desktop\Prompt Workshop.lnk"
set "ICON_PATH=%INSTALL_DIR%\PromptWorkshop.ico"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_DESKTOP%'); $s.TargetPath = '%INSTALL_DIR%\PromptWorkshop.vbs'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Prompt Workshop - AI Prompt Library'; if (Test-Path '%ICON_PATH%') { $s.IconLocation = '%ICON_PATH%,0' }; $s.Save()"

REM Create Start Menu shortcut
echo   Creating Start Menu shortcut...
set "SHORTCUT_START=%START_MENU%\Prompt Workshop.lnk"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_START%'); $s.TargetPath = '%INSTALL_DIR%\PromptWorkshop.vbs'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Prompt Workshop - AI Prompt Library'; if (Test-Path '%ICON_PATH%') { $s.IconLocation = '%ICON_PATH%,0' }; $s.Save()"

echo.
echo   Done! Prompt Workshop has been installed.
echo.
echo   You can now launch it from:
echo     - Desktop shortcut (Prompt Workshop)
echo     - Start Menu (search "Prompt Workshop")
echo.
echo   Installed to: %INSTALL_DIR%
echo.
echo   To uninstall: delete the folder and shortcuts
echo     - %INSTALL_DIR%
echo     - %SHORTCUT_DESKTOP%
echo     - %SHORTCUT_START%
echo.
pause
INSTALLBAT

# Create Uninstall.bat
cat > "$WIN_DIR/Uninstall.bat" << 'UNINSTALLBAT'
@echo off
REM Prompt Workshop — Uninstaller
setlocal

set "INSTALL_DIR=%LocalAppData%\PromptWorkshop"
set "SHORTCUT_DESKTOP=%UserProfile%\Desktop\Prompt Workshop.lnk"
set "SHORTCUT_START=%AppData%\Microsoft\Windows\Start Menu\Programs\Prompt Workshop.lnk"

echo.
echo   Uninstalling Prompt Workshop...
echo.

if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
if exist "%SHORTCUT_DESKTOP%" del "%SHORTCUT_DESKTOP%"
if exist "%SHORTCUT_START%" del "%SHORTCUT_START%"

echo   Done! Prompt Workshop has been removed.
echo.
pause
UNINSTALLBAT

# Create README
cat > "$WIN_DIR/README.txt" << 'README'
Prompt Workshop — diShine Digital Agency

EASY INSTALL (recommended):
  Double-click Install.bat
  This creates Desktop and Start Menu shortcuts automatically.
  Then launch "Prompt Workshop" from your Desktop or Start Menu.

PORTABLE USE (no install):
  Double-click PromptWorkshop.vbs to launch directly.
  No installation needed — run from any folder.

HOW IT WORKS:
  The app opens in its own window using Microsoft Edge (pre-installed
  on Windows 10/11). It looks and feels like a native app — no address
  bar, no tabs, just the Prompt Workshop.

  If Edge is not available, it tries Google Chrome, then falls back
  to your default browser.

UNINSTALL:
  Double-click Uninstall.bat to remove everything.
  Or just delete the Prompt Workshop folder and shortcuts.

Your saved prompts persist between sessions and app updates.

Built by diShine Digital Agency — https://dishine.it
README

# Create zip (use tar if zip not available)
cd "$OUTPUT_DIR"
if command -v zip &> /dev/null; then
  zip -rq "PromptWorkshop-win.zip" "PromptWorkshop-win"
else
  tar -czf "PromptWorkshop-win.tar.gz" "PromptWorkshop-win"
fi

WIN_SIZE=$(du -sh "PromptWorkshop-win" | cut -f1)
echo ""
echo "✓ Built PromptWorkshop-win ($WIN_SIZE)"
if [ -f "PromptWorkshop-win.zip" ]; then
  ARCHIVE_SIZE=$(du -sh "PromptWorkshop-win.zip" | cut -f1)
  echo "✓ Created PromptWorkshop-win.zip ($ARCHIVE_SIZE)"
else
  ARCHIVE_SIZE=$(du -sh "PromptWorkshop-win.tar.gz" | cut -f1)
  echo "✓ Created PromptWorkshop-win.tar.gz ($ARCHIVE_SIZE)"
fi

# ── Summary ──
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Build complete! Artifacts in dist/"
echo "═══════════════════════════════════════════════════"
echo ""
ls -lh "$OUTPUT_DIR"/*.tar.gz "$OUTPUT_DIR"/*.zip 2>/dev/null || true
echo ""
echo "Platform     | Archive                     | Install method"
echo "-------------|-----------------------------|---------------------------------"
echo "macOS        | PromptWorkshop.tar.gz       | Extract → drag .app to /Applications"
echo "Linux        | prompt-workshop-linux.tar.gz | Extract → double-click install.sh"
echo "Windows      | PromptWorkshop-win.zip      | Extract → double-click Install.bat"
