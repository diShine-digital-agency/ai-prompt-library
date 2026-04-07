#!/bin/bash
# Build Prompt Workshop for all platforms (macOS, Linux, Windows)
# Can run entirely on Linux — no Xcode, Visual Studio, or platform SDKs needed
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

# Create .bat launcher
cat > "$WIN_DIR/PromptWorkshop.bat" << 'BAT'
@echo off
REM Prompt Workshop — opens in your default browser
start "" "%~dp0viewer.html"
BAT

# Create .vbs launcher (no console window)
cat > "$WIN_DIR/PromptWorkshop.vbs" << 'VBS'
Set shell = CreateObject("WScript.Shell")
scriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
shell.Run "file:///" & Replace(scriptDir, "\", "/") & "/viewer.html", 1, False
VBS

# Create README
cat > "$WIN_DIR/README.txt" << 'README'
Prompt Workshop — diShine

QUICK START:
  Double-click PromptWorkshop.vbs  (no console window)
  Or double-click PromptWorkshop.bat (shows console briefly)
  Or open viewer.html directly in any browser

INSTALL:
  Copy this entire folder anywhere you like.
  Pin PromptWorkshop.vbs to your Start menu or taskbar.

Your saved prompts are stored in the browser's localStorage
and persist across sessions.

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
echo "macOS        | PromptWorkshop.tar.gz       | Extract → move .app to /Applications"
echo "Linux        | prompt-workshop-linux.tar.gz | Extract → ./install.sh"
echo "Windows      | PromptWorkshop-win.zip      | Extract → double-click .vbs"
