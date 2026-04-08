# Architecture

> Technical architecture, module reference, data formats, and project structure of the AI Prompt Library.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Module Reference](#module-reference)
- [Data Formats](#data-formats)
- [localStorage Keys](#localstorage-keys)
- [Project File Structure](#project-file-structure)
- [Node.js Built-in Modules Used](#nodejs-built-in-modules-used)
- [How viewer.html Works](#how-viewerhtml-works)

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

The core module that loads prompts from the filesystem and manages user data.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `loadPrompts()` | `() → Array<Prompt>` | Loads all prompts from `prompts/` directory + custom prompts from `~/.prompt-library/custom-prompts.json` |
| `loadCustomPrompts()` | `() → Array<Prompt>` | Loads only user-created custom prompts |
| `saveCustomPrompt(prompt)` | `(Prompt) → Prompt` | Saves a custom prompt. Overwrites if slug exists, otherwise appends |
| `loadSavedCompositions()` | `() → Array<Composition>` | Loads saved compositions from `~/.prompt-library/saved-prompts.json` |
| `saveComposition(composition)` | `(Object) → Composition` | Appends a composition with auto-generated `id` (timestamp) and `date` (ISO string) |
| `findPlaceholders(text)` | `(string) → Array<string>` | Extracts unique `{{placeholder}}` tokens from text using regex `/\{\{[\w_\-\s/]+\}\}/g` |
| `extractTemplate(content)` | `(string) → string\|null` | Extracts content between code fences in the `## Template` section |

**Exported Constants:**

| Name | Value | Description |
|------|-------|-------------|
| `PROMPTS_DIR` | `<project>/prompts/` | Absolute path to built-in prompts |
| `USER_DATA_DIR` | `~/.prompt-library/` | User data directory |
| `USER_PROMPTS_FILE` | `~/.prompt-library/custom-prompts.json` | Custom prompts file |
| `USER_SAVED_FILE` | `~/.prompt-library/saved-prompts.json` | Saved compositions file |

**Internal Functions:**
- `parseFrontmatter(content)` — parses YAML frontmatter (between `---` markers) into a `{meta, body}` object. Handles bracket arrays (`[tag1, tag2]`).
- `walkDir(dir)` — recursively finds all `.md` files in a directory tree.
- `ensureUserDir()` — creates `~/.prompt-library/` if it doesn't exist.

---

### `src/search.js` — Search Algorithm

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `searchPrompts(prompts, query)` | `(Array, string) → Array` | Scores and ranks prompts by relevance to query |

**Scoring:**

| Match Location | Points per Term |
|---------------|:--------------:|
| Title | 100 |
| Tag | 50 |
| Category | 30 |
| Content | 10 |

**Algorithm:**
1. Split query into lowercase terms
2. For each prompt, score each term against title, tags, category, and content
3. Sum all points
4. Filter out zero-score prompts
5. Sort by score descending

---

### `src/formatter.js` — Terminal Formatting

Provides ANSI color formatting for CLI output. Respects the `NO_COLOR` environment variable (when set, all color codes are empty strings).

**Exports:**

| Function | Description |
|----------|-------------|
| `formatPromptList(prompts)` | Formats all prompts grouped by category |
| `formatPromptDetail(prompt)` | Formats a single prompt with full metadata |
| `formatCategories(prompts)` | Formats category list with counts |
| `formatStats(prompts)` | Formats library statistics (totals, difficulty breakdown, top tags) |
| `formatSearchResults(results, query)` | Formats search results with scores |

**Color scheme:**
- Cyan: titles, slugs, section headers
- Magenta: category names
- Yellow: metadata labels, intermediate difficulty
- Green: beginner difficulty, tags
- Red: advanced difficulty
- Dim/Gray: separators, secondary info

---

### `src/generator.js` — Dynamic Prompt Generation

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `getFrameworks()` | `() → Array<FrameworkInfo>` | Returns all frameworks with metadata and questions |
| `getFramework(key)` | `(string) → Framework\|null` | Returns a single framework by key |
| `generatePrompt(key, answers)` | `(string, Object) → string` | Generates a complete prompt. Validates required fields and applies defaults. |

**Available Frameworks:**

| Key | Name | Questions |
|-----|------|:---------:|
| `expert-role` | Expert Role-Based | 8 |
| `chain-of-thought` | Chain-of-Thought | 5 |
| `structured-output` | Structured Output | 5 |
| `task-decomposition` | Task Decomposition | 4 |
| `guardrails` | Guardrails & Safety | 6 |

Each framework defines a `generate(answers)` function that produces the final prompt string from user answers.

---

### `src/linter.js` — Prompt Quality Scorer

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `lintPrompt(text)` | `(string) → LintResult` | Analyzes prompt against 14 rules. Returns score, grade, passed/failed rules, suggestions, word count |
| `formatLintResult(result)` | `(LintResult) → string` | Formats lint result as human-readable string |
| `LINT_RULES` | `Array<Rule>` | Array of all 14 rule objects |

**LintResult shape:**
```javascript
{
  score: 72,              // 0-100
  grade: 'C',             // A, B, C, D, F
  totalRules: 14,
  passedCount: 10,
  failedCount: 4,
  passed: [...],           // Array of passed rules
  failed: [...],           // Array of failed rules
  suggestions: [...],      // Array of suggestion strings (sorted by weight)
  wordCount: 89
}
```

**Scoring:** `score = Math.round((earnedWeight / totalWeight) × 100)` where totalWeight = 100.

See [Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender.md#prompt-linter) for the full rule list.

---

### `src/optimizer.js` — Content-Aware Prompt Optimizer

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `optimizePrompt(text)` | `(string) → OptimizeResult` | Offline, rule-based optimization |
| `optimizeWithAI(text, provider, apiKey, model)` | `(string, string, string, string?) → Promise<string>` | AI-powered rewriting |
| `sendToAI(prompt, systemPrompt, provider, apiKey, model)` | `(string, string?, string, string, string?) → Promise<AIResponse>` | Send prompt to AI model (Playground) |

**OptimizeResult shape:**
```javascript
{
  original: "...",         // Original prompt text
  optimized: "...",        // Optimized prompt text
  changes: [...],          // Array of change descriptions
  scoreBefore: 35,
  scoreAfter: 88,
  improvement: 53,
  lint: { ... },           // Full lint result of optimized prompt
  domain: "coding",        // Detected domain
  audience: "developers"   // Detected audience (or null)
}
```

**Optimization pipeline:** domain detection → filler removal → politeness reduction → weak verb strengthening → vague language replacement → compound task decomposition → role injection → audience/tone detection → constraints → output format → examples → quality check.

**7 Detected Domains:** coding, writing, marketing, data, business, education, image.

---

### `src/recommender.js` — Intent-Based Prompt Matcher

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `recommendPrompts(prompts, description)` | `(Array, string) → Array` | Scores all prompts by relevance |
| `buildRecommendation(prompts, description)` | `(Array, string) → Recommendation` | Builds full recommendation with combo |

**Recommendation shape:**
```javascript
{
  description: "...",
  topPrompts: [...],          // Top 8 matches
  suggestedCombo: {
    systemPrompt: { ... },    // Best matching system prompt
    framework: { ... },       // Best matching framework
    template: { ... }         // Best matching domain template
  },
  systemPrompts: [...],       // Top 3 system prompts
  frameworks: [...],          // Top 3 frameworks
  templates: [...]            // Top 5 templates
}
```

**8 Intent Categories:** coding, writing, marketing, data, business, image, research, teaching.

---

## Data Formats

### Prompt Object

```json
{
  "slug": "code-review",
  "title": "Code Review Checklist",
  "category": "development",
  "tags": ["code-review", "quality", "checklist"],
  "difficulty": "intermediate",
  "models": ["claude", "gpt-4", "gemini"],
  "content": "# Code Review Checklist\n\n## Template\n\n```\n...\n```",
  "path": "development/code-review.md"
}
```

Custom prompts add:
```json
{
  "fields": [
    { "name": "language", "description": "Programming language" }
  ],
  "custom": true
}
```

### Saved Composition

```json
{
  "id": 1712430000000,
  "title": "Composed: Coding Assistant + Chain-of-Thought + Code Review",
  "result": "# SYSTEM PROMPT\n\n...\n\n# REASONING FRAMEWORK\n\n...",
  "layers": ["Coding Assistant", "Chain-of-Thought", "Code Review"],
  "type": "composed",
  "date": "2026-04-06T12:00:00.000Z"
}
```

### Prompt File Format (YAML Frontmatter)

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

## localStorage Keys

These keys are used by the Prompt Workshop (`viewer.html`):

| Key | Type | Description |
|-----|------|-------------|
| `pl_dark` | `boolean` | Dark mode preference (`true`/`false`) |
| `pl_saved` | `JSON array` | All saved prompts, filled templates, composed prompts, custom prompts. Items from the database are marked with `source: 'database'` |
| `pl_sidebar_width` | `number` | Sidebar width in pixels (260–600). Persists across sessions |
| `api_settings` | `JSON object` | API keys and model preferences for Playground and AI Optimizer. Contains provider, keys for OpenAI/Anthropic/Google, and selected models |

---

## Project File Structure

```
ai-prompt-library/
├── bin/
│   └── prompt-lib.js            # CLI entry point (ESM, #!/usr/bin/env node)
├── src/
│   ├── index.js                 # Prompt loader, persistence, placeholders
│   ├── search.js                # Scored search algorithm
│   ├── formatter.js             # ANSI terminal formatting
│   ├── generator.js             # 5 frameworks, dynamic prompt generation
│   ├── linter.js                # 14-rule quality scorer
│   ├── optimizer.js             # Content-aware optimizer + AI APIs
│   └── recommender.js           # Intent-based prompt matcher
├── prompts/
│   ├── business/                # 12 business templates
│   ├── data/                    # 10 data analysis templates
│   ├── development/             # 13 development templates
│   ├── frameworks/              # 12 prompting framework guides
│   ├── image-generation/        # 8 image generation templates
│   ├── marketing/               # 11 marketing templates
│   ├── model-specific/          # 6 model-specific guides
│   └── system-prompts/          # 10 system prompts
├── desktop/
│   ├── build-all.sh             # Build all platforms
│   ├── build-macos.sh           # macOS build script
│   ├── build-linux.sh           # Linux build script
│   ├── build-windows.bat        # Windows build script
│   ├── macos-native/            # Swift source for macOS native app
│   ├── linux-native/            # Python + GTK source for Linux native app
│   ├── icons/                   # App icons for all platforms
│   └── images/                  # Screenshots and documentation images
├── test/
│   └── run.js                   # Test suite (46 tests, zero dependencies)
├── wiki/
│   ├── en/                      # English wiki pages
│   ├── fr/                      # French wiki pages
│   └── it/                      # Italian wiki pages
├── viewer.html                  # Prompt Workshop (self-contained SPA)
├── package.json                 # Package config (zero dependencies)
├── README.md                    # Project overview
├── GUIDE.md                     # User guide
├── TECHNICAL.md                 # Technical documentation
├── FUNCTIONS.md                 # Functions reference
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history
├── CODE_OF_CONDUCT.md           # Code of conduct
├── SECURITY.md                  # Security policy
└── LICENSE                      # MIT License
```

---

## Node.js Built-in Modules Used

The project uses **zero npm dependencies**. Only Node.js built-in modules:

| Module | Usage |
|--------|-------|
| `fs` | File reading (`readFileSync`), writing (`writeFileSync`), directory traversal (`readdirSync`, `statSync`), existence checks (`existsSync`), directory creation (`mkdirSync`) |
| `path` | Path manipulation (`join`, `dirname`, `relative`, `basename`) |
| `url` | `fileURLToPath` for ESM-compatible `__dirname` |
| `readline` | Interactive CLI input (questions and multi-line prompt entry) |
| `child_process` | Clipboard copy via `execSync` (`pbcopy`, `clip`, `xclip`, `xsel`), opening browser (`open`, `xdg-open`, `start`) |
| `os` | Home directory (`homedir`), temp directory (`tmpdir`) |

---

## How viewer.html Works

The `viewer.html` file is a **self-contained single-page application**:

1. **No external dependencies** — pure HTML, CSS, and vanilla JavaScript in a single file
2. **Prompt data embedded** — all 82+ prompts are serialized as JSON in a `<script>` tag
3. **localStorage for persistence** — custom prompts, saved compositions, favorites, API keys, and UI preferences
4. **Responsive design** — works on desktop, tablet, and mobile
5. **Dark/light mode** — togglable with preference saved to localStorage

When launched via `prompt-lib viewer`, the CLI:
1. Reads `viewer.html`
2. Loads all prompts (including custom prompts)
3. Injects the prompt data as JSON into the HTML
4. Writes the modified HTML to a temp file
5. Opens the temp file in the default browser

When opened directly, the embedded prompt data (built at release time) is used.

---

**Navigation:** [← API & Playground](API-and-Playground) &nbsp;|&nbsp; [Desktop Apps →](Desktop-Apps)
