#!/bin/bash
# Build a macOS .app bundle for Prompt Workshop
# Works on Linux or macOS — no Xcode needed
# Usage: ./desktop/build-macos.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
APP_NAME="PromptWorkshop"
BUNDLE_ID="it.dishine.prompt-workshop"
VERSION=$(node -e "console.log(require('$REPO_DIR/package.json').version)")
OUTPUT_DIR="$REPO_DIR/dist"

echo "Building $APP_NAME.app v$VERSION..."

# Clean
rm -rf "$OUTPUT_DIR/$APP_NAME.app" "$OUTPUT_DIR/$APP_NAME.tar.gz"
mkdir -p "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS"
mkdir -p "$OUTPUT_DIR/$APP_NAME.app/Contents/Resources"

# Info.plist
cat > "$OUTPUT_DIR/$APP_NAME.app/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>$APP_NAME</string>
  <key>CFBundleIdentifier</key>
  <string>$BUNDLE_ID</string>
  <key>CFBundleName</key>
  <string>Prompt Workshop</string>
  <key>CFBundleDisplayName</key>
  <string>Prompt Workshop — diShine</string>
  <key>CFBundleVersion</key>
  <string>$VERSION</string>
  <key>CFBundleShortVersionString</key>
  <string>$VERSION</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>LSMinimumSystemVersion</key>
  <string>10.13</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>CFBundleIconFile</key>
  <string>AppIcon</string>
</dict>
</plist>
PLIST

# Launcher script
cat > "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME" << 'LAUNCHER'
#!/bin/bash
# Prompt Workshop launcher — opens the embedded HTML in the default browser
DIR="$(cd "$(dirname "$0")/../Resources" && pwd)"
open "$DIR/viewer.html"
LAUNCHER
chmod +x "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME"

# Copy the HTML
cp "$REPO_DIR/viewer.html" "$OUTPUT_DIR/$APP_NAME.app/Contents/Resources/viewer.html"

# Create distribution archive
cd "$OUTPUT_DIR"
tar -czf "$APP_NAME.tar.gz" "$APP_NAME.app"

# Stats
APP_SIZE=$(du -sh "$APP_NAME.app" | cut -f1)
ARCHIVE_SIZE=$(du -sh "$APP_NAME.tar.gz" | cut -f1)

echo ""
echo "✓ Built $APP_NAME.app ($APP_SIZE)"
echo "✓ Created $APP_NAME.tar.gz ($ARCHIVE_SIZE)"
echo ""
echo "To install on macOS:"
echo "  1. Download $APP_NAME.tar.gz"
echo "  2. Extract: tar -xzf $APP_NAME.tar.gz"
echo "  3. Move to Applications: mv $APP_NAME.app /Applications/"
echo "  4. Launch from Applications or Spotlight"
echo ""
echo "Note: On first launch, macOS may show a security warning."
echo "Right-click the app → Open to bypass Gatekeeper."
