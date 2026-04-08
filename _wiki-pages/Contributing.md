# Contributing

> How to contribute prompts, code, and frameworks to the AI Prompt Library.

---

## Table of Contents

- [Adding New Prompts](#adding-new-prompts)
- [Prompt File Format](#prompt-file-format)
- [Categories](#categories)
- [Adding Generator Frameworks](#adding-generator-frameworks)
- [Adding CLI Commands](#adding-cli-commands)
- [Running Tests](#running-tests)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

---

## Adding New Prompts

The easiest way to contribute. Each prompt is a single Markdown file in the `prompts/` directory.

### Step-by-Step

1. **Choose the right category** — see [Categories](#categories) below
2. **Create the file** — `prompts/<category>/your-prompt-name.md`
3. **Add YAML frontmatter** — metadata at the top of the file
4. **Write the content** — follow the [Prompt File Format](#prompt-file-format)
5. **Run tests** — `node test/run.js` (all tests must pass)
6. **Open a pull request**

### Example: Creating a New Prompt

```bash
# 1. Create the file
touch prompts/development/api-testing.md

# 2. Write the content (see format below)

# 3. Run tests
node test/run.js

# 4. The CLI picks it up automatically — no registration step
node bin/prompt-lib.js show api-testing
```

---

## Prompt File Format

Every prompt file follows this structure:

```markdown
---
title: Your Prompt Title
category: development
tags: [api, testing, quality, automation]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Your Prompt Title

## When to Use

Describe when this technique or template is most useful.
Include specific scenarios and use cases. Also mention when
NOT to use it — this helps users make better decisions.

## The Technique

Detailed explanation of the approach, methodology, or framework.
Include the reasoning behind why this works and any theory.

## Template

\```
You are a {{role}} specializing in {{domain}}.

TASK:
{{task_description}}

RULES:
- Rule 1
- Rule 2
- {{custom_constraint}}

OUTPUT FORMAT:
Respond in {{format}} with clear sections.

Before responding, verify that your answer is complete and accurate.
\```

## Examples

### Example 1: [Scenario Name]

**Input:**
\```
[Example input with filled placeholders]
\```

**Expected Output:**
\```
[Example of what the AI should produce]
\```

### Example 2: [Another Scenario]
...

## Tips

- Practical tip from real usage experience
- Common adjustment that improves results
- Model-specific advice (e.g., "Claude works best with XML tags here")

## Common Mistakes

- ❌ Mistake 1 — why it's wrong and how to fix it
- ❌ Mistake 2 — the impact and the correct approach
- ❌ Mistake 3 — a subtle pitfall that's easy to miss
```

### Required Metadata Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Human-readable title | `API Testing Prompt` |
| `category` | string | Category directory name | `development` |
| `tags` | array | Searchable keywords | `[api, testing, automation]` |
| `difficulty` | string | `beginner`, `intermediate`, or `advanced` | `intermediate` |
| `models` | array | Compatible AI models | `[claude, gpt-4, gemini]` |

### Template Section Rules

- Put the template inside a fenced code block (` ``` `)
- Use `{{placeholder_name}}` for dynamic fields
- Use underscores or hyphens in placeholder names: `{{task_description}}`, `{{output-format}}`
- Placeholders are detected automatically by `findPlaceholders()` using the regex `/\{\{[\w_\-\s/]+\}\}/g`

---

## Categories

| Category | Directory | What Goes Here |
|----------|-----------|---------------|
| `frameworks` | `prompts/frameworks/` | Core prompting techniques (Chain-of-Thought, Few-Shot, ReAct, etc.) |
| `model-specific` | `prompts/model-specific/` | Techniques optimized for specific LLMs (Claude, GPT, Gemini) |
| `system-prompts` | `prompts/system-prompts/` | Production-ready system prompts (coding assistant, researcher, etc.) |
| `marketing` | `prompts/marketing/` | Marketing and content templates |
| `development` | `prompts/development/` | Software engineering templates |
| `data` | `prompts/data/` | Data analysis and engineering templates |
| `business` | `prompts/business/` | Business and professional templates |
| `image-generation` | `prompts/image-generation/` | AI image creation templates |

To create a **new category**, simply create a new subdirectory in `prompts/`. The CLI discovers categories automatically from the directory structure.

---

## Adding Generator Frameworks

Generator frameworks are defined in `src/generator.js` in the `FRAMEWORKS` object.

### How to Add a New Framework

Edit `src/generator.js` and add a new entry to `FRAMEWORKS`:

```javascript
'my-framework': {
  name: 'My Framework',
  description: 'What it does in one sentence',
  questions: [
    {
      key: 'field1',
      label: 'Question for the user',
      required: true
    },
    {
      key: 'field2',
      label: 'Optional question',
      required: false,
      default: 'default value'
    },
  ],
  generate: (answers) => {
    return `You are an expert in ${answers.field1}.

TASK:
${answers.field2}

RULES:
- Be specific and actionable
- Show your reasoning

OUTPUT FORMAT:
Structured markdown with clear sections`;
  }
}
```

### Framework Object Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Display name |
| `description` | string | ✅ | One-sentence description |
| `questions` | array | ✅ | Array of question objects |
| `generate` | function | ✅ | `(answers) → string` — generates the prompt |

### Question Object Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `key` | string | ✅ | Key used in the answers object |
| `label` | string | ✅ | Question text shown to the user |
| `required` | boolean | ✅ | Whether the field must be filled |
| `default` | string | ❌ | Default value if not provided |

The framework automatically appears in:
- CLI: `prompt-lib generate`
- Prompt Workshop: Generate tab

---

## Adding CLI Commands

CLI commands are defined in `bin/prompt-lib.js`.

### How to Add a New Command

1. **Add a case** to the `switch` statement in `main()`:

```javascript
case 'mycommand': {
  // Your command logic here
  const arg = args[1];
  // ...
  break;
}
```

2. **Add to the HELP string** at the top of the file:

```javascript
const HELP = `
  ...
  Commands:
    ...
    mycommand <arg>       Description of what it does
  ...
`;
```

3. **Add tests** if the command involves new modules

### Command Conventions

- Interactive commands use `readline` for user input
- Use `copyToClipboard(text)` for clipboard copy
- Use `formatPromptDetail()` etc. from `src/formatter.js` for output
- Respect `NO_COLOR` environment variable (handled by formatter.js)
- Exit with `process.exit(1)` on errors

---

## Running Tests

```bash
node test/run.js
```

The test suite (`test/run.js`) runs **46 tests** with zero dependencies. Tests verify:

| Test Area | What It Checks |
|-----------|---------------|
| **Prompt loading** | 82+ prompts loaded from files + custom prompts |
| **Required fields** | Every prompt has slug, title, category, tags, content |
| **Search** | Scoring and ranking correctness |
| **Categories** | Category count validation |
| **Custom prompts** | Creation and persistence |
| **Generator** | Framework validation, required field checking |
| **Linter** | Scoring accuracy, rule evaluation |
| **Optimizer** | Transformation correctness |
| **Recommender** | Scoring and combo building |

### Running Tests Before/After Changes

```bash
# Before changes — establish baseline
node test/run.js

# Make your changes...

# After changes — verify nothing is broken
node test/run.js
```

All tests must pass before submitting a pull request.

---

## Code Style Guidelines

### ESM Modules

The project uses **ES Modules** (ESM). Use `import`/`export` syntax:

```javascript
// ✅ Correct
import { readFileSync } from 'fs';
export function myFunction() { ... }

// ❌ Wrong
const fs = require('fs');
module.exports = { myFunction };
```

### Zero Dependencies Policy

**Do not add npm packages.** Use only Node.js built-in modules:

| Allowed | Not Allowed |
|---------|-------------|
| `fs`, `path`, `url` | `lodash`, `chalk`, `inquirer` |
| `readline`, `os` | `yargs`, `commander` |
| `child_process` | `clipboardy`, `open` |

This is a core design principle. The library works with a fresh Node.js install — no `npm install` needed.

### General Style

- Match the existing code style — look at nearby code for patterns
- Use `const` by default, `let` when reassignment is needed
- Use template literals for string interpolation
- Use descriptive variable names
- Comment only when the "why" isn't obvious from the code
- `viewer.html` is self-contained — all prompt data is embedded as JSON

---

## Pull Request Process

1. **Fork** the repository and create a branch from `main`
2. **Make your changes** — follow the guidelines above
3. **Run tests:** `node test/run.js` — all tests must pass
4. **Open a pull request** with a clear description of what you changed and why

### PR Guidelines

- **Keep PRs focused** — one feature or fix per PR
- **Describe the change** — what, why, and how to test it
- **Include examples** — if adding a prompt, show a sample use
- **Don't break existing behavior** — test CLI commands manually: `prompt-lib list`, `prompt-lib search`, etc.

---

## Bug Reports

Open an issue with:

- **What you expected** to happen
- **What actually happened**
- **Steps to reproduce**
- **Your environment:** Node.js version, OS, browser (for Workshop issues)

---

## Feature Requests

Open an issue describing:

- **What you want to do**
- **Why the current tools don't cover it**
- **How you'd expect it to work**

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/LICENSE).

---

**Navigation:** [← Desktop Apps](Desktop-Apps) &nbsp;|&nbsp; [Home](Home)
