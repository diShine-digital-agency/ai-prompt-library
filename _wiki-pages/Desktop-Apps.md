# Desktop Apps

> ## 🛑 DEPRECATED — no longer maintained
>
> The desktop apps documented on this page are **legacy, frozen at v2.4.0**, and will **not receive further updates**. **Use [prompt.dishine.it](https://prompt.dishine.it/) instead** — it runs in any modern browser on any OS (and you can add it to your Dock / Home Screen for an app-like experience) and includes features that were never shipped to desktop: many more models, [Live Battle & Leaderboard](https://prompt.dishine.it/wiki/leaderboard), [private accounts & chat](https://prompt.dishine.it/wiki/accounts-and-chat), and AI chat with files and memory.
>
> This page is preserved for contributors maintaining forks of the legacy desktop builds.

> Build and install native desktop applications for macOS, Linux, and Windows *(legacy, v2.4.0)*.

---

## Table of Contents

- [Overview](#overview)
- [Build Commands](#build-commands)
- [macOS — Native App](#macos--native-app)
- [Linux — Native App](#linux--native-app)
- [Windows — Native-Style App](#windows--native-style-app)
- [Android & iOS](#android--ios)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Prompt Workshop can run as a **desktop application** on all major platforms. Each platform uses a different approach optimized for native feel:

| Platform | Technology | Native Window | Browser Needed |
|----------|-----------|:------------:|:--------------:|
| **macOS** | Swift + WebKit | ✅ | ❌ |
| **Linux** | Python + GTK + WebKitGTK | ✅ | ❌ |
| **Windows** | Edge app mode (VBScript launcher) | ✅ | ✅ (Edge/Chrome) |
| **Android/iOS** | Browser + "Add to Home Screen" | Partial | ✅ |

All desktop apps are **built from source** — there are no pre-built downloads.

---

## Build Commands

All builds require **Node.js 18+** and **Bash** (Git Bash or WSL on Windows).

```bash
# Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# Build for all platforms at once
./desktop/build-all.sh

# Or build individually
./desktop/build-macos.sh      # macOS
./desktop/build-linux.sh      # Linux
# Windows: use build-all.sh or build-windows.bat on Windows
```

**Output goes to `dist/`:**

| Platform | Archive | Type |
|----------|---------|------|
| macOS (with Xcode CLI) | `PromptWorkshop-macOS.zip` | Native app (own window) |
| macOS (without Xcode CLI) | `PromptWorkshop.tar.gz` | App-mode fallback (Chrome/Edge) |
| Linux | `prompt-workshop-linux.tar.gz` | Native GTK app |
| Windows | `PromptWorkshop-win.zip` | Edge app mode |

---

## macOS — Native App

### What You Get

A **real macOS application** that runs in its own window — no browser needed:

- ✅ Its own window with a native title bar
- ✅ Full menu bar (File, Edit, View, Window)
- ✅ Standard keyboard shortcuts (⌘C, ⌘V, ⌘Q, ⌘+/⌘- zoom)
- ✅ Dock icon — pin it to your Dock
- ✅ Spotlight search — find it by typing "Prompt Workshop"
- ✅ Full screen support (⌃⌘F)
- ✅ Works completely offline
- ✅ Saved prompts persist between sessions

### Requirements

- **macOS 11+**
- **Xcode Command Line Tools** (for native app build)
  ```bash
  xcode-select --install
  ```

> **Without Xcode CLI Tools**, the build creates an **app-mode fallback** that opens in Chrome/Edge instead of a native window.

### Build & Install

```bash
# 1. Install Xcode Command Line Tools (REQUIRED for native app)
xcode-select --install

# 2. Build the app — look for "★ Native build" in the output
./desktop/build-macos.sh

# 3. Install
mv dist/PromptWorkshop.app /Applications/

# 4. Launch
open /Applications/PromptWorkshop.app
```

### App Structure

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist              # App metadata (bundle ID, version, icon)
    ├── MacOS/
    │   └── PromptWorkshop      # Native executable (Swift + WebKit)
    └── Resources/
        └── viewer.html         # The complete Prompt Workshop
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘Q | Quit |
| ⌘W | Close window |
| ⌘C / ⌘V | Copy / Paste |
| ⌘Z / ⇧⌘Z | Undo / Redo |
| ⌘+ / ⌘- | Zoom in / out |
| ⌘0 | Reset zoom |
| ⌃⌘F | Toggle full screen |
| ⌘R | Reload |
| ⌘M | Minimize |
| ⌘H | Hide |

Plus all in-app shortcuts (1–7 for tabs, Ctrl+K for search, H for help, D for dark mode).

### Data Storage

Your saved prompts and settings are stored in the app's own WebKit data store:

- ✅ Data persists across app restarts and updates
- ✅ Separate from browser data — clearing Safari/Chrome won't affect the app
- ⚠️ If you delete the app, your data is lost — **export your library first**

---

## Linux — Native App

### What You Get

A **native Linux application** running in its own window:

- ✅ Its own window (no browser address bar or tabs)
- ✅ Application menu entry — search "Prompt Workshop"
- ✅ Keyboard shortcuts (Ctrl+C/V, Ctrl+±, F11 full screen)
- ✅ Works completely offline
- ✅ Saved prompts persist between sessions

### Requirements

The native window needs GTK + WebKitGTK (pre-installed on most desktop distros):

| Distro | Packages Needed | Pre-installed? |
|--------|----------------|:--------------:|
| Ubuntu/Debian | `python3-gi gir1.2-webkit2-4.0` | ✅ Yes (GNOME) |
| Fedora | `python3-gobject webkit2gtk3` | ✅ Yes |
| Arch | `python-gobject webkit2gtk` | ⚠️ May need install |
| Linux Mint | `python3-gi gir1.2-webkit2-4.0` | ✅ Yes |

If missing, the app falls back to Chrome/Edge app mode or your regular browser.

**For clipboard support:** install `xclip` (`sudo apt install xclip`).

### Build & Install

```bash
# 1. Build the Linux package
./desktop/build-linux.sh

# 2. Extract and install
cd dist
tar -xzf prompt-workshop-linux.tar.gz
cd prompt-workshop
./install.sh

# 3. Launch
prompt-workshop
```

You can also double-click `install.sh` from your file manager — on GNOME, a dialog shows progress and a "✅ Installed!" message.

### Package Contents

```
prompt-workshop/
├── viewer.html               # The complete Prompt Workshop
├── prompt-workshop            # Smart launcher (native → app-mode → browser)
├── prompt-workshop-app.py     # Native GTK + WebKit application
├── prompt-workshop.png        # App icon
├── prompt-workshop.desktop    # Desktop entry file
└── install.sh                 # GUI installer (double-click to install)
```

### Install Locations

| File | Location |
|------|----------|
| App files | `~/.local/share/prompt-workshop/` |
| Launcher | `~/.local/bin/prompt-workshop` |
| Desktop entry | `~/.local/share/applications/prompt-workshop.desktop` |

### Uninstall

```bash
rm -rf ~/.local/share/prompt-workshop
rm -f ~/.local/bin/prompt-workshop
rm -f ~/.local/share/applications/prompt-workshop.desktop
```

---

## Windows — Native-Style App

### What You Get

A **native-style Windows application** using Microsoft Edge app mode:

- ✅ Its own window (no address bar, no tabs)
- ✅ Desktop shortcut with custom icon
- ✅ Start Menu entry — search "Prompt Workshop"
- ✅ Taskbar integration — pin to taskbar
- ✅ Works completely offline
- ✅ No admin rights needed
- ✅ No registry changes

### How It Works

The app opens in **Microsoft Edge app mode** — a clean window without browser chrome. Edge is pre-installed on Windows 10/11.

**Fallback chain:** Edge app mode → Chrome app mode → default browser

### Build & Install

Requires Bash (Git Bash or WSL) and Node.js 18+.

```bash
# 1. Build (from Git Bash or WSL)
./desktop/build-all.sh

# 2. Extract the zip from dist/
# 3. Double-click Install.bat
```

`Install.bat` creates:
- A **Desktop shortcut** (with custom icon)
- A **Start Menu entry** (searchable as "Prompt Workshop")

### Package Contents

```
PromptWorkshop-win/
├── viewer.html               # The complete Prompt Workshop
├── PromptWorkshop.vbs        # Native-style launcher (Edge app mode)
├── PromptWorkshop.bat        # Fallback launcher (default browser)
├── PromptWorkshop.ico        # App icon
├── Install.bat               # One-click installer
├── Uninstall.bat             # One-click uninstaller
└── README.txt                # Quick start guide
```

### Portable Use

Don't want to install? Just double-click `PromptWorkshop.vbs` directly from any folder.

### Uninstall

Double-click `Uninstall.bat`, or manually delete:
- `%LocalAppData%\PromptWorkshop\` folder
- Desktop shortcut
- Start Menu shortcut

---

## Android & iOS

The Prompt Workshop works in any modern mobile browser as a standalone HTML file.

### Android

1. Transfer `viewer.html` to your device (email, cloud drive, USB)
2. Open it in Chrome
3. Tap ⋮ menu → **"Add to Home screen"**
4. Launch from your home screen like a regular app

### iOS / iPadOS

1. Transfer `viewer.html` to your device (AirDrop, iCloud Drive, email)
2. Open it in Safari
3. Tap the share button (↑) → **"Add to Home Screen"**
4. Launch from your home screen

> **Note:** iOS requires Safari for "Add to Home Screen" — other browsers don't support this.

---

## Troubleshooting

### macOS: App Opens in Browser Instead of Own Window

The build created the **app-mode fallback** instead of the native app.

**Cause:** Xcode Command Line Tools not installed (no `swiftc` compiler).

**Fix:**
```bash
xcode-select --install       # Install Xcode CLI Tools
./desktop/build-macos.sh     # Rebuild — look for "★ Native build"
mv dist/PromptWorkshop.app /Applications/
```

### macOS: App Icon Missing in Dock

```bash
# Clear icon cache and restart Finder
sudo rm -rf /Library/Caches/com.apple.iconservices.store
killall Dock
```

### macOS: "App is damaged and can't be opened"

This is macOS Gatekeeper blocking unsigned apps. Fix with one of:

1. **Right-click** the app → click **Open** → click **Open** in the dialog
2. Run: `xattr -cr /Applications/PromptWorkshop.app`
3. Go to **System Settings → Privacy & Security** → click **Open Anyway**

### macOS: Build Error "swiftc: command not found"

Install Xcode Command Line Tools: `xcode-select --install`

### Linux: "Permission denied" on install.sh

```bash
chmod +x install.sh && ./install.sh
```

Or right-click → Properties → Permissions → check "Allow executing file as program".

### Linux: App Not in Application Menu

```bash
update-desktop-database ~/.local/share/applications/
```

### Linux: `~/.local/bin` Not in PATH

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

### Windows: SmartScreen "Windows protected your PC"

1. Click **"More info"**
2. Click **"Run anyway"**

This only happens once for files downloaded from the internet.

### Windows: Antivirus Blocks .vbs File

- Use `PromptWorkshop.bat` instead
- Or open `viewer.html` directly in your browser
- Or add an exception in your antivirus

### Windows: App Opens in Full Browser

Edge wasn't found. Install [Microsoft Edge](https://www.microsoft.com/edge) or Google Chrome — the launcher will use app mode.

---

## Data Backup

Before updating or uninstalling, export your data:

1. Open the Prompt Workshop
2. Go to **My Library** tab (or click 📚)
3. Click **Export all as JSON**
4. Save the file

To restore: **My Library** → **Import JSON** → select your backup file.

---

**Navigation:** [← Architecture](Architecture) &nbsp;|&nbsp; [Contributing →](Contributing)
