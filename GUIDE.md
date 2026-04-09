# Prompt Library — User Guide

A practical, non-technical guide to getting started with the diShine Prompt Library v2.4.0.

---

## Installation

You need **Node.js 18 or later**. Check your version:

```bash
node --version
```

Don't have Node.js? Download it from [nodejs.org](https://nodejs.org/) — grab the LTS version.

### Option 1: Clone and Run (no install needed)

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
node bin/prompt-lib.js --help
```

That's it. No `npm install`, no dependencies, nothing to set up.

### Option 2: Install Globally via npm

```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

This makes the `prompt-lib` command available system-wide.

### Option 3: Link for Development

If you cloned the repo and want the `prompt-lib` command available globally:

```bash
cd ai-prompt-library
npm link
prompt-lib --help
```

### Option 4: Browser Only (no Node.js needed)

If you don't want to use the CLI at all, just open `viewer.html` in any browser. That's the Prompt Workshop — a standalone file with everything built in. No server, no internet, no Node.js required.

### Option 5: Desktop App

Build native desktop apps for macOS, Linux, or Windows. This requires Node.js and Bash (Git Bash or WSL on Windows):

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh
```

Output goes to `dist/`. See the [Desktop Apps](#desktop-apps) section below for platform-specific install steps, or check [`desktop/README.md`](desktop/README.md) for detailed guides.

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

## Creating Custom Prompts

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

## Generating Prompts from Frameworks

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
| `api_settings` | API keys and model preferences for Playground and AI optimizer |

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
  All 82+ prompts are embedded in the file, so it works offline.
- **Option 2**: run `prompt-lib viewer` to generate a fresh version with any
  prompts you've added, and open it in your default browser automatically.
- **Option 3**: build and install as a desktop app — see [Desktop Apps](#desktop-apps)
  below or [`desktop/README.md`](desktop/README.md) for macOS, Linux, and Windows.

**Seven tabs:**

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

5. **Tools** -- Three sub-tools for prompt quality:

   - **Prompt Linter** — analyzes your prompt against 14 quality rules
     and gives a 0–100 score with letter grade (A–F). Checks for role
     definition, task clarity, output format, constraints, examples,
     and more. See [FUNCTIONS.md](FUNCTIONS.md#prompt-linter) for the
     full rule list.

   - **Prompt Optimizer** — rewrites your prompt with targeted, content-aware
     improvements. Detects your domain (coding, writing, marketing, data,
     business, education, image generation), replaces vague language,
     removes filler words, strengthens weak verbs, adds domain-specific
     role/constraints/output format, and decomposes compound tasks into
     numbered steps. Two modes: instant (offline, free) and AI-powered
     (uses your API key). See [FUNCTIONS.md](FUNCTIONS.md#prompt-optimizer)
     for the full pipeline.

   - **Smart Recommender** — describe what you need in plain English and
     get personalized prompt suggestions. Recommends the best system prompt
     + framework + template combination from the library.

6. **Playground** -- send prompts directly to AI models (OpenAI GPT,
   Anthropic Claude, Google Gemini). Add a system prompt, see the full
   response, track token usage, copy the result with one click. Iterate
   without leaving the tool. Requires an API key — click the ⚙ button
   to set one up. Keys are stored locally, never sent anywhere except
   the API provider.

7. **My Library** -- everything you've saved:
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

## Desktop Apps

The Prompt Workshop runs as a native application on macOS, Linux, and Windows — each with its own window, app icon, and keyboard shortcuts. No browser chrome, no terminal needed.

### Building

All desktop apps are built from source. You need Node.js 18+ and Bash (on Windows, use Git Bash or WSL).

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh    # Build for all platforms
```

Output goes to `dist/`. You can also build individually:

```bash
./desktop/build-macos.sh      # macOS (native on Mac, browser-wrapper on Linux)
./desktop/build-linux.sh      # Linux with .desktop integration
# Windows: use build-all.sh from Bash, or build-windows.bat on Windows
```

### Installing

| Platform | What you get | How to install |
|----------|-------------|----------------|
| **macOS** (built on Mac) | Native app with its own window (Swift + WebKit) | Move `dist/PromptWorkshop.app` to `/Applications/` |
| **macOS** (built on Linux) | Browser-wrapper `.app` | Move `dist/PromptWorkshop.app` to `/Applications/` |
| **Linux** | Native GTK app (own window) with fallback to browser | Extract `dist/prompt-workshop-linux.tar.gz` → run `install.sh` |
| **Windows** | Edge app mode (own window) | Extract `dist/PromptWorkshop-win.zip` → run `Install.bat` |
| **Android / iOS** | Browser PWA | Open `viewer.html` → "Add to Home Screen" |

The macOS native build requires a Mac with Xcode Command Line Tools (`xcode-select --install`). On Linux, the native window uses GTK + WebKitGTK (pre-installed on most Ubuntu/Fedora/Mint desktops).

For detailed step-by-step guides, troubleshooting, and platform-specific notes, see [`desktop/README.md`](desktop/README.md).

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

## Troubleshooting

Common issues and how to fix them.

### `node: command not found`

Node.js is not installed or not in your PATH. Install Node.js 18 or later from [nodejs.org](https://nodejs.org/) (grab the LTS version). After installation, restart your terminal.

```bash
node --version   # should print v18.x.x or later
```

### `SyntaxError: Cannot use import statement outside a module`

Your Node.js version is too old. This project uses ES modules, which require Node.js 18+. Check your version with `node --version` and upgrade if needed.

### `ERR_MODULE_NOT_FOUND` or `Cannot find module`

You are likely running the command from the wrong directory. Make sure you are in the repository root:

```bash
cd ai-prompt-library
node bin/prompt-lib.js list
```

If you installed globally with `npm install -g`, make sure the install completed without errors.

### Clipboard not working (Linux)

The CLI uses `xclip` or `xsel` for clipboard access on Linux. Install one of them:

```bash
# Ubuntu / Debian
sudo apt install xclip

# Fedora
sudo dnf install xclip

# Arch
sudo pacman -S xclip
```

If neither is available, the CLI will print the prompt text so you can copy it manually.

### `prompt-lib viewer` does not open the browser

The `viewer` command uses your system's default file opener (`open` on macOS, `xdg-open` on Linux, `start` on Windows). If it fails:

1. Check the terminal output for the file path (e.g., `/tmp/prompt-library-viewer.html`)
2. Open that file manually in any browser

On Linux, make sure `xdg-open` is installed (it comes with most desktop environments). On headless servers, there is no browser to open — download the file and open it on your local machine instead.

### Permission denied on `npm link`

On macOS and Linux, `npm link` may require elevated permissions:

```bash
sudo npm link
```

Or fix npm's default directory to avoid `sudo`:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
# Add ~/.npm-global/bin to your PATH in .bashrc / .zshrc
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Windows-specific notes

- **PowerShell** and **Command Prompt** both work for CLI commands.
- **Git Bash** or **WSL** (Windows Subsystem for Linux) are needed to run the desktop build scripts (`.sh` files).
- The `viewer` command opens the file in your default browser using `start`.
- Clipboard uses the built-in `clip` command — no extra tools needed.
- If you see path errors, make sure you are using forward slashes or the `path.join()` output provided by the tool.

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

## More Documentation

- **[README.md](README.md)** — overview, quick start, and CLI usage
- **[FUNCTIONS.md](FUNCTIONS.md)** — detailed reference for every tool (linter, optimizer, recommender, etc.)
- **[TECHNICAL.md](TECHNICAL.md)** — architecture, data formats, and extension guide
- **[CHANGELOG.md](CHANGELOG.md)** — version history
- **[desktop/README.md](desktop/README.md)** — desktop app build and install guides
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to contribute

---

Built with care by [diShine Digital Agency](https://dishine.it)
