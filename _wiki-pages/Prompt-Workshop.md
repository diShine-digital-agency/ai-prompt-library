# Prompt Workshop

> Complete guide to the browser-based interactive Prompt Workshop (`viewer.html`).

---

## Overview

The **Prompt Workshop** is a self-contained, single-page HTML application that provides a visual interface to the entire AI Prompt Library. It works:

- **Offline** — no internet connection needed
- **Without a server** — just open the HTML file directly
- **Without Node.js** — pure HTML, CSS, and vanilla JavaScript
- **On any device** — desktop, tablet, or mobile browser

### How to Open

```bash
# Option 1: From the CLI (injects latest prompt data)
prompt-lib viewer

# Option 2: Open directly in any browser
open viewer.html          # macOS
xdg-open viewer.html      # Linux
start viewer.html         # Windows
```

The Workshop provides everything the CLI does, plus a visual AI Playground, dark/light mode, keyboard shortcuts, My Library management, and more.

---

## The 7 Tabs

### Tab 1: Browse

The default tab. Search, filter, and explore all 82+ prompts.

**Features:**
- **Search bar** — real-time search across titles, tags, categories, and content (or press `Ctrl+K`)
- **Category filter** — filter by any of the 8 categories
- **Difficulty filter** — filter by beginner, intermediate, or advanced
- **Prompt cards** — each card shows title, category, difficulty, tags, and compatible models
- **Quick Fill** — click a prompt to open it, then fill `{{placeholders}}` interactively
- **Progress bar** — shows completion progress as you fill placeholders
- **Live preview** — see the filled prompt update in real time
- **Copy button** — one-click copy of the filled prompt

**How Quick Fill Works:**
1. Click a prompt card to select it
2. The template section is extracted and `{{placeholders}}` are detected
3. Input fields appear for each placeholder
4. As you type, the preview updates live
5. A progress bar shows how many fields are filled
6. Click "Copy" to copy the result, or save it to My Library

---

### Tab 2: Compose

Layer multiple prompts into a single powerful composite prompt.

**Workflow:**
1. **System Prompt** — select a persona (e.g., Coding Assistant, Research Assistant, Data Analyst). Sets the AI's role and behavioral rules.
2. **Framework** — select a reasoning technique (e.g., Chain-of-Thought, Few-Shot Patterns, Tree-of-Thought). Adds structured thinking.
3. **Task Template** — select a domain-specific template (e.g., Code Review, SQL Query Builder, Landing Page Copy). Defines the actual task.
4. **Fill Placeholders** — any `{{placeholders}}` across all three layers are detected and presented for filling.
5. **Preview & Copy** — see the composed result and copy it with one click.
6. **Save** — optionally save the composition to My Library.

The composed prompt follows this structure:
```
# SYSTEM PROMPT
[Selected system prompt content]

# REASONING FRAMEWORK
[Selected framework content]

# TASK TEMPLATE
[Selected task template content]
```

---

### Tab 3: Create

Build custom system prompts with dynamic fields from scratch.

**Features:**
- **Field Builder** — define dynamic fields that become `{{field_name}}` placeholders
- **Field metadata** — each field gets a name and description
- **Prompt editor** — write the prompt body using your defined fields
- **Live preview** — see the final prompt with placeholders highlighted
- **Metadata** — set title, category, tags, difficulty, and compatible models
- **Save** — custom prompts are saved to My Library and appear alongside built-in prompts

**Example:**
```
Title: Technical Blog Writer
Category: custom
Fields:
  - topic: The subject of the blog post
  - audience: Target audience (beginner/expert)
  - word_count: Target word count

Template:
Write a {{word_count}}-word technical blog post about {{topic}}
for {{audience}} audience...
```

---

### Tab 4: Generate

Create prompts dynamically using 5 built-in frameworks. Each framework asks guided questions and produces a production-ready prompt.

**Available Frameworks:**

| Framework | Description | Key Questions |
|-----------|-------------|---------------|
| **Expert Role-Based** | Expert persona with rules and constraints | Role, domain, task, audience, tone, output format |
| **Chain-of-Thought** | Step-by-step reasoning enforcement | Task, domain, reasoning steps, output, include examples |
| **Structured Output** | Consistent, formatted output templates | Task, input description, output fields, format |
| **Task Decomposition** | Breaking complex tasks into sub-tasks | Task, context, deliverables, quality criteria |
| **Guardrails & Safety** | Safety rules and output constraints | Role, task, allowed topics, forbidden topics, escalation |

**Workflow:**
1. Select a framework
2. Answer the guided questions (required fields are marked)
3. Click "Generate" to produce the prompt
4. Preview the result
5. Copy or save to My Library

---

### Tab 5: Tools

Three quality tools in a single tab — switch between them using sub-tabs.

#### Linter

Analyzes your prompt against 14 quality rules. Produces a score (0–100), letter grade (A–F), passing/failing rules, and prioritized suggestions.

- Paste any prompt into the text area
- Click "Lint" to analyze
- Results show ✅ passing rules and 💡 improvement suggestions
- Rules are sorted by impact (highest-weight failures first)

See [Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender) for the full rule list.

#### Optimizer

Rewrites your prompt using content-aware optimization. Two modes:

| Mode | How It Works | Requirements |
|------|-------------|-------------|
| **Instant** | Offline, rule-based optimization. Detects domain, removes filler, strengthens verbs, adds structure. | None |
| **AI-powered** | Sends prompt to GPT/Claude/Gemini for professional rewriting. | API key (set in ⚙ Settings) |

Shows before/after scores, all changes made, and detected domain.

#### Recommender

Describes what you need in natural language, and the Recommender suggests the best prompts from the library, including an optimal system prompt + framework + template combination.

- Type a description (e.g., "I need to write marketing emails")
- Click "Recommend"
- See top 8 matching prompts ranked by relevance
- Get a suggested combo (system prompt + framework + template)

---

### Tab 6: Playground

Send prompts directly to AI models and get responses — all within the browser.

**Supported Providers:**

| Provider | Default Model | Header |
|----------|--------------|--------|
| **OpenAI** | `gpt-4o-mini` | `Authorization: Bearer` |
| **Anthropic** | `claude-sonnet-4-20250514` | `x-api-key` |
| **Google** | `gemini-2.0-flash` | API key in URL |

**Features:**
- **Provider selector** — switch between OpenAI, Anthropic, and Google
- **System prompt field** — optional system prompt for context
- **Prompt input** — write or paste your prompt
- **Send button** — sends the prompt and displays the response
- **Token tracking** — shows input/output token usage per request
- **One-click copy** — copy the AI response
- **Response display** — formatted AI response with markdown rendering

API keys are stored in `localStorage` — they never leave your browser.

---

### Tab 7: My Library

Manage all your saved prompts, compositions, and custom prompts.

**Features:**
- **View saved items** — see all saved prompts with titles, dates, and types
- **Edit** — modify saved prompt content inline
- **Copy** — copy any saved prompt to clipboard
- **Delete** — remove individual items
- **Favorites** — mark prompts as favorites for quick access
- **Export** — export all saved data as a JSON file
- **Import** — import prompts from a JSON file
- **Floating 📚 button** — quick access to My Library from any tab

**Item types in My Library:**
- Filled templates (from Browse tab Quick Fill)
- Composed prompts (from Compose tab)
- Custom prompts (from Create tab)
- Generated prompts (from Generate tab)

Items saved from the database are marked with `source: 'database'` and can be edited without affecting the original prompt.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1` – `7` | Switch to tabs 1–7 (Browse, Compose, Create, Generate, Tools, Playground, My Library) |
| `Ctrl+K` | Focus the search bar |
| `H` | Toggle help overlay |
| `D` | Toggle dark/light mode |
| `Esc` | Clear search / close overlay |

---

## Beginner Mode

Click the **?** button to activate contextual help. This provides:
- Tooltips explaining each section
- Guided walkthroughs for first-time users
- Inline documentation for features

---

## API Settings

Click the **⚙** (gear) button to configure API keys for the Playground and AI-powered Optimizer.

**Settings fields:**
- **Provider** — OpenAI, Anthropic, or Google
- **OpenAI API Key** — your OpenAI API key
- **Anthropic API Key** — your Anthropic API key
- **Google API Key** — your Google AI API key
- **Model** — override the default model for each provider

All settings are stored in `localStorage` under the `api_settings` key. Keys never leave your browser.

---

## Resizable Sidebar

The prompt list sidebar can be resized by dragging its edge:
- **Minimum width:** 260px
- **Maximum width:** 600px
- Width is persisted in `localStorage` (`pl_sidebar_width` key)

---

## Dark/Light Mode

Toggle with the `D` key or the theme button. Preference is saved in `localStorage` (`pl_dark` key) and persists across sessions.

---

## Data Persistence (localStorage)

The Prompt Workshop stores all data in your browser's `localStorage`:

| Key | Type | Description |
|-----|------|-------------|
| `pl_dark` | `boolean` | Dark mode preference |
| `pl_saved` | `array` | All saved prompts, filled templates, composed prompts, custom prompts |
| `pl_sidebar_width` | `number` | Sidebar width in pixels (260–600) |
| `api_settings` | `object` | API keys and model preferences for Playground and AI Optimizer |

> **⚠️ Important:** Clearing your browser data/cookies will erase saved prompts. Use **My Library → Export all as JSON** to back up your data.

---

## Offline Usage

The Prompt Workshop works entirely offline. All 82+ prompts are embedded directly in the HTML file as JSON. No external resources are loaded.

The only features that require internet are:
- **AI Playground** — sends API calls to OpenAI/Anthropic/Google
- **AI-powered Optimizer** — sends API calls for AI rewriting

Everything else works without any network connection.

---

**Navigation:** [← CLI Reference](CLI-Reference) &nbsp;|&nbsp; [Prompting Techniques →](Prompting-Techniques)
