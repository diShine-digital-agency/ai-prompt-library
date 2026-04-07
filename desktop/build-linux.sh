#!/bin/bash
# Build a Linux application for Prompt Workshop
# Creates a native GTK+WebKit app (own window, no browser needed)
# Falls back to browser app-mode or regular browser if GTK/WebKit unavailable
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

# Copy the native Python app
cp "$SCRIPT_DIR/linux-native/prompt-workshop-app.py" "$INSTALL_DIR/prompt-workshop-app.py"
chmod +x "$INSTALL_DIR/prompt-workshop-app.py"

# Copy the app icon
if [ -f "$SCRIPT_DIR/icons/icon-256.png" ]; then
  cp "$SCRIPT_DIR/icons/icon-256.png" "$INSTALL_DIR/prompt-workshop.png"
fi

# Create smart launcher script — tries native, then app-mode, then browser
cat > "$INSTALL_DIR/$APP_NAME" << 'LAUNCHER'
#!/bin/bash
# Prompt Workshop launcher
# Tries: 1) Native GTK window  2) Browser app-mode  3) Regular browser
DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="$DIR/viewer.html"

# ── Try native GTK + WebKit window (best experience) ──
if command -v python3 &> /dev/null; then
  python3 -c "import gi; gi.require_version('Gtk','3.0')" 2>/dev/null
  if [ $? -eq 0 ]; then
    # Check for WebKit2 (4.1 or 4.0)
    python3 -c "import gi; gi.require_version('WebKit2','4.1')" 2>/dev/null || \
    python3 -c "import gi; gi.require_version('WebKit2','4.0')" 2>/dev/null
    if [ $? -eq 0 ]; then
      exec python3 "$DIR/prompt-workshop-app.py"
    fi
  fi
fi

# ── Try browser in app mode (own window, no address bar) ──
for browser in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
  if command -v "$browser" &> /dev/null; then
    exec "$browser" --app="file://$HTML" --class="PromptWorkshop" &
    exit 0
  fi
done

# ── Fallback: regular browser ──
if command -v xdg-open &> /dev/null; then
  xdg-open "$HTML"
elif command -v firefox &> /dev/null; then
  firefox "$HTML" &
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
Icon=INSTALL_PATH/prompt-workshop.png
Terminal=false
Categories=Development;Utility;TextEditor;
Keywords=prompt;ai;llm;gpt;claude;gemini;templates;
StartupNotify=false
DESKTOP

# Create install script — GUI-first, works with double-click from file manager
cat > "$INSTALL_DIR/install.sh" << 'INSTALL'
#!/bin/bash
# Install Prompt Workshop
# Double-click from file manager or run from terminal — both work!
set -e

APP_NAME="prompt-workshop"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_BASE="$HOME/.local"
INSTALL_DIR="$INSTALL_BASE/share/$APP_NAME"
BIN_DIR="$INSTALL_BASE/bin"
DESKTOP_DIR="$INSTALL_BASE/share/applications"

# ── Detect GUI dialog tool ──
GUI=""
if command -v zenity &> /dev/null; then
  GUI="zenity"
elif command -v kdialog &> /dev/null; then
  GUI="kdialog"
fi

gui_info() {
  if [ "$GUI" = "zenity" ]; then
    zenity --info --title="Prompt Workshop" --text="$1" --width=400 2>/dev/null
  elif [ "$GUI" = "kdialog" ]; then
    kdialog --msgbox "$1" --title "Prompt Workshop" 2>/dev/null
  else
    echo "$1"
  fi
}

gui_error() {
  if [ "$GUI" = "zenity" ]; then
    zenity --error --title="Prompt Workshop" --text="$1" --width=400 2>/dev/null
  elif [ "$GUI" = "kdialog" ]; then
    kdialog --error "$1" --title "Prompt Workshop" 2>/dev/null
  else
    echo "ERROR: $1" >&2
  fi
}

gui_progress() {
  if [ "$GUI" = "zenity" ]; then
    (
      echo "10"; echo "# Creating directories..."
      mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR"

      echo "30"; echo "# Copying application files..."
      cp "$SCRIPT_DIR/viewer.html" "$INSTALL_DIR/viewer.html"
      cp "$SCRIPT_DIR/$APP_NAME" "$INSTALL_DIR/$APP_NAME"
      cp "$SCRIPT_DIR/prompt-workshop-app.py" "$INSTALL_DIR/prompt-workshop-app.py"
      [ -f "$SCRIPT_DIR/prompt-workshop.png" ] && cp "$SCRIPT_DIR/prompt-workshop.png" "$INSTALL_DIR/prompt-workshop.png"
      chmod +x "$INSTALL_DIR/$APP_NAME"
      chmod +x "$INSTALL_DIR/prompt-workshop-app.py"

      echo "60"; echo "# Creating application menu entry..."
      ln -sf "$INSTALL_DIR/$APP_NAME" "$BIN_DIR/$APP_NAME"
      sed "s|INSTALL_PATH/|$INSTALL_DIR/|g" "$SCRIPT_DIR/$APP_NAME.desktop" > "$DESKTOP_DIR/$APP_NAME.desktop"

      echo "80"; echo "# Updating desktop database..."
      if command -v update-desktop-database &> /dev/null; then
        update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
      fi

      echo "100"; echo "# Done!"
    ) | zenity --progress --title="Installing Prompt Workshop" --text="Starting..." --percentage=0 --auto-close --width=400 2>/dev/null
    return $?
  else
    return 1  # No GUI progress available
  fi
}

# ── Try GUI install first ──
if [ -n "$GUI" ] && [ -z "$TERM" -o "$TERM" = "dumb" -o -n "$DISPLAY" ]; then
  if gui_progress; then
    # Check native support
    NATIVE_MSG=""
    if command -v python3 &> /dev/null; then
      python3 -c "import gi; gi.require_version('Gtk','3.0')" 2>/dev/null && \
      (python3 -c "import gi; gi.require_version('WebKit2','4.1')" 2>/dev/null || \
       python3 -c "import gi; gi.require_version('WebKit2','4.0')" 2>/dev/null) && \
      NATIVE_MSG="\n\n★ Native window mode detected — runs in its own window!"
    fi

    gui_info "✅ Prompt Workshop installed successfully!\n\nLaunch it from:\n  • Application menu (search \"Prompt Workshop\")\n  • Terminal: prompt-workshop$NATIVE_MSG"
    exit 0
  fi
fi

# ── Fallback: terminal-based install ──
# If double-clicked without GUI tools, try to open a terminal
if [ -z "$TERM" ] || [ "$TERM" = "dumb" ]; then
  for term in gnome-terminal konsole xfce4-terminal mate-terminal lxterminal xterm; do
    if command -v "$term" &> /dev/null; then
      case "$term" in
        gnome-terminal) exec "$term" -- bash "$0" ;;
        *) exec "$term" -e "bash $0" ;;
      esac
    fi
  done
fi

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   Prompt Workshop — Installing...    ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Create directories
mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR"

# Copy files
echo "  Copying files..."
cp "$SCRIPT_DIR/viewer.html" "$INSTALL_DIR/viewer.html"
cp "$SCRIPT_DIR/$APP_NAME" "$INSTALL_DIR/$APP_NAME"
cp "$SCRIPT_DIR/prompt-workshop-app.py" "$INSTALL_DIR/prompt-workshop-app.py"
[ -f "$SCRIPT_DIR/prompt-workshop.png" ] && cp "$SCRIPT_DIR/prompt-workshop.png" "$INSTALL_DIR/prompt-workshop.png"
chmod +x "$INSTALL_DIR/$APP_NAME"
chmod +x "$INSTALL_DIR/prompt-workshop-app.py"

# Create symlink in bin
echo "  Creating launcher..."
ln -sf "$INSTALL_DIR/$APP_NAME" "$BIN_DIR/$APP_NAME"

# Install .desktop file with correct path
echo "  Adding to application menu..."
sed "s|INSTALL_PATH/|$INSTALL_DIR/|g" "$SCRIPT_DIR/$APP_NAME.desktop" > "$DESKTOP_DIR/$APP_NAME.desktop"

# Update desktop database if available
if command -v update-desktop-database &> /dev/null; then
  update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

# Check if native mode will work
HAS_NATIVE=false
if command -v python3 &> /dev/null; then
  python3 -c "import gi; gi.require_version('Gtk','3.0')" 2>/dev/null && \
  (python3 -c "import gi; gi.require_version('WebKit2','4.1')" 2>/dev/null || \
   python3 -c "import gi; gi.require_version('WebKit2','4.0')" 2>/dev/null) && \
  HAS_NATIVE=true
fi

echo ""
echo "  ✅ Installed successfully!"
echo ""
echo "  ✓ Installed to $INSTALL_DIR"
echo "  ✓ Launcher: $BIN_DIR/$APP_NAME"
echo "  ✓ Desktop entry added to application menu"
echo ""

if $HAS_NATIVE; then
  echo "  ★ Native window mode available — runs in its own window!"
else
  echo "  ⚠ For the best experience (own window, no browser), install:"
  echo "    Ubuntu/Debian:  sudo apt install python3-gi gir1.2-webkit2-4.0"
  echo "    Fedora:         sudo dnf install python3-gobject webkit2gtk3"
  echo "    Arch:           sudo pacman -S python-gobject webkit2gtk"
fi

echo ""
echo "  Launch: search 'Prompt Workshop' in your application menu"
echo "     or: prompt-workshop"
echo ""
read -p "  Press Enter to close..."
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
