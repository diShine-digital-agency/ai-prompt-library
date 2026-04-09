# Prompt Workshop — Modern Design Preview

> ⚠️ **This is an experimental redesign preview.** It lives in its own directory
> so you can test it side-by-side with the original `viewer.html` before
> releasing. No original files were modified.

## What Changed (Design Only)

| Area | Before | After |
|------|--------|-------|
| **Typography** | System fonts only | Inter + JetBrains Mono (Google Fonts) |
| **Color palette** | Blue (#2563eb) | Indigo (#6366f1) with gradient accents |
| **Dark mode** | Slate tones | Deep navy (#0c0f1a) with subtle contrast |
| **Buttons** | Flat colors | Gradient fills + subtle lift on hover |
| **Cards** | Basic borders | Elevated shadows + hover lift effect |
| **Sidebar title** | Plain text | Gradient text effect |
| **Search box** | Plain input | Search icon + focus glow |
| **Modals** | Basic overlay | Backdrop blur (glassmorphism) + spring animation |
| **Scrollbars** | Browser default | Slim custom scrollbars |
| **Toasts** | Instant show | Slide-up animation with glow |
| **Font rendering** | Default | Anti-aliased (-webkit-font-smoothing) |
| **Toolbar buttons** | Circular | Rounded square with hover lift |
| **Progress bars** | Solid color | Gradient fill |
| **Step indicators** | Flat dots | Glow effect on active/done states |
| **Borders** | Single tone | Light + normal border layers |
| **Tags** | Square corners | Pill-shaped (border-radius: 20px) |

## What Did NOT Change

- ✅ All 7 tabs (Browse, Compose, Create, Generate, Tools, Playground, My Library)
- ✅ All JavaScript logic — zero modifications
- ✅ API settings & key storage (localStorage)
- ✅ Keyboard shortcuts (1-7, Ctrl+K, H, D, Escape)
- ✅ Sidebar resize handle
- ✅ Mobile responsive layout
- ✅ ARIA accessibility attributes
- ✅ All prompt data (82 prompts embedded)
- ✅ Linter, Optimizer, Recommender tools
- ✅ Multi-model compare (Playground)
- ✅ Quick Fill, Compose, Create, Generate workflows
- ✅ Dark mode toggle
- ✅ Import/Export functionality
- ✅ Favorites system
- ✅ All security measures (API key handling)

## How to Test

### Option 1: Open Directly in Browser

```bash
# From the project root
open prompt-workshop/index.html        # macOS
xdg-open prompt-workshop/index.html    # Linux
start prompt-workshop/index.html       # Windows
```

### Option 2: Use the CLI

```bash
node bin/prompt-lib.js viewer
# Then also open prompt-workshop/index.html in another tab to compare
```

### Option 3: Local Server (recommended for full testing)

```bash
# Python
python3 -m http.server 8080
# Then visit http://localhost:8080/prompt-workshop/

# Node
npx serve .
# Then visit http://localhost:3000/prompt-workshop/
```

## Testing Checklist

Before merging the redesign into the main `viewer.html`:

- [ ] Browse tab: browse & search prompts, filter by category/difficulty/model
- [ ] Click a prompt: view content, copy template, copy full, export
- [ ] Quick Fill: open workshop, fill placeholders, preview, copy
- [ ] Compose tab: build multi-layer prompt through all steps
- [ ] Create tab: use starter template or build from scratch, add fields
- [ ] Generate tab: select framework, answer questions, generate prompt
- [ ] Tools tab: test Linter, Optimizer, Recommender
- [ ] Playground tab: send prompt to API (requires API key in settings)
- [ ] My Library: save, edit, delete, search, import/export
- [ ] Settings (⚙️): add/remove API keys, test connectivity
- [ ] Dark mode (🌙): toggle and verify all elements
- [ ] Keyboard shortcuts: press 1-7, Ctrl+K, H, D
- [ ] Mobile view: resize browser < 768px, test hamburger menu
- [ ] Sidebar resize: drag the right edge of the sidebar

## How to Release

When you're satisfied with the new design:

1. Copy the CSS from `prompt-workshop/index.html` (the `<style>` block)
2. Replace the CSS in the main `viewer.html`
3. Add the Google Fonts `<link>` tags to the main `viewer.html` `<head>`
4. Run `node test/run.js` to confirm all tests still pass
5. Remove the `prompt-workshop/` directory (optional, can keep for reference)

---

Built by [diShine Digital Agency](https://dishine.it)
