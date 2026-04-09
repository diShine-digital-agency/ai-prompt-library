# Tools: Linter, Optimizer, Recommender

> Deep-dive into the three quality tools — how they work, their scoring systems, and how to get the most from them.

---

## Table of Contents

- [Prompt Linter](#prompt-linter)
- [Prompt Optimizer](#prompt-optimizer)
- [Smart Recommender](#smart-recommender)

---

## Prompt Linter

**CLI:** `prompt-lib lint`
**Workshop:** Tools tab → Linter
**Source:** [`src/linter.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/linter.js)

The Prompt Linter analyzes any prompt against **14 quality rules** and produces a score from 0 to 100, a letter grade (A–F), and prioritized suggestions for improvement.

### All 14 Rules

| # | Rule ID | Rule Name | Weight | What It Checks |
|---|---------|-----------|:------:|----------------|
| 1 | `has-role` | Role definition | 10 | Prompt specifies who the AI should be (`you are`, `act as`, `role:`, `persona:`) |
| 2 | `has-task` | Clear task | 12 | Prompt states what the AI should do (`task:`, `your job`, `please create/write/generate`) |
| 3 | `has-context` | Context provided | 8 | Background information is included (`context:`, `background:`, `given that`) |
| 4 | `has-output-format` | Output format specified | 10 | Expected output format is defined (`output format:`, `respond in`, `use markdown/json`) |
| 5 | `has-constraints` | Constraints or rules | 8 | Rules and boundaries are set (`rule`, `never`, `always`, `do not`, `must not`) |
| 6 | `sufficient-length` | Sufficient detail | 8 | Prompt is at least 50 words long |
| 7 | `not-too-long` | Not excessively long | 5 | Prompt is under 2000 words |
| 8 | `has-examples` | Examples included | 7 | Examples of expected output are provided (`example:`, `for example`, `such as`) |
| 9 | `has-sections` | Structured sections | 7 | Prompt has 2+ headers or labeled sections (`## Header` or `LABEL:`) |
| 10 | `no-vague-language` | Specific language | 7 | Uses 3 or fewer vague words (`good`, `nice`, `proper`, `appropriate`) |
| 11 | `has-audience` | Target audience | 5 | Specifies who will read the output (`audience:`, `for a beginner/expert/developer`) |
| 12 | `has-tone` | Tone specified | 5 | Defines communication style (`tone:`, `be professional/casual/technical`) |
| 13 | `no-please-overuse` | Not overly polite | 3 | Uses "please" 2 times or fewer |
| 14 | `has-quality-check` | Quality verification step | 5 | Asks AI to verify its work (`verify`, `check your`, `double-check`, `ensure accuracy`) |

### Scoring Formula

```
score = (sum of passed rule weights / total weight) × 100
```

**Total weight:** 100 (sum of all 14 rule weights: 10+12+8+10+8+8+5+7+7+7+5+5+3+5)

### Grading Scale

| Grade | Score Range | Meaning |
|:-----:|:----------:|---------|
| **A** | 90–100 | Excellent — production-ready prompt |
| **B** | 75–89 | Good — minor improvements possible |
| **C** | 60–74 | Acceptable — several areas to improve |
| **D** | 40–59 | Below average — significant issues |
| **F** | 0–39 | Poor — needs major rework |

### Example: Linting a Bad Prompt

**Input prompt:**
```
Can you please help me write something good about dogs? Please make it nice
and interesting. Please include some good information.
```

**Lint result:**
```
Score: 15/100 (Grade: F)
Rules: 2/14 passed | 23 words

✅ Passing:
   • Not excessively long
   • Specific language

💡 Suggestions to improve:
   → State the task explicitly: "Your task is to…"
   → Add a role definition like "You are a senior [role] expert…"
   → Specify the output format: "Respond in [format]"
   → Add context: "Context: …" or "Given the following information: …"
   → Add constraints: "Rules: …" or "Never do X" / "Always do Y"
   → Your prompt is quite short. Add more detail about what you want.
   → Add examples of expected input/output to guide the AI.
   → Organize your prompt with clear sections using headers or labels.
   → Specify the target audience: "This is for [audience]…"
   → Define the tone: "Use a [professional/casual/technical] tone."
   → Reduce "please" usage — direct instructions work better with AI.
   → Add a quality check: "Before responding, verify that…"
```

### Tips for Higher Scores

- Add a role definition (10 points): `"You are a senior content writer"`
- State the task clearly (12 points): `"Your task is to write a 500-word blog post"`
- Specify output format (10 points): `"Respond in markdown with headings"`
- Add constraints (8 points): `"Never make up statistics"`
- Add context (8 points): `"Context: This is for a pet adoption website"`
- Write at least 50 words (8 points)
- Include examples (7 points)
- Use section headers (7 points)

### Prompt-Type Awareness (v2.4.0)

The linter auto-detects prompt types and adjusts rule weights:

| Type | Detection | Key weight changes |
|------|-----------|-------------------|
| 🎨 Image | Keywords: image, photo, visual, dall-e, midjourney... | Skips audience, tone, quality-check. Boosts vague-language (×1.5) |
| 💻 Code | Keywords: code, function, class, api, debug... | Boosts task, context, output-format, constraints (×1.2) |
| 🤖 System | Keywords: you are, act as, persona... + length < 800 | Boosts role (×1.5), constraints (×1.5). Relaxes length (×0.5) |
| 📝 General | Fallback | All weights at ×1.0 |

> For the complete weight multiplier table, see [INFRASTRUCTURE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/INFRASTRUCTURE.md#3-prompt-type-detection).

---

## Prompt Optimizer

**CLI:** `prompt-lib optimize`
**Workshop:** Tools tab → Optimizer
**Source:** [`src/optimizer.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/optimizer.js)

The Prompt Optimizer rewrites prompts using content-aware analysis. It detects the domain, audience, and intent, then applies targeted improvements specific to the prompt's actual content.

### Two Modes

| Mode | How It Works | Requirements | Speed |
|------|-------------|-------------|:-----:|
| **Instant (offline)** | Rule-based optimization using the built-in pipeline | None | Instant |
| **AI-powered** | Sends prompt to GPT/Claude/Gemini for professional rewriting | API key | 2–10s |

### Instant Optimization Pipeline

The optimizer processes your prompt through these steps in order:

```
Input prompt
    │
    ├── 1. Domain detection (7 domains)
    ├── 2. Filler removal (redundant phrases)
    ├── 3. Politeness reduction (excessive "please")
    ├── 4. Weak verb strengthening (hedging → direct)
    ├── 5. Vague language replacement (specific terms)
    ├── 6. Compound task decomposition (multi-task → steps)
    ├── 7. Domain-specific role injection
    ├── 8. Audience detection and tone setting
    ├── 9. Constraints addition (domain-specific)
    ├── 10. Output format specification
    ├── 11. Examples placeholder
    └── 12. Quality verification step
    │
    ▼
Optimized prompt + before/after scores + change log
```

### Domain Detection

The optimizer scans for keywords to identify one of 7 domains:

| Domain | Example Keywords | Auto-Assigned Role |
|--------|-----------------|-------------------|
| **Coding** | code, programming, api, debug, refactor, javascript, python | Senior software engineer with deep expertise in software architecture |
| **Writing** | write, blog, article, essay, email, content, draft | Experienced content strategist and professional writer |
| **Marketing** | marketing, seo, social media, campaign, conversion, funnel | Senior marketing strategist with expertise in digital marketing |
| **Data** | data, analysis, sql, dashboard, statistics, ml, pipeline | Senior data analyst with expertise in statistical analysis |
| **Business** | business, proposal, strategy, stakeholder, budget, revenue | Experienced business consultant with expertise in strategic planning |
| **Education** | teach, explain, student, course, lesson, simplify | Experienced educator skilled at breaking down complex concepts |
| **Image** | image, photo, visual, design, logo, midjourney, dall-e | Expert visual artist and AI image prompt engineer |

Each domain provides:
- A specific expert role (instead of generic "helpful assistant")
- Domain-relevant constraints
- Appropriate output format
- Domain-specific quality checks
- Example placeholders

### Filler Words Removed

The optimizer strips these filler phrases:
- `basically`, `essentially`, `actually`, `literally`, `honestly`
- `obviously`, `clearly`, `simply put`, `in other words`
- `as you know`, `it goes without saying`, `needless to say`
- `I think`, `I believe`, `I feel like`, `in my opinion`

### Weak Verbs Strengthened

These hedging patterns are removed or replaced with direct instructions:

| Before | After |
|--------|-------|
| "Can you write..." | "Write..." |
| "Could you create..." | "Create..." |
| "I want you to..." | (removed, direct instruction follows) |
| "I need you to..." | (removed) |
| "Try to..." | (removed) |
| "Maybe..." | (removed) |
| "If possible..." | (removed) |
| "Just..." | (removed) |
| "Kind of..." | (removed) |
| "Sort of..." | (removed) |

### Vague Language Replacements

| Vague | Replaced With |
|-------|--------------|
| "a good way" | "an effective, well-reasoned way" |
| "make it good" | "ensure it is clear, thorough, and well-structured" |
| "something nice" | "a polished, professional result" |
| "properly" | "correctly and following established standards" |
| "appropriate" | "suitable for the stated context and audience" |
| "interesting" | "insightful and thought-provoking" |
| "as much as possible" | "comprehensively, covering all key aspects" |
| "etc." | "and related items" |
| "stuff" | "components" |
| "things" | "elements" |

### Example: Before and After

**Before (Score: 35/100, Grade: F):**
```
Can you please help me write a good blog post about machine learning?
Please make it interesting and cover the basics. I want you to maybe
include some good examples if possible. Thanks!
```

**After (Score: 88/100, Grade: B):**
```
You are an experienced content strategist and professional writer with
expertise in clear, engaging communication.

TASK:
Write a blog post about machine learning. Cover the basics. Include
insightful and thought-provoking examples.

TARGET AUDIENCE:
This is for beginners.

TONE:
Be clear, engaging, and well-paced.

OUTPUT FORMAT:
Respond in well-structured prose with clear headings, short paragraphs,
and a logical narrative flow. Use markdown formatting.

RULES:
- Use clear, concise language appropriate to the target audience
- Maintain a consistent tone and voice throughout
- Structure content with logical flow and smooth transitions
- Support claims with specific details or examples

Before responding, verify that the writing is clear, free of jargon,
logically structured, and engaging for the target audience.
```

**Changes made:**
- Removed filler words and redundant phrases
- Replaced weak/hedging language with direct instructions
- Replaced vague language with specific terms
- Added domain-specific role (writing)
- Organized prompt into clear labeled sections
- Added writing-specific output format
- Added writing-specific quality constraints
- Added quality verification step

### Diff View (v2.4.0)

After optimization, toggle between:
- **Optimized** — clean optimized prompt
- **Diff view** — line-by-line color-coded comparison (🟢 added, 🔴 removed, unmarked = unchanged)

---

## Smart Recommender

**CLI:** `prompt-lib recommend <query>`
**Workshop:** Tools tab → Recommender
**Source:** [`src/recommender.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/recommender.js)

The Smart Recommender analyzes your natural-language description and suggests the best prompts from the library, including an optimal combination.

### How It Works

```
User description
    │
    ├── 1. Term extraction (split into searchable words)
    ├── 2. Intent detection (map to 8 intent categories)
    ├── 3. Prompt scoring (match terms against all prompts)
    ├── 4. Intent bonus (boost prompts in matching categories)
    └── 5. Combo building (system prompt + framework + template)
    │
    ▼
Top 8 matches + suggested combination
```

### Scoring System

For each prompt in the library, the recommender calculates a relevance score:

| Match Location | Points per Term |
|---------------|:--------------:|
| Title | 20 |
| Tags | 15 |
| Category | 10 |
| Content | 3 |

Prompts in categories that match the detected intent get a bonus.

### 8 Intent Categories

| Intent | Trigger Keywords |
|--------|-----------------|
| **Coding** | code, programming, developer, software, api, debug, refactor, test, git, deploy |
| **Writing** | write, blog, article, copy, content, essay, email, letter, documentation |
| **Marketing** | marketing, seo, social media, campaign, ads, brand, landing page, conversion |
| **Data** | data, analysis, sql, database, dashboard, report, statistics, visualization, etl |
| **Business** | business, proposal, meeting, stakeholder, strategy, okr, pitch, client, project |
| **Image** | image, photo, visual, design, logo, illustration, portrait, scene, art |
| **Research** | research, analyze, investigate, study, compare, evaluate, review |
| **Teaching** | teach, explain, tutor, learn, student, course, education |

### Output Format

The recommender returns:

1. **Top 8 matching prompts** — ranked by relevance score
2. **Suggested combo** — the best combination of:
   - 🧠 **System prompt** — highest-scoring system prompt
   - 🔧 **Framework** — highest-scoring framework
   - 📝 **Template** — highest-scoring domain template
3. **Categorized results** — top 3 system prompts, top 3 frameworks, top 5 templates

### Example

**Query:** "I need to build a REST API with authentication"

**Output:**
```
Suggested combination:

  🧠 System prompt:  Coding Assistant (coding-assistant)
  🔧 Framework:      Chain-of-Thought (chain-of-thought)
  📝 Template:       API Design (api-design)

Top matching prompts:

  API Design
    slug: api-design | category: development | score: 68
  System Design
    slug: system-design | category: development | score: 43
  Coding Assistant
    slug: coding-assistant | category: system-prompts | score: 38
  ...
```

### Tips for Better Recommendations

- **Be descriptive:** "I need to write marketing emails for a SaaS product" > "email help"
- **Include domain keywords:** "data analysis SQL dashboard" triggers the data intent
- **Mention the end goal:** "create a landing page that converts" > "make a web page"
- **Combine contexts:** "code review for Python REST API" triggers both coding and development

---

**Navigation:** [← AI Models Guide](AI-Models-Guide) &nbsp;|&nbsp; [API & Playground →](API-and-Playground)
