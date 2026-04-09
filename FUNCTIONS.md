# Functions Reference

Every tool in the Prompt Library, explained: what it does, why you'd use it, and how it works under the hood.

This covers both the CLI commands and the Prompt Workshop (browser/desktop) tools. They use the same engines — the CLI calls the modules directly, the Workshop embeds them in the HTML.

> **New here?** Start with the [User Guide](GUIDE.md) for a walkthrough. This document goes deeper into each function.

---

## Table of Contents

- [Search](#search)
- [Prompt Linter](#prompt-linter)
- [Prompt Optimizer](#prompt-optimizer)
- [Smart Recommender](#smart-recommender)
- [Prompt Generator](#prompt-generator)
- [AI Playground](#ai-playground)
- [Compose](#compose)
- [Create](#create)
- [Prompt Loader & Persistence](#prompt-loader--persistence)

---

## Search

**CLI:** `prompt-lib search <query>`
**Workshop:** Search box in Browse tab (or press `Ctrl+K`)
**Source:** [`src/search.js`](src/search.js)

### What it does

Finds prompts by matching your query against titles, tags, categories, and content. Results are ranked by relevance — title matches rank highest, content matches lowest.

### Why it's useful

When you have 82+ prompts across 8 categories, you need a fast way to find the right one. The scoring system surfaces the most relevant prompts first, so you don't have to scroll through everything.

### How it works

The search splits your query into terms and scores each prompt:

| Match location | Points per term |
|---------------|----------------|
| Title | 100 |
| Tag | 50 |
| Category | 30 |
| Content | 10 |

Prompts with a score of 0 are excluded. The rest are sorted by score, highest first.

### Examples

```bash
prompt-lib search "chain of thought"
prompt-lib search "marketing email"
prompt-lib search "code review security"
prompt-lib search "claude xml"
```

Multi-word queries score each word independently. A prompt matching both "code" and "review" in the title scores 200 points — it'll appear above one that only matches "code".

---

## Prompt Linter

**CLI:** `prompt-lib lint`
**Workshop:** Tools tab → Linter
**Source:** [`src/linter.js`](src/linter.js)

### What it does

Analyzes any prompt against 14 quality rules and gives you a score from 0 to 100, a letter grade (A–F), and prioritized suggestions for improvement. **Auto-detects prompt type** (🎨 Image, 💻 Code, 🤖 System, 📝 General) and adjusts rule weights accordingly — image prompts skip irrelevant rules like "tone" and "audience", code prompts weight "constraints" and "output format" more heavily.

### Why it's useful

Writing good prompts is hard. The linter catches common mistakes before you waste tokens sending a poorly structured prompt to an AI model. It checks for things humans consistently forget: role definitions, output format, constraints, quality checks.

### How it works

Each rule has a **weight** (how important it is) and a **test** (regex pattern or word count check). The score is the percentage of weighted rules that pass.

#### The 14 rules

| Rule | Weight | What it checks |
|------|--------|---------------|
| **Role definition** | 10 | Does the prompt specify who the AI should be? ("You are a…", "Act as…") |
| **Clear task** | 12 | Is there an explicit task statement? ("Your task is to…", "Please create…") |
| **Context provided** | 8 | Does it include background information? ("Context:", "Given that…") |
| **Output format** | 10 | Is the expected format specified? ("Respond in…", "Use markdown/JSON/table") |
| **Constraints or rules** | 8 | Are there guardrails? ("Never…", "Always…", "Do not…") |
| **Sufficient detail** | 8 | Is it at least 50 words? Short prompts produce vague results. |
| **Not too long** | 5 | Is it under 2000 words? Very long prompts can confuse models. |
| **Examples included** | 7 | Does it include examples? ("For example…", "e.g.", "such as…") |
| **Structured sections** | 7 | Does it have headers or labeled sections? (2+ headers) |
| **Specific language** | 7 | Avoids vague words like "good", "nice", "proper" (≤3 occurrences) |
| **Target audience** | 5 | Specifies who will read the output ("for beginners", "for executives") |
| **Tone specified** | 5 | Defines communication style ("Be professional", "Use a casual tone") |
| **Not overly polite** | 3 | Uses "please" at most twice (excess politeness wastes tokens) |
| **Quality verification** | 5 | Asks the AI to check its work ("Before responding, verify that…") |

#### Scoring

```
score = (sum of passed rule weights / total weight) × 100
```

Total weight across all rules: 100 points.

| Grade | Score range |
|-------|-------------|
| A | 90–100 |
| B | 75–89 |
| C | 60–74 |
| D | 40–59 |
| F | 0–39 |

#### Output

The linter returns:
- Score and grade
- Which rules passed (✅)
- Prioritized suggestions for failed rules (💡), ordered by weight — fix the high-weight items first

### Example

```bash
$ prompt-lib lint

Paste your prompt (end with an empty line):
Write me something good about dogs

  Score: 12/100 (Grade: F)
  Rules: 2/14 passed | 6 words

  ✅ Passing:
     • Not excessively long
     • Not overly polite

  💡 Suggestions to improve:
     → State the task explicitly: "Your task is to…"
     → Add a role definition like "You are a senior [role] expert…"
     → Specify the output format: "Respond in [format]"
     → ...
```

---

## Prompt Optimizer

**CLI:** `prompt-lib optimize`
**Workshop:** Tools tab → Optimizer
**Source:** [`src/optimizer.js`](src/optimizer.js)

### What it does

Takes any prompt and rewrites it with targeted improvements. It doesn't just slap a generic template on top — it analyzes what your prompt is actually about and applies domain-specific optimizations.

Two modes:
- **Instant** (rule-based) — works offline, zero cost, no API key needed
- **AI-powered** — sends to your configured AI model for deeper rewriting

### Why it's useful

Most people's prompts are missing structure, use vague language, and lack constraints. The optimizer fixes all of that automatically. It's also content-aware: a coding prompt and a marketing prompt get completely different roles, constraints, output formats, and quality checks.

### How the instant optimizer works

The optimizer runs a pipeline of transformations, in this order:

#### 1. Domain detection

Scans the prompt for keywords and detects which of 7 domains it belongs to:

| Domain | Example keywords |
|--------|-----------------|
| **Coding** | code, programming, api, debug, refactor, python, react, docker |
| **Writing** | write, blog, article, copy, draft, publish, creative writing |
| **Marketing** | marketing, seo, campaign, ads, brand, landing page, conversion |
| **Data** | data, analysis, sql, dashboard, statistics, visualization, ML |
| **Business** | business, proposal, stakeholder, strategy, OKR, pitch, revenue |
| **Education** | teach, explain, tutor, learn, student, course, curriculum |
| **Image generation** | image, photo, design, logo, art, midjourney, dall-e, cinematic |

If no domain matches, it falls back to general-purpose optimization.

#### 2. Filler removal

Strips phrases that waste tokens without adding meaning:

- "basically", "essentially", "actually", "literally", "honestly"
- "obviously", "clearly", "simply put", "as you know"
- "I think", "I believe", "in my opinion"

#### 3. Excessive politeness reduction

Keeps at most one "please" — direct instructions work better with AI models.

#### 4. Weak verb strengthening

Removes hedging language and turns requests into direct instructions:

- "Can you write…" → "Write…"
- "I want you to create…" → "Create…"
- "Try to analyze…" → "Analyze…"
- "Maybe consider…" → "Consider…"
- "Just do…" → "Do…"

#### 5. Vague language replacement

Swaps imprecise words for specific alternatives:

- "a good approach" → "an effective, well-reasoned approach"
- "something nice" → "a polished, professional result"
- "proper" → "correct and following established standards"
- "stuff" → "components"
- "things" → "elements"
- "etc." → "and related items"

#### 6. Compound task decomposition

If the prompt contains 3+ action verbs ("write", "create", "analyze", etc.), it breaks the compound task into numbered steps.

#### 7. Domain-specific role generation

Instead of a generic "expert assistant", adds a role that matches the detected domain:

- Coding → "senior software engineer with deep expertise in software architecture and clean code practices"
- Marketing → "senior marketing strategist with expertise in digital marketing, brand positioning, and conversion optimization"
- Education → "experienced educator and subject matter expert skilled at breaking down complex concepts"

#### 8. Audience detection

Identifies the target audience from the text and adds tone guidance:

| Detected audience | Tone |
|------------------|------|
| Beginners | Approachable and jargon-free |
| Experts | Technical and detailed |
| Executives | Concise, strategic, and results-focused |
| Students | Clear, educational, and encouraging |
| Developers | Technical and precise |

#### 9. Domain-specific additions

Based on the detected domain, the optimizer adds:

- **Constraints** — quality rules relevant to the domain (e.g., "handle edge cases" for code, "cite data points" for analysis)
- **Output format** — suggests formats matching the task (e.g., code blocks for coding, tables for data analysis)
- **Example placeholders** — adds relevant example templates you can fill in
- **Quality checks** — adds verification steps tailored to the domain

#### Output

The optimizer returns:
- The optimized prompt
- A list of all changes made
- Before/after lint scores
- The detected domain and audience

### AI-powered mode

The AI-powered mode sends your prompt to an LLM (OpenAI, Anthropic, or Google) with instructions to restructure it following best practices while keeping the original intent.

This requires an API key configured in the Workshop's settings (⚙ button) or passed programmatically.

### Example

```bash
$ prompt-lib optimize

Paste your prompt (end with an empty line):
Can you please write me something good about our new product? Try to make it nice and professional. I think it should be good for our landing page.

Changes:
  • Removed filler words and redundant phrases for clarity
  • Replaced weak/hedging language with direct instructions
  • Replaced vague language with specific, measurable terms
  • Added domain-specific role (marketing)
  • Added marketing-specific output format
  • Added marketing-specific quality constraints

Score: 31 → 87 (+56 improvement)
```

---

## Smart Recommender

**CLI:** `prompt-lib recommend <query>`
**Workshop:** Tools tab → Recommender
**Source:** [`src/recommender.js`](src/recommender.js)

### What it does

Describe what you need in plain English, and it suggests the best prompts from the library for your use case. It doesn't just search — it understands your intent and recommends the optimal combination of system prompt + framework + template.

### Why it's useful

The library has 82+ prompts across 8 categories. Even with search, it's hard to know which ones to combine. The recommender analyzes your description, detects your intent, and suggests a ready-to-use combo.

### How it works

1. **Term matching** — scores each prompt by how many words from your description appear in its title (20 pts), tags (15 pts), category (10 pts), and content (3 pts)

2. **Intent detection** — maps your description to intent categories (coding, writing, marketing, data, business, image, research, teaching) using keyword lists. Prompts in matching categories get a bonus.

3. **Combo building** — from the scored results, picks the best:
   - **System prompt** — the top-scoring system prompt (sets the persona)
   - **Framework** — the top-scoring framework (reasoning technique)
   - **Template** — the top-scoring task template (the actual work)

### Output

The recommender returns:
- Top 8 matching prompts ranked by relevance
- A suggested combo (system prompt + framework + template)
- Top 3 system prompts, top 3 frameworks, top 5 templates

### Example

```bash
$ prompt-lib recommend "write marketing copy for a SaaS landing page"

  Suggested combo:
    System prompt: Content Writer
    Framework:     Expert Role-Based
    Template:      Landing Page Copy

  Top matches:
    1. landing-page-copy (score: 85) — Landing Page Copywriting
    2. product-description (score: 62) — Product Description Generator
    3. conversion-copywriting (score: 58) — Conversion Copywriting
    ...
```

---

## Prompt Generator

**CLI:** `prompt-lib generate`
**Workshop:** Generate tab
**Source:** [`src/generator.js`](src/generator.js)

### What it does

Pick a proven prompt engineering framework, answer guided questions about your use case, and get a production-ready system prompt generated automatically. No prompt engineering experience needed.

### Why it's useful

Writing system prompts from scratch is time-consuming and error-prone. The generator gives you a battle-tested structure — you just fill in the specifics. The generated prompt includes role definition, task description, constraints, output format, and quality checks.

### Available frameworks

| Framework | What it creates | Key questions |
|-----------|----------------|---------------|
| **Expert Role-Based** | Expert persona with rules, constraints, output format | Role, domain, task, audience, tone |
| **Chain-of-Thought** | Step-by-step reasoning enforcer | Task, domain, reasoning steps, output format |
| **Structured Output** | Consistent, formatted output producer | Task, input description, output fields, format |
| **Task Decomposition** | Complex task breaker-downer | Task, context, deliverables, quality criteria |
| **Guardrails & Safety** | Safety-first prompt with topic boundaries | Role, task, allowed topics, forbidden topics, escalation rules |

### How it works

Each framework defines:
1. **Questions** — what it needs to know (some required, some optional with defaults)
2. **Generator function** — takes your answers and produces a structured prompt

The generated prompt is a complete system prompt you can use directly with any AI model. You can also save it to your library for reuse.

### Example

```bash
$ prompt-lib generate

  1. Expert Role-Based
  2. Chain-of-Thought
  3. Structured Output
  4. Task Decomposition
  5. Guardrails & Safety

  Pick a framework: 1

  Expert role: senior data analyst
  Domain: business intelligence
  Primary task: Build SQL queries from natural language descriptions
  ...

  ── GENERATED PROMPT ──
  You are a senior data analyst with 10+ years of experience...
```

---

## AI Playground

**Workshop only:** Playground tab
**Source:** [`src/optimizer.js`](src/optimizer.js) → `sendToAI()` function

The Playground is available only in the browser/desktop Prompt Workshop, not in the CLI.

### What it does

Send prompts directly to AI models and see responses in real time. Supports system prompts, tracks token usage, and lets you iterate without leaving the tool.

### Why it's useful

Instead of switching between the library and ChatGPT/Claude/Gemini, you can test prompts right where you build them. The workflow is: browse a prompt → copy it → switch to Playground → send it → see the response → tweak and resend.

### Supported providers

| Provider | Models | Auth |
|----------|--------|------|
| **OpenAI** | GPT-4o-mini (default), any OpenAI model | API key |
| **Anthropic** | Claude Sonnet (default), any Claude model | API key |
| **Google** | Gemini 2.0 Flash (default), any Gemini model | API key |

### How to set up

1. Click the **⚙** button in the Workshop toolbar
2. Enter your API key for your preferred provider
3. Choose the provider and model
4. Keys are stored in your browser's `localStorage` — never sent anywhere except the API provider

### What you can do

- Type or paste a prompt and send it
- Add an optional system prompt (role/instructions)
- See the full response with formatting
- Track token usage (input/output tokens, where supported)
- Copy the response with one click
- Switch between providers without losing your prompt
- **⚖ Multi-Model Compare** — configure 2+ API keys, then click "Compare" to send the same prompt to all providers simultaneously. Results appear side-by-side in a grid with per-model response time, token usage, and copy buttons. Great for finding which model handles your use case best.

### How it works

The Playground calls the provider's API directly from your browser using `fetch()`. The request goes straight from your browser to the API endpoint — no intermediary server.

---

## Compose

**CLI:** `prompt-lib compose`
**Workshop:** Compose tab

### What it does

Builds a layered prompt by combining up to three pieces:
1. **System prompt** (optional) — sets the persona and behavioral rules
2. **Reasoning framework** (optional) — adds a technique like Chain-of-Thought
3. **Task template** — the actual task template (marketing, dev, data, etc.)

All three are combined into a single prompt, placeholders are filled in interactively, and the result is ready to use.

### Why it's useful

Individual prompts are good. Combined prompts are better. A system prompt tells the AI *who* to be, a framework tells it *how* to think, and a template tells it *what* to do. Compose lets you stack all three without manually copy-pasting.

### How it works

1. Pick a system prompt from the library (or skip)
2. Pick a reasoning framework (or skip)
3. Pick a task template
4. The three pieces are joined with clear section separators
5. All `{{placeholders}}` across all three are collected
6. You fill in each placeholder interactively
7. The final prompt is copied to clipboard and optionally saved to your library

---

## Create

**CLI:** `prompt-lib create`
**Workshop:** Create tab

### What it does

Build a custom system prompt with dynamic `{{field_name}}` placeholders. Define fields with descriptions, write the prompt body, and save it to your personal library.

### Why it's useful

The built-in library covers common use cases, but you probably have specific prompts for your work. Create lets you build and save them with the same structure and field system as built-in prompts.

### How it works

1. Enter metadata: title, category, tags, difficulty, supported models
2. Define dynamic fields: each field has a name and description
3. Write the prompt body using your `{{field_name}}` placeholders
4. Preview the final prompt
5. Save to your personal library

**CLI storage:** `~/.prompt-library/custom-prompts.json`
**Browser storage:** `localStorage` key `pl_custom_prompts`

Custom prompts appear alongside built-in prompts in Browse, Search, and List.

---

## Prompt Loader & Persistence

**Source:** [`src/index.js`](src/index.js)

### What it does

Loads all built-in prompts from the `prompts/` directory, merges them with your custom prompts, and handles saving/loading user data.

### Exported functions

| Function | Description |
|----------|-------------|
| `loadPrompts()` | Loads all prompts from `prompts/` + custom prompts from `~/.prompt-library/custom-prompts.json` |
| `loadCustomPrompts()` | Loads only user-created custom prompts |
| `saveCustomPrompt(prompt)` | Saves a custom prompt (overwrites if slug exists) |
| `loadSavedCompositions()` | Loads saved compositions from `~/.prompt-library/saved-prompts.json` |
| `saveComposition(composition)` | Appends a composition with auto-generated `id` and `date` |
| `findPlaceholders(text)` | Extracts unique `{{placeholder}}` tokens from text |
| `extractTemplate(content)` | Extracts the code block from a `## Template` section |

### Prompt file format

Every prompt is a Markdown file with YAML frontmatter:

```markdown
---
title: Chain-of-Thought Prompting
category: frameworks
tags: [reasoning, step-by-step, problem-solving]
difficulty: intermediate
models: [claude, gpt-4, gemini, llama, mistral]
---

# Chain-of-Thought Prompting

## When to Use
...

## Template
\```
Your prompt with {{placeholders}}
\```
```

The loader parses the frontmatter, extracts metadata, and uses the filename as the slug.

### Storage locations

| What | CLI | Browser/Desktop |
|------|-----|----------------|
| Built-in prompts | `prompts/` directory | Embedded as JSON in `viewer.html` |
| Custom prompts | `~/.prompt-library/custom-prompts.json` | `localStorage` key `pl_custom_prompts` |
| Saved compositions | `~/.prompt-library/saved-prompts.json` | `localStorage` key `pl_saved` |
| Preferences | — | `localStorage` keys `pl_dark`, `pl_sidebar_width` |
| API keys | — | `localStorage` key `api_settings` |

---

## See also

- **[README.md](README.md)** — overview, quick start, and CLI usage
- **[GUIDE.md](GUIDE.md)** — step-by-step user guide
- **[TECHNICAL.md](TECHNICAL.md)** — architecture, data formats, and extension guide
- **[CHANGELOG.md](CHANGELOG.md)** — version history
- **[desktop/README.md](desktop/README.md)** — desktop app installation for macOS, Linux, Windows
