---
title: GPT Prompting Best Practices
category: model-specific
tags: [openai, gpt-4, gpt-4o, json-mode, structured-outputs, function-calling, vision, batch-api]
difficulty: intermediate
models: [gpt-4, gpt-4o, gpt-4-turbo, gpt-4o-mini]
---

# GPT prompting best practices

OpenAI's GPT models have specific features and conventions that optimize performance. This guide covers JSON mode vs. structured outputs, function calling patterns, system message weighting, reproducibility tricks, and model-specific tuning.

## When to use

- Applications requiring guaranteed JSON schema compliance
- Function calling and tool integration
- Vision tasks (GPT-4o, GPT-4 Turbo)
- Tasks needing reproducible outputs (seed parameter)
- Batch processing pipelines
- Fine-tuned model deployments

## The technique

### JSON mode vs. structured outputs: when to use which

These are two different features that solve different problems.

**JSON mode** -- guarantees valid JSON, but not a specific schema:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": "Extract entities from text. Return JSON with keys: people, organizations, locations. Each is an array of strings."},
        {"role": "user", "content": "Tim Cook announced Apple's new headquarters in Austin."}
    ]
)
# Always valid JSON, but field names and types are best-effort
```

Important: you must mention "JSON" somewhere in your messages when using JSON mode. The API will error if you do not.

**Structured outputs** -- guarantees exact schema compliance:

```python
from pydantic import BaseModel
from typing import Optional

class CustomerAnalysis(BaseModel):
    sentiment: str  # will always be a string
    confidence: float  # will always be a float
    topics: list[str]  # will always be an array of strings
    escalation_needed: bool
    summary: Optional[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Analyze customer support tickets."},
        {"role": "user", "content": "I've been waiting 3 weeks for my refund!"}
    ],
    response_format=CustomerAnalysis,
)
result = response.choices[0].message.parsed
# result.sentiment, result.confidence, etc. -- fully typed
```

**Decision guide:**

| Scenario | Use |
|----------|-----|
| Flexible extraction where schema may vary | JSON mode |
| Production API that downstream code depends on | Structured outputs |
| Nested objects with optional fields | Structured outputs |
| Quick prototyping | JSON mode |
| Schema with enums or constrained values | Structured outputs |

Structured outputs currently support a subset of JSON Schema: `string`, `number`, `integer`, `boolean`, `array`, `object`, `enum`, and `anyOf`. All object properties must be listed in `required` (use optional types with `anyOf` null pattern instead).

### Function calling schema design

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_inventory",
            "description": "Search product inventory by various criteria. Returns matching products with stock levels and pricing. Use when a customer asks about product availability, sizing, or pricing.",
            "strict": True,  # enables structured output for function args
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query, e.g., 'blue running shoes size 10'"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["shoes", "apparel", "accessories", "equipment"],
                        "description": "Product category to filter by"
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price in USD. Omit for no price limit."
                    },
                    "in_stock_only": {
                        "type": "boolean",
                        "description": "If true, only return items currently in stock"
                    }
                },
                "required": ["query", "category", "max_price", "in_stock_only"],
                "additionalProperties": False
            }
        }
    }
]
```

**Design patterns for reliable function calling:**

1. **Use `strict: True`** -- this enables structured outputs for function arguments, guaranteeing the model's arguments match your schema exactly.

2. **Group related parameters** -- if two parameters always appear together, nest them in a sub-object.

3. **Use enums aggressively** -- `"enum": ["asc", "desc"]` prevents the model from inventing sort orders like "ascending" or "alphabetical."

4. **Limit tool count** -- each tool definition consumes context tokens. Beyond 15-20 tools, performance degrades and costs increase. If you have 50+ tools, implement a routing layer that selects a subset per request.

5. **Parallel function calling** -- GPT-4o can call multiple functions in a single turn. To control this, set `parallel_tool_calls: false` if you need sequential execution.

### System message: how GPT weights it differently

In GPT models, the system message has outsized influence compared to user messages. It is the strongest behavioral anchor.

```python
messages = [
    {
        "role": "system",
        "content": """You are a medical information assistant for HealthFirst clinic.

CRITICAL RULES (never override):
- Never diagnose conditions. Say: "I can share general information, but please consult your doctor for a diagnosis."
- Never recommend specific medications or dosages.
- If someone describes emergency symptoms, respond ONLY with: "Please call 911 or go to your nearest emergency room immediately."

BEHAVIORAL GUIDELINES:
- Use plain language, no medical jargon unless the user demonstrates medical knowledge
- Cite general medical consensus, not specific studies
- Always end with "Would you like me to help you find a specialist?"

FORMATTING:
- Use bullet points for symptom lists
- Bold key medical terms on first use"""
    },
    {
        "role": "user",
        "content": "What are the symptoms of appendicitis?"
    }
]
```

Key differences from Claude's system prompt handling:
- GPT gives the system message more behavioral weight than Claude does
- GPT's system message is better at maintaining persistent rules across long conversations
- For GPT, put all rules in the system message; for Claude, you can split between system and user messages more freely

### Logit bias tricks

Logit bias lets you increase or decrease the probability of specific tokens appearing in the output. Useful for controlled generation.

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")

# Boost the token for "Yes" and suppress "No"
yes_token = enc.encode("Yes")[0]
no_token = enc.encode("No")[0]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    logit_bias={
        str(yes_token): 5,    # strongly boost
        str(no_token): -100,  # effectively ban
    }
)
```

**Practical uses:**

| Use case | Approach |
|----------|----------|
| Force language (e.g., only English) | Ban tokens from other scripts |
| Prevent specific words in output | Ban those tokens with -100 |
| Encourage brevity | Boost period/newline tokens slightly |
| Force a classification label | Boost target label tokens |

Values range from -100 (ban) to 100 (force). In practice, -5 to 5 covers most tuning needs. -100 is useful for hard bans.

### Seed + temperature=0 for reproducibility

```python
response = client.chat.completions.create(
    model="gpt-4o",
    seed=42,
    temperature=0,
    messages=[...]
)

# Store the fingerprint to verify determinism
fingerprint = response.system_fingerprint
# If fingerprint matches across calls, output is deterministic
```

This is best-effort, not guaranteed. OpenAI may change model infrastructure, which changes the fingerprint and potentially the output. For production systems that need exact reproducibility, cache outputs keyed by `(input_hash, system_fingerprint)`.

### GPT-4o vs. GPT-4 Turbo: prompting differences

| Dimension | GPT-4o | GPT-4 Turbo |
|-----------|--------|-------------|
| Speed | ~2x faster | Slower but established |
| Cost | Lower per token | Higher |
| Vision | Native, same model | Native, same model |
| Audio | Native input/output | Not available |
| Structured outputs | Full support | Full support |
| Instruction following | Slightly more literal | Slightly more interpretive |
| Creative writing | Good, sometimes terse | Slightly more elaborate |

**Prompting adjustment:** GPT-4o tends toward concise responses. If you need more detail, be explicit: "Provide a comprehensive analysis with at least 3 paragraphs per section." GPT-4 Turbo is more naturally verbose.

### Fine-tuning prompt format (JSONL)

When fine-tuning, your training data format must match your inference format:

```jsonl
{"messages": [{"role": "system", "content": "You classify support tickets."}, {"role": "user", "content": "My payment failed twice"}, {"role": "assistant", "content": "{\"category\": \"billing\", \"priority\": \"high\", \"sentiment\": \"frustrated\"}"}]}
{"messages": [{"role": "system", "content": "You classify support tickets."}, {"role": "user", "content": "How do I change my password?"}, {"role": "assistant", "content": "{\"category\": \"account\", \"priority\": \"low\", \"sentiment\": \"neutral\"}"}]}
```

**Fine-tuning tips:**
- Minimum 10 examples, recommended 50-100 for consistent results
- System message should be identical across all training examples
- The assistant response in training data becomes the model's target output
- Fine-tuned models can be further prompted just like base models
- Use structured outputs with fine-tuned models for the best of both worlds

### Batch API usage patterns

For non-time-sensitive workloads, the Batch API offers 50% cost savings:

```python
import json

# Create a JSONL batch file
requests = []
for i, item in enumerate(data_to_process):
    requests.append({
        "custom_id": f"request-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "Extract company data as JSON."},
                {"role": "user", "content": item["text"]}
            ],
            "response_format": {"type": "json_object"}
        }
    })

# Write and upload
with open("batch_input.jsonl", "w") as f:
    for req in requests:
        f.write(json.dumps(req) + "\n")

batch_file = client.files.create(file=open("batch_input.jsonl", "rb"), purpose="batch")
batch = client.batches.create(input_file_id=batch_file.id, endpoint="/v1/chat/completions", completion_window="24h")
```

Best for: data extraction, content classification, bulk generation, evaluation pipelines. Not suitable for real-time or interactive use.

### Vision prompting specifics

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Compare these two UI designs for accessibility issues."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,{{base64_image_1}}",
                        "detail": "high"  # "low", "auto", or "high"
                    }
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,{{base64_image_2}}",
                        "detail": "high"
                    }
                }
            ]
        }
    ]
)
```

**Image detail levels:**

| Level | Token cost | Use when |
|-------|-----------|----------|
| `low` | Fixed 85 tokens | Quick categorization, presence detection |
| `high` | Up to 765+ tokens per tile | Reading small text, UI analysis, diagrams |
| `auto` | Model decides | Default for most use cases |

**Multi-image tips:**
- Place the instruction text before the images
- Reference images by order: "In the first image..." "Compare the second image to..."
- Maximum ~20 images per request (practical limit, not hard limit)
- For comparison tasks, using `high` detail on both images is worth the token cost

## Template

```
System: You are {{role}}. You communicate in {{style}}.

Absolute rules:
- {{critical_rule_1}}
- {{critical_rule_2}}

When using tools:
- Prefer {{tool}} for {{use_case}}
- Always confirm before {{destructive_action}}

Response format: {{format}}

User: {{task_with_context}}
```

## Tips

1. **System message is king for GPT** -- put all persistent behavioral rules there. It has stronger anchoring than equivalent instructions in user messages.

2. **Structured outputs for production** -- JSON mode is fine for exploration, but production APIs should use structured outputs to guarantee schema compliance.

3. **`strict: true` on function calls** -- this is the single most impactful setting for reliable tool use. It eliminates malformed arguments.

4. **Mind the token budget** -- tool definitions consume tokens from your context window. 20 tools with detailed schemas can consume 3-4K tokens before you send a single message.

5. **Seed for debugging** -- use `seed` during development to get reproducible outputs. This makes it much easier to iterate on prompts.

6. **Batch for cost** -- if your workload can tolerate 24-hour turnaround, the Batch API saves 50%. This is significant at scale.

7. **GPT-4o-mini for routing** -- use GPT-4o-mini as a fast, cheap classifier to decide which requests need GPT-4o and which can be handled by the smaller model.

## Common mistakes

1. **Forgetting "JSON" in JSON mode prompts** -- the API raises an error if you enable `json_object` mode without mentioning JSON in your messages. This is a hard requirement.

2. **Too many tools** -- 20+ tool definitions consume significant context and degrade tool selection accuracy. Implement tool routing instead.

3. **Not handling function call loops** -- GPT may call functions repeatedly without converging. Set a maximum iteration count (5-10) in your application code.

4. **High temperature with structured output** -- temperature above 0.5 with JSON mode can produce syntactically valid but semantically inconsistent results. Keep it low for extraction tasks.

5. **Not validating function arguments** -- even with `strict: true`, validate arguments before executing tool calls. Edge cases exist.

6. **Ignoring system_fingerprint** -- if you rely on reproducibility, check this value. A fingerprint change means your outputs may differ even with the same seed.

7. **Same prompt across GPT-4o and GPT-4 Turbo** -- these models respond differently to the same prompt. If switching models, re-test your prompts.
