# Changelog

All notable changes to this project will be documented in this file.

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

- **12 new expert prompt templates** (64 total):
  - `frameworks/mega-prompt` — Multi-section system prompt framework
  - `frameworks/prompt-evaluation` — Prompt quality evaluation and improvement
  - `development/code-documentation` — Auto-generating code docs from source
  - `development/git-commit-messages` — Writing conventional commit messages from diffs
  - `development/code-refactoring-review` — Deep code refactoring analysis
  - `marketing/landing-page-copy` — High-converting landing page copywriting
  - `marketing/product-description` — E-commerce product descriptions
  - `business/executive-summary` — Distilling documents for stakeholders
  - `business/job-description` — Creating effective job listings
  - `data/data-cleaning` — Data cleaning and transformation instructions
  - `data/report-generator` — Structured reports from raw data
  - `system-prompts/technical-writer` — Technical writing assistant system prompt

- **UI animations** — Smooth fade-in, slide-in, and hover transitions for prompts, steps, and panels

- **Fieldname badges** — Prompts with fillable fields show a ✎ badge with the field count. Clicking it opens Quick Fill.

- **Progress bar** — Quick Fill shows a visual progress bar tracking how many fields have been completed

- **Button feedback** — Copy and Save buttons show ✅ confirmation state after clicking

### Changed

- README expanded with detailed Prompt Workshop documentation, keyboard shortcut reference, and beginner mode description
- Tag display in HTML viewer now deduplicates — category no longer appears twice as both category label and tag
- Compose sidebar includes expanded guidance for beginners
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
