#!/bin/bash
# Build a macOS .app bundle for Prompt Workshop
# On macOS: builds a native app with its own window (no browser needed)
# On Linux: builds a lightweight browser-wrapper .app as fallback
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

# ── Detect if we can build native (macOS + swiftc) ──
NATIVE=false
if [[ "$(uname)" == "Darwin" ]] && command -v swiftc &> /dev/null; then
  NATIVE=true
fi

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
  <string>11.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>CFBundleIconFile</key>
  <string>AppIcon</string>
</dict>
</plist>
PLIST

if $NATIVE; then
  # ── Native build: compile Swift app with WKWebView ──
  echo "  → Compiling native app (Swift + WKWebView)..."
  swiftc \
    -O \
    -whole-module-optimization \
    -import-objc-header /dev/null \
    -framework Cocoa \
    -framework WebKit \
    "$SCRIPT_DIR/macos-native/PromptWorkshop.swift" \
    -o "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME"

  echo "  → Native app compiled (runs in its own window, no browser needed)"
else
  # ── Fallback: browser-wrapper launcher ──
  echo "  → Building browser-wrapper (not on macOS or swiftc unavailable)"
  echo "  → For the native app, build on macOS with Xcode Command Line Tools"
  cat > "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME" << 'LAUNCHER'
#!/bin/bash
# Prompt Workshop launcher — opens the embedded HTML in the default browser
DIR="$(cd "$(dirname "$0")/../Resources" && pwd)"
open "$DIR/viewer.html"
LAUNCHER
  chmod +x "$OUTPUT_DIR/$APP_NAME.app/Contents/MacOS/$APP_NAME"
fi

# Copy the HTML
cp "$REPO_DIR/viewer.html" "$OUTPUT_DIR/$APP_NAME.app/Contents/Resources/viewer.html"

# Copy the app icon
if [ -f "$SCRIPT_DIR/icons/AppIcon.icns" ]; then
  cp "$SCRIPT_DIR/icons/AppIcon.icns" "$OUTPUT_DIR/$APP_NAME.app/Contents/Resources/AppIcon.icns"
  echo "  → App icon included"
fi

# Create distribution archives (.zip for easy Finder install + .tar.gz)
cd "$OUTPUT_DIR"
if command -v zip &> /dev/null; then
  zip -rq "$APP_NAME-macOS.zip" "$APP_NAME.app"
fi
tar -czf "$APP_NAME.tar.gz" "$APP_NAME.app"

# Stats
APP_SIZE=$(du -sh "$APP_NAME.app" | cut -f1)
echo ""
echo "✓ Built $APP_NAME.app ($APP_SIZE)"
if [ -f "$APP_NAME-macOS.zip" ]; then
  ARCHIVE_SIZE=$(du -sh "$APP_NAME-macOS.zip" | cut -f1)
  echo "✓ Created $APP_NAME-macOS.zip ($ARCHIVE_SIZE) — double-click to extract in Finder"
fi
ARCHIVE_SIZE=$(du -sh "$APP_NAME.tar.gz" | cut -f1)
echo "✓ Created $APP_NAME.tar.gz ($ARCHIVE_SIZE)"

if $NATIVE; then
  echo ""
  echo "  ★ Native build — runs in its own window (no browser needed)"
  echo "  ★ Full macOS integration: menu bar, ⌘C/V, zoom, full screen"
  echo "  ★ Your saved data persists in the app's own storage"
fi

echo ""
echo "To install on macOS:"
echo "  1. Download $APP_NAME.tar.gz"
echo "  2. Extract: tar -xzf $APP_NAME.tar.gz"
echo "  3. Move to Applications: mv $APP_NAME.app /Applications/"
echo "  4. Launch from Applications or Spotlight"
echo ""
echo "Note: On first launch, macOS may show a security warning."
echo "Right-click the app → Open to bypass Gatekeeper."
