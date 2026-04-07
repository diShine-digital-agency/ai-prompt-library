# Desktop & Mobile Apps

The Prompt Workshop can run as a native-feeling application on **macOS**, **Linux**, and **Windows** — no Electron, no heavy frameworks, no compilation. Each platform package is ~224KB compressed and opens the full Prompt Workshop in your default browser.

All build scripts run on any system with Bash and Node.js. You can build all three platforms from a single Linux machine.

---

## Quick Start

```bash
# Build for all platforms at once
./desktop/build-all.sh

# Or build individually
./desktop/build-macos.sh      # macOS .app bundle
./desktop/build-linux.sh      # Linux with .desktop integration
# Windows: use build-all.sh or build-windows.bat on Windows
```

Output goes to `dist/`:

| Platform | Archive | Size | Install method |
|----------|---------|------|----------------|
| macOS | `PromptWorkshop.tar.gz` | ~224KB | Extract → move `.app` to `/Applications/` |
| Linux | `prompt-workshop-linux.tar.gz` | ~224KB | Extract → run `./install.sh` |
| Windows | `PromptWorkshop-win.zip` | ~224KB | Extract → double-click `PromptWorkshop.vbs` |

---

## macOS

### What you get

A standard macOS `.app` bundle:

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist              # App metadata (bundle ID, version, icon)
    ├── MacOS/
    │   └── PromptWorkshop      # Bash launcher script (opens browser)
    └── Resources/
        └── viewer.html         # The complete Prompt Workshop
```

### Install

```bash
# 1. Extract the archive
tar -xzf PromptWorkshop.tar.gz

# 2. Move to Applications
mv PromptWorkshop.app /Applications/

# 3. Launch
open /Applications/PromptWorkshop.app
```

Or simply double-click `PromptWorkshop.app` in Finder after extracting.

### How it works

The `.app` contains a small Bash script that runs `open viewer.html`, which opens the Prompt Workshop in your default browser (Safari, Chrome, Firefox, etc.). All your saved prompts are stored in the browser's `localStorage` — they persist across sessions and app restarts.

### Troubleshooting

#### "PromptWorkshop.app is damaged and can't be opened"

This is macOS Gatekeeper blocking unsigned apps. Fix:

```bash
# Option 1: Right-click the app → Open (bypasses Gatekeeper once)

# Option 2: Remove the quarantine flag
xattr -cr /Applications/PromptWorkshop.app

# Option 3: Allow in System Preferences
# Go to System Preferences → Security & Privacy → General
# Click "Open Anyway" next to the blocked app message
```

#### "PromptWorkshop.app can't be opened because Apple cannot check it for malicious software"

Same Gatekeeper issue. Use one of the three options above.

#### App opens but nothing happens

The app opens `viewer.html` in your default browser. If no browser is set:

```bash
# Check your default browser
defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers | grep -A 2 "https"

# Set Chrome as default (for example)
# Open Chrome → Settings → Default browser → Make default
```

#### Saved prompts missing after update

Your saved prompts are in the **browser's localStorage**, not inside the app. When you update the app (replace the `.app` bundle), your data is safe — it lives in the browser. However, if you switch browsers or clear browser data, saved prompts will be lost. Use the **Export JSON** button in My Library before clearing data.

#### App doesn't appear in Spotlight

macOS indexes `/Applications/` periodically. To force reindex:

```bash
mdimport /Applications/PromptWorkshop.app
```

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
| **This (shell/script wrapper)** | ~224KB | None | ✅ | Opens in browser | ✅ |
| Electron / Nativefier | 200MB+ | Node.js | ✅ | Full native | ❌ |
| Tauri | 50-80MB | Rust | ✅ | Full native | ❌ (cross-compile) |
| PWA (hosted) | 0 | Web server | ✅ (after first load) | Partial | ✅ |

The shell wrapper approach trades full native window chrome for a 1000x smaller package size and zero-complexity builds. Since the Prompt Workshop is a complete standalone web app, the browser provides a familiar, feature-rich environment (bookmarks, zoom, print, DevTools).
