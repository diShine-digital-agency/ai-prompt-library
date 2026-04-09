# Changelog

All notable changes to this project will be documented in this file.

## [2.4.0] — 2026-04-09

### Added

- **Multi-Model Testing** — New "⚖ Compare" button in the AI Playground sends the same prompt to all configured providers (OpenAI, Anthropic, Google) simultaneously and displays responses side-by-side in a grid. Shows response time, token usage, and per-response copy buttons. Includes clear inline instructions explaining the feature. Requires 2+ API keys configured.

- **Prompt-Type Aware Linter** — The linter now auto-detects prompt types (🎨 Image, 💻 Code, 🤖 System, 📝 General) and adjusts rule weights accordingly. Image prompts skip irrelevant rules like "tone" and "audience"; code prompts weight "constraints" and "output format" more heavily; system prompts prioritize "role definition" and "constraints". Detected type is displayed in lint results.

- **Optimizer Diff View** — The optimizer results now include a toggle between "Optimized" and "Diff view" modes. The diff view shows a color-coded line-by-line comparison: green for added lines, red (strikethrough) for removed lines, and unmarked for unchanged lines. Includes a legend.

- **Create Tab Starter Templates** — 6 pre-built prompt skeletons in the Create tab: Expert Assistant, Content Writer, Code Generator, Data Analyst, Marketing Strategist, and Image Prompt. One click pre-fills the title, tags, body, and dynamic fields — just customize and save.

- **My Library Search, Filter & Sort** — My Library now has a search bar, type filter dropdown (All / ⭐ Favorites / 📝 Filled / 🔗 Composed / ✨ Custom), and sort controls (Newest, Oldest, A→Z, Z→A). Shows item counts by type. Filters apply instantly.

- **Accessibility Improvements** — ARIA landmarks (`role="navigation"`, `role="main"`, `role="toolbar"`, `role="tablist"` with `aria-selected`), skip-to-content link (visible on Tab focus), improved `--text-dim` color contrast in both light and dark themes, `focus-visible` outline on all interactive elements, arrow-key navigation for tab bar.

### Changed

- Version bumped to 2.4.0
- Linter `lintPrompt()` now accepts an optional `options` parameter with `promptType` override
- `browserLintPrompt()` in viewer.html synced with source linter including type detection
- `addCreateField()` now accepts optional `prefillName` and `prefillDesc` parameters for template pre-filling
- My Library `savedSection()` no longer reverses items internally (sort order is now controlled by the filter bar)

### Fixed

- **`extractTemplate(null)` crash** — `extractTemplate()` in `src/index.js` now returns `null` safely when called with `null`, `undefined`, empty string, or non-string values instead of throwing a TypeError on `.match()`
- **Linter rule divergence** — 4 regex differences between `src/linter.js` and the viewer's inline linter have been fixed: `has-output-format` now includes "structured as", `has-examples` includes "here is an example", `has-audience` includes "client/user/reader", `has-tone` includes "detailed"
- **Recommender drops short terms** — The recommender's term filter threshold lowered from `> 2` chars to `> 1` char, so searches for "AI", "ML", "UI", "DB", "UX" now return results instead of nothing
- **GUIDE.md version mismatch** — Updated from "v2.3" to match the actual package version

### Security

- **API call timeout** — All API calls (viewer `sendToAI`, optimizer `optimizeWithAI`, optimizer `sendToAI`) now enforce a 30-second timeout via `AbortController`. Prevents hanging requests from blocking the UI indefinitely. Shows "Request timed out after 30 seconds" on timeout.
- **API key storage warning** — The API Settings modal now shows a visible security notice (🔐) explaining that keys are stored in plaintext localStorage and should not be used on shared/public computers.

## [2.3.1] — 2026-04-08

### Added

- **Trilingual Wiki Documentation** — Comprehensive wiki with 33 pages across 3 languages (English, Italian, French), covering every aspect of the tool:
  - **11 English pages** — Home, Getting Started, CLI Reference, Prompt Workshop, Prompting Techniques, AI Models Guide, Tools (Linter/Optimizer/Recommender), API & Playground, Architecture, Desktop Apps, Contributing
  - **11 Italian pages** — Full Italian translation of all wiki pages
  - **11 French pages** — Full French translation of all wiki pages
  - **Wiki** — Available at [GitHub Wiki](https://github.com/diShine-digital-agency/ai-prompt-library/wiki) with trilingual navigation sidebar and footer
  - Pages include: installation guides, complete CLI command reference, Prompt Workshop tab-by-tab documentation, 12 prompting frameworks with examples, AI model comparison with pricing and benchmarks, tool internals (linter rules, optimizer pipeline, recommender scoring), API integration, module architecture, desktop app build guides, and contributing guidelines
  - Code blocks and commands kept in English across all translations; standard technical terms preserved where conventional in IT/FR tech writing

### Changed

- Version bumped to 2.3.1

## [2.3.0] — 2026-04-07

### Added

- **Dynamic Prompt Optimizer** — Completely rewritten optimizer that actually analyzes your prompt's content and applies intelligent, targeted improvements:
  - **Domain detection** — Automatically detects 7 domains (coding, writing, marketing, data, business, education, image generation) and applies domain-specific optimizations
  - **Smart role generation** — Instead of a generic "expert assistant", generates a relevant role like "senior software engineer" or "marketing strategist" based on what the prompt is about
  - **Vague language replacement** — Detects words like "good", "nice", "stuff", "things" and replaces them with specific, actionable terms
  - **Weak verb strengthening** — Removes hedging language ("can you", "I want you to", "try to", "maybe") and turns requests into direct instructions
  - **Filler removal** — Strips redundant phrases ("basically", "honestly", "in my opinion") that waste tokens
  - **Compound task decomposition** — Detects prompts with multiple tasks and breaks them into numbered steps
  - **Audience detection** — Identifies target audiences (beginners, experts, executives, students) and adds appropriate tone guidance
  - **Domain-specific constraints** — Adds quality rules relevant to the domain (e.g., "handle edge cases" for code, "cite data points" for analysis)
  - **Domain-specific output format** — Suggests output formats matching the task (e.g., code blocks for coding, tables for data analysis)
  - **Domain-specific example placeholders** — Adds relevant example templates the user can fill in
  - **Domain-specific quality checks** — Adds verification steps tailored to the domain

- **macOS Native App** — Native macOS application built with Swift and WebKit:
  - Runs in its own window — no browser needed
  - Full macOS menu bar with Edit (⌘C/V/Z), View (zoom, full screen), Window menus
  - Dock icon — pin to Dock, find in Spotlight
  - Custom app icon (`.icns`)
  - Standard keyboard shortcuts (⌘Q quit, ⌘W close, ⌘+/- zoom, ⌃⌘F full screen)
  - Persistent data storage independent of browser
  - One-click install: double-click `.zip` → drag `.app` to Applications
  - Requires macOS 11+ and Xcode Command Line Tools to build
  - Falls back to Chrome/Edge/Chromium/Brave app mode when built without `swiftc`

- **Linux Native App** — Native Linux application built with Python3 + GTK + WebKitGTK:
  - Runs in its own window — no browser needed (on most desktop Linux distros)
  - Custom app icon in application menu
  - GUI installer: double-click `install.sh` → shows progress dialog (zenity/kdialog)
  - Falls back to Chrome/Edge app mode, then regular browser if GTK/WebKit unavailable
  - Keyboard shortcuts (Ctrl+C/V, Ctrl+±, F11 full screen)
  - Pre-installed dependencies on Ubuntu, Fedora, Linux Mint, Pop!_OS

- **Windows Native-Style App** — Opens in Microsoft Edge app mode (own window, no browser chrome):
  - Runs in its own window using Edge (pre-installed on Windows 10/11)
  - Falls back to Chrome app mode, then default browser
  - One-click installer: double-click `Install.bat` → creates Desktop + Start Menu shortcuts
  - One-click uninstaller: `Uninstall.bat`
  - Custom `.ico` app icon on shortcuts
  - No admin rights needed, no registry changes

- **App Icon** — Custom Prompt Workshop icon (prompt cursor + AI sparkle) in all platform formats:
  - macOS: `.icns` bundle icon
  - Linux: `.png` icon in application menu
  - Windows: `.ico` for shortcuts and taskbar
  - HTML: embedded favicon in `viewer.html`

### Changed

- **Optimizer output is now content-aware** — A coding prompt and a marketing prompt will receive completely different roles, constraints, output formats, and quality checks. The optimizer analyzes what your prompt is actually about instead of applying the same template every time.
- Browser version of the optimizer in `viewer.html` updated to match the new dynamic engine
- Desktop documentation (`desktop/README.md`) completely rewritten with step-by-step install instructions for non-technical users
- All three platform installers work without terminal — just double-click
- macOS `LSMinimumSystemVersion` updated from 10.13 to 11.0 for native WebKit support
- macOS build now also produces `.zip` for easier Finder extraction (in addition to `.tar.gz`)
- Windows launcher now uses Edge app mode instead of opening in default browser
- Linux launcher tries native GTK → browser app mode → regular browser (in that order)
- Version bumped to 2.3.0

### Fixed

- **macOS app icon not showing in Dock** — The native macOS app now explicitly loads and sets the Dock icon from the bundle's `.icns` file using `NSApp.applicationIconImage`, fixing blank/generic icons on systems where the automatic `CFBundleIconFile` lookup doesn't work for `swiftc`-compiled apps
- **macOS fallback app opening in default browser** — The non-native macOS build now tries Chrome, Chromium, Edge, and Brave in app mode (own window, no address bar) before falling back to the default browser. Previously it always opened `viewer.html` in the default browser with full browser chrome
- **Build script messaging** — The macOS build script now shows clear warnings when building the fallback version instead of the native app, and tells you exactly how to get the native version (`xcode-select --install`)
- **Desktop documentation** — Added troubleshooting entries for "app opens in browser" and "app icon missing", clarified the distinction between native and app-mode fallback builds, updated comparison table

## [2.2.1] — 2026-04-07

### Added

- **Resizable sidebar** — Drag the right edge of the sidebar to adjust its width (260px–600px). Your preferred width is remembered across sessions via localStorage.

- **Floating Library button** — A floating action button (📚) in the bottom-right corner provides one-click access to My Library from any tab. Shows a badge with the number of saved items.

- **Edit saved prompts** — Every saved prompt (favorites, filled, composed, custom) now has an Edit button. Opens an inline editor with title and content fields. Changes are saved instantly to localStorage.

- **Database prompt protection** — When you save/favorite a built-in prompt, it is stored as an editable copy. Your edits only affect the saved copy — the original prompt in the library remains unchanged. A notice is displayed in the editor for database-sourced prompts.

- **macOS app** — Build a lightweight macOS application (724KB) with `./desktop/build-macos.sh`. Creates a `.app` bundle that opens the Prompt Workshop in your browser. No Electron, no compilation needed — builds on Linux or macOS.

- **Linux app** — Build a Linux package with `.desktop` integration via `./desktop/build-linux.sh`. Includes installer script, application menu entry, and terminal launcher.

- **Windows app** — Build a portable Windows package with `./desktop/build-all.sh`. Includes `.vbs` launcher (no console window), `.bat` fallback, and `viewer.html`. No installer or admin rights needed.

- **Cross-platform build** — `./desktop/build-all.sh` builds all three platforms from any system with Bash and Node.js (~224KB per platform).

### Changed

- **Nav tabs wrap** — The navigation tabs now wrap to two rows when the sidebar is narrow, ensuring all 7 tabs (including My Library) are always visible regardless of sidebar width.

- **Favorites show full actions** — Favorited prompts now show View, Copy, Edit, and Delete buttons (previously only Open and Delete). The "Open original" button is still available to jump to the source prompt.

- CLI version bumped to 2.2.1

### Fixed

- **My Library visibility** — Fixed issue where My Library tab was not visible when sidebar was too narrow for all 7 tabs in a single row.

## [2.2.0] — 2026-04-06

### Added

- **AI Playground** — New "Playground" tab in the Prompt Workshop lets you send prompts directly to AI models (OpenAI GPT, Anthropic Claude, Google Gemini) and see responses in real time. Supports system prompts, token usage tracking, and one-click response copying. Configure API keys via the ⚙ settings button.

- **API Settings panel** — Securely store API keys for OpenAI, Anthropic, and Google in your browser's localStorage. Choose your preferred provider and model. Keys are never sent anywhere except the API provider.

- **Prompt Linter** — Analyze any prompt against 14 quality rules covering role definition, task clarity, output format, constraints, structure, examples, audience, tone, and more. Get a 0–100 score, letter grade (A–F), and prioritized improvement suggestions. Available in both CLI (`prompt-lib lint`) and the Prompt Workshop Tools tab.

- **Prompt Optimizer** — Automatically restructure prompts with best practices: adds role definition, labeled sections, output format, constraints, and quality verification steps. Two modes:
  - **Instant** (rule-based, no API needed) — works offline with zero cost
  - **AI-Powered** — uses your configured API key for LLM-based rewriting

- **Smart Recommender** — Describe what you need in plain English and get personalized prompt suggestions from the library. Analyzes your description against all prompts using intent detection and multi-signal scoring. Suggests the optimal system prompt + framework + template combination. Available via `prompt-lib recommend <query>` and the Tools tab.

- **New CLI commands**:
  - `prompt-lib lint` — interactive prompt quality analysis
  - `prompt-lib optimize` — automatic prompt rewriting
  - `prompt-lib recommend <query>` — smart prompt suggestions

- **Tools tab** — New tab in the Prompt Workshop with three sub-tools: Linter, Optimizer, and Recommender. Each has beginner-friendly help banners.

- **12 new tests** (37 total) covering the linter, optimizer, and recommender modules.

### Changed

- Keyboard shortcuts updated: `1`–`7` for all tabs (added `5` Tools, `6` Playground, `7` My Library)
- Toolbar now includes ⚙ settings button alongside ? help and 🌙 dark mode
- CLI version bumped to 2.2.0

## [2.1.0] — 2026-04-06

### Added

- **Quick Fill & Compose** — Prompts with `{{field_name}}` placeholders now show a ⚡ Quick Fill button in the Prompt Workshop. Provides a simplified, distraction-free flow with only field inputs, descriptions, progress bar, and live preview. No prompt engineering experience needed.

- **Beginner mode** — Toggle the ? button (top-right or press H) to enable contextual help banners across all tabs (Compose, Create, Generate, Quick Fill). Each banner explains the feature, how to use it, and includes pro tips for better results.

- **Keyboard shortcuts** — Navigate the Workshop efficiently:
  - `1`–`5` to switch tabs
  - `Ctrl+K` / `Cmd+K` to focus search
  - `H` to toggle beginner help
  - `D` to toggle dark mode
  - `Esc` to clear search

- **Image generation category** — New `prompts/image-generation/` category with 8 templates for AI image creation:
  - Product photography, portraits & headshots, social media visuals
  - Infographic layouts, character design, logo & branding
  - Cinematic scene composition, art style transfer
  - All with `{{fieldname}}` placeholders for easy customization

- **22 new curated prompt templates** (82 total), inspired by proven community prompts:
  - `frameworks/mega-prompt` — Multi-section system prompt framework
  - `frameworks/prompt-evaluation` — Prompt quality evaluation and improvement
  - `frameworks/self-consistency` — Multi-path reasoning with voting
  - `system-prompts/agentic-coder` — AI coding agent with planning and security
  - `system-prompts/deep-researcher` — Multi-step research with citations
  - `system-prompts/socratic-tutor` — Socratic method teaching assistant
  - `system-prompts/technical-writer` — Technical writing assistant
  - `development/code-documentation` — Auto-generating code docs
  - `development/git-commit-messages` — Conventional commit messages from diffs
  - `development/code-refactoring-review` — Deep code refactoring analysis
  - `development/incident-response` — Incident response and post-mortems
  - `development/system-design` — System design and architecture
  - `marketing/landing-page-copy` — Landing page copywriting
  - `marketing/product-description` — E-commerce product descriptions
  - `marketing/growth-experiment` — Growth experiment design
  - `business/executive-summary` — Executive summaries from documents
  - `business/job-description` — Job listing creation
  - `business/sales-battlecard` — Competitive sales battlecards
  - `business/investor-pitch` — Investor pitch deck outlines
  - `data/data-cleaning` — Data cleaning instructions
  - `data/report-generator` — Structured reports from data
  - `data/ml-model-evaluation` — ML model evaluation and improvement

- **UI animations** — Smooth fade-in, slide-in, and hover transitions

- **Fieldname badges** — Prompts with fillable fields show a ✎ badge with the field count

- **Progress bar** — Quick Fill shows a visual progress bar tracking completion

- **Button feedback** — Copy and Save buttons show ✅ confirmation state

### Changed

- README expanded with detailed Prompt Workshop documentation, keyboard shortcut reference, beginner mode description, and image generation category
- Tag display in HTML viewer now deduplicates — category no longer appears twice
- Compose sidebar includes expanded guidance for beginners
- Prompt count increased from 52 to 82 (30 new templates)
- Categories increased from 7 to 8 (added image-generation)
- Version bumped to 2.1.0

### Fixed

- Duplicate tags: when a prompt's tags array included the same value as its category, the tag appeared twice in the detail view. Now deduplicated.

## [2.0.0] — 2026-04-06

### Added

- **System Prompt Creator** (`prompt-lib create`) — Build custom system prompts with dynamic `{{field_name}}` placeholders. Define fields with descriptions, write the prompt body, and save it to your personal library. Custom prompts are stored in `~/.prompt-library/custom-prompts.json` and automatically appear alongside built-in prompts.

- **Dynamic Prompt Generator** (`prompt-lib generate`) — Choose from 5 prompt engineering frameworks (Expert Role-Based, Chain-of-Thought, Structured Output, Task Decomposition, Guardrails & Safety), answer guided questions, and get a production-ready system prompt generated automatically. Optionally save the result as a reusable custom prompt.

- **Persistence** — All custom prompts and saved compositions are stored locally:
  - CLI: `~/.prompt-library/` directory with JSON files
  - HTML: browser localStorage (unchanged from v1, but now also supports custom prompt creation)

- **`prompt-lib saved`** command — View all your saved compositions and custom prompts from the terminal.

- **HTML Prompt Workshop improvements:**
  - **Create tab** — Full system prompt creation UI with field builder, live preview, and save to library
  - **Generate tab** — Interactive prompt generator with framework selection, guided questions, and one-click save
  - **Enhanced Compose** — Improved compose workflow with save-to-library support
  - Custom prompts created in the browser are visible alongside built-in prompts in the Browse tab

- **Technical documentation** (`TECHNICAL.md`) — Architecture overview, module descriptions, data flow, file formats, and extension guide

- **Changelog** (`CHANGELOG.md`)

### Changed

- **Compose command** now offers to save the composed prompt after building it
- `findPlaceholders` and `extractTemplate` moved to `src/index.js` as shared utilities (used by both CLI and viewer)
- Version bumped to 2.0.0

### Fixed

- Placeholder regex now supports spaces and slashes inside `{{field names}}`, matching the HTML viewer behavior

## [1.0.0] — 2026-04-01

### Added

- Initial release with 52 expert-level prompt templates across 7 categories
- CLI with `list`, `search`, `show`, `use`, `copy`, `compose`, `viewer`, `categories`, `random`, `stats` commands
- Interactive Prompt Workshop (`viewer.html`) with Browse, Compose, and My Library tabs
- YAML frontmatter parser for prompt metadata
- Scored search algorithm (title, tags, category, content matching)
- ANSI terminal formatting
- Zero npm dependencies
