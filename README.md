# prompt-library

**52 expert-level prompt templates with a CLI to search, browse, and use them.**

If you work with LLMs regularly, you've probably got prompts scattered across Notion docs, Slack messages, and random text files. This library collects the prompting techniques, system prompts, and templates we actually use in client work -- organized, searchable, and ready to copy-paste. It covers everything from Chain-of-Thought fundamentals to production system prompts for specific use cases like code review, SEO briefs, and data analysis.

There's a CLI so you can search and read prompts from your terminal, and you can also import the library programmatically if you're building something on top of it.

Zero npm dependencies. Just Node.js built-in modules.

Built by [diShine](https://dishine.it)

---

## What's in here

52 prompts across 7 categories:

| Category | Count | What's covered |
|----------|-------|----------------|
| **frameworks** | 9 | Chain-of-Thought, Few-Shot, ReAct, Tree-of-Thought, Role-Based, Meta-prompting, Constitutional AI, Prompt Chaining, Structured Extraction |
| **model-specific** | 6 | deep technique guides for Claude, GPT, Gemini, Llama, Mistral, plus a side-by-side comparison |
| **system-prompts** | 6 | production-ready system prompts for coding, writing, data analysis, research, executive advisor, support |
| **marketing** | 8 | SEO briefs, email campaigns, social calendars, competitor analysis, ad copy, brand voice, conversion copywriting, LinkedIn content |
| **development** | 8 | code review, API design, database schema, testing, refactoring, architecture decisions, prompt-as-code, debugging |
| **data** | 7 | SQL builder, data pipelines, dashboards, quality audits, statistics, visualization, ETL automation |
| **business** | 8 | proposals, meeting summaries, OKRs, stakeholder updates, risk assessment, pitch decks, client communication, competitive intelligence |

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

# Open the visual prompt browser in your default browser
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
| `category` | one of the 7 categories listed above |
| `tags` | searchable keywords |
| `difficulty` | `beginner`, `intermediate`, or `advanced` |
| `models` | which LLMs this technique works best with |

---

## Programmatic usage

```javascript
import { loadPrompts } from '@dishine/prompt-library';
import { searchPrompts } from '@dishine/prompt-library/src/search.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'code review');

console.log(results[0].title);   // "Code Review Prompt"
console.log(results[0].content); // full prompt content
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

---

## Project structure

```
ai-prompt-library/
  bin/prompt-lib.js        CLI entry point
  src/
    index.js               prompt loader with YAML frontmatter parser
    search.js              scored search (title/tag/category/content)
    formatter.js           ANSI terminal formatting
  prompts/
    frameworks/            core prompting techniques
    model-specific/        model-optimized patterns
    system-prompts/        production system prompts
    marketing/             marketing templates
    development/           development templates
    data/                  data & analytics templates
    business/              business templates
  viewer.html              standalone web viewer template
  test/run.js              test suite
```

---

## Requirements

- **Node.js** 18 or later
- No npm dependencies at all -- uses only Node.js built-in modules (`fs`, `path`, `url`, `readline`, `child_process`, `os`)

---

## License

MIT -- [diShine](https://dishine.it)
