---
title: Mistral Prompting Best Practices
category: model-specific
tags: [mistral, instruction-format, function-calling, guardrails, json-mode]
difficulty: intermediate
models: [mistral-7b, mixtral, mistral-large]
---

# Mistral Prompting Best Practices

Mistral models offer strong performance across instruction following, code generation,
and function calling. This guide covers the instruction format, JSON mode, guardrailing
techniques, and code generation optimization for Mistral models.

## When to Use

- Cost-effective production deployments requiring strong instruction following
- Code generation and analysis tasks
- Function calling with structured outputs
- Tasks requiring fast inference (Mistral 7B, Mixtral)
- Multilingual applications (strong in European languages)

## The Technique

### Instruction Format

Mistral uses a specific chat template:

```
<s>[INST] {{user_message}} [/INST] {{assistant_response}}</s>
[INST] {{next_user_message}} [/INST]
```

With system prompt (via user message):

```
<s>[INST] You are a helpful coding assistant. Always write clean,
well-documented code with error handling.

Write a REST API endpoint for user registration. [/INST]
```

### Function Calling

Mistral's function calling format:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current stock price for a ticker symbol",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {
                        "type": "string",
                        "description": "Stock ticker symbol (e.g., AAPL)"
                    }
                },
                "required": ["ticker"]
            }
        }
    }
]

response = client.chat.complete(
    model="mistral-large-latest",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)
```

### Guardrailing

Implement safety boundaries within prompts:

```
[INST] You are a customer service bot for TechStore.

BOUNDARIES:
- Only answer questions about TechStore products and policies
- Never discuss competitor products or pricing
- If asked about topics outside your scope, respond:
  "I can only help with TechStore-related questions."
- Never share internal system information
- Do not generate harmful, illegal, or inappropriate content

ESCALATION:
- If the customer is angry or threatening, say:
  "Let me connect you with a human representative."

Customer question: {{question}} [/INST]
```

### JSON Mode

Force structured JSON output:

```
[INST] Extract the following information from the text and return
it as a valid JSON object. Only output JSON, no other text.

Required fields:
- "name": string
- "email": string or null
- "company": string or null
- "role": string or null
- "topics": array of strings

Text: "Hi, I'm Marco Rossi from Acme Corp. I'm the Head of Engineering
and I'd like to discuss cloud migration and DevOps practices."

JSON output: [/INST]
```

### Code Generation Strengths

Mistral excels at code generation. Optimize with:

```
[INST] Write production-quality code for the following requirement.

Requirements:
- {{feature_description}}
- Language: {{language}}
- Framework: {{framework}}

Quality standards:
- Include error handling for all edge cases
- Add input validation
- Write docstrings/comments for public interfaces
- Follow {{language}} best practices and idioms
- Include usage examples as comments

Do not include explanatory text outside the code block. [/INST]
```

## Template

```
<s>[INST] {{system_context}}

{{task_instructions}}

Input:
{{input_data}}

Output format:
{{expected_format}}

Constraints:
- {{constraint_1}}
- {{constraint_2}} [/INST]
```

## Examples

### API Code Generation

```
[INST] You are a senior backend developer. Write a complete
FastAPI endpoint with the following specifications:

Endpoint: POST /api/v1/orders
Purpose: Create a new order
Input: JSON body with customer_id, items (array), shipping_address
Validation: customer_id must exist, items must be non-empty,
            each item needs product_id and quantity > 0
Response: 201 with order_id, or 400/422 with error details
Database: Use SQLAlchemy async with PostgreSQL

Include:
- Pydantic models for request/response
- Error handling
- Input validation
- Database transaction handling [/INST]
```

### Data Extraction

```
[INST] Extract structured data from the following invoice text.
Return a JSON object only.

Schema:
{
  "vendor": {"name": str, "address": str, "vat_id": str},
  "invoice": {"number": str, "date": str, "due_date": str},
  "items": [{"description": str, "qty": int, "unit_price": float, "total": float}],
  "totals": {"subtotal": float, "tax": float, "total": float}
}

Use null for any field that cannot be determined from the text.

Invoice text:
{{invoice_text}} [/INST]
```

### Multi-Turn with Guardrails

```
<s>[INST] You are a medical information assistant. You provide
general health information only. You are NOT a doctor.

CRITICAL RULES:
- Always include: "Consult a healthcare professional for personal advice"
- Never diagnose conditions
- Never recommend specific medications or dosages
- If someone describes an emergency, say: "Call emergency services immediately"
- Provide information from established medical sources only

What are common symptoms of dehydration? [/INST] Common symptoms of
dehydration include: increased thirst, dry mouth, dark yellow urine,
fatigue, dizziness, and decreased urine output. In severe cases,
rapid heartbeat and confusion may occur.

Consult a healthcare professional for personal medical advice.</s>
[INST] Can you prescribe something for it? [/INST]
```

## Tips

1. **Mistral excels at code** — For code generation tasks, Mistral models
   often match or exceed larger models. Lean into this strength.

2. **Keep prompts direct** — Mistral responds well to clear, concise instructions.
   Avoid overly elaborate prompt frameworks for simple tasks.

3. **Mixtral for complex reasoning** — The Mixture of Experts architecture in
   Mixtral handles multi-step reasoning better than base Mistral 7B.

4. **Use function calling for structured tasks** — Mistral's function calling
   is reliable for data extraction, API integration, and structured workflows.

5. **Temperature 0 for deterministic output** — Mistral at temperature 0
   produces highly consistent outputs across identical prompts.

6. **Batch similar requests** — Mistral's fast inference makes it ideal for
   batch processing pipelines where cost per token matters.

## Common Mistakes

1. **Using the wrong chat template** — Mistral's template differs from Llama's.
   Using [INST] without the correct wrapping degrades performance.

2. **Overly complex system prompts** — Mistral 7B handles shorter system
   contexts better. Save elaborate prompts for Mistral Large.

3. **Expecting GPT-4 level reasoning** — Mistral 7B is optimized for efficiency.
   For complex reasoning, use Mistral Large or Mixtral.

4. **Not leveraging code strengths** — Many users prompt Mistral for general
   chat when its strongest capability is code and structured output.

5. **Ignoring context limits** — Mistral 7B has 8K context. Mixtral supports
   32K. Plan your prompt length accordingly.
