# AI Models Guide

> Comprehensive comparison of AI models covered in the Prompt Library — pricing, capabilities, latency, rate limits, and selection guidance.

**⚠️ Pricing and model availability change frequently.** This guide reflects information as of April 2026. Always verify current rates on each provider's pricing page before making cost projections.

---

## Table of Contents

- [Claude (Anthropic)](#claude-anthropic)
- [GPT (OpenAI)](#gpt-openai)
- [Gemini (Google)](#gemini-google)
- [Llama (Meta)](#llama-meta)
- [Mistral](#mistral)
- [Pricing Comparison Table](#pricing-comparison-table)
- [Benchmark Comparisons by Task](#benchmark-comparisons-by-task)
- [Latency Comparison](#latency-comparison)
- [Rate Limits](#rate-limits)
- [Decision Tree: Which Model to Use](#decision-tree-which-model-to-use)
- [Cost Optimization Strategies](#cost-optimization-strategies)
- [Retired Models](#retired-models)

---

## Claude (Anthropic)

Claude models excel at instruction following, long-context analysis, creative writing, and coding. They respond exceptionally well to structured prompts using XML tags.

### Current Models

| Model | Context | Input Price | Output Price | Best For |
|-------|:-------:|:-----------:|:------------:|----------|
| **Opus 4.6** | 1M tokens | $5.00/M | $25.00/M | Deep reasoning, multi-agent, massive context analysis |
| **Sonnet 4.6** | 200K tokens | $3.00/M | $15.00/M | Balanced workhorse — coding, design, knowledge work |
| **Haiku 4.5** | 200K tokens | $1.00/M | $5.00/M | Fast response, near-frontier quality, high-volume |

### Claude-Specific Techniques

**XML Tags** — Claude treats XML tags as semantic containers. High-value patterns:

```xml
<instructions>Primary task definition</instructions>
<context>Background information</context>
<constraints>Hard rules that override other instructions</constraints>
<examples>Input/output examples</examples>
```

**Extended Thinking** — Available on Opus 4.6, allows the model to "think" through complex problems before responding. Triggers deeper reasoning at the cost of higher latency and tokens.

**Prefill Technique** — Start Claude's response to steer format and tone:

```json
{
  "messages": [
    {"role": "user", "content": "Analyze this data..."},
    {"role": "assistant", "content": "{\"analysis\":"}
  ]
}
```

### Which Claude to Pick

- **Opus 4.6** — When you need the absolute best reasoning, processing documents over 200K tokens, or running multi-agent workflows
- **Sonnet 4.6** — The workhorse — use for 90% of tasks (coding, analysis, writing, tool use)
- **Haiku 4.5** — High-volume classification, routing, quick extractions, or where latency/cost matters most

---

## GPT (OpenAI)

GPT models provide strong general-purpose performance, structured outputs, and function calling.

### Current Models

| Model | Notes |
|-------|-------|
| **GPT-5.4** | Most capable GPT, "Thinking" mode available |
| **GPT-5.4 Pro** | Maximum quality tier, premium pricing |
| **GPT-5.3 Instant** | Default ChatGPT — fast everyday workhorse |
| **GPT-5.3-Codex** | Agentic coding model |
| **GPT-5.2-Codex** | Previous generation coding model |

### GPT-Specific Techniques

**JSON Mode** — Force output to be valid JSON:

```json
{
  "response_format": { "type": "json_object" }
}
```

**Structured Outputs** — Define an exact JSON schema the model must follow:

```json
{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "analysis",
      "schema": {
        "type": "object",
        "properties": {
          "summary": { "type": "string" },
          "score": { "type": "number" }
        },
        "required": ["summary", "score"]
      }
    }
  }
}
```

**Function Calling** — Define tools the model can invoke, enabling agent-like behavior with structured tool use.

---

## Gemini (Google)

Gemini models offer native multimodal capabilities, Google Search grounding, and code execution.

### Current Models

| Model | Notes |
|-------|-------|
| **Gemini 3 Pro** | Frontier reasoning, multimodal, agentic |
| **Gemini 3 Flash** | New default — fast, capable |
| **Gemini 2.5 Pro** | $1.25/$10.00 per M tokens, 1M+ context — **deprecated June 2026** |
| **Gemini 2.5 Flash** | $0.30/$2.50 per M tokens, 1M context — **deprecated June 2026** |

### Gemini-Specific Techniques

**Multimodal Input** — Native support for images, video, and audio in prompts. No need to describe visual content in text.

**Google Search Grounding** — Ground responses in real-time web search results for up-to-date information.

**Code Execution** — The model can execute code as part of its response, useful for data analysis and computation tasks.

---

## Llama (Meta)

Open-weight models you can self-host. No API costs — you pay only for compute.

### Current Models

| Model | Parameters | Context | Notes |
|-------|:----------:|:-------:|-------|
| **Llama 4 Scout** | MoE | 10M tokens | Fits single H100, 10M context window |
| **Llama 4 Maverick** | 400B total (MoE) | Large | Beats GPT-4o on benchmarks, open-weight |
| **Llama 4 Behemoth** | 2T (MoE) | Large | Preview only, teacher model |
| **Llama 3.3** | 70B (dense) | 128K | Best for fine-tuning, mature ecosystem |
| **Llama 3.2** | 1B–3B | Varies | Edge/mobile deployment |

### Key Advantages

- **Open-weight** — download and run on your own infrastructure
- **No API costs** — only compute costs (GPU rental or owned hardware)
- **Fine-tuning** — customize for your specific domain
- **MoE architecture** (Llama 4) — high parameter count with efficient inference
- **Privacy** — data never leaves your infrastructure

### When to Choose Llama

- Data must stay on your infrastructure (regulatory, privacy)
- High-volume inference where API costs would be prohibitive
- Fine-tuning for specialized domains
- Edge/mobile deployment (Llama 3.2)
- Research and experimentation

---

## Mistral

European AI lab offering a range of models from tiny to frontier, with excellent price-to-performance ratios.

### Current Models

| Model | Parameters | Notes |
|-------|:----------:|-------|
| **Mistral Large 3** | MoE 41B/675B | Scores 9.4/10 overall, frontier quality |
| **Mistral Medium 3** | — | $0.40/$2.00 per M — **best value in its class** |
| **Codestral** | — | 86.6% HumanEval, 80+ languages, 256K context |
| **Devstral 2** | — | Agentic coding model |
| **Magistral** | — | Reasoning-focused model |
| **Pixtral** | — | Vision-capable model |
| **Ministral 3** | — | Tiny, fast, edge deployment |

### Key Advantages

- **Best price-to-performance:** Mistral Medium 3 at $0.40/M input offers GPT-4-class quality at 1/5 the cost
- **Multilingual excellence:** Strong across European and global languages
- **MoE architecture:** Efficient inference with high parameter counts
- **Code specialization:** Codestral and Devstral for development workflows
- **EU data sovereignty:** European hosting options

---

## Pricing Comparison Table

Prices per million tokens (April 2026):

| Model | Input | Output | Context | Best For |
|-------|:-----:|:------:|:-------:|----------|
| Claude Opus 4.6 | $5.00 | $25.00 | 1M | Deep reasoning, multi-agent |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 200K | Balanced workhorse |
| Claude Haiku 4.5 | $1.00 | $5.00 | 200K | High-volume, fast |
| GPT-5.4 | varies | varies | Large | Most capable GPT |
| GPT-5.3 Instant | mid | mid | Large | Everyday tasks |
| Gemini 2.5 Pro | $1.25 | $10.00 | 1M+ | Long context (deprecated June 2026) |
| Gemini 2.5 Flash | $0.30 | $2.50 | 1M | Budget (deprecated June 2026) |
| Mistral Medium 3 | $0.40 | $2.00 | Large | Best value |
| Llama 4 Maverick | Free* | Free* | Large | Self-hosted |
| Llama 4 Scout | Free* | Free* | 10M | Extreme context |

*\*Llama models are open-weight — you pay only for compute (GPU hosting/rental).*

**Batch API Discounts:**
- OpenAI Batch API: 50% off (24hr turnaround)
- Anthropic Batches API: 50% off (24hr turnaround)
- Google Batch API: varies by model

---

## Benchmark Comparisons by Task

Practitioner's view of relative performance per task category:

| Task | Tier 1 (Best) | Tier 2 | Tier 3 |
|------|:-------------:|:------:|:------:|
| **Complex reasoning** | Claude Opus 4.6, GPT-5.4 Pro | Gemini 3 Pro, Mistral Large 3 | Llama 4 Maverick, Magistral |
| **Code generation** | Claude Sonnet 4.6, GPT-5.3-Codex | Codestral, Devstral 2 | Gemini 3 Flash, Llama 4 Maverick |
| **Instruction following** | Claude Sonnet/Opus 4.6 | GPT-5.4, Gemini 3 Pro | Mistral Large 3 |
| **Creative writing** | Claude Opus 4.6, GPT-5.4 | Gemini 3 Pro | Mistral Large 3 |
| **Data extraction** | GPT-5.4 (structured outputs) | Claude Sonnet 4.6 | Gemini 3 Flash, Mistral Medium 3 |
| **Long document analysis** | Claude Opus 4.6 (1M), Llama 4 Scout (10M) | Gemini 3 Pro | GPT-5.4 |
| **Multilingual** | Gemini 3 Pro, Mistral Large 3 | GPT-5.4, Claude 4.6 | Llama 4 |
| **Vision (images)** | Gemini 3 Pro, GPT-5.4 | Claude Sonnet 4.6, Pixtral | Llama 4 Maverick |
| **Video understanding** | Gemini 3 Pro (native) | GPT-5.4 | Llama 4 Maverick |
| **Agentic coding** | GPT-5.3-Codex, Devstral 2 | Claude Sonnet 4.6 | Codestral |
| **Classification (volume)** | Gemini 3 Flash, Mistral Medium 3 | Claude Haiku 4.5 | Ministral 3, Llama 3.2 |
| **Chain-of-thought** | GPT-5.4 Thinking, Magistral | Claude Opus 4.6 (extended thinking) | Gemini 3 Pro |
| **Safety/refusal** | Claude (most careful) | GPT-5.4 | Gemini, Mistral |

---

## Latency Comparison

Approximate ranges for typical requests (varies by region, load, and prompt length):

| Model Tier | TTFT (median) | Throughput | Examples |
|-----------|:------------:|:----------:|----------|
| **Fast/economy** | ~150–300ms | ~100–150 tok/s | Gemini 3 Flash, Claude Haiku 4.5, Mistral Medium 3, GPT-5.3 Instant |
| **Balanced** | ~300–600ms | ~50–80 tok/s | Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro, Mistral Large 3 |
| **Frontier/reasoning** | ~500–1000ms | ~30–50 tok/s | Claude Opus 4.6, GPT-5.4 Pro, thinking/reasoning modes |
| **Self-hosted (A100/H100)** | ~200–500ms | ~40–100 tok/s | Llama 4 Scout, Llama 3.3 70B |

TTFT = Time To First Token. These are rough medians for guidance, not SLAs.

---

## Rate Limits

| Provider | Free Tier | Paid Tier (Typical) | Enterprise |
|----------|:--------:|:------------------:|:----------:|
| **OpenAI** | 3 RPM, 200 RPD | 500–10K RPM | Custom |
| **Anthropic** | 5 RPM, 300 RPD | 1K–4K RPM | Custom |
| **Google** | 15 RPM, 1500 RPD | 360–1000 RPM | Custom |
| **Mistral** | 1 RPM | 100–500 RPM | Custom |

RPM = requests per minute, RPD = requests per day. Limits vary by model within each provider.

---

## Decision Tree: Which Model to Use

```
START: What is your primary requirement?

[Data must stay on your infrastructure?]
  YES → Llama 3.3 70B (quality) or Llama 3.2 3B (edge/mobile)
  NO → continue

[Processing video or audio natively?]
  YES → Gemini 3 Pro (native video/audio)
  NO → continue

[Documents exceeding 200K tokens?]
  YES → Claude Opus 4.6 (1M) or Llama 4 Scout (10M)
  NO → continue

[Need guaranteed JSON schema compliance?]
  YES → GPT-5.4 with structured outputs
  NO → continue

[Complex reasoning or long-form writing?]
  YES → Claude Sonnet (value) or Opus (maximum quality)
  NO → continue

[High-volume, cost-sensitive (>10K req/day)?]
  YES → How complex?
    Simple → Gemini Flash or Mistral Medium 3
    Moderate → Claude Haiku 4.5
    Complex → Claude Sonnet with batching
  NO → continue

[Code generation or review?]
  YES → Claude Sonnet 4.6, GPT-5.3-Codex, or Codestral
  NO → continue

[Default / general purpose]
  Budget → Mistral Medium 3
  Quality → Claude Sonnet 4.6 or GPT-5.4
  Maximum → Claude Opus 4.6
```

---

## Cost Optimization Strategies

### Pattern 1: Classifier-Based Routing

Use a cheap model to classify request complexity, then route to the appropriate model:

```python
# Classify with a cheap model
classification = cheap_model.classify(
    request, categories=["simple", "moderate", "complex"]
)

model_map = {
    "simple":   "gemini-flash",      # lowest cost
    "moderate": "claude-haiku",      # balanced
    "complex":  "claude-sonnet",     # highest quality
}
model = model_map[classification]
```

### Pattern 2: Cascade (Try Cheap First)

```python
response = cheap_model.generate(prompt)

if not passes_quality_check(response):
    response = expensive_model.generate(prompt)  # escalate
```

### Pattern 3: Task-Type Routing

```python
task_routing = {
    "classification": "gemini-flash",
    "extraction":     "mistral-medium",
    "summarization":  "claude-haiku",
    "reasoning":      "claude-sonnet",
    "code":           "codestral",
}
```

### Expected Savings

A well-implemented router saves **60–80%** compared to sending everything to the most expensive model.

---

## Retired Models

Do not use these in new projects:

| Model | Status |
|-------|--------|
| GPT-4o | Retired |
| GPT-4.1 | Retired |
| GPT-4.1 mini | Retired |
| GPT-4 Turbo | Retired |
| o4-mini | Retired |
| Gemini 2.0 Flash | Retired |
| Claude 3.5 Haiku | Retired |

---

**Navigation:** [← Prompting Techniques](Prompting-Techniques) &nbsp;|&nbsp; [Tools: Linter, Optimizer, Recommender →](Tools-Linter-Optimizer-Recommender)
