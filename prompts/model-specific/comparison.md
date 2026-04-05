---
title: Model Comparison Guide
category: model-specific
tags: [comparison, selection, pricing, benchmarks, latency, routing, cost-optimization]
difficulty: beginner
models: [claude, gpt-4, gemini, llama, mistral]
---

# Model comparison guide

Choosing the right model for your task is one of the highest-leverage decisions in prompt engineering. This guide provides pricing, benchmarks, latency comparisons, rate limits, and a decision framework for selecting the best model per scenario.

## When to use

- Starting a new project and evaluating model options
- Migrating between providers
- Optimizing cost-performance trade-offs
- Building multi-model architectures
- Evaluating open vs. closed source trade-offs

## The technique

### Pricing table (2025-2026 rates)

Prices per million tokens. These change frequently -- verify current rates before making cost projections.

| Model | Input | Output | Context | Notes |
|-------|-------|--------|---------|-------|
| **Claude 4 Opus** | $15.00 | $75.00 | 200K | Top reasoning, highest cost |
| **Claude 4 Sonnet** | $3.00 | $15.00 | 200K | Best overall value for complex tasks |
| **Claude 3.5 Haiku** | $0.80 | $4.00 | 200K | Fast, good for classification |
| **GPT-4o** | $2.50 | $10.00 | 128K | Strong general purpose |
| **GPT-4o mini** | $0.15 | $0.60 | 128K | Extremely cheap, good quality |
| **GPT-4 Turbo** | $10.00 | $30.00 | 128K | Legacy, still available |
| **Gemini 2.5 Pro** | $1.25-$2.50 | $10.00-$15.00 | 2M | Tiered by prompt length |
| **Gemini 2.0 Flash** | $0.10 | $0.40 | 1M | Very cheap, very fast |
| **Mistral Large** | $2.00 | $6.00 | 128K | Good value for reasoning |
| **Mistral Small** | $0.10 | $0.30 | 32K | Very cost-effective |
| **Codestral** | $0.30 | $0.90 | 32K | Specialized for code |
| **Llama 3.3 70B** | Free (compute) | Free (compute) | 128K | Self-hosted cost: ~$1-2/hr GPU |
| **Llama 3.1 405B** | Free (compute) | Free (compute) | 128K | Self-hosted cost: ~$8-15/hr GPU |

**Batch API discounts:**
- OpenAI Batch API: 50% off (24hr turnaround)
- Anthropic Batches API: 50% off (24hr turnaround)
- Google Batch API: varies

### Benchmark comparisons by task type

Rather than overall benchmarks (which are gamed and misleading), here is a practitioner's view of relative performance per task category:

| Task | Tier 1 (best) | Tier 2 | Tier 3 |
|------|--------------|--------|--------|
| Complex reasoning | Claude Opus, o1 | GPT-4o, Gemini Pro | Mistral Large, Llama 405B |
| Code generation | Claude Sonnet, GPT-4o | Codestral, Gemini Pro | Llama 70B |
| Instruction following | Claude Sonnet/Opus | GPT-4o | Gemini Pro, Mistral Large |
| Creative writing | Claude Opus/Sonnet | GPT-4o | Gemini Pro |
| Data extraction | GPT-4o (structured outputs) | Claude Sonnet | Gemini Flash, Mistral |
| Long document analysis | Gemini Pro (2M ctx) | Claude (200K ctx) | GPT-4o (128K) |
| Multilingual | Gemini Pro, Mistral Large | GPT-4o, Claude | Llama |
| Vision (images) | GPT-4o, Gemini Pro | Claude Sonnet, Pixtral | Llama 3.2 90B |
| Video understanding | Gemini Pro (native) | GPT-4o (frame extraction) | -- |
| Classification (high volume) | GPT-4o mini, Gemini Flash | Claude Haiku, Mistral Small | Llama 8B |
| Safety/refusal | Claude (most careful) | GPT-4o | Gemini, Mistral |

These are directional -- the best model for your specific task depends on your prompts, data, and evaluation criteria. Always test with your actual workload.

### Latency comparison

Approximate time-to-first-token and throughput for a typical request:

| Model | TTFT (median) | Tokens/sec | Notes |
|-------|--------------|------------|-------|
| GPT-4o mini | ~200ms | ~100 | Fastest API model |
| Gemini 2.0 Flash | ~250ms | ~150 | Very fast |
| Claude 3.5 Haiku | ~300ms | ~80 | Good balance |
| Mistral Small | ~200ms | ~90 | Fast |
| GPT-4o | ~400ms | ~60 | Moderate |
| Claude Sonnet | ~500ms | ~70 | Moderate |
| Gemini 2.5 Pro | ~600ms | ~50 | Slower, higher quality |
| Claude Opus | ~800ms | ~40 | Slowest API model |
| Mistral Large | ~500ms | ~50 | Moderate |
| Llama 70B (self-hosted, A100) | ~300ms | ~40-80 | Depends on hardware |

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
