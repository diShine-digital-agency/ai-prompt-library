# Desktop & Mobile Apps

The Prompt Workshop can run as a **native macOS application** with its own window — no browser needed. On Linux and Windows, it opens in your browser as a lightweight, self-contained package.

All build scripts run on any system with Bash and Node.js. The macOS native app requires building on a Mac.

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

| Platform | Archive | Type | Install |
|----------|---------|------|---------|
| **macOS** (on Mac) | `PromptWorkshop.tar.gz` | Native app (own window) | Extract → drag to Applications |
| **macOS** (on Linux) | `PromptWorkshop.tar.gz` | Browser wrapper | Extract → drag to Applications |
| **Linux** | `prompt-workshop-linux.tar.gz` | Browser wrapper | Extract → `./install.sh` |
| **Windows** | `PromptWorkshop-win.zip` | Browser wrapper | Extract → double-click `.vbs` |

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

#### Option A: Download and install (easiest)

1. **Download** `PromptWorkshop.tar.gz` from the [Releases page](https://github.com/diShine-digital-agency/ai-prompt-library/releases)
2. **Double-click** the downloaded file to extract it — you'll see `PromptWorkshop.app`
3. **Drag** `PromptWorkshop.app` into your **Applications** folder
4. **Double-click** `PromptWorkshop.app` in your Applications folder to launch

> 💡 **First launch:** macOS may show a security warning. See [Troubleshooting](#macos-troubleshooting) below.

#### Option B: Build from source

If you want to build it yourself (requires a Mac with Xcode Command Line Tools):

```bash
# 1. Install Xcode Command Line Tools (if you don't have them)
xcode-select --install

# 2. Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# 3. Build the app
./desktop/build-macos.sh

# 4. Install
mv dist/PromptWorkshop.app /Applications/

# 5. Launch
open /Applications/PromptWorkshop.app
```

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

You need Xcode Command Line Tools. Install them:

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

## macOS — Browser version (fallback)

If you build on Linux or don't have Xcode Command Line Tools, the build script creates a lighter version that opens in your default browser. It works identically but doesn't have its own window.

To use this version, simply run `./desktop/build-macos.sh` on Linux or on a Mac without `swiftc`. The resulting `.app` will open `viewer.html` in Safari/Chrome when launched.

---

## Linux

### What you get

A self-contained directory with launcher script and `.desktop` file:

```
prompt-workshop/
├── viewer.html               # The complete Prompt Workshop
├── prompt-workshop            # Launcher script (opens browser)
├── prompt-workshop.desktop    # Desktop entry file
└── install.sh                 # Installer for ~/.local integration
```

### Install

#### Option 1: Install to user directory (recommended)

```bash
# 1. Extract
tar -xzf prompt-workshop-linux.tar.gz

# 2. Run installer
cd prompt-workshop
./install.sh
```

This installs to `~/.local/share/prompt-workshop/` and creates:
- A symlink at `~/.local/bin/prompt-workshop`
- A `.desktop` entry at `~/.local/share/applications/prompt-workshop.desktop`

Launch from your application menu (search "Prompt Workshop") or terminal:

```bash
prompt-workshop
```

#### Option 2: Run directly (no install)

```bash
tar -xzf prompt-workshop-linux.tar.gz
cd prompt-workshop
./prompt-workshop
```

#### Option 3: System-wide install

```bash
sudo cp viewer.html /opt/prompt-workshop/viewer.html
sudo cp prompt-workshop /opt/prompt-workshop/prompt-workshop
sudo ln -sf /opt/prompt-workshop/prompt-workshop /usr/local/bin/prompt-workshop
sudo cp prompt-workshop.desktop /usr/share/applications/
# Edit the .desktop file to update the Exec path
```

### How it works

The launcher script detects your default browser using `xdg-open` (or falls back to `gnome-open`, `kde-open`, `firefox`, `google-chrome`, `chromium-browser`) and opens `viewer.html`. All saved data is in the browser's `localStorage`.

### Uninstall

```bash
rm -rf ~/.local/share/prompt-workshop
rm -f ~/.local/bin/prompt-workshop
rm -f ~/.local/share/applications/prompt-workshop.desktop
```

### Troubleshooting

#### "Permission denied" when running the launcher

```bash
chmod +x prompt-workshop
chmod +x install.sh
```

#### Browser doesn't open / "No browser found"

The launcher tries these in order: `xdg-open`, `gnome-open`, `kde-open`, `firefox`, `google-chrome`, `chromium-browser`. If none are found:

```bash
# Install xdg-utils (most distros)
sudo apt install xdg-utils        # Debian/Ubuntu
sudo dnf install xdg-utils        # Fedora
sudo pacman -S xdg-utils          # Arch

# Or set a default browser
xdg-settings set default-web-browser firefox.desktop

# Or open manually
firefox /path/to/prompt-workshop/viewer.html
```

#### File opens as text instead of in browser

Make sure a browser is set as the handler for HTML files:

```bash
xdg-mime default firefox.desktop text/html
# Or for Chrome:
xdg-mime default google-chrome.desktop text/html
```

#### App doesn't appear in application menu after install

```bash
# Update the desktop database
update-desktop-database ~/.local/share/applications/

# On some systems you may need to log out and back in
```

#### `~/.local/bin` not in PATH

If `prompt-workshop` command isn't found after install, add to your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"

# Then reload
source ~/.bashrc
```

#### Wayland: file:// URLs blocked

Some Wayland compositors (GNOME 44+) may restrict `file://` URLs. Workaround:

```bash
# Use a simple local server instead
cd ~/.local/share/prompt-workshop
python3 -m http.server 8080 &
xdg-open http://localhost:8080/viewer.html
```

#### Saved prompts missing after changing browsers

Saved prompts are in the specific browser's `localStorage`. If you switch from Firefox to Chrome, your saved data won't transfer. Export your library as JSON first (My Library → Export all as JSON), then import in the new browser.

---

## Windows

### What you get

A portable folder — no installation, no registry changes:

```
PromptWorkshop/
├── viewer.html               # The complete Prompt Workshop
├── PromptWorkshop.vbs        # Launcher (no console window)
├── PromptWorkshop.bat        # Alternative launcher (shows console)
└── README.txt                # Quick start guide
```

### Install

1. Extract `PromptWorkshop-win.zip` to any folder (e.g., `C:\PromptWorkshop\` or your Desktop)
2. Double-click `PromptWorkshop.vbs` to launch
3. Optional: right-click `PromptWorkshop.vbs` → "Pin to Start" or create a desktop shortcut

That's it — no installer, no admin rights needed.

### How it works

- **`PromptWorkshop.vbs`** — A tiny VBScript that opens `viewer.html` in your default browser without showing a console window. This is the recommended launcher.
- **`PromptWorkshop.bat`** — A batch file that does the same thing, but a console window briefly flashes. Use this if `.vbs` is blocked by your organization.
- **`viewer.html`** — The complete Prompt Workshop. You can also just open this file directly in any browser.

### Uninstall

Delete the `PromptWorkshop` folder. Nothing is written to the registry or system directories.

### Troubleshooting

#### Windows SmartScreen: "Windows protected your PC"

When running the `.vbs` or `.bat` for the first time:

1. Click **"More info"**
2. Click **"Run anyway"**

This only happens once. SmartScreen flags files downloaded from the internet that aren't signed.

#### Antivirus blocks `.vbs` file

Some antivirus software blocks VBScript files. Solutions:

```
Option 1: Use PromptWorkshop.bat instead
Option 2: Open viewer.html directly in your browser
Option 3: Add an exception for the PromptWorkshop folder in your antivirus
```

#### Organization policy blocks scripts

If your organization has Group Policy restricting `.vbs` and `.bat` files:

```
Just open viewer.html directly — drag it into your browser,
or right-click → Open with → Chrome/Edge/Firefox
```

#### Browser opens but shows raw HTML code

This means the file is opening in a text editor instead of a browser. Fix:

```
1. Right-click viewer.html
2. Select "Open with"
3. Choose your browser (Chrome, Edge, Firefox)
4. Check "Always use this app to open .html files"
```

#### Edge shows "This page has been blocked"

Microsoft Edge may block local `file://` pages with active content:

```
1. Click the shield icon in the address bar
2. Click "Allow blocked content"

Or use Chrome/Firefox instead — they handle local HTML files better.
```

#### Saved prompts not persisting

LocalStorage for `file://` URLs behaves differently across browsers:
- **Chrome**: localStorage works normally with `file://`
- **Firefox**: localStorage works normally with `file://`
- **Edge**: may restrict localStorage for local files. Use Chrome or Firefox instead.

If data isn't persisting, check:
1. You're not in private/incognito mode
2. You haven't blocked cookies/site data for the file
3. The file path hasn't changed (moving the folder resets localStorage for `file://`)

#### Path with special characters

Avoid putting the folder in paths with special characters (`#`, `%`, non-ASCII). These can break `file://` URLs. Use simple paths like:
- ✅ `C:\PromptWorkshop\`
- ✅ `C:\Users\YourName\Desktop\PromptWorkshop\`
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
| **This (macOS native)** | ~1MB | None (Swift built-in) | ✅ | ✅ Own window, menus, dock | ❌ (needs Mac) |
| **This (browser wrapper)** | ~224KB | None | ✅ | Opens in browser | ✅ |
| Electron / Nativefier | 200MB+ | Node.js | ✅ | Full native | ❌ |
| Tauri | 50-80MB | Rust | ✅ | Full native | ❌ (cross-compile) |
| PWA (hosted) | 0 | Web server | ✅ (after first load) | Partial | ✅ |

The macOS native build gives you a real native app experience at a fraction of the size of Electron or Tauri. On Linux and Windows, the browser wrapper approach provides the same features with zero-complexity builds and tiny package sizes.
