# Desktop & Mobile Distribution

## macOS App

The Prompt Workshop can be packaged as a lightweight macOS application (724KB) that opens in your default browser.

### Build

```bash
./desktop/build-macos.sh
```

Output:
- `dist/PromptWorkshop.app` — macOS application bundle
- `dist/PromptWorkshop.tar.gz` — compressed archive for distribution

### Install

1. Download `PromptWorkshop.tar.gz`
2. Extract: `tar -xzf PromptWorkshop.tar.gz`
3. Move to Applications: `mv PromptWorkshop.app /Applications/`
4. Launch from Applications or Spotlight

On first launch, macOS may show a Gatekeeper warning. Right-click → Open to bypass.

### How it works

The `.app` bundle is a standard macOS application directory:

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist          # App metadata (bundle ID, version, etc.)
    ├── MacOS/
    │   └── PromptWorkshop  # Bash launcher script
    └── Resources/
        └── viewer.html     # The complete Prompt Workshop
```

The launcher script opens the embedded `viewer.html` in your default browser. All data is stored in the browser's localStorage — it persists across sessions.

### Comparison with alternatives

| Approach | Size | Needs compilation? | Notes |
|----------|------|--------------------|-------|
| **Shell script .app** (this) | 724KB | No | Lightweight, builds on Linux |
| Electron / Nativefier | 200MB+ | Yes | 278x larger, overkill |
| Tauri | 50-80MB | Yes (Rust) | Needs macOS for compilation |

### Code signing (optional)

To distribute via macOS Gatekeeper without warnings:

```bash
# On a Mac with Xcode:
codesign --sign "Developer ID Application: Your Name" PromptWorkshop.app
```

## Android

The Prompt Workshop is a standalone HTML file that works in any modern mobile browser.

### Option 1: Direct browser use (recommended)

1. Transfer `viewer.html` to your Android device
2. Open it in Chrome, Firefox, or any modern browser
3. Bookmark it for quick access
4. Optional: "Add to Home Screen" from Chrome menu for an app-like experience

### Option 2: PWA (Progressive Web App)

Host `viewer.html` on any web server (GitHub Pages, Netlify, etc.) and add it to your home screen. It works fully offline after the first load since all content is embedded.

### Option 3: Android wrapper app

For a native `.apk`, you would need to use a WebView wrapper (e.g., Apache Cordova, Capacitor, or a custom Android Studio project). This requires:
- Android SDK / Android Studio
- Java or Kotlin toolchain

This is not included in the current build scripts but is straightforward to implement.

## Updating

To update the app after changes to `viewer.html`:
1. Run `./desktop/build-macos.sh` to rebuild
2. Replace the old `.app` in `/Applications/` with the new one
3. Your saved data in localStorage is preserved (it's in the browser, not the app)
