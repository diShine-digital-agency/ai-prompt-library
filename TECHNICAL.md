# Technical Documentation

Architecture, data flow, and extension guide for the diShine Prompt Library v2.3.

> **Looking for how to use the tools?** See [FUNCTIONS.md](FUNCTIONS.md) for detailed usage docs on each function.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                                                         │
│   CLI (bin/prompt-lib.js)    HTML (viewer.html)          │
│   ├── list, search, show     ├── Browse tab              │
│   ├── use, copy              ├── Compose tab             │
│   ├── compose                ├── Create tab              │
│   ├── create                 ├── Generate tab            │
│   ├── generate               ├── Tools tab               │
│   ├── lint                   │   ├── Linter              │
│   ├── optimize               │   ├── Optimizer           │
│   ├── recommend              │   └── Recommender         │
│   ├── saved                  ├── Playground tab          │
│   └── viewer                 └── My Library tab          │
│                                                         │
│   Desktop apps (desktop/)                               │
│   ├── macOS native (Swift + WebKit)                     │
│   ├── Linux native (Python + GTK + WebKitGTK)           │
│   └── Windows (Edge/Chrome app mode)                    │
├─────────────────────────────────────────────────────────┤
│                    Core Modules                          │
│                                                         │
│   src/index.js     — Prompt loader, persistence          │
│   src/search.js    — Scored search algorithm             │
│   src/formatter.js — ANSI terminal formatting            │
│   src/generator.js — Dynamic prompt generation           │
│   src/linter.js    — 14-rule prompt quality scorer       │
│   src/optimizer.js — Content-aware prompt optimizer      │
│   src/recommender.js — Intent-based prompt matcher       │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│                                                         │
│   prompts/**/*.md           — Built-in prompt files      │
│   ~/.prompt-library/        — User data directory        │
│     custom-prompts.json     — User-created prompts       │
│     saved-prompts.json      — Saved compositions         │
│   localStorage (browser)    — HTML app persistence       │
└─────────────────────────────────────────────────────────┘
```

---

## Module Reference

### `src/index.js` — Prompt Loader & Persistence

**Exports:**

| Function | Description |
|----------|-------------|
| `loadPrompts()` | Loads all prompts from `prompts/` directory + custom prompts from `~/.prompt-library/custom-prompts.json`. Returns array of prompt objects. |
| `loadCustomPrompts()` | Loads only user-created custom prompts. |
| `saveCustomPrompt(prompt)` | Saves a custom prompt. Overwrites if slug exists. |
| `loadSavedCompositions()` | Loads saved compositions from `~/.prompt-library/saved-prompts.json`. |
| `saveComposition(composition)` | Appends a composition to saved file with auto-generated `id` and `date`. |
| `findPlaceholders(text)` | Extracts unique `{{placeholder}}` tokens from text. |
| `extractTemplate(content)` | Extracts the content between ` ```...``` ` in the `## Template` section. |

**Constants:**

| Name | Description |
|------|-------------|
| `PROMPTS_DIR` | Absolute path to `prompts/` directory |
| `USER_DATA_DIR` | `~/.prompt-library/` |
| `USER_PROMPTS_FILE` | `~/.prompt-library/custom-prompts.json` |
| `USER_SAVED_FILE` | `~/.prompt-library/saved-prompts.json` |

### `src/search.js` — Search Algorithm

**Exports:**

| Function | Description |
|----------|-------------|
| `searchPrompts(prompts, query)` | Scores and ranks prompts by relevance to query. |

**Scoring:**

| Match Type | Points |
|-----------|--------|
| Title | 100 |
| Tag | 50 |
| Category | 30 |
| Content | 10 |

### `src/formatter.js` — Terminal Formatting

Provides ANSI color formatting for CLI output. Respects `NO_COLOR` environment variable.

**Exports:** `formatPromptList`, `formatPromptDetail`, `formatCategories`, `formatStats`, `formatSearchResults`

### `src/generator.js` — Dynamic Prompt Generation

**Exports:**

| Function | Description |
|----------|-------------|
| `getFrameworks()` | Returns list of available frameworks with metadata and questions. |
| `getFramework(key)` | Returns a single framework by key. |
| `generatePrompt(key, answers)` | Generates a complete prompt from framework key and answer map. |

**Available Frameworks:**

| Key | Name | Description |
|-----|------|-------------|
| `expert-role` | Expert Role-Based | Creates prompts with expert persona, rules, constraints |
| `chain-of-thought` | Chain-of-Thought | Enforces step-by-step reasoning |
| `structured-output` | Structured Output | Produces consistent, formatted output |
| `task-decomposition` | Task Decomposition | Breaks complex tasks into sub-tasks |
| `guardrails` | Guardrails & Safety | Built-in safety rules and output constraints |

### `src/linter.js` — Prompt Quality Scorer

**Exports:**

| Function | Description |
|----------|-------------|
| `lintPrompt(text)` | Analyzes a prompt against 14 rules. Returns score (0–100), grade (A–F), passed/failed rules, and prioritized suggestions. |
| `formatLintResult(result)` | Formats a lint result as a human-readable string for CLI/display. |
| `LINT_RULES` | Array of all 14 rule objects with id, name, weight, test function, and suggestion. |

**Scoring:** `score = (sum of passed rule weights / total weight) × 100`. Total weight: 100.

See [FUNCTIONS.md](FUNCTIONS.md#prompt-linter) for the full rule list and scoring details.

### `src/optimizer.js` — Content-Aware Prompt Optimizer

**Exports:**

| Function | Description |
|----------|-------------|
| `optimizePrompt(text)` | Offline, rule-based optimization. Detects domain, replaces vague language, strengthens verbs, removes filler, adds structured sections. Returns original, optimized, changes, before/after scores, detected domain. |
| `optimizeWithAI(text, provider, apiKey, model)` | Sends prompt to an LLM for AI-powered rewriting. Supports `openai`, `anthropic`, `google` providers. |
| `sendToAI(prompt, systemPrompt, provider, apiKey, model)` | Sends a prompt to an AI model (used by the Playground). Returns response text, model, and token usage. |

**Domain detection:** Scans for keywords matching 7 domains (coding, writing, marketing, data, business, education, image). Each domain has its own role, constraints, output format, and quality check.

**Optimization pipeline:** filler removal → politeness reduction → weak verb strengthening → vague language replacement → domain-specific role → task decomposition → audience/tone detection → output format → constraints → examples → quality check.

See [FUNCTIONS.md](FUNCTIONS.md#prompt-optimizer) for the full pipeline breakdown.

### `src/recommender.js` — Intent-Based Prompt Matcher

**Exports:**

| Function | Description |
|----------|-------------|
| `recommendPrompts(prompts, description)` | Scores all prompts by relevance to a natural-language description. Returns scored array sorted by relevance. |
| `buildRecommendation(prompts, description)` | Builds a full recommendation with top prompts, suggested combo (system prompt + framework + template), and categorized results. |

**Intent detection:** Maps description keywords to 8 intents (coding, writing, marketing, data, business, image, research, teaching). Prompts in matching categories get a bonus.

See [FUNCTIONS.md](FUNCTIONS.md#smart-recommender) for scoring details.

---

## Data Formats

### Prompt Object

```json
{
  "slug": "my-prompt",
  "title": "My Custom Prompt",
  "category": "custom",
  "tags": ["tag1", "tag2"],
  "difficulty": "intermediate",
  "models": ["claude", "gpt-4"],
  "content": "# My Prompt\n\n## Template\n\n```\nHello {{name}}\n```",
  "path": "custom/my-prompt.md",
  "fields": [
    { "name": "name", "description": "User's name" }
  ],
  "custom": true
}
```

### Saved Composition

```json
{
  "id": 1712430000000,
  "title": "Composed: Coding Assistant + Chain-of-Thought + Code Review",
  "result": "# SYSTEM PROMPT\n\n...",
  "layers": ["Coding Assistant", "Chain-of-Thought", "Code Review"],
  "type": "composed",
  "date": "2026-04-06T12:00:00.000Z"
}
```

### Prompt File Format (Markdown with YAML Frontmatter)

```markdown
---
title: My Prompt Title
category: frameworks
tags: [tag1, tag2, tag3]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# My Prompt Title

## When to Use
[description]

## Template

\```
Your prompt template with {{placeholders}} here
\```

## Tips
[expert tips]

## Common Mistakes
[pitfalls to avoid]
```

---

## HTML Viewer Architecture

The `viewer.html` file is a self-contained single-page application:

- **No external dependencies** — pure HTML, CSS, and vanilla JavaScript
- **Prompt data embedded** — all 82+ prompts are serialized as JSON in a `<script>` tag
- **localStorage for persistence** — custom prompts, saved compositions, favorites, and preferences
- **Responsive design** — works on desktop, tablet, and mobile
- **Dark/light mode** — togglable with preference saved in localStorage

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `pl_dark` | boolean | Dark mode preference |
| `pl_saved` | array | Saved prompts, filled templates, composed prompts, custom prompts. Each saved item includes full content as an editable copy. Database-sourced items are marked with `source: 'database'` and can be edited without affecting the original prompt. |
| `pl_sidebar_width` | number | User's preferred sidebar width in pixels (260–600). Persists across sessions. |
| `api_settings` | object | API keys and model preferences for Playground and AI optimizer. Contains provider, keys for OpenAI/Anthropic/Google, and selected models. |

### Tab Structure

| Tab | Description |
|-----|-------------|
| **Browse** | Search, filter, and read prompts. Build prompts interactively. |
| **Compose** | Combine system prompt + framework + task template. |
| **Create** | Build custom system prompts with field definitions. |
| **Generate** | Choose a framework, answer questions, get a generated prompt. |
| **Tools** | Prompt Linter (quality scoring), Prompt Optimizer (content-aware rewriting), Smart Recommender (personalized suggestions). |
| **Playground** | Send prompts to AI models (OpenAI, Anthropic, Google). System prompts, token tracking, one-click copy. |
| **My Library** | View saved prompts, compositions, and custom prompts. Edit, copy, delete, export/import. |

---

## Extending the Library

### Adding Built-in Prompts

1. Create a `.md` file in the appropriate `prompts/` subdirectory
2. Add YAML frontmatter: `title`, `category`, `tags`, `difficulty`, `models`
3. Include a `## Template` section with a code block containing `{{placeholders}}`
4. Run `node test/run.js` to verify

### Adding Generator Frameworks

Edit `src/generator.js` and add a new entry to the `FRAMEWORKS` object:

```javascript
'my-framework': {
  name: 'My Framework',
  description: 'What it does',
  questions: [
    { key: 'field1', label: 'Question for the user', required: true },
    { key: 'field2', label: 'Optional question', required: false, default: 'default value' },
  ],
  generate: (answers) => {
    return `Generated prompt using ${answers.field1}...`;
  }
}
```

The framework will automatically appear in both the CLI (`prompt-lib generate`) and the HTML Generate tab.

### Adding CLI Commands

Add a new `case` in the `switch` statement in `bin/prompt-lib.js`, and add the command to the `HELP` string.

### Desktop Distribution

The `desktop/` directory contains build scripts for all platforms:

| Script | Platform | Output |
|--------|----------|--------|
| `build-all.sh` | All | Builds macOS + Linux + Windows |
| `build-macos.sh` | macOS | Native `.app` with Swift + WebKit (on Mac) or browser-wrapper `.app` (on Linux) |
| `build-linux.sh` | Linux | Directory with `.desktop` file + GTK native app + GUI installer |
| `build-windows.bat` | Windows | Portable folder with `.vbs` (Edge app mode) / `.bat` launchers + install/uninstall scripts |

**macOS native build:** On macOS with Xcode Command Line Tools, `build-macos.sh` compiles a native Swift app (`desktop/macos-native/PromptWorkshop.swift`) that runs in its own window using WebKit — no browser needed. Requires macOS 11+. Produces both `.zip` and `.tar.gz`. On Linux, it falls back to a browser-wrapper launcher.

**Linux native build:** `build-linux.sh` creates a package with a Python + GTK + WebKitGTK app (`desktop/linux-native/`) that runs in its own window. Falls back to Chrome/Edge app mode, then regular browser. Includes a GUI installer (`install.sh`) that works with zenity/kdialog.

**Windows build:** Creates a portable package with a VBScript launcher that opens in Microsoft Edge app mode (own window, no browser chrome). Falls back to Chrome app mode, then default browser. Includes `Install.bat` (creates Desktop + Start Menu shortcuts) and `Uninstall.bat`.

All desktop apps are built from source — there are no pre-built downloads. See [`desktop/README.md`](desktop/README.md) for detailed install guides.

---

## Testing

```bash
node test/run.js
```

Tests verify:
- Prompt loading (82+ prompts from files + custom prompts)
- Required fields on each prompt (slug, title, category, tags, content)
- Search scoring and ranking
- Category count validation
- Custom prompt creation and persistence
- Generator framework validation
- Linter scoring and rule evaluation
- Optimizer transformations
- Recommender scoring

---

## Dependencies

**None.** The entire project uses only Node.js built-in modules:

| Module | Usage |
|--------|-------|
| `fs` | File reading, writing, directory traversal |
| `path` | Path manipulation |
| `url` | `fileURLToPath` for ESM `__dirname` |
| `readline` | Interactive CLI input |
| `child_process` | Clipboard copy (`pbcopy`) |
| `os` | Home directory, temp directory |

---

## Requirements

- Node.js 18 or later
- No npm install needed

---

## See also

- **[README.md](README.md)** — overview, quick start, and CLI usage
- **[GUIDE.md](GUIDE.md)** — step-by-step user guide
- **[FUNCTIONS.md](FUNCTIONS.md)** — detailed reference for every tool
- **[CHANGELOG.md](CHANGELOG.md)** — version history
- **[desktop/README.md](desktop/README.md)** — desktop app build and install guides
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to contribute

---

Built by [diShine Digital Agency](https://dishine.it)
