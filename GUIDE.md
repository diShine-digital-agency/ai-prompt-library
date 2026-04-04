# Prompt Library -- User Guide

A practical, non-technical guide to getting started with the diShine Prompt Library.

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

This shows all 42 prompts organized by category. Each entry shows the slug
(the name you use to reference it), the title, and the difficulty level.

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

### Step 1: Find the Right Prompt

Use `search` or `list` to find a prompt that matches your task.

### Step 2: Read the Template

Every prompt contains a **Template** section with `{{placeholders}}` that
you fill in with your specific details.

### Step 3: Fill in Placeholders

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

### Step 4: Paste into Your Preferred Model

Copy the filled-in prompt and paste it into Claude, ChatGPT, Gemini, or
whichever model the prompt supports.

### Step 5: Iterate

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
