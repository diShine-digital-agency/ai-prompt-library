# AI-Prompt Library: the prompt-engineering powerhouse to search, compose, create, lint and optimize your prompt

<p align="center">
  <img src="desktop/images/prompt_workshop_02_compose_workflow2.webp" alt="PROMP WORKSHOP compose workflow" width="65%">
</p>

**82+ expert-level prompt templates — with a CLI, a browser-based Prompt Workshop, and desktop apps — to search, browse, compose, create, lint, optimize, and test prompts with AI models.**

<p align="center">
  <img src="desktop/images/prompt_workshop_03_create_custom_prompt2.webp" alt="PROMP WORKSHOP create custom prompt" width="49%">
  <img src="desktop/images/prompt_workshop_05_tools_workspace2.webp" alt="PROMP WORKSHOP tools workspace" width="49%">
</p>

If you work with LLMs regularly, you've probably got prompts scattered across Notion docs, Slack messages, and random text files. This library brings them together: organized, searchable, and ready to use.

<p align="center">
  <img src="desktop/images/prompt_workshop_04_generate_framework2.webp" alt="PROMP WORKSHOP generate framework" width="60%">
</p>

**Three ways to use it:**

| Interface | How to open |
|-----------|-------------|
| **CLI** | Clone the repo → `node bin/prompt-lib.js list` (or install globally with `npm install -g @dishine/prompt-library`) |
| **Browser app** | Open `viewer.html` in any browser — no server, no internet required |
| **Desktop app** | Build from source with `./desktop/build-all.sh` — native window on macOS, Linux, and Windows |

All three give you the same features: search and browse prompts, compose multi-layer prompts, create custom prompts with dynamic fields, generate prompts from frameworks, lint prompts for quality, optimize them automatically, and get smart recommendations. The browser and desktop app also include an **AI Playground** to send prompts directly to GPT, Claude, or Gemini.

Zero npm dependencies. Just Node.js built-in modules.

Built by [diShine](https://dishine.it)

---

## ⚡ Prompt Workshop (viewer.html)

The **Prompt Workshop** is a standalone HTML file — no server, no build step, no internet required. Just open `viewer.html` in any browser and you get the full prompt library with an interactive interface.

### What it does

| Tab | Description |
|-----|-------------|
| **Browse** | Search and filter all 82+ prompts by category, difficulty, model, or keyword. Click any prompt to read the full content, copy it, or build it interactively. |
| **Compose** | Build layered prompts by combining a **system prompt** (persona) + **reasoning framework** (technique) + **task template** (the work). All three combine into one powerful prompt. |
| **Create** | Build your own custom prompts with dynamic `{{field_name}}` placeholders. Choose from 6 starter templates (Expert Assistant, Content Writer, Code Generator, Data Analyst, Marketing Strategist, Image Prompt) or start from scratch. Define fields, write the body, and save to your personal library. |
| **Generate** | Pick a proven framework, answer guided questions, and get a production-ready system prompt generated automatically — no prompt engineering experience needed. |
| **Tools** | **Prompt Linter** (14-rule quality analysis with 0–100 scoring, auto-detects prompt type — image/code/system/general — and adjusts rule weights), **Prompt Optimizer** (content-aware rewriting with diff view — detects your domain, replaces vague language, strengthens weak verbs, removes filler, adds domain-specific role/constraints/output format/quality checks + optional AI-powered rewriting), and **Smart Recommender** (describe your use case, get personalized prompt suggestions with a recommended system prompt + framework + template combo). See [FUNCTIONS.md](FUNCTIONS.md) for full details. |
| **Playground** | Send prompts directly to AI models (OpenAI GPT, Anthropic Claude, Google Gemini). Add a system prompt, see responses, track token usage — iterate without leaving the tool. **Multi-Model Compare**: configure 2+ API keys, then click "⚖ Compare" to send the same prompt to all providers at once and see responses side-by-side with timing and token stats. |
| **My Library** | All your saved prompts, filled templates, and compositions with search, type filter, and sort controls. Stored in your browser's localStorage — persists across sessions. |

### Quick Fill & Compose

Many prompts include `{{field_name}}` placeholders. When you open one, you'll see a **⚡ Quick Fill** button that gives you a streamlined experience:

1. **Only the fields appear** — no distraction, just the inputs you need to fill
2. **Field descriptions** tell you exactly what each placeholder expects
3. **Live preview** updates as you type — see the assembled prompt in real time
4. **Progress bar** tracks how many fields you've completed
5. **One-click copy** — paste the filled prompt directly into your AI tool

This is the fastest way to use templates from the library. No prompt engineering knowledge required.

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `1`–`7` | Switch between tabs (Browse, Compose, Create, Generate, Tools, Playground, My Library) |
| `Ctrl+K` | Focus the search box |
| `H` | Toggle beginner help tips on/off |
| `D` | Toggle dark mode |
| `Esc` | Clear search |

### Beginner mode

Click the **?** button (top-right) to toggle beginner help tips. When enabled, each tab shows contextual guidance explaining what the feature does, how to use it, and pro tips for better results. Perfect for people new to prompt engineering.

### API Settings (⚙)

Click the **⚙** button (top-right) to configure API keys for OpenAI, Anthropic, and Google. Keys are stored locally in your browser — never sent anywhere except the API provider. Required for the Playground and AI-powered optimization.

---

## What's in here

82+ prompts across 8 categories:

| Category | Count | What's covered |
|----------|-------|----------------|
| **frameworks** | 12 | Chain-of-Thought, Few-Shot, ReAct, Tree-of-Thought, Role-Based, Meta-prompting, Constitutional AI, Prompt Chaining, Structured Extraction, Mega-Prompt, Prompt Evaluation, Self-Consistency |
| **model-specific** | 6 | deep technique guides for Claude, GPT, Gemini, Llama, Mistral, plus a side-by-side comparison |
| **system-prompts** | 10 | production-ready system prompts for coding, writing, data analysis, research, executive advisor, support, technical writer, agentic coder, deep researcher, Socratic tutor |
| **marketing** | 11 | SEO briefs, email campaigns, social calendars, competitor analysis, ad copy, brand voice, conversion copywriting, LinkedIn content, landing page copy, product descriptions, growth experiments |
| **development** | 13 | code review, API design, database schema, testing, refactoring, architecture decisions, prompt-as-code, debugging, code documentation, git commits, code refactoring review, incident response, system design |
| **data** | 10 | SQL builder, data pipelines, dashboards, quality audits, statistics, visualization, ETL automation, data cleaning, report generation, ML model evaluation |
| **business** | 12 | proposals, meeting summaries, OKRs, stakeholder updates, risk assessment, pitch decks, client communication, competitive intelligence, executive summaries, job descriptions, sales battlecards, investor pitches |
| **image-generation** | 8 | product photography, portraits, social media visuals, infographics, character design, logo & branding, cinematic scenes, art style transfer |
| **custom** | ∞ | your own prompts created with `create` or `generate` |

These aren't generic "write me a blog post" prompts. They're structured templates with placeholders, examples, tips, and common mistakes -- the kind of thing you'd build up over months of actual use.

---

## Quick start

```bash
# Clone and run directly — no npm install needed
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
node bin/prompt-lib.js list

# Or install globally
npm install -g @dishine/prompt-library
prompt-lib list

# Or just open the browser app — no Node.js required
# Open viewer.html in any browser
```

---

## CLI usage

```bash
# List all prompts grouped by category
prompt-lib list

# Search prompts by keyword
prompt-lib search "chain of thought"
prompt-lib search "marketing email"

# Show full prompt content
prompt-lib show chain-of-thought
prompt-lib show code-review

# Build a prompt interactively — fills in {{placeholders}} for you
prompt-lib use chain-of-thought

# Copy a prompt template to clipboard
prompt-lib copy email-campaign

# Combine a system prompt + framework + domain template into one prompt
prompt-lib compose

# Create a custom system prompt with dynamic fields
prompt-lib create

# Generate a prompt from a framework (answer questions, get a prompt)
prompt-lib generate

# View saved compositions and custom prompts
prompt-lib saved

# Analyze a prompt for quality issues (0-100 score, A-F grade)
prompt-lib lint

# Rewrite a prompt with best practices (rule-based, offline)
prompt-lib optimize

# Get smart prompt suggestions for your use case
prompt-lib recommend "write marketing copy for a SaaS landing page"

# Open the Prompt Workshop in your default browser
prompt-lib viewer

# List all categories with counts
prompt-lib categories

# Show a random prompt (good for discovering things you forgot were in here)
prompt-lib random

# Library statistics
prompt-lib stats

# Help and version
prompt-lib --help
prompt-lib --version
```

---

> See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## Prompt format

Every prompt file uses YAML frontmatter with Markdown content:

```markdown
---
title: Chain-of-Thought Prompting
category: frameworks
tags: [reasoning, step-by-step, problem-solving]
difficulty: intermediate
models: [claude, gpt-4, gemini, llama, mistral]
---

# Chain-of-Thought Prompting

[Content with sections: When to Use, The Technique, Template, Examples, Tips, Common Mistakes]
```

### Metadata fields

| Field | Description |
|-------|-------------|
| `title` | human-readable name |
| `category` | one of the categories listed above |
| `tags` | searchable keywords |
| `difficulty` | `beginner`, `intermediate`, or `advanced` |
| `models` | which LLMs this technique works best with |

---

## Programmatic usage

```javascript
import { loadPrompts, findPlaceholders, extractTemplate } from '@dishine/prompt-library';
import { searchPrompts } from '@dishine/prompt-library/src/search.js';
import { generatePrompt, getFrameworks } from '@dishine/prompt-library/src/generator.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'code review');

console.log(results[0].title);   // "Code Review Prompt"
console.log(results[0].content); // full prompt content

// Generate a prompt from a framework
const prompt = generatePrompt('expert-role', {
  role: 'data analyst',
  domain: 'business intelligence',
  task: 'Build SQL queries from natural language',
});
```

---

## Adding your own prompts

The library is designed to be extended. To add a prompt:

1. Create a `.md` file in the appropriate `prompts/` subdirectory
2. Add YAML frontmatter with `title`, `category`, `tags`, `difficulty`, `models`
3. Structure the content with these sections:
   - **When to use** -- when this technique applies
   - **The technique** -- detailed explanation
   - **Template** -- copy-paste ready template with `{{placeholders}}`
   - **Examples** -- real-world usage examples
   - **Tips** -- expert advice from actual use
   - **Common mistakes** -- pitfalls to avoid

The CLI picks up new files automatically -- no registration step.

Or use `prompt-lib create` to build prompts interactively and save them to your personal library.

---

## Project structure

```
ai-prompt-library/
  bin/prompt-lib.js        CLI entry point
  src/
    index.js               prompt loader, persistence, shared utilities
    search.js              scored search (title/tag/category/content)
    formatter.js           ANSI terminal formatting
    generator.js           dynamic prompt generation from frameworks
    linter.js              14-rule prompt quality scorer
    optimizer.js           content-aware prompt optimizer (domain detection, vague language fix, etc.)
    recommender.js         intent-based prompt matcher
  prompts/
    frameworks/            core prompting techniques
    model-specific/        model-optimized patterns
    system-prompts/        production system prompts
    marketing/             marketing templates
    development/           development templates
    data/                  data & analytics templates
    business/              business templates
    image-generation/      image & visual AI prompt templates
  desktop/
    build-all.sh           cross-platform build (macOS + Linux + Windows)
    build-macos.sh         macOS native app build (Swift on Mac, browser fallback on Linux)
    build-linux.sh         Linux .desktop build script (GTK + WebKitGTK)
    build-windows.bat      Windows build script (Edge app mode)
    macos-native/          Swift source for native macOS app
    linux-native/          Python GTK source for native Linux app
    icons/                 App icons for all platforms (.icns, .png, .ico)
    README.md              install guides, troubleshooting, platform notes
  viewer.html              interactive Prompt Workshop (standalone, works offline)
  test/run.js              test suite
  CHANGELOG.md             version history
  CONTRIBUTING.md          how to contribute
  FUNCTIONS.md             detailed tool and function reference
  GUIDE.md                 user guide with examples
  TECHNICAL.md             architecture and technical documentation
```

---

## Desktop & Mobile Apps

The Prompt Workshop runs as a **native application** on all desktop platforms — each with its own window, app icon, and one-click installer. No terminal needed after building.

Desktop apps are built from source (no pre-built downloads). You need Node.js 18+ and Bash:

```bash
# Clone and build for all platforms
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh
```

| Platform | How to install |
|----------|----------------|
| **macOS** (built on Mac) | Build → move `dist/PromptWorkshop.app` to Applications. Native Swift app, runs in its own window. Requires Xcode Command Line Tools (`xcode-select --install`). |
| **macOS** (built on Linux) | Build → move `dist/PromptWorkshop.app` to Applications. Opens in browser (no native window). |
| **Linux** | Build → extract `dist/prompt-workshop-linux.tar.gz` → double-click `install.sh`. Native GTK window on most desktops (Ubuntu, Fedora, Mint), falls back to browser. |
| **Windows** | Build → extract `dist/PromptWorkshop-win.zip` → double-click `Install.bat`. Opens in Edge app mode (own window), falls back to Chrome or browser. |
| **Android / iOS** | Open `viewer.html` in browser → "Add to Home Screen" |

All three desktop apps run in their **own window** (no browser chrome) with custom app icons, keyboard shortcuts, and persistent storage. See [`desktop/README.md`](desktop/README.md) for detailed step-by-step instructions and troubleshooting.

---

## Platform Notes

The CLI and browser app work on **macOS**, **Linux**, and **Windows**. Here are the platform-specific details:

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| CLI commands | ✅ Full support | ✅ Full support | ✅ Full support |
| Clipboard (`copy`, `compose`) | ✅ Built-in (`pbcopy`) | ✅ Requires `xclip` or `xsel` | ✅ Built-in (`clip`) |
| `viewer` command | ✅ `open` | ✅ `xdg-open` | ✅ `start` |
| Browser app (`viewer.html`) | ✅ Any browser | ✅ Any browser | ✅ Any browser |
| Desktop app build | ✅ Native Swift app | ✅ GTK + WebKitGTK | ✅ Edge app mode |
| Build scripts (`.sh`) | ✅ Bash built-in | ✅ Bash built-in | ⚠️ Requires Git Bash or WSL |

**Linux clipboard setup:** Install `xclip` (recommended) or `xsel` for clipboard commands to work. Without them, prompts are printed to the terminal for manual copying.

```bash
# Ubuntu / Debian
sudo apt install xclip

# Fedora
sudo dnf install xclip
```

See [GUIDE.md — Troubleshooting](GUIDE.md#troubleshooting) for more platform-specific help.

---

## Requirements

- **Node.js** 18 or later
- No npm dependencies at all -- uses only Node.js built-in modules (`fs`, `path`, `url`, `readline`, `child_process`, `os`)

---

## Documentation

- **[README.md](README.md)** — this file, overview and quick start
- **[GUIDE.md](GUIDE.md)** — detailed user guide with examples
- **[FUNCTIONS.md](FUNCTIONS.md)** — detailed reference for every tool (linter, optimizer, recommender, generator, playground, etc.)
- **[TECHNICAL.md](TECHNICAL.md)** — architecture, module reference, data formats, extension guide
- **[CHANGELOG.md](CHANGELOG.md)** — version history and release notes
- **[desktop/README.md](desktop/README.md)** — desktop app build and install guides
- **[Wiki](https://github.com/diShine-digital-agency/ai-prompt-library/wiki)** — comprehensive trilingual wiki (English, Italian, French) with 33 pages covering every aspect of the tool
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to contribute

---

## License

MIT -- [diShine](https://dishine.it)
