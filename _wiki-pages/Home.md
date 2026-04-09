# 📚 AI Prompt Library — Wiki

> **82+ expert-level prompt engineering templates** with CLI, browser-based Prompt Workshop, and desktop apps — built for developers, writers, marketers, and AI practitioners.

Welcome to the official wiki for the **AI Prompt Library** by [diShine Digital Agency](https://dishine.it). This is your central hub for learning everything about the tool — from installation to advanced prompting techniques.

🇮🇹 **[Leggi in italiano](Home-IT)** &nbsp;·&nbsp; 🇫🇷 **[Lire en français](Accueil)**

---

## What Is the AI Prompt Library?

The AI Prompt Library is a comprehensive, zero-dependency toolkit for prompt engineering. It provides:

- **82+ production-ready prompt templates** organized across 8 categories
- **CLI tool** (`prompt-lib`) for terminal-based prompt discovery, building, and optimization
- **Prompt Workshop** — a browser-based interactive SPA (`viewer.html`) that works offline
- **Desktop apps** for macOS (native Swift), Linux (GTK), and Windows (Edge app mode)
- **Quality tools** — Linter (14-rule scoring), Optimizer (content-aware rewriting), Recommender (intent-based suggestions)
- **AI Playground** — send prompts directly to GPT, Claude, or Gemini from the browser
- **Prompt Generator** — dynamically create prompts using 5 frameworks
- **Compose & Create** — layer system prompts + frameworks + templates, or build custom prompts with dynamic fields

**Version:** 2.4.0 &nbsp;|&nbsp; **License:** MIT &nbsp;|&nbsp; **Dependencies:** Zero (only Node.js 18+ built-in modules)

---

## Key Features at a Glance

| Feature | CLI | Prompt Workshop | Description |
|---------|:---:|:---------------:|-------------|
| **Browse & Search** | ✅ | ✅ | Find prompts by keyword, category, or tag |
| **Show & Use** | ✅ | ✅ | View full prompts and fill `{{placeholders}}` interactively |
| **Copy to Clipboard** | ✅ | ✅ | One-click copy of prompt templates |
| **Compose** | ✅ | ✅ | Layer system prompt + framework + template |
| **Create** | ✅ | ✅ | Build custom prompts with dynamic fields |
| **Generate** | ✅ | ✅ | Generate prompts from 5 frameworks |
| **Lint** | ✅ | ✅ | Score prompt quality (0–100, A–F grade) |
| **Optimize** | ✅ | ✅ | Rewrite prompts with best practices |
| **Recommend** | ✅ | ✅ | Smart prompt suggestions based on intent |
| **AI Playground** | — | ✅ | Send prompts to GPT/Claude/Gemini |
| **My Library** | ✅ | ✅ | Save, edit, export/import prompts |
| **Dark Mode** | — | ✅ | Light/dark theme toggle |
| **Multi-Model Compare** | — | ✅ | Send same prompt to all providers, compare side-by-side |

---

## Three Ways to Use It

### 1. CLI (`prompt-lib`)
A terminal-based tool for searching, building, composing, linting, and optimizing prompts. Install globally via npm or run directly from the repository.

```bash
prompt-lib search "chain of thought"
prompt-lib use code-review
prompt-lib lint
```

### 2. Prompt Workshop (`viewer.html`)
A standalone HTML single-page application with 7 tabs — Browse, Compose, Create, Generate, Tools, Playground, and My Library. Works offline, no server needed, no Node.js required.

### 3. Desktop Apps
Native applications for macOS (Swift + WebKit), Linux (Python + GTK + WebKitGTK), and Windows (Edge app mode). Build from source with `./desktop/build-all.sh`.

---

## Prompt Categories

| Category | Count | Description |
|----------|:-----:|-------------|
| `business` | 12 | Proposals, pitches, stakeholder updates, OKRs |
| `data` | 10 | SQL, dashboards, ETL, ML evaluation, data quality |
| `development` | 13 | Code review, architecture, debugging, testing |
| `frameworks` | 12 | Chain-of-thought, ReAct, few-shot, meta-prompting |
| `image-generation` | 8 | Portraits, logos, scenes, character design |
| `marketing` | 11 | SEO, email campaigns, ad copy, brand voice |
| `model-specific` | 6 | Claude, GPT, Gemini, Llama, Mistral best practices |
| `system-prompts` | 10 | Coding assistant, researcher, content writer, tutor |

---

## Wiki Pages

| Page | Description |
|------|-------------|
| **[Getting Started](Getting-Started)** | Installation, setup, and first steps |
| **[CLI Reference](CLI-Reference)** | Complete command-line documentation |
| **[Prompt Workshop](Prompt-Workshop)** | Browser-based interactive tool guide |
| **[Prompting Techniques](Prompting-Techniques)** | Frameworks, patterns, and best practices |
| **[AI Models Guide](AI-Models-Guide)** | Model comparison, pricing, selection |
| **[Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender)** | Quality tools deep-dive |
| **[API & Playground](API-and-Playground)** | AI Playground and programmatic usage |
| **[Architecture](Architecture)** | Technical architecture and module reference |
| **[Desktop Apps](Desktop-Apps)** | Desktop application guide |
| **[Contributing](Contributing)** | How to contribute prompts, code, and frameworks |

---

## Quick Links

- 📦 **npm:** `npm install -g @dishine/prompt-library`
- 🏠 **Repository:** [github.com/diShine-digital-agency/ai-prompt-library](https://github.com/diShine-digital-agency/ai-prompt-library)
- 📖 **User Guide:** [GUIDE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/GUIDE.md)
- 🔧 **Technical Docs:** [TECHNICAL.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/TECHNICAL.md)
- 📋 **Functions Reference:** [FUNCTIONS.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/FUNCTIONS.md)
- 📝 **Changelog:** [CHANGELOG.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/CHANGELOG.md)

---

<p align="center">
Built with ❤️ by <a href="https://dishine.it">diShine Digital Agency</a> — v2.4.0
</p>

---

**Navigation:** [Getting Started →](Getting-Started)
