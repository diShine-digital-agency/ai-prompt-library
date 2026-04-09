# Infrastructure — Algorithms, Scoring & Engine Internals

> How the diShine Prompt Library v2.4.0 works under the hood — explained both technically and in plain language.

This document covers every scoring algorithm, matching engine, and transformation pipeline in the system. For **how to use** these tools, see [FUNCTIONS.md](FUNCTIONS.md). For **architecture and code structure**, see [TECHNICAL.md](TECHNICAL.md).

---

## Table of Contents

1. [Search Engine](#1-search-engine)
2. [Prompt Linter (Quality Scorer)](#2-prompt-linter-quality-scorer)
3. [Prompt-Type Detection](#3-prompt-type-detection)
4. [Prompt Optimizer](#4-prompt-optimizer)
5. [Smart Recommender](#5-smart-recommender)
6. [Multi-Model Compare Engine](#6-multi-model-compare-engine)
7. [Diff Engine](#7-diff-engine)
8. [Storage & Persistence](#8-storage--persistence)
9. [API Communication Layer](#9-api-communication-layer)
10. [Scoring Summary Table](#10-scoring-summary-table)

---

## 1. Search Engine

**Source:** [`src/search.js`](src/search.js)

### Plain language

When you type into the search box, the engine checks every prompt in the library and scores each one based on *where* your search term appears. A match in the title is worth a lot more than a match buried in the body — because if the title matches, it's almost certainly what you want.

### Algorithm

The search engine uses **weighted substring matching** across four fields, with scores stacking for each search term.

```
For each search term T in the query:
    For each prompt P:
        if T appears in P.title      → score += 100
        if T appears in P.tags       → score +=  50
        if T appears in P.category   → score +=  30
        if T appears in P.content    → score +=  10
```

**Properties:**

| Property | Value |
|----------|-------|
| Matching | Case-insensitive substring (`includes()`) |
| Multi-term | Additive — each term is scored independently, totals sum |
| Ranking | Descending by total score; ties preserve original order |
| Filtering | Zero-score prompts are excluded from results |
| Complexity | O(n × m) where n = number of prompts, m = number of search terms |

### Scoring weights rationale

| Field | Weight | Why |
|-------|--------|-----|
| Title | 100 | Highest signal — titles are human-curated summaries |
| Tags | 50 | Tags are explicit categorization metadata |
| Category | 30 | Broad category match (e.g., "marketing") |
| Content | 10 | Body text match — helpful but noisy (long documents match many terms) |

### Example

Query: `"chain of thought"` (3 terms: "chain", "of", "thought")

| Prompt | Title match | Tag match | Category match | Content match | Total |
|--------|:-----------:|:---------:|:--------------:|:------------:|:-----:|
| Chain of Thought | +300 (3×100) | +50 | — | +30 (3×10) | **380** |
| Expert Role | — | — | — | +10 ("of") | **10** |
| Unrelated | — | — | — | — | **0** (excluded) |

---

## 2. Prompt Linter (Quality Scorer)

**Source:** [`src/linter.js`](src/linter.js) (Node.js) and inline in `viewer.html` (browser)

### Plain language

The linter is like a spell-checker for prompt quality. It checks your prompt against 14 rules that represent prompt engineering best practices. Each rule has a weight (how important it is), and the final score is a percentage: *"what fraction of the total importance did you cover?"*

### The 14 rules

| # | Rule ID | What it checks | Weight | Detection method |
|---|---------|----------------|--------|------------------|
| 1 | `has-role` | Defines who the AI should be | 10 | Regex: `/you are\|act as\|role:\|persona:\|as a/i` |
| 2 | `has-task` | States what the AI should do | 12 | Regex: `/task:\|your (job\|goal\|task)\|objective:\|you (will\|should\|must)\|please (help\|create\|write\|generate\|analyze)/i` |
| 3 | `has-context` | Provides background info | 8 | Regex: `/context:\|background:\|situation:\|given (that\|the)\|here is\|the following/i` |
| 4 | `has-output-format` | Specifies expected format | 10 | Regex: `/output( format)?:\|format:\|respond (in\|with\|using)\|use (markdown\|json\|bullet\|table\|list)\|structured as/i` |
| 5 | `has-constraints` | Includes rules/boundaries | 8 | Regex: `/rule\|constraint\|never\|always\|do not\|must not\|important:\|don't\|avoid\|ensure/i` |
| 6 | `sufficient-length` | At least 50 words | 8 | Word count: `text.split(/\s+/).length >= 50` |
| 7 | `not-too-long` | Under 2000 words | 5 | Word count: `text.split(/\s+/).length <= 2000` |
| 8 | `has-examples` | Includes examples | 7 | Regex: `/example:\|for example\|e\.g\.\|such as\|here is an example\|sample:/i` |
| 9 | `has-sections` | Uses headers/structure | 7 | Regex: `≥ 2` matches of `/^(#{1,3} \|[A-Z][A-Z ]+:)/gm` |
| 10 | `no-vague-language` | Avoids vague words | 7 | Regex: `≤ 3` matches of `/\b(good\|nice\|proper\|appropriate\|best\|great\|interesting\|relevant)\b/gi` |
| 11 | `has-audience` | Specifies target reader | 5 | Regex: `/audience:\|target:\|for (a \|an )?(beginner\|expert\|developer\|...)/i` |
| 12 | `has-tone` | Defines communication style | 5 | Regex: `/tone:\|style:\|voice:\|be (professional\|casual\|formal\|...)/i` |
| 13 | `no-please-overuse` | Not overly polite | 3 | Count: `≤ 2` occurrences of `/\bplease\b/gi` |
| 14 | `has-quality-check` | Verification step | 5 | Regex: `/verif\|check your\|review your\|double.check\|ensure (accuracy\|quality)/i` |

### Scoring formula

```
Total weight = sum of all applicable rule weights
Earned weight = sum of weights for rules that pass

Score = round((earned / total) × 100)

Grade:
  A = score ≥ 90
  B = score ≥ 75
  C = score ≥ 60
  D = score ≥ 40
  F = score < 40
```

**Maximum total weight** (general prompt): 10+12+8+10+8+8+5+7+7+7+5+5+3+5 = **100**

So for a general prompt, the score IS the sum of passed rule weights — a nice coincidence of the weighting system.

### Suggestions priority

Failed rules are sorted by weight (descending) so the most impactful improvements appear first. This means "Clear task" (weight 12) always appears before "Not overly polite" (weight 3) in the suggestions list.

---

## 3. Prompt-Type Detection

**Source:** [`src/linter.js`](src/linter.js) → `detectPromptType()`

### Plain language

Before scoring, the linter looks at your prompt to figure out what *kind* of prompt it is. An image generation prompt shouldn't be penalized for missing "target audience", and a system prompt doesn't need to be 50+ words long. The type detection adjusts which rules matter and how much.

### Detection rules

The detector runs 3 regex checks in order and returns the first match:

| Type | Detection pattern | Additional condition |
|------|------------------|---------------------|
| 🎨 **Image** | `/image\|photo\|visual\|illustration\|portrait\|logo\|scene\|art style\|dall-e\|midjourney\|stable diffusion\|generate.*image/i` | — |
| 💻 **Code** | `/code\|function\|class\|module\|api\|debug\|refactor\|programming\|javascript\|python\|typescript\|repository\|commit\|pull request/i` | — |
| 🤖 **System** | `/you are\|act as\|your role\|system prompt\|persona\|assistant\|agent/i` | Text length < 800 characters |
| 📝 **General** | (fallback) | — |

### Weight multipliers

Once the type is detected, each rule's weight is multiplied by a type-specific factor:

| Rule | 📝 General | 🎨 Image | 💻 Code | 🤖 System |
|------|:----------:|:--------:|:-------:|:---------:|
| has-role | 1.0 | 0.5 | 0.8 | **1.5** |
| has-task | 1.0 | 1.0 | **1.2** | **1.2** |
| has-context | 1.0 | 1.0 | **1.2** | 0.8 |
| has-output-format | 1.0 | 0.3 | **1.2** | 0.8 |
| has-constraints | 1.0 | 0.5 | **1.2** | **1.5** |
| sufficient-length | 1.0 | 0.5 | 0.8 | 0.5 |
| not-too-long | 1.0 | 1.0 | 1.0 | 1.0 |
| has-examples | 1.0 | **1.2** | 1.0 | 0.5 |
| has-sections | 1.0 | 0.3 | 1.0 | 0.8 |
| no-vague-language | 1.0 | **1.5** | **1.2** | 1.0 |
| has-audience | 1.0 | **0** ⛔ | 0.5 | 0.5 |
| has-tone | 1.0 | **0** ⛔ | 0.3 | **1.2** |
| no-please-overuse | 1.0 | 1.0 | 1.0 | 1.0 |
| has-quality-check | 1.0 | **0** ⛔ | **1.2** | 0.8 |

- **1.0** = standard weight (no change)
- **0** = rule is skipped entirely (doesn't count toward total or score)
- **> 1.0** = rule is more important for this type
- **< 1.0** = rule is less important for this type

### Adjusted total weights by type

| Type | Rules evaluated | Max total weight |
|------|:--------------:|:----------------:|
| 📝 General | 14 | 100 |
| 🎨 Image | 11 (3 skipped) | 64 |
| 💻 Code | 14 | 103 |
| 🤖 System | 14 | 99 |

---

## 4. Prompt Optimizer

**Source:** [`src/optimizer.js`](src/optimizer.js)

### Plain language

The optimizer is a multi-stage pipeline that rewrites your prompt to be clearer and more effective. It doesn't use AI (in the instant/rule-based mode) — instead, it runs a series of text transformations: detecting what your prompt is about, replacing vague words, removing filler phrases, and adding missing structure.

There's also an AI-powered mode that sends your prompt to an LLM for deeper rewriting, but the instant mode works offline and costs nothing.

### Pipeline stages (in order)

```
Input prompt
    │
    ▼
┌─────────────────────┐
│  1. Domain detection │  ← scans for keywords, picks 1 of 7 domains
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  2. Vague language   │  ← 14 regex replacements (good → high-quality, etc.)
│     replacement      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  3. Weak verb        │  ← removes "can you", "try to", "just", etc.
│     strengthening    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  4. Filler removal   │  ← removes "basically", "it's worth noting", etc.
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  5. Role injection   │  ← adds "You are a [domain-specific role]" if missing
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  6. Constraint       │  ← adds domain-specific rules section if missing
│     injection        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  7. Output format    │  ← adds "Output format:" section if missing
│     injection        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  8. Quality check    │  ← adds "Before responding, verify..." if missing
│     injection        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  9. Score comparison │  ← lints before & after, calculates improvement
└──────────┬──────────┘
           ▼
Output: { optimized, original, changes[], scoreBefore, scoreAfter }
```

### Domain detection algorithm

The optimizer recognizes **7 domains** using keyword regex matching:

| Domain | Example keywords | Domain-specific additions |
|--------|------------------|--------------------------|
| Coding | code, programming, api, debug, python | Senior software engineer role; clean code constraints |
| Writing | write, blog, article, copy, essay | Content strategist role; audience-aware constraints |
| Marketing | marketing, SEO, campaign, conversion | Marketing strategist role; data-driven constraints |
| Data | data, analysis, SQL, dashboard, ML | Data analyst role; statistical rigor constraints |
| Business | business, proposal, strategy, budget | Business consultant role; ROI-focused constraints |
| Education | teach, explain, tutor, student, learn | Educator role; scaffolded explanation constraints |
| Image | image, photo, visual, design, art | Visual artist role; composition/lighting constraints |

**Detection method:** For each domain, count how many keyword matches the prompt contains. The domain with the most matches wins. Ties go to the first match. If no keywords match, the domain is "general" and only generic improvements are applied.

### Vague language replacement (14 patterns)

| Pattern | Replacement |
|---------|-------------|
| `a good way/approach/method` | `an effective, well-reasoned [X]` |
| `make it good` | `ensure it is clear, thorough, and well-structured` |
| `something good/nice` | `a well-crafted, effective/polished result` |
| `good [noun]` | `high-quality [noun]` |
| `nice [noun]` | `well-crafted, polished [noun]` |
| `properly` | `correctly and following established standards` |
| `appropriate` | `suitable for the stated context and audience` |
| `interesting` | `insightful and thought-provoking` |
| `as much as possible` | `comprehensively, covering all key aspects` |
| `etc.` | `and related items` |
| `stuff` | `components` |
| `things` | `elements` |

### Weak verb removal (10 patterns)

Hedging phrases are stripped entirely: `can you`, `could you`, `I want you to`, `I need you to`, `try to`, `maybe`, `if possible`, `kind of`, `sort of`, `just`.

After removal, sentence-initial letters are re-capitalized.

### Diff view (viewer only)

The optimizer's diff view uses line-level comparison:

```
For each line index i from 0 to max(original.lines, optimized.lines):
    if line only in optimized → show as green (added)
    if line only in original  → show as red strikethrough (removed)
    if lines differ           → show old as red, new as green
    if lines are identical    → show unmarked
```

---

## 5. Smart Recommender

**Source:** [`src/recommender.js`](src/recommender.js)

### Plain language

You describe what you need in plain English (e.g., "I need to write marketing copy for a SaaS landing page"), and the recommender scores every prompt in the library by how relevant it is to your description. It then suggests a **combo**: the best system prompt + the best framework + the best task template.

### Algorithm

The recommender uses a two-layer scoring system:

#### Layer 1: Intent detection

The user's description is scanned against 8 **intent categories**, each with 8–10 keywords:

| Intent | Keywords |
|--------|----------|
| coding | code, programming, developer, software, api, debug, refactor, test, git, deploy |
| writing | write, blog, article, copy, content, essay, email, letter, documentation |
| marketing | marketing, seo, social media, campaign, ads, brand, landing page, conversion, audience |
| data | data, analysis, sql, database, dashboard, report, statistics, visualization, etl, pipeline |
| business | business, proposal, meeting, stakeholder, strategy, okr, pitch, client, project |
| image | image, photo, visual, design, logo, illustration, portrait, scene, art |
| research | research, analyze, investigate, study, compare, evaluate, review |
| teaching | teach, explain, tutor, learn, student, course, education |

Each keyword match adds **+10** to that intent's score. Multiple intents can be active simultaneously.

#### Layer 2: Prompt scoring

For each prompt in the library:

```
score = 0

For each term in user's description (words > 1 char):
    if term in prompt.title    → score += 20
    if term in prompt.tags     → score += 15
    if term in prompt.category → score += 10
    if term in prompt.content  → score +=  3

If prompt.category maps to an active intent:
    score += that intent's score (from Layer 1)

If prompt is a system-prompt or framework AND score > 0:
    score += 5  (combo bonus)
```

#### Layer 3: Combo building

After scoring, the recommender builds a suggested combination:

```
suggestedCombo = {
    systemPrompt: highest-scoring prompt in category "system-prompts",
    framework:    highest-scoring prompt in category "frameworks",
    template:     highest-scoring prompt in any other category,
}
```

Returns the top 8 prompts overall, plus the top 3 system prompts, top 3 frameworks, and top 5 templates.

### Scoring weights comparison: Search vs Recommender

| Field | Search weight | Recommender weight |
|-------|:------------:|:-----------------:|
| Title | 100 | 20 |
| Tags | 50 | 15 |
| Category | 30 | 10 |
| Content | 10 | 3 |
| Intent bonus | — | 10–80+ |
| Combo bonus | — | 5 |

The recommender weights are more balanced than search because intent matching adds significant scoring power — a prompt doesn't need to contain the exact words from your description if it belongs to the right category.

---

## 6. Multi-Model Compare Engine

**Source:** `viewer.html` → `showPlayground()` → Compare button

### Plain language

When you click "⚖ Compare", the same prompt is sent to all your configured AI providers (OpenAI, Anthropic, Google) at the same time. Results appear side-by-side in a grid so you can see how each model handles your prompt. Each card shows the response, how long it took, token usage, and a copy button.

### How it works

```
1. Collect all configured providers (getConfiguredProviders())
   → Only providers with an API key are included
   → Each has: { provider, key, model, label }

2. Create a visual grid (CSS grid, max 3 columns)

3. Fire all requests in parallel using Promise.allSettled()
   → Each request calls sendToAI() with the same prompt + system prompt
   → Each request has a 30-second timeout (AbortController)
   → Individual failures don't block other results

4. As each response arrives, update its card:
   → Response text
   → Elapsed time (ms precision, displayed as seconds)
   → Token usage (input/output, if provider reports it)
   → Copy button

5. After all settle, show a summary bar with total time
```

**Key design choices:**
- `Promise.allSettled()` (not `Promise.all()`) — one provider failing doesn't hide the others
- Each response card updates independently as it arrives
- The "Send" button is also disabled during comparison to prevent double-sends
- Requires 2+ providers configured; shows a hint if only 1 is available

---

## 7. Diff Engine

**Source:** `viewer.html` → `renderOptimizeResults()` → `showDiff()`

### Plain language

After optimizing a prompt, you can toggle to "Diff view" to see exactly what changed. Lines that were removed show in red with a strikethrough, lines that were added show in green, and unchanged lines appear normally.

### Algorithm

Simple **line-level diff** (not word-level or character-level):

```
originalLines = original.split('\n')
optimizedLines = optimized.split('\n')
maxLen = max(originalLines.length, optimizedLines.length)

For i = 0 to maxLen - 1:
    oLine = originalLines[i] or ''
    nLine = optimizedLines[i] or ''

    if i >= originalLines.length:
        render nLine as ADDED (green, + prefix)
    else if i >= optimizedLines.length:
        render oLine as REMOVED (red, strikethrough, - prefix)
    else if oLine ≠ nLine:
        if oLine is not blank: render as REMOVED
        if nLine is not blank: render as ADDED
    else:
        render as UNCHANGED (no marker)
```

This is intentionally simple — a full Myers diff algorithm would be overkill for prompt-length texts, and line-level comparison is easier to read for prompt editing.

---

## 8. Storage & Persistence

### Plain language

Everything is saved in your browser's `localStorage` — no server, no database, no account needed. Each feature has its own storage key so they don't interfere with each other.

### localStorage keys

| Key | Contents | Format |
|-----|----------|--------|
| `pl_saved` | Saved prompts (favorites, filled, composed, custom) | JSON array of saved objects |
| `pl_custom_prompts` | User-created prompt definitions | JSON array of prompt objects |
| `pl_dark` | Dark mode preference | `"true"` or `"false"` |
| `pl_help` | Help banners visibility | `"true"` or `"false"` |
| `api_settings` | API keys and model preferences | JSON object |
| `pl_sidebar_width` | Custom sidebar width | Number (pixels) |
| `pg_prefill` | Temporary prefill for playground | String (cleared after use) |

### Storage wrapper

All access goes through a `storage` object that wraps `localStorage` with:
- **JSON serialization** — `storage.get()` parses, `storage.set()` stringifies
- **Key prefixing** — all keys use the `pl_` prefix (except `api_settings`)
- **Default values** — `storage.get(key, defaultValue)` returns the default if the key doesn't exist or parsing fails
- **Error handling** — catches `QuotaExceededError` and JSON parse errors silently

---

## 9. API Communication Layer

**Source:** `viewer.html` → `sendToAI()`, [`src/optimizer.js`](src/optimizer.js) → `sendToAI()` and `optimizeWithAI()`

### Plain language

When you send a prompt to an AI model (whether in the Playground, via Multi-Model Compare, or through AI-powered optimization), the request goes directly from your browser to the provider's API. There is no intermediary server — your API keys and prompts never touch our infrastructure.

### Request flow

```
Browser/Node.js
    │
    ├── OpenAI   → POST https://api.openai.com/v1/chat/completions
    ├── Anthropic → POST https://api.anthropic.com/v1/messages
    └── Google    → POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
```

### Timeout & error handling

- **30-second timeout** on all API calls via `AbortController`
- On timeout: `"Request timed out after 30 seconds. Please try again."`
- On API error: provider-specific error messages are extracted and displayed
- On network error: the raw error message is shown

### Provider-specific details

| Provider | Auth | Default model | System prompt | Token reporting |
|----------|------|---------------|---------------|-----------------|
| OpenAI | `Authorization: Bearer {key}` | gpt-4o-mini | Separate `system` message | ✅ prompt_tokens + completion_tokens |
| Anthropic | `x-api-key: {key}` | claude-sonnet-4-20250514 | `system` parameter | ✅ input_tokens + output_tokens |
| Google | `?key={key}` (URL param) | gemini-2.0-flash | Prepended to prompt text | ❌ Not reported |

---

## 10. Scoring Summary Table

Quick reference for all scoring/ranking systems in the library:

| System | Score range | Input | Algorithm | Used in |
|--------|:----------:|-------|-----------|---------|
| Search | 0 – ∞ | Query string | Weighted substring matching | Browse tab sidebar |
| Linter | 0 – 100 | Prompt text | Weighted rule pass/fail with type adjustment | Tools tab, Playground lint button |
| Recommender | 0 – ∞ | Use-case description | Intent detection + term matching + category bonus | Tools tab |
| Optimizer | Before/After scores | Prompt text | 9-stage transformation pipeline + linter re-scoring | Tools tab |

---

## See also

- **[README.md](README.md)** — overview, quick start, and CLI usage
- **[GUIDE.md](GUIDE.md)** — step-by-step user guide for non-technical users
- **[FUNCTIONS.md](FUNCTIONS.md)** — detailed reference for every tool (usage-focused)
- **[TECHNICAL.md](TECHNICAL.md)** — architecture, data formats, code structure, and extension guide
- **[CHANGELOG.md](CHANGELOG.md)** — version history
- **[SECURITY.md](SECURITY.md)** — security policy and vulnerability reporting

---

*Built by [diShine Digital Agency](https://dishine.it)*
