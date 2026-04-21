# Desktop & Mobile Apps

> ## 🛑 DEPRECATED — The desktop apps are no longer maintained
>
> The macOS / Linux / Windows desktop apps documented on this page are **legacy** and are **frozen at v2.4.0**. **No further features, updates, or bug fixes will ship to them.**
>
> ### Use [prompt.dishine.it](https://prompt.dishine.it/) instead.
>
> The web version runs in any modern browser on any desktop OS, is kept up to date, and includes features that were **never shipped to the desktop builds**:
>
> - 🧠 **Many more AI models** across providers, updated as models ship
> - ⚔️ **Live Battle & [Leaderboard](https://prompt.dishine.it/wiki/leaderboard)** — multi-model comparison with community rankings in real time
> - 🔐 **[Private accounts & private chat](https://prompt.dishine.it/wiki/accounts-and-chat)** — sync your library across devices
> - 💬 **AI chat with files & memory** — upload documents, persistent context across sessions
> - 🌍 **Trilingual** (EN · IT · FR) with an integrated wiki
>
> You can add [prompt.dishine.it](https://prompt.dishine.it/) to your **Dock, Start Menu, or Home Screen** on any platform (macOS, Windows, Linux, iOS, Android) for an app-like experience.
>
> **The build scripts, Swift source, GTK source, and build documentation below remain in this repo for reference, historical builds, and community forks. Do not rely on them for new deployments.**

---

## Legacy desktop documentation (v2.4.0, unmaintained)

The Prompt Workshop can run as a **native macOS application** with its own window — no browser needed. On Linux and Windows, it opens in your browser as a lightweight, self-contained package.

All build scripts run on any system with Bash and Node.js. The macOS native app requires building on a Mac with **Xcode Command Line Tools** installed (`xcode-select --install`).

> ⚠️ **Important:** If you build on macOS without Xcode Command Line Tools (or on Linux), the build produces an **app-mode fallback** that opens in Chrome/Edge instead of a fully native window. To get the native app experience, install Xcode CLI Tools first — see [macOS Troubleshooting](#macos-troubleshooting).

### Quick Start

```bash
# Build for all platforms at once
./desktop/build-all.sh

# Or build individually
./desktop/build-macos.sh      # macOS native app (or browser fallback on Linux)
./desktop/build-linux.sh      # Linux with .desktop integration
# Windows: use build-all.sh or build-windows.bat on Windows
```

Output goes to `dist/`:

| Platform | Archive | Type | How to install |
|----------|---------|------|----------------|
| **macOS** (on Mac) | `PromptWorkshop-macOS.zip` | Native app (own window) | Double-click zip → drag to Applications |
| **macOS** (on Mac, no Xcode CLI) | `PromptWorkshop.tar.gz` | App-mode (Chrome/Edge window) | Extract → drag to Applications |
| **macOS** (on Linux) | `PromptWorkshop.tar.gz` | App-mode (Chrome/Edge window) | Extract → drag to Applications |
| **Linux** | `prompt-workshop-linux.tar.gz` | Native GTK app (own window) | Extract → double-click `install.sh` |
| **Windows** | `PromptWorkshop-win.zip` | Native-style app (Edge app mode) | Extract → double-click `Install.bat` |

---

## macOS — Native App (recommended)

### What is it?

A **real macOS application** that runs in its own window — just like any other app on your Mac. It does **not** open your browser. You get:

- ✅ Its own window with a native title bar
- ✅ Full menu bar (File, Edit, View, Window)
- ✅ Standard keyboard shortcuts (⌘C, ⌘V, ⌘Q, ⌘+/⌘- zoom, etc.)
- ✅ Dock icon — pin it to your Dock like any other app
- ✅ Spotlight search — find it by typing "Prompt Workshop"
- ✅ Full screen support (⌃⌘F)
- ✅ Your saved prompts persist between sessions
- ✅ Works completely offline — no internet needed

### How to install (step by step)

#### Option A: Build from source (recommended)

The desktop app is built from source — it takes about 30 seconds. You need a Mac with Xcode Command Line Tools (`swiftc` compiler).

> ⚠️ **You must install Xcode Command Line Tools first.** Without it, the build script creates an app-mode fallback that opens in Chrome/Edge instead of a fully native window. If you skip this step and the app opens in your browser, see [Troubleshooting](#macos-troubleshooting).

```bash
# 1. Install Xcode Command Line Tools (REQUIRED for native app)
xcode-select --install

# 2. Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# 3. Build the app — look for "★ Native build" in the output
./desktop/build-macos.sh

# 4. Install
mv dist/PromptWorkshop.app /Applications/

# 5. Launch
open /Applications/PromptWorkshop.app
```

> 💡 **Verify the build:** After running `build-macos.sh`, look at the output. You should see `★ Native build — runs in its own window`. If you see `⚠ App-mode fallback build`, install Xcode CLI Tools and rebuild.

### What's inside the app

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist              # App metadata (bundle ID, version, icon)
    ├── MacOS/
    │   └── PromptWorkshop      # Native macOS executable (Swift + WebKit)
    └── Resources/
        └── viewer.html         # The complete Prompt Workshop
```

The app is a native macOS application written in Swift. It uses Apple's built-in WebKit engine to display the Prompt Workshop in its own window — the same engine Safari uses, but without needing Safari or any other browser.

### How your data is stored

Your saved prompts, settings, and API keys are stored inside the app's own WebKit data store. This means:

- ✅ Data persists across app restarts and updates
- ✅ Data is separate from your browser — clearing Safari/Chrome data won't affect the app
- ⚠️ If you delete the app, your data is lost — **export your library first** (My Library → Export all as JSON)
- 💡 When updating, just replace the `.app` file — your data stays safe

### Keyboard shortcuts

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

Plus all the in-app shortcuts (1-7 for tabs, Ctrl+K for search, H for help, D for dark mode).

### <a name="macos-troubleshooting"></a>Troubleshooting

#### App opens in the browser instead of its own window

This means the build script created the **app-mode fallback** instead of the native app. This happens when:
- Xcode Command Line Tools are not installed (no `swiftc` compiler)
- The app was built on Linux and transferred to macOS

**Fix:**

```bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Rebuild the app
cd ai-prompt-library
./desktop/build-macos.sh

# 3. Look for "★ Native build" in the output — this confirms the native app was built
# 4. Reinstall
mv dist/PromptWorkshop.app /Applications/
```

**Quick workaround (no rebuild):** If you have Google Chrome, Microsoft Edge, or Brave installed, the fallback launcher will open the app in app mode (its own window, no address bar) instead of the default browser. Install one of these browsers and relaunch the app.

#### App icon is missing or blank in the Dock

If the app appears in the Dock with a blank/generic icon:

> ⚠️ **These commands clear system icon caches.** Review them before running. They are safe but require `sudo` (administrator password).

```bash
# Clear the macOS icon cache and restart Finder
sudo rm -rf /Library/Caches/com.apple.iconservices.store
sudo find /private/var/folders/ -name com.apple.dock.iconcache -exec rm -f {} \; 2>/dev/null
sudo find /private/var/folders/ -name com.apple.iconservices -exec rm -rf {} \; 2>/dev/null
killall Dock
```

Then reopen the app. macOS caches icons aggressively — rebuilding the cache forces it to re-read the icon from the app bundle.

#### "PromptWorkshop.app is damaged and can't be opened"

This is macOS Gatekeeper blocking unsigned apps. It's safe — the app is open source and you can inspect the code. Fix it with one of these methods:

**Method 1 (easiest):** Right-click the app → click **Open** → click **Open** again in the dialog.

**Method 2:** Open Terminal (search "Terminal" in Spotlight) and paste this:

```bash
xattr -cr /Applications/PromptWorkshop.app
```

Then double-click the app again.

**Method 3:** Go to **System Settings → Privacy & Security** → scroll down → click **Open Anyway** next to the blocked app message.

#### "PromptWorkshop.app can't be opened because Apple cannot check it for malicious software"

Same as above — use any of the three methods.

#### App doesn't appear in Spotlight

macOS indexes `/Applications/` periodically. To force it:

```bash
mdimport /Applications/PromptWorkshop.app
```

Or wait a few minutes — it will appear automatically.

#### Build error: "swiftc: command not found"

You need Xcode Command Line Tools. Without them, the build script creates an app-mode fallback instead of the native app (see [App opens in the browser](#macos-troubleshooting) above). Install them:

```bash
xcode-select --install
```

Follow the prompts. This is a one-time step — it takes about 5 minutes.

#### I want to add it to my Dock

1. Open `PromptWorkshop.app` from Applications
2. Right-click its icon in the Dock
3. Click **Options → Keep in Dock**

#### Code signing (optional, for distribution)

If distributing to others, you can sign the app to avoid Gatekeeper warnings:

```bash
# Requires an Apple Developer ID (on macOS with Xcode)
codesign --deep --force --sign "Developer ID Application: Your Name (TEAMID)" PromptWorkshop.app

# For notarization (fully trusted by Gatekeeper)
xcrun notarytool submit PromptWorkshop.zip --apple-id you@email.com --team-id TEAMID --wait
xcrun stapler staple PromptWorkshop.app
```

---

## macOS — App-Mode Fallback

If you build on Linux or don't have Xcode Command Line Tools, the build script creates a lighter version that opens in **Chrome/Edge/Brave app mode** (own window, no address bar or tabs). If none of these browsers are installed, it falls back to your default browser.

This version works identically to the native app in terms of features, but doesn't have macOS menu bar integration or its own data store (uses your browser's localStorage instead).

To upgrade to the native app version, install Xcode Command Line Tools and rebuild:

```bash
xcode-select --install
./desktop/build-macos.sh
```

---

## Linux — Native App

### What is it?

A **native Linux application** that runs in its own window — just like any other app on your desktop. It does **not** open your browser. You get:

- ✅ Its own window (no browser address bar, no tabs)
- ✅ Application menu entry — search "Prompt Workshop" in Activities/app launcher
- ✅ Keyboard shortcuts (Ctrl+C/V, Ctrl+±, F11 full screen)
- ✅ Works completely offline
- ✅ Your saved prompts persist between sessions

The native window uses GTK + WebKitGTK (pre-installed on most GNOME/Ubuntu/Fedora desktops). If those libraries aren't available, it falls back to Chrome/Edge app mode or your regular browser.

### How to install (step by step)

#### Option A: Build from source (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# 2. Build the Linux package
./desktop/build-linux.sh

# 3. Extract and install
cd dist
tar -xzf prompt-workshop-linux.tar.gz
cd prompt-workshop
./install.sh

# 4. Launch
prompt-workshop
```

You can also double-click `install.sh` from your file manager — on GNOME, a dialog shows progress and a "✅ Installed!" message.

> 💡 If `install.sh` opens as a text file instead of running, right-click it → **Properties** → **Permissions** → check **"Allow executing file as program"** → then double-click again.

#### Option B: Run directly (no install)

```bash
cd dist/prompt-workshop
./prompt-workshop
```

### What's inside the package

```
prompt-workshop/
├── viewer.html               # The complete Prompt Workshop
├── prompt-workshop            # Smart launcher (tries native → app-mode → browser)
├── prompt-workshop-app.py     # Native GTK + WebKit application
├── prompt-workshop.png        # App icon
├── prompt-workshop.desktop    # Desktop entry file
└── install.sh                 # GUI installer (double-click to install)
```

### Native window requirements

For the best experience (own window, no browser), the app needs these libraries. They're **pre-installed on most desktop Linux distros** (Ubuntu, Fedora, Pop!_OS, Linux Mint, etc.):

| Distro | Packages needed | Usually pre-installed? |
|--------|----------------|----------------------|
| Ubuntu/Debian | `python3-gi gir1.2-webkit2-4.0` | ✅ Yes (GNOME desktop) |
| Fedora | `python3-gobject webkit2gtk3` | ✅ Yes |
| Arch | `python-gobject webkit2gtk` | ⚠️ May need to install |
| Linux Mint | `python3-gi gir1.2-webkit2-4.0` | ✅ Yes |

If these are missing, the app automatically falls back to opening in Chrome/Edge app mode (own window) or your regular browser.

### Uninstall

```bash
rm -rf ~/.local/share/prompt-workshop
rm -f ~/.local/bin/prompt-workshop
rm -f ~/.local/share/applications/prompt-workshop.desktop
```

### Troubleshooting

#### "Permission denied" when running install.sh

Right-click `install.sh` → **Properties** → **Permissions** → check **"Allow executing file as program"**. Then double-click again.

Or from terminal:
```bash
chmod +x install.sh && ./install.sh
```

#### App doesn't appear in application menu after install

```bash
update-desktop-database ~/.local/share/applications/
```
On some systems, log out and back in.

#### `~/.local/bin` not in PATH

If `prompt-workshop` command isn't found in terminal after install:

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

---

## Windows — Native-Style App

### What is it?

A **native-style Windows application** that runs in its own window using Microsoft Edge (pre-installed on Windows 10/11). You get:

- ✅ Its own window (no address bar, no tabs — looks like a native app)
- ✅ Desktop shortcut with custom icon
- ✅ Start Menu entry — search "Prompt Workshop"
- ✅ Taskbar integration — pin it to your taskbar
- ✅ Works completely offline
- ✅ No admin rights needed
- ✅ No registry changes

### How to install (step by step)

#### Option A: Build from source

You need Bash (Git Bash or WSL) and Node.js 18+.

```bash
# 1. Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# 2. Build (from Git Bash or WSL)
./desktop/build-all.sh

# 3. Extract and install
# The output is in dist/PromptWorkshop-win.zip (or dist/PromptWorkshop-win/)
# Extract the zip, then double-click Install.bat
```

After running `Install.bat`, you get:
- A **Desktop shortcut** (Prompt Workshop icon on your desktop)
- A **Start Menu entry** (search "Prompt Workshop")

> 💡 **First time only:** Windows SmartScreen may show "Windows protected your PC". Click **More info** → **Run anyway**. This is normal for unsigned scripts.

#### Option B: Run without building (browser only)

If you don't want to build anything, just open `viewer.html` directly in your browser. You get the full Prompt Workshop, no build step needed.

### What's inside the package

```
PromptWorkshop-win/
├── viewer.html               # The complete Prompt Workshop
├── PromptWorkshop.vbs        # Native-style launcher (Edge app mode)
├── PromptWorkshop.bat        # Fallback launcher (default browser)
├── PromptWorkshop.ico        # App icon
├── Install.bat               # One-click installer (Desktop + Start Menu shortcuts)
├── Uninstall.bat             # One-click uninstaller
└── README.txt                # Quick start guide
```

### How it works

The app opens in **Microsoft Edge app mode** — this gives you a clean window without the browser's address bar, tabs, or menus. It looks and feels like a native desktop application.

- **Edge is pre-installed** on Windows 10 and 11
- If Edge isn't available, it tries **Google Chrome** app mode
- If neither is available, it opens in your default browser

### Portable use (no install)

Don't want to install? Just double-click `PromptWorkshop.vbs` directly from any folder. No installation needed.

### Uninstall

Double-click `Uninstall.bat` — removes the installed files and shortcuts. Or just delete:
- `%LocalAppData%\PromptWorkshop\` folder
- Desktop shortcut
- Start Menu shortcut

### Troubleshooting

#### Windows SmartScreen: "Windows protected your PC"

When running `Install.bat` or `PromptWorkshop.vbs` for the first time:

1. Click **"More info"**
2. Click **"Run anyway"**

This only happens once. SmartScreen flags files downloaded from the internet that aren't signed.

#### Antivirus blocks `.vbs` file

Some antivirus software blocks VBScript files:
- **Option 1:** Use `PromptWorkshop.bat` instead
- **Option 2:** Open `viewer.html` directly in your browser
- **Option 3:** Add an exception for the PromptWorkshop folder in your antivirus

#### App opens in full browser instead of its own window

This means Edge wasn't found in the standard location. Try:
- Install Microsoft Edge from [microsoft.com/edge](https://www.microsoft.com/edge)
- Or install Google Chrome — the launcher will use it in app mode

#### Path with special characters

Avoid installing to paths with special characters (`#`, `%`, accented letters):
- ✅ `C:\Users\YourName\AppData\Local\PromptWorkshop\`
- ❌ `C:\Users\José\My #Tools\PromptWorkshop\`

---

## General Notes (All Platforms)

### Data storage

Your saved prompts, settings, and preferences are stored in **your browser's localStorage**, not inside the application. This means:

- ✅ Data persists across app updates (replacing the app doesn't erase data)
- ✅ Data persists across browser sessions
- ⚠️ Data is tied to the specific browser you use
- ⚠️ Clearing browser data / cookies will erase saved prompts
- ⚠️ Private/incognito mode does not persist data

### Backup & portability

Always export your library before major changes:

1. Open the Prompt Workshop
2. Go to **My Library** tab (or click the floating 📚 button)
3. Click **Export all as JSON**
4. Save the JSON file somewhere safe

To restore on another device or browser:
1. Go to **My Library** tab
2. Click **Import JSON**
3. Select your backup file

### Updating the app

When a new version is released:

1. Download the new build for your platform
2. Replace the old files with the new ones
3. Your saved data is safe (it's in the browser, not the app files)

### Building from source

All build scripts require **Node.js 18+** and **Bash**. On Windows, use Git Bash or WSL to run the build scripts.

```bash
# Clone the repo
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# Build all platforms
./desktop/build-all.sh

# Output in dist/
ls dist/
```

---

## Android & iOS

The Prompt Workshop is a standalone HTML file that works in any modern mobile browser.

### Android

1. Transfer `viewer.html` to your device (email, cloud drive, USB)
2. Open it in Chrome
3. Tap ⋮ menu → **"Add to Home screen"**
4. Launch from your home screen like a regular app

**Troubleshooting:**
- If Chrome says "page not found", make sure you're opening the file directly (not a `.tar.gz` archive)
- If "Add to Home screen" is missing, try opening the file URL in Chrome's address bar: `file:///sdcard/Download/viewer.html`
- Some file managers open HTML in a built-in viewer — use "Open with" → Chrome instead

### iOS / iPadOS

1. Transfer `viewer.html` to your device (AirDrop, iCloud Drive, email)
2. Open it in Safari
3. Tap the share button (↑) → **"Add to Home Screen"**
4. Launch from your home screen

**Troubleshooting:**
- iOS requires Safari for "Add to Home Screen" — other browsers don't support this
- If localStorage isn't persisting, check Settings → Safari → ensure "Prevent Cross-Site Tracking" isn't blocking the local file

---

## Comparison with Alternatives

| Approach | Size | Deps | Offline | Native feel | Build on Linux |
|----------|------|------|---------|-------------|----------------|
| **This (macOS native)** | ~1MB | None (Swift built-in) | ✅ | ✅ Own window, menus, dock | ❌ (needs Mac + Xcode CLI) |
| **This (macOS app-mode)** | ~224KB | Chrome/Edge/Brave | ✅ | ✅ Own window (app mode) | ✅ |
| Electron / Nativefier | 200MB+ | Node.js | ✅ | Full native | ❌ |
| Tauri | 50-80MB | Rust | ✅ | Full native | ❌ (cross-compile) |
| PWA (hosted) | 0 | Web server | ✅ (after first load) | Partial | ✅ |

The macOS native build gives you a real native app experience at a fraction of the size of Electron or Tauri. On Linux and Windows, the browser wrapper approach provides the same features with zero-complexity builds and tiny package sizes.
