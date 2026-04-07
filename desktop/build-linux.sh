#!/bin/bash
# Build a Linux .desktop application for Prompt Workshop
# Creates a self-contained directory with launcher and .desktop file
# Usage: ./desktop/build-linux.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
APP_NAME="prompt-workshop"
VERSION=$(node -e "console.log(require('$REPO_DIR/package.json').version)")
OUTPUT_DIR="$REPO_DIR/dist"
INSTALL_DIR="$OUTPUT_DIR/$APP_NAME"

echo "Building $APP_NAME v$VERSION for Linux..."

# Clean
rm -rf "$INSTALL_DIR" "$OUTPUT_DIR/$APP_NAME-linux.tar.gz"
mkdir -p "$INSTALL_DIR"

# Copy the HTML
cp "$REPO_DIR/viewer.html" "$INSTALL_DIR/viewer.html"

# Create launcher script
cat > "$INSTALL_DIR/$APP_NAME" << 'LAUNCHER'
#!/bin/bash
# Prompt Workshop launcher — opens the embedded HTML in the default browser
DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="$DIR/viewer.html"

if command -v xdg-open &> /dev/null; then
  xdg-open "$HTML"
elif command -v gnome-open &> /dev/null; then
  gnome-open "$HTML"
elif command -v kde-open &> /dev/null; then
  kde-open "$HTML"
elif command -v firefox &> /dev/null; then
  firefox "$HTML" &
elif command -v google-chrome &> /dev/null; then
  google-chrome "$HTML" &
elif command -v chromium-browser &> /dev/null; then
  chromium-browser "$HTML" &
else
  echo "No browser found. Open this file manually:"
  echo "  $HTML"
  exit 1
fi
LAUNCHER
chmod +x "$INSTALL_DIR/$APP_NAME"

# Create .desktop file for app launcher integration
cat > "$INSTALL_DIR/$APP_NAME.desktop" << DESKTOP
[Desktop Entry]
Version=1.0
Type=Application
Name=Prompt Workshop
GenericName=AI Prompt Library
Comment=82+ expert prompt templates — browse, compose, create, lint, optimize, and test prompts
Exec=INSTALL_PATH/$APP_NAME
Icon=text-x-generic
Terminal=false
Categories=Development;Utility;TextEditor;
Keywords=prompt;ai;llm;gpt;claude;gemini;templates;
StartupNotify=false
DESKTOP

# Create install script
cat > "$INSTALL_DIR/install.sh" << 'INSTALL'
#!/bin/bash
# Install Prompt Workshop to ~/.local
set -e

APP_NAME="prompt-workshop"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_BASE="$HOME/.local"
INSTALL_DIR="$INSTALL_BASE/share/$APP_NAME"
BIN_DIR="$INSTALL_BASE/bin"
DESKTOP_DIR="$INSTALL_BASE/share/applications"

echo "Installing Prompt Workshop..."

# Create directories
mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR"

# Copy files
cp "$SCRIPT_DIR/viewer.html" "$INSTALL_DIR/viewer.html"
cp "$SCRIPT_DIR/$APP_NAME" "$INSTALL_DIR/$APP_NAME"
chmod +x "$INSTALL_DIR/$APP_NAME"

# Create symlink in bin
ln -sf "$INSTALL_DIR/$APP_NAME" "$BIN_DIR/$APP_NAME"

# Install .desktop file with correct path
sed "s|INSTALL_PATH/|$INSTALL_DIR/|g" "$SCRIPT_DIR/$APP_NAME.desktop" > "$DESKTOP_DIR/$APP_NAME.desktop"

# Update desktop database if available
if command -v update-desktop-database &> /dev/null; then
  update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo ""
echo "✓ Installed to $INSTALL_DIR"
echo "✓ Launcher symlinked to $BIN_DIR/$APP_NAME"
echo "✓ Desktop entry added"
echo ""
echo "Launch from:"
echo "  • Application menu (search 'Prompt Workshop')"
echo "  • Terminal: $APP_NAME"
echo ""
echo "To uninstall:"
echo "  rm -rf $INSTALL_DIR"
echo "  rm -f $BIN_DIR/$APP_NAME"
echo "  rm -f $DESKTOP_DIR/$APP_NAME.desktop"
INSTALL
chmod +x "$INSTALL_DIR/install.sh"

# Create distribution archive
cd "$OUTPUT_DIR"
tar -czf "$APP_NAME-linux.tar.gz" "$APP_NAME"

# Stats
APP_SIZE=$(du -sh "$APP_NAME" | cut -f1)
ARCHIVE_SIZE=$(du -sh "$APP_NAME-linux.tar.gz" | cut -f1)

echo ""
echo "✓ Built $APP_NAME ($APP_SIZE)"
echo "✓ Created $APP_NAME-linux.tar.gz ($ARCHIVE_SIZE)"
echo ""
echo "To install on Linux:"
echo "  1. Extract: tar -xzf $APP_NAME-linux.tar.gz"
echo "  2. Run installer: cd $APP_NAME && ./install.sh"
echo "  3. Launch from application menu or terminal: $APP_NAME"
echo ""
echo "Or run directly without installing:"
echo "  cd $APP_NAME && ./$APP_NAME"
