# Contributing

Thanks for considering contributing to the Prompt Library. Here's how.

> 🌐 **Before you start — the Prompt Workshop tool now lives exclusively at [prompt.dishine.it](https://prompt.dishine.it/).**
>
> The **CLI, Desktop apps, and `viewer.html`** in this repo are **frozen at v2.4.0 and no longer maintained** — we will generally **not accept feature PRs** targeting those legacy surfaces (only critical security fixes). What we *do* actively accept:
>
> - ✅ **New prompt templates** in [`prompts/`](prompts/) — the Markdown library is the source of truth and is consumed directly by the website. This is the highest-impact contribution.
> - ✅ **Improvements to existing prompts** (fixes, clarifications, better examples).
> - ✅ **Wiki contributions** in [`_wiki-pages/`](_wiki-pages/) — the trilingual wiki is also mirrored on the website.
> - ✅ **Translations** of prompts or wiki pages into other languages.
> - ⚠️ **Code changes to `bin/`, `src/`, `desktop/`, `viewer.html`, `prompt-workshop/`** — accepted only for security fixes or for your own forks.
>
> For feature requests or feedback on the current website, please open an issue tagged `website` rather than a PR against the legacy code.

---

## Adding Prompts

The easiest way to contribute — add a new prompt template:

1. Create a `.md` file in the appropriate `prompts/` subdirectory
2. Add YAML frontmatter:

```yaml
---
title: Your Prompt Title
category: frameworks
tags: [tag1, tag2, tag3]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---
```

3. Structure the content with these sections:
   - **When to Use** — when this technique applies (and when it doesn't)
   - **The Technique** — detailed explanation
   - **Template** — copy-paste ready template with `{{placeholders}}`
   - **Examples** — real-world usage examples
   - **Tips** — expert advice from actual use
   - **Common Mistakes** — pitfalls to avoid

4. Run the tests:

```bash
node test/run.js
```

The CLI picks up new files automatically — no registration step.

### Categories

| Category | What goes here |
|----------|---------------|
| `frameworks` | Core prompting techniques (Chain-of-Thought, Few-Shot, etc.) |
| `model-specific` | Techniques optimized for specific LLMs |
| `system-prompts` | Production-ready system prompts |
| `marketing` | Marketing and content templates |
| `development` | Software engineering templates |
| `data` | Data analysis and engineering templates |
| `business` | Business and professional templates |
| `image-generation` | AI image creation templates |

---

## Code Changes

### Setup

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
```

No `npm install` needed — zero dependencies.

### Testing

```bash
node test/run.js
```

Run this before and after your changes. All tests should pass.

### What to keep in mind

- **Zero dependencies.** Don't add npm packages. Use only Node.js built-ins.
- **viewer.html is self-contained.** All prompt data is embedded as JSON. If you change prompts, rebuild with `node bin/prompt-lib.js` and check that the viewer picks them up.
- **Don't break the CLI.** Test your changes with the actual commands: `prompt-lib list`, `prompt-lib search`, etc.
- **Match the existing style.** Look at nearby code and follow the same patterns.

### Project structure

See [TECHNICAL.md](TECHNICAL.md) for the full architecture and module reference.

---

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `node test/run.js` — all tests must pass
4. Open a pull request with a clear description of what you changed and why

Keep PRs focused — one feature or fix per PR.

---

## Bug Reports

Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your environment (Node.js version, OS, browser)

---

## Feature Requests

Open an issue describing:
- What you want to do
- Why the current tools don't cover it
- How you'd expect it to work

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
