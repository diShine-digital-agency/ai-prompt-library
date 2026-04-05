---
title: Structured Data Extraction
category: frameworks
tags: [extraction, json, yaml, csv, schema, parsing, unstructured-data]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Structured data extraction

Extracting structured data from unstructured text is one of the most common and highest-value LLM applications. This guide covers schema enforcement, output formatting patterns, edge case handling, and techniques for reliable extraction at scale.

## When to use

- Converting free-text documents into database-ready records
- Parsing invoices, contracts, emails, or resumes
- Extracting entities and relationships from text
- Normalizing inconsistent data formats
- Building data pipelines from unstructured sources

## The technique

### Schema-first extraction

Always define the schema before the extraction task. The more explicit the schema, the more consistent the output.

```
Extract structured data from the text below.

SCHEMA:
{
  "company": {
    "name": "string — official company name, not abbreviations",
    "industry": "string — one of: technology, healthcare, finance, retail, manufacturing, other",
    "founded_year": "integer or null — four-digit year",
    "headquarters": "string or null — city, country format",
    "employee_count": "integer or null — approximate number"
  },
  "funding": {
    "total_raised": "number or null — in USD millions",
    "last_round": "string or null — one of: seed, series-a, series-b, series-c, series-d+, ipo",
    "last_round_amount": "number or null — in USD millions",
    "lead_investor": "string or null"
  },
  "products": ["string — list of main product/service names"]
}

RULES:
- Use null for any field you cannot confidently determine from the text
- Do not infer or guess values not explicitly stated
- For employee_count, round to nearest meaningful number (don't say 1,247 if text says "about 1,200")
- For funding amounts, convert all currencies to USD using approximate rates

TEXT:
{{input_text}}
```

### Output format patterns

**JSON (most common for APIs):**

```
Extract the data and return as a JSON object matching this schema exactly.
Return ONLY the JSON object, no explanatory text before or after.

{{schema}}

Text: {{input}}
```

**YAML (better for human review):**

```
Extract the data and return as YAML. YAML is easier to read for review.

Expected structure:
contact:
  name: full name
  email: email address or null
  phone: phone number in E.164 format or null
  title: job title or null
company:
  name: company name
  size: small (<50), medium (50-500), or large (500+)

Text: {{input}}
```

**CSV (for batch extraction):**

```
Extract data from each entry and return as CSV with headers.

Headers: name,email,company,title,phone

Rules:
- One row per person
- Use empty string for missing values (not null or N/A)
- Escape commas in values with double quotes
- Phone numbers in E.164 format

Entries:
{{input_entries}}
```

**Markdown table (for reports):**

```
Extract and compare the specifications into a table.

| Spec | Product A | Product B | Product C |
|------|-----------|-----------|-----------|
| Price | | | |
| Weight | | | |
| Battery | | | |

Fill every cell. Use "not specified" for missing data.
```

### Schema enforcement techniques

**For GPT: use structured outputs (strongest guarantee):**

```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class Industry(str, Enum):
    technology = "technology"
    healthcare = "healthcare"
    finance = "finance"
    retail = "retail"
    other = "other"

class CompanyInfo(BaseModel):
    name: str = Field(description="Official company name")
    industry: Industry
    founded_year: Optional[int] = Field(description="Four-digit year or null")
    employee_count: Optional[int] = Field(description="Approximate employee count")
    revenue_millions: Optional[float] = Field(description="Annual revenue in USD millions")

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[...],
    response_format=CompanyInfo
)
```

**For Claude: use prefill + XML structure:**

```python
messages = [
    {"role": "user", "content": f"Extract company info from: {text}"},
    {"role": "assistant", "content": '{"name":"'}  # prefill forces JSON
]
```

**For any model: few-shot with consistent format:**

```
Extract contact information from text.

Example 1:
Text: "Reach Sarah Chen at sarah@acme.co or 415-555-0123"
Result: {"name": "Sarah Chen", "email": "sarah@acme.co", "phone": "+14155550123", "company": null}

Example 2:
Text: "For press inquiries, contact the Acme Corp communications team"
Result: {"name": null, "email": null, "phone": null, "company": "Acme Corp"}

Now extract from:
Text: "{{input}}"
Result:
```

### Handling edge cases and missing data

**The null protocol:**

```
MISSING DATA RULES:
- If a field is not mentioned in the text: use null
- If a field is ambiguous (could be multiple values): use the most likely
  value and add a "confidence" field set to "low"
- If a field is explicitly stated as unknown: use null
- Never use placeholder values like "N/A", "unknown", "not specified"
  — always use null

AMBIGUITY RULES:
- "John" could be first name or full name. If no last name is given,
  set name to "John" and add "name_complete": false
- Dates without year: assume current year if the month has not passed,
  previous year if it has
- Currency without specification: assume USD unless context suggests otherwise
```

**Handling contradictory information:**

```
If the text contains contradictory information:
1. Extract both values
2. Note the contradiction
3. Use the most recent or most authoritative value as primary

Example output:
{
  "revenue": 45000000,
  "revenue_note": "Text states both $45M and $50M. Using $45M from the
   audited financial statement; $50M appeared in the press release."
}
```

**Handling lists of varying length:**

```
Extract all products mentioned. The list may contain 0 to many items.

If no products are mentioned: return empty array []
If products are mentioned but details are unclear: include them with
a "confidence": "low" flag

{
  "products": [
    {"name": "ProductX", "confidence": "high"},
    {"name": "some tool", "confidence": "low"}
  ]
}
```

### Batch extraction pattern

For processing many items with the same schema:

```
You will receive multiple text entries separated by ---ENTRY---.
Extract data from each entry using the same schema.
Return a JSON array with one object per entry.
Maintain the order of entries.

Schema per entry:
{
  "name": "string",
  "email": "string or null",
  "company": "string or null"
}

---ENTRY---
{{entry_1}}
---ENTRY---
{{entry_2}}
---ENTRY---
{{entry_3}}
```

## Template

```
Extract structured data from the provided text.

SCHEMA:
{{json_schema_with_field_descriptions}}

RULES:
- Return valid {{format}} only, no additional text
- Use null for missing values
- {{domain_specific_rule_1}}
- {{domain_specific_rule_2}}

{{#if examples}}
EXAMPLES:
{{examples}}
{{/if}}

TEXT:
{{input_text}}
```

## Tips

1. **Describe each field** -- `"email": "string"` is weaker than `"email": "string — work email address, not personal. Format: user@domain.com"`. Descriptions prevent ambiguity.

2. **Define your null strategy upfront** -- models handle missing data inconsistently unless you specify exactly how. "Use null" is clearer than "handle missing values appropriately."

3. **Use enums for categorical fields** -- `"industry": "one of: tech, finance, healthcare, other"` produces far more consistent output than `"industry": "string"`.

4. **Validate programmatically** -- always validate extracted JSON against your schema in code. Even with structured outputs, edge cases exist.

5. **Batch for throughput** -- extracting 10 items per prompt is faster and cheaper than 10 separate prompts. Just ensure you maintain item order.

6. **Temperature 0 for extraction** -- extraction should be deterministic. Set temperature to 0 for maximum consistency.

## Common mistakes

1. **No null handling rules** -- without explicit null instructions, models variously output "N/A", "unknown", "", "not specified", or omit the field entirely.

2. **Schema in prose instead of structure** -- "extract the name, email, and company" is ambiguous. A JSON schema with types and descriptions is not.

3. **Not testing with messy input** -- your extraction prompt works on clean text. But real-world data has typos, inconsistent formatting, and missing information. Test with ugly data.

4. **Ignoring extraction confidence** -- some extractions are confident, others are guesses. Without a confidence mechanism, all values look equally reliable.

5. **Skipping validation** -- trusting LLM output without schema validation in your code will cause downstream failures when the model occasionally deviates.
