# Prompt Library -- User Guide

A practical, non-technical guide to getting started with the diShine Prompt Library v2.0.

---

## Installation

### Option 1: Run Directly (No Installation)

If you already have the repository cloned or downloaded, you can run the CLI directly:

```bash
cd ai-prompt-library
node bin/prompt-lib.js --help
```

Requirements: Node.js version 18 or later. Check your version:

```bash
node --version
```

### Option 2: Install Globally via npm

```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

This makes the `prompt-lib` command available system-wide.

### Option 3: Link for Development

```bash
cd ai-prompt-library
npm link
prompt-lib --help
```

---

## Browsing the Library

### List All Prompts

```bash
prompt-lib list
```

This shows all prompts organized by category. Each entry shows the slug
(the name you use to reference it), the title, and the difficulty level.
Custom prompts you've created also appear here.

### View Categories

```bash
prompt-lib categories
```

This shows a table of all categories with the number of prompts in each one.

### Get Library Statistics

```bash
prompt-lib stats
```

Shows total prompts, categories, tags, models covered, and breakdowns by
difficulty level and most-used tags.

---

## Searching for Prompts

The search command finds prompts by matching your query against titles, tags,
categories, and content. Results are ranked by relevance.

```bash
# Search by topic
prompt-lib search "email marketing"

# Search by technique
prompt-lib search "chain of thought"

# Search by use case
prompt-lib search "code review security"

# Search by model
prompt-lib search "claude xml"
```

The scoring system:
- Title match: 100 points (strongest signal)
- Tag match: 50 points
- Category match: 30 points
- Content match: 10 points

---

## Reading a Prompt

Once you find a prompt you want to read, use the `show` command with its slug:

```bash
prompt-lib show chain-of-thought
prompt-lib show code-review
prompt-lib show email-campaign
```

This displays the full prompt content including metadata (category, difficulty,
tags, supported models) and all sections.

### Get a Random Prompt

For inspiration or learning, show a random prompt:

```bash
prompt-lib random
```

---

## Using Prompts in Practice

### The quick way: `use` command

The `use` command walks you through filling in a prompt interactively:

```bash
prompt-lib use email-campaign
```

It finds all `{{placeholders}}` in the template, asks you for each value,
renders the final prompt, and copies it to your clipboard. No manual
find-and-replace needed.

### Copy a template directly

If you just want the raw template on your clipboard:

```bash
prompt-lib copy chain-of-thought
```

This extracts the Template section and copies it. You can then paste it
into any editor and fill in the placeholders yourself.

### Compose: combine multiple prompts

The `compose` command lets you build a composite prompt from three layers:

```bash
prompt-lib compose
```

It walks you through:
1. Picking a system prompt (optional) -- sets the persona and behavioral rules
2. Picking a reasoning framework (optional) -- adds a technique like Chain-of-Thought
3. Picking a domain template -- the actual task template (marketing, dev, data, etc.)

The three pieces get combined into a single prompt, placeholders are filled
in interactively, and the result is copied to clipboard. You can also save
the composed prompt for later use.

---

## Creating Custom Prompts (New in v2.0)

### CLI: `create` command

Build a custom system prompt with dynamic fields:

```bash
prompt-lib create
```

You'll be guided through:
1. **Metadata** — title, category, tags, difficulty, models
2. **Dynamic fields** — define {{field_name}} placeholders with descriptions
3. **Prompt body** — write the prompt using your fields
4. **Save** — stored in `~/.prompt-library/custom-prompts.json`

Custom prompts appear in `prompt-lib list`, `prompt-lib search`, and can be
used with `prompt-lib use <slug>`.

#### Example workflow

```
$ prompt-lib create

  Title: Sales Objection Handler
  Category: sales
  Tags: sales, objections, responses
  Difficulty: intermediate
  Models: claude, gpt-4, gemini

  Field name: objection
    Description: The specific objection raised by the prospect
  Field name: product
    Description: Your product or service name
  Field name: value_prop
    Description: Key value proposition to emphasize

  > You are a sales expert. A prospect has raised this objection:
  > "{{objection}}"
  >
  > Product: {{product}}
  > Key value: {{value_prop}}
  >
  > Provide 3 response strategies...
```

### HTML: Create tab

The Prompt Workshop includes a **Create** tab with:
- Form fields for all metadata
- Interactive field builder (add/remove fields with descriptions)
- Live preview showing how the prompt looks with fields highlighted
- Save button that adds the prompt to your local library

---

## Generating Prompts from Frameworks (New in v2.0)

### CLI: `generate` command

Choose a proven framework, answer guided questions, and get a complete prompt:

```bash
prompt-lib generate
```

Available frameworks:

| Framework | What it creates |
|-----------|----------------|
| **Expert Role-Based** | Expert persona with rules, constraints, output format |
| **Chain-of-Thought** | Step-by-step reasoning enforcer |
| **Structured Output** | Consistent, formatted output producer |
| **Task Decomposition** | Complex task breaker-downer |
| **Guardrails & Safety** | Safety-first prompt with topic boundaries |

#### Example

```
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

### HTML: Generate tab

The Prompt Workshop includes a **Generate** tab with:
- Visual framework selector with descriptions
- Dynamic question forms based on the selected framework
- One-click generation with instant preview
- Save to library or download as `.md`

---

## Persistence and Data Storage

### CLI storage

All custom data is stored in `~/.prompt-library/`:

| File | Contents |
|------|----------|
| `custom-prompts.json` | Your created prompts with fields and metadata |
| `saved-prompts.json` | Saved compositions and generated prompts |

### HTML storage

The Prompt Workshop stores everything in browser localStorage:

| Key | Contents |
|-----|----------|
| `pl_saved` | Favorites, filled prompts, composed prompts, custom prompts |
| `pl_custom_prompts` | Custom prompts created in the Create tab |
| `pl_dark` | Dark mode preference |
| `pl_sidebar_width` | Sidebar width preference (260–600px) |

You can export your library as JSON and import it on another device.

### View saved items

```bash
prompt-lib saved
```

Shows all your saved compositions and custom prompts.

---

## Prompt Workshop (viewer.html)

The Prompt Workshop is a full interactive web app that turns the library into
something genuinely useful -- not just a reader, but a builder.

**How to open it:**

- **Option 1**: open `viewer.html` from the repo directly in any browser.
  All 52+ prompts are embedded in the file, so it works offline.
- **Option 2**: run `prompt-lib viewer` to generate a fresh version with any
  prompts you've added, and open it in your default browser automatically.

**Five tabs:**

1. **Browse** -- the default. Shows all prompts in a searchable sidebar with
   filters for category, difficulty, and model family. Click a prompt to read it.
   Each prompt has Build, Copy, Save, and Export actions.

2. **Compose** -- the layered prompt builder. Pick up to three layers:
   a system prompt, a reasoning framework, and a task template.
   Fill in placeholders and save or copy the result.

3. **Create** -- build custom system prompts with dynamic fields.
   Define {{field_name}} placeholders, write the prompt body with a live
   preview, and save to your library.

4. **Generate** -- choose a framework, answer guided questions, and get
   a production-ready prompt generated automatically. Save it as a custom
   prompt for reuse.

5. **My Library** -- everything you've saved:
   - **Favorites** -- prompts you bookmarked from Browse (saved as editable copies)
   - **Filled prompts** -- prompts you built with the Workshop
   - **Composed prompts** -- multi-layer prompts from the Compose tab
   - **Custom prompts** -- prompts you created or generated

   Each saved prompt has **Edit**, **Copy**, and **Delete** buttons.
   When you edit a saved prompt, your changes only affect the saved copy —
   the original built-in prompt remains unchanged.

   Export your library as JSON, import on another device, or download
   individual saved prompts as `.md`.

   A **floating 📚 button** in the bottom-right corner gives you quick
   access to My Library from any tab, with a badge showing saved item count.

**Other features:**

- **Resizable sidebar** — drag the right edge to adjust width (260–600px),
  remembered across sessions
- dark/light mode toggle (remembered across sessions)
- full markdown rendering with tables, code blocks, and blockquotes
- responsive -- works on phones and tablets
- single HTML file, no dependencies, no server, no tracking

### The manual way

If you prefer to do it step by step:

#### Step 1: Find the right prompt

Use `search` or `list` to find a prompt that matches your task.

#### Step 2: Read the template

Every prompt contains a **Template** section with `{{placeholders}}` that
you fill in with your specific details.

#### Step 3: Fill in placeholders

Replace `{{placeholders}}` with your actual content. For example:

Template:
```
Create an email campaign for:
Product: {{product}}
Audience: {{audience}}
Goal: {{goal}}
```

Your version:
```
Create an email campaign for:
Product: CloudMetrics analytics platform
Audience: Marketing directors at mid-size B2B companies
Goal: Drive free trial signups
```

#### Step 4: Paste into your preferred model

Copy the filled-in prompt and paste it into Claude, ChatGPT, Gemini, or
whichever model the prompt supports.

#### Step 5: Iterate

Use the **Tips** and **Common Mistakes** sections to refine your results.

---

## Understanding the Categories

### Frameworks

Core prompting techniques that work across all models and use cases:

- **Chain-of-Thought**: Step-by-step reasoning for math, logic, debugging
- **Few-Shot Patterns**: Teaching by example for consistent formatting
- **ReAct Agent**: Reasoning + acting loops for tool-using agents
- **Tree-of-Thought**: Multi-path reasoning for complex problems
- **Role-Based Prompting**: Expert personas for domain-specific tasks
- **Meta-Prompting**: Using prompts to generate better prompts

### Model-Specific

Techniques optimized for specific language models:

- **Claude**: XML tags, extended thinking, 200K context
- **GPT**: JSON mode, structured outputs, function calling
- **Gemini**: Multimodal, Google Search grounding, 1M context
- **Llama**: Open-weight formats, quantization-aware tips
- **Mistral**: Code generation, guardrails, fast inference
- **Comparison**: Decision guide for choosing the right model

### System Prompts

Production-ready system prompts for building applications:

- **Coding Assistant**: Security-aware development helper
- **Content Writer**: SEO-optimized writing with tone control
- **Data Analyst**: SQL, statistics, and business intelligence
- **Research Assistant**: Source evaluation and evidence synthesis
- **Executive Advisor**: Strategic frameworks and C-suite communication
- **Customer Support**: Empathy guidelines and escalation criteria

### Marketing

Templates for common marketing workflows:

- **SEO Content Brief**: Keyword-driven content planning
- **Email Campaign**: Multi-email sequences with A/B variants
- **Social Media Calendar**: Platform-specific content scheduling
- **Competitor Analysis**: Market positioning and strategic recommendations
- **Ad Copy Generator**: Platform-compliant advertising copy
- **Brand Voice Guide**: Consistent brand communication standards

### Development

Templates for software engineering tasks:

- **Code Review**: Multi-lens review with severity classification
- **API Design**: RESTful API specification and documentation
- **Database Schema**: Normalized schema with indexing strategy
- **Test Generation**: Comprehensive test suites with edge cases
- **Refactoring**: Code smell identification and design patterns
- **Architecture Decision**: ADR documentation format

### Data

Templates for data analysis and engineering:

- **SQL Query Builder**: Natural language to optimized SQL
- **Data Pipeline**: ETL/ELT design with error handling
- **Dashboard Spec**: KPI definitions and visualization layout
- **Data Quality Audit**: Five-dimension quality assessment
- **Statistical Analysis**: Hypothesis testing and interpretation
- **Visualization Spec**: Chart selection and design principles

### Business

Templates for professional communication and planning:

- **Proposal Generator**: Scoped proposals with MoSCoW methodology
- **Meeting Summary**: Decisions, actions, and follow-ups
- **OKR Generator**: Measurable objectives and key results
- **Stakeholder Update**: Traffic-light status reports
- **Risk Assessment**: Risk registers with mitigation plans
- **Pitch Deck Outline**: Investor-ready presentation structure

---

## Model Tips by Task

| Task | Best Model(s) | Why |
|------|--------------|-----|
| Complex writing | Claude | Superior instruction following and nuance |
| Structured data | GPT-4o | Native JSON mode and structured outputs |
| Image analysis | Gemini, GPT-4o | Strong multimodal capabilities |
| Code generation | Claude, Mistral | Excellent code quality and speed |
| Long documents | Gemini | 1M token context window |
| Privacy-sensitive | Llama | Self-hosted, data stays on-premise |
| High volume | Mistral | Fast inference, cost-efficient |

---

## Contributing New Prompts

1. Create a new `.md` file in the appropriate `prompts/` subdirectory
2. Use this frontmatter template:

```yaml
---
title: Your Prompt Title
category: frameworks
tags: [tag1, tag2, tag3]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---
```

3. Include these sections in the content:
   - When to Use (and when NOT to use)
   - The Technique (detailed explanation)
   - Template (with `{{placeholders}}`)
   - Examples (real-world usage)
   - Tips (5-6 expert recommendations)
   - Common Mistakes (5 pitfalls to avoid)

4. Run the tests to verify your prompt loads correctly:

```bash
node test/run.js
```

---

## FAQ

**Q: Do I need an internet connection?**
No. The library runs entirely offline. All prompt content is included in the package.

**Q: Can I use these prompts commercially?**
Yes. The library is MIT licensed. Use the prompts in any project.

**Q: How do I update the library?**
Pull the latest version from the repository or run `npm update -g @dishine/prompt-library`.

**Q: Why are there no dependencies?**
Zero dependencies means no security vulnerabilities from third-party packages,
no version conflicts, and instant installation.

**Q: Can I add prompts in other languages?**
Yes. The frontmatter format and file structure work with any language. Add a
`language` field to the frontmatter if you want to track it.

---

Built with care by [diShine Digital Agency](https://dishine.it)
