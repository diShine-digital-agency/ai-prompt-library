# Prompt Library

**Expert prompt engineering library with CLI search** -- frameworks, system prompts, model-specific techniques, and production-ready templates for professionals.

Built by [diShine Digital Agency](https://dishine.it)

---

## What's Inside

42 expert-level prompt guides organized across 7 categories:

| Category | Count | Description |
|----------|-------|-------------|
| **frameworks** | 6 | Core prompting techniques (CoT, Few-Shot, ReAct, ToT, Role-Based, Meta) |
| **model-specific** | 6 | Optimized patterns for Claude, GPT, Gemini, Llama, Mistral + comparison |
| **system-prompts** | 6 | Production-ready system prompts (coding, writing, data, research, exec, support) |
| **marketing** | 6 | SEO briefs, email campaigns, social calendars, competitor analysis, ads, brand voice |
| **development** | 6 | Code review, API design, DB schema, testing, refactoring, architecture decisions |
| **data** | 6 | SQL builder, pipelines, dashboards, quality audits, statistics, visualization |
| **business** | 6 | Proposals, meeting summaries, OKRs, stakeholder updates, risk, pitch decks |

## Quick Start

```bash
# Clone and run directly
node bin/prompt-lib.js list

# Or install globally
npm install -g @dishine/prompt-library
prompt-lib list
```

## CLI Usage

```bash
# List all prompts grouped by category
prompt-lib list

# Search prompts by keyword
prompt-lib search "chain of thought"
prompt-lib search "marketing email"

# Show full prompt content
prompt-lib show chain-of-thought
prompt-lib show code-review

# List all categories with counts
prompt-lib categories

# Show a random prompt for inspiration
prompt-lib random

# Show library statistics
prompt-lib stats

# Help and version
prompt-lib --help
prompt-lib --version
```

## Prompt Format

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

### Metadata Fields

| Field | Description |
|-------|-------------|
| `title` | Human-readable name |
| `category` | One of the 7 categories |
| `tags` | Searchable keywords |
| `difficulty` | `beginner`, `intermediate`, or `advanced` |
| `models` | Which LLMs this technique works best with |

## Programmatic Usage

```javascript
import { loadPrompts } from '@dishine/prompt-library';
import { searchPrompts } from '@dishine/prompt-library/src/search.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'code review');

console.log(results[0].title);   // "Code Review Prompt"
console.log(results[0].content); // Full prompt content
```

## Project Structure

```
ai-prompt-library/
  bin/prompt-lib.js        CLI entry point
  src/
    index.js               Prompt loader with YAML frontmatter parser
    search.js              Scored search (title/tag/category/content)
    formatter.js           ANSI terminal formatting
  prompts/
    frameworks/            Core prompting techniques
    model-specific/        Model-optimized patterns
    system-prompts/        Production system prompts
    marketing/             Marketing templates
    development/           Development templates
    data/                  Data & analytics templates
    business/              Business templates
  test/run.js              Test suite
```

## Adding Your Own Prompts

1. Create a `.md` file in the appropriate `prompts/` subdirectory
2. Add YAML frontmatter with `title`, `category`, `tags`, `difficulty`, `models`
3. Write your prompt content with these sections:
   - **When to Use** -- when this technique applies
   - **The Technique** -- detailed explanation
   - **Template** -- copy-paste ready template with `{{placeholders}}`
   - **Examples** -- real-world usage examples
   - **Tips** -- expert advice
   - **Common Mistakes** -- pitfalls to avoid

## Zero Dependencies

This library has no npm dependencies. It uses only Node.js built-in modules
(`fs`, `path`, `url`). Works with Node.js 18+.

## License

MIT -- [diShine Digital Agency](https://dishine.it)
