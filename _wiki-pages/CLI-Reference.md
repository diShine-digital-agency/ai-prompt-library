# CLI Reference

> ⚠️ **Legacy — frozen at v2.4.0, no longer maintained.** The `prompt-lib` CLI documented here still works against the `prompts/` library, but receives no new features or bug fixes. For the maintained Prompt Workshop — with [Live Battle & Leaderboard](https://prompt.dishine.it/wiki/leaderboard), [private accounts & chat](https://prompt.dishine.it/wiki/accounts-and-chat), AI chat with files and memory, and many more models — use **[prompt.dishine.it](https://prompt.dishine.it/)**.

> Complete documentation for every `prompt-lib` command *(legacy, v2.4.0)*.

---

## Overview

The `prompt-lib` CLI is the legacy terminal interface to the AI Prompt Library. It provides commands for discovering, building, composing, linting, optimizing, and managing prompts — all with zero npm dependencies.

```
prompt-lib <command> [arguments]
```

**Global install:**
```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

**Local (no install):**
```bash
node bin/prompt-lib.js --help
```

---

## Command Reference

### `list` — List All Prompts

Lists all prompts grouped by category, showing slug, title, and difficulty level.

```bash
prompt-lib list
```

**Output:**
```
Prompt Library (82 prompts)

business (12)
  client-communication - Client Communication Template [intermediate]
  competitive-intelligence - Competitive Intelligence Brief [advanced]
  ...

data (10)
  dashboard-spec - Dashboard Specification [intermediate]
  ...
```

---

### `search <query>` — Search Prompts

Searches prompts by keyword across titles, tags, categories, and content. Results are ranked by relevance score.

```bash
prompt-lib search <query>
```

**Scoring system:**

| Match Location | Points per Term |
|---------------|:--------------:|
| Title | 100 |
| Tag | 50 |
| Category | 30 |
| Content | 10 |

Multi-word queries score each word independently. A prompt matching "code" and "review" in the title scores 200 points.

**Examples:**
```bash
prompt-lib search "chain of thought"
prompt-lib search "marketing email"
prompt-lib search "code review security"
prompt-lib search "claude xml"
prompt-lib search "data pipeline"
```

---

### `show <slug>` — Show Full Prompt

Displays the complete content of a prompt including metadata, template, tips, and examples.

```bash
prompt-lib show <slug>
```

**Example:**
```bash
prompt-lib show chain-of-thought
prompt-lib show code-review
prompt-lib show landing-page-copy
```

The output includes:
- Title, category, difficulty, tags, compatible models
- Full prompt content with all sections
- File path within the library

---

### `use <slug>` — Build a Prompt Interactively

Extracts the template section from a prompt, detects `{{placeholders}}`, and prompts you to fill each one. The completed prompt is copied to your clipboard.

```bash
prompt-lib use <slug>
```

**Example:**
```bash
prompt-lib use code-review
```

```
Building prompt: Code Review Checklist
3 field(s) to fill in

  programming language: Python
  code snippet: def calculate_total(items): return sum(i.price for i in items)
  focus area: security and performance

──────────────────────────────────────────────────────────
  YOUR PROMPT (ready to paste)
──────────────────────────────────────────────────────────

[Filled prompt content here]

  Copied to clipboard.
```

---

### `copy <slug>` — Copy Template to Clipboard

Extracts and copies the template section of a prompt directly to clipboard, without interactive filling.

```bash
prompt-lib copy <slug>
```

**Example:**
```bash
prompt-lib copy chain-of-thought
prompt-lib copy sql-query-builder
```

---

### `compose` — Combine Multiple Layers

Interactive command that lets you layer a **system prompt** + **framework** + **task template** into a single powerful prompt. Placeholders across all layers are filled interactively.

```bash
prompt-lib compose
```

**Workflow:**
1. Pick a system prompt (e.g., Coding Assistant, Research Assistant)
2. Pick a reasoning framework (e.g., Chain-of-Thought, Few-Shot Patterns)
3. Pick a domain template (e.g., Code Review, SQL Query Builder)
4. Fill any `{{placeholders}}` across all three layers
5. Get the composed prompt copied to clipboard
6. Optionally save the composition for later

**Example output:**
```
# SYSTEM PROMPT
You are a senior software engineer...

# REASONING FRAMEWORK
Think through this problem step by step...

# TASK TEMPLATE
Review the following code for...
```

Saved compositions go to `~/.prompt-library/saved-prompts.json`.

---

### `create` — Create a Custom Prompt

Interactive command to build a new system prompt with custom dynamic fields.

```bash
prompt-lib create
```

**Workflow:**
1. Enter a title, category, tags, difficulty, and target models
2. Define dynamic fields (become `{{field_name}}` placeholders)
3. Write the prompt body using your fields
4. Prompt is saved to `~/.prompt-library/custom-prompts.json`
5. Optionally fill and use it immediately

**Example:**
```
CREATE — build a new system prompt with custom fields

  Prompt title: Technical Blog Writer
  Category: custom
  Tags: blog, technical, writing
  Difficulty: intermediate

  Field name: topic
    Description: The topic of the blog post
  Field name: audience
    Description: Target audience level

  > Write a technical blog post about {{topic}} for {{audience}}...
```

Your custom prompts appear in `prompt-lib list` and `prompt-lib search` alongside built-in prompts.

---

### `generate` — Generate Prompt from Framework

Interactive command that guides you through creating a prompt using one of 5 built-in frameworks.

```bash
prompt-lib generate
```

**Available frameworks:**

| # | Framework | Description |
|---|-----------|-------------|
| 1 | **Expert Role-Based** | Creates prompts with expert persona, rules, and constraints |
| 2 | **Chain-of-Thought** | Enforces step-by-step reasoning |
| 3 | **Structured Output** | Produces consistent, formatted output |
| 4 | **Task Decomposition** | Breaks complex tasks into sub-tasks |
| 5 | **Guardrails & Safety** | Built-in safety rules and output constraints |

Each framework asks context-specific questions and generates a production-ready prompt. You can save the result as a custom prompt.

---

### `lint` — Analyze Prompt Quality

Analyzes any prompt against 14 quality rules, producing a score (0–100), letter grade (A–F), and prioritized suggestions.

```bash
prompt-lib lint
```

Paste your prompt (multi-line, end with two empty lines), and get:

```
LINT RESULTS

  Score: 72/100 (Grade: C)
  Rules: 10/14 passed | 89 words

  ✅ Passing:
     • Role definition
     • Clear task
     • Constraints or rules
     ...

  💡 Suggestions to improve:
     → Specify the output format: "Respond in [format]"
     → Add examples of expected input/output
     ...
```

See [Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender) for the full rule list and scoring details.

---

### `optimize` — Rewrite Prompt with Best Practices

Analyzes and rewrites your prompt using content-aware optimization. Works entirely offline.

```bash
prompt-lib optimize
```

The optimizer:
1. Detects the domain (coding, writing, marketing, data, business, education, image)
2. Removes filler words and excessive politeness
3. Strengthens weak verbs
4. Replaces vague language with specific terms
5. Adds domain-specific structure (role, constraints, output format)
6. Shows before/after scores and all changes made

```
Score: 35 → 88 (+53)
Changes made:
  • Removed filler words and redundant phrases
  • Replaced weak/hedging language with direct instructions
  • Added domain-specific role (coding)
  • Organized prompt into clear labeled sections
  • Added coding-specific output format
```

---

### `recommend <query>` — Smart Prompt Suggestions

Analyzes your use-case description and suggests the best prompts, including an optimal system prompt + framework + template combination.

```bash
prompt-lib recommend <query>
```

**Example:**
```bash
prompt-lib recommend "I need to write a landing page for a SaaS product"
```

```
RECOMMENDATIONS for: "I need to write a landing page for a SaaS product"

  Suggested combination:

    🧠 System prompt:  Content Writer (content-writer)
    🔧 Framework:      Few-Shot Patterns (few-shot-patterns)
    📝 Template:       Landing Page Copy (landing-page-copy)

  Top matching prompts:

    Landing Page Copy
      slug: landing-page-copy | category: marketing | score: 65
    ...
```

---

### `saved` — View Saved Compositions

Lists all saved compositions and custom prompts from `~/.prompt-library/`.

```bash
prompt-lib saved
```

---

### `viewer` — Open Prompt Workshop

Opens the Prompt Workshop (visual browser tool) with all prompts loaded.

```bash
prompt-lib viewer
```

The command injects current prompt data into `viewer.html` and opens it in your default browser.

---

### `categories` — List All Categories

Shows all prompt categories with their prompt counts.

```bash
prompt-lib categories
```

---

### `random` — Show a Random Prompt

Displays a random prompt from the library — great for inspiration.

```bash
prompt-lib random
```

---

### `stats` — Library Statistics

Shows comprehensive statistics: total prompts, categories, unique tags, models covered, difficulty distribution, and top tags.

```bash
prompt-lib stats
```

---

### `--help`, `-h` — Help

```bash
prompt-lib --help
```

### `--version`, `-v` — Version

```bash
prompt-lib --version
```

---

## Clipboard Support

The `copy`, `use`, and `compose` commands automatically copy results to your clipboard. Platform-specific tools used:

| Platform | Clipboard Tool | Notes |
|----------|---------------|-------|
| **macOS** | `pbcopy` | Built-in, always available |
| **Windows** | `clip` | Built-in, always available |
| **Linux** | `xclip` or `xsel` | Install with `sudo apt install xclip` |

If no clipboard tool is available, the CLI shows the prompt content and asks you to copy manually.

---

## Common Workflows

### Workflow 1: Quick Prompt Discovery

```bash
prompt-lib search "sql"          # Find SQL-related prompts
prompt-lib show sql-query-builder # Read the full prompt
prompt-lib use sql-query-builder  # Fill placeholders and copy
```

### Workflow 2: Build a Composed Prompt

```bash
prompt-lib compose               # Layer system + framework + template
# or for AI-powered suggestions:
prompt-lib recommend "build a REST API" # Get recommendations first
```

### Workflow 3: Quality Check Your Prompt

```bash
prompt-lib lint                  # Score your prompt
prompt-lib optimize              # Rewrite with best practices
```

### Workflow 4: Create and Reuse Custom Prompts

```bash
prompt-lib create                # Build a custom prompt
prompt-lib saved                 # View your saved prompts
prompt-lib use my-custom-prompt  # Use it anytime
```

---

## Environment Variables

| Variable | Effect |
|----------|--------|
| `NO_COLOR` | Disables ANSI color output when set to any value |

---

**Navigation:** [← Getting Started](Getting-Started) &nbsp;|&nbsp; [Prompt Workshop →](Prompt-Workshop)
