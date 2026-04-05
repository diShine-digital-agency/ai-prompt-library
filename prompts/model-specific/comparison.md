---
title: Model Comparison Guide
category: model-specific
tags: [comparison, selection, pricing, benchmarks, latency, routing, cost-optimization, gpt-5, claude-4, gemini-3, llama-4, mistral-3]
difficulty: beginner
models: [claude-opus-4.6, claude-sonnet-4.6, gpt-5.4, gemini-3-pro, llama-4-maverick, mistral-large-3]
---

# Model comparison guide

Choosing the right model for your task is one of the highest-leverage decisions in prompt engineering. This guide provides pricing, benchmarks, latency comparisons, rate limits, and a decision framework for selecting the best model per scenario.

**Last updated: April 2026.** Model pricing and availability change frequently. Verify current rates on each provider's pricing page before making cost projections.

## When to use

- Starting a new project and evaluating model options
- Migrating between providers
- Optimizing cost-performance trade-offs
- Building multi-model architectures
- Evaluating open vs. closed source trade-offs

## The technique

### Pricing table (April 2026)

Prices per million tokens.

| Model | Input | Output | Context | Notes |
|-------|-------|--------|---------|-------|
| **Claude Opus 4.6** | $5.00 | $25.00 | 1M | deep reasoning, multi-agent, massive context |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | 200K | best balanced workhorse, coding + design |
| **Claude Haiku 4.5** | $1.00 | $5.00 | 200K | fastest Claude, near-frontier quality |
| **GPT-5.4** | varies | varies | large | most capable GPT, "Thinking" mode available |
| **GPT-5.4 Pro** | premium | premium | large | maximum quality tier |
| **GPT-5.3 Instant** | mid | mid | large | default ChatGPT — fast everyday workhorse |
| **GPT-5.3-Codex** | code tier | code tier | large | agentic coding model |
| **Gemini 3 Pro** | premium | premium | large | frontier reasoning, multimodal, agentic |
| **Gemini 3 Flash** | mid | mid | large | new default — fast, capable |
| **Gemini 2.5 Pro** | $1.25 | $10.00 | 1M+ | deprecated June 2026 |
| **Gemini 2.5 Flash** | $0.30 | $2.50 | 1M | deprecated June 2026 |
| **Mistral Large 3** | premium | premium | large | MoE 41B/675B, scores 9.4/10 overall |
| **Mistral Medium 3** | $0.40 | $2.00 | large | GPT-4 class at 1/5 the cost — best value |
| **Codestral** | code tier | code tier | 256K | 86.6% HumanEval, 80+ languages |
| **Llama 4 Maverick** | free (compute) | free (compute) | large | open-weight, beats GPT-4o on benchmarks |
| **Llama 4 Scout** | free (compute) | free (compute) | 10M | 10M context, fits single H100 |
| **Llama 3.3 70B** | free (compute) | free (compute) | 128K | best for fine-tuning, mature ecosystem |

**Retired models (don't use in new projects):**
GPT-4o, GPT-4.1, GPT-4.1 mini, GPT-4 Turbo, o4-mini, Gemini 2.0 Flash, Claude 3.5 Haiku

**Batch API discounts:**
- OpenAI Batch API: 50% off (24hr turnaround)
- Anthropic Batches API: 50% off (24hr turnaround)
- Google Batch API: varies by model

### Benchmark comparisons by task type (April 2026)

Rather than overall benchmarks (which are gamed and misleading), here is a practitioner's view of relative performance per task category:

| Task | Tier 1 (best) | Tier 2 | Tier 3 |
|------|--------------|--------|--------|
| Complex reasoning | Claude Opus 4.6, GPT-5.4 Pro | Gemini 3 Pro, Mistral Large 3 | Llama 4 Maverick, Magistral |
| Code generation | Claude Sonnet 4.6, GPT-5.3-Codex | Codestral, Devstral 2 | Gemini 3 Flash, Llama 4 Maverick |
| Instruction following | Claude Sonnet/Opus 4.6 | GPT-5.4, Gemini 3 Pro | Mistral Large 3 |
| Creative writing | Claude Opus 4.6, GPT-5.4 | Gemini 3 Pro | Mistral Large 3 |
| Data extraction | GPT-5.4 (structured outputs) | Claude Sonnet 4.6 | Gemini 3 Flash, Mistral Medium 3 |
| Long document analysis | Claude Opus 4.6 (1M ctx), Llama 4 Scout (10M ctx) | Gemini 3 Pro | GPT-5.4 |
| Multilingual | Gemini 3 Pro, Mistral Large 3 | GPT-5.4, Claude 4.6 | Llama 4 |
| Vision (images) | Gemini 3 Pro, GPT-5.4 | Claude Sonnet 4.6, Pixtral | Llama 4 Maverick |
| Video understanding | Gemini 3 Pro (native) | GPT-5.4 | Llama 4 Maverick |
| Agentic coding | GPT-5.3-Codex, Devstral 2 | Claude Sonnet 4.6 | Codestral |
| Classification (high volume) | Gemini 3 Flash, Mistral Medium 3 | Claude Haiku 4.5 | Ministral 3, Llama 3.2 |
| Chain-of-thought reasoning | GPT-5.4 Thinking, Magistral | Claude Opus 4.6 (extended thinking) | Gemini 3 Pro |
| Safety/refusal | Claude (most careful) | GPT-5.4 | Gemini, Mistral |

These are directional — the best model for your specific task depends on your prompts, data, and evaluation criteria. Always test with your actual workload.

### Latency comparison

Approximate ranges for typical requests. These vary significantly by region, load, and prompt length:

| Model tier | TTFT (median) | Throughput | Examples |
|-----------|--------------|------------|----------|
| Fast/economy | ~150-300ms | ~100-150 tok/s | Gemini 3 Flash, Claude Haiku 4.5, Mistral Medium 3, GPT-5.3 Instant |
| Balanced | ~300-600ms | ~50-80 tok/s | Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro, Mistral Large 3 |
| Frontier/reasoning | ~500-1000ms | ~30-50 tok/s | Claude Opus 4.6, GPT-5.4 Pro, thinking/reasoning modes |
| Self-hosted (A100/H100) | ~200-500ms | ~40-100 tok/s | Llama 4 Scout, Llama 3.3 70B — depends on hardware |

Latency varies significantly by region, load, and prompt length. These are rough medians for guidance, not SLAs.

### Rate limits comparison

| Provider | Free tier | Paid tier (typical) | Enterprise |
|----------|----------|-------------------|------------|
| OpenAI | 3 RPM, 200 RPD | 500-10K RPM | Custom |
| Anthropic | 5 RPM, 300 RPD | 1K-4K RPM | Custom |
| Google | 15 RPM, 1500 RPD | 360-1000 RPM | Custom |
| Mistral | 1 RPM | 100-500 RPM | Custom |

RPM = requests per minute, RPD = requests per day. These change frequently and vary by model within each provider.

### Decision tree: when to use which model

```
START: What is your primary requirement?

[Data must stay on your infrastructure?]
  YES -> Llama 3.3 70B (best quality) or Llama 3.2 3B (edge/mobile)
  NO -> continue

[Processing video or audio natively?]
  YES -> Gemini 2.5 Pro (native video/audio understanding)
  NO -> continue

[Documents exceeding 200K tokens?]
  YES -> Gemini 2.5 Pro (2M context) or Gemini Flash (1M, cheaper)
  NO -> continue

[Need guaranteed JSON schema compliance?]
  YES -> GPT-4o with structured outputs (strictest guarantee)
  NO -> continue

[Complex reasoning, nuanced instructions, long-form writing?]
  YES -> Claude Sonnet (best value) or Opus (maximum quality)
  NO -> continue

[High-volume, cost-sensitive (>10K requests/day)?]
  YES -> How complex?
    Simple (classification, extraction) -> GPT-4o mini or Gemini Flash
    Moderate (summaries, drafts) -> Mistral Small or Claude Haiku
    Complex (analysis, generation) -> GPT-4o or Claude Sonnet with batching
  NO -> continue

[Code generation or review?]
  YES -> Claude Sonnet, Codestral, or GPT-4o
  NO -> continue

[Default / general purpose]
  Budget-conscious -> GPT-4o mini
  Quality-focused -> Claude Sonnet or GPT-4o
  Maximum quality -> Claude Opus
```

### Cost optimization: multi-model routing

The highest-leverage cost optimization is routing requests to different models based on complexity. A simple router saves 60-80% compared to sending everything to the best model.

**Pattern 1: classifier-based routing**

```python
# Use a cheap model to classify complexity, then route
classification = gpt4o_mini.classify(request, categories=["simple", "moderate", "complex"])

model_map = {
    "simple": "gpt-4o-mini",       # $0.15/M input
    "moderate": "claude-haiku",     # $0.80/M input
    "complex": "claude-sonnet",     # $3.00/M input
}
model = model_map[classification]
```

**Pattern 2: cascade (try cheap first, escalate if needed)**

```python
# Try with cheap model first
response = gpt4o_mini.generate(prompt)

# If response quality is low (confidence < threshold, too short, format wrong)
if not passes_quality_check(response):
    response = claude_sonnet.generate(prompt)  # escalate
```

**Pattern 3: task-type routing**

```python
task_routing = {
    "classification": "gemini-flash",
    "extraction": "gpt-4o-mini",
    "summarization": "mistral-small",
    "code_generation": "codestral",
    "analysis": "claude-sonnet",
    "creative_writing": "claude-sonnet",
    "vision": "gpt-4o",
}
```

**Real-world savings example:**

| Approach | Monthly cost (100K requests) |
|----------|----------------------------|
| All Claude Opus | ~$15,000 |
| All GPT-4o | ~$5,000 |
| Routed (70% mini, 20% Sonnet, 10% Opus) | ~$1,500 |

The router itself (GPT-4o mini classifying requests) costs roughly $15/month for 100K classifications.

## Template

```
Model selection checklist:

1. Data sensitivity: can data leave your infrastructure? [yes/no]
2. Input types: text / images / audio / video?
3. Context size: typical input length in tokens?
4. Task type: {{reasoning / code / creative / extraction / chat}}
5. Volume: requests per day?
6. Latency requirement: real-time (<2s) / near-real-time (<10s) / batch (hours)?
7. Budget: monthly budget for model API costs?
8. Quality bar: must match human expert / good enough / best effort?

Based on answers:
Recommended: {{model}}
Reasoning: {{why}}
Alternative: {{backup_model}} if {{condition}}
Monthly cost estimate: {{estimate}}
```

## Tips

1. **Start with the task, not the model** -- define requirements first, then match to a model. The default should not be "the best model."

2. **Test with your actual data** -- benchmarks are directional at best. Run 50-100 real requests through 2-3 models and compare.

3. **Implement routing early** -- even a simple task-based router saves significant cost. You do not need ML-based routing to start.

4. **Monitor cost per successful output** -- track cost per correct/accepted output, not just cost per token. A cheaper model with lower quality may cost more after retries.

5. **Plan for model updates** -- models change regularly. Build your pipeline to swap models via configuration, not code changes.

6. **Use batch APIs for non-urgent work** -- 50% savings is significant at scale. Data extraction, content generation, and evaluation pipelines rarely need real-time responses.

## Common mistakes

1. **Always using the most expensive model** -- GPT-4o for simple classification wastes money. Match model capability to task complexity.

2. **Ignoring context window limits** -- sending 150K tokens to a 128K model causes silent truncation. Always check limits.

3. **Not considering latency** -- larger models are slower. For real-time chat, smaller models with faster inference provide a better user experience.

4. **Vendor lock-in on model-specific features** -- building your entire system around Claude's XML tags or GPT's structured outputs makes migration painful. Abstract model-specific formatting.

5. **Skipping cost projections** -- the difference between $0.15/M and $3.00/M tokens is 20x. At 10M tokens/month, that is $1,500 vs. $30,000.

6. **Not testing model changes** -- when a provider updates a model, your existing prompts may behave differently. Monitor output quality after model version changes.
