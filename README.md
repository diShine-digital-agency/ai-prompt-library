# prompt-library

**82+ expert-level prompt templates with a CLI and visual Prompt Workshop to search, browse, compose, create, generate, lint, optimize, and test prompts with AI models.**

If you work with LLMs regularly, you've probably got prompts scattered across Notion docs, Slack messages, and random text files. This library collects the prompting techniques, system prompts, and templates we actually use in client work — organized, searchable, and ready to copy-paste. It covers everything from Chain-of-Thought fundamentals to production system prompts for specific use cases like code review, SEO briefs, and data analysis.

There's a CLI so you can search and read prompts from your terminal, **create custom system prompts** with dynamic fields, **generate prompts from frameworks**, compose multi-layer prompts, **lint prompts for quality**, **optimize them automatically**, and **get smart recommendations**. There's also a standalone **Prompt Workshop** (just open `viewer.html`) with the same features in a visual interface, plus an **AI Playground** to send prompts directly to GPT, Claude, or Gemini.

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
| **Create** | Build your own custom prompts with dynamic `{{field_name}}` placeholders. Define fields, write the body, and save to your personal library. |
| **Generate** | Pick a proven framework, answer guided questions, and get a production-ready system prompt generated automatically — no prompt engineering experience needed. |
| **Tools** | **Prompt Linter** (14-rule quality analysis with 0–100 scoring), **Prompt Optimizer** (instant rule-based + optional AI-powered rewriting), and **Smart Recommender** (describe your use case, get personalized prompt suggestions). |
| **Playground** | Send prompts directly to AI models (OpenAI GPT, Anthropic Claude, Google Gemini). Add a system prompt, see responses, track token usage — iterate without leaving the tool. |
| **My Library** | All your saved prompts, filled templates, and compositions. Stored in your browser's localStorage — persists across sessions. |

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

## New in v2.2.1

### Resizable Sidebar

The sidebar is now **resizable** — drag its right edge to adjust the width (260px–600px). Your preferred width is remembered across sessions. The navigation tabs also wrap to two rows when the sidebar is narrow, so all 7 tabs (including My Library) are always visible.

### Floating Library Button

A **floating 📚 button** in the bottom-right corner gives you one-click access to My Library from any tab. It shows a badge with the count of saved items.

### Edit & Delete Saved Prompts

Every saved prompt now has an **Edit** button. Click it to open an inline editor where you can modify the title and content. Changes are saved instantly. The Delete button is also available on all prompt types.

### Database Prompt Protection

When you save a built-in prompt, it's stored as an **editable copy**. Your edits only affect the saved copy — the original prompt remains unchanged. A clear notice is shown in the editor for database-sourced prompts.

---

## New in v2.2.0

### AI Playground

A new **Playground** tab lets you send prompts directly to AI models without leaving the tool. Add an optional system prompt, type or paste your user prompt, and hit Send. Responses display with model info and token usage. Supports OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude Sonnet, Opus, Haiku), and Google (Gemini 2.0 Flash, Pro).

Configure your API keys via the ⚙ settings button. Keys are stored locally in your browser's localStorage.

### Prompt Linter

Paste any prompt and get a **0–100 quality score** with a letter grade (A–F). The linter checks 14 rules including:
- Role definition, clear task statement, context, output format
- Constraints, examples, structured sections, specific language
- Target audience, tone, quality verification step
- Appropriate length and conciseness

Each failed rule comes with a specific, actionable suggestion to improve.

### Prompt Optimizer

Two modes:
- **Instant** (rule-based) — works offline with zero cost. Restructures your prompt with labeled sections, adds missing role/format/constraints, removes anti-patterns.
- **AI-Powered** — sends your prompt to your configured AI model for a more nuanced rewrite.

Shows a before/after quality score so you can see the improvement.

### Smart Recommender

Describe what you need in plain English (e.g., "I need to write marketing copy for a SaaS landing page") and get:
- A **recommended combination** of system prompt + framework + template
- **Top matching prompts** ranked by relevance score
- Click any result to browse it directly

### New CLI commands

```bash
prompt-lib lint         # Analyze a prompt for quality issues
prompt-lib optimize     # Rewrite a prompt with best practices
prompt-lib recommend "write marketing copy for SaaS"  # Smart suggestions
```

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
# Clone and run directly
node bin/prompt-lib.js list

# Or install globally
npm install -g @dishine/prompt-library
prompt-lib list
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

## v2.1.0

### Quick Fill & Compose

Prompts with `{{field_name}}` placeholders now have a **⚡ Quick Fill** button in the Prompt Workshop. This gives you a simplified, distraction-free flow: only the field inputs appear, with descriptions, a progress bar, and a live preview. Fill in your details and copy the assembled prompt — no prompt engineering experience needed.

### Beginner mode

Toggle the **?** button to enable contextual help banners in every tab. Each banner explains what the feature does, how to use it, and includes pro tips. Designed for people new to prompt engineering.

### Keyboard shortcuts

Navigate the Workshop with your keyboard: `1`–`7` to switch tabs, `Ctrl+K` to search, `H` for help, `D` for dark mode, `Esc` to clear search.

### 30 new expert prompts (82 total)

Added 30 new production-ready prompt templates with fieldnames, including a new **image-generation** category with 8 templates for AI image creation (product photography, portraits, social media visuals, infographics, character design, logos, cinematic scenes, style transfer). Also added system prompts for agentic coding, deep research, and Socratic tutoring; business prompts for sales battlecards and investor pitches; development prompts for incident response and system design; and frameworks like self-consistency prompting. Curated from proven community prompt patterns.

### Earlier: v2.0.0

### Create custom system prompts

Build your own system prompts with dynamic `{{field_name}}` placeholders:

```bash
prompt-lib create
```

You'll be guided through:
1. Setting the title, category, tags, difficulty, and models
2. Defining dynamic fields (each becomes a `{{placeholder}}`)
3. Writing the prompt body
4. Saving to your personal library

Custom prompts are stored in `~/.prompt-library/custom-prompts.json` and appear alongside built-in prompts in all commands.

### Generate prompts from frameworks

Choose a proven framework, answer guided questions, and get a complete system prompt:

```bash
prompt-lib generate
```

Available frameworks:
- **Expert Role-Based** — expert persona with rules and constraints
- **Chain-of-Thought** — step-by-step reasoning enforcement
- **Structured Output** — consistent, formatted output
- **Task Decomposition** — break complex tasks into sub-tasks
- **Guardrails & Safety** — built-in safety rules and constraints

### Persistence

All custom prompts and compositions are saved locally:
- **CLI**: `~/.prompt-library/` directory
- **HTML**: browser localStorage

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
  prompts/
    frameworks/            core prompting techniques
    model-specific/        model-optimized patterns
    system-prompts/        production system prompts
    marketing/             marketing templates
    development/           development templates
    data/                  data & analytics templates
    business/              business templates
    image-generation/      image & visual AI prompt templates
  viewer.html              interactive Prompt Workshop (standalone, works offline)
  test/run.js              test suite
  CHANGELOG.md             version history
  TECHNICAL.md             architecture and technical documentation
```

---

## Requirements

- **Node.js** 18 or later
- No npm dependencies at all -- uses only Node.js built-in modules (`fs`, `path`, `url`, `readline`, `child_process`, `os`)

---

## Documentation

- **[README.md](README.md)** — this file, overview and quick start
- **[GUIDE.md](GUIDE.md)** — detailed user guide with examples
- **[TECHNICAL.md](TECHNICAL.md)** — architecture, module reference, data formats, extension guide
- **[CHANGELOG.md](CHANGELOG.md)** — version history and release notes

---

## License

MIT -- [diShine](https://dishine.it)
