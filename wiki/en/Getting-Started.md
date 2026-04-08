# Getting Started

> Installation, setup, and your first steps with the AI Prompt Library.

---

## System Requirements

| Requirement | Details |
|-------------|---------|
| **Node.js** | 18 or later (for CLI and desktop builds) |
| **npm dependencies** | **None** — zero external packages |
| **Browser** | Any modern browser (for Prompt Workshop) |
| **Disk space** | ~2 MB (the entire library) |

> **Don't have Node.js?** Download it from [nodejs.org](https://nodejs.org/) — grab the LTS version. Or skip Node entirely and use the [browser-only option](#option-4-browser-only-no-nodejs-needed).

---

## Installation Options

### Option 1: Clone and Run (No Install Needed)

The fastest way to start. Clone the repository and run the CLI directly:

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
node bin/prompt-lib.js --help
```

That's it. No `npm install`, no dependencies, nothing to set up.

### Option 2: Install Globally via npm

Install once and use the `prompt-lib` command from anywhere:

```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

This registers the `prompt-lib` command system-wide.

### Option 3: Link for Development

If you cloned the repo and want the `prompt-lib` command available globally while you work on the code:

```bash
cd ai-prompt-library
npm link
prompt-lib --help
```

Changes to source files take effect immediately — no rebuild needed.

### Option 4: Browser Only (No Node.js Needed)

Just open `viewer.html` in any browser. That's the **Prompt Workshop** — a standalone file with everything built in:

- No server required
- No internet required
- No Node.js required
- All 82+ prompts embedded in the file

Simply double-click `viewer.html` or drag it into your browser.

### Option 5: Desktop App (Build from Source)

Build native desktop apps for macOS, Linux, or Windows:

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh
```

Output goes to `dist/`. See the [Desktop Apps](Desktop-Apps.md) page for platform-specific guides.

| Platform | Build Script | Requirements |
|----------|-------------|--------------|
| macOS | `./desktop/build-macos.sh` | Xcode CLI Tools for native app |
| Linux | `./desktop/build-linux.sh` | Python 3, GTK, WebKitGTK |
| Windows | `./desktop/build-all.sh` | Git Bash or WSL |
| All | `./desktop/build-all.sh` | Node.js 18+, Bash |

---

## First Commands to Try

Once installed, try these commands to explore the library:

```bash
# List all 82+ prompts grouped by category
prompt-lib list

# Search for prompts by keyword
prompt-lib search "chain of thought"

# Show full details of a specific prompt
prompt-lib show chain-of-thought

# See all categories with counts
prompt-lib categories

# Get library statistics
prompt-lib stats

# Show a random prompt for inspiration
prompt-lib random
```

---

## Opening the Prompt Workshop

The Prompt Workshop is a browser-based visual tool with 7 tabs. Open it from the CLI:

```bash
prompt-lib viewer
```

Or open `viewer.html` directly in any browser — no server needed.

The Workshop provides everything the CLI does, plus:
- Visual search and filtering
- AI Playground (send prompts to GPT/Claude/Gemini)
- Dark/light mode
- My Library (save, edit, export/import prompts)
- Keyboard shortcuts

---

## Quick Tutorial: Finding and Using a Prompt

### Step 1: Find a Prompt

```bash
prompt-lib search "code review"
```

Output shows matching prompts ranked by relevance:

```
Search results for "code review" (3 found)

  code-review (score: 200)
    Code Review Checklist [intermediate] in development
    tags: code-review, quality, checklist

  code-refactoring-review (score: 110)
    Code Refactoring Review [intermediate] in development
    tags: refactoring, review, patterns
```

### Step 2: View the Full Prompt

```bash
prompt-lib show code-review
```

This displays the complete prompt content including the template, tips, and examples.

### Step 3: Build It Interactively

```bash
prompt-lib use code-review
```

The CLI detects `{{placeholders}}` in the template and asks you to fill each one:

```
Building prompt: Code Review Checklist
3 field(s) to fill in

  programming language: Python
  code snippet: def calculate_total(items): ...
  focus area: security and error handling
```

The filled prompt is automatically copied to your clipboard — ready to paste into any AI model.

### Step 4: Compose a Multi-Layer Prompt

```bash
prompt-lib compose
```

This lets you combine:
1. **System prompt** (persona and rules) — e.g., "Coding Assistant"
2. **Framework** (reasoning technique) — e.g., "Chain-of-Thought"
3. **Task template** (domain-specific) — e.g., "Code Review"

The result is a powerful layered prompt that outperforms any single template.

---

## What's Next?

| Want to... | Go to... |
|-----------|----------|
| Learn all CLI commands | [CLI Reference](CLI-Reference.md) |
| Explore the browser tool | [Prompt Workshop](Prompt-Workshop.md) |
| Master prompting techniques | [Prompting Techniques](Prompting-Techniques.md) |
| Compare AI models | [AI Models Guide](AI-Models-Guide.md) |
| Use the quality tools | [Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender.md) |
| Build desktop apps | [Desktop Apps](Desktop-Apps.md) |
| Contribute | [Contributing](Contributing.md) |

---

**Navigation:** [← Home](Home.md) &nbsp;|&nbsp; [CLI Reference →](CLI-Reference.md)
