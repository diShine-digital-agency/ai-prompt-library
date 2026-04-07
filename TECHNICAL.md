# Technical Documentation

Architecture, data flow, and extension guide for the diShine Prompt Library.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                                                         │
│   CLI (bin/prompt-lib.js)    HTML (viewer.html)          │
│   ├── list, search, show     ├── Browse tab              │
│   ├── use, copy              ├── Compose tab             │
│   ├── compose                ├── Create tab (v2.0)       │
│   ├── create (v2.0)          ├── Generate tab (v2.0)     │
│   ├── generate (v2.0)        └── My Library tab          │
│   └── saved (v2.0)                                       │
├─────────────────────────────────────────────────────────┤
│                    Core Modules                          │
│                                                         │
│   src/index.js     — Prompt loader, persistence          │
│   src/search.js    — Scored search algorithm             │
│   src/formatter.js — ANSI terminal formatting            │
│   src/generator.js — Dynamic prompt generation (v2.0)    │
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
- **Prompt data embedded** — all 52+ prompts are serialized as JSON in a `<script>` tag
- **localStorage for persistence** — custom prompts, saved compositions, favorites, and preferences
- **Responsive design** — works on desktop, tablet, and mobile
- **Dark/light mode** — togglable with preference saved in localStorage

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `pl_dark` | boolean | Dark mode preference |
| `pl_saved` | array | Saved prompts, filled templates, composed prompts, custom prompts. Each saved item includes full content as an editable copy. Database-sourced items are marked with `source: 'database'` and can be edited without affecting the original prompt. |
| `pl_sidebar_width` | number | User's preferred sidebar width in pixels (260–600). Persists across sessions. |

### Tab Structure

| Tab | Description |
|-----|-------------|
| **Browse** | Search, filter, and read prompts. Build prompts interactively. |
| **Compose** | Combine system prompt + framework + task template. |
| **Create** | Build custom system prompts with field definitions. |
| **Generate** | Choose a framework, answer questions, get a generated prompt. |
| **My Library** | View saved prompts, compositions, and custom prompts. |

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
| `build-macos.sh` | macOS | `.app` bundle (~724KB) |
| `build-linux.sh` | Linux | Directory with `.desktop` file + installer |
| `build-windows.bat` | Windows | Portable folder with `.vbs` / `.bat` launchers |

All scripts can run on Linux (no cross-compilation needed). The app is a thin launcher that opens `viewer.html` in the system's default browser.

---

## Testing

```bash
node test/run.js
```

Tests verify:
- Prompt loading (52+ prompts from files + custom prompts)
- Required fields on each prompt (slug, title, category, tags, content)
- Search scoring and ranking
- Category count validation
- Custom prompt creation and persistence
- Generator framework validation

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

Built by [diShine Digital Agency](https://dishine.it)
