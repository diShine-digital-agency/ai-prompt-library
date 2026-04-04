---
title: GPT Prompting Best Practices
category: model-specific
tags: [openai, gpt-4, json-mode, function-calling, structured-outputs]
difficulty: intermediate
models: [gpt-4, gpt-4o, gpt-4-turbo]
---

# GPT Prompting Best Practices

OpenAI's GPT models have specific features and conventions that optimize
performance. This guide covers JSON mode, function calling, structured outputs,
and model-specific tuning techniques.

## When to Use

- Any task using GPT-4, GPT-4o, or GPT-4 Turbo
- Applications requiring structured JSON output
- Function calling and tool integration
- Vision tasks (GPT-4o, GPT-4 Turbo)
- Tasks needing reproducible outputs (seed parameter)

## The Technique

### JSON Mode

Force GPT to produce valid JSON output:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": "You output JSON only."},
        {"role": "user", "content": "Analyze this text: {{text}}. "
         "Return JSON with keys: sentiment, confidence, topics"}
    ]
)
```

Important: You must mention "JSON" in your prompt when using JSON mode.

### Structured Outputs

For guaranteed schema compliance:

```python
from pydantic import BaseModel

class Analysis(BaseModel):
    sentiment: str
    confidence: float
    topics: list[str]
    summary: str

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[...],
    response_format=Analysis,
)
```

### Function Calling

Define tools the model can invoke:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search the product catalog by query",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search terms"},
                    "category": {"type": "string", "enum": ["electronics", "clothing", "food"]},
                    "max_price": {"type": "number", "description": "Maximum price in USD"}
                },
                "required": ["query"]
            }
        }
    }
]
```

### Seed Parameter for Reproducibility

```python
response = client.chat.completions.create(
    model="gpt-4o",
    seed=42,
    messages=[...],
    temperature=0
)
# Check system_fingerprint to verify determinism
```

### Vision (Multimodal)

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe what you see in this image."},
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/png;base64,{{base64_image}}"}
                }
            ]
        }
    ]
)
```

### Temperature Guidance

| Task Type | Temperature | Reasoning |
|-----------|-------------|-----------|
| Code generation | 0.0 - 0.2 | Deterministic, correct output |
| Data extraction | 0.0 | Consistent structured output |
| Analysis/summary | 0.3 - 0.5 | Some variety, mostly focused |
| Creative writing | 0.7 - 0.9 | More creative, diverse output |
| Brainstorming | 0.9 - 1.2 | Maximum diversity |

## Template

```
System: You are {{role}}. Always respond in {{format}}.

Rules:
- {{rule_1}}
- {{rule_2}}

When using tools:
- Prefer {{preferred_tool}} for {{use_case}}
- Always confirm before {{destructive_action}}

User: {{task}}
```

## Examples

### Data Extraction Pipeline

```python
system = """You are a data extraction specialist. Extract structured
information from unstructured text. Always return valid JSON matching
the requested schema. If a field cannot be determined, use null."""

user = """Extract company information from this text:

"Founded in 2019, TechCorp raised $50M in Series B funding led by
Sequoia Capital. The San Francisco-based startup has 200 employees
and focuses on enterprise AI solutions."

Schema: {name, founded_year, funding_amount, lead_investor, location,
employee_count, focus_area}"""
```

### Multi-Turn Function Calling

```
System: You are a travel assistant with access to flight_search,
hotel_search, and weather_check tools. Help users plan trips by:
1. Understanding their needs (dates, destination, budget)
2. Searching for flights
3. Finding hotels near their destination
4. Checking weather for their travel dates
5. Presenting a complete itinerary

Always search before recommending. Never make up prices or availability.

User: I want to visit Tokyo next month for 5 days, budget around $3000.
```

## Tips

1. **Use system messages for persistent behavior** — The system message in GPT
   is the strongest anchor for behavior. Put rules and role there.

2. **JSON mode requires the word "JSON"** — The API will error if you enable
   JSON mode without mentioning JSON in your messages.

3. **Structured outputs guarantee schema** — Unlike JSON mode, structured outputs
   ensure every field matches your schema. Use for production APIs.

4. **Seed parameter is best-effort** — Same seed + same inputs usually produce
   identical outputs, but OpenAI doesn't guarantee determinism.

5. **Max tokens matters** — Set max_tokens appropriately. Too low truncates
   output mid-response. Too high wastes money on padding.

6. **Vision supports multiple images** — You can pass several images in one
   message for comparison tasks.

## Common Mistakes

1. **Forgetting "JSON" in JSON mode prompts** — The API requires you to mention
   JSON in your prompt. Omitting it raises an error.

2. **Ignoring token limits on function definitions** — Each tool definition
   consumes tokens. 20+ tools significantly reduce available context.

3. **Not handling function call loops** — GPT may call functions repeatedly.
   Set a maximum iteration count in your application code.

4. **Using high temperature for structured output** — Temperature above 0.5
   with JSON mode can produce valid but inconsistent schemas.

5. **Not validating function arguments** — GPT sometimes generates invalid
   parameter values. Always validate before executing tool calls.
